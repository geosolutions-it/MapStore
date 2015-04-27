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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.easymock.IAnswer;
import org.geoserver.rest.RestletTestSupport;
import org.geoserver.rest.format.ReflectiveJSONFormat;
import org.restlet.data.MediaType;
import org.restlet.data.Preference;
import org.restlet.data.Request;
import org.restlet.data.Response;
import org.restlet.data.Status;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

public class USIDListResourceTest extends RestletTestSupport {

    private static final String BASE_URL = "/usidrules";
    
    private static final String RULES_NODE = "rules";
    
    private static final String RULE_NODE = "rule";
    
    private static final String SUCCESS_PROPERTY = "success";
    
    private static final String TOTAL_PROPERTY = "totalCount";
    
    private static final String RULEID_PROPERTY = "ruleId";
    
    private static final String ROLE_PROPERTY = "role";
    
    private static final String USID_PROPERTY = "usid";
    
    private static final String ROLE_USER = "USER";
    
    private static final String ROLE_GUEST = "GUEST";
    
    private static final String USID_123 = "123";
    
    private static final String USID_456 = "456";
    
    private static final String USID_789 = "789";
    
    private static final RoleUSIDRule TEST_RULE_USER_1 = new RoleUSIDRule(
            ROLE_USER, USID_123);
    
    private static final RoleUSIDRule TEST_RULE_USER_2 = new RoleUSIDRule(
            ROLE_USER, USID_456);
    
    private static final RoleUSIDRule TEST_RULE_GUEST_1 = new RoleUSIDRule(
            ROLE_GUEST, USID_789);
    
    private static final RoleUSIDRule TEST_RULE_GUEST_2 = new RoleUSIDRule(
            ROLE_GUEST, USID_123);
    
    private static final List<RoleUSIDRule> ALL_RULES = Arrays.asList(
            TEST_RULE_USER_1, TEST_RULE_USER_2, TEST_RULE_GUEST_1,
            TEST_RULE_GUEST_2);
    
    private static final List<RoleUSIDRule> USER_RULES = Arrays.asList(
            TEST_RULE_USER_1, TEST_RULE_USER_2);
    
    private static final List<RoleUSIDRule> GUEST_RULES = Arrays.asList(
            TEST_RULE_GUEST_1, TEST_RULE_GUEST_2);
    
    private static final List<RoleUSIDRule> USID_123_RULES = Arrays.asList(
            TEST_RULE_USER_1, TEST_RULE_GUEST_2);
    
    private static final List<RoleUSIDRule> USID_456_RULES = Arrays
            .asList(TEST_RULE_USER_2);
    
    private static final List<RoleUSIDRule> USID_789_RULES = Arrays
            .asList(TEST_RULE_GUEST_1);
    
    private static final Map<String, List<RoleUSIDRule>> RULES_BY_USID = new HashMap<String, List<RoleUSIDRule>>();
    
    static {
        RULES_BY_USID.put(USID_123, USID_123_RULES);
        RULES_BY_USID.put(USID_456, USID_456_RULES);
        RULES_BY_USID.put(USID_789, USID_789_RULES);
    }
    
    private USIDService mockService;
    
    public void testUsidRulesGetAsJSON() throws Exception {
        // make results fit in a single page
        createRulesGetMock(null, null, ALL_RULES.size(), 0);
    
        Request request = newRequestGET(null, null, ALL_RULES.size(), 0, MediaType.APPLICATION_JSON);
        Response response = new Response(request);
    
        USIDListResource resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
    
        checkGetAsJSONResponse(response, ALL_RULES, ALL_RULES.size());
    
        verifyAndResetMock();
    }
    
    public void testUsidRulesGetAsXML() throws Exception {
        // make results fit in a single page
        createRulesGetMock(null, null, ALL_RULES.size(), 0);
    
        Request request = newRequestGET(null, null, ALL_RULES.size(), 0, MediaType.APPLICATION_XML);
        Response response = new Response(request);
    
        USIDListResource resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
    
        Document dom = getDOM(response);
        assertNotNull(dom);
    
        assertEquals(RULES_NODE, dom.getDocumentElement().getNodeName());
        assertXpathEvaluatesTo("true", RULES_NODE + "/" + SUCCESS_PROPERTY, dom);
        assertXpathEvaluatesTo(Integer.toString(ALL_RULES.size()), RULES_NODE + "/"
                + TOTAL_PROPERTY, dom);
    
        NodeList ruleNodes = dom.getDocumentElement().getElementsByTagName("rule");
        assertEquals(ALL_RULES.size(), ruleNodes.getLength());
    
        String prefix = RULES_NODE + "/" + RULE_NODE;
        int i = 0;
        for (RoleUSIDRule rule : ALL_RULES) {
            String sqBracketExpr = "[" + (i + 1) + "]";
            String ruleSelector = prefix + sqBracketExpr;
            assertXpathEvaluatesTo(rule.getRuleId(), ruleSelector + "/"
                    + RULEID_PROPERTY, dom);
            assertXpathEvaluatesTo(rule.getRole(), ruleSelector + "/"
                    + ROLE_PROPERTY, dom);
            assertXpathEvaluatesTo(rule.getUsid(), ruleSelector + "/"
                    + USID_PROPERTY, dom);
            i++;
        }
    
        verifyAndResetMock();
    }
    
