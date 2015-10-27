package it.geosolutions.geobatch.mariss.actions;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;

@XStreamAlias("ProductAnalyzer")
@XStreamInclude({ ConfigurationContainer.class })
public class ProductAnalizerConfiguration extends IngestionActionConfiguration {

	public ProductAnalizerConfiguration(String id, String name, String description) {
		super(id, name, description);
		// TODO Auto-generated constructor stub
	}

}
