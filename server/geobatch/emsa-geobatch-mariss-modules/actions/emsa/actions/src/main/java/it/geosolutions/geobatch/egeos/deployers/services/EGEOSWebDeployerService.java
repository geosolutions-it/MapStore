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
package it.geosolutions.geobatch.egeos.deployers.services;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.actions.tools.configuration.Path;
import it.geosolutions.geobatch.catalog.impl.BaseService;
import it.geosolutions.geobatch.egeos.deployers.actions.EGEOSDeployerBaseAction;
import it.geosolutions.geobatch.flow.event.action.ActionService;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Creates an Action from a scripting language.
 * 
 * @author etj
 */
public class EGEOSWebDeployerService extends BaseService implements
        ActionService<FileSystemEvent, EGEOSWebDeployerConfiguration> {

    public EGEOSWebDeployerService(String id, String name, String description) {
        super(id, name, description);
    }

    private final static Logger LOGGER = Logger.getLogger(EGEOSWebDeployerService.class.toString());

    public EGEOSDeployerBaseAction createAction(EGEOSWebDeployerConfiguration configuration) {
        try {
            // absolutize working dir
//            String wd=Path.getAbsolutePath(configuration.getWorkingDirectory());
//            if (wd!=null){
//                configuration.setWorkingDirectory(wd);
                return new EGEOSDeployerBaseAction(configuration);
//            }
//            else
//                return null;
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error occurred creating EGEOSWebDeployer Action... "
                    + e.getLocalizedMessage(), e);
        }

        return null;
    }

    /**
     * 
     */
    public boolean canCreateAction(EGEOSWebDeployerConfiguration configuration) {
        return true;
    }

}
