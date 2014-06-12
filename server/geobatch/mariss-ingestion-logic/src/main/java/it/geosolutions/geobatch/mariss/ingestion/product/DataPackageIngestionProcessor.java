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

import java.io.File;
import java.io.FileInputStream;

import org.geotools.GML;
import org.geotools.GML.Version;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.opengis.feature.simple.SimpleFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Data ingestion for data package features http://www.emsa.europa.eu/schemas/csndc/DataPackage/csndc_pkg.xsd
 * 
 * @author alejandro.diaz at geo-solutions.it
 *
 */
public class DataPackageIngestionProcessor {

protected final static Logger LOGGER = LoggerFactory
        .getLogger(DataPackageIngestionProcessor.class);
	
	public DataPackageIngestionProcessor(){
		super();
	}
	
	/**
	 * Process a GML file
	 * @param file
	 * @return
	 */
	public String process(File file){
		String msg = null;
		
		try {
		
			GML gml = new GML(Version.GML3);
			
			SimpleFeatureIterator fi = gml.decodeFeatureIterator(new FileInputStream(file));
			LOGGER.info("parsed");
			while (fi.hasNext()){
				SimpleFeature feature = fi.next();
				LOGGER.info("Feature " + feature);
			}
		} catch (Exception e) {
			LOGGER.error("Error parsing the GML", e);
		}
		
		return msg;
	}

}
