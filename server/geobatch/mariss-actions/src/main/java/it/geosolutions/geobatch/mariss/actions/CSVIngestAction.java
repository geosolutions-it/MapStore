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
package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.annotations.CheckConfiguration;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessException;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProcessor;
import it.geosolutions.geobatch.mariss.ingestion.csv.configuration.CSVProcessorConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import org.apache.tools.ant.taskdefs.optional.Cab;
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

	/**
	 * Check processors configuration
	 */
	private void checkInit() {
		if(this.configuration.getProccesorsConfiguration() != null 
				&& (this.processors == null || this.processors.isEmpty())){
			// check the configuration for the processors
			for(CSVProcessorConfiguration csvProcessorConfig: this.configuration.getProccesorsConfiguration()){
				try {
					@SuppressWarnings("unchecked")
					Class<? extends CSVProcessor> processorClass = (Class<? extends CSVProcessor>) Class.forName(csvProcessorConfig.getClassName());
					CSVProcessor processor = processorClass.newInstance();
					// if it haven't an specific outputFeature, use the global
					if(csvProcessorConfig.getOutputFeature() == null 
							|| csvProcessorConfig.getOutputFeature().getDataStore() == null
							|| csvProcessorConfig.getOutputFeature().getDataStore().isEmpty()){
						csvProcessorConfig.setOutputFeature(this.configuration.getOutputFeature());
					}
					// if it haven't an specific time format configuration, use the global
					if(csvProcessorConfig.getTimeFormatConfiguration() == null){
						csvProcessorConfig.setTimeFormatConfiguration(this.configuration.getTimeFormatConfiguration());
					}
					// this method prepare the processor
					processor.setConfiguration(csvProcessorConfig);
					addProcessor(processor);
				} catch (Exception e) {
					LOGGER.error("Error creating the processor", e);
				} 
			}
		}
	}

	/**
     *
     */
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();

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
				if(canProcess(file)){
					processCSVFile(file);
				}else{
					// add the event to the return
					ret.add(fse);
				}
				
				// throw new ActionException(this, "Could not process " +
				// event);
			} else {
				// add the event to the return
				ret.add(event);
//				throw new ActionException(this, "EventObject not handled "
//						+ event);
			}
		}

		return ret;
	}
	
	/**
	 * Check if a file can be processed in this action
	 * 
	 * @param file
	 * @return
	 */
	private boolean canProcess(File file) {
		String fileName = file.getName();
		//TODO check processors also
		if(fileName.endsWith(".csv")){
			return true;
		}else{
			return false;
		}
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
				processor.setFileName(file.getName());
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
						+ processor.getFailCount();
				
				if(processor.getConfiguration() != null){
					successMsg += "\n* Type name: "
									+ processor.getConfiguration().getTypeName();
				}
				
				successMsg += "\n***************************************************\n";
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
