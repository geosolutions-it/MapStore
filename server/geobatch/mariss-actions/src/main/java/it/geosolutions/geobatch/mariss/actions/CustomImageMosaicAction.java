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
package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.imagemosaic.ImageMosaicAction;
import it.geosolutions.geobatch.imagemosaic.ImageMosaicCommand;

import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Custom image mosaic action that allow the circle flow execution
 * 
 * @author adiaz
 *
 */
@Action(configurationClass = CustomImageMosaicConfiguration.class)
public class CustomImageMosaicAction extends ImageMosaicAction{

	private final static Logger LOGGER = LoggerFactory
			.getLogger(CustomImageMosaicAction.class);

	// constructor
	public CustomImageMosaicAction(CustomImageMosaicConfiguration configuration) {
		super(configuration);
	}

	/**
	 * Check in the event queue if this action must handle the event before handling
	 */
	@Override
	public Queue<EventObject> execute(Queue<EventObject> events)
			throws ActionException {

		// return object
		final Queue<EventObject> ret = new LinkedList<EventObject>();
		// to process
		final Queue<EventObject> imcs = new LinkedList<EventObject>();

		while (!events.isEmpty()) {
			EventObject event = events.poll();
			if(canProcess(event)){
				imcs.add(event);
			}else{
				// add the event to the return
				ret.add(event);
			}
		}

		if(!imcs.isEmpty()){
			LOGGER.info("Excuting " + imcs.size() + " ImageMosaicCommands");
			ret.addAll(super.execute(imcs));
		}

		return ret;
	}
	
	/**
	 * Check if a file can be processed in this action
	 * 
	 * @param file
	 * @return
	 */
	private boolean canProcess(EventObject event) {
		Object innerObject= event.getSource();
		// only available for the imc command in the event 
		// (delegated from product ingestion / NetCDFToGeotiff actions)
		if (innerObject instanceof ImageMosaicCommand){
			// copy default configuration
			((ImageMosaicCommand)innerObject).copyConfigurationIntoCommand(getConfiguration());
			return true;
		}else{
			return false;
		}
	}

}
