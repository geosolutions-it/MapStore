/** 
 * Java Imports ...
 **/
import it.geosolutions.geobatch.egeos.deployers.services.EGEOSRegistryDeployerConfiguration
import it.geosolutions.geobatch.egeos.deployers.actions.EGEOSDeployerBaseAction

import java.util.logging.Level
import java.util.logging.Logger

import it.geosolutions.geobatch.flow.event.IProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder

import it.geosolutions.geobatch.flow.event.action.ActionException

import it.geosolutions.geobatch.action.scripting.ScriptingConfiguration

import it.geosolutions.geobatch.action.egeos.emsa.PackageType
import it.geosolutions.geobatch.action.egeos.emsa.EMSAIOUtils

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils

import java.net.MalformedURLException;
import java.net.URL;

import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.postgis.PostgisNGDataStoreFactory;
import org.geotools.jdbc.JDBCDataStoreFactory;

/** 
 * Script Main "execute" function
 **/
/* ----------------------------------------------------------------- */
public List execute(ScriptingConfiguration configuration, String eventFilePath, ProgressListenerForwarder listenerForwarder) throws Exception {
    /* ----------------------------------------------------------------- */
    // Main Input Variables: must be configured
    /** Web Service URL 
     *  - IMPORTANT: DON'T FORGET THE '/' AT THE END OF 'httpdServiceURL'
     **/
    def httpdServiceURL = "http://ows-csn.e-geos.it/emsa/";

    /** Server physical directory:
     *  - where to copy files
     **/
    def httpdPhysicalBaseDir = "/emsa/out/nfs/registered/";

    try {
        listenerForwarder.started();
        // ////
        // Instatiate EMSA Utilities
        // ////
        utils = new EMSAUtils();

        // ////
        // getting package directory
        // ////
        String inputFileName = eventFilePath;
        final String fileSuffix = FilenameUtils.getExtension(inputFileName);
//        final String filePrefix = FilenameUtils.getBaseName(inputFileName);
        
println("SUFFIX:"+fileSuffix);

        File pkgDir;
        if (fileSuffix.equalsIgnoreCase("xml")) {
			pkgDir= new File(inputFileName).getParentFile()
        }
        else {
			pkgDir= new File(inputFileName);
		}

        // ////
        // forwarding some logging information to Flow Logger Listener
        // ////
        listenerForwarder.setTask("::EGEOSWebDeployer : Processing event " + eventFilePath);

        /** The outcome events variable **/
        List results = new ArrayList();


        // ////
        // Copy files...
        // ////
        // creating sub-folder if not exists...
        File pkgOutputDataDir = utils.createInputDataDirIfNotExists(
												listenerForwarder,
												httpdPhysicalBaseDir + "/" + pkgDir.getName());

println("WEBDeployer:copy "+pkgDir.getAbsolutePath());
println("WEBDeployer:to "+pkgOutputDataDir.getAbsolutePath());

        if (pkgOutputDataDir != null && pkgOutputDataDir.exists() && pkgOutputDataDir.isDirectory()) {
            for (File file : pkgDir.listFiles()){
                if (it.geosolutions.geobatch.tools.file.IOUtils.acquireLock(this, file, 10000)){
println("WEBDeployer:copy file: "+file.getAbsolutePath());
                    File dest=new File(pkgOutputDataDir.getAbsolutePath()+File.separator+file.getName());
println("WEBDeployer:to "+dest.getAbsolutePath());
                    it.geosolutions.geobatch.tools.file.Path.copyFileToNFS(file,dest,10000);
                }
            }
            
//            FileUtils.copyDirectory(pkgDir, pkgOutputDataDir, true);
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
