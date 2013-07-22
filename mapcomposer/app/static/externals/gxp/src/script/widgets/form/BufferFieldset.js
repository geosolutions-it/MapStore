/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/** api: (define)
 *  module = gxp.widgets.form
 *  class = BufferFieldset
 */
Ext.namespace('gxp.widgets.form');

/** api: constructor
 *  .. class:: BufferFieldset(config)
 *   
 *    Buffer fieldset
 */
gxp.widgets.form.BufferFieldset = Ext.extend(Ext.form.FieldSet,  {

    /** api: ptype = gxp_bufferfieldset */
    ptype: "gxp_bufferfieldset",
    
    /** api: config[id]
     *  ``String``
     */
    id: "bufferFieldSet",
	
	/** api: config[bufferFieldLabel]
     * ``String``
     * Text for buffer number field label.
     */ 	 
	bufferFieldLabel: "Buffer Range",
	
	/** api: config[bufferFieldSetTitle]
     * ``String``
     * Text for buffer field set title.
     */ 
	bufferFieldSetTitle: "Buffer",

	/** api: config[coordinatePickerLabel]
     * ``String``
     * Text for coordinate picker label.
     */ 
	coordinatePickerLabel: "Coordinates",
	
    /** api: config[errorBufferText]
     * ``String``
     * Text for buffer error text.
     */ 
	map: null,
	
	/** api: config[outputSRS]
     * ``String``
     * coordinates output SRS.
     */ 
	outputSRS: "EPSG:4326",
	
	/** api: config[selectStyle]
     * ``String``
     * Default Style.
     */ 
	selectStyle: {
		strokeColor: "#FF0000",
		handlerFillColor: "#FFFFFF",
		fillColor: "#FFFFFF",
		fillOpacity: 0,
		strokeWidth: 2
	},
	
	/** api: config[minValue]
     * ``String``
     * Min buffer range.
     */ 
	minValue: 1,

	/** api: config[maxValue]
     * ``String``
     * Max buffer range.
     */ 
	maxValue: 1000,
	
   /** api: config[decimalPrecision]
     * ``String``
     * Default decimal precision for the buffer number.
     */ 
	decimalPrecision: 0,
	
    /** 
	 * private: method[initComponent]
     */
    initComponent: function() {
		this.coordinatePicker = new gxp.widgets.form.CoordinatePicker({
			map: this.map,
			fieldLabel: this.coordinatePickerLabel,
			outputSRS: this.outputSRS,
			selectStyle: this.selectStyle,
			ref: "coordinatePicker",
			listeners: {
				scope: this,
				update: function(){
					this.bufferField.enable();
				},				
				reset: function(){
					this.bufferField.disable();
					this.bufferField.reset();
				}
			}
		});
	
		this.bufferField = new Ext.form.NumberField({
			fieldLabel: this.bufferFieldLabel,
			name: 'buffer',
			ref: 'bufferField',
			allowBlank: false,
			disabled: true,
			minValue: this.minValue,
            maxValue: this.maxValue,
		    decimalPrecision: this.decimalPrecision,
			allowDecimals: true,
			hideLabel : false
		});
		
		this.items = [
			this.coordinatePicker,
			this.bufferField
		];
        
		this.title = this.bufferFieldSetTitle;
		
		gxp.widgets.form.BufferFieldset.superclass.initComponent.call(this);
    },
	
	isValid: function(){
		return(this.coordinatePicker.isValid() &&
			this.bufferField.isValid());
	},
	
	resetPointSelection: function(){
		this.coordinatePicker.resetPoint();
	}
});

Ext.reg("gxp_bufferfieldset", gxp.widgets.form.BufferFieldset);
