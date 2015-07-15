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

    errorTitle: "Errore",

    selectPoint: "Seleziona punto da mappa",

    missingParametersError: "Specificare tipo di formula, partenza e destinazione",

    selectOneMsg: "Selezionare una opzione",

    fieldRequiredMsg: "Il campo è obbligatorio",

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
                    anchor:'95%'
                };
                
                var formPanel = new Ext.FormPanel({
                    labelAlign: 'top',
                    frame:true,
                    bodyStyle:'padding:5px 5px 0',
                    items: [{
                        xtype: 'fieldset',
                        title: 'Formula',
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
                                {boxLabel: 'Formula 26', name: 'formula', inputValue: 26},
                                {boxLabel: 'Formula 32', name: 'formula', inputValue: 32},
                                {boxLabel: 'Formula 141', name: 'formula', inputValue: 141}
                            ]
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: 'Route start',
                        layout:'column',
                        items:[{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: 'X',
                                name: 'x_start',
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: 'Y',
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
                                tooltip: this.selectPoint,
                                text: '',
                                enableToggle: true,
                                toggleGroup: 'pick_point',
                                toggleHandler: function(btn, pressed) {
                                    if (pressed) {
                                        clickHandler.callbacks["click"] = function(event) {
                                            var lonLat = map.getLonLatFromPixel(event.xy);
                                            createMarker("start", lonLat);
                                            
                                            var xField = formPanel.getStartX();
                                            var yField = formPanel.getStartY();
                                            xField.setValue(lonLat.lon);
                                            yField.setValue(lonLat.lat);
                                        }
                                        clickHandler.activate();
                                    } else {
                                        clickHandler.deactivate();
                                    }
                                }
                            }]
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: 'Route end',
                        layout:'column',
                        items:[{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: 'X',
                                name: 'x_end'
                            }, numberFieldDefaults)]
                        },{
                            columnWidth:.45,
                            layout: 'form',
                            items: [Ext.apply({
                                fieldLabel: 'Y',
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
                                tooltip: this.selectPoint,
                                text: '',
                                enableToggle: true,
                                toggleGroup: 'pick_point',
                                toggleHandler: function(btn, pressed) {
                                    if (pressed) {
                                        clickHandler.callbacks["click"] = function(event) {
                                            var lonLat = map.getLonLatFromPixel(event.xy);
                                            createMarker("end", lonLat);
                                            
                                            var xField = formPanel.getEndX();
                                            var yField = formPanel.getEndY();
                                            xField.setValue(lonLat.lon);
                                            yField.setValue(lonLat.lat);
                                        }
                                        clickHandler.activate();
                                    } else {
                                        clickHandler.deactivate();
                                    }
                                }
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
                    }
                });
                
                var routingBtn = actions[0];
                var win = new Ext.Window({
                    title: me.menuText,
                    width: 400,
                    height: 400,
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
                        xtype: 'button',
                        text: 'Calculate',
                        iconCls: 'icon-calculate-route',
                        scope: me,
                        handler: function() {
                            if (!formPanel.getForm().isValid()) {
                                Ext.Msg.show({
                                    title: this.errorTitle,
                                    buttons: Ext.Msg.OK,
                                    msg: this.missingParametersError,
                                    icon: Ext.MessageBox.ERROR,
                                    scope: this
                                });
                            } else {
                                var formula = formPanel.getFormula().getGroupValue();
                                var startX = formPanel.getStartX().getValue();
                                var startY = formPanel.getStartY().getValue();
                                var endX = formPanel.getEndX().getValue();
                                var endY = formPanel.getEndY().getValue();
                                
                                var start = this.toRoutePointParam("start", startX, startY);
                                var end = this.toRoutePointParam("end", endX, endY);
                                var bbox = me.toBBoxParam(startX, startY, endX, endY);
                                
                                var syntView = app.tools["syntheticview"];
                                syntView.addRoutingLayer("Routing (formula " + formula + ")", formula, start, end, bbox);
                                
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

    getOrCreateRoutePointsLayer: function() {
        var routePointsLayer = null;
        var map = this.target.mapPanel.map;
        var layers = map.getLayersByName("Route points");
        if (layers.length === 0) {
            routePointsLayer = new OpenLayers.Layer.Markers("Route points");
            routePointsLayer.points = {};
            map.addLayer(routePointsLayer);
        } else {
            routePointsLayer = layers[0];
        }

        return routePointsLayer;
    },

    toRoutePointParam: function(name, x, y) {
        var map = this.target.mapPanel.map;
        var toLonLat = function(x, y) {
            var lonLat = new OpenLayers.LonLat(x, y);
            return lonLat.transform(map.projection, new OpenLayers.Projection("EPSG:4326"));
        }
        
        var lonLat = toLonLat(x, y);
        return name + ":" + lonLat.lon + "," +  lonLat.lat;
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
