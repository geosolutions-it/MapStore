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
package it.geosolutions.geobatch.mariss.ingestion.csv.configuration;

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * Configuration for each CSV processor.
 * 
 * TODO: Generalize this configuration
 * 
 * We need to improve this configuration to allow the dynamic composition of CSV
 * ingestion without the class creation like
 * {@link CSVProductTypes1To3Processor} or {@link CSVProductTypes5Processor} we
 * need:
 * <ul>
 * <li>A method to add the headers by configuration</li>
 * <li>A method to add the column types by configuration</li>
 * <li>A method to add link each column between CSV and feature types</li>
 * <li>A method to add the geometry parsing by configuration</li>
 * </ul>
 * 
 * @author adiaz
 */
@XStreamAlias("CSVProcessorConfiguration")
public class CSVProcessorConfiguration extends Ds2dsConfiguration {

	/**
	 * Type name for the feature creation
	 */
	private String typeName;

	/**
	 * Complete class name of the processor. 
	 * TODO: this configuration might
	 * disappear when the dynamic composition is ready
	 */
	private String className;

	/**
	 * Projection for the geometry creation
	 */
	private int projection;

	/**
	 * Time format configuration for the ingestion
	 */
	private TimeFormatConfiguration timeFormatConfiguration;

	public CSVProcessorConfiguration(String id, String name, String description) {
		super(id, name, description);
	}

	@Override
	public CSVProcessorConfiguration clone() {
		final CSVProcessorConfiguration configuration = (CSVProcessorConfiguration) super
				.clone();
		return configuration;
	}

	/**
	 * @return the typeName
	 */
	public String getTypeName() {
		return typeName;
	}

	/**
	 * @param typeName
	 *            the typeName to set
	 */
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	/**
	 * @return the className
	 */
	public String getClassName() {
		return className;
	}

	/**
	 * @param className
	 *            the className to set
	 */
	public void setClassName(String className) {
		this.className = className;
	}

	/**
	 * @return the timeFormatConfiguration
	 */
	public TimeFormatConfiguration getTimeFormatConfiguration() {
		return timeFormatConfiguration;
	}

	/**
	 * @param timeFormatConfiguration
	 *            the timeFormatConfiguration to set
	 */
	public void setTimeFormatConfiguration(
			TimeFormatConfiguration timeFormatConfiguration) {
		this.timeFormatConfiguration = timeFormatConfiguration;
	}

	/**
	 * @return the projection
	 */
	public int getProjection() {
		return projection;
	}

	/**
	 * @param projection
	 *            the projection to set
	 */
	public void setProjection(int projection) {
		this.projection = projection;
	}
}
