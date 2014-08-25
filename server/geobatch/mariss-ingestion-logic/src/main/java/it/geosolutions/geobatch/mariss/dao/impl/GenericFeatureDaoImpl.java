/**
 * 
 */
package it.geosolutions.geobatch.mariss.dao.impl;

import it.geosolutions.geobatch.mariss.dao.GenericDAO;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.FeatureStore;
import org.geotools.data.Query;
import org.geotools.data.Transaction;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.filter.text.cql2.CQL;
import org.geotools.filter.text.cql2.CQLException;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author alediator
 *
 */
public class GenericFeatureDaoImpl implements GenericDAO<SimpleFeature, Long> {

    private final static Logger LOGGER = LoggerFactory.getLogger(GenericFeatureDaoImpl.class);
	
    protected SimpleFeatureType schema = null;
	protected FeatureStore<SimpleFeatureType, SimpleFeature> source = null;
	protected String[] pkNames = null;
	String typeName = null;
	Map<String,Serializable> connectionParam = null;
	DataStore dataStore = null;
	
	public GenericFeatureDaoImpl(){
		super ();
	}
	
	public GenericFeatureDaoImpl(DataStore dataStore, String typeName){
		super ();
		this.typeName = typeName;
		this.dataStore = dataStore;
	}
	
	public GenericFeatureDaoImpl(DataStore dataStore, String typeName, String[] pkNames){
		super ();
		this.typeName = typeName;
		this.dataStore = dataStore;
		this.pkNames = pkNames;
	}
	
	public GenericFeatureDaoImpl(Map<String,Serializable> connectionParam, String typeName){
		super ();
		this.typeName = typeName;
		this.connectionParam = connectionParam;
	}
	
	public GenericFeatureDaoImpl(Map<String,Serializable> connectionParam, String typeName, String[] pkNames){
		this(connectionParam, typeName);
		this.pkNames = pkNames;
	}
	
	public boolean removeByPK(Serializable... pkObjects) {
		return removeByPK(pkNames, pkObjects);
	}

	public boolean removeByPK(String[] names, Serializable... pkObjects) {
		SimpleFeature found = searchByPK(names, pkObjects);
		boolean removed = false;
		if(found != null){
			try {
				Filter removeFilter = getSearchByPkFilter(names, pkObjects);
				try{
			        // submit the delete transaction
			        Transaction transaction = new DefaultTransaction("delete");
			        if (source instanceof SimpleFeatureStore) {
			            SimpleFeatureStore featureStore = (SimpleFeatureStore) source;
			            featureStore.setTransaction(transaction);
			            try {
			                featureStore.removeFeatures(removeFilter);
			                transaction.commit();
			                removed = true;
			            } catch (Exception problem) {
							LOGGER.error("Error on commit", problem);
			                transaction.rollback();
			            } finally {
			                transaction.close();
			            }
			            if(LOGGER.isInfoEnabled()){
							LOGGER.info("Success removing "+pkObjects);
			            }
			        } else {
						LOGGER.error(schema + " does not support read/write access");
			        }
				}catch (Exception e){
					LOGGER.error("Error removing the feature(s) ny PK "+pkObjects, e);
				}
			} catch (CQLException cqle) {
				LOGGER.error("Error generating the cql filter", cqle);
			} catch (IOException e) {
				LOGGER.error("Error removing the feature(s) ny PK "+pkObjects, e);
			}
		}
		return removed;
	}

	public String[] getPKNames() {
		return pkNames;
	}

	public SimpleFeature searchByPK(Serializable... pkObjects) {
		return searchByPK(pkNames, pkObjects);
	}

	public SimpleFeature searchByPK(String[] names, Serializable... pkObjects) {
		SimpleFeature feature = null;
		FeatureCollection<SimpleFeatureType,SimpleFeature> collection = null;
		FeatureIterator<SimpleFeature> fi = null;
		Transaction transaction = null;
		try {
			// prepare filter
			Filter filter = getSearchByPkFilter(names, pkObjects);
	        transaction = new DefaultTransaction("get");
			
			// get the query
			collection = source.getFeatures(new Query(typeName, filter));
			source.setTransaction(transaction);
			fi = collection.features();
			if(fi.hasNext()){
				// it should be only one 
				feature = fi.next();
				if(fi.hasNext()){
					LOGGER.error("Found more than one result by PK "+pkObjects);
				}
			}
			transaction.commit();
		} catch (CQLException cqle) {
			LOGGER.error("Error generating the cql filter", cqle);
		} catch (Exception e) {
			LOGGER.error("Error getting collection", e);
		} finally{
			if(transaction != null){
                try {
					transaction.close();
				} catch (IOException e) {
					LOGGER.error("Error closing transaction", e);
				}
			}
			if(fi != null){
				fi.close();
			}
		}
		return feature;
	}
	
	/**
	 * Generate a filter to search by PK
	 * @param names
	 * @param pkObjects
	 * @return
	 * @throws CQLException
	 * @throws IOException
	 */
	protected Filter getSearchByPkFilter(String[] names, Serializable... pkObjects) throws CQLException, IOException{
		// prepare filter
		if(names == null || pkObjects == null || pkObjects.length != names.length){
			throw new IOException("Unable to search by PK");
		}
		String cqlFilter = "";
		int idx = 0;
		for (String pk: names){
			if(idx > 0){
				cqlFilter += " and ";
			}
			cqlFilter += pk + " = '" + pkObjects[idx++] + "'";
		}
		return CQL.toFilter(cqlFilter);
	}
	
