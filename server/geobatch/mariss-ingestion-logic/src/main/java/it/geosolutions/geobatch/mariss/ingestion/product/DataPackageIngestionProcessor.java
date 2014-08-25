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
package it.geosolutions.geobatch.mariss.ingestion.product;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.actions.ds2ds.util.FeatureConfigurationUtil;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.DecompressUtils;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.EventObject;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import javax.xml.bind.JAXB;
import javax.xml.bind.JAXBElement;
import javax.xml.datatype.XMLGregorianCalendar;

import net.opengis.gml.DirectPositionType;

import org.geotools.data.DataStore;
import org.geotools.jdbc.JDBCDataStore;
import org.opengis.feature.simple.SimpleFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Point;

import eu.europa.emsa.csndc.DataPackageType;
import eu.europa.emsa.csndc.DetectedShipReferenceType;
import eu.europa.emsa.csndc.ImageType;
import eu.europa.emsa.csndc.ShipType;

/**
 * Data ingestion for data package features
 * http://www.emsa.europa.eu/schemas/csndc/DataPackage/csndc_pkg.xsd
 * 
 * @author alejandro.diaz at geo-solutions.it
 * 
 */
@Action(configurationClass = DataPackageIngestionConfiguration.class)
public class DataPackageIngestionProcessor extends ProductIngestionProcessor {

	protected final static Logger LOGGER = LoggerFactory
			.getLogger(DataPackageIngestionProcessor.class);

	/**
	 * Action configuration
	 */
	private DataPackageIngestionConfiguration configuration;

	private static final String Q_NAME_ID = "id";
	private static final String Q_NAME_INCLUDE_IN_REPORT = "includeInReport";
	private static final String Q_NAME_POS = "pos";
	private static final String Q_NAME_TIMESTAMP = "timeStamp";
	private static final String Q_NAME_HEADING = "heading";
	private static final String Q_NAME_LENGTH = "length";
	private static final String Q_NAME_WIDTH = "width";
	private static final String Q_NAME_CONFIDENCE_LEVEL = "confidenceLevel";
	private static final String Q_NAME_IMAGE_IDENTIFIER = "imageIdentifier";
	private static final String Q_NAME_IMAGE_SPEED = "speed";
	
	/**
	 * CSV products type 1 to 3 files must have this in the name
	 */
	public static final String CSV_TYPE_1_TO_3= "type_1to3";
	
	/**
	 * CSV products type 5 files must have this in the name
	 */
	public static final String CSV_TYPE_5= "type_5";

	// constructors

	public DataPackageIngestionProcessor(
			final DataPackageIngestionConfiguration configuration)
			throws IOException {
		super(configuration);
		this.configuration = configuration;
		this.typeName = configuration.getTypeName();
		this.userName = configuration.getUserName();
		this.serviceName = configuration.getServiceName();
		this.targetTifFolder = configuration.getTargetTifFolder();
		this.imageMosaicConfiguration = configuration.getImageMosaicConfiguration();
	}
	
	public DataPackageIngestionProcessor() {
		super();
	}

	public DataPackageIngestionProcessor(String id, String name, String description) {
	    super(id, name, description);
	}

	public DataPackageIngestionProcessor(DataStore dataStore, String typeName) {
		super(dataStore, typeName);
	}

	public DataPackageIngestionProcessor(DataStore dataStore, String typeName,
			int projection) {
		super(dataStore, typeName, projection);
	}

	public DataPackageIngestionProcessor(DataStore dataStore, String typeName,
			int projection, String userName, String serviceName) {
		super(dataStore, typeName, projection, userName, serviceName);
	}

	public DataPackageIngestionProcessor(DataStore dataStore, String typeName,
			String userName, String serviceName) {
		super(dataStore, typeName, userName, serviceName);
	}

	public DataPackageIngestionProcessor(DataStore dataStore, String typeName,
			String userName, String serviceName, String targetTifFolder) {
		super(dataStore, typeName, userName, serviceName, targetTifFolder);
	}

	/**
	 * Process a GML file
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public Collection<? extends EventObject> processCompressedFile(String compressedFile)
			throws IOException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
		
		String msg = null;

		String zipPath = workingDir
				+ compressedFile.substring(compressedFile
						.lastIndexOf(File.separator));
		DecompressUtils.decompress(compressedFile, zipPath, true);

		// parse zip content
		File zipFolder = new File(zipPath);
		if (zipFolder.exists() && zipFolder.isDirectory()) {
			List<String> processedShips = new LinkedList<String>();
			List<String> inPackageShips = null;
			List<ShipType> ships = new LinkedList<ShipType>();
			File imageFile = null;
			for (String fileName : zipFolder.list()) {
				File file = new File(zipPath + File.separator + fileName);
				if (fileName.endsWith("PKCS.xml")) {
					inPackageShips = processDataPackage(file);
				} else if (fileName.endsWith(".xml")) {
					processedShips.add(fileName);
					ships.add(processShip(file));
				} else if (fileName.endsWith(".tif")
						|| fileName.endsWith(".nc")) {
					// it should be the tiff or the NetCDF file
					imageFile = file;
				}
			}
			ret.addAll(ingestData(processedShips, inPackageShips, ships, imageFile));
		} else {
			throw new IOException(
					"The file isn't a zip file or an error occur trying to decompress");
		}

//		return msg;
		return ret;
	}

	/**
	 * Process a DataPackageType XML file
	 * 
	 * @param file
	 * @return
	 */
	public List<String> processDataPackage(File file) {
		List<String> shipFiles = new LinkedList<String>();

		try {
			DataPackageType dataPackage = JAXB.unmarshal(file,
					DataPackageType.class);

			for (DetectedShipReferenceType detectedReferenceShip : dataPackage
					.getDetectedShips().getDetectedShipReference()) {
				shipFiles.add(detectedReferenceShip.getFileName());
			}
		} catch (Exception e) {
			LOGGER.error("Error parsing the XML", e);
		}

		return shipFiles;
	}

	/**
	 * Process a Ship XML file
	 * 
	 * @param file
	 * @return
	 */
	public ShipType processShip(File file) {
		ShipType ship = null;

		try {
			ship = JAXB.unmarshal(file, ShipType.class);
		} catch (Exception e) {
			LOGGER.error("Error parsing the XML", e);
		}

		return ship;
	}

	/**
	 * Ingest readed data from the zip
	 * 
	 * @param processedShips
	 * @param inPackageShips
	 * @param ships
	 * @param tifFile
	 * @return
	 */
	private Collection<? extends EventObject> ingestData(List<String> processedShips,
			List<String> inPackageShips, List<ShipType> ships, File imageFile) {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
		
		if (LOGGER.isTraceEnabled()) {
			LOGGER.trace("Tif file is  --> " + imageFile);
			LOGGER.trace("Ships are  --> " + ships);
		}
		List<SimpleFeature> shipList = new LinkedList<SimpleFeature>();
		for (ShipType ship : ships) {
			SimpleFeature feature = createShipData(ship);
			if (feature != null) {
				shipList.add(feature);
			}
		}
		// persist the ship list
		persist(shipList);
		if (imageFile != null) {
			if (imageFile.getName().endsWith(".tif")) {
				// add the image mosaic
				ret.add(addImageMosaic(imageFile));
			} else if (imageFile.getName().endsWith(".nc")) {
				// add NetCDF image
				ret.add(addNetCDF(imageFile));
			}
		}
//		return "Succesfully insert of " + shipList.size() + " ships";
		return ret;
	}

	/**
	 * Create the ship feature with the XML data parsed
	 * 
	 * @param shipData
	 * 
	 * @return SimpleFeature ready to insert
	 */
	public SimpleFeature createShipData(ShipType shipData) {
		SimpleFeature feature = null;
		try {
			// Read properties
			String externalId = null;
			boolean includeInReport = false;
			DirectPositionType pos = null;
			XMLGregorianCalendar timestamp = null;
			BigInteger heading = null;
			Double length = null;
			Double width = null;
			Double confidenceLevel = null;
			ImageType imageIdentifier = null;
			Double speed = null;
			for (JAXBElement<?> element : shipData.getRest()) {
				String localPart = element.getName().getLocalPart();
				Object value = element.getValue();
				if (LOGGER.isTraceEnabled()) {
					LOGGER.trace("Reading ship element: " + element.getName()
							+ "=" + value);
				}
				if (Q_NAME_ID.equals(localPart)) {
					externalId = (String) value;
				} else if (Q_NAME_INCLUDE_IN_REPORT.equals(localPart)) {
					includeInReport = (Boolean) value;
				} else if (Q_NAME_POS.equals(localPart)) {
					pos = (DirectPositionType) value;
				} else if (Q_NAME_TIMESTAMP.equals(localPart)) {
					timestamp = (XMLGregorianCalendar) value;
				} else if (Q_NAME_HEADING.equals(localPart)) {
					heading = (BigInteger) value;
				} else if (Q_NAME_LENGTH.equals(localPart)) {
					length = (Double) value;
				} else if (Q_NAME_WIDTH.equals(localPart)) {
					width = (Double) value;
				} else if (Q_NAME_CONFIDENCE_LEVEL.equals(localPart)) {
					confidenceLevel = (Double) value;
				} else if (Q_NAME_IMAGE_IDENTIFIER.equals(localPart)) {
					imageIdentifier = (ImageType) value;
				} else if (Q_NAME_IMAGE_SPEED.equals(localPart)) {
					speed = (Double) value;
				}
			}

			if (LOGGER.isTraceEnabled()) {
				LOGGER.trace("Ready to create the feature");
			}

			if (externalId != null) {
				feature = createFeature();

				// service name is composed by user and service
				feature.setAttribute("service_name", userName + "@"
						+ serviceName);
				// other feature elements
				feature.setAttribute("time", timestamp != null ? new Timestamp(
						timestamp.getMillisecond()) : null);
				feature.setAttribute("heading", heading);
				feature.setAttribute("length", length);
				feature.setAttribute("width", width);
				feature.setAttribute("confidence_level", confidenceLevel);
				feature.setAttribute("speed", speed);
				feature.setAttribute("include_in_report", includeInReport);
				feature.setAttribute("external_id", externalId);
				feature.setAttribute("image",
						imageIdentifier != null ? imageIdentifier.getValue()
								: null);
				feature.setAttribute("image_type",
						imageIdentifier != null ? imageIdentifier.getType()
								: null);

				// save position
				if (pos != null) {
					Point point = geometryFactory.createPoint(new Coordinate(
							pos.getValue().get(1), pos.getValue().get(0)));
					point.setSRID(projection);
					feature.setAttribute("the_geom", point);
				}
			} else {
				LOGGER.error("Could'nt create feature");
			}

		} catch (Exception e) {
			LOGGER.error("Error creating feature", e);
		}
		return feature;
	}

	/**
	 * Check file formats
	 */
	@Override
	public boolean canProcess(String filePath) {
		if(filePath.endsWith(".zip") 
				|| filePath.endsWith(".tgz")){
			return true;
		}else{
			return false;
		}
	}

	@Override
	public Collection<? extends EventObject> doProcess(String filePath) throws IOException {
		return processCompressedFile(filePath);
	}

	/**
	 * Check if the CSV files are correct (have a type1to3 and type5 files)
	 * 
	 * @param csvFiles
	 * 
	 * @return not complete files
	 */
	public static List<String> checkCSVFiles(List<String> csvFiles) {
		// check if each CSV file type 1 to 3 CSV has also a CSV file type 5 
		List<String> csvType1To3 = new LinkedList<String>();
		List<String> csvType5 = new LinkedList<String>();
		List<String> csvNotCompleted = new LinkedList<String>();
		
		// distinct both lists
		for(String name: csvFiles){
			if(name.contains(CSV_TYPE_1_TO_3)){
				csvType1To3.add(name);
			}else if(name.contains(CSV_TYPE_5)){
				csvType5.add(name);
			}
		}
		
		// check one by one
		for(String name: csvType1To3){
			String csv5File = name.replace(CSV_TYPE_1_TO_3, CSV_TYPE_5);
			if(csvType5.contains(csv5File)){
				// both files are available
				csvType5.remove(csv5File);
			}else{
				// not available the CSV type 5
				csvNotCompleted.add(name);
			}
		}
		
		// all files in csvType5 list haven't a CSV type 1 to 3
		csvNotCompleted.addAll(csvType5);
		
		return csvNotCompleted;
	}

	@Override
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
						@SuppressWarnings("unused")
						File file = fileEvent.getSource();
						// Don't read configuration for the file, just
						// this.outputfeature configuration
						DataStore ds = FeatureConfigurationUtil
								.createDataStore(configuration
										.getOutputFeature());
						if (ds == null) {
							throw new ActionException(this,
									"Can't find datastore ");
						}
						try {
							if (!(ds instanceof JDBCDataStore)) {
								throw new ActionException(this,
										"Bad Datastore type "
												+ ds.getClass().getName());
							}
							JDBCDataStore dataStore = (JDBCDataStore) ds;
							dataStore.setExposePrimaryKeyColumns(true);
//							doProcess(configuration, dataStore);
//
//							// pass the feature config to the next action
//							ret.add(new FileSystemEvent(((FileSystemEvent) ev)
//									.getSource(),
//									FileSystemEventType.FILE_ADDED));
							// return next events configurations
							Queue<EventObject> resultEvents = doProcess(dataStore, file, (FileSystemEvent) ev);
							ret.addAll(resultEvents);
						} finally {
							ds.dispose();
						}
					}

					// add the event to the return
					ret.add(ev);

				} else {
					if (LOGGER.isErrorEnabled()) {
						LOGGER.error("Encountered a NULL event: SKIPPING...");
					}
					continue;
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

	private Queue<EventObject> doProcess(
			JDBCDataStore dataStore,
			File file,
			FileSystemEvent orginalEvent) throws IOException {
		
		
		LOGGER.info("Trying to process " + file.getName());

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
		
		if(canProcess(file.getAbsolutePath())){
			// get user name and service name from the name of the ingestion
			String fileName = file.getName();
			if(fileName != null){
				Map<String, String> fileParameters = CSVIngestUtils.getParametersFromName(fileName);
				if(fileParameters.containsKey(CSVIngestUtils.USER_FILE_PARAMETER)){
					userName = fileParameters.get(CSVIngestUtils.USER_FILE_PARAMETER);
				}
				if(fileParameters.containsKey(CSVIngestUtils.SERVICE_FILE_PARAMETER)){
					serviceName = fileParameters.get(CSVIngestUtils.SERVICE_FILE_PARAMETER);
				}
			}
			prepare(dataStore, configuration.getTypeName());
			ret.addAll(doProcess(file.getAbsolutePath()));
		}else{
			// is not processed in this action
			ret.add(orginalEvent);
		}
		return ret;
	}

	@Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return true;
	}

}
