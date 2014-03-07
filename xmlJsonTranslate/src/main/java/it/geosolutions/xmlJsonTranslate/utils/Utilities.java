package it.geosolutions.xmlJsonTranslate.utils;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
/**
 * Utilities Class to support XML/JSON translation 
 * for GeoExplorer Configuration
 * @author Lorenzo Natali
 * 
 *
 */
public final class Utilities {

	private Utilities() {
		
	}

	/**
	 * This function converts String XML to Document object
	 * @param in - XML String
	 * @return Document object
	 */
	public static Document parseXmlFile(String in) {
	    try {
	        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	        DocumentBuilder db = dbf.newDocumentBuilder();
	        InputSource is = new InputSource(new StringReader(in));
	        return db.parse(is);
	    } catch (ParserConfigurationException e) {
	        throw new RuntimeException(e);
	    } catch (SAXException e) {
	        throw new RuntimeException(e);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	    
	    return null;
	}
	
	/**
     * This function moves a Node (by tag name) 
     * as First Child of another Node (by tag name too)
     * Needed to put sources on top in FDH addLayers configuration.
     * @param d - Document object
     * @param destTagName Tag name of Destination Node
     * @param firstTagName Tag name of the Node that will be put at First.
     * 
     */
	public static void putAtFirst(Document d,String destTagName,String firstTagName) throws DOMException  {
    	
    	Node s= d.getElementsByTagName(destTagName).item(0);
		Node firstEl= s.getFirstChild();		
		Node fdh=d.getElementsByTagName(firstTagName).item(0);
		s.removeChild(fdh);
		s.insertBefore(fdh, firstEl);
	    
    }

}
