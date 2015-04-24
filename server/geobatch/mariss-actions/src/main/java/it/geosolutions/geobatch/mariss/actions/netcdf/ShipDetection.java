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
package it.geosolutions.geobatch.mariss.actions.netcdf;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * @author Alessio
 *
    id VDS_ASA_IMP_1PNIPA20100913_110107_000000162092_00495_44637_0625.N1_GMV_274.xml
    the_geom <gml:pos axisLabels="latitude longitude" srsDimension="2" uomLabels="deg deg">15.226362 -16.972208</gml:pos>
    timeStamp 2010-09-13T11:01:07Z
    heading 97
    speed 0.00
    length 48.88
    MMSI -1
    confidenceLevel 0.45
    imageIdentifier [type="SAR"] ASA_IMP_1PNIPA20100913_110107_000000162092_00495_44637_0625.N1
    detectionParameters
       RCS 0.45
       maxPixelValue 1.06
    shipCategory 14.00
    confidenceLevelCat 

 */

@XStreamAlias("Ship")
public class ShipDetection {

    private String id;
    
    private String timeStamp;
    
    private Boolean includeInReport;
    
    private Double heading;
    
    private Double speed;
    
    private Double length;
    
    private String MMSI;
    
    private Double confidenceLevel;
    
    private String imageIdentifier;
    
    private String imageType;
    
    private DetectionParameters detectionParameters;
    
    private Double shipCategory;
    
    private String confidenceLevelCat;
    
    @XStreamAlias("pos")
    private String the_geom;

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the timeStamp
     */
    public String getTimeStamp() {
        return timeStamp;
    }

    /**
     * @param timeStamp the timeStamp to set
     */
    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    /**
     * @return the includeInReport
     */
    public Boolean getIncludeInReport() {
        return includeInReport;
    }

    /**
     * @param includeInReport the includeInReport to set
     */
    public void setIncludeInReport(Boolean includeInReport) {
        this.includeInReport = includeInReport;
    }

    /**
     * @return the heading
     */
    public Double getHeading() {
        return heading;
    }

    /**
     * @param heading the heading to set
     */
    public void setHeading(Double heading) {
        this.heading = heading;
    }

    /**
     * @return the speed
     */
    public Double getSpeed() {
        return speed;
    }

    /**
     * @param speed the speed to set
     */
    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    /**
     * @return the length
     */
    public Double getLength() {
        return length;
    }

    /**
     * @param length the length to set
     */
    public void setLength(Double length) {
        this.length = length;
    }

    /**
     * @return the confidenceLevel
     */
    public Double getConfidenceLevel() {
        return confidenceLevel;
    }

    /**
     * @param confidenceLevel the confidenceLevel to set
     */
    public void setConfidenceLevel(Double confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    /**
     * @return the imageIdentifier
     */
    public String getImageIdentifier() {
        return imageIdentifier;
    }

    /**
     * @param imageIdentifier the imageIdentifier to set
     */
    public void setImageIdentifier(String imageIdentifier) {
        this.imageIdentifier = imageIdentifier;
    }

    /**
     * @return the imageType
     */
    public String getImageType() {
        return imageType;
    }

    /**
     * @param imageType the imageType to set
     */
    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    /**
     * @return the detectionParameters
     */
    public DetectionParameters getDetectionParameters() {
        return detectionParameters;
    }

    /**
     * @param detectionParameters the detectionParameters to set
     */
    public void setDetectionParameters(DetectionParameters detectionParameters) {
        this.detectionParameters = detectionParameters;
    }

    /**
     * @return the mMSI
     */
    public String getMMSI() {
        return MMSI;
    }

    /**
     * @param mMSI the mMSI to set
     */
    public void setMMSI(String mMSI) {
        MMSI = mMSI;
    }

    /**
     * @return the shipCategory
     */
    public Double getShipCategory() {
        return shipCategory;
    }

    /**
     * @param shipCategory the shipCategory to set
     */
    public void setShipCategory(Double shipCategory) {
        this.shipCategory = shipCategory;
    }

    /**
     * @return the confidenceLevelCat
     */
    public String getConfidenceLevelCat() {
        return confidenceLevelCat;
    }

    /**
     * @param confidenceLevelCat the confidenceLevelCat to set
     */
    public void setConfidenceLevelCat(String confidenceLevelCat) {
        this.confidenceLevelCat = confidenceLevelCat;
    }

    /**
     * @return the the_geom
     */
    public String getPosition() {
        return "POINT(" + the_geom + ")";
    }

    /**
     * @param the_geom the the_geom to set
     */
    public void setPosition(String the_geom) {
        this.the_geom = the_geom;
    }
    
}

class DetectionParameters {
 
    private Double RCS;
    
    private Double maxPixelValue;
    
    /**
     * @return the rCS
     */
    public Double getRCS() {
        return RCS;
    }

    /**
     * @param rCS the rCS to set
     */
    public void setRCS(Double rCS) {
        RCS = rCS;
    }
    
    /**
     * @return the maxPixelValue
     */
    public Double getMaxPixelValue() {
        return maxPixelValue;
    }

    /**
     * @param maxPixelValue the maxPixelValue to set
     */
    public void setMaxPixelValue(Double maxPixelValue) {
        this.maxPixelValue = maxPixelValue;
    }   
}