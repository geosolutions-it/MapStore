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

package it.geosolutions.geobatch.metocs.registry;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.flow.event.action.Action;
import it.geosolutions.geobatch.flow.event.action.BaseAction;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Comments here ...
 * 
 * @author AlFa
 * 
 * @version $ GeoServerAction.java $ Revision: 0.1 $ 12/feb/07 12:07:06
 */

public abstract class RegistryConfiguratorAction extends BaseAction<FileSystemEvent>
        implements Action<FileSystemEvent> {
    /**
     * Default logger
     */
    protected final static Logger LOGGER = Logger.getLogger(RegistryConfiguratorAction.class
            .toString());

    protected final RegistryActionConfiguration configuration;

    /**
     * Constructs a producer. The operation name will be the same than the parameter descriptor
     * name.
     * 
     * @throws IOException
     */
    public RegistryConfiguratorAction(RegistryActionConfiguration configuration) {
        super(configuration);
        this.configuration = configuration;
        // //
        //
        // get required parameters
        //
        // //

        if ((configuration.getGeoserverURL() == null) || "".equals(configuration.getGeoserverURL())) {
            throw new IllegalStateException("GeoServerURL is null.");
        }

    }

    /**
     * @param queryParams
     * @return
     */
    protected static String getQueryString(Map<String, String> queryParams) {
        StringBuilder queryString = new StringBuilder();

        if (queryParams != null)
            for (Map.Entry<String, String> entry : queryParams.entrySet()) {
                if (queryString.length() > 0)
                    queryString.append("&");
                queryString.append(entry.getKey()).append("=").append(entry.getValue());
            }

        return queryString.toString();
    }

    public RegistryActionConfiguration getConfiguration() {
        return configuration;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[" + "cfg:" + getConfiguration() + "]";
    }

}
