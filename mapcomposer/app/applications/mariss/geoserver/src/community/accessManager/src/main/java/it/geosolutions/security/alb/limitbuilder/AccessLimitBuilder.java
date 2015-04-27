package it.geosolutions.security.alb.limitbuilder;

import java.util.Map;

import org.geoserver.catalog.ResourceInfo;
import org.geoserver.security.CatalogMode;
import org.geoserver.security.DataAccessLimits;
import org.springframework.security.core.Authentication;


/**
 * Interface for a dynamic filter builder.
 * 
 * @author Lorenzo Natali, GeoSolutions
 */
public interface AccessLimitBuilder {
    /**
     * Build the Access Limits for the resource
     * 
     * @param user the user
     * @param resource the resource to access
     * @param catalogMode the catalog mode
     * @return the DataAccessLimits to use
     */
    public DataAccessLimits buildAccessLimits(Authentication user,
            ResourceInfo resource, CatalogMode catalogMode);
    
    /**
     * @param user the user
     * @param resource the resource to access
     * @param catalogMode the catalog mode
     * @param options configuration options
     * @return the DataAccessLimits to use
     */
    public DataAccessLimits buildAccessLimits(Authentication user,
            ResourceInfo resource, CatalogMode catalogMode,
            Map<String, Object> options);

}
