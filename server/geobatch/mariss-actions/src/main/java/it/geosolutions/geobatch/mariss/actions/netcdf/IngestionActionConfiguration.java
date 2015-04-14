package it.geosolutions.geobatch.mariss.actions.netcdf;

import java.util.Map;

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;
import it.geosolutions.geobatch.geoserver.GeoServerActionConfiguration;

public class IngestionActionConfiguration extends Ds2dsConfiguration {

    public IngestionActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }
    
    private FeatureConfiguration outputFeature;
    
    private String geoserverDataDirectory;

    private String metocDictionaryPath;
    
    private String productsTableName;
    
    private String serviceName;
    
    private String uid;
    
    /**
     * Password for the GeoServer instance
     */
    private String geoserverPWD;

    /**
     * User ID for the GeoServer instance
     */
    private String geoserverUID;

    /**
     * URL for the GeoServer instance
     */
    private String geoserverURL;
    
    private ConfigurationContainer container;

    public FeatureConfiguration getOutputFeature() {
        return outputFeature;
    }

    public void setOutputFeature(FeatureConfiguration outputFeature) {
        this.outputFeature = outputFeature;
    }

    public String getMetocDictionaryPath() {
        return metocDictionaryPath;
    }

    public void setMetocDictionaryPath(String metocDictionaryPath) {
        this.metocDictionaryPath = metocDictionaryPath;
    }

    public String getProductsTableName() {
        return productsTableName;
    }

    public void setProductsTableName(String productsTableName) {
        this.productsTableName = productsTableName;
    }

    public String getGeoserverDataDirectory() {
        return geoserverDataDirectory;
    }

    public void setGeoserverDataDirectory(String geoserverDataDirectory) {
        this.geoserverDataDirectory = geoserverDataDirectory;
    }

    public ConfigurationContainer getContainer() {
        return container;
    }

    public void setContainer(ConfigurationContainer container) {
        this.container = container;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
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
}
