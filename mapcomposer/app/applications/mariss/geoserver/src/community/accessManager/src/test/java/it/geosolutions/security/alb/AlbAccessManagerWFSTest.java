package it.geosolutions.security.alb;

import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.ADMIN_AUTHORITY;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.BUILDINGS_LAYER;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.BUILDING_ALLOWED_ADDRESS;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.BUILDING_ALLOWED_FID;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.INSERT_RULES_SCRIPT;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.LAKES_LAYER;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.LAKE_DESCR;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_ADMIN;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_ADMIN_PASSWD;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_NO_ACCESS;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_WITH_ACCESS;
import static junit.framework.Assert.assertTrue;
import static org.custommonkey.xmlunit.XMLAssert.assertXpathEvaluatesTo;
import it.geosolutions.npa.service.impl.JDBCUSIDService;
import it.geosolutions.npa.service.impl.DaoTestUtils;

import java.util.Collections;
import java.util.List;

import javax.servlet.Filter;
import javax.sql.DataSource;

import org.custommonkey.xmlunit.XMLUnit;
import org.custommonkey.xmlunit.XpathEngine;
import org.geoserver.data.test.CiteTestData;
import org.geoserver.data.test.SystemTestData;
import org.geoserver.platform.GeoServerExtensions;
import org.geoserver.wfs.WFSTestSupport;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.w3c.dom.Document;

public class AlbAccessManagerWFSTest extends WFSTestSupport {

    static final String INSERT_RESTRICTED_STREET = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\"\n"
        + "  xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:cite=\"http://www.opengis.net/cite\"\n"
        + "  xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n"
        + "  xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=cite:Buildings\">\n"
        + "  <wfs:Insert>\n"
        + "    <cite:Buildings fid=\"Buildings.151\">\n"
        + "      <cite:the_geom>\n"
        + "        <gml:MultiPolygon srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">\n"
        + "          <gml:polygonMember>\n"
        + "            <gml:Polygon>\n"
        + "              <gml:outerBoundaryIs>\n"
        + "                <gml:LinearRing>\n"
        + "                  <gml:coordinates cs=\",\" decimal=\".\"\n"
        + "                    ts=\" \" xmlns:gml=\"http://www.opengis.net/gml\">0.0020,0.0008 0.0020,0.0010\n"
        + "                    0.0024,0.0010 0.0024,0.0008 0.0020,0.0008</gml:coordinates>\n"
        + "                </gml:LinearRing>\n"
        + "              </gml:outerBoundaryIs>\n"
        + "            </gml:Polygon>\n"
        + "          </gml:polygonMember>\n"
        + "        </gml:MultiPolygon>\n"
        + "      </cite:the_geom>\n"
        + "      <cite:FID>151</cite:FID>\n"
        + "      <cite:ADDRESS>151 Restricted Street</cite:ADDRESS>\n"
        + "    </cite:Buildings>\n" + "  </wfs:Insert>\n" + "</wfs:Transaction>";

    static final String BUILDING_UPDATED_ADDRESS = "123 ABC Street";

    static final String UPDATE_ADDRESS = "<wfs:Transaction service=\"WFS\" version=\"1.1.0\"\n" + 
        "  xmlns:cite=\"http://www.opengis.net/cite\"\n" + 
        "  xmlns:ogc=\"http://www.opengis.net/ogc\"\n" + 
        "  xmlns:wfs=\"http://www.opengis.net/wfs\">\n" + 
        "  <wfs:Update typeName=\"cite:Buildings\">\n" + 
        "    <wfs:Property>\n" + 
        "      <wfs:Name>ADDRESS</wfs:Name>\n" + 
        "      <wfs:Value>" + BUILDING_UPDATED_ADDRESS + "</wfs:Value>\n" + 
        "    </wfs:Property>\n" +
        "    <ogc:Filter>\n" +
        "      <ogc:PropertyIsEqualTo>\n" +
        "        <ogc:PropertyName>FID</ogc:PropertyName>\n" +
        "        <ogc:Literal>" + BUILDING_ALLOWED_FID + "</ogc:Literal>\n" +
        "      </ogc:PropertyIsEqualTo>\n" +
        "    </ogc:Filter>\n" +
        "  </wfs:Update>\n" + 
        "</wfs:Transaction>";

    static final String DELETE_ADDRESS = "<wfs:Transaction service=\"WFS\" version=\"1.1.0\"\n" + 
        "  xmlns:cite=\"http://www.opengis.net/cite\"\n" + 
        "  xmlns:ogc=\"http://www.opengis.net/ogc\"\n" + 
        "  xmlns:wfs=\"http://www.opengis.net/wfs\"" +
        "  xmlns:gml=\"http://www.opengis.net/gml\">\n" + 
        "  <wfs:Delete typeName=\"cite:Buildings\">" +
        "  <ogc:Filter>\n" + 
        "    <ogc:BBOX>\n" + 
        "        <ogc:PropertyName>the_geom</ogc:PropertyName>\n" + 
        "        <gml:Envelope srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">\n" + 
        "           <gml:lowerCorner>0.0008 0.0005</gml:lowerCorner>\n" + 
        "           <gml:upperCorner>0.0012 0.0007</gml:upperCorner>\n" + 
        "        </gml:Envelope>\n" + 
        "      </ogc:BBOX>\n" +
        "  </ogc:Filter>\n" +
        "  </wfs:Delete>\n" + 
        "</wfs:Transaction>";

    static final String GET_FEATURE_BASE = "wfs?request=GetFeature&version=1.0.0&service=wfs";
    static final String GET_FEATURE_LAKES = GET_FEATURE_BASE + "&typeName=" + LAKES_LAYER;
    static final String GET_FEATURE_BUILDINGS = GET_FEATURE_BASE + "&typeName=" + BUILDINGS_LAYER;

    private DataSource testDataSource;

    @Before
    public void revert() throws Exception {
        // temporarily grant admin rights
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(USER_ADMIN, USER_ADMIN_PASSWD, 
                        Collections.singletonList(ADMIN_AUTHORITY)));

        revertLayer(CiteTestData.BUILDINGS);

        // invalidate authentication token
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Override
    protected List<Filter> getFilters() {
        return Collections.singletonList((javax.servlet.Filter) GeoServerExtensions
                .bean("filterChainProxy"));
    }
    
    @Override
    protected void setUpTestData(SystemTestData testData) throws Exception {
        super.setUpTestData(testData);
    
        // copy AlbAccessManager's configuration to data directory
        testData.copyTo(AlbAccessManagerTestUtils.lookupAccessManagerConf(),
                AlbAccessManager.CONFIG_LOCATION);
    }
    
    @Override
    protected void setUpSpring(List<String> springContextLocations) {
        super.setUpSpring(springContextLocations);
        springContextLocations
                .add(AlbAccessManagerTestUtils.SYSTEM_TEST_CONTEXT_LOCATION);
    }
    
    @Override
    protected void onSetUp(SystemTestData testData) throws Exception {
        super.onSetUp(testData);
    
        testDataSource = DaoTestUtils.setUpTestDataSource(applicationContext
                .getBean(JDBCUSIDService.class));
        DaoTestUtils.runScript(testDataSource, INSERT_RULES_SCRIPT);
    
        AlbAccessManagerTestUtils.setUpUserRoles(getSecurityManager());
    
        prepare();
    }
    
    public void prepare() throws Exception {
        // nothing to do... for now
    }

    @Test
    public void testNoRestrictions() throws Exception {
       // no limits, should see all of the attributes and rows
       setRequestAuth(USER_NO_ACCESS, USER_NO_ACCESS);
       Document doc = getAsDOM(GET_FEATURE_LAKES);
       
       print(doc);
       
       assertXpathEvaluatesTo("1", String.format("count(//%s)", LAKES_LAYER), doc);
       assertXpathEvaluatesTo("1", "count(//cite:NAME)", doc);
       assertXpathEvaluatesTo(LAKE_DESCR, "//cite:NAME", doc);
    }

    @Test
    public void testReadFilter() throws Exception {
        // should only see one feature and all attributes
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        Document doc = getAsDOM(GET_FEATURE_BUILDINGS);
        
        print(doc);
        
        assertXpathEvaluatesTo("1", String.format("count(//%s)", BUILDINGS_LAYER), doc);
        assertXpathEvaluatesTo(BUILDING_ALLOWED_FID, "//cite:FID", doc);
        assertXpathEvaluatesTo("1", "count(//cite:ADDRESS)", doc);
        assertXpathEvaluatesTo(BUILDING_ALLOWED_ADDRESS, "//cite:ADDRESS", doc);
    }

    @Test
    public void testReadAdmin() throws Exception {
        // should see two features and all attributes
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document doc = getAsDOM(GET_FEATURE_BUILDINGS);
        
        print(doc);
        
        assertXpathEvaluatesTo("2", String.format("count(//%s)", BUILDINGS_LAYER), doc);
        assertXpathEvaluatesTo("2", "count(//cite:ADDRESS)", doc);
    }

    @Test
    public void testInsertForbidden() throws Exception {
        // request should fail, only admin has write access
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        Document dom = postAsDOM("wfs", INSERT_RESTRICTED_STREET);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "count(//ogc:ServiceExceptionReport)", dom);
        assertXpathEvaluatesTo("1", "count(//ogc:ServiceExceptionReport/ogc:ServiceException)", dom);
        XpathEngine xpath = XMLUnit.newXpathEngine();
        String message = xpath.evaluate("//ogc:ServiceException", dom);
        assertTrue(message.trim().matches(".*is read-only.*"));
    }

    @Test
    public void testInsertAdmin() throws Exception {
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document dom = postAsDOM("wfs", INSERT_RESTRICTED_STREET);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "count(//wfs:WFS_TransactionResponse)", dom);
        assertXpathEvaluatesTo("1", "count(//ogc:FeatureId)", dom);
        assertXpathEvaluatesTo("new0", "//ogc:FeatureId/@fid", dom);
        assertXpathEvaluatesTo("1", "count(//wfs:Status/wfs:SUCCESS)", dom);
    }

    @Test
    public void testUpdateForbidden() throws Exception {
        // request should fail, only admin has write access
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        Document dom = postAsDOM("wfs", UPDATE_ADDRESS);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "count(//ows:ExceptionReport)", dom);
        XpathEngine xpath = XMLUnit.newXpathEngine();
        String message = xpath.evaluate("//ows:ExceptionText", dom);
        assertTrue(message.matches(".*is read-only.*"));
    }
    
    @Test
    public void testUpdateAdmin() throws Exception {
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document dom = postAsDOM("wfs", UPDATE_ADDRESS);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "//wfs:totalUpdated", dom);
        
        // double check
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document doc = getAsDOM(GET_FEATURE_BUILDINGS);
        
        print(doc);
        
        // check this one has been updated
        assertXpathEvaluatesTo(BUILDING_UPDATED_ADDRESS,
                "//cite:Buildings[cite:FID = '" + BUILDING_ALLOWED_FID + "']/cite:ADDRESS",
                doc);
        // but the other did not
        assertXpathEvaluatesTo("215 Main Street",
                "//cite:Buildings[cite:FID = '114']/cite:ADDRESS", doc);
    }

    @Test
    public void testDeleteForbidden() throws Exception {
        // request should fail, only admin has write access
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        Document dom = postAsDOM("wfs", DELETE_ADDRESS);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "count(//ows:ExceptionReport)", dom);
        XpathEngine xpath = XMLUnit.newXpathEngine();
        String message = xpath.evaluate("//ows:ExceptionText", dom);
        assertTrue(message.matches(".*is read-only.*"));
    }

    @Test
    public void testDeleteAdmin() throws Exception {
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document dom = postAsDOM("wfs", DELETE_ADDRESS);
        
        print(dom);
        
        assertXpathEvaluatesTo("1", "//wfs:totalDeleted", dom);
        
        // double check
        setRequestAuth(USER_ADMIN, USER_ADMIN_PASSWD);
        Document doc = getAsDOM(GET_FEATURE_BUILDINGS);
        
        print(doc);
        
        // check this one has been deleted
        assertXpathEvaluatesTo("0", "count(//cite:Buildings[cite:FID = '" + BUILDING_ALLOWED_FID + "'])", doc);
        // but the other did not
        assertXpathEvaluatesTo("1", "count(//cite:Buildings[cite:FID = '114'])", doc);
    }

}
