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
package it.geosolutions.geobatch.mariss.ingestion.csv;

import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVPropertyType;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.geotools.geometry.jts.JTSFactoryFinder;
import org.opengis.feature.simple.SimpleFeature;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LinearRing;

/**
 * Acquisition List CSV processor
 * 
 * @author adiaz
 */
public class CSVAcqListProcessor extends MarissCSVServiceProcessor {

	/**
	 * PK NAMES for the dao. the same that PK_PROPERTIES
	 */
	private static final String[] PK_NAMES = { "sensor", "sensor_mode",
			"start", "end" };

	static List<Integer> PK_PROPERTIES;
	static {
		// ID : "Sensor", "Acquisition Mode", "Start", "End"
		PK_PROPERTIES = new LinkedList<Integer>();
		PK_PROPERTIES.add(28);
		PK_PROPERTIES.add(29);
		PK_PROPERTIES.add(2);
		PK_PROPERTIES.add(3);
	}

	// constructors
	public CSVAcqListProcessor() {
		super();
	}

	public CSVAcqListProcessor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames) {
		super(connectionParam, typeName, pkNames);
	}

	public CSVAcqListProcessor(Map<String, Serializable> connectionParam,
			String typeName) {
		super(connectionParam, typeName);
	}

	public CSVAcqListProcessor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames, TimeFormat timeFormat) {
		super(connectionParam, typeName, pkNames, timeFormat);
	}

	public CSVAcqListProcessor(Map<String, Serializable> connectionParam,
			String typeName, TimeFormat timeFormat) {
		super(connectionParam, typeName, timeFormat);
	}

	/*
	 * GeometryFactory will be used to create the geometry attribute of each
	 * feature (a Point object for the location)
	 */
	GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory(null);

	
	// Id	Type	Start	End	Duration	Region	OZA	SZA	LookAngle	Min_Incid	Max_Incid	RelOrb	Pass	
	// NW_Lat	NW_Lon	NE_Lat	NE_Lon	SE_Lat	SE_Lon	SW_Lat	SW_Lon	Center_Lat	Center_Lon	
	// MLST_Start	MLST_End	DataSize	Satellite	Sensor	SensorMode	OrbName	Orbit	
	// Cycle	Track	Frames	Frame_Start	Frame_End	Revisiting	Slew	Polarization	Service Provider


	private final static List<String> HEADERS = Collections
			.unmodifiableList(Arrays.asList("*", "Type", "Start", "End",
					"Duration", "Region", "OZA", "SZA", "LookAngle", "Min_Incid",
					"Max_Incid", "RelOrb", "Pass", "NW_Lat", "NW_Lon", "NE_Lat", 
					"NE_Lon", "SE_Lat", "SE_Lon", "SW_Lat", "SW_Lon", "Center_Lat", "Center_Lon", 
					"MLST_Start", "MLST_End", "DataSize", "Satellite", "Sensor", "SensorMode", "OrbName", "Orbit", 
					"Cycle", "Track", "Frames", "Frame_Start", "Frame_End", "Revisiting", "Slew", "Polarization", "Service Provider"));
	
	
