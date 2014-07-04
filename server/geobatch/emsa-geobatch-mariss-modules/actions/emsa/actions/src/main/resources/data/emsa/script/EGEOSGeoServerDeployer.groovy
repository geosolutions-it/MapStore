
import it.geosolutions.geobatch.egeos.deployers.services.EGEOSRegistryDeployerConfiguration
import it.geosolutions.geobatch.egeos.deployers.actions.EGEOSDeployerBaseAction

import java.util.logging.Level
import java.util.logging.Logger

import java.util.HashMap;
import java.util.Map;

import it.geosolutions.geobatch.flow.event.IProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder

import it.geosolutions.geobatch.flow.event.action.ActionException

import it.geosolutions.geobatch.action.egeos.emsa.PackageType
import it.geosolutions.geobatch.action.egeos.emsa.EMSAIOUtils

import java.util.Queue;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;

import it.geosolutions.geobatch.geotiff.retile.*;
import it.geosolutions.geobatch.geotiff.overview.*;
import it.geosolutions.geobatch.imagemosaic.ImageMosaicCommand;

import it.geosolutions.geobatch.action.egeos.emsa.features.*;
import it.geosolutions.geobatch.action.egeos.emsa.raster.*;
import it.geosolutions.geobatch.action.scripting.ScriptingConfiguration;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils
import org.apache.commons.io.filefilter.WildcardFileFilter;

import java.net.MalformedURLException;
import java.net.URL;

import it.geosolutions.geobatch.imagemosaic.Utils;

import org.geotools.data.DataStoreFactorySpi;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.DataStore;
import org.geotools.data.postgis.PostgisNGDataStoreFactory;
import org.geotools.data.postgis.PostgisNGJNDIDataStoreFactory;

/** 
 * Script Main "execute" function
 **/
