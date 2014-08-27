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

import java.sql.Date;

/**
 * @author Alessio
 *
 */
public class AreaOfInterest {
    
    private int id;
    private String serviceId;
    private String description;
    private String theGeom;
    private Date startTime;
    private Date endTime;
    private String status;
    
    /**
     * 
     */
    public AreaOfInterest(String serviceId, String description, String theGeom, Date startTime, Date endTime, String status) {
        this.serviceId = serviceId;
        this.description = description;
        this.theGeom = theGeom;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
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
     * @return the serviceId
     */
    public String getServiceId() {
        return serviceId;
    }

    /**
     * @param serviceId the serviceId to set
     */
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the theGeom
     */
    public String getTheGeom() {
        return theGeom;
    }

    /**
     * @param theGeom the theGeom to set
     */
    public void setTheGeom(String theGeom) {
        this.theGeom = theGeom;
    }

    /**
     * @return the startTime
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((description == null) ? 0 : description.hashCode());
        result = prime * result + ((endTime == null) ? 0 : endTime.hashCode());
        result = prime * result + id;
        result = prime * result + ((serviceId == null) ? 0 : serviceId.hashCode());
        result = prime * result + ((startTime == null) ? 0 : startTime.hashCode());
        result = prime * result + ((status == null) ? 0 : status.hashCode());
        result = prime * result + ((theGeom == null) ? 0 : theGeom.hashCode());
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
        if (!(obj instanceof AreaOfInterest)) {
            return false;
        }
        AreaOfInterest other = (AreaOfInterest) obj;
        if (description == null) {
            if (other.description != null) {
                return false;
            }
        } else if (!description.equals(other.description)) {
            return false;
        }
        if (endTime == null) {
            if (other.endTime != null) {
                return false;
            }
        } else if (!endTime.equals(other.endTime)) {
            return false;
        }
        if (id != other.id) {
            return false;
        }
        if (serviceId == null) {
            if (other.serviceId != null) {
                return false;
            }
        } else if (!serviceId.equals(other.serviceId)) {
            return false;
        }
        if (startTime == null) {
            if (other.startTime != null) {
                return false;
            }
        } else if (!startTime.equals(other.startTime)) {
            return false;
        }
        if (status == null) {
            if (other.status != null) {
                return false;
            }
        } else if (!status.equals(other.status)) {
            return false;
        }
        if (theGeom == null) {
            if (other.theGeom != null) {
                return false;
            }
        } else if (!theGeom.equals(other.theGeom)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("AreaOfInterest [id=").append(id).append(", ");
        if (serviceId != null)
            builder.append("serviceId=").append(serviceId).append(", ");
        if (description != null)
            builder.append("description=").append(description).append(", ");
        if (theGeom != null)
            builder.append("theGeom=").append(theGeom).append(", ");
        if (startTime != null)
            builder.append("startTime=").append(startTime).append(", ");
        if (endTime != null)
            builder.append("endTime=").append(endTime).append(", ");
        if (status != null)
            builder.append("status=").append(status);
        builder.append("]");
        return builder.toString();
    }
    
}
