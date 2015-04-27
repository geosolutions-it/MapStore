package it.geosolutions.security.alb;

import it.geosolutions.security.alb.rest.ALBReloadFinder;

import org.geoserver.rest.RestletTestSupport;
import org.junit.Test;
import org.restlet.data.Method;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.restlet.resource.Resource;
import org.springframework.context.ApplicationContext;

public class ALBReloadFinderTest extends RestletTestSupport {

    static final String BASE_URL = "/alb/reload";

    protected ApplicationContext context;
    
    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        context = AlbAccessManagerTestUtils.loadTestContext();
    }

    @Test
    public void testReloadGet() {
        AlbAccessManager alb = context.getBean(AlbAccessManager.class);

        // fill up alb cache
        fillEmptyCache(alb);

        Request request = newRequestGET(BASE_URL);
        Response response = new Response(request);
        Resource reloadResource = findResource(alb, request, response);
        assertNotNull(reloadResource);

        reloadResource.handleGet();

        assertEquals(Status.SUCCESS_OK, response.getStatus());
        // cache should be empty
        assertEquals(0, alb.getCacheSize());
    }

    @Test
    public void testReloadPost() {
        AlbAccessManager alb = context.getBean(AlbAccessManager.class);

        // fill up alb cache
        fillEmptyCache(alb);

        Request request = newRequestPOST(BASE_URL, "", "text/plain");
        Response response = new Response(request);
        Resource reloadResource = findResource(alb, request, response);
        assertNotNull(reloadResource);

        reloadResource.handlePost();

        assertEquals(Status.SUCCESS_OK, response.getStatus());
        // cache should be empty
        assertEquals(0, alb.getCacheSize());
    }
    
    public void testReloadMethodNotAllowed() {
        AlbAccessManager alb = context.getBean(AlbAccessManager.class);
        
        // PUT not allowed
        Request request = newRequestPUT(BASE_URL, "", "text/plain");
        Response response = new Response(request);
        Resource reloadResource = findResource(alb, request, response);
        
        assertNull(reloadResource);
        assertEquals(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED, response.getStatus());
        
        // DELETE not allowed
        request = newRequestGET(BASE_URL);
        request.setMethod(Method.DELETE);
        response = new Response(request);
        reloadResource = findResource(alb, request, response);
        
        assertNull(reloadResource);
        assertEquals(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED, response.getStatus());
    }

    private void fillEmptyCache(AlbAccessManager alb) {
        assertEquals(0, alb.getCacheSize()); // initially empty
        alb.getDefaultAccessLimitBuilder();
        alb.getAccessLimitBuilder("cite", "Lakes");
        assertEquals(2, alb.getCacheSize());
    }

    private Resource findResource(AlbAccessManager alb, Request request, Response response) {
        ALBReloadFinder finder = new ALBReloadFinder(alb);
        Resource resource = finder.findTarget(request, response);
        
        return resource;
    }

}