/* ----------------------------------------------------------------- */
public List execute(ScriptingConfiguration configuration, String inputFileName, ProgressListenerForwarder listenerForwarder) throws Exception {

    DataStore store=null;
    try {
        println (" **********************************GeoServer DEPLOYER*********************************** ");
        listenerForwarder.started();
        // ////
        // Instatiate EMSA Utilities
        // ////
        utils = new EMSAUtils();

        // ////////////////////////////////////////////////////////////////////
        //
        // Initializing input variables from Flow configuration
        //
        // ////////////////////////////////////////////////////////////////////
        Map props = configuration.getProperties();

        File ImageIODir=new File(props.get("sarImagesDataDir"));

        final String filePrefix = FilenameUtils.getBaseName(inputFileName);

        final String fileSuffix = FilenameUtils.getExtension(inputFileName);

        File SARNetCDFdestDir=new File(props.get("sarDerivedDataDir"));

        // datastore.properties
        // config/datastore.properties
        File dataStorePropFile=new File(configuration.getWorkingDirectory()+ File.separator + props.get("dataStoreProp"));
        //it.geosolutions.geobatch.imagemosaic.Utils
        dataStoreProp = Utils.loadPropertiesFromURL(dataStorePropFile.toURL());

        println("Input file name is: "+inputFileName);

        // ////
        // getting package directory
        // ////
        File pkgDir=null;
        if (fileSuffix.equalsIgnoreCase("xml")) {
            pkgDir= new File(inputFileName).getParentFile();
        }
        else
	  pkgDir= new File(inputFileName);

        // ////
        // forwarding some logging information to Flow Logger Listener
        // ////
        listenerForwarder.setTask("::EGEOSGeoServerDeployer : Processing event " + inputFileName)

        /** The outcome events variable **/
        List results = new ArrayList();


        // ////
        // getting package type
        // ////
        println("File name is: "+pkgDir.getName());

        PackageType type = utils.getPackageTypeFromName(pkgDir.getName());

        println("Type is: "+type);

        if (type != null) {
            if (type == PackageType.DER) {

                // deploy Ship Detections...
                try {
                    // ////
                    // Update GeoServer DataStore...
                    // ////
                    // connect to the store
                    store = connect(dataStoreProp);

                    listenerForwarder.setTask("::EGEOSGeoServerDeployer : deploy Ship detections ")

                    ShipParser shipParser = new ShipParser();

                    File[] shipFiles = pkgDir.listFiles(new ShipDetectionNameFilter());
                    for (File shipFile : shipFiles) {
                        shipParser.parseShip(store, ShipParser.xpath, shipFile);
                    }
                } catch (Throwable cause) {
                    sendError(listenerForwarder, cause.getLocalizedMessage(), cause);
                } finally {
                    try{
                        if (store!=null)
                            store.dispose();
                    } catch (Throwable cause){
                        // nothing
                    }
                    store=null;
                }

                // Forwarding Wind and Wave to GeoBatch METOC Actions...
                File[] ncDerivedFiles = pkgDir.listFiles(new NetCDFNameFilter());

                for (File ncFile : ncDerivedFiles) {
                    //			File destNcFile = new File(SARNetCDFdestDir, ncFile.getName());

                    println("Input NetCDF SAR file name is: "+ncFile.getAbsolutePath());
                    //println("Input NetCDF SAR file name is: "+destNcFile.getAbsolutePath());

                    if (ncFile.exists()) {
                        //				if (destNcFile.delete()) {
                        //					FileUtils.copyFileToDirectory(ncFile, SARNetCDFdestDir, true)
                        println("Input NetCDF SAR file name is: "+ncFile.getAbsolutePath());

                        results.add(ncFile.getAbsolutePath());
                        //				}
                    }
                }
            } else if (type == PackageType.OSW || type == PackageType.OSN) {
                try {
                    // ////
                    // Update GeoServer DataStore...
                    // ////
                    // connect to the store
                    store = connect(dataStoreProp);

                    listenerForwarder.setTask("::EGEOSGeoServerDeployer : deploy OilSpill detections ")

                    // deploy Oil Spills...
                    File[] spillFiles = pkgDir.listFiles(new OilSpillNameFilter());

                    SpillParser spillParser = new SpillParser();
                    for (File spillFile : spillFiles) {
                        spillParser.parseOilSpill(store, SpillParser.xpath, spillFile);
                    }
                } catch (Throwable cause) {
                    sendError(listenerForwarder, cause.getLocalizedMessage(), cause);
                } finally {
                    try{
                        if (store!=null)
                            store.dispose();
                    } catch (Throwable cause){
                        // nothing
                    }
                    store=null;
                }
            } else if (type == PackageType.PRO) {
                //println("PRO: ");

                // retile
                GeoTiffRetilerConfiguration retilerConfig=
                new GeoTiffRetilerConfiguration(configuration.getId(),"EMSA_retiler",configuration.getDescription());
                retilerConfig.setTileH(props.get("reTileH"));
                retilerConfig.setTileW(props.get("reTileW"));
                retilerConfig.setWorkingDirectory(configuration.getWorkingDirectory());
                GeoTiffRetiler retiler=new GeoTiffRetiler(retilerConfig);

                // overview
                GeoTiffOverviewsEmbedderConfiguration overviewConfig=
                new GeoTiffOverviewsEmbedderConfiguration(configuration.getId(),"EMSA_overview",configuration.getDescription());

                overviewConfig.setTileH(props.get("ovTileH"));
                overviewConfig.setTileW(props.get("ovTileW"));
                overviewConfig.setScaleAlgorithm(props.get("scaleAlgorithm"));
                overviewConfig.setDownsampleStep(props.get("downsampleStep"));
                overviewConfig.setNumSteps(props.get("numSteps"));
                overviewConfig.setWorkingDirectory(configuration.getWorkingDirectory());

                GeoTiffOverviewsEmbedder overview=new GeoTiffOverviewsEmbedder(overviewConfig);

                Queue queue=new LinkedList();

                File[] proFiles = pkgDir.listFiles((FilenameFilter)new WildcardFileFilter("*.xml"));
                if (proFiles!=null){
                    List addList = new ArrayList();
                    for (File proXmlFile : proFiles) {
                        File dest=ProParser.copyTif(ProParser.parse(proXmlFile),
                        new File(configuration.getWorkingDirectory()+File.separator)
                        ,120);
                        if (dest!=null){
                            // add file to the list
                            queue.add(new FileSystemEvent(dest,FileSystemEventType.FILE_ADDED));
                            // apply retile
                            listenerForwarder.setTask("::EGEOSGeoServerDeployer :  sending file:" + dest+ " to overview and retiling...");
                            queue=retiler.execute(queue);
                            listenerForwarder.setTask("::EGEOSGeoServerDeployer : Retiler executed");
                            // apply overview
                            queue=overview.execute(queue);
                            listenerForwarder.setTask("::EGEOSGeoServerDeployer : Oeverview executed");

                            // get the output
                            if (queue.size()>0){
                                FileSystemEvent event=queue.peek();
                                dest=event.getSource();
                                addList.add(dest);
                            }
                            else {
                                String message="::EGEOSGeoServerDeployer : problem the output event queue do not contain files!";
                                sendError(listenerForwarder, message, new NullPointerException(message));
                            }
                        }
                        else {
                            String message="EGEOSGeoServerDeployer: Unable to move gif file";
                            sendError(listenerForwarder, message, new NullPointerException(message));
                        }
                    }
                    // create in memory ImageMosaicCommand object
                    ImageMosaicCommand cmd=new ImageMosaicCommand(ImageIODir, addList, null);
                    //println("FILE_PRO_XML_CMD: "+configuration.getWorkingDirectory()+"pro_imagemosaic_cmd.xml");
                    // sterialize the ImageMosaicCommand object
                    File dest=ImageMosaicCommand.serialize(cmd,
		      configuration.getWorkingDirectory()+File.separator+
		      pkgDir.getName()+"_"+
		      Thread.currentThread().getId()+"_"+
		      "pro_imagemosaic_cmd.xml");
                    // add the serialized file to the queue
                    results.add(dest.getAbsolutePath());
                }
            }
        }
        else {
            // ////
            // forwarding event to the next action
            // ////
            // fake event to avoid Failed Status!
            results.add("DONE");
        }
        return results;
    } catch (Throwable cause) {
        sendError(listenerForwarder, cause.getLocalizedMessage(), cause);
    } finally {
        if (store!=null)
        store.dispose();
        store=null;
    }
}

