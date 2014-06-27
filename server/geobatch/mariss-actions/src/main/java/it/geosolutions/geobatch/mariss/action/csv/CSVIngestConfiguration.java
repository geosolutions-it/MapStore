/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2007-2008-2012 GeoSolutions S.A.S.
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


import java.util.ArrayList;
import java.util.List;

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.configuration.CSVProcessorConfiguration;

/**
 */
public class CSVIngestConfiguration extends Ds2dsConfiguration {	
	
	private String csvSeparator = ",";
	
	/**
	 * Processor configurations
	 */
	private List<CSVProcessorConfiguration> proccesorsConfiguration = new ArrayList<CSVProcessorConfiguration>();

	/**
	 * Time format configuration for the ingestion
	 */
	private TimeFormatConfiguration timeFormatConfiguration;

	public CSVIngestConfiguration(String id, String name, String description) {
		super(id, name, description);
	}
	

    @Override
    public CSVIngestConfiguration clone() {
        final CSVIngestConfiguration configuration = (CSVIngestConfiguration) super.clone();
        return configuration;
    }
	
	/**
	 * @return the csvSeparator
	 */
	public String getCsvSeparator() {
		return csvSeparator;
	}


	/**
	 * @param csvSeparator the csvSeparator to set
	 */
	public void setCsvSeparator(String csvSeparator) {
		this.csvSeparator = csvSeparator;
	}


	/**
	 * @return the proccesorsConfiguration
	 */
	public List<CSVProcessorConfiguration> getProccesorsConfiguration() {
		return proccesorsConfiguration;
	}


	/**
	 * @param proccesorsConfiguration the proccesorsConfiguration to set
	 */
	public void setProccesorsConfiguration(
			List<CSVProcessorConfiguration> proccesorsConfiguration) {
		this.proccesorsConfiguration = proccesorsConfiguration;
	}


	/**
	 * @return the timeFormatConfiguration
	 */
	public TimeFormatConfiguration getTimeFormatConfiguration() {
		return timeFormatConfiguration;
	}


	/**
	 * @param timeFormatConfiguration the timeFormatConfiguration to set
	 */
	public void setTimeFormatConfiguration(
			TimeFormatConfiguration timeFormatConfiguration) {
		this.timeFormatConfiguration = timeFormatConfiguration;
	}
}
