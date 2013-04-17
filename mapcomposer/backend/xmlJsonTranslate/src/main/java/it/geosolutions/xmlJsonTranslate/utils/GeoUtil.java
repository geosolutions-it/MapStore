
package it.geosolutions.xmlJsonTranslate.utils;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import com.vividsolutions.jts.io.WKTWriter;

public class GeoUtil {
    
    public static Geometry geoDataParse(String type, String geoData) throws ParseException{

        if(type.equalsIgnoreCase("WKT")) {
            return new WKTReader().read(geoData);
        }
    
      return null;
    }
    
    
    public static String geometryWrite(String type, Geometry geometry){
        
       if(type.equalsIgnoreCase("WKT")) {
            return new WKTWriter().write(geometry);
       }
        
      return null;
    }
    
}
