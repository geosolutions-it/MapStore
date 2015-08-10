package it.geosolutions.geobatch.mariss.actions.netcdf;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

@XStreamAlias("SARWmf")
@XStreamInclude({ ConfigurationContainer.class })
public class SARWnfActionConfiguration extends IngestionActionConfiguration {

    public SARWnfActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

}
