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
    exportMapText: "Publish Map",
    toolsTitle: "Choose tools to include in the toolbar:",
    previewText: "Preview",
    backText: "Back",
    nextText: "Next",
    fullScreenText: "Full Screen",	

    cswFailureAddLayer: ' The layer cannot be added to the map',
    alertEmbedTitle: "Attention",
    alertEmbedText: "Save the map before using the 'Publish Map' tool",
	
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
		                        WIDTH: 12, HEIGHT: 12
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
		}, {
			ptype: "gxp_saveDefaultContext",
			actionTarget: {target: "paneltbar", index: 24},
			needsAuthorization: true
		});
        
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
                handler: function(button, evt){
                    if(button.pressed){
                        Ext.getCmp('tree').findParentByType('panel').collapse();
                    } else {
                        Ext.getCmp('tree').findParentByType('panel').expand();
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
        
		if(this.mapId && this.mapId != -1){
			tools.push(new Ext.Button({
				tooltip: this.exportMapText,
				handler: function() {
					this.showEmbedWindow();
				},
				scope: this,
				iconCls: 'icon-export'
			}));
			
			tools.push('-');
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
	},

    /** private: method[openPreview]
     */
    openPreview: function(embedMap) {
        var preview = new Ext.Window({
            title: this.previewText,
            layout: "fit",
            resizable: false,
            items: [{border: false, html: embedMap.getIframeHTML()}]
        });
        preview.show();
        var body = preview.items.get(0).body;
        var iframe = body.dom.firstChild;
        var loading = new Ext.LoadMask(body);
        loading.show();
        Ext.get(iframe).on('load', function() { loading.hide(); });
    },

    /** private: method[showEmbedWindow]
     */
    showEmbedWindow: function() {        
	    if (this.mapId == -1 || (this.modified == true && this.auth == true)){
            Ext.MessageBox.show({
                title: this.alertEmbedTitle,
                msg: this.alertEmbedText,
                buttons: Ext.MessageBox.OK,
                animEl: 'mb4',
                icon: Ext.MessageBox.WARNING,
                scope: this
            });
        }else{
           var toolsArea = new Ext.tree.TreePanel({title: this.toolsTitle, 
               autoScroll: true,
               root: {
                   nodeType: 'async', 
                   expanded: true, 
                   children: this.viewerTools
               }, 
               rootVisible: false,
               id: 'geobuilder-0'
           });

           var previousNext = function(incr){
               var l = Ext.getCmp('geobuilder-wizard-panel').getLayout();
               var i = l.activeItem.id.split('geobuilder-')[1];
               var next = parseInt(i, 10) + incr;
               l.setActiveItem(next);
               Ext.getCmp('wizard-prev').setDisabled(next==0);
               Ext.getCmp('wizard-next').setDisabled(next==1);
               if (incr == 1) {
                   this.saveAndExport();
               }
           };
           
           var curLang = OpenLayers.Util.getParameters()["locale"] || 'en';            
           
           var embedMap = new gxp.EmbedMapDialog({
               id: 'geobuilder-1',
               url: "viewer" + "?locale=" + curLang + "&bbox=" + this.mapPanel.map.getExtent() + "&mapId=" + this.mapId
           });

           var wizard = {
               id: 'geobuilder-wizard-panel',
               border: false,
               layout: 'card',
               activeItem: 0,
               defaults: {border: false, hideMode: 'offsets'},
               /*bbar: [{
                   id: 'preview',
                   text: this.previewText,
                   handler: function() {
                       //this.saveAndExport(this.openPreview.createDelegate(this, [embedMap]));
                       this.openPreview(embedMap);
                   },
                   scope: this
               }, '->', {
                   id: 'wizard-prev',
                   text: this.backText,
                   handler: previousNext.createDelegate(this, [-1]),
                   scope: this,
                   disabled: true
               },{
                   id: 'wizard-next',
                   text: this.nextText,
                   handler: previousNext.createDelegate(this, [1]),
                   scope: this
               }],*/

               items: [embedMap]
               //items: [toolsArea, embedMap]
           };

           new Ext.Window({
                layout: 'fit',
                width: 500, height: 300,
                title: this.exportMapText,
                items: [wizard]
           }).show();
        }
    }
});
