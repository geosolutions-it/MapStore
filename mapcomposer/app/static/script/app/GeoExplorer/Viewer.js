/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = Embed
 *  base_link = GeoExplorer
 */
Ext.namespace("GeoExplorer");

/** api: constructor
 *  ..class:: GeoExplorer.Viewer(config)
 *
 *  Create a GeoExplorer application suitable for embedding in larger pages.
 */
GeoExplorer.Viewer = Ext.extend(GeoExplorer, {
    
    applyConfig: function(config) {
        var allTools = config.viewerTools || this.viewerTools;
        var tools = [];
        var toolConfig;
		
		// /////////////////////////////////////////////////////////////////////////
        // We need to start counting at 2 since there is the Layer Switcher and a 
        // split button already
		// /////////////////////////////////////////////////////////////////////////
        var counter = 15;
		
        for (var i=0, len=allTools.length; i<len; i++) {
            var tool = allTools[i];
            if (tool.checked === true) {
                var properties = ['checked', 'iconCls', 'id', 'leaf', 'loader', 'text'];
                for (var key in properties) {
                    delete tool[properties[key]];
                }
                toolConfig = Ext.applyIf({
                    actionTarget: {target: "paneltbar", index: counter}
                }, tool);
                if (tool.numberOfButtons !== undefined) {
                    counter += tool.numberOfButtons;
                } else {
                    counter++;
                }
                tools.push(toolConfig);
            }
        }
		
        config.tools = tools;
        
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
				for(t=0; t < config.tools.length; t++){
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
		
		// ///////////////////////////////////////////////////////////////////////////
		// TODO: Fix this. The ImportExport plugin should not be added to the Viewer
		//       We have to decide what are the configurations that are to be saved in 
		//       the composer necessarily.
		// ////////////////////////////////////////////////////////////////////////////
		for(var y = 0; y < config.tools.length; y++){
			if( config.tools[y]['ptype'] && config.tools[y]['ptype'] == "gxp_importexport" ) {	
				config.tools.splice(y, 1);
				break;
			}
		}
		
        GeoExplorer.Viewer.superclass.applyConfig.call(this, config);
    },

    /** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {
        this.appMask = new Ext.LoadMask(Ext.getBody(), {msg: this.mainLoadingMask});
		this.appMask.show();
		
        this.toolbar = new Ext.Toolbar({
            disabled: true,
            id: "paneltbar",
			enableOverflow: true,
            items: this.createTools()
        });
        
        this.on("ready", function() {
        	this.toolbar.enable();
			this.bottom_toolbar.enable();
			
			// //////////////////////////////////////////////////////////////////
			// Automatically inject markers if present in loaded configuration
			// //////////////////////////////////////////////////////////////////
			if(this.markers){
				this.showMarkerGeoJSON("Markers", this.markers);
			}else if(this.markersURL){
				var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
				var mHost = pattern.exec(this.markersURL);

				var mUrl = this.markersURL;

				Ext.Ajax.request({
				   url: mHost[2] == location.host ? mUrl : proxy + mUrl,
				   method: 'GET',
				   scope: this,
				   headers:{
					  'Accept': "application/json"
				   },
				   success: function(response, opts){  						
						var markersConfig = response.responseText;
						
						if(markersConfig){
							this.markers = markersConfig;
							this.showMarkerGeoJSON("Markers", this.markers, true);
							
							this.fireEvent("markersloadend", this.markers);
						}
				   },
				   failure: function(response, opts){
					  Ext.Msg.show({
							 title: this.urlMarkersTitle,
							 msg: response.responseText,
							 width: 300,
							 icon: Ext.MessageBox.ERROR
					  });
				   }
				}); 
			}
			
			this.appMask.hide();
			
        }, this);

        this.mapPanelContainer = new Ext.Panel({
            layout: "card",
            region: "center",
            defaults: {
                border: false
            },
            items: [
                this.mapPanel,
                new gxp.GoogleEarthPanel({
                    mapPanel: this.mapPanel,
                    listeners: {
                        beforeadd: function(record) {
                            return record.get("group") !== "background";
                        },
				        pluginready: function() {
				        }
                    }
                })
            ],
            activeItem: 0
        });
        var portalItems =[this.mapPanelContainer];
        if(this.customPanels){
            portalItems=portalItems.concat(this.customPanels);
        }
		
		this.bottom_toolbar = new Ext.Toolbar({
            disabled: true,
            id: 'panelbbar',
			enableOverflow: true
        });	
		
        this.portalItems = [{
            region: "center",
            layout: "border",
            tbar: this.hideTopToolbar === true ? undefined : this.toolbar,
			bbar: this.hideBottomToolbar === true ? undefined : this.bottom_toolbar,
            items: portalItems
        }];
        
        GeoExplorer.superclass.initPortal.apply(this, arguments);        
    },

    /**
     * api: method[createTools]
     * Create the various parts that compose the layout.
     */
    createTools: function() {
		if(!this.disableLayerChooser){
        var tools = GeoExplorer.Viewer.superclass.createTools.apply(this, arguments);
		
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
    }
});
