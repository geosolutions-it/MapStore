/*
 *    GeoTools - The Open Source Java GIS Toolkit
 *    http://geotools.org
 *
 *    (C) 2015, Open Source Geospatial Foundation (OSGeo)
 *
 *    This library is free software; you can redistribute it and/or
 *    modify it under the terms of the GNU Lesser General Public
 *    License as published by the Free Software Foundation;
 *    version 2.1 of the License.
 *
 *    This library is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *    Lesser General Public License for more details.
 */
package it.geosolutions.geobatch.mariss.actions.sartiff;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationUtils;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;

import java.util.EventObject;
import java.util.LinkedList;
import java.util.Queue;

/**
 * @author Alessio
 * 
 */
public abstract class SarGeoTIFFAction extends BaseAction<EventObject> {

    protected final IngestionActionConfiguration configuration;

    private final ConfigurationContainer container;

    /**
     * 
     * @param actionConfiguration
     */
    public SarGeoTIFFAction(IngestionActionConfiguration actionConfiguration) {
        super(actionConfiguration);
        configuration = actionConfiguration;
        ConfigurationContainer container = actionConfiguration.getContainer();
        if (container == null || container.getParams() == null
                || !container.getParams().containsKey(ConfigurationUtils.NETCDF_DIRECTORY_KEY)) {
            throw new RuntimeException("Wrong configuration defined");
        } else {
            this.container = container;
        }
    }

    /**
     * Execute process
     */
    public Queue<EventObject> execute(Queue<EventObject> events) throws ActionException {

        // return object
        final Queue<EventObject> ret = new LinkedList<EventObject>();

        while (events.size() > 0) {
            final EventObject ev;
            try {
                if ((ev = events.remove()) != null) {
                    if (LOGGER.isTraceEnabled()) {
                        LOGGER.trace("Working on incoming event: " + ev.getSource());
                    }
                    if (ev instanceof FileSystemEvent) {
                        FileSystemEvent fileEvent = (FileSystemEvent) ev;
                        if (canProcess(fileEvent)) {
                        }
                    }
                }
            } catch (Exception ioe) {
                final String message = "Unable to produce the output: " + ioe.getLocalizedMessage();
                if (LOGGER.isErrorEnabled())
                    LOGGER.error(message, ioe);

                throw new ActionException(this, message);
            }
        }
        return ret;
    }
}
