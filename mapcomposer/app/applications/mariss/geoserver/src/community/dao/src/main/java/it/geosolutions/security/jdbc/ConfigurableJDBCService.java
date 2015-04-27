package it.geosolutions.security.jdbc;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

import org.springframework.beans.factory.InitializingBean;

import com.thoughtworks.xstream.XStream;

/**
 * Abstract Class for JDBC service that allows the user to specify the location
 * of dml, ddl and jdbc configuration files as a base directory and a path relative to it.
 * Extend this class to create your own service connected to a JDBC Service.
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public abstract class ConfigurableJDBCService extends
        AbstractJDBCService<JDBCServiceConfig> implements InitializingBean {

    // refactoring-proof way of setting the base path for lookup of config files
    // templates
    private String defaultResourceBasePath = "/"
            + ConfigurableJDBCService.class.getPackage().getName()
                    .replace(".", "/");
    
    private String dmlFileName = "dml.xml";
    
    private String ddlFileName = "ddl.xml";
    
    private String jdbcConfigFileName = "jdbc.xml";
    
    // private GeoServerDataDirectory datadir;
    private File baseDirectory;
    private String configFolderPath;
    
    /**
     * Uses {@link #initializeDSFromConfig(SecurityNamedServiceConfig)} and
     * {@link #checkORCreateJDBCPropertyFile(String, File, String)}
     * 
     * @see org.geoserver.security.GeoServerRoleService#initializeFromConfig(org.geoserver.security.config.SecurityNamedServiceConfig)
     */
    public void initializeFromConfig(JDBCServiceConfig config) throws IOException {
    
        this.name = config.getName();
        initializeDSFromConfig(config);
    
        if (config instanceof JDBCServiceConfig) {
            JDBCServiceConfig jdbcConfig = (JDBCServiceConfig) config;
    
            String fileNameDML = jdbcConfig.getPropertyFileNameDML();
            File file = checkORCreateJDBCPropertyFile(fileNameDML, getConfigRoot(),
                    this.defaultResourceBasePath + "/" + dmlFileName);
            dmlProps = load(file);
    
            String fileNameDDL = jdbcConfig.getPropertyFileNameDDL();
            if (fileNameDDL != null && fileNameDDL.length() > 0) {
                file = checkORCreateJDBCPropertyFile(fileNameDDL, getConfigRoot(),
                        this.defaultResourceBasePath + "/" + ddlFileName);
                ddlProps = loadUniversal(new FileInputStream(file));
                createTablesIfRequired((JDBCServiceConfig) config);
            }
        }
    }
    
    /**
     * The root configuration for the service.
     */
    public File getConfigRoot() throws IOException {
        return new File(getBaseDirectory(), this.configFolderPath);
    }
    
    /**
     * Load a file
     * 
     * @param file
     * @return
     * @throws IOException
     */
    private Properties load(File file) throws IOException {
        return loadUniversal(new FileInputStream(file));
    }
    
    /**
     * Determines if the the input stream is xml
     * if it is, use create properties loaded from xml
     * format, otherwise create properties from default
     * format.
     * 
     * @param in
     * @return
     * @throws IOException
     */
    private Properties loadUniversal(InputStream in) throws IOException {
        final String xmlDeclarationStart = "<?xml";
        BufferedInputStream bin = new BufferedInputStream(in);
        bin.mark(4096);
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(bin));
        String line = reader.readLine();                
        boolean isXML = line.startsWith(xmlDeclarationStart);
        
        bin.reset();
        Properties props = new Properties();
        
        if (isXML)
            props.loadFromXML(bin);
        else
            props.load(bin);
                
        return props;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        File jdbcConfigFile = checkORCreateJDBCPropertyFile(
                this.jdbcConfigFileName, getConfigRoot(),
                this.defaultResourceBasePath + "/" + this.jdbcConfigFileName);
        if (jdbcConfigFile != null) {
            JDBCServiceConfig config = this.loadConfigFile(jdbcConfigFile,
                    getXStream());
            this.initializeFromConfig(config);
        }
    }
    
    /**
     * 
     * @param configFile
     * @param xs
     * @return a {@link JDBCServiceConfig} instance, deserialized from the specified file
     * @throws IOException
     */
    JDBCServiceConfig loadConfigFile(File configFile,
            XStream xs) throws IOException {
        return (JDBCServiceConfig)xs.fromXML(configFile);
    }
    
    /**
     * 
     * @param name the name of the config file, relative to the config root dir
     * @return a {@link JDBCServiceConfig} instance, deserialized from the specified file
     * @throws IOException
     */
    public JDBCServiceConfig loadConfig(String name) throws IOException {
        File dir = getConfigRoot();
        if (!dir.exists()) {
            return null;
        }
    
        XStream xs = getXStream();
    
        return loadConfigFile(dir, name, xs);
    }
    /**
     * 
     * @param directory the directory to use as config root dir
     * @param filename the name of the config file, relative to {@code directory}
     * @param xs
     * @return a {@link JDBCServiceConfig} instance, deserialized from the specified file
     * @throws IOException
     */
    JDBCServiceConfig loadConfigFile(File directory, String filename,
            XStream xs) throws IOException {
        FileInputStream fin = new FileInputStream(new File(directory, filename));
        try {
            return (JDBCServiceConfig)xs.fromXML(fin);
        } finally {
            fin.close();
        }
    }
    
    /**
     * Creates the persister for security plugin configuration.
     * @return a properly configured {@link XStream} instance
     */
    XStream getXStream() throws IOException {
        // create and configure an xstream object to load the configuration
        // files
        XStream xs = new XStream();
    
        xs.alias("jdbcservice", JDBCServiceConfig.class);
    
        return xs;
    }
    
    /**
     * @return the baseDirectory
     */
    public File getBaseDirectory() {
        return baseDirectory;
    }
    
    /**
     * @param baseDirectory the baseDirectory to set
     */
    public void setBaseDirectory(File baseDirectory) {
        this.baseDirectory = baseDirectory;
    }
    
    /**
     * @return the configFolderPath
     */
    public String getConfigFolderPath() {
        return configFolderPath;
    }
    
    /**
     * Sets the path to the configuration folder, relative to the directory
     * set by {@link ConfigurableJDBCService#setBaseDirectory(File)}.
     * 
     * @param configFolderPath the configFolderPath to set
     */
    public void setConfigFolderPath(String configFolderPath) {
        this.configFolderPath = configFolderPath;
    }
    
    /**
     * @return the defaultResourceBasePath
     */
    public String getDefaultResourceBasePath() {
        return defaultResourceBasePath;
    }

    /**
     * @param defaultResourceBasePath the defaultResourceBasePath to set
     */
    public void setDefaultResourceBasePath(String defaultResourceBasePath) {
        this.defaultResourceBasePath = defaultResourceBasePath;
    }

    /**
     * @return the dmlFileName
     */
    public String getDmlFileName() {
        return dmlFileName;
    }
    
    /**
     * @param dmlFileName the dmlFileName to set
     */
    public void setDmlFileName(String dmlFileName) {
        this.dmlFileName = dmlFileName;
    }
    
    /**
     * @return the ddlFileName
     */
    public String getDdlFileName() {
        return ddlFileName;
    }
    
    /**
     * @param ddlFileName the ddlFileName to set
     */
    public void setDdlFileName(String ddlFileName) {
        this.ddlFileName = ddlFileName;
    }
    /**
     * @return the jdbcConfigFileName
     */
    public String getJdbcConfigFileName() {
        return jdbcConfigFileName;
    }
    /**
     * @param jdbcConfigFileName the jdbcConfigFileName to set
     */
    public void setJdbcConfigFileName(String jdbcConfigFileName) {
        this.jdbcConfigFileName = jdbcConfigFileName;
    }

}
