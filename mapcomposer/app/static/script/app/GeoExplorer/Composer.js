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
		            outputConfig: {
		                id: "layertree"
		            },
		            outputTarget: "tree"
		        }, {
		            ptype: "gxp_legend",
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
		            actionTarget: "tree.tbar",
					id: "addlayers"
		        }, {
		            ptype: "gxp_removelayer",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_removeoverlays",
		            actionTarget: "tree.tbar"
		        }, {
		            ptype: "gxp_addgroup",
		            actionTarget: "tree.tbar"
		        }, {
		            ptype: "gxp_removegroup",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_groupproperties",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_layerproperties",
		            actionTarget: ["tree.tbar", "layertree.contextMenu"]
		        }, {
		            ptype: "gxp_zoomtolayerextent",
		            actionTarget: {target: "layertree.contextMenu", index: 0}
		        },{
		            ptype:"gxp_geonetworksearch",
		            actionTarget: ["layertree.contextMenu"]
		        }, {
		            ptype: "gxp_zoomtoextent",
		            actionTarget: {target: "paneltbar", index: 15}
		        }, {
		            ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 16}
		        }, {
		            actions: ["-"], actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_zoombox", toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 17}
		        }, {
		            ptype: "gxp_zoom",
		            actionTarget: {target: "paneltbar", index: 18}
		        }, {
		            actions: ["-"], actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_navigationhistory",
		            actionTarget: {target: "paneltbar", index: 19}
		        }, {
		            actions: ["-"], actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_wmsgetfeatureinfo_menu", 
					toggleGroup: this.toggleGroup,
					useTabPanel: true,
		            actionTarget: {target: "paneltbar", index: 20}
		        }, {
		            actions: ["-"], actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_measure", toggleGroup: this.toggleGroup,
		            actionTarget: {target: "paneltbar", index: 21}
		        }, {
		            actions: ["-"], actionTarget: "paneltbar"
		        }, {
		            ptype: "gxp_googleearth",
		            actionTarget: {target: "paneltbar", index: 25}
		        }
		    ];

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
				scale: this.actionToolScale,
                handler: function(button, evt){
                    if(button.pressed){
                       var tree = Ext.getCmp('tree');
						if(tree){
							var panel = tree.findParentByType('panel');
							if(panel){
								panel.collapse();
							}							
						}	
						
						var east = Ext.getCmp('east');
						if(east){
							east.collapse();
						}
						
						var south = Ext.getCmp('south');
						if(south){
							south.collapse();
						}
                    } else {
                        var tree = Ext.getCmp('tree');
						if(tree){
							var panel = tree.findParentByType('panel');
							if(panel){
								panel.expand();
							}							
						}						
						
						var east = Ext.getCmp('east');
						if(east){
							east.expand();
						}
						
						var south = Ext.getCmp('south');
						if(south){
							south.expand();
						}
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
