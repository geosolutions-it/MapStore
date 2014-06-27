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
package it.geosolutions.geobatch.catalog.impl;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;

import java.sql.Timestamp;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JUnit test for {@link TimeFormat} utilities for specific CSV ingestion Date formatters 
 * 
 * @author adiaz
 */
public class TimeFormatTest {

    private final static Logger LOGGER = LoggerFactory.getLogger(TimeFormatTest.class);
	
	/**
	 * Test the CSV ingestion dates formats
	 * 
	 * @throws Exception if some error occur
	 */
	@Test
	public void marissCSVTimeTest() throws Exception {
		
		try{
			TimeFormat timeFormat = new TimeFormat(null, null,
					"Time format default", new TimeFormatConfiguration(null, null,
							"Time format configuration"));
			timeFormat.setParseLenient(true);
			timeFormat.setCheckAllPatern(true);
			// Check the CSV time format (for product1to3)
			Timestamp time = timeFormat.getTimeStamp("2014-03-21 21:42:45");
			assertNotNull(time);
			assertEquals(time.toString(), "2014-03-21 21:42:45.0");
			// Check the CSV time format (for product1to3) without 0
			time = timeFormat.getTimeStamp("2014-3-21 21:42:45");
			assertNotNull(time);
			assertEquals(time.toString(), "2014-03-21 21:42:45.0");
			// Check the CSV timemsg (for product5) without 0
			time = timeFormat.getTimeStamp("3/21/2014 11:00:00 PM");
			assertNotNull(time);
			assertEquals(time.toString(), "2014-03-21 11:00:00.0");
			// Check the CSV time (for product5) repeat with 0
			time = timeFormat.getTimeStamp("03/21/2014 11:00:00 PM");
			assertNotNull(time);
			assertEquals(time.toString(), "2014-03-21 11:00:00.0");
		}catch(Exception e){
			e.printStackTrace();
			LOGGER.error("Error on test", e);
			throw new Exception(e);
		}
	}

}
