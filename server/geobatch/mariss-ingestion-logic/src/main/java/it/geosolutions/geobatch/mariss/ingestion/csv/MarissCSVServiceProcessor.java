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

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.Map;

import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import au.com.bytecode.opencsv.CSVReader;
import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.mariss.dao.GenericDAO;
import it.geosolutions.geobatch.mariss.dao.impl.GenericFeatureDaoImpl;
import it.geosolutions.geobatch.mariss.ingestion.csv.configuration.CSVProcessorConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;

/**
 * MARISS CSV processor based on a service name for an user
 * 
 * @author adiaz
 */
public abstract class MarissCSVServiceProcessor extends GenericCSVProcessor<SimpleFeature, Long> {

    // the dao
    protected GenericDAO<SimpleFeature, Long> dao;

    // user and service name
    protected String userName;

    protected String serviceName;

    protected int projection = 4326;

    // constructors
    public MarissCSVServiceProcessor() {
        super();
    }

    public MarissCSVServiceProcessor(Map<String, Serializable> connectionParam, String typeName) {
        this();
        this.dao = new GenericFeatureDaoImpl(connectionParam, typeName, getPkNames());
    }

    public MarissCSVServiceProcessor(Map<String, Serializable> connectionParam, String typeName,
            String[] pkNames) {
        this();
        this.dao = new GenericFeatureDaoImpl(connectionParam, typeName, pkNames);
    }

    public MarissCSVServiceProcessor(Map<String, Serializable> connectionParam, String typeName,
            String[] pkNames, TimeFormat timeFormat) {
        this(connectionParam, typeName, pkNames);
        this.timeFormat = timeFormat;
    }

    public MarissCSVServiceProcessor(Map<String, Serializable> connectionParam, String typeName,
            TimeFormat timeFormat) {
        this(connectionParam, typeName);
        this.timeFormat = timeFormat;
    }

    /**
     * Create a feature in the data store
     * 
     * @return new feature
     * @throws Exception
     */
    public SimpleFeature createFeature() throws Exception {
        // Create feature
        SimpleFeatureType featureType = (SimpleFeatureType) getDao().getSchema();
        SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(featureType);

        return featureBuilder.buildFeature(null);
    }

    @Override
    public GenericDAO<SimpleFeature, Long> getDao() {
        return dao;
    }

    /**
     * PK NAMES for the dao. the same that PK_PROPERTIES
     */
    protected abstract String[] getPkNames();

    /**
     * @return the projection
     */
    public int getProjection() {
        return projection;
    }

    /**
     * @return the serviceName
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * @return the userName
     */
    public String getUserName() {
        return userName;
    }

    public void persist(SimpleFeature entity) throws IOException {
        dao.persist(entity);
    }

    /**
     * CSV default generic processor. It insert a new entity for each row that don't exist in DB, update found records and remove if all not pk
     * properties are null
     */
    @Override
    public void process(CSVReader reader) throws CSVProcessException {
        if (fileName != null) {
            Map<String, String> fileParameters = CSVIngestUtils.getParametersFromName(fileName);
            if (fileParameters.containsKey(CSVIngestUtils.USER_FILE_PARAMETER)) {
                setUserName(fileParameters.get(CSVIngestUtils.USER_FILE_PARAMETER));
            }
            if (fileParameters.containsKey(CSVIngestUtils.SERVICE_FILE_PARAMETER)) {
                setServiceName(fileParameters.get(CSVIngestUtils.SERVICE_FILE_PARAMETER));
            }
        }
        // prepare DAO resources
        getDao().prepare();
        try {
            super.process(reader);
        } catch (Exception e) {
            throw new CSVProcessException(e);
        } finally {
            // dispose DAO resources
            getDao().dispose();
        }
    }

    /**
     * Get user/service parameters from the file name
     */
    public String processCSVFile(File file, char separator) throws IOException {
        Map<String, String> fileParameters = CSVIngestUtils.getParametersFromName(file.getName());
        if (fileParameters.containsKey(CSVIngestUtils.USER_FILE_PARAMETER)) {
            setUserName(fileParameters.get(CSVIngestUtils.USER_FILE_PARAMETER));
        }
        if (fileParameters.containsKey(CSVIngestUtils.SERVICE_FILE_PARAMETER)) {
            setServiceName(fileParameters.get(CSVIngestUtils.SERVICE_FILE_PARAMETER));
        }

        return super.processCSVFile(file, separator);
    }

    public void save(SimpleFeature entity) throws IOException {
        dao.merge(entity);
    }

    // TODO: Generalize this configuration to allow the dynamic composition of
    // CSV ingestion without the class creation like CSVProductTypes1To3Processor or CSVProductTypes5Processor
    @Override
    public void setConfiguration(CSVProcessorConfiguration configuration) {
        super.setConfiguration(configuration);
        this.dao = new GenericFeatureDaoImpl(configuration.getOutputFeature().getDataStore(),
                configuration.getTypeName(), getPkNames());
        this.timeFormat = new TimeFormat(null, null, null,
                configuration.getTimeFormatConfiguration());
        this.projection = configuration.getProjection();
    }

    /**
     * @param dao the dao to set
     */
    public void setDao(GenericDAO<SimpleFeature, Long> dao) {
        this.dao = dao;
    }

    /**
     * @param projection the projection to set
     */
    public void setProjection(int projection) {
        this.projection = projection;
    }

    /**
     * @param serviceName the serviceName to set
     */
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    /**
     * @param userName the userName to set
     */
    public void setUserName(String userName) {
        this.userName = userName;
    }

}
