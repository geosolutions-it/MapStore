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
 * @author Tobia Di Pisa
 */

/** api: (define)
 *  module = gxp
 *  class = OverviewMap
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class::OverviewMap(config)
 *   
 *      create a panel to display a OverviewMap on the map
 */
gxp.plugins.OverviewMap = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_overviewmap */
    ptype: "gxp_overviewmap",
	
	/** api: config[map]
     *  ``OpenLayers.Map`` or :class:`GeoExt.MapPanel`
     *  The map where to show the watermark.
     */
    map: null,
	
	/** api: config[layers]
     *  ``Array`` 
     *  The layers to add to the overview panel.
     */
	layers: null,
	
	/** api: config[maximized] 
     */
	maximized: true,
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
		gxp.plugins.OverviewMap.superclass.init.apply(this, arguments);
		this.target = target;
		
		this.target.on('ready', function(){
			this.addOverviewMap();
		}, this);
    },
	
    /** private: method[addOverviewMap]
     *  
     */
    addOverviewMap: function() {
		this.map = this.target.mapPanel.map;
		
		var mapOptions = {
			maxExtent: this.map.getMaxExtent(), 
			projection: this.map.getProjection()
		};
		
		var overviewLayers = [];		
					
		if(this.layers){
			for (var i=0; i < this.layers.length; i++) {				
				if(this.layers[i]){					
					var layer = new OpenLayers.Layer.WMS(
						this.layers[i].title, 
						this.layers[i].wmsserver,                        
						this.layers[i].parameters,
						this.layers[i].options
					);
					
					overviewLayers.push(layer);
				}
			}
		} else {
			var baseLayer = new OpenLayers.Layer.Google(
				"Google Hybrid",
				{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
			);
		
			overviewLayers.push(baseLayer);
		} 			
		
		var overview = new OpenLayers.Control.OverviewMap({
			maximized: this.maximized,
			mapOptions: OpenLayers.Util.extend(mapOptions, {
				maxExtent: this.map.getMaxExtent()
			}),
			layers: overviewLayers
		});
		
		this.map.addControl(overview);
    }
});

Ext.preg(gxp.plugins.OverviewMap.prototype.ptype, gxp.plugins.OverviewMap);