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
	
	iconCls: "gxp-icon-select-area-geobasi",

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


		this.searchWFSComboAlluvioni = new gxp.form.WFSSearchComboBox({
					url: "http://159.213.57.108/geoserver_geobasi/ows?",
					versionWFS: '1.1.0',
					typeName: "geobasi:cis_alluvioni",
					mapPanel: this.mapPanel,
					hidden: false,
					zoomTo: true,
					queryParam: 'cql_filter',
					pageSize: 10,
					highlightLayer: "Highlight Alluvioni",
					highlightLayerStyle: {
						strokeColor: "#FF00FF",
						strokeWidth: 2,
						fillColor: "#FF00FF",
						fillOpacity: 0.8
					},					
					recordModel:[
						{name: 'id', mapping: 'id'},
						{name: 'geometry', mapping: 'geometry'},
						{name: 'codice', mapping: 'properties.codice'},
						{name: 'acquifero', mapping: 'properties.acquifero'}
					],
					queriableAttributes:['acquifero'],
					sortBy: 'acquifero',
					displayField: 'acquifero',
					tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{acquifero}</span></h3>(Acquifero Alluvioni)</div></tpl>"
		});
		
		this.searchWFSComboRoccia = new gxp.form.WFSSearchComboBox({
					url: "http://159.213.57.108/geoserver_geobasi/ows?",
					versionWFS: '1.1.0',
					typeName: "geobasi:cis_roccia",
					mapPanel: this.mapPanel,
					hidden: true,
					zoomTo: true,
					queryParam: 'cql_filter',
					pageSize: 10,
					highlightLayer: "Highlight Roccia",
					highlightLayerStyle: {
						strokeColor: "#FF00FF",
						strokeWidth: 2,
						fillColor: "#FF0000",
						fillOpacity: 0.8
					},	
					recordModel:[
						{name: 'id', mapping: 'id'},
						{name: 'geometry', mapping: 'geometry'},
						{name: 'codice', mapping: 'properties.codice'},
						{name: 'acquifero', mapping: 'properties.acquifero'}
					],
					queriableAttributes:['acquifero'],
					sortBy: 'acquifero',
					displayField: 'acquifero',
					tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{acquifero}</span></h3>(Acquifero Roccia)</div></tpl>"
		});

		this.searchWFSComboComuniRT = new gxp.form.WFSSearchComboBox({
					url: "http://www502.regione.toscana.it:80/wfsvector/com.rt.wfs.RTmap/wfs",
					versionWFS: '1.1.0',
					typeName: "sita:listacomunirtpoly",
					mapPanel: this.mapPanel,
					hidden: true,
					zoomTo: true,
					queryParam: 'Filter',
					highlightLayer: "Highlight Comuni",
					highlightLayerStyle: {
						strokeColor: "#FF00FF",
						strokeWidth: 2,
						fillColor: "#0000FF",
						fillOpacity: 0.8
					},	
					recordModel:[
						{name: 'id', mapping: 'gid'},
						{name: 'geometry', mapping: 'geometry'},
						{name: 'codcom', mapping: 'properties.codcom'},
						{name: 'ncom', mapping: 'properties.ncom'}
					],
					queriableAttributes:['ncom'],
					sortBy: 'ncom',
					displayField: 'ncom',
					tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{ncom}</span></h3>(Comune)</div></tpl>"
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
                    }, {
                        name: 'AcquiferoAll',
                        label: 'Acquifero Alluvioni',
                        value: 'acquiferoall'
                    }, {
                        name: 'AcquiferoRocc',
                        label: 'Acquifero Roccia',
                        value: 'acquiferorocc'
                    }, {
                        name: 'ComuniRT',
                        label: 'Comuni RT',
                        value: 'comunirt'
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
							this.searchWFSComboAlluvioni.disable();
							this.searchWFSComboAlluvioni.hide();
							this.searchWFSComboAlluvioni.clearValue();
							this.searchWFSComboAlluvioni.geometry = null;
							this.searchWFSComboAlluvioni.newLayer = null;

							var searchWFSComboAlluvioniLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboAlluvioni.highlightLayer)[0];
							
							if (searchWFSComboAlluvioniLayer)
								this.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);
							
							this.searchWFSComboRoccia.disable();
							this.searchWFSComboRoccia.hide();
							this.searchWFSComboRoccia.clearValue();
							this.searchWFSComboRoccia.geometry = null;
							this.searchWFSComboRoccia.newLayer = null;

							var searchWFSComboRocciaLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboRoccia.highlightLayer)[0];
							
							if (searchWFSComboRocciaLayer)
								this.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);
							
							this.searchWFSComboComuniRT.disable();
							this.searchWFSComboComuniRT.hide();
							this.searchWFSComboComuniRT.clearValue();									
							this.searchWFSComboComuniRT.geometry = null;	
							this.searchWFSComboComuniRT.newLayer = null;
							
							var searchWFSComboComuniRTLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboComuniRT.highlightLayer)[0];
							
							if (searchWFSComboComuniRTLayer)							
								this.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);
							
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
                                    me.filterCircle = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: "geom",
											value: event.feature.geometry
										});
                                },
                                "beforefeatureadded": function (event) {
                                    me.drawings.destroyFeatures();
                                }
                            });

                        } else if (outputValue == 'polygon') {
							this.searchWFSComboAlluvioni.disable();
							this.searchWFSComboAlluvioni.hide();
							this.searchWFSComboAlluvioni.clearValue();
							this.searchWFSComboAlluvioni.geometry = null;
							this.searchWFSComboAlluvioni.newLayer = null;

							var searchWFSComboAlluvioniLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboAlluvioni.highlightLayer)[0];
							
							if (searchWFSComboAlluvioniLayer)
								this.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);
							
							this.searchWFSComboRoccia.disable();
							this.searchWFSComboRoccia.hide();
							this.searchWFSComboRoccia.clearValue();		
							this.searchWFSComboRoccia.geometry = null;							
							this.searchWFSComboRoccia.newLayer = null;
							
							var searchWFSComboRocciaLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboRoccia.highlightLayer)[0];
							
							if (searchWFSComboRocciaLayer)
								this.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);
							
							this.searchWFSComboComuniRT.disable();
							this.searchWFSComboComuniRT.hide();
							this.searchWFSComboComuniRT.clearValue();		
							this.searchWFSComboComuniRT.geometry = null;								
							this.searchWFSComboComuniRT.newLayer = null;
							
							var searchWFSComboComuniRTLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboComuniRT.highlightLayer)[0];
							
							if (searchWFSComboComuniRTLayer)							
								this.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);
							
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
                                    me.filterPolygon = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: "geom",
											value: event.feature.geometry
										});
                                },
                                "beforefeatureadded": function (event) {
                                    me.drawings.destroyFeatures();
                                }
                            });

                        } else if (outputValue == 'buffer') {
							this.searchWFSComboAlluvioni.disable();
							this.searchWFSComboAlluvioni.hide();
							this.searchWFSComboAlluvioni.clearValue();
							this.searchWFSComboAlluvioni.geometry = null;								
							this.searchWFSComboAlluvioni.newLayer = null;
							
							var searchWFSComboAlluvioniLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboAlluvioni.highlightLayer)[0];
							
							if (searchWFSComboAlluvioniLayer)
								this.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);
							
							this.searchWFSComboRoccia.disable();
							this.searchWFSComboRoccia.hide();
							this.searchWFSComboRoccia.clearValue();		
							this.searchWFSComboRoccia.geometry = null;								
							this.searchWFSComboRoccia.newLayer = null;
							
							var searchWFSComboRocciaLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboRoccia.highlightLayer)[0];
							
							if (searchWFSComboRocciaLayer)
								this.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);
							
							this.searchWFSComboComuniRT.disable();
							this.searchWFSComboComuniRT.hide();
							this.searchWFSComboComuniRT.clearValue();	
							this.searchWFSComboComuniRT.geometry = null;		
							this.searchWFSComboComuniRT.newLayer = null;

							var searchWFSComboComuniRTLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboComuniRT.highlightLayer)[0];
							
							if (searchWFSComboComuniRTLayer)							
								this.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);
							
                            this.bufferFieldSet.enable();
                            this.bufferFieldset.doLayout(true,false);						
						} else if (outputValue == 'acquiferoall'){
							
							this.searchWFSComboRoccia.disable();
							this.searchWFSComboRoccia.hide();
							this.searchWFSComboRoccia.clearValue();		
							this.searchWFSComboRoccia.geometry = null;
							this.searchWFSComboRoccia.newLayer = null;							

							var searchWFSComboRocciaLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboRoccia.highlightLayer)[0];
							
							if (searchWFSComboRocciaLayer)
								this.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);
							
							this.searchWFSComboComuniRT.disable();
							this.searchWFSComboComuniRT.hide();
							this.searchWFSComboComuniRT.clearValue();
							this.searchWFSComboComuniRT.geometry = null;
							this.searchWFSComboComuniRT.newLayer = null;							

							var searchWFSComboComuniRTLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboComuniRT.highlightLayer)[0];
							
							if (searchWFSComboComuniRTLayer)							
								this.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);						
							
							this.bufferFieldset.disable();
                            this.searchWFSComboAlluvioni.enable();
							this.searchWFSComboAlluvioni.show();
                            //this.searchWFSComboAlluvioni.doLayout(true,false);
							
                        }else if (outputValue == 'acquiferorocc'){
							this.searchWFSComboAlluvioni.disable();
							this.searchWFSComboAlluvioni.hide();
							this.searchWFSComboAlluvioni.clearValue();
							this.searchWFSComboAlluvioni.geometry = null;
							this.searchWFSComboAlluvioni.newLayer = null;							

							var searchWFSComboAlluvioniLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboAlluvioni.highlightLayer)[0];
							
							if (searchWFSComboAlluvioniLayer)
								this.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);
							
							this.searchWFSComboComuniRT.disable();
							this.searchWFSComboComuniRT.hide();
							this.searchWFSComboComuniRT.clearValue();
							this.searchWFSComboComuniRT.geometry = null;								
							this.searchWFSComboComuniRT.newLayer = null;	
							
							var searchWFSComboComuniRTLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboComuniRT.highlightLayer)[0];
							
							if (searchWFSComboComuniRTLayer)							
								this.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);						
							
							this.bufferFieldset.disable();
                            this.searchWFSComboRoccia.enable();
							this.searchWFSComboRoccia.show();
                            //this.searchWFSComboAlluvioni.doLayout(true,false);
							
                        }else{
							this.searchWFSComboAlluvioni.disable();
							this.searchWFSComboAlluvioni.hide();
							this.searchWFSComboAlluvioni.clearValue();
							this.searchWFSComboAlluvioni.geometry = null;	
							this.searchWFSComboAlluvioni.newLayer = null;

							var searchWFSComboAlluvioniLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboAlluvioni.highlightLayer)[0];
							
							if (searchWFSComboAlluvioniLayer)
								this.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);
							
							this.searchWFSComboRoccia.disable();
							this.searchWFSComboRoccia.hide();
							this.searchWFSComboRoccia.clearValue();	
							this.searchWFSComboRoccia.geometry = null;		
							this.searchWFSComboRoccia.newLayer = null;

							var searchWFSComboRocciaLayer = this.mapPanel.map.getLayersByName(this.searchWFSComboRoccia.highlightLayer)[0];
							
							if (searchWFSComboRocciaLayer)
								this.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);
						
							this.bufferFieldset.disable();
                            this.searchWFSComboComuniRT.enable();
							this.searchWFSComboComuniRT.show();
                            //this.searchWFSComboAlluvioni.doLayout(true,false);							
						
						}
                    },
                    scope: this
                }
            },
            this.bufferFieldSet,
			this.searchWFSComboAlluvioni,
			this.searchWFSComboRoccia,
			this.searchWFSComboComuniRT,
			{
				xtype: 'checkbox',
				anchor:'100%',
				fieldLabel:'Interseca con Bacini',
				ref: 'baciniintersect',
				name: 'baciniintersect',
				checked : false
			},
			new Ext.Button({
				id:'clearButton_id',
				text: 'Rimuovi filtro',
				iconCls: "cancel",
				handler: function(){
					this.clearDrawFeature();
				},
				scope:this
			})
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
        //if(me.searchWFSComboAlluvioni.hidden === false){
            me.searchWFSComboAlluvioni.hide();
			me.searchWFSComboAlluvioni.geometry = null;
			me.searchWFSComboAlluvioni.clearValue();
			me.searchWFSComboAlluvioni.newLayer = null;
        //}	
		//if(me.searchWFSComboRoccia.hidden === false){
            me.searchWFSComboRoccia.hide();
			me.searchWFSComboRoccia.geometry = null;
			me.searchWFSComboRoccia.clearValue();
			me.searchWFSComboRoccia.newLayer = null;
			
            me.searchWFSComboComuniRT.hide();
			me.searchWFSComboComuniRT.geometry = null;
			me.searchWFSComboComuniRT.clearValue();	
			me.searchWFSComboComuniRT.newLayer = null;			

			var searchWFSComboAlluvioniLayer = me.mapPanel.map.getLayersByName(me.searchWFSComboAlluvioni.highlightLayer)[0];
			if(searchWFSComboAlluvioniLayer)
				me.mapPanel.map.removeLayer(searchWFSComboAlluvioniLayer);

			var searchWFSComboRocciaLayer = me.mapPanel.map.getLayersByName(me.searchWFSComboRoccia.highlightLayer)[0];
			if(searchWFSComboRocciaLayer)			
				me.mapPanel.map.removeLayer(searchWFSComboRocciaLayer);

			var searchWFSComboComuniRTLayer = me.mapPanel.map.getLayersByName(me.searchWFSComboComuniRT.highlightLayer)[0];
			if(searchWFSComboComuniRTLayer)			
				me.mapPanel.map.removeLayer(searchWFSComboComuniRTLayer);			
        //}	
			me.items.items[0].setValue('Scegli tipologia selezione area');
    }


});

Ext.reg("gxp_seldamagearea", gxp.form.SelDamageArea);