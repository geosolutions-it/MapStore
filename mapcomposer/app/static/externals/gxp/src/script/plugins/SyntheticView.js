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
    elabLabel: "Tipo elaborazione",
    formLabel: "Formula",
    extentLabel: "Ambito territoriale",
    targetLabel: "Tipo bersaglio",
    accidentLabel: "Incidente",
    fieldSetTitle: "Elaborazione",
    // End i18n.
        
    id: "syntheticview",
    
    layerSourceName: "destination",    
    
    selectionLayerName: "geosolutions:aggregated_data_selection",
    selectionLayerTitle: "ElaborazioneStd",         
    //selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
    selectionLayerProjection: "EPSG:32632",
    
    bufferLayerName: "geosolutions:siig_aggregation_1_buffer",
    targetLayerName: "geosolutions:bersagli",
    bufferLayerTitle: "Aree di danno",    
    targetLayerTitle: "Bersagli", 
    
    currentBufferLayers: [],
    
    formulaLayerTitle: "Rischio Totale",
    
    layerImageFormat: "image/png8",
    
    geometryName: "geometria",
    accidentTipologyName: "tipologia",
    
    analiticViewScale: 17070,
    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.SyntheticView.superclass.constructor.apply(this, arguments);            
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
                selectionLayerProjection: this.selectionLayerProjection,
                maxROIArea: 197807718.7307968
            });
        },this);        
     },
    
    /** private: method[createLayerRecord]
     *   :arg config: ``Object``
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
        
        var index = this.layerSource.store.findExact("name", config.name);
        if (index > -1) {
            var layerRecord = this.layerSource.store.getAt(index);
        
            // data for the new record
            var data = Ext.applyIf({
                title: config.title, 
                name: config.name,                
                layer: layer
            }, layerRecord.data);
                        

            var Record = GeoExt.data.LayerRecord.create(layerRecord.fields);
            return new Record(data, layer.id);
        }
        return null;
    },
    
    isHumanTarget: function() {
        return this.status.target === 'Popolazione residente';
    },
    
    isNotHumanTarget: function() {
        return this.status.target !== 'Tutti i Bersagli' && this.status.target !== 'Popolazione residente';
    },
    
    isMixedTargets: function() {
        return this.status.target === 'Tutti i Bersagli';
    },
    
    
    addHumanTargetBuffer: function(layers,seriousness,title) {        
        var distancesBySeriousness={
            'Lieve':[30,42,48,58],
            'Grave':[75,109,125,138]
        };
        var distances = distancesBySeriousness[seriousness];

        this.currentBufferLayers.push(title);
        
        return this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_human',
                buffer: 100,
                env:'elevata:'+distances[0]+';inizio:'+distances[1]+';irreversibili:'+distances[2]+';reversibili:'+distances[3]
            }
        });                
    },
    
    addNotHumanTargetBuffer: function(layers,seriousness,title) {        
        var distancesBySeriousness={
            'Lieve':8,
            'Grave':25
        };
             
        this.currentBufferLayers.push(title);
             
        return layer = this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_nothuman',
                buffer: 100,
                env:'distance:'+distancesBySeriousness[seriousness]
            }
        });        
    },
    
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
     */
    addOutput: function(config) {
        
        this.elab = new Ext.form.TextField({
              fieldLabel: this.elabLabel,
              id: "elab",
              width: 150,
              readOnly: true,
              value: "Elaborazione Standard",
              hideLabel : false                    
        });
        
        this.form = new Ext.form.TextField({
              fieldLabel: this.formLabel,
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
        
        this.accident = new Ext.form.TextField({
              fieldLabel: this.accidentLabel,
              id: "accedent",
              width: 150,
              readOnly: true,
              value: "Tutti gli incidenti",
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
                 this.accident
            ],
            buttons: [{
                text: "Esegui Elaborazione",
                iconCls: 'elab-button',
                scope: this,
                handler: function(){        
                    var map = this.target.mapPanel.map;
                    
                    this.removeLayers(map,[this.targetLayerTitle,"Bersaglio Selezionato"]);
                    this.removeBufferLayers(map);
                                        
                    //var analyticButton = Ext.getCmp("analytic_view").disable();                    
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
                        text: 'Visualizazione Analitica',
                        iconCls: 'analytic-view-button',
                        disabled: true,
                        id: "analytic_view",
                        scope: this,
                        handler: function(){                            
                            var featureManager = this.target.tools["featuremanager"];
                            
                            var map = this.target.mapPanel.map;
                            
                            //
                            // Get the status status
                            //
                            var status = this.getStatus();
                            
                            //
                            // Manage the OGC filter
                            //
                            var ogcFilterString;
                            var filter;
                            var targetName;
                            if(status && status.target){
                                var target = status.target;
                                //alert(target);
                        
                                if(target != 'Tutti i Bersagli'){
                                    targetName = status.targetName;
                                    filter = new OpenLayers.Filter.Comparison({
                                       type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                       property: "tipobersaglio",
                                       value: target
                                    });
                                    
                                    var filterFormat = new OpenLayers.Format.Filter();
                                    ogcFilterString = filterFormat.write(filter);  
                                    
                                    var xmlFormat = new OpenLayers.Format.XML();                  
                                    ogcFilterString = xmlFormat.write(ogcFilterString);
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
                                    tipologia = status.accident;
                                    //alert(topologia);
                                    viewParams += ";tipologia:" + tipologia; 
                                }
                            }
                            
                            var seriousness='Grave';
                            if(status && status.seriousness){                                
                                if(status.seriousness != 'Tutte le entità'){
                                    seriousness = status.seriousness;                                    
                                }
                            }

                            //alert(viewParams);
                            this.removeLayers(map,[this.targetLayerTitle]);                            
                            this.removeBufferLayers(map);
                            
                            var newLayers=[this.createLayerRecord({
                                name: this.targetLayerName,
                                title: this.targetLayerTitle, 
                                params: {                                                                
                                    viewparams: viewParams,                                    
                                    filter: ogcFilterString ? ogcFilterString : ''
                                }
                            })];
                            
                            if(!this.status || this.isMixedTargets()) {
                                newLayers.push(this.addHumanTargetBuffer(newLayers,seriousness,this.bufferLayerTitle+' (Bersagli umani)'));
                                newLayers.push(this.addNotHumanTargetBuffer(newLayers,seriousness,this.bufferLayerTitle+' (Bersagli ambientali)'));
                            } else if(this.isHumanTarget()) {
                                newLayers.push(this.addHumanTargetBuffer(newLayers,seriousness,this.bufferLayerTitle+' ('+targetName+')'));                                
                            } else if(this.isNotHumanTarget()) {
                                newLayers.push(this.addNotHumanTargetBuffer(newLayers,seriousness,this.bufferLayerTitle+' ('+targetName+')'));                                
                            }
                            
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
                            var fgrid = Ext.getCmp("featuregrid");
                            var store = fgrid.getStore();
                            
                            store.resetTotal();
                            store.removeAll();
                            
                            var query = ogcFilterString;
                            
                            var params = {
                                startindex: 0,          
                                maxfeatures: 10,
                                sort: "id_tema"
                            };
                            
                            if(query){
                                store.setBaseParam("filter", query);
                                store.setBaseParam("srsName", this.selectionLayerProjection);
                            }
                            
                            if(viewParams){
                                store.setBaseParam("viewParams", viewParams);
                            }
                            
                            var south = Ext.getCmp("south").expand();
        
                            store.load({
                                params: params
                            });
                        }
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
            var scale = Math.round(scale);
            
            if(scale <= this.analiticViewScale) {
                Ext.getCmp("analytic_view").enable();
            } else {
                Ext.getCmp("analytic_view").disable();
            }
        });
        
        return this.controlPanel;
    },
    
    removeBufferLayers: function(map) {
        this.removeLayers(map,this.currentBufferLayers);
        this.currentBufferLayers = [];
    },
    
    getControlPanel: function(){
        return this.controlPanel;
    },
    
    setStatus: function(s){
        this.status = s;
        this.elab.setValue(this.status.processing);
        this.form.setValue(this.status.form);
        this.extent.setValue(this.status.roi.label);
        this.trg.setValue(this.status.target);
        this.accident.setValue(this.status.accident);
        
        //
        // Allow the Analytic visualizzation functionalities
        //
        //Ext.getCmp("analytic_view").enable();
    },
    
    getStatus: function(){
        return this.status;
    }
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
