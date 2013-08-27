
/*
 * WMSGetFeatureInfoMenu.js Copyright (C) 2013 This file is part of MapStore project.
 * Published under the GPLv3. 
 * See https://raw.github.com/geosolutions-it/mapstore/master/license.txt for the full text license.
 * 
 * Authors: Alejandro Diaz Torres (mailto:aledt84@gmail.com)
 */

/**
 * @required  plugins/WMSGetFeatureInfoMenu.js
 * @required  MapStore/plugins/WMSGetFeatureInfoDialog.js
 */

/** api: (define)
 *  module = MapStore.plugins
 *  class = WMSGetFeatureInfoMenu
 */
Ext.namespace("MapStore.plugins");

/**
 * Class: MapStore.plugins.WMSGetFeatureInfoMenu
 * 
 * WMSGetFeatureInfoMenu custom tool for MapStore
 * 
 */
MapStore.plugins.WMSGetFeatureInfoMenu = Ext.extend(gxp.plugins.WMSGetFeatureInfoMenu, {

    /** api: ptype = ms_wmsgetfeatureinfo_menu */
    ptype: "ms_wmsgetfeatureinfo_menu",

    /** i18n **/
    defaultGroupTitleText: "{0} [{1}]",
     
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
                        // Issue #178: Clear popups.
                        this.clearPopups();
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                },
                scope: this
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

                // Change info format
                var infoFormat = x.get("infoFormat");
                if (infoFormat === undefined) {
                    infoFormat = this.format == "html" ? "text/html" : "application/vnd.ogc.gml";
                }
                
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: l.url,
                    queryVisible: true,
                    map: map,
                    layers: [x.getLayer()],
                    infoFormat: infoFormat,
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
                                
                            }

                            var title = x.get("title") || x.get("name");
                            if (infoFormat == "text/html") {
                                var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && !match[1].match(/^\s*$/)) {
                                    this.displayPopup(evt, title, match[1]);
                                }
                            } else if (infoFormat == "text/plain") {
                                this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>');
                            } else if (evt.features && evt.features.length > 0) {
                                this.displayPopup(evt, title, null, evt.features);
                            // no response at all
                            } else if(layersToQuery === 0 && !atLeastOneResponse) {
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
        
        return actions;
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
            // Change info format. Issue #91
            var infoFormat = x.get("infoFormat");
            if (infoFormat === undefined) {
                infoFormat = this.format == "html" ? "text/html" : "application/vnd.ogc.gml";
            }
                    
            var control = new OpenLayers.Control.WMSGetFeatureInfo({
                title: 'Identify features by clicking',
                layers: [layer],
                infoFormat: infoFormat,
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
                        // Issue #91
                        var title = x.get("title") || x.get("name");
                        if (infoFormat == "text/html") {
                            var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                            if (match && !match[1].match(/^\s*$/)) {
                                this.displayPopup(evt, title, match[1]);
                            }
                        } else if (infoFormat == "text/plain") {
                            this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>');
                        } else if (evt.features && evt.features.length > 0) {
                            this.displayPopup(evt, title, null, evt.features);
                        } 
                    },deactivate: cleanup
                }
            });
            this.target.mapPanel.map.addControl(control);
            this.activeControl=control;
            control.activate();
        }, this);
        
    },
    
    /** private: method[displayPopup]
     * :arg evt: the event object from a 
     *     :class:`OpenLayers.Control.GetFeatureInfo` control
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     * :arg features: ``Array`` With features.
     * :arg onClose: ``Function`` Callback for popup close.
     * :arg scope: ``Object`` Object scope for close function.
     */
    displayPopup: function(evt, title, text, features, onClose, scope) {
        
        var popup;
        var popupKey = evt.xy.x + "." + evt.xy.y;
                        
        var item = this.useTabPanel ? {
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
            
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: this.useTabPanel ? "fit" : "accordion",
                width: 490,
                height: 320,
                location: evt.xy,
                map: this.target.mapPanel,
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
            this.popupCache[popupKey] = popup;
            // Issue #178: Save popup to hide when this tool is disabled;
            this._lastPopup = popup;
        } else {
            popup = this.popupCache[popupKey];
            
            var container = this.useTabPanel ? popup.items.first() : popup;
            container.add(item);
        }
                
        popup.doLayout();
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
    }

});

Ext.preg(MapStore.plugins.WMSGetFeatureInfoMenu.prototype.ptype, MapStore.plugins.WMSGetFeatureInfoMenu);