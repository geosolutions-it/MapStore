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
import it.geosolutions.geobatch.geoserver.tools.WorkspaceUtils;
import it.geosolutions.geobatch.mariss.actions.MarissBaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationUtils;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction.SARType;
import it.geosolutions.geobatch.mariss.actions.netcdf.ShipDetection;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher.ParameterConfigure;
import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.geoserver.rest.manager.GeoServerRESTImporterManager;

import java.io.File;
import java.io.FileFilter;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.geotools.data.DataSourceException;
import org.geotools.data.DataStore;
import org.geotools.gce.geotiff.GeoTiffReader;
import org.geotools.geometry.jts.JTS;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.jdbc.JDBCDataStore;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import com.vividsolutions.jts.geom.Geometry;

/**
 * @author Alessio Fabiani, GeoSolutions
 * @author Lorenzo Natali, GeoSolutions
 * 
 * Base Class that ingests a GeoTIFF with ship detections
 * 
 */
public abstract class SarGeoTIFFAction extends MarissBaseAction {
	
	private static String COVERAGE_NAME = "sar";

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
							AttributeBean attributeBean = new AttributeBean();
							LOGGER.info("recognized as SAR-GeoTiff process");
							// pre process file (extract, get file and data to
							// publish
							SarGeoTiffProcessingResult processResult = processFile(
									fileEvent.getSource(), attributeBean);

							// publish data
							publishData(attributeBean, processResult);

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
	 * Publish data from the file processing result
	 * 
	 * @param attributeBean
	 * @param processResult
	 * @throws ActionException
	 */
	private void publishData(AttributeBean attributeBean,
			SarGeoTiffProcessingResult processResult) throws ActionException {
		//
		// publish result
		//

		// initialize data store
		DataStore ds = FeatureConfigurationUtil.createDataStore(configuration
				.getOutputFeature());
		if (ds == null) {
			throw new ActionException(this, "Can't find datastore ");
		}
		
		try {
			if (!(ds instanceof JDBCDataStore)) {
				throw new ActionException(this, "Bad Datastore type "
						+ ds.getClass().getName());
			}
			attributeBean.dataStore = (JDBCDataStore) ds;
			attributeBean.dataStore.setExposePrimaryKeyColumns(true);

			// Get the image to publish
			File tif = processResult.getGeoTiff();
			
			//TODO get env from geotiff
			boolean published = false;
			if (tif != null) {
				published = publishGeotiff(attributeBean, tif);

			}
			if(published){
				if (LOGGER.isInfoEnabled()) {
                    LOGGER.info("Coverage SUCCESSFULLY sent to GeoServer!");
                }
				//
				//create a record in the product table
                //
				
				
				// Create a Geometry for the Tiff envelope
                Geometry geo = JTS.toGeometry(new ReferencedEnvelope(attributeBean.env));
                CoordinateReferenceSystem crs = attributeBean.env.getCoordinateReferenceSystem();
                geo.setUserData(crs);
                
                //  publish ship detections
                publishShipDetections(attributeBean, processResult);
                
                // update table of products
                publishProducts(attributeBean, tif, geo);
			}
			
			

		} finally {
			ds.dispose();
		}
	}

	public void publishProducts(AttributeBean attributeBean, File tif,
			Geometry geo) throws ActionException {
		insertDb(attributeBean, tif.getAbsolutePath(), configuration.getContainer().getDefaultNameSpace(), getActionName(),
		        getActionName(), geo);
	}

	public void publishShipDetections(AttributeBean attributeBean,
			SarGeoTiffProcessingResult processResult) throws ActionException {
		
		List<ShipDetection> shipDetections = processResult.getShipDetections();
		if (shipDetections.size() > 0) {
		    insertShipDetectionsIntoDb(attributeBean, shipDetections);
		}
	}

