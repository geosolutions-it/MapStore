/** 
 * Java Imports ...
 **/
import it.geosolutions.geobatch.egeos.deployers.services.EGEOSRegistryDeployerConfiguration
import it.geosolutions.geobatch.egeos.deployers.actions.EGEOSDeployerBaseAction
import it.geosolutions.geobatch.tools.file.Collector;
import it.geosolutions.geobatch.tools.file.Extract;

import java.util.logging.Level
import java.util.logging.Logger

import it.geosolutions.geobatch.flow.event.IProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder

import it.geosolutions.geobatch.flow.event.action.ActionException

import it.geosolutions.geobatch.action.scripting.ScriptingConfiguration

import it.geosolutions.geobatch.action.egeos.emsa.PackageType
import it.geosolutions.geobatch.action.egeos.emsa.EMSAIOUtils

import it.geosolutions.geobatch.egeos.connection.*;
import it.geosolutions.geobatch.egeos.logic.*;
import it.geosolutions.geobatch.egeos.types.src.*;
import it.geosolutions.geobatch.egeos.types.dest.*;

import java.io.File;
import java.io.FilenameFilter;
import org.apache.commons.io.IOCase;
import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils
import org.apache.commons.io.DirectoryWalker;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;

import java.net.MalformedURLException;
import java.net.URL;


/** 
 * Script Main "execute" function
 **/
