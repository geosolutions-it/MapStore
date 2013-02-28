/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SyntheticView
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SyntheticView(config)
 *
 */   
gxp.plugins.SyntheticView = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_syntheticview */
    ptype: "gxp_syntheticview",

    // Begin i18n.
    title: "Visualizzazione Sintetica",
    elaborazioneLabel: "Tipo elaborazione",
    formulaLabel: "Formula",
    extentLabel: "Ambito territoriale",
    targetLabel: "Tipo bersaglio",
    adrClassLabel: "Classe ADR",
    substanceLabel: "Sostanze",
    accidentLabel: "Incidente",
    seriousnessLabel: "Entità",
	buffersLabel: "Raggi Aree Danno",
    fieldSetTitle: "Elaborazione",
	cancelButton: "Annulla Elaborazione",
	processButton: "Esegui Elaborazione",
	analyticViewButton: "Visualizzazione Analitica",
    // End i18n.
        
    id: "syntheticview",
    
    layerSourceName: "destination",    
    
    selectionLayerName: "geosolutions:aggregated_data_selection",
    selectionLayerTitle: "ElaborazioneStd",         
    //selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
    selectionLayerProjection: "EPSG:32632",
    
    bufferLayerName: "geosolutions:siig_aggregation_1_buffer",    
	
    bufferLayerTitle: "Aree di danno",    
    targetLayerTitle: "Bersagli", 
	formulaLayerTitle: "Rischio Totale",
	
	selectedTargetLayer: "Bersaglio Selezionato",
    
    currentBufferLayers: [],
    
    layerImageFormat: "image/png8",
    
    geometryName: "geometria",
    accidentTipologyName: "tipologia",
    
    analiticViewScale: 17070,
    
    analyticView: false,
    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.SyntheticView.superclass.constructor.apply(this, arguments);            
    },
	
	radiusData : {
		 "1":{
			"E" : {
				"L": { "humans": [15,32,51,75],        "notHumans": [15,8,8,8,null,null]},
				"G": { "humans": [75,90,110,130],      "notHumans": [75,25,25,25,null,null]}
			}
		 },
		 "2":{
			"G" : {
				"L": { "humans": [25,null,81,null],    "notHumans": [null,8,8,8,null,null]},
				"G": { "humans": [45,null,90,null],    "notHumans": [null,25,25,25,null,null]}
			}
		},
		"3":{
			"D" : {
				"L": { "humans": [35,70,null,null],    "notHumans": [null,8,8,null,null,null]},
				"G": { "humans": [65,132,null,null],   "notHumans": [null,25,25,null,null,null]}
			},
			"F" : {
				"L": { "humans": [60,95,110,140],      "notHumans": [60,8,8,null,null,null]},
				"G": { "humans": [180,230,420,500],    "notHumans": [180,25,25,null,null,null]}
			}
		},
		"4":{
			"E" : {
				"L": { "humans": [30,65,null,null],    "notHumans": [null,8,8,null,null,null]},
				"G": { "humans": [60,148,null,null],   "notHumans": [null,25,25,null,null,null]}
			},
			"F" : {
				"L": { "humans": [55,93,100,131],      "notHumans": [55,8,8,null,null,null]},
				"G": { "humans": [112,210,339,467],    "notHumans": [112,25,25,null,null,null]}
			},
			"M" : {
				"L": { "humans": [60,null,110,null],   "notHumans": [null,8,8,8,null,null]},
				"G": { "humans": [110,null,230,null],  "notHumans": [null,25,25,25,null,null]}
			}
		},
		"5":{
			"B" : {
				"L": { "humans": [45,96,null,null],    "notHumans": [null,8,8,null,null,null]},
				"G": { "humans": [110,150,null,null],  "notHumans": [null,25,25,null,null,null]}
			},
			"L" : {
				"L": { "humans": [130,null,567,null],  "notHumans": [null,8,8,8,null,null]},
				"G": { "humans": [250,null,780,null],  "notHumans": [null,25,25,25,null,null]}
			}
		},
		"6":{
			"G" : {
				"L": { "humans": [25,null,81,null],    "notHumans": [null,8,8,8,null,null]},
				"G": { "humans": [45,-1,90,-1],    "notHumans": [null,25,25,25,null,null]}
			}
		},
		"7":{
			"H" : {
				"L": { "humans": [null,null,null,null],"notHumans": [null,null,null,8,8,8]},
				"G": { "humans": [null,null,null,null],"notHumans": [null,null,null,25,25,25]}
			}
		},
		"8":{
			"C" : {
				"L": { "humans": [35,45,52,60],        "notHumans": [35,8,8,8,null,null]},
				"G": { "humans": [80,110,130,145],     "notHumans": [80,25,25,25,null,null]}
			},
			"D" : {
				"L": { "humans": [45,90,null,null],    "notHumans": [null,8,8,null,null,null]},
				"G": { "humans": [127,250,null,null],  "notHumans": [null,25,25,null,null,null]}
			},
			"H" : {
				"L": { "humans": [null,null,null,null],"notHumans": [null,null,null,8,8,8]},
				"G": { "humans": [null,null,null,null],"notHumans": [null,null,null,25,25,25]}
			}
		},
		"9":{
			"A" : {
				"L": { "humans": [30,42,48,58],        "notHumans": [30,8,8,null,null,null]},
				"G": { "humans": [75,109,125,138],     "notHumans": [75,25,25,null,null,null]}
			},
			"B" : {
				"L": { "humans": [40,88,null,null],    "notHumans": [8,8,null,null,null,null]},
				"G": { "humans": [70,150,null,null],   "notHumans": [25,25,null,null,null,null]}
			},
			"I" : {
				"L": { "humans": [30,null,60,null],    "notHumans": [8,8,8,8,null,null]},
				"G": { "humans": [80,null,160,null],   "notHumans": [25,25,25,25,null,null]}
			}
		},
		 "10":{
			"H" : {
				"L": { "humans": [null,null,null,null],"notHumans": [null,null,null,8,8,8]},
				"G": { "humans": [null,null,null,null],"notHumans": [null,null,null,25,25,25]}
			}
		}
	},
		 

    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
     init: function(target) {
        gxp.plugins.SyntheticView.superclass.init.apply(this, arguments); 
        this.target.on('portalready', function() {
            this.layerSource = this.target.layerSources[this.layerSourceName];
            this.processingPane = new gxp.plugins.StandardProcessing({
                outputTarget: this.outputTarget,
                geometryName: this.geometryName,
                accidentTipologyName: this.accidentTipologyName,
                selectionLayerName: this.selectionLayerName,
                selectionLayerTitle: this.selectionLayerTitle,         
                selectionLayerBaseURL: this.layerSource.url,
                selectionLayerProjection: this.selectionLayerProjection/*,
                maxROIArea: 197807718.7307968*/
            });
        },this);        
     },
    
    /** private: method[createLayerRecord]
     *   :arg config: ``Object``
	 *     creates a record for a new layer, with the given configuration
     */
    createLayerRecord: function(config) {        
        var params = {
            layers: config.name, 
            transparent: true, 
            format: this.layerImageFormat
        };
        if(config.params) {
            params = Ext.apply(params,config.params);
        }
        
        var layer = new OpenLayers.Layer.WMS(
            config.title,         
            this.layerSource.url,
            params,
            {
                isBaseLayer: false,
                singleTile: false,
                displayInLayerSwitcher: true,
                vendorParams: config.params
            }
        );
        
		// look for the base record for layer in layerSource and builds a new
		// record merging base configuration with given one
        var index = this.layerSource.store.findExact("name", config.name);
        if (index > -1) {
            var layerRecord = this.layerSource.store.getAt(index);
        
            // data for the new record
            var data = Ext.applyIf({
                title: config.title, 
                name: config.name,                
                layer: layer,
				properties: 'gxp_wmslayerpanel'
            }, layerRecord.data);
                        
			if(config.params.styles) {
				data.styles=[];
			}

            var Record = GeoExt.data.LayerRecord.create(layerRecord.fields);
            return new Record(data, layer.id);
        }
        return null;
    },
    
	isAllHumanTargets: function() {
		return this.status.target.name === 'Tutti i Bersagli Umani';
	},
	
	isAllNotHumanTargets: function() {
		return this.status.target.name === 'Tutti i Bersagli Ambientali';
	},
	
	isSingleTarget: function() {
		return this.status.target.name !== 'Tutti i Bersagli Umani'
			&& this.status.target.name !== 'Tutti i Bersagli Ambientali' 
			&& this.status.target.name !== 'Tutti i Bersagli';
	},
	
    isHumanTarget: function() {
        return this.status.target.type === 'umano';
    },
    
    isNotHumanTarget: function() {
        return this.status.target.type === 'ambientale';
    },
    
    isMixedTargets: function() {
        return this.status.target.type === 'mixed';
    },
    
    /** private: method[addHumanTargetBuffer]
     *   :arg distances: ``Array`` array of concentric buffer distances
     *   :arg title: ``String``
	 *     adds a new layer buffer for human targets
     */
    addHumanTargetBuffer: function(distances, title, viewParams) {           
        this.currentBufferLayers.push(title);
        distances = this.normalizeRadius(distances, true);
        return this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_human',
                buffer: 50,
                env:'elevata:'+distances[0]+';inizio:'+distances[1]+';irreversibili:'+distances[2]+';reversibili:'+distances[3],
				viewparams: viewParams
            }
        });                
    },
    
	/** private: method[addNotHumanTargetBuffer]
     *   :arg distance: ``Integer`` buffer dimension
     *   :arg title: ``String``
	 *     adds a new layer buffer for not human targets
     */
    addNotHumanTargetBuffer: function(distance, title, viewParams) {                   
        this.currentBufferLayers.push(title);
             
        return this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_nothuman',
                buffer: 50,
                env:'distance:'+distance,
				viewparams: viewParams
            }
        });        
    },
    
	/** private: method[removeLayers]
     *   :arg map: ``Object``
     *   :arg layers: ``Array``
	 *     remove all the given layers (by name) from the map
     */
    removeLayers: function(map,layers) {
        var layer;
        for(var i = 0, layerName; layerName = layers[i]; i++) {
            layer=map.getLayersByName(layerName)[0];
            if(layer) {
                map.removeLayer(layer);
            }
        }        
    },
    
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
	 *     builds the SyntheticView form
     */
    addOutput: function(config) {
        var me= this;
        this.elab = new Ext.form.TextField({
              fieldLabel: this.elaborazioneLabel,
              id: "elab",
              width: 150,
              readOnly: true,
              value: "Elaborazione Standard",
              hideLabel : false                    
        });
        
        this.form = new Ext.form.TextField({
              fieldLabel: this.formulaLabel,
              id: "form",
              width: 150,
              readOnly: true,
              value: "Rischio Totale",
              hideLabel : false                    
        });
        
        this.extent = new Ext.form.TextField({
              fieldLabel: this.extentLabel,
              id: "extent",
              width: 150,
              readOnly: true,
              value: "Regione Piemonte",
              hideLabel : false                    
        });
              
        this.trg = new Ext.form.TextField({
              fieldLabel: this.targetLabel,
              id: "target",
              width: 150,
              readOnly: true,
              value: "Tutti i bersagli",
              hideLabel : false                    
        });
        
        this.adrClass = new Ext.form.TextField({
              fieldLabel: this.adrClassLabel,
              id: "adrClass",
              width: 200,
              readOnly: true,
              value: "Tutte le classi",
              hideLabel : false                    
        });
        
        this.substance = new Ext.form.TextField({
              fieldLabel: this.substanceLabel,
              id: "substance",
              width: 200,
              readOnly: true,
              value: "Tutte le sostanze",
              hideLabel : false                    
        });
        

        this.accident = new Ext.form.TextField({
              fieldLabel: this.accidentLabel,
              id: "accedent",
              width: 150,
              readOnly: true,
              value: "Tutti gli incidenti",
              hideLabel : false                    
        });
        
        this.seriousness = new Ext.form.TextField({
              fieldLabel: this.seriousnessLabel,
              id: "seriousness",
              width: 200,
              readOnly: true,
              value: "Tutte le entità",
              hideLabel : false                    
        });                        
        
		
		this.buffers = new Ext.form.TextArea({
              fieldLabel: this.buffersLabel,
              id: "buffers",
              width: 200,
              readOnly: true,
              value: "",
              hideLabel : false                    
        });
           
        this.fieldSet = new Ext.form.FieldSet({
            title: this.fieldSetTitle,
            id: 'fset',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
                 this.elab,
                 this.form,
                 this.extent,
                 this.trg,
                 this.adrClass,
                 this.substance,
                 this.accident,
                 this.seriousness,
				 this.buffers
            ],
            buttons: [{
                text: this.cancelButton,
                iconCls: 'elab-button',
                scope: this,
                handler: function(){        
                    var map = this.target.mapPanel.map;
                    
					// remove analytic view layers (buffers, targets, selected targets)
                    this.removeLayers(map,[this.targetLayerTitle,this.selectedTargetLayer]);
                    this.removeBufferLayers(map);
                                                            
                    Ext.getCmp("south").collapse();  

					// remove filter from risk layer
					var stdElabLayer = map.getLayersByName(this.selectionLayerTitle)[0];					
					stdElabLayer.mergeNewParams({
						filter: ''
					});
                }
            }, {
                text: this.processButton,
                iconCls: 'elab-button',
                scope: this,
                handler: function(){        
                    var map = this.target.mapPanel.map;
                    
					// remove analytic view layers (buffers, targets, selected targets)
                    this.removeLayers(map,[this.targetLayerTitle, this.selectedTargetLayer]);
                    this.removeBufferLayers(map);
                                   
                    var south = Ext.getCmp("south").collapse();
                    
                    this.processingPane.show(this.target);
                    if(this.status){
                        this.processingPane.setStatus(this.status);
                    }                    
                }
            }]
        });
        
        var panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            title: this.title,
            autoScroll: true,
            items:[
                this.fieldSet
            ],
            bbar: new Ext.Toolbar({
                items: [
                    {
                        text: this.analyticViewButton,
                        iconCls: 'analytic-view-button',
                        disabled: true,
                        id: "analytic_view",
                        scope: this,
                        listeners: {
                            enable: function(){
                                me.analyticView= true;
                            },
                            disable: function(){
                                me.analyticView= false;
                            }
                        },
                        handler: this.analyticView
					}
                ]
            })
        });
        
        config = Ext.apply(panel, config || {});
        
        this.controlPanel = gxp.plugins.SyntheticView.superclass.addOutput.call(this, config);
        
        if(this.outputTarget)
            Ext.getCmp(this.outputTarget).setActiveTab(this.controlPanel);
        
        this.target.mapPanel.map.events.register('zoomend', this, function(){
            var scale = this.target.mapPanel.map.getScale();
            scale = Math.round(scale);
            
            if(scale <= this.analiticViewScale) {
                Ext.getCmp("analytic_view").enable();
            } else {
                Ext.getCmp("analytic_view").disable();
            }
        });
        
        return this.controlPanel;
    },
    
	getBounds: function(status, map) {
		// bounds: current map extent or roi saved in the status
		var bounds;
		if(status && status.roi) {
			bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
		} else {
			bounds = map.getExtent();
		}
	
		var mapPrj = map.getProjectionObject();
		var selectionPrj = new OpenLayers.Projection("EPSG:32632");
		if(!mapPrj.equals(selectionPrj)){
			bounds = bounds.transform(
				mapPrj,    
				selectionPrj
			);
		}
		
		return bounds.toBBOX().replace(/,/g, "\\\,");
	},
	
	addTargets: function(layers, bounds, radius) {
		var targetViewParams = "bounds:" + bounds + ';distance:' + radius.max;
		layers.push(this.createLayerRecord({
			name: this.status.target ? this.status.target.layer : 'bersagli_all',
			title: this.targetLayerTitle, 
			params: {                                                                
				viewparams: targetViewParams
			}
		}));
		
		var wfsGrid = Ext.getCmp("featuregrid");
		if(this.isSingleTarget()) {
			wfsGrid.loadGrids("title", this.status.target.name, this.selectionLayerProjection, targetViewParams);								
		} else if(this.isAllHumanTargets()) {
			wfsGrid.loadGrids("type", 'umano', this.selectionLayerProjection, targetViewParams);
		} else if(this.isAllNotHumanTargets()) {
			wfsGrid.loadGrids("type", 'ambientale', this.selectionLayerProjection, targetViewParams);
		} else {
			wfsGrid.loadGrids(null ,null , this.selectionLayerProjection, targetViewParams);
		}
	},
	
	addBuffers: function(layers, bounds, radius) {
		var viewParams = "bounds:" + bounds;
		if(!this.status || this.isMixedTargets()) {
			if(radius.radiusHum.length > 0) {
				layers.push(this.addHumanTargetBuffer(radius.radiusHum,this.bufferLayerTitle+' (Bersagli umani)', viewParams));
			}
			if(radius.radiusNotHum > 0) {
				layers.push(this.addNotHumanTargetBuffer(radius.radiusNotHum,this.bufferLayerTitle+' (Bersagli ambientali)', viewParams));
			}
		} else if(this.isHumanTarget()) {
			if(radius.radiusHum.length > 0) {
				layers.push(this.addHumanTargetBuffer(radius.radiusHum,this.bufferLayerTitle+' ('+this.status.target.name+')', viewParams));                                
			}
		} else if(this.isNotHumanTarget()) {
			if(radius.radiusNotHum > 0) {
				layers.push(this.addNotHumanTargetBuffer(radius.radiusNotHum,this.bufferLayerTitle+' ('+this.status.target.name+')', viewParams));                                			
			}
		}
	},
	
	analyticView: function() {		                   
		var featureManager = this.target.tools["featuremanager"];			
		var map = this.target.mapPanel.map;
		
		var status = this.getStatus();
		
		var bounds = this.getBounds(status, map);
		
		var radius = this.getRadius();
		
		// remove previous analytic view layers (targets and buffers)
		this.removeLayers(map,[this.targetLayerTitle]);  
		this.removeBufferLayers(map);
		
		var newLayers=[];
		
		// add the buffers layers
		this.addBuffers(newLayers, bounds, radius);
		
		// add the target layer
		this.addTargets(newLayers, bounds, radius);				
		
		this.target.mapPanel.layers.add(newLayers);
		
		// update info on buffers sizes
		this.buffers.setValue(this.getBuffersInfo());
		
		Ext.getCmp("south").expand();
		
		//
		// Manage the OGC filter
		//
		//var ogcFilterString;
		/*var filter;
		var targetName;
		
		var filterFormat = new OpenLayers.Format.Filter();
		var xmlFormat = new OpenLayers.Format.XML();   
		if(status && status.target){
			var target = status.target;
			
			targetName = status.targetName;
			if(target != 'Tutti i Bersagli' && target != 'Tutti i Bersagli Umani' && target != 'Tutti i Bersagli Ambientali'){
				filter = new OpenLayers.Filter.Comparison({
				   type: OpenLayers.Filter.Comparison.EQUAL_TO,
				   property: "tipobersaglio",
				   value: target
				});
													
				//ogcFilterString = filterFormat.write(filter);                                                                                         
				
			}
		}

		//
		// Manage VIEWPARAMS
		//    
		var viewParams = '';
		
		var bounds = map.getExtent();
		if(status && status.roi)
			bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
			
		//alert(bounds.toBBOX().replace(/,/g, "\\\,"));
		
		//
		// Check about the projection (this could needs Proj4JS definitions inside the mapstore config)
		//
		var mapPrj = map.getProjectionObject();
		var selectionPrj = new OpenLayers.Projection("EPSG:32632");
		if(!mapPrj.equals(selectionPrj)){
			bounds = bounds.transform(
				mapPrj,    
				selectionPrj
			);
		}
		
		bounds = bounds.toBBOX().replace(/,/g, "\\\,");
		
		viewParams += "bounds:" + bounds;
		//alert(bounds);
		
		var tipologia;
		if(status && status.accident){                                
			if(status.accident != 'Tutti gli Incidenti'){
				tipologia = 'POOL FIRE DA LIQUIDO INFIAMMABILE'; //status.accident;                                    
				viewParams += ";tipologia:" + tipologia; 
			}
		}
		
		var seriousness='Grave';
		if(status && status.seriousness){                                
			if(status.seriousness != 'Tutte le entità'){
				seriousness = status.seriousness;                                    
			}
		}
		
		var targetLayer = 'bersagli_all';
		if(status && status.target) {
			targetLayer = status.target.layer;
		}

		//alert(viewParams);
		this.removeLayers(map,[this.targetLayerTitle]);                            
		this.removeBufferLayers(map);
		
		var newLayers=[];
		
		
		
		
		this.buffers.setValue(this.getBuffersInfo());
		
		var maxDistance = 0;
		
		var radiusHum = dist.radiusHum ? this.normalizeRadius(dist.radiusHum) : [];

		for(var i=0,el; el = radiusHum[i]; i++) {
			if(el > maxDistance) {
				maxDistance = el;
			}
		}
		
		var radiusNotHum = dist.radiusNotHum || 0;
		
		if(radiusNotHum > maxDistance) {
			maxDistance = radiusNotHum;
		}

		/*if(!this.status || this.isMixedTargets()) {
			if(radiusHum.length > 0) {
				newLayers.push(this.addHumanTargetBuffer(dist.radiusHum,this.bufferLayerTitle+' (Bersagli umani)'));
			}
			if(radiusNotHum > 0) {
				newLayers.push(this.addNotHumanTargetBuffer(dist.radiusNotHum,this.bufferLayerTitle+' (Bersagli ambientali)'));
			}
		} else if(this.isHumanTarget()) {
			if(radiusHum.length > 0) {
				newLayers.push(this.addHumanTargetBuffer(dist.radiusHum,this.bufferLayerTitle+' ('+this.status.target.name+')'));                                
			}
		} else if(this.isNotHumanTarget()) {
			if(radiusNotHum > 0) {
				newLayers.push(this.addNotHumanTargetBuffer(dist.radiusNotHum,this.bufferLayerTitle+' ('+this.status.target.name+')'));                                
			}
		}
		var targetViewParams = "bounds:" + bounds + ';distance:' + maxDistance;
		newLayers.push(this.createLayerRecord({
			name: targetLayer,
			title: this.targetLayerTitle, 
			params: {                                                                
				viewparams: targetViewParams
			}
		}));
		
		var layerStore = this.target.mapPanel.layers;                            
		var mainLayerIndex = layerStore.findBy(function(rec) {
			return rec.get('title') === this.formulaLayerTitle;
		}, this);
		if(mainLayerIndex !== -1) {
			var mainLayer = layerStore.getAt(mainLayerIndex);
			layerStore.remove(mainLayer);
			newLayers.push(mainLayer);
		}
		this.target.mapPanel.layers.add(newLayers);
		
		//
		// Manage target grid
		//
		
		var wfsGrid = Ext.getCmp("featuregrid");
		if(this.isSingleTarget()) {
			wfsGrid.loadGrids("title", this.status.targetName, this.selectionLayerProjection, targetViewParams);								
		} else if(this.isAllHumanTargets()) {
			wfsGrid.loadGrids("type", 'umano', this.selectionLayerProjection, targetViewParams);
		} else if(this.isAllNotHumanTargets()) {
			wfsGrid.loadGrids("type", 'ambientale', this.selectionLayerProjection, targetViewParams);
		} else {
			wfsGrid.loadGrids(null ,null , this.selectionLayerProjection, targetViewParams);
		}
		
		*/			
	},
	
    removeBufferLayers: function(map) {
        this.removeLayers(map,this.currentBufferLayers);
        this.currentBufferLayers = [];
    },
    
    getControlPanel: function(){
        return this.controlPanel;
    },
    
	getBuffersInfo: function() {
		var radius = this.getRadius();
		var info = '';
		if(radius.radiusNotHum && radius.radiusNotHum > 0) {
			info += 'Bersagli ambientali: ' + radius.radiusNotHum+'\n';
		}
	
		if(typeof(radius.radiusHum) !== "undefined") {
			var radiusHum = this.normalizeRadius(radius.radiusHum);
			if(radiusHum.length > 0) {
				info += 'Bersagli umani: ' + radiusHum.join(', ')+'\n';
			}
		}
		return info;
	},
	
	normalizeRadius: function(input, fillEmpty) {
		var output = [];
		for(var i = 0, el, l = input.length;i<l; i++) {
			el = input[i];
			if(fillEmpty) {
				if(!el) {
					el = 0;
				}
				output.push(el);
			} else {			
				if(el && el > 0) {
					// skip duplicates or not ascending values
					if(output.length === 0 || el > output[output.length - 1]) {
						output.push(el);
					}
				}
			}
		}
		return output;
	},
	
    setStatus: function(s){
        this.status = s;
        this.elab.setValue(this.status.processing);
        this.form.setValue(this.status.formula);
        this.extent.setValue(this.status.roi.label);
        this.trg.setValue(this.status.target.name);
        this.adrClass.setValue(this.status.classe.name);
        this.substance.setValue(this.status.sostanza.name);
        this.accident.setValue(this.status.accident.name);
        this.seriousness.setValue(this.status.seriousness.name);
        this.buffers.setValue('');
        //
        // Allow the Analytic visualizzation functionalities
        //
        //Ext.getCmp("analytic_view").enable();
    },
    
    getStatus: function(){
        return this.status;
    },
    
    analyticViewIsEnable: function(){
        return this.analyticView;
    },
    
    getHumanDefaultValue: function(array,index){
        var i=index-1;
        while(i>=0){
            if(array[i]!= -1)
                return array[i];
        }
        return null;
    },
        
    getRadius: function(){
        var radius={};

        if(this.isHumanTarget() || this.isMixedTargets())
            radius.radiusHum=[null,null,null,null];
        
        if(this.isNotHumanTarget() || this.isMixedTargets())
            radius.radiusNotHum=null;

		radius.max = 0;
			
        this.parseSost(radius);
		
        return radius;
    },
    
    parseSost: function(radius){        		
		for (sost in this.radiusData){
			if(this.status.sostanza.value == "0" || sost === this.status.sostanza.value) {
				this.parseAcc(sost,radius);
			}		   
	    } 
    },
    
    parseAcc: function(sost,radius){
		for (acc in this.radiusData[sost]){
			if(this.status.accident.value == "0" || acc === this.status.accident.value){
				this.parseSer(sost,acc,radius);
			}
		}                   
    },
    
    parseSer: function(sost,acc,radius){
		for (ser in this.radiusData[sost][acc]) {
			if(this.status.seriousness.value == "0" || ser === this.status.seriousness.value){
				if(typeof(radius.radiusHum) !== "undefined") {
                    this.setRadHum(this.radiusData[sost][acc][ser].humans, radius);
				}
				
				if(typeof(radius.radiusNotHum) !== "undefined"){
                    if(this.status.target.code != '-1' && this.status.target.code != '-2') {
                        this.setRadNotHum(
                            this.radiusData[sost][acc][ser].notHumans[this.status.target.code],radius, ser);
                    } else {
                        this.setRadNotHum(
                            this.radiusData[sost][acc][ser].notHumans,radius, ser);
					}
            
                 }
			}
		}	        
            
    },
    
    setRadNotHum: function(values, radius, ser){
        var value;
        if(!(values instanceof Array)){
			values = [values];
		}
		for(var i=0;i<values.length;i++){
			value= values[i];
			if(value && (radius.radiusNotHum === null || value > radius.radiusNotHum)) {
				radius.radiusNotHum = value;	
				if(value > radius.max) {
					radius.max = value;
				}
			}  
	    }                
    },
    
    setRadHum: function(values, radius){
        var value;
        for(var i=0, value;i<values.length;i++){
            value = values[i];
            if(value && (radius.radiusHum[i] === null || value > radius.radiusHum[i])) {				
                radius.radiusHum[i] = value;  
				if(value > radius.max) {
					radius.max = value;
				}				
            }
         }
    }
    
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
