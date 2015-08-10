package it.geosolutions.geobatch.mariss.actions.sartiff;

import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

@XStreamAlias("SARGeoTiffActionConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class SARGeoTiffActionConfiguration extends IngestionActionConfiguration {

    public SARGeoTiffActionConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

}
