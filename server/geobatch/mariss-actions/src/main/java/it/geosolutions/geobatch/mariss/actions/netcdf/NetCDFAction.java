package it.geosolutions.geobatch.mariss.actions.netcdf;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.geoserver.tools.WorkspaceUtils;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher.ParameterConfigure;
import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.imageio.plugins.netcdf.NetCDFUtilities;

import java.awt.image.WritableRaster;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.RegexFileFilter;
import org.geotools.coverage.io.netcdf.NetCDFFormat;
import org.geotools.data.DataStore;
import org.geotools.gce.imagemosaic.ImageMosaicFormat;
import org.geotools.geometry.GeneralEnvelope;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.jdbc.JDBCDataStore;
import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import com.vividsolutions.jts.geom.Geometry;

import ucar.ma2.Array;
import ucar.ma2.DataType;
import ucar.ma2.Index;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFileWriteable;
import ucar.nc2.Variable;

public abstract class NetCDFAction extends BaseAction<EventObject> {

    private static final String SEPARATOR = "___";

    private static final String PATHSEPARATOR = File.separator;

    protected NetCDFActionConfiguration configuration;

    protected Map<String, Variable> foundVariables = new HashMap<String, Variable>();

    protected Map<String, String> foundVariableLongNames = new HashMap<String, String>();

    protected Map<String, String> foundVariableBriefNames = new HashMap<String, String>();

    protected Map<String, String> foundVariableUoM = new HashMap<String, String>();

    protected JDBCDataStore dataStore;

    protected Date timedim;

    protected SARType type;

    protected GeneralEnvelope env;

    private String sha1;

    public NetCDFAction(NetCDFActionConfiguration actionConfiguration) {
        super(actionConfiguration);
        configuration = actionConfiguration;
    }

    public enum SARType {
        SAR_WIND, SAR_WAVE, SAR_WNF;

        /**
         * Returns the {@link SARType} associated to the input Type
         * 
         * @param typeName
         */
        public static SARType getType(String typeName) {
            // Allowed values
            SARType[] types = values();
            // Cycle through the various Types
            // searching for a matching name
            for (SARType type : types) {
                if (type.name().contains(typeName.toUpperCase())) {
                    return type;
                }
            }
            // Nothing matches, returning null
            return null;
        }
    }