	/**
	 * Generate a filter to search by feature
	 * 
	 * @param names
	 * @param entity
	 * 
	 * @return filter to search all features with the same property in names that the feature
	 * @throws CQLException
	 * @throws IOException
	 */
	protected Filter getSearchByPkFilter(String[] names, SimpleFeature entity) throws CQLException, IOException{
		// prepare filter
		if(names == null || entity == null){
			throw new IOException("Unable to search by PK");
		}
		String cqlFilter = "";
		int pksFiltered = 0;
		for (String pk: names){
			Object pkValue = entity.getAttribute(pk);
			if(pkValue != null){
				if(pksFiltered > 0){
					cqlFilter += " and ";
				}
				cqlFilter += pk + " = '" + pkValue + "'";
				pksFiltered++;
			}
		}
		return CQL.toFilter(cqlFilter);
	}

	@Override
	public void merge(SimpleFeature entity) throws IOException {
		
		// get the update filter
		Filter updateFilter = null;
		try {
			updateFilter = getSearchByPkFilter(pkNames, entity);
		} catch (CQLException cqle) {
			LOGGER.error("Error generating the cql filter", cqle);
		} catch (IOException e) {
			LOGGER.error("Error getting collection", e);
		}
		
		if(updateFilter != null){
			// prepare the modifications
			List<String> nameList = new ArrayList<String>();
			List<Object> attributeValuesList = new ArrayList<Object>();
			
			// auxiliary list
			List<String> pkList = new ArrayList<String>();
			for(String pk: pkNames){
				pkList.add(pk);
			}
			// get names to change and his values
			for (AttributeDescriptor attribute: schema.getAttributeDescriptors()){
				String name = attribute.getName().getLocalPart();
				Object value = entity.getAttribute(name);
				if(!pkList.contains(name)){
					nameList.add(name);
					attributeValuesList.add(value);
				}
			}
			// skip class cast exception
			String [] names = new String[nameList.size()];
			int i = 0;
			for(String name: nameList){
				names[i++] = name;
			}
			
			// update the features
			try{
		        Transaction transaction = new DefaultTransaction("update");
		        if (source instanceof SimpleFeatureStore) {
		            SimpleFeatureStore featureStore = (SimpleFeatureStore) source;
		            featureStore.setTransaction(transaction);
		            try {
		                featureStore.modifyFeatures(names, attributeValuesList.toArray(), updateFilter);
		                transaction.commit();
		            } catch (Exception problem) {
						LOGGER.error("Error on commit", problem);
		                transaction.rollback();
		                throw new IOException(problem);
		            } finally {
		                transaction.close();
		            }
		            if(LOGGER.isInfoEnabled()){
						LOGGER.info("Success merging "+entity);
		            }
		        } else {
					LOGGER.error(schema + " does not support read/write access");
		        }
			}catch (Exception e){
				LOGGER.error("Error merging " + entity, e);
	            throw new IOException(e);
			}
		}else{
			LOGGER.error("Unable to merge "+entity);
            throw new IOException("Unable to merge "+entity);
		}
	}

	@Override
	public void persist(SimpleFeature entity) throws IOException{
		try{
	        /*
	         * Write the feature to the current source
	         */
	        Transaction transaction = new DefaultTransaction("create");

	        if (source instanceof SimpleFeatureStore) {
	            SimpleFeatureStore featureStore = (SimpleFeatureStore) source;
	            /*
	             * SimpleFeatureStore has a method to add features from a
	             * SimpleFeatureCollection object, so we use the ListFeatureCollection
	             * class to wrap our list of features.
	             */
	            List<SimpleFeature> list = new LinkedList<SimpleFeature>();
	            list.add(entity);
	            SimpleFeatureCollection collection = new ListFeatureCollection(schema, list);
	            featureStore.setTransaction(transaction);
	            try {
	                featureStore.addFeatures(collection);
	                transaction.commit();
	            } catch (Exception problem) {
					LOGGER.error("Error on commit", problem);
	                transaction.rollback();
	                throw new IOException(problem);
	            } finally {
	                transaction.close();
	            }
	            if(LOGGER.isInfoEnabled()){
					LOGGER.info("Success persisting "+entity);
	            }
	        } else {
				LOGGER.error(schema + " does not support read/write access");
	        }
		}catch (Exception e){
			LOGGER.error("Error on persist", e);
            throw new IOException(e);
		}
	}

	/**
	 * @return the schema
	 */
	public SimpleFeatureType getSchema() {
		return schema;
	}

	/**
	 * @param schema the schema to set
	 */
	public void setSchema(SimpleFeatureType schema) {
		this.schema = schema;
	}

	/**
	 * @return the source
	 */
	public FeatureStore<SimpleFeatureType, SimpleFeature> getSource() {
		return source;
	}

	/**
	 * @param source the source to set
	 */
	public void setSource(FeatureStore<SimpleFeatureType, SimpleFeature> source) {
		this.source = source;
	}

	@SuppressWarnings("unchecked")
	@Override
	public void prepare() {
		try {
			dataStore = DataStoreFinder.getDataStore(connectionParam);
			this.source = ((FeatureStore<SimpleFeatureType, SimpleFeature>) dataStore.getFeatureSource(typeName));
			this.schema = dataStore.getSchema(typeName);
		} catch (Exception e) {
			LOGGER.error("Error on DAO initialization", e);
		}
	}

	@Override
	public void dispose() {
		dataStore.dispose();
		dataStore = null;
	}

}
