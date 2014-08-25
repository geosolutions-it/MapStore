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

import org.opengis.feature.simple.SimpleFeature;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Point;

/**
 * Product ingestion types 1 to 3 CSV processor
 * 
 * @author adiaz
 */
public class CSVProductTypes1To3Processor extends MarissCSVServiceProcessor {

	/**
	 * PK NAMES for the dao. the same that PK_PROPERTIES
	 */
	private static final String[] PK_NAMES = { "message_type", "timestamp_sat",
			"timestamp_db", "user_id", "latitude", "longitude" };

	static List<Integer> PK_PROPERTIES;
	static {
		// ID : "message_type", "timestamp_sat", "timestamp_db", "user_id", "latitude", "longitude"
		PK_PROPERTIES = new LinkedList<Integer>();
		PK_PROPERTIES.add(0);
		PK_PROPERTIES.add(1);
		PK_PROPERTIES.add(2);
		PK_PROPERTIES.add(3);
		PK_PROPERTIES.add(4);
		PK_PROPERTIES.add(5);
	}

	// constructors
	public CSVProductTypes1To3Processor() {
		super();
	}

	public CSVProductTypes1To3Processor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames) {
		super(connectionParam, typeName, pkNames);
	}

	public CSVProductTypes1To3Processor(Map<String, Serializable> connectionParam,
			String typeName) {
		super(connectionParam, typeName);
	}

	public CSVProductTypes1To3Processor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames, TimeFormat timeFormat) {
		super(connectionParam, typeName, pkNames, timeFormat);
	}

	public CSVProductTypes1To3Processor(Map<String, Serializable> connectionParam,
			String typeName, TimeFormat timeFormat) {
		super(connectionParam, typeName, timeFormat);
	}

	
	//	message_type	timestamp_sat	timestamp_db	user_id	latitude	longitude	repeat_indicator	navigational_status	rot_degrees_per_min	
	// sog_kt	position_accuracy	cog_degrees	true_heading_degrees	satellite_id	source

	private final static List<String> HEADERS = Collections
			.unmodifiableList(Arrays.asList("message_type", "timestamp_sat", "timestamp_db", "user_id",
					"latitude", "longitude", "repeat_indicator", "navigational_status", "rot_degrees_per_min", "sog_kt",
					"position_accuracy", "cog_degrees", "true_heading_degrees", "satellite_id", "source"));

	static List<CSVPropertyType> TYPES;
	static {
		TYPES = new LinkedList<CSVPropertyType>();
		//	message_type
		TYPES.add(CSVPropertyType.INTEGER);
		// 	timestamp_sat
		TYPES.add(CSVPropertyType.DATE_TIME);
		// 	timestamp_db
		TYPES.add(CSVPropertyType.DATE_TIME);
		// user_id
		TYPES.add(CSVPropertyType.LONG);
		// latitude	
		TYPES.add(CSVPropertyType.DOUBLE);
		// longitude	 
		TYPES.add(CSVPropertyType.DOUBLE);
		// repeat_indicator	
		TYPES.add(CSVPropertyType.INTEGER);
		// navigational_status
		TYPES.add(CSVPropertyType.INTEGER);
		// rot_degrees_per_min 
		TYPES.add(CSVPropertyType.DOUBLE);
		// sog_kt
		TYPES.add(CSVPropertyType.DOUBLE);
		// position_accuracy 
		TYPES.add(CSVPropertyType.INTEGER);
		// 	cog_degrees
		TYPES.add(CSVPropertyType.DOUBLE);
		// 	true_heading_degrees
		TYPES.add(CSVPropertyType.INTEGER);
		// satellite_id
		TYPES.add(CSVPropertyType.INTEGER);
		// source
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
			// message_type	timestamp_sat	timestamp_db	user_id	latitude	longitude	repeat_indicator	navigational_status	rot_degrees_per_min	
			// sog_kt	position_accuracy	cog_degrees	true_heading_degrees	satellite_id	source

			int idx = 0;
			//	message_type
			feature.setAttribute("message_type", properties[idx++]);
			// 	timestamp_sat
			feature.setAttribute("timestamp_sat", properties[idx++]);
			// 	timestamp_db
			feature.setAttribute("timestamp_db", properties[idx++]);
			// user_id
			feature.setAttribute("user_id", properties[idx++]);
			// latitude
			Double lat = (Double) properties[idx++];
			feature.setAttribute("latitude", lat);
			// longitude
			Double lon = (Double) properties[idx++];
			feature.setAttribute("longitude", lon);
			// repeat_indicator	
			feature.setAttribute("repeat_indicator", properties[idx++]);
			// navigational_status
			feature.setAttribute("navigational_status", properties[idx++]);
			// rot_degrees_per_min 
			feature.setAttribute("rot_degrees_per_min", properties[idx++]);
			// sog_kt
			feature.setAttribute("sog_kt", properties[idx++]);
			// position_accuracy 
			feature.setAttribute("position_accuracy", properties[idx++]);
			// 	cog_degrees
			feature.setAttribute("cog_degrees", properties[idx++]);
			// 	true_heading_degrees
			feature.setAttribute("true_heading_degrees", properties[idx++]);
			// satellite_id
			feature.setAttribute("satellite_id", properties[idx++]);
			// source
			feature.setAttribute("source", properties[idx++]);
			
			feature.setAttribute("service_name", getUserName() + "@"
					+ getServiceName());
			
			// create the geometry
			if (lon != null && lat != null) {
				Point point = geometryFactory.createPoint(new Coordinate(lon,
						lat));
				point.setSRID(projection);
				feature.setAttribute("the_geom", point);
			}

		} catch (Exception e) {
			LOGGER.error("Error creating feature", e);
		}
		return feature;
	}

}