    /**
     * Execute process
     */
    public Queue<EventObject> execute(Queue<EventObject> events) throws ActionException {

        // return object
        final Queue<EventObject> ret = new LinkedList<EventObject>();

        while (events.size() > 0) {
            final EventObject ev;
            try {
                if ((ev = events.remove()) != null) {
                    if (LOGGER.isTraceEnabled()) {
                        LOGGER.trace("Working on incoming event: " + ev.getSource());
                    }
                    if (ev instanceof FileSystemEvent) {
                        FileSystemEvent fileEvent = (FileSystemEvent) ev;
                        if (canProcess(fileEvent)) {
                            // Getting file name
                            File inputFile = fileEvent.getSource();
                            
                            // Unzipping the tar.gz file
                            File netcdfDir = untarFile(inputFile);

                            // Getting the netcdf file
                            File netcdfFile = null;
                            if (netcdfDir != null && netcdfDir.exists() && netcdfDir.canExecute()
                                    && netcdfDir.canRead()) {
                                // Filtering the files
                                IOFileFilter file = FileFilterUtils.fileFileFilter();
                                IOFileFilter netCDF = FileFilterUtils.suffixFileFilter("nc");
                                FileFilter and = FileFilterUtils.and(file, netCDF);
                                File[] files = netcdfDir.listFiles(and);
                                // Getting the first netcdf file if present
                                if (files != null && files.length > 0) {
                                    netcdfFile = files[0];
                                    // Getting Time dimension if present
                                    Pattern pattern = Pattern.compile(configuration.getPattern());
                                    Matcher m = pattern.matcher(inputFile.getAbsolutePath());
                                    if (m.matches()) {
                                        // Getting dates
                                        String date = m.group(1);
                                        String time = m.group(2);
                                        SimpleDateFormat toSdf = new SimpleDateFormat(
                                                "yyyyMMddHHmmss");
                                        toSdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                                        try {
                                            timedim = toSdf.parse(date + time);
                                        } catch (ParseException e) {
                                            LOGGER.error(e.getMessage());
                                        }
                                    }

                                }
                            }
                            if (canProcessFile(netcdfFile)) {
                                // Generate SHA1 of the input file 
                                sha1 = DigestUtils.shaHex(inputFile.getAbsolutePath());

                                // Getting SARType
                                type = SARType.getType(getActionName());
                                // Don't read configuration for the file, just
                                // this.outputfeature configuration
                                DataStore ds = FeatureConfigurationUtil
                                        .createDataStore(configuration.getOutputFeature());
                                if (ds == null) {
                                    throw new ActionException(this, "Can't find datastore ");
                                }
                                try {
                                    if (!(ds instanceof JDBCDataStore)) {
                                        throw new ActionException(this, "Bad Datastore type "
                                                + ds.getClass().getName());
                                    }
                                    dataStore = (JDBCDataStore) ds;
                                    dataStore.setExposePrimaryKeyColumns(true);
                                    // return next events configurations
                                    Collection<EventObject> resultEvents = doProcess(netcdfFile);
                                    ret.addAll(resultEvents);
                                    
                                    // Prepare a Zip file containing the ShipDetection XML files
                                    // Filtering the files
                                    IOFileFilter file = FileFilterUtils.fileFileFilter();
                                    IOFileFilter xml = FileFilterUtils.suffixFileFilter("xml");
                                    IOFileFilter dsFilter = new RegexFileFilter(".*_DS.*");
                                    FileFilter and = FileFilterUtils.and(file, xml, dsFilter);
                                    File[] files = netcdfDir.listFiles(and);
                                    
                                    // Listing XML files
                                    if (files != null && files.length > 0) {
                                        int numFiles = files.length;
                                        // Append a txt file with the UID
                                        File properties = new File(files[0].getParentFile(), "netcdf.properties");
                                        properties.createNewFile();
                                        // Append Useful properties
                                        FileUtils.write(properties, "uid=" + sha1 + "\n");
                                        FileUtils.write(properties, "time=" + new Timestamp(timedim.getTime()) + "\n", true);
                                        FileUtils.write(properties, "originalFileName=" + netcdfFile.getName() + "\n", true);
                                        FileUtils.write(properties, "sartype=" + type + "\n", true);
                                        FileUtils.write(properties, "envelope=" + new ReferencedEnvelope(env) + "\n", true);
                                        File[] filesUpdated = new File[numFiles + 1];
                                        System.arraycopy(files, 0, filesUpdated, 0, numFiles);
                                        filesUpdated[numFiles] = properties;
                                        // Creating new Zip file where the XML files must be zipped
                                        File targetZipFile = new File(netcdfDir,
                                                FilenameUtils.getBaseName(netcdfDir.getName()) + ".zip");
                                        zipFile(files, targetZipFile);
                                        // Append to the event list
                                        ret.add(new FileSystemEvent(targetZipFile, FileSystemEventType.FILE_ADDED));
                                    }
                                } finally {
                                    ds.dispose();
                                }
                            }
                        }
                    }

                    // add the event to the return
                    ret.add(ev);

                } else {
                    if (LOGGER.isErrorEnabled()) {
                        LOGGER.error("Encountered a NULL event: SKIPPING...");
                    }
                    continue;
                }
            } catch (Exception ioe) {
                final String message = "Unable to produce the output: " + ioe.getLocalizedMessage();
                if (LOGGER.isErrorEnabled())
                    LOGGER.error(message, ioe);

                throw new ActionException(this, message);
            }
        }
        return ret;
    }

    protected abstract boolean canProcessFile(File netcdfFile);

