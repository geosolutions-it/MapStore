/*
 *    GeoTools - The Open Source Java GIS Toolkit
 *    http://geotools.org
 *
 *    (C) 2015, Open Source Geospatial Foundation (OSGeo)
 *
 *    This library is free software; you can redistribute it and/or
 *    modify it under the terms of the GNU Lesser General Public
 *    License as published by the Free Software Foundation;
 *    version 2.1 of the License.
 *
 *    This library is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *    Lesser General Public License for more details.
 */
package it.geosolutions.geobatch.mariss.actions.sartiff;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.mariss.actions.MarissBaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ShipDetection;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction.SARType;

import java.io.File;
import java.io.FileFilter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.geotools.data.DataStore;

/**
 * @author Alessio
 * 
 */
public abstract class SarGeoTIFFAction extends MarissBaseAction {

	/**
	 * 
	 * @param actionConfiguration
	 */
	public SarGeoTIFFAction(IngestionActionConfiguration actionConfiguration) {
		super(actionConfiguration);

	}

	/**
	 * Execute process
	 */
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();

		while (events.size() > 0) {
			final EventObject ev;
			try {
				if ((ev = events.remove()) != null) {
					if (LOGGER.isTraceEnabled()) {
						LOGGER.trace("Working on incoming event: "
								+ ev.getSource());
					}
					if (ev instanceof FileSystemEvent) {
						FileSystemEvent fileEvent = (FileSystemEvent) ev;
						// if the file is processable
						if (canProcess(fileEvent)) {
							AttributeBean attributes = new AttributeBean();
							SarGeoTiffProcessingResult processResult =  processFile(fileEvent.getSource(),attributes);
							File tif = processResult.getGeoTiff();
							
						}
					}
				}
			} catch (Exception ioe) {
				final String message = "Unable to produce the output: "
						+ ioe.getLocalizedMessage();
				if (LOGGER.isErrorEnabled())
					LOGGER.error(message, ioe);

				throw new ActionException(this, message);
			}
		}
		return ret;
	}

	/**
	 * Check if a file can be processed in this action. To override in actions
	 * 
	 * @param event
	 * @return
	 */
	public boolean canProcess(FileSystemEvent event) {
		File file = event.getSource();
		String extension = FilenameUtils.getExtension(file.getName());
		return extension != null && !extension.isEmpty()
				&& (extension.equalsIgnoreCase("zip"));
	}

	/**
	 * Process the zip file to get the tiff and populate Attributes
	 * @param source the source zip file
	 * @param attributeBean the attribute to populate
	 * @return the tif file if any
	 * @throws ActionException
	 */
	public SarGeoTiffProcessingResult processFile(File source,AttributeBean attributeBean) throws ActionException {
		// Create a new Container for all the attributes
		
		// Getting file name
		File inputFile = source;
		attributeBean.absolutePath = inputFile.getAbsolutePath();
		attributeBean.maskOneIsValid = container.isMaskOneIsValid();
		File tifDir = unzipFile(inputFile);
		String identifier = inputFile.getName().substring(0,
                inputFile.getName().length() - 8);
		attributeBean.identifier = identifier;
        // Getting SARType
		attributeBean.type = SARType.getType(getActionName());
        // Don't read configuration for the file, just
        // this.outputfeature configuration
        DataStore ds = FeatureConfigurationUtil
                .createDataStore(configuration.getOutputFeature());
		// Getting the tif file
		File tifFile = searchTiff(attributeBean, tifDir);
		File[] shipDetectionFiles = getShipDetections(attributeBean, tifDir);
		
		//Setup result of processing
		SarGeoTiffProcessingResult result = new SarGeoTiffProcessingResult();
		result.setGeoTiff(tifFile);
		if(shipDetectionFiles.length >0 ){
			List<ShipDetection> shipDetections = readShipDetections(shipDetectionFiles);
			result.setShipDetections(shipDetections);
		}
		
		
		
		
		return result;

	}
	private String getActionName() {
		return "sar";
	}

	/**
	 * Search the tif file in the directory and populate the attribute bean 
	 * with its temporal info
	 * @param attributeBean
	 * @param tifDir
	 */
	public File searchTiff(AttributeBean attributeBean, File tifDir) {
		File tifFile = null;
		if (tifDir != null && tifDir.exists() && tifDir.canExecute()
				&& tifDir.canRead()) {
			// Filtering the files
			IOFileFilter file = FileFilterUtils.fileFileFilter();
			IOFileFilter netCDF = FileFilterUtils.suffixFileFilter("tif");
			FileFilter and = FileFilterUtils.and(file, netCDF);
			File[] files = tifDir.listFiles(and);
			// Getting the first tiff file if present
			if (files != null && files.length > 0) {
				tifFile = files[0];
				// Getting Time dimension if present
				Pattern pattern = Pattern.compile(container.getPattern());
				Matcher m = pattern.matcher(attributeBean.absolutePath);
				if (m.matches()) {
					// Getting dates
					String date = m.group(1);
					String date2 = m.group(2);
					SimpleDateFormat toSdf = new SimpleDateFormat(
							"yyyyMMdd'T'HHmmss");
					toSdf.setTimeZone(TimeZone.getTimeZone("UTC"));
					try {
						attributeBean.timedim = toSdf.parse(date);
					} catch (ParseException e) {
						LOGGER.error(e.getMessage());
					}
				}

			}
		}
		return tifFile;
	}
}
