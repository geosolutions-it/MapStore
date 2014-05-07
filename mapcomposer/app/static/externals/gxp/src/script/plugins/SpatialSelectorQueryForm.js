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
    filterMapText: 'Filter Map',
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
    
    /** api: config[filterLayer]
     * ``Object``
     * Add controls to filter WMS layer using the filter
     */
    filterLayer: false,
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
                xtype: 'container',
                defaults:{
                    layout: "form"
                }
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

        var spatialSelectorOutput = this.spatialSelector.addOutput();
        //create bbar buttons
        var bbarButtons =[];
        if(this.filterLayer){
            bbarButtons.push({
                text: this.filterMapText,
                iconCls: "gxp-icon-map-filter",
                handler: function() {
					
                    // Collect all selected filters
                    var filters = new Array();
                    
                    if(queryForm.spatialSelectorFieldset && !queryForm.spatialSelectorFieldset.collapsed){
                        var currentFilter = this.spatialSelector.getQueryFilter();   
                        if (currentFilter) {
                            //convert filter into native srs
                            //get native srs
                            var rec  = this.featureManagerTool.layerRecord;
                            var bbox = rec.get('bbox');
                            var nativeSRS;
                            for(var c in bbox) {
                                
                                if(c && c.indexOf('EPSG')==0) nativeSRS = c;
                            }
                            currentFilter = currentFilter.clone();
                            currentFilter.value.transform(this.target.mapPanel.map.getProjectionObject(),new OpenLayers.Projection(nativeSRS));
                            filters.push(currentFilter);
                        }
                    }

                    if(queryForm.filterBuilder && !queryForm.filterBuilder.collapsed){
                        var attributeFilter = queryForm.filterBuilder.getFilter();
                        //TODO replace * with % in strings
                        if(attributeFilter){
                            var attributeFilter = attributeFilter.clone();
                            //inspect tree of filters
                            var replaceLikeStrings = function(node,oldc,newc){
                                var oldc = oldc || '*';
                                var newc = newc || '%';
                                if(node.filters){
                                    for(var i = 0;i< node.filters.length; i++){
                                        replaceLikeStrings(node.filters[i],oldc,newc);
                                    }
                                }else if (node.type== "~"){
                                    //replace all
                                    node.value = node.value.split(oldc).join(newc);
                                    
                                }
                            }
                            replaceLikeStrings(attributeFilter);
                            
                        }
                        attributeFilter && filters.push(attributeFilter);
                    }

                    if(filters.length > 0){
                         
                         var filter =  filters.length > 1 ? new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) :
                            filters[0];
                            if(this.target.tools.layertree_plugin){
                                var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                                var node =selmodel.getSelectedNode();
                                node.setIconCls('gx-tree-filterlayer-icon');
                            }
                            this.featureManagerTool.layerRecord.getLayer().mergeNewParams({cql_filter:filter.toString()}); 
                    }else{
                        var layer = this.featureManagerTool.layerRecord.getLayer(); 
                        delete layer.params.CQL_FILTER;
                        layer.redraw();
                    }
                      
                },
                scope: this
            });
        }
		bbarButtons.push( [{
                text: this.queryActionText,
                iconCls: "gxp-icon-find",
                handler: function() {
					var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
					if(container){
						container.expand();
					}
                    // Collect all selected filters
                    var filters = new Array();
                    
                    if(queryForm.spatialSelectorFieldset && !queryForm.spatialSelectorFieldset.collapsed){
                        var currentFilter = this.spatialSelector.getQueryFilter();   
                        if (currentFilter) {
                            filters.push(currentFilter);
                        }
                    }

                    if(queryForm.filterBuilder && !queryForm.filterBuilder.collapsed){
                        var attributeFilter = queryForm.filterBuilder.getFilter();
                        attributeFilter && filters.push(attributeFilter);
                    }

                    if(filters.length > 0){
                        this.featureManagerTool.loadFeatures(filters.length > 1 ?
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) :
                            filters[0]
                        );    
                    }else{
                        Ext.Msg.show({
                            title: "No filter selected",
                            msg: "You must select at least one filter",
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        }); 
                    }
                      
                },
                scope: this
            },"->",{   
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
                    if(me.filterLayer){
                        var layer = this.featureManagerTool.layerRecord.getLayer(); 
                        delete layer.params.CQL_FILTER;
                        if(this.target.tools.layertree_plugin){
                            var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                            var node =selmodel.getSelectedNode();
                            node.setIconCls('gx-tree-layer-icon');
                        }
                        layer.redraw();
                    }
                     spatialSelector.filterGeometryName = this.featureStore
                        && this.featureStore.geometryName
                        ? this.featureManagerTool.featureStore.geometryName : this.featureManagerTool.featureStore.geometryName ;
                        
                }
            }]);
        
        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            id: this.getFormId(),
            items: [
            {
                xtype: "fieldset",
                ref: "spatialSelectorFieldset",
                title: spatialSelectorOutput.title,
                checkboxToggle: true,
                collapsed : false,
                items: [spatialSelectorOutput],
                listeners: {
                    scope: this,
                    expand: function(panel){
                        panel.doLayout();
                    }
                }
            },
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
            bbar: [bbarButtons ]
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
                    validators: me.validators,
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
							
                            for(var c = 1;c<items[i].items.items.length;c++){
                                items[i].items.get(c).disable();                            
                            }

							filter.value = null;
                            filter.lowerBoundary = null;
                            filter.upperBoundary = null;
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
