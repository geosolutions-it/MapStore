package it.geosolutions.geobatch.mariss.actions.netcdf;

import java.util.Map;


public abstract class ConfigurationContainer {
    
    protected ConfigurationContainer() {
    }

    private String pattern;
    
    private String defaultNameSpace;
    
    private String defaultNameSpaceURI;
    
    private String actionClass;
    
    private Map<String, String> params;

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getActionClass() {
        return actionClass;
    }

    public void setActionClass(String actionClass) {
        this.actionClass = actionClass;
    }

    public String getDefaultNameSpace() {
        return defaultNameSpace;
    }

    public void setDefaultNameSpace(String defaultNameSpace) {
        this.defaultNameSpace = defaultNameSpace;
    }

    public String getDefaultNameSpaceURI() {
        return defaultNameSpaceURI;
    }

    public void setDefaultNameSpaceURI(String defaultNameSpaceURI) {
        this.defaultNameSpaceURI = defaultNameSpaceURI;
    }

    public Map<String, String> getParams() {
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }
}
