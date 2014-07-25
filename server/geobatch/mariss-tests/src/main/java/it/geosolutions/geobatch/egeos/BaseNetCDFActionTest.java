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
package it.geosolutions.geobatch.egeos;

import it.geosolutions.geobatch.metocs.base.NetCDFCFGeodetic2GeoTIFFsConfiguration;
import it.geosolutions.geobatch.metocs.commons.MetocActionConfiguration;

/**
 * JUnit common code for NetCDF ingestion tests 
 * 
 * @author adiaz
 */
public abstract class BaseNetCDFActionTest {

	protected static final String WORKING_FOLDER = "working";
	protected static final String CRS = "EPSG:4326";
	protected static final String METOC_DIRECTORY_PATH = "registry_work/config/NURC-2010/Super-Ensemble/metoc-dictionary.xml";
	protected static final String METOC_HARVESTER_XML_TEMPLATE_PATH = "registry_work/config/NURC-2010/Super-Ensemble/Nurc-Cim_Schema/2010_07_13/example/iso-models-template.xml";
	
	/**
	 * Prepare a {@link MetocActionConfiguration} configuration for the test
	 */
	protected void prepareConfiguration(MetocActionConfiguration config) {
		/**
		 * <SARWaveActionConfiguration>
		 * <workingDirectory>EGEOSworkingdir/SARWind</workingDirectory>
		 * <crs>EPSG:4326</crs> <envelope/>
		 * <metocDictionaryPath>registry_work/config
		 * /NURC-2010/Super-Ensemble/metoc-dictionary.xml</metocDictionaryPath>
		 * <metocHarvesterXMLTemplatePath>registry_work/config/NURC-2010/Super-
		 * Ensemble/Nurc-Cim_Schema/
		 * 2010_07_13/example/iso-models-template.xml</metocHarvesterXMLTemplatePath
		 * > <id>a1</id> <description>description1</description>
		 * <name>test</name> </SARWindActionConfiguration>
		 */
		config.setWorkingDirectory(WORKING_FOLDER);
		config.setCrs(CRS);		
		config.setMetocDictionaryPath(METOC_DIRECTORY_PATH);
		config.setMetocHarvesterXMLTemplatePath(METOC_HARVESTER_XML_TEMPLATE_PATH);
	}
	
	/**
	 * @return NetCDF to tiff configuration for test proposal
	 */
	protected NetCDFCFGeodetic2GeoTIFFsConfiguration getNetCDF2TiffConfig(){
		NetCDFCFGeodetic2GeoTIFFsConfiguration config = new NetCDFCFGeodetic2GeoTIFFsConfiguration(null, null, null);
		/**
		 * <NetcdfGeodetic2GeoTiff>
			<listenerId>StatusActionLogger0</listenerId>
		        <listenerId>ActionLogger0</listenerId>

			<workingDirectory>EGEOSWorkingDir/SARWind/</workingDirectory>
			<layerParentDirectory>/tmp/emsa/out/nfs/sarDerived/</layerParentDirectory>

			<crs>EPSG:4326</crs>
			<envelope/>
			<timeUnStampedOutputDir>true</timeUnStampedOutputDir>
			<metocDictionaryPath>registry_work/config/NURC-2010/Super-Ensemble/metoc-dictionary.xml</metocDictionaryPath>
			<metocHarvesterXMLTemplatePath>registry_work/config/NURC-2010/Super-Ensemble/Nurc-Cim_Schema/2010_07_13/example/iso-models-template.xml</metocHarvesterXMLTemplatePath>
			<id>EGEOSSARWind_a2</id>
			<description>EGEOSSARWind NetCDFCFGeodetic2GeoTIFFs</description>
			<name>EGEOSSARWind_a2</name>
		</NetcdfGeodetic2GeoTiff>
		 */
		config.setWorkingDirectory("target/working");
		config.setLayerParentDirectory("target/working/out/tiff");
		config.setCrs(CRS);
		config.setTimeUnStampedOutputDir(true);		
		config.setMetocDictionaryPath(METOC_DIRECTORY_PATH);
		config.setMetocHarvesterXMLTemplatePath(METOC_HARVESTER_XML_TEMPLATE_PATH);
		return config;
	}
}
