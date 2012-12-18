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
            items:[
                this.fieldSet
            ]
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
	},
	
	getStatus: function(){
		return this.status;
	},
    
    /** private: method[makeSearchForm]
     *  :arg map: ``Object``
     */
    makeSearchForm: function(map){
        this.elab = new Ext.form.TextField({
              fieldLabel: this.elabLabel,
              id: "elab",
              width: 100,
              hideLabel : false                    
        });
        
        this.form = new Ext.form.TextField({
              fieldLabel: this.formLabel,
              id: "form",
              width: 100,
              hideLabel : false                    
        });
        
        this.extent = new Ext.form.TextField({
              fieldLabel: this.extentLabel,
              id: "extent",
              width: 100,
              hideLabel : false                    
        });
              
        this.target = new Ext.form.TextField({
              fieldLabel: this.targetLabel,
              id: "target",
              width: 100,
              hideLabel : false                    
        });
		
		this.accident = new Ext.form.TextField({
              fieldLabel: this.accidentLabel,
              id: "accedent",
              width: 100,
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
				 this.target,
				 this.accident
            ]
        });
        
        var panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            title: this.title,
            items:[
                this.fieldSet
            ]
        });
        
        return panel;
    }
});

Ext.preg(gxp.plugins.SyntheticView.prototype.ptype, gxp.plugins.SyntheticView);
