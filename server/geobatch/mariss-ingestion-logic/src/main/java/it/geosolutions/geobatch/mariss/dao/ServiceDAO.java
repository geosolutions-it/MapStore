/*
 *    GeoTools - The Open Source Java GIS Toolkit
 *    http://geotools.org
 *
 *    (C) 2014, Open Source Geospatial Foundation (OSGeo)
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
package it.geosolutions.geobatch.mariss.dao;

import java.util.List;

import it.geosolutions.geobatch.mariss.model.AreaOfInterest;
import it.geosolutions.geobatch.mariss.model.Sensor;
import it.geosolutions.geobatch.mariss.model.SensorMode;
import it.geosolutions.geobatch.mariss.model.Service;

/**
 * @author Alessio
 * 
 */
public interface ServiceDAO {

    /**
     * READ
     */

    public Service findByServiceId(String serviceId);

    public List<Service> findByUser(String userId);

    public List<SensorMode> getSensorModes();

    public List<Sensor> getSensors();

    /**
     * WRITE
     */

    public boolean insert(Service service);

    public boolean insertOrUpdate(AreaOfInterest aoi);

    public boolean insertOrUpdate(String serviceId, List<Sensor> sensors);

    public boolean updateServiceStatus(Service servce, String status);
}
