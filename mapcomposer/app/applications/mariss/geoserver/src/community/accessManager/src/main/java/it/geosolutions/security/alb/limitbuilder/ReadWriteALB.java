package it.geosolutions.security.alb.limitbuilder;


import java.util.Map;

import org.geoserver.catalog.CoverageInfo;
import org.geoserver.catalog.FeatureTypeInfo;
import org.geoserver.catalog.ResourceInfo;
import org.geoserver.catalog.WMSLayerInfo;
import org.geoserver.security.CatalogMode;
import org.geoserver.security.CoverageAccessLimits;
import org.geoserver.security.DataAccessLimits;
import org.geoserver.security.VectorAccessLimits;
import org.geoserver.security.WMSAccessLimits;
import org.opengis.filter.Filter;
import org.springframework.security.core.Authentication;

/**
 * Simple access limit builder that can be configured to allow/deny read/write
 * on a resource
 * @author nali
 *
 */
public class ReadWriteALB implements AccessLimitBuilder {
    private boolean canRead = true;
    private boolean canWrite = false;

    @Override
    public DataAccessLimits buildAccessLimits(Authentication user, ResourceInfo resource,
            CatalogMode catalogMode) {
        // basic filter
        Filter readFilter = canRead ? Filter.INCLUDE : Filter.EXCLUDE ;
        Filter writeFilter = canWrite ? Filter.INCLUDE : Filter.EXCLUDE ;
        if (resource instanceof FeatureTypeInfo)
        {
            ((FeatureTypeInfo) resource).getAttributes();

            return new VectorAccessLimits(catalogMode, null, readFilter, null,
                    writeFilter);
        }
        else if (resource instanceof CoverageInfo)
        {
           

            return new CoverageAccessLimits(catalogMode, readFilter, null, null);
        }
        else if (resource instanceof WMSLayerInfo)
        {
            

            return new WMSAccessLimits(catalogMode, readFilter, null, true);
        }
        else
        {
            throw new IllegalArgumentException("Don't know how to handle resource " + resource);
        }
    }

    /**
     * @return the canRead
     */
    public boolean isCanRead() {
        return canRead;
    }

    /**
     * @param canRead the canRead to set
     */
    public void setCanRead(boolean canRead) {
        this.canRead = canRead;
    }

    /**
     * @return the canWrite
     */
    public boolean isCanWrite() {
        return canWrite;
    }

    /**
     * @param canWrite the canWrite to set
     */
    public void setCanWrite(boolean canWrite) {
        this.canWrite = canWrite;
    }

	@Override
	public DataAccessLimits buildAccessLimits(Authentication user,
			ResourceInfo resource, CatalogMode catalogMode,
			Map<String, Object> options) {
		// TODO manage options
		return buildAccessLimits(user, resource, catalogMode);
	}

   
}
