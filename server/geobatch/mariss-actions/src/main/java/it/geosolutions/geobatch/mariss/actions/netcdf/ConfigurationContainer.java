package it.geosolutions.geobatch.mariss.actions.netcdf;

import java.io.Serializable;

public abstract class ConfigurationContainer implements Serializable{
    
    private String pattern;
    
    private String actionClass;

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
}
