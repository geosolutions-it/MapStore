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
    severenessLabel: "Gravità",
    buffersLabel: "Raggi Aree Danno",
    resultsLabel: "Risultato Elaborazione",
    fieldSetTitle: "Elaborazione",
    cancelButton: "Annulla Elaborazione",
    processButton: "Esegui Elaborazione",
    analyticViewButton: "Visualizzazione Analitica:",
    refreshGridButton: "Aggiorna la griglia",
    //weatherLabel: "Condizioni Meteo",  
    temporalLabel: "Condizioni Temporali",
    elabStandardLabel: "Elaborazione Standard",
    totalRiskLabel: "Rischio totale",
    defaultExtentLabel: "Regione Piemonte",
    targetsTextBotton: "Bersagli",
    areaDamageTextBotton: "Aree di danno",
    roadGraphTextBotton: "Grafo stradale",    
    wpsTitle: "Errore",
    wpsError: "Errore nella richiesta al servizio WPS",
    loadMsg: "Caricamento in corso...",
    notVisibleOnArcsMessage: "Formula non visibile a questa scala",
    notVisibleOnGridMessage: "Formula non visibile a questa scala",
    simMsg: 'Modifica dei parametri di simulazione non possibile a questa scala. Zoomare fino a scala 1:17061',
    // End i18n.
        
    id: "syntheticview",
    
    layerSourceName: "destination",    
    
    selectionLayerName: "geosolutions:aggregated_data_selection",
    selectionLayerTitle: "ElaborazioneStd",         
    //selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
    selectionLayerProjection: "EPSG:32632",
    
    bufferLayerNameHuman: "buffer_human",    
    bufferLayerNameNotHuman: "buffer_not_human",    
    damageBufferLayer: "damage_buffer",
    
    bufferLayerTitle: ["Buffer Areas", "Aree di danno", "Aree di danno", "Shadensbereich"],    
    targetLayerTitle: ["Targets", "Bersagli", "Bersagli", "Betroffene Elemente"],
    humanRiskLayerTitle: ["Total Human Risk", "Rischio Totale Sociale", "Rischio Totale Sociale", "Rischio Totale Sociale"],
    notHumanRiskLayerTitle: ["Total Environment Risk", "Rischio Totale Ambientale", "Rischio Totale Ambientale", "Rischio Totale Ambientale"],
    combinedRiskLayerTitle: ["Total Risk - Human and Environment", "Rischio Totale Sociale - Ambientale", "Rischio Totale Sociale - Ambientale", "Rischio Totale Sociale - Ambientale"],
    humanTargets: ["Human Targets", "Bersagli umani", "Bersagli umani", "Anthropologischen betroffene"],
    notHumanTargets: ["Environment Targets", "Bersagli ambientali", "Bersagli ambientali", "Umwelt betroffene"],
    humanRiskLayer: "rischio_totale_sociale",    
    notHumanRiskLayer: "rischio_totale_ambientale",    
    combinedRiskLayer: "rischio_totale",    
    currentRiskLayers: ["rischio_totale_ambientale", "rischio_totale_sociale", "rischio_totale"],
    formulaRiskLayer: "rischio",
    mixedFormulaRiskLayer: "mixed_rischio",
    humanTitle:'Sociale',    
    notHumanTitle:'Ambientale',    
    originalRiskLayers: null,
    
    severeness: [["ELEVATA LETALITA","INIZIO LETALITA","LESIONI IRREVERSIBILI","LESIONI REVERSIBILI","Ambientale"], ["ELEVATA LETALITA","INIZIO LETALITA","LESIONI IRREVERSIBILI","LESIONI REVERSIBILI","Ambientale"], ["ELEVATA LETALITA","INIZIO LETALITA","LESIONI IRREVERSIBILI","LESIONI REVERSIBILI","Ambientale"], ["Hohe Letalität","Beginn Letalität","Irreversible Verletzungen","Reversiblie Verletzungen","Umweltschäden"]],
    
    selectedTargetLayer: "Bersaglio Selezionato",
    selectedTargetLayerEditing: "Bersaglio Selezionato Editing",
    simulationAddedLayer: "Bersagli aggiunti", //"simulation_added",
    simulationChangedLayer: "Bersagli modificati", //"simulation_changed",
    simulationRemovedLayer: "Bersagli rimossi", //"simulation_removed",
    simulationModLayer: "Bersagli Modifiche Geometriche",
    
    analyticViewLayers: [],   
    vectorLayers: [],
    
    roadsLayer: "grafo_stradale",
    
    layerImageFormat: "image/png8",
    
    geometryName: "geometria",
    accidentTipologyName: "tipologia",
    
    analiticViewScale: 17070,
    cellViewScale: 500010,
    
    analyticView: false,
    
    aoi: null,
    wpsURL: '',
    wpsStore:'',
    
    processingDone: true,
    
    analyticEnabled: false,
    simulationEnabled: false,
    
    reset: false,
    
    targetStyles: {
        "simulation_added": {
            strokeColor: "#00FF00",
            strokeWidth: 3,
            fillColor: "#00FF00",
            fillOpacity: 0.5
        },
        "simulation_changed": {
            strokeColor: "#FFFF00",
            strokeWidth: 3,
            fillColor: "#FFFF00",
            fillOpacity: 0.5
        },
        "simulation_removed": {
            strokeColor: "#FF0000",
            strokeWidth: 3,
            fillColor: "#FF0000",
            fillOpacity: 0.5
        }
        
    },
    
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
        this.vectorLayers = [this.selectedTargetLayer, this.selectedTargetLayerEditing, this.simulationAddedLayer, this.simulationChangedLayer, this.simulationRemovedLayer];
        this.modifiedLayer = [this.simulationModLayer];
        this.target.on('portalready', function() {
            this.layerSource = this.target.layerSources[this.layerSourceName];
            this.wpsClient =  new OpenLayers.WPSClient({
                servers: {
                    destination: this.wpsURL
                }
            });
            this.processingPane = new gxp.plugins.StandardProcessing({
                outputTarget: this.outputTarget,
                geometryName: this.geometryName,
                aoi: this.aoi,
                seldamage: this.seldamage,
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
    createLayerRecord: function(config, singleTitle, dynamicBuffer, exclusive, group) {        
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
                exclusive: exclusive ? exclusive : undefined,
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
                properties: 'gxp_wmslayerpanel',
                group: group ? group : undefined, 
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
    
    addDamageBuffer: function(title, geometry) {
        this.analyticViewLayers.push(this.damageBufferLayer);
        
        return this.createLayerRecord({
            name: this.damageBufferLayer,
            title: title,
            params: {                                
                viewparams:'wkt:'+geometry.replace(/,/g, "\\\,")
            }
        }, true);
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
    
    /** private: method[addModifiedFeatures]
     *   :arg map: ``Object``
     *   :arg layers: ``Array``
     *    add modified features in simulation type
     */
    addModifiedFeatures: function(map,layers) {
        var layer;
        var modifiedLayer = this.modifiedLayer[0];        
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;       

        var targetLayer = new OpenLayers.Layer.Vector(modifiedLayer,{
            displayInLayerSwitcher: true,
            renderers: renderer
        });
        map.addLayer(targetLayer);
        for(var i = 0, layerName; layerName = layers[i]; i++) {
            layer = this.getLayerByName(map, layerName);
            //layer=map.getLayersByName(layerName)[0];
            if(layer && layer.features.length > 0) {
                for(var x = 0;x<layer.features.length;x++){
                    targetLayer.addFeatures(layer.features[x]);
                }
            }
        }  
    },    
    
    getLayerByName: function(map, layerName) {
        if(map.getLayersByName(layerName).length > 0) {
            return map.getLayersByName(layerName)[0];
        }
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
        
        /*this.weather = new Ext.form.TextField({
              fieldLabel: this.weatherLabel,
              id: "weatherCond",
              width: 150,
              readOnly: true,
              value: "",
              hideLabel : false                    
        });*/
              
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
        
        
        this.results = new Ext.form.DisplayField({
              fieldLabel: this.resultsLabel,
              id: "results",
              width: 200,
              readOnly: true,
              value: "",
              hideLabel : false                    
        });
                      
        this.resultsContainer = new Ext.Container({layout:'fit'});
        
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
                 //this.weather,
                 this.trg,
                 this.adrClass,
                 this.substance,
                 this.accident,
                 this.seriousness,
                 this.results,
                 this.resultsContainer
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

                    this.removeModifiedLayer(map);
                    //this.restoreOriginalRiskLayers(map);
                    this.enableDisableRoads(true);
                    
                    this.disableSouthPanel();  

                    this.processingDone = false;
                    
                    Ext.getCmp('warning_message').setValue('');
                    
                    Ext.getCmp('analytic_view').disable();
                    
                    // remove resultContainer on elab cancel
                    this.resultsContainer.removeAll();
                    this.resultsContainer.doLayout();
                    var form = this.fieldSet.ownerCt.getForm();
                    for (var i=0;i<form.items.items.length;i++){
                        form.items.items[i].setValue("");
                    }
                    this.reset = true;
                    //this.processingPane.enableDisableSimulation(false);
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
                
                    if(this.status && !this.status.initial && !this.reset){
                        this.processingPane.setStatus(this.status);
                    }                    
                    
                    if(this.status && !this.status.initial && this.reset){
                    
                        // Tipo elaborazione
                        this.processingPane.elaborazione.setValue(1);                        
                        // Formula
                        this.processingPane.formula.setValue(26);                        
                        // Temporali
                        this.processingPane.temporal.setValue("fp_scen_centrale");                        
                        this.processingPane.temporal.disable();   
                        // Categoria
                        this.processingPane.macrobers.setValue(this.processingPane.allTargetOption);                        
                        // Bersaglio
                        this.processingPane.bers.setValue("");                        
                        // Classe ADR
                        this.processingPane.classi.setValue(this.processingPane.allClassOption);                        
                        // Sostanza
                        this.processingPane.sostanze.setValue(this.processingPane.allSostOption);
                        // Incidente
                        this.processingPane.accident.setValue(this.processingPane.allScenOption);
                        // Entità
                        this.processingPane.seriousness.setValue(this.processingPane.allEntOption);                         

                        //this.processingPane.setStatus(this.status);
                        
                        this.reset = false;
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
            ]
        });

                        
        //set analytic/simulation button toolbar with bottons
        this.mapBbar =  [{
                    xtype: 'button',
                    id: "refresh_grid",
                    iconCls: 'refresh-grid-button',
                    text: this.refreshGridButton,
                    scope: this,
                    disabled:true,
                    hidden: true,
                    handler: function(btn) {
                        var wfsGrid = Ext.getCmp("featuregrid");
                        var viewParams;
                        
                        var status = this.getStatus();        
                        var bounds = this.getBounds(null, this.target.mapPanel.map);
                        viewParams = "bounds:" + bounds;                        
                        wfsGrid.loadGrids(null, null, this.selectionLayerProjection, viewParams);  
                    }
                },{
                    xtype: 'button',
                    id: "analytic_view",
                    iconCls: 'analytic-view-button',
                    text: this.analyticViewButton,
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
                },' ',{
                    xtype:'displayfield',
                    id:'warning_message'
                },'->',{
                    xtype: 'button',
                    id: "targets_view",
                    iconCls: 'analytic-view-button',
                    text: this.targetsTextBotton,
                    scope: this,
                    toggleGroup: 'analytic_buttons',
                    enableToggle: true,
                    pressed: true,
                    disabled:true,
                    handler: function(btn) {
                        var wfsGrid = Ext.getCmp("featuregrid");
                        wfsGrid.setCurrentPanel('targets');
                        this.loadTargetGrids();
                    }
                },{
                    xtype: 'button',
                    id: "areaDamage_view",
                    iconCls: 'analytic-view-button',
                    text: this.areaDamageTextBotton,
                    scope: this,
                    toggleGroup: 'analytic_buttons',
                    enableToggle: true,
                    disabled:true,
                    handler: function(btn) {
                        var wfsGrid = Ext.getCmp("featuregrid");
                        wfsGrid.setCurrentPanel('damage');                        
                        this.loadDamageGrid();
                    }
                },{
                    xtype: 'button',
                    id: "roadGraph_view",
                    iconCls: 'analytic-view-button',
                    text: this.roadGraphTextBotton,
                    scope: this,
                    toggleGroup: 'analytic_buttons',
                    enableToggle: true,
                    disabled:true,
                    handler: function(btn) {
                        var wfsGrid = Ext.getCmp("featuregrid");
                        wfsGrid.setCurrentPanel('roads');
                        this.loadRoadsGrid();
                        /*var wfsGrid = Ext.getCmp("featuregrid");
                        var viewParams;
                        wfsGrid.setCurrentPanel(this.simulationEnabled ? 'roads_edit' : 'roads');
                        
                        if(this.simulationEnabled) {
                            var map = this.target.mapPanel.map;        
                            var status = this.getStatus();        
                            var bounds = this.getBounds(null, map);
                            viewParams = "bounds:" + bounds;                        
                        }
                        this.loadRoadsGrid(viewParams);            */
                    }
                }];        
        
        //add analytic button toolbar to mapPanelContainer        
        var mapPanelContainer = Ext.getCmp("mapPanelContainer_id");
        var mapPanelContainerBbar = mapPanelContainer.getBottomToolbar();
        mapPanelContainerBbar.add(this.mapBbar);
        mapPanelContainer.doLayout(false,true);

        config = Ext.apply(panel, config || {});
        
        this.controlPanel = gxp.plugins.SyntheticView.superclass.addOutput.call(this, config);
        
        if(this.outputTarget)
            Ext.getCmp(this.outputTarget).setActiveTab(this.controlPanel);
        
        this.target.mapPanel.map.events.register('zoomend', this, function(){
            var scale = this.getMapScale();
            if(this.simulationEnabled) {
                var simMsg = this.simMsg;
                //if(scale <= this.analiticViewScale && !this.simulationLoaded) {
                if(scale <= this.analiticViewScale && !this.simulationLoaded) {
                    this.simulationLoaded = true;
                    var wfsGrid = Ext.getCmp("featuregrid");
                    var viewParams;
                    
                    var status = this.getStatus();        
                    var bounds = this.getBounds(null, this.target.mapPanel.map);
                    viewParams = "bounds:" + bounds;                        
                    wfsGrid.loadGrids(null, null, this.selectionLayerProjection, viewParams);  
                    simMsg = '';
                    Ext.getCmp('warning_message').setValue(simMsg);                    
                }else if(scale <= this.analiticViewScale){
                    Ext.getCmp("refresh_grid").enable();
                    simMsg = '';
                    Ext.getCmp('warning_message').setValue(simMsg);
                }else{
                    Ext.getCmp("refresh_grid").disable();
                    Ext.getCmp('warning_message').setValue(simMsg);
                }
            } else {
                if(scale <= this.analiticViewScale && this.processingDone) {
                    Ext.getCmp("analytic_view").enable();  
                } else {
                    Ext.getCmp("analytic_view").disable();
                }
            }
            var msg = '';
            if(this.status && this.status.formulaInfo) {
                if(scale <= this.cellViewScale && this.status.formulaInfo.dependsOnArcs && !this.status.formulaInfo.visibleOnArcs) {
                    msg = this.notVisibleOnArcsMessage;
                } else if(scale > this.cellViewScale && this.status.formulaInfo.dependsOnArcs && !this.status.formulaInfo.visibleOnGrid) {
                    msg = this.notVisibleOnGridMessage;
                }
            }
            if(Ext.getCmp("analytic_view") && !this.simulationEnabled){
                Ext.getCmp('warning_message').setValue(msg);
            }
        });
        
        this.target.mapPanel.map.events.register('moveend', this, function(){
            var scale = this.getMapScale();
            if(this.simulationEnabled) {
                if(scale <= this.analiticViewScale){
                    Ext.getCmp("refresh_grid").enable();
                }
            }
        });
        
        return this.controlPanel;
    },
    
    /*loadRoadsGrid: function() {
        var wfsGrid = Ext.getCmp("featuregrid");
        
        var map = this.target.mapPanel.map;        
        var status = this.getStatus();        
       
        
        var status = this.status;
        var targetId = this.getChosenTarget(status);            
        var me = this;
        
        var riskProcess = this.wpsClient.getProcess('destination', 'gs:RiskCalculator');  
        var bounds;
        if(status && status.roi) {
            bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
        } else {
            bounds = map.getExtent();
        }         
        
        var filter = new OpenLayers.Filter.Spatial({ 
          type: OpenLayers.Filter.Spatial.BBOX,
          property: 'geometria',
          value: bounds, 
          projection: map.getProjection() 
       });
        wfsGrid.getEl().mask(this.loadMsg);
        //riskProcess.describe({callback: function() {
            //riskProcess.setResponseForm([{}], {supportedFormats: {'application/json':true}});
        riskProcess.execute({
            // spatial input can be a feature or a geometry or an array of
            // features or geometries
            inputs: {
                features: new OpenLayers.WPSProcess.ReferenceData({
                    href:'http://geoserver/wfs', 
                    method:'POST', mimeType: 'text/xml', 
                    body: {
                        wfs: {
                            featureType: 'destination:siig_geo_ln_arco_1', 
                            version: '1.1.0',
                            filter: filter
                        }
                    }
                }),
                store: new OpenLayers.WPSProcess.LiteralData({value:this.wpsStore}),
                processing: new OpenLayers.WPSProcess.LiteralData({value:status.processing}),
                formula: new OpenLayers.WPSProcess.LiteralData({value:status.formula}),
                target: new OpenLayers.WPSProcess.LiteralData({value:targetId}),
                materials: new OpenLayers.WPSProcess.LiteralData({value:status.sostanza.id.join(',')}),
                scenarios: new OpenLayers.WPSProcess.LiteralData({value:status.accident.id.join(',')}),
                entities: new OpenLayers.WPSProcess.LiteralData({value:status.seriousness.id.join(',')}),
                severeness: new OpenLayers.WPSProcess.LiteralData({value:status.formulaInfo.dependsOnTarget ? status.target.severeness : '0'}),
                fp: new OpenLayers.WPSProcess.LiteralData({value:status.temporal.value})
            },
            outputs: [new OpenLayers.WPSProcess.Output({
                mimeType: 'application/json'
            })],
            type: "raw",
            success: function(json) {
                wfsGrid.getEl().unmask();
                wfsGrid.loadGridsFromJson(undefined, undefined, {"ARCHI": Ext.decode(json)}, status);
            }
        }); 
        //}});
        
        
        
    },*/
    
    loadRoadsGrid: function(viewParams) {
        if(!viewParams) {
            var map = this.target.mapPanel.map;        
            var status = this.getStatus();        
            var bounds = this.getBounds(status, map);
            
            viewParams = "bounds:" + bounds;
        }
        var wfsGrid = Ext.getCmp("featuregrid");
        wfsGrid.loadGrids(null, null, this.selectionLayerProjection, viewParams);                                
    },
    
    loadDamageGrid: function() {       
        var wfsGrid = Ext.getCmp("featuregrid");
        
        var map = this.target.mapPanel.map;        
        var status = this.getStatus();                
        
        /*var viewParams = "bounds:" + bounds;
        wfsGrid.loadGrids(undefined, undefined, this.selectionLayerProjection, viewParams);*/
        
        var status = this.status;
        var targetId = this.getChosenTarget(status);            
        var me = this;
        
        if(status.processing === 4) {
            // damage calculus
            var json = {type: "FeatureCollection", features:[]};
            json.features.push({
                geometry: JSON.parse(new OpenLayers.Format.GeoJSON().write(status.damageAreaGeometry)),
                id: "5",
                type: "Feature",
                properties: {
                    name: "Area di danno",
                    distance: 0
                }
            });
            
             wfsGrid.loadGridsFromJson(undefined, undefined, {"DAMAGEAREA": json}, status);
        } else {
            var riskProcess = this.wpsClient.getProcess('destination', 'ds:MultipleBuffer');  
        
            var bounds;
            if(status && status.roi) {
                bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
            } else {
                bounds = map.getExtent();
            }   
            
            var radius = this.getRadius();
            var distances = [];
            var distanceNames = [];
            if(radius.radiusNotHum) {
                distances.push(new OpenLayers.WPSProcess.LiteralData({value: radius.radiusNotHum}));
                distanceNames.push(new OpenLayers.WPSProcess.LiteralData({value: 'ambientale'}));
            }
            if(radius.radiusHum) {
                for(var i=0; i<radius.radiusHum.length; i++) {
                    if(radius.radiusHum[i]) {
                        distances.push(new OpenLayers.WPSProcess.LiteralData({value: radius.radiusHum[i]}));
                        distanceNames.push(new OpenLayers.WPSProcess.LiteralData({value: 'sociale' + i}));
                    }
                }
            }
            
            var filter = new OpenLayers.Filter.Spatial({ 
              type: OpenLayers.Filter.Spatial.BBOX,
              property: 'geometria',
              value: bounds, 
              projection: map.getProjection() 
            });
            wfsGrid.getEl().mask(this.loadMsg);
            //riskProcess.describe({callback: function() {
                //riskProcess.setResponseForm([{}], {supportedFormats: {'application/json':true}});
            riskProcess.execute({
                // spatial input can be a feature or a geometry or an array of
                // features or geometries
                inputs: {
                    features: new OpenLayers.WPSProcess.ReferenceData({
                        href:'http://geoserver/wfs', 
                        method:'POST', mimeType: 'text/xml', 
                        body: {
                            wfs: {
                                featureType: 'destination:siig_geo_ln_arco_1', 
                                version: '1.1.0',
                                filter: filter
                            }
                        }
                    }),
                    distances: distances,
                    distanceNames: distanceNames
                },
                outputs: [new OpenLayers.WPSProcess.Output({
                    mimeType: 'application/json'
                })],
                type: "raw",
                success: function(json) {
                    wfsGrid.getEl().unmask();
                    var json = Ext.decode(json);
                    var refactoredJson = {type: "FeatureCollection", features:[]};
                    var geomPos = 1;
                    if(json.features.length > 0) {
                        var item = json.features[0];
                        
                        if(item.properties.ambientale) {
                            refactoredJson.features.push({
                                geometry: item.geometry,
                                id: "5",
                                type: "Feature",
                                properties: {
                                    name: me.severeness[GeoExt.Lang.getLocaleIndex()][4],
                                    distance: item.properties.ambientale
                                }
                            });
                            geomPos++;
                        }
                        for(var propName in item.properties) {
                            if(item.properties.hasOwnProperty(propName)) {
                                if(propName.indexOf('sociale') === 0) {
                                    var geometry = geomPos === 1 ? item.geometry : item.properties['geometria' + geomPos];
                                    var humPos = parseInt(propName.substring(7), 10);
                                    refactoredJson.features.push({
                                        geometry: geometry,
                                        id: humPos + 1,
                                        type: "Feature",
                                        properties: {
                                            name: me.severeness[GeoExt.Lang.getLocaleIndex()][humPos],
                                            distance: item.properties[propName]
                                        }
                                    });
                                    geomPos++;
                                }
                                
                            }
                        }
                    }
                    
                    wfsGrid.loadGridsFromJson(undefined, undefined, {"DAMAGEAREA": refactoredJson}, status);
                }
            }); 
        }
        
        
        //}});
        
        
        
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
        var selectionPrj = new OpenLayers.Projection(this.selectionLayerProjection);
        if(!mapPrj.equals(selectionPrj)){
            bounds = bounds.transform(
                mapPrj,    
                selectionPrj
            );
        }
    
        return bounds.toBBOX().replace(/,/g, "\\\,");
    },
    
    addTargets: function(layers, bounds, radius, extraTargets) { 
        
        var name = this.status.target ? this.status.target.layer : 'bersagli_all';
        var wkt;
        if(this.status.processing === 4) {
            bounds = '0,1,0,1'.replace(/,/g, "\\\,");
            wkt = this.status.damageArea.replace(/,/g, "\\\,");            
        } else {
            wkt = 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))'.replace(/,/g, "\\\,");
        }
        var targetViewParams = "bounds:" + bounds + ';distanzaumano:' + radius.maxHuman + ';distanza:' + radius.maxNotHuman + ';wkt:' + wkt;
        
        this.analyticViewLayers.push(name);
        this.analyticViewLayers.push(this.selectedTargetLayer);
        layers.push(this.createLayerRecord({
            name: name,
            title: this.targetLayerTitle[GeoExt.Lang.getLocaleIndex()], 
            params: {                                                                
                viewparams: targetViewParams
            }
        }, true, undefined));
        
        if(Ext.getCmp('targets_view').pressed) {
            Ext.getCmp('featuregrid').setCurrentPanel('targets');
            this.loadTargetGrids(targetViewParams, extraTargets);
        }   
            
    },
    
    loadTargetGrids: function(viewParams, extraTargets) {
        if(!viewParams) {
            var map = this.target.mapPanel.map;        
            var status = this.getStatus();        
            
            //DA VERIFICARE MEGLIO!!!
            if(!status) {
                this.status = this.processingPane.getInitialStatus();
                this.status.formulaDesc = this.totalRiskLabel;
                status = this.status;
            }
        
            var bounds = this.getBounds(status, map);
            var radius = this.getRadius();
            var wkt;
            if(this.status.processing === 4) {
                bounds = '0,1,0,1'.replace(/,/g, "\\\,");
                wkt = this.status.damageArea.replace(/,/g, "\\\,");            
            } else {
                wkt = 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))'.replace(/,/g, "\\\,");
            }
            viewParams = "bounds:" + bounds + ';distanzaumano:' + radius.maxHuman + ';distanza:' + radius.maxNotHuman + ';wkt:' + wkt;
        }
        if(!extraTargets && this.status) {
            extraTargets = this.status.simulation.targetsInfo;
        }
        var wfsGrid = Ext.getCmp("featuregrid");
        if(this.isSingleTarget()) {
            wfsGrid.loadGrids("id", this.status.target['id_bersaglio'], this.selectionLayerProjection, viewParams, null, extraTargets);                                
        } else if(this.isAllHumanTargets()) {
            wfsGrid.loadGrids("type", 'umano', this.selectionLayerProjection, viewParams, null, extraTargets);
        } else if(this.isAllNotHumanTargets()) {
            wfsGrid.loadGrids("type", 'ambientale', this.selectionLayerProjection, viewParams, null, extraTargets);
        } else {
            wfsGrid.loadGrids(null ,null , this.selectionLayerProjection, viewParams, null, extraTargets);
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
    
    addBuffers: function(layers, bounds, radius, bufferArea) {        
        var bufferLayerTitle =this.bufferLayerTitle[GeoExt.Lang.getLocaleIndex()];
        if(bufferArea) {
            layers.push(this.addDamageBuffer(bufferLayerTitle, bufferArea));
        } else {
            var viewParams = "bounds:" + bounds;
            
            //var buffer = this.getBufferSizeInPixels(radius.max);
            
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
        }
        
        if(Ext.getCmp('areaDamage_view').pressed) {
            Ext.getCmp('featuregrid').setCurrentPanel('damage');                        
            this.loadDamageGrid();
        }
    },
    
    
    
    /*addNotHumanRisk: function(layers, bounds) {    
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
                env:"low:"+this.status.themas['ambientale'][0]+";medium:"+this.status.themas['ambientale'][1]+";max:"+this.status.themas['ambientale'][2],
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
                env:"low:"+this.status.themas['sociale'][0]+";medium:"+this.status.themas['sociale'][1]+";max:"+this.status.themas['sociale'][2],
                riskPanel: true
            }
        }, true));
    },*/

    addVulnLayer: function(layers,layer,formulaDesc, group) {
        this.currentRiskLayers.push(layer);
        var group = group;
        var viewParams = "bounds:264455.272103\\,4889918.130753\\,594775.925407\\,5120964.085926;residenti:1;turistica:1;industria:1;sanitarie:1;scolastiche:1;commerciali:1;urbanizzate:0;boscate:0;protette:0;agricole:0;sotterranee:0;superficiali:0;culturali:0;sostanze:1\\,2\\,3\\,4\\,5\\,6\\,7\\,8\\,9\\,10;scenari:1\\,2\\,3\\,4\\,5\\,6\\,7\\,8\\,9\\,10\\,11;gravita:0\\,1";
        var env = "low:100;medium:500;max:1000;formula:32;target:98;materials:1,2,3,4,5,6,7,8,9,10;scenarios:1,2,3,4,5,6,7,8,9,10,11;entities:0,1;fp:fp_scen_centrale;processing:1";
        layers.push(this.createLayerRecord({
            name: layer,
            title: formulaDesc, 
            tiled: false,
            params: {                                                                
                viewparams: viewParams,
                env: env,
                defaultenv: env,
                riskPanel: true
            }
        }, true, undefined, undefined, group));
    },
    
    addFormula: function(layers, bounds, status, targetId, layer, formulaDesc, formulaUdm, env) {
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
        if(formulaUdm) {
            formulaDesc = formulaDesc + ' ' + formulaUdm;
        }
        var newEnv = this.getFormulaEnv(status, targetId);
        env = env ? env + ";" + newEnv : newEnv;
        layers.push(this.createLayerRecord({
            name: layer,
            title: formulaDesc, 
            tiled: false,
            params: {                                                                
                viewparams: viewParams,
                env: env,
                defaultenv: env,
                riskPanel: true
            }
        }, true, undefined, "SIIG"));
    },
    
    getFormulaEnv: function(status, targetId) {
        var env = "formula:"+status.formula+";target:"+targetId+";materials:"+status.sostanza.id.join(',')+";scenarios:"+status.accident.id.join(',')+";entities:"+status.seriousness.id.join(',')+";fp:"+status.temporal.value+";processing:"+status.processing;
        if(status.processing === 3) {
            var simulation = status.simulation;            
            env += ';pis:'+simulation.pis.join('_') + ';padr:'+simulation.padr.join('_') + ';cff:'+simulation.cff.join('_');
            env += ';changedTargets:' + (simulation.targetsRepositoryId ? simulation.targetsRepositoryId : simulation.targets.join('_'));
            env += ';distances:'+this.getBuffersList().join(',');
        }
        if(status.processing === 4) {
            env += ';damageArea:' + (status.damageAreaId ? status.damageAreaId : status.damageArea);
        }
        return env;
    },
    
    addRisk: function(layers, bounds, status) {                
        var env, envhum, envamb;
        
        if(this.isHumanTarget() || this.isAllHumanTargets() || this.isMixedTargets()) {
            env = "low:"+this.status.themas['sociale'][0]+";medium:"+this.status.themas['sociale'][1]+";max:"+this.status.themas['sociale'][2];
            envhum = env;
        }
        if(this.isNotHumanTarget() || this.isAllNotHumanTargets() || this.isMixedTargets()) {
            env = "low:"+this.status.themas['ambientale'][0]+";medium:"+this.status.themas['ambientale'][1]+";max:"+this.status.themas['ambientale'][2];
            envamb = env;
        }
        var mixedenv = this.getMixedFormulaEnv();
        
        if(status.formulaInfo.dependsOnTarget) {
            if(this.isSingleTarget()) {
                this.addFormula(layers, bounds, status, parseInt(status.target['id_bersaglio'], 10), this.formulaRiskLayer, status.formulaDesc, status.formulaUdm, env);                
            } else if(this.isAllHumanTargets()) {
                this.addFormula(layers, bounds, status, 98, this.formulaRiskLayer, status.formulaDesc, status.formulaUdm, env);
            } else if(this.isAllNotHumanTargets()) {
                this.addFormula(layers, bounds, status, 99, this.formulaRiskLayer, status.formulaDesc, status.formulaUdm, env);
            } else {
                this.addFormula(layers, bounds, status, 98, this.formulaRiskLayer, status.formulaDesc + ' ' + this.humanTitle, status.formulaUdm, envhum);
                this.addFormula(layers, bounds, status, 99, this.formulaRiskLayer, status.formulaDesc + ' ' + this.notHumanTitle, status.formulaUdm, envamb);                    
                this.addFormula(layers, bounds, status, 100, this.mixedFormulaRiskLayer, status.formulaDesc + ' ' + this.humanTitle + ' - ' + this.notHumanTitle, status.formulaUdm, mixedenv);
            }
        } else {
            this.addFormula(layers, bounds, status, parseInt(status.target['id_bersaglio'], 10), this.formulaRiskLayer, status.formulaDesc, status.formulaUdm, env);   
        }         
    },
    
    getMixedFormulaEnv: function() {
        return "lowsociale:"+this.status.themas['sociale'][0]+";mediumsociale:"+this.status.themas['sociale'][1]+";maxsociale:"+this.status.themas['sociale'][2]+";lowambientale:"+this.status.themas['ambientale'][0]+";mediumambientale:"+this.status.themas['ambientale'][1]+";maxambientale:"+this.status.themas['ambientale'][2];
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
        
        if(!status) {
            this.status = this.processingPane.getInitialStatus();
            this.status.formulaDesc = this.totalRiskLabel;
            status = this.status;
        }
        
        var bounds = this.getBounds(status, map);
        
        var radius = this.getRadius();
        
        var newLayers=[];
        
        
        // remove previous analytic view layers (targets and buffers)
        this.removeAnalyticViewLayers(map);                                
        
        // add the buffers layers
        this.addBuffers(newLayers, bounds, radius, status.processing === 4 ? status.damageArea : null);
        
        // add the target layer
        this.addTargets(newLayers, bounds, radius, status.simulation.targetsInfo);                
            
        if(Ext.getCmp('roadGraph_view').pressed) {
            Ext.getCmp('featuregrid').setCurrentPanel('roads');
            this.loadRoadsGrid();
        }   
        
        this.moveRiskLayersToTop(newLayers);

        // add analytic view layers to the map
        this.target.mapPanel.layers.add(newLayers);

        if(status.simulation.targetsInfo.length > 0) {
            this.addExtraTargets(map, status.simulation.targetsInfo);
        }
        
        
        // update info on buffers sizes     
        //this.results.setValue(this.getBuffersInfo());
        this.enableAnalyticView();
        
    },
    
    addExtraTargets: function(map, targets) {
        for(var count = 0; count< targets.length; count++) {
            var target = targets[count];
            var layerName = this.simulationChangedLayer; //"simulation_changed";
            if(target.removed) {
                layerName = this.simulationRemovedLayer; //"simulation_removed";
            } else if(target.newfeature) {
                layerName = this.simulationAddedLayer; //"simulation_added";
            }
            this.drawTargetGeometry(map, layerName, "target" + count, target.geometry, this.targetStyles[layerName]);
        }
    },
    
    getMapGeometry: function(map, geometry, sourceSRS){        
        if(geometry && sourceSRS) {
            if(sourceSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
                var targetColl=coll.transform(
                    new OpenLayers.Projection(sourceSRS),
                    map.getProjectionObject()
                    );
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        }
        return geometry;
    },
    

    
    drawTargetGeometry: function(map, layerName, id, geometry, style ){ //"Bersaglio Selezionato"
        
        var targetLayer = map.getLayersByName(layerName)[0];
        
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;       
                
        var layerStyle= style || {
            strokeColor: "#FF00FF",
            strokeWidth: 2,
            fillColor: "#FF00FF",
            fillOpacity: 0.8
        };
        if(!targetLayer) {
             targetLayer = new OpenLayers.Layer.Vector(layerName,{
                displayInLayerSwitcher: false,
                style: layerStyle,
                renderers: renderer
            });
                
            map.addLayer(targetLayer);
        }                
        
        
        if(geometry) {
            geometry = this.getMapGeometry(map, geometry, this.selectionLayerProjection);
            var feature = new OpenLayers.Feature.Vector(geometry,{
                "id": id
            });
            if(targetLayer.features.length == 0){
                targetLayer.addFeatures([feature]);
            }else{
                var oldFeature = targetLayer.getFeaturesByAttribute("id",id);
                if(oldFeature.length > 0){
                    targetLayer.removeFeatures(oldFeature);
                }
                targetLayer.addFeatures([feature]);
            }
        }
        return targetLayer;
    },
    
    enableAnalyticView: function() {        
        Ext.getCmp("south").expand();  
        if(Ext.getCmp("targets_view")) {
            Ext.getCmp("targets_view").enable();
        }
        if(Ext.getCmp("areaDamage_view")) {
            Ext.getCmp("areaDamage_view").enable();
        }
        if(Ext.getCmp("roadGraph_view")) {
            Ext.getCmp("roadGraph_view").enable();        
        }
        this.analyticEnabled = true;
    },
    
    disableSouthPanel: function() {     
        if(!Ext.getCmp("south").collapsed) {
            Ext.getCmp("south").collapse();  
        }
        if(Ext.getCmp("targets_view")) {
            Ext.getCmp("targets_view").disable();
        }
        if(Ext.getCmp("areaDamage_view")) {
            Ext.getCmp("areaDamage_view").disable();
        }
        if(Ext.getCmp("roadGraph_view")) {
            Ext.getCmp("roadGraph_view").disable();        
        } 
		if(Ext.getCmp("refresh_grid")) {
            Ext.getCmp("refresh_grid").disable();        
            Ext.getCmp("refresh_grid").hide();        
        }     
        Ext.getCmp("featuregrid").removeAllGrids();
        this.analyticEnabled = false;
        this.simulationEnabled = false;
    },
    
    enableDisableRoads: function(visibility) {
        var layer = this.getLayerByName(this.target.mapPanel.map, this.roadsLayer);
        layer.setVisibility(visibility);
    },
    
    doProcess: function(roi) {        
        if(this.simulationRestore) {
            for(var buttonId in this.simulationRestore.buttons) {
                if(this.simulationRestore.buttons.hasOwnProperty(buttonId)) {
                    var button = Ext.getCmp(buttonId);
                    var status = this.simulationRestore.buttons[buttonId];
                    button.toggle(status, true);
                }
            }
            this.simulationRestore = null;
        }
        var newLayers=[];
        
        var map = this.target.mapPanel.map;        
        var status = this.getStatus();        
        
        var bounds = this.getBounds(status, map);
        
        if(this.originalRiskLayers === null) {
            this.storeOriginalRiskLayers();
        }
        
        this.enableDisableRoads(!status.formulaInfo.dependsOnArcs);
        
        this.removeModifiedLayer(map);
        
        this.addModifiedFeatures(map,this.vectorLayers);
        
        this.removeRiskLayers(map);
        
        // remove analytic view layers (buffers, targets, selected targets)
        this.removeAnalyticViewLayers(map);     
        this.disableSouthPanel();        
        
        this.processingDone = true;
        
        Ext.getCmp('warning_message').setValue('');
        
        var scale = this.getMapScale();
        if(scale <= this.analiticViewScale) {
            Ext.getCmp("analytic_view").enable();
        }
        
        if(status.formulaInfo.dependsOnArcs) {
        
            var addRiskToMap = function() {
                this.addRisk(newLayers, bounds, status);
                
                this.target.mapPanel.layers.add(newLayers);
                if(roi) {
                    this.target.mapPanel.map.zoomToExtent(roi);
                }
                this.resultsContainer.removeAll();
            }
            var me = this;
            if(status.simulation.targets.length > 0 || status.damageArea) {                
                var repositoryProcess = this.wpsClient.getProcess('destination', 'gs:ProcessingRepository');                  
                var data = status.simulation.targets.length > 0 ? status.simulation.targets.join('_') : status.damageArea;
                
                repositoryProcess.execute({
                    inputs: {
                        store: new OpenLayers.WPSProcess.LiteralData({value:this.wpsStore}),
                        action: new OpenLayers.WPSProcess.LiteralData({value:'save'}),
                        user: new OpenLayers.WPSProcess.LiteralData({value:-1}),
                        clean: new OpenLayers.WPSProcess.LiteralData({value:true}),
                        data: new OpenLayers.WPSProcess.LiteralData({value:data})
                    },
                    outputs: [],
                    success: function(outputs) {                        
                        if(outputs.executeResponse.status.processSucceeded && outputs.executeResponse.processOutputs.length > 0) {
                            var key = Ext.decode(outputs.executeResponse.processOutputs[0].literalData.value);
                            if(status.simulation.targets.length > 0) {
                                status.simulation.targetsRepositoryId = key;
                            } else {
                                status.damageAreaId = key;
                            }
                            addRiskToMap.call(me);
                        } else {
                            Ext.Msg.show({
                                title: this.wpsTitle,
                                buttons: Ext.Msg.OK,                
                                msg: this.wpsError,
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            }); 
                        }
                    }
                });
            } else {
                addRiskToMap.call(this);
            }
            
        } else {
            // Create a process and configure it
            var riskProcess = this.wpsClient.getProcess('destination', 'gs:RiskCalculatorSimple');    
            var targetId = this.getChosenTarget(status);            
            var me = this;
            riskProcess.execute({
                // spatial input can be a feature or a geometry or an array of
                // features or geometries
                inputs: {
                    store: new OpenLayers.WPSProcess.LiteralData({value:this.wpsStore}),
                    processing: new OpenLayers.WPSProcess.LiteralData({value:status.processing}),
                    formula: new OpenLayers.WPSProcess.LiteralData({value:status.formula}),
                    target: new OpenLayers.WPSProcess.LiteralData({value:targetId}),
                    materials: new OpenLayers.WPSProcess.LiteralData({value:status.sostanza.id.join(',')}),
                    scenarios: new OpenLayers.WPSProcess.LiteralData({value:status.accident.id.join(',')}),
                    entities: new OpenLayers.WPSProcess.LiteralData({value:status.seriousness.id.join(',')}),
                    severeness: new OpenLayers.WPSProcess.LiteralData({value:status.formulaInfo.dependsOnTarget ? status.target.severeness : '0'}),
                    fp: new OpenLayers.WPSProcess.LiteralData({value:status.temporal.value})
                },
                outputs: [],
                success: function(outputs) {
                    if(outputs.executeResponse.status.processSucceeded && outputs.executeResponse.processOutputs.length > 0) {
                        var data = Ext.decode(outputs.executeResponse.processOutputs[0].literalData.value);
                        me.fillFormulaResults(status.formulaDesc, data);
                        
                    } else {
                        Ext.Msg.show({
                            title: this.wpsTitle,
                            buttons: Ext.Msg.OK,                
                            msg: this.wpsError,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        }); 
                    }
                }
            });            
            //
        }
    },
    fillFormulaResults: function(formulaTitle, result) {
        /*var html  = '<h2>' + formulaTitle + '</h2>';
        html     += '<div id="synthetic-results-table"></div>';
        this.resultsContainer.update(html);*/
        
        var data =[];
        for(var i = 0; i < result.targets.length; i++) {
            var targetObj = result.targets[i];            
            for(var j = 0; j < targetObj.scenarios.length; j++) {
                var scenarioObj = targetObj.scenarios[j];
                for(var k = 0; k < scenarioObj.severeness.length; k++) {  
                    var severenessObj = scenarioObj.severeness[k];
                    var severenessDesc = this.severeness[GeoExt.Lang.getLocaleIndex()][parseInt(severenessObj.id, 10)-1];
                    data.push([targetObj.id+'.'+scenarioObj.id+'.'+severenessObj.id,this.status.target.description[targetObj.id], this.status.accident.description[scenarioObj.id], severenessDesc, severenessObj.risk[0]]);                
                }
                
            }
        }
        
        var columns = [];
        
        if(result.targets.length > 1) {
            columns.push({header: this.targetLabel, width: 150, dataIndex: 'target'});            
        }
        if(result.targets[0].scenarios.length > 1) {
            columns.push({header: this.accidentLabel, width: 150, dataIndex: 'scenario'});            
        }
        if(result.targets[0].scenarios[0].severeness.length > 1) {
            columns.push({header: this.severenessLabel, width: 150, dataIndex: 'severeness'});            
        }
        columns.push({header: formulaTitle, width: 150, dataIndex: 'value'});
        var grid = new Ext.grid.GridPanel({
                store: new Ext.data.ArrayStore({
                fields: ['id','target', 'scenario', 'severeness', 'value'],
                data: data,
                idIndex: 0 // id for each record will be the first element
            }),
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 200,
                    sortable: true
                },
                columns: columns
            }),
            viewConfig: {
                forceFit: true
            },
            frame: true,
            title: formulaTitle,
            //width: 300,
            height: 150
        });
        
        this.resultsContainer.removeAll();
        this.resultsContainer.add(grid);
        this.resultsContainer.doLayout();
        
        
        
        /*if(result.targets.length > 1) {                
            html += '<th>' + this.targetLabel + '</th>';
        }
        if(result.targets[0].scenarios.length > 1) {                
            html += '<th>' + this.accidentLabel + '</th>';
        }
        html += '<th>' + formulaTitle + '</th><tr>';
        for(var i = 0; i < result.targets.length; i++) {
            var targetObj = result.targets[i];
            
            for(var j = 0; j < targetObj.scenarios.length; j++) {
                var currentValue = '';
                var scenarioObj = targetObj.scenarios[j];
                if(result.targets.length > 1) {   
                    currentValue += '<td>' + this.status.target.description[targetObj.id] + '</td>';
                }
                if(result.targets[i].scenarios.length > 1) {                
                    currentValue += '<td>' + this.status.accident.description[scenarioObj.id] + '</td>';
                }
                currentValue += '<td>' + scenarioObj.risk[0] + '</td>';
                html += '<tr>' + currentValue + '</tr>';
            }
        }
        
        html     += '</table>';
        this.results.setValue(html);  
        var grid = new Ext.ux.grid.TableGrid("synthetic-results-table", {
            stripeRows: true // stripe alternate rows
        });
        grid.render();    */    
    },
    
    getMapScale: function() {
        return Math.round(this.target.mapPanel.map.getScale());        
    },
    
    getChosenTarget: function(status) {
        if(status.formulaInfo.dependsOnTarget) {
            if(this.isSingleTarget()) {
                return parseInt(status.target['id_bersaglio'], 10);                
            } else if(this.isAllHumanTargets()) {
                return 98;
            } else if(this.isAllNotHumanTargets()) {
                return 99;
            } else {
                return 100;
            }
        } else {
            return parseInt(status.target['id_bersaglio'], 10);   
        }
    },
    
    removeAnalyticViewLayers: function(map) {
        this.removeLayersByName(map,this.analyticViewLayers);
        this.analyticViewLayers = [];
    },        
    
    removeRiskLayers: function(map) {
        this.removeLayersByName(map,this.currentRiskLayers);
        this.removeLayersByName(map,this.vectorLayers);
        this.currentRiskLayers = [];
    },

    removeModifiedLayer: function(map) {
        this.removeLayersByName(map,this.modifiedLayer);
    
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
    
    getBuffersList: function() {
        var radius = this.getRadius();
        var allRadius = [];
        if(radius.radiusNotHum && radius.radiusNotHum > 0) {
            allRadius.push(radius.radiusNotHum);
        }
    
        if(typeof(radius.radiusHum) !== "undefined") {
            var radiusHum = this.normalizeRadius(radius.radiusHum);
            if(radiusHum.length > 0) {
                allRadius=allRadius.concat(radiusHum);
            }
        }
        return allRadius;
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
        
        //this.weather.setValue(this.status.weather);
        this.temporal.setValue(this.status.temporal.name);
        
        this.extent.setValue(this.status.roi.label);
        this.trg.setValue(this.status.target.name);
        this.adrClass.setValue(this.status.classe.name);
        this.substance.setValue(this.status.sostanza.name);
        this.accident.setValue(this.status.accident.name);
        this.seriousness.setValue(this.status.seriousness.name);
        this.results.setValue('');        
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
