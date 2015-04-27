package it.geosolutions.security.alb;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import it.geosolutions.security.alb.limitbuilder.AccessLimitBuilder;
import it.geosolutions.security.alb.limitbuilder.ReadWriteALB;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

public class AlbAccessManagerTest {

    static final String READONLY_ALB_BEAN_NAME = "readOnlyAccessLimitBuilder";
    static final String ADMIN_ALB_BEAN_NAME = "adminAccessLimitBuilder";
    static final String DENY_ALB_BEAN_NAME = "denyAccessLimitBuilder";
    static final String USID_ALB_BEAN_NAME = "usidAccessLimitBuilder";
    
    static final String WORKSPACE_CITE = "cite";
    static final String WORKSPACE_TOPP = "topp";
    static final String LAKES_LAYER = "Lakes";
    static final String BUILDINGS_LAYER = "Buildings";
    static final String STATES_LAYER = "states";

    protected ApplicationContext context;

    @Before
    public void initContext() {
        context = AlbAccessManagerTestUtils.loadTestContext();
    }

    @Test
    public void testAlbInit() {
        AlbAccessManager alb = context.getBean(AlbAccessManager.class);
        assertNotNull(alb);
        
        ReadWriteALB readOnlyALB = context.getBean(READONLY_ALB_BEAN_NAME, ReadWriteALB.class);
        assertNotNull(readOnlyALB);
        assertTrue(readOnlyALB.isCanRead());
        assertFalse(readOnlyALB.isCanWrite());
        
        ReadWriteALB adminALB = context.getBean(ADMIN_ALB_BEAN_NAME, ReadWriteALB.class);
        assertNotNull(adminALB);
        assertTrue(adminALB.isCanRead());
        assertTrue(adminALB.isCanWrite());
        
        ReadWriteALB denyALB = context.getBean(DENY_ALB_BEAN_NAME, ReadWriteALB.class);
        assertNotNull(denyALB);
        assertFalse(denyALB.isCanRead());
        assertFalse(denyALB.isCanWrite());
    }

    @Test
    public void testRuleLoading() {
        AlbAccessManager alb = context.getBean(AlbAccessManager.class);
        
        AccessRule ruleLakes = alb.getRule(WORKSPACE_CITE, LAKES_LAYER);
        assertNotNull(ruleLakes);
        assertEquals(WORKSPACE_CITE, ruleLakes.getWorkspace());
        assertEquals(LAKES_LAYER, ruleLakes.getLayer());
        assertEquals(WORKSPACE_CITE + "." + LAKES_LAYER, ruleLakes.getKey());
        assertEquals(READONLY_ALB_BEAN_NAME, ruleLakes.getAccessLimitBuilder());
        assertEquals(READONLY_ALB_BEAN_NAME, ruleLakes.getValue());
        assertNotNull(ruleLakes.getOptions());
        assertEquals(0, ruleLakes.getOptions().size());
        
        AccessRule ruleBuildings = alb.getRule(WORKSPACE_CITE, BUILDINGS_LAYER);
        assertNotNull(ruleBuildings);
        assertEquals(WORKSPACE_CITE, ruleBuildings.getWorkspace());
        assertEquals(AccessRule.ANY, ruleBuildings.getLayer());
        assertEquals(WORKSPACE_CITE + "." + AccessRule.ANY, ruleBuildings.getKey());
        assertEquals(USID_ALB_BEAN_NAME, ruleBuildings.getAccessLimitBuilder());
        assertEquals(USID_ALB_BEAN_NAME, ruleBuildings.getValue());
        assertNotNull(ruleBuildings.getOptions());
        assertEquals(1, ruleBuildings.getOptions().size());
        assertEquals("FID in (%s)", ruleBuildings.getOptions().get("cql_filter"));
        
        AccessRule ruleStates = alb.getRule(WORKSPACE_TOPP, STATES_LAYER);
        assertNull(ruleStates);
        
        AccessLimitBuilder denyALB = context.getBean(DENY_ALB_BEAN_NAME, ReadWriteALB.class);
        AccessLimitBuilder defaultALB = alb.getDefaultAccessLimitBuilder();
        
        assertEquals(denyALB, defaultALB);
        assertEquals(denyALB, alb.getAccessLimitBuilder(WORKSPACE_TOPP, STATES_LAYER));
    }
}
