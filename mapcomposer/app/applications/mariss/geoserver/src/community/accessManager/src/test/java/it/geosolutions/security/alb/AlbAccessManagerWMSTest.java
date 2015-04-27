package it.geosolutions.security.alb;

import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.ADMIN_AUTHORITY;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.BUILDINGS_LAYER;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.BUILDING_ALLOWED_ADDRESS;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.INSERT_RULES_SCRIPT;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.LAKES_LAYER;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.LAKE_DESCR;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_ADMIN;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_ADMIN_PASSWD;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_NO_ACCESS;
import static it.geosolutions.security.alb.AlbAccessManagerTestUtils.USER_WITH_ACCESS;
import static org.custommonkey.xmlunit.XMLAssert.assertXpathEvaluatesTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import it.geosolutions.npa.service.impl.DaoTestUtils;
import it.geosolutions.npa.service.impl.JDBCUSIDService;

import java.awt.image.BufferedImage;
import java.util.Collections;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.Filter;
import javax.sql.DataSource;

import org.geoserver.catalog.Catalog;
import org.geoserver.catalog.LayerInfo;
import org.geoserver.catalog.StyleInfo;
import org.geoserver.data.test.SystemTestData;
import org.geoserver.platform.GeoServerExtensions;
import org.geoserver.wms.WMSTestSupport;
import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.w3c.dom.Document;

import com.mockrunner.mock.web.MockHttpServletResponse;

public class AlbAccessManagerWMSTest extends WMSTestSupport {   

    static final String BASE_LAKES = "wms?" + //
        "SERVICE=WMS&VERSION=1.1.1" + //
        "&HEIGHT=348&WIDTH=512" + //
        "&LAYERS=" + LAKES_LAYER + //
        "&STYLES=" + //
        "&FORMAT=image%2Fpng" + //
        "&SRS=EPSG%3A4326" + //
        "&BBOX=6.0E-4,-0.0018,0.0031,-1.0E-4";
    
    static final String BASE_BUILDINGS = "wms?" + //
        "SERVICE=WMS&VERSION=1.1.1" + //
        "&HEIGHT=330&WIDTH=1056" + //
        "&LAYERS=" + BUILDINGS_LAYER + //
        "&STYLES=" + //
        "&FORMAT=image%2Fpng" + //
        "&SRS=EPSG%3A4326" + //
        "&BBOX=8.0E-4,5.0E-4,0.0024,0.001";
    
    static final String BASE_LAKES_GET_FEATURE_INFO = BASE_LAKES + // 
        "&REQUEST=GetFeatureInfo" + //
        "&QUERY_LAYERS=" + LAKES_LAYER + //
        "&INFO_FORMAT=text/plain";
    static final String LAKE_COORDS = "&X=212&Y=202";
    
    static final String BASE_BUILDINGS_GET_FEATURE_INFO = BASE_BUILDINGS + // 
        "&REQUEST=GetFeatureInfo" + //
        "&QUERY_LAYERS=" + BUILDINGS_LAYER + //
        "&INFO_FORMAT=text/plain";
    static final String BUILDING_ALLOWED_COORDS = "&X=134&Y=265";
    static final String BUILDING_ALLOWED_DESCR = "ADDRESS = " + BUILDING_ALLOWED_ADDRESS;
    static final String BUILDING_FORBIDDEN_COORDS = "&X=914&Y=64";
    
    static final String GET_MAP_BUILDINGS = BASE_BUILDINGS + "&REQUEST=GetMap";
    static final String GET_MAP_LAKES = BASE_LAKES + "&REQUEST=GetMap";

    private DataSource testDataSource;
    
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
        springContextLocations.add(AlbAccessManagerTestUtils.SYSTEM_TEST_CONTEXT_LOCATION);
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

        Catalog catalog = getCatalog();
        
        // change default style for buildings layer, to allow tests to check the color
        // of pixels inside the buildings
        
