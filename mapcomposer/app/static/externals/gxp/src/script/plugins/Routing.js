/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Routing
 */

/**
 * api: (extends) plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/**
 * api: constructor .. class:: Routing(config)
 * 
 * Plugin to select the starting point for route calculation.
 */
gxp.plugins.Routing = Ext.extend(gxp.plugins.Tool, {

    ptype : "gxp_routing",

    buttonText: "",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for action and win title item (i18n).
     */
    menuText: "Calcola percorso",
    
    /** api: config[tooltip]
     *  ``String``
     *  Text for action tooltip (i18n).
     */
    tooltip: "Calcola percorso",
    
    /** private: property[iconCls]
     */
    iconCls: "icon-route",

    formulaText: "Formula",

    routeStartText: "Partenza",

    routeEndText: "Destinazione",

    descriptionText: "Descrizione",

    routePointsText: "Estremi del percorso",

    selectPointText: "Seleziona punto da mappa",

    calculateText: "Calcola",

    lonText: "Lon",

    latText: "Lat",

    routingText: "Routing",

    errorTitle: "Errore",

    missingParametersMsg: "Specificare tipo di formula, partenza e destinazione",

    selectOneMsg: "Selezionare una opzione",

    fieldRequiredMsg: "Il campo è obbligatorio",

    lengthFormula: "Lunghezza",

    /** private: method[constructor]
     */
    constructor: function (config) {
        this.initialConfig = config;

        Ext.apply(this, config);

        gxp.plugins.Routing.superclass.constructor.apply(this, arguments);
    },

    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function (target) {
        gxp.plugins.Routing.superclass.init.apply(this, arguments);
        this.target = target;
    },

    /** api: method[addActions]
     */
    addActions: function () {

        var actions = gxp.plugins.Routing.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function () {
                var map = this.target.mapPanel.map;
                var routePoints = this.getOrCreateRoutePointsLayer();
                var me = this;
                var formulaStore = app.tools["syntheticview"].processingPane.formulaStore;
                
                var clickHandler = new OpenLayers.Handler.Click({}, {
                    "click": function(event) { }
                }, {
                    map: map
                });
                
                var createMarker = function(position, lonLat) {
                    var size = new OpenLayers.Size(25,35);
                    var offset = new OpenLayers.Pixel(-size.w, -size.h);
                    var icon = new OpenLayers.Icon('theme/app/img/' + position + '.png',size,offset);
                    var currentMarker = routePoints.points[position];
                    if (currentMarker) {
                        routePoints.removeMarker(currentMarker);
                    }
                    currentMarker = new OpenLayers.Marker(lonLat, icon);
                    routePoints.addMarker(currentMarker);
                    routePoints.points[position] = currentMarker;
                };
                
                var numberFieldDefaults = {
                    xtype:'numberfield',
                    allowBlank: false,
                    blankText: this.fieldRequiredMsg,
                    allowDecimals: true,
                    autoStripChars: true,
                    decimalPrecision: 4,
                    anchor:'95%',
                    enableKeyEvents: true,
                    listeners: {
                        "keyup": function() {
                            me.enableOrDisableCalculateBtn();
                        }
                    }
                };
                
                var formPanel = new Ext.FormPanel({
                    id: 'route-formpanel',
                    labelAlign: 'top',
                    frame:true,
                    bodyStyle:'padding:5px 5px 0',
                    items: [{
                        xtype: 'fieldset',
                        title: this.formulaText,
                        layout: 'form',
                        items: [{
                            id: 'formula-group',
                            xtype: 'radiogroup',
                            hideLabel: true,
                            itemCls: 'x-check-group-alt',
                            allowBlank: false,
                            blankText: this.selectOneMsg,
                            // Put all controls in a single column with width 100%
                            columns: 1,
                            items: [
                                {boxLabel: formulaStore.getAt(formulaStore.find('id_formula', 26)).get('name'), name: 'formula', inputValue: 141, checked: true},
                                {boxLabel: formulaStore.getAt(formulaStore.find('id_formula', 32)).get('name'), name: 'formula', inputValue: 32},
                                {boxLabel: formulaStore.getAt(formulaStore.find('id_formula', 22)).get('name'), name: 'formula', inputValue: 22},
                                {boxLabel: this.lengthFormula, name: 'formula', inputValue: 142}
                            ]
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: this.routeStartText,
                        layout:'column',
                        items:[{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: this.lonText,
                                name: 'x_start',
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: this.latText,
                                name: 'y_start',
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.1,
                            layout: 'form',
                            items: [{
                                xtype:'button',
                                fieldLabel: '&nbsp;',
                                labelSeparator: '',
                                iconCls: 'icon-pick',
                                tooltip: this.selectPointText,
                                text: '',
                                enableToggle: true,
                                toggleGroup: 'pick_point',
                                toggleHandler: function(btn, pressed) {
                                    if (pressed) {
                                        clickHandler.callbacks["click"] = function(event) {
                                            var xy = map.getLonLatFromPixel(event.xy);
                                            createMarker("start", xy);
                                            
                                            var xField = formPanel.getStartX();
                                            var yField = formPanel.getStartY();
                                            var lonLat = me.toLonLat(xy.lon, xy.lat);
                                            xField.setValue(lonLat.lon);
                                            yField.setValue(lonLat.lat);
                                            
                                            me.enableOrDisableCalculateBtn();
                                            win.expand();
                                            btn.toggle();
                                        }
                                        if (clickHandler.activate()) {
                                            win.collapse();
                                        }
                                    } else {
                                        clickHandler.deactivate();
                                    }
                                }
                            }]
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: this.routeEndText,
                        layout:'column',
                        items:[{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: this.lonText,
                                name: 'x_end'
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: this.latText,
                                name: 'y_end',
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.1,
                            layout: 'form',
                            items: [{
                                xtype:'button',
                                fieldLabel: '&nbsp;',
                                labelSeparator: '',
                                iconCls: 'icon-pick',
                                tooltip: this.selectPointText,
                                text: '',
                                enableToggle: true,
                                toggleGroup: 'pick_point',
                                toggleHandler: function(btn, pressed) {
                                    if (pressed) {
                                        clickHandler.callbacks["click"] = function(event) {
                                            var xy = map.getLonLatFromPixel(event.xy);
                                            createMarker("end", xy);
                                            
                                            var xField = formPanel.getEndX();
                                            var yField = formPanel.getEndY();
                                            var lonLat = me.toLonLat(xy.lon, xy.lat);
                                            xField.setValue(lonLat.lon);
                                            yField.setValue(lonLat.lat);
                                            
                                            me.enableOrDisableCalculateBtn();
                                            win.expand();
                                            btn.toggle();
                                        }
                                        if (clickHandler.activate()) {
                                            win.collapse();
                                        }
                                    } else {
                                        clickHandler.deactivate();
                                    }
                                }
                            }]
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: this.descriptionText,
                        layout:'column',
                        items:[{
                            columnWidth: 1,
                            layout: 'form',
                            items: [{
                                xtype: "textfield",
                                name: "description",
                                hideLabel: true,
                                allowBlank: true,
                                anchor:'95%'
                            }]
                        }]
                    }],
                    getFormula: function() {
                        return this.getForm().findField('formula-group').getValue();
                    },
                    getStartX: function() {
                        return this.getForm().findField('x_start');
                    },
                    getStartY: function() {
                        return this.getForm().findField('y_start');
                    },
                    getEndX: function() {
                        return this.getForm().findField('x_end');
                    },
                    getEndY: function() {
                        return this.getForm().findField('y_end');
                    },
                    getDescription: function() {
                        return this.getForm().findField('description');
                    }
                });
                
                var routingBtn = actions[0];
                var win = new Ext.Window({
                    title: me.menuText,
                    width: 400,
                    height: 510,
                    layout: 'fit',
                    renderTo: app.mapPanel.body,
                    modal: false,
                    autoScroll: true,
                    constrainHeader: true,
                    closable: true,
                    resizable: false,
                    draggable: true,
                    items: [formPanel],
                    listeners: {
                        close: function () {
                            clickHandler.destroy();
                            formPanel.destroy();
                            routingBtn.enable();
                        }
                    },
                    bbar: ["->", {
                        id: 'route-calculate',
                        xtype: 'button',
                        text: this.calculateText,
                        iconCls: 'icon-calculate-route',
                        scope: me,
                        disabled: true,
                        handler: function() {
                            if (!formPanel.getForm().isValid()) {
                                Ext.Msg.show({
                                    title: this.errorTitle,
                                    buttons: Ext.Msg.OK,
                                    msg: this.missingParametersMsg,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                            } else {
                                var formula = formPanel.getFormula().getGroupValue();
                                var startX = formPanel.getStartX().getValue();
                                var startY = formPanel.getStartY().getValue();
                                var endX = formPanel.getEndX().getValue();
                                var endY = formPanel.getEndY().getValue();
                                var descr = formPanel.getDescription().getValue();
                                if (!descr) {
                                    descr = me.getDefaultDescription();
                                }
                                
                                var start = this.toRoutePointParam("start", startX, startY);
                                var end = this.toRoutePointParam("end", endX, endY);
                                var startPoint = routePoints.points["start"];
                                var endPoint = routePoints.points["end"];
                                var bbox = me.toBBoxParam(startPoint.lonlat.lon, startPoint.lonlat.lat,
                                        endPoint.lonlat.lon, endPoint.lonlat.lat);
                                
                                var syntView = app.tools["syntheticview"];
                                syntView.addRoutingLayer(descr, formula, start, end, bbox);
                                
                                // clear markers
                                routePoints.clearMarkers();
                                for (var pos in routePoints.points) {
                                    routePoints.points[pos].destroy();
                                    delete routePoints.points[pos];
                                }
                                
                                win.close();
                            }
                        }
                    }]
                })
                routingBtn.disable();
                win.show();
            },
            scope: this
        }]);
        return actions;
    },

    enableOrDisableCalculateBtn: function() {
        var formPanel = Ext.getCmp('route-formpanel');
        var calculateBtn = Ext.getCmp('route-calculate');
        if (formPanel && calculateBtn) {
            if (formPanel.getForm().isValid()) {
                calculateBtn.setDisabled(false);
            } else {
                calculateBtn.setDisabled(true);
            }
        }
    },

    getDefaultDescription: function() {
        var formPanel = Ext.getCmp('route-formpanel');
        var formulaField = formPanel && formPanel.getFormula();
        if (formulaField) {
            return this.routingText + " (" + formulaField.boxLabel + ")";
        }
    },

    getOrCreateRoutePointsLayer: function() {
        var routePointsLayer = null;
        var map = this.target.mapPanel.map;
        var layers = map.getLayersByName(this.routePointsText);
        if (layers.length === 0) {
            routePointsLayer = new OpenLayers.Layer.Markers(this.routePointsText);
            routePointsLayer.displayInLayerSwitcher = false;
            routePointsLayer.points = {};
            
            /*var Record = GeoExt.data.LayerRecord.create([{ name: "group", type: "string" }]);
            this.target.mapPanel.layers.add([new Record({
                title: this.routePointsText,
                layer: routePointsLayer,
                group: "routing"
            }, routePointsLayer.id)]);*/
            
            map.addLayer(routePointsLayer);
        } else {
            routePointsLayer = layers[0];
        }

        return routePointsLayer;
    },

    toLonLat: function(x, y) {
        var map = this.target.mapPanel.map;
        var lonLat = new OpenLayers.LonLat(x, y);
        return lonLat.transform(map.projection, new OpenLayers.Projection("EPSG:4326"));
    },

    toRoutePointParam: function(name, lon, lat) {
        return name + ":" + lon + "," +  lat;
    },

    toBBoxParam: function(startx, starty, endx, endy) {
        var minX = Math.min(startx, endx);
        var maxX = Math.max(startx, endx);
        var minY = Math.min(starty, endy);
        var maxY = Math.max(starty, endy);
        
        var bbox = [minX, minY, maxX, maxY].join(",");
        return bbox;
    }
});
Ext.preg(gxp.plugins.Routing.prototype.ptype, gxp.plugins.Routing);
