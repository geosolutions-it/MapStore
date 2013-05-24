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
 *  class = TabPanelWFSGrids
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: TabPanelWFSGrids(config)
 *
 *    WFS interface to show data in a Ext.Grid
 */   
gxp.plugins.TabPanelWFSGrids = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_tabpanelwfsgrids",
    
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
    
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    emptyMsg: "No topics to display",
    
        
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.TabPanelWFSGrids.superclass.constructor.apply(this, arguments);         
    },
	
	buildGrid: function(cfg) {
            return new gxp.plugins.WFSGrid(cfg);
	},	
	
    /** api: method[addOutput]
     */
    addOutput: function(config) {
   
		this.grids = [];
		var info = {
			currentlyLoading: 0,
			hasData : false
		};
              
		for(var targetName in this.targets) {
			if(this.targets.hasOwnProperty(targetName)) {
				var targetCfg = this.targets[targetName];
                                var title = targetCfg.title || targetName;
                                if(title instanceof Array) {
                                    title = title[GeoExt.Lang.getLocaleIndex()];
                                }
                                // build grid
                                var wfsGridConf={
                                    "outputTarget": this.id,
                                    "title": title,
                                    "name": targetCfg.name || '',
                                    "id": targetCfg.id || targetName,
                                    "protocolType": "GET",
                                    "fields": targetCfg.fields || null,
                                    "wfsURL": this.wfsURL,
                                    "loadMsg": "Caricamento Bersagli in corso ...",
                                    "emptyMsg": "Nessun bersaglio trovato",
                                    "displayMsgPaging": "Bersagli {0} - {1} of {2}",
                                    "featureType": targetCfg.featureType,
                                    "pageSize": 10/*this.pageSize*/,
                                    "srsName": this.srsName, 
                                    "version": "1.1.0",
                                    "columns" : targetCfg.columns,
                                    "actionColumns" : this.actionColumns
                                };
				targetCfg.grid = this.buildGrid(wfsGridConf);
                                targetCfg.grid.type= targetCfg.type;
				
				Ext.apply(targetCfg.grid, config || {});
				this.grids.push(targetCfg.grid);
			}
		}
        var me= this;
        var tabPanel = new Ext.TabPanel({
            enableTabScroll: true,
            id: this.id,
            activeTab: 0,
            items: [],
			targets: this.targets,
			layoutOnTabChange: true,
			/** api: method[hideAllBut]
			 */	
                        listeners: {
                            "afterrender": function(){
                                
                                
                            }
                        },
			hideAllBut: function(attribute, attributeValue) {
				var gridsLoad  = [];
				
                                for(var i=0; i<me.grids.length; i++) {
                                   if(attribute) {
					var value = me.grids[i][attribute];
					if(value == attributeValue) {
					    gridsLoad.push(me.grids[i]);
					} 
				   } else {
					
					gridsLoad.push(me.grids[i]);
				  } 
                                }
				return gridsLoad;
			},
                        
                        removeAllGrids: function(){
                            var toRemove = [];
                            for(var i=0; i<this.items.items.length;i++){
                                toRemove.push(this.items.items[i]);                                   
                            }
                            for(i=0; i<toRemove.length;i++){
                                toRemove[i].destroy();
                            }
                        },
			
			/** api: method[loadGrid]
			 */	
			loadGrids: function(attributeName, attributeValue, projection, viewParams) {	
                                this.removeAllGrids();
				var grids = this.hideAllBut(attributeName, attributeValue);
				if(grids.length === 0) {
					Ext.Msg.show({
						title: 'Avviso',
						msg: 'Nessun bersaglio trovato',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARNING
					});
					this.collapse();
				}	
                var tabPanel = this;
                for(var i=0; i<grids.length;i++){
                    grids[i].target= me.target;
                    grids[i].viewParams= viewParams;
                    grids[i].addOutput();
                    grids[i].onEmpty=function(grid) {
                        tabPanel.hideTabStripItem(grid.wfsGrid);
                        //grid.wfsGrid.destroy();
                    };
                    this.setActiveTab(i);
                }
                
                this.setActiveTab(0);                               
			}
			
        });

                      
        return gxp.plugins.TabPanelWFSGrids.superclass.addOutput.call(this, tabPanel);        
    }
    
    
});

Ext.preg(gxp.plugins.TabPanelWFSGrids.prototype.ptype, gxp.plugins.TabPanelWFSGrids);