    private Collection<EventObject> doProcess(File netcdfFile) throws ActionException {
        // Creation of the Output Event Queue
        List<EventObject> events = new ArrayList<EventObject>();

        // Ingestion of the input NetCDF data
        String inputFileName = netcdfFile.getAbsolutePath();

        LOGGER.info("Working on " + inputFileName);
        // Getting temporary directory
        File tempDir = getTempDir();
        // Generation of the output NetCDF (CF Compliant)
        LOGGER.info("Call writeDownNetCDF");
        File[] createdFiles = null;
        List<String> cfNames = new ArrayList<String>();
        try {
            createdFiles = writeNetCDF(tempDir, inputFileName, cfNames);
        } catch (IOException e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        }

        // After creating the final file, start the ingestion
        if (createdFiles != null && createdFiles.length > 0) {

            // Configuring REST publisher support
            GeoServerRESTPublisher publisher = new GeoServerRESTPublisher(
                    configuration.getGeoserverURL(), configuration.getGeoserverUID(),
                    configuration.getGeoserverPWD());
            GeoServerRESTReader reader;
            try {
                reader = new GeoServerRESTReader(configuration.getGeoserverURL(),
                        configuration.getGeoserverUID(), configuration.getGeoserverPWD());

                if (!reader.existsWorkspace(configuration.getDefaultNamespace())) {
                    WorkspaceUtils.createWorkspace(reader, publisher,
                            configuration.getDefaultNamespace(),
                            configuration.getDefaultNamespaceUri());
                }
            } catch (MalformedURLException e) {
                throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
            } catch (URISyntaxException e) {
                throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
            }

            // If the mosaic is not already configured we must configure it, otherwise we do harvesting
            File[] finalFiles = new File[createdFiles.length];
            String[] layerNames = new String[createdFiles.length];
            // Boolean indicating if the operation has gone
            boolean sent = handleMosaic(reader, publisher, createdFiles, finalFiles, layerNames);

            // Move the original netCDF File in the netcdf directory
            
            // Creating a subdirectory of the NetCDF directory
            File netcdfDir = new File(configuration.getNetcdfDirectory());
            if(!netcdfDir.exists() || !netcdfDir.canWrite()){
                throw new ActionException(NetCDFAction.class, "Unable to find NetCDF directory");
            }
            // Create the subdirectory
            File original = new File(netcdfDir, "original");
            // Creating the directory
            try {
                FileUtils.forceMkdir(original);
            } catch (IOException e) {
                throw new ActionException(NetCDFAction.class, e.getMessage());
            }
            // Move the original file in the "netcdf/original" directory
            File newFile = new File(original, netcdfFile.getName());
            try {
                FileUtils.moveFile(netcdfFile, newFile);
            } catch (IOException e) {
                throw new ActionException(NetCDFAction.class, e.getMessage());
            }
            
            if (sent) {
                if (LOGGER.isInfoEnabled()) {
                    LOGGER.info("Coverage SUCCESSFULLY sent to GeoServer!");
                }
                int index = 0;
                String absolutePath = newFile.getAbsolutePath();
                // Create a Geometry for the NetCDF envelope
                Geometry geo = JTS.toGeometry(new ReferencedEnvelope(env));
                CoordinateReferenceSystem crs = env.getCoordinateReferenceSystem();
                geo.setUserData(crs);
                for (File f : finalFiles) {
                    // ... setting up the appropriate event for the next action
                    events.add(new FileSystemEvent(f, FileSystemEventType.FILE_ADDED));
                    // Update DataStore
                    insertDb(f.getAbsolutePath(), absolutePath, layerNames[index], cfNames.get(index), geo);
                    // Updating array index
                    index++;
                }
            } else {
                final String message = "Coverage was NOT sent to GeoServer due to connection errors!";
                if (LOGGER.isInfoEnabled()) {
                    LOGGER.info(message);
                }
                if (!configuration.isFailIgnored()) {
                    throw new ActionException(NetCDFAction.class, message);
                }
            }
        }
        return events;
    }

