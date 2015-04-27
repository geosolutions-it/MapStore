package it.geosolutions.npa.rest;

import static org.custommonkey.xmlunit.XMLAssert.assertXpathEvaluatesTo;
import static org.easymock.EasyMock.createMock;
import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.replay;
import static org.easymock.EasyMock.reset;
import static org.easymock.EasyMock.verify;
import it.geosolutions.npa.model.RoleUSIDRule;
import it.geosolutions.npa.service.USIDService;

import java.io.IOException;

import net.sf.json.JSON;
import net.sf.json.JSONObject;

import org.geoserver.rest.RestletTestSupport;
import org.restlet.data.MediaType;
import org.restlet.data.Method;
import org.restlet.data.Preference;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.w3c.dom.Document;

public class USIDResourceTest extends RestletTestSupport {

    private static final RoleUSIDRule TEST_RULE = new RoleUSIDRule("TESTROLE",
            "1234");
    
    private static final String BASE_URL = "/usidrules/";
    
    private static final String ROOT_NODE = "rule";
    
    private static final String RULEID_PROPERTY = "ruleId";
    
    private static final String ROLE_PROPERTY = "role";
    
    private static final String USID_PROPERTY = "usid";
    
    private static final String SUCCESS_PROPERTY = "success";
    
    private USIDService mockService;
    
    public void testUsidRuleGetAsJSON() throws Exception {
    
        createRuleGetMock();
    
        Request request = newRequestGET(BASE_URL + TEST_RULE.getRuleId());
        request.getAttributes()
                .put(USIDResource.RULEID_ATTR, TEST_RULE.getRuleId());
        request.getClientInfo().getAcceptedMediaTypes()
                .add(new Preference<MediaType>(MediaType.APPLICATION_JSON));
        Response response = new Response(request);
    
        USIDResource resource = new USIDResource(null, request, response,
                mockService);
        resource.handleGet();
    
        JSON json = getJSON(response);
    
        JSONObject ruleAsJSON = ((JSONObject) json).getJSONObject(ROOT_NODE);
        assertNotNull(ruleAsJSON);
    
        assertEquals(TEST_RULE.getRuleId(), ruleAsJSON.get(RULEID_PROPERTY));
        assertEquals(TEST_RULE.getRole(), ruleAsJSON.getString(ROLE_PROPERTY));
        assertEquals(TEST_RULE.getUsid(), ruleAsJSON.getString(USID_PROPERTY));
    
        verifyAndResetMock();
    }
    
    public void testUsidRuleGetAsXML() throws Exception {
    
        createRuleGetMock();
    
        Request request = newRequestGET(BASE_URL + TEST_RULE.getRuleId());
        request.getAttributes()
                .put(USIDResource.RULEID_ATTR, TEST_RULE.getRuleId());
        request.getClientInfo().getAcceptedMediaTypes()
                .add(new Preference<MediaType>(MediaType.APPLICATION_XML));
        Response response = new Response(request);
    
        USIDResource resource = new USIDResource(null, request, response,
                mockService);
        resource.handleGet();
    
        Document dom = getDOM(response);
        assertNotNull(dom);
    
        assertEquals(ROOT_NODE, dom.getDocumentElement().getNodeName());
        assertXpathEvaluatesTo(TEST_RULE.getRuleId(), "//" + RULEID_PROPERTY, dom);
        assertXpathEvaluatesTo(TEST_RULE.getRole(), "//" + ROLE_PROPERTY, dom);
        assertXpathEvaluatesTo(TEST_RULE.getUsid(), "//" + USID_PROPERTY, dom);
    
        verifyAndResetMock();
    }
    
    public void testExtJSCompatibleDelete() throws Exception {
        mockService = createMock(USIDService.class);
        expect(
                mockService.deleteUsidForRole(TEST_RULE.getRole(),
                        TEST_RULE.getUsid())).andReturn(true);
        replay(mockService);
        
        Request request = newRequestGET(BASE_URL + TEST_RULE.getRuleId());
        request.setMethod(Method.DELETE);
        request.getAttributes()
            .put(USIDResource.RULEID_ATTR, TEST_RULE.getRuleId());
        request.getClientInfo().getAcceptedMediaTypes()
            .add(new Preference<MediaType>(MediaType.APPLICATION_JSON));
        Response response = new Response(request);
        
        USIDResource resource = new USIDResource(null, request, response,
                mockService);
        resource.handleDelete();
        
        JSON json = getJSON(response);
        
        boolean success = ((JSONObject) json).getBoolean(SUCCESS_PROPERTY);
        assertTrue(success);
        
        verifyAndResetMock();
    }
    
    private void createRuleGetMock() throws IOException {
        mockService = createMock(USIDService.class);
        expect(
                mockService.getSingleRecord(TEST_RULE.getRole(),
                        TEST_RULE.getUsid())).andReturn(TEST_RULE);
        replay(mockService);
    }
    
    private void verifyAndResetMock() {
        verify(mockService);
        reset(mockService);
    }

}
