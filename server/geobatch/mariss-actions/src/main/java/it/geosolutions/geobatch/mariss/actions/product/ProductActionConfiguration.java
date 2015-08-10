package it.geosolutions.geobatch.mariss.actions.product;

import it.geosolutions.geobatch.mariss.actions.RemoteServiceHandlingConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;
/**
 * Configuration for product action
 * @author Lorenzo Natali
 *
 */
@XStreamAlias("ProductActionConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class ProductActionConfiguration extends RemoteServiceHandlingConfiguration {

	private String createFilEventWrapperTo;
	
	private boolean executeActions = false;
	
	public boolean getExecuteActions() {
		return executeActions;
	}
	public void setExecuteActions(boolean executeActions) {
		this.executeActions = executeActions;
	}
	public ProductActionConfiguration(String id, String name, String description) {
		super(id, name, description);
		
	}
	public String getCreateFileEventWrapperTo() {
		return createFilEventWrapperTo;
	}
	public void setCreateFileEventWrapperTo(String createFilEventWrapperTo) {
		this.createFilEventWrapperTo = createFilEventWrapperTo;
	}
	
	

}
