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

import it.geosolutions.geobatch.catalog.Configuration;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;

import java.util.List;

/**
 * 
 * @author Simone Giannecchini, GeoSolutions SAS
 * 
 */
public class RegistryActionConfiguration extends ActionConfiguration implements Configuration {

    protected RegistryActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

    private String workingDirectory;

    private String crs;

    private String envelope;

    private String geoserverPWD;

    private String geoserverUID;

    private String geoserverURL;

    private String registryURL;

    private String providerURL;

    private String storeFilePrefix;

    private String configId;

    private String datatype;

    private String defaultNamespace;

    private String defaultNamespaceUri;

    private String defaultStyle;

    private String wmsPath;

    private List<String> styles;

    private String dataTransferMethod;

    private String metocDictionaryPath;

    private String metocHarvesterXMLTemplatePath;


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

    public String getGeoserverPWD() {
        return geoserverPWD;
    }

    public void setGeoserverPWD(String geoserverPWD) {
        this.geoserverPWD = geoserverPWD;
    }

    public String getGeoserverUID() {
        return geoserverUID;
    }

    public void setGeoserverUID(String geoserverUID) {
        this.geoserverUID = geoserverUID;
    }

    public String getGeoserverURL() {
        return geoserverURL;
    }

    public void setGeoserverURL(String geoserverURL) {
        this.geoserverURL = geoserverURL;
    }

    public String getStoreFilePrefix() {
        return storeFilePrefix;
    }

    public void setStoreFilePrefix(String storeFilePrefix) {
        this.storeFilePrefix = storeFilePrefix;
    }

    public List<String> getStyles() {
        return styles;
    }

    public void setStyles(List<String> styles) {
        this.styles = styles;
    }

    public String getConfigId() {
        return configId;
    }

    public void setConfigId(String configId) {
        this.configId = configId;
    }

    public String getDatatype() {
        return datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public String getDefaultNamespace() {
        return defaultNamespace;
    }

    public void setDefaultNamespace(String defaultNamespace) {
        this.defaultNamespace = defaultNamespace;
    }

    public String getDefaultNamespaceUri() {
        return defaultNamespaceUri;
    }

    public void setDefaultNamespaceUri(String defaultNamespaceUri) {
        this.defaultNamespaceUri = defaultNamespaceUri;
    }

    public String getDefaultStyle() {
        return defaultStyle;
    }

    public void setDefaultStyle(String defaultStyle) {
        this.defaultStyle = defaultStyle;
    }

    public String getWmsPath() {
        return wmsPath;
    }

    public void setWmsPath(String wmsPath) {
        this.wmsPath = wmsPath;
    }

    public String getDataTransferMethod() {
        return dataTransferMethod;
    }

    public void setDataTransferMethod(String dataTransferMethod) {
        this.dataTransferMethod = dataTransferMethod;
    }

    /**
     * @param metocDictionaryPath
     *            the metocDictionaryPath to set
     */
    public void setMetocDictionaryPath(String metocDictionaryPath) {
        this.metocDictionaryPath = metocDictionaryPath;
    }

    /**
     * @return the metocDictionaryPath
     */
    public String getMetocDictionaryPath() {
        return metocDictionaryPath;
    }

    /**
     * @param metocHarvesterXMLTemplatePath
     *            the metocHarvesterXMLTemplatePath to set
     */
    public void setMetocHarvesterXMLTemplatePath(String metocHarvesterXMLTemplatePath) {
        this.metocHarvesterXMLTemplatePath = metocHarvesterXMLTemplatePath;
    }

    /**
     * @return the metocHarvesterXMLTemplatePath
     */
    public String getMetocHarvesterXMLTemplatePath() {
        return metocHarvesterXMLTemplatePath;
    }

    /**
     * @param registryURL
     *            the registryURL to set
     */
    public void setRegistryURL(String registryURL) {
        this.registryURL = registryURL;
    }

    /**
     * @return the registryURL
     */
    public String getRegistryURL() {
        return registryURL;
    }

    /**
     * @param providerURL
     *            the providerURL to set
     */
    public void setProviderURL(String providerURL) {
        this.providerURL = providerURL;
    }

    /**
     * @return the providerURL
     */
    public String getProviderURL() {
        return providerURL;
    }

    @Override
    public RegistryActionConfiguration clone() {
        final RegistryActionConfiguration configuration = new RegistryActionConfiguration(super
                .getId(), super.getName(), super.getDescription());
        configuration.setCrs(crs);
        configuration.setDataTransferMethod(dataTransferMethod);
        configuration.setDatatype(datatype);
        configuration.setDefaultNamespace(defaultNamespace);
        configuration.setDefaultNamespaceUri(defaultNamespaceUri);
        configuration.setDefaultStyle(defaultStyle);
        configuration.setEnvelope(envelope);
        configuration.setGeoserverPWD(geoserverPWD);
        configuration.setGeoserverUID(geoserverUID);
        configuration.setGeoserverURL(geoserverURL);
        configuration.setRegistryURL(registryURL);
        configuration.setProviderURL(providerURL);
        configuration.setServiceID(getServiceID());
        configuration.setStoreFilePrefix(storeFilePrefix);
        configuration.setStyles(styles);
        configuration.setWmsPath(wmsPath);
        configuration.setWorkingDirectory(workingDirectory);
        configuration.setMetocDictionaryPath(metocDictionaryPath);
        configuration.setMetocHarvesterXMLTemplatePath(metocHarvesterXMLTemplatePath);

        return configuration;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[" + "id:" + getId() + " name:" + getName()
                + " srvId:" + getServiceID() + " wkdir:" + getWorkingDirectory() + " GSurl:"
                + getGeoserverURL() + "]";
    }

}
