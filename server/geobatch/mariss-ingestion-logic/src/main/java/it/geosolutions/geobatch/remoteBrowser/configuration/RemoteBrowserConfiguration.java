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
package it.geosolutions.geobatch.remoteBrowser.configuration;

import it.geosolutions.geobatch.destination.common.utils.RemoteBrowserProtocol;
import it.geosolutions.geobatch.ftp.client.configuration.FTPActionConfiguration;

/**
 * Configuration for remote browser access
 * 
 * @author adiaz
 * @see RemoteBrowserProtocol
 */
public class RemoteBrowserConfiguration extends FTPActionConfiguration {

/**
 * Protocol for the operation
 */
RemoteBrowserProtocol serverProtocol;

public RemoteBrowserConfiguration(String id, String name, String description) {
    super(id, name, description);
}

/**
 * @return the serverProtocol
 */
public RemoteBrowserProtocol getServerProtocol() {
    return serverProtocol;
}

/**
 * @param serverProtocol the serverProtocol to set
 */
public void setServerProtocol(RemoteBrowserProtocol serverProtocol) {
    this.serverProtocol = serverProtocol;
}

}
