package it.geosolutions.npa.rest;

import it.geosolutions.npa.model.RoleUSIDRule;
import it.geosolutions.npa.service.USIDService;

import java.io.IOException;

import org.geoserver.rest.RestletException;
import org.geoserver.rest.util.RESTUtils;
import org.restlet.Finder;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Resource;

/**
 * Rest controller to access USID resources.
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public class USIDFinder extends Finder {

    private final USIDService usidService;
    
    public USIDFinder(USIDService usidService) {
        this.usidService = usidService;
    }
    
    @Override
    public Resource findTarget(final Request request, final Response response) {
    
        String ruleId = RESTUtils.getAttribute(request, USIDResource.RULEID_ATTR);
        String role = (ruleId != null) ? RoleUSIDRule.getRoleFromRuleId(ruleId)
                : null;
        String usid = (ruleId != null) ? RoleUSIDRule.getUsidFromRuleId(ruleId)
                : null;
    
        if (role != null && usid != null) {
            // check if resource exists
            RoleUSIDRule record = null;
            try {
                record = usidService.getSingleRecord(role, usid);
            } catch (IOException e) {
                throw new RestletException(
                        "Exception occurred querying the database",
                        Status.SERVER_ERROR_INTERNAL, e);
            }
    
            if (record == null) {
                String errMsg = String.format(
                        "No resource found for role \"%s\" and USID \"%s\"", role, usid);
                throw new RestletException(errMsg, Status.CLIENT_ERROR_NOT_FOUND);
            } else {
                return new USIDResource(getContext(), request, response, usidService);
            }
        }
    
        return new USIDListResource(getContext(), request, response, usidService);
    }
}
