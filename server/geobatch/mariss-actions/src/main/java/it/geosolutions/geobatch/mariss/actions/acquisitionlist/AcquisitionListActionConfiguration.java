package it.geosolutions.geobatch.mariss.actions.acquisitionlist;

import it.geosolutions.geobatch.mariss.actions.RemoteServiceHandlingConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

/**
 * Configuration for Acquisition List Action
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@XStreamAlias("AcquisitionListConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class AcquisitionListActionConfiguration extends
		RemoteServiceHandlingConfiguration {

	public AcquisitionListActionConfiguration(String id, String name,
			String description) {
		super(id, name, description);
		
	}

}