    public void testPagination() throws Exception {
        final int pageSize = 2, firstPageOffset = 0, secondPageOffset = pageSize;
        
        /*** request first page ***/
        
        createRulesGetMock(null, null, pageSize, firstPageOffset);
        
        Request request = newRequestGET(null, null, pageSize, firstPageOffset, MediaType.APPLICATION_JSON);
        Response response = new Response(request);
        
        USIDListResource resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
        
        checkGetAsJSONResponse(response, ALL_RULES.subList(0, pageSize), ALL_RULES.size());
        
        verifyAndResetMock();
        
        /*** first page OK ***/
        
        /*** request second page ***/
        
        createRulesGetMock(null, null, pageSize, secondPageOffset);
        request = newRequestGET(null, null, pageSize, secondPageOffset, MediaType.APPLICATION_JSON);
        response = new Response(request);
        
        resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
        
        checkGetAsJSONResponse(response, ALL_RULES.subList(pageSize, ALL_RULES.size()), ALL_RULES.size());
        
        verifyAndResetMock();
        
        /*** second page OK ***/
    }
    
    public void testRoleFilter() throws Exception {
        final String ROLE_FILTER = ROLE_USER;
        
        // no pagination
        createRulesGetMock(ROLE_FILTER, null, ALL_RULES.size(), 0);
        
        Request request = newRequestGET(ROLE_FILTER, null, ALL_RULES.size(), 0, MediaType.APPLICATION_JSON);
        Response response = new Response(request);
        
        USIDListResource resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
        
        checkGetAsJSONResponse(response, USER_RULES, USER_RULES.size());
        
        verifyAndResetMock();
    }
    
    public void testUsidFilter() throws Exception {
        final String USID_FILTER = USID_123;
        
        // no pagination
        createRulesGetMock(null, USID_FILTER, ALL_RULES.size(), 0);
        
        Request request = newRequestGET(null, USID_FILTER, ALL_RULES.size(), 0, MediaType.APPLICATION_JSON);
        Response response = new Response(request);
        
        USIDListResource resource = new USIDListResource(null, request, response,
                mockService);
        resource.handleGet();
        
        List<RoleUSIDRule> ruleList = RULES_BY_USID.get(USID_FILTER);
        checkGetAsJSONResponse(response, ruleList, ruleList.size());
        
        verifyAndResetMock();
    }
    
    public void testUsidRulesPostAsJson() throws Exception {
        final RoleUSIDRule TEST_RULE = TEST_RULE_USER_1;
        
        createRulesPostMock(TEST_RULE.getRole(), TEST_RULE.getUsid());
        
        ReflectiveJSONFormat jsonFormat = new ReflectiveJSONFormat();
        jsonFormat.getXStream().alias("rule", RoleUSIDRule.class);
        
        String postEntity = jsonFormat.toRepresentation(TEST_RULE).getText();
        
        Request request = newRequestPOST(BASE_URL, postEntity, MediaType.APPLICATION_JSON.getName());
        Response response = new Response(request);
        
        USIDListResource resource = new USIDListResource(null, request, response, mockService);
        resource.handlePost();
        
        assertEquals(Status.SUCCESS_CREATED, response.getStatus());
        assertEquals(response.getRedirectRef().getLastSegment(), TEST_RULE.getRuleId());
        
        verifyAndResetMock();
    }
    
