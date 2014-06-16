/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.ftp.client.configuration.FTPActionConfiguration.FTPConnectMode;
import it.geosolutions.geobatch.ftp.client.configuration.FTPActionConfiguration.Operation;
import it.geosolutions.geobatch.remoteBrowser.configuration.RemoteBrowserConfiguration;

import java.io.File;
import java.io.Serializable;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Tests for CSV ingestion action
 * 
 * @author adiaz
 */
public class RemoteServiceHandlingActionTest {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(RemoteServiceHandlingActionTest.class);

	public RemoteServiceHandlingActionTest() {
		super();
	}
	
	private Map<String, Serializable> getConnectionParameters(){
		Map<String, Serializable> params = new HashMap<String, Serializable>();
		//TODO: load from properties
		params.put("dbtype", "postgis");
		params.put("host", "localhost");
		params.put("port", 5432);
		params.put("schema", "public");
		params.put("database", "mariss");
		params.put("user", "mariss");
		params.put("passwd", "mariss");
		return params;
	}

	/**
	 * Simple test for the remote service action
	 * @throws Exception
	 */
	@Test
	public void testRemoteServiceHandling() throws Exception {
		// configure
		RemoteServiceHandlingConfiguration configuration = loadDefaultConfiguration();
		RemoteServiceHandlingAction action = new RemoteServiceHandlingAction(configuration);
		// launch
		Queue<EventObject> events = new LinkedList<EventObject>();
		File file = new File("/tmp/dummy");
		LOGGER.info("Loading " + file);
		FileSystemEvent event = new FileSystemEvent(file,
				FileSystemEventType.FILE_ADDED);
		events.add(event);
		@SuppressWarnings({ "unused", "rawtypes" })
		Queue result = action.execute(events);
	}

	private RemoteServiceHandlingConfiguration loadDefaultConfiguration() {
		//TODO: load from properties or use memory
		RemoteServiceHandlingConfiguration configuration = new RemoteServiceHandlingConfiguration(null, null, null);
		FeatureConfiguration outputFeature = new FeatureConfiguration();
		outputFeature.setDataStore(getConnectionParameters());
		configuration.setOutputFeature(outputFeature);
		configuration.setAcqListTypeName("acq_list");
		RemoteBrowserConfiguration remoteBrowserConfiguration = new RemoteBrowserConfiguration(null, null, null);
		remoteBrowserConfiguration.setServerProtocol(RemoteBrowserProtocol.sftp);
		remoteBrowserConfiguration.setTimeout(5000);
		remoteBrowserConfiguration.setZipInput(false);
		remoteBrowserConfiguration.setZipFileName("");
		remoteBrowserConfiguration.setFtpserverUSR("user");
		remoteBrowserConfiguration.setFtpserverPWD("pwd");
		remoteBrowserConfiguration.setFtpserverHost("localhost");
		remoteBrowserConfiguration.setFtpserverPort(22);
		remoteBrowserConfiguration.setConnectMode(FTPConnectMode.ACTIVE);
		remoteBrowserConfiguration.setLocalTempDir("/tmp/ingestion");
		remoteBrowserConfiguration.setOperationId(Operation.Download);
		configuration.setRemoteBrowserConfiguration(remoteBrowserConfiguration);
		configuration.setStoreLocal(true);
		configuration.setDeleteDownloadedFiles(false);
		configuration.setInputRemotePath("/tmp/ingestion/in");
		configuration.setCheckIfExists(true);
		configuration.setInputPath("/tmp/ingestion/working");
		configuration.setSuccesPath("/tmp/ingestion/out/ok");
		configuration.setFailPath("/tmp/ingestion/out/fail");
		
		return configuration;
	}
}