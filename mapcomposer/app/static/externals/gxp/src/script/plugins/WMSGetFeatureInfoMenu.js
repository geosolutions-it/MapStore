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
     *  Default feature title in 'grid' showing. Layer name replaces '{0}' and index in tue request replaces '{1}'.
     */
    defaultGroupTitleText: "{0} [{1}]",
    
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
     *  
     */
     disableAfterClick: false,
     
    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        this.activeIndex = 0;
        
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
                                Ext.Msg.show({
                                    title: this.popupTitle,
                                    msg: this.noDataMsg,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
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
            location: latLon,
            map: this.target.mapPanel,
            width: 490,
            height: 320,
            /*anchored: true,
            unpinnable : true,*/
            items: items,
            draggable: true,
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
	            items: this.obtainFeatureInfoFromData(text, features, title),
	            autoScroll: true
	        } : {
	            title: title,           
	            layout: "accordion",  
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
            Ext.each(features,function(feature) {
                featureGrids.push(this.obtainFeatureGrid(feature, String.format(this.defaultGroupTitleText, parentTitle, index++)));
            }, this);
        }else {
            featureGrids.push(this.obtainFromText(text));
        }

        return featureGrids;
    },   
    /** private: method[obtainFeatureGrid]
     *  Obtain feature grid
     * :arg feature: ``Object`` Feature data.
     * :arg title: ``String`` Title for the grid.
     */
    obtainFeatureGrid: function(feature, title){

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
	}
	
    
});

Ext.preg(gxp.plugins.WMSGetFeatureInfoMenu.prototype.ptype, gxp.plugins.WMSGetFeatureInfoMenu);
