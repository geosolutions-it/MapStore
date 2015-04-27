package it.geosolutions.npa.service;

import it.geosolutions.npa.model.RoleUSIDRule;

import java.io.IOException;
import java.util.Collection;

/**
 * Service Tier for USID data.
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public interface USIDService {

    /**
     * @return the total number of role-usid associations.
     * @throws IOException
     */
    public int countAll() throws IOException;
    
    /**
     * Gets the list of all role-usid associations. Supports pagination.
     * 
     * @param pageSize the maximum number of records to return
     * @param offset the index of the first returned record (starting from 0)
     * @return a list of role-usid associations
     * @throws IOException
     */
    public Collection<RoleUSIDRule> getAllRecords(int pageSize, int offset)
            throws IOException;
    
    /**
     * Gets a single record from the database.
     * @param role the selected role
     * @param usid the selected usid
     * @return the specified role-usid association, or {@code null} if none was found 
     * @throws IOException
     */
    public RoleUSIDRule getSingleRecord(String role, Object usid)
            throws IOException;
    
    /**
     * Gets the total number of usids associated to a specific role. Useful for
     * pagination.
     * 
     * @param role the selected role
     * @return the number of usids associated to the specified role
     * @throws IOException
     */
    public int countUsidForRole(String role) throws IOException;
    
    /**
     * Gets the list of usids for the role (Company)
     * 
     * @param role the selected role
     * @return the list of usids associated to the specified role
     * @throws IOException
     */
    public Collection<Object> getUsidForRole(String role) throws IOException;
    
    /**
     * Gets the list of usid for the role (Company). Supports pagination.
     * 
     * @param role the selected role
     * @param pageSize the maximum number of records to return
     * @param offset the index of the first returned record (starting from 0)
     * @return a list of usids associated to the specified role
     * @throws IOException
     */
    public Collection<Object> getUsidForRole(String role, int pageSize, int offset)
            throws IOException;
    
    /**
     * Gets the total number of roles associated to a specific usid. Useful for
     * pagination.
     * 
     * @param usid the selected usid
     * @return the number of roles associated to the specified usid
     * @throws IOException
     */
    public int countRolesForUsid(Object usid) throws IOException;
    
    /**
     * Gets the list of roles (Companies) for a usid.
     * 
     * @param usid the selected usid
     * @return the list of roles associated to the specified usid
     * @throws IOException
     */
    public Collection<String> getRolesForUsid(Object usid) throws IOException;
    
    /**
     * Gets the list of roles (Companies) for a usid. Supports pagination.
     * 
     * @param usid the selected usid
     * @param pageSize the maximum number of records to return
     * @param offset the index of the first returned record (starting from 0)
     * @return a list of roles associated to the specified usid
     * @throws IOException
     */
    public Collection<String> getRolesForUsid(Object usid, int pageSize, int offset)
            throws IOException;
    
    /**
     * Creates a new role-usid association.
     * 
     * @param role the role
     * @param usid the usid
     * @return true
     * @throws IOException
     */
    public boolean addUsidForRole(String role, Object usid) throws IOException;
    
    /**
     * Removes a role-usid association.
     * 
     * @param role the role
     * @param usid the usid
     * @return true
     * @throws IOException
     */
    public boolean deleteUsidForRole(String role, Object usid) throws IOException;

}
