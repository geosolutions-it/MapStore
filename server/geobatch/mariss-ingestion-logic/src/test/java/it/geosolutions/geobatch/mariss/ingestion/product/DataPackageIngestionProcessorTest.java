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
package it.geosolutions.geobatch.mariss.ingestion.product;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JUnit test for {@link DataPackageIngestionProcessor} process
 * 
 * @author adiaz
 */
public class DataPackageIngestionProcessorTest {

	protected final static Logger LOGGER = LoggerFactory
			.getLogger(DataPackageIngestionProcessorTest.class);
	
	private String filePathTest = "target/test-classes/TDX1_SAR__MGD_RE___SM_S_SRA_20110901T175713_20110901T175721_DER.zip";
	
	DataStore dataStore = null;
	DataPackageIngestionProcessor processor = null;
	String typeName = "dlr_ships";
	String userName = "userName";
	String serviceName = "serviceName";
	
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
	 * Create the processor
	 */
	@Before
	public void generateProcessor(){
		try {
			dataStore = DataStoreFinder.getDataStore(getConnectionParameters());
			processor = new DataPackageIngestionProcessor(dataStore, typeName, userName, serviceName);
		} catch (IOException e) {
			LOGGER.error("Error creating the store", e);
		}
	}

	/**
	 * Test the DataPackageIngestionProcessor process
	 * 
	 * @throws Exception
	 */
	@Test
	public void parseTest() throws Exception {
		processor.doProcess(filePathTest);
	}
	
	/**
	 * Dispose datastore
	 */
	@After
	public void dispose(){
		dataStore.dispose();
	}
}
