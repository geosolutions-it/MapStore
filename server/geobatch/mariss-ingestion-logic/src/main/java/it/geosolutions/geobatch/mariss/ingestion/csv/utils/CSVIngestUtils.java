/*
 *  Copyright (C) 2007 - 2013 GeoSolutions S.A.S.
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
package it.geosolutions.geobatch.mariss.ingestion.csv.utils;

import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessException;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.util.StringUtils;

/**
 * Utilities for CSV ingest
 * 
 * @author adiaz
 */
public class CSVIngestUtils {

static TimeFormat TIME_FORMAT = new TimeFormat(null, null, null, new TimeFormatConfiguration(null, null, null));

/**
 * Obtain a double value of a string or null if it's null or empty
 * 
 * @param doubleString
 * @return Double value
 * @throws CSVProcessException if <code>doubleString</code> it's not a double
 */
public static Double getDoubleValue(String doubleString)
        throws CSVProcessException {
    try {
        return doubleString != null && StringUtils.hasText(doubleString) ? Double
                .parseDouble(doubleString) : null;
    } catch (NumberFormatException nfe) {
        throw new CSVProcessException("Incorrect double=" + doubleString);
    }
}

public static Timestamp getDateFormat(String dateString)
        throws CSVProcessException {
    try {
    	return dateString != null ? TIME_FORMAT.getTimeStamp(dateString): null;
    } catch (Exception e) {
        throw new CSVProcessException("Incorrect dateString=" + dateString);
    }
}

/**
 * Parse a csv property as known type
 * 
 * @param origin
 * @param type
 * @return
 * @throws Exception
 */
public static Object parse(String origin, CSVPropertyType type)
        throws Exception {
    switch (type) {
    case INTEGER:
        return origin != null && origin.length() > 0 ? Integer.parseInt(origin): null;
    case DOUBLE:
        return CSVIngestUtils.getDoubleValue(origin);
    case DATE_TIME:
        return CSVIngestUtils.getDateFormat(origin);
    case IGNORE:
        return null;
    default:
        return origin;
    }
}

/**
 * Sanetize CSV headers
 * @param headers
 * @return
 * @throws IOException
 */
public static List<String> sanitizeHeaders(String[] headers) throws IOException {
    List<String> ret = new ArrayList<String>();
    boolean emptyFound = false;
    for (String h : headers) {
        if(h == null || h.isEmpty()) {
            emptyFound = true;
        } else {
            if(emptyFound) {
                throw new IOException("Header value found after blank header");
            }
            ret.add(h);
        }
    }
    return ret;
}

}
