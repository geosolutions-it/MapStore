package it.geosolutions.npa.service.impl;

import it.geosolutions.npa.model.RoleUSIDRule;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.sql.DataSource;

import junit.framework.TestCase;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.io.FileUtils;

public class JDBCUSIDServiceTest extends TestCase {

    private static final String INSERT_RULES_SCRIPT = "/data/insert_usid_rules.sql";
    
    private static final String DDL_FILE = "test-ddl.xml";
    private static final String DML_FILE = "test-dml.xml";
    private static final String JDBC_FILE = "test-jdbc.xml";
    
    private static final String ROLE_USER = "USER";
    private static final String ROLE_GUEST = "GUEST";
    private static final String ROLE_ADMIN = "ADMIN";
    private static final String USID_123 = "123";
    private static final String USID_456 = "456";
    private static final String USID_789 = "789";
    private static final String USID_001 = "001";
    
    private DataSource testDataSource;
    private JDBCUSIDService usidService;
    
    @Override
    protected void setUp() throws Exception {
        super.setUp();
        
        setUpUsidService();
        
        testDataSource = DaoTestUtils.setUpTestDataSource(usidService);
        
        DaoTestUtils.runScript(testDataSource, INSERT_RULES_SCRIPT);
    }

    private void setUpUsidService() throws Exception {
        usidService = new JDBCUSIDService();
        usidService.setDdlFileName(DDL_FILE);
        usidService.setDmlFileName(DML_FILE);
        usidService.setJdbcConfigFileName(JDBC_FILE);
        usidService.setBaseDirectory(new File(System.getProperty("java.io.tmpdir")));
        usidService.setConfigFolderPath("npa-dao");
        // fake Spring initialization
        usidService.afterPropertiesSet();
    }
    
    public void tearDown() throws Exception {
        final String leakMessage = "Expected no active connection, either there is a connection leak " +
                        "or you forgot to close some object holding onto connections in the tests (e.g., a reader, an iterator)";
        BasicDataSource bds = (BasicDataSource) testDataSource;
        assertEquals(leakMessage, 0, bds.getNumActive());
        
        bds.close();

        usidService.dropTables();

        FileUtils.deleteDirectory(usidService.getConfigRoot());
    }
    
    public void testCount() throws IOException {
        final int EXP_COUNT_ALL = 8;
        final int EXP_COUNT_ROLE_USER = 2;
        final int EXP_COUNT_ROLE_GUEST = 2;
        final int EXP_COUNT_ROLE_ADMIN = 4;
        final int EXP_COUNT_USID_123 = 3;
        final int EXP_COUNT_USID_456 = 2;
        final int EXP_COUNT_USID_789 = 2;
        final int EXP_COUNT_USID_001 = 1;
        
        int countAll = usidService.countAll();
        assertEquals(EXP_COUNT_ALL, countAll);
        
        
        int countRoleUser = usidService.countUsidForRole(ROLE_USER);
        int countRoleGuest = usidService.countUsidForRole(ROLE_GUEST);
        int countRoleAdmin = usidService.countUsidForRole(ROLE_ADMIN);
        assertEquals(EXP_COUNT_ROLE_USER, countRoleUser);
        assertEquals(EXP_COUNT_ROLE_GUEST, countRoleGuest);
        assertEquals(EXP_COUNT_ROLE_ADMIN, countRoleAdmin);
        
        int countUsid123 = usidService.countRolesForUsid(USID_123);
        int countUsid456 = usidService.countRolesForUsid(USID_456);
        int countUsid789 = usidService.countRolesForUsid(USID_789);
        int countUsid001 = usidService.countRolesForUsid(USID_001);
        assertEquals(EXP_COUNT_USID_123, countUsid123);
        assertEquals(EXP_COUNT_USID_456, countUsid456);
        assertEquals(EXP_COUNT_USID_789, countUsid789);
        assertEquals(EXP_COUNT_USID_001, countUsid001);
    }
    
    public void testGetSingleRecord() throws IOException {
        RoleUSIDRule rule = usidService.getSingleRecord(ROLE_USER, USID_456);
        assertNotNull(rule);
        assertEquals(ROLE_USER, rule.getRole());
        assertEquals(USID_456, rule.getUsid());
        
        // non-existent
        rule = usidService.getSingleRecord(ROLE_USER, USID_789);
        assertNull(rule);
    }
    
    public void testGetRolesForUsid() throws IOException {
        List<String> EXP_ROLES_FOR_USID_123 = Arrays.asList(ROLE_USER, ROLE_GUEST, ROLE_ADMIN);
        List<String> EXP_ROLES_FOR_USID_456 = Arrays.asList(ROLE_USER, ROLE_ADMIN);
        List<String> EXP_ROLES_FOR_USID_789 = Arrays.asList(ROLE_GUEST, ROLE_ADMIN);
        List<String> EXP_ROLES_FOR_USID_001 = Arrays.asList(ROLE_ADMIN);
        
        Collection<String> rolesForUsid123 = usidService.getRolesForUsid(USID_123);
        assertTrue(collectionsWithSameElements(EXP_ROLES_FOR_USID_123, rolesForUsid123));
        
        Collection<String> rolesForUsid456 = usidService.getRolesForUsid(USID_456);
        assertTrue(collectionsWithSameElements(EXP_ROLES_FOR_USID_456, rolesForUsid456));
        
        Collection<String> rolesForUsid789 = usidService.getRolesForUsid(USID_789);
        assertTrue(collectionsWithSameElements(EXP_ROLES_FOR_USID_789, rolesForUsid789));
        
        Collection<String> rolesForUsid001 = usidService.getRolesForUsid(USID_001);
        assertTrue(collectionsWithSameElements(EXP_ROLES_FOR_USID_001, rolesForUsid001));
    }
    
    public void testGetUsidForRole() throws IOException {
        List<Object> EXP_USID_FOR_ROLE_USER = Arrays.asList((Object)USID_123, USID_456);
        List<Object> EXP_USID_FOR_ROLE_GUEST = Arrays.asList((Object)USID_123, USID_789);
        List<Object> EXP_USID_FOR_ROLE_ADMIN = Arrays.asList((Object)USID_123, USID_456, USID_789, USID_001);
        
        Collection<Object> usidForRoleUser = usidService.getUsidForRole(ROLE_USER);
        assertTrue(collectionsWithSameElements(EXP_USID_FOR_ROLE_USER, usidForRoleUser));
        
        Collection<Object> usidForRoleGuest = usidService.getUsidForRole(ROLE_GUEST);
        assertTrue(collectionsWithSameElements(EXP_USID_FOR_ROLE_GUEST, usidForRoleGuest));
        
        Collection<Object> usidForRoleAdmin = usidService.getUsidForRole(ROLE_ADMIN);
        assertTrue(collectionsWithSameElements(EXP_USID_FOR_ROLE_ADMIN, usidForRoleAdmin));
    }
    
    public void testGetAllRecordsWithPagination() throws IOException {
        final int PAGE_SIZE = 2, NUM_PAGES = 4;
        final List<RoleUSIDRule> EXPECTED_RULES = Arrays.asList(
                new RoleUSIDRule(ROLE_ADMIN, USID_001), 
                new RoleUSIDRule(ROLE_ADMIN, USID_123), 
                new RoleUSIDRule(ROLE_ADMIN, USID_456), 
                new RoleUSIDRule(ROLE_ADMIN, USID_789),
                new RoleUSIDRule(ROLE_GUEST, USID_123),
                new RoleUSIDRule(ROLE_GUEST, USID_789),
                new RoleUSIDRule(ROLE_USER, USID_123),
                new RoleUSIDRule(ROLE_USER, USID_456)
        );
        
        for (int i=0; i<NUM_PAGES; i++) {
            List<RoleUSIDRule> page = (List<RoleUSIDRule>)usidService.getAllRecords(2, i*PAGE_SIZE);
            assertEquals(PAGE_SIZE, page.size());
            assertEquals(EXPECTED_RULES.get(i*PAGE_SIZE).getRole(), page.get(0).getRole());
            assertEquals(EXPECTED_RULES.get(i*PAGE_SIZE+1).getUsid(), page.get(1).getUsid());
        }
    }
    
    public void testAddRule() throws IOException {
        assertNull(usidService.getSingleRecord(ROLE_USER, USID_789));
        
        usidService.addUsidForRole(ROLE_USER, USID_789);
        assertNotNull(usidService.getSingleRecord(ROLE_USER, USID_789));
    }
    
    public void testDeleteRule() throws IOException {
        assertNotNull(usidService.getSingleRecord(ROLE_USER, USID_123));
        
        usidService.deleteUsidForRole(ROLE_USER, USID_123);
        assertNull(usidService.getSingleRecord(ROLE_USER, USID_123));
    }
    
    private <T> boolean collectionsWithSameElements(Collection<T> collection, Collection<T> otherCollection) {
        if (collection.size() != otherCollection.size()) {
            return false;
        }
        
        for (T element: collection) {
            if (!otherCollection.contains(element)) {
                return false;
            }
        }
        
        return true;
    }    
    
}