        // temporarily grant admin rights
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(USER_ADMIN, USER_ADMIN_PASSWD, 
                        Collections.singletonList(ADMIN_AUTHORITY)));

        LayerInfo buildingsLayerInfo = catalog.getLayerByName(getLayerId(SystemTestData.BUILDINGS));
        StyleInfo polygonStyleInfo = catalog.getStyleByName("polygon");
        buildingsLayerInfo.setDefaultStyle(polygonStyleInfo);
        catalog.save(buildingsLayerInfo);
        
        // invalidate authentication token
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Test
    public void testGetMapNoRestrictions() throws Exception {
        setRequestAuth(USER_NO_ACCESS, USER_NO_ACCESS);
        MockHttpServletResponse response = getAsServletResponse(GET_MAP_LAKES);

        assertEquals("image/png", response.getContentType());
        BufferedImage image = ImageIO.read(getBinaryInputStream(response));
        assertNotNull(image);
        assertNotBlank("testNoRestrictions", image);

        // check the colors of some pixels to ensure there has been no filtering
        int[] pixel = new int[4];
        image.getData().getPixel(212, 202, pixel);
        assertEquals(64, pixel[0]);
        assertEquals(64, pixel[1]);
        assertEquals(192, pixel[2]);
    }

    @Test
    public void testGetMapFiltered() throws Exception {
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        MockHttpServletResponse response = getAsServletResponse(GET_MAP_BUILDINGS);

        assertEquals("image/png", response.getContentType());
        BufferedImage image = ImageIO.read(getBinaryInputStream(response));
        assertNotNull(image);
        assertNotBlank("testGetMapFiltered", image);
        
        // check the colors of some pixels to ensure there has been no filtering
        int[] pixel = new int[4];
        image.getData().getPixel(134, 265, pixel);
        assertEquals(170, pixel[0]);
        assertEquals(170, pixel[1]);
        assertEquals(170, pixel[2]);
        // this should be colored with the background color (white)
        image.getData().getPixel(914, 64, pixel);
        assertEquals(255, pixel[0]);
        assertEquals(255, pixel[1]);
        assertEquals(255, pixel[2]);
    }

    @Test
    public void testGetMapForbidden() throws Exception {
        setRequestAuth(USER_NO_ACCESS, USER_NO_ACCESS);
        MockHttpServletResponse response = getAsServletResponse(GET_MAP_BUILDINGS);

        assertEquals("application/vnd.ogc.se_xml", response.getContentType());

        Document dom = dom(getBinaryInputStream(response));
        assertXpathEvaluatesTo("LayerNotDefined", "//ServiceException/@code", dom);
    }

    @Test
    public void testGetFeatureInfoNoRestrictions() throws Exception {
        setRequestAuth(USER_NO_ACCESS, USER_NO_ACCESS);
        
        String lake = getAsString(BASE_LAKES_GET_FEATURE_INFO + LAKE_COORDS);
        assertTrue(lake.contains(LAKE_DESCR));
    }

    @Test
    public void testGetFeatureInfoFiltered() throws Exception {
        setRequestAuth(USER_WITH_ACCESS, USER_WITH_ACCESS);
        
        String allowedBuilding = getAsString(BASE_BUILDINGS_GET_FEATURE_INFO + BUILDING_ALLOWED_COORDS);
        assertTrue(allowedBuilding.contains(BUILDING_ALLOWED_DESCR));
        
        String forbiddenBuilding = getAsString(BASE_BUILDINGS_GET_FEATURE_INFO + BUILDING_FORBIDDEN_COORDS);
        assertTrue(forbiddenBuilding.contains("no features were found"));
    }

    @Test
    public void testGetFeatureInfoForbiddenLayer() throws Exception {
        setRequestAuth(USER_NO_ACCESS, USER_NO_ACCESS);
        
        MockHttpServletResponse response = getAsServletResponse(BASE_BUILDINGS_GET_FEATURE_INFO + BUILDING_ALLOWED_COORDS);
        assertEquals("application/vnd.ogc.se_xml", response.getContentType());

        Document dom = dom(getBinaryInputStream(response));
        assertXpathEvaluatesTo("LayerNotDefined", "//ServiceException/@code", dom);
    }

}
