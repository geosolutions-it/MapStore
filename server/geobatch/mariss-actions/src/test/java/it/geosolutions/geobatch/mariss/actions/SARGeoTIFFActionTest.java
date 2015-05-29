package it.geosolutions.geobatch.mariss.actions;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.mariss.actions.MarissBaseAction.AttributeBean;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationUtils;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.sartiff.SarGeoTIFFAction;
import it.geosolutions.geobatch.mariss.actions.sartiff.SarGeoTiffProcessingResult;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.EventObject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.TimeZone;

import org.apache.commons.io.FileUtils;
import org.geotools.data.DataStore;
import org.geotools.jdbc.JDBCDataStore;
import org.junit.Test;


public class SARGeoTIFFActionTest {
	private static final List<String> testNames = Arrays
			.asList("TDX1_SAR__MGD_RE___SM_S_SRA_20110901T175713_20110901T175721_DER.zip",
					"TDX1_SAR__MGD_RE___SM_S_SRA_20110906T180545_20110906T180553_DER.zip",
					"TSX1_SAR__MGD_SE___SM_S_SRA_20100304T165258_20100304T165306_DER.zip");
	private static final String FILE_NAME = "TDX1_SAR__MGD_RE___SM_S_SRA_20111026T175726_20111026T175734_DER.zip";

	/**
	 * Test the parsing of the input files
	 */
	@Test
	public void testCanProcess() {
		// create dummy config
		IngestionActionConfiguration config = createDummyConfig();
		// create dummyAction
		SarGeoTIFFAction action = new SarGeoTIFFAction(config) {

			@Override
			public boolean checkConfiguration() {
				// TODO Auto-generated method stub
				return false;
			}
		};
		for (String name : testNames) {
			// create dummy event
			FileSystemEvent event = new FileSystemEvent(new File(name),
					FileSystemEventType.FILE_ADDED);
			assertTrue(action.canProcess(event));
		}

	}

	/**
	 * Test some execution steps
	 * @throws Exception 
	 */
	@Test
	public void testExecutionSteps() throws Exception{
		IngestionActionConfiguration config = createDummyConfig();
		//create dummyAction
		SarGeoTIFFAction action = new SarGeoTIFFAction(config) {
			
			
			@Override
			public boolean checkConfiguration() {
				// TODO Auto-generated method stub
				return false;
			}
		};
		URL url =getClass().getResource("/marisstestdata/" + FILE_NAME);
		assertTrue(url != null);
		File f = null;
		try {
			f = new File(url.toURI());
		} catch (URISyntaxException e) {
			fail(e.getMessage());
		}
		File dir = null;
		FileSystemEvent event = new FileSystemEvent(f,FileSystemEventType.FILE_ADDED );
		assertTrue(action.canProcess(event));
		/*
		Queue<EventObject> q = new PriorityQueue<EventObject>();
		q.add(event);
		action.execute(q);
		*/
		try {
			dir = action.unzipFile(f);
			assertTrue("Could not create the directory",dir.exists());
			AttributeBean ab = new AttributeBean();
			SarGeoTiffProcessingResult result = action.processFile(f,ab);
			File tif  = result.getGeoTiff();
			assertTrue(tif != null);
			convalidateFileDate(FILE_NAME,ab.timedim);
			assertTrue(ab.numShipDetections == result.getShipDetections().size());
			// initialize data store
			DataStore ds = FeatureConfigurationUtil.createDataStore(action.configuration
					.getOutputFeature());
			assertTrue(ds != null);
			assertTrue (ds instanceof JDBCDataStore);
			ab.dataStore = (JDBCDataStore) ds;
			//action.publishShipDetections(ab, result);
		} catch (ActionException e) {
			throw e;
		}catch (Exception e){
			throw e;
		}finally{
			if(dir!= null && dir.exists()){
				try {
					FileUtils.deleteDirectory(dir);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					fail("UNABLE TO DELETE GENERATED DIRECTORY:" + e.getMessage());
				}
			}
		}
		
	}

	private void convalidateFileDate(String fileName, Date timedim) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd'T'HHmmss");
		format.setTimeZone(TimeZone.getTimeZone("UTC"));
		Date d = format.parse("20111026T175726");
		
		
		assertEquals(d, timedim);
		
	}

	/**
	 * method to create a dummy action
	 * 
	 * @return
	 */
	private IngestionActionConfiguration createDummyConfig() {
		ConfigurationContainer container = new ConfigurationContainer() {
		};
		
		container.setPattern(".*([0-9]{8}T[0-9]{6})_([0-9]{8}T[0-9]{6})_.*");
		String tranformOpts ="{\"type\": \"GdalWarpTransform\",\"options\": [ \"-t_srs\", \"EPSG:4326\"]},{\"type\": \"GdalTranslateTransform\", \"options\": [ \"-co\", \"TILED=YES\", \"-co\", \"BLOCKXSIZE=512\", \"-co\", \"BLOCKYSIZE=512\"]},{\"type\": \"GdalAddoTransform\",\"options\": [ \"-r\", \"average\"],\"levels\" : [2, 4, 8, 16]}";
		Map<String, String> params = new HashMap<String, String>();
		params.put(ConfigurationUtils.NETCDF_DIRECTORY_KEY, "dummy");
		params.put(ConfigurationUtils.OPTIMIZATION_OPTION, tranformOpts);
		params.put(ConfigurationUtils.GEOTIFF_DIRECTORY_KEY, "geotiff");
		container.setParams(params);
		container.setDefaultNameSpace("sde");
		
		IngestionActionConfiguration config = new IngestionActionConfiguration(
				"Test", "name", "test configuration");
		config.setContainer(container);
		FeatureConfiguration fc = setupDummyDataStore();
		config.setGeoserverURL("http://localhost:8080/geoserver/");
		config.setGeoserverUID("admin");
		config.setGeoserverPWD("geoserver");
		
		config.setOutputFeature(fc);
		return config;
	}

	private FeatureConfiguration setupDummyDataStore() {
		FeatureConfiguration fc = new FeatureConfiguration();
		Map<String,Serializable> parameters=new HashMap<String,Serializable>();
		parameters.put("dbtype", "h2");
		parameters.put("database", "mariss");
		parameters.put("schema", "public");
		parameters.put("host", "localhost");
		parameters.put("user", "postgres");
		parameters.put("passwd", "postgres");
		parameters.put( "port", "5432");
		fc.setDataStore(parameters);
		
		return fc;
	}
	
	
}
