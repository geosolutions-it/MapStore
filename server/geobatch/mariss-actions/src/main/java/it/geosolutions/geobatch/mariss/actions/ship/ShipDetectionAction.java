package it.geosolutions.geobatch.mariss.actions.ship;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.geotools.data.DataStore;
import org.geotools.jdbc.JDBCDataStore;

import com.vividsolutions.jts.geom.Geometry;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.mariss.actions.MarissBaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationUtils;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ShipDetection;
import it.geosolutions.geobatch.mariss.actions.sar.AttributeBean;

@Action(configurationClass = ShipDecectionConfiguration.class)
public class ShipDetectionAction extends MarissBaseAction {

    public ShipDetectionAction(ShipDecectionConfiguration actionConfiguration) {
        super(actionConfiguration);
        // TODO Auto-generated constructor stub
    }

    /**
     * Execute process
     */
    @Override
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

                            File inputDir = fileEvent.getSource();
                            AttributeBean attributeBean = getAttributeBean(inputDir);

                            DataStore ds = FeatureConfigurationUtil
                                    .createDataStore(configuration.getOutputFeature());
                            if (ds == null) {
                                throw new ActionException(this, "Can't find datastore ");
                            }
                            try {
                                if (!(ds instanceof JDBCDataStore)) {
                                    throw new ActionException(this,
                                            "Bad Datastore type " + ds.getClass().getName());
                                }
                                attributeBean.dataStore = (JDBCDataStore) ds;
                                attributeBean.dataStore.setExposePrimaryKeyColumns(true);

                                ingestShipDetections(ret, inputDir, attributeBean);
                                
                                ingestOilSpills(ret, inputDir, attributeBean);
                            } finally {
                                ds.dispose();
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

                throw new ActionException(this, message, ioe);
            }
        }
        return ret;
    }

    /**
     * @param ret
     * @param inputDir
     * @param attributeBean
     * @throws ActionException
     * @throws IOException
     */
    protected void ingestOilSpills(final Queue<EventObject> ret, File inputDir,
            AttributeBean attributeBean) throws ActionException, IOException {
        List<OilSpill> oilSpills = new ArrayList<OilSpill>();

        // Prepare a Zip file containing the
        // ShipDetection files
        // Filtering the files
        File[] files = getOilSpills(attributeBean, inputDir);

        // Listing XML files
        if (files != null && files.length > 0) {
            int numFiles = files.length;

            oilSpills.addAll(readOilSpills(attributeBean, files));

            if (oilSpills.size() > 0) {
                insertOilSpillsIntoDb(attributeBean, oilSpills);
            }

            // Append a txt file with the UID
            File properties = new File(files[0].getParentFile(),
                    "netcdf.properties");
            properties.createNewFile();

            // Append Useful properties
            FileUtils.write(properties,
                    "identifier=" + attributeBean.identifier + "\n");
            if (attributeBean.timedim != null) {
                FileUtils.write(properties,
                        "time=" + new Timestamp(
                                attributeBean.timedim.getTime()) + "\n",
                        true);
            }
            FileUtils.write(properties,
                    "originalFileName=" + attributeBean.absolutePath + "\n",
                    true);
            FileUtils.write(properties,
                    "sartype=" + attributeBean.type + "\n", true);

            FileUtils.write(properties,
                    "service=" + attributeBean.serviceName + "\n", true);

            File[] filesUpdated = new File[numFiles + 1];
            System.arraycopy(files, 0, filesUpdated, 0, numFiles);
            filesUpdated[numFiles] = properties;

            // Creating new Zip file where the XML files
            // must be zipped
            File netcdfDir = new File(container.getParams()
                    .get(ConfigurationUtils.OILSPILLS_DIRECTORY_KEY));
            if (!netcdfDir.exists()) {
                netcdfDir.mkdirs();
            }
            if (!netcdfDir.canWrite()) {
                throw new ActionException(NetCDFAction.class,
                        "Unable to find Ship Detection directory");
            }
            String filename = IDENTIFIER_SEPARATOR
                    + attributeBean.identifier + IDENTIFIER_SEPARATOR
                    + SERVICE_SEPARATOR + attributeBean.serviceName
                    + SERVICE_SEPARATOR + "OilSpills";
            File targetZipFile = new File(netcdfDir, filename + ".zip");
            zipFile(files, targetZipFile);
            insertDb(attributeBean, targetZipFile.getAbsolutePath(),
                    configuration.getContainer().getDefaultNameSpace(),
                    "OIL_SPILL", null, null);

            // Append to the event list
            ret.add(new FileSystemEvent(targetZipFile,
                    FileSystemEventType.FILE_ADDED));
        }
    }
    
    /**
     * @param ret
     * @param inputDir
     * @param attributeBean
     * @throws ActionException
     * @throws IOException
     */
    protected void ingestShipDetections(final Queue<EventObject> ret, File inputDir,
            AttributeBean attributeBean) throws ActionException, IOException {
        List<ShipDetection> shipDetections = new ArrayList<ShipDetection>();

        // Prepare a Zip file containing the
        // ShipDetection files
        // Filtering the files
        File[] files = getShipDetections(attributeBean, inputDir);

        // Listing XML files
        if (files != null && files.length > 0) {
            int numFiles = files.length;

            shipDetections.addAll(readShipDetections(attributeBean, files));

            if (shipDetections.size() > 0) {
                insertShipDetectionsIntoDb(attributeBean, shipDetections);
            }

            // Append a txt file with the UID
            File properties = new File(files[0].getParentFile(),
                    "netcdf.properties");
            properties.createNewFile();

            // Append Useful properties
            FileUtils.write(properties,
                    "identifier=" + attributeBean.identifier + "\n");
            if (attributeBean.timedim != null) {
                FileUtils.write(properties,
                        "time=" + new Timestamp(
                                attributeBean.timedim.getTime()) + "\n",
                        true);
            }
            FileUtils.write(properties,
                    "originalFileName=" + attributeBean.absolutePath + "\n",
                    true);
            FileUtils.write(properties,
                    "sartype=" + attributeBean.type + "\n", true);

            FileUtils.write(properties,
                    "service=" + attributeBean.serviceName + "\n", true);

            File[] filesUpdated = new File[numFiles + 1];
            System.arraycopy(files, 0, filesUpdated, 0, numFiles);
            filesUpdated[numFiles] = properties;

            // Creating new Zip file where the XML files
            // must be zipped
            File netcdfDir = new File(container.getParams()
                    .get(ConfigurationUtils.SHIPDETECTIONS_DIRECTORY_KEY));
            if (!netcdfDir.exists()) {
                netcdfDir.mkdirs();
            }
            if (!netcdfDir.canWrite()) {
                throw new ActionException(NetCDFAction.class,
                        "Unable to find Ship Detection directory");
            }
            String filename = IDENTIFIER_SEPARATOR
                    + attributeBean.identifier + IDENTIFIER_SEPARATOR
                    + SERVICE_SEPARATOR + attributeBean.serviceName
                    + SERVICE_SEPARATOR + "Ships";
            File targetZipFile = new File(netcdfDir, filename + ".zip");
            zipFile(files, targetZipFile);
            insertDb(attributeBean, targetZipFile.getAbsolutePath(),
                    configuration.getContainer().getDefaultNameSpace(),
                    "SHIP_DETECTION", null, null);

            // Append to the event list
            ret.add(new FileSystemEvent(targetZipFile,
                    FileSystemEventType.FILE_ADDED));
        }
    }

    /**
     * Insert a product in the database
     * 
     * @param attributeBean attributes
     * @param outFileLocation the absolute path
     * @param namespace namespace
     * @param layerName layer
     * @param cfName variable name
     * @param geo the envelop
     * @return true if success
     * @throws ActionException
     */
    @Override
    public boolean insertDb(AttributeBean attributeBean, String outFileLocation, String namespace,
            String layerName, String cfName, Geometry geo) throws ActionException {
        boolean result = false;

        String sql = "INSERT INTO " + configuration.getProductsTableName()
                + "(servicename, identifier, bbox, \"time\", variable, sartype, outfilelocation, originalfilepath, layername, partition, numoilspill, numshipdetect)"
                + " VALUES (?,?,(SELECT ST_SetSRID(ST_Extent(the_geom),4326) FROM ship_detections WHERE servicename = ? AND identifier = ?),?,?,?,?,?,?,?,?,?)";

        Connection conn = null;

        try {
            conn = attributeBean.dataStore.getDataSource().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, attributeBean.serviceName);
            ps.setString(2, attributeBean.identifier);
            ps.setString(3, attributeBean.serviceName);
            ps.setString(4, attributeBean.identifier);
            // ps.setString(3, geo.toText());
            if (attributeBean.timedim != null) {
                ps.setTimestamp(5, new Timestamp(attributeBean.timedim.getTime()));
            } else {
                ps.setTimestamp(5, null);
            }
            ps.setString(6, cfName);
            ps.setString(7, null);
            ps.setString(8, outFileLocation);
            ps.setString(9, attributeBean.absolutePath);
            ps.setString(10, namespace + ":" + layerName);

            String partition = null;
            final String outputFileVaseName = FilenameUtils.getBaseName(outFileLocation);
            if (outputFileVaseName.contains("partition")) {
                partition = outputFileVaseName.substring(
                        outputFileVaseName.indexOf(CUSTOM_DIM_VAL_SEPARATOR)
                                + CUSTOM_DIM_VAL_SEPARATOR.length(),
                        outputFileVaseName.indexOf(CUSTOM_DIM_END_SEPARATOR));
            }
            ps.setString(11, partition);
            ps.setInt(12, attributeBean.numOilSpills);
            ps.setInt(13, attributeBean.numShipDetections);

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
     * Works only on a directory
     * 
     * @param fileEvent
     * @return
     */
    private boolean canProcess(FileSystemEvent fileEvent) {
        File file = fileEvent.getSource();
        if (file.isDirectory()) {
            return true;
        }
        return false;
    }

    @Override
    public boolean checkConfiguration() {
        // TODO Auto-generated method stub
        return true;
    }

}
