package it.geosolutions.npa.model;

/**
 * A rule establishing a unique association between a role and a
 * USID.
 * <p>
 * The class is effectively immutable: {@code role} and {@code usid} properties
 * are set upon instantiation and cannot be modified afterwards.
 * </p>
 * 
 * 
 * @author Lorenzo Natali
 * @author Stefano Costa
 */
public class RoleUSIDRule {
    static final String SEPARATOR = "_";
    
    String ruleId;
    String role;
    String usid;
    
    /**
     * @param role the role to set
     * @param usid the usid to set
     */
    public RoleUSIDRule(String role, String usid) {
        this.role = role;
        this.usid = usid;
        this.ruleId = buildRuleId(role, usid);
    }

    /**
     * Convenience method to build a unique identifier for this rule 
     * concatenating {@code usid} and {@code role} values.
     * 
     * @param role
     * @param usid
     * @returnn the rule identifier, i.e. {@code [usid]_[role]}
     */
    private String buildRuleId(String role, String usid) {
        return usid + SEPARATOR + role;
    }
    
    /**
     * @return the ruleId
     */
    public String getRuleId() {
        return ruleId;
    }

    /**
     * @return the usid
     */
    public String getUsid() {
        return usid;
    }

    /**
     * @return the role
     */
    public String getRole() {
        return role;
    }

    /**
     * Extracts the usid value from the rule identifier.
     *  
     * @param ruleId the rule identifier
     * @return the extracted usid value, or {@code null} if ruleId could not be parsed
     */
    public static String getUsidFromRuleId(String ruleId) {
        if (ruleId != null) {
            return ruleId.split(SEPARATOR)[0];
        } else {
            return null;
        }
    }

    /**
     * Extracts the role value from the rule identifier.
     *  
     * @param ruleId the rule identifier
     * @return the extracted role value, or {@code null} if ruleId could not be parsed
     */
    public static String getRoleFromRuleId(String ruleId) {
        if (ruleId != null) {
            String[] parts = ruleId.split(SEPARATOR);
            return (parts.length > 1) ? parts[1] : null;
        } else {
            return null;
        }
    }
	
}
