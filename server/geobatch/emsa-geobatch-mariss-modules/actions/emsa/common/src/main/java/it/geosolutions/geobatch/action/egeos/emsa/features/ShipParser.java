package it.geosolutions.geobatch.action.egeos.emsa.features;


import java.io.File;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.geotools.data.DataStore;
import org.geotools.data.DataUtilities;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.FeatureStore;
import org.geotools.data.Transaction;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.CRS;
import org.geotools.util.logging.Logging;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.vividsolutions.jts.geom.Point;

public class ShipParser {
    private final static  Logger LOGGER = Logging.getLogger(ShipParser.class);

    // build the xpath extractor
    public final static XPath xpath = XPathFactory.newInstance().newXPath();
    public final static SimpleNamespaceContext ctx = new SimpleNamespaceContext();
    static {
        ctx.setNamespace("gml", "http://www.opengis.net/gml");
        ctx.setNamespace("csn", "http://www.emsa.europa.eu/csndc");
        ctx.setNamespace("ows", "http://www.opengis.net/ows/1.1");
        xpath.setNamespaceContext(ctx);
    }
    
    @SuppressWarnings("unchecked")
    public void parseShip(DataStore store, XPath xpath, File fXmlFile) throws Exception {
        try {
            // parse the document into a dom
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            dbFactory.setNamespaceAware(true);
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(fXmlFile);
            doc.getDocumentElement().normalize();
        
            // build the ship and insert it
            SimpleFeatureType shipType = buildShipFeatureType();
            if (!Arrays.asList(store.getTypeNames()).contains(shipType.getTypeName())) {
                store.createSchema(shipType);
            }
            Node shipNode = (Node) xpath.evaluate("/csn:Ship", doc, XPathConstants.NODE);
            SimpleFeature ship = parseShip(shipType, xpath, shipNode);
            
            Transaction t = new DefaultTransaction("ship_transaction"+Thread.currentThread().getId());
            FeatureStore fs = (FeatureStore) store.getFeatureSource(shipType.getTypeName());
            fs.setTransaction(t);
            try{
                fs.addFeatures(DataUtilities.collection(ship));
                t.commit();
            } catch (Exception e) {
                if(LOGGER.isLoggable(Level.SEVERE))
                    LOGGER.log(Level.SEVERE,e.getLocalizedMessage(),e);                
                t.rollback();
            } finally {
                if (t!=null){
                    try{
                        t.close();
                    }
                    catch (Throwable tr){
                        if(LOGGER.isLoggable(Level.SEVERE))
                            LOGGER.log(Level.SEVERE,tr.getLocalizedMessage(),tr);
                    }
                }
            }

            
        }
        catch(Exception e){
            if(LOGGER.isLoggable(Level.SEVERE))
                LOGGER.log(Level.SEVERE,e.getLocalizedMessage(),e);
        }
    }

    private SimpleFeature parseShip(SimpleFeatureType ft, XPath xpath, Node oilSpillNode)
            throws XPathExpressionException {
        List<FeatureMapping> mappings = new ArrayList<FeatureMapping>();
        mappings.add(new FeatureMapping("csn:id", "gmlid"));
        mappings.add(new FeatureMapping("csn:id", "id"));
        mappings.add(new FeatureMapping("csn:includeInReport", "include_in_report"));
        mappings.add(new FeatureMapping("csn:positionAccuracyVector/csn:x", "position_accuracy_x"));
        mappings.add(new FeatureMapping("csn:positionAccuracyVector/csn:y", "position_accuracy_y"));
        mappings.add(new FeatureMapping("csn:timeStamp", "timestamp"));
        mappings.add(new FeatureMapping("csn:heading", "heading"));
        mappings.add(new FeatureMapping("csn:speed", "speed"));
        mappings.add(new FeatureMapping("csn:length", "speed"));
        mappings.add(new FeatureMapping("csn:lengthError", "length_error"));
        mappings.add(new FeatureMapping("csn:width", "width"));
        mappings.add(new FeatureMapping("csn:widthError", "width_error"));
        mappings.add(new FeatureMapping("csn:confidenceLevel", "confidence_level"));
        mappings.add(new FeatureMapping("csn:imageIdentifier", "imageid"));
        mappings.add(new FeatureMapping("csn:detectionParameters/csn:RCS", "detection_param_rcs"));
        mappings.add(new FeatureMapping("csn:detectionParameters/csn:maxPixelValue",
                "detection_param_maxpixelvalue"));
        mappings.add(new DirectPositionMapping("gml:pos", "pos"));

        SimpleFeatureBuilder fb = new SimpleFeatureBuilder(ft);
        FeatureMapping.mapToFeature(fb, oilSpillNode, xpath, mappings);

        SimpleFeature f = fb.buildFeature(null);
        return f;
    }

    private SimpleFeatureType buildShipFeatureType() throws Exception {
        // build the target feature type
        SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
        tb.setName("ship");
        tb.add("gmlid", String.class);
        tb.add("id", String.class);
        tb.add("include_in_report", Boolean.class);
        tb.add("pos", Point.class, CRS.decode("EPSG:4326", true));
        tb.add("position_accuracy_x", Double.class);
        tb.add("position_accuracy_y", Double.class);
        tb.add("timestamp", Timestamp.class);
        tb.add("heading", Integer.class);
        tb.add("speed", Double.class);
        tb.add("length", Double.class);
        tb.add("length_error", Double.class);
        tb.add("width", Double.class);
        tb.add("width_error", Double.class);
        tb.add("confidence_level", Double.class);
        tb.add("imageid", String.class);
        tb.add("detection_param_rcs", Double.class);
        tb.add("detection_param_maxpixelvalue", Double.class);
        tb.add("ship_thumbnail", String.class);
        SimpleFeatureType ft = tb.buildFeatureType();
        return ft;
    }

}
