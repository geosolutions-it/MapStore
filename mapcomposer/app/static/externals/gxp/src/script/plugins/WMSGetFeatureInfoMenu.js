/**
 *  Copyright (C) 2007 - 2016 GeoSolutions S.A.S.
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
 *  class = WMSGetFeatureInfoMenu
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfoMenu(config)
 *
 *    This plugins provides a menu with two actions. When active,
 *    these actions issue GetFeatureInfo requests.
 *    The first will issue a GetFeatureInfo request to the WMS
 *    of all layers on the map once the user click.
 *    The second,  will issue a GetFeatureInfo request 
 *    to the selected layer in layertree (if any) on mouse Hover.
 *    The output will be displayed in a popup.
 */   
gxp.plugins.WMSGetFeatureInfoMenu = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo_menu */
    ptype: "gxp_wmsgetfeatureinfo_menu",
    
    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Get Feature Info",
	
	/** api: config[activActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    activeActionTip: "Active Feature Info on selected Layer",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Feature Info",
	
	/** api: config[closePrevious]	
     *  ``Boolean``
     *  Close previous popups when opening a new one.
     */
	closePrevious: true,
	
	/** api: config[loadingMask]
     *  ``Boolean``
     *  Use a loading mask during get feature info.
     */
	loadingMask: true,
	
	/** api: config[maskMessage]
     *  ``String``
     *  Message for the loading mask.
     */
	maskMessage: 'Getting info...',
	
	/** api: config[useTabPanel]
     *  ``Boolean``
     *  Use a loading mask during get feature info.
     */
	useTabPanel: false,
    
    noDataMsg: "No data returned from the server",
    /** api: config[regex]
     *  ``regex``
     *  Use a regex to filter if some result is returned in html response.
     */
    regex:"\\s*$",

    /** api: config[format]
     *  ``String``
     *  Format to show feature info ('grid' | 'html'). Default it's 'html'.
     */
    format: "html",
     /** api: config[maxFeatures]
     *  ``Integer``
     *  The max number of results to show. It is used as attribute 'feature_count' of the WMS GetFeatureInfo Request
     *  By default is 10.
     */
    maxFeatures: 10,

    /** api: config[defaultGroupTitleText]
     *  ``String``
     *  Default feature title in 'grid' showing. Layer name replaces '{0}' and index in the request replaces '{1}'.
     */
    defaultGroupTitleText: "{0} [{1}]",
    
    /** api: config[customGroupTitleText]
     *  ``function``
     *  Custom function to generate the in 'grid' showing.
     *  It will get the arguments: feature, layer name and index in the request.
     */
    customGroupTitleText: null,
    
    /** private: config[lastMapSize]
     *  ``OpenLayers.Size``
     *  Last known map size. See this.handlePopupPosition
     */
    lastMapSize: null,

    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */
     
    /** api: config[infoPanelId]
     *  ``string``
     *  Optional id of panel to show the getFeatureInfo instead of popup
     */
    infoPanelId: null,
     
    /** api: config[disableAfterClick]
     *  ``Boolean``
     */
    disableAfterClick: false,
    
    /** api: config[queriableAttribute]
     *  ``String``
     * The Surveys' attribute name linking Surveys to Items
     */
    queriableAttribute : "my_orig_id",

    /** api: config[linkingAttribute]
     *  ``String``
     * The Items' attribute name linking Surveys to Items
     */
    linkingAttribute : "gcid",

    
    /** api: config[sortBy]
     *  ``String`` or ``Object``
     * The attribute name to sort the Surveys
     */
    sortBy: { property: "gc_created", order: "DESC"} ,
    
    /** api: config[wfsURL]
     *  ``String``
     * The url where to issue WFS requests
     */
    wfsURL: "http://geocollect.geo-solutions.it/geoserver/it.geosolutions/ows",
    
    /** api: config[surveyTypeName]
     *  ``String``
     * The typeName to query for the surveys
     */
    surveyTypeName: "cens_muri_sop",
    
    /** api: config[surveyTypeName]
     *  ``String``
     * The typeName to query for the surveys
     */
    authParam: "authkey",
    
    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        this.activeIndex = 0;
        
        //Authentication parameter
        this.authKey = this.getAuthParam();
        
        // GeoCollect custom titles
        this.customGroupTitleText = function(feature, parentTitle, index){
          if(!feature || !feature.data || !feature.data.gc_created){
              return String.format(this.defaultGroupTitleText, parentTitle, index++);
          }
          return Ext.util.Format.date(feature.data.gc_created, 'Y-m-d G:i');;
        };
        
		var items = [new Ext.menu.CheckItem({
            tooltip: this.infoActionTip,
			text: this.infoActionTip,
            iconCls: "gxp-icon-getfeatureinfo",
            toggleGroup: this.toggleGroup,
            group: this.toggleGroup,
			listeners: {
				checkchange: function(item, checked) {
					this.activeIndex = 0;
					this.button.toggle(checked);
					if (checked) {
						this.button.setIconClass(item.iconCls);
					}
					for (var i = 0, len = info.controls.length; i < len; i++){
                    if (checked) {
							info.controls[i].activate();
						} else {
							info.controls[i].deactivate();
							
						}
					}
				},
				scope: this
			}
		}),new Ext.menu.CheckItem({
            tooltip: this.activeActionTip,
			text: this.activeActionTip,
            iconCls: "gxp-icon-mouse-map",
			
            toggleGroup: this.toggleGroup,
            group: this.toggleGroup,
			allowDepress:false,
			listeners: {
				checkchange: function(item, checked) {
					this.activeIndex = 1;
					this.button.toggle(checked);
					if (checked) {
						this.button.setIconClass(item.iconCls);
					}
					this.toggleActiveControl(checked);
				},
				scope: this
			}
		})];
		
		this.button = new Ext.SplitButton({
            iconCls: "gxp-icon-getfeatureinfo",
            tooltip: this.measureTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            allowDepress: true,
            handler: function(button, event) {
                if(button.pressed) {
                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
                }
            },
            scope: this,
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    if(!pressed) {
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: items
            })
        });
		
		var actions = gxp.plugins.WMSGetFeatureInfoMenu.superclass.addActions.call(this, [this.button]);
        var infoButton = items[0];

        var info = {controls: []};
		var layersToQuery = 0;
		
        var updateInfo = function() {
            var queryableLayers = this.target.mapPanel.layers.queryBy(function(x){
                return x.get("queryable");
            });

            var map = this.target.mapPanel.map;
            var control;
            for (var i = 0, len = info.controls.length; i < len; i++){
                control = info.controls[i];
                control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }
			
            info.controls = [];
            var started = false;
            var atLeastOneResponse = false;
            // click position, in lat/lon coordinates (issue #422)
            var startLatLon = null;
			this.masking = false;
			
            queryableLayers.each(function(x){                
                var l = x.getLayer();
				
				var vendorParams = {};
		    	Ext.apply(vendorParams, x.getLayer().vendorParams || this.vendorParams || {});
				if(!vendorParams.env || vendorParams.env.indexOf('locale:') == -1) {
					vendorParams.env = vendorParams.env ? vendorParams.env + ';locale:' + GeoExt.Lang.locale : 'locale:' + GeoExt.Lang.locale;
				}

				// Obtain info format
            	var infoFormat = this.getInfoFormat(x);
				
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: l.url,
                    queryVisible: true,
                    layers: [x.getLayer()],
                    infoFormat: infoFormat,
                    maxFeatures:this.maxFeatures,
                    vendorParams: vendorParams,
                    eventListeners: {
                        beforegetfeatureinfo: function(evt) {
							//first getFeatureInfo in chain
							if(!started){
								started= true;
								// Issue #422
								startLatLon = this.target.mapPanel.map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y));
								atLeastOneResponse=false;
								layersToQuery=queryableLayers.length;
							}
                            
							if(this.loadingMask && !this.masking) {
								this.target.mapPanel.el.mask(this.maskMessage);
								this.masking = true;
							}
                        },
                        getfeatureinfo: function(evt) {
                            layersToQuery--;
							//last get feature info in chain
							if(layersToQuery === 0) {
								this.unmask();
								started=false;
                                
                                if(this.disableAfterClick)
                                    this.button.toggle();                                
								
                                // pan to bring popup into view (issue #422)
                                if (startLatLon) {
                                	var popup = this.popupCache[startLatLon.toString()];
                                    if (popup) {
                                    	// not too pretty, I'm calling a private method... any better idea?
                                    	popup.panIntoView();
                                    }
                                }                                
							}

                            var title = x.get("title") || x.get("name");
                            if (infoFormat == "text/html") {
                                var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && match[1].match(this.regex)) {
                                    !this.infoPanelId ? this.displayPopup(evt, title, match[1]) : this.displayInfoInPanel(evt, title, match[1], this.infoPanelId);
                                    atLeastOneResponse = true;
                                }
                            } else if (infoFormat == "text/plain") {
                                !this.infoPanelId ? this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>') : this.displayInfoInPanel(evt, title, '<pre>' + evt.text + '</pre>', this.infoPanelId);
                                atLeastOneResponse = true;
                            } else if (evt.features && evt.features.length > 0) {
                                !this.infoPanelId ? this.displayPopup(evt, title, null, null, null, evt.features) : this.displayInfoInPanel(evt, title, null, this.infoPanelId, evt.features);
                                atLeastOneResponse = true;
                            // no response at all
                            } else if(layersToQuery === 0 && !atLeastOneResponse) {
                                this.closePopups();
                                // TODO: insert a non-intrusive notification with this.noDataMsg when a Notification library is available
                            }
                            
                        },
						nogetfeatureinfo: function(evt) {
							layersToQuery--;							
							this.unmask();							
						},
                        scope: this
                    }
                });
                map.addControl(control);
                info.controls.push(control);
                if(infoButton.checked) {
                    control.activate();
                }
            }, this);

        };
        
		var updateInfoEvent = function() {
			if(layersToQuery === 0) {
				updateInfo.call(this);
			}
		};
        this.target.mapPanel.layers.on("update", updateInfoEvent, this);
        this.target.mapPanel.layers.on("add", updateInfoEvent, this);
        this.target.mapPanel.layers.on("remove", updateInfoEvent, this);

        // Issue #178: add click callback for each item
        this.button.on({
            click: this.closePopups,
            scope:this
        });
        Ext.each(this.button.menu.items.keys, function(key){
            var item = this.button.menu.items.get(key);
            item.on({
                click: this.closePopups,
                scope:this
            });
        }, this);
        
        return actions;
    },

	unmask: function() {
		if(this.loadingMask) {
			this.target.mapPanel.el.unmask();
			this.masking = false;
		}
	},
    
    /** private: method[closePopups]
     *  Clear all popups openned. Fixes issue #178.
     */
    closePopups: function(){
        if(!this.infoPanelId){
            if(this.closePrevious){
                for(var key in this.popupCache) {
                    if(this.popupCache.hasOwnProperty(key)) {
                        this.popupCache[key].close();
                        delete this.popupCache[key];
                    }
                }
            }
        }
    },
	
	/** private: method[removeAllPopups] removes all open popups
     */
    removeAllPopups: function(evt, title, text) {
        if(!this.infoPanelId){
            for(var key in this.popupCache) {
                if(this.popupCache.hasOwnProperty(key)) {
                    this.popupCache[key].close();
                    delete this.popupCache[key];
                }
            }
        }
	},
	
    /** private: method[displayPopup]
     * :arg evt: the event object from a 
     *     :class:`OpenLayers.Control.GetFeatureInfo` control
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     * :arg features: ``Array`` With features.
     */
    displayPopup: function(evt, title, text, onClose, scope, features) {
        this.lastEvent = evt;
        var popup; 
        // Issue #91: Change pupupKey to lat/lon
        var pixel = new OpenLayers.Pixel(evt.xy.x, evt.xy.y);
        var latLon = this.target.mapPanel.map.getLonLatFromPixel(pixel);
        var popupKey = latLon.toString();
        
        var item = this.getPopupItem(text, title, features);
						
        if (!(popupKey in this.popupCache)) {
			if(this.closePrevious) {
				this.removeAllPopups();
			}
			var items = this.useTabPanel ? [{
				xtype: 'tabpanel',
                enableTabScroll:true,
				activeTab: 0,
				items: [item]
			}] : [item];

            popup = this.cachePopup(latLon, items, popupKey, onClose);
			
        } else {
            popup = this.popupCache[popupKey];
			
			var container = this.useTabPanel ? popup.items.first() : popup;
			container.add(item);
        }
		        
        popup.doLayout();
    },
    
    /** private: method[displayInfoInPanel]
     * :arg evt: the event object from a 
     *     :class:`OpenLayers.Control.GetFeatureInfo` control
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     * :arg infoPanel: ``String`` id of panel where show the getFeatureInfo.
     */
    displayInfoInPanel: function(evt, title, text, infoPanel, features) {
    
        var infoPanel = Ext.getCmp(infoPanel);
        var infoPanelItems;
        var popupKey = evt.xy.x + "." + evt.xy.y;

        var item = this.getPopupItem(text, title, features);

        if (!(popupKey in this.popupCache)) {
            var items = this.useTabPanel ? [{
                xtype: 'tabpanel',
                enableTabScroll: true,
                activeTab: 0,
                items: [item]
            }] : [item];

            infoPanelItems = this.addOutput({
                xtype: "panel",
                border: false,
                id: "infoPanelItemsId",
                region: "north",
                layout: this.useTabPanel ? "fit" : "accordion",
                items: items,
                split:true,
                header: false
            });

            infoPanel.add(infoPanelItems);
            this.popupCache[popupKey] = infoPanelItems;

        }else{

            infoPanelItems = this.popupCache[popupKey];
            var container = this.useTabPanel ? infoPanelItems.items.first() : infoPanelItems;
            container.add(item);

        }

        infoPanel.expand(true);
        infoPanel.doLayout(false, true);

    },

    /** private: method[cachePopup]
     *  Create and return a popup with depault parameters
     * :arg latLon: position of the popup in
     *     :class:`OpenLayers.LonLat` format
     * :arg items: ``Array`` Of items to be shown in the popup.
     * :arg popupKey: ``String`` Key to save the popup on popup cache.
     * :arg onClose: ``Function`` Callback to be called on popup close.
     */
    cachePopup: function(latLon, items, popupKey, onClose){
        var popup = this.addOutput({
            xtype: "gx_popup",
            title: this.popupTitle,
            layout: this.useTabPanel ? "fit" : "accordion",
            autoScroll: true,
            location: latLon,
            map: this.target.mapPanel,
            width: 490,
            height: 400,
            /*anchored: true,
            unpinnable : true,*/
            items: items,
            draggable: true,
            panIn: false, // Issue #422
            listeners: {
                close: (function(key) {
                    return function(panel){
                        if(onClose) {
                            onClose.call(scope);
                        }
                        delete this.popupCache[key];
                    };
                })(popupKey),
                scope: this
            }
        });

        this.handlePopupPosition(popup, latLon, items, onClose, this);

        this.popupCache[popupKey] = popup;
        return popup;
    },

    /** private: method[handlePopupPosition]
     * :arg popup: the popup to be handled
     *     :class:`GeoExt.Popup`
     * :arg latLon: position of the popup in
     *     :class:`OpenLayers.LonLat` format
     * :arg items: ``Array`` Of items to be shown in the popup.
     * :arg onClose: ``Function`` Callback to be called on popup close.
     * :arg scope: ``Object`` with all parameters needed to call this method on 'aftermapmove' OpenLayers callback.
     */
    handlePopupPosition: function(popup, latLon, items, onClose, scope){
        // Issue #91: Set popup location on map resize
        if(scope){ 
            // First execution, add 'aftermapmove' listener
            scope.target.mapPanel.on({
                aftermapmove : scope.handlePopupPosition,   
                scope: {
                    popup: popup,
                    latLon: latLon,
                    items: items,
                    onClose: onClose,
                    scope: scope
                }
            });
            // and save last position
            scope.lastMapSize = scope.target.mapPanel.map.size;
        }else{
            // Map is moved and this function is a callback 'aftermapmove'
            var scope = {
                popup: this.popup,
                latLon: this.latLon,
                items: this.items,
                onClose: this.onClose,
                scope: this.scope
            };
            var mapHasBeenResized = (scope.scope.lastMapSize.w != scope.scope.target.mapPanel.map.size.w) 
                || (scope.scope.lastMapSize.h != scope.scope.target.mapPanel.map.size.h);
            if(scope.popup.isVisible() && mapHasBeenResized){
                // The location of the popup is corrupt. Whe need destroy it and sava a new one
                var popupKey = scope.latLon.toString();
                var popup = scope.scope.cachePopup(scope.latLon, scope.items, popupKey, scope.onClose);
                scope.popup.destroy();
                scope.scope.popupCache[popupKey] = popup;
                scope.scope.handlePopupPosition(popup, scope.latLon, scope.items, scope.onClose, scope.scope);
                // and save last position
                scope.scope.lastMapSize = scope.scope.target.mapPanel.map.size;
            }
        }
    },
	
    /** private: method[getPopupItem]
     * :arg text: ``String`` Body text.
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg features: ``Array`` With features.
     */
    getPopupItem:function(text, title, features){
    	var item;
    	if(features){
	    	 item = this.useTabPanel ? {
	            title: title,     
	            layout: "accordion",
                ref: title,  // use the title of the layer to reference the info panel
	            items: this.obtainFeatureInfoFromData(text, features, title),
	            autoScroll: true
	        } : {
	            title: title,           
	            layout: "accordion",  
                ref: title,
	            items: this.obtainFeatureInfoFromData(text, features, title),
	            autoScroll: true,
	            autoWidth: true,
	            collapsible: true
	        };
	    }else{
	    	item = this.useTabPanel ? {
				title: title,
				html: text,
				autoScroll: true
			} : {
	            title: title,
	            layout: "fit",
	            html: text,
	            autoScroll: true,
	            autoWidth: true,
	            collapsible: true
	        };
	    }
	    return item;
    },
	
	/** private: method[toggleActiveControl] 
	 *  toggles the active control (on Mouse Hover).
     */
	toggleActiveControl: function(checked){

		//get selectionModel of layer tree
		var sm = Ext.getCmp('layertree').getSelectionModel();

		if(checked){
			var sel = sm.getSelectedNode() ;
			//if a layer is selected create and activate the layer
			if(sel){
			 var layer = sel.layer
			 if(layer){
				this.activateActiveControl(layer,sel.text);
			}
		}
		//bind event selection change to create new control
		
			sm.on('selectionchange',this.changeSelected,this);
		}else{
			this.cleanActiveControl();
			sm.un('selectionchange',this.changeSelected,this);
		}
	},
    /** private: method[activateActiveControl] 
     *  activate the active control. called on tool activation
     *  if a layer is selected, or on selectionchangeEvent
     */
    activateActiveControl: function(layer, title){
        this.cleanActiveControl();
        var tooltip;
        var cleanup = function() {
            if (tooltip) {
                tooltip.destroy();
            }
        };
        
        var vendorParams = {};
        Ext.apply(vendorParams, layer.vendorParams || this.vendorParams || {});
        if(!vendorParams.env || vendorParams.env.indexOf('locale:') == -1) {
            vendorParams.env = vendorParams.env ? vendorParams.env + ';locale:' + GeoExt.Lang.locale : 'locale:' + GeoExt.Lang.locale;
        }

        var selectedLayer = this.target.mapPanel.layers.queryBy(function(x){
            return (layer.id == x.getLayer().id) && x.get("queryable") ;
        });

        selectedLayer.each(function(x){      

			// Obtain info format
        	var infoFormat = this.getInfoFormat(x);
                    
            var control = new OpenLayers.Control.WMSGetFeatureInfo({
                title: 'Identify features by clicking',
                layers: [layer],
                infoFormat: infoFormat,
                maxFeatures:this.maxFeatures,
                vendorParams: vendorParams,
                hover: true,
                queryVisible: true,
                handlerOptions:{    
                    hover: {delay: 200,pixelTolerance:2}
                },
                eventListeners:{
                    scope:this,

                    getfeatureinfo:function(evt){
                        cleanup();
                        
                        var disableAfterClick = this.disableAfterClick;
                        var button = this.button;
                        
                        setTimeout(function(){
                            if(disableAfterClick)
                                button.toggle();
                        }, 300);

                        // Issue #91
                        var title = x.get("title") || x.get("name");
                        if (infoFormat == "text/html") {
                            var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                            if (match && !match[1].match(/^\s*$/)) {
                                !this.infoPanelId ? this.displayPopup(evt, title, match[1]) : this.displayInfoInPanel(evt, title, match[1], this.infoPanelId);
                            }
                        } else if (infoFormat == "text/plain") {
                            !this.infoPanelId ? this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>') : this.displayInfoInPanel(evt, title, '<pre>' + evt.text + '</pre>', this.infoPanelId);
                        } else if (evt.features && evt.features.length > 0) {
                            !this.infoPanelId ? this.displayPopup(evt, title, null, null, null, evt.features) : this.displayInfoInPanel(evt, title, null, this.infoPanelId, evt.features);
                        } 
                    },deactivate: cleanup
                }
            });
            this.target.mapPanel.map.addControl(control);
            this.activeControl=control;
            control.activate();
        }, this);
        
    },   

    getInfoFormat: function(layer){

    	var infoFormat;
    	if(layer){
    		infoFormat = layer.get("infoFormat");
    	}
        if (infoFormat === undefined) {
            infoFormat = (this.format == "grid") ? "application/vnd.ogc.gml" : "text/html";
        }
        return infoFormat;
    },
    /** private: method[clearPopups]
     *  Clear last popup openned. Fixes issue #178.
     */
    clearPopups: function(){
        if(this._lastPopup){
            this._lastPopup.hide();
        }
    },   
    /** private: method[obtainFeatureInfoFromData]
     *  Obtain feature info panel by layer
     * :arg text: ``String`` Body text.
     * :arg features: ``Array`` With features.
     * :arg parentTitle: ``String`` Title of parent tab.
     */
    obtainFeatureInfoFromData: function(text, features, parentTitle) {

        var featureGrids = [];

        if (features) {
            var index = 0;
            var childTitle = parentTitle;
            Ext.each(features,function(feature) {
                if(this.customGroupTitleText){
                    childTitle = this.customGroupTitleText(feature, parentTitle, index++);
                }else{
                    childTitle = String.format(this.defaultGroupTitleText, parentTitle, index++)
                }
                featureGrids.push(this.obtainFeatureGrid(feature, childTitle));
                
                // Request all the linked surveys via WFS and display them
                this.getWFSSchema(this.createWFSFeatureStore, this, feature, featureGrids, parentTitle);

            }, this);
        }else {
            featureGrids.push(this.obtainFromText(text));
        }

        return featureGrids;
    },
    
    /**
     * private method[createGridPhotoBrowser]
     * Create e GridBrowser that loads surveys photos
     * return Ext.ux.GridBrowser();
     */
    createGridPhotoBrowser:function(feature){

        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><a target="_blank" href="'+this.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}">',
                '<img height="100px" width="100px" src="'+this.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}" class="thumb-img"></div>',
                '</a><span></span></div>'
            )
        });
    
        var photoBrowserDataView = new Ext.ux.GridBrowser({
            style:'overflow:auto',
            ref:'picview',
            multiSelect: true,
            authParam:this.authParam,
            authKey:this.authkey,
            picturesBrowserConfig:this.picturesBrowserConfig,
            rowExpander: expander,
            store: new Ext.data.JsonStore({
                    url: this.picturesBrowserConfig.baseUrl
					     +'?action=get_filelist&folder='
						 +this.picturesBrowserConfig.folder
						 +feature.data[this.picturesBrowserConfig.featureProperty]+"/"+feature.fid,
                    autoLoad: true,
                    root: 'data',
                    id:'name',
                    fields:[
                        'name', 'web_path','mtime','size','leaf',
                        {name: 'shortName', mapping: 'name'},
                        {name: 'text', mapping: 'name'}
                    ],
                    listeners:{
						load:function (store,records,req){
							if(records.length <= 0 ){
								photoBrowserDataView.refOwner.getBottomToolbar( ).hide();
								photoBrowserDataView.refOwner.doLayout();
							}
						}
                    }
            }),
            loadPhotos:function(r){
                if(r == null){
                    photoBrowserDataView.ownerCt.disable();
                    return;
                }
                var ds=this.getStore();
                var url=this.picturesBrowserConfig.baseUrl
                        +'?action=get_filelist&folder='
                        +this.picturesBrowserConfig.folder
                        +r.data[this.picturesBrowserConfig.featureProperty]+"/"+r.data.fid;
                if(this.authKey){
                    url+="&"+this.authParam+"="+this.authKey;
                }
                ds.proxy.setUrl(url,true);
                ds.load();
            },
            readOnly:true,
            ddGroup:null
        });

        return photoBrowserDataView;

    },
    
    
    /** private: method[obtainFeatureGrid]
     *  Obtain feature grid
     * :arg feature: ``Object`` Feature data.
     * :arg title: ``String`` Title for the grid.
     */
    obtainFeatureGrid: function(feature, title){

        var gcseggrid = this.target.tools["gcseggrid"];
        var lastEvent = this.lastEvent;
        
        var fields = [];

        Ext.iterate(feature.data,function(fieldName,fieldValue) {
            // We add the field.
            fields.push(fieldName);
        });
		
        var featureGridConfig = {
            xtype: 'gxp_editorgrid',
            readOnly: true,
            title: title,
            fields: fields,
            feature: feature,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            listeners: {
                'beforeedit': function(e) {
                    return false;
                }
            }
        };
		if(this.picturesBrowserConfig){
			featureGridConfig.title = null;
             
            var view = this.createGridPhotoBrowser(feature);
            
			var gallery = new Ext.DataView({
				itemSelector: 'div.thumb-wrap',
				style:'overflow:auto',
				ref:'picview',
				multiSelect: true,
				title:'Pictures',
				store: new Ext.data.JsonStore({
					url: this.picturesBrowserConfig.baseUrl
					     +'?action=get_filelist&folder='
						 +this.picturesBrowserConfig.folder
						 +feature.data[this.picturesBrowserConfig.featureProperty]+"/"+feature.fid,
					autoLoad: true,
					root: 'data',
					id:'name',
					fields:[
						'name', 'web_path','mtime','size',
						{name: 'shortName', mapping: 'name'}
					],
					listeners:{
						load:function (store,records,req){
							if(records.length <= 0 ){
								view.refOwner.getBottomToolbar( ).hide();
								view.refOwner.doLayout();
							}
						}
					}
				}),

				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div class="thumb-wrap" id="{name}">',
					'<div class="thumb"><img height="100px" width="100px" src="'+this.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}" class="thumb-img"></div>',
					'<span>{name}</span></div>',
					'</tpl>'
				),
				listeners:{
					dblclick:function (scope, index, node, e){
						window.open(node.getElementsByTagName("img")[0].src);
					}
				}
			});
            
			var tpanel = {
				xtype:'panel',
				layout:'card',
                minHeight: 100,
				activeItemIndex:0,
				activeItem:0,
				bbar: ['->', {
					ref:'../galleryBtn',
					hidden:true,
					iconCls: 'gc-icon-images',
					text: 'Gallery',
                    enableToggle: true,
					toggleHandler: function(btn, state){
						var layout = btn.refOwner.getLayout();
                        btn.refOwner.activeItemIndex = state ? 2 : 1;
						layout.setActiveItem(btn.refOwner.activeItemIndex);
                    }
                    }, {
					ref:'../manage',
					iconCls: 'gc-icon-notice',
					text: 'Manage',
                    scope: this,
					handler: function(btn){
                                gcseggrid.noFeatureClick(lastEvent);
                                gcseggrid.segGrid.zommInfo.on(
                                    'enable',
                                    function(){
                                        this.toggle(true);
                                        gcseggrid.segdet.centerPanel.noticeAccordion.noticePhotoBrowser.expand();
                                    },
                                    gcseggrid.segGrid.toggleInfo,
                                    {
                                        single: true
                                    }
                                );
                                this.closePopups();
                        }
                    }, {
					ref:'../switch',
					//hidden:true,
					iconCls: 'gxp-icon-printsnapshot',
					text: 'Images',
					handler: function(btn){
						var layout = btn.refOwner.getLayout();
						btn.refOwner.activeItemIndex = btn.refOwner.activeItemIndex == 0 ? 1 :0;
						layout.setActiveItem(btn.refOwner.activeItemIndex);
						btn.setText(btn.refOwner.activeItemIndex == 0 ? "Images" :"Attributes");
						btn.setIconClass(btn.refOwner.activeItemIndex == 0 ? 'gxp-icon-printsnapshot' : 'gxp-icon-csvexport-single') ;
                        if(btn.refOwner.activeItemIndex == 0 ){
                            btn.refOwner.galleryBtn.hide()
                        } else{
                            btn.refOwner.galleryBtn.show()
                            btn.refOwner.galleryBtn.toggle(false, true);
                        }
					}
				}],
				title: title,
				items: [featureGridConfig,view, gallery]
			};
			return tpanel;
		}
        return featureGridConfig;
    },
    /** private: method[obtainFromText]
     *  Obtain a simple panel with text.
     * :arg text: ``String`` Body text.
     */
    obtainFromText: function(text) {
        return {
            xtype: 'panel',
            layout: 'fit',
            items: {
                xtype: 'label',
                text: text ? text : this.noDataMsg
            }
        };
    },
	/**
	 * private:[changeSelected]
	 * method called on selection change. Is defined out the space
	 * becouse this method have to be unique, to allow unbinding once
	 * the active tool is deactivated
	 */
	changeSelected: function(sm,sel,eOpts){
		var sel = sm.getSelectedNode();
		if(!sel){
			this.cleanActiveControl();return;
		}
		this.activateActiveControl(sel.layer,sel.text);
	},
	/** 
	 *  private: method[cleanActiveControl] 
     *  utility routine to remove active control
     */	 
	cleanActiveControl: function(){
		if (this.activeControl){
			this.activeControl.deactivate();
			this.activeControl.destroy();
		}
	},
    
    /**
     * Issue a WFS DescribeFeatureType to fetch feature schema
     */
    getWFSSchema : function (callback, scope, feature, featureGrids, parentTitle) {

        var authObj = {};
        authObj[this.authParam] = this.authKey;
        
        var schema = new GeoExt.data.AttributeStore({
                url : this.wfsURL,
                baseParams : Ext.apply({
                    SERVICE : "WFS",
                    VERSION : "1.1.0",
                    REQUEST : "DescribeFeatureType",
                    TYPENAME : this.surveyTypeName,
                }, this.baseParams || authObj),
                autoLoad : true,
                listeners : {
                    "load" : function () {
                        callback.call(scope, schema, feature, featureGrids, parentTitle);
                    },
                    scope : this
                }
            });
    },
    
    /**
     * Loads features with WFS
     */
    createWFSFeatureStore : function (schema, feature, featureGrids, parentTitle) {

        this.schema = schema;
        var fields = [],
        geometryName;
        var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
        var types = {
            "xsd:boolean" : "boolean",
            "xsd:int" : "int",
            "xsd:integer" : "int",
            "xsd:short" : "int",
            "xsd:long" : "int",
            "xsd:date" : "date",
            "xsd:string" : "string",
            "xsd:float" : "float",
            "xsd:decimal" : "float"
        };
        schema.each(function (r) {
            var match = geomRegex.exec(r.get("type"));
            if (match) {
                geometryName = r.get("name");
                this.geometryType = match[1];
            } else {
                var type = types[r.get("type")];
                var field = {
                    name : r.get("name"),
                    type : type
                };
                if (type == "date") {
                    field.dateFormat = "Y-m-d\\Z";
                }
                fields.push(field);
            }
        }, this);

        var protocolOptions = Ext.apply({
                srsName : this.target.mapPanel.map.getProjection(),
                url : (this.authKey && this.authParam) ? schema.url + "?" + this.authParam + "=" + this.authKey : schema.url,
                featureType : schema.reader.raw.featureTypes[0].typeName,
                featureNS : schema.reader.raw.targetNamespace,
                geometryName : geometryName
            }, this.baseParams || {});

            
        var filter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : this.queriableAttribute,
            value : feature.attributes[this.linkingAttribute]
        });
        
        this.hitCountProtocol = new OpenLayers.Protocol.WFS(Ext.apply({
                    version : "1.1.0",
                    readOptions : {
                        output : "object"
                    },
                    resultType : "hits",
                    filter : filter
                }, protocolOptions));

        var featureStore = new gxp.data.WFSFeatureStore(Ext.apply({
                    fields : fields,
                    proxy : {
                        protocol : {
                            outputFormat : 'JSON'
                        }
                    },
                    //maxFeatures : this.maxFeatures,
                    //layer : this.featureLayer,
                    ogcFilter : filter,
                    autoLoad : true,
                    sortBy : this.sortBy,
                    autoSave : false,
                    listeners : {
                        "load" : function (store, arg2, arg3) {
                            var storeSize = store.getCount();
                            if( storeSize > 0){
                                var grids_reference;
                                for(var key in this.popupCache) {
                                    if(this.popupCache.hasOwnProperty(key)) {
                                        if(this.popupCache[key]
                                        && this.popupCache[key].items
                                        && this.popupCache[key].items.get(0)
                                        && this.popupCache[key].items.get(0)[parentTitle]){
                                            grids_reference = this.popupCache[key].items.get(0)[parentTitle];
                                        }else{
                                            return;
                                        }
                                    }
                                }
                                
                                for(i = 0; i < storeSize; i++){
                                    var storeObj = store.getAt(i);
                                    if(storeObj.data && storeObj.data.feature){
                                        var childTitle = i;
                                        if(this.customGroupTitleText){
                                            childTitle = this.customGroupTitleText(storeObj.data.feature, this.surveyTypeName, i);
                                        }else{
                                            childTitle = String.format(this.defaultGroupTitleText, this.surveyTypeName, i)
                                        }
                                        grids_reference.add(this.obtainFeatureGrid(storeObj.data.feature, childTitle));
                                    }
                                }
                                grids_reference.doLayout();
                            }
                        },
                        scope : this
                    }
                }, protocolOptions));

        return featureStore;

    },
	
    /**
	* Get the user's corrensponding authkey if present 
	* (see MSMLogin.getLoginInformation for more details)
	*/
	getAuthParam: function(){
		var userInfo = this.target.userDetails;
		var authkey;
		
		if(userInfo.user.attribute instanceof Array){
			for(var i = 0 ; i < userInfo.user.attribute.length ; i++ ){
				if( userInfo.user.attribute[i].name == "UUID" ){
					authkey = userInfo.user.attribute[i].value;
				}
			}
		}else{
			if(userInfo.user.attribute && userInfo.user.attribute.name == "UUID"){
			   authkey = userInfo.user.attribute.value;
			}
		}

		if(authkey){
			var authParam = userInfo.user.authParam;
			this.authParam = authParam ? authParam : this.authParam;
		}
		
		return authkey;
	}
});

Ext.preg(gxp.plugins.WMSGetFeatureInfoMenu.prototype.ptype, gxp.plugins.WMSGetFeatureInfoMenu);