//	private final static List<String> HEADERS = Collections
//			.unmodifiableList(Arrays.asList("*", "Sensor", "Acquisition Mode",
//					"Start", "end", "Lat.nw", "Lon.nw", "Lat.ne", "Lon.ne",
//					"Lat.se", "Lon.se", "Lat.sw", "Lon.sw", "Lat.ce", "Lon.ce"));

	static List<CSVPropertyType> TYPES;
	static {
		TYPES = new LinkedList<CSVPropertyType>();
		// "*",
		TYPES.add(CSVPropertyType.IGNORE);
		// "Type",
		TYPES.add(CSVPropertyType.STRING);
		// "Start",
		TYPES.add(CSVPropertyType.DATE_TIME);
		// "End",
		TYPES.add(CSVPropertyType.DATE_TIME);
		// "Duration", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Region", 
		TYPES.add(CSVPropertyType.STRING);
		// "OZA", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "SZA", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "LookAngle", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Min_Incid",
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Max_Incid", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "RelOrb", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Pass", 
		TYPES.add(CSVPropertyType.STRING);
		// "NW_Lat", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "NW_Lon", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "NE_Lat", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "NE_Lon", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "SE_Lat", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "SE_Lon", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "SW_Lat", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "SW_Lon", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Center_Lat", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Center_Lon", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "MLST_Start", 
		TYPES.add(CSVPropertyType.STRING);
		// "MLST_End", 
		TYPES.add(CSVPropertyType.STRING);
		// "DataSize", 
		TYPES.add(CSVPropertyType.DOUBLE);
		// "Satellite", 
		TYPES.add(CSVPropertyType.STRING);
		// "Sensor", 
		TYPES.add(CSVPropertyType.STRING);
		// "SensorMode", 
		TYPES.add(CSVPropertyType.STRING);
		// "OrbName", 
		TYPES.add(CSVPropertyType.STRING);
		// "Orbit", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Cycle", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Track", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Frames", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Frame_Start", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Frame_End", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Revisiting", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Slew", 
		TYPES.add(CSVPropertyType.INTEGER);
		// "Polarization", 
		TYPES.add(CSVPropertyType.STRING);
		// "Service Provider"
		TYPES.add(CSVPropertyType.STRING);
	}

	@Override
	public List<Integer> getPkProperties() {
		return PK_PROPERTIES;
	}

	@Override
	public List<String> getHeaders() {
		return HEADERS;
	}

	@Override
	public List<CSVPropertyType> getTypes() {
		return TYPES;
	}

	@Override
	public String[] getPkNames() {
		return PK_NAMES;
	}

	public SimpleFeature merge(SimpleFeature old, Object[] properties) {
		SimpleFeature feature = null;
		try {
			if (old != null) {
				feature = (SimpleFeature) old;
			} else {
				feature = createFeature();
			}

			// Remember the CSV headers
			// "*". "Sensor", "Acquisition Mode", "Start", "end", "Lat.nw",
			// "Lon.nw", "Lat.ne", "Lon.ne", "Lat.se", "Lon.se", "Lat.sw",
			// "Lat.sw", "Lon.sw", "Lat.ce", "Lon.ce"));

			int idx = 1;
			// "Type",
			feature.setAttribute("type", properties[idx++]);
			// "Start",
			feature.setAttribute("start", properties[idx++]);
			// "End",
			feature.setAttribute("end", properties[idx++]);
			// "Duration", 
			feature.setAttribute("duration", properties[idx++]);
			// "Region", 
			feature.setAttribute("region", properties[idx++]);
			// "OZA", 
			feature.setAttribute("oza", properties[idx++]);
			// "SZA", 
			feature.setAttribute("sza", properties[idx++]);
			// "LookAngle", 
			feature.setAttribute("look_angle", properties[idx++]);
			// "Min_Incid",
			feature.setAttribute("min_incid", properties[idx++]);
			// "Max_Incid", 
			feature.setAttribute("max_incid", properties[idx++]);
			// "RelOrb", 
			feature.setAttribute("rel_orb", properties[idx++]);
			// "Pass", 
			feature.setAttribute("pass", properties[idx++]);
			// "NW_Lat", 
			Double nwLat = (Double) properties[idx++];
			feature.setAttribute("nw_lat", nwLat);
			// "NW_Lon", 
			Double nwLon = (Double) properties[idx++];
			feature.setAttribute("nw_lon", nwLon);
			// "NE_Lat", 
			Double neLat = (Double) properties[idx++];
			feature.setAttribute("ne_lat", neLat);
			// "NE_Lon", 
			Double neLon = (Double) properties[idx++];
			feature.setAttribute("ne_lon", neLon);
			// "SE_Lat",
			Double seLat = (Double) properties[idx++]; 
			feature.setAttribute("se_lat", seLat);
			// "SE_Lon", 
			Double seLon = (Double) properties[idx++];
			feature.setAttribute("se_lon", seLon);
			// "SW_Lat", 
			Double swLat = (Double) properties[idx++];
			feature.setAttribute("sw_lat", swLat);
			// "SW_Lon", 
			Double swLon = (Double) properties[idx++];
			feature.setAttribute("sw_lon", swLon);
			// "Center_Lat", 
			feature.setAttribute("center_lat", properties[idx++]);
			// "Center_Lon", 
			feature.setAttribute("center_lon", properties[idx++]);
			// "MLST_Start", 
			feature.setAttribute("mlst_start", properties[idx++]);
			// "MLST_End", 
			feature.setAttribute("mlst_end", properties[idx++]);
			// "DataSize", 
			feature.setAttribute("data_size", properties[idx++]);
			// "Satellite", 
			feature.setAttribute("satellite", properties[idx++]);
			// "Sensor", 
			feature.setAttribute("sensor", properties[idx++]);
			// "SensorMode", 
			feature.setAttribute("sensor_mode", properties[idx++]);
			// "OrbName", 
			feature.setAttribute("orb_name", properties[idx++]);
			// "Orbit", 
			feature.setAttribute("orbit", properties[idx++]);
			// "Cycle", 
			feature.setAttribute("cycle", properties[idx++]);
			// "Track", 
			feature.setAttribute("track", properties[idx++]);
			// "Frames", 
			feature.setAttribute("frames", properties[idx++]);
			// "Frame_Start", 
			feature.setAttribute("frame_start", properties[idx++]);
			// "Frame_End", 
			feature.setAttribute("frame_end", properties[idx++]);
			// "Revisiting", 
			feature.setAttribute("revisiting", properties[idx++]);
			// "Slew", 
			feature.setAttribute("slew", properties[idx++]);
			// "Polarization", 
			feature.setAttribute("polarization", properties[idx++]);
			// "Service Provider"
			feature.setAttribute("service_provider", properties[idx++]);
			
			feature.setAttribute("service_name", getUserName() + "@"
					+ getServiceName());
			
			// create the geometry
			if (nwLat != null && nwLon != null
					&& neLat != null && neLon != null
					&& seLat != null && seLon != null
					&& swLat != null && swLon != null) {
				Coordinate nw = new Coordinate(nwLon,nwLat);
				Coordinate ne = new Coordinate(neLon,neLat);
				Coordinate se = new Coordinate(seLon,seLat);
				Coordinate sw = new Coordinate(swLon,swLat);
				Coordinate [] bounds = {nw, ne, se, sw, nw};
				LinearRing linearRing = geometryFactory.createLinearRing(bounds);
				linearRing.setSRID(projection);
				feature.setAttribute("the_geom", linearRing); 
			}

			// TODO: now we use lat_ce and lon_ce to create one ship. is it ok?
//			if (lonCe != null && latCe != null) {
//				Point point = geometryFactory.createPoint(new Coordinate(lonCe,
//						latCe));
//				point.setSRID(projection);
//				feature.setAttribute("the_geom", point); // TODO make me
//															// configurable
//			}

		} catch (Exception e) {
			LOGGER.error("Error creating feature", e);
		}
		return feature;
	}

}
