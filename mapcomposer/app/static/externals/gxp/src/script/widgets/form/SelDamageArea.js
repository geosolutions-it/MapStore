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

    /** api: config[comboScenarioSelection]
     * ``String``
     * Text for Label comboScenarioSelection (i18n).
     */  
    comboScenarioSelection: "Scegli Sostanza/Scenario", 

    processingPane: null,   

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
                    }, {
                        name: 'Scenario',
                        label: this.comboScenarioSelection,
                        value: 'scenario'
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
                        this.enableDrawing(outputValue);
                        
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
    
    getRadius: function() {
        return this.processingPane.getRadius();
    },

    enableDrawing: function(type, geometry) {
        if(type === 'circle' || type === 'polygon') {
            this.bufferFieldSet.disable();

            this.drawings = new OpenLayers.Layer.Vector({}, {
                displayInLayerSwitcher: false
            });

            app.mapPanel.map.addLayer(this.drawings);
            
			if(this.featureSummary){
				this.featureSummary.destroy();
			}
				
			if(type === 'circle'){				
				this.featureSummary = new Ext.ToolTip({
					xtype: 'tooltip',
					target: Ext.getBody(),
					html: "",
					title: "Radius",
					autoHide: false,
					closable: false,
					draggable: false,
					mouseOffset: [0, 0],
					showDelay: 1
				});	
			}
			
			var me = this;
			this.draw = new OpenLayers.Control.DrawFeature(
				this.drawings,
				type === 'circle' ? 
					OpenLayers.Handler.RegularPolygon : OpenLayers.Handler.Polygon,
				type === 'circle' ? 
					{
						persist: true,
						geodesic: true,
						handlerOptions: {
							sides: 100
						},
						callbacks: { 
							move: function(evt) {
								//console.log(evt);
								me.drawings.destroyFeatures();
								
								var center = evt.getCentroid();
								
								var vertex = evt.getVertices();
								var lastPoint = vertex[vertex.length - 1];
		
								var px = me.map.getPixelFromLonLat(new OpenLayers.LonLat(lastPoint.x, lastPoint.y));			
								var p0 = me.mapPanel.getPosition();
								
								me.featureSummary.targetXY = [p0[0] + px.x, p0[1] + px.y];
		
								var point1 = new OpenLayers.Geometry.Point(center.x, center.y);
								var point2 = new OpenLayers.Geometry.Point(lastPoint.x, lastPoint.y);       
								var distance = point1.distanceTo(point2);
								
								if(me.featureSummary.isVisible()){
									me.featureSummary.update((Math.round(distance * 100) / 100) + " m");
									me.featureSummary.show();
								}else{
									me.featureSummary.show();
								}						
							}
						}
					} : undefined
			);
            
			app.mapPanel.map.addControl(this.draw);
			this.draw.activate();

			if(geometry) {
				var feature = new OpenLayers.Feature.Vector(geometry,{
					"id": 1
				});

				this.drawings.addFeatures([feature]);
			}
			
			this.drawings.events.on({
				"beforefeatureadded": function (event) {
					this.drawings.destroyFeatures();
				},
				scope: this
			});            
        } else {
            this.bufferFieldSet.enable();
            this.bufferFieldSet.bufferField.setValue('');
            var mode = type === 'buffer' ? 'user' : 'scenario';
            this.bufferFieldSet.setRadiusMode(mode, this.getRadius());
            this.bufferFieldSet.doLayout(true,false);
        }
        
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
    
    setDamageArea: function(geometry, type) {
        type = type || 'polygon';
        if(type === 'buffer' || type === 'scenario') {
            type = 'circle';
        }
        Ext.getCmp('selectionMethod_id').setValue(type);
        this.enableDrawing(type, geometry);
    },
    
    getDamageAreaType: function() {
        return Ext.getCmp('selectionMethod_id').getValue();
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