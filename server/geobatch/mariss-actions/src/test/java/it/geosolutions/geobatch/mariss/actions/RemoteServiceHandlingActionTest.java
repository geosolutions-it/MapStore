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
package it.geosolutions.geobatch.mariss.actions;

import static org.junit.Assert.assertNotNull;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;
import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.egeos.BaseNetCDFActionTest;
import it.geosolutions.geobatch.egeos.wave.SARWaveAction;
import it.geosolutions.geobatch.egeos.wave.SARWaveActionConfiguration;
import it.geosolutions.geobatch.egeos.wind.SARWindAction;
import it.geosolutions.geobatch.egeos.wind.SARWindActionConfiguration;
import it.geosolutions.geobatch.imagemosaic.config.DomainAttribute;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVAcqListProcessor;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProductTypes1To3Processor;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProductTypes5Processor;
import it.geosolutions.geobatch.mariss.ingestion.csv.MarissCSVServiceProcessor;
import it.geosolutions.geobatch.mariss.ingestion.product.DataPackageIngestionConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.product.DataPackageIngestionProcessor;
import it.geosolutions.geobatch.metocs.base.NetCDFCFGeodetic2GeoTIFFsFileAction;
import it.geosolutions.geobatch.metocs.commons.MetocActionConfiguration;
import it.geosolutions.geobatch.remoteBrowser.configuration.RemoteBrowserConfiguration;

import java.io.File;
import java.io.Serializable;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Tests for CSV ingestion action
 * 
 * @author adiaz
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath:test-context.xml"})
public class RemoteServiceHandlingActionTest extends BaseNetCDFActionTest {

	@Override
	protected void prepareConfiguration(MetocActionConfiguration config) {
		// TODO Auto-generated method stub
		super.prepareConfiguration(config);		
		config.setMetocDictionaryPath("/home/adiaz/apps/mariss-apache-tomcat-6.0.30/webapps/geobatch/WEB-INF/data/" + METOC_DIRECTORY_PATH);
		config.setMetocHarvesterXMLTemplatePath("/home/adiaz/apps/mariss-apache-tomcat-6.0.30/webapps/geobatch/WEB-INF/data/" + METOC_HARVESTER_XML_TEMPLATE_PATH);
	}

	private static final Logger LOGGER = LoggerFactory
			.getLogger(RemoteServiceHandlingActionTest.class);

	/**
	 * Simple test for the remote service action flow
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
		// First process
		Queue<EventObject> result = action.execute(events);
		assertNotNull(result);
		LOGGER.info("Result REMOTE: " + result);
		// Data package process in the flow
		DataPackageIngestionProcessor dataPackageAction = new DataPackageIngestionProcessor(getDataPackageConfiguration());
		result = dataPackageAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result DATA PACKAGE: " + result);
		// CSV ingestion
		CSVIngestAction csvAction = new CSVIngestAction(
				new CSVIngestConfiguration(null, null, null));
		csvAction.addProcessor(getProcessor("acq_list", "CLS", "CLS1"));
		csvAction.addProcessor(getProcessor("products_1to3", "CLS", "CLS1"));
		csvAction.addProcessor(getProcessor("products_5", "CLS", "CLS1"));
		result = csvAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result CSV: " + result);
		// NetCDF WAVE ingestion
		SARWaveActionConfiguration sarWaveconfiguration = new SARWaveActionConfiguration(null, null, null);
		prepareConfiguration(sarWaveconfiguration);
		SARWaveAction sarWaveAction = new SARWaveAction(sarWaveconfiguration);
		result = sarWaveAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result WAVE: " + result);
		// NetCDF WIND ingestion
		SARWindActionConfiguration sarWindconfiguration = new SARWindActionConfiguration(null, null, null);
		prepareConfiguration(sarWindconfiguration);
		SARWindAction sarWindAction = new SARWindAction(sarWindconfiguration);
		result = sarWindAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result WIND: " + result);
		// NetCDF to tiff
		NetCDFCFGeodetic2GeoTIFFsFileAction netCDFToTiffAction = new NetCDFCFGeodetic2GeoTIFFsFileAction(getNetCDF2TiffConfig());
		result = netCDFToTiffAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result NetCDFCFGeodetic2GeoTIFFsFileAction: " + result);
		CustomImageMosaicAction imcAction = new CustomImageMosaicAction(getImageMosaicConfiguration());
		result = imcAction.execute(result);
		assertNotNull(result);
		LOGGER.info("Result imcAction: " + result);
	}
	
	/**
	 * @return connection parameters for the database
	 */
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
	 * Connection for the local geoserver for test
	 * @return
	 */
	private CustomImageMosaicConfiguration getImageMosaicConfiguration(){
		CustomImageMosaicConfiguration imConfig = new CustomImageMosaicConfiguration(null, null, null);
		//TODO: load from properties
		imConfig.setAllowMultithreading(true);
		imConfig.setBackgroundValue("NaN");
		imConfig.setUseJaiImageRead(true);
		imConfig.setDefaultNamespace("mariss");
		imConfig.setDefaultStyle("raster");
		imConfig.setCrs("EPSG:4326");
		imConfig.setDatastorePropertiesPath("EXTERNAL");
		imConfig.setGeoserverUID("admin");
		imConfig.setGeoserverPWD("geoserver");
		imConfig.setGeoserverURL("http://localhost:8080/geoserver");
		imConfig.setTileSizeH(512);
		imConfig.setTileSizeW(512);

		DomainAttribute domainAttribute = new DomainAttribute();
		domainAttribute.setDimensionName("time");
		domainAttribute.setAttribName("time");
		domainAttribute.setRegEx("<![CDATA[(?<=[a-Z])[0-9]{8}(?=_.*tif)]]>");
		domainAttribute.setEndRangeAttribName("endtime");
		domainAttribute.setEndRangeRegEx("<![CDATA[(?<=[a-Z][0-9]{8}_)[0-9]{8}(?=.*tif)]]>");
		List<DomainAttribute> domainAttributes = new LinkedList<DomainAttribute>();
		domainAttributes.add(domainAttribute);
		imConfig.setDomainAttributes(domainAttributes);
		
		return imConfig;
	}
	
