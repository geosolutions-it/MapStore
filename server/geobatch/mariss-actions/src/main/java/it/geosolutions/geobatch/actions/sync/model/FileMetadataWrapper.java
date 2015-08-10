package it.geosolutions.geobatch.actions.sync.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * Container to dispatch between flows and actions
 * @author Lorenzo Natali, GeoSolutions
 *
 */
@XStreamAlias("FileMetadataWrapper")
public class FileMetadataWrapper {
	/**
	 * Metadata for the flows
	 */
	private Map<String,Object> metadata = new HashMap<String,Object>();
	
	/**
	 * Files generated
	 */
	private List<String> files;
	
	/**
	 * OutCome status
	 */
	private Status status;
	
	/**
	 * the results of the process
	 */
	private Map<String,String> outcome;

	public Map<String, Object> getMetadata() {
		return metadata;
	}

	public void setMetadata(Map<String, Object> metadata) {
		this.metadata = metadata;
	}

	public void addMetadata(String key,Object data){
	    if(this.metadata==null){
	        metadata = new HashMap<String,Object>();
	    }
	    metadata.put(key, data);
	}
	public List<String> getFiles() {
		return files;
	}

	public void setFiles(List<String> files) {
		this.files = files;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public Map<String,String> getOutcome() {
		return outcome;
	}

	public void setOutcome(Map<String,String> outcome) {
		this.outcome = outcome;
	}
	
	
	
}
