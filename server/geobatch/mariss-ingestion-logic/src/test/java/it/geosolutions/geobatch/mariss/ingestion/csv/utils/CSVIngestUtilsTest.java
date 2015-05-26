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
package it.geosolutions.geobatch.mariss.ingestion.csv.utils;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

/**
 * JUnit tests for {@link CSVIngestUtils}
 * 
 * @author adiaz
 */
public class CSVIngestUtilsTest {

    /**
     * Simple test for getParamers in name
     * 
     * @throws Exception
     */
    @Test
    public void getParametersInNameTest() throws Exception {
        Map<String, String> parameters = new HashMap<String, String>();
        String result = CSVIngestUtils.getParametersInName("name.csv", parameters);
        assertEquals(result, "name.csv");
        parameters.put("user", "test");
        parameters.put("service", "test2");
        result = CSVIngestUtils.getParametersInName("name.csv", parameters);
        Map<String, String> parameters2 = CSVIngestUtils.getParametersFromName(result);
        for (String name : parameters.keySet()) {
            assertEquals(parameters.get(name), parameters2.get(name));
        }
    }

}
