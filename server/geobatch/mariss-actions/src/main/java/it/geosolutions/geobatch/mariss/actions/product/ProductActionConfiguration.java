package it.geosolutions.geobatch.mariss.actions.product;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

import it.geosolutions.geobatch.mariss.actions.RemoteServiceHandlingConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
/**
 * Configuration for product action
 * @author Lorenzo Natali
 *
 */
@XStreamAlias("ProductActionConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class ProductActionConfiguration extends RemoteServiceHandlingConfiguration {

	public ProductActionConfiguration(String id, String name, String description) {
		super(id, name, description);
		
	}

}
