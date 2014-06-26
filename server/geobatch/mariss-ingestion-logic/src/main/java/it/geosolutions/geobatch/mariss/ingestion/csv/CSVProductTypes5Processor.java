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

/**
 * Product ingestion type 5 CSV processor
 * 
 * @author adiaz
 */
public class CSVProductTypes5Processor extends MarissCSVServiceProcessor {

	/**
	 * PK NAMES for the dao. the same that PK_PROPERTIES
	 */
	private static final String[] PK_NAMES = { "message_type", "timestamp_sat",
			"timestamp_db", "user_id", "name", "message_number" };

	static List<Integer> PK_PROPERTIES;
	static {
		// ID : "message_type", "timestamp_sat", "timestamp_db", "user_id", "name", "message_number"
		PK_PROPERTIES = new LinkedList<Integer>();
		PK_PROPERTIES.add(0);
		PK_PROPERTIES.add(1);
		PK_PROPERTIES.add(2);
		PK_PROPERTIES.add(3);
		PK_PROPERTIES.add(4);
		PK_PROPERTIES.add(5);
	}

	// constructors
	public CSVProductTypes5Processor() {
		super();
	}

	public CSVProductTypes5Processor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames) {
		super(connectionParam, typeName, pkNames);
	}

	public CSVProductTypes5Processor(Map<String, Serializable> connectionParam,
			String typeName) {
		super(connectionParam, typeName);
	}

	public CSVProductTypes5Processor(Map<String, Serializable> connectionParam,
			String typeName, String[] pkNames, TimeFormat timeFormat) {
		super(connectionParam, typeName, pkNames, timeFormat);
	}

	public CSVProductTypes5Processor(Map<String, Serializable> connectionParam,
			String typeName, TimeFormat timeFormat) {
		super(connectionParam, typeName, timeFormat);
	}

	
	//	message_type	timestamp_sat	timestamp_db	user_id	
	// name	message_number ais_version	imo_number	call_sign	dimension_a_m	
	// dimension_b_m	dimension_c_m dimension_d_m	electronic_type	eta_datetime	max_static_draught_m	
	// destination	dte
	private final static List<String> HEADERS = Collections
			.unmodifiableList(Arrays.asList("message_type", "timestamp_sat", "timestamp_db", "user_id",
					"name", "message_number", "ais_version", "imo_number", "call_sign", "dimension_a_m",
					"dimension_b_m", "dimension_c_m", "dimension_d_m", "electronic_type", "eta_datetime", "max_static_draught_m", 
					"destination", "dte"));

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
		// name	
		TYPES.add(CSVPropertyType.STRING);
		// message_number 
		TYPES.add(CSVPropertyType.LONG);
		//  ais_version	
		TYPES.add(CSVPropertyType.INTEGER);
		// imo_number	
		TYPES.add(CSVPropertyType.LONG);
		// call_sign	 
		TYPES.add(CSVPropertyType.STRING);
		// dimension_a_m
		TYPES.add(CSVPropertyType.INTEGER);
		// dimension_b_m	 
		TYPES.add(CSVPropertyType.INTEGER);
		// 	dimension_c_m
		TYPES.add(CSVPropertyType.INTEGER);
		// 	dimension_d_m	
		TYPES.add(CSVPropertyType.INTEGER);
		// electronic_type	
		TYPES.add(CSVPropertyType.INTEGER);
		// eta_datetime
		TYPES.add(CSVPropertyType.DATE_TIME);
		// max_static_draught_m
		TYPES.add(CSVPropertyType.DOUBLE);
		// destination
		TYPES.add(CSVPropertyType.STRING);
		// dte
		TYPES.add(CSVPropertyType.INTEGER);
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
			// message_type	timestamp_sat	timestamp_db	user_id	
			// name	message_number ais_version	imo_number	call_sign	dimension_a_m	
			// dimension_b_m	dimension_c_m dimension_d_m	electronic_type	eta_datetime	max_static_draught_m	
			// destination	dte

			int idx = 0;
			//	message_type
			feature.setAttribute("message_type", properties[idx++]);
			// 	timestamp_sat
			feature.setAttribute("timestamp_sat", properties[idx++]);
			// 	timestamp_db
			feature.setAttribute("timestamp_db", properties[idx++]);
			// user_id
			feature.setAttribute("user_id", properties[idx++]);
			// name
			feature.setAttribute("name", properties[idx++]);
			// message_number
			feature.setAttribute("message_number", properties[idx++]);
			// ais_version	
			feature.setAttribute("ais_version", properties[idx++]);
			// imo_number	
			feature.setAttribute("imo_number", properties[idx++]);
			// call_sign
			feature.setAttribute("call_sign", properties[idx++]);
			// dimension_a_m
			feature.setAttribute("dimension_a_m", properties[idx++]);
			// dimension_b_m
			feature.setAttribute("dimension_b_m", properties[idx++]);
			// dimension_c_m  
			feature.setAttribute("dimension_c_m", properties[idx++]);
			// 	dimension_d_m
			feature.setAttribute("dimension_d_m", properties[idx++]);
			// electronic_type
			feature.setAttribute("electronic_type", properties[idx++]);
			// eta_datetime
			feature.setAttribute("eta_datetime", properties[idx++]);
			// max_static_draught_m
			feature.setAttribute("max_static_draught_m", properties[idx++]);	
			// destination	
			feature.setAttribute("destination", properties[idx++]);
			// dte
			feature.setAttribute("dte", properties[idx++]);
			
			feature.setAttribute("service_name", getUserName() + "@"
					+ getServiceName());

		} catch (Exception e) {
			LOGGER.error("Error creating feature", e);
		}
		return feature;
	}

}
