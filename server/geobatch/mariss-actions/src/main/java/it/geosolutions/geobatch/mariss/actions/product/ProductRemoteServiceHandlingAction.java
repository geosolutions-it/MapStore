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
package it.geosolutions.geobatch.mariss.actions.product;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.geotools.data.DataStore;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.XStreamException;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.sync.model.FileMetadataWrapper;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserUtils;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.actions.MarissConstants;
import it.geosolutions.geobatch.mariss.actions.RemoteServiceHandlingAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.dao.ServiceDAO;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;
import it.geosolutions.geobatch.mariss.ingestion.product.DataPackageIngestionProcessor;
import it.geosolutions.geobatch.mariss.model.Service;

/**
 * GeoBatch service data ingestion remote file handling action
 * 
 * @author adiaz
 */
@Action(configurationClass = ProductActionConfiguration.class)
public class ProductRemoteServiceHandlingAction extends RemoteServiceHandlingAction {

    private static final String PACKAGEREADY_TXT = "packageready.txt";

    private ProductActionConfiguration productConfiguration;

    public ProductRemoteServiceHandlingAction(ProductActionConfiguration configuration)
            throws IOException {
        super(configuration);
        productConfiguration = configuration;
    }

    private final String PRODUCTS_FOLDER = "PRODUCTS";

    /**
    * 
    */
    private ServiceDAO serviceDAO;

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
            String productsFtpFolder, String localRelativeFolder, // result remote
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
            if (!productFile.equalsIgnoreCase(PACKAGEREADY_TXT)) {
                File destFile = new File(targetPath, inputFile.getName());
                FileUtils.moveFile(inputFile, destFile);
                products.add(destFile.getAbsolutePath());
            }
            // add the targetFile to the list

            // clean file in the input directory
            inputFile.delete();
        }

        return products;
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
    private Collection<? extends EventObject> getPostProcessEvents(List<String> pendingProductFiles,
            DataStore dataStore, String user, Service service, String relativeFolder,
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
                // TODO copy to error
                LOGGER.error("Error processing the CSV " + filePath
                        + ". Another CSV file is not included in the package");
                error = true;
            } else {
                String csvFileName = CSVIngestUtils.getUserServiceFileName(inputFile.getName(),
                        user, service.getServiceId());
                File targetFile = new File(relativeFolder, csvFileName);
                if (productConfiguration.getCreateFileEventWrapperTo() != null) {
                    String writeTo = productConfiguration.getCreateFileEventWrapperTo();
                    boolean matched = false;
                    matched = true;
                    String destinationDir = null;
                    destinationDir = writeTo.replace("${GEOBATCH_CONFIG_DIR}",
                            this.getConfigDir().getAbsolutePath());

                    FileUtils.forceMkdir(new File(destinationDir));
                    targetFile = new File(destinationDir, csvFileName + ".xml");
                    try {
                        createProductAttributeFile(targetFile, filePath, user, service);
                    } catch (ActionException e) {
                        LOGGER.error("Unable to create product ingestion for service:"
                                + service.toString());
                    }
                    FileSystemEvent event = new FileSystemEvent(targetFile,
                            FileSystemEventType.FILE_ADDED);
                    resultList.add(event);

                } else {

                    FileSystemEvent event = new FileSystemEvent(targetFile,
                            FileSystemEventType.FILE_ADDED);
                    resultList.add(event);

                }
                msg = "Scheduled " + inputFile.getName();
            }
            // Post process.
            if (!actionMap.isEmpty()) {
                // Simulating a sequential flow
                Queue<EventObject> events = new ArrayBlockingQueue<EventObject>(1000000);
                events.add(new FileSystemEvent(inputFile, FileSystemEventType.FILE_ADDED));
                if (productConfiguration.getExecuteActions() == true) {
                    for (BaseAction<EventObject> action : actionMap) {
                        try {

                            events.addAll(action.execute(events));

                        } catch (ActionException e) {
                            LOGGER.error(e.getMessage(), e);
                            error = true;
                        }
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

    private void createProductAttributeFile(File outputFile, String filePath, String user,
            Service service) throws ActionException {
        FileWriter fw = null;
        FileMetadataWrapper attributeObject = new FileMetadataWrapper();
        List<String> files = new ArrayList<String>();
        files.add(filePath);
        File inputFile = new File(filePath);

        attributeObject.setFiles(files);
        attributeObject.addMetadata(MarissConstants.ORIGINAL_FILE_PATH_KEY, filePath);
        attributeObject.addMetadata(MarissConstants.SERVICE_KEY, service.getServiceId());
        attributeObject.addMetadata(MarissConstants.USER_KEY, service.getUser());
        attributeObject.addMetadata(MarissConstants.PRODUCTID_KEY,
                inputFile.getName().substring(0, inputFile.getName().length() - 8));

        XStream xstream = new XStream();
        try {

            fw = new FileWriter(outputFile);
            xstream.toXML(attributeObject, fw);

        } catch (XStreamException e) {
            if (LOGGER.isErrorEnabled())
                LOGGER.error("The passed event object cannot be serialized to: "
                        + outputFile.getAbsolutePath(), e);
            if (!configuration.isFailIgnored()) {
                listenerForwarder.failed(e);
                throw new ActionException(this, e.getLocalizedMessage());
            }
        } catch (Throwable e) {
            // the object cannot be deserialized
            if (LOGGER.isErrorEnabled())
                LOGGER.error(e.getLocalizedMessage(), e);
            if (!configuration.isFailIgnored()) {
                listenerForwarder.failed(e);
                throw new ActionException(this, e.getLocalizedMessage());
            }
        } finally {
            IOUtils.closeQuietly(fw);
        }

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
     * @param inputDir
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

            FTPConnectMode resultConnectMode, int resultTimeout, DataStore dataStore,

            // progress
            int usersSize, int userIndex, int serviceSize, int serviceIndex) {

        Queue<EventObject> resultList = new LinkedList<EventObject>();

        try {
            // ONLY FOR OPEN SERVICES (TODO CHANGE INGESTED INTO CLOSED
            if ("ACQUISITIONPLAN".equals(service.getStatus())) {
                // ---

                // obtain service folders
                String separator = configuration.isStoreLocal() ? LOCAL_SEPARATOR : FTP_SEPARATOR;
                final String serviceIDFtpPath = remotePath + separator + user + separator
                        + service.getServiceId();

                //
                // CHECK PACKAGE READY
                //
                if (checkPackageReady(serverProtocol, serverUser, serverHost, serverPWD, serverPort,
                        serviceIDFtpPath, resultConnectMode, resultTimeout)) {

                    // create path for remote and local folders
                    // NOTE: this is a workaround, a better implementation should avoid ftp and move the files
                    String localRelativeFolder = user + LOCAL_SEPARATOR + service.getServiceId()
                            + LOCAL_SEPARATOR + PRODUCTS_FOLDER;

                    List<String> pendingProductFiles = new LinkedList<String>();
                    String remoteProductFolder = serviceIDFtpPath + separator + PRODUCTS_FOLDER;

                    //
                    // GET LIST OF FILES
                    //
                    List<String> fileNames = RemoteBrowserUtils.ls(serverProtocol, serverUser,
                            serverPWD, serverHost, serverPort, remoteProductFolder, connectMode,
                            timeout, null, Boolean.FALSE);
                    String message = "\n******* PACKAGE READY *******" + "\n USER: " + user + ""
                            + "\n SERVICE: " + service.getServiceId() + "\n PRODUCTS:  "
                            + (fileNames.size() - 1) + "\n*****************************";
                    notifyPackageReady(message);
                    LOGGER.info(message);

                    //
                    // DELETE PACKAGE READY
                    // NOTE prevent other flows to run
                    //
                    RemoteBrowserUtils.deleteFile(serverProtocol, serverUser, serverPWD, serverHost,
                            serverPort, timeout, remoteProductFolder, PACKAGEREADY_TXT,
                            connectMode);
                    if (LOGGER.isDebugEnabled()) {
                        LOGGER.debug("Processing files ... " + fileNames);
                    }

                    int serviceFolderFilesSize = fileNames.size();
                    int serviceFolderFileIndex = 0;

                    //
                    // MOVE FILES
                    //
                    for (String fileName : fileNames) {
                        serviceFolderFileIndex++;

                        // SKIP RESERVED FOLDERS
                        if (fileName.equals(configuration.getInputPath())) {
                            continue;
                        }
                        if (fileName.equals(configuration.getSuccesPath())) {
                            continue;
                        }
                        if (fileName.equals(configuration.getFailPath())) {
                            continue;
                        }

                        if (fileName.equals(PACKAGEREADY_TXT)) {
                            continue;
                        }

                        if (LOGGER.isInfoEnabled()) {
                            LOGGER.info("Processing file " + fileName);
                        }

                        // create local folder for this file
                        File inputDir = new File(remoteProductFolder, configuration.getInputPath());
                        inputDir.mkdirs();

                        // Download the file
                        File inputFile = RemoteBrowserUtils.downloadFile(serverProtocol, serverUser,
                                serverPWD, serverHost, serverPort,
                                remoteProductFolder + separator + fileName,
                                inputDir + FTP_SEPARATOR + fileName, timeout);

                        // process the file
                        List<String> availableProducts = new ArrayList<String>();
                        if (inputFile.exists()) {
                            availableProducts.add(inputFile.getAbsolutePath());
                            // delete downloaded file
                            RemoteBrowserUtils.deleteFile(serverProtocol, serverUser, serverPWD,
                                    serverHost, serverPort, timeout, remoteProductFolder, fileName,
                                    connectMode);

                            try {
                                String msg = "Processing events for user: " + user + ", service: "
                                        + service;

                                updateProgress(usersSize, userIndex, serviceSize, serviceIndex, 1,
                                        1, serviceFolderFilesSize, serviceFolderFileIndex, false,
                                        msg, inputFile.getAbsolutePath());

                                // Clean-up packageReady inputFile
                                // inputFile.delete();
                            } catch (Exception e) {
                                if (LOGGER.isErrorEnabled()) {
                                    LOGGER.error("Error processing " + fileName, e);
                                }
                            }

                        } else {
                            String msg = "Unable to retrieve file: " + fileName;
                            updateProgress(usersSize, userIndex, serviceSize, serviceIndex, 1, 1,
                                    serviceFolderFilesSize, serviceFolderFileIndex, true, msg,
                                    inputFile.getAbsolutePath());
                            LOGGER.error(msg);

                        }

                        for (String productFile : availableProducts) {

                            pendingProductFiles.add(new File(productFile).getAbsolutePath());
                        }
                        // add the targetFile to the list
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

                            // setting up configuration for sub action
                            IngestionActionConfiguration config = setupSubConfiguration(service,
                                    key, container);

                            // Getting the action
                            BaseAction<EventObject> action = null;

                            // Using reflection to create action for configuration
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

                    // Collecting all other products files whenever a Package
                    // Ready event has been received ...
                    resultList.addAll(getPostProcessEvents(pendingProductFiles, dataStore, user,
                            service, localRelativeFolder, serverResultProtocol, PRODUCTS_FOLDER,
                            PRODUCTS_FOLDER, PRODUCTS_FOLDER, resultTimeout, resultConnectMode,
                            resultTimeout, usersSize, userIndex, serviceSize, serviceIndex, 1, 1,
                            actionMap));

                }
                // ---
            }

        } catch (Exception e) {
            LOGGER.error("Error browsing remote server", e);
        }

        return resultList;
    }

    private void notifyPackageReady(String message) {
        updateProgress(message);

    }

    private IngestionActionConfiguration setupSubConfiguration(Service service, String key,
            ConfigurationContainer container) {
        // Creating a possible configuration
        IngestionActionConfiguration config = new IngestionActionConfiguration(key, "configuration",
                "");
        config.setMetocDictionaryPath(configuration.getMetocDictionaryPath());
        config.setGeoserverDataDirectory(configuration.getGeoserverDataDirectory());
        config.setOutputFeature(configuration.getOutputFeature());
        config.setProductsTableName(configuration.getProductsTableName());
        config.setShipDetectionsTableName(configuration.getShipDetectionsTableName());
        config.setOilSpillsTableName(configuration.getOilSpillsTableName());
        config.setGeoserverPWD(configuration.getGeoserverPWD());
        config.setGeoserverUID(configuration.getGeoserverUID());
        config.setGeoserverURL(configuration.getGeoserverURL());
        config.setContainer(container);
        config.setServiceName(service.getServiceId());
        return config;
    }

    private boolean checkPackageReady(RemoteBrowserProtocol serverProtocol, String serverUser,
            String serverHost, String serverPWD, int serverPort, String serviceIDFtpPath,
            FTPConnectMode resultConnectMode, int resultTimeout)
                    throws IOException, FTPException, ParseException {
        if (configuration.isStoreLocal()) {
            if (checkIfExists(serviceIDFtpPath, PRODUCTS_FOLDER)) {
                return checkIfExists(serviceIDFtpPath + LOCAL_SEPARATOR + PRODUCTS_FOLDER,
                        PACKAGEREADY_TXT);
            }
        } else {

            if (checkIfExists(serverProtocol, serverUser, serverHost, serverPWD, serverPort,
                    serviceIDFtpPath, PRODUCTS_FOLDER, resultConnectMode, resultTimeout)) {
                return checkIfExists(serverProtocol, serverUser, serverHost, serverPWD, serverPort,
                        serviceIDFtpPath + FTP_SEPARATOR + PRODUCTS_FOLDER, PACKAGEREADY_TXT,
                        resultConnectMode, resultTimeout);
            }
        }
        return false;
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
        if (/* !"PRODUCTS".equals(service.getStatus()) && */
        "ACQUISITIONPLAN".equals(service.getStatus()) && PRODUCTS_FOLDER.equals(folder)) {
            return true;
        } else {
            return false;
        }
    }

}