	/**
	 * Publish the geotiff
	 * 
	 * @param attributeBean
	 * @param tif
	 * @throws ActionException
	 */
	private boolean publishGeotiff(AttributeBean attributeBean, File tif)
			throws ActionException {

		// Configuring REST publisher support
		GeoServerRESTPublisher publisher = new GeoServerRESTPublisher(
				configuration.getGeoserverURL(),
				configuration.getGeoserverUID(),
				configuration.getGeoserverPWD());
		GeoServerRESTReader reader = null;
		String namespace = container.getDefaultNameSpace();
		String namespaceURI = container.getDefaultNameSpace();

		try {
			reader = new GeoServerRESTReader(configuration.getGeoserverURL(),
					configuration.getGeoserverUID(),
					configuration.getGeoserverPWD());

			if (!reader.existsWorkspace(namespace)) {
				WorkspaceUtils.createWorkspace(reader, publisher, namespace,
						namespaceURI);
			}
		} catch (Exception e) {
			throw new ActionException(SarGeoTIFFAction.class,
					e.getLocalizedMessage());
			// DEBUG : LOGGER.warn(e.getLocalizedMessage(), e);
		}

		
		// Zip all the elements
		boolean isCreated = false;
		try {
			// TODO optimize tiff using importer
			// TODO create empty mosaic if doesnt exists
			boolean published = isMosaicConfigured(reader, COVERAGE_NAME);
			String newFileName = IDENTIFIER_SEPARATOR + attributeBean.identifier + IDENTIFIER_SEPARATOR
                    + SERVICE_SEPARATOR + configuration.getServiceName() + SERVICE_SEPARATOR
                    + tif.getName();
			if (!published) {
				published = createEmptyMosaic(publisher,newFileName);
			}
			//force because you receive errors
			if(published){
				// copy file into harvesting directory
				File mosaicDir = new File(container.getParams().get(
                        ConfigurationUtils.GEOTIFF_DIRECTORY_KEY), getActionName());
                if (!mosaicDir.exists()) {
                    FileUtils.forceMkdir(mosaicDir);
                    // mosaicDir.createNewFile();
                }
                // Create the new NetCDF file
                File newFile = new File(mosaicDir, newFileName);
                
                // Copy the file
                try {
                	if(!newFile.exists()){
                		LOGGER.warn("THE FILE " + newFile.getAbsolutePath() + " already exists!!! deleting it");
                		newFile.delete();
                	}
                	FileUtils.copyFile(tif, newFile);
                } catch (IOException e) {
                    throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                }
				//TODO optimize geotiff
        		String optimizationOptions = configuration.getContainer().getParams().get(ConfigurationUtils.OPTIMIZATION_OPTION);
        		if(optimizationOptions !=null){
        			List<String> transformations = Arrays.asList(optimizationOptions.split(","));
        			optimizeGeoTiff(newFile,transformations);
        		}

				//run harvesting
                //published &=  publisher.harvestExternal(container.getDefaultNameSpace(), getActionName(), "geotiff", newFile.getAbsolutePath());
                
                // get envelop of geotiff
				try {
					GeoTiffReader tr = new GeoTiffReader(newFile);
					attributeBean.env = tr.getOriginalEnvelope();
				} catch (DataSourceException e) {
					throw new ActionException(this, "Could't read the geotif to get envelop: "
							+ e.getMessage());
				}
			}
			if(!published){
				final String message = "Coverage was NOT sent to GeoServer due to connection errors!";
                if (LOGGER.isInfoEnabled()) {
                    LOGGER.info(message);
                }
                if (!configuration.isFailIgnored()) {
                    throw new ActionException(SarGeoTIFFAction.class, message);
                }
			}
			// last step configure the mosaic if ingstion finished
			if(isMosaicConfigured(reader, COVERAGE_NAME)){
				//TODO configure coverage
			}
			return published;
		} catch (Exception e) {
			throw new ActionException(SarGeoTIFFAction.class,
					e.getLocalizedMessage());
		}

	}

	/**
	 * Use Importer to optimize the geotif
	 * @param newFile
	 * @param transformations 
	 * @return
	 * @throws Exception 
	 */
	private void optimizeGeoTiff(File newFile, List<String> transformations) throws Exception {
		GeoServerRESTImporterManager publisher = new GeoServerRESTImporterManager(
				new URL(configuration.getGeoserverURL()),
				configuration.getGeoserverUID(),
				configuration.getGeoserverPWD());
		String requestBody = createImporterRequestBody(newFile);
		
		int i = publisher.postNewImport(requestBody);
		int t = publisher.putNewTask(i, newFile.getAbsolutePath());
		JSONObject  task = publisher.getTask(i, t);
		for(String transformation : transformations){
			publisher.putTaskLayer(i, t,transformation);
		}
		publisher.postImport(i);

	}

	public String createImporterRequestBody(File newFile) {
		JSONObject requestBody = new JSONObject();
		JSONObject importBlock = new JSONObject();
		
		//workspace
		JSONObject targetWorkspace = new JSONObject();
		HashMap<String,String> wp = new HashMap<String,String>();
		wp.put("name", container.getDefaultNameSpace());
		targetWorkspace.put("workspace",wp );
		importBlock.put("targetWorkSpace",targetWorkspace );
		
		// target store
		Map<String,String> dataStore = new HashMap<String,String>();
		dataStore.put("name", getActionName());
		JSONObject targetStore = new JSONObject();
		targetStore.put("dataStore", dataStore);
		importBlock.put("targetStore", targetStore);
		
		//data
		Map<String,String> data = new HashMap<String,String>();
		data.put("type","file");
		data.put("file",newFile.getAbsolutePath());
		importBlock.put("data", data);
		
		requestBody.put("import",importBlock);
		return requestBody.toString();
	}

	/**
	 * Create an empty mosaic
	 * @param publisher GeoServer publisher 
	 * @param file the filename
	 * @return boolean for success
	 * @throws ActionException
	 * @throws IOException
	 * @throws FileNotFoundException
	 */
	private boolean createEmptyMosaic(GeoServerRESTPublisher publisher, String file) throws ActionException, IOException,
			FileNotFoundException {
		boolean published = false;
		// Create the mosaic directory in the temporary geobatch directory
        File temp = new File(getTempDir(), "temp_mosaic_" + COVERAGE_NAME);
        FileUtils.forceMkdir(temp);
        File mosaicDir = new File(temp, getActionName());
		FileUtils.forceMkdir(mosaicDir);
		//
        // Getting Variable Name
        String variableName = /* getActionName() + */file.substring(file
                .lastIndexOf(SEPARATOR) + SEPARATOR.length());
        variableName = variableName.toLowerCase() /*.replace("_", "-")*/ ; 

        Map<String, String> additionalDimensions = new HashMap<String, String>();
        if (file.indexOf(CUSTOM_DIM_START_SEPARATOR) > 0) {
            String dimensions = file.substring(file.lastIndexOf(CUSTOM_DIM_START_SEPARATOR),
                    file.lastIndexOf(SEPARATOR));
            String dimensionNames[] = dimensions.split(CUSTOM_DIM_START_SEPARATOR);

            for (String dim : dimensionNames) {
                if (dim.trim().length() > 0) {
                    String[] theDim = dim.split(CUSTOM_DIM_VAL_SEPARATOR);
                    additionalDimensions.put(theDim[0], theDim[1]);
                }
            }
        }
		
		// Create the Mosaic elements
		createIndexerFile(mosaicDir, getActionName(),
				configuration.getServiceName(), null);
		createDatastoreFile(mosaicDir, getActionName());
		createRegexFiles(mosaicDir, getActionName(), null);

		// Zip all the elements
		File zipped = zipAll(temp, mosaicDir.listFiles(), mosaicDir.getName());

		// Publish the ImageMosaic
		published = publisher.publishImageMosaic(container
				.getDefaultNameSpace(), getActionName(), zipped,
				ParameterConfigure.NONE, new NameValuePair("coverageName",
						COVERAGE_NAME));
		
		return published;
	}

	 

	/**
	 * Check if the ImageMosaic Layer has been already configured
	 * 
	 * @return true if the ImageMosaic is configured, false otherwise
	 */
	protected boolean isMosaicConfigured(GeoServerRESTReader reader,
			String storename) {
		String coveragename = storename;// .replace("_", "-");
		return reader.existsCoverage(container.getDefaultNameSpace(),
				storename, coveragename);
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
	 * 
	 * @param source
	 *            the source zip file
	 * @param attributeBean
	 *            the attribute to populate
	 * @return the tif file if any
	 * @throws ActionException
	 */
	public SarGeoTiffProcessingResult processFile(File source,
			AttributeBean attributeBean) throws ActionException {
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

		File tifFile = searchTiff(attributeBean, tifDir);
		File[] shipDetectionFiles = getShipDetections(attributeBean, tifDir);

		// Setup result of processing
		SarGeoTiffProcessingResult result = new SarGeoTiffProcessingResult();
		result.setGeoTiff(tifFile);
		if (shipDetectionFiles.length > 0) {
			List<ShipDetection> shipDetections = readShipDetections(shipDetectionFiles);
			result.setShipDetections(shipDetections);
		}

		return result;

	}

	private String getActionName() {
		return "sar";
	}

	/**
	 * Search the tif file in the directory and populate the attribute bean with
	 * its temporal info
	 * 
	 * @param attributeBean
	 * @param tifDir
	 */
	public File searchTiff(AttributeBean attributeBean, File tifDir) {
		File tifFile = null;
		if (tifDir != null && tifDir.exists() && tifDir.canExecute()
				&& tifDir.canRead()) {
			// Filtering the files
			IOFileFilter file = FileFilterUtils.fileFileFilter();
			IOFileFilter tifFilter = FileFilterUtils.suffixFileFilter("tif");
			FileFilter and = FileFilterUtils.and(file, tifFilter);
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
