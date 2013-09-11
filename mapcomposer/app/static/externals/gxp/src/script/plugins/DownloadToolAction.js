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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = DownloadToolAction
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: DownloadToolAction(config)
 *	
 *  This class allows interactions between LayerTree and DownloadTool.
 *  The layer instance is added to the tool on the fly in order to provide 
 *  data download.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.DownloadToolAction = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_downloadtoolaction */
    ptype: "gxp_downloadtoolaction",
	
	downloadTool: "download",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedLayer;
        this.downloadTool = this.target.tools[this.downloadTool];
		
        var actions = gxp.plugins.GeonetworkSearch.superclass.addActions.apply(this, [{
            menuText: "Download Tool",
            icon :'theme/app/img/download.png',
            disabled: true,
            tooltip: this.downloadToolActionTip,
            handler: function() {
                var record = selectedLayer;
                if(record) {		

					// //////////////////////////////////////////////////
					// Remove the layer from the map. The layer will be 
					// re-added to the map from the Downlaod tool. 
					// In this way the user can view the selected layer
				    // on top.
					// //////////////////////////////////////////////////
					
					/*var OlMap = this.target.mapPanel.map;
					var layer = OlMap.getLayersByName(record.data.title)[0];
					var layerExistsInMap = layer ? true : false;
					if(layerExistsInMap){
						OlMap.removeLayer(layer);
					}*/
								
					var ownerCt = this.downloadTool.formPanel.ownerCt;
					
					if(ownerCt){
						if(ownerCt instanceof Ext.TabPanel){
							ownerCt.setActiveTab(this.downloadTool.formPanel);
						}
						
						if(ownerCt.collapsed){
							ownerCt.expand();
						}
					}else if(this.downloadTool.formPanel.collapsed){
						this.downloadTool.formPanel.expand();
					}
					
					this.downloadTool.setLayer(record);
                }
            },
            scope: this
        }]);
        
        var downloadToolAction = actions[0];

        this.target.on("layerselectionchange", function(record) {
            selectedLayer = record.get('group') === 'background' ? null : (record.get('name') ? record : null);
            var hasKeywords = record.get('keywords') && (record.get('keywords').length > 0);
            downloadToolAction.setDisabled(
                 !selectedLayer || this.target.mapPanel.layers.getCount() <= 1 || !record || !hasKeywords
            );
        }, this);
        
        var enforceOne = function(store) {
            downloadToolAction.setDisabled(
                !selectedLayer || store.getCount() <= 1
            );
        };
        
        this.target.mapPanel.layers.on({
            "add": enforceOne,
            "remove": function(store){
                downloadToolAction.setDisabled(true);
            }
        });
        
        return actions;
    }        
});

Ext.preg(gxp.plugins.DownloadToolAction.prototype.ptype, gxp.plugins.DownloadToolAction);
