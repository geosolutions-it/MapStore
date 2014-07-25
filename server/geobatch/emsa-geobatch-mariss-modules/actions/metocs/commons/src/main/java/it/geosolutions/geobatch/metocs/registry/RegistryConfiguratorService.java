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

import it.geosolutions.geobatch.catalog.impl.BaseService;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;
import it.geosolutions.geobatch.flow.event.action.ActionService;

import java.util.EventObject;

/**
 * Comments here ...
 * 
 * @author AlFa
 * 
 * @version $ RegistryConfiguratorService.java $ Revision: 0.1 $ 12/feb/07 12:07:32
 */
public abstract class RegistryConfiguratorService<T extends EventObject, C extends ActionConfiguration>
        extends BaseService implements ActionService<T, C> {

    public RegistryConfiguratorService(String id, String name, String description) {
        super(id, name, description);
    }

    public boolean canCreateAction(C configuration) {
        return true;
    }

}
