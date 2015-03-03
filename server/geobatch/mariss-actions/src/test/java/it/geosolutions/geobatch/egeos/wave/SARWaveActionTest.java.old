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
package it.geosolutions.geobatch.egeos.wave;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.egeos.BaseNetCDFActionTest;
import it.geosolutions.geobatch.metocs.base.NetCDFCFGeodetic2GeoTIFFsFileAction;

import java.io.File;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * JUnit test for {@link SARWaveAction} process
 * 
 * @author adiaz
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath:test-context.xml"})
public class SARWaveActionTest extends BaseNetCDFActionTest{
	
	protected final static Logger LOGGER = LoggerFactory
			.getLogger(SARWaveActionTest.class);

	private String filePathTest = "src/test/resources/SAR_wave.nc";

	/**
	 * Test the SARWaveAction process
	 * 
	 * @throws Exception
	 */
	@Test
	public void sarWaveTest() throws Exception {
		try{
			// configure
			SARWaveActionConfiguration configuration = new SARWaveActionConfiguration(
					null, null, null);
			prepareConfiguration(configuration);
			SARWaveAction action = new SARWaveAction(configuration);
			NetCDFCFGeodetic2GeoTIFFsFileAction netCDFToTiffAction = new NetCDFCFGeodetic2GeoTIFFsFileAction(getNetCDF2TiffConfig());
			// launch
			Queue<EventObject> events = new LinkedList<EventObject>();
			File file = new File(filePathTest);
			LOGGER.info("Loading " + file);
			FileSystemEvent event = new FileSystemEvent(file,
					FileSystemEventType.FILE_ADDED);
			events.add(event);
			// first operation
			Queue<EventObject> result = action.execute(events);
			assertNotNull(result);
			// second operation
			result = netCDFToTiffAction.execute(result);
			assertNotNull(result);
		}catch (Exception e){
			LOGGER.error("Error on the file process", e);
			fail();
		}
	}
}
