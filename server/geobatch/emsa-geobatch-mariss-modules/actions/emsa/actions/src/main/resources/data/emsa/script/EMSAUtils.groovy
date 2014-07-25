
// ///////////////////////////////////////////////////////////////////////////// //
//                                                                               //
//                         EMSA - U T I L I T I E S                              //
//                                                                               //
// ///////////////////////////////////////////////////////////////////////////// //

import java.util.logging.Level
import java.util.logging.Logger

import java.util.List
import java.util.ArrayList

import java.util.logging.Level

import it.geosolutions.geobatch.flow.event.IProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListener
import it.geosolutions.geobatch.flow.event.ProgressListenerForwarder

import it.geosolutions.geobatch.flow.event.action.ActionException

import it.geosolutions.geobatch.action.egeos.emsa.PackageType;
import it.geosolutions.geobatch.action.scripting.ScriptingConfiguration

import org.apache.commons.io.FileUtils
import org.apache.commons.io.FilenameUtils


class EMSAUtils {

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
        final Logger LOGGER = Logger.getLogger(EMSAUtils.class.toString());

        LOGGER.log(Level.SEVERE, message);
        Exception theCause = (cause != null ? cause : new Exception(message));
        listenerForwarder.failed(theCause);
        throw theCause;
    }

    /**
     * Create Input Data Dir -
     *  - where to extract the packages for further processing
     **/
    File createInputDataDirIfNotExists(final ProgressListenerForwarder listenerForwarder, final String path) throws Exception {
        File inputDataDir = new File(path);
        if (inputDataDir.exists() && inputDataDir.isDirectory()) {
            return inputDataDir;
        } else if (!inputDataDir.exists()){
            if (inputDataDir.mkdirs()) {
                return inputDataDir;
            } else {
                sendError(listenerForwarder,"Could not create EMSA input data dir.");
            }
        }

        sendError(listenerForwarder,"Input data dir path specified already exists and is not a folder.");
    }

    /**
     * Retrieve Package Type from its full name
     *  - expected a package name ending with "_<type>"
     **/
    PackageType getPackageTypeFromName(final String name) {
        if (name == null)
            return null;

        String suffix = name.substring(name.lastIndexOf("_")+1);
        try {
            return PackageType.valueOf(suffix)
        } catch (Exception e) {
            return null;
        }
    }
    
    
   
}
