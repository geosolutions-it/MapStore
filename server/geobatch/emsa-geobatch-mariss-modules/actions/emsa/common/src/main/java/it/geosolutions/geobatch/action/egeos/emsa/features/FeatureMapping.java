package it.geosolutions.geobatch.action.egeos.emsa.features;

import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;

import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.w3c.dom.Node;

/**
 * Maps an xpath into a feature attribute. Subclasses might perform data conversions
 */
class FeatureMapping {
    String xpath;

    String destName;

    /**
     * Convinience constructor, assumes
     * 
     * @param name
     */
    public FeatureMapping(String name) {
        this.xpath = name;
        this.destName = name;
    }

    public FeatureMapping(String xpath, String destName) {
        this.xpath = xpath;
        this.destName = destName;
    }

    public Object getValue(XPath xpath, Node root) throws XPathExpressionException {
        final Node node = (Node) xpath.evaluate(this.xpath, root, XPathConstants.NODE);
        if (node != null) {
            return node.getTextContent();
        } else {
            return null;
        }
    }

    public static void mapToFeature(SimpleFeatureBuilder fb, Node node, XPath xpath,
            List<FeatureMapping> mappings) throws XPathExpressionException {
        for (FeatureMapping mapping : mappings) {
            fb.set(mapping.destName, mapping.getValue(xpath, node));
        }
    }

}