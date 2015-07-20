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

    featureManager: "routing_featuremanager",

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

    socRiskText: "Sociale",

    envRiskText: "Ambientale",

    lonText: "Lon",

    latText: "Lat",

    routingText: "Routing",

    blockRoadsText: "Exclude Roads",

    zoomToRoadsText: "Zoom to selection",

    addRoadsText: "Add roads to exclude",

    removeRoadsText: "Remove selected",

    resetRoadsText: "Remove all",

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
        var humanRiskLabel = gxp.plugins.StandardProcessing.prototype.humanRiskLabel;
        var notHumanRiskLabel = gxp.plugins.StandardProcessing.prototype.notHumanRiskLabel;
        var actions = gxp.plugins.Routing.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function () {
                if (this.routingPanel) {
                    rp = this.routingPanel;
                } else {
                    var map = this.target.mapPanel.map;
                    var routePoints = this.getOrCreateRoutePointsLayer();
                    var me = this;
                    var formulaStore = app.tools["syntheticview"].processingPane.formulaStore;
                    var formulaItems = (formulaStore.snapshot) ? formulaStore.snapshot : formulaStore.data;
                    var findFormula = function(idFormula) {
                        return function(item) {
                            if (item.get('id_formula') == idFormula) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                    var formulaELabel =  formulaItems.find(findFormula(32)).get('name');
                    var formulaPisLabel =  formulaItems.find(findFormula(22)).get('name');
                    var featureManager = app.tools[this.featureManager];
                    var excludedRoadsLayer = featureManager.featureLayer;
                    var excludedRoadsStore = featureManager.featureStore;

                    var getFeature = new OpenLayers.Control.GetFeature({
                        protocol: excludedRoadsStore.proxy.protocol,
                        box: true,
                        hover: false
                    });
                    map.addControl(getFeature);
                    getFeature.events.register("featuresselected", this, function(event) {
                        var features = event.features;
                        if (features) {
                            var uniqueFeatures = [];
                            Ext.each(features, function(f) {
                                if (excludedRoadsStore.find('id_geo_arco', f.attributes['id_geo_arco']) < 0) {
                                    uniqueFeatures.push(f);
                                }
                            });
                            excludedRoadsStore.loadData(uniqueFeatures, true);
                        }
                        win.expand();
                        Ext.getCmp('add-roads').toggle();
                    });
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
                    
                    var formulaData = [
                        ['141-SOC', 'R - ' + humanRiskLabel, 98],
                        ['141-ENV', 'R - ' + notHumanRiskLabel, 99],
                        ['32-SOC', formulaELabel + ' (' + humanRiskLabel + ')', 98],
                        ['32-ENV', formulaELabel + ' (' + notHumanRiskLabel + ')', 99],
                        ['22', formulaPisLabel, 98],
                        ['142', this.lengthFormula, null]
                    ];
                    var comboStore = new Ext.data.ArrayStore({
                        // store configs
                        autoDestroy: true,
                        storeId: 'routingFormulaStore',
                        // reader configs
                        idIndex: 0,
                        fields: [
                           {name: 'id_formula', type: 'string'},
                           {name: 'name', type: 'string'},
                           {name: 'target', type: 'int'}
                        ],
                        data: formulaData
                    });
                    
                    var formPanel = new Ext.FormPanel({
                        id: 'route-formpanel',
                        labelAlign: 'top',
                        frame:true,
                        bodyStyle:'padding:5px 5px 0',
                        layout:'column',
                        items: [{
                            xtype: 'panel',
                            columnWidth:.65,
                            bodyStyle:'padding:0 5px',
                            items: [{
                                xtype: 'fieldset',
                                title: this.formulaText,
                                layout: 'form',
                                items: [{
                                    id: 'formula-combo',
                                    xtype: 'combo',
                                    hideLabel: true,
                                    forceSelection: true,
                                    allowBlank: false,
                                    blankText: this.selectOneMsg,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    store: comboStore,
                                    anchor: '100%',
                                    valueField: 'id_formula',
                                    displayField: 'name',
                                    listeners: {
                                        render: function(cmb) {
                                            var r = comboStore.getAt(0);
                                            cmb.setValue(r.get('id_formula'));
                                            cmb.selectedRecord = r;
                                        },
                                        select: function(cmb, record) {
                                            cmb.selectedRecord = record;
                                        }
                                    }
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
                                        id: 'pick-start-point',
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
                                        id: 'pick-end-point',
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
                                        anchor:'100%'
                                    }]
                                }]
                            }]
                        }, {
                            xtype: 'panel',
                            columnWidth:.35,
                            bodyStyle:'padding:0 5px',
                            items: [
                                {
                                    id: 'excluded-roads-panel',
                                    xtype: 'fieldset',
                                    title: this.blockRoadsText,
                                    height: 330,
                                    layout: 'anchor',
                                    items: [{
                                        id: "routing_featuregrid",
                                        xtype: "gxp_featuregrid",
                                        layer: excludedRoadsLayer,
                                        store: excludedRoadsStore,
                                        anchor: "100% 100%",
                                        tbar: [{
                                            id: "add-roads",
                                            xtype: "button",
                                            iconCls: 'icon-add-roads',
                                            tooltip: this.addRoadsText,
                                            enableToggle: true,
                                            toggleHandler: function(btn, pressed) {
                                                if (pressed) {
                                                    if (getFeature.activate()) {
                                                        win.collapse();
                                                    }
                                                } else {
                                                    getFeature.deactivate();
                                                }
                                            }
                                        }, {
                                            xtype: "button",
                                            iconCls: 'icon-remove-roads',
                                            tooltip: this.removeRoadsText,
                                            handler: function(btn) {
                                                var fg = btn.ownerCt.ownerCt;
                                                var sm = fg.getSelectionModel();
                                                var selected = sm.hasSelection() && sm.getSelections();
                                                if (selected) {
                                                    Ext.each(selected, function(r) {
                                                       fg.store.remove(r);
                                                    });
                                                }
                                            }
                                        }, {
                                            xtype: "button",
                                            iconCls: 'icon-reset-roads',
                                            tooltip: this.resetRoadsText,
                                            handler: function(btn) {
                                                var fg = btn.ownerCt.ownerCt;
                                                fg.store.removeAll();
                                            }
                                        }, {
                                            xtype: "button",
                                            iconCls: 'icon-zoom-roads',
                                            tooltip: this.zoomToRoadsText,
                                            handler: function(btn) {
                                                var fg = btn.ownerCt.ownerCt;
                                                var sm = fg.getSelectionModel();
                                                var records = (sm.hasSelection()) ? sm.getSelections() : fg.store.getRange();
                                                var bounds = null;
                                                Ext.each(records, function(r) {
                                                   var geom = r.getFeature().geometry;
                                                   if (bounds) {
                                                       bounds.extend(geom.getBounds());
                                                   } else {
                                                       bounds = geom.getBounds();
                                                   }
                                                });
                                                if (bounds) {
                                                    map.moveTo(bounds.getCenterLonLat(), map.getZoomForExtent(bounds));
                                                }
                                            }
                                        }]
                                    }]
                                }
                            ]
                        }],
                        getFormula: function() {
                            return this.getForm().findField('formula-combo').selectedRecord;
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
                        width: 600,
                        height: 420,
                        layout: 'fit',
                        renderTo: app.mapPanel.body,
                        modal: false,
                        autoScroll: true,
                        constrainHeader: true,
                        closable: true,
                        resizable: false,
                        draggable: true,
                        closeAction: 'hide',
                        items: [formPanel],
                        listeners: {
                            hide: function (w) {
                                var toggleBtn = function(btn) {
                                    if (btn && btn.pressed) {
                                        btn.toggle();
                                    }
                                }
                                var pickStartBtn = Ext.getCmp('pick-start-point');
                                toggleBtn(pickStartBtn);
                                var pickEndBtn = Ext.getCmp('pick-end-point');
                                toggleBtn(pickEndBtn);
                                var addRoadsBtn = Ext.getCmp('add-roads');
                                toggleBtn(addRoadsBtn);
                                
                                featureManager.hideLayer();
                                routingBtn.enable();
                                routePoints.clearMarkers();
                            },
                            show: function(w) {
                                /*var startXField = formPanel.getStartX();
                                var startYField = formPanel.getStartY();
                                if (startXField.isValid(true) && startYField.isValid(true)) {
                                    var xy = me.toXY(startXField.getValue(), startYField.getValue());
                                    createMarker("start", xy);
                                }
                                var endXField = formPanel.getEndX();
                                var endYField = formPanel.getEndY();
                                if (endXField.isValid(true) && endYField.isValid(true)) {
                                    var xy = me.toXY(endXField.getValue(), endYField.getValue());
                                    createMarker("end", xy);
                                }*/
                                
                                featureManager.showLayer();
                                routingBtn.disable();
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
                                    var formula = formPanel.getFormula().get('id_formula');
                                    formula = formula && formula.split('-')[0];
                                    var target = formPanel.getFormula().get('target');
                                    var startX = formPanel.getStartX().getValue();
                                    var startY = formPanel.getStartY().getValue();
                                    var endX = formPanel.getEndX().getValue();
                                    var endY = formPanel.getEndY().getValue();
                                    var startProj = me.toXY(startX, startY);
                                    var endProj = me.toXY(endX, endY);
                                    var descr = formPanel.getDescription().getValue();
                                    if (!descr) {
                                        descr = me.getDefaultDescription();
                                    }
                                    
                                    var start = this.toRoutePointParam("start", startX, startY);
                                    var end = this.toRoutePointParam("end", endX, endY);
                                    var bbox = me.toBBoxParam(startProj.lon, startProj.lat,
                                            endProj.lon, endProj.lat);
                                    
                                    var blocked = [];
                                    var records = excludedRoadsStore.getRange();
                                    Ext.each(records, function(r) {
                                        blocked.push(r.get('id_geo_arco'));
                                    });
                                    
                                    var syntView = app.tools["syntheticview"];
                                    syntView.addRoutingLayer(descr, formula, start, end, target, bbox, blocked);
                                    
                                    // clear markers
                                    routePoints.clearMarkers();
                                    for (var pos in routePoints.points) {
                                        routePoints.points[pos].destroy();
                                        delete routePoints.points[pos];
                                    }
                                    
                                    win.hide();
                                }
                            }
                        }]
                    });
                    this.routingPanel = win;
                }
                var rp = this.routingPanel;
                rp.show();
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
            return this.routingText + ": " + formulaField.get('name');
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

    toXY: function(lon, lat) {
        var map = this.target.mapPanel.map;
        var lonLat = new OpenLayers.LonLat(lon, lat);
        return lonLat.transform(new OpenLayers.Projection("EPSG:4326"), map.projection);
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
