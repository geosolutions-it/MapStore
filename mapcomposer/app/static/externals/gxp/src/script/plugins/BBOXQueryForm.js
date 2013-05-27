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

/**
 * @requires plugins/QueryForm.js
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = QueryBBOXForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: BBOXQueryForm(config)
 *
 *    Plugin for performing queries on feature layers
 *    TODO Replace this tool with something that is less like GeoEditor and
 *    more like filtering.
 */
gxp.plugins.BBOXQueryForm = Ext.extend(gxp.plugins.QueryForm, {
    
    /** api: ptype = gxp_querybboxform */
    ptype: "gxp_bboxqueryform",

     
    init: function(target) {
        
        var me=this;
      
        var confbbox=Ext.apply({
            map: target.mapPanel.map,
            checkboxToggle: true,
            ref: "spatialFieldset",
            title: this.queryByLocationText,
            id: me.id+"_bbox"
        },this.outputConfig);
        this.bboxFielset = new gxp.form.BBOXFieldset(confbbox);
        
       
        
       this.id= this.id ? this.id : new Date().getTime(); 
       
       return gxp.plugins.BBOXQueryForm.superclass.init.apply(this, arguments);
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];
        var me= this;
        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            items: [
            this.bboxFielset,
            {
                xtype: "fieldset",
                ref: "attributeFieldset",
                title: this.queryByAttributesText,
                checkboxToggle: true
            }],
            bbar: ["->", {   
                scope: this,    
                text: this.cancelButtonText,
                iconCls: "cancel",
                handler: function() {
                    this.resetFeatureManager();
                    this.bboxFielset.removeBBOXLayer();
                    this.bboxFielset.setBBOX(this.target.mapPanel.map.getExtent());
                    var ownerCt = this.outputTarget ? queryForm.ownerCt :
                        queryForm.ownerCt.ownerCt;
                    if (ownerCt && ownerCt instanceof Ext.Window) {
                        ownerCt.hide();
                    } else {
                        addFilterBuilder(
                            featureManager, featureManager.layerRecord,
                            featureManager.schema
                        ); 
                    }
                    
                }
            }, {
                text: this.queryActionText,
                iconCls: "gxp-icon-find",
                handler: function() {
                    if(this.bboxFielset.isValid()){
                       var filters = new Array();
                        if (queryForm.spatialFieldset.collapsed !== true) {
                            filters.push(new OpenLayers.Filter.Spatial({
                                type: OpenLayers.Filter.Spatial.BBOX,
                                property: featureManager.featureStore.geometryName,
                                value: me.bboxFielset.getBBOXBounds()
                            }));
                        }
                        if (queryForm.attributeFieldset.collapsed !== true) {
                            var attributeFilter = queryForm.filterBuilder.getFilter();
                            attributeFilter && filters.push(attributeFilter);
                        }
              
                        featureManager.loadFeatures(filters.length > 1 ?
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
        
        var addFilterBuilder = function(mgr, rec, schema) {
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
                queryForm.spatialFieldset.expand();
                queryForm.attributeFieldset.expand();
            } else {
                queryForm.attributeFieldset.rendered && queryForm.attributeFieldset.collapse();
                queryForm.spatialFieldset.rendered && queryForm.spatialFieldset.collapse();
            }
            queryForm.attributeFieldset.doLayout();
        };
        featureManager.on("layerchange", addFilterBuilder);
        addFilterBuilder(featureManager,
            featureManager.layerRecord, featureManager.schema
        );
        
        this.target.mapPanel.map.events.register("moveend", this, function() {
            this.bboxFielset.removeBBOXLayer();
            this.bboxFielset.setBBOX(this.target.mapPanel.map.getExtent())
        });
        
        featureManager.on({
            "beforequery": function() {
                new Ext.LoadMask(queryForm.getEl(), {
                    store: featureManager.featureStore,
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

Ext.preg(gxp.plugins.BBOXQueryForm.prototype.ptype, gxp.plugins.BBOXQueryForm);
