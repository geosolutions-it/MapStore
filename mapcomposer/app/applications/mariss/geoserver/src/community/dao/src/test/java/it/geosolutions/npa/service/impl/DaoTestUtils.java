package it.geosolutions.npa.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;

import it.geosolutions.security.jdbc.ConfigurableJDBCService;
import it.geosolutions.security.jdbc.JDBCServiceConfig;

/**
 * Class collecting static utility methods to setup unit tests.
 * 
 * @author Stefano Costa
 *
 */
public class DaoTestUtils {

    /**
     * Leverages an initialized instance of {@link ConfigurableJDBCService} to setup a
     * {@link DataSource} instance sharing the same configuration.
     * 
     * @param jdbcService
     * @param configResource
     * @return an initialized DataSource instance
     * @throws IOException
     */
    public static DataSource setUpTestDataSource(ConfigurableJDBCService jdbcService)
            throws IOException {
        JDBCServiceConfig config = jdbcService.loadConfig(jdbcService.getJdbcConfigFileName());

        if (config == null) {
            throw new IllegalArgumentException(
                    "Could not load datasource configuration from resource: "
                            + jdbcService.getJdbcConfigFileName());
        }

        BasicDataSource bds = new BasicDataSource();
        bds.setDriverClassName(config.getDriverClassName());
        bds.setUrl(config.getConnectURL());
        bds.setUsername(config.getUserName());
        bds.setPassword(config.getPassword());
        bds.setDefaultAutoCommit(false);
        bds.setMaxActive(10);
    
        return bds;
    }

    /**
     * Executes SQL statements stored in the specified script file, line by line.
     * 
     * @param ds
     * @param scriptResource
     * @throws Exception 
     */
    public static void runScript(DataSource ds, String scriptResource) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(lookupResourceAsStream(scriptResource)));
        
        Connection conn = null;
        try {
            conn = ds.getConnection();
            
            String line = null;
            PreparedStatement st = null;
            while ( (line = reader.readLine()) != null) {
                try {
                    st = conn.prepareStatement(line);
                    st.executeUpdate();
                } finally {
                    try {
                        if (st != null) {
                            st.close();
                        }
                    } catch (SQLException ignored) {
                        // swallow up exception
                    }
                }
            }
            
            reader.close();
            
            conn.commit();
        } catch (Exception e) {
            if (conn != null) {
                conn.rollback();
            }
            throw e;
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ignored) {
                // swallow up exception
            }
        }
    }

    /**
     * 
     * @param resourceName
     * @return An input stream for reading the resource, or null if the resource could not be found 
     */
    private static InputStream lookupResourceAsStream(String resourceName) {
        return DaoTestUtils.class.getResourceAsStream(resourceName);
    }

}
