/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = GeoExplorer.Composer(config)
 *  extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a GeoExplorer application intended for full-screen display.
 */
GeoExplorer.Composer = Ext.extend(GeoExplorer, {

    // Begin i18n.
    backText: "Back",
    nextText: "Next",
    fullScreenText: "Full Screen",	
    cswFailureAddLayer: ' The layer cannot be added to the map',
	cswZoomToExtentMsg: "BBOX not available",
	cswZoomToExtent: "CSW Zoom To Extent",
	
    /**
    * Property: cswMsg
    * {string} string to add in loading message
    * 
    */
    cswMsg: 'Loading...',
    // End i18n.

    constructor: function(config) {

		if(!config.tools)
		{
		    config.tools = [
		        {
		            ptype: "gxp_layertree",
                    id: "layertree_plugin",
		            outputConfig: {
		                id: "layertree"
		            },
		            outputTarget: "tree"
		        }, {
		            ptype: "gxp_legend",
                    id: "legend_plugin",
		            outputTarget: 'legend',
		            outputConfig: {
		                autoScroll: true
		            },
		            legendConfig : {
		                legendPanelId : 'legendPanel',
		                defaults: {
		                    style: 'padding:5px',                  
		                    baseParams: {
		                        LEGEND_OPTIONS: 'forceLabels:on;fontSize:10',
		                        WIDTH: 20, HEIGHT: 20
		                    }
		                }
		            }
		        }, {
		            ptype: "gxp_addlayers",
                    id: "addlayers_plugin",
		            actionTarget: "tree.tbar",
					id: "addlayers"
		        }, {
		            ptype: "gxp_removelayer",
                    id: "removelayer_plugin",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_removeoverlays",
                    id: "removeoverlays_plugin",
		            actionTarget: "tree.tbar"
		        }, {
		            ptype: "gxp_addgroup",
                    id: "addgroup_plugin",
		            actionTarget: "tree.tbar"
		        }, {
		            ptype: "gxp_removegroup",
                    id: "removegroup_plugin",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_groupproperties",
                    id: "groupproperties_plugin",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_layerproperties",
                    id: "layerproperties_plugin",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_zoomtolayerextent",
                    id: "zoomtolayerextent_plugin",
		            actionTarget: {target: "layertree.contextMenu", index: 0}
		        },{
		            ptype:"gxp_geonetworksearch",
                    id: "geonetworksearch_plugin",
		            actionTarget: ["layertree.contextMenu"]
		        }, {
		            ptype: "gxp_zoomtoextent",
                    id: "zoomextent_plugin",
		            actionTarget: {target: "paneltbar", index: 15}
		        }, {
		            ptype: "gxp_navigation", 
                    id: "navigation_plugin",
                    toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 16}
		        }, {
                    id: "zoombox_separator",
		            actions: ["-"], 
                    actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_zoombox", 
                    id: "zoombox_plugin",
                    toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 17}
		        }, {
		            ptype: "gxp_zoom",
                    id: "zoom_plugin",
		            actionTarget: {target: "paneltbar", index: 18}
		        }, {
                    id: "navigationhistory_separator",
		            actions: ["-"], 
                    actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_navigationhistory",
                    id: "navigationhistory_plugin",
		            actionTarget: {target: "paneltbar", index: 19}
		        }, {
                    id: "wmsgetfeatureinfo_menu_separator",
		            actions: ["-"], 
                    actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_wmsgetfeatureinfo_menu", 
                    id: "wmsgetfeatureinfo_plugin",
					toggleGroup: this.toggleGroup,
					useTabPanel: true,
		            actionTarget: {target: "paneltbar", index: 20}
		        }, {
                    id: "measure_separator",
		            actions: ["-"], 
                    actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_measure", 
                    id: "measure_plugin",
                    toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 21}
		        }
		    ];

            if(config.removeTools) {
                for(var r=0; r < config.removeTools.length; r++) {
                    config.tools = this.removeTool(config.tools, config.removeTools[r]);
                }
            }
            
			if(config.customTools)
			{
				for(var c=0; c < config.customTools.length; c++)
				{
					var toolIsDefined = false;
                    var t=0;
					for(t=0; t < config.tools.length; t++)
					{
						//plugin already defined
						if( config.tools[t]['ptype'] && config.tools[t]['ptype'] == config.customTools[c]['ptype'] ) {
                            toolIsDefined = true;
                            if(config.customTools[c].forceMultiple){
                                config.tools.push(config.customTools[c])
                            }else{
                                config.tools[t]=config.customTools[c];
                            }
                            break;
						}
					}
				
					if(!toolIsDefined){
                        config.tools.push(config.customTools[c])
                    }
				}
			}
			
        }//END: if(!config.tools)

        if (config.showGraticule == true){
            config.tools.push({
                ptype: "gxp_graticule",
                id: "graticule_plugin",
                actionTarget: {target: "paneltbar", index: 22}
            })
        }
		
		config.tools.push({
			actions: ["-"], actionTarget: "paneltbar"
		});
		
		// ////////////////////////////////////////////////////////////
		// Check if the Save plugin already exists (for example this 
		// could be exists in an imported configuraztion file (.map), 
		// see the ImportExport plugin).
		// ////////////////////////////////////////////////////////////
		var savePlugin = false;
		for(i=0; i<config.tools.length; i++){
			if(config.tools[i]["ptype"] == "gxp_saveDefaultContext"){
				var savePlugin = true;
				break;
			}
		}
		
		if(!savePlugin){
			config.tools.push({
				ptype: "gxp_saveDefaultContext",
                id: "saveDefaultContext_plugin",
				actionTarget: {target: "paneltbar", index: 21},
				needsAuthorization: true
			});
		}
        
        GeoExplorer.Composer.superclass.constructor.apply(this, arguments);
    },

    /** api: method[destroy]
     */
    destroy: function() {
        this.loginButton = null;
        GeoExplorer.Composer.superclass.destroy.apply(this, arguments);
    },
    
    
    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
    
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);

        if(!this.fScreen){
            var fullScreen = new Ext.Button({
                text: this.fullScreenText,
                id: "full-screen-button",
                iconCls: "icon-fullscreen",
                enableToggle: true,
				state:{},
				tools:{},
				scale: this.actionToolScale,
                handler: function(button, evt){
                    if(button.pressed){
                       var tree = Ext.getCmp('tree');
					   
						if(tree){
							var panel = tree.findParentByType('panel');
							if(panel){
								button.saveState(panel);
								panel.collapse(true);
							}
						}	
						
						var east = Ext.getCmp('east');
						if(east){
							button.saveState(east);
							east.collapse(true);
							
						}
						
						var south = Ext.getCmp('south');
						if(south){
							button.saveState(south);
							south.collapse(true);
						}
                    } else {
						for(var tool in button.tools){
							button.restoreState(button.tools[tool]);
						}                        
                    }
                },
				//restore the previous state of the button
				restoreState: function(panel){
					if(!this.state) return;
					var id = panel.getId();
					var wasVisible = this.state[id];
					if(panel && wasVisible){
						panel.expand(true);
					}
				},
				//save the state of the button
				saveState: function(panel){
					if(!this.state) return;
					var id =panel.getId();
					if(id){
						this.state[id] = panel.isVisible();
					}
					if(!this.tools[id]){
						this.tools[id] = panel;
					}
				}
            });

            tools.unshift(fullScreen);
        }else{
			var layerChooser = new Ext.Button({
				//tooltip: 'Layer Switcher',	//TODO uncomment in ExtJS >= 4.1, http://goo.gl/x1c5X
				iconCls: 'icon-layer-switcher',
				menu: new gxp.menu.LayerMenu({
					layers: this.mapPanel.layers
				})
			});

			tools.unshift(layerChooser);
		}
        
        return tools;

    },
	
	/** private: method[addLoadingMask]
     */
	addLoadingMask: function(panel) {		
		var loading = Ext.DomHelper.append(panel.el.parent(), {
			tag:'div',
			cls:'loading-iframe'
		}, true);		
		var iframe = panel.el.dom;
		if (iframe.attachEvent){
			iframe.attachEvent("onload", function(){
				loading.hide();
			});
		} else {
			iframe.onload = function(){
				loading.hide();
			};
		}
	}
});
