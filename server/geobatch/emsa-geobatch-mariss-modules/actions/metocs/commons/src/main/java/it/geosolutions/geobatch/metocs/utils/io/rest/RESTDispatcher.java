package it.geosolutions.geobatch.metocs.utils.io.rest;

import java.util.HashMap;
import java.util.Map;

import org.restlet.Restlet;
//import org.restlet.Router;

/**
 * 
 * @author Fabiani
 * 
 */
public class RESTDispatcher {
    private Map<String, Restlet> resourceMappings = new HashMap<String, Restlet>();

//    public void init(Router router) {
//        for (String key : resourceMappings.keySet()) {
//            router.attach(key, resourceMappings.get(key));
//        }
//    }
//
//    public void setResourceMappings(HashMap<String, Restlet> resourceMappings) {
//        this.resourceMappings = resourceMappings;
//    }

}
