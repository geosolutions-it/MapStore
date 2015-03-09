/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * 
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = GeoExplorer.Composer(config)
 *  extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a Composer for GCD
 */
GeoExplorer.GCDViewer = Ext.extend(GeoExplorer.Composer, {
    
    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        //Call super class to avoid fullscreen
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);
        return tools;

    },
	/** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {
        this.appMask = new Ext.LoadMask(Ext.getBody(), {msg: this.mainLoadingMask});
		this.appMask.show();
		
        
        
        this.toolbar = new Ext.Toolbar({
            disabled: true,
            id: 'paneltbar',
			enableOverflow: true,
            items: this.createTools()
        });
        
        this.on("ready", function() {
			// /////////////////////////////////////
            // Enable only those items that were not 
			// specifically disabled
            // /////////////////////////////////////
			
			// Top Toolbar
			var disabled = this.toolbar.items.filterBy(function(item) {
                return item.initialConfig && item.initialConfig.disabled;
            });
            
            this.toolbar.enable();
            
            disabled.each(function(item) {
                item.disable();
            });
			
			// Bottom Toolbar
			disabled = this.toolbar.items.filterBy(function(item) {
                return item.initialConfig && item.initialConfig.disabled;
            });
            
            this.bottom_toolbar.enable();
            
            disabled.each(function(item) {
                item.disable();
            });		
			
			this.appMask.hide();
		});
       
        this.mapPanel.region = 'center';
        this.mapPanel.border =false;
        this.mapPanelContainer = new Ext.Panel({
            border:false,
            layout: "border",
            id:'mapPanelContainer',
            region: "center",
            defaults: {
                border: false
            },
            items: [
                this.mapPanel
            ].concat(this.mapPanelContainerPanels || []),
            activeItem: 0,
            tbar: this.toolbar
        });
		
        var portalPanels = [this.mapPanelContainer];
		
		//collect additional panels to add them after init portal
		var additionalPanels = [];
		
        if(this.customPanels){
			var toPortal = [];
			var pans = this.customPanels;
			for (var i = 0; i < pans.length; i++){
				if(pans[i].target){
					additionalPanels.push(pans[i]);					
				}else{
					toPortal.push(pans[i]);
				}
			}
			
            var portalPanels = portalPanels.concat(toPortal);
        }
		
		this.bottom_toolbar = new Ext.Toolbar({
            disabled: true,
            id: 'panelbbar',
			enableOverflow: true
        });
		
        this.portalItems = [{
            region: "center",
            layout: "border",  
			bbar: this.bottom_toolbar,
            items: portalPanels
        }];
        
        GeoExplorer.superclass.initPortal.apply(this, arguments);  
		for(var i = 0; i< additionalPanels.length; i++){
			var target = Ext.getCmp(additionalPanels[i].target);
			target.add(additionalPanels[i]);
			target.doLayout();
		}
    },
        constructor: function(config) {

		if(!config.tools)
		{
		    config.tools = [
		        {
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
		
		
        GeoExplorer.Composer.superclass.constructor.apply(this, arguments);
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
