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
package it.geosolutions.geobatch.mariss.model;


/**
 * @author Alessio
 *
 */
public class Sensor {
    
    private int id;
    private String sensor;
    private SensorMode sensorMode;
    
    /**
     * 
     */
    public Sensor(String sensor, SensorMode sensorMode) {
        this.sensor = sensor;
        this.sensorMode = sensorMode;
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }


    /**
     * @return the sensor
     */
    public String getSensor() {
        return sensor;
    }

    /**
     * @param sensor the sensor to set
     */
    public void setSensor(String sensor) {
        this.sensor = sensor;
    }

    /**
     * @return the sensorMode
     */
    public SensorMode getSensorMode() {
        return sensorMode;
    }

    /**
     * @param sensorMode the sensorMode to set
     */
    public void setSensorMode(SensorMode sensorMode) {
        this.sensorMode = sensorMode;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        result = prime * result + ((sensor == null) ? 0 : sensor.hashCode());
        result = prime * result + ((sensorMode == null) ? 0 : sensorMode.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Sensor)) {
            return false;
        }
        Sensor other = (Sensor) obj;
        if (id != other.id) {
            return false;
        }
        if (sensor == null) {
            if (other.sensor != null) {
                return false;
            }
        } else if (!sensor.equals(other.sensor)) {
            return false;
        }
        if (sensorMode == null) {
            if (other.sensorMode != null) {
                return false;
            }
        } else if (!sensorMode.equals(other.sensorMode)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Sensor [id=").append(id).append(", ");
        if (sensor != null)
            builder.append("sensor=").append(sensor).append(", ");
        if (sensorMode != null)
            builder.append("sensorMode=").append(sensorMode);
        builder.append("]");
        return builder.toString();
    }
    
}
