/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.codehaus.org/
 *  Copyright (C) 2007-2008-2009 GeoSolutions S.A.S.
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
package it.geosolutions.geobatch.metocs.commons;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.catalog.file.FileBaseCatalog;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.global.CatalogHolder;
import it.geosolutions.geobatch.metocs.jaxb.model.Metocs;
import it.geosolutions.geobatch.metocs.utils.io.METOCSActionsIOUtils;
import it.geosolutions.geobatch.metocs.utils.io.Utilities;
import it.geosolutions.tools.commons.file.Path;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FilenameUtils;
import org.geotools.geometry.GeneralEnvelope;

import ucar.ma2.Array;
import ucar.ma2.InvalidRangeException;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;

/**
 * Comments here ...
 * 
 * @author Alessio Fabiani, GeoSolutions S.A.S.
 * 
 */
public abstract class MetocBaseAction extends BaseAction<EventObject> {
    @Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public <T extends ActionConfiguration> T getConfiguration() {
		// TODO Auto-generated method stub
		return (T) configuration;
	}

	private final static Logger LOGGER = Logger.getLogger(MetocBaseAction.class.toString());

    protected final MetocActionConfiguration configuration;

    public MetocBaseAction(MetocActionConfiguration configuration) {
        super(configuration.getId(), configuration.getName(), configuration.getDescription());
        this.configuration = configuration;

        // //
        //
        // get required parameters
        //
        // //
        if ((configuration.getMetocDictionaryPath() == null)
                || "".equals(configuration.getMetocHarvesterXMLTemplatePath())) {
            LOGGER.log(Level.SEVERE,
                    "MetcoDictionaryPath || MetocHarvesterXMLTemplatePath is null.");
            throw new IllegalStateException(
                    "MetcoDictionaryPath || MetocHarvesterXMLTemplatePath is null.");
        }

        final String cruise = configuration.getCruiseName();
        if (cruise != null && cruise.trim().length() > 0) {
            cruiseName = cruise.trim();
        }
    }

    protected String cruiseName = "lscv08";

    protected Map<String, Variable> foundVariables = new HashMap<String, Variable>();

    protected Map<String, String> foundVariableLongNames = new HashMap<String, String>();

    protected Map<String, String> foundVariableBriefNames = new HashMap<String, String>();

    protected Map<String, String> foundVariableUoM = new HashMap<String, String>();

    protected GeneralEnvelope envelope = null;

    protected Metocs metocDictionary;

    /**
	 * 
	 */
    public Queue<EventObject> execute(Queue<EventObject> events) throws ActionException {
		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
		
        if (LOGGER.isLoggable(Level.INFO))
            LOGGER.info("MetocBaseAction:execute(): Starting with processing...");
        try {
        	// iterate in the queue and process each one we could process
    		while (!events.isEmpty()) {
    			EventObject event = events.poll();
    			if (event instanceof FileSystemEvent) {
    				FileSystemEvent fse = (FileSystemEvent) event;
    	            // check if can't process
    	            if(canProcess(fse)){
    	            	ret.addAll(doProcess(fse));
    	            }else{
    					// add the event to the return
    					ret.add(fse);
    				}
    			} else {
					// add the event to the return
					ret.add(event);
    				//throw new ActionException(this, "EventObject not handled " + event);
    			}
    		}
    		
        } catch (Throwable t) {
            LOGGER.log(Level.SEVERE, t.getLocalizedMessage(), t);
        }
        
        return ret;
    }
    
    /**
     * Process the file we can process and add the event to ret for the next step
     * @param event
     * @param ret
     * @throws IOException
     * @throws InvalidRangeException
     * @throws ParseException
     * @throws JAXBException
     */
    private Queue<EventObject> doProcess(FileSystemEvent event) throws IOException, InvalidRangeException, ParseException, JAXBException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
    	
    	@SuppressWarnings("unused")
        final String configId = getName();

        // ////////////////////////////////////////////////////////////////////
        //
        // Initializing input variables
        //
        // ////////////////////////////////////////////////////////////////////
        
