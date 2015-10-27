package it.geosolutions.geobatch.mariss.actions.sar;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.geotools.geometry.GeneralEnvelope;
import org.geotools.jdbc.JDBCDataStore;

import ucar.nc2.Variable;

/**
	 * a container for ingested element attribute
	 */
	public class AttributeBean {

		public Map<String, Variable> foundVariables = new HashMap<String, Variable>();

		public Map<String, String> foundVariableLongNames = new HashMap<String, String>();

		public Map<String, String> foundVariableBriefNames = new HashMap<String, String>();

		public Map<String, String> foundVariableUoM = new HashMap<String, String>();

		public Date timedim;
		
		public String outFilePath;

		public SARType type;

		public GeneralEnvelope env;

		public String absolutePath;

		public String identifier;
		
		public String serviceName;
		
		public String user;

		public JDBCDataStore dataStore;

		public boolean maskOneIsValid;

		public int numShipDetections = 0;

		public int numOilSpills = 0;
	}