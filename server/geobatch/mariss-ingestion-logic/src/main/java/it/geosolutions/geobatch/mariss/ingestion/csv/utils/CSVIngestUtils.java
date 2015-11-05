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

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;

import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessException;

/**
 * Utilities for CSV ingest
 * 
 * @author adiaz
 */
public class CSVIngestUtils {

    static TimeFormat TIME_FORMAT = new TimeFormat(null, null, null,
            new TimeFormatConfiguration(null, null, null));

    /**
     * Separator for each global parameter in the file name
     */
    public static final String PARAMS_SEPARATOR = ",,,";

    /**
     * Name-value for each global parameter in the file name
     */
    public static final String NAME_VALUE_SEPARATOR = "===";

    /**
     * Start of the parameters in the file name
     */
    public static final String PARAMS_START = "PARAMS[";

    /**
     * End of the parameters in the fileName
     */
    public static final String PARAMS_END = "]_";

    /**
     * Parameter name to save user global parameter in the file name
     */
    public static final String USER_FILE_PARAMETER = "user";

    /**
     * Parameter name to save service global parameter in the file name
     */
    public static final String SERVICE_FILE_PARAMETER = "service";

    public static Timestamp getDateFormat(String dateString) throws CSVProcessException {
        try {
            return dateString != null ? TIME_FORMAT.getTimeStamp(dateString) : null;
        } catch (Exception e) {
            throw new CSVProcessException("Incorrect dateString=" + dateString);
        }
    }

    /**
     * Obtain a double value of a string or null if it's null or empty
     * 
     * @param doubleString
     * @return Double value
     * @throws CSVProcessException if <code>doubleString</code> it's not a double
     */
    public static Double getDoubleValue(String doubleString) throws CSVProcessException {
        try {
            return doubleString != null && StringUtils.hasText(doubleString)
                    ? Double.parseDouble(doubleString) : null;
        } catch (NumberFormatException nfe) {
            throw new CSVProcessException("Incorrect double=" + doubleString);
        }
    }

    /**
     * Get the parameters in the file name using {@link CSVIngestUtils#PARAMS_START}, {@link CSVIngestUtils#PARAMS_SEPARATOR},
     * {@link CSVIngestUtils#NAME_VALUE_SEPARATOR} and {@link CSVIngestUtils#PARAMS_END}
     * 
     * @param fileName with the parameters
     * 
     * @return the Map with the pairs
     */
    public static Map<String, String> getParametersFromName(String fileName) {
        Map<String, String> parameters = new HashMap<String, String>();
        if (fileName.contains(PARAMS_START) && fileName.contains(PARAMS_END)) {
            String partial = fileName
                    .substring(fileName.indexOf(PARAMS_START) + PARAMS_START.length());
            partial = partial.substring(0, partial.indexOf(PARAMS_END));
            String[] pairs = partial.split(PARAMS_SEPARATOR);
            for (String nameValuePair : pairs) {
                parameters.put(nameValuePair.split(NAME_VALUE_SEPARATOR)[0],
                        nameValuePair.split(NAME_VALUE_SEPARATOR)[1]);
            }
        }
        return parameters;
    }

    /**
     * Obtain a new file name for a given parameters
     * 
     * @param fileName original
     * @param parameters for the new name
     * 
     * @return composition using {@link CSVIngestUtils#PARAMS_START}, {@link CSVIngestUtils#PARAMS_SEPARATOR},
     *         {@link CSVIngestUtils#NAME_VALUE_SEPARATOR} and {@link CSVIngestUtils#PARAMS_END}
     */
    public static String getParametersInName(String fileName, Map<String, String> parameters) {
        String newName = fileName;
        String paramsString = "";
        if (parameters != null && !parameters.isEmpty()) {
            paramsString += PARAMS_START;
            int index = 0;
            int size = parameters.keySet().size();
            for (String name : parameters.keySet()) {
                index++;
                paramsString += name + NAME_VALUE_SEPARATOR + parameters.get(name);
                if (index < size) {
                    paramsString += PARAMS_SEPARATOR;
                } else {
                    paramsString += PARAMS_END;
                }
            }
            newName = paramsString + newName;
        }
        return newName;
    }

    /**
     * Include service and user names in the file name
     * 
     * @param fileName
     * @param userName
     * @param serviceName
     * 
     * @return file name with the parameters
     */
    public static String getUserServiceFileName(String fileName, String userName,
            String serviceName) {
        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put(USER_FILE_PARAMETER, userName);
        parameters.put(SERVICE_FILE_PARAMETER, serviceName);
        return getParametersInName(fileName, parameters);
    }

    /**
     * Parse a csv property as known type
     * 
     * @param origin
     * @param type
     * @return
     * @throws Exception
     */
    public static Object parse(String origin, CSVPropertyType type) throws Exception {
        switch (type) {
        case INTEGER:
            return origin != null && origin.length() > 0 ? Integer.parseInt(origin) : null;
        case LONG:
            return origin != null && origin.length() > 0 ? Long.parseLong(origin) : null;
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
     * 
     * @param headers
     * @return
     * @throws IOException
     */
    public static List<String> sanitizeHeaders(String[] headers) throws IOException {
        List<String> ret = new ArrayList<String>();
        boolean emptyFound = false;
        for (String h : headers) {
            if (h == null || h.isEmpty()) {
                emptyFound = true;
            } else {
                if (emptyFound) {
                    throw new IOException("Header value found after blank header");
                }
                ret.add(h);
            }
        }
        return ret;
    }

}
