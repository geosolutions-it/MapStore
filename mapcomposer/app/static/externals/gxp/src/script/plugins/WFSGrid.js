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
		
        
		var wfsGridPanelHuman = new Ext.grid.GridPanel({
			id: this.id+'human',
			store: fstoreHuman,
            title:this.humanTargetsTitle,
			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
			colModel: new Ext.grid.ColumnModel({
				columns: this.columnModelHuman
			}),
			bbar: new Ext.ux.LazyPagingToolbar({
				store: fstoreHuman,
				pageSize: 10									
			}),
			listeners: {
				scope: this,
				rowclick: function(grid, rowIndex, e){
					var record = fstoreHuman.getAt(rowIndex);
					var geom = record.get("geometry");
					
					var map = this.target.mapPanel.map;
					
					var targetLayer = map.getLayersByName("Bersaglio Selezionato")[0];
					if(!targetLayer){
						targetLayer = new OpenLayers.Layer.Vector("Bersaglio Selezionato",{
							displayInLayerSwitcher: false,
                            style: {
                                strokeColor: "#FF00FF",
                                strokeWidth: 2,
                                fillColor: "#FF00FF",
                                fillOpacity: 0.8
                            }
						});
						
						map.addLayer(targetLayer);
					}else{
						targetLayer.removeAllFeatures();
					}						
					
					switch(geom.type){
						case 'Polygon':
							var pointList = [];
							var coordinates = geom.coordinates[0];
							
							var mapPrj = map.getProjectionObject();
							var selectionPrj = new OpenLayers.Projection("EPSG:32632");
							var transform = mapPrj.equals(selectionPrj);
							
							for(var p=0; p<coordinates.length; ++p) {
								var coords = coordinates[p];
								
								var newPoint = new OpenLayers.Geometry.Point(coords[0],coords[1]);
								
								if(!transform){												
									newPoint = newPoint.transform(
										selectionPrj,
										mapPrj														
									);											
								}
								
								pointList.push(newPoint);
							}
							
							var linestring = new OpenLayers.Geometry.LineString(pointList);
							var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
							var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
							var polygonFeature = new OpenLayers.Feature.Vector(polygon);
							
							targetLayer.addFeatures([polygonFeature]);
							
							map.zoomToExtent(polygon.getBounds());							
					}
				}
			}
		});
        
        var wfsGridPanelNotHuman = new Ext.grid.GridPanel({
			id: this.id+'nothuman',
			store: fstoreNotHuman,
            title:this.notHumanTargetsTitle,
			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
			colModel: new Ext.grid.ColumnModel({
				columns: this.columnModelNotHuman
			}),
			bbar: new Ext.ux.LazyPagingToolbar({
				store: fstoreNotHuman,
				pageSize: 10									
			}),
			listeners: {
				scope: this,
				rowclick: function(grid, rowIndex, e){
					var record = fstoreNotHuman.getAt(rowIndex);
					var geom = record.get("geometry");
					
					var map = this.target.mapPanel.map;
					
					var targetLayer = map.getLayersByName("Bersaglio Selezionato")[0];
					if(!targetLayer){
						targetLayer = new OpenLayers.Layer.Vector("Bersaglio Selezionato",{
							displayInLayerSwitcher: false,
                            style: {
                                strokeColor: "#FF00FF",
                                strokeWidth: 2,
                                fillColor: "#FF00FF",
                                fillOpacity: 0.8
                            }
						});
						
						map.addLayer(targetLayer);
					}else{
						targetLayer.removeAllFeatures();
					}						
					
					switch(geom.type){
						case 'Polygon':
							var pointList = [];
							var coordinates = geom.coordinates[0];
							
							var mapPrj = map.getProjectionObject();
							var selectionPrj = new OpenLayers.Projection("EPSG:32632");
							var transform = mapPrj.equals(selectionPrj);
							
							for(var p=0; p<coordinates.length; ++p) {
								var coords = coordinates[p];
								
								var newPoint = new OpenLayers.Geometry.Point(coords[0],coords[1]);
								
								if(!transform){												
									newPoint = newPoint.transform(
										selectionPrj,
										mapPrj														
									);											
								}
								
								pointList.push(newPoint);
							}
							
							var linestring = new OpenLayers.Geometry.LineString(pointList);
							var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
							var polygon = new OpenLayers.Geometry.Polygon([linearRing]);
							var polygonFeature = new OpenLayers.Feature.Vector(polygon);
							
							targetLayer.addFeatures([polygonFeature]);
							
							map.zoomToExtent(polygon.getBounds());							
					}
				}
			}
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
    }   
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
