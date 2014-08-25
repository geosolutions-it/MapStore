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

import it.geosolutions.geobatch.mariss.ingestion.csv.configuration.CSVProcessorConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.utils.CSVIngestUtils;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import au.com.bytecode.opencsv.CSVReader;

/**
 *
 * @author ETj (etj at geo-solutions.it)
 * @author adiaz copied to MARISS project and some improvements
 */
public abstract class CSVProcessor {

    private final static Logger LOGGER = LoggerFactory.getLogger(CSVProcessor.class);

	public abstract List<String> getHeaders();
	
	/**
	 * Processor configuration
	 */
	private CSVProcessorConfiguration configuration;
	
	/**
	 * File in process name
	 */
	protected String fileName;

    public boolean canProcess(List<String> ingestHeaders) {
        if (ingestHeaders == null) {
            return false;
        }
        if (ingestHeaders.size() != getHeaders().size()) {
            LOGGER.debug("Processor " + getClass().getSimpleName() + " skipped because of headers size ["+getHeaders().size()+"!="+ingestHeaders.size()+"]");
            return false;
        }
        for (int i = 0; i < getHeaders().size(); i++) {
            String exp = getHeaders().get(i);
            if ("*".equals(exp)) {
                continue;
            }
            if (!exp.equals(ingestHeaders.get(i))) {
                LOGGER.debug("Processor " + getClass().getSimpleName() + " skipped because of ["+exp+"]!=["+ingestHeaders.get(i)+"]");
                return false;
            }
        }

        return true;
    }

    /**
     * Process a CSV file with this processor
     * 
     * @param file to be processed
     * @param separator separator for the CSV
     * 
     * @throws IOException
     */
    public String processCSVFile(File file, char separator) throws IOException {
    	String successMsg = null;
        LOGGER.info("Processing input file " + file);
        
        String[] headers = null;
        CSVReader reader = null;

        try{
            // check header list
        	try {
                reader = new CSVReader(new FileReader(file), separator);
                headers = reader.readNext(); // remove header
            } catch (IOException e) {
                throw new IOException("Error in reading CSV file", e);
            }
            List<String> headersList;
    		try {
    			headersList = CSVIngestUtils.sanitizeHeaders(headers);
    		} catch (IOException e) {
            	throw new IOException("Error processing " + file.getName(), e);
    		}

            LOGGER.info("Processing CSV " + file.getName() + " with " + this.getClass().getSimpleName());
            try {
            	// process
                if(canProcess(headersList)) {
                	this.process(reader);
                    successMsg =   
                          "\n***************************************************" 
                        + "\n********** SUCCESS: CSV ingestion resume **********" 
                        + "\n***************************************************"
                        + "\n* Records inserted: "+ this.getInsertCount()
                        + "\n* Records updated: "+ this.getUpdateCount()
                        + "\n* Records removed: "+ this.getRemoveCount()
                        + "\n* Failed records: "+ this.getFailCount()
                        + "\n***************************************************\n";
                    LOGGER.info(successMsg);
                }else{
                    LOGGER.warn("The file " + file.getName() + " could'nt be processed in this processor; headers: " + headersList);
                	throw new IOException("Error processing " + file.getName() + ". It could'nt be processed in this processor");
                }
            } catch (CSVProcessException ex) {
                throw new IOException("Error processing " + file.getName(), ex);
            }
        }finally{
        	if(reader != null){
				try {
					reader.close();
				} catch (IOException e1) {
					throw new IOException("Error processing " + file.getName(), e1);
				}
			}
        }
        return successMsg;
    }

    abstract public void process(CSVReader reader) throws CSVProcessException;

    public abstract int getInsertCount();
    public abstract int getFailCount();
    public abstract int getRemoveCount();
    public abstract int getUpdateCount();

	/**
	 * @return the configuration
	 */
	public CSVProcessorConfiguration getConfiguration() {
		return configuration;
	}

	/**
	 * @param configuration the configuration to set
	 */
	public void setConfiguration(CSVProcessorConfiguration configuration) {
		this.configuration = configuration;
	}

	/**
	 * @return the fileName
	 */
	public String getFileName() {
		return fileName;
	}

	/**
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

}