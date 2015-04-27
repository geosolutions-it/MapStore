package it.geosolutions.security.alb;

import it.geosolutions.security.alb.config.AccessLimitConfiguration;
import it.geosolutions.security.alb.limitbuilder.AccessLimitBuilder;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.geoserver.catalog.Catalog;
import org.geoserver.catalog.CatalogInfo;
import org.geoserver.catalog.LayerGroupInfo;
import org.geoserver.catalog.LayerInfo;
import org.geoserver.catalog.Predicates;
import org.geoserver.catalog.ResourceInfo;
import org.geoserver.catalog.StyleInfo;
import org.geoserver.catalog.WorkspaceInfo;
import org.geoserver.config.GeoServerDataDirectory;
import org.geoserver.config.util.XStreamPersister;
import org.geoserver.config.util.XStreamPersisterFactory;
import org.geoserver.security.CatalogMode;
import org.geoserver.security.DataAccessLimits;
import org.geoserver.security.LayerGroupAccessLimits;
import org.geoserver.security.ResourceAccessManager;
import org.geoserver.security.StyleAccessLimits;
import org.geoserver.security.WorkspaceAccessLimits;
import org.geoserver.security.impl.GeoServerRole;
import org.geotools.util.logging.Logging;
import org.opengis.filter.Filter;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import com.thoughtworks.xstream.converters.extended.NamedMapConverter;

/**
 * Access Manager Based on Access Rules defined in Data Directory
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 */
public class AlbAccessManager implements ResourceAccessManager, ApplicationContextAware {
	
    private static final Logger LOGGER = Logging.getLogger(AlbAccessManager.class);

    static final CatalogMode DEFAULT_CATALOG_MODE = CatalogMode.HIDE;

    /**
     * Additional role that will be considered as granting administrator rights
     */
    static final String ROOT_ROLE = "ROLE_ADMINISTRATOR";

    /**
     * Location of the configuration file, relative to {@link #datadir}
     */
    static final String CONFIG_LOCATION = "AccessManager.xml";

    /**
     * Bean name of the ALB instance granting full (admin) rights.
     */
    static final String ADMIN_ALB_NAME = "adminAccessLimitBuilder";

    /**
     * The configuration
     */
    private AccessLimitConfiguration configuration;
    
    GeoServerDataDirectory datadir;

    private Map<String, AccessLimitBuilder> albCache = new HashMap<String, AccessLimitBuilder>();

    private ApplicationContext context;

    public AlbAccessManager(Catalog catalog, GeoServerDataDirectory datadir)
            throws IOException {
        super();
        this.datadir = datadir;

        loadConfig();

    }

    /**
     * Load the configuration and empty the cache of beans if any
     */
    public void loadConfig() throws IOException {
        // empty bean cache
        albCache = new HashMap<String, AccessLimitBuilder>();
        // load resource from the data directory
        File configFile = datadir.getResourceLoader().find(CONFIG_LOCATION);

        XStreamPersister xp = persister();

        this.configuration = loadConfigFile(configFile, xp);
    }

