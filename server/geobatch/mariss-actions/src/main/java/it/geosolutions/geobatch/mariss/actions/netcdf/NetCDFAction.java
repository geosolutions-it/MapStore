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
import java.io.Serializable;
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
import java.util.Map.Entry;
import java.util.Queue;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.RegexFileFilter;
import org.geotools.data.DataStore;
import org.geotools.geometry.GeneralEnvelope;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.jdbc.JDBCDataStore;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import ucar.ma2.Array;
import ucar.ma2.DataType;
import ucar.ma2.Index;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFileWriteable;
import ucar.nc2.Variable;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.QNameMap;
import com.thoughtworks.xstream.io.xml.StaxDriver;
import com.thoughtworks.xstream.mapper.MapperWrapper;
import com.vividsolutions.jts.geom.Geometry;

public abstract class NetCDFAction extends BaseAction<EventObject> {

    static class AttributeBean {

        Map<String, Variable> foundVariables = new HashMap<String, Variable>();

        Map<String, String> foundVariableLongNames = new HashMap<String, String>();

        Map<String, String> foundVariableBriefNames = new HashMap<String, String>();

        Map<String, String> foundVariableUoM = new HashMap<String, String>();

        Date timedim;

        SARType type;

        GeneralEnvelope env;

        String absolutePath;

        String identifier;

        JDBCDataStore dataStore;

        boolean maskOneIsValid;
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

    protected static final String SEPARATOR = "_Var_";

    protected static final String CUSTOM_DIM_START_SEPARATOR = "_Dim_";    
    protected static final String CUSTOM_DIM_VAL_SEPARATOR = "_DimVal_";
    protected static final String CUSTOM_DIM_END_SEPARATOR = "_DimEnd_";

    private static final String SERVICE_SEPARATOR = "_s_";

    private static final String IDENTIFIER_SEPARATOR = "_I_";

    private static final String PATHSEPARATOR = File.separator;

    protected final IngestionActionConfiguration configuration;

    private final ConfigurationContainer container;

    public NetCDFAction(IngestionActionConfiguration actionConfiguration) {
        super(actionConfiguration);
        configuration = actionConfiguration;
        ConfigurationContainer container = actionConfiguration.getContainer();
        if (container == null || container.getParams() == null
                || !container.getParams().containsKey(ConfigurationUtils.NETCDF_DIRECTORY_KEY)) {
            throw new RuntimeException("Wrong configuration defined");
        } else {
            this.container = container;
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

    protected abstract boolean canProcessFile(File netcdfFile);

    @Override
    public boolean checkConfiguration() {
        // Checking if the NetCDF directory is defined
        Map<String, String> params = container.getParams();
        String dir = (params != null && params.containsKey(ConfigurationUtils.NETCDF_DIRECTORY_KEY)) ? params
                .get(ConfigurationUtils.NETCDF_DIRECTORY_KEY) : null;
        // Initial check
        boolean exists = dir != null && !dir.isEmpty();
        if (exists) {
            File f = new File(dir);
            return f != null && f.exists() && f.canWrite() && f.canRead();
        } else {
            return false;
        }
    }

    protected void createDatastoreFile(File mosaicDir, String varName) throws IOException {
        Map<String, Serializable> dsParams = configuration.getOutputFeature().getDataStore();

        // ---
        final String host = (String) dsParams.get("host");
        final String port = (String) dsParams.get("port");
        final String database = (String) dsParams.get("database");
        final String schema = (String) dsParams.get("schema");
        final String user = (String) dsParams.get("user");
        final String passwd = (String) dsParams.get("passwd");
        // ---
        File datastore = new File(mosaicDir, "datastore.properties");
        datastore.createNewFile();
        String properties = "user=" + user + "\n" + "port=" + port + "\n" + "passwd=" + passwd
                + "\n" + "host=" + host + "\n" + "database=" + database + "\n"
                + "driver=org.postgresql.Driver\n" + "schema=" + schema + "\n"
                + "Estimated\\ extends=false\n"
                + "SPI=org.geotools.data.postgis.PostgisNGDataStoreFactory";
        FileUtils.write(datastore, properties);
    }

    protected void createIndexerFile(File mosaicDir, String varName, String serviceName,
            Map<String, String> additionalDimensions) throws IOException {
        File indexer = new File(mosaicDir, "indexer.properties");
        indexer.createNewFile();

        String schema = "*the_geom:Polygon,location:String,time:java.util.Date,service:String,identifier:String";
        String propertyCollectors = "StringFileNameExtractorSPI[serviceregex](service),StringFileNameExtractorSPI[identifierregex](identifier)";

        if (additionalDimensions != null && additionalDimensions.size() > 0) {
            for (Entry<String, String> entry : additionalDimensions.entrySet()) {
                schema += "," + entry.getKey() + ":String";
                propertyCollectors += ",StringFileNameExtractorSPI[" + entry.getKey() + "regex]("
                        + entry.getKey() + ")";
            }
        }

//        String properties = "TimeAttribute=time\n" + "Schema=" + schema + "\n"
//                + "PropertyCollectors=" + propertyCollectors;
        String properties = "Schema=" + schema + "\n"
              + "PropertyCollectors=" + propertyCollectors;
        FileUtils.write(indexer, properties);
    }

    protected void createRegexFiles(File mosaicDir, String varName,
            Map<String, String> additionalDimensions) throws IOException {
        // REGEX for Service Name
        File serviceRegex = new File(mosaicDir, "serviceregex.properties");
        serviceRegex.createNewFile();
        // String properties = "regex=" + "(?<=" + SERVICE_SEPARATOR + ")[a-zA-Z]*" + "(?="
        // + SERVICE_SEPARATOR + ")";
        String properties = "regex=" + "(?<=" + SERVICE_SEPARATOR + ").*" + "(?="
                + SERVICE_SEPARATOR + ")";
        FileUtils.write(serviceRegex, properties);
        // REGEX for Identifier
        File identifierRegex = new File(mosaicDir, "identifierregex.properties");
        identifierRegex.createNewFile();
        String identifierProperties = "regex=" + "(?<=" + IDENTIFIER_SEPARATOR + ").*" + "(?="
                + IDENTIFIER_SEPARATOR + ")";
        FileUtils.write(identifierRegex, identifierProperties);

        // --------------
        if (additionalDimensions != null && additionalDimensions.size() > 0) {
            for (Entry<String, String> entry : additionalDimensions.entrySet()) {
                File customPropRegex = new File(mosaicDir, entry.getKey() + "regex.properties");
                customPropRegex.createNewFile();
                String customPropRegexProperties = "regex=" + "(?<=" + CUSTOM_DIM_START_SEPARATOR
                        + entry.getKey() + CUSTOM_DIM_VAL_SEPARATOR +").*" + "(?=" + CUSTOM_DIM_END_SEPARATOR + ")";
                FileUtils.write(customPropRegex, customPropRegexProperties);
            }
        }
    }

    protected double definingOutputVariables(boolean hasDepth, int nLat, int nLon,
            NetcdfFileWriteable ncFileOut, NetcdfFile ncFileIn, boolean hasTimeDim, int nTime,
            String varName, AttributeBean attributeBean) {
        /**
         * createNetCDFCFGeodeticDimensions( NetcdfFileWriteable ncFileOut, final boolean hasTimeDim, final int tDimLength, final boolean hasZetaDim,
         * final int zDimLength, final String zOrder, final boolean hasLatDim, final int latDimLength, final boolean hasLonDim, final int
         * lonDimLength)
         */
        final List<Dimension> outDimensions = NetCDFUtils.createNetCDFCFGeodeticDimensions(
                ncFileOut, true, nLat, true, nLon, DataType.FLOAT, hasTimeDim, nTime);
        // Adding old dimensions
        outDimensions.addAll(getOldDimensions(ncFileIn, attributeBean));
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
        ncFileOut.addVariable(attributeBean.foundVariableBriefNames.get(varName),
                attributeBean.foundVariables.get(varName).getDataType(), finalDims);
        ncFileOut.addVariableAttribute(attributeBean.foundVariableBriefNames.get(varName),
                "long_name", attributeBean.foundVariableLongNames.get(varName));
        ncFileOut.addVariableAttribute(attributeBean.foundVariableBriefNames.get(varName), "units",
                attributeBean.foundVariableUoM.get(varName));
        ncFileOut.addVariableAttribute(attributeBean.foundVariableBriefNames.get(varName),
                NetCDFUtilities.DatasetAttribs.MISSING_VALUE, noData);

        return noData;
    }

    private Collection<EventObject> doProcess(File netcdfFile, AttributeBean attributeBean)
            throws ActionException {
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
            createdFiles = writeNetCDF(tempDir, inputFileName, cfNames, attributeBean);
        } catch (IOException e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        }

        // After creating the final file, start the ingestion
        if (createdFiles != null && createdFiles.length > 0) {

            // Configuring REST publisher support
            GeoServerRESTPublisher publisher = new GeoServerRESTPublisher(
                    configuration.getGeoserverURL(), configuration.getGeoserverUID(),
                    configuration.getGeoserverPWD());
            GeoServerRESTReader reader = null;
            String namespace = container.getDefaultNameSpace();
            String namespaceURI = container.getDefaultNameSpace();

            try {
                reader = new GeoServerRESTReader(configuration.getGeoserverURL(),
                        configuration.getGeoserverUID(), configuration.getGeoserverPWD());

                if (!reader.existsWorkspace(namespace)) {
                    WorkspaceUtils.createWorkspace(reader, publisher, namespace, namespaceURI);
                }
            } catch (Exception e) {
                throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                // DEBUG : LOGGER.warn(e.getLocalizedMessage(), e);
            }

            // If the mosaic is not already configured we must configure it, otherwise we do harvesting
            File[] finalFiles = new File[createdFiles.length];
            String[] layerNames = new String[createdFiles.length];
            // Boolean indicating if the operation has gone
            boolean sent = handleMosaic(reader, publisher, createdFiles, finalFiles, layerNames,
                    attributeBean.identifier);

            // Move the original netCDF File in the netcdf directory

            // Creating a subdirectory of the NetCDF directory
            File netcdfDir = new File(container.getParams().get(
                    ConfigurationUtils.NETCDF_DIRECTORY_KEY));
            if (!netcdfDir.exists() || !netcdfDir.canWrite()) {
                throw new ActionException(NetCDFAction.class, "Unable to find NetCDF directory");
            }

            if (sent) {
                if (LOGGER.isInfoEnabled()) {
                    LOGGER.info("Coverage SUCCESSFULLY sent to GeoServer!");
                }
                int index = 0;
                // Create a Geometry for the NetCDF envelope
                Geometry geo = JTS.toGeometry(new ReferencedEnvelope(attributeBean.env));
                CoordinateReferenceSystem crs = attributeBean.env.getCoordinateReferenceSystem();
                geo.setUserData(crs);
                for (File f : finalFiles) {
                    // ... setting up the appropriate event for the next action
                    events.add(new FileSystemEvent(f, FileSystemEventType.FILE_ADDED));
                    // Update DataStore
                    insertDb(attributeBean, f.getAbsolutePath(), namespace, layerNames[index],
                            cfNames.get(index), geo);
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
                            // Create a new Container for all the attributes
                            AttributeBean attributeBean = new AttributeBean();
                            // Getting file name
                            File inputFile = fileEvent.getSource();
                            attributeBean.absolutePath = inputFile.getAbsolutePath();
                            attributeBean.maskOneIsValid = container.isMaskOneIsValid();
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
                                    Pattern pattern = Pattern.compile(container.getPattern());
                                    Matcher m = pattern.matcher(attributeBean.absolutePath);
                                    if (m.matches()) {
                                        // Getting dates
                                        String date = m.group(1);
                                        String time = m.group(2);
                                        SimpleDateFormat toSdf = new SimpleDateFormat(
                                                "yyyyMMddHHmmss");
                                        toSdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                                        try {
                                            attributeBean.timedim = toSdf.parse(date + time);
                                        } catch (ParseException e) {
                                            LOGGER.error(e.getMessage());
                                        }
                                    }

                                }
                            }
                            if (canProcessFile(netcdfFile)) {
                                // Getting the File identifier
                                String identifier = inputFile.getName().substring(0,
                                        inputFile.getName().length() - 8);
                                attributeBean.identifier = identifier;
                                // Getting SARType
                                attributeBean.type = SARType.getType(getActionName());
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
                                    attributeBean.dataStore = (JDBCDataStore) ds;
                                    attributeBean.dataStore.setExposePrimaryKeyColumns(true);
                                    // return next events configurations
                                    Collection<EventObject> resultEvents = doProcess(netcdfFile,
                                            attributeBean);
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
                                        
                                        QNameMap qmap = new QNameMap();
                                        qmap.setDefaultNamespace("http://ignore.namespace/prefix");
                                        qmap.setDefaultPrefix("");
                                        StaxDriver staxDriver = new StaxDriver(qmap); 
                                        XStream xstream = new XStream(staxDriver){
                                            @Override
                                            protected MapperWrapper wrapMapper(MapperWrapper next) {
                                                return new MapperWrapper(next) {
                                                    @Override
                                                    public boolean shouldSerializeMember(Class definedIn, String fieldName) {
                                                        if (definedIn == Object.class) {
                                                            return false;
                                                        }
                                                        return super.shouldSerializeMember(definedIn, fieldName);
                                                    }
                                                };
                                            }
                                        };
                                        
                                        xstream.processAnnotations(ShipDetection.class);     // inform XStream to parse annotations in Data 
                                        
                                        List<ShipDetection> shipDetections = new ArrayList<ShipDetection>();
                                        
                                        for (File fileDsXml : files) {
                                            try {
                                                ShipDetection shpDs = (ShipDetection) xstream.fromXML(fileDsXml);
                                                
                                                shipDetections.add(shpDs);
                                                
                                            } catch (Exception e) {
                                                LOGGER.warn(e.getMessage(), e);
                                            }
                                            
                                        }
                                        
                                        if (shipDetections.size() > 0) {
                                            insertShipDetectionsIntoDb(attributeBean, shipDetections);
                                        }
                                        
                                        // Append a txt file with the UID
                                        File properties = new File(files[0].getParentFile(),
                                                "netcdf.properties");
                                        properties.createNewFile();
                                        // Append Useful properties
                                        FileUtils.write(properties, "identifier=" + identifier
                                                + "\n");
                                        if (attributeBean.timedim != null) {
                                            FileUtils.write(
                                                    properties,
                                                    "time="
                                                            + new Timestamp(attributeBean.timedim
                                                                    .getTime()) + "\n", true);
                                        }
                                        FileUtils.write(properties, "originalFileName="
                                                + netcdfFile.getName() + "\n", true);
                                        FileUtils.write(properties, "sartype=" + attributeBean.type
                                                + "\n", true);
                                        FileUtils.write(properties, "envelope="
                                                + new ReferencedEnvelope(attributeBean.env) + "\n",
                                                true);
                                        FileUtils.write(properties,
                                                "service=" + configuration.getServiceName() + "\n",
                                                true);
                                        File[] filesUpdated = new File[numFiles + 1];
                                        System.arraycopy(files, 0, filesUpdated, 0, numFiles);
                                        filesUpdated[numFiles] = properties;
                                        // Creating new Zip file where the XML files must be zipped
                                        File targetZipFile = new File(netcdfDir,
                                                FilenameUtils.getBaseName(netcdfDir.getName())
                                                        + ".zip");
                                        zipFile(files, targetZipFile);
                                        // Append to the event list
                                        ret.add(new FileSystemEvent(targetZipFile,
                                                FileSystemEventType.FILE_ADDED));
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

    protected abstract String getActionName();

    /**
     * 
     * @param ncFileIn
     * @param attributeBean
     * @return
     */
    protected Collection<? extends Dimension> getOldDimensions(NetcdfFile ncFileIn,
            AttributeBean attributeBean) {
        List<Dimension> dimensions = new ArrayList<Dimension>();
        for (Object obj : ncFileIn.getVariables()) {
            final Variable var = (Variable) obj;
            final String varName = var.getName();
            if (attributeBean.foundVariables.containsKey(varName)) {
                List<Dimension> dims = var.getDimensions();
                dimensions.addAll(dims);
            }
        }
        return dimensions;
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
            File[] outputFiles, File[] finalFiles, String[] layerNames, String identifier)
            throws ActionException {
        // Initialization of the result
        boolean published = true;
        // File array index
        int index = 0;
        // Loop through the files
        for (File f : outputFiles) {
            try {
                // Getting Variable Name
                String file = FilenameUtils.getBaseName(f.getAbsolutePath());
                String variableName = /* getActionName() + */file.substring(file
                        .lastIndexOf(SEPARATOR) + SEPARATOR.length());
                variableName = variableName.toLowerCase() /*.replace("_", "-")*/ ; 

                Map<String, String> additionalDimensions = new HashMap<String, String>();
                if (file.indexOf(CUSTOM_DIM_START_SEPARATOR) > 0) {
                    String dimensions = file.substring(file.lastIndexOf(CUSTOM_DIM_START_SEPARATOR),
                            file.lastIndexOf(SEPARATOR));
                    String dimensionNames[] = dimensions.split(CUSTOM_DIM_START_SEPARATOR);

                    for (String dim : dimensionNames) {
                        if (dim.trim().length() > 0) {
                            String[] theDim = dim.split(CUSTOM_DIM_VAL_SEPARATOR);
                            additionalDimensions.put(theDim[0], theDim[1]);
                        }
                    }
                }

                // Create the mosaic directory in the temporary geobatch directory
                File temp = new File(getTempDir(), "temp" + file);
                FileUtils.forceMkdir(temp);
                File mosaicDir = new File(temp, variableName);
                String newFileName = IDENTIFIER_SEPARATOR + identifier + IDENTIFIER_SEPARATOR
                        + SERVICE_SEPARATOR + configuration.getServiceName() + SERVICE_SEPARATOR
                        + f.getName();

                // Check if the mosaic is present
                if (isMosaicConfigured(reader, variableName)) {
                    // After the first file, other mosaic files will be stored inside the netcdf directory
                    mosaicDir = new File(container.getParams().get(
                            ConfigurationUtils.NETCDF_DIRECTORY_KEY), variableName);
                    if (!mosaicDir.exists()) {
                        FileUtils.forceMkdir(mosaicDir);
                        // mosaicDir.createNewFile();
                    }
                    // Create the new NetCDF file
                    File newFile = new File(mosaicDir, newFileName);

                    // Copy the file
                    try {
                        FileUtils.moveFile(f, newFile);
                    } catch (IOException e) {
                        throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                    }
                    // Copy the final file location
                    finalFiles[index] = newFile;
                    // Harvest the Mosaic with a new NetCDF file
                    published &= publisher.harvestExternal(container.getDefaultNameSpace(),
                            variableName, "netcdf", newFile.getAbsolutePath());
                    // Adding layername
                    layerNames[index] = variableName;
                } else {
                    // Create the new NetCDF file
                    File newFile = new File(mosaicDir, newFileName);

                    // Copy the file
                    try {
                        FileUtils.moveFile(f, newFile);
                    } catch (IOException e) {
                        throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                    }
                    // Copy the final file location
                    String geoserverDataDirectory = configuration.getGeoserverDataDirectory();
                    geoserverDataDirectory = geoserverDataDirectory.endsWith(PATHSEPARATOR) ? geoserverDataDirectory
                            .substring(0, geoserverDataDirectory.length() - 1)
                            : geoserverDataDirectory;
                    finalFiles[index] = new File(geoserverDataDirectory + PATHSEPARATOR + "data"
                            + PATHSEPARATOR + container.getDefaultNameSpace() + PATHSEPARATOR
                            + variableName + PATHSEPARATOR + newFile.getName());
                    // Create the Mosaic elements
                    createIndexerFile(mosaicDir, variableName, configuration.getServiceName(),
                            additionalDimensions);
                    createDatastoreFile(mosaicDir, variableName);
                    createRegexFiles(mosaicDir, variableName, additionalDimensions);

                    // Zip all the elements
                    File zipped = zipAll(temp, mosaicDir.listFiles(), mosaicDir.getName());

                    // Publish the ImageMosaic
                    published &= publisher.publishImageMosaic(container.getDefaultNameSpace(),
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

    /**
     * 
     * @param attributeBean
     * @param outFileLocation
     * @param namespace
     * @param layerName
     * @param cfName
     * @param geo
     * @return
     * @throws ActionException
     */
    public boolean insertDb(AttributeBean attributeBean, String outFileLocation, String namespace, String layerName,
            String cfName, Geometry geo) throws ActionException {
        boolean result = false;

        String sql = "INSERT INTO " + configuration.getProductsTableName()
                + " VALUES (?,?,ST_GeomFromText(?),?,?,?,?,?,?,?)";

        Connection conn = null;

        try {
            conn = attributeBean.dataStore.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, configuration.getServiceName());
            ps.setString(2, attributeBean.identifier);
            ps.setString(3, geo.toText());
            if (attributeBean.timedim != null) {
                ps.setDate(4, new java.sql.Date(attributeBean.timedim.getTime()));
            } else {
                ps.setDate(4, new java.sql.Date(1));
            }
            ps.setString(5, cfName);
            ps.setString(6, attributeBean.type.name());
            ps.setString(7, outFileLocation);
            ps.setString(8, configuration.getServiceName() + "/PRODUCTS/" + FilenameUtils.getName(attributeBean.absolutePath));
            ps.setString(9, namespace + ":" + layerName);
            
            String partition = null;
            final String outputFileVaseName = FilenameUtils.getBaseName(outFileLocation);
            if (outputFileVaseName.contains("partition")) {
                partition = outputFileVaseName.substring(outputFileVaseName.indexOf(CUSTOM_DIM_VAL_SEPARATOR) + CUSTOM_DIM_VAL_SEPARATOR.length(), outputFileVaseName.indexOf(CUSTOM_DIM_END_SEPARATOR));
            }
            ps.setString(10, partition);

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
     * 
     * @param attributeBean
     * @param shipDetections
     * @return
     * @throws ActionException
     */
    public boolean insertShipDetectionsIntoDb(AttributeBean attributeBean, List<ShipDetection> shipDetections) throws ActionException {
        boolean result = false;

        /*
         ship_detections(         
                
                servicename, identifier, dsid, "timeStamp", heading, speed, length, 
                
                "MMSI", confidencelevel, imageidentifier, imagetype, "RCS", maxpixelvalue, 
                
                shipcategory, confidencelevelcat, the_geom
         )
        */
        
        String sql = "INSERT INTO " + configuration.getShipDetectionsTableName()
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ST_GeomFromText(?))";

        Connection conn = null;

        try {
            conn = attributeBean.dataStore.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            
            for (ShipDetection ds : shipDetections) {
                ps.setString(1, configuration.getServiceName()); // servicename
                ps.setString(2, attributeBean.identifier); // identifier
                ps.setString(3, ds.getId()); // dsid
                if (ds.getTimeStamp() != null) { // "timeStamp"
                    SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd'T'HH:mm:ss'Z'");
                    sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                    try {
                        ps.setDate(4, new java.sql.Date(sdf.parse(ds.getTimeStamp()).getTime()));
                    } catch (ParseException e) {
                        LOGGER.warn(e.getMessage(), e);
                        ps.setDate(4, new java.sql.Date(1));
                    }
                } else {
                    ps.setDate(4, new java.sql.Date(1));
                }
                
                if (ds.getHeading() != null) ps.setDouble(5, ds.getHeading()); // heading
                else ps.setNull(5, java.sql.Types.DOUBLE);
                
                if (ds.getSpeed() != null) ps.setDouble(6, ds.getSpeed()); // speed
                else ps.setNull(6, java.sql.Types.DOUBLE);
                
                if (ds.getLength() != null) ps.setDouble(7, ds.getLength()); // length
                else ps.setNull(7, java.sql.Types.DOUBLE);
                
                ps.setString(8, ds.getMMSI()); // "MMSI"
                
                if (ds.getConfidenceLevel() != null)  ps.setDouble(9, ds.getConfidenceLevel()); // confidencelevel
                else ps.setNull(9, java.sql.Types.DOUBLE);
                
                ps.setString(10, ds.getImageIdentifier()); // imageidentifier
                ps.setString(11, ds.getImageType()); // imagetype
                
                Double RCS = null;
                Double maxPixelValue = null;
                if (ds.getDetectionParameters() != null) {
                    RCS = ds.getDetectionParameters().getRCS();
                
                    if (RCS != null) ps.setDouble(12, RCS); // "RCS"
                    else ps.setNull(12, java.sql.Types.DOUBLE);
                    
                    maxPixelValue = ds.getDetectionParameters().getMaxPixelValue();
                    
                    if (maxPixelValue != null) ps.setDouble(13, maxPixelValue); // maxpixelvalue
                    else ps.setNull(13, java.sql.Types.DOUBLE);
                } else {
                    ps.setNull(12, java.sql.Types.DOUBLE); // "RCS"
                    ps.setNull(13, java.sql.Types.DOUBLE); // maxpixelvalue
                }
                
                if (ds.getShipCategory() != null) ps.setDouble(14, ds.getShipCategory()); // shipcategory
                else ps.setNull(14, java.sql.Types.DOUBLE);
                
                ps.setString(15, ds.getConfidenceLevelCat()); // confidencelevelcat
                ps.setString(16, ds.getPosition()); // the_geom
                
                ps.addBatch();
            }
            
            int[] ids = ps.executeBatch();
            result = ids != null && ids.length > 0;
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
     * Check if the NetCDF ImageMosaic Layer has been already configured
     * 
     * @return true if the ImageMosaic is configured, false otherwise
     */
    protected boolean isMosaicConfigured(GeoServerRESTReader reader, String storename) {
        String coveragename = storename;// .replace("_", "-");
        return reader.existsCoverage(container.getDefaultNameSpace(), storename, coveragename);
    }

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

    protected abstract File[] writeNetCDF(File tempDir, String inputFileName, List<String> cfNames,
            AttributeBean attributeBean) throws IOException, ActionException;

    protected void writeRaster(Dimension ra_size, Dimension az_size, final Array maskOriginalData,
            Array originalVarArray, int[] dims, WritableRaster userRaster, Index varIndex,
            Index maskIndex, boolean maskOneIsValid) {

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
                    int validByte = maskOneIsValid ? 1 : 0;
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
