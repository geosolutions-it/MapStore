package it.geosolutions.security.alb.config;

import it.geosolutions.security.alb.AccessRule;

import java.io.Serializable;
import java.util.Set;
/**
 * Configuration for the Resource Access Manager
 * @author Lorenzo Natali
 *
 */
public class AccessLimitConfiguration implements Serializable {

    private static final long serialVersionUID = 1L;
    
    private Set<AccessRule> rules;
    private String defaultAccessBuilder;
    
    /**
     * @return the set of rules
     */
    public Set<AccessRule> getRules() {
        return rules;
    }
    /**
     * @param rules the rules to set
     */
    public void setRules(Set<AccessRule> rules) {
        this.rules = rules;
    }
    /**
     * @return the default access builder
     */
    public String getDefaultAccessBuilder() {
        return defaultAccessBuilder;
    }
    /**
     * @param defaultAccessBuilder the default access builder to set
     */
    public void setDefaultAccessBuilder(String defaultAccessBuilder) {
        this.defaultAccessBuilder = defaultAccessBuilder;
    }
}
