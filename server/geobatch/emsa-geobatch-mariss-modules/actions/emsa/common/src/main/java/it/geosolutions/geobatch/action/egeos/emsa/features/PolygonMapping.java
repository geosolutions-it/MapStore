package it.geosolutions.geobatch.action.egeos.emsa.features;

import java.util.regex.Pattern;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;

import org.geotools.geometry.jts.LiteCoordinateSequence;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LinearRing;

/**
 * Parses a gml:Polygon into a Polygon
 * 
 * @author Andrea Aime
 * 
 */
public class PolygonMapping extends FeatureMapping {

    public PolygonMapping(String xpath, String destName) {
        super(xpath, destName);
    }

    public PolygonMapping(String name) {
        super(name);
    }

    public Object getValue(XPath xpath, Node root) throws XPathExpressionException {
        GeometryFactory gf = new GeometryFactory();
        try {
            String ordinates = (String) xpath.evaluate("gml:exterior/gml:LinearRing/gml:posList", root,
                    XPathConstants.STRING);
            if (ordinates == null || ordinates.length() == 0) {
                ordinates = (String) xpath.evaluate("exterior/LinearRing/posList", root,
                        XPathConstants.STRING);
            }

            double[] doubles = parseRingOrdinates(ordinates);
            LinearRing shell = gf.createLinearRing(new LiteCoordinateSequence(doubles));

            NodeList interiorNodes = (NodeList) xpath.evaluate("gml:interior/gml:LinearRing/gml:posList", root,
                    XPathConstants.NODESET);
            if (interiorNodes == null) {
                interiorNodes = (NodeList) xpath.evaluate("interior/LinearRing/posList", root,
                        XPathConstants.NODESET);
            }
            LinearRing[] holes = new LinearRing[interiorNodes.getLength()];
            for (int j = 0; j < holes.length; j++) {
                doubles = parseRingOrdinates(interiorNodes.item(j).getTextContent());
                holes[j] = gf.createLinearRing(new LiteCoordinateSequence(doubles));
            }

            return gf.createPolygon(shell, holes);
        } catch (Exception e) {
            double[] doubles = new double[] {0, 0, 0, 0};
            LinearRing shell = gf.createLinearRing(new LiteCoordinateSequence(doubles));
            return gf.createPolygon(shell, new LinearRing[0]);
        }
    }

    /**
     * NOTE:
     *      THIS IS PROBABLY SPECIFIC FOR EMSA
     *      
     * @param ordinates
     * @return
     */
    protected double[] parseRingOrdinates(String ordinates) {
        String[] strarr = Pattern.compile("[\\s\\n]+", Pattern.DOTALL).split(ordinates.trim());
        double[] doubles = new double[strarr.length];
        if (doubles.length >= 4) {
            for (int j = 0; j < strarr.length; j++) {
                doubles[j] = Double.parseDouble(strarr[j]);
            }
            // check if the ordinates form a closed ring, if not, fix it
            if (doubles[0] != doubles[doubles.length - 2] || doubles[1] != doubles[doubles.length - 1]) {
                double[] tmp = new double[doubles.length + 2];
                System.arraycopy(doubles, 0, tmp, 0, doubles.length);
                /*
                 *      Here we suppose that data is stored in the format:
                 *      - Lat Lon
                 *      
                 * NOTE:
                 *      THIS IS PROBABLY SPECIFIC FOR 'EMSA'
                 * 
                 *      Take a look into the xml files located into DER packages
                 */
                tmp[doubles.length] = doubles[1];
                tmp[doubles.length + 1] = doubles[0];
                doubles = tmp;
            }
        
            return doubles;
        }
        return null;
    }

}
