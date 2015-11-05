package it.geosolutions.geobatch.mariss.actions.netcdf;

import java.util.Map;

public class ConfigurationUtils {

    public final static String DEFAULT_NAMESPACE_KEY = "defaultNameSpace.key";

    public final static String DEFAULT_NAMESPACE_URI_KEY = "defaultNameSpaceUri.key";

    public final static String PATTERN_KEY = "Pattern.key";

    public final static String ACTION_CLASS_KEY = "ActionClass.key";

    public final static String NETCDF_DIRECTORY_KEY = "NetCDFDir.key";

    public final static String GEOTIFF_DIRECTORY_KEY = "GeoTiffDir.key";

    public final static String SHIPDETECTIONS_DIRECTORY_KEY = "ShipDetections.key";
    
    public final static String OILSPILLS_DIRECTORY_KEY = "OilSpills.key";

    public final static String OPTIMIZATION_OPTION = "importer_options.key";

    public static String getAction(Map<String, String> container) {
        if (container != null) {
            return container.get(ACTION_CLASS_KEY);
        }
        return null;
    }

    public static String getDefaulNameSpace(Map<String, String> container) {
        if (container != null) {
            return container.get(DEFAULT_NAMESPACE_KEY);
        }
        return null;
    }

    public static String getDefaulNameSpaceURI(Map<String, String> container) {
        if (container != null) {
            return container.get(DEFAULT_NAMESPACE_URI_KEY);
        }
        return null;
    }

    public static String getNetCDFDirectory(Map<String, String> container) {
        if (container != null) {
            return container.get(NETCDF_DIRECTORY_KEY);
        }
        return null;
    }

    public static String getPattern(Map<String, String> container) {
        if (container != null) {
            return container.get(PATTERN_KEY);
        }
        return null;
    }

    private ConfigurationUtils() {
    }
}
