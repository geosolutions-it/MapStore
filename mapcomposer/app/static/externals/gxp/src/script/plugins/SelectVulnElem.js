/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
/**
 * @requires plugins/Tool.js
 */
/** api: (define)
 *  module = gxp.plugins
 *  class = SelectVulnElem
 */
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SelectVulnElem(config)
 *
 *    Provides an action for select Vulnerable Elements
 */
gxp.plugins.SelectVulnElem = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_zoomtoextent */
    ptype: "gxp_selectvulnelem",

    /** api: config[buttonText]
     *  ``String`` Text to show next to the zoom button
     */

    /** api: config[menuText]
     *  ``String``
     *  Text for action and win title item (i18n).
     */
    menuText: "Visualizzazione Elementi Vulnerabili",

    /** api: config[tooltip]
     *  ``String``
     *  Text for action tooltip (i18n).
     */
    tooltip: "Visualizzazione Elementi Vulnerabili",

    /** api: config[allHumanTargetTitle]
     *  ``String``
     *  Text for all humans Title grid (i18n).
     */
    allHumanTargetTitle: "Tutti i Bersagli Umani",

    /** api: config[allNotHumanTargetTitle]
     *  ``String``
     *  Text for all not humans Title grid (i18n).
     */
    allNotHumanTargetTitle: "Tutti i Bersagli Ambientali",

    /** api: config[selectAllTitle]
     *  ``String``
     *  Text for Select All Elements (i18n).
     */
    selectAllTitle: "SELEZIONA TUTTO",
    
    /** api: config[selectAllTitle]
     *  ``String``
     *  Text for Select All Elements (i18n).
     */
    addToMapButtonText: "Aggiungi alla mappa",    

    /** private: property[iconCls]
     */
    iconCls: "icon-selectvulnelem",

    /** private: method[constructor]
     */
    constructor: function (config) {
        this.initialConfig = config;

        Ext.apply(this, config);

        gxp.plugins.SelectVulnElem.superclass.constructor.apply(this, arguments);
    },

    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function (target) {
        gxp.plugins.SelectVulnElem.superclass.init.apply(this, arguments);
        this.target = target;
    },

    /** api: method[addActions]
     */
    addActions: function () {

        var actions = gxp.plugins.SelectVulnElem.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function () {
                var map = this.target.mapPanel.map;
                var processingPane = app.tools["syntheticview"].processingPane;

                var me = this;
                var layers = [null, 'popolazione_residente', 'popolazione_turistica', 'popolazione_turistica',
                    'industria_servizi', 'strutture_sanitarie', 'strutture_scolastiche',
                    'centri_commerciali', 'utenti_coinvolti', 'utenti_territoriali', 'zone_urbanizzate', 'aree_boscate',
                    'aree_protette', 'aree_agricole', 'acque_sotterranee',
                    'acque_superficiali', 'beni_culturali'
                ];


                var humanstargetStore = new GeoExt.data.FeatureStore({
                    id: "humanstargetStore",
                    fields: [{
                        "name": "id_bersaglio",
                        "mapping": "id_bersaglio"
                    }, {
                        "name": "name",
                        "mapping": "descrizione_" + GeoExt.Lang.locale
                    }, {
                        "name": "flg_umano",
                        "mapping": "flg_umano"
                    }, {
                        "name": "description",
                        "mapping": "descrizione_" + GeoExt.Lang.locale
                    }, {
                        "name": "severeness",
                        "mapping": "id_bersaglio"
                    }],
                    proxy: processingPane.getWFSStoreProxy(processingPane.bersFeature, undefined, "id_bersaglio"),
                    autoLoad: false
                });

                humanstargetStore.on('load', function (str, records) {
                    var allIDsArray = [];
                    var code = 0;
                    var humanIDsArray = [];
                    var notHumanIDsArray = [];
                    var allDescsMap = {};
                    var humanDescsMap = {};
                    var notHumanDescsMap = {};
                    Ext.each(records, function (record) {
                        var flg_umano = parseInt(record.get("flg_umano"));
                        var id = parseInt(record.get("id_bersaglio"));
                        allIDsArray.push(id);
                        allDescsMap[id] = record.get("name");
                        record.set("layer", layers[parseInt(id)]);
                        record.set("property", 'calc_formula_tot');
                        record.set("humans", flg_umano == 1 ? true : false);

                        var code = "-1";

                        switch (id) {
                        case 10:
                            code = '0';
                            break;
                        case 11:
                            code = '1';
                            break;
                        case 12:
                            code = '2';
                            break;
                        case 13:
                            code = '3';
                            break;
                        case 14:
                            code = '4';
                            break;
                        case 15:
                            code = '5';
                            break;
                        case 16:
                            code = '6';
                            break;
                        }
                        record.set("code", code);

                        record.set("macro", false);
                        record.set("description", {
                            id: record.get("name")
                        });
                        record.set("severeness", flg_umano ? '1,2,3,4' : '5');

                        record.set("id", [record.get("id_bersaglio")]);
                        if (flg_umano != 1) {
                            notHumanIDsArray.push(id);
                            notHumanDescsMap[id] = record.get("name");
                        } else {
                            humanIDsArray.push(id);
                            humanDescsMap[id] = record.get("name");
                        }
                    });

                    humanstargetStore.filter('humans', true);
                });

                var nothumanstargetStore = new GeoExt.data.FeatureStore({
                    id: "nothumanstargetStore",
                    fields: [{
                        "name": "id_bersaglio",
                        "mapping": "id_bersaglio"
                    }, {
                        "name": "name",
                        "mapping": "descrizione_" + GeoExt.Lang.locale
                    }, {
                        "name": "flg_umano",
                        "mapping": "flg_umano"
                    }, {
                        "name": "description",
                        "mapping": "descrizione_" + GeoExt.Lang.locale
                    }, {
                        "name": "severeness",
                        "mapping": "id_bersaglio"
                    }],
                    proxy: processingPane.getWFSStoreProxy(processingPane.bersFeature, undefined, "id_bersaglio"),
                    autoLoad: false
                });
                nothumanstargetStore.on('load', function (str, records) {
                    var allIDsArray = [];
                    var code = 0;
                    var humanIDsArray = [];
                    var notHumanIDsArray = [];
                    var allDescsMap = {};
                    var humanDescsMap = {};
                    var notHumanDescsMap = {};
                    Ext.each(records, function (record) {
                        var flg_umano = parseInt(record.get("flg_umano"));
                        var id = parseInt(record.get("id_bersaglio"));
                        allIDsArray.push(id);
                        allDescsMap[id] = record.get("name");
                        record.set("layer", layers[parseInt(id)]);
                        record.set("property", 'calc_formula_tot');
                        record.set("humans", flg_umano == 1 ? true : false);

                        var code = "-1";

                        switch (id) {
                        case 10:
                            code = '0';
                            break;
                        case 11:
                            code = '1';
                            break;
                        case 12:
                            code = '2';
                            break;
                        case 13:
                            code = '3';
                            break;
                        case 14:
                            code = '4';
                            break;
                        case 15:
                            code = '5';
                            break;
                        case 16:
                            code = '6';
                            break;
                        }
                        record.set("code", code);

                        record.set("macro", false);
                        record.set("description", {
                            id: record.get("name")
                        });
                        record.set("severeness", flg_umano ? '1,2,3,4' : '5');

                        record.set("id", [record.get("id_bersaglio")]);
                        if (flg_umano != 1) {
                            notHumanIDsArray.push(id);
                            notHumanDescsMap[id] = record.get("name");
                        } else {
                            humanIDsArray.push(id);
                            humanDescsMap[id] = record.get("name");
                        }
                    });

                    nothumanstargetStore.filter('humans', false);
                });

                var checkConf = {
                    listeners: {
                        scope: this,
                        rowdeselect: function (selMod, rowIndex, record) {

                        },
                        rowselect: function (check, rowIndex, record) {

                        }
                    }
                };

                var cbHumansSelectionModel = new Ext.grid.CheckboxSelectionModel(checkConf);

                var cbNotHumansSelectionModel = new Ext.grid.CheckboxSelectionModel(checkConf);

                var xg = Ext.grid;

                var humansGrid = new xg.GridPanel({
                    id: 'id_humansGrid',
                    flex: 1,
                    split: true,
                    store: humanstargetStore,
                    title: me.allHumanTargetTitle,
                    cm: new xg.ColumnModel({
                        columns: [cbHumansSelectionModel, {
                            header: me.selectAllTitle,
                            width: 120,
                            sortable: true,
                            dataIndex: 'name'
                        }]
                    }),
                    sm: cbHumansSelectionModel,
                    viewConfig: {
                        forceFit: true
                    },
                    listeners: {
                        afterrender: function (grid) {
                            grid.getStore().load();
                        }
                    }
                });

                var notHumansGrid = new xg.GridPanel({
                    id: 'id_notHumansGrid',
                    flex: 1,
                    split: true,
                    store: nothumanstargetStore,
                    title: me.allNotHumanTargetTitle,
                    cm: new xg.ColumnModel({
                        columns: [cbNotHumansSelectionModel, {
                            header: me.selectAllTitle,
                            width: 120,
                            sortable: true,
                            dataIndex: 'name'
                        }]
                    }),
                    sm: cbNotHumansSelectionModel,
                    viewConfig: {
                        forceFit: true
                    },
                    listeners: {
                        afterrender: function (grid) {
                            grid.getStore().load();
                        }
                    }
                });

                var targetGridPanel = new Ext.Panel({
                    id: 'id_targetGridPanel',
                    xtype: 'container',
                    layout: 'vbox',
                    autoScroll: true,
                    items: [humansGrid, notHumansGrid]
                });

                var selectVulnElem = actions[0];

                var viewWin = new Ext.Window({
                    title: me.menuText,
                    width: 400,
                    height: 450,
                    id: 'selectvulnelem-win',
                    layout: 'fit',
                    renderTo: app.mapPanel.body,
                    modal: true,
                    autoScroll: true,
                    constrainHeader: true,
                    closable: true,
                    resizable: false,
                    draggable: true,
                    items: [
                        targetGridPanel
                    ],
                    listeners: {
                        close: function () {
                            targetGridPanel.destroy();
                            selectVulnElem.enable();
                        }
                    },
                    bbar: ["->",{
                        xtype: 'button',
                        id: "selectvulnelem_button",
                        iconCls: 'icon-addlayers',
                        text: me.addToMapButtonText,
                        scope: me,
                        listeners: {
                
                        },
                        handler: function(){
                            var syntView = app.tools["syntheticview"];
                            var newLayers=[];
                            
                            /*var status = this.getStatus();        
                            
                            var bounds = this.getBounds(status, map);
                            
                            if(syntView.originalRiskLayers === null) {
                                syntView.storeOriginalRiskLayers();
                            }
                            
                            this.enableDisableRoads(!status.formulaInfo.dependsOnArcs);
                            
                            syntView.removeRiskLayers(map);
                            
                            // remove analytic view layers (buffers, targets, selected targets)
                            syntView.removeAnalyticViewLayers(map);     
                            syntView.disableSouthPanel();        
                            
                            syntView.processingDone = true;
                            
                            Ext.getCmp('warning_message').setValue('');
                            
                            var scale = this.getMapScale();
                            if(scale <= this.analiticViewScale) {
                                Ext.getCmp("analytic_view").enable();
                            }*/
                            
                            syntView.addVulnLayer(newLayers,"rischio","Vulnerabilita",["Targets","Bersagli","Cibles","Ziele"]);
                            syntView.target.mapPanel.layers.add(newLayers);
                        }
                    }],
                });
                selectVulnElem.disable();
                viewWin.show();

            },
            scope: this
        }]);

        return actions;

    }

});

Ext.preg(gxp.plugins.SelectVulnElem.prototype.ptype, gxp.plugins.SelectVulnElem);