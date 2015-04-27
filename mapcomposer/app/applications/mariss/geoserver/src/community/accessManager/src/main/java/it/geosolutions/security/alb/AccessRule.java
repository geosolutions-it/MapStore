package it.geosolutions.security.alb;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
/**
 * The access rules to dispatch elements
 * @author Lorenzo Natali, GeoSolutions
 *
 */
public class AccessRule implements Serializable{
    
    /** serialVersionUID */
    private static final long serialVersionUID = 1974806089193175379L;
    
    /**
     * Any layer, or any workspace, or any role
     */
    public static final String ANY = "*";
    private String workspace;
    private String layer;
    private String accessLimitBuilder;
    private Map<String,Object> options;
    
    /**
     * @return the workspace
     */
    public String getWorkspace() {
        return workspace;
    }
    /**
     * @param workspace the workspace to set
     */
    public void setWorkspace(String workspace) {
        this.workspace = workspace;
    }
    /**
     * @return the layer
     */
    public String getLayer() {
        return layer;
    }
    /**
     * @param layer the layer to set
     */
    public void setLayer(String layer) {
        this.layer = layer;
    }
    /**
     * @return the accessLimitBuilder (bean name)
     */
    public String getAccessLimitBuilder() {
        return accessLimitBuilder;
    }
    /**
     * @param accessLimitBuilder the accessLimitBuilder (bean name) to set
     */
    public void setAccessLimitBuilder(String accessLimitBuilder) {
        this.accessLimitBuilder = accessLimitBuilder;
    }
    /**
     * Returns the key for the current rule. No other rule should have the same.
     * The key follows the pattern: [workspace].[layer]
     * 
     * @return
     */
    public String getKey() {
        return workspace + "." + layer ;
    }
    /**
     * Alias for {@link #getAccessLimitBuilder()}.
     * 
     * @return the value
     */
    public String getValue(){
        return accessLimitBuilder;
    }
    @Override
    public String toString() {
        return getKey() + "=" + getValue();
    }
	public Map<String,Object> getOptions() {
		if (this.options == null) {
			this.options = new HashMap<String, Object>();
		}
		return options;
	}
	public void setOptions(Map<String,Object> options) {
		this.options = options;
	}
    
    
}
