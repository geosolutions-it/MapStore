package it.geosolutions.geobatch.actions.sync;

import com.thoughtworks.xstream.annotations.XStreamAlias;

import it.geosolutions.geobatch.configuration.event.action.ActionConfiguration;

/**
 * Configuration For <FileDispatcherAction>
 * @author Lorenzo Natali
 *
 */
@XStreamAlias("FileDispacherConfiguration")
public class FileDispacherConfiguration extends ActionConfiguration {

	public FileDispacherConfiguration(String id, String name, String description) {
		super(id, name, description);
	}

}
