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

	/**
     * Property: buttonIconCls
     * {String} Icon of the selection Button
     *     
     */
    buttonIconCls:'gx-buffer',

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

    /** api: config[draweBufferTooltip]
     * ``String``
     * Text for draw buffer button tooltip.
     */ 
	draweBufferTooltip: "Draw the Buffer",
	/** api: config[selectScenarioLabel]
     * ``String``
     * Text for the scenario mode tooltip.
     */ 
	selectScenarioLabel: "Scegli Sostanza / Scenario",
    
    uomLabel: "Metri",

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

	/** api: config[selectLayerName]
     * ``String``
     * Text for buffer layer.
     */ 
	selectLayerName: "buffer-layer",

    /** api: config[displayInLayerSwitcher]
     * ``String``
     */ 
	displayInLayerSwitcher: false,

	/** api: config[selectStyle]
     * ``String``
     * Default Style.
     */ 
	selectStyle: {
		strokeColor: "#DF9206",
		handlerFillColor: "#DF9206",
		fillColor: "#DF9206",
		fillOpacity: 0.7,
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

	/** api: config[radiusMode]
     * ``String``
     * Radius selection mode (user / scenario).
     */ 
	radiusMode: 'user',

    /** 
	 * private: method[initComponent]
     */
    initComponent: function() {
		this.coordinatePicker = new gxp.widgets.form.CoordinatePicker({
			map: this.map,
			fieldLabel: this.coordinatePickerLabel,
			outputSRS: this.outputSRS,
			selectStyle: this.selectStyle,
			toggleGroup: this.toggleGroup,
			ref: "coordinatePicker",
			listeners: {
				scope: this,
				update: function(){
					if(this.radiusMode === 'user') {
						this.bufferField.enable();
						this.resetBuffer();	
					} else if(this.bufferField.getValue()) {
						this.drawNewBuffer(false);
					}
				},				
				reset: function(){
					if(this.radiusMode === 'user') {
						this.bufferField.disable();
						this.bufferField.reset();
					}
				}
			}
		});

		this.bufferField = new Ext.form.NumberField({
			name: 'buffer',
			ref: 'bufferField',
			allowBlank: false,
			disabled: true,
			width: 112,
			flex: 1,
			minValue: this.minValue,
            maxValue: this.maxValue,
			enableKeyEvents: true,
		    decimalPrecision: this.decimalPrecision,
			allowDecimals: true,
			hideLabel : false,
			listeners: {
				scope: this,
				keypress: function(){
					this.compositeField.clickToggle.toggle(false);
				}
			}
		});

	    this.compositeField = new Ext.form.CompositeField({
		    fieldLabel: this.bufferFieldLabel,
			items: [
				this.bufferField,
                {
                	xtype: 'label',
                	height: 30,
                	ref: 'uomLabel',
                	text: this.uomLabel
                },
				{
                    xtype: 'button',
					ref: 'clickToggle',
                    tooltip: this.draweBufferTooltip,
                    iconCls: this.buttonIconCls,
                    enableToggle: true,
                    toggleGroup: this.toggleGroup,
                    width:20,
                    listeners: {
						scope: this, 
                        toggle: function(button, pressed) {  
							if(pressed){
								if(this.isValid()){									
									this.drawNewBuffer(true);
								}else{
									this.compositeField.clickToggle.toggle(false);
								}
					        }else{
								this.resetBuffer();
					        }
					    }
                    }
                }, {
                	xtype: 'label',
                	height: 30,
                	ref: 'scenarioLabel',
                	text: this.selectScenarioLabel,
                	hidden: true
                }
			]
		});

		this.items = [
			this.coordinatePicker,
			this.compositeField
		];
        
		this.title = this.bufferFieldSetTitle;

		gxp.widgets.form.BufferFieldset.superclass.initComponent.call(this);
    },

    setRadiusMode: function(mode, radius) {
    	this.radiusMode = mode;
    	if(mode === 'user') {
    		this.bufferField.disable();
    		this.bufferField.setReadOnly(false);
    		this.compositeField.clickToggle.show();
    		//this.compositeField.scenarioLabel.hide();
            this.compositeField.doLayout();
    	} else {
    		this.bufferField.enable();
    		this.bufferField.setReadOnly(true);
    		this.updateRadius(radius);
    		this.compositeField.clickToggle.hide();
    		//this.compositeField.scenarioLabel.show();
            this.compositeField.doLayout();
    	}
    },

    updateRadius: function(radius) {
    	if(this.radiusMode === 'scenario') {
    		this.bufferField.setValue(radius);
    		this.drawNewBuffer(false);
    	}

    },

    drawNewBuffer: function(zoom) {  
		if(this.isValid()) {
			var coords = this.coordinatePicker.getCoordinate();
			var lonlat = new OpenLayers.LonLat(coords[0], coords[1]);
	        
	        lonlat.transform(new OpenLayers.Projection(this.outputSRS),map.getProjectionObject());

			var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);

			var regularPolygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
				point,
				this.bufferField.getValue(),
				100, 
				null
			);

			this.drawBuffer(regularPolygon);

			var bounds = regularPolygon.getBounds();
			if(zoom) {
				this.map.zoomToExtent(bounds);		
			}
		}
    },

    drawBuffer: function(regularPolygon){
        if(this.selectStyle){
            this.resetBuffer();
            var style = new OpenLayers.Style(this.selectStyle);
            
			this.bufferLayer = new OpenLayers.Layer.Vector(this.selectLayerName,{
                styleMap: style                
            });

            var bufferFeature = new OpenLayers.Feature.Vector(regularPolygon);
            this.bufferLayer.addFeatures([bufferFeature]);

            this.bufferLayer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            this.map.addLayer(this.bufferLayer);  
        }    
    },

	resetBuffer: function(){
		if(this.selectStyle){
			var layer = map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
		}
	},

	isValid: function(){
		return(this.coordinatePicker.isValid() &&
			this.bufferField.isValid());
	},

	resetPointSelection: function(){
		this.coordinatePicker.resetPoint();
		this.resetBuffer();
		this.compositeField.clickToggle.toggle(false);
	}
});

Ext.reg("gxp_bufferfieldset", gxp.widgets.form.BufferFieldset);