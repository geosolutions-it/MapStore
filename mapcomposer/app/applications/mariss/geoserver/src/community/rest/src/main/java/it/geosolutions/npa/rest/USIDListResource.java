package it.geosolutions.npa.rest;

import it.geosolutions.npa.model.RoleUSIDRule;
import it.geosolutions.npa.rest.format.RootNodeDroppingJSONFormat;
import it.geosolutions.npa.rest.model.RuleList;
import it.geosolutions.npa.service.USIDService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.geoserver.rest.ReflectiveResource;
import org.geoserver.rest.RestletException;
import org.geoserver.rest.format.ReflectiveJSONFormat;
import org.geoserver.rest.format.ReflectiveXMLFormat;
import org.restlet.Context;
import org.restlet.data.MediaType;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;

import com.thoughtworks.xstream.XStream;

/**
 * Resource representing a list of role-USID association (USID rules).
 * <p>
 * Supports GET and POST operations.
 * </p>
 * <p>
 * The response body of GET operations will contain a serialized instance of
 * {@link RuleList} in HTML, XML or JSON format.
 * </p>
 * <p>
 * POST request body must contain a serialized instance of {@link RoleUSIDRule}
 * in either XML or JSON format; both representations must have a root node
 * called {@code "rule"}.
 * </p>
 * <p>
 * This resource and its twin sister {@link USIDResource} can be easily consumed
 * by an ExtJS client, e.g. configuring a {@code Ext.data.JsonStore} with root:
 * 'rules', idProperty: 'ruleId', totalProperty: 'totalCount' and
 * successProperty: 'success'.
 * </p>
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public class USIDListResource extends ReflectiveResource {

    public static final String USID_PARAM = "usid";
    public static final String ROLE_PARAM = "role";
    public static final String OFFSET_PARAM = "start";
    public static final String PAGE_SIZE_PARAM = "limit";
    
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int DEFAULT_OFFSET = 0;
    
    private USIDService usidService;
    
    public USIDListResource(Context context, Request request, Response response,
            USIDService usidService) {
        super(context, request, response);
        this.usidService = usidService;
    }
    
    @Override
    public boolean allowPost() {
        return true;
    }
    
    @Override
    public Object handleObjectGet() {
    
        RuleList result = new RuleList();
        result.setTotalCount(0);
    
        String queryRole = getQueryStringValue(ROLE_PARAM, String.class, null);
        String queryUsid = getQueryStringValue(USID_PARAM, String.class, null);
        int page = getQueryStringValue(PAGE_SIZE_PARAM, Integer.class,
                DEFAULT_PAGE_SIZE);
        int offset = getQueryStringValue(OFFSET_PARAM, Integer.class,
                DEFAULT_OFFSET);
    
        try {
            List<RoleUSIDRule> rules = new ArrayList<RoleUSIDRule>();
    
            if (queryRole != null && !queryRole.isEmpty()) {
                // filter by role
                Collection<Object> usids = usidService.getUsidForRole(queryRole, page, offset);
                result.setTotalCount(usidService.countUsidForRole(queryRole));
                populateRulesFromUsidList(rules, queryRole, usids);
            } else if (queryUsid != null && !queryUsid.isEmpty()) {
                // filter by usid
                Collection<String> roles = usidService.getRolesForUsid(queryUsid, page, offset);
                result.setTotalCount(usidService.countRolesForUsid(queryUsid));
                populateRulesFromRoleList(rules, queryUsid, roles);
            } else {
                // no filters
                rules.addAll(usidService.getAllRecords(page, offset));
                result.setTotalCount(usidService.countAll());
            }
    
            result.setList(rules);
            result.setSuccess(true);
    
            return result;
        } catch (IOException e) {
            throw new RestletException("Exception occurred querying database",
                    Status.SERVER_ERROR_INTERNAL, e);
        }
    }
    
    @Override
    protected String handleObjectPost(Object object) throws Exception {
        RoleUSIDRule rule = (RoleUSIDRule) object;
    
        String validationError = validateRuleEntity(rule);
        if (validationError != null) {
            throw new RestletException(validationError,
                    Status.CLIENT_ERROR_BAD_REQUEST);
        }
    
        usidService.addUsidForRole(rule.getRole(), rule.getUsid());
    
        RoleUSIDRule newRule = new RoleUSIDRule(rule.getRole(), rule.getUsid());
        MediaType requestMediaType = getRequest().getEntity().getMediaType();
        if (requestMediaType != null
                && requestMediaType.equals(MediaType.APPLICATION_JSON, true)) {
            // build ExtJS compliant response body            
            String newRuleToJson = getFormatPostOrPut().toRepresentation(newRule).getText();
            getResponse().setEntity(
                    "{ \"success\": true, \"rules\": " + newRuleToJson + " }",
                    MediaType.APPLICATION_JSON);
        }
    
        return newRule.getRuleId();
    }

    /**
     * Passed {@link RoleUSIDRule} instance must not be null and its {@code role} 
     * and {@code usid} properties must be set.
     * @param rule
     * @return an error message if validation fails, {@code null} otherwise
     */
    private String validateRuleEntity(RoleUSIDRule rule) {
        if (rule == null) {
            return "No rule found in request body";
        }
        String role = rule.getRole();
        if (role == null || role.isEmpty()) {
            return "Role must not be empty";
        }
        String usid = rule.getUsid();
        if (usid == null || usid.isEmpty()) {
            return "USID must not be empty";
        }
    
        return null;
    }
    
    private void populateRulesFromUsidList(List<RoleUSIDRule> rules, String role,
            Collection<Object> usids) {
        for (Object usid : usids) {
            rules.add(new RoleUSIDRule(role, usid.toString()));
        }
    }
    
    private void populateRulesFromRoleList(List<RoleUSIDRule> rules, Object usid,
            Collection<String> roles) {
        for (String role : roles) {
            rules.add(new RoleUSIDRule(role, usid.toString()));
        }
    }

    /**
     * 
     * @return the usidService
     */
    public USIDService getUsidService() {
        return usidService;
    }

    /**
     * 
     * @param usidService the usidService to set
     */
    public void setUsidService(USIDService usidService) {
        this.usidService = usidService;
    }
    
    @Override
    public void configureXStream(XStream xstream) {
        super.configureXStream(xstream);
        xstream.alias("rule", RoleUSIDRule.class);
        xstream.alias("rules", RuleList.class);
    
        xstream.setMode(XStream.NO_REFERENCES);
    }
    
    @Override
    protected ReflectiveJSONFormat createJSONFormat(Request request,
            Response response) {
        ReflectiveJSONFormat format = new RootNodeDroppingJSONFormat();
        configureXStream(format.getXStream());
        // JSON specific XStream config
        format.getXStream().aliasAttribute(RuleList.class, "list", "rules");
        return format;
    }
    
    @Override
    protected ReflectiveXMLFormat createXMLFormat(Request request, Response response) {
        ReflectiveXMLFormat format = super.createXMLFormat(request, response);
        // XML specific XStream config
        format.getXStream().addImplicitCollection(RuleList.class, "list");
        return format;
    }

}