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
 *  module = gxp.plugins.spatialselector
 *  class = Geocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace('gxp.plugins.spatialselector');

/** api: constructor
 *  .. class:: Geocoder(config)
 *
 *    Geocoder based on spatial selectors
 */
gxp.plugins.spatialselector.Geocoder = Ext.extend(gxp.plugins.Tool, {

	/* ptype = gxp_spatial_selector_geocoder */
	ptype : 'gxp_spatial_selector_geocoder',

	/** api: config[layoutConfig]
	 *  ``Object``
	 *  Configuration for the output layout.
	 */

	/** api: config[crossParameters]
	 *  ``Object``
	 *  Configuration for crossParameters by selectors. When you select a result for the first combo, 
	 *  it will enable the second or more comboboxes and copy the parameter configured in the second one
	 */
    crossParameters:{},

    /** api: config[searchBtnCls]
     * ``String``
     * Icon cls for the search button.
     */
	searchBtnCls: "gxp-icon-find",

    /** api: config[resetBtnCls]
     * ``String``
     * Icon cls for the search button.
     */
	resetBtnCls: "cancel",

	/** i18n **/
	/** api: config[titleText]
	 * ``String``
	 * Title for the output (i18n).
	 */
	titleText: "Geocoder",

	/** api: config[searchText]
	 * ``String``
	 * Search text (i18n).
	 */
	searchText: "Search",

	/** api: config[searchTpText]
	 * ``String``
	 * Search tooltip text (i18n).
	 */
	searchTpText: "Search selected location and zoom in on map",

	/** api: config[resetText]
	 * ``String``
	 * Reset text (i18n).
	 */
	resetText: "Reset",

	/** api: config[resetText]
	 * ``String``
	 * Reset text (i18n).
	 */
	resetTpText: "Reset location search",

	/** api: config[translatedKeys]
	 * ``String``
	 * Translated keys for spatial selectors (i18n).
	 */
	translatedKeys: {
		"name": "Street",
		"number": "Number"
	},
	/** EoF i18n **/

	/** api: method[constructor]
	 * Init spatialSelectors .
	 */
	constructor : function(config) {
		// default layout configuration
		this.layoutConfig = {
    		xtype: "panel",
    		layout: "form",
    		defaults:{
    			layout:"fieldset"
    		}
		};

		// Apply config
		Ext.apply(this, config);
		
		return gxp.plugins.spatialselector.SpatialSelector.superclass.constructor.call(this, arguments);
	},

    /** api: method[addOutput]
     */
    addOutput: function() {

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				spConfig.target = this.target;
				// Add i18n support by spatial selector 
				if(this.translatedKeys[key]){
					spConfig["name"] = this.translatedKeys[key];
				}
				var plugin = Ext.create(spConfig);
				this.spatialSelectors[key] = plugin;
				var selectorItem = plugin.getSelectionMethodItem();
				selectorItem.value = key;
				this.spatialSelectorsItems.push(selectorItem);
			}	
		}

    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

	    // initialize layout
		layout.items = [];
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		var output = this.spatialSelectors[key].output;
	    		output.on("geometrySelect", this.onGeometrySelect, {scope:this, type: key});
	    		if(output){
	    			if(!this.crossParameters[key]){
	    				output.setDisabled(true);
	    			}
					layout.items.push(output);
	    		}
	    	}
	    }

	    layout.buttonAlign = "right";

	    layout.bbar = [
	    "->", 
	    {
            xtype   : "button",
            text : this.searchText,
            tooltip : this.searchTpText,
            iconCls: this.searchBtnCls,
			scope   : this,
			handler : this.search
		},{
            xtype   : "button",
            text : this.resetText,
            tooltip : this.resetTpText,
            iconCls: this.resetBtnCls,
			scope   : this,
			handler : this.reset
		}];

	    var output = gxp.plugins.spatialselector.Geocoder.superclass.addOutput.call(this, layout);

    	return output;
    },

    onGeometrySelect:function(geometry){
    	var params = this;
    	var me = params.scope;
    	var type = params.type;
    	var selected = me.spatialSelectors[type].wfsComboBox.getValue();
    	var store = me.spatialSelectors[type].wfsComboBox.store;
		var records = store.getRange();
		var size = store.getCount();
		var recordData = null;
    	for(var i = 0; i < size; i++){
			var record = records[i];
			if (record && record.data.name == selected) {
				recordData = record;
				break;
    		}
    	}
    	var selectedProperties = recordData.json.properties;
    	if(me.crossParameters[type]){
    		for(var parameter in me.crossParameters[type]){
    			var value = selectedProperties[parameter];
    			for(var targetCombo in me.crossParameters[type][parameter]){
    				// enable combo
    				me.spatialSelectors[targetCombo].output.setDisabled(false);
    				var comboBox = me.spatialSelectors[targetCombo].wfsComboBox;
    				// Apply filter (only one at time)
		    		if(!comboBox.vendorParams){
		    			comboBox.vendorParams = {};
		    		}
					
                    var crossParamsValue = me.crossParameters[type][parameter][targetCombo];
		    		var cql_filter = typeof(value) == "number" ? crossParamsValue + " = " + value : crossParamsValue + " = " + "'"+value+"'";

		    		Ext.apply(comboBox.vendorParams,{
		    			cql_filter: cql_filter
		    		});
    			}
    		}
    	}
    	me.geometry = geometry;
    },

	/** api: method[reset]
	 * Search action.
	 */
    search: function(){

    	var geometry = this.geometry;

		if (geometry && geometry.getBounds) {
			var dataExtent = geometry.getBounds();
			this.target.mapPanel.map.zoomToExtent(dataExtent, closest=false);
		}
    },

	/** api: method[reset]
	 * Reset the state of the Geocoder.
	 */
    reset: function(){
    	this.geometry = null;
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		this.spatialSelectors[key].wfsComboBox.reset();
	    		this.spatialSelectors[key].reset();
    			if(!this.crossParameters[key]){
    				this.spatialSelectors[key].output.setDisabled(true);
    			}
	    	}
    	}
    }

});

Ext.preg(gxp.plugins.spatialselector.Geocoder.prototype.ptype, gxp.plugins.spatialselector.Geocoder);