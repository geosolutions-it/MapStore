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
package it.geosolutions.geobatch.mariss.actions.acquisitionlist;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

import org.apache.commons.io.FileUtils;
import org.geotools.data.DataStore;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserUtils;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.actions.RemoteServiceHandlingAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.dao.ServiceDAO;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;
import it.geosolutions.geobatch.mariss.model.Service;

/**
 * GeoBatch service data ingestion remote file handling action
 * 
 * @author adiaz
 */
@Action(configurationClass = AcquisitionListActionConfiguration.class)
public class AcquisitionListAction extends RemoteServiceHandlingAction {

    public AcquisitionListAction(AcquisitionListActionConfiguration configuration)
            throws IOException {
        super(configuration);

    }

    private final String ACQ_LIST_FOLDER = "ACQ_LIST";

    /**
    * 
    */
    private ServiceDAO serviceDAO;

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
    private Collection<? extends EventObject> getPostProcessEvents(List<String> pendingProductFiles,
            DataStore dataStore, String user, Service service, String relativeFolder,
            // result remote
            RemoteBrowserProtocol serverResultProtocol, String serverResultUser,
            String serverResultPWD, String serverResultHost, int serverResultPort,
            FTPConnectMode resultConnectMode, int resultTimeout, int usersSize, int userIndex,
            int serviceSize, int serviceIndex, int serviceFoldersSize, int serviceFolderIndex,
            Collection<BaseAction<EventObject>> actionMap) throws IOException, FTPException {

        Queue<EventObject> resultList = new LinkedList<EventObject>();

        // Copy to CSV ingestion path and pre process each file
        for (String filePath : pendingProductFiles) {
            boolean error = false;
            String msg = null;
            File inputFile = new File(filePath);
            // copy to target folder

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
    @Override
    protected Collection<? extends EventObject> ingestServiceData(String user, Service service,
            // remote browser
            RemoteBrowserProtocol serverProtocol, String serverUser, String serverPWD,
            String serverHost, int serverPort, String remotePath, FTPConnectMode connectMode,
            int timeout,
            // result remote
            RemoteBrowserProtocol serverResultProtocol, String serverResultUser,
            String serverResultPWD, String serverResultHost, int serverResultPort,

            FTPConnectMode resultConnectMode, int resultTimeout,
            // input dir
            DataStore dataStore, int usersSize, int userIndex, int serviceSize, int serviceIndex) {

        Queue<EventObject> resultList = new LinkedList<EventObject>();

        try {
            // ONLY FOR OPEN SERVICES (TODO CHANGE INGESTED INTO CLOSED
            if ("AOI".equals(service.getStatus())) {
                // ---

                // obtain service folders
                // TODO: THIS WORKS ONLY ON LINUX LOCALLY
                final String serviceIDFtpPath = remotePath + FTP_SEPARATOR + user + FTP_SEPARATOR
                        + service.getServiceId();

                List<String> serviceFolders = RemoteBrowserUtils.ls(serverProtocol, serverUser,
                        serverPWD, serverHost, serverPort, serviceIDFtpPath, connectMode, timeout,
                        null, true);

                // folder size and folder index
                int serviceFoldersSize = serviceFolders.size();
                int serviceFolderIndex = 0;
                // For each file on the remote directory
                for (String folder : serviceFolders) {

                    serviceFolderIndex++;

                    String localRelativeFolder = user + LOCAL_SEPARATOR + service.getServiceId()
                            + LOCAL_SEPARATOR + folder;
                    String remoteRelativeFolder = user + FTP_SEPARATOR + service.getServiceId()
                            + FTP_SEPARATOR + folder;

                    List<String> pendingProductFiles = new LinkedList<String>();

                    // check if it's observable
                    if (isObservableServiceFolder(service, folder)) {
                        // TODO it works only on LINUX for local directory
                        final String currentRemoteFolder = remotePath + FTP_SEPARATOR
                                + remoteRelativeFolder;

                        if (LOGGER.isInfoEnabled()) {
                            LOGGER.info("Get files in the folder " + currentRemoteFolder);
                        }

                        List<String> fileNames = RemoteBrowserUtils.ls(serverProtocol, serverUser,
                                serverPWD, serverHost, serverPort, currentRemoteFolder, connectMode,
                                timeout, null, Boolean.FALSE);

                        if (LOGGER.isDebugEnabled()) {
                            LOGGER.debug("Processing files ... " + fileNames);
                        }

                        // files size and folder index
                        int serviceFolderFilesSize = fileNames.size();

                        // For each file on the remote directory
                        for (int serviceFolderFileIndex = 0; serviceFolderFileIndex < serviceFolderFilesSize; serviceFolderFileIndex++) {
                            String fileName = fileNames.get(serviceFolderFileIndex);

                            if (LOGGER.isInfoEnabled()) {
                                LOGGER.info("Processing file " + fileName);
                            }
                            // create local folder for this file
                            File inputDir = new File(getTempDir(), user + LOCAL_SEPARATOR
                                    + service.getServiceId() + LOCAL_SEPARATOR + ACQ_LIST_FOLDER);
                            final String csvFileName = CSVIngestUtils
                                    .getUserServiceFileName(fileName, user, service.getServiceId());

                            inputDir.mkdirs();
                            // Download the file
                            File inputFile = RemoteBrowserUtils.downloadFile(serverProtocol,
                                    serverUser, serverPWD, serverHost, serverPort,
                                    currentRemoteFolder + FTP_SEPARATOR + fileName,
                                    inputDir.getAbsolutePath() + LOCAL_SEPARATOR + csvFileName,
                                    timeout);

                            // process the file
                            if (inputFile.exists()) {
                                if (configuration.isDeleteDownloadedFiles()) {
                                    // delete downloaded file
                                    RemoteBrowserUtils.deleteFile(serverProtocol, serverUser,
                                            serverPWD, serverHost, serverPort, timeout, remotePath,
                                            fileName, connectMode);
                                }

                                try {
                                    String msg = "Processing events for user: " + user
                                            + ", service: " + service;

                                    String msg1 = null;

                                    if ("AOI".equals(service.getStatus())
                                            && ACQ_LIST_FOLDER.equals(folder)) {

                                        // copy to target folder
                                        try {

                                            FileSystemEvent event = new FileSystemEvent(inputFile,
                                                    FileSystemEventType.FILE_ADDED);

                                            msg1 = "Processed " + inputFile
                                                    + ". Check the CSV ingestion related";

                                            // update the service status
                                            this.getServiceDAO().updateServiceStatus(service,
                                                    "ACQUISITIONLIST");
                                            resultList.add(event);
                                        } catch (Exception e) {
                                            this.serviceDAO.updateServiceStatus(service, "FAILURE");
                                            msg1 = "Error processing acquisition list ingestion";
                                            LOGGER.error(msg1, e);
                                        }
                                    }

                                    // Package Ready Event added as first
                                    // element of the queue...
                                    updateProgress(usersSize, userIndex, serviceSize, serviceIndex,
                                            serviceFoldersSize, serviceFolderIndex,
                                            serviceFolderFilesSize, serviceFolderFileIndex, false,
                                            msg, inputFile.getAbsolutePath());

                                    // Clean-up inputFile
                                    // inputFile.delete();
                                } catch (Exception e) {
                                    if (LOGGER.isErrorEnabled()) {
                                        LOGGER.error("Error processing " + fileName, e);
                                    }
                                }

                            } else if (LOGGER.isErrorEnabled()) {
                                LOGGER.error("Error downloading " + fileName);
                            }

                        }

                        // Create the Actions map
                        List<BaseAction<EventObject>> actionMap = new ArrayList<BaseAction<EventObject>>();

                        // Creation of the Actions
                        Map<String, ConfigurationContainer> subconfigurations = configuration
                                .getSubconfigurations();
                        if (subconfigurations != null && !subconfigurations.isEmpty()) {
                            // Loop on the containers
                            for (String key : subconfigurations.keySet()) {
                                // Getting configuration container
                                ConfigurationContainer container = subconfigurations.get(key);
                                // Creating a possible configuration
                                IngestionActionConfiguration config = new IngestionActionConfiguration(
                                        key, "configuration", "");
                                config.setMetocDictionaryPath(
                                        configuration.getMetocDictionaryPath());
                                config.setGeoserverDataDirectory(
                                        configuration.getGeoserverDataDirectory());
                                config.setOutputFeature(configuration.getOutputFeature());
                                config.setProductsTableName(configuration.getProductsTableName());
                                config.setShipDetectionsTableName(configuration.getShipDetectionsTableName());
                                config.setOilSpillsTableName(configuration.getOilSpillsTableName());
                                config.setGeoserverPWD(configuration.getGeoserverPWD());
                                config.setGeoserverUID(configuration.getGeoserverUID());
                                config.setGeoserverURL(configuration.getGeoserverURL());
                                config.setContainer(container);
                                config.setServiceName(service.getServiceId());
                                // Getting the action
                                BaseAction<EventObject> action = null;
                                // Using reflection
                                try {
                                    Class<?> clazz = Class.forName(container.getActionClass());
                                    if (clazz != null) {
                                        Constructor<?> constructor = clazz
                                                .getConstructor(IngestionActionConfiguration.class);
                                        if (constructor != null) {
                                            action = (BaseAction<EventObject>) constructor
                                                    .newInstance(config);
                                        }
                                    }
                                } catch (Exception e) {
                                    LOGGER.debug(e.getMessage());
                                }
                                if (action != null) {
                                    File actionTempDir = new File(getTempDir(), key);
                                    try {
                                        FileUtils.forceMkdir(actionTempDir);
                                    } catch (IOException e) {
                                        LOGGER.error(
                                                "Unable to crate Action Temporary directory, falling back to the "
                                                        + "parent one",
                                                e);
                                        actionTempDir = getTempDir();
                                    }
                                    action.setTempDir(actionTempDir);
                                    actionMap.add(action);
                                }
                            }
                        }

                        // Collecting all other products files whenever a
                        // Package Ready event has been received ...
                        resultList.addAll(getPostProcessEvents(pendingProductFiles, dataStore, user,
                                service, localRelativeFolder, serverResultProtocol, folder, folder,
                                folder, resultTimeout, resultConnectMode, resultTimeout, usersSize,
                                userIndex, serviceSize, serviceIndex, serviceFoldersSize,
                                serviceFolderIndex, actionMap));
                    }
                }
                // ---
            }

        } catch (Exception e) {
            LOGGER.error("Error browsing remote server", e);
        }

        return resultList;
    }

    /**
     * Check if this action must observe this folder in the service
     * 
     * @param service
     * @param service
     * @param folder
     * @return true is it's a known folder or false otherwise
     */
    @Override
    protected boolean isObservableServiceFolder(Service service, String folder) {
        // TODO: add known folders for other ingestions
        if (/* !"ACQUISITIONLIST".equals(service.getStatus()) */
        "AOI".equals(service.getStatus()) && ACQ_LIST_FOLDER.equals(folder)) {
            return true;
        } else {
            return false;
        }
    }

}
