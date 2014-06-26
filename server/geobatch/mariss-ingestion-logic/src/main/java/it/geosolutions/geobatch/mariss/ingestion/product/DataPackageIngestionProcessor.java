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

import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Enumeration;
import java.util.LinkedList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.xml.bind.JAXB;
import javax.xml.bind.JAXBElement;
import javax.xml.datatype.XMLGregorianCalendar;

import net.opengis.gml.DirectPositionType;

import org.apache.commons.io.FileUtils;
import org.geotools.data.DataStore;
import org.geotools.graph.util.ZipUtil;
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
public class DataPackageIngestionProcessor extends ProductIngestionProcessor {

	protected final static Logger LOGGER = LoggerFactory
			.getLogger(DataPackageIngestionProcessor.class);

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

	private String csvIngestionPath;

	// constructors
	public DataPackageIngestionProcessor() {
		super();
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
	
	public DataPackageIngestionProcessor(DataStore dataStore, String typeName, String userName, String serviceName, String targetTifFolder){
		super(dataStore, typeName, userName, serviceName, targetTifFolder);
	}

	/**
	 * Process a GML file
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public String processZip(String zipFile) throws IOException {
		String msg = "";

		String zipPath = workingDir
				+ zipFile.substring(zipFile.lastIndexOf(File.separator));
		unzip(zipFile, zipPath, true);

		// parse zip content
		File zipFolder = new File(zipPath);
		if (zipFolder.exists() && zipFolder.isDirectory()) {
			List<String> csvFiles = new LinkedList<String>();
			List<String> processedShips = new LinkedList<String>();
			List<String> inPackageShips = null;
			List<ShipType> ships = new LinkedList<ShipType>();
			File tifFile = null;
			for (String fileName : zipFolder.list()) {
				File file = new File(zipPath + File.separator + fileName);
				if (fileName.endsWith("PKCS.xml")) {
					inPackageShips = processDataPackage(file);
				} else if (fileName.endsWith(".xml")) {
					processedShips.add(fileName);
					ships.add(processShip(file));
				} else if (fileName.endsWith(".tif")) {
					// it should be the tiff
					tifFile = file;
				} else if (fileName.endsWith(".csv")) {
					csvFiles.add(zipPath + File.separator + fileName);
				}
			}
			if(!csvFiles.isEmpty()){
				msg = ingestData(csvFiles);
			}
			msg += ingestData(processedShips, inPackageShips, ships, tifFile);
		} else {
			throw new IOException(
					"The file isn't a zip file or an error occur trying to decompress");
		}

		return msg;
	}

	/**
	 * Ingestion for CSV files 
	 * 
	 * @param csvFiles
	 * 
	 * @return message with the reference of each ingestion	
	 */
	public String ingestData(List<String> csvFiles) {
		String msg = "";
		if(checkCSVFiles(csvFiles).isEmpty()){
			for(String csv: csvFiles){
				File inputFile = new File(csv);
				try {
					String csvFileName = CSVIngestUtils.getUserServiceFileName(inputFile.getName(), userName, serviceName);
					FileUtils.copyFile(inputFile,
							new File(getCsvIngestionPath()
									+ File.separator + csvFileName));
					msg += "Delegated on CSV ingestion for the file "+ inputFile.getName() + "\n";
				} catch (IOException e) {
					LOGGER.error("Error copying " + inputFile + " for the CSV ingestion", e);
				}
			}
		}
		return msg;
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
	private String ingestData(List<String> processedShips,
			List<String> inPackageShips, List<ShipType> ships, File tifFile) {
		String msg = "";
		if(LOGGER.isTraceEnabled()){
			LOGGER.trace("Tif file is  --> " + tifFile);
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
		if(tifFile != null){
			// add the image mosaic
			addImageMosaic(tifFile);
			// update msg
			msg += "Added tif file " + tifFile + "\n"; 
		}
		
		// update msg
		if(shipList.size()  == 0){
			msg += "No ship data ingested";
		}else{
			msg += "Succesfully insert of " + shipList.size() + " ships";
		}
		
		return msg;
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
	 * Unzip the zip file in a folder checking and cleaning the target folder
	 * 
	 * @param zipFilename
	 * @param outdir
	 * @param cleanAndCreateFolder
	 *            flag to clean and create the target folder
	 * @throws IOException
	 */
	public static void unzip(String zipFilename, String outdir,
			boolean cleanAndCreateFolder) throws IOException {
		if (cleanAndCreateFolder) {
			File zipFolder = new File(outdir);
			if (zipFolder.exists()) {
				FileUtils.deleteDirectory(zipFolder);
			}
			FileUtils.forceMkdir(zipFolder);
		}
		unzip(zipFilename, outdir);
	}

	/**
	 * Unzip the file in a target folder. It fixes a bug for linux environments
	 * on {@link ZipUtil#unzip(String, String)} using the File.separator instead
	 * "\\"
	 * 
	 * @param zipFilename
	 * @param outdir
	 * @throws IOException
	 */
	public static void unzip(String zipFilename, String outdir)
			throws IOException {
		ZipFile zipFile = new ZipFile(zipFilename);
		@SuppressWarnings("rawtypes")
		Enumeration entries = zipFile.entries();

		while (entries.hasMoreElements()) {
			ZipEntry entry = (ZipEntry) entries.nextElement();
			byte[] buffer = new byte[1024];
			int len;

			InputStream zipin = zipFile.getInputStream(entry);
			BufferedOutputStream fileout = new BufferedOutputStream(
					new FileOutputStream(outdir + File.separator
							+ entry.getName()));

			while ((len = zipin.read(buffer)) >= 0)
				fileout.write(buffer, 0, len);

			zipin.close();
			fileout.flush();
			fileout.close();
		}
	}

	@Override
	public boolean canProcess(String filePath) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public String doProcess(String filePath) throws IOException {
		return processZip(filePath);
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

	/**
	 * @return the csvIngestionPath
	 */
	public String getCsvIngestionPath() {
		return csvIngestionPath;
	}

	/**
	 * @param csvIngestionPath the csvIngestionPath to set
	 */
	public void setCsvIngestionPath(String csvIngestionPath) {
		this.csvIngestionPath = csvIngestionPath;
	}

}
