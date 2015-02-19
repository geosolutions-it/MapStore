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
 *  class = BufferSpatialSelectorMethod
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: BufferSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on buffer fieldset
 */
gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod = Ext.extend(gxp.widgets.form.spatialselector.SpatialSelectorMethod, {

	/* xtype = gxp_spatial_buffer_selector */
	xtype : 'gxp_spatial_buffer_selector',

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Buffer',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Buffer',

    /**
     * Property: latitudeEmptyText
     * {string} emptyText of the latitude field
     */
    latitudeEmptyText : 'Y',

    /**
     * Property: longitudeEmptyText
     * {string} emptyText of the longitude field
     */
    longitudeEmptyText : 'X',

	/** api: config[bufferOptions]
	 *  ``Object``
	 * Buffer spatial selector options.
	 */
	bufferOptions : {
		"minValue": 1,
		"maxValue": 1000,
		"decimalPrecision": 2,
		"distanceUnits": "m"
	 },

    /** api: method[initComponent]
     */
    initComponent: function() {
		// ///////////////////////////////////////////
		// Spatial Buffer Selector FieldSet
		// ///////////////////////////////////////////
		var confbuffer = new gxp.widgets.form.BufferFieldset({
			id: this.id + "bufferFieldset",
			ref: "bufferFieldset",
			map: this.target.mapPanel.map,
			minValue: this.bufferOptions.minValue,
            maxValue: this.bufferOptions.maxValue,
		    decimalPrecision: this.bufferOptions.decimalPrecision,
			outputSRS: this.target.mapPanel.map.projection,
			selectStyle: this.selectStyle,
			geodesic: this.geodesic || true,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText
		});
		confbuffer.on("bufferadded", function(evt, feature){
			this.setCurrentGeometry(feature.geometry);
		}, this);

	    confbuffer.on("bufferremoved", function(evt, feature){
			this.setCurrentGeometry(null);
		}, this);

    	this.output = this;

    	this.items = [confbuffer];

        gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.initComponent.call(this);
    },

	// trigger action when activate the plugin
	activate: function(){
		gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
            
			//if(Ext.isIE){
				this.output.doLayout();
			//}
		}
	},

	// trigger action when deactivate the plugin
	deactivate: function(){
		gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
			this.output.hide();
			this.output.disable();
		}
	},

    // Reset method
    reset: function(){
		gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.superclass.reset.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
		}
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){

		var summary = "", metricUnit = "km";

		var area = this.getArea(geometry, metricUnit);
		if (area) {
			summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
		}

		// //////////////////////////////////////////////////////////
		// Draw also the circle center as a part of summary report
		// //////////////////////////////////////////////////////////
		var circleSelectionCentroid = geometry.getCentroid();

		if (circleSelectionCentroid) {
			var lon = circleSelectionCentroid.x.toFixed(3);
			var lat = circleSelectionCentroid.y.toFixed(3);
			var xField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lon" : "X";
			var yField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lat" : "Y";
			summary += this.centroidLabel + ": " + lon + " ("+xField+") " + lat + " ("+yField+")" + '<br />';
		}

		return summary;
    }
});

Ext.reg(gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype.xtype, gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod);