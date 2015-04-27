package it.geosolutions.npa.rest;

import it.geosolutions.npa.model.RoleUSIDRule;
import it.geosolutions.npa.service.USIDService;

import java.util.List;

import org.geoserver.rest.ReflectiveResource;
import org.restlet.Context;
import org.restlet.data.MediaType;
import org.restlet.data.Preference;
import org.restlet.data.Request;
import org.restlet.data.Response;

import com.thoughtworks.xstream.XStream;

/**
 * Resource representing a single role-USID association (USID rule).
 * <p>
 * Supports GET and DELETE operations.
 * </p>
 * <p>
 * The response body of GET operations will contain a serialized instance of
 * {@link RoleUSIDRule} in HTML, XML or JSON format.
 * </p>
 * <p>
 * The response body of successful DELETE operations, if {@code Accept: application/json}
 * header was set on the request, will contain the JSON object { "success": true
 * }, to enhance compatibility of the service with ExtJS clients.
 * </p>
 * 
 * @author Stefano Costa
 */
public class USIDResource extends ReflectiveResource {

    public static final String RULEID_ATTR = "ruleId";
    
    private USIDService usidService;
    
    public USIDResource(Context context, Request request, Response response, 
            USIDService usidService) {
        
        super(context,request,response);
        this.usidService = usidService;
        
    }
    
    @Override
    public boolean allowPost() {
        return false;
    }
    
    @Override
    public boolean allowPut() {
        return false;
    }
    
    @Override
    public boolean allowDelete() {
        return true;
    }
    
    @Override
    protected Object handleObjectGet() throws Exception {
        String ruleId = getAttribute(RULEID_ATTR);
        String role = RoleUSIDRule.getRoleFromRuleId(ruleId);
        String usid = RoleUSIDRule.getUsidFromRuleId(ruleId);
        
        RoleUSIDRule rule = usidService.getSingleRecord(role, usid);
        
        return rule;
    }
    
    @Override
    protected void handleObjectDelete() throws Exception {
        String ruleId = getAttribute(RULEID_ATTR);
        String role = RoleUSIDRule.getRoleFromRuleId(ruleId);
        String usid = RoleUSIDRule.getUsidFromRuleId(ruleId);
        
        usidService.deleteUsidForRole(role, usid);
        
        if (acceptsJson(getRequest())) {
            // build ExtJS compliant response body
            getResponse().setEntity("{ \"success\": true }", MediaType.APPLICATION_JSON);
        }
    }
    
    /**
     * Attempts to establish whether the client accepts JSON as response format, by inspecting
     * the accepted media types. 
     * @param request
     * @return {@code true} if client accepts {@code application/json} as response content type,
     *          {@code false} otherwise
     */
    private boolean acceptsJson(Request request) {
        List<Preference<MediaType>> acceptedMediaTypes = getRequest().getClientInfo().getAcceptedMediaTypes();
        if (acceptedMediaTypes.isEmpty()) {
            return true;
        }
        
        boolean acceptsJson = false;
        for (Preference<MediaType> mediaTypePreference: acceptedMediaTypes) {
            if (mediaTypePreference.getMetadata().equals(MediaType.APPLICATION_JSON, true)) {
                acceptsJson = true;
                break;
            }
        }
        
        return acceptsJson;
    }

    @Override
    public void configureXStream(XStream xstream){
            super.configureXStream(xstream);
            xstream.alias("rule", RoleUSIDRule.class);
            
            xstream.setMode(XStream.NO_REFERENCES);
    }

}
