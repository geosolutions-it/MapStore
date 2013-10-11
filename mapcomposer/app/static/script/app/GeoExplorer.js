/**
 * Copyright (c) 2009-2011 The Open Planning Project
 */

Ext.USE_NATIVE_JSON = true;

(function() {
    // backwards compatibility for reading saved maps
    // these source plugins were renamed after 2.3.2
    Ext.preg("gx_wmssource", gxp.plugins.WMSSource);
    Ext.preg("gx_olsource", gxp.plugins.OLSource);
    Ext.preg("gx_googlesource", gxp.plugins.GoogleSource);
    Ext.preg("gx_bingsource", gxp.plugins.BingSource);
    Ext.preg("gx_osmsource", gxp.plugins.OSMSource);
})();

/**
 * api: (define)
 * module = GeoExplorer
 * extends = gxp.Viewer
 */

/** api: constructor
 *  .. class:: GeoExplorer(config)
 *     Create a new GeoExplorer application.
 *
 *     Parameters:
 *     config - {Object} Optional application configuration properties.
 *
 *     Valid config properties:
 *     map - {Object} Map configuration object.
 *     sources - {Object} An object with properties whose values are WMS endpoint URLs
 *
 *     Valid map config properties:
 *         projection - {String} EPSG:xxxx
 *         units - {String} map units according to the projection
 *         maxResolution - {Number}
 *         layers - {Array} A list of layer configuration objects.
 *         center - {Array} A two item array with center coordinates.
 *         zoom - {Number} An initial zoom level.
 *
 *     Valid layer config properties (WMS):
 *     name - {String} Required WMS layer name.
 *     title - {String} Optional title to display for layer.
 */
