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
	
	/** api: config[storeFields]
     *  ``Array[Object]``
     */
	storeFields: null,
	
	/** api: config[columnModel]
     *  ``Array[Object]``
     */
	columnModel: null,
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);         
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
		var fstore = new WFSStore({
			root: 'features',
			idProperty: 'id', 
			typeName: this.featureType,
			
			proxy : new Ext.data.HttpProxy({
				method: 'GET',
				url: this.wfsURL
			}),
			
			fields: this.storeFields
		});
		
		var wfsGridPanel = new Ext.grid.GridPanel({
			id: this.id,
			store: fstore,
			loadMask: {
				msg : "Caricamento Bersagli in corso ..."
			},
			colModel: new Ext.grid.ColumnModel({
				columns: this.columnModel
			}),
			bbar: new Ext.ux.LazyPagingToolbar({
				store: fstore,
				pageSize: 10									
			}),
			listeners: {
				scope: this,
				rowclick: function(grid, rowIndex, e){
					var record = fstore.getAt(rowIndex);
					var geom = record.get("geometry");
					
					var map = this.target.mapPanel.map;
					
					var targetLayer = map.getLayersByName("Bersaglio Selezionato")[0];
					if(!targetLayer){
						targetLayer = new OpenLayers.Layer.Vector("Bersaglio Selezionato",{
							displayInLayerSwitcher: false
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

        config = Ext.apply(wfsGridPanel, config || {});
        var wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        return wfsGrid;
    }   
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
