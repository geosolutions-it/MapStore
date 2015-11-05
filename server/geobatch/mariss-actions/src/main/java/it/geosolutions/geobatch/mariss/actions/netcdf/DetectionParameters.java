package it.geosolutions.geobatch.mariss.actions.netcdf;

public class DetectionParameters {

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