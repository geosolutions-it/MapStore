/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.imagemosaic.ImageMosaicConfiguration;

/**
 * Configuration for a data package ingestion in a compressed file 
 * 
 * @author adiaz
 */
public class DataPackageIngestionConfiguration extends Ds2dsConfiguration {

	private String csvIngestionPath;
	private String typeName;
	private String userName; 
	private String serviceName;
	private String targetTifFolder;
	protected ImageMosaicConfiguration imageMosaicConfiguration = null;

	public DataPackageIngestionConfiguration(String id, String name,
			String description) {
		super(id, name, description);
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

	/**
	 * @return the typeName
	 */
	public String getTypeName() {
		return typeName;
	}

	/**
	 * @param typeName the typeName to set
	 */
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the serviceName
	 */
	public String getServiceName() {
		return serviceName;
	}

	/**
	 * @param serviceName the serviceName to set
	 */
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	/**
	 * @return the targetTifFolder
	 */
	public String getTargetTifFolder() {
		return targetTifFolder;
	}

	/**
	 * @param targetTifFolder the targetTifFolder to set
	 */
	public void setTargetTifFolder(String targetTifFolder) {
		this.targetTifFolder = targetTifFolder;
	}

	/**
	 * @return the imageMosaicConfiguration
	 */
	public ImageMosaicConfiguration getImageMosaicConfiguration() {
		return imageMosaicConfiguration;
	}

	/**
	 * @param imageMosaicConfiguration the imageMosaicConfiguration to set
	 */
	public void setImageMosaicConfiguration(
			ImageMosaicConfiguration imageMosaicConfiguration) {
		this.imageMosaicConfiguration = imageMosaicConfiguration;
	}

}
