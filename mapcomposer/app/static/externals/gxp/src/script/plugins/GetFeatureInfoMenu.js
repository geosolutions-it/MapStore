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
 * @requires plugins/WMSGetFeatureInfoMenu.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GetFeatureInfoMenu
 */

/** api: (extends)
 *  plugins/WMSGetFeatureInfoMenu.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GetFeatureInfoMenu(config)
 *
 *    This plugins provides a menu with two actions. When active,
 *    these actions issue GetFeatureInfo requests.
 *    The first will issue a GetFeatureInfo request to the WMS
 *    of all layers on the map once the user click.
 *    The second,  will issue a GetFeatureInfo request
 *    to the selected layer in layertree (if any) on mouse Hover.
 *    The output will be displayed in a popup.
 */
gxp.plugins.GetFeatureInfoMenu = Ext.extend(gxp.plugins.WMSGetFeatureInfoMenu, {

    /** api: ptype = gxp_getfeatureinfo_menu */
    ptype: "gxp_getfeatureinfo_menu",

    /** api: config[eTollerance]
     *  ``Integer``
     *   Numeber of pixels used as tollerance to get features intesettin a mao
     */
     eTollerance: 10,

    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        this.activeIndex = 0;

        if(this.infoAction=='click'){
            this.button = new Ext.Button({
                tooltip: this.infoActionTip,
                iconCls: "gxp-icon-getfeatureinfo",
                toggleGroup: this.toggleGroup,
                enableToggle: true,
                allowDepress: true,
                toggleHandler: function(button, pressed) {
                    this.button.toggle(pressed);
                    for (var i = 0, len = info.controls.length; i < len; i++){
                        if (pressed) {
                            info.controls[i].activate();
                        } else {
                            info.controls[i].deactivate();
                        }
                    }
                 }, scope: this
            });
        }
        else if(this.infoAction=='hover'){
            this.button = new Ext.Button({
                tooltip:  this.activeActionTip,
                iconCls: (this.outputConfig)? this.outputConfig.hoverIconCls || "gxp-icon-getfeatureinfo":"gxp-icon-getfeatureinfo",
                toggleGroup: this.toggleGroup,
                enableToggle: true,
                allowDepress: true,
                toggleHandler: function(button, pressed) {
                    this.button.toggle(pressed);
                    this.toggleActiveControl(pressed);
                },
                scope: this
            });
        }
        else{
            var items = [
                new Ext.menu.CheckItem({
                    tooltip: this.infoActionTip,
                    text: this.infoActionTip,
                    iconCls: "gxp-icon-getfeatureinfo",
                    group: this.toggleGroup,
                    listeners: {
                        checkchange: function(item, checked) {
                            this.activeIndex = this.button.menu.items.indexOf(item);
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
                }),
                new Ext.menu.CheckItem({
                    tooltip: this.activeActionTip,
                    text: this.activeActionTip,
                    iconCls: "gxp-icon-mouse-map",
                    group: this.toggleGroup,
                    allowDepress:false,
                    listeners:{
                        checkchange: function(item, checked) {
                            this.activeIndex = this.button.menu.items.indexOf(item);
                            this.button.toggle(checked);
                            if (checked) {
                                this.button.setIconClass(item.iconCls);
                            }
                            this.toggleActiveControl(checked);
                        },
                        scope: this
                    }
                })
            ];

            if(this.infoAction == "hover;click"){
                items = items.reverse();
            }else{
                this.infoAction='All';
            }

            this.button = new Ext.SplitButton({
                // Set icon and tooltip from the first element
                iconCls: items[0].iconCls,
                tooltip: items[0].tooltip,
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
        }

        var actions = gxp.plugins.WMSGetFeatureInfoMenu.superclass.addActions.call(this, [this.button]);
        //var infoButton = (items)? items[0]: this.button;
        var infoButton = (items)? ((this.infoAction==="hover;click") ? items[1] : items[0] ) : this.button;

        var info = {controls: []};
        var layersToQuery = 0;

        var updateInfo = function() {
            if(this.infoAction=='hover'){
                return;
            }
            var queryableLayers = this.target.mapPanel.layers.queryBy(function(x){
                return x.get("queryable");
            });
            var queryableJSONLayers = this.target.mapPanel.layers.queryBy(function(x){
                return (x.get("queryable") && x.get("isGeoJSON"));
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
                if(!x.get("isGeoJSON")){
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
                                layersToQuery=queryableLayers.length - queryableJSONLayers.length;
                                panIn=false;//Issue #623
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

                                if(this.disableAfterClick){
                                    this.button.toggle();
                                }

                                // pan to bring popup into view (issue #422)
                                if (startLatLon) {

                                    var popup = this.popupCache[startLatLon.toString()];
                                    if (popup) {
                                        // not too pretty, I'm calling a private method... any better idea?
                                        popup.panIntoView();
                                    }else{
                                        panIn=true; //issue #623
                                    }
                                }
                             }

                                var title = x.get("title") || x.get("name");
                                if (infoFormat == "text/html") {
                                    var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && match[1].match(this.regex)) {
                                    !this.infoPanelId ? this.displayPopup(evt, title, match[1],null,null,null,panIn) : this.displayInfoInPanel(evt, title, match[1], this.infoPanelId);
                                    atLeastOneResponse = true;
                                }
                                } else if (infoFormat == "text/plain") {
                                    !this.infoPanelId ? this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>',null,null,null,panIn) : this.displayInfoInPanel(evt, title, '<pre>' + evt.text + '</pre>', this.infoPanelId);
                                    atLeastOneResponse = true;
                                } else if (evt.features && evt.features.length > 0) {
                                    !this.infoPanelId ? this.displayPopup(evt, title, null, null, null, evt.features,panIn) : this.displayInfoInPanel(evt, title, null, this.infoPanelId, evt.features);
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
                                if(layersToQuery === 0) {
                                this.unmask();
                                started=false;

                                if(this.disableAfterClick){
                                    this.button.toggle();
                                }
                                // pan to bring popup into view (issue #422)
                                if (startLatLon) {
                                    var popup = this.popupCache[startLatLon.toString()];
                                    if (popup) {
                                        // not too pretty, I'm calling a private method... any better idea?
                                        popup.panIntoView();
                                    }else {

                                    }
                                }
                             }
                            },
                            scope: this
                        }
                });
                //Override control function to add check for inRangeLayer
                control.findLayers= function() {
                    var candidates = this.layers || this.map.layers;
                    var layers = [];
                    var layer, url;
                    for(var i = candidates.length - 1; i >= 0; --i) {
                        layer = candidates[i];
                        if(layer instanceof OpenLayers.Layer.WMS &&
                        (!this.queryVisible || (layer.getVisibility() && layer.calculateInRange())) ) {
                            url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                            // if the control was not configured with a url, set it
                            // to the first layer url
                            if(this.drillDown === false && !this.url) {
                                this.url = url;
                            }
                            if(this.drillDown === true || this.urlMatches(url)) {
                                layers.push(layer);
                            }
                        }
                    }
                return layers;
               };

                map.addControl(control);
                info.controls.push(control);
                if(infoButton.checked || infoButton.pressed ) {
                    control.activate();
                }
            }else if (x.get("isGeoJSON")) {
                var title = x.get("title") || x.get("name");
                me=this;
                var callbacks = {
                        click: function(evt) {
                            if(l.visibility){
                                var pos = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y));
                                if(!started){
                                    started= true;
                                    // Issue #422
                                    startLatLon = pos;
                                    atLeastOneResponse=false;
                                    layersToQuery=queryableLayers.length - queryableJSONLayers.length;
                                    panIn=false;//Issue #623
                                }
                                var features = [];
                                var point = new OpenLayers.Geometry.Point(pos.lon, pos.lat);
                                var polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(point,map.getResolution()*me.eTollerance,4,0);

                                for (i=0; i<l.features.length;i++){
                                    if(polygon.intersects(l.features[i].geometry)) features.push(l.features[i]);
                                }
                                if(features.length> 0){
                                    if(layersToQuery === 0) {
                                        started=false;
                                    if(me.disableAfterClick){
                                        me.button.toggle();
                                    }
                                // pan to bring popup into view (issue #422)
                                    if (startLatLon) {
                                        var popup = me.popupCache[startLatLon.toString()];
                                        if (popup) {
                                            // not too pretty, I'm calling a private method... any better idea?
                                            popup.panIntoView();
                                        }else{
                                            panIn=true; //issue #623
                                            }
                                        }
                                    }

                                    !me.infoPanelId ? me.displayPopup(evt, title, null, null, null, features,panIn) : me.displayInfoInPanel(evt, title, null, me.infoPanelId, features);
                                    atLeastOneResponse = true;
                                }
                            }

                        }
                    };
                var handler = new OpenLayers.Handler.Click(
                     {map: map}, l, callbacks, {stopClick:true});

                info.controls.push(handler);
                if(infoButton.checked || infoButton.pressed ) {
                    handler.activate();
                }
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

        if(this.infoAction=='All' || this.infoAction=="hover;click"){
           Ext.each(this.button.menu.items.keys, function(key){
                var item = this.button.menu.items.get(key);
                item.on({
                    click: this.closePopups,
                    scope:this
                });
            }, this);
        }

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
        if(!vendorParams.env || ( vendorParams.env && vendorParams.env.indexOf('locale:') == -1)) {
            vendorParams.env = vendorParams.env ? vendorParams.env + ';locale:' + GeoExt.Lang.locale : 'locale:' + GeoExt.Lang.locale;
        }

        var selectedLayer = this.target.mapPanel.layers.queryBy(function(x){
            return (layer.id == x.getLayer().id) && x.get("queryable") ;
        });
        var map =this.target.mapPanel.map;
        selectedLayer.each(function(x){

            // Obtain info format
            var infoFormat = this.getInfoFormat(x);
        if(!x.get("isGeoJSON")){
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
                            if(disableAfterClick){
                                button.toggle();
                            }
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

            //Override control function to add check for inRangeLayer
                control.findLayers= function() {
                    var candidates = this.layers || this.map.layers;
                    var layers = [];
                    var layer, url;
                    for(var i = candidates.length - 1; i >= 0; --i) {
                        layer = candidates[i];
                        if(layer instanceof OpenLayers.Layer.WMS &&
                        (!this.queryVisible || (layer.getVisibility() && layer.calculateInRange())) ) {
                            url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                            // if the control was not configured with a url, set it
                            // to the first layer url
                            if(this.drillDown === false && !this.url) {
                                this.url = url;
                            }
                            if(this.drillDown === true || this.urlMatches(url)) {
                                layers.push(layer);
                            }
                        }
                    }
                return layers;
               };

            this.target.mapPanel.map.addControl(control);
            this.activeControl=control;
            control.activate();
        }else if (x.get("isGeoJSON")) {
                var title = x.get("title") || x.get("name");
                me=this;
                var callbacks = {
                        'pause': function(evt) {
                            var pos = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y));
                            if(layer.visibility){
                                var features = [];
                                var point = new OpenLayers.Geometry.Point(pos.lon, pos.lat);
                                var polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(point,map.getResolution()*me.eTollerance,4,0);

                                for (i=0; i<layer.features.length;i++){
                                    if(polygon.intersects(layer.features[i].geometry)) features.push(layer.features[i]);
                                }
                                if(features.length> 0){
                                    !this.infoPanelId ? me.displayPopup(evt, title, null, null, null, features) : me.displayInfoInPanel(evt, title, null, me.infoPanelId, features);
                                }
                            }

                        }
                    };
                var handler = new OpenLayers.Handler.Hover(
                     {map: map}, callbacks, { delay: 200, pixelTolerance:2});

                this.activeControl=handler;
                handler.activate();
            }

        }, this);


    },
    /** private: method[obtainFeatureGrid]
     *  Obtain feature grid
     * :arg feature: ``Object`` Feature data.
     * :arg title: ``String`` Title for the grid.
     */
    obtainFeatureGrid: function(feature, title){

        var fields = [];
        if(feature.gml){
            var lname=(feature.gml.featureNSPrefix)?feature.gml.featureNSPrefix+":"+feature.gml.featureType:feature.gml.featureType;
        }else if (feature.layer){
            var lname = feature.layer.name;
        }
        var ignoreFields=(this.outputGridConfig && this.outputGridConfig[lname] &&  this.outputGridConfig[lname].ignoreFields)?this.outputGridConfig[lname].ignoreFields:[];
        var propertyNames=(this.outputGridConfig && this.outputGridConfig[lname] &&  this.outputGridConfig[lname].propertyNames)?this.outputGridConfig[lname].propertyNames:null;
        var extraFields=(this.outputGridConfig && this.outputGridConfig[lname] &&  this.outputGridConfig[lname].extraFields)?this.outputGridConfig[lname].extraFields:null;
        Ext.iterate(feature.data,function(fieldName,fieldValue) {
            // We add the field.
            fields.push(fieldName);
        });
             var  customRenderers={};
             for(var f in extraFields){
                 fields.push({"name":f});
                 customRenderers[f] = (function() {
                                return function(d) {
                                    var tpl=new Ext.XTemplate(extraFields[f]);
                                     return tpl.apply(d);
                                };
                            })();
                            }
        var featureGridConfig = {
            xtype: 'gxp_editorgrid',
            readOnly: true,
            title: title,
            fields: fields,
            propertyNames :propertyNames ||{},
            excludeFields :ignoreFields||[],
            customRenderers:customRenderers,
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
    }
});

Ext.preg(gxp.plugins.GetFeatureInfoMenu.prototype.ptype, gxp.plugins.GetFeatureInfoMenu);