	/**
	 * @return DataPackageIngestionConfiguration for test
	 */
	private DataPackageIngestionConfiguration getDataPackageConfiguration(){
		DataPackageIngestionConfiguration configuration = new DataPackageIngestionConfiguration(null, null, null);
		configuration.setTargetTifFolder("target");
		configuration.setTypeName("ships");
		configuration.setCsvIngestionPath("");
		FeatureConfiguration outputFeature = new FeatureConfiguration();
		outputFeature.setDataStore(getConnectionParameters());
		configuration.setOutputFeature(outputFeature);
		configuration.setImageMosaicConfiguration(getImageMosaicConfiguration());
		return configuration;
	}

	/**
	 * Generate a MarissCSVServiceProcessor processor to test 
	 * @return the processor
	 */
	private MarissCSVServiceProcessor getProcessor(String typeName, String userName, String serviceName) {
		MarissCSVServiceProcessor processor = null;
		try {
			if("acq_list".equals(typeName)){
				processor = new CSVAcqListProcessor(getConnectionParameters(), typeName,
						new TimeFormat(null, null, "Time format default",
								new TimeFormatConfiguration(null, null,
										"Time format configuration")));
			}else if("products_1to3".equals(typeName)){
				processor = new CSVProductTypes1To3Processor(getConnectionParameters(), typeName,
						new TimeFormat(null, null, "Time format default",
								new TimeFormatConfiguration(null, null,
										"Time format configuration")));
			}else if("products_5".equals(typeName)){
				processor = new CSVProductTypes5Processor(getConnectionParameters(), typeName,
						new TimeFormat(null, null, "Time format default",
								new TimeFormatConfiguration(null, null,
										"Time format configuration")));
			}
			processor.setUserName(userName);
			processor.setServiceName(serviceName);
		} catch (Exception e) {
			LOGGER.error("Error getting the processor", e);
		}
		return processor;
	}

	private RemoteServiceHandlingConfiguration loadDefaultConfiguration() {
		//TODO: load from properties or use memory
		RemoteServiceHandlingConfiguration configuration = new RemoteServiceHandlingConfiguration(null, null, null);
		FeatureConfiguration outputFeature = new FeatureConfiguration();
		outputFeature.setDataStore(getConnectionParameters());
		configuration.setOutputFeature(outputFeature);
		RemoteBrowserConfiguration remoteBrowserConfiguration = new RemoteBrowserConfiguration(null, null, null);
		remoteBrowserConfiguration.setServerProtocol(RemoteBrowserProtocol.local);
		configuration.setInputRemotePath("/share/ftp");
		remoteBrowserConfiguration.setLocalTempDir("/tmp/ingestion");
		/*
		 *  uncomment this configuration to use remote browsing 
		 * remoteBrowserConfiguration.setServerProtocol(RemoteBrowserProtocol.sftp);
		 * remoteBrowserConfiguration.setTimeout(5000);
		 * remoteBrowserConfiguration.setZipInput(false);
		 * remoteBrowserConfiguration.setZipFileName("");
		 * remoteBrowserConfiguration.setFtpserverUSR("user");
		 * remoteBrowserConfiguration.setFtpserverPWD("pwd");
		 * remoteBrowserConfiguration.setFtpserverHost("mariss-server");
		 * remoteBrowserConfiguration.setFtpserverPort(22);
		 * remoteBrowserConfiguration.setConnectMode(FTPConnectMode.ACTIVE);
		 * remoteBrowserConfiguration.setOperationId(Operation.Download);
		 */
		configuration.setRemoteBrowserConfiguration(remoteBrowserConfiguration);
		configuration.setInputPath("/tmp/ingestion/working");
		configuration.setSuccesPath("/tmp/ingestion/out/ok");
		configuration.setFailPath("/tmp/ingestion/out/fail");
		configuration.setStoreLocal(true);
		configuration.setDeleteDownloadedFiles(false);
		configuration.setCheckIfExists(true);
		configuration.setDlrProductsIMConfiguration(getImageMosaicConfiguration());
		configuration.setDlrProductIngestionTypeName("ships");
		configuration.setDlrProductsTiffFolder("/opt/gs_ext_data/TDX1_SAR__MGD_RE___SM_S_SRA");
		configuration.setCsvIngestionPath("csvingestion/in");
		
		return configuration;
	}
}