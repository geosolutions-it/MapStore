package it.geosolutions.security.alb;

import java.io.InputStream;

import org.geoserver.data.test.SystemTestData;
import org.geoserver.security.GeoServerRoleStore;
import org.geoserver.security.GeoServerSecurityManager;
import org.geoserver.security.GeoServerUserGroupStore;
import org.geoserver.security.impl.AbstractUserGroupService;
import org.geoserver.security.impl.GeoServerRole;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericXmlApplicationContext;
import org.springframework.security.core.GrantedAuthority;

/**
 * Class collecting static constants and utility methods to setup unit tests.
 * 
 * @author Stefano Costa
 */
public class AlbAccessManagerTestUtils {

    static final String SYSTEM_TEST_CONTEXT_LOCATION = "classpath:/it/geosolutions/security/alb/systemTestContext.xml";

    static final String TEST_CONTEXT_LOCATION = "classpath:/it/geosolutions/security/alb/testContext.xml";

    static final String INSERT_RULES_SCRIPT = "insert_usid_rules.sql";
    
    static final String USER_WITH_ACCESS = "withaccess";
    
    static final String USER_NO_ACCESS = "noaccess";
    
    static final String ROLE_WITH_ACCESS = "ROLE_ACCESS";
    
    static final String ROLE_NO_ACCESS = "ROLE_DUMMY";
    
    static final String USER_ADMIN = "admin";
    
    static final String ROLE_ADMIN = "ROLE_ADMINISTRATOR";
    
    static final String USER_ADMIN_PASSWD = "geoserver";
    
    static final GrantedAuthority ADMIN_AUTHORITY = new GrantedAuthority() {
    
        @Override
        public String getAuthority() {
            return ROLE_ADMIN;
        }
    
    };
    
    static final String LAKES_LAYER = SystemTestData.LAKES.getPrefix() + ":"
            + SystemTestData.LAKES.getLocalPart();
    
    static final String LAKE_DESCR = "Blue Lake";
    
    static final String BUILDINGS_LAYER = SystemTestData.BUILDINGS.getPrefix()
            + ":" + SystemTestData.BUILDINGS.getLocalPart();
    
    static final String BUILDING_ALLOWED_FID = "113";
    static final String BUILDING_ALLOWED_ADDRESS = "123 Main Street";

    /**
     * Creates the users {@link #USER_NO_ACCESS} and {@link #USER_NO_ACCESS}, with
     * roles {@link #ROLE_WITH_ACCESS} and {@link #ROLE_NO_ACCESS} respectively.
     * 
     * @param securityManager
     * @throws Exception
     */
    static void setUpUserRoles(GeoServerSecurityManager securityManager)
            throws Exception {
        GeoServerUserGroupStore ugStore = securityManager.loadUserGroupService(
                AbstractUserGroupService.DEFAULT_NAME).createStore();
    
        ugStore.addUser(ugStore.createUserObject(USER_WITH_ACCESS,
                USER_WITH_ACCESS, true));
        ugStore.addUser(ugStore.createUserObject(USER_NO_ACCESS, USER_NO_ACCESS,
                true));
        ugStore.store();
    
        GeoServerRoleStore roleStore = securityManager.getActiveRoleService()
                .createStore();
        GeoServerRole roleDummy = roleStore.createRoleObject(ROLE_NO_ACCESS);
        GeoServerRole roleAccess = roleStore.createRoleObject(ROLE_WITH_ACCESS);
        roleStore.addRole(roleDummy);
        roleStore.addRole(roleAccess);
        roleStore.associateRoleToUser(roleAccess, USER_WITH_ACCESS);
        roleStore.associateRoleToUser(roleDummy, USER_NO_ACCESS);
        roleStore.store();
    }

    static InputStream lookupAccessManagerConf() {
        InputStream in = AlbAccessManagerTestUtils.class
                .getResourceAsStream(AlbAccessManager.CONFIG_LOCATION);
        return in;
    }

    public static ApplicationContext loadTestContext() {
        GenericXmlApplicationContext context = new GenericXmlApplicationContext();
        context.load(TEST_CONTEXT_LOCATION);
        context.refresh();
        
        return context;
    }

}
