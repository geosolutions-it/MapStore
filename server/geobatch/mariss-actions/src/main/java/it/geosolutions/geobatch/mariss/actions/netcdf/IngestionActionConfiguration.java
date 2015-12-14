package it.geosolutions.geobatch.mariss.actions.netcdf;

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;

public class IngestionActionConfiguration extends Ds2dsConfiguration {

    private FeatureConfiguration outputFeature;

    private String geoserverDataDirectory;

    private String metocDictionaryPath;

    private String productsTableName;

    private String serviceName;

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

    private String shipDetectionsTableName;
    
    private String oilSpillsTableName;

    /**
     * The file name to get the Product Attributes
     */
    private String attributeFileName;

    public IngestionActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

    public ConfigurationContainer getContainer() {
        return container;
    }

    public String getGeoserverDataDirectory() {
        return geoserverDataDirectory;
    }

    public String getGeoserverPWD() {
        return geoserverPWD;
    }

    public String getGeoserverUID() {
        return geoserverUID;
    }

    public String getGeoserverURL() {
        return geoserverURL;
    }

    public String getMetocDictionaryPath() {
        return metocDictionaryPath;
    }

    @Override
    public FeatureConfiguration getOutputFeature() {
        return outputFeature;
    }

    public String getProductsTableName() {
        return productsTableName;
    }

    public String getShipDetectionsTableName() {
        return shipDetectionsTableName;
    }

    public String getOilSpillsTableName() {
        return oilSpillsTableName;
    }
    
    public String getServiceName() {
        return serviceName;
    }

    public void setContainer(ConfigurationContainer container) {
        this.container = container;
    }

    public void setGeoserverDataDirectory(String geoserverDataDirectory) {
        this.geoserverDataDirectory = geoserverDataDirectory;
    }

    public void setGeoserverPWD(String geoserverPWD) {
        this.geoserverPWD = geoserverPWD;
    }

    public void setGeoserverUID(String geoserverUID) {
        this.geoserverUID = geoserverUID;
    }

    public void setGeoserverURL(String geoserverURL) {
        this.geoserverURL = geoserverURL;
    }

    public void setMetocDictionaryPath(String metocDictionaryPath) {
        this.metocDictionaryPath = metocDictionaryPath;
    }

    @Override
    public void setOutputFeature(FeatureConfiguration outputFeature) {
        this.outputFeature = outputFeature;
    }

    public void setProductsTableName(String productsTableName) {
        this.productsTableName = productsTableName;
    }

    public void setShipDetectionsTableName(String shipDetectionsTableName) {
        this.shipDetectionsTableName = shipDetectionsTableName;
    }
    
    public void setOilSpillsTableName(String oilSpillsTableName) {
        this.oilSpillsTableName = oilSpillsTableName;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAttributeFileName() {
        return this.attributeFileName;

    }

    public void setAttributeFileName(String attributeFileName) {
        this.attributeFileName = attributeFileName;
    }

}