/* ----------------------------------------------------------------- */
public List execute(ScriptingConfiguration configuration, String eventFilePath, ProgressListenerForwarder listenerForwarder) throws Exception {
    // ////////////////////////////////////////////////////////////////////
    //
    // Initializing input variables from Flow configuration
    //
    // ////////////////////////////////////////////////////////////////////
    /* Map props = configuration.getProperties();
     String example0 = props.get("key0");
     listenerForwarder.progressing(50, example0);
     String example1 = props.get("key1");
     listenerForwarder.progressing(90, example1); */
    
    /* ----------------------------------------------------------------- */
    // Main Input Variables: must be configured
    /** Registry URL **/
    def registryURL = "http://10.20.2.4/ergorr/webservice?wsdl";
    /** Web Service URL 
     *  - IMPORTANT: DON'T FORGET THE '/' AT THE END OF 'httpdServiceURL'
     **/
    def httpdServiceURL = "http://ows-csn.e-geos.it/emsa/";

    /** OGC Web Services GetCapabilities **/
    def wfsGetCapabilities = "http://ows-csn.e-geos.it/geoserver/wfs?SERVICE=wfs&amp;VERSION=1.1.1&amp;REQUEST=GetCapabilities";
    def wcsGetCapabilities = "http://ows-csn.e-geos.it/geoserver/wcs?SERVICE=wcs&amp;VERSION=1.0.0&amp;REQUEST=GetCapabilities";
    def wmsGetCapabilities = "http://ows-csn.e-geos.it/geoserver/wms?SERVICE=wms&amp;VERSION=1.1.0&amp;REQUEST=GetCapabilities";

    try {
println (" **********************************REGISTRY DEPLOYER*********************************** ");
        listenerForwarder.started();
        // ////
        // Instatiate EMSA Utilities
        // ////
        utils = new EMSAUtils();

        // ////
        // some initial checks on input file name
        // ////
        String inputFileName = eventFilePath;
        final String filePrefix = FilenameUtils.getBaseName(inputFileName);
        final String fileSuffix = FilenameUtils.getExtension(inputFileName);
        if (!fileSuffix.equalsIgnoreCase("xml")) {
            sendError(listenerForwarder, "::EGEOSRegistryDeployer : invalid input archive \"" + inputFileName + "\"");
        }

        // ////
        // forwarding some logging information to Flow Logger Listener
        // ////
        listenerForwarder.setTask("::EGEOSRegistryDeployer : Processing event " + eventFilePath)

        /** The outcome events variable **/
        List results = new ArrayList();

        // ////
        // getting package directory
        // ////
        File pkgDir = new File(inputFileName).getParentFile();
        
        EOProcessor eoProcessor = new EOProcessor(pkgDir);
        
        // ////
        // Reading Basic Package Info
        // ////
        File packageFile = new File(inputFileName);
        eoProcessor.setGmlBaseURI(httpdServiceURL + pkgDir.getName());
        
        println("::EGEOSRegistryDeployer : eoProcessor.setGmlBaseURI("+httpdServiceURL + pkgDir.getName()+")");
        
        EarthObservationPackage pkg = eoProcessor.parsePackage();

        // ////
        // Instantiating CSW Connector:
        // - provide here correct Registry URL
        // ////
        URL serviceURL = null;
        try {
            serviceURL = new URL(registryURL);
        } catch (MalformedURLException ex) {
            sendError(listenerForwarder, "::EGEOSRegistryDeployer : Error initializing URL", ex);
        }
        CSWConn conn = new CSWConn(serviceURL);

        // ////
        // Initialize RR Data:
        // - This process ensures the base services and collection datasets have been correctly inserted into RR
        // ////
        initializeRR(serviceURL, conn, wfsGetCapabilities, wcsGetCapabilities, wmsGetCapabilities);

        // ////
        // Send METADATA with appropriate sender...
        // ////
        if (pkg.getPackageType().equals("EO_PRODUCT")) {
            EOPSender eoSender = new EOPSender(eoProcessor);
            eoSender.setServiceURL(serviceURL);
            eoSender.setCollections("SAR:DATA");
            try {
                eoSender.run();
			} catch (IllegalStateException e) {
                // sendError(listenerForwarder, "::EGEOSRegistryDeployer : OK: Caught proper IllegalStateException", e);
            }

				// search for other packages
				Collector c=new Collector(new WildcardFileFilter("*_PCK.xml",IOCase.INSENSITIVE));
				list=c.collect(pkgDir.getParentFile());
				
				for (file in list) {
					//println (" ************************************************************************************** " + pkg.getPackageType());

					eoProcessor = new EOProcessor(file.getParentFile());
					eoProcessor.setGmlBaseURI(httpdServiceURL + file.getParentFile().getName());
        
					//println("::EGEOSRegistryDeployer : eoProcessor.setGmlBaseURI("+httpdServiceURL + file.getParentFile().getName()+")");
        
					pkg = eoProcessor.parsePackage();

					if (pkg.getPackageType().equals("SAR_DERIVED")) {
						try {
							ShipProcessor dsProcessor = new ShipProcessor(file.getParentFile());
							dsProcessor.setGmlBaseURI(httpdServiceURL + file.getParentFile().getName());

							DERSender derSender = new DERSender(dsProcessor);
							derSender.setServiceURL(serviceURL);
							derSender.setCollections("VESSEL:DETECTION");
							derSender.run();
						} catch (Exception e) {
							//sendError(listenerForwarder, "::EGEOSRegistryDeployer : OK: Caught proper IllegalStateException", e);
						}

						try {
							SarDerivedProcessor sdfProcessor = new SarDerivedProcessor(file.getParentFile());
							sdfProcessor.setGmlBaseURI(httpdServiceURL + file.getParentFile().getName());

							derSender = new DERSender(sdfProcessor);
							derSender.setServiceURL(serviceURL);
							derSender.setCollections("WIND", "WAVE");
							derSender.run();
						} catch (Exception e) {
							//sendError(listenerForwarder, "::EGEOSRegistryDeployer : OK: Caught proper IllegalStateException", e);
						}
					} else 
						if (pkg.getPackageType().equals("OS_NOTIFICATION") || pkg.getPackageType().equals("OS_WARNING")) {

						try{
							OilSpillProcessor osProcessor = new OilSpillProcessor(file.getParentFile());
							osProcessor.setBaseGMLURL(httpdServiceURL + file.getParentFile().getName());

							OilSpillSender osSender = new OilSpillSender(osProcessor);
							osSender.setServiceURL(serviceURL);
							osSender.setCollections("OIL:SPILL:WARNING", "OIL:SPILL:NOTIFICATION");
							osSender.run();
						} catch (Exception e) {
							//sendError(listenerForwarder, "::EGEOSRegistryDeployer : OK: Caught proper IllegalStateException", e);
						}
					}
				}
			
        }

        // ////
        // forwarding event to the next action
        // ////
        // fake event to avoid Failed Status!
        results.add("DONE");
        return results;
    } catch (Exception cause) {
        sendError(listenerForwarder, cause.getLocalizedMessage(), cause);
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

/**
 * Initialize Registry
 **/
void initializeRR(URL serviceURL, CSWConn conn, String wfsGetCapabilities, String wcsGetCapabilities, String wmsGetCapabilities) {
    ServicesProcessor serviceProcessor = new ServicesProcessor(wfsGetCapabilities, wcsGetCapabilities, wmsGetCapabilities);
    ServicesSender serviceSender = new ServicesSender(serviceProcessor);
    serviceSender.setServiceURL(serviceURL);

    serviceSender.run();

    CollectionsProcessor collectionProcessor = new CollectionsProcessor("SAR:DATA", "WIND", "WAVE", "VESSEL:DETECTION", "OIL:SPILL:WARNING", "OIL:SPILL:NOTIFICATION");
    CollectionsSender collectionsSender = new CollectionsSender(collectionProcessor);
    collectionsSender.setServiceURL(serviceURL);

    collectionsSender.run();

    if (wfsGetCapabilities != null) {
        def vesselDetectCollection = collectionProcessor.getCollection("VESSEL:DETECTION");
        if (vesselDetectCollection != null) {
            conn.insert(vesselDetectCollection.getServiceAssociationXML("WFS"));
        }

        def oswCollection = collectionProcessor.getCollection("OIL:SPILL:WARNING");
        if (oswCollection != null) {
            conn.insert(oswCollection.getServiceAssociationXML("WFS"));
        }

        def osnCollection = collectionProcessor.getCollection("OIL:SPILL:NOTIFICATION");
        if (osnCollection != null) {
            conn.insert(osnCollection.getServiceAssociationXML("WFS"));
        }
    }

    if (wcsGetCapabilities != null) {
        def sarDataCollection = collectionProcessor.getCollection("SAR:DATA");
        if (sarDataCollection != null) {
            conn.insert(sarDataCollection.getServiceAssociationXML("WCS"));
        }

        def windDataCollection = collectionProcessor.getCollection("WIND");
        if (windDataCollection != null) {
            conn.insert(windDataCollection.getServiceAssociationXML("WCS"));
        }

        def waveDataCollection = collectionProcessor.getCollection("WAVE");
        if (waveDataCollection != null) {
            conn.insert(waveDataCollection.getServiceAssociationXML("WCS"));
        }
    }

    if (wmsGetCapabilities != null) {
        /** VECTORIAL **/
        def vesselDetectCollection = collectionProcessor.getCollection("VESSEL:DETECTION");
        if (vesselDetectCollection != null) {
            conn.insert(vesselDetectCollection.getServiceAssociationXML("WMS"));
        }

        def oswCollection = collectionProcessor.getCollection("OIL:SPILL:WARNING");
        if (oswCollection != null) {
            conn.insert(oswCollection.getServiceAssociationXML("WMS"));
        }

        def osnCollection = collectionProcessor.getCollection("OIL:SPILL:NOTIFICATION");
        if (osnCollection != null) {
            conn.insert(osnCollection.getServiceAssociationXML("WMS"));
        }

        /** RASTER **/
        def sarDataCollection = collectionProcessor.getCollection("SAR:DATA");
        if (sarDataCollection != null) {
            conn.insert(sarDataCollection.getServiceAssociationXML("WMS"));
        }

        def windDataCollection = collectionProcessor.getCollection("WIND");
        if (windDataCollection != null) {
            conn.insert(windDataCollection.getServiceAssociationXML("WMS"));
        }

        def waveDataCollection = collectionProcessor.getCollection("WAVE");
        if (waveDataCollection != null) {
            conn.insert(waveDataCollection.getServiceAssociationXML("WMS"));
        }
    }

}
