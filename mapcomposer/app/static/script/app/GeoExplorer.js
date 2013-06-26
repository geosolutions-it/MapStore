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
		//backgroundGraphic: 'theme/app/img/markers/markers_shadow.png',
		//backgroundXOffset: -7,
		//backgroundYOffset: -7,
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
		//backgroundGraphic: 'theme/app/img/markers/markers_shadow.png',
		//backgroundXOffset: -7,
		//backgroundYOffset: -7,
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
            }, {
                leaf: true, 
                text: gxp.plugins.GeoReferences.prototype.tooltip, 
                checked: true, 
                ptype: "gxp_georeferences"
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
						break;
					}
				}
			
				if(!toolIsDefined)
					config.viewerTools.push(config.customTools[c]);
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

        /*config.viewerTools.push({
            hidden: true, actions: ["->"], checked: true
            }, {
            leaf: true,
            text: "Google Geocoder",
            checked: true,
            iconCls: "gxp-icon-googleearth",
            ptype: "gxp_googlegeocoder",
            outputConfig:{
                emptyText:"Google GeoCoder"
            },
            outputTarget:"paneltbar"
        });*/
            
        GeoExplorer.superclass.constructor.apply(this, arguments);
    }, 

    loadConfig: function(config) {

        if(config.isLoadedFromConfigFile){
          this.applyConfig(config);
        } else {
            
            var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
            var mHost=pattern.exec(geoStoreBaseURL);

            var mUrl = geoStoreBaseURL + "data/" + this.mapId;

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
                            this.applyConfig(Ext.applyIf(addConfig, config));
                        }else{        
                            this.applyConfig(Ext.applyIf(addConfig, config));
                        }
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
            width: 215,
            split: true,
            collapsible: true,
            //collapseMode: "mini",
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
			
			Ext.getCmp('south').collapse(true);	
			
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
            id: "mapPanelContainer_id", //added to make possible to add the buttons for Analytic View
            layout: "card",
            region: "center",
            defaults: {
                border: false
            },
            items: [
                this.mapPanel
                ,googleEarthPanel
            ],
            activeItem: 0,
            tbar: this.toolbar,
            bbar: [] //added to make possible to add the buttons for Analytic View
        });
		        
		var estPanel = new Ext.TabPanel({
            border: false,
            activeTab: 0,
            id: 'east',
            region: 'east',
            width: 385,
            split: true,
            collapsible: true,
            header: false
        });		
		
		var southPanel = new Ext.Panel({
            border: false,
            layout: "fit",
            id: 'south',
            region: "south",
            height: 200,
            split: true,
            collapsible: true,
            //collapseMode: "mini",
            collapsed: false,
            header: true,
            items: [
                {
                  xtype: 'panel', layout: "fit", activeTab: 0, region: 'center', id: 'featurelist', autoScroll: true, border: false
                }
            ]
        });
		
        this.portalItems = [{
            region: "center",
            layout: "border",            
            items: [
                this.mapPanelContainer,
                westPanel,
				estPanel,
				southPanel
            ]
        }];

        GeoExplorer.superclass.initPortal.apply(this, arguments);        
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
    
    /** private: method[save]
     *
     * Saves the map config and displays the URL in a window.
     */ 
    save: function(callback, scope) {
        var configStr = Ext.util.JSON.encode(this.getState());        
        var method = "POST";
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost=pattern.exec(app.xmlJsonTranslateService);

        var mUrl = app.xmlJsonTranslateService + 'HTTPWebGISSave';
        var url = mHost[2] == location.host ? mUrl : proxy + mUrl;
        OpenLayers.Request.issue({
            method: method,
            url: url,
            data: configStr,
            callback: function(request) {
                this.handleSave(request);
                if (callback) {
                    callback.call(scope || this);
                }
            },
            scope: this
        });
    },
        
    /** private: method[handleSave]
     *  :arg: ``XMLHttpRequest``
     */
    handleSave: function(request) {
        if (request.status == 200) {
            this.xmlContext = request.responseText;
        } else {
            throw this.saveErrorText + request.responseText;
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
            
            //this.xmlContext = request.responseText;
        } else {
            throw this.saveErrorText + request.responseText;
        }
    },
    
    /** private: method[showUrl]
     */
    showUrl: function() {
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost=pattern.exec(app.xmlJsonTranslateService);

		this.appMask.show();
		
        var mUrl = app.xmlJsonTranslateService + 'HTTPWebGISFileDownload';
        OpenLayers.Request.POST({
            url: mHost[2] == location.host ? mUrl : proxy + mUrl,
            data: this.xmlContext,
            callback: function(request) {

                if(request.status == 200){                            
                    
                    //        
                    //delete other iframes appended
                    //
                    if(document.getElementById("downloadIFrame")) {
                      document.body.removeChild( document.getElementById("downloadIFrame") ); 
                    }
                    
                    //
                    //Create an hidden iframe for forced download
                    //
                    var elemIF = document.createElement("iframe"); 
                    elemIF.setAttribute("id","downloadIFrame");
                    var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
                    var mHost=pattern.exec(app.xmlJsonTranslateService);

                    var mUrlEncoded = encodeURIComponent(app.xmlJsonTranslateService + "HTTPWebGISFileDownload?file="+request.responseText);
                    var mUrl = app.xmlJsonTranslateService + "HTTPWebGISFileDownload?file="+request.responseText;
                    elemIF.src = mHost[2] == location.host ? mUrl : proxy + mUrlEncoded; 
                    elemIF.style.display = "none"; 
                    document.body.appendChild(elemIF); 
					this.appMask.hide();
                }else{
                    Ext.Msg.show({
                       title:'File Download Error',
                       msg: request.statusText,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });
                }
            },
            scope: this
        });
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
                if(ft.attributes.highlights) 
					if(ft.attributes.cluster)
						return highlightsClusterMarker;
					else	
						return highlightsMarker; 
                else{
					if(ft.attributes.cluster)
						return defaultClusterMarker; 
					else 
						return defaultMarker; 
				} 
                    
            },
			
			getMarkerSelectionIcon : function (ft){
				if(ft.attributes.cluster)
					return clusterSelection;
				else	
					return defaultSelection;                     
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
			
			getBackgroundOffset : function(ft){
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
				
				var offset = -1*(radius/2);
				
				return offset;
			},
			
			getMarkerShadowIcon: function (ft){
				if(ft.attributes.cluster)
					return clusterShadow;
				else				    
					return defaultShadow;     			
            }
        };
        
		this.markerTemplateDefault.externalGraphic = "${getMarkerIcon}";
		this.markerTemplateDefault.pointRadius = "${getRadius}";
		this.markerTemplateSelected.pointRadius = "${getRadius}";		
		this.markerTemplateSelected.externalGraphic = "${getMarkerSelectionIcon}";
		this.markerTemplateDefault.backgroundXOffset = "${getBackgroundOffset}";
		this.markerTemplateDefault.backgroundYOffset = "${getBackgroundOffset}";
		this.markerTemplateSelected.backgroundXOffset = "${getBackgroundOffset}";	
		this.markerTemplateSelected.backgroundYOffset = "${getBackgroundOffset}";
		
		this.markerTemplateDefault.backgroundGraphic = "${getMarkerShadowIcon}";
		this.markerTemplateSelected.backgroundGraphic = "${getMarkerShadowIcon}";
		
        var styleMap = new OpenLayers.StyleMap({ 
            "default" : new OpenLayers.Style(this.markerTemplateDefault, {context:context}),
            "select" : new OpenLayers.Style(this.markerTemplateSelected, {context:context})
        }); 
            
        return(styleMap); 
    }, 
    
    /** api: method[showMarkerGeoJSON]
     *  :return: ``String``
     *
     *  Add Markers and Tracks to map.
     */
    showMarkerGeoJSON: function(markerName, geoJson, trackName, showLine) {
        
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
        
        // check if the marker layer exists
        var markerLyr = app.mapPanel.map.getLayersByName(markerName);           
        if (markerLyr.length) {
           for (var key in markerLyr.features) {
                markerLyr.removeFeatures(markerLyr.features[key]);
                markerLyr.addFeatures(markerLyr.features[key]);
            }
        }else {
            
            // Create a new parser for GeoJSON
            var geojson_format = new OpenLayers.Format.GeoJSON({
				internalProjection: app.mapPanel.map.getProjectionObject(),
				externalProjection: new OpenLayers.Projection("EPSG:4326")
			});

            // Sets the style for the markers
            var styleMarkers = this.setMarkersStyle();
			
            // Create new vector layer for markers
            var marker_layer = new OpenLayers.Layer.Vector(markerName, {
				styleMap: styleMarkers,
				displayInLayerSwitcher: false,
				rendererOptions: {yOrdering: true},
				renderers: renderer
			});
            
            // Create the popups for markers
			var popupTitle = this.markerPopupTitle;
            function onFeatureSelect(feature) {
                if (feature.attributes.html){
                    new GeoExt.Popup({
                        title: popupTitle,
                        width: 200,
                        height: 100,
                        layout: "fit",
                        map: app.mapPanel,
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
                               selectControl.unselect(feature);
                            }
                        }
                    }).show();
                } else {
                    // Use unselect to not highlight the marker. I could not delete the selection. This happens when I close the popup
                    selectControl.unselect(feature);
                }
            }
            
            app.mapPanel.map.addLayer(marker_layer);
            
            marker_layer.addFeatures(geojson_format.read(geoJson));

            var selectControl = new OpenLayers.Control.SelectFeature(marker_layer,{
				onSelect: onFeatureSelect,
				clickout: false,
				multiple: true
			});
                                
            app.mapPanel.map.addControl(selectControl);
            selectControl.activate();
        }
        
		if(trackName){
		    // Checks if the track layer exists
			var trackLayer = app.mapPanel.map.getLayersByName(trackName)[0];
			
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
					displayInLayerSwitcher: false
				});
				
				app.mapPanel.map.addLayer(trackLayer);
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
                            app.mapPanel.map.getProjectionObject()
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
     *  :returns: ``�bject`` the state of the viewer
     */
    getState: function() {
        var state = GeoExplorer.superclass.getState.apply(this, arguments);
        // Don't persist tools
        delete state.tools;
        return state;
    }
});

