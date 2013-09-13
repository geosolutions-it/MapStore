/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
/**
 * requires
 * include
 */
/** api: (define)
 *  module = gxp.plugins
 *  class = SelDamageArea
 */
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: SelDamageArea(config)
 *
 *    Plugin for select Area of Damage with Circle, Polygon or Buffer
 */
gxp.form.SelDamageArea = Ext.extend(Ext.form.FieldSet, {

    /** api: ptype = gxp_seldamagearea */
    ptype: "gxp_seldamagearea",

    /** api: config[id]
     *  ``String``
     *
     */
    id: "selDamageArea",

    anchor: '100%',
    
    /** api: config[selAreaDamageTitle]
     * ``String``
     * Text for fieldSet title (i18n).
     */    
    selAreaDamageTitle: "Selezione area",
    
    /** api: config[selAreaDamageLabel]
     * ``String``
     * Text for combo label (i18n).
     */    
    selAreaDamageLabel: "Metodo selezione",
    
    /** api: config[selAreaDamageEmptyText]
     * ``String``
     * Text for combo empty text (i18n).
     */    
    selAreaDamageEmptyText: "--- Scegli tipologia ---",
    
    /** api: config[comboPolygonSelection]
     * ``String``
     * Text for Label Polygon (i18n).
     */        
    comboPolygonSelection: 'Poligono',
    
    
    /** api: config[comboCircleSelection]
     * ``String``
     * Text for Label Circle (i18n).
     */        
    comboCircleSelection: 'Cerchio',
    
	/** api: config[comboBufferSelection]
     * ``String``
     * Text for Label comboBufferSelection (i18n).
     */  
	comboBufferSelection: "Buffer",    

    initComponent: function () {

        var me = this;

        this.bufferFieldSet = new gxp.widgets.form.BufferFieldset({
            anchor: '100%',
            ref: "bufferFieldset",
            collapsed: false,
            hidden: true,
            map: app.mapPanel.map,
            toggleGroup: app.toggleGroup,
            minValue: this.initialConfig.bufferOptions.minValue,
            maxValue: this.initialConfig.bufferOptions.maxValue,
            decimalPrecision: this.initialConfig.bufferOptions.decimalPrecision,
            outputSRS: this.initialConfig.outputSRS,
            //selectStyle: this.initialConfig.selectStyle,
            listeners: {
                disable: function () {
                    this.hide();
                },
                enable: function () {
                    this.show();
                }
            }
        });

        this.filterCircle;
        this.filterPolygon;
        this.drawings;
        this.draw;
        
        this.autoHeight = true;

        this.title= this.selAreaDamageTitle;
        
        this.items = [];
        
        this.items = [{
                xtype: 'combo',
                width: 150,
                id: 'selectionMethod_id',
                ref: '../outputType',
                fieldLabel: this.selAreaDamageLabel,
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: false,
                mode: 'local',
                name: 'selection_method',
                forceSelected: true,
                allowBlank: true,
                autoLoad: true,
                displayField: 'label',
                valueField: 'value',
                emptyText: this.selAreaDamageEmptyText,
                valueNotFoundText: this.selAreaDamageEmptyText,
                editable: false,
                readOnly: false,
                store: new Ext.data.JsonStore({
                    fields: [{
                        name: 'name',
                        dataIndex: 'name'
                    }, {
                        name: 'label',
                        dataIndex: 'label'
                    }, {
                        name: 'value',
                        dataIndex: 'value'
                    }],
                    data: [{
                        name: 'Polygon',
                        label: this.comboPolygonSelection,
                        value: 'polygon'
                    }, {
                        name: 'Circle',
                        label: this.comboCircleSelection,
                        value: 'circle'
                    }, {
                        name: 'Buffer',
                        label: this.comboBufferSelection,
                        value: 'buffer'
                    }]
                }),
                listeners: {
                    select: function (c, record, index) {

                        this.bufferFieldSet.resetPointSelection();
                        this.bufferFieldSet.coordinatePicker.toggleButton(false);

                        var disabledItems = [];
                        app.toolbar.items.each(function (item) {
                            if (!item.disabled) {
                                disabledItems.push(item);
                            }
                        });

                        for (var i = 0; i < disabledItems.length; i++) {
                            if (disabledItems[i].toggleGroup) {
                                if (disabledItems[i].scope && disabledItems[i].scope.actions) {
                                    for (var a = 0; a < disabledItems[i].scope.actions.length; a++) {
                                        disabledItems[i].scope.actions[a].toggle(false);

                                        if (disabledItems[i].scope.actions[a].menu) {
                                            for (var b = 0; b < disabledItems[i].scope.actions[a].menu.items.items.length; b++) {
                                                disabledItems[i].scope.actions[a].menu.items.items[b].disable();
                                            }
                                        }

                                        disabledItems[i].scope.actions[a].on({
                                            "click": function (evt) {
                                                this.clearDrawFeature();
                                            },
                                            "menushow": function (evt) {
                                                var menuItems = evt.menu.items.items;
                                                for (var i = 0;i<menuItems.length;i++){
                                                        menuItems[i].enable();
                                                    }
                                                this.clearDrawFeature();
                                            },
                                            scope: this
                                        });
                                    }
                                }
                            }
                        }

                        var outputValue = c.getValue();
                        if (me.draw) {
                            me.draw.deactivate()
                        };
                        if (me.drawings) {
                            me.drawings.destroyFeatures()
                        };
                        if (me.filterCircle) {
                            me.filterCircle = new OpenLayers.Filter.Spatial({})
                        };
                        if (me.filterPolygon) {
                            me.filterPolygon = new OpenLayers.Filter.Spatial({})
                        };

                        if (outputValue == 'circle') {

                            this.bufferFieldset.disable();

                            me.drawings = new OpenLayers.Layer.Vector({}, {
                                displayInLayerSwitcher: false
                            });

                            app.mapPanel.map.addLayer(me.drawings);
                            var polyOptions = {
                                sides: 100
                            };

                            me.draw = new OpenLayers.Control.DrawFeature(
                                me.drawings,
                                OpenLayers.Handler.RegularPolygon, {
                                    handlerOptions: polyOptions
                                }
                            );

                            app.mapPanel.map.addControl(me.draw);
                            me.draw.activate();

                            me.drawings.events.on({
                                "featureadded": function (event) {
                                    /*me.filterCircle = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: featureManager.featureStore.geometryName,
											value: event.feature.geometry
										});*/
                                },
                                "beforefeatureadded": function (event) {
                                    me.drawings.destroyFeatures();
                                }
                            });

                        } else if (outputValue == 'polygon') {

                            this.bufferFieldset.disable();

                            me.drawings = new OpenLayers.Layer.Vector({}, {
                                displayInLayerSwitcher: false
                            });
                            app.mapPanel.map.addLayer(me.drawings);

                            me.draw = new OpenLayers.Control.DrawFeature(
                                me.drawings,
                                OpenLayers.Handler.Polygon
                            );

                            app.mapPanel.map.addControl(me.draw);
                            me.draw.activate();

                            me.drawings.events.on({
                                "featureadded": function (event) {
                                    /*me.filterPolygon = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: featureManager.featureStore.geometryName,
											value: event.feature.geometry
										});*/
                                },
                                "beforefeatureadded": function (event) {
                                    me.drawings.destroyFeatures();
                                }
                            });

                        } else {

                            this.bufferFieldSet.enable();
                            this.bufferFieldset.doLayout(true,false);
                        }
                    },
                    scope: this
                }
            },
            this.bufferFieldSet
        ];
        
        this.listeners = {
            'hide': function(){
                this.clearDrawFeature();
            }        
        };
        
        var areaDamage = gxp.form.SelDamageArea.superclass.initComponent.call(this);
        
        return areaDamage;
    },
    
    getDamageArea: function() {
        if(this.drawings && this.drawings.features && this.drawings.features.length > 0) {
            return this.drawings.features[0].geometry;
        }
        if(this.bufferFieldSet.bufferLayer && this.bufferFieldSet.bufferLayer.features && this.bufferFieldSet.bufferLayer.features.length > 0) {
            return this.bufferFieldSet.bufferLayer.features[0].geometry;
        }
        
        return null;
    },
    
    clearDrawFeature: function(){
        var me = this;
        if (me.draw) {
            me.draw.deactivate();
        };
        if (me.drawings) {
            me.drawings.destroyFeatures();
        };
        if (me.filterCircle) {
            me.filterCircle = new OpenLayers.Filter.Spatial({});
        };
        if (me.filterPolygon) {
            me.filterPolygon = new OpenLayers.Filter.Spatial({});
        };
        me.bufferFieldSet.resetPointSelection();
        me.bufferFieldSet.coordinatePicker.toggleButton(false);
        if(me.bufferFieldSet.hidden === false){
            me.bufferFieldSet.hide();
        }
        me.items.items[0].setValue('Scegli tipologia selezione area');
    }


});

Ext.reg("gxp_seldamagearea", gxp.form.SelDamageArea);