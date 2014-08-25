/*
 *  nrl Crop Information Portal
 *  https://github.com/geosolutions-it/crop-information-portal
 *  Copyright (C) 2007-2013 GeoSolutions S.A.S.
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
package it.geosolutions.geobatch.mariss.dao;

import java.io.IOException;
import java.io.Serializable;

/**
 * Generic DAO for CSV ingestion
 * @author adiaz
 */
public interface GenericDAO<T, ID extends Serializable>{

/**
 * Remove a entity by its pk
 * 
 * @return true if removed and false if we have a problem
 */
public boolean removeByPK(Serializable... pkObjects);

/**
 * Remove a entity by its pk
 * 
 * @return true if removed and false if we have a problem
 */
public boolean removeByPK(String[] names, Serializable... pkObjects);

/**
 * Obtain array for the pknames ordered to be used in  {@link BaseDAO#removeByPK(Serializable...)}
 * 
 * @return array with names of the pk aggregated
 */
public String[] getPKNames();

/**
 * Obtain a entity by its pk
 * 
 * @return entity found or null if not found
 */
public T searchByPK(Serializable... pkObjects);

/**
 * Obtain a entity by its pk
 * 
 * @return entity found or null if not found
 */
public T searchByPK(String[] names, Serializable... pkObjects);


/**
 * Update an entity
 * 
 * @param entity to be merged 
 * @throws IOException 
 */
public void merge(T entity) throws IOException;

/**
 * Create a new entity
 * 
 * @param entity to create
 * @throws IOException 
 */
public void persist(T entity) throws IOException;

/**
 * @return schema used on dao
 */
public Object getSchema();


public void prepare();
public void dispose();

}