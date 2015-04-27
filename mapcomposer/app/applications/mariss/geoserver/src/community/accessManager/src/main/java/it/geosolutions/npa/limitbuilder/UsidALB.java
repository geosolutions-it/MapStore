package it.geosolutions.npa.limitbuilder;

import it.geosolutions.npa.service.USIDService;
import it.geosolutions.security.alb.limitbuilder.AccessLimitBuilder;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.geoserver.catalog.CoverageInfo;
import org.geoserver.catalog.FeatureTypeInfo;
import org.geoserver.catalog.ResourceInfo;
import org.geoserver.catalog.WMSLayerInfo;
import org.geoserver.security.CatalogMode;
import org.geoserver.security.CoverageAccessLimits;
import org.geoserver.security.DataAccessLimits;
import org.geoserver.security.VectorAccessLimits;
import org.geoserver.security.WMSAccessLimits;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.geotools.util.logging.Logging;
import org.opengis.filter.Filter;
import org.opengis.filter.FilterFactory2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

/**
 * Access Limit Builder that gets limits from the database
 * 
 * @author Lorenzo Natali, GeoSolutions
 * @author Stefano Costa
 *
 */
public class UsidALB implements AccessLimitBuilder {

	private static final Logger LOGGER = Logging.getLogger(UsidALB.class);
	/**
	 * Filter to use when on write operations
	 */
	private static final Filter WRITE_DEFAULT = Filter.EXCLUDE;
	/**
	 * Filter to use when no geometry is defined for read
	 */
	private static final Filter READ_DEFAULT = Filter.EXCLUDE;
	
	/**
	 * The format string to use when no "cql_filter" options was specified 
	 */
	private static final String DEFAULT_CQL_FILTER_MODEL = "usid IN (%s)";

	private USIDService usidService;

	public final static FilterFactory2 FF = CommonFactoryFinder
			.getFilterFactory2();

	/**
	 * Determines access limits based on the role-USID associations stored in the database.
	 * Write access is always denied and read access is filtered according to the following
	 * procedure.
	 * <p>
	 * {@link USIDService#getUsidForRole(String)} method is invoked once for each role 
	 * associated to the user who requested the data. The returned USID values are 
	 * treated as strings and concatenated in a comma-separated list.
	 * </p>
	 * 
	 * <p>
	 * Then a CQL filter is built according to the pattern specified in the access rule 
	 * configuration.
	 * </p> 
	 * <p>
	 * For example, supposing that the user requesting the data has been granted access to 
	 * USIDs 261 and 481, a configuration like the following:
	 * </p> 
	 * <p>
	 * &nbsp;&nbsp;...<br>
	 * &nbsp;&nbsp;&lt;options&gt;<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp;&lt;option name="cql_filter"&gt;usid in (%s)&lt;/option&gt;<br>
	 * &nbsp;&nbsp;&lt;/options&gt;<br>
	 * &nbsp;&nbsp;...
	 * </p>
	 * <p>
	 * <p>
	 * will generate this CQL filter:
	 * <p>
	 * <p>
	 * &nbsp;&nbsp;usid in ('261', '481')<br>
	 * </p>
	 * <p>
	 * Finally, the generated CQL filter is passed to the proper subclass of
	 * {@link DataAccessLimits}, which is then returned to the caller.
	 * </p>
	 */
	@Override
	public DataAccessLimits buildAccessLimits(Authentication user,
			ResourceInfo resource, CatalogMode catalogMode,
			Map<String, Object> options) {
	    
	        options = (options != null) ? options : new HashMap<String, Object>();
		Filter f = null;
		//get usid for role
		try {
		    if (user != null) {
		        List<Object> usids = new ArrayList<Object>();
                        for (GrantedAuthority ga : user.getAuthorities()) {
                                String role = ga.getAuthority();
                                Collection<Object> tmp = usidService.getUsidForRole(role);
                                usids.addAll(tmp);
                        }
                        logusids(usids);
                        String cql_filter_model = (String) options.get("cql_filter");
                        if (cql_filter_model == null || cql_filter_model.isEmpty()) {
                            cql_filter_model = DEFAULT_CQL_FILTER_MODEL;
                        }
                        StringWriter writer = new StringWriter();
                        int size = usids.size();
                        if(size > 0){
                                for (int i = 0; i < size; i++) {
                                        Object usid = usids.get(i);
                                        writer.append("'");
                                        writer.append(usid.toString());
                                        writer.append("'");
                                        if (i != size - 1) {
                                                writer.append(",");
                                        }
                                }
        
                                String cql_filter = String.format(cql_filter_model,
                                                writer.toString());
                                f = ECQL.toFilter(cql_filter);
                        }
		    }
		} catch (IOException e) {
			LOGGER.log(Level.SEVERE, "error creating the access filter", e);
		} catch (CQLException e) {
			LOGGER.log(Level.SEVERE, "error creating the access filter", e);
		}
		if (f == null) {
			f = READ_DEFAULT;
		}

		if (resource instanceof FeatureTypeInfo) {
			return new VectorAccessLimits(catalogMode, null, f, null,
					WRITE_DEFAULT);

		// RASTER
		} else if (resource instanceof CoverageInfo) {
			
			return new CoverageAccessLimits(catalogMode, f, null, null);

		} else if (resource instanceof WMSLayerInfo) {
		        return new WMSAccessLimits(catalogMode, f, null, true);

		} else {
			throw new IllegalArgumentException(
					"Don't know how to handle resource " + resource);
		}
	}

	/**
	 * 
	 * @param usids
	 */
	private void logusids(List<Object> usids) {
		if (LOGGER.isLoggable(Level.FINE)) {
			for (Object o : usids) {
				LOGGER.log(Level.FINE, "usid:" + o.toString());
				String st = o.toString();
				System.out.print(st);
			}
			LOGGER.log(Level.FINE, "************");
		}
	}

	/**
	 * @return the usidService
	 */
	public USIDService getUsidService() {
		return usidService;
	}

	/**
	 * @param usidService
	 *            the usidService to set
	 */
	public void setUsidService(USIDService usidService) {
		this.usidService = usidService;
	}

	@Override
	public DataAccessLimits buildAccessLimits(Authentication user,
			ResourceInfo resource, CatalogMode catalogMode) {
		return buildAccessLimits(user, resource, catalogMode, null);
	}

}
