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
	
	/** api: config[targets] targets configuration object
     *  ``Object``
     */
	targets: {},
		  
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    
    zoomToTooltip: 'Zoom al bersaglio',
    

	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);         
    },
	
	buildStore: function(cfg) {
		return new WFSStore({
			root: 'features',
			idProperty: 'id', 
			typeName: cfg.featureType,
			
			proxy : new Ext.data.HttpProxy({
				method: 'GET',
				url: this.wfsURL
			}),
			
			fields: cfg.fields
		});
	},
	
	onTargetSelect: function(check, rowIndex, e) {
		var grid = check.grid;
		var record = grid.store.getAt(rowIndex);
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
		}

		var geometry = this.getGeometry(map, geom);
		if(geometry) {
			var feature = new OpenLayers.Feature.Vector(geometry,{ "bersID": record.get("id")});
			targetLayer.addFeatures([feature]);						
		}
		
	},
	
	onTargetDeselect: function (selMod, rowIndex, record){
		var map = this.target.mapPanel.map;
		var targetLayer = map.getLayersByName("Bersaglio Selezionato")[0];
		var unSelectFeatures= targetLayer.getFeaturesByAttribute("bersID", record.get("id"));
		targetLayer.removeFeatures(unSelectFeatures);
	},
	
	getGeometry: function(map, geom) {
		var mapPrj = map.getProjectionObject();
		var selectionPrj = new OpenLayers.Projection("EPSG:32632");
		var transform = mapPrj.equals(selectionPrj);
		var pointList;
		var geometry;
		
		switch(geom.type){
			case 'Polygon':
			case 'MultiPolygon':
				var polygons = [];
				for(var i = 0, polygon; polygon = geom.coordinates[i]; i++) {
					var rings = [];
					for(var j = 0, ring; ring = polygon[j]; j++) {
						pointList = [];		
						for(var p=0, coords; coords = ring[p] ; p++) {
							var newPoint = new OpenLayers.Geometry.Point(coords[0],coords[1]);
							if(!transform){												
								newPoint = newPoint.transform(
									selectionPrj,
									mapPrj														
								);											
							}
							pointList.push(newPoint);
						}
						rings.push(new OpenLayers.Geometry.LinearRing(pointList));
					}
					polygons.push(new OpenLayers.Geometry.Polygon(rings));
				}
				
				geometry = new OpenLayers.Geometry.MultiPolygon(polygons);				
				break;			
		}
		return geometry;
	},
	
	buildGrid: function(cfg) {
		var store = cfg.store;
		
		var checkConf = {
			listeners: {
				scope: this,				
				rowdeselect: this.onTargetDeselect,
				rowselect: this.onTargetSelect
			}
		};
		var checkSelModel = new Ext.grid.CheckboxSelectionModel(checkConf);
		return new Ext.grid.GridPanel({
			id: this.id+cfg.featureType,
			store: cfg.store,
            title:cfg.title,

			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
			colModel: new Ext.grid.ColumnModel({
				columns: [checkSelModel,this.getZoomToAction()].concat(cfg.columnModel)
			}),
			viewConfig : {
				forceFit: true
			},
            sm: checkSelModel,
			bbar: new Ext.ux.LazyPagingToolbar({
				store: store,
				pageSize: 10									
			})/*,
			listeners: {
				scope: this,
				rowclick: this.onTargetSelect
			}*/
		});
	},	
	
    /** api: method[addOutput]
     */
    addOutput: function(config) {
		var grids = [];
		var info = {
			currentlyLoading: 0,
			hasData : false
		};
		for(var targetName in this.targets) {
			if(this.targets.hasOwnProperty(targetName)) {
				var targetCfg = this.targets[targetName];
				
				// build store
				targetCfg.store = this.buildStore(targetCfg);
				
				
				// build grid
				targetCfg.grid = this.buildGrid(targetCfg);
				
				targetCfg.store.grid = targetCfg.grid;
				
				targetCfg.store.info = info;
				
				targetCfg.store.on('load', function(str, records) {
					str.info.currentlyLoading--;
					if(records.length === 0) {
						str.grid.hide();
						tabPanel.hideTabStripItem(str.grid);
						if(str.info.currentlyLoading === 0 && !str.info.hasData) {
							Ext.Msg.show({
								title: 'Avviso',
								msg: 'Nessun bersaglio trovato',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.WARNING
							});
						}
					} else {
						str.info.hasData = true;
						tabPanel.setActiveTab(str.grid);
					}
				});
				
				Ext.apply(targetCfg.grid, config || {});
				grids.push(targetCfg.grid);
			}
		}
		
        var tabPanel = new Ext.TabPanel({
            id: this.id,
            activeTab: 0,
            items: grids,
			targets: this.targets,
			layoutOnTabChange: true,
			/** api: method[hideAllBut]
			 */	
			hideAllBut: function(attribute, attributeValue) {
				var grids  = [];
				var activated =false;
				for(var targetName in this.targets) {
					if(this.targets.hasOwnProperty(targetName)) {
						var grid = this.targets[targetName].grid;
						if(attribute) {
							var value = this.targets[targetName][attribute];
							if(value === attributeValue) {
								grid.show();
								this.unhideTabStripItem(grid);
								/*if(!activated) {
									this.setActiveTab(grid);
									activated = true;
								}*/
								grids.push(grid);
							} else {
								grid.hide();
								this.hideTabStripItem(grid);
							}
						} else {
							grid.show();
							this.unhideTabStripItem(grid);
							/*if(!activated) {
								this.setActiveTab(grid);
								activated = true;
							}*/
							grids.push(grid);
						}
					}
				}
				return grids;
			},
			
			/** api: method[loadGrid]
			 */	
			loadGrids: function(attributeName, attributeValue, projection, viewParams) {				
				var grids = this.hideAllBut(attributeName, attributeValue);
				if(grids.length === 0) {
					Ext.Msg.show({
						title: 'Avviso',
						msg: 'Nessun bersaglio trovato',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARNING
					});
					tabPanel.collapse();
				}				
				for(var i=0, grid, store; grid=grids[i]; i++) {
					store = grid.getStore();
					store.resetTotal();
					store.removeAll();
									
					var params = {
						startindex: 0,          
						maxfeatures: 10,
						sort: "id_tema"
					};
					
					/*if(query) {
						store.setBaseParam("filter", query);
						store.setBaseParam("srsName", projection);
					}*/
					
					if(viewParams){
						store.setBaseParam("viewParams", viewParams);
					}
					store.info.currentlyLoading++;
					store.info.hasData = false;
					store.load({
						params: params
					});	
				}									
			}
			
        });

                      
        return gxp.plugins.WFSGrid.superclass.addOutput.call(this, tabPanel);        
    },
    
    /** private: method[getZoomToAction]
     */
    getZoomToAction: function(actionConf){
        
        return {
			xtype: 'actioncolumn',
			sortable : false, 
			width: 30,
			items: [{
				icon   : this.zoomToIconPath,  
				tooltip: this.zoomToTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex) {
					var record = grid.store.getAt(rowIndex);
					var map = this.target.mapPanel.map;
					var geometry = this.getGeometry(map, record.get("geometry"))
					map.zoomToExtent(geometry.getBounds());															
				}
			}]  
		 };
    }
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
