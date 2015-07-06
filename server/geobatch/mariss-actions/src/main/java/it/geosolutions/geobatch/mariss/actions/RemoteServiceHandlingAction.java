/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserUtils;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.dao.ServiceDAO;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;
import it.geosolutions.geobatch.mariss.ingestion.product.DataPackageIngestionProcessor;
import it.geosolutions.geobatch.mariss.model.Service;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.geotools.data.DataStore;
import org.geotools.jdbc.JDBCDataStore;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;

/**
 * Abstract GeoBatch service data ingestion remote file handling action
 * Iterate remote user folders and check active services on the database for them. 
 * 
 * Setup configuration and then call a method for each service to be implemented by sub-classes, to ingest data properly.
 * 
 * @author adiaz
 */
@Action(configurationClass = RemoteServiceHandlingConfiguration.class)
public abstract class RemoteServiceHandlingAction extends BaseAction<EventObject> {

    /**
     * File separator
     */
    protected static String FTP_SEPARATOR = "/";

    protected static String LOCAL_SEPARATOR = File.separator;

    /**
     * Action configuration
     */
    protected RemoteServiceHandlingConfiguration configuration;


    /**
     * 
     */
    private ServiceDAO serviceDAO;

    // private Map<String, BaseAction<EventObject>> actionMap = new HashMap<String, BaseAction<EventObject>>();

    public RemoteServiceHandlingAction(final RemoteServiceHandlingConfiguration configuration)
            throws IOException {
        super(configuration);
        this.configuration = configuration;
    }

    /**
     * Check if the configuration it's correctly. Just obtain the data source
     */
    public boolean checkConfiguration() {
        DataStore ds = null;
        try {
            // Don't read configuration for the file, just
            // this.outputfeature configuration
            ds = FeatureConfigurationUtil.createDataStore(configuration.getOutputFeature());
            if (!(ds instanceof JDBCDataStore)) {
                LOGGER.error("Incorrect datasource for this action");
                return false;
            } else {
                return true;
            }
        } catch (Exception e) {
            LOGGER.error("Incorrect datasource for this action");
            return false;
        } finally {
            ds.dispose();
        }
    }

    /**
     * Check if exists a file on a remote
     * 
     * @param serverProtocol
     * @param serverUser
     * @param serverHost
     * @param serverPWD
     * @param serverPort
     * @param path
     * @param fileName
     * @param connectMode
     * @param timeout
     * @return
     * @throws IOException
     * @throws FTPException
     * @throws ParseException
     */
    protected boolean checkIfExists(RemoteBrowserProtocol serverProtocol, String serverUser,
            String serverHost, String serverPWD, int serverPort, String path, String fileName,
            FTPConnectMode connectMode, int timeout) throws IOException, FTPException,
            ParseException {
        return RemoteBrowserUtils.checkIfExists(serverProtocol, serverUser, serverHost, serverPWD,
                serverPort, path, fileName, connectMode, timeout);
    }

    /**
     * Check if a file exists
     * 
     * @param inputDir
     * @param fileName
     * @return
     */
    protected boolean checkIfExists(String inputDir, String fileName) {
        File file = new File(inputDir + LOCAL_SEPARATOR + fileName);
        return file.exists();
    }