        final File workingDir = Path.findLocation(configuration.getWorkingDirectory(),
        		((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());
        
        
        // final File workingDir = new File(configuration.getWorkingDirectory());
        
        /*
         * 
         * Old code
         *
        final File workingDir = Path.findLocation(configuration.getWorkingDirectory(),
                new File(((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory()));*/

        // ////////////////////////////////////////////////////////////////////
        //
        // Checking input files.
        //
        // ////////////////////////////////////////////////////////////////////
        if ((workingDir == null) || !workingDir.exists() || !workingDir.isDirectory()) {
            String message = "GeoServerDataDirectory is null or does not exist.";
            if (LOGGER.isLoggable(Level.SEVERE))
                LOGGER.log(Level.SEVERE, message);
            throw new IllegalStateException(message);
        }

        // ... BUSINESS LOGIC ... //
        File inputFile = event.getSource();
        String inputFileName = inputFile.getAbsolutePath();
        final String fileSuffix = FilenameUtils.getExtension(inputFileName);
        final String fileNameFilter = configuration.getStoreFilePrefix();
        
        LOGGER.info("Working on "+inputFileName);

        if (fileNameFilter != null) {
            if (!inputFile.getName().matches(fileNameFilter)) {
                final String message = "MetocBaseAction:execute(): Unexpected file '"
                        + inputFileName + "'.\nThis action expects 'one' NetCDF file using \'"
                        + fileNameFilter + "\' as name filter (String.matches()).";
                if (LOGGER.isLoggable(Level.SEVERE))
                    LOGGER.log(Level.SEVERE, message);
                throw new IllegalStateException(message);
            }
        } else {
            if (!"nc".equalsIgnoreCase(fileSuffix) && !"netcdf".equalsIgnoreCase(fileSuffix)) {
                final String message = "MetocBaseAction:execute(): Unexpected file '"
                        + inputFileName
                        + "'.\n"
                        + "This action expects 'one' NetCDF file using \'.nc\' or \'.netcdf\' extension. And is "+fileSuffix;
                if (LOGGER.isLoggable(Level.SEVERE))
                    LOGGER.log(Level.SEVERE, message);
                throw new IllegalStateException(message);
            }
        }

        final File outDir = Utilities.createTodayDirectory(workingDir,
                FilenameUtils.getBaseName(inputFileName));

        if (inputFile.isFile() && inputFile.canRead()) {
            if (FilenameUtils.getExtension(inputFileName).equalsIgnoreCase("nc")
                    || FilenameUtils.getExtension(inputFileName).equalsIgnoreCase("netcdf")) {
                
            }
            //
            LOGGER.info("Call writeDownNetCDF");
            File outputFile = writeDownNetCDF(outDir, inputFileName);
            // ... setting up the appropriate event for the next action
            ret.add(new FileSystemEvent(outputFile, FileSystemEventType.FILE_ADDED));
            LOGGER.info("writeDownNetCDF finished, next step?");
        } else {
            if (LOGGER.isLoggable(Level.SEVERE))
                LOGGER.log(Level.SEVERE, "MetocBaseAction:execute(): "
                        + "the input file is not a non-directory file or it is not readable.");
        }
        
        return ret;
	}

	/**
     * Check if a file can be processed in this action. To override in actions 
     * @param event
     * @return
     */
    public boolean canProcess(FileSystemEvent event) {
		return false;
	}

    // ////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Utility and conversion specific methods implementations...
    //
    // ////////////////////////////////////////////////////////////////////////////////////////////

	/**
     * @param lon_dim
     * @param lat_dim
     * @param lonOriginalData
     * @param latOriginalData
     * @throws IndexOutOfBoundsException
     */
    protected void buildEnvelope(final Dimension lon_dim, final Dimension lat_dim,
            final Array lonOriginalData, final Array latOriginalData)
            throws IndexOutOfBoundsException {
        double[] bbox = METOCSActionsIOUtils.computeExtrema(latOriginalData, lonOriginalData,
                lat_dim, lon_dim);

        // building Envelope
        envelope = new GeneralEnvelope(METOCSActionsIOUtils.WGS_84);
        envelope.setRange(0, bbox[0], bbox[2]);
        envelope.setRange(1, bbox[1], bbox[3]);
    }

    /**
     * @return
     * @throws JAXBException
     * @throws IOException
     * @throws FileNotFoundException
     */
    protected void getMetocsDictionary() throws JAXBException, IOException, FileNotFoundException {
        JAXBContext context = JAXBContext.newInstance(Metocs.class);
        Unmarshaller um = context.createUnmarshaller();
        
        File metocDictionaryFile = Path.findLocation(configuration.getMetocDictionaryPath(),
                ((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());
        /*
         * Old code
         *
        File metocDictionaryFile = Path.findLocation(configuration.getMetocDictionaryPath(),
                new File(((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory()));*/
        metocDictionary = (Metocs) um.unmarshal(new FileReader(metocDictionaryFile));
    }
    

    /**
     * @throws IOException
     * @throws InvalidRangeException
     * @throws JAXBException
     * @throws ParseException
     * 
     */
    protected abstract File writeDownNetCDF(File outDir, String inputFileName) throws IOException,
            InvalidRangeException, ParseException, JAXBException;

	/**
     * Find a variable in a ncFile. Ignore name case
     * @param ncFile
     * @param name
     * @return
     */
	protected Variable findVariable(NetcdfFile ncFile, String name) {
    	// Default search is with a lower name
		return findVariable(ncFile, name, true);
	}

	/**
     * Find a variable in a ncFile
     * @param ncFile
     * @param name
     * @param ignoreCase flag
     * @return
     */
    @SuppressWarnings("deprecation")
	protected Variable findVariable(NetcdfFile ncFile, String name, boolean ignoreCase) {
    	// Default search
    	Variable variable = ncFile.findVariable(name);
    	if(variable != null){
    		// found with default search
    		return variable;
    	}else{
    		// not found, try to iterate and look ignoring case
    		for(Variable var : ncFile.getVariables()){
    			String nameCompare = var.getName(); 
    			// compare with ignore case or not 
            	if(ignoreCase && nameCompare.toLowerCase().equals(name.toLowerCase())){
            		return var;
            	}else if(nameCompare.equals(name)){
            		return var;
            	}
            	
            }
    	}
    	// not found
		return null;
	}

    /**
     * Find a dimension in a ncFile. Ignore name case
     * @param ncFile
     * @param name
     * @return
     */
    protected Dimension findDimension(NetcdfFile ncFile, String name) {
    	// Default search is with a lower name
		return findDimension(ncFile, name, true);
	}

    /**
     * Find a dimension in a ncFile. Ignore name case
     * @param ncFile
     * @param name
     * @param lower flag to compare with: lower name (true), upper name (false) or exact name (null)
     * @return
     */
    protected Dimension findDimension(NetcdfFile ncFile, String name, boolean ignoreCase) {
    	// Default search
    	Dimension dimension = ncFile.findDimension(name);
    	if(dimension != null){
    		// found with default search
    		return dimension;
    	}else{
    		// not found, try to iterate and look ignoring case
    		for(Dimension dim : ncFile.getDimensions()){
    			String nameCompare = dim.getName();
    			// compare with ignore case or not 
            	if(ignoreCase && nameCompare.toLowerCase().equals(name.toLowerCase())){
            		return dim;
            	}else if(nameCompare.equals(name)){
            		return dim;
            	}
            }
    	}
    	// not found
		return null;
	}
    

}
