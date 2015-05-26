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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Alessio
 * 
 */
public class Service {

    private int id;

    private String serviceId;

    private String parent;

    private String user;

    private String status;

    private AreaOfInterest aoi;

    private List<Sensor> sensors = Collections.synchronizedList(new ArrayList<Sensor>());

    /**
     * 
     */
    public Service(String serviceId, String parent, String user, String status) {
        this.serviceId = serviceId;
        this.parent = parent;
        this.user = user;
        this.status = status;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Service)) {
            return false;
        }
        Service other = (Service) obj;
        if (aoi == null) {
            if (other.aoi != null) {
                return false;
            }
        } else if (!aoi.equals(other.aoi)) {
            return false;
        }
        if (id != other.id) {
            return false;
        }
        if (parent == null) {
            if (other.parent != null) {
                return false;
            }
        } else if (!parent.equals(other.parent)) {
            return false;
        }
        if (sensors == null) {
            if (other.sensors != null) {
                return false;
            }
        } else if (!sensors.equals(other.sensors)) {
            return false;
        }
        if (serviceId == null) {
            if (other.serviceId != null) {
                return false;
            }
        } else if (!serviceId.equals(other.serviceId)) {
            return false;
        }
        if (status == null) {
            if (other.status != null) {
                return false;
            }
        } else if (!status.equals(other.status)) {
            return false;
        }
        if (user == null) {
            if (other.user != null) {
                return false;
            }
        } else if (!user.equals(other.user)) {
            return false;
        }
        return true;
    }

    /**
     * @return the aoi
     */
    public AreaOfInterest getAoi() {
        return aoi;
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @return the parent
     */
    public String getParent() {
        return parent;
    }

    /**
     * @return the sensors
     */
    public List<Sensor> getSensors() {
        return sensors;
    }

    /**
     * @return the serviceId
     */
    public String getServiceId() {
        return serviceId;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @return the user
     */
    public String getUser() {
        return user;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((aoi == null) ? 0 : aoi.hashCode());
        result = prime * result + id;
        result = prime * result + ((parent == null) ? 0 : parent.hashCode());
        result = prime * result + ((sensors == null) ? 0 : sensors.hashCode());
        result = prime * result + ((serviceId == null) ? 0 : serviceId.hashCode());
        result = prime * result + ((status == null) ? 0 : status.hashCode());
        result = prime * result + ((user == null) ? 0 : user.hashCode());
        return result;
    }

    /**
     * @param aoi the aoi to set
     */
    public void setAoi(AreaOfInterest aoi) {
        this.aoi = aoi;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @param parent the parent to set
     */
    public void setParent(String parent) {
        this.parent = parent;
    }

    /**
     * @param sensors the sensors to set
     */
    public void setSensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }

    /**
     * @param serviceId the serviceId to set
     */
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @param user the user to set
     */
    public void setUser(String user) {
        this.user = user;
    }

    @Override
    public String toString() {
        final int maxLen = 10;
        StringBuilder builder = new StringBuilder();
        builder.append("Service [id=").append(id).append(", ");
        if (serviceId != null)
            builder.append("serviceId=").append(serviceId).append(", ");
        if (parent != null)
            builder.append("parent=").append(parent).append(", ");
        if (user != null)
            builder.append("user=").append(user).append(", ");
        if (status != null)
            builder.append("status=").append(status).append(", ");
        if (aoi != null)
            builder.append("aoi=").append(aoi).append(", ");
        if (sensors != null)
            builder.append("sensors=").append(sensors.subList(0, Math.min(sensors.size(), maxLen)));
        builder.append("]");
        return builder.toString();
    }

}