    /**
     * Move the file to the success or fail folder once it was handled
     * 
     * @param availableProducts
     * @param error
     * @param relativeFolder
     * @param localRelativeFolder
     * @param serverResultProtocol
     * @param serverResultUser
     * @param serverResultPWD
     * @param serverResultHost
     * @param serverResultPort
     * @param resultConnectMode
     * @param resultTimeout
     * @return
     * @throws IOException
     * @throws FTPException
     */
    private List<String> collectPostProcessingFiles(List<String> availableProducts,
            String productsFtpFolder,
            String localRelativeFolder, // result remote
            RemoteBrowserProtocol serverResultProtocol, String serverResultUser,
            String serverResultPWD, String serverResultHost, int serverResultPort,
            FTPConnectMode resultConnectMode, int resultTimeout) throws IOException, FTPException {

        List<String> products = new ArrayList<String>();
        
        for (String productFile : availableProducts) {

            

            // Eligible for post processing.
            final File inputFile = new File(productsFtpFolder, productFile);
            String targetPath = null;
           
            // success: put on success dir
            targetPath = productsFtpFolder + LOCAL_SEPARATOR + configuration.getSuccesPath();
           

            // MOVE FILES IN THE INGESTION DIR
            if (!productFile.equalsIgnoreCase("packageready.txt")){
	            File destFile = new File(targetPath,inputFile.getName());
	            FileUtils.moveFile(inputFile, destFile); 
	            products.add(destFile.getAbsolutePath());
            }
            // add the targetFile to the list
            
            // clean  file in the input directory
            inputFile.delete();
        }

        return products;
    }

    /**
     * Browse the remote server and call to known process for each new file
     * 
     * @param cfg
     * @param dataStore
     * @return
     * @throws ActionException
     */
    public Queue<EventObject> doProcess(RemoteServiceHandlingConfiguration cfg,
            JDBCDataStore dataStore) throws ActionException {

        Queue<EventObject> resultList = new LinkedList<EventObject>();
        try {


            
            //TODO remove these parameters initialization and use configuration in subclasses instead
            // Remote server configuration
            String remotePath = cfg.getInputRemotePath();
            RemoteBrowserProtocol serverProtocol = configuration.getRemoteBrowserConfiguration()
                    .getServerProtocol();
            String serverHost = configuration.getRemoteBrowserConfiguration().getFtpserverHost();
            String serverUser = configuration.getRemoteBrowserConfiguration().getFtpserverUSR();
            String serverPWD = configuration.getRemoteBrowserConfiguration().getFtpserverPWD();
            int serverPort = configuration.getRemoteBrowserConfiguration().getFtpserverPort();
            int timeout = configuration.getRemoteBrowserConfiguration().getTimeout();
            final FTPConnectMode connectMode = configuration.getRemoteBrowserConfiguration()
                    .toString().equalsIgnoreCase(FTPConnectMode.ACTIVE.toString()) ? FTPConnectMode.ACTIVE
                    : FTPConnectMode.PASV;

            // Remote server result configuration
            RemoteBrowserProtocol serverResultProtocol = null;
            String serverResultHost = null;
            String serverResultUser = null;
            String serverResultPWD = null;
            int serverResultPort = 0;
            int resultTimeout = 0;
            FTPConnectMode resultConnectMode = null;
            if (configuration.getRemoteResultBrowserConfiguration() != null
                    && !configuration.isStoreLocal()) {
                serverResultHost = configuration.getRemoteResultBrowserConfiguration()
                        .getFtpserverHost();
                serverResultUser = configuration.getRemoteResultBrowserConfiguration()
                        .getFtpserverUSR();
                serverResultPWD = configuration.getRemoteResultBrowserConfiguration()
                        .getFtpserverPWD();
                serverResultPort = configuration.getRemoteResultBrowserConfiguration()
                        .getFtpserverPort();
                resultTimeout = configuration.getRemoteResultBrowserConfiguration().getTimeout();
                resultConnectMode = configuration.getRemoteResultBrowserConfiguration().toString()
                        .equalsIgnoreCase(FTPConnectMode.ACTIVE.toString()) ? FTPConnectMode.ACTIVE
                        : FTPConnectMode.PASV;
            }

            // File pattern
            Pattern pattern = configuration.getFilePattern() != null ? Pattern
                    .compile(configuration.getFilePattern()) : null;

            // iterate by services
            Map<String, List<Service>> servicesByUser = getCurrentServices(serverProtocol,
                    serverUser, serverPWD, serverHost, serverPort, remotePath, connectMode,
                    timeout, pattern);

            // user size and index
            int usersSize = servicesByUser.keySet().size();
            int userIndex = 0;
            
            //
            //ITERATE SERVICES USER BY USER
            //
            for (String user : servicesByUser.keySet()) {
                // service size and index
                userIndex++;
                int serviceSize = servicesByUser.get(user).size();
                int serviceIndex = 0;
                for (Service service : servicesByUser.get(user)) {
                    serviceIndex++;
                    resultList.addAll(ingestServiceData(user, service, serverProtocol, serverUser,
                            serverPWD, serverHost, serverPort, remotePath, connectMode, timeout,
                            serverResultProtocol, serverResultUser, serverResultPWD,
                            serverResultHost, serverResultPort, resultConnectMode, resultTimeout,
                             dataStore, usersSize, userIndex, serviceSize, serviceIndex));
                }
            }

        } catch (Exception ex) {
            LOGGER.error("Error in importing service data", ex);
            throw new ActionException(this, "Error in importing service data", ex);
        }

        return resultList;

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
                        @SuppressWarnings("unused")
                        File file = fileEvent.getSource();
                        // Don't read configuration for the file, just
                        // this.outputfeature configuration
                        DataStore ds = FeatureConfigurationUtil.createDataStore(configuration
                                .getOutputFeature());
                        if (ds == null) {
                            throw new ActionException(this, "Can't find datastore ");
                        }
                        try {
                            if (!(ds instanceof JDBCDataStore)) {
                                throw new ActionException(this, "Bad Datastore type "
                                        + ds.getClass().getName());
                            }
                            JDBCDataStore dataStore = (JDBCDataStore) ds;
                            dataStore.setExposePrimaryKeyColumns(true);
                            // return next events configurations
                            Queue<EventObject> resultEvents = doProcess(configuration, dataStore);
                            ret.addAll(resultEvents);
                        } finally {
                            ds.dispose();
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

    /**
     * Get the services by users from the remote server (first and second level in the tree)
     * 
     * @param serverProtocol
     * @param userName
     * @param password
     * @param host
     * @param port
     * @param rootPath
     * @param connectMode
     * @param timeout
     * @param pattern
     * @return
     */
    protected Map<String, List<Service>> getCurrentServices(RemoteBrowserProtocol serverProtocol,
            String userName, String password, String host, int port, String rootPath,
            FTPConnectMode connectMode, int timeout, Pattern pattern) {
        Map<String, List<Service>> servicesByUser = null;

        try {
            servicesByUser = new HashMap<String, List<Service>>();

            // obtain users
            List<String> users = RemoteBrowserUtils.ls(serverProtocol, userName, password, host,
                    port, rootPath, connectMode, timeout, pattern, true);

            // For each file on the remote directory
            for (String user : users) {

                /*
                 * List<String> services = RemoteBrowserUtils.ls(serverProtocol, userName, password, host, port, rootPath + FTP_SEPARATOR + user,
                 * connectMode, timeout, pattern, true);
                 * 
                 * servicesByUser.put(user, services);
                 */

                servicesByUser.put(user, this.serviceDAO.findByUser(user));
            }
        } catch (Exception e) {
            LOGGER.error("Error browsing remote server", e);
        }
        return servicesByUser;
    }

    /**
     * Obtain post process events for CSV files
     * 
     * @param pendingProductFiles
     * @param dataStore
     * @param user
     * @param service
     * @param relativeFolder
     * @param serverResultProtocol
     * @param serverResultUser
     * @param serverResultPWD
     * @param serverResultHost
     * @param serverResultPort
     * @param resultConnectMode
     * @param resultTimeout
     * @param usersSize
     * @param userIndex
     * @param serviceSize
     * @param serviceIndex
     * @param serviceFoldersSize
     * @param serviceFolderIndex
     * @param actionMap
     * @return
     * @throws IOException
     * @throws FTPException
     */
    private Collection<? extends EventObject> getPostProcessEvents(
            List<String> pendingProductFiles,
            DataStore dataStore,
            String user,
            Service service,
            String relativeFolder,
            // result remote
            RemoteBrowserProtocol serverResultProtocol, String serverResultUser,
            String serverResultPWD, String serverResultHost, int serverResultPort,
            FTPConnectMode resultConnectMode, int resultTimeout, int usersSize, int userIndex,
            int serviceSize, int serviceIndex, int serviceFoldersSize, int serviceFolderIndex,
            Collection<BaseAction<EventObject>> actionMap) throws IOException, FTPException {

        Queue<EventObject> resultList = new LinkedList<EventObject>();

        // check if each CSV file type 1 to 3 CSV has also a CSV file type 5
        List<String> failFiles = DataPackageIngestionProcessor.checkCSVFiles(pendingProductFiles);

        // Copy to CSV ingestion path and pre process each file
        for (String filePath : pendingProductFiles) {
            boolean error = false;
            String msg = null;
            File inputFile = new File(filePath);
            // copy to target folder
            if (failFiles.contains(filePath)) {
                //TODO copy to error
                LOGGER.error("Error processing the CSV " + filePath
                        + ". Another CSV file is not included in the package");
                error = true;
            } else {
                try {
                    String csvFileName = CSVIngestUtils.getUserServiceFileName(inputFile.getName(),
                            user, service.getServiceId());
                    File targetFile = new File(relativeFolder + File.separator + csvFileName);
                    FileUtils.copyFile(inputFile, targetFile);
                    FileSystemEvent event = new FileSystemEvent(targetFile,
                            FileSystemEventType.FILE_ADDED);
                    msg = "Processed " + inputFile + ". Check the CSV ingestion related";
                    resultList.add(event);
                } catch (IOException e) {
                    LOGGER.error("Error processing acquisition list ingestion", e);
                    error = true;
                }
            }
            // Post process.
            if (!actionMap.isEmpty()) {
                // Simulating a sequential flow
                Queue<EventObject> events = new ArrayBlockingQueue<EventObject>(1000000);
                events.add(new FileSystemEvent(inputFile, FileSystemEventType.FILE_ADDED));
                for (BaseAction<EventObject> action : actionMap) {
                    try {
                        events.addAll(action.execute(events));
                    } catch (ActionException e) {
                        LOGGER.error(e.getMessage(), e);
                    }
                }
                // Filling the ResultList
                resultList.addAll(events);
            }

            /*
             * colctPostProcessingFiles(inputFile, error, relativeFolder, // result remote serverResultProtocol, serverResultUser, serverResultPWD,
             * serverResultHost, serverResultPort, resultConnectMode, resultTimeout);
             */

            updateProgress(usersSize, userIndex, serviceSize, serviceIndex, serviceFoldersSize,
                    serviceFolderIndex, null, null, error, msg, inputFile.getAbsolutePath());
        }

        return resultList;
    }

    /**
     * @return the serviceDAO
     */
    public ServiceDAO getServiceDAO() {
        return serviceDAO;
    }

    /**
     * Ingest new data for a service
     * 
     * @param user
     * @param service
     * @param serverProtocol
     * @param serverUser
     * @param serverPWD
     * @param serverHost
     * @param serverPort
     * @param remotePath
     * @param connectMode
     * @param timeout
     * @param serverResultProtocol
     * @param serverResultUser
     * @param serverResultPWD
     * @param serverResultHost
     * @param serverResultPort
     * @param resultConnectMode
     * @param resultTimeout
     * @param dataStore
     * @param serviceIndex
     * @param serviceSize
     * @param userIndex
     * @param usersSize
     * @param serviceIndex
     * @param serviceSize
     * @param serviceIndex2
     * @param serviceSize2
     * @return
     */
    protected abstract Collection<? extends EventObject> ingestServiceData(
            String user,
            Service service,
            // remote browser
            RemoteBrowserProtocol serverProtocol,
            String serverUser,
            String serverPWD,
            String serverHost,
            int serverPort,
            String remotePath,
            FTPConnectMode connectMode,
            int timeout,
            // result remote
            RemoteBrowserProtocol serverResultProtocol,
            String serverResultUser,
            String serverResultPWD,
            String serverResultHost,
            int serverResultPort,
            
            FTPConnectMode resultConnectMode, int resultTimeout,
            DataStore dataStore, int usersSize, int userIndex, int serviceSize,
            int serviceIndex) ;

    /**
     * Check if this action must observe this folder in the service
     * 
     * @param service
     * @param service
     * @param folder
     * @return true is it's a known folder or false otherwise
     */
    abstract protected boolean isObservableServiceFolder(Service service, String folder) ;

    /**
     * Delegated on utilities class
     * 
     * @param succesPath
     * @param relativeFolder
     * @throws IOException
     */
    private void mkdir(String succesPath, String relativeFolder) throws IOException {
        FileUtils.forceMkdir(new File(succesPath + LOCAL_SEPARATOR + relativeFolder));
    }

    /**
     * Delegated on utilities class
     * 
     * @param serverResultProtocol
     * @param serverResultUser
     * @param serverResultHost
     * @param serverResultPWD
     * @param serverResultPort
     * @param succesPath
     * @param relativeFolder
     * @param resultConnectMode
     * @param resultTimeout
     * @throws IOException
     * @throws FTPException
     * @throws ParseException
     */
    private void remotemkdir(RemoteBrowserProtocol serverResultProtocol, String serverResultUser,
            String serverResultHost, String serverResultPWD, int serverResultPort,
            String succesPath, String relativeFolder, FTPConnectMode resultConnectMode,
            int resultTimeout) throws IOException, FTPException, ParseException {
        RemoteBrowserUtils.forceMkdir(serverResultProtocol, serverResultUser, serverResultHost,
                serverResultPWD, serverResultPort, succesPath, relativeFolder, resultConnectMode,
                resultTimeout);
    }

    /**
     * @param serviceDAO the serviceDAO to set
     */
    @Resource(name = "geoBatchMARISSServiceDAO")
    public void setServiceDAO(ServiceDAO serviceDAO) {
        this.serviceDAO = serviceDAO;
    }

    /**
     * Save progress information for a task
     * 
     * @param progress
     * @param msg
     */
    protected void updateProgress(float progress, String msg) {
        listenerForwarder.setProgress(progress);
        listenerForwarder.setTask(msg);
        listenerForwarder.progressing();
    }

    /**
     * Update the status of the listener
     * 
     * @param usersSize
     * @param userIndex
     * @param serviceSize
     * @param serviceIndex
     * @param serviceFoldersSize
     * @param serviceFolderIndex
     * @param serviceFolderFilesSize
     * @param serviceFolderFileIndex
     * @param error
     * @param msg
     * @param fileName
     */
    protected void updateProgress(int usersSize, int userIndex, int serviceSize, int serviceIndex,
            int serviceFoldersSize, int serviceFolderIndex, Integer serviceFolderFilesSize,
            Integer serviceFolderFileIndex, boolean error, String msg, String fileName) {
        float userProgress = (float) userIndex / usersSize;
        float serviceProgress = (float) serviceIndex / serviceSize;
        float serviceFoldersProgress = (float) serviceFolderIndex / serviceFoldersSize;
        float serviceFolderFilesProgress = 1;
        if (serviceFolderFilesSize != null && serviceFolderFileIndex != null) {
            serviceFolderFilesProgress = (float) serviceFolderFileIndex / serviceFolderFilesSize;
        }
        // prepare and update the listener
        float totalProgress = userProgress * serviceProgress * serviceFoldersProgress
                * serviceFolderFilesProgress * 100;
        String finalMsg = msg;
        if (error || msg == null) {
            finalMsg += "\nError handling the file: " + fileName;
        } else {
            finalMsg += "\nSuccessfull file handling: " + fileName;
        }
        updateProgress(totalProgress, finalMsg);

    }

}
