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
 * @requires plugins/QueryForm.js
 * @requires plugins/spatialselector/SpatialSelector.js
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SpatialSelectorQueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SpatialSelectorQueryForm(config)
 *
 *    Plugin for performing queries on feature layers with a pluggable spatial selector
 */
gxp.plugins.SpatialSelectorQueryForm = Ext.extend(gxp.plugins.QueryForm, {
    
    /** api: ptype = gxp_querybboxform */
    ptype: "gxp_spatialqueryform",

    /** api: config[spatialSelectorsConfig]
     * ``Object``
     * Spatial selector pluggins configurations. 
     * @see gxp.plugins.spatialselector.SpatialSelectorMethod.js
     */
    spatialSelectorsConfig:{
        bbox:{
            ptype : 'gxp_spatial_bbox_selector'
        },
        buffer:{
            ptype : 'gxp_spatial_buffer_selector'
        },
        circle:{
            ptype : 'gxp_spatial_circle_selector',
            zoomToCurrentExtent : true
        },
        polygon:{
            ptype : 'gxp_spatial_polygon_selector'
        }
    },
    
    init: function(target) {
        
        var me = this;
      
        if(!this.style){
            this.style = new OpenLayers.Style();
            if(this.outputConfig){
                Ext.apply(this.style.defaultStyle, this.outputConfig.selectStyle);
            }
        }

        var formId = this.getFormId();

        var spatialSelectorsConfig = this.spatialSelectorsConfig;

        for (var key in spatialSelectorsConfig){
            spatialSelectorsConfig[key].loadingMaskId = formId;
        }

        this.spatialSelector = new gxp.plugins.spatialselector.SpatialSelector({
            target: target,
            layoutConfig: {
                xtype: 'fieldset'
            },
            spatialSelectorsConfig: spatialSelectorsConfig
        });
       
        return gxp.plugins.SpatialSelectorQueryForm.superclass.init.apply(this, arguments);
    },

    getFormId: function(){
        return this.id + "_spatialQueryForm";
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        this.featureManagerTool = this.target.tools[this.featureManager];
		
		var me = this;

        var spatialSelector = this.spatialSelector;
		
        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            id: this.getFormId(),
            items: [
            this.spatialSelector.addOutput(),
            {
                xtype: "fieldset",
                ref: "attributeFieldset",
                title: this.queryByAttributesText,
                checkboxToggle: true,
                collapsed : true,
				listeners: {
					scope: this,
					expand: function(panel){
						panel.doLayout();
					}
				}
            }],
            bbar: ["->", {   
                scope: this,    
                text: this.cancelButtonText,
                iconCls: "cancel",
                handler: function() {                
                    this.resetFeatureManager();
                    this.spatialSelector.reset();
					
                    var methodSelection = this.output[0].outputType;
					
                    if (me.draw) {me.draw.deactivate();};
                    if (me.drawings) {me.drawings.destroyFeatures();};
                    if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
                    if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};    
					
                    var ownerCt = this.outputTarget ? queryForm.ownerCt :
                        queryForm.ownerCt.ownerCt;
                    if (ownerCt && ownerCt instanceof Ext.Window) {
                        ownerCt.hide();
                    } else {
                        this.addFilterBuilder(
                            this.featureManagerTool, this.featureManagerTool.layerRecord,
                            this.featureManagerTool.schema
                        ); 
                    }                    
                }
            }, {
                text: this.queryActionText,
                iconCls: "gxp-icon-find",
                handler: function() {
					var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
					if(container){
						container.expand();
					}
                    var filters = new Array();


                    var currentFilter = this.spatialSelector.getQueryFilter();
                    if (currentFilter) {
                        filters.push(currentFilter);
                        var attributeFilter = queryForm.filterBuilder.getFilter();
                        attributeFilter && filters.push(attributeFilter);
                        this.featureManagerTool.loadFeatures(filters.length > 1 ?
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) :
                            filters[0]
                        );  
                     }
                },
                scope: this
            }]
        }, config || {});
		
        var queryForm = gxp.plugins.QueryForm.superclass.addOutput.call(this, config);
        
        var methodSelection = this.output[0].outputType;
        
        this.addFilterBuilder = function(mgr, rec, schema) {			
            queryForm.attributeFieldset.removeAll();
            queryForm.setDisabled(!schema);
			
            if (schema) {
                queryForm.attributeFieldset.add({
                    xtype: "gxp_filterbuilder",
                    ref: "../filterBuilder",
                    attributes: schema,
                    allowBlank: true,
                    allowGroups: false
                });
				
			   /**
				* Overriding the removeCondition method in order to manage the 
				* single filterfield reset.
				*/
				 queryForm.filterBuilder.removeCondition = function(item, filter) {
					var parent = this.filter.filters[0].filters;
					if(parent.length > 1) {
						parent.remove(filter);
						this.childFilterContainer.remove(item, true);
					}else{
						var items = item.findByType("gxp_filterfield");
						
						var i = 0;
						while(items[i]){
							items[i].reset();
							
							items[i].items.get(1).disable();
							items[i].items.get(2).disable();

							filter.value = null;
							i++;
						}
					}
					
					this.fireEvent("change", this);
				};
				
				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};   
            } else {
                me.spatialSelector.reset();
				
				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};  
            }
			
            queryForm.attributeFieldset.doLayout();
        
            spatialSelector.filterGeometryName = this.featureStore
                && this.featureStore.geometryName
                ? this.featureStore.geometryName : null;
        };
		
        this.featureManagerTool.on("layerchange", this.addFilterBuilder);
		
        this.addFilterBuilder(this.featureManagerTool,
            this.featureManagerTool.layerRecord, this.featureManagerTool.schema
        );
		
        this.featureManagerTool.on({
            "beforequery": function() {
                new Ext.LoadMask(queryForm.getEl(), {
                    store: this.featureManagerTool.featureStore,
                    msg: this.queryMsg
                }).show();
            },
            "query": function(tool, store) {
                if (store) {
                    store.getCount() || Ext.Msg.show({
                        title: this.noFeaturesTitle,
                        msg: this.noFeaturesMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    if (this.autoHide) {
                        var ownerCt = this.outputTarget ? queryForm.ownerCt :
                            queryForm.ownerCt.ownerCt;
                        ownerCt instanceof Ext.Window && ownerCt.hide();
                    }
                }
            },
            scope: this
        });
        
        return queryForm;
    }
});

Ext.preg(gxp.plugins.SpatialSelectorQueryForm.prototype.ptype, gxp.plugins.SpatialSelectorQueryForm);
