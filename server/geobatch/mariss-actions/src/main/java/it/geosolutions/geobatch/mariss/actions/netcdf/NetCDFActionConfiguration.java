package it.geosolutions.geobatch.mariss.actions.netcdf;

import it.geosolutions.geobatch.actions.ds2ds.dao.FeatureConfiguration;
import it.geosolutions.geobatch.geoserver.GeoServerActionConfiguration;

public class NetCDFActionConfiguration extends GeoServerActionConfiguration {

    public NetCDFActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }
    
    private FeatureConfiguration outputFeature;
    
    private String netcdfDirectory;
    
    private String geoserverDataDirectory;

    private String metocDictionaryPath;
    
    private String productsTableName;
    
    private String pattern;

    public FeatureConfiguration getOutputFeature() {
        return outputFeature;
    }

    public void setOutputFeature(FeatureConfiguration outputFeature) {
        this.outputFeature = outputFeature;
    }

    public String getNetcdfDirectory() {
        return netcdfDirectory;
    }

    public void setNetcdfDirectory(String netcdfDirectory) {
        this.netcdfDirectory = netcdfDirectory;
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

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
