package it.geosolutions.geobatch.mariss.actions.ship;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;

@XStreamAlias("ShipDectection")
@XStreamInclude({ ConfigurationContainer.class })
public class ShipDecectionConfiguration extends IngestionActionConfiguration {

	public ShipDecectionConfiguration(String id, String name, String description) {
		super(id, name, description);
		// TODO Auto-generated constructor stub
	}

}
