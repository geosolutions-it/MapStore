package it.geosolutions.geobatch.metocs.base;

import it.geosolutions.geobatch.metocs.commons.MetocActionConfiguration;

public class NetCDFCFGeodetic2GeoTIFFsConfiguration extends MetocActionConfiguration {

    /**
     * This represents the base directory where to public layers
     */
    private String layerParentDirectory;

    /**
     * @return represents the base directory where to public layers
     */
    public String getLayerParentDirectory() {
        return layerParentDirectory;
    }

    /**
     * @param represents
     *            the base directory where to public layers
     */
    public void setLayerParentDirectory(String outputDirectory) {
        this.layerParentDirectory = outputDirectory;
    }

    public NetCDFCFGeodetic2GeoTIFFsConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

    @Override
    public NetCDFCFGeodetic2GeoTIFFsConfiguration clone() {
        NetCDFCFGeodetic2GeoTIFFsConfiguration configuration = new NetCDFCFGeodetic2GeoTIFFsConfiguration(
                super.getId(), super.getName(), super.getDescription());

        configuration.setCrs(getCrs());
        configuration.setFlipY(isFlipY());
        configuration.setEnvelope(getEnvelope());
        configuration.setServiceID(getServiceID());
        configuration.setStoreFilePrefix(getStoreFilePrefix());
        configuration.setWorkingDirectory(getWorkingDirectory());
        configuration.setMetocDictionaryPath(getMetocDictionaryPath());
        configuration.setMetocHarvesterXMLTemplatePath(getMetocHarvesterXMLTemplatePath());
        configuration.setPackComponents(isPackComponents());
        configuration.setTimeUnStampedOutputDir(isTimeUnStampedOutputDir());
        configuration.setCruiseName(getCruiseName());
        configuration.setLayerParentDirectory(getLayerParentDirectory());

        return configuration;
    }
}
