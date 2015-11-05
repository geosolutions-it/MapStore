package it.geosolutions.geobatch.actions.sync;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;

@XStreamAlias("MetadataReadWrite")
@XStreamInclude({ ConfigurationContainer.class })
public class MetadataReadWriteConfiguration extends ActionConfiguration {
    public MetadataReadWriteConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

    public String getfileName() {
        return fileName;
    }

    public void setfileName(String outputFileName) {
        this.fileName = outputFileName;
    }

    private String fileName;
}