    private void createRulesGetMock(final String queryRole, final String queryUsid,
            final int pageSize, final int offset) throws IOException {
        mockService = createMock(USIDService.class);
    
        if (queryRole != null && !queryRole.isEmpty()) {
            // filter by role
            expect(mockService.getUsidForRole(queryRole, pageSize, offset)).andAnswer(
                    new IAnswer<Collection<Object>>() {
    
                        @Override
                        public Collection<Object> answer() throws Throwable {
                            List<RoleUSIDRule> rulesList = (queryRole
                                    .equals(ROLE_USER)) ? USER_RULES : GUEST_RULES;
                            List<Object> usidList = new ArrayList<Object>();
                            int i = 0;
                            for (RoleUSIDRule rule : rulesList) {
                                if (i >= offset && usidList.size() < pageSize) {
                                    usidList.add(rule.getUsid());
                                }
                                i++;
                                if (usidList.size() == pageSize) {
                                    break;
                                }
                            }
                            return usidList;
                        }
    
                    });
            expect(mockService.countUsidForRole(queryRole)).andAnswer(
                    new IAnswer<Integer>() {
                        @Override
                        public Integer answer() throws Throwable {
                            List<RoleUSIDRule> rulesList = (queryRole
                                    .equals(ROLE_USER)) ? USER_RULES : GUEST_RULES;
                            return rulesList.size();
                        }
                    });
        } else if (queryUsid != null && !queryUsid.isEmpty()) {
            // filter by usid
            expect(mockService.getRolesForUsid(queryUsid, pageSize, offset)).andAnswer(
                    new IAnswer<Collection<String>>() {
    
                        @Override
                        public Collection<String> answer() throws Throwable {
                            List<RoleUSIDRule> rulesList = RULES_BY_USID
                                    .get(queryUsid);
                            List<String> roleList = new ArrayList<String>();
                            int i = 0;
                            for (RoleUSIDRule rule : rulesList) {
                                if (i >= offset && roleList.size() < pageSize) {
                                    roleList.add(rule.getRole());
                                }
                                i++;
                                if (roleList.size() == pageSize) {
                                    break;
                                }
                            }
                            return roleList;
                        }
    
                    });
            expect(mockService.countRolesForUsid(queryUsid)).andAnswer(
                    new IAnswer<Integer>() {
                        @Override
                        public Integer answer() throws Throwable {
                            List<RoleUSIDRule> rulesList = RULES_BY_USID
                                    .get(queryUsid);
                            return rulesList.size();
                        }
                    });
        } else {
            // no filters
            expect(mockService.getAllRecords(pageSize, offset)).andAnswer(
                    new IAnswer<Collection<RoleUSIDRule>>() {
                        @Override
                        public Collection<RoleUSIDRule> answer() throws Throwable {
                            List<RoleUSIDRule> resultList = new ArrayList<RoleUSIDRule>();
                            int i = 0;
                            for (RoleUSIDRule rule : ALL_RULES) {
                                if (i >= offset && resultList.size() < pageSize) {
                                    resultList.add(rule);
                                }
                                i++;
                                if (resultList.size() == pageSize) {
                                    break;
                                }
                            }
                            return resultList;
                        }
                    });
            expect(mockService.countAll()).andAnswer(new IAnswer<Integer>() {
                @Override
                public Integer answer() throws Throwable {
                    return ALL_RULES.size();
                }
            });
        }
        
        replay(mockService);
    }
    
    private Request newRequestGET(String queryRole, String queryUsid, int pageSize, int offset, MediaType type) {
        StringBuilder queryStringBuilder = new StringBuilder("?");
        if (queryRole != null && !queryRole.isEmpty()) {
            queryStringBuilder.append("role=");
            queryStringBuilder.append(queryRole);
            queryStringBuilder.append("&");
        }
        if (queryUsid != null && !queryUsid.isEmpty()) {
            queryStringBuilder.append("usid=");
            queryStringBuilder.append(queryUsid);
            queryStringBuilder.append("&");
        }
        if (pageSize > 0) {
            queryStringBuilder.append("limit=");
            queryStringBuilder.append(pageSize);
            queryStringBuilder.append("&");
        }
        if (offset > 0) {
            queryStringBuilder.append("start=");
            queryStringBuilder.append(offset);
            queryStringBuilder.append("&");
        }
        
        Request request = newRequestGET(BASE_URL + queryStringBuilder.toString());
        request.getClientInfo().getAcceptedMediaTypes()
                .add(new Preference<MediaType>(type));
        
        return request;
    }
    
    private void checkGetAsJSONResponse(Response response, List<RoleUSIDRule> expectedRules, int expectedTotal) throws Exception {
        JSON json = getJSON(response);
        
        JSONArray rulesAsJSON = ((JSONObject) json).getJSONArray(RULES_NODE);
        assertNotNull(rulesAsJSON);
    
        boolean success = ((JSONObject) json).getBoolean(SUCCESS_PROPERTY);
        assertTrue(success);
    
        int totalCount = ((JSONObject) json).getInt(TOTAL_PROPERTY);
        assertEquals(expectedTotal, totalCount);
    
        int i = 0;
        for (RoleUSIDRule rule : expectedRules) {
            JSONObject ruleAsJSON = rulesAsJSON.getJSONObject(i);
            assertEquals(rule.getRuleId(), ruleAsJSON.get(RULEID_PROPERTY));
            assertEquals(rule.getRole(), ruleAsJSON.getString(ROLE_PROPERTY));
            assertEquals(rule.getUsid(), ruleAsJSON.getString(USID_PROPERTY));
            i++;
        }
    }
    
    private void createRulesPostMock(String role, String usid) throws IOException {
        mockService = createMock(USIDService.class);
        
        expect(mockService.addUsidForRole(role, usid))
            .andReturn(true);
        replay(mockService);
    }
    
    private void verifyAndResetMock() {
        verify(mockService);
        reset(mockService);
    }

}
