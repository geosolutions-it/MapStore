package it.geosolutions.security.alb.rest;

import it.geosolutions.security.alb.AlbAccessManager;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.geotools.util.logging.Logging;
import org.restlet.Finder;
import org.restlet.data.Method;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Resource;
/**
 * Rest controller to reload access rules
 * @author Lorenzo Natali, GeoSolutions
 *
 */
public class ALBReloadFinder extends Finder {
    
    private final AlbAccessManager albAccessManager;
    
    public ALBReloadFinder(AlbAccessManager albAccessManager){
        this.albAccessManager = albAccessManager;
    }

    private static final Logger LOGGER = Logging.getLogger(ALBReloadFinder.class);

    /**
     * Only GET and POST methods are allowed. The returned resource will simply invoke
     * {@link AlbAccessManager#loadConfig()} and return an empty response with status 200 OK.
     */
    @Override
    public Resource findTarget(final Request request, final Response response) {

        if (!(request.getMethod() == Method.GET || request.getMethod() == Method.POST)) {
            response.setStatus(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED);
            return null;
        }
        return new Resource() {

            @Override
            public void handleGet() {
            	 handleRequest();
            }
            
            @Override
            public void handlePost() {
                handleRequest();
            }
            private void  handleRequest(){
            	if(LOGGER.isLoggable(Level.FINE)){
                    LOGGER.log(Level.FINE,"Fetching Data");
                }
                try {
                    albAccessManager.loadConfig();
                    
                    response.setStatus(Status.SUCCESS_OK);
                } catch (Exception e) {
                    if (LOGGER.isLoggable(Level.SEVERE)) {
                        LOGGER.log(Level.SEVERE, e.getMessage(), e);
                    }
                    response.setStatus(Status.CONNECTOR_ERROR_INTERNAL);
                }
            	
            }
        };
    }
}
