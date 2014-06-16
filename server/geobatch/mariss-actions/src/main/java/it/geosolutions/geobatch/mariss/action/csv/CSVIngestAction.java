/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2007-2014 GeoSolutions S.A.S.
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
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.annotations.CheckConfiguration;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessException;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessor;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;

import au.com.bytecode.opencsv.CSVReader;

@Action(configurationClass = CSVIngestConfiguration.class)
public class CSVIngestAction extends BaseAction<EventObject> implements
		InitializingBean {

	private final static Logger LOGGER = LoggerFactory
			.getLogger(CSVIngestAction.class);

	private List<CSVProcessor> processors;

	CSVIngestConfiguration configuration;

	public CSVIngestAction(final CSVIngestConfiguration configuration)
			throws IOException {
		super(configuration);
		this.configuration = configuration;
	}

	@Override
	@CheckConfiguration
	public boolean checkConfiguration() {
		return this.configuration != null
				&& this.configuration.getCsvSeparator() != null
				&& this.configuration.getCsvSeparator().length() == 1;
	}

	private void checkInit() {
		// TODO
		// if(cropDescriptorDao == null)
		// throw new IllegalStateException("cropDescriptorDao is null");
	}

	/**
     *
     */
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {

		listenerForwarder.setTask("Check config");

		// @autowired fields are injected *after* the checkConfiguration() is
		// called
		checkInit();

		listenerForwarder.started();

		CSVIngestConfiguration configuration = getConfiguration();
		if (configuration == null) {
			throw new IllegalStateException("ActionConfig is null.");
		}

		while (!events.isEmpty()) {
			EventObject event = events.poll();
			if (event instanceof FileSystemEvent) {
				FileSystemEvent fse = (FileSystemEvent) event;
				File file = fse.getSource();
				processCSVFile(file);
				// throw new ActionException(this, "Could not process " +
				// event);
			} else {
				throw new ActionException(this, "EventObject not handled "
						+ event);
			}
		}

		return new LinkedList<EventObject>();
	}
	
	protected void processCSVFile(File file) throws ActionException {
		LOGGER.info("Processing input file " + file);

		String[] headers = null;
		CSVReader reader = null;

		try {
			try {
				reader = new CSVReader(new FileReader(file), this.configuration
						.getCsvSeparator().charAt(0));
				headers = reader.readNext();
			} catch (IOException e) {
				throw new ActionException(this, "Error in reading CSV file", e);
			}

			// header list
			List<String> headersList;
			try {
				headersList = CSVIngestUtils.sanitizeHeaders(headers);
			} catch (IOException e) {
				throw new ActionException(this, "Error processing "
						+ file.getName(), e);
			}

			CSVProcessor processor = null;
			for (CSVProcessor p : processors) {
				if (p.canProcess(headersList)) {
					processor = p;
					break;
				}
			}

			if (processor == null) {
				LOGGER.warn("No processors found for file " + file.getName()
						+ "; headers: " + headersList);
				throw new ActionException(this, "No processors found for file "
						+ file.getName());
			}

			LOGGER.info("Processing CSV " + file.getName() + " with "
					+ processor.getClass().getSimpleName());
			try {
				processor.process(reader);
				String successMsg = "\n***************************************************"
						+ "\n********** SUCCESS: CSV ingestion resume **********"
						+ "\n***************************************************"
						+ "\n* Records inserted: "
						+ processor.getInsertCount()
						+ "\n* Records updated: "
						+ processor.getUpdateCount()
						+ "\n* Records removed: "
						+ processor.getRemoveCount()
						+ "\n* Failed records: "
						+ processor.getFailCount()
						+ "\n***************************************************\n";
				LOGGER.info(successMsg);
				listenerForwarder.progressing(99, successMsg);
			} catch (CSVProcessException ex) {
				throw new ActionException(this, "Error processing "
						+ file.getName(), ex);
			}
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
					throw new ActionException(this, "Error processing "
							+ file.getName(), e1);
				}
			}
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		processors = new ArrayList<CSVProcessor>();
	}

	public void addProcessor(CSVProcessor proc) {
		if (processors == null) {
			try {
				afterPropertiesSet();
			} catch (Exception e) {
				LOGGER.error("Error on initialization", e);
			}
		}
		processors.add(proc);
	}

}
