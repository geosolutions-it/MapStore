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
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSGrid
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSGrid(config)
 *
 *    WFS interface to show data in a Ext.Grid
 */   
gxp.plugins.WFSGrid = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_wfsgrid",
    
    /** api: config[featureType]
     *  ``String``
     */
    featureType: null,
    
    /** api: config[wfsURL]
     *  ``String``
     */
    wfsURL: null,
    
	/** api: config[id]
     *  ``String``
     */
    id: "featuregrid",
	
    /** api: config[storeFieldsHuman]
     *  ``Array[Object]``
     */
	storeFieldsHuman: null,
    
	/** api: config[storeFieldsNotHuman]
     *  ``Array[Object]``
     */
	storeFieldsNotHuman: null,
	
	/** api: config[columnModelHuman]
     *  ``Array[Object]``
     */
	columnModelHuman: null,
    
    /** api: config[columnModelNotHuman]
     *  ``Array[Object]``
     */
	columnModelNotHuman: null,
   
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    
    zoomToTooltip: 'Zoom al bersaglio',
    
    humanTargetsTitle: 'Bersagli umani',
    
    notHumanTargetsTitle: 'Bersagli ambientali',
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);         
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
		var fstoreHuman = new WFSStore({
			root: 'features',
			idProperty: 'id', 
			typeName: this.featureType,
			
			proxy : new Ext.data.HttpProxy({
				method: 'GET',
				url: this.wfsURL
			}),
			
			fields: this.storeFieldsHuman
		});
        
            var fstoreNotHuman = new WFSStore({
			root: 'features',
			idProperty: 'id', 
			typeName: this.featureType,
			
			proxy : new Ext.data.HttpProxy({
				method: 'GET',
				url: this.wfsURL
			}),
			
			fields: this.storeFieldsNotHuman
		});
                
            var me= this;        
            var checkConf={
                listeners: {
                            scope: this,
                            beforerowselect: function (sm, row_index) {            
                            /* sm.suspendEvents();
                                if (sm.isSelected(row_index)) {
                                    sm.deselectRow(row_index);
                                } else {
                                    sm.selectRow(row_index, true)
                                }
                                sm.resumeEvents();
                                return false;*/
                            },
                            rowdeselect: function (selMod, rowIndex, record){
                                var map = this.target.mapPanel.map;
                                var targetLayer = map.getLayersByName("Bersagli Selezionati")[0];
                                var unSelectFeatures= targetLayer.getFeaturesByAttribute("bersID", record.get("id"));
                                targetLayer.removeFeatures(unSelectFeatures);

                            },
                            rowselect: function(selMod, rowIndex, record){
                                //var record = fstoreNotHuman.getAt(rowIndex);
                                var geom = record.get("geometry");
                                var map = this.target.mapPanel.map;
                                var targetLayer = map.getLayersByName("Bersagli Selezionati")[0];
                                if(!targetLayer){
                                    targetLayer = new OpenLayers.Layer.Vector("Bersagli Selezionati",{
                                        displayInLayerSwitcher: false,
                                        style: {
                                            strokeColor: "#FF00FF",
                                            strokeWidth: 2,
                                            fillColor: "#FF00FF",
                                            fillOpacity: 0.8
                                        }
                                    });

                                map.addLayer(targetLayer);
                            }					

                            switch(geom.type){
                                    case 'Polygon':
                                            var pointList=me.getPointList(geom);
                                            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
                                            var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
                                            var polygonFeature = new OpenLayers.Feature.Vector(polygon,{ "bersID": record.get("id")});
                                            targetLayer.addFeatures([polygonFeature]);			
                            }
                        }
                }           
            };
            
            var smHumans = new Ext.grid.CheckboxSelectionModel(checkConf);
            var columnsHumans=[smHumans, this.getZoomToAction()];  
	    var wfsGridPanelHuman = new Ext.grid.GridPanel({
			id: this.id+'human',
			store: fstoreHuman,
                        title:this.humanTargetsTitle,
                        viewConfig : {
                            forceFit: true
                        },
                        sm: smHumans,
			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
                        colModel: new Ext.grid.ColumnModel({
				columns: columnsHumans.concat(this.columnModelHuman)//this.columnModelHuman
			}),
			bbar: new Ext.ux.LazyPagingToolbar({
				store: fstoreHuman,
				pageSize: 10									
			})
		});
                
            var smNotHumans = new Ext.grid.CheckboxSelectionModel(checkConf);  
            var columnsNotHumans=[smNotHumans, this.getZoomToAction()];    
            var wfsGridPanelNotHuman = new Ext.grid.GridPanel({
			id: this.id+'nothuman',
			store: fstoreNotHuman,
                        title:this.notHumanTargetsTitle,
                        viewConfig : {
                            forceFit: true
                        },
			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
			colModel: new Ext.grid.ColumnModel({
				columns: columnsNotHumans.concat(this.columnModelNotHuman)//this.columnModelNotHuman
			}),
                        sm: smNotHumans,
			bbar: new Ext.ux.LazyPagingToolbar({
				store: fstoreNotHuman,
				pageSize: 10									
			})
		});

        var tabPanel = new Ext.TabPanel({
            id: this.id,
            activeTab: 0,
            items: [wfsGridPanelHuman, wfsGridPanelNotHuman]
        });
        
        Ext.apply(wfsGridPanelHuman, config || {});
        Ext.apply(wfsGridPanelNotHuman, config || {});
        var wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, tabPanel);
        
        return wfsGrid;
    },
    
    /** private: method[getZoomToAction]
     */
    getZoomToAction: function(actionConf){
        var me=this;
        return {
                xtype: 'actioncolumn',
                sortable : false, 
                width: 10,
                items: [{
                        icon   : me.zoomToIconPath,  
                        tooltip: me.zoomToTooltip,
                        scope: me,
                        handler: function(gpanel, rowIndex, colIndex) {
                                var map = me.target.mapPanel.map;
                                var store = gpanel.getStore();	
                                var record = store.getAt(rowIndex);
                                var geom = record.get("geometry");
                                
                                switch(geom.type){
                                    case 'Polygon':
					var linearRing = new OpenLayers.Geometry.LinearRing(me.getPointList(geom));
                                        var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
                                        map.zoomToExtent(polygon.getBounds());							
			        }
                        }
                     }]  
             };
    },
    
    getPointList: function(geom){
        var pointList = [];
        var coords;
        var map = this.target.mapPanel.map;
	var coordinates = geom.coordinates[0];
	var mapPrj = map.getProjectionObject();
	var selectionPrj = new OpenLayers.Projection("EPSG:32632");
	var transform = mapPrj.equals(selectionPrj);
							
	for(var p=0; p<coordinates.length; ++p) {
            coords = coordinates[p];
	    var newPoint = new OpenLayers.Geometry.Point(coords[0],coords[1]);
	    if(!transform){												
		newPoint = newPoint.transform(
			selectionPrj,
			mapPrj														
		);											
            }
            pointList.push(newPoint);
	}
        
        return pointList;
    }
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
