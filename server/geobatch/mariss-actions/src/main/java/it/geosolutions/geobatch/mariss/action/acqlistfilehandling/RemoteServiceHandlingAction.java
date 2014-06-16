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
package it.geosolutions.geobatch.mariss.action.acqlistfilehandling;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserUtils;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.dao.impl.GenericFeatureDaoImpl;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVAcqListProcessor;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.geotools.data.DataStore;
import org.geotools.jdbc.JDBCDataStore;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;

/**
 * GeoBatch service data ingestion remote file handling action
 * 
 * @author adiaz
 */
@Action(configurationClass = RemoteServiceHandlingConfiguration.class)
public class RemoteServiceHandlingAction extends BaseAction<EventObject> {

	/**
	 * File separator
	 */
	private static String SEPARATOR = System.getProperty("file.separator");

	/**
	 * Action configuration
	 */
	private RemoteServiceHandlingConfiguration configuration;

	private final String ACQ_LIST_FOLDER = "ACQ_LIST";

	public RemoteServiceHandlingAction(
			final RemoteServiceHandlingConfiguration configuration)
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
			ds = FeatureConfigurationUtil.createDataStore(configuration
					.getOutputFeature());
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
	 * Execute process
	 */
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();

		while (events.size() > 0) {
			final EventObject ev;
			try {
				if ((ev = events.remove()) != null) {
					if (LOGGER.isTraceEnabled()) {
						LOGGER.trace("Working on incoming event: "
								+ ev.getSource());
					}
					if (ev instanceof FileSystemEvent) {
						FileSystemEvent fileEvent = (FileSystemEvent) ev;
						@SuppressWarnings("unused")
						File file = fileEvent.getSource();
						// Don't read configuration for the file, just
						// this.outputfeature configuration
						DataStore ds = FeatureConfigurationUtil
								.createDataStore(configuration
										.getOutputFeature());
						if (ds == null) {
							throw new ActionException(this,
									"Can't find datastore ");
						}
						try {
							if (!(ds instanceof JDBCDataStore)) {
								throw new ActionException(this,
										"Bad Datastore type "
												+ ds.getClass().getName());
							}
							JDBCDataStore dataStore = (JDBCDataStore) ds;
							dataStore.setExposePrimaryKeyColumns(true);
							doProcess(configuration, dataStore);

							// pass the feature config to the next action
							ret.add(new FileSystemEvent(((FileSystemEvent) ev)
									.getSource(),
									FileSystemEventType.FILE_ADDED));
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
				final String message = "Unable to produce the output: "
						+ ioe.getLocalizedMessage();
				if (LOGGER.isErrorEnabled())
					LOGGER.error(message, ioe);

				throw new ActionException(this, message);
			}
		}
		return ret;
	}

	/**
	 * Browse the remote server and call to known process for each new file
	 * 
	 * @param cfg
	 * @param dataStore
	 * @throws ActionException
	 */
	public void doProcess(RemoteServiceHandlingConfiguration cfg,
			JDBCDataStore dataStore) throws ActionException {

		try {

			// Input directory is the temporal directory (for file download)
			String inputDir = configuration.getInputPath();

			// Remote server configuration
			String remotePath = cfg.getInputRemotePath();
			RemoteBrowserProtocol serverProtocol = configuration
					.getRemoteBrowserConfiguration().getServerProtocol();
			String serverHost = configuration.getRemoteBrowserConfiguration()
					.getFtpserverHost();
			String serverUser = configuration.getRemoteBrowserConfiguration()
					.getFtpserverUSR();
			String serverPWD = configuration.getRemoteBrowserConfiguration()
					.getFtpserverPWD();
			int serverPort = configuration.getRemoteBrowserConfiguration()
					.getFtpserverPort();
			int timeout = configuration.getRemoteBrowserConfiguration()
					.getTimeout();
			final FTPConnectMode connectMode = configuration
					.getRemoteBrowserConfiguration().toString()
					.equalsIgnoreCase(FTPConnectMode.ACTIVE.toString()) ? FTPConnectMode.ACTIVE
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
				serverResultHost = configuration
						.getRemoteResultBrowserConfiguration()
						.getFtpserverHost();
				serverResultUser = configuration
						.getRemoteResultBrowserConfiguration()
						.getFtpserverUSR();
				serverResultPWD = configuration
						.getRemoteResultBrowserConfiguration()
						.getFtpserverPWD();
				serverResultPort = configuration
						.getRemoteResultBrowserConfiguration()
						.getFtpserverPort();
				resultTimeout = configuration
						.getRemoteResultBrowserConfiguration().getTimeout();
				resultConnectMode = configuration
						.getRemoteResultBrowserConfiguration().toString()
						.equalsIgnoreCase(FTPConnectMode.ACTIVE.toString()) ? FTPConnectMode.ACTIVE
						: FTPConnectMode.PASV;
			}

			// File pattern
			Pattern pattern = configuration.getFilePattern() != null ? Pattern
					.compile(configuration.getFilePattern()) : null;

			// iterate by services
			Map<String, List<String>> servicesByUser = getCurrentServices(
					serverProtocol, serverUser, serverPWD, serverHost,
					serverPort, remotePath, connectMode, timeout, pattern);
			for (String user : servicesByUser.keySet()) {
				for (String service : servicesByUser.get(user)) {
					ingestServiceData(user, service, serverProtocol,
							serverUser, serverPWD, serverHost, serverPort,
							remotePath, connectMode, timeout,
							serverResultProtocol, serverResultUser,
							serverResultPWD, serverResultHost,
							serverResultPort, resultConnectMode, resultTimeout,
							inputDir, dataStore);
				}
			}

		} catch (Exception ex) {
			LOGGER.error("Error in importing service data", ex);
			throw new ActionException(this, "Error in importing service data",
					ex);
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
	 */
	protected void ingestServiceData(
			String user,
			String service,
			// remote browser
			RemoteBrowserProtocol serverProtocol, String serverUser,
			String serverPWD, String serverHost, int serverPort,
			String remotePath,
			FTPConnectMode connectMode,
			int timeout,
			// result remote
			RemoteBrowserProtocol serverResultProtocol,
			String serverResultUser, String serverResultPWD,
			String serverResultHost, int serverResultPort,
			FTPConnectMode resultConnectMode, int resultTimeout,
			// input dir
			String inputDir, DataStore dataStore) {

		try {
			// obtain service folders
			List<String> serviceFolders = RemoteBrowserUtils.ls(serverProtocol,
					serverUser, serverPWD, serverHost, serverPort, remotePath
							+ SEPARATOR + user + SEPARATOR + service,
					connectMode, timeout, null, true);

			// check and create the input dir if not found
			if (!new File(inputDir).exists()) {
				FileUtils.forceMkdir(new File(inputDir));
			}

			// For each file on the remote directory
			for (String folder : serviceFolders) {

				String relativeFolder = user + SEPARATOR + service + SEPARATOR
						+ folder;

				// prepare success and fail path
				if (configuration.isStoreLocal()) {
					// prepare success
					if (!checkIfExists(configuration.getSuccesPath(),
							relativeFolder)) {
						mkdir(configuration.getSuccesPath(), relativeFolder);
					}
					// prepare fail
					if (!checkIfExists(configuration.getFailPath(),
							relativeFolder)) {
						mkdir(configuration.getFailPath(), relativeFolder);
					}
				} else {
					// prepare success
					if (!checkIfExists(serverResultProtocol, serverResultUser,
							serverResultHost, serverResultPWD,
							serverResultPort, configuration.getSuccesPath(),
							relativeFolder, resultConnectMode, resultTimeout)) {
						remotemkdir(serverResultProtocol, serverResultUser,
								serverResultHost, serverResultPWD,
								serverResultPort,
								configuration.getSuccesPath(), relativeFolder,
								resultConnectMode, resultTimeout);
					}
					// prepare fail
					if (!checkIfExists(serverResultProtocol, serverResultUser,
							serverResultHost, serverResultPWD,
							serverResultPort, configuration.getFailPath(),
							relativeFolder, resultConnectMode, resultTimeout)) {
						remotemkdir(serverResultProtocol, serverResultUser,
								serverResultHost, serverResultPWD,
								serverResultPort, configuration.getFailPath(),
								relativeFolder, resultConnectMode,
								resultTimeout);
					}
				}
				// check if it's observable
				if (isObservableServiceFolder(folder)) {

					String currentRemoteFolder = remotePath + SEPARATOR
							+ relativeFolder;
					// get files in the ACQ_LIST folder
					List<String> fileNames = RemoteBrowserUtils.ls(
							serverProtocol, serverUser, serverPWD, serverHost,
							serverPort, currentRemoteFolder, connectMode,
							timeout, null, false);

					// For each file on the remote directory
					for (String fileName : fileNames) {

						if (LOGGER.isInfoEnabled()) {
							LOGGER.info("Processing file " + fileName);
						}

						// check if exists
						boolean exists = false;
						if (configuration.isCheckIfExists()) {
							if (configuration.isStoreLocal()) {
								exists = checkIfExists(inputDir, fileName)
										| checkIfExists(
												configuration.getSuccesPath()
														+ relativeFolder,
												fileName)
										| checkIfExists(
												configuration.getFailPath()
														+ relativeFolder,
												fileName);
							} else {
								exists = checkIfExists(serverResultProtocol,
										serverResultUser, serverResultHost,
										serverResultPWD, serverResultPort,
										inputDir, fileName, resultConnectMode,
										resultTimeout)
										| checkIfExists(serverResultProtocol,
												serverResultUser,
												serverResultHost,
												serverResultPWD,
												serverResultPort,
												configuration.getSuccesPath()
														+ relativeFolder,
												fileName, resultConnectMode,
												resultTimeout)
										| checkIfExists(serverResultProtocol,
												serverResultUser,
												serverResultHost,
												serverResultPWD,
												serverResultPort,
												configuration.getFailPath()
														+ relativeFolder,
												fileName, resultConnectMode,
												resultTimeout);
							}
						}

						// only download and handle if was not be already
						// handled
						if (!exists) {
							// Download the file
							File inputFile = RemoteBrowserUtils.downloadFile(
									serverProtocol, serverUser, serverPWD,
									serverHost, serverPort, currentRemoteFolder
											+ SEPARATOR + fileName, inputDir
											+ SEPARATOR + fileName, timeout);

							// process the file
							if (inputFile.exists()) {
								if (configuration.isDeleteDownloadedFiles()) {
									// delete downloaded file
									RemoteBrowserUtils.deleteFile(
											serverProtocol, serverUser,
											serverPWD, serverHost, serverPort,
											timeout, remotePath, fileName,
											connectMode);
								}

								boolean error = true;
								try {
									String msg = doProcess(dataStore, user,
											service, inputFile, folder);
									error = msg == null;
								} catch (Exception e) {
									if (LOGGER.isErrorEnabled()) {
										LOGGER.error("Error processing "
												+ fileName, e);
									}
								}

								// Post process.
								String targetPath = null;
								if (!error) {
									// success: put on success remote dir
									targetPath = configuration.getSuccesPath()
											+ relativeFolder;
								} else {
									// fail: put on fail remote dir
									targetPath = configuration.getFailPath()
											+ relativeFolder;
								}

								// result could be local or remote
								if (configuration.isStoreLocal()) {
									// move the the target path
									inputFile.renameTo(new File(targetPath
											+ SEPARATOR + inputFile.getName()));
								} else {
									// upload file
									RemoteBrowserUtils.putFile(
											serverResultProtocol,
											serverResultUser,
											serverResultHost,
											serverResultPWD,
											serverResultPort,
											targetPath + SEPARATOR
													+ inputFile.getName(),
											inputFile.getAbsolutePath(),
											resultConnectMode, resultTimeout);

									// clean downloaded file in the input
									// directory
									inputFile.delete();
								}

							} else if (LOGGER.isErrorEnabled()) {
								LOGGER.error("Error downloading " + fileName);
							}
						} else if (LOGGER.isInfoEnabled()) {
							LOGGER.info("File "
									+ fileName
									+ " ignored because was processed after this execution");
						}
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error("Error browsing remote server", e);
		}
	}

	/**
	 * Check if this action must observe this folder in the service
	 * 
	 * @param folder
	 * @return true is it's a known folder or false otherwise
	 */
	private boolean isObservableServiceFolder(String folder) {
		// TODO: add known folders for other ingestions
		if (ACQ_LIST_FOLDER.equals(folder)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Call to known proccess for a file in a service folder
	 * 
	 * @param dataStore
	 * @param user
	 * @param service
	 * @param inputFile
	 * @param folder
	 * @return
	 */
	private String doProcess(DataStore dataStore, String user, String service,
			File inputFile, String folder) {
		String msg = null;

		// TODO: add known folders for other ingestions
		if (ACQ_LIST_FOLDER.equals(folder)) {
			CSVAcqListProcessor processor = new CSVAcqListProcessor();
			GenericFeatureDaoImpl dao = new GenericFeatureDaoImpl(dataStore,
					configuration.getAcqListTypeName(), processor.getPkNames());
			processor.setDao(dao);
			processor.setTimeFormat(new TimeFormat(null, null, null,
					configuration.getTimeFormatConfiguration()));
			processor.setUserName(user);
			processor.setServiceName(service);
			processor.setProjection(4326); // TODO: make it configurable
			try {
				updateProgress(1, "Starting ingestion for file " + inputFile.getName());
				msg = processor.processCSVFile(inputFile, configuration
						.getCsvSeparator().charAt(0));
				updateProgress(100, msg);
			} catch (IOException e) {
				LOGGER.error(
						"Error processing CSV file for the acquisition list", e);
			}
		}
		return msg;
	}

	/**
	 * Save progress information for a task
	 * @param progress
	 * @param msg
	 */
	protected void updateProgress(float progress, String msg) {
		listenerForwarder.setProgress(progress);
		listenerForwarder.setTask(msg);
		listenerForwarder.progressing();
	}

	/**
	 * Get the services by users from the remote server (first and second level
	 * in the tree)
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
	protected Map<String, List<String>> getCurrentServices(
			RemoteBrowserProtocol serverProtocol, String userName,
			String password, String host, int port, String rootPath,
			FTPConnectMode connectMode, int timeout, Pattern pattern) {
		Map<String, List<String>> servicesByUser = null;

		try {
			servicesByUser = new HashMap<String, List<String>>();

			// obtain users
			List<String> users = RemoteBrowserUtils.ls(serverProtocol,
					userName, password, host, port, rootPath, connectMode,
					timeout, pattern, true);

			// For each file on the remote directory
			for (String user : users) {

				List<String> services = RemoteBrowserUtils.ls(serverProtocol,
						userName, password, host, port, rootPath + SEPARATOR
								+ user, connectMode, timeout, pattern, true);

				servicesByUser.put(user, services);
			}
		} catch (Exception e) {
			LOGGER.error("Error browsing remote server", e);
		}
		return servicesByUser;
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
	private boolean checkIfExists(RemoteBrowserProtocol serverProtocol,
			String serverUser, String serverHost, String serverPWD,
			int serverPort, String path, String fileName,
			FTPConnectMode connectMode, int timeout) throws IOException,
			FTPException, ParseException {
		return RemoteBrowserUtils.checkIfExists(serverProtocol, serverUser,
				serverHost, serverPWD, serverPort, path, fileName, connectMode,
				timeout);
	}

	/**
	 * Check if a file exists
	 * 
	 * @param inputDir
	 * @param fileName
	 * @return
	 */
	private boolean checkIfExists(String inputDir, String fileName) {
		File file = new File(inputDir + SEPARATOR + fileName);
		return file.exists();
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
	private void remotemkdir(RemoteBrowserProtocol serverResultProtocol,
			String serverResultUser, String serverResultHost,
			String serverResultPWD, int serverResultPort, String succesPath,
			String relativeFolder, FTPConnectMode resultConnectMode,
			int resultTimeout) throws IOException, FTPException, ParseException {
		RemoteBrowserUtils.forceMkdir(serverResultProtocol, serverResultUser,
				serverResultHost, serverResultPWD, serverResultPort,
				succesPath, relativeFolder, resultConnectMode, resultTimeout);
	}

	/**
	 * Delegated on utilities class
	 * 
	 * @param succesPath
	 * @param relativeFolder
	 * @throws IOException
	 */
	private void mkdir(String succesPath, String relativeFolder)
			throws IOException {
		FileUtils.forceMkdir(new File(succesPath + SEPARATOR + relativeFolder));
	}

}
