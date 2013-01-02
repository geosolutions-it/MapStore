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
	
	selectionLayerName: "geosolutions:aggregated_data_selection",
	selectionLayerTitle: "ElaborazioneStd", 		
	selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
	selectionLayerProjection: "EPSG:32632",
	
	bufferLayerName: "geosolutions:siig_aggregation_1_buffer",
	targetLayerName: "geosolutions:bersagli",
	bufferLayerTitle: "Aree di danno",//"BufferArchi",
	targetLayerTitle: "Bersagli", 
	layerImageFormat: "image/png8",
	
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
			selectionLayerProjection: this.selectionLayerProjection,
			maxROIArea: 197807718.7307968
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
				iconCls: 'elab-button',
				scope: this,
				handler: function(){	
                    var map = this.target.mapPanel.map;		
					
				    var bersagli = map.getLayersByName(this.targetLayerTitle)[0];
					if(bersagli)
						map.removeLayer(bersagli);
						
					var bufferArchi = map.getLayersByName(this.bufferLayerTitle)[0];
					if(bufferArchi)
						map.removeLayer(bufferArchi);
						
					var targetLayer = map.getLayersByName("Bersaglio Selezionato")[0];
					if(targetLayer)
						map.removeLayer(targetLayer);
						
					var analyticButton = Ext.getCmp("analytic_view").disable();					
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
							if(status && status.target){
								var target = status.target;
								//alert(target);
						
								if(target != 'Tutti i Bersagli'){
									filter = new OpenLayers.Filter.Comparison({
									   type: OpenLayers.Filter.Comparison.EQUAL_TO,
									   property: "descrizione_clc",
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

							//alert(viewParams);
							
							var bersagli = map.getLayersByName(this.targetLayerTitle)[0];
							var bufferArchi = map.getLayersByName(this.bufferLayerTitle)[0];
							
							if(bersagli && bufferArchi){
								map.removeLayer(bersagli);
								map.removeLayer(bufferArchi);
							}

							var bufferArchi = new OpenLayers.Layer.WMS(
								this.bufferLayerTitle, 		
								this.selectionLayerBaseURL,
								{
									layers: this.bufferLayerName, 
									transparent: true, 
									format: this.layerImageFormat
								},
								{
									isBaseLayer: false,
									singleTile: false,
									displayInLayerSwitcher: true
								}
							);
							
							var bersagli = new OpenLayers.Layer.WMS(
								this.targetLayerTitle, 		
								this.selectionLayerBaseURL,
								{
									layers: this.targetLayerName, 
									transparent: true, 
									format: this.layerImageFormat,
									viewparams: viewParams,
									filter: ogcFilterString ? ogcFilterString : ''
								},
								{
									isBaseLayer: false,
									singleTile: false,
									displayInLayerSwitcher: true
								}
							);
					
							map.addLayers([bufferArchi, bersagli]);
							
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
        
		/*this.target.mapPanel.map.events.register('zoomend', this, function(){
			var scale = this.target.mapPanel.map.getScale();
			var scale = Math.round(scale);
			
			if(scale <= 17061){
				Ext.getCmp("analytic_view").enable();
			}else if(scale > 17061){
				Ext.getCmp("analytic_view").disable();
			}
		});*/
		
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
