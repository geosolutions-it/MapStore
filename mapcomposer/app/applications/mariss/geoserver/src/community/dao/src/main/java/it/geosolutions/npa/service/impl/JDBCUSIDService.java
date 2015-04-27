package it.geosolutions.npa.service.impl;

import it.geosolutions.npa.model.RoleUSIDRule;
import it.geosolutions.npa.service.USIDService;
import it.geosolutions.security.jdbc.ConfigurableJDBCService;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Implementation of the USIDService for JDBC storage.
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public class JDBCUSIDService extends ConfigurableJDBCService implements
        USIDService {

    boolean modified = false;
    
    @Override
    public int countAll() throws IOException {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
    
        int count = -1;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.countall", con);
            rs = ps.executeQuery();
    
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
    
        return count;
    }
    
    @Override
    public Collection<RoleUSIDRule> getAllRecords(int pageSize, int offset)
            throws IOException {
        checkPageSize(pageSize);
        checkOffset(offset);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<RoleUSIDRule> tmp = new ArrayList<RoleUSIDRule>();
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getallrecords", con);
            ps.setInt(1, pageSize);
            ps.setInt(2, offset);
            rs = ps.executeQuery();
            while (rs.next()) {
                String role = rs.getString(1);
                String usid = rs.getString(2);
    
                tmp.add(new RoleUSIDRule(role, usid));
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
        return tmp;
    }
    
    @Override
    public RoleUSIDRule getSingleRecord(String role, Object usid)
            throws IOException {
        checkRoleAndUsid(role, usid);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getsinglerecord", con);
            ps.setString(1, role);
            ps.setString(2, usid.toString());
            rs = ps.executeQuery();
    
            if (rs.next()) {
                return new RoleUSIDRule(rs.getString(1), rs.getString(2));
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
    
        return null;
    }
    
    @Override
    public int countUsidForRole(String role) throws IOException {
        checkRole(role);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
    
        int count = -1;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.countusidbyrole", con);
            ps.setString(1, role);
            rs = ps.executeQuery();
    
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
    
        return count;
    }
    
    @Override
    public List<Object> getUsidForRole(String role) throws IOException {
        checkRole(role);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<Object> tmp = new ArrayList<Object>();
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getusidbyrole", con);
            ps.setString(1, role);
            rs = ps.executeQuery();
            while (rs.next()) {
                String usid = rs.getString(1);
    
                tmp.add(usid);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
        return tmp;
    }
    
    public List<Object> getUsidForRole(String role, int pageSize, int offset)
            throws IOException {
        checkRole(role);
        checkPageSize(pageSize);
        checkOffset(offset);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<Object> tmp = new ArrayList<Object>();
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getusidbyrole_page", con);
            ps.setString(1, role);
            ps.setInt(2, pageSize);
            ps.setInt(3, offset);
            rs = ps.executeQuery();
            while (rs.next()) {
                String usid = rs.getString(1);
    
                tmp.add(usid);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
        return tmp;
    }
    
    @Override
    public int countRolesForUsid(Object usid) throws IOException {
        checkUsid(usid);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
    
        int count = -1;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.countrolesbyusid", con);
            ps.setString(1, usid.toString());
            rs = ps.executeQuery();
    
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
    
        return count;
    }
    
    @Override
    public Collection<String> getRolesForUsid(Object usid) throws IOException {
        checkUsid(usid);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        List<String> tmp = new ArrayList<String>();
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getrolesbyusid", con);
            ps.setString(1, usid.toString());
            rs = ps.executeQuery();
            while (rs.next()) {
                String role = rs.getString(1);
    
                tmp.add(role);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
        return tmp;
    }
    
    @Override
    public Collection<String> getRolesForUsid(Object usid, int pageSize, int offset)
            throws IOException {
        checkUsid(usid);
        checkPageSize(pageSize);
        checkOffset(offset);
    
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
    
        List<String> tmp = new ArrayList<String>();
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.getrolesbyusid_page", con);
            ps.setString(1, usid.toString());
            ps.setInt(2, pageSize);
            ps.setInt(3, offset);
            rs = ps.executeQuery();
            while (rs.next()) {
                String role = rs.getString(1);
    
                tmp.add(role);
            }
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, rs);
        }
        return tmp;
    }
    
    @Override
    public boolean addUsidForRole(String role, Object usid) throws IOException {
        checkRoleAndUsid(role, usid);
    
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.insert", con);
            ps.setString(1, role);
            ps.setString(2, usid.toString());
            ps.execute();
    
            con.commit();
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, null);
        }
        setModified(true);
        return true;
    
    }
    
    @Override
    public boolean deleteUsidForRole(String role, Object usid) throws IOException {
        checkRoleAndUsid(role, usid);
    
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = getConnection();
            ps = getDMLStatement("role_usid.delete", con);
            ps.setString(1, role);
            ps.setString(2, usid.toString());
            ps.execute();
    
            con.commit();
        } catch (SQLException ex) {
            throw new IOException(ex);
        } finally {
            closeFinally(con, ps, null);
        }
        setModified(true);
        return true;
    
    }

    /**
     * Validates both role and usid parameters.
     * 
     * @param role
     * @param usid
     * @throws IllegalArgumentException if either role or usid is null or empty
     */
    private void checkRoleAndUsid(String role, Object usid) {
        checkRole(role);
        checkUsid(usid);
    }
    
    /**
     * Validates usid parameter.
     * @param usid
     * @throws IllegalArgumentException if usid is null or empty
     */
    private void checkUsid(Object usid) {
        String usidAsString = usidToString(usid);
        if (usidAsString == null || usidAsString.isEmpty()) {
            throw new IllegalArgumentException("usid must not be empty");
        }
    }
    
    /**
     * Validates role parameter.
     * @param role
     * @throws IllegalArgumentException if role is null or empty
     */
    private void checkRole(String role) {
        if (role == null || role.isEmpty()) {
            throw new IllegalArgumentException("role must not be empty");
        }
    }
    
    private String usidToString(Object usid) {
        return (usid != null) ? usid.toString() : "";
    }

    /**
     * Validates pageSize parameter.
     * @param pageSize
     * @throws IllegalArgumentException if pageSize is less than or equal to 0
     */
    private void checkPageSize(int pageSize) {
        if (pageSize <= 0) {
            throw new IllegalArgumentException(
                    "page size must be strictly greater than zero");
        }
    }

    /**
     * Validates offset parameter.
     * @param offset
     * @throws IllegalArgumentException if offset is less than 0
     */
    private void checkOffset(int offset) {
        if (offset < 0) {
            throw new IllegalArgumentException(
                    "offset must be greater than or equal to zero");
        }
    }
    
    /**
     * @return the modified
     */
    public boolean isModified() {
        return modified;
    }
    
    /**
     * @param modified the modified to set
     */
    public void setModified(boolean modified) {
        this.modified = modified;
    }
    
    /**
     * @see org.geoserver.security.jdbc.AbstractJDBCService#getOrderedNamesForCreate()
     */
    protected String[] getOrderedNamesForCreate() {
        return new String[] { "role_usid.create" };
    }
    
    /**
     * @see org.geoserver.security.jdbc.AbstractJDBCService#getOrderedNamesForDrop()
     */
    protected String[] getOrderedNamesForDrop() {
        return new String[] { "role_usid.drop" };
    }

}
