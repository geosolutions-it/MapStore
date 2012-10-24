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
        // we need to start counting at 2 since there is the Layer Switcher and a 
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
        
		if(config.customTools)
		{
			for(var c=0; c < config.customTools.length; c++)
			{
				var toolIsDefined = false;
				for(var t=0; t < config.tools.length; t++)
				{
					if( config.tools[t]['ptype'] && config.tools[t]['ptype'] == config.customTools[c]['ptype'] ) {	//plugin already defined
						toolIsDefined = true;
						break;
					}
				}
			
				if(!toolIsDefined)
					config.tools.push(config.customTools[c]);
			}
		}
		
        GeoExplorer.Viewer.superclass.applyConfig.call(this, config);
    },

    /** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {

        this.toolbar = new Ext.Toolbar({
            disabled: true,
            id: "paneltbar",
            items: this.createTools()
        });
        
        this.on("ready", function() {
        	this.toolbar.enable();
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
				        	//console.log('Viewer GoogleEarthPanel beforeadd!!!');
                            return record.get("group") !== "background";
                        },
				        pluginready: function() {
				        	//console.log('Viewer GoogleEarthPanel pluginready!!!');
				        }
                    }
                })
            ],
            activeItem: 0
        });

        this.portalItems = [{
            region: "center",
            layout: "border",
            tbar: this.toolbar,
            items: [
                this.mapPanelContainer
            ]
        }];
        
        GeoExplorer.superclass.initPortal.apply(this, arguments);        

    },

    /**
     * api: method[createTools]
     * Create the various parts that compose the layout.
     */
    createTools: function() {
        var tools = GeoExplorer.Viewer.superclass.createTools.apply(this, arguments);

        var layerChooser = new Ext.Button({
			//tooltip: 'Layer Switcher',	//TODO uncomment in ExtJS >= 4.1, http://goo.gl/x1c5X
            iconCls: 'icon-layer-switcher',
            menu: new gxp.menu.LayerMenu({
                layers: this.mapPanel.layers
            })
        });

        //tools.unshift("-");
        tools.unshift(layerChooser);
/*
        var aboutButton = new Ext.Button({
            tooltip: this.aboutText,
            iconCls: "icon-about",
            handler: this.displayAppInfo,
            scope: this
        });

        tools.push("->");
        tools.push(aboutButton);
*/
        return tools;
    }
});
