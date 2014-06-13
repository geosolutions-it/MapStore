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
package it.geosolutions.geobatch.mariss.ingestion.product;

import java.io.IOException;
import java.util.List;

import org.geotools.data.DataStore;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.FeatureStore;
import org.geotools.data.Transaction;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vividsolutions.jts.geom.GeometryFactory;

/**
 * Product ingestion for MARISS project
 * 
 * @author alejandro.diaz at geo-solutions.it
 * 
 */
public abstract class ProductIngestionProcessor {

	/** 
	 * Working folder for the process
	 */
	protected String workingDir = System.getProperty("java.io.tmpdir");

	protected final static Logger LOGGER = LoggerFactory
			.getLogger(ProductIngestionProcessor.class);

	// Resources to do the ingestion
	protected DataStore dataStore = null;
	protected FeatureStore<SimpleFeatureType, SimpleFeature> source = null;
	protected SimpleFeatureType schema = null;
	protected String typeName = null;
	protected String userName;
	protected String serviceName;
	protected int projection = 4326;

	/*
	 * GeometryFactory will be used to create the geometry attribute of each
	 * feature (a Point object for the location)
	 */
	protected GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory(null);

	// constructors 
	public ProductIngestionProcessor() {
		super();
	}
	
	@SuppressWarnings("unchecked")
	public ProductIngestionProcessor(DataStore dataStore, String typeName){
		this ();
		this.typeName = typeName;
		this.dataStore = dataStore;
		try {
			this.schema = dataStore.getSchema(this.typeName);
			this.source = ((FeatureStore<SimpleFeatureType, SimpleFeature>) this.dataStore.getFeatureSource(this.typeName));
		} catch (IOException e) {
			LOGGER.error("Error getting the schema", e);
		}
	}
	
	public ProductIngestionProcessor(DataStore dataStore, String typeName, int projection){
		this(dataStore, typeName);
		this.projection = projection;
	}
	
	public ProductIngestionProcessor(DataStore dataStore, String typeName, int projection, String userName, String serviceName){
		this(dataStore, typeName, projection);
		this.userName = userName;
		this.serviceName = serviceName;
	}
	
	public ProductIngestionProcessor(DataStore dataStore, String typeName, String userName, String serviceName){
		this(dataStore, typeName);
		this.userName = userName;
		this.serviceName = serviceName;
	}
	
	/**
	 * Check if this processor can process the file
	 * @param filePath
	 * @return  
	 */
	public abstract boolean canProcess(String filePath);
	
	/**
	 * Do process for a file path
	 * 
	 * @param filePath
	 * 
	 * @return message with the resume of the ingestion
	 * @throws IOException
	 */
	public abstract String doProcess(String filePath) throws IOException;

	/**
	 * Create a feature in the data store
	 * 
	 * @return new feature
	 * @throws Exception
	 */
	protected SimpleFeature createFeature() throws Exception {
		// Create feature
		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(schema);

		return featureBuilder.buildFeature(null);
	}
	
	/**
	 * Persist a list of features
	 * @param list
	 */
	protected void persist(List<SimpleFeature> list) {
		try{
	        /*
	         * Write the feature to the current source
	         */
	        Transaction transaction = new DefaultTransaction("create");

	        if (source instanceof SimpleFeatureStore) {
	            SimpleFeatureStore featureStore = (SimpleFeatureStore) source;
	            SimpleFeatureCollection collection = new ListFeatureCollection(schema, list);
	            featureStore.setTransaction(transaction);
	            try {
	                featureStore.addFeatures(collection);
	                transaction.commit();
	            } catch (Exception problem) {
					LOGGER.error("Error on commit", problem);
	                transaction.rollback();
	            } finally {
	                transaction.close();
	            }
	            if(LOGGER.isInfoEnabled()){
					LOGGER.info("Success persisting "+list);
	            }
	        } else {
				LOGGER.error(schema + " does not support read/write access");
	        }
		}catch (Exception e){
			LOGGER.error("Error on persist", e);
		}
	}

	/**
	 * @return the workingDir
	 */
	public String getWorkingDir() {
		return workingDir;
	}

	/**
	 * @param workingDir the workingDir to set
	 */
	public void setWorkingDir(String workingDir) {
		this.workingDir = workingDir;
	}

}
