package it.geosolutions.geobatch.mariss.actions.netcdf;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.geoserver.tools.WorkspaceUtils;
import it.geosolutions.geobatch.mariss.actions.MarissBaseAction;
import it.geosolutions.geobatch.mariss.actions.sar.AttributeBean;
import it.geosolutions.geobatch.mariss.actions.sar.SARType;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher.ParameterConfigure;
import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.imageio.plugins.netcdf.NetCDFUtilities;

import java.awt.image.WritableRaster;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.geotools.data.DataStore;
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

import com.vividsolutions.jts.geom.Geometry;

public abstract class NetCDFAction extends MarissBaseAction {



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
        if(file.isDirectory()){
        	return true;
        }
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
            boolean sent = handleMosaic(reader, publisher, createdFiles, finalFiles, layerNames, attributeBean);

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
                            File inputFile = fileEvent.getSource();
                           
                            // Unzipping the tar.gz file if needed
                            File netcdfDir = (inputFile);
                            if(!inputFile.isDirectory()){
                            	netcdfDir = untarFile(inputFile);
                            }
                            
                            AttributeBean attributeBean = getAttributeBean(netcdfDir);
                            
                            // Getting file name
                            attributeBean.absolutePath = inputFile.getAbsolutePath();
                            attributeBean.maskOneIsValid = container.isMaskOneIsValid();

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
                                   

                                }
                            }
                            if (canProcessFile(netcdfFile)) {
                                // Getting the File identifier
                                String identifier = attributeBean.identifier;
                                
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
                                    Collection<EventObject> resultEvents = doProcess(netcdfFile, attributeBean);
                                    ret.addAll(resultEvents);
                                    
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
            File[] outputFiles, File[] finalFiles, String[] layerNames, AttributeBean attributeBean)
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
                String newFileName = IDENTIFIER_SEPARATOR + attributeBean.identifier + IDENTIFIER_SEPARATOR
                        + SERVICE_SEPARATOR + attributeBean.serviceName + SERVICE_SEPARATOR
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
                    createIndexerFile(mosaicDir, variableName, additionalDimensions);
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
     * Check if the NetCDF ImageMosaic Layer has been already configured
     * 
     * @return true if the ImageMosaic is configured, false otherwise
     */
    protected boolean isMosaicConfigured(GeoServerRESTReader reader, String storename) {
        String coveragename = storename;// .replace("_", "-");
        return reader.existsCoverage(container.getDefaultNameSpace(), storename, coveragename);
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

    
}
