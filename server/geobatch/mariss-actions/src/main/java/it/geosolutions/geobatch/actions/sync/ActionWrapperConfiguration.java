package it.geosolutions.geobatch.actions.sync;

import it.geosolutions.geobatch.actions.sync.model.ActionOption;
import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

/**
 * Configuration For <ActionWrapper> Action
 * Provides base functionalities to wrap many action dispatching
 * events to the sub-actions.
 * 
 * Stores the output events of each sub action and allows to forward theese
 * to other sub-actions. 
 * 
 * @author Lorenzo Natali
 *
 */
@XStreamAlias("ActionWrapperConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class ActionWrapperConfiguration extends ActionConfiguration{
	
	/**
	 * List of action configurations to execute
	 */
	private List<ActionConfiguration> actions = new ArrayList<ActionConfiguration>();
	
	/**
	 * Options for actions
	 */
	private Map<String,ActionOption> actionOptions = new HashMap<String,ActionOption>(); 
	
	/**
	 * Id of the action-output to use as output. 
	 */
	private  String outputId;

	private boolean ignoreConfigurationFail = true;
	
	public Map<String, ActionOption> getActionOptions() {
		return actionOptions;
	}
	public void setActionOptions(Map<String, ActionOption> modes) {
		this.actionOptions = modes;
	}
	public ActionWrapperConfiguration(String id,String name,String description) {
		super(id, name, description);
	}
	public List<ActionConfiguration> getActions(){
		return actions;
	}
	public void setActions(List<ActionConfiguration> actions) {
		this.actions = actions;
	}
	public String getInputSource(String name) {
		if(actionOptions.containsKey(name)){
			return actionOptions.get(name).getInputSource();
		}
		return null;
		
		
	}
	public String getOutputId() {
		return outputId;
	}
	public void setOutputId(String outputId) {
		this.outputId = outputId;
	}
	public boolean isIgnoreConfigurationFail() {
		return ignoreConfigurationFail;
	}
	public void setIgnoreConfigurationFail(boolean ignoreConfigurationFail) {
		this.ignoreConfigurationFail = ignoreConfigurationFail;
	}
	
	
	
	
}
