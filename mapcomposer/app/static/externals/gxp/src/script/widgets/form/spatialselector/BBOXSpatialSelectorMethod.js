/**
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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

/**
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.widgets.form.spatialselector
 *  class = BBOXSpatialSelectorMethod
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: BBOXSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on BBOX fieldset
 */
gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod = Ext.extend(gxp.widgets.form.spatialselector.SpatialSelectorMethod, {

	/* xtype = gxp_spatial_bbox_selector */
	xtype : 'gxp_spatial_bbox_selector',

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'BBOX',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Bounding Box',

	/** api: config[spatialFilterOptions ]
	 *  ``Object``
	 * Default CRS limits if not selection has been made. Must be compliant with the map CRS.
	 */
	spatialFilterOptions : {
		lonMax : 20037508.34, //90,
		lonMin : -20037508.34, //-90,
		latMax : 20037508.34, //180,
		latMin : -20037508.34 //-180
	},

	/** api: config[northLabel]
	 * ``String``
	 * Text for Label North (i18n).
	 */
	northLabel : "North",

	/** api: config[westLabel]
	 * ``String``
	 * Text for Label West (i18n).
	 */
	westLabel : "West",

	/** api: config[eastLabel]
	 * ``String``
	 * Text for Label East (i18n).
	 */
	eastLabel : "East",

	/** api: config[southLabel]
	 * ``String``
	 * Text for Label South (i18n).
	 */
	southLabel : "South",

	/** api: config[setAoiTitle]
	 * ``String``
	 * Text for Bounding Box fieldset (i18n).
	 */
	setAoiTitle : "Bounding Box",

	/** api: config[setAoiText]
	 * ``String``
	 * Text for Bounding Box Draw button (i18n).
	 */
	setAoiText : "Draw Box",

	/** api: config[setAoiTooltip]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	setAoiTooltip : 'Enable the SetBox control to draw a ROI (Bounding Box) on the map',

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {   

		// ///////////////////////////////////////////
		// Spatial AOI Selector FieldSet
		// ///////////////////////////////////////////
		var confbbox = {
            map: this.target.mapPanel.map,
            outputSRS : this.target.mapPanel.map.projection,
            spatialFilterOptions: this.spatialFilterOptions,
            // checkboxToggle: false,
            ref: "spatialFieldset",
            id: this.id + "_bbox",
            defaultStyle: this.defaultStyle,
            selectStyle: this.selectStyle,
            temporaryStyle: this.temporaryStyle,
            // width: 300,
            anchor: "100%",

		    // start i18n
            title: this.setAoiTitle,
		    northLabel:this.northLabel,
		    westLabel:this.westLabel,
		    eastLabel:this.eastLabel,
		    southLabel:this.southLabel,
		    setAoiText: this.setAoiText,
		    setAoiTooltip: this.setAoiTooltip,
		    waitEPSGMsg: "Please Wait...",
		    listeners : {
		    	"onChangeAOI" : function(bounds) {
					this.setCurrentGeometry(bounds.toGeometry());
		    	},
		    	scope: this
		    }
        };

    	this.output = new gxp.form.BBOXFieldset(confbbox);

    	this.items = [this.output];

        gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.initComponent.call(this);
    },

	// trigger action when activate the plugin
	activate: function(){
		gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
		}
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
    		this.output.removeBBOXLayer();
			this.output.disable();
		}
	},

    // Reset method
    reset: function(){
		gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.reset.call(this);
    	this.output.removeBBOXLayer();
    	this.output.reset();
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){

		var summary = gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.superclass.getSummary.call(this, geometry);
		var metricUnit = "km";

		var perimeter = this.getLength(geometry, metricUnit);
		if (perimeter) {
			summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
		}

		return summary;
    }
});

Ext.reg(gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype.xtype, gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod);