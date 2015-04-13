package it.geosolutions.geobatch.mariss.actions.netcdf;

public class NetCDFConfigurationContainer extends ConfigurationContainer {
    
    private String netcdfDirectory;

    public String getNetcdfDirectory() {
        return netcdfDirectory;
    }

    public void setNetcdfDirectory(String netcdfDirectory) {
        this.netcdfDirectory = netcdfDirectory;
    }
}
