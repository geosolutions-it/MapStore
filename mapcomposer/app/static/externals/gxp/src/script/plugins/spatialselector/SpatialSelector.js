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
 * @requires plugins/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.plugins.spatialselector
 *  class = SpatialSelector
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace('gxp.plugins.spatialselector');

/** api: constructor
 *  .. class:: SpatialSelector(config)
 *
 *    Spatial selector with pluggable colectors
 */
gxp.plugins.spatialselector.SpatialSelector = Ext.extend(gxp.plugins.Tool, {

	/* ptype = gxp_spatial_selector */
	ptype : 'gxp_spatial_selector',

	// configurations
	layoutConfig: {

	},

	spatialSelectorsConfig:{

	},
	defaultSelectionMethod: null,
	filterGeometryName: null,

	/** i18n **/
	titleText: "Spatial Selector",

	/** api: config[title]
	 * ``String``
	 * Text for ROI FieldSet Title (i18n).
	 */
	selectionMethodLabel : "Selection Method",

	/** api: config[comboEmptyText]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	comboEmptyText : "Select a method..",

	/** api: config[comboSelectionMethodLabel]
	 * ``String``
	 * Text for Label Combo Selection Method (i18n).
	 */
	comboSelectionMethodLabel : "Selection",
	/** EoF i18n **/

	// init spatialSelectors 
	constructor : function(config) {
		// default layout configuration
		this.layoutConfig = {
    		xtype: "fieldset",
    		hidden: true
		};

		// Apply config
		Ext.apply(this, config);

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				spConfig.target = this.target;
				if(spConfig.id 
					&& this.target 
					&& this.target.tools
					&& this.target.tools[spConfig.id]){
					this.spatialSelectors[key] = this.target.tools[spConfig.id];
				}else{
					var plugin = Ext.ComponentMgr.createPlugin(spConfig);
					if(this.target 
						&& this.target.tools){
						this.target.tools[spConfig.id] = plugin;
					}
					this.spatialSelectors[key] = plugin;
					var selectorItem = plugin.getSelectionMethodItem();
					selectorItem.value = key;
					this.spatialSelectorsItems.push(selectorItem);
				}
			}	
		}
		
		return gxp.plugins.spatialselector.SpatialSelector.superclass.constructor.call(this, arguments);
	},

    /** api: method[addOutput]
     */
    addOutput: function() {

    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		var selectionMethodCombo = {
			xtype : 'combo',
			// anchor : '100%',
			id : this.id + '_selectionMethod_id',
			ref : '../outputType',
			fieldLabel : this.comboSelectionMethodLabel,
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : false,
			mode : 'local',
			name : 'roiSelectionMethod',
			forceSelected : true,
			emptyText : this.comboEmptyText,
			allowBlank : false,
			autoLoad : true,
			displayField : 'label',
			valueField : 'value',
			// value : this.defaultSelectionMethod,
			// width : itemsWidth - 30,
			editable : false,
			readOnly : false,
			store : new Ext.data.JsonStore({
				fields : [{
					name : 'name',
					dataIndex : 'name'
				}, {
					name : 'label',
					dataIndex : 'label'
				}, {
					name : 'value',
					dataIndex : 'value'
				}],
				data : this.spatialSelectorsItems
			}),
			listeners : {
				select : function(c, record, index) {
					this._updating = true;
					this.reset();
					this._updating = false;
					var method = this.spatialSelectors[c.getValue()];//record.json.method;
					method.activate();
					this.activeMethod = method;
				},
				scope : this
			}
		};

	    // initialize layout
		layout.items = [];
		layout.items.push({
			xtype: 'fieldset',
			title: this.comboSelectionMethodLabel,
			items: [selectionMethodCombo]
		});
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		var output = this.spatialSelectors[key].addOutput();
	    		if(output){
					layout.items.push(output);
	    		}
	    	}
	    }

	    // reset when portal ready. Needs to be at this time to read the map configuration
	    var me = this;
	    this.target.on("ready", function(){
	    	me.reset();
	    });

    	return layout;
    },

    // reset 
    reset: function(){
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		this.spatialSelectors[key].deactivate();
	    		this.activeMethod = null;
	    	}
	    	if(!this._updating 
	    		&& this.defaultSelectionMethod
	    		&& this.spatialSelectors[this.defaultSelectionMethod]){
	    		this.spatialSelectors[this.defaultSelectionMethod].activate();
				this.activeMethod = this.spatialSelectors[this.defaultSelectionMethod];
	    	}
    	}
    },

	// Generate filter
	getQueryFilter: function(){
		if(this.activeMethod){
			this.activeMethod.filterGeometryName = this.filterGeometryName;
			return this.activeMethod.getQueryFilter();
		}else{
			return null;
		}
	},

	// Generate filter
	getGeometry: function(){
		if(this.activeMethod){
			return this.activeMethod.currentGeometry;
		}else{
			return null;
		}
	}

});

Ext.preg(gxp.plugins.spatialselector.SpatialSelector.prototype.ptype, gxp.plugins.spatialselector.SpatialSelector);