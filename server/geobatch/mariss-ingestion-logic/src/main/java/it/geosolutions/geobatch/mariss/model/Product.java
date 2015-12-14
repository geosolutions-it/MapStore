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

import java.util.Date;

/**
 * @author Alessio
 * 
 */
public class Product {

    private String identifier;

    private String geometry;

    private Date time;

    private String variable;

    private String sarType;

    private String outFileLocation;

    private String originalFilePath;

    private String layerName;

    private String partition;

    private int numOilSpill;

    private int numShipDetect;

    /**
     * @param identifier
     * @param geometry
     * @param time
     * @param variable
     * @param sarType
     * @param outFileLocation
     * @param originalFilePath
     * @param layerName
     * @param partition
     * @param numOilSpill
     * @param numShipDetect
     */
    public Product(String identifier, String geometry, Date time, String variable, String sarType,
            String outFileLocation, String originalFilePath, String layerName, String partition,
            int numOilSpill, int numShipDetect) {
        super();
        this.identifier = identifier;
        this.geometry = geometry;
        this.time = time;
        this.variable = variable;
        this.sarType = sarType;
        this.outFileLocation = outFileLocation;
        this.originalFilePath = originalFilePath;
        this.layerName = layerName;
        this.partition = partition;
        this.numOilSpill = numOilSpill;
        this.numShipDetect = numShipDetect;
    }

    /**
     * @return the identifier
     */
    public String getIdentifier() {
        return identifier;
    }

    /**
     * @param identifier the identifier to set
     */
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    /**
     * @return the geometry
     */
    public String getGeometry() {
        return geometry;
    }

    /**
     * @param geometry the geometry to set
     */
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }

    /**
     * @return the time
     */
    public Date getTime() {
        return time;
    }

    /**
     * @param time the time to set
     */
    public void setTime(Date time) {
        this.time = time;
    }

    /**
     * @return the variable
     */
    public String getVariable() {
        return variable;
    }

    /**
     * @param variable the variable to set
     */
    public void setVariable(String variable) {
        this.variable = variable;
    }

    /**
     * @return the sarType
     */
    public String getSarType() {
        return sarType;
    }

    /**
     * @param sarType the sarType to set
     */
    public void setSarType(String sarType) {
        this.sarType = sarType;
    }

    /**
     * @return the outFileLocation
     */
    public String getOutFileLocation() {
        return outFileLocation;
    }

    /**
     * @param outFileLocation the outFileLocation to set
     */
    public void setOutFileLocation(String outFileLocation) {
        this.outFileLocation = outFileLocation;
    }

    /**
     * @return the originalFilePath
     */
    public String getOriginalFilePath() {
        return originalFilePath;
    }

    /**
     * @param originalFilePath the originalFilePath to set
     */
    public void setOriginalFilePath(String originalFilePath) {
        this.originalFilePath = originalFilePath;
    }

    /**
     * @return the layerName
     */
    public String getLayerName() {
        return layerName;
    }

    /**
     * @param layerName the layerName to set
     */
    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    /**
     * @return the partition
     */
    public String getPartition() {
        return partition;
    }

    /**
     * @param partition the partition to set
     */
    public void setPartition(String partition) {
        this.partition = partition;
    }

    /**
     * @return the numOilSpill
     */
    public int getNumOilSpill() {
        return numOilSpill;
    }

    /**
     * @param numOilSpill the numOilSpill to set
     */
    public void setNumOilSpill(int numOilSpill) {
        this.numOilSpill = numOilSpill;
    }

    /**
     * @return the numShipDetect
     */
    public int getNumShipDetect() {
        return numShipDetect;
    }

    /**
     * @param numShipDetect the numShipDetect to set
     */
    public void setNumShipDetect(int numShipDetect) {
        this.numShipDetect = numShipDetect;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((geometry == null) ? 0 : geometry.hashCode());
        result = prime * result + ((identifier == null) ? 0 : identifier.hashCode());
        result = prime * result + ((layerName == null) ? 0 : layerName.hashCode());
        result = prime * result + numOilSpill;
        result = prime * result + numShipDetect;
        result = prime * result + ((originalFilePath == null) ? 0 : originalFilePath.hashCode());
        result = prime * result + ((outFileLocation == null) ? 0 : outFileLocation.hashCode());
        result = prime * result + ((partition == null) ? 0 : partition.hashCode());
        result = prime * result + ((sarType == null) ? 0 : sarType.hashCode());
        result = prime * result + ((time == null) ? 0 : time.hashCode());
        result = prime * result + ((variable == null) ? 0 : variable.hashCode());
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
        if (!(obj instanceof Product)) {
            return false;
        }
        Product other = (Product) obj;
        if (geometry == null) {
            if (other.geometry != null) {
                return false;
            }
        } else if (!geometry.equals(other.geometry)) {
            return false;
        }
        if (identifier == null) {
            if (other.identifier != null) {
                return false;
            }
        } else if (!identifier.equals(other.identifier)) {
            return false;
        }
        if (layerName == null) {
            if (other.layerName != null) {
                return false;
            }
        } else if (!layerName.equals(other.layerName)) {
            return false;
        }
        if (numOilSpill != other.numOilSpill) {
            return false;
        }
        if (numShipDetect != other.numShipDetect) {
            return false;
        }
        if (originalFilePath == null) {
            if (other.originalFilePath != null) {
                return false;
            }
        } else if (!originalFilePath.equals(other.originalFilePath)) {
            return false;
        }
        if (outFileLocation == null) {
            if (other.outFileLocation != null) {
                return false;
            }
        } else if (!outFileLocation.equals(other.outFileLocation)) {
            return false;
        }
        if (partition == null) {
            if (other.partition != null) {
                return false;
            }
        } else if (!partition.equals(other.partition)) {
            return false;
        }
        if (sarType == null) {
            if (other.sarType != null) {
                return false;
            }
        } else if (!sarType.equals(other.sarType)) {
            return false;
        }
        if (time == null) {
            if (other.time != null) {
                return false;
            }
        } else if (!time.equals(other.time)) {
            return false;
        }
        if (variable == null) {
            if (other.variable != null) {
                return false;
            }
        } else if (!variable.equals(other.variable)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Product [");
        if (identifier != null) {
            builder.append("identifier=");
            builder.append(identifier);
            builder.append(", ");
        }
        if (geometry != null) {
            builder.append("geometry=");
            builder.append(geometry);
            builder.append(", ");
        }
        if (time != null) {
            builder.append("time=");
            builder.append(time);
            builder.append(", ");
        }
        if (variable != null) {
            builder.append("variable=");
            builder.append(variable);
            builder.append(", ");
        }
        if (sarType != null) {
            builder.append("sarType=");
            builder.append(sarType);
            builder.append(", ");
        }
        if (outFileLocation != null) {
            builder.append("outFileLocation=");
            builder.append(outFileLocation);
            builder.append(", ");
        }
        if (originalFilePath != null) {
            builder.append("originalFilePath=");
            builder.append(originalFilePath);
            builder.append(", ");
        }
        if (layerName != null) {
            builder.append("layerName=");
            builder.append(layerName);
            builder.append(", ");
        }
        if (partition != null) {
            builder.append("partition=");
            builder.append(partition);
            builder.append(", ");
        }
        builder.append("numOilSpill=");
        builder.append(numOilSpill);
        builder.append(", numShipDetect=");
        builder.append(numShipDetect);
        builder.append("]");
        return builder.toString();
    }

}
