package it.geosolutions.geobatch.action.egeos.emsa.features;

import java.io.File;
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
import org.opengis.filter.identity.FeatureId;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.vividsolutions.jts.geom.MultiPolygon;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

public class SpillParser {

    // build the xpath extractor
    public final static XPath xpath = XPathFactory.newInstance().newXPath();

    public final static SimpleNamespaceContext ctx = new SimpleNamespaceContext();
    static {
        ctx.setNamespace("gml", "http://www.opengis.net/gml");
        ctx.setNamespace("csn", "http://www.emsa.europa.eu/csndc");
        ctx.setNamespace("ows", "http://www.opengis.net/ows/1.1");
        xpath.setNamespaceContext(ctx);
    }

    private final static  Logger LOGGER = Logging.getLogger(SpillParser.class);

    @SuppressWarnings("unchecked")
    public void parseOilSpill(DataStore store, XPath xpath, File fXmlFile) throws Exception {
        // parse the document into a dom
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        dbFactory.setNamespaceAware(false);
        
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(fXmlFile);
        doc.getDocumentElement().normalize();

        // build the oil spill and insert it
        boolean warning = fXmlFile.getName().contains("OSW");
        SimpleFeatureType oilSpillType = buildOilSpillFeatureType();
        if (!Arrays.asList(store.getTypeNames()).contains(oilSpillType.getTypeName())) {
            store.createSchema(oilSpillType);
        }
        Node oilSpillNode = (Node) xpath.evaluate("OilSpill", doc, XPathConstants.NODE);
        SimpleFeature oilSpill = parseOilSpill(oilSpillType, xpath, oilSpillNode, warning);
        FeatureStore osfs = (FeatureStore) store.getFeatureSource(oilSpillType.getTypeName());
        List<FeatureId> ids = osfs.addFeatures(DataUtilities.collection(oilSpill));
        String fid = ids.get(0).getID();
        long oilSpillId = Long.parseLong(fid.substring(fid.indexOf(".") + 1));

        // it seems warnings do not have a geometry
        if (!warning) {
            // build the oil spill polygons and insert them
            SimpleFeatureType oilSpillPolygonType = buildOilSpillPolygonType();
            if (!Arrays.asList(store.getTypeNames()).contains(oilSpillPolygonType.getTypeName())) {
                store.createSchema(oilSpillPolygonType);
            }
            final NodeList polygonNodes = (NodeList) xpath.evaluate(
                    "OilSpill/geometry/Polygon", doc, XPathConstants.NODESET);
            List<SimpleFeature> oilSpillPolygons = parseOilSpillPolygons(oilSpillPolygonType,
                    xpath, polygonNodes, oilSpillId);
            

            Transaction t = new DefaultTransaction("OilSpill_transaction"+Thread.currentThread().getId());
            FeatureStore ospfs = (FeatureStore) store.getFeatureSource(oilSpillPolygonType
                    .getTypeName());
            ospfs.setTransaction(t);
            try{
                ospfs.addFeatures(DataUtilities.collection(oilSpillPolygons));
                t.commit();
            } catch (Exception e) {
                if(LOGGER.isLoggable(Level.SEVERE))
                    LOGGER.log(Level.SEVERE,e.getLocalizedMessage(),e);
                if (t!=null)
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
    }

    private List<SimpleFeature> parseOilSpillPolygons(SimpleFeatureType ft, XPath xpath,
            NodeList nodeList, long oilSpillId) throws XPathExpressionException {
        List<FeatureMapping> mappings = new ArrayList<FeatureMapping>();
        mappings
                .add(new FeatureMapping(
                        "metaDataProperty/GenericMetaData/extension/area",
                        "extension_area"));
        mappings.add(new FeatureMapping(
                "metaDataProperty/GenericMetaData/extension/width",
                "extension_width"));
        mappings.add(new FeatureMapping(
                "metaDataProperty/GenericMetaData/extension/length",
                "extension_length"));
        mappings.add(new PolygonMapping(".", "spillpolygon"));

        List<SimpleFeature> result = new ArrayList<SimpleFeature>();
        SimpleFeatureBuilder fb = new SimpleFeatureBuilder(ft);
        for (int i = 0; i < nodeList.getLength(); i++) {
            FeatureMapping.mapToFeature(fb, nodeList.item(i), xpath, mappings);
            fb.set("oilspillid", oilSpillId);
            result.add(fb.buildFeature(null));
        }
        return result;
    }

    private SimpleFeature parseOilSpill(SimpleFeatureType ft, XPath xpath,
            Node oilSpillNode, boolean warning) throws XPathExpressionException {
        List<FeatureMapping> mappings = new ArrayList<FeatureMapping>();
        mappings.add(new FeatureMapping("id", "oilspillid"));
        mappings.add(new FeatureMapping("eventid", "eventid"));
        mappings.add(new FeatureMapping("origin", "origin"));
        mappings.add(new FeatureMapping("timeStamp", "timestamp"));
        mappings.add(new FeatureMapping("dataSource", "datasource"));
        mappings.add(new FeatureMapping("extension/area", "extension_area"));
        mappings.add(new FeatureMapping("extension/length", "extension_length"));
        mappings.add(new FeatureMapping("extension/width", "extension_width"));
        mappings.add(new FeatureMapping("extension/alignedWithTrack",
                "extension_alignedwithtrack"));
        mappings.add(new FeatureMapping("extension/orientation", "extension_orientation"));
        mappings.add(new FeatureMapping("extension/volume", "extension_volume"));
        mappings.add(new FeatureMapping("extension/thickness", "extension_thickness"));
        mappings.add(new FeatureMapping("distanceFromCoast", "distance_from_coast"));
        mappings.add(new FeatureMapping("imageIdentifier", "imageid"));
        mappings.add(new FeatureMapping("classificationLevel", "classification_level"));
        mappings.add(new FeatureMapping("composition/oilType", "composition_oiltype"));
        mappings
                .add(new FeatureMapping("composition/oilSubType", "composition_oilsubtype"));
        mappings.add(new FeatureMapping("composition/age", "composition_age"));
        mappings.add(new FeatureMapping("auxiliaryDataRef/auxiliaryData/dataKey",
                "auxiliarydata_key"));
        mappings.add(new FeatureMapping("auxiliaryDataRef/auxiliaryData/dataReference",
                "auxiliarydata_data_reference") {
            @Override
            public Object getValue(XPath xpath, Node root) throws XPathExpressionException {
                // TODO Auto-generated method stub
                Object result = super.getValue(xpath, root);
                return result;
            }
        });
        mappings.add(new FeatureMapping("inSituInformation/inSituValidation",
                "insituinformation_validation"));
        mappings.add(new FeatureMapping("inSituInformation/inSituValidationBody",
                "insituinformation_body"));
        mappings.add(new FeatureMapping("inSituInformation/notes",
                "insituinformation_notes"));
        mappings.add(new FeatureMapping("meteoConditions/meteoWind/dataSource",
                "mc_wind_datasource"));
        mappings.add(new FeatureMapping("meteoConditions/meteoWind/dataType",
                "mc_wind_datatype"));
        mappings.add(new FeatureMapping("meteoConditions/meteoWind/windIntensity",
                "mc_wind_intensity"));
        mappings.add(new FeatureMapping("meteoConditions/meteoWind/windDirection",
                "mc_wind_direction"));
        mappings.add(new FeatureMapping("meteoConditions/SARWind/dataSource",
                "mc_swind_datasource"));
        mappings.add(new FeatureMapping("meteoConditions/SARWind/dataType",
                "mc_swind_datatype"));
        mappings.add(new FeatureMapping("meteoConditions/SARWind/windIntensity",
                "mc_swind_intensity"));
        mappings.add(new FeatureMapping("meteoConditions/SARWind/windDirection",
                "mc_swind_direction"));
        mappings.add(new FeatureMapping("meteoConditions/sea/dataSource",
                "mc_sea_datasource"));
        mappings.add(new FeatureMapping("meteoConditions/sea/dataType",
                "mc_sea_datatype"));
        mappings.add(new FeatureMapping("meteoConditions/sea/waveLength",
                "mc_sea_wavelength"));
        mappings.add(new FeatureMapping("meteoConditions/sea/waveHeight",
                "mc_sea_waveheight"));
        mappings.add(new FeatureMapping("meteoConditions/sea/waveDirection",
                "mc_sea_wavedirection"));
        mappings.add(new FeatureMapping("meteoConditions/sea/currentIntensity",
                "mc_sea_currentintesity"));
        mappings.add(new FeatureMapping("meteoConditions/sea/currentDirection",
                "mc_sea_currentdirection"));
        mappings.add(new DirectPositionMapping("center/pos", "center"));
        mappings.add(new PolygonArrayMapping("geometry/Polygon", "geometry"));
        SimpleFeatureBuilder fb = new SimpleFeatureBuilder(ft);
        FeatureMapping.mapToFeature(fb, oilSpillNode, xpath, mappings);
        fb.set("warning", warning);

        SimpleFeature f = fb.buildFeature(null);
        return f;
    }

    private SimpleFeatureType buildOilSpillFeatureType() throws Exception {
        // build the target feature type
        SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
        tb.add("oilspillid", String.class);
        tb.add("eventid", String.class);
        tb.add("warning", Boolean.class);
        tb.length(9);
        tb.add("origin", String.class);
        tb.add("center", Point.class, CRS.decode("EPSG:4326", true));
        tb.add("geometry", MultiPolygon.class, CRS.decode("EPSG:4326", true));
        tb.add("timestamp", java.sql.Timestamp.class);
        tb.add("datasource", String.class);
        tb.add("extension_area", Double.class);
        tb.add("extension_length", Double.class);
        tb.add("extension_width", Double.class);
        tb.length(7);
        tb.add("extension_slicktype", String.class);
        tb.add("extension_alignedwithtrack", Boolean.class);
        tb.add("extension_orientation", Double.class);
        tb.length(6);
        tb.add("extension_volume", String.class);
        tb.add("extension_thickness", Double.class);
        tb.add("distance_from_coast", Double.class);
        tb.add("imageid", String.class);
        tb.add("keywords_type", String.class);
        tb.length(1024);
        tb.add("keywords", String.class);
        tb.add("classification_level", Double.class);
        tb.length(16);
        tb.add("composition_oiltype", String.class);
        tb.length(4);
        tb.add("composition_oilsubtype", String.class);
        tb.add("composition_age", String.class);
        tb.add("auxiliarydata_key", String.class);
        tb.add("auxiliarydata_data_reference", String.class);
        tb.length(16);
        tb.add("insituinformation_validation", String.class);
        tb.add("insituinformation_body", String.class);
        tb.add("insituinformation_notes", String.class);
        tb.add("mc_wind_datasource", String.class);
        tb.add("mc_wind_datatype", String.class);
        tb.add("mc_wind_intensity", Double.class);
        tb.add("mc_wind_direction", Integer.class);
        tb.add("mc_swind_datasource", String.class);
        tb.add("mc_swind_datatype", String.class);
        tb.add("mc_swind_intensity", Double.class);
        tb.add("mc_swind_direction", Integer.class);
        tb.add("mc_sea_datasource", String.class);
        tb.add("mc_sea_datatype", String.class);
        tb.add("mc_sea_wavelength", Double.class);
        tb.add("mc_sea_waveheight", Double.class);
        tb.add("mc_sea_wavedirection", Integer.class);
        tb.add("mc_sea_currentintesity", String.class);
        tb.add("mc_sea_currentdirection", Integer.class);
        tb.setName("oilspill");
        SimpleFeatureType ft = tb.buildFeatureType();
        return ft;
    }

    private SimpleFeatureType buildOilSpillPolygonType() throws Exception {
        // build the target feature type
        SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
        tb.setName("oilspillpolygon");
        tb.add("oilspillid", Long.class);
        tb.add("spillpolygon", Polygon.class, CRS.decode("EPSG:4326", true));
        tb.add("extension_area", Double.class);
        tb.add("extension_length", Double.class);
        tb.add("extension_width", Double.class);

        SimpleFeatureType ft = tb.buildFeatureType();
        return ft;
    }

}
