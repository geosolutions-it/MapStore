package it.geosolutions.geobatch.mariss.actions.netcdf;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;
@XStreamAlias("SARWave")
@XStreamInclude({ ConfigurationContainer.class })
public class SARWaveActionConfiguration extends IngestionActionConfiguration {

    public SARWaveActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

}