    /**
     * Reads a config file from the specified directly using the specified xstream persister
     */
    AccessLimitConfiguration loadConfigFile(File file, XStreamPersister xp) throws IOException {
        FileInputStream fin = new FileInputStream(file);
        try {
            return xp.load(fin, AccessLimitConfiguration.class);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE,
                    "Unable to load the access nanager from file " + file.getAbsolutePath(), e);
            throw e;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE,
                    "Unable to load the access nanager from file " + file.getAbsolutePath(), e);
        } finally {
            if (fin != null) {
                fin.close();
            }
        }
        return configuration;
    }

    /**
     * Returns the internal ALB cache size. Useful for testing purposes.
     * 
     * @return the number of cached {@link AccessLimitBuilder} instances
     */
    int getCacheSize() {
        return albCache.size();
    }

    /**
     * Create a persister for the configuration
     * 
     * @return
     * @throws IOException
     */
    XStreamPersister persister() throws IOException {
        XStreamPersister xp = new XStreamPersisterFactory().createXMLPersister();
        xp.getXStream().alias("config", AccessLimitConfiguration.class);
        xp.getXStream().alias("rule", AccessRule.class);
        NamedMapConverter optionsConverter = new NamedMapConverter(xp.getXStream()
                .getMapper(), "option", "name", String.class, null, String.class,
                true, false, xp.getXStream().getConverterLookup());
        xp.getXStream().registerConverter(optionsConverter);

        return xp;
    }

    /**
     * The workspace access limit is fixed. Only admin user can write workspaces.
     */
    @Override
    public WorkspaceAccessLimits getAccessLimits(Authentication user, WorkspaceInfo workspace) {
        LOGGER.log(Level.FINE, "Getting access limits for workspace {0}", workspace.getName());

        if(workspace.getName().equalsIgnoreCase("geosolutions")){
             return new WorkspaceAccessLimits(DEFAULT_CATALOG_MODE, true, true);
        }
        
        if ((user != null) && !(user instanceof AnonymousAuthenticationToken)) {
            // shortcut, if the user is the admin, he can do everything
            if (isAdmin(user)) {
                LOGGER.log(Level.FINE, "Admin level access, returning "
                        + "full rights for workspace {0}", workspace.getName());

                return new WorkspaceAccessLimits(DEFAULT_CATALOG_MODE, true, true);
            }

        }
        return new WorkspaceAccessLimits(DEFAULT_CATALOG_MODE, true, false);
    }

    @Override
    public DataAccessLimits getAccessLimits(Authentication user, LayerInfo layer) {
        LOGGER.log(Level.FINE, "Getting access limits for Layer {0}", layer.getName());
        // the layer access limits depends on the resource access limit
        return getAccessLimits(user, layer.getResource());
    }

    @Override
    public DataAccessLimits getAccessLimits(Authentication user, ResourceInfo resource) {
        AccessLimitBuilder b =null;
        if ((user != null) && !(user instanceof AnonymousAuthenticationToken)) {
            // shortcut, if the user is the admin, he can do everything
            if (isAdmin(user)) {
                LOGGER.log(Level.FINE, "Admin level access, returning "
                        + "full rights for layer {0}", resource.getNamespace() + ":" + resource.getName());

                return buildAccessLimits(user, resource,
                        getAccessLimitBuilder(ADMIN_ALB_NAME), null);// TODO if null allow all
            }
        }
        //authenticated or anonymous user
        AccessRule rule= getRule(resource);
        b = getAccessLimitBuilder(rule);
        // retrieve and return the DataAccessLimit object

        Map<String, Object> ruleOptions = (rule != null) ? rule.getOptions() : new HashMap<String, Object>();
        return buildAccessLimits(user, resource, b, ruleOptions);
    }

    /**
     * Retrieves from the configuration a rule for the specified geospatial resource.
     * 
     * @param resource the resource to access
     * @return the {@link AccessRule} controlling access to the resource, 
     *          or null if none was found
     */
    private AccessRule getRule(ResourceInfo resource) {
    	 String workspace = resource.getStore().getWorkspace().getName();
         String name = resource.getName();
		return getRule(workspace,name);
	}

    /**
     * Provides the access limit builder for the required resource. Check the configuration and get the configured builder.
     * 
     * @param resource the resource to access
     * @return the access limit builder
     */
    private AccessLimitBuilder getAccessLimitBuilder(ResourceInfo resource) {
        String workspace = resource.getStore().getWorkspace().getName();
        String name = resource.getName();
        return getAccessLimitBuilder(workspace, name);

    }

    /**
     * Gets the AccessLimitBuilder from the configuration. It looks for a rule in the configuration, get the accessLimitBuilder string and find the
     * 
     * @param workspace the workspace
     * @param name the name of the workspace
     * @return access limit builder
     */
    AccessLimitBuilder getAccessLimitBuilder(String workspace, String name) {
        AccessRule ar = getRule(workspace,name);
        AccessLimitBuilder alb = getAccessLimitBuilder(ar);
        return alb;

    }
    /**
     * Gets the access limit builder for an access rule.
     * @param ar the access rule
     * @return the access limit builder configured for the rule; if {@code ar == null}, 
     *          the result of a call to {@link #getDefaultAccessLimitBuilder()} is returned 
     */
    private AccessLimitBuilder getAccessLimitBuilder(AccessRule ar) {
        if(ar == null){
            return getDefaultAccessLimitBuilder();
        }
        String beanName = ar.getAccessLimitBuilder();
        return getAccessLimitBuilder(beanName);
        
        
        
    }
    /**
     * Gest the default access limit builder
     */
    AccessLimitBuilder getDefaultAccessLimitBuilder() {
        return getAccessLimitBuilder(configuration.getDefaultAccessBuilder());
    }

    /**
     * Gets the access builder from the bean name
     * @param beanName
     */
    private AccessLimitBuilder getAccessLimitBuilder(String beanName) {
        AccessLimitBuilder alb = albCache.get(beanName);
        if(alb == null){
            alb = (AccessLimitBuilder) context.getBean(beanName);
            albCache.put(beanName, alb);
            if(alb == null){
                LOGGER.log(Level.SEVERE,"Unknown AccessLimitBuilder {0}", beanName);
            }
            return alb;
        }
        return alb;
        
        
    }

    /**
     * Gets a rule for a name, workspace.  
     * 
     * @param workspace the name of the workspace
     * @param name the name of the resource (layer)
     * @return the {@link AccessRule} with the best match. 
     *          <p>A rule matching both workspace and layer takes precedence over a rule matching 
     *          only the workspace and accepting any layer (workspace.*), which in turn takes 
     *          precedence over a generic rule accepting everything (*.*).</p>
     *          <p>If no matching rule was found, returns null.</p>
     */
    AccessRule getRule(String workspace, String name) {
        AccessRule genericRule = null;
        AccessRule workspaceMatch = null;
        for(AccessRule rule : configuration.getRules()){
            //case *.*
            if(AccessRule.ANY.equals(rule.getWorkspace()) && AccessRule.ANY.equals(rule.getLayer())){
                genericRule = rule;
            //case workspace match (workspace.*)
            }else if(rule.getWorkspace().equals(workspace) && AccessRule.ANY.equals(rule.getLayer())){
                workspaceMatch = rule;
            //case of full match (workspace.layer), return the first rule found
            }else if(rule.getWorkspace().equals(workspace) && rule.getLayer().equals(name)){
                return rule;
            }
        }
        //return the best match (or null)
        return workspaceMatch != null ? workspaceMatch : genericRule;
    }

    /**
     * Builds the data access limit for a resource.
     * 
     * @param user the user
     * @param resource the resource
     * @param b the access limit builder
     * @param options configuration options
     * @return the access limits
     */
    private DataAccessLimits buildAccessLimits(Authentication user, ResourceInfo resource,
            AccessLimitBuilder b, Map<String,Object> options) {

        CatalogMode catalogMode = DEFAULT_CATALOG_MODE;
        if(b == null){
           b = getDefaultAccessLimitBuilder();
        }
        LOGGER.log(Level.FINE, "Returning mode {0} for resource {1}", new Object[] { catalogMode,
                resource });
        return b.buildAccessLimits(user, resource, DEFAULT_CATALOG_MODE,options);

    }

    @Override
    public StyleAccessLimits getAccessLimits(Authentication user, StyleInfo style) {
        LOGGER.fine("Not limiting styles");
        return null;
    }
    
    @Override
    public LayerGroupAccessLimits getAccessLimits(Authentication user, LayerGroupInfo layerGroup) {
        LOGGER.fine("Not limiting layergroups");
        return null;
    }

    @Override
    public Filter getSecurityFilter(Authentication user, Class<? extends CatalogInfo> clazz) {
        return Predicates.acceptAll();
        
    }
    
    /**
     * @return {@link Predicates#acceptAll()}
     */
    public Filter getSecurityFilter() {
        return Predicates.acceptAll();
        
    }
    

    /**
     * @param user the user
     * @return {@code true} if the specified user is an administrator 
     *          (i.e. user has been assigned role <em>ROLE_ADMINISTRATOR</em> 
     *          or the role specified in {@link #ROOT_ROLE}); {@code false} otherwise 
     */
    boolean isAdmin(Authentication user) {
        if (user.getAuthorities() != null) {
            for (GrantedAuthority authority : user.getAuthorities()) {
                final String userRole = authority.getAuthority();
                if (ROOT_ROLE.equals(userRole)
                        || GeoServerRole.ADMIN_ROLE.getAuthority().equals(userRole)) {
                    return true;
                }
            }
        }

        return false; 
    }
    

	@Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        this.context = context;

    }

}
