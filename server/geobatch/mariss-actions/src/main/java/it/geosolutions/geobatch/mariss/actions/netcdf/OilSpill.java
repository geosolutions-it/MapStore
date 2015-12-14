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
 */

@XStreamAlias("OilSpill")
public class OilSpill {

    private String id;

    private String timeStamp;

    private Boolean includeInReport;

    private Double baricLat;

    private Double baricLon;

    private Double maxLat;

    private Double maxLon;

    private Double minLat;

    private Double minLon;

    private Double areaKm;

    private Double lengthKm;

    private Double widthKm;

    private String classVal;

    private String alarmLev;

    private String possibleS;

    private String regionAff;

    private String country;

    private String seepage;

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
     * @return the the_geom
     */
    public String getPosition() {
        the_geom = the_geom.trim();
        return "SRID=4326;" + the_geom;
    }

    /**
     * @param the_geom the the_geom to set
     */
    public void setPosition(String the_geom) {
        this.the_geom = the_geom;
    }

    /**
     * @return the baricLat
     */
    public Double getBaricLat() {
        return baricLat;
    }

    /**
     * @param baricLat the baricLat to set
     */
    public void setBaricLat(Double baricLat) {
        this.baricLat = baricLat;
    }

    /**
     * @return the baricLon
     */
    public Double getBaricLon() {
        return baricLon;
    }

    /**
     * @param baricLon the baricLon to set
     */
    public void setBaricLon(Double baricLon) {
        this.baricLon = baricLon;
    }

    /**
     * @return the maxLat
     */
    public Double getMaxLat() {
        return maxLat;
    }

    /**
     * @param maxLat the maxLat to set
     */
    public void setMaxLat(Double maxLat) {
        this.maxLat = maxLat;
    }

    /**
     * @return the maxLon
     */
    public Double getMaxLon() {
        return maxLon;
    }

    /**
     * @param maxLon the maxLon to set
     */
    public void setMaxLon(Double maxLon) {
        this.maxLon = maxLon;
    }

    /**
     * @return the minLat
     */
    public Double getMinLat() {
        return minLat;
    }

    /**
     * @param minLat the minLat to set
     */
    public void setMinLat(Double minLat) {
        this.minLat = minLat;
    }

    /**
     * @return the minLon
     */
    public Double getMinLon() {
        return minLon;
    }

    /**
     * @param minLon the minLon to set
     */
    public void setMinLon(Double minLon) {
        this.minLon = minLon;
    }

    /**
     * @return the areaKm
     */
    public Double getAreaKm() {
        return areaKm;
    }

    /**
     * @param areaKm the areaKm to set
     */
    public void setAreaKm(Double areaKm) {
        this.areaKm = areaKm;
    }

    /**
     * @return the lengthKm
     */
    public Double getLengthKm() {
        return lengthKm;
    }

    /**
     * @param lengthKm the lengthKm to set
     */
    public void setLengthKm(Double lengthKm) {
        this.lengthKm = lengthKm;
    }

    /**
     * @return the widthKm
     */
    public Double getWidthKm() {
        return widthKm;
    }

    /**
     * @param widthKm the widthKm to set
     */
    public void setWidthKm(Double widthKm) {
        this.widthKm = widthKm;
    }

    /**
     * @return the classVal
     */
    public String getClassVal() {
        return classVal;
    }

    /**
     * @param classVal the classVal to set
     */
    public void setClassVal(String classVal) {
        this.classVal = classVal;
    }

    /**
     * @return the alarmLev
     */
    public String getAlarmLev() {
        return alarmLev;
    }

    /**
     * @param alarmLev the alarmLev to set
     */
    public void setAlarmLev(String alarmLev) {
        this.alarmLev = alarmLev;
    }

    /**
     * @return the possibleS
     */
    public String getPossibleS() {
        return possibleS;
    }

    /**
     * @param possibleS the possibleS to set
     */
    public void setPossibleS(String possibleS) {
        this.possibleS = possibleS;
    }

    /**
     * @return the regionAff
     */
    public String getRegionAff() {
        return regionAff;
    }

    /**
     * @param regionAff the regionAff to set
     */
    public void setRegionAff(String regionAff) {
        this.regionAff = regionAff;
    }

    /**
     * @return the country
     */
    public String getCountry() {
        return country;
    }

    /**
     * @param country the country to set
     */
    public void setCountry(String country) {
        this.country = country;
    }

    /**
     * @return the seepage
     */
    public String getSeepage() {
        return seepage;
    }

    /**
     * @param seepage the seepage to set
     */
    public void setSeepage(String seepage) {
        this.seepage = seepage;
    }

}