    /**
     * Private method for creating the imagemosaic to publish
     * 
     * @param outputFiles
     * @param finalFiles
     * 
     * @return
     * @throws ActionException
     */
    protected boolean handleMosaic(GeoServerRESTReader reader, GeoServerRESTPublisher publisher,
            File[] outputFiles, File[] finalFiles, String[] layerNames) throws ActionException {
        // Initialization of the result
        boolean published = true;
        // File array index
        int index = 0;
        // Loop through the files
        for (File f : outputFiles) {
            try {
                // Getting Variable Name
                String file = FilenameUtils.getBaseName(f.getAbsolutePath());
                String variableName = getActionName() + "_"
                        + file.substring(file.lastIndexOf(SEPARATOR) + SEPARATOR.length());
                // Create the mosaic directory in the temporary geobatch directory
                File temp = getTempDir();
                File mosaicDir = new File(temp, variableName);

                // Check if the mosaic is present
                if (isMosaicConfigured(reader, variableName)) {
                    // After the first file, other mosaic files will be stored inside the netcdf directory
                    mosaicDir = new File(configuration.getNetcdfDirectory(), variableName);
                    if (!mosaicDir.exists()) {
                        FileUtils.forceMkdir(mosaicDir);
                        mosaicDir.createNewFile();
                    }
                    // Create the new NetCDF file
                    File newFile = new File(mosaicDir, f.getName());

                    // Copy the file
                    try {
                        FileUtils.moveFile(f, newFile);
                    } catch (IOException e) {
                        throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                    }
                    // Copy the final file location
                    finalFiles[index] = newFile;
                    // Harvest the Mosaic with a new NetCDF file
                    published &= publisher.harvestExternal(configuration.getDefaultNamespace(),
                            variableName, "netcdf", newFile.getAbsolutePath());
                    // Adding layername
                    layerNames[index] = variableName;
                } else {
                    // Create the new NetCDF file
                    File newFile = new File(mosaicDir, f.getName());

                    // Copy the file
                    try {
                        FileUtils.moveFile(f, newFile);
                    } catch (IOException e) {
                        throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                    }
                    // Copy the final file location
                    String geoserverDataDirectory = configuration.getGeoserverDataDirectory();
                    geoserverDataDirectory = geoserverDataDirectory.endsWith(PATHSEPARATOR) ? geoserverDataDirectory.substring(0, geoserverDataDirectory.length() - 1) : geoserverDataDirectory;
                    finalFiles[index] = new File(geoserverDataDirectory + PATHSEPARATOR + "data"+ PATHSEPARATOR + configuration.getDefaultNamespace() + PATHSEPARATOR +
                            variableName + PATHSEPARATOR + newFile.getName());
                    // Create the Mosaic elements
                    createIndexerFile(mosaicDir, variableName);
                    createDatastoreFile(mosaicDir, variableName);

                    // Zip all the elements
                    File zipped = zipAll(temp, mosaicDir.listFiles(), mosaicDir.getName());

                    // Publish the ImageMosaic
                    published &= publisher.publishImageMosaic(configuration.getDefaultNamespace(),
                            variableName, zipped, ParameterConfigure.FIRST, new NameValuePair(
                                    "coverageName", variableName));
                    // Adding layername
                    layerNames[index] = variableName;
                }
            } catch (Exception e) {
                throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
            }
            index++;
        }
        return published;
    }

    protected abstract String getActionName();

    private File untarFile(File inputFile) throws ActionException {
        // Getting file base name without extension
        String fileName = FilenameUtils.getBaseName(inputFile.getName());
        final File outputFile = new File(getTempDir(), fileName);
        // Getting the stream
        GZIPInputStream in = null;
        FileOutputStream out = null;
        try {
            in = new GZIPInputStream(new FileInputStream(inputFile));
            out = new FileOutputStream(outputFile);
            IOUtils.copy(in, out);
        } catch (IOException e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }
        // Create another temporary Directory for the tar file
        File finalDir = new File(getTempDir(), fileName + "dir");

        // Extracting the tar file
        TarArchiveInputStream tarStream = null;
        try {
            // Create the finale directory
            FileUtils.forceMkdir(finalDir);
            tarStream = new TarArchiveInputStream(new FileInputStream(outputFile));
            // Accessing the entries
            ArchiveEntry entry = tarStream.getNextEntry();

            do {
                int offset = 0;
                byte[] content = new byte[(int) entry.getSize()];
                int byteRead = 0;
                while (offset < content.length && byteRead != -1) {
                    byteRead = tarStream.read(content, offset, content.length - offset);
                    offset += byteRead;
                }

                // Writing Entry to file
                String entryName = entry.getName();

                File f = new File(finalDir, entryName);
                FileUtils.writeByteArrayToFile(f, content);
                entry = tarStream.getNextEntry();
            } while (entry != null);
        } catch (FileNotFoundException e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        } catch (IOException e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        } finally {
            if (tarStream != null) {
                try {
                    tarStream.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }

        return finalDir;
    }

    /**
     * Private method for zipping an array of files
     * 
     * @param temp
     * @param files
     * @param filename
     * @return
     * @throws ActionException
     */
    protected File zipAll(File temp, File[] files, String filename) throws ActionException {
        File zippedFile = new File(temp, filename + ".zip");
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            // Create the new file
            zippedFile.createNewFile();

            // create byte buffer
            byte[] buffer = new byte[1024];
            // Open the stream
            fos = new FileOutputStream(zippedFile);
            zos = new ZipOutputStream(fos);
            // Loop on the array
            for (int i = 0; i < files.length; i++) {
                FileInputStream fis = null;
                try {
                    fis = new FileInputStream(files[i]);
                    // begin writing a new ZIP entry, positions the stream to the start of the entry data
                    zos.putNextEntry(new ZipEntry(files[i].getName()));
                    int length;

                    while ((length = fis.read(buffer)) > 0) {
                        zos.write(buffer, 0, length);
                    }
                    zos.closeEntry();
                } catch (Exception e) {
                    throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                } finally {
                    if (fis != null) {
                        // close the ZipOutputStream
                        try {
                            fis.close();
                        } catch (Exception e) {
                            LOGGER.error(e.getLocalizedMessage());
                        }
                    }
                }
            }
            zos.finish();
        } catch (Exception e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        } finally {
            if (fos != null) {
                // close the ZipOutputStream
                try {
                    fos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (zos != null) {
                // close the ZipOutputStream
                try {
                    zos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }

        return zippedFile;
    }

    protected void createIndexerFile(File mosaicDir, String varName) throws IOException {
        File indexer = new File(mosaicDir, "indexer.properties");
        indexer.createNewFile();
        String properties = "TimeAttribute=time\n"
                + "Schema=*the_geom:Polygon,location:String,time:java.util.Date";
        FileUtils.write(indexer, properties);
    }

    protected void createDatastoreFile(File mosaicDir, String varName) throws IOException {
        File datastore = new File(mosaicDir, "datastore.properties");
        datastore.createNewFile();
        String properties = "user=postgres\n" + "port=5432\n" + "passwd=postgres\n"
                + "host=localhost\n" + "database=" + varName + "\n"
                + "driver=org.postgresql.Driver\n" + "schema=public\n"
                + "Estimated\\ extends=false\n"
                + "SPI=org.geotools.data.postgis.PostgisNGDataStoreFactory";
        FileUtils.write(datastore, properties);
    }

    /**
     * Check if the NetCDF ImageMosaic Layer has been already configured
     * 
     * @return true if the ImageMosaic is configured, false otherwise
     */
    protected boolean isMosaicConfigured(GeoServerRESTReader reader, String storename) {
        String coveragename = storename;// .replace("_", "-");
        return reader.existsCoverage(configuration.getDefaultNamespace(), storename, coveragename);
    }

    protected abstract File[] writeNetCDF(File tempDir, String inputFileName, List<String> cfNames) throws IOException,
            ActionException;

    @Override
    public boolean checkConfiguration() {
        // Checking if the NetCDF directory is defined
        String dir = configuration.getNetcdfDirectory();
        // Initial check
        boolean exists = dir != null && !dir.isEmpty();
        if (exists) {
            File f = new File(dir);
            return f != null && f.exists() && f.canWrite() && f.canRead();
        } else {
            return false;
        }
    }

    /**
     * Check if a file can be processed in this action. To override in actions
     * 
     * @param event
     * @return
     */
    public boolean canProcess(FileSystemEvent event) {
        File file = event.getSource();
        String extension = FilenameUtils.getExtension(file.getName());
        return extension != null && !extension.isEmpty() && (extension.equalsIgnoreCase("tgz"));
    }

    protected double definingOutputVariables(boolean hasDepth, int nLat, int nLon,
            NetcdfFileWriteable ncFileOut, NetcdfFile ncFileIn, boolean hasTimeDim, int nTime,
            String varName) {
        /**
         * createNetCDFCFGeodeticDimensions( NetcdfFileWriteable ncFileOut, final boolean hasTimeDim, final int tDimLength, final boolean hasZetaDim,
         * final int zDimLength, final String zOrder, final boolean hasLatDim, final int latDimLength, final boolean hasLonDim, final int
         * lonDimLength)
         */
        final List<Dimension> outDimensions = NetCDFUtils.createNetCDFCFGeodeticDimensions(
                ncFileOut, true, nLat, true, nLon, DataType.FLOAT, hasTimeDim, nTime);
        // Adding old dimensions
        outDimensions.addAll(getOldDimensions(ncFileIn));
        // Filtering az_size/ra_size dimensions
        List<Dimension> finalDims = new ArrayList<Dimension>(outDimensions);
        for (Dimension dim : outDimensions) {
            String name = dim.getName();
            if (dim != null
                    && (name.equalsIgnoreCase("AZ_SIZE") || name.equalsIgnoreCase("RA_SIZE"))) {
                finalDims.remove(dim);
            }
        }
        // NoData value to set
        double noData = Double.NaN;

        // defining output variable
        // SIMONE: replaced foundVariables.get(varName).getDataType()
        // with DataType.DOUBLE
        ncFileOut.addVariable(foundVariableBriefNames.get(varName), foundVariables.get(varName)
                .getDataType(), finalDims);
        ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName), "long_name",
                foundVariableLongNames.get(varName));
        ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName), "units",
                foundVariableUoM.get(varName));
        ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName),
                NetCDFUtilities.DatasetAttribs.MISSING_VALUE, noData);

        return noData;
    }

    protected Collection<? extends Dimension> getOldDimensions(NetcdfFile ncFileIn) {
        List<Dimension> dimensions = new ArrayList<Dimension>();
        for (Object obj : ncFileIn.getVariables()) {
            final Variable var = (Variable) obj;
            final String varName = var.getName();
            if (foundVariables.containsKey(varName)) {
                List<Dimension> dims = var.getDimensions();
                dimensions.addAll(dims);
            }
        }
        return dimensions;
    }

    protected void writeRaster(Dimension ra_size, Dimension az_size, final Array maskOriginalData,
            Array originalVarArray, int[] dims, WritableRaster userRaster, Index varIndex,
            Index maskIndex) {

        int dimsLen = dims != null ? dims.length : 0;
        int[] indexes = new int[2 + dimsLen];

        for (int yPos = 0; yPos < az_size.getLength(); yPos++) {
            for (int xPos = 0; xPos < ra_size.getLength(); xPos++) {
                indexes[0] = yPos;
                indexes[1] = xPos;
                if (indexes.length > 2) {
                    System.arraycopy(dims, 0, indexes, 2, dimsLen);
                }
                float sVal = originalVarArray.getFloat(varIndex.set(indexes));
                if (maskOriginalData != null) {
                    int validByte = 1;
                    if (maskOriginalData.getByte(maskIndex.set(yPos, xPos)) != validByte) {
                        sVal = Float.NaN;
                    }
                }
                // Flipping y
                boolean flipY = false;
                int newYpos = yPos;
                // Flipping y
                if (flipY) {
                    newYpos = az_size.getLength() - yPos - 1;
                }
                userRaster.setSample(xPos, newYpos, 0, sVal); // setSample(
                // x, y,
                // band,
                // value )
            }
        }
    }

    public boolean insertDb(String location, String originalFilePath, String layerName, String cfName, Geometry geo) throws ActionException {
        boolean result = false;

        String sql = "INSERT INTO " + configuration.getProductsTableName() + " VALUES (?,?,?,?,?,?,?,ST_GeomFromText(?))";

        
        Connection conn = null;

        try {
            conn = dataStore.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, sha1);
            ps.setDate(2, new java.sql.Date(timedim.getTime()));
            ps.setString(3, cfName);
            ps.setString(4, type.name());
            ps.setString(5, location);
            ps.setString(6, layerName);
            ps.setString(7, originalFilePath);
            ps.setString(8, geo.toText());
            result = ps.execute() && ps.getUpdateCount() > 0;
            ps.close();
        } catch (SQLException e) {
            throw new ActionException(this, e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                }
            }
        }

        return result;
    }
    
    /**
     * Zip a list of file into one zip file.
     * 
     * @param files files to zip
     * @param targetZipFile target zip file
     * @throws IOException IO error exception can be thrown when copying ...
     */
    private void zipFile(final File[] files, final File targetZipFile) throws IOException {
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            fos = new FileOutputStream(targetZipFile);
            zos = new ZipOutputStream(fos);
            byte[] buffer = new byte[128];
            for (int i = 0; i < files.length; i++) {
                File currentFile = files[i];
                if (!currentFile.isDirectory()) {
                    ZipEntry entry = new ZipEntry(currentFile.getName());
                    FileInputStream fis = null;
                    try {
                        fis = new FileInputStream(currentFile);
                        zos.putNextEntry(entry);
                        int read = 0;
                        while ((read = fis.read(buffer)) != -1) {
                            zos.write(buffer, 0, read);
                        }
                    } catch (Exception e) {
                        LOGGER.error(e.getMessage());
                    } finally {
                        if (fis != null) {
                            try {
                                fis.close();
                            } catch (Exception e) {
                                LOGGER.error(e.getMessage());
                            }
                        }
                        if (zos != null) {
                            try {
                                zos.closeEntry();
                            } catch (Exception e) {
                                LOGGER.error(e.getMessage());
                            }
                        }
                    }
                }
            }
        } catch (FileNotFoundException e) {
            LOGGER.error("File not found : " + e);
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getMessage());
                }
            }
            if (zos != null) {
                try {
                    zos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getMessage());
                }
            }
        }
    }
}
