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
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVPropertyType;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import au.com.bytecode.opencsv.CSVReader;

/**
 * CSV Generic processor for Geobatch
 * 
 * @author adiaz
 */
public abstract class GenericCSVProcessor<T, ID extends Serializable> extends
        CSVProcessor {

protected final static Logger LOGGER = LoggerFactory
        .getLogger(GenericCSVProcessor.class);

int insertCount;
int updateCount;
int removeCount;
int failCount;

/**
 * Time format component
 */
protected TimeFormat timeFormat;

/**
 * Flag indicates don't fail if one row fail
 */
protected boolean rowByRow = true;

/**
 * @return the dao
 */
public abstract GenericDAO<T, ID> getDao();

/**
 * @return CSV headers matching with this processor
 */
public abstract List<String> getHeaders();

/**
 * @return properties known types for each row
 */
public abstract List<CSVPropertyType> getTypes();

/**
 * @return list with index of the pk properties for each row (you need be sure
 *         that the order it's the same that {@link GenericNRLDAO#getPKNames()})
 */
public abstract List<Integer> getPkProperties();

/**
 * Obtain a merged entity to save or persist by the dao
 * 
 * @param old entity to be updated or null
 * @param properties to override on the old or new entity
 * @return overrided entity
 */
public abstract T merge(T old, Object[] properties);

/**
 * Update the entity. This method it's needed just to evict class cast
 * exceptions.
 * 
 * @param entity
 * @throws IOException 
 */
public abstract void save(T entity) throws IOException;

/**
 * Persists the entity. This method it's needed just to evict class cast
 * exceptions.
 * 
 * @param entity
 * @throws IOException 
 */
public abstract void persist(T entity) throws IOException;

/**
 * CSV default generic processor. It insert a new entity for each row that don't
 * exist in DB, update found records and remove if all not pk properties are
 * null
 */
@Override
public void process(CSVReader reader) throws CSVProcessException {
    String nextLine[];
    long ok = 0;

    try {
        int line = 1;
        insertCount = 0;
        updateCount = 0;
        removeCount = 0;
        failCount = 0;
        while ((nextLine = reader.readNext()) != null) {
            line++;
            try {
                Object[] properties = new Object[nextLine.length];
                Serializable[] keys = new Serializable[getDao().getPKNames().length];

                // Extract data from CSV
                int idx = 0;
                boolean isRemove = true;
                // Iterate over known types (extra properties are ignored)
                for (CSVPropertyType type : getTypes()) {
                    String property = nextLine[idx];
                    Object value = CSVIngestUtils.parse(property, type);
                    // property save in properties
                    properties[idx] = value;
                    // save on correct index inside keys
                    boolean itsKey = false;
                    int keysIdx = 0;
                    for (Integer pk : getPkProperties()) {
                        if (pk.equals(idx)) {
                            keys[keysIdx] = (Serializable) value;
                            itsKey = true;
                            break;
                        }
                        keysIdx++;
                    }
                    if (!itsKey
                            && !CSVPropertyType.IGNORE.equals(getTypes().get(
                                    idx))) {
                        // Remove only if all other values not ignored are null
                        // or empty
                        isRemove = isRemove ? value == null || "".equals(value)
                                : false;
                    }
                    idx++;
                }
                // Update model
                if (isRemove) {
                    getDao().removeByPK(keys);
                    removeCount++;
                } else {
                    T old = getDao().searchByPK(keys);
                    T updatedOrCreated = merge(old, properties);
                    if (old != null) {
                        save(updatedOrCreated);
                        updateCount++;
                    } else {
                        persist(updatedOrCreated);
                        insertCount++;
                    }
                }
            } catch (Exception e) {
                failCount++;
                LOGGER.error("Error parsing CSV in line " + line, e);
                // Just break if rowByRow is disabled
                if (!rowByRow) {
                    throw new CSVProcessException("Could not persist #" + ok
                            + " Entity", e);
                }
            }
        }

    } catch (IOException e) {
        throw new CSVProcessException("Error in reading CSV file", e);
    }

    LOGGER.info("CSV ingestion -- managed " + ok + " entities");
}

/**
 * @return the insertCount
 */
public int getInsertCount() {
    return insertCount;
}

/**
 * @return the updateCount
 */
public int getUpdateCount() {
    return updateCount;
}

/**
 * @return the removeCount
 */
public int getRemoveCount() {
    return removeCount;
}

/**
 * @return the failCount
 */
public int getFailCount() {
    return failCount;
}

/**
 * @return the timeFormat
 */
public TimeFormat getTimeFormat() {
	return timeFormat;
}

/**
 * @param timeFormat the timeFormat to set
 */
public void setTimeFormat(TimeFormat timeFormat) {
	this.timeFormat = timeFormat;
}

}
