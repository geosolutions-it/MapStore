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
package it.geosolutions.geobatch.mariss.action.csv;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVAcqListProcessor;

import java.io.File;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Tests for CSV ingestion action
 * 
 * @author adiaz
 */
public class CSVIngestActionTest {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(CSVIngestAction.class);

	public CSVIngestActionTest() {
		super();
	}

	/**
	 * Generate a CSVAcqListProcessor processor to test 
	 * @return the processor
	 */
	private CSVAcqListProcessor getAcqProcessor() {
		CSVAcqListProcessor processor = null;
		try {
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("dbtype", "postgis");
			params.put("host", "localhost");
			params.put("port", 5432);
			params.put("schema", "public");
			params.put("database", "mariss");
			params.put("user", "mariss");
			params.put("passwd", "mariss");
			processor = new CSVAcqListProcessor(params, "acq_list",
					new TimeFormat(null, null, "Time format default",
							new TimeFormatConfiguration(null, null,
									"Time format configuration")));
			processor.setUserName("CLS");
			processor.setServiceName("CLS1");
		} catch (Exception e) {
			LOGGER.error("Error getting the processor", e);
		}
		return processor;
	}

	/**
	 * Process CSV files with the default CSV ingest action
	 * @throws Exception
	 */
	@Test
	public void loadAllAsEvent() throws Exception {
		CSVAcqListProcessor acqProcessor = getAcqProcessor();

		if (acqProcessor != null) {
			CSVIngestAction action = new CSVIngestAction(
					new CSVIngestConfiguration(null, null, null));
			action.addProcessor(acqProcessor);
			Queue<EventObject> events = new LinkedList<EventObject>();

			for (File file : FileUtils.listFiles(new File("."),
					new String[] { "csv" }, true)) {
				LOGGER.info("Loading " + file);
				FileSystemEvent event = new FileSystemEvent(file,
						FileSystemEventType.FILE_ADDED);
				events.add(event);
				@SuppressWarnings({ "unused", "rawtypes" })
				Queue result = action.execute(events);
			}
		} else {
			LOGGER.info("The local database is not available");
		}
	}
}