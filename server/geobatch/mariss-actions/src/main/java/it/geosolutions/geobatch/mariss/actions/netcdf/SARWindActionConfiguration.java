package it.geosolutions.geobatch.mariss.actions.netcdf;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

@XStreamAlias("SARWind")
@XStreamInclude({ ConfigurationContainer.class })
public class SARWindActionConfiguration extends IngestionActionConfiguration {

    public SARWindActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

}
