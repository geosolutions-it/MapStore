package it.geosolutions.geobatch.metocs.utils.io.rest;



import it.geosolutions.tools.io.file.IOUtils;
import it.geosolutions.tools.io.file.reader.TextReader;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.URL;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.net.ssl.SSLEngineResult.Status;
import javax.xml.ws.Response;

import org.springframework.asm.commons.Method;
import org.springframework.http.MediaType;

import sun.misc.Request;
import sun.misc.Resource;


//import it.geosolutions.tools.io.file.IOUtils;
//import it.geosolutions.tools.io.file.reader.TextReader;
//
//import java.io.File;
//import java.io.RandomAccessFile;
//import java.nio.channels.FileChannel;
//import java.nio.channels.FileLock;
//
//import javax.net.ssl.SSLEngineResult.Status;
//import javax.xml.ws.Response;
//
//import org.apache.log4j.Level;
//import org.apache.log4j.Logger;
//import org.geotools.data.ows.Request;
//import org.springframework.asm.commons.Method;
//import org.springframework.http.MediaType;
//
//import sun.misc.Resource;

//import it.geosolutions.geobatch.tools.file.IOUtils;
//import it.geosolutions.geobatch.tools.file.reader.TextReader;
//
//import java.io.File;
//import java.io.RandomAccessFile;
//import java.nio.channels.FileChannel;
//import java.nio.channels.FileLock;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//
//import org.restlet.data.MediaType;
//import org.restlet.data.Method;
//import org.restlet.data.Request;
//import org.restlet.data.Response;
//import org.restlet.data.Status;
//import org.restlet.resource.Resource;
//import org.restlet.resource.StringRepresentation;


/**
 * 
 * @author Fabiani
 * 
 */
public class PublishRestletResource 
//extends Resource 
{

    private final static Logger LOGGER = Logger.getLogger(PublishRestletResource.class.toString());

    private PublishingRestletGlobalConfig config;

    public PublishingRestletGlobalConfig getConfig() {
        return config;
    }

    public void setConfig(PublishingRestletGlobalConfig config) {
        this.config = config;
    }

    public PublishRestletResource() {
    }

    public PublishRestletResource(PublishingRestletGlobalConfig config) {
        this.config = config;
    }

//    /*
//     * (non-Javadoc)
//     * 
//     * @see org.restlet.resource.Resource#allowDelete()
//     */
//    @Override
//    public boolean allowDelete() {
//        return false;
//    }
//
//    /*
//     * (non-Javadoc)
//     * 
//     * @see org.restlet.resource.Resource#allowGet()
//     */
//    @Override
//    public boolean allowGet() {
//        return true;
//    }
//
//    /*
//     * (non-Javadoc)
//     * 
//     * @see org.restlet.resource.Resource#allowPost()
//     */
//    @Override
//    public boolean allowPost() {
//        return false;
//    }
//
//    /*
//     * (non-Javadoc)
//     * 
//     * @see org.restlet.resource.Resource#allowPut()
//     */
//    @Override
//    public boolean allowPut() {
//        return true;
//    }
//
//    /*
//     * (non-Javadoc)
//     * 
//     * @see org.restlet.resource.Resource#handleGet()
//     */
//    @Override
//    public void handleGet() {
//        Request request = getRequest();
//        Response response = getResponse();
//
//        if (request.getMethod().equals(Method.GET)) {
//            LOGGER.info("Handling the call...");
//
//            String file = (String) request.getAttributes().get("file");
//
//            if (file == null) {
//                response.setEntity(new StringRepresentation("Unrecognized extension: " + file,
//                        MediaType.TEXT_PLAIN));
//                response.setStatus(Status.CLIENT_ERROR_BAD_REQUEST);
//                return;
//            }
//
//            // search for the base directory
//            // File workingDir=null;
//            // try {
//            // workingDir = Path.findLocation(config.getRootDirectory(),
//            // new File(((FileBaseCatalog)
//            // CatalogHolder.getCatalog()).getBaseDirectory()));
//            // } catch (IOException e) {
//            // response.setEntity(new StringRepresentation("Internal error "));
//            // response.setStatus(Status.SERVER_ERROR_INTERNAL);
//            // if(LOGGER.isLoggable(Level.SEVERE))
//            // LOGGER.log(Level.SEVERE,e.getLocalizedMessage(),e);
//            // return;
//            // }
//            // if (workingDir == null ||
//            // !workingDir.exists()||!workingDir.canRead()||!workingDir.isDirectory())
//            // {
//            // response.setEntity(new StringRepresentation("Internal error "));
//            // response.setStatus(Status.SERVER_ERROR_INTERNAL);
//            // if(LOGGER.isLoggable(Level.SEVERE))
//            // LOGGER.severe("Unable to work with the provided working directory:"+(workingDir!=null?workingDir:""));
//            // return;
//            // }
//            //            
//            // get the requested file, if it exists
//            File inputFile = new File(config.getRootDirectory(), file);
//
//            if (inputFile.exists() && inputFile.isFile()) {
//                // try {
//
//                // lock the file
//                RandomAccessFile raf = null;
//                FileChannel channel = null;
//                FileLock lock = null;
//                try {
//                    raf = new RandomAccessFile(inputFile, "r");
//                    channel = raf.getChannel();
//                    lock = channel.lock(0, Long.MAX_VALUE, true);
//                    response.setEntity(TextReader.toString(inputFile), MediaType.TEXT_XML);
//                    return;
//                } catch (Throwable e) {
//                } finally {
//                    try {
//                        if (raf != null)
//                            raf.close();
//                    } catch (Throwable e) {
//                        if (LOGGER.isLoggable(Level.FINE))
//                            LOGGER.log(Level.FINE, e.getLocalizedMessage(), e);
//                    }
//
//                    try {
//                        if (channel != null)
//                            IOUtils.closeQuietly(channel);
//                    } catch (Throwable e) {
//                        if (LOGGER.isLoggable(Level.FINE))
//                            LOGGER.log(Level.FINE, e.getLocalizedMessage(), e);
//                    }
//
//                    try {
//                        if (lock != null)
//                            lock.release();
//                    } catch (Throwable e) {
//                        if (LOGGER.isLoggable(Level.FINE))
//                            LOGGER.log(Level.FINE, e.getLocalizedMessage(), e);
//                    }
//
//                }
//
//                LOGGER.severe("Could not acquire file lock: " + inputFile.getAbsolutePath());
//                response.setEntity(Status.SERVER_ERROR_INTERNAL);
//
//                // if (IOUtils.acquireLock(this, inputFile)) {
//                // response.setEntity(IOUtils.toString(inputFile),
//                // MediaType.TEXT_XML);
//                // } else {
//                // LOGGER.severe("Could not acquire file lock: " +
//                // inputFile.getAbsolutePath());
//                // response.setEntity(Status.SERVER_ERROR_INTERNAL);
//                // }
//
//            } else {
//                LOGGER.severe("Could not find file: " + inputFile.getAbsolutePath());
//                response.setEntity(Status.CLIENT_ERROR_BAD_REQUEST);
//            }
//        } else {
//            response.setStatus(Status.SERVER_ERROR_NOT_IMPLEMENTED);
//        }
//    }

}
