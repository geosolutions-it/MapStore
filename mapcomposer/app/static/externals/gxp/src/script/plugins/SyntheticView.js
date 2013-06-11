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
    weatherLabel: "Condizioni Meteo",  
    temporalLabel: "Condizioni Temporali",
    elabStandardLabel: "Elaborazione Standard",
    totalRiskLabel: "Rischio totale",
    defaultExtentLabel: "Regione Piemonte",
    // End i18n.
        
    id: "syntheticview",
    
    layerSourceName: "destination",    
    
    selectionLayerName: "geosolutions:aggregated_data_selection",
    selectionLayerTitle: "ElaborazioneStd",         
    //selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
    selectionLayerProjection: "EPSG:32632",
    
    bufferLayerNameHuman: "buffer_human",    
    bufferLayerNameNotHuman: "buffer_not_human",    
    
    bufferLayerTitle: ["Buffer Areas", "Aree di danno", "Aree di danno", "Aree di danno"],    
    targetLayerTitle: ["Targets", "Bersagli", "Bersagli", "Bersagli"],
    humanRiskLayerTitle: ["Total Human Risk", "Rischio Totale Sociale", "Rischio Totale Sociale", "Rischio Totale Sociale"],
    notHumanRiskLayerTitle: ["Total Environment Risk", "Rischio Totale Ambientale", "Rischio Totale Ambientale", "Rischio Totale Ambientale"],
    combinedRiskLayerTitle: ["Total Risk - Human and Environment", "Rischio Totale Sociale - Ambientale", "Rischio Totale Sociale - Ambientale", "Rischio Totale Sociale - Ambientale"],
    humanTargets: ["Human Targets", "Bersagli umani", "Bersagli umani", "Bersagli umani"],
    notHumanTargets: ["Environment Targets", "Bersagli ambientali", "Bersagli ambientali", "Bersagli ambientali"],
    humanRiskLayer: "rischio_totale_sociale",    
    notHumanRiskLayer: "rischio_totale_ambientale",    
    combinedRiskLayer: "rischio_totale",    
    currentRiskLayers: ["rischio_totale_ambientale", "rischio_totale_sociale", "rischio_totale"],
    formulaRiskLayer: "rischio",
    mixedFormulaRiskLayer: "mixed_rischio",
    humanTitle:'Sociale',    
    notHumanTitle:'Ambientale',    
    originalRiskLayers: null,
    
    selectedTargetLayer: "Bersaglio Selezionato",
    
    analyticViewLayers: [],    
    
    
    layerImageFormat: "image/png8",
    
    geometryName: "geometria",
    accidentTipologyName: "tipologia",
    
    analiticViewScale: 17070,
    
    analyticView: false,
    
    aoi: null,
    
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
                aoi: this.aoi,
                accidentTipologyName: this.accidentTipologyName,
                selectionLayerName: this.selectionLayerName,
                selectionLayerTitle: this.selectionLayerTitle,         
                selectionLayerBaseURL: this.layerSource.url,
                selectionLayerProjection: this.selectionLayerProjection,
                wfsURL: this.wfsURL,
                wfsVersion: this.wfsVersion,
                destinationNS: this.destinationNS                
            });
        },this);        
     },
    
    /** private: method[createLayerRecord]
     *   :arg config: ``Object``
     *     creates a record for a new layer, with the given configuration
     */
    createLayerRecord: function(config, singleTitle, dynamicBuffer) {        
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
                singleTile: singleTitle,
                displayInLayerSwitcher: true,
                vendorParams: config.params
            }
        );
        if(dynamicBuffer) {
            var oldGetFullRequestString = layer.getFullRequestString;
            
            var me = this;
            
            layer.getFullRequestString = function(newParams, altUrl) {
                this.params.BUFFER = me.getBufferSizeInPixels(dynamicBuffer);
                this.vendorParams.buffer = this.params.BUFFER;
                return oldGetFullRequestString.apply(this, arguments);
            };
        
        }
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
        return this.status.target['id_bersaglio'] === -2;
    },
    
    isAllNotHumanTargets: function() {
        return this.status.target['id_bersaglio'] === -3;
    },
    
    isSingleTarget: function() {
        return parseInt(this.status.target['id_bersaglio'],10) > 0;
    },
    
    isHumanTarget: function() {
        return this.status.target.humans;
    },
    
    isNotHumanTarget: function() {
        return !this.status.target.humans;
    },
    
    isMixedTargets: function() {
        return this.status.target.humans === null;
    },
    
    /** private: method[addHumanTargetBuffer]
     *   :arg distances: ``Array`` array of concentric buffer distances
     *   :arg title: ``String``
     *     adds a new layer buffer for human targets
     */
    addHumanTargetBuffer: function(distances, title, viewParams, buffer) {           
        this.analyticViewLayers.push(this.bufferLayerNameHuman);
        distances = this.normalizeRadius(distances, true);
        return this.createLayerRecord({
            name: this.bufferLayerNameHuman,
            title: title,
            params: {                                
                env:'elevata:'+distances[0]+';inizio:'+distances[1]+';irreversibili:'+distances[2]+';reversibili:'+distances[3],
                viewparams: viewParams
            }
        }, true, buffer);                
    },
    
    /** private: method[addNotHumanTargetBuffer]
     *   :arg distance: ``Integer`` buffer dimension
     *   :arg title: ``String``
     *     adds a new layer buffer for not human targets
     */
    addNotHumanTargetBuffer: function(distance, title, viewParams, buffer) {                   
        this.analyticViewLayers.push(this.bufferLayerNameNotHuman);
             
        return this.createLayerRecord({
            name: this.bufferLayerNameNotHuman,
            title: title,
            params: {                                
                env:'distance:'+distance,
                viewparams: viewParams
            }
        }, true, buffer);        
    },
    
    /** private: method[removeLayers]
     *   :arg map: ``Object``
     *   :arg layers: ``Array``
     *     remove all the given layers (by name) from the map
     */
    removeLayersByName: function(map,layers) {
        var layer;
        for(var i = 0, layerName; layerName = layers[i]; i++) {
            layer = this.getLayerByName(map, layerName);
            //layer=map.getLayersByName(layerName)[0];
            if(layer) {
                map.removeLayer(layer);
            }
        }  
    },
    
    getLayerByName: function(map, layerName) {
        for(var i = 0; i < map.layers.length; i++) {
            var layer = map.layers[i];
            if(layer.params && layer.params.LAYERS == layerName) {
                return layer;
            }
        }
        return null;
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
              value: this.elabStandardLabel,
              hideLabel : false                    
        });
        
        this.form = new Ext.form.TextField({
              fieldLabel: this.formulaLabel,
              id: "form",
              width: 150,
              readOnly: true,
              value: this.totalRiskLabel,
              hideLabel : false                    
        });
        
        this.extent = new Ext.form.TextField({
              fieldLabel: this.extentLabel,
              id: "extent",
              width: 150,
              readOnly: true,
              value: this.defaultExtentLabel,
              hideLabel : false                    
        });
        
        this.temporal = new Ext.form.TextField({
              fieldLabel: this.temporalLabel,
              id: "temporalCond",
              width: 150,
              readOnly: true,
              value: "",
              hideLabel : false                    
        });
        
        this.weather = new Ext.form.TextField({
              fieldLabel: this.weatherLabel,
              id: "weatherCond",
              width: 150,
              readOnly: true,
              value: "",
              hideLabel : false                    
        });
              
        this.trg = new Ext.form.TextField({
              fieldLabel: this.targetLabel,
              id: "target",
              width: 150,
              readOnly: true,
              value: gxp.plugins.StandardProcessing.prototype.allTargetOption,
              hideLabel : false                    
        });
        
        this.adrClass = new Ext.form.TextField({
              fieldLabel: this.adrClassLabel,
              id: "adrClass",
              width: 200,
              readOnly: true,
              value: gxp.plugins.StandardProcessing.prototype.allClassOption,
              hideLabel : false                    
        });
        
        this.substance = new Ext.form.TextField({
              fieldLabel: this.substanceLabel,
              id: "substance",
              width: 200,
              readOnly: true,
              value: gxp.plugins.StandardProcessing.prototype.allSostOption,
              hideLabel : false                    
        });
        

        this.accident = new Ext.form.TextField({
              fieldLabel: this.accidentLabel,
              id: "accedent",
              width: 150,
              readOnly: true,
              value: gxp.plugins.StandardProcessing.prototype.allScenOption,
              hideLabel : false                    
        });
        
        this.seriousness = new Ext.form.TextField({
              fieldLabel: this.seriousnessLabel,
              id: "seriousness",
              width: 200,
              readOnly: true,
              value: gxp.plugins.StandardProcessing.prototype.allEntOption,
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
                 this.temporal,
                 this.weather,
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
                    this.removeAnalyticViewLayers(map);
                    
                    // reset risk layers
                    this.removeRiskLayers(map);                                       
                    this.restoreOriginalRiskLayers(map);
                                        
                    Ext.getCmp("south").collapse();  
                }
            }, {
                text: this.processButton,
                iconCls: 'elab-button',
                scope: this,
                handler: function(){        
                    var map = this.target.mapPanel.map;
                    /*
                    // remove analytic view layers (buffers, targets, selected targets)
                    this.removeAnalyticViewLayers(map);                    
                             
                    // reset risk layers
                    if(this.originalRiskLayers !== null) {
                        this.removeRiskLayers(map);                                       
                        this.restoreOriginalRiskLayers(map);
                    }
                                
                    var south = Ext.getCmp("south").collapse();
                    */
                    if(! this.processingPane.aoiFieldset)
                        this.processingPane.show(this.target);
                    else{
                        var containerTab = Ext.getCmp(this.outputTarget);
                        var active = containerTab.getActiveTab();
                        map.events.register("move", this.processingPane, this.processingPane.aoiUpdater);
                        active.disable();
                        containerTab.setActiveTab(1);
                        active = containerTab.getActiveTab();
                        active.enable();
                    }    
                
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
    
    getBounds: function(status, map, buffer) {        
        // bounds: current map extent or roi saved in the status
        var bounds;
        if(status && status.roi) {
            bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
        } else {
            bounds = map.getExtent();
        }
        if(buffer) {
            bounds.extend(new OpenLayers.Geometry.Point(bounds.left - buffer, bounds.bottom - buffer));
            bounds.extend(new OpenLayers.Geometry.Point(bounds.right + buffer, bounds.top + buffer));
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
        var name = this.status.target ? this.status.target.layer : 'bersagli_all';
        var targetViewParams = "bounds:" + bounds + ';distanzaumano:' + radius.maxHuman + ';distanza:' + radius.maxNotHuman;
        this.analyticViewLayers.push(name);
        this.analyticViewLayers.push(this.selectedTargetLayer);
        layers.push(this.createLayerRecord({
            name: name,
            title: this.targetLayerTitle[GeoExt.Lang.getLocaleIndex()], 
            params: {                                                                
                viewparams: targetViewParams
            }
        }, true));
        
        var wfsGrid = Ext.getCmp("featuregrid");
        if(this.isSingleTarget()) {
            wfsGrid.loadGrids("id", this.status.target['id_bersaglio'], this.selectionLayerProjection, targetViewParams);                                
        } else if(this.isAllHumanTargets()) {
            wfsGrid.loadGrids("type", 'umano', this.selectionLayerProjection, targetViewParams);
        } else if(this.isAllNotHumanTargets()) {
            wfsGrid.loadGrids("type", 'ambientale', this.selectionLayerProjection, targetViewParams);
        } else {
            wfsGrid.loadGrids(null ,null , this.selectionLayerProjection, targetViewParams);
        }
               
    },
    
    getMetersToPixelsRatio: function() {
        var extent = this.target.mapPanel.map.getExtent();
        var lineString = new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(extent.left,extent.top), new OpenLayers.Geometry.Point(extent.right,extent.top)]);
        var realWidth = lineString.getGeodesicLength(this.target.mapPanel.map.getProjectionObject());
        return realWidth / this.target.mapPanel.getSize().width;
    },
    
    getBufferSizeInPixels: function(bufferInMeter) {
        return Math.round(bufferInMeter / this.getMetersToPixelsRatio());
    },
    
    addBuffers: function(layers, bounds, radius) {
        var viewParams = "bounds:" + bounds;
        
        //var buffer = this.getBufferSizeInPixels(radius.max);
        
        var bufferLayerTitle =this.bufferLayerTitle[GeoExt.Lang.getLocaleIndex()];
        
        if(!this.status || this.isMixedTargets()) {
            if(radius.radiusHum.length > 0) {
                layers.push(this.addHumanTargetBuffer(radius.radiusHum,bufferLayerTitle+' (' +this.humanTargets[GeoExt.Lang.getLocaleIndex()]+ ')', viewParams, radius.max));
            }
            if(radius.radiusNotHum > 0) {
                layers.push(this.addNotHumanTargetBuffer(radius.radiusNotHum,bufferLayerTitle+' (' +this.notHumanTargets[GeoExt.Lang.getLocaleIndex()]+ ')', viewParams, radius.max));
            }
        } else if(this.isHumanTarget()) {
            if(radius.radiusHum.length > 0) {
                layers.push(this.addHumanTargetBuffer(radius.radiusHum,bufferLayerTitle+' ('+this.status.target.name+')', viewParams, radius.max));                                
            }
        } else if(this.isNotHumanTarget()) {
            if(radius.radiusNotHum > 0) {
                layers.push(this.addNotHumanTargetBuffer(radius.radiusNotHum,bufferLayerTitle+' ('+this.status.target.name+')', viewParams, radius.max));
            }
        }
    },
    
    addNotHumanRisk: function(layers, bounds) {    
        this.currentRiskLayers.push(this.notHumanRiskLayer);
        var viewParams = "bounds:" + bounds 
            + ';urbanizzate:' + (this.status.target.id.indexOf(10) === -1 ? 0 : 1) 
            + ';boscate:' + (this.status.target.id.indexOf(11) === -1 ? 0 : 1) 
            + ';protette:' + (this.status.target.id.indexOf(12) === -1 ? 0 : 1) 
            + ';agricole:' + (this.status.target.id.indexOf(13) === -1 ? 0 : 1) 
            + ';sotterranee:' + (this.status.target.id.indexOf(14) === -1 ? 0 : 1)
            + ';superficiali:' + (this.status.target.id.indexOf(15) === -1 ? 0 : 1) 
            + ';culturali:' + (this.status.target.id.indexOf(16) === -1 ? 0 : 1) 
            + ';sostanze:' + this.status.sostanza.id.join('\\,')
            + ';scenari:' + this.status.accident.id.join('\\,')
            + ';gravita:' + this.status.seriousness.id.join('\\,');
        layers.push(this.createLayerRecord({
            name: this.notHumanRiskLayer,
            title: this.notHumanRiskLayerTitle[GeoExt.Lang.getLocaleIndex()], 
            params: {
                viewparams: viewParams,                
                env:"low:"+this.status.themas['ambientale'][0]+";medium:"+this.status.themas['ambientale'][1],
                riskPanel: true
            }
        }, true));
    },
    
    addHumanRisk: function(layers, bounds) {
        this.currentRiskLayers.push(this.humanRiskLayer);
        var viewParams = "bounds:" + bounds 
            + ';residenti:' + (this.status.target.id.indexOf(1) === -1 ? 0 : 1) 
            + ';turistica:' + (this.status.target.id.indexOf(2) === -1 ? 0 : 1) 
            + ';industria:' + (this.status.target.id.indexOf(4) === -1 ? 0 : 1) 
            + ';sanitarie:' + (this.status.target.id.indexOf(5) === -1 ? 0 : 1) 
            + ';scolastiche:' + (this.status.target.id.indexOf(6) === -1 ? 0 : 1)
            + ';commerciali:' + (this.status.target.id.indexOf(7) === -1 ? 0 : 1) 
            + ';sostanze:' + this.status.sostanza.id.join('\\,')
            + ';scenari:' + this.status.accident.id.join('\\,')
            + ';gravita:' + this.status.seriousness.id.join('\\,');
        layers.push(this.createLayerRecord({
            name: this.humanRiskLayer,
            title: this.humanRiskLayerTitle[GeoExt.Lang.getLocaleIndex()], 
            params: {                                                                
                viewparams: viewParams,
                env:"low:"+this.status.themas['sociale'][0]+";medium:"+this.status.themas['sociale'][1],
                riskPanel: true
            }
        }, true));
    },
    
    addFormula: function(layers, bounds, status, targetId, layer, formulaDesc, env) {
        this.currentRiskLayers.push(layer);
        var viewParams = "bounds:" + bounds 
            + ';residenti:' + (this.status.target.id.indexOf(1) === -1 ? 0 : 1) 
            + ';turistica:' + (this.status.target.id.indexOf(2) === -1 ? 0 : 1) 
            + ';industria:' + (this.status.target.id.indexOf(4) === -1 ? 0 : 1) 
            + ';sanitarie:' + (this.status.target.id.indexOf(5) === -1 ? 0 : 1) 
            + ';scolastiche:' + (this.status.target.id.indexOf(6) === -1 ? 0 : 1)
            + ';commerciali:' + (this.status.target.id.indexOf(7) === -1 ? 0 : 1)
            + ';urbanizzate:' + (this.status.target.id.indexOf(10) === -1 ? 0 : 1) 
            + ';boscate:' + (this.status.target.id.indexOf(11) === -1 ? 0 : 1) 
            + ';protette:' + (this.status.target.id.indexOf(12) === -1 ? 0 : 1) 
            + ';agricole:' + (this.status.target.id.indexOf(13) === -1 ? 0 : 1) 
            + ';sotterranee:' + (this.status.target.id.indexOf(14) === -1 ? 0 : 1)
            + ';superficiali:' + (this.status.target.id.indexOf(15) === -1 ? 0 : 1) 
            + ';culturali:' + (this.status.target.id.indexOf(16) === -1 ? 0 : 1)             
            + ';sostanze:' + this.status.sostanza.id.join('\\,')
            + ';scenari:' + this.status.accident.id.join('\\,')
            + ';gravita:' + this.status.seriousness.id.join('\\,');
            
                
        env += ";formula:"+status.formula+";target:"+targetId+";materials:"+status.sostanza.id.join(',');
        layers.push(this.createLayerRecord({
            name: layer,
            title: formulaDesc, 
            tiled: false,
            params: {                                                                
                viewparams: viewParams,
                env: env
            }
        }, true));
    },
    
    addCombinedRisk: function(layers, bounds) {
        this.currentRiskLayers.push(this.combinedRiskLayer);
        var viewParams = "bounds:" + bounds 
            + ';residenti:' + (this.status.target.id.indexOf(1) === -1 ? 0 : 1) 
            + ';turistica:' + (this.status.target.id.indexOf(2) === -1 ? 0 : 1) 
            + ';industria:' + (this.status.target.id.indexOf(4) === -1 ? 0 : 1) 
            + ';sanitarie:' + (this.status.target.id.indexOf(5) === -1 ? 0 : 1) 
            + ';scolastiche:' + (this.status.target.id.indexOf(6) === -1 ? 0 : 1)
            + ';commerciali:' + (this.status.target.id.indexOf(7) === -1 ? 0 : 1) 
            + ';urbanizzate:' + (this.status.target.id.indexOf(10) === -1 ? 0 : 1) 
            + ';boscate:' + (this.status.target.id.indexOf(11) === -1 ? 0 : 1) 
            + ';protette:' + (this.status.target.id.indexOf(12) === -1 ? 0 : 1) 
            + ';agricole:' + (this.status.target.id.indexOf(13) === -1 ? 0 : 1) 
            + ';sotterranee:' + (this.status.target.id.indexOf(14) === -1 ? 0 : 1)
            + ';superficiali:' + (this.status.target.id.indexOf(15) === -1 ? 0 : 1) 
            + ';culturali:' + (this.status.target.id.indexOf(16) === -1 ? 0 : 1) 
            + ';sostanze:' + this.status.sostanza.id.join('\\,')
            + ';scenari:' + this.status.accident.id.join('\\,')
            + ';gravita:' + this.status.seriousness.id.join('\\,');
        layers.push(this.createLayerRecord({
            name: this.combinedRiskLayer,
            title: this.combinedRiskLayerTitle[GeoExt.Lang.getLocaleIndex()], 
            params: {                                                                
                viewparams: viewParams,
                env:"lowsociale:"+this.status.themas['sociale'][0]+";mediumsociale:"+this.status.themas['sociale'][1]+";lowambientale:"+this.status.themas['ambientale'][0]+";mediumambientale:"+this.status.themas['ambientale'][1],
                riskPanel: true
            }
        }, true));
    },
    
    dependsOnTargets: function(formula) {
        return formula == 2; // cff
    },
    
    addRisk: function(layers, bounds, status) {        
        if(status.formula == 26) {
            // rischio totale
            if(this.isMixedTargets()) {
                this.addHumanRisk(layers, bounds);
                this.addNotHumanRisk(layers, bounds);
                this.addCombinedRisk(layers, bounds);
            } else if(this.isHumanTarget()) {
                this.addHumanRisk(layers, bounds);
            } else if(this.isNotHumanTarget()) {
                this.addNotHumanRisk(layers, bounds);
            }
        } else {
            var env;
            if(this.isMixedTargets()) {
            } else if(this.isHumanTarget()) {
                env = "low:"+this.status.themas['sociale'][0]+";medium:"+this.status.themas['sociale'][1];
            } else if(this.isNotHumanTarget()) {
                env = "low:"+this.status.themas['ambientale'][0]+";medium:"+this.status.themas['ambientale'][1];
            }
            var mixedenv = "lowsociale:"+this.status.themas['sociale'][0]+";mediumsociale:"+this.status.themas['sociale'][1]+";lowambientale:"+this.status.themas['ambientale'][0]+";mediumambientale:"+this.status.themas['ambientale'][1];
            
            if(this.dependsOnTargets(status.formula)) {
                if(this.isSingleTarget()) {
                    this.addFormula(layers, bounds, status, parseInt(status.target['id_bersaglio'], 10), this.formulaRiskLayer, status.formulaDesc, env);                
                } else if(this.isAllHumanTargets()) {
                    this.addFormula(layers, bounds, status, 98, this.formulaRiskLayer, status.formulaDesc, env);
                } else if(this.isAllNotHumanTargets()) {
                    this.addFormula(layers, bounds, status, 99, this.formulaRiskLayer, status.formulaDesc, env);
                } else {
                    this.addFormula(layers, bounds, status, 98, this.formulaRiskLayer, status.formulaDesc + ' ' + this.humanTitle, env);
                    this.addFormula(layers, bounds, status, 99, this.formulaRiskLayer, status.formulaDesc + ' ' + this.notHumanTitle, env);                    
                    this.addFormula(layers, bounds, status, 100, this.mixedFormulaRiskLayer, status.formulaDesc + ' ' + this.humanTitle + ' - ' + this.notHumanTitle, mixedenv);
                }
            } else {
                this.addFormula(layers, bounds, status, 0, this.formulaRiskLayer, status.formulaDesc, env);   
            }
            
            //this.addFormula(layers, bounds, status);
        }
    },
    
    /*extractLayers: function(layers, titles) {
                var map = this.target.mapPanel.map;
        var layerStore = this.target.mapPanel.layers;
        for(var i=0, layerTitle; layerTitle = titles[i]; i++) {
            var layerIndex = layerStore.findBy(function(rec) {
                return rec.get('title') === layerTitle;
            }, this);
            if(layerIndex !== -1) {
                var layer = layerStore.getAt(layerIndex);
                layer.get('layer').clearGrid();
                layerStore.remove(layer);
                                var mapLayers=map.getLayersByName(layer.get('name'));
                                if(mapLayers.length == 1)
                                layer.visibility= mapLayers[0].visibility;
                layers.push(layer);
            }
        }
    },*/
    
    extractLayersByName: function(layers, names) {
        var map = this.target.mapPanel.map;
        var layerStore = this.target.mapPanel.layers;
        for(var i=0, layerName; layerName = names[i]; i++) {
            var layerIndex = layerStore.findBy(function(rec) {
                return rec.get('name') === layerName;
            }, this);
            if(layerIndex !== -1) {
                var layer = layerStore.getAt(layerIndex);
                layer.get('layer').clearGrid();
                layerStore.remove(layer);
                var mapLayer = this.getLayerByName(map, layer.get('name'));
                if(mapLayer) {
                    layer.visibility= mapLayer.visibility;
                }
                layers.push(layer);
            }
        }
    },
    
    storeOriginalRiskLayers: function() {
        this.originalRiskLayers=[];
        this.extractLayersByName(this.originalRiskLayers, [this.humanRiskLayer, this.notHumanRiskLayer, this.combinedRiskLayer]);
    },
    
    restoreOriginalRiskLayers: function() {    
        this.currentRiskLayers = [this.notHumanRiskLayer, this.humanRiskLayer, this.combinedRiskLayer];
        this.target.mapPanel.layers.add(this.originalRiskLayers);                
    },
    
    moveRiskLayersToTop: function(layers) {        
        this.extractLayersByName(layers, this.currentRiskLayers);                
    },
    
    analyticView: function() {    
        var featureManager = this.target.tools["featuremanager"];            
        var map = this.target.mapPanel.map;
        
        var status = this.getStatus();
        
        var bounds = this.getBounds(status, map);
        
        var radius = this.getRadius();
        
        var newLayers=[];
        
        
        // remove previous analytic view layers (targets and buffers)
        this.removeAnalyticViewLayers(map);                                
        
        // add the buffers layers
        this.addBuffers(newLayers, bounds, radius);
        
        // add the target layer
        this.addTargets(newLayers, bounds, radius);                
            
                    
        this.moveRiskLayersToTop(newLayers);

        // add analytic view layers to the map
        this.target.mapPanel.layers.add(newLayers);
        
        // update info on buffers sizes     
        this.buffers.setValue(this.getBuffersInfo());
        
        Ext.getCmp("south").expand();            
    },
    
    doProcess: function(roi) {
        var newLayers=[];
        
        var map = this.target.mapPanel.map;        
        var status = this.getStatus();        
        var bounds = this.getBounds(status, map);
        
        if(this.originalRiskLayers === null) {
            this.storeOriginalRiskLayers();
        }
        
        this.removeRiskLayers(map);
        
        // remove analytic view layers (buffers, targets, selected targets)
        this.removeAnalyticViewLayers(map);                    
        Ext.getCmp("south").collapse();
        
        this.addRisk(newLayers, bounds, status);
        
        this.target.mapPanel.layers.add(newLayers);
        if(roi)
            this.target.mapPanel.map.zoomToExtent(roi);
    },
    
    removeAnalyticViewLayers: function(map) {
        this.removeLayersByName(map,this.analyticViewLayers);
        this.analyticViewLayers = [];
    },        
    
    removeRiskLayers: function(map) {
        this.removeLayersByName(map,this.currentRiskLayers);
        this.currentRiskLayers = [];
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
                if(el != 0 && el < output[output.length-1]) {
                    el = output[output.length-1];
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
        this.elab.setValue(this.status.processingDesc);
        this.form.setValue(this.status.formulaDesc);
        
        this.weather.setValue(this.status.weather);
        this.temporal.setValue(this.status.temporal);
        
        this.extent.setValue(this.status.roi.label);
        this.trg.setValue(this.status.target.name);
        this.adrClass.setValue(this.status.classe.name);
        this.substance.setValue(this.status.sostanza.name);
        this.accident.setValue(this.status.accident.name);
        this.seriousness.setValue(this.status.seriousness.name);
        this.buffers.setValue('');        
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
        radius.maxHuman = 0;
        radius.maxNotHuman = 0;
            
        this.parseSost(radius);
        return radius;
    },
    
    parseSost: function(radius){                
        for (sost in this.radiusData){
            if(this.status.sostanza.value === "0" || sost === this.status.sostanza.value + "") {
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
                if(value > radius.maxNotHuman) {
                    radius.maxNotHuman = value;
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
                if(value > radius.maxHuman) {
                    radius.maxHuman = value;
                }
            }
         }
    }
    
    
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
