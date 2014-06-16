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
package it.geosolutions.geobatch.mariss.ingestion.csv;

import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.mariss.dao.GenericDAO;
import it.geosolutions.geobatch.mariss.dao.impl.GenericFeatureDaoImpl;

import java.util.Map;

import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import au.com.bytecode.opencsv.CSVReader;

import com.vividsolutions.jts.geom.GeometryFactory;

/**
 * MARISS CSV processor based on a service name for an user
 * 
 * @author adiaz
 */
public abstract class MarissCSVServiceProcessor extends
		GenericCSVProcessor<SimpleFeature, Long> {

	// the dao
	protected GenericDAO<SimpleFeature, Long> dao;

	/*
	 * GeometryFactory will be used to create the geometry attribute of each
	 * feature (a Point object for the location)
	 */
	protected GeometryFactory geometryFactory = JTSFactoryFinder
			.getGeometryFactory(null);

	// user and service name
	protected String userName;
	protected String serviceName;
	protected int projection = 4326;

	/**
	 * PK NAMES for the dao. the same that PK_PROPERTIES
	 */
	protected abstract String[] getPkNames();

	// constructors
	public MarissCSVServiceProcessor() {
		super();
	}

	public MarissCSVServiceProcessor(Map<String, Object> connectionParam,
			String typeName, String[] pkNames) {
		this();
		this.dao = new GenericFeatureDaoImpl(connectionParam, typeName, pkNames);
	}

	public MarissCSVServiceProcessor(Map<String, Object> connectionParam,
			String typeName) {
		this();
		this.dao = new GenericFeatureDaoImpl(connectionParam, typeName,
				getPkNames());
	}

	public MarissCSVServiceProcessor(Map<String, Object> connectionParam,
			String typeName, String[] pkNames, TimeFormat timeFormat) {
		this(connectionParam, typeName, pkNames);
		this.timeFormat = timeFormat;
	}

	public MarissCSVServiceProcessor(Map<String, Object> connectionParam,
			String typeName, TimeFormat timeFormat) {
		this(connectionParam, typeName);
		this.timeFormat = timeFormat;
	}

	@Override
	public GenericDAO<SimpleFeature, Long> getDao() {
		return dao;
	}

	/**
	 * @param dao
	 *            the dao to set
	 */
	public void setDao(GenericDAO<SimpleFeature, Long> dao) {
		this.dao = dao;
	}

	/**
	 * CSV default generic processor. It insert a new entity for each row that
	 * don't exist in DB, update found records and remove if all not pk
	 * properties are null
	 */
	@Override
	public void process(CSVReader reader) throws CSVProcessException {
		// prepare DAO resources
		getDao().prepare();
		try {
			super.process(reader);
		} finally {
			// dispose DAO resources
			getDao().dispose();
		}
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName
	 *            the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the serviceName
	 */
	public String getServiceName() {
		return serviceName;
	}

	/**
	 * @param serviceName
	 *            the serviceName to set
	 */
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	/**
	 * Create a feature in the data store
	 * 
	 * @return new feature
	 * @throws Exception
	 */
	public SimpleFeature createFeature() throws Exception {
		// Create feature
		SimpleFeatureType featureType = (SimpleFeatureType) getDao()
				.getSchema();
		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(
				featureType);

		return featureBuilder.buildFeature(null);
	}

	public void save(SimpleFeature entity) {
		dao.merge(entity);
	}

	public void persist(SimpleFeature entity) {
		dao.persist(entity);
	}

	/**
	 * @return the projection
	 */
	public int getProjection() {
		return projection;
	}

	/**
	 * @param projection the projection to set
	 */
	public void setProjection(int projection) {
		this.projection = projection;
	}

}
