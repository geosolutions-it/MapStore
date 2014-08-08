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
package it.geosolutions.geobatch.catalog.file;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Mocked  data dir handler to perform tests
 *
 * @author adiaz
 */
public class MockedDataDirHandler extends DataDirHandler{
	
	protected final static Logger LOGGER = LoggerFactory
			.getLogger(MockedDataDirHandler.class);

	/**
     * The base directory where the configuration files are located. <br/>
     */
    private String baseConfigPath;
    
	/**
	 * Force use the baseConfigPath if GEOBATCH_CONFIG_DIR is not present in system properties
	 * @throws Exception
	 */
    @Override
	public void init() throws Exception {
    	String value = System.getProperty(GEOBATCH_CONFIG_DIR);
    	if(value == null){
    		String path = getBaseConfigDirectory().getAbsolutePath();
        	LOGGER.info("Force base directory for testing: "+ path);
        	System.setProperty(GEOBATCH_CONFIG_DIR, path);
    	}
		super.init();
	}

	public MockedDataDirHandler() {
    }

    /**
	 * @return the baseConfigPath
	 */
	public String getBaseConfigPath() {
		return baseConfigPath;
	}

	/**
	 * @param baseConfigPath the baseConfigPath to set
	 */
	public void setBaseConfigPath(String baseConfigPath) {
		this.baseConfigPath = baseConfigPath;
	}

    @Override
	public File getBaseConfigDirectory() {
		return new File(baseConfigPath);
	}
}
