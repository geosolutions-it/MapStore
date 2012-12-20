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
    fieldSetTitle: "Elaborazione Standard",
    // End i18n.
        
	id: "syntheticview",
	
	selectionLayerName: "geosolutions:aggregated_data_selection",
	selectionLayerTitle: "ElaborazioneStd", 		
	selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
	selectionLayerProjection: "EPSG:32632",
	
	geometryName: "geometria",
	accidentTipologyName: "tipologia",
	
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.SyntheticView.superclass.constructor.apply(this, arguments);		
		this.processingPane = new gxp.plugins.StandardProcessing({
			outputTarget: this.outputTarget,
			geometryName: this.geometryName,
			accidentTipologyName: this.accidentTipologyName,
			selectionLayerName: this.selectionLayerName,
			selectionLayerTitle: this.selectionLayerTitle, 		
			selectionLayerBaseURL: this.selectionLayerBaseURL,
			selectionLayerProjection: this.selectionLayerProjection
		});
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
				scope: this,
				handler: function(){	
                    var map = this.target.mapPanel.map;		
					
				    var bersagli = map.getLayersByName("BersagliWMS")[0];
					if(bersagli)
						map.removeLayer(bersagli);
					var bufferArchi = map.getLayersByName("BufferArchi")[0];
					if(bufferArchi)
						map.removeLayer(bufferArchi);
						
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
						disabled: false,
						id: "analytic_view",
						scope: this,
						handler: function(){
							var featureManager = this.target.tools["featuremanager"];
							
							var map = this.target.mapPanel.map;
							//map.zoomToScale(17061);
							
							//
							// Get the status status
							//
							var status = this.getStatus();
							var target = status.target;
							//alert(target);
							
							//
							// Manage the OGC filter
							//
							var ogcFilterString;
							if(target != 'Tutti i Bersagli'){
								var filter = new OpenLayers.Filter.Comparison({
								   type: OpenLayers.Filter.Comparison.EQUAL_TO,
								   property: "descrizione_clc",
								   value: target
								});
								
								var filterFormat = new OpenLayers.Format.Filter();
								ogcFilterString = filterFormat.write(filter);  
								
								var xmlFormat = new OpenLayers.Format.XML();                  
								ogcFilterString = xmlFormat.write(ogcFilterString);
							}

							//
							// Manage VIEWPARAMS
							//	
							var viewParams = '';
							
							var bounds = new OpenLayers.Bounds.fromString(status.roi.bbox.toBBOX());
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
							if(status.accident != 'Tutti gli Incidenti'){
								tipologia = status.accident;
								//alert(topologia);
								viewParams += ";tipologia:" + tipologia; 
							}

							//alert(viewParams);
							
							var bersagli = map.getLayersByName("BersagliWMS")[0];
							var bufferArchi = map.getLayersByName("BufferArchi")[0];
							
							if(bersagli && bufferArchi){
								map.removeLayer(bersagli);
								map.removeLayer(bufferArchi);
							}else{
								var bufferArchi = new OpenLayers.Layer.WMS(
									"BufferArchi", 		
									"http://localhost:8080/geoserver/wms",
									{
										layers: "geosolutions:siig_aggregation_1_buffer", 
										transparent: true, 
										format: "image/png"
									},
									{
										isBaseLayer: false,
										singleTile: false,
										displayInLayerSwitcher: false
									}
								);
								var bersagli = new OpenLayers.Layer.WMS(
									"BersagliWMS", 		
									"http://localhost:8080/geoserver/wms",
									{
										layers: "geosolutions:bersagli", 
										transparent: true, 
										format: "image/png",
										viewparams: viewParams,
										filter: ogcFilterString ? ogcFilterString : ''
									},
									{
										isBaseLayer: false,
										singleTile: false,
										displayInLayerSwitcher: false
									}
								);
						
								map.addLayers([bufferArchi, bersagli]);
							}
							/*else{
								bersagli.mergeNewParams({
									viewparams: viewParams,
									filter: ogcFilterString ? ogcFilterString : '',
									d: new Date().getMilliseconds()
								});
							}*/
							
							/*var appMask = new Ext.LoadMask(Ext.getBody(), {msg: "Caricamento Bersagli in corso ..."});
							appMask.show();
							
							var south = Ext.getCmp("south").expand();*/
							featureManager.loadFeatures(null, function(){
								//appMask.hide();
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
        
        return this.controlPanel;
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
		Ext.getCmp("analytic_view").enable();
	},
	
	getStatus: function(){
		return this.status;
	}
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