// ///////////////////////////////////////////////////////////////////////////// //
//                                                                               //
//                       E-GEOS - U T I L I T I E S                              //
//                                                                               //
// ///////////////////////////////////////////////////////////////////////////// //

/** ****************************************************************************
 Script Utility Methods...
 **************************************************************************** **/

/**
 * Error forwarder...
 **/
void sendError(final ProgressListenerForwarder listenerForwarder, final String message) throws Exception {
    sendError(listenerForwarder, message, null);
}
void sendError(final ProgressListenerForwarder listenerForwarder, final String message, final Throwable cause) throws Exception {
    /**
     * Default LOGGER
     **/
    final Logger LOGGER = Logger.getLogger(EGEOSDeployerBaseAction.class.toString());

    LOGGER.log(Level.SEVERE, message);
    Exception theCause = (cause != null ? cause : new Exception(message));
    listenerForwarder.failed(theCause);
    throw theCause;
}


private DataStore connect(Properties dataStoreProp) throws IOException {
    // TODO TESTS
    // SPI
    final String SPIClass = dataStoreProp.getProperty("SPI");
    // create a datastore as instructed
    final DataStoreFactorySpi spi = (DataStoreFactorySpi) Class.forName(SPIClass)
    .newInstance();
    final Map<String, Serializable> params = Utils.createDataStoreParamsFromPropertiesFile(
    dataStoreProp, spi);


    // important as there are some chars that need escaping
    // params.put(PostgisNGDataStoreFactory.PREPARED_STATEMENTS.key, Boolean.TRUE);

    dataStore = spi.createDataStore(params);

    if (dataStore == null) {
        final String message="EGEOSGeoServerDeployer::connect(): "
        + "the required resource was not found or if insufficent parameters were given.";
        if (LOGGER.isLoggable(Level.SEVERE)) {
            LOGGER.log(Level.SEVERE,message)
        }
        throw new IOException(message);
    }

    return dataStore;
}


