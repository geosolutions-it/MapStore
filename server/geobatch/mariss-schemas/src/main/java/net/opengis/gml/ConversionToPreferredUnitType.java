//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2014.06.13 at 10:49:44 AM CEST 
//


package net.opengis.gml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * Relation of a unit to the preferred unit for this quantity type, specified by an arithmetic conversion (scaling and/or offset). A preferred unit is either a base unit or a derived unit selected for all units of one quantity type. The mandatory attribute "uom" shall reference the preferred unit that this conversion applies to. The conversion is specified by one of two alternative elements: "factor" or "formula".
 * 
 * <p>Java class for ConversionToPreferredUnitType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ConversionToPreferredUnitType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.opengis.net/gml}UnitOfMeasureType">
 *       &lt;choice>
 *         &lt;element name="factor" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="formula" type="{http://www.opengis.net/gml}FormulaType"/>
 *       &lt;/choice>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ConversionToPreferredUnitType", propOrder = {
    "factor",
    "formula"
})
public class ConversionToPreferredUnitType
    extends UnitOfMeasureType
{

    protected Double factor;
    protected FormulaType formula;

    /**
     * Gets the value of the factor property.
     * 
     * @return
     *     possible object is
     *     {@link Double }
     *     
     */
    public Double getFactor() {
        return factor;
    }

    /**
     * Sets the value of the factor property.
     * 
     * @param value
     *     allowed object is
     *     {@link Double }
     *     
     */
    public void setFactor(Double value) {
        this.factor = value;
    }

    /**
     * Gets the value of the formula property.
     * 
     * @return
     *     possible object is
     *     {@link FormulaType }
     *     
     */
    public FormulaType getFormula() {
        return formula;
    }

    /**
     * Sets the value of the formula property.
     * 
     * @param value
     *     allowed object is
     *     {@link FormulaType }
     *     
     */
    public void setFormula(FormulaType value) {
        this.formula = value;
    }

}
