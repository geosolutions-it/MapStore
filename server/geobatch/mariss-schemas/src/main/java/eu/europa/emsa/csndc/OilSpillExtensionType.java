//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2014.06.13 at 10:49:44 AM CEST 
//


package eu.europa.emsa.csndc;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;
import net.opengis.gml.AbstractMetaDataType;


/**
 * Extension and shape parameters associated with the Oil Spill
 * 
 * <p>Java class for OilSpillExtensionType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="OilSpillExtensionType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.opengis.net/gml}AbstractMetaDataType">
 *       &lt;sequence>
 *         &lt;element name="area" type="{http://www.emsa.europa.eu/csndc}AreaType" minOccurs="0"/>
 *         &lt;element name="length" type="{http://www.emsa.europa.eu/csndc}LengthType" minOccurs="0"/>
 *         &lt;element name="width" type="{http://www.emsa.europa.eu/csndc}LengthType" minOccurs="0"/>
 *         &lt;element name="alignedWithTrack" type="{http://www.w3.org/2001/XMLSchema}boolean" minOccurs="0"/>
 *         &lt;element name="orientation" type="{http://www.emsa.europa.eu/csndc}OrientationType" minOccurs="0"/>
 *         &lt;element name="volume" minOccurs="0">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;enumeration value="0-10"/>
 *               &lt;enumeration value="10-100"/>
 *               &lt;enumeration value=">100"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="thickness" type="{http://www.opengis.net/gml}MeasureType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "OilSpillExtensionType")
public class OilSpillExtensionType
    extends AbstractMetaDataType
{


}
