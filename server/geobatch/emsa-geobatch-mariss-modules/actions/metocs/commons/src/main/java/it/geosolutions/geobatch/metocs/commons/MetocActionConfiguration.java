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
package it.geosolutions.geobatch.metocs.commons;

import it.geosolutions.geobatch.catalog.Configuration;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;

import java.text.SimpleDateFormat;
import java.util.GregorianCalendar;
import java.util.Map;
import java.util.TimeZone;
import java.util.logging.Logger;

public class MetocActionConfiguration extends ActionConfiguration implements Configuration {

    public MetocActionConfiguration(String id, String name, String description) {
        super(id, name, description);
        
        
        // //
        // initialize params...
        // //
        sdf.setTimeZone(TimeZone.getTimeZone("GMT+0"));
        
    }

    private boolean packComponents;

    private boolean timeUnStampedOutputDir;
    
    private boolean flipY;

    private String workingDirectory;

    private String crs;

    private String envelope;

    private String storeFilePrefix;
    
    private String metocDictionaryPath;

    private String metocHarvesterXMLTemplatePath;
    
    private String cruiseName;

    /**
     * Default logger
     */
    protected final static Logger LOGGER = 
                            Logger.getLogger(MetocActionConfiguration.class.toString());

    protected final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddmm_HHH");

    public static final long startTime;

    static {
        GregorianCalendar calendar = new GregorianCalendar(1980, 00, 01, 00, 00, 00);
        calendar.setTimeZone(TimeZone.getTimeZone("GMT+0"));
        startTime = calendar.getTimeInMillis();
    }

    /**
     * @param queryParams
     * @return
     */
    protected static String getQueryString(Map<String, String> queryParams) {
        StringBuilder queryString = new StringBuilder();

        if (queryParams != null)
            for (Map.Entry<String, String> entry : queryParams.entrySet()) {
                if (queryString.length() > 0)
                    queryString.append("&");
                queryString.append(entry.getKey()).append("=").append(entry.getValue());
            }

        return queryString.toString();
    }

    /**
     * @return the metocDictionaryPath
     */
    public String getMetocDictionaryPath() {
        return metocDictionaryPath;
    }

    /**
     * @param metocDictionaryPath
     *            the metocDictionaryPath to set
     */
    public void setMetocDictionaryPath(String metocDictionaryPath) {
        this.metocDictionaryPath = metocDictionaryPath;
    }

    /**
     * @return the metocHarvesterXMLTemplatePath
     */
    public String getMetocHarvesterXMLTemplatePath() {
        return metocHarvesterXMLTemplatePath;
    }

    /**
     * @param metocHarvesterXMLTemplatePath
     *            the metocHarvesterXMLTemplatePath to set
     */
    public void setMetocHarvesterXMLTemplatePath(String metocHarvesterXMLTemplatePath) {
        this.metocHarvesterXMLTemplatePath = metocHarvesterXMLTemplatePath;
    }

    /**
     * @return the workingDirectory
     */
    public String getWorkingDirectory() {
        return workingDirectory;
    }

    /**
     * @param workingDirectory
     *            the workingDirectory to set
     */
    public void setWorkingDirectory(String workingDirectory) {
        this.workingDirectory = workingDirectory;
    }

    public boolean isPackComponents() {
        return packComponents;
    }

    public void setPackComponents(boolean packComponents) {
        this.packComponents = packComponents;
    }
    
    /**
     * Returns true if the image should be flip by Y 
     * @return boolean
     */
    public boolean isFlipY(){
        return flipY;
    }
    
    public void setFlipY(boolean f){
        this.flipY=f;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getEnvelope() {
        return envelope;
    }

    public void setEnvelope(String envelope) {
        this.envelope = envelope;
    }

    public String getStoreFilePrefix() {
        return storeFilePrefix;
    }

    public void setStoreFilePrefix(String storeFilePrefix) {
        this.storeFilePrefix = storeFilePrefix;
    }

    public String getCruiseName() {
        return cruiseName;
    }

    public void setCruiseName(String cruiseName) {
        this.cruiseName = cruiseName;
    }
    /**
     * @param timeUnStampedOutputDir
     *            the timeUnStampedOutputDir to set
     */
    public void setTimeUnStampedOutputDir(boolean timeUnStampedOutputDir) {
        this.timeUnStampedOutputDir = timeUnStampedOutputDir;
    }

    /**
     * @return the timeUnStampedOutputDir
     */
    public boolean isTimeUnStampedOutputDir() {
        return timeUnStampedOutputDir;
    }

    @Override
    public MetocActionConfiguration clone() {
        return copy(this);
    }
    
    /**
     * copy into returned object src
     * @param src
     * @return
     */
    protected MetocActionConfiguration copy(MetocActionConfiguration src) {
        
        final MetocActionConfiguration configuration = new MetocActionConfiguration(super.getId(),
                super.getName(), super.getDescription());

        configuration.setCrs(src.crs);
        configuration.setFlipY(src.flipY);
        configuration.setEnvelope(src.envelope);
        configuration.setServiceID(src.getServiceID());
        configuration.setStoreFilePrefix(src.storeFilePrefix);
        configuration.setWorkingDirectory(src.workingDirectory);
        configuration.setMetocDictionaryPath(src.metocDictionaryPath);
        configuration.setMetocHarvesterXMLTemplatePath(src.metocHarvesterXMLTemplatePath);
        configuration.setPackComponents(src.packComponents);
        configuration.setTimeUnStampedOutputDir(src.timeUnStampedOutputDir);
        configuration.setCruiseName(src.cruiseName);

        return configuration;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[" + "id:" + getId() + " name:" + getName()
                + " srvId:" + getServiceID() + " wkdir:" + getWorkingDirectory() + "]";
    }

}
