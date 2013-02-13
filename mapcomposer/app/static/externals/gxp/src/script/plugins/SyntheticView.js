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
    
    analyticView: false,
    
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
                selectionLayerProjection: this.selectionLayerProjection/*,
                maxROIArea: 197807718.7307968*/
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
    
	isAllHumanTargets: function() {
		return this.status.targetName === 'Tutti i Bersagli Umani';
	},
	
	isAllNotHumanTargets: function() {
		return this.status.targetName === 'Tutti i Bersagli Ambientali';
	},
	
	isSingleTarget: function() {
		return this.status.targetName !== 'Tutti i Bersagli Umani'
			&& this.status.targetName !== 'Tutti i Bersagli Ambientali' 
			&& this.status.targetName !== 'Tutti i Bersagli';
	},
	
    isHumanTarget: function() {
        return this.status.targetType === 'umano';
    },
    
    isNotHumanTarget: function() {
        return this.status.targetType === 'ambientale';
    },
    
    isMixedTargets: function() {
        return this.status.targetType === 'mixed';
    },
    
    
    addHumanTargetBuffer: function(layers,/*seriousness*/distances,title) {    
       
        /*var distancesBySeriousness={
            'Lieve':[30,42,48,58],
            'Grave':[75,109,125,138]
        };
        var distances = distancesBySeriousness[seriousness];*/

        this.currentBufferLayers.push(title);
        
        return this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_human',
                buffer: 200,
                env:'elevata:'+distances[0]+';inizio:'+distances[1]+';irreversibili:'+distances[2]+';reversibili:'+distances[3]
            }
        });                
    },
    
    addNotHumanTargetBuffer: function(layers,/*seriousness*/distances,title) {    
        
       /* var distancesBySeriousness={
            'Lieve':8,
            'Grave':25
        };*/
        
        this.currentBufferLayers.push(title);
             
        return this.createLayerRecord({
            name: this.bufferLayerName,
            title: title,
            params: {
                styles: 'aggregation_selection_buffer_nothuman',
                buffer: 100,
                env:'distance:'+distances/*distancesBySeriousness[seriousness]*/
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
    /*
    loadGrid: function(fgrid, query, viewParams) {        
        var store = fgrid.getStore();
        
        store.resetTotal();
        store.removeAll();
                        
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
        
        

        store.load({
            params: params
        });
    },*/
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        var me= this;
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
                    
                    /*var extent=map.getExtent().clone();
                    me.processingPane.setAOI(extent);                    
                    me.processingPane.removeAOILayer(map);*/
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
                        listeners: {
                            enable: function(){
                                me.analyticView= true;
                            },
                            disable: function(){
                                me.analyticView= false;
                            }
                        },
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
                            //var ogcFilterString;
                            var filter;
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
							
							var targetLayer = 'bersagli_all';
							if(status && status.targetLayer) {
								targetLayer = status.targetLayer;
							}

                            //alert(viewParams);
                            this.removeLayers(map,[this.targetLayerTitle]);                            
                            this.removeBufferLayers(map);
                            
                            var newLayers=[];
                            var dist= this.getRadius();
                            
                            if(!this.status || this.isMixedTargets()) {
                                newLayers.push(this.addHumanTargetBuffer(newLayers,/*seriousness*/dist.radiusHum,this.bufferLayerTitle+' (Bersagli umani)'));
                                newLayers.push(this.addNotHumanTargetBuffer(newLayers,/*seriousness*/dist.radiusNotHum,this.bufferLayerTitle+' (Bersagli ambientali)'));
                            } else if(this.isHumanTarget()) {
                                newLayers.push(this.addHumanTargetBuffer(newLayers,/*seriousness*/dist.radiusHum,this.bufferLayerTitle+' ('+targetName+')'));                                
                            } else if(this.isNotHumanTarget()) {
                                newLayers.push(this.addNotHumanTargetBuffer(newLayers,/*seriousness*/dist.radiusNotHum,this.bufferLayerTitle+' ('+targetName+')'));                                
                            }
                            
                            newLayers.push(this.createLayerRecord({
                                name: targetLayer,
                                title: this.targetLayerTitle, 
                                params: {                                                                
                                    viewparams: viewParams/*,                                    
                                    filter: ogcFilterString ? xmlFormat.write(ogcFilterString) : ''*/
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
								wfsGrid.loadGrids("title", this.status.targetName, this.selectionLayerProjection, viewParams);								
							} else if(this.isAllHumanTargets()) {
								wfsGrid.loadGrids("type", 'umano', this.selectionLayerProjection, viewParams);
							} else if(this.isAllNotHumanTargets()) {
								wfsGrid.loadGrids("type", 'ambientale', this.selectionLayerProjection, viewParams);
							} else {
								wfsGrid.loadGrids(null ,null , this.selectionLayerProjection, viewParams);
							}
                            /*var humanGrid = tabPanel.getItem('featuregridhuman');
                            var notHumanGrid = tabPanel.getItem('featuregridnothuman');
                            
                            var humanFilterString = filterFormat.write(new OpenLayers.Filter.Comparison({
                                   type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                   property: "tipobersaglio",
                                   value: this.status.target
                            }));
                            
                            var notHumanFilterString = filterFormat.write(new OpenLayers.Filter.Comparison({
                                   type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                                   property: "tipobersaglio",
                                   value: this.status.target
                            }));

                            if(!this.status || this.isMixedTargets()) {
                                tabPanel.unhideTabStripItem(humanGrid);
                                tabPanel.unhideTabStripItem(notHumanGrid);
                                this.loadGrid(humanGrid, xmlFormat.write(humanFilterString), viewParams);
                                this.loadGrid(notHumanGrid, xmlFormat.write(notHumanFilterString), viewParams);
                                tabPanel.setActiveTab(humanGrid);
                            } else if(this.isHumanTarget()) {
                                tabPanel.hideTabStripItem(notHumanGrid);
                                tabPanel.unhideTabStripItem(humanGrid);
                                this.loadGrid(humanGrid, xmlFormat.write(humanFilterString), viewParams);
                                tabPanel.setActiveTab(humanGrid);
                            } else if(this.isNotHumanTarget()) {
                                tabPanel.hideTabStripItem(humanGrid);
                                tabPanel.unhideTabStripItem(notHumanGrid);
                                this.loadGrid(notHumanGrid, xmlFormat.write(notHumanFilterString), viewParams);
                                tabPanel.setActiveTab(notHumanGrid);
                            }*/
                            Ext.getCmp("south").expand();
                            
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
            scale = Math.round(scale);
            
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
        var maxRadius={};

        if(this.isHumanTarget() || this.isMixedTargets())
            maxRadius.radiusHum=[-2,-2,-2,-2];
        
        if(this.isNotHumanTarget() || this.isMixedTargets())
            maxRadius.radiusNotHum=-2;

        this.parseSost(maxRadius);
        
        return maxRadius;
    },
    
    parseSost: function(maxRadius){
        var sost;
        if(this.processingPane.sostanzeCode == "0"){
           for (sost in this.processingPane.radiusData){
               this.parseAcc(sost,maxRadius);
           }
        }else{
           sost=this.processingPane.sostanzeCode;
           this.parseAcc(sost,maxRadius);
        }
    },
    
    parseAcc: function(sost,maxRadius){
        var acc;
        if(this.processingPane.accidentCode == "0"){
            for (acc in this.processingPane.radiusData[sost]){
                this.parseSer(sost,acc,maxRadius);
            }
           
        }else{
            acc=this.processingPane.accidentCode;
            this.parseSer(sost,acc,maxRadius);
        }
            
    },
    
    parseSer: function(sost,acc,maxRadius){
        var ser;
        if(this.processingPane.seriousnessCode == "0"){
            for (ser in this.processingPane.radiusData[sost][acc]){
                if(maxRadius.radiusHum)
                    this.setRadHum(this.processingPane.radiusData[sost][acc][ser].humans, maxRadius);
         
                if(maxRadius.radiusNotHum){
                    if(this.processingPane.selectedTargetCode != '-1')
                        this.setRadNotHum(
                            this.processingPane.radiusData[sost][acc][ser].notHumans[this.processingPane.selectedTargetCode],maxRadius, ser);
                    else
                        this.setRadNotHum(
                            this.processingPane.radiusData[sost][acc][ser].notHumans,maxRadius, ser);
            
                 }
            }
        }else{
            ser=this.processingPane.seriousnessCode;
            if(maxRadius.radiusHum)
               this.setRadHum(this.processingPane.radiusData[sost][acc][ser].humans, maxRadius);
         
            if(maxRadius.radiusNotHum){
               if(this.processingPane.selectedTargetCode != '-1')
                  this.setRadNotHum(
                        this.processingPane.radiusData[sost][acc][ser].notHumans[this.processingPane.selectedTargetCode],maxRadius, ser);
               else
                  this.setRadNotHum(
                      this.processingPane.radiusData[sost][acc][ser].notHumans,maxRadius, ser);
            
            }
        }
            
    },
    
    setRadNotHum: function(values, maxRadius, ser){
        var value;
        if(values instanceof Array){
            for(var i=0;i<values.length;i++){
                value= values[i];
                    if(value){
                        if(value == -1)
                            value= this.processingPane.holdValues[ser];
                            maxRadius.radiusNotHum=
                                    maxRadius.radiusNotHum >= value ? 
                                    maxRadius.radiusNotHum:
                                    value;
                    }  
           }        
        }else{
            value= values;
            if(value){
               if(value == -1)
                  value= this.processingPane.holdValues[ser];
                  maxRadius.radiusNotHum=
                            maxRadius.radiusNotHum >= value ? 
                            maxRadius.radiusNotHum: value;
            }
        }  
    },
    
    setRadHum: function(values, maxRadius){
        var value;
        for(var i=0;i<maxRadius.radiusHum.length;i++){
            value= values[i];
            if(value){
				if(value == -1) {
					value= this.getHumanDefaultValue(maxRadius.radiusHum, i);//get first element !=-1
				}
                maxRadius.radiusHum[i]=
                    maxRadius.radiusHum[i] >= value ?
                    maxRadius.radiusHum[i]: value;
            }
         }
    }
    
    
    
  

    
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