var GeoExplorer = Ext.extend(gxp.Viewer, {

    // Begin i18n.
    zoomSliderText: "<div>Zoom Level: {zoom}</div><div>Scale: 1:{scale}</div>",
    loadConfigErrorText: "Trouble reading saved configuration: <br />",
    loadConfigErrorDefaultText: "Server Error.",
    xhrTroubleText: "Communication Trouble: Status ",
    layersText: "Layers",
	legendText: "Legend",
    titleText: "Title",
    saveErrorText: "Trouble saving: ",
    
    bookmarkText: "XML Map Context",
    permakinkText: 'XML',
    
    appInfoText: "GeoExplorer",
    aboutText: "About GeoExplorer",
    mapInfoText: "Map Info",
    descriptionText: "Description",
    contactText: "Contact",
    aboutThisMapText: "About this Map",
    
    userConfigLoadTitle: "Loading User Context",
    userConfigLoadMsg: "Error reading user map context",
    
    viewTabTitle : "View",	
	markerPopupTitle: "Details",
	mainLoadingMask: "Please wait, loading...",
    // End i18n.
    
    //properties for style markers
	markerTemplateDefault: {
		label: "${label}",
		fontWeight: "bold",
		fontSize: "10px",
		fontColor: "#FFFFFF",
        labelSelect: true,
		
		// Set the z-indexes of both graphics to make sure the background
        // graphics stay in the background
        graphicZIndex: 11,
        backgroundGraphicZIndex: 10
	},

	markerTemplateSelected: {
		label: "${label}",
		fontWeight: "bold",
		fontSize: "10px",
		fontColor: "#FFFFFF",
		
		// Set the z-indexes of both graphics to make sure the background
        // graphics stay in the background
        graphicZIndex: 11,
        backgroundGraphicZIndex: 10
	},
    
	externalGraphicMarkers: 'theme/app/img/markers/default_information.png',
    externalGraphicMarkersHighlights: 'theme/app/img/markers/default_information_highlights.png',
	
	externalGraphicClusterMarkers: 'theme/app/img/markers/marker-r.png',
	externalGraphicClusterHighlights: 'theme/app/img/markers/marker-b.png',
		
	markerSelectionIcon: 'theme/app/img/markers/default_information_select.png',
	markerSelectionClusterIcon: 'theme/app/img/markers/marker-y.png',
	
    markerClusterShadow: 'theme/app/img/markers/marker-c-shadow.png',
	markerShadow: 'theme/app/img/markers/markers_shadow.png',

	/**
     * private: property[trackStyle]
     * The properties for style tracks
     */
	trackStyle: {
		strokeColorTracks: "green",
		strokeWidthTracks: 7,
		strokeOpacityTracks: 0.5
	},
    /**
     * private: property[singlePopup]
     * Opens Just one marker popup at time
     */
    singlePopup:false,
    /**
     * private: property[mapPanel]
     * the :class:`GeoExt.MapPanel` instance for the main viewport
     */
    mapPanel: null,
    
    toggleGroup: "toolGroup",
    
    mapId: -1,
    
    auth: false,
    
    fScreen: false,
    
   
    constructor: function(config, mapId, auth, fScreen) {
	
		if(mapId)
            this.mapId = mapId;
        if(auth)
            this.auth = auth;
        if(fScreen){
            this.fScreen = fScreen;
            this.auth = false;
        }
		
		this.mapItems = [
            {
                xtype: "gxp_scaleoverlay",
                topOutUnits: config.scaleOverlayUnits ? config.scaleOverlayUnits.topOutUnits : null,
                topInUnits: config.scaleOverlayUnits ? config.scaleOverlayUnits.topInUnits : null,
                bottomInUnits: config.scaleOverlayUnits ? config.scaleOverlayUnits.bottomInUnits : null,
                bottomOutUnits: config.scaleOverlayUnits ? config.bottomOutUnits : null,
                divisions: 2,
                subdivisions: 2,
                showMinorMeasures: true,
                singleLine: false,
                abbreviateLabel: false,
                enableSetScaleUnits: config.scaleOverlayUnits ? true : false
            }, {
                xtype: "gx_zoomslider",
                vertical: true,
                height: 100,
                plugins: new GeoExt.ZoomSliderTip({
                    template: this.zoomSliderText
                })
            }
        ];
        
		// ///////////////////////////////////////////////////////////////////////////////////
        // both the Composer and the Viewer need to know about the viewerTools
        // First row in each object is needed to correctly render a tool in the treeview
        // of the embed map dialog. TODO: make this more flexible so this is not needed.
		// ////////////////////////////////////////////////////////////////////////////////////
        config.viewerTools = [
		    {
                leaf: true, 
                text: gxp.plugins.AddLayers.prototype.addActionTip, 
                checked: true, 
                iconCls: gxp.plugins.AddLayers.prototype.iconCls,
                ptype: "gxp_addlayers"
            },
			{
                actions: ["-"], checked: true
            },
            {
                leaf: true, 
                text: gxp.plugins.ZoomToExtent.prototype.tooltip, 
                checked: true, 
                iconCls: gxp.plugins.ZoomToExtent.prototype.iconCls,
                ptype: "gxp_zoomtoextent"
            }, {
                leaf: true, 
                text: gxp.plugins.Navigation.prototype.tooltip, 
                checked: true, 
                iconCls: "gxp-icon-pan",
                ptype: "gxp_navigation", 
                toggleGroup: this.toggleGroup
            }, {
                actions: ["-"], checked: true
            }, {
                leaf: true, 
                text: gxp.plugins.ZoomBox.prototype.zoomInTooltip + " / " + gxp.plugins.ZoomBox.prototype.zoomOutTooltip, 
                checked: true, 
                iconCls: "gxp-icon-zoombox-in",
                numberOfButtons: 2,
                ptype: "gxp_zoombox", 
                toggleGroup: this.toggleGroup
            }, {
                leaf: true, 
                text: gxp.plugins.Zoom.prototype.zoomInTooltip + " / " + gxp.plugins.Zoom.prototype.zoomOutTooltip, 
                checked: true, 
                iconCls: "gxp-icon-zoom-in",
                numberOfButtons: 2,
                ptype: "gxp_zoom"
            }, {
                actions: ["-"], checked: true
            }, {
                leaf: true, 
                text: gxp.plugins.NavigationHistory.prototype.previousTooltip + " / " + gxp.plugins.NavigationHistory.prototype.nextTooltip, 
                checked: true, 
                iconCls: "gxp-icon-zoom-previous",
                numberOfButtons: 2,
                ptype: "gxp_navigationhistory"
            }, {
                actions: ["-"], checked: true
            }, {
                leaf: true, 
                text: gxp.plugins.WMSGetFeatureInfo.prototype.infoActionTip, 
                checked: true, 
                iconCls: "gxp-icon-getfeatureinfo",
                ptype: "gxp_wmsgetfeatureinfo", 
                toggleGroup: this.toggleGroup
            }, {
                actions: ["-"], checked: true
            }, {
                leaf: true, 
                text: gxp.plugins.Measure.prototype.measureTooltip, 
                checked: true, 
                iconCls: "gxp-icon-measure-length",
                ptype: "gxp_measure", 
                controlOptions: {immediate: true},
                toggleGroup: this.toggleGroup
            }, {
                actions: ["-"], checked: true
            }
        ];

        
		if(config.customTools)
		{
			for(var c=0; c < config.customTools.length; c++)
			{
				var toolIsDefined = false;
				for(var t=0; t < config.viewerTools.length; t++)
				{
					if( config.viewerTools[t]['ptype'] && config.viewerTools[t]['ptype'] == config.customTools[c]['ptype'] ) {	//plugin already defined
						toolIsDefined = true;
                        if(config.customTools[c].forceMultiple){
                            config.viewerTools.push(config.customTools[c])
                        }else{
                            config.viewerTools[t]=config.customTools[c];
                        }
						break;
					}
				}
			
				if(!toolIsDefined){
                    config.viewerTools.push(config.customTools[c])
                }
			}
		} 
        
        if (config.showGraticule == true){
            config.viewerTools.push({
                leaf: true,
                text: gxp.plugins.Graticule.prototype.tooltip,
                checked: true,
                iconCls: "gxp-icon-graticule",
                ptype: "gxp_graticule"
            })
        }
            
        GeoExplorer.superclass.constructor.apply(this, arguments);
    }, 

    loadConfig: function(config) {

        if(config.isLoadedFromConfigFile){
          this.applyConfig(config);
        } else {
            
		    // /////////////////////////////////////////////////////////////////////////
		    // At this point we cannot use the override-ext-ajax defined by GeoExt APIs
			// becose the OpenLayers.ProxyHost is called before the loadConfig method 
			// (see gxp/widgets/Viewer.js at row 324) and we cannot change this beavior.
		    // So we have to define a proper proxy usage if needed
		    // /////////////////////////////////////////////////////////////////////////
								  
            var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
            var mHost = pattern.exec(config.geoStoreBaseURL);

            var mUrl = config.geoStoreBaseURL + "data/" + this.mapId;

            Ext.Ajax.request({
               url: mHost[2] == location.host ? mUrl : proxy + mUrl,
               method: 'GET',
               scope: this,
               headers:{
                  'Accept': "application/json"
               },
               success: function(response, opts){  
                    var addConfig;
                    
                    try {
                      addConfig = Ext.util.JSON.decode(response.responseText);
                    } catch (err) {
                    }
                    
                    if(addConfig){
                        if(addConfig.data){    
                            addConfig = Ext.util.JSON.decode(addConfig.data);                            
                        }
						this.applyConfig(Ext.applyIf(addConfig, config));
                    } else {
                        this.applyConfig(config);
                    }

               },
               failure: function(response, opts){
                  this.applyConfig(config);
               }
            });        
        }
    },
    
    loadUserConfig: function(json){
        var uploadWin = Ext.getCmp('upload-win');
        if(uploadWin != null){
            uploadWin.destroy();
        }
          
        var layerTree = Ext.getCmp('tree');
        layerTree.destroy();
        
        app.destroy();
        
        var config = Ext.util.JSON.decode(json);        
        if(config && config.map){
            config.isLoadedFromConfigFile = true;
			config = Ext.applyIf(config, this.initialConfig);
            app = new GeoExplorer.Composer(config, this.mapId, this.auth, this.fScreen);
        }else{
            Ext.Msg.show({
                title: this.userConfigLoadTitle,
                msg: this.userConfigLoadMsg,
                icon: Ext.MessageBox.WARNING
            });
        }
    },
    
    displayXHRTrouble: function(msg, status) {        
        Ext.Msg.show({
            title: this.xhrTroubleText + status,
            msg: msg,
            icon: Ext.MessageBox.WARNING
        });        
    },
    
    /** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {
        this.appMask = new Ext.LoadMask(Ext.getBody(), {msg: this.mainLoadingMask});
		this.appMask.show();
		
        var westPanel = new Ext.TabPanel({
            border: false,
            activeTab:0,
            id: 'west',
            region: "west",
            width: 250,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            header: false,
            items: [
                { autoScroll: true, tbar: [], border: false, id: 'tree', title: this.layersText}, 
                {
                    xtype: "panel", layout: "fit", 
                    border: false, id: 'legend', title: this.legendText
                }
            ]
        });
        
        this.toolbar = new Ext.Toolbar({
            disabled: true,
            id: 'paneltbar',
			enableOverflow: true,
            items: this.createTools()
        });
        
        this.on("ready", function() {
            // enable only those items that were not specifically disabled
            var disabled = this.toolbar.items.filterBy(function(item) {
                return item.initialConfig && item.initialConfig.disabled;
            });
            
            this.toolbar.enable();
            
            disabled.each(function(item) {
                item.disable();
            });
			
			this.appMask.hide();
		});

       var googleEarthPanel = new gxp.GoogleEarthPanel({
            mapPanel: this.mapPanel,
            listeners: {
                beforeadd: function(record) {	                
                    return record.get("group") !== "background";
                },
                pluginready: function(istance) {
                }
            }
        });
       
	    // ///////////////////////////////////////////////////////////////////
        // TODO: continue making this Google Earth Panel more independent
        // Currently, it's too tightly tied into the viewer.
        // In the meantime, we keep track of all items that the were already
        // disabled when the panel is shown.
		// ///////////////////////////////////////////////////////////////////
        var preGoogleDisabled = [];
 
        googleEarthPanel.on("show", function() {
            preGoogleDisabled.length = 0;
            this.toolbar.items.each(function(item) {
                if (item.disabled) {
                    preGoogleDisabled.push(item);
                }
            });
            this.toolbar.disable();
			
			// ////////////////////////////////////////////////////
            // Loop over all the tools and remove their output
			// ////////////////////////////////////////////////////
            for (var key in this.tools) {
                var tool = this.tools[key];
                if (tool.outputTarget === "map") {
                    tool.removeOutput();
                }
            }
            var layersContainer = Ext.getCmp("tree");
            var layersToolbar = layersContainer && layersContainer.getTopToolbar();
            if (layersToolbar) {
                layersToolbar.items.each(function(item) {
                    if (item.disabled) {
                        preGoogleDisabled.push(item);
                    }
                });
                layersToolbar.disable();
            }
        }, this);
 
        googleEarthPanel.on("hide", function() {
            // re-enable all tools
            this.toolbar.enable();
           
            var layersContainer = Ext.getCmp("tree");
            var layersToolbar = layersContainer && layersContainer.getTopToolbar();
            if (layersToolbar) {
                layersToolbar.enable();
            }
            // now go back and disable all things that were disabled previously
            for (var i=0, ii=preGoogleDisabled.length; i<ii; ++i) {
                preGoogleDisabled[i].disable();
            }
 
        }, this);
        
        this.mapPanelContainer = new Ext.Panel({
            layout: "card",
            region: "center",
            defaults: {
                border: false
            },
            items: [
                this.mapPanel,
                googleEarthPanel
            ],
            activeItem: 0,
            tbar: this.toolbar
        });
		
        var portalPanels = [this.mapPanelContainer, westPanel];
		
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
		
        this.portalItems = [{
            region: "center",
            layout: "border",            
            items: portalPanels
        }];
        
        GeoExplorer.superclass.initPortal.apply(this, arguments);  
		for(var i = 0; i< additionalPanels.length; i++){
			var target = Ext.getCmp(additionalPanels[i].target);
			target.add(additionalPanels[i]);
			target.doLayout();
		}
    },
    
    /** private: method[createTools]
     * Create the toolbar configuration for the main panel.  This method can be 
     * overridden in derived explorer classes such as :class:`GeoExplorer.Composer`
     * or :class:`GeoExplorer.Viewer` to provide specialized controls.
     */
    createTools: function() {
        var tools = [
            "-"
        ];
        return tools;
    },
	
	/** private: method[viewMetadata]
     */
    viewMetadata: function(url, uuid, title){
		var portalContainer = Ext.getCmp(this.renderToTab);
		
		var metaURL = url.indexOf("uuid") != -1 ? url : url + '?uuid=' + uuid;
		
		var metaPanelOptions = {
			title: title,
			items: [ 
				new Ext.ux.IFrameComponent({ 
					url: metaURL 
				}) 
			]
		};
				
		if(portalContainer instanceof Ext.TabPanel){
			var tabPanel = portalContainer;
			
			var tabs = tabPanel.find('title', title);
			if(tabs && tabs.length > 0){
				tabPanel.setActiveTab(tabs[0]); 
			}else{				
			
				metaPanelOptions = Ext.applyIf(metaPanelOptions, {
					layout:'fit', 
					tabTip: title,
					closable: true
				});
				
				var meta = new Ext.Panel(metaPanelOptions);
				
				tabPanel.add(meta);
				meta.items.first().on('render', function() {
					this.addLoadingMask(meta.items.first());
				},this);						
			}
		}else{		
		
			metaPanelOptions = Ext.applyIf(metaPanelOptions, {
			    layout:'fit', 
				height: 600
			});
			
			var meta = new Ext.Panel(metaPanelOptions);
			
			var metaWin = new Ext.Window({									
				title: "MetaData",
				closable: true,
				width: 800,
				height: 630,
				resizable: true,				
				draggable: true,
				items: [
					meta
				]									
			});
			
			metaWin.show();
		}
    },

    /** private: method[saveAndExport]
     *
     * Saves the map config and displays the URL in a window.
     */ 
    saveAndExport: function(callback, scope) {
        var configStr = Ext.util.JSON.encode(this.getState());
        var method, url;

        if (this.id) {
            method = "PUT";
            url = "maps/" + this.id;
        } else {
            method = "POST";
            url = "maps";
        }

        OpenLayers.Request.issue({
            method: method,
            url: url,
            data: configStr,
            callback: function(request) {
                this.handleSaveAndExport(request);
                if (callback) {
                    callback.call(scope || this);
                }
            },
            scope: this
        });
    },
        
    /** private: method[handleSaveAndExport]
     *  :arg: ``XMLHttpRequest``
     */
    handleSaveAndExport: function(request) {
        if (request.status == 200) {
            var config = Ext.util.JSON.decode(request.responseText);            
            var mapId = config.id;
            if (mapId) {
                this.id = mapId;
                window.location.hash = "#maps/" + mapId;
            }
        } else {
            throw this.saveErrorText + request.responseText;
        }
    },
    
    /** api: method[getBookmark]
     *  :return: ``String``
     *
     *  Generate a bookmark for an unsaved map.
     */
    getBookmark: function() {
        var params = Ext.apply(
            OpenLayers.Util.getParameters(),
            {q: Ext.util.JSON.encode(this.getState())}
        );
        
        // disregard any hash in the url, but maintain all other components
        var url = 
            document.location.href.split("?").shift() +
            "?" + Ext.urlEncode(params);
        
        return url;
    },

    /** private: method[displayAppInfo]
     * Display an informational dialog about the application.
     */
    displayAppInfo: function() {
        var appInfo = new Ext.Panel({
            title: this.appInfoText,
            html: "<iframe style='border: none; height: 100%; width: 100%' src='about.html' frameborder='0' border='0'><a target='_blank' href='about.html'>"+this.aboutText+"</a> </iframe>"
        });

        var tabs = new Ext.TabPanel({
            activeTab: 0,
            items: [ appInfo]
        });

        var win = new Ext.Window({
            title: this.aboutThisMapText,
            modal: true,
            layout: "fit",
            width: 340,
            height: 260,
            items: [appInfo]
        });
        win.show();
    },
    
    /** api: method[setMarkersStyle]
     *  :return: ``Object``
     *
     *  Dynamically sets the style of markers
     */
    setMarkersStyle: function() {
        
        var defaultMarker = this.externalGraphicMarkers;
        var highlightsMarker = this.externalGraphicMarkersHighlights;
		
		var defaultClusterMarker = this.externalGraphicClusterMarkers;
		var highlightsClusterMarker = this.externalGraphicClusterHighlights
		
		var defaultSelection = this.markerSelectionIcon;
		var clusterSelection = this.markerSelectionClusterIcon;
		
		var defaultShadow = this.markerShadow;
		var clusterShadow = this.markerClusterShadow;
		
        var context = {
            getMarkerIcon : function (ft){
                if(ft.attributes.highlights) {
					if(ft.attributes.cluster){
						return highlightsClusterMarker;
					}else{
                        if(ft.attributes.icons){
                            return ft.attributes.icons.img.markerHighlights;
                        }else{
                            return highlightsMarker;                      
                        }           
                    }
                }else{
					if(ft.attributes.cluster){
						return defaultClusterMarker; 
					}else{ 
                        if(ft.attributes.icons){
                            return ft.attributes.icons.img.markerDefault;
                        }else{
                            return defaultMarker;                             
                        }
                    }
				}   
            },
            getMarkerWidth : function (ft){
                if(ft.attributes.icons.markersDimensions){
                    return parseInt(ft.attributes.icons.markersDimensions.width);
                }
            },
            getBackgroundMarkerWidth : function (ft){
                if(ft.attributes.icons.shadowDimensions){
                    return parseInt(ft.attributes.icons.shadowDimensions.width);
                }
            },
            getMarkerHeight : function (ft){
                if(ft.attributes.icons.markersDimensions){
                    return parseInt(ft.attributes.icons.markersDimensions.height);
                }
            },       
            getBackgroundMarkerHeight : function (ft){
                if(ft.attributes.icons.shadowDimensions){
                    return parseInt(ft.attributes.icons.shadowDimensions.height);
                }
            },            
			getMarkerSelectionIcon : function (ft){
				if(ft.attributes.cluster)
					return clusterSelection;
				else	
                    if(ft.attributes.icons){
                        return ft.attributes.icons.img.markerSelected;
                    }else{
                        return defaultSelection;                               
                    }                   
            },
			
			getMarkerLabel : function(ft){
			    var label = ft.attributes.label;
			    if(label) 
                    return label; 
                else 
                    return null; 
			},
			
			getRadius : function(ft){
			    var label;
				var radius;
				
				try{
					label = parseInt(ft.attributes.label);
				}catch(e){
					radius = 12;
				} 
		
				var cluster = ft.attributes.cluster;
									
				radius = radius ? radius : 12;
				if(label && cluster){
					if(label > 0 && label <= 200){
						radius = 12;
					}else if(label > 201 && label <= 500){
						radius = 16;
					}else if(label > 501 && label <= 1000){
						radius = 18;
					}else if(label > 1001 && label <= 2000){
						radius = 20;
					}else if(label > 2001 && label <= 4000){
						radius = 22;
					}else if(label > 4001 && label <= 8000){
						radius = 24;
					}else if(label > 8001 && label <= 16000){
						radius = 26;
					}else if(label > 16001 && label <= 32000){
						radius = 28;
					}else if(label > 32001){
						radius = 32;
					}
				}
                
                return radius;
			},

            getBackgroundXOffset : function(ft){        
                if(ft.attributes.icons && !ft.attributes.cluster){
                    return -0.9*context.getBackgroundMarkerWidth(ft)/4;
                }else{            
                    return  -0.7*context.getRadius(ft)/2;
                }
            },
            getBackgroundYOffset : function(ft){
                if(ft.attributes.icons && !ft.attributes.cluster){
                    return -1.85*context.getBackgroundMarkerHeight(ft)/2;
                }else{
                    return -1.5* context.getRadius(ft);
                }               
            },
            getGraphicYOffset : function(ft){
                if(ft.attributes.icons && !ft.attributes.cluster){
                    return -1.95*context.getMarkerHeight(ft)/2;
                }else{
                    return -1.9* context.getRadius(ft);
                }
            },
            getLabelYOffset : function(ft){
                if(ft.attributes.icons && !ft.attributes.cluster){
                    return context.getMarkerHeight(ft)/2;
                }else{                
                    return  context.getRadius(ft);                
                }    
            },
            
			getMarkerShadowIcon: function (ft){
				if(ft.attributes.cluster)
					return clusterShadow;
				else
                    if(ft.attributes.icons && !ft.attributes.cluster){
                        if(ft.attributes.icons.img){
                            return ft.attributes.icons.img.markerShadow;
                        }else{
                            return defaultShadow;
                        }
                    }else{
                        return defaultShadow;
                    }
            }
        };
        
		this.markerTemplateDefault.externalGraphic = "${getMarkerIcon}";
		this.markerTemplateDefault.pointRadius = "${getRadius}";
		this.markerTemplateDefault.backgroundXOffset = "${getBackgroundXOffset}";
		this.markerTemplateDefault.backgroundYOffset = "${getBackgroundYOffset}";  
        this.markerTemplateDefault.graphicYOffset="${getGraphicYOffset}";
        this.markerTemplateDefault.labelYOffset ="${getLabelYOffset}"; 
		this.markerTemplateDefault.backgroundGraphic = "${getMarkerShadowIcon}";        
        
		this.markerTemplateSelected.externalGraphic = "${getMarkerSelectionIcon}";
		this.markerTemplateSelected.pointRadius = "${getRadius}";		
		this.markerTemplateSelected.backgroundXOffset = "${getBackgroundXOffset}";	
		this.markerTemplateSelected.backgroundYOffset = "${getBackgroundYOffset}";
        this.markerTemplateSelected.graphicYOffset="${getGraphicYOffset}";
        this.markerTemplateSelected.labelYOffset ="${getLabelYOffset}";         
		this.markerTemplateSelected.backgroundGraphic = "${getMarkerShadowIcon}";
		
        var styleMap = new OpenLayers.StyleMap({ 
            "default" : new OpenLayers.Style(this.markerTemplateDefault, {context:context}),
            "select" : new OpenLayers.Style(this.markerTemplateSelected, {context:context})
        }); 
        
        var rules = [
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: [
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                            property: "icons",
                            value: null
                        }),
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                            property: "cluster",
                            value: true
                        })
                    ]
                }),
                symbolizer: {
                    graphicWidth: "${getMarkerWidth}",
                    graphicHeight: "${getMarkerHeight}",
                    backgroundWidth: "${getBackgroundMarkerWidth}",
                    backgroundHeight: "${getBackgroundMarkerHeight}"
                }                
            }),
            new OpenLayers.Rule({
                elseFilter: true
            })
        ];

        styleMap.styles['default'].addRules(rules);
        styleMap.styles['select'].addRules(rules);        
        
        return(styleMap); 
    }, 
    
    /** api: method[showMarkerGeoJSON]
     *  :return: ``String``
     *
     *  Add Markers and Tracks to map.
     */
    showMarkerGeoJSON: function(markerName, geoJson, clusterName, trackName, showLine) {
        
        var clusterName = clusterName ||  markerName;
        
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
            
        // check if the marker layer exists
        if(markerName){
            var markerLyr = this.mapPanel.map.getLayersByName(markerName);
        }
        // check if the cluster layer exists
        if(clusterName){        
            var clusterLyr = this.mapPanel.map.getLayersByName(clusterName);
        }    
        
        if ((markerLyr && markerLyr.length) || (clusterLyr && clusterLyr.length)) {
			for(var i = 0;i<markerLyr.length;i++){
				this.mapPanel.map.removeLayer(markerLyr[i]);
			}
            
			      
            var prev= this.mapPanel.map.getControlsByClass("OpenLayers.Control.SelectFeature");
			for (var i = 0; i<prev.length;i++){
				if(prev[i].id=="injMarkerSelectControl"){
					prev[i].deactivate();
					this.mapPanel.map.removeControl(prev[i]);
					prev[i].destroy();
				}
			}
        };
		{
            
            // Create a new parser for GeoJSON
            var geojson_format = new OpenLayers.Format.GeoJSON({
				internalProjection: this.mapPanel.map.getProjectionObject(),
				externalProjection: new OpenLayers.Projection("EPSG:4326")
			});
            
            var clusters = new Array();            
            var markers = new Array();
            var markersLayers = new Array();
            
            var features = geojson_format.read(geoJson);
			if(!features) return;

            //unique array
            function unique(arrayName){
                var newArray=new Array();
                label:for(var a=0; a<arrayName.length;a++ ){  
                    for(var j=0; j<newArray.length;j++ ){
                        if(newArray[j]==arrayName[a]) 
                        continue label;
                    }
                    newArray[newArray.length] = arrayName[a];
                }
                return newArray;
            } 
            
            for(var i=0;i<features.length;i++){
                if(!features[i].attributes.cluster){
                    if(features[i].attributes.layer){
                        markersLayers.push(features[i].attributes.layer);
                    }else{
                        markersLayers.push(features[i].attributes.layer);
                    }
                }
            }

            var uniqueMarkersLayers = [];
            uniqueMarkersLayers = unique(markersLayers);
            
            for(var i=0;i<features.length;i++){
                if(features[i].attributes.cluster){
                    clusters.push(features[i]);
                }
            }
            
            for (var m=0;m<uniqueMarkersLayers.length;m++){
                markers[m] = new Array();
                var count = 0;
                for(var mi=0;mi<features.length;mi++){
                    if(!features[mi].attributes.cluster){
                        if(features[mi].attributes.layer == uniqueMarkersLayers[m]){
                            markers[m][count] = features[mi];
                            count++;
                        }
                    }
                }
            }
            
            // Sets the style for the markers
            var styleCluster = this.setMarkersStyle(false);


            if (markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        // Create new vector layer for default markers
                       var marker_layer = new OpenLayers.Layer.Vector(markerName, {
                            styleMap: styleCluster,
                            displayInLayerSwitcher: true,
                            //rendererOptions: {yOrdering: true},
                            renderers: renderer
                        });
                    }else{
                        // Create new vector layer for named markers
                        uniqueMarkersLayers[i] = new OpenLayers.Layer.Vector(uniqueMarkersLayers[i], {
                            styleMap: styleCluster,
                            displayInLayerSwitcher: true,
                            //rendererOptions: {yOrdering: true},
                            renderers: renderer
                        });
                    }
                }
            }
            
            if (clusters.length>0){
                // Create new vector layer for clusters
                var cluster_layer = new OpenLayers.Layer.Vector(clusterName, {
                    styleMap: styleCluster,
                    displayInLayerSwitcher: true,
                    //rendererOptions: {yOrdering: true},
                    renderers: renderer
                });
            }
            
            // workaround to make the text features rendered in the same container having the vector features
            if (clusters.length>0){
                cluster_layer.renderer.textRoot = cluster_layer.renderer.vectorRoot;
            }
            
            if (markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        marker_layer.renderer.textRoot = marker_layer.renderer.vectorRoot;
                    }else{
                        uniqueMarkersLayers[i].renderer.textRoot = uniqueMarkersLayers[i].renderer.vectorRoot;
                    }
                }
            }
            
            // Create the popups for markers
			var popupTitle = this.markerPopupTitle;
            var singlePopup = this.singlePopup;
			
			var self = this;
			
            function onFeatureSelect(feature) {
                if (feature.attributes.html){
                    if(this.popup && singlePopup){
                        this.popup.close();
                        this.popup.destroy();
                        
                    }
                    this.popup = new GeoExt.Popup({
                        title: feature.attributes.title || popupTitle,
                        width: 300,
                        height: 200,
                        layout: "fit",
                        map: self.mapPanel,
                        destroyOnClose:true,
                        location: feature.geometry.getBounds().getCenterLonLat(),
                        items: [{   
                            title: feature.fid,
                            layout: "fit",
                            bodyStyle: 'padding:10px;background-color:#F5F5DC',
                            html: feature.attributes.html,
                            autoScroll: true,
                            autoWidth: true,
                            collapsible: false
                        }],
                        listeners: { 
                          close : function() {
								try{
									//
									// To avoid control removal problems
									//
									selectControl.unselect(feature);
								}catch(e){};
							}
                        }
                    });
                    this.popup.show();
                } else {
                    // Use unselect to not highlight the marker. I could not delete the selection. This happens when I close the popup
                    selectControl.unselect(feature);
                }
            }

            if(markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    for (var c=0; c<markers[i].length;c++){
                        if(uniqueMarkersLayers[i] == undefined){
                            this.mapPanel.map.addLayer(marker_layer);
                            marker_layer.addFeatures(markers[i][c]);
                        }else{
                            this.mapPanel.map.addLayer(uniqueMarkersLayers[i]);
                            uniqueMarkersLayers[i].addFeatures(markers[i][c]);
                        }
                    }
                }
            }
            
            if(clusters.length>0){
                this.mapPanel.map.addLayer(cluster_layer);
                cluster_layer.addFeatures(clusters);
            }
            
            var vectorSelect = [];
            
            if(clusters.length>0 && markers.length>0){
                vectorSelect = [cluster_layer];
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        vectorSelect.push(marker_layer);
                    }else{
                        vectorSelect.push(uniqueMarkersLayers[i]);
                    }
                }                
            }else if(clusters.length==0 && markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        vectorSelect.push(marker_layer);
                    }else{
                        vectorSelect.push(uniqueMarkersLayers[i]);
                    }
                }    
            }else{
                vectorSelect = cluster_layer;
            }
            if(vectorSelect && vectorSelect.length >0){
				var selectControl = new OpenLayers.Control.SelectFeature(vectorSelect ,{
					id:'injMarkerSelectControl',
					onSelect: onFeatureSelect,
					clickout: false,
					multiple: !singlePopup,
					autoActivate: true
				});        
				var prev= this.mapPanel.map.getControlsByClass(selectControl.CLASS_NAME);
				for (var i = 0; i<prev.length;i++){
					if(prev[i].id=="injMarkerSelectControl"){
						prev[i].deactivate();
						this.mapPanel.map.removeControl(prev[i]);
						prev[i].destroy();
					}
				}
				this.mapPanel.map.addControl(selectControl);
				selectControl.activate();
            }
        }
        
		if(trackName){
		    // Checks if the track layer exists
			var trackLayer = this.mapPanel.map.getLayersByName(trackName)[0];
			
			if (trackLayer){ 
				trackLayer.removeFeatures(trackLayer.features);
			}else{
			    // Sets the style for the tracks
                var styleTracks = new OpenLayers.StyleMap({
					strokeColor: this.trackStyle.strokeColorTracks,
					strokeWidth: this.trackStyle.strokeWidthTracks,
					strokeOpacity: this.trackStyle.strokeOpacityTracks
				});
				
			    // Creates new vector layer for tracks
                trackLayer = new OpenLayers.Layer.Vector(trackName, {
					styleMap: styleTracks,
					displayInLayerSwitcher: true
				});
				
				this.mapPanel.map.addLayer(trackLayer);
			}
			
			if(showLine){
                var pointCoord = new Array;
                var geoJsonoObj = Ext.util.JSON.decode(geoJson);
                
                // Cycling the file GeoJSON to capture the coordinates of the markers
                for (i=0; i<geoJsonoObj.features.length; i++) {
                    pointCoord.push(
                        new OpenLayers.Geometry.Point(
                            geoJsonoObj.features[i].geometry.coordinates[0],
                            geoJsonoObj.features[i].geometry.coordinates[1]
                        )
                    );  
                }

                trackLayer.addFeatures([
                    new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString(pointCoord).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            this.mapPanel.map.getProjectionObject()
                        )
                    )
                ]);
            }
		}
    },
    
    /** private: method[setAuthHeader]
     *
     * Set Authorization Headers in gxp_saveDefaultContext.
     */ 
    setAuthHeaders: function(auth) {
        for(var tool in this.tools){
            if(this.tools[tool].ptype == "gxp_saveDefaultContext"){
                this.tools[tool].auth = auth;
            }
        }
    },
    
    /** private: method[getState]
     *  :returns: ``Òbject`` the state of the viewer
     */
    getState: function() {
        var state = GeoExplorer.superclass.getState.apply(this, arguments);
        
		// ///////////////////////////////////////////
		// Don't persist unnecessary components. 
		// Only the map details are mandatory, other
        // elements are merged from the default 
		// configuration.
		// ///////////////////////////////////////////
		
        delete state.tools;
		delete state.customTools;
		delete state.viewerTools;
		delete state.georeferences;
		delete state.customPanels;
		
        return state;
    }
});

