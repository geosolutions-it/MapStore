package it.geosolutions.geobatch.mariss.actions.netcdf;

import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("container")
public class ConfigurationContainer {

    private String pattern;

    private String defaultNameSpace;

    private String defaultNameSpaceURI;

    private String actionClass;

    private Map<String, String> params;

    protected ConfigurationContainer() {
    }

    public String getActionClass() {
        return actionClass;
    }

    public String getDefaultNameSpace() {
        return defaultNameSpace;
    }

    public String getDefaultNameSpaceURI() {
        return defaultNameSpaceURI;
    }

    public Map<String, String> getParams() {
        return params;
    }

    public String getPattern() {
        return pattern;
    }

    public void setActionClass(String actionClass) {
        this.actionClass = actionClass;
    }

    public void setDefaultNameSpace(String defaultNameSpace) {
        this.defaultNameSpace = defaultNameSpace;
    }

    public void setDefaultNameSpaceURI(String defaultNameSpaceURI) {
        this.defaultNameSpaceURI = defaultNameSpaceURI;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
