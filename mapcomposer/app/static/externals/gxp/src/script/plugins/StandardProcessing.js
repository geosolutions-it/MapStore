/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = StandardProcessing
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: StandardProcessing(config)
 *
 */   
gxp.plugins.StandardProcessing = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_layertree */
    ptype: "gxp_stdproc",

    // Begin i18n.
    title: "Elaborazione",
    elabLabel: "Tipo elaborazione",
    formLabel: "Formula",
    extentLabel: "Ambito territoriale",
    targetLabel: "tipo bersaglio",
	accidentLabel: "Incidente",
    fieldSetTitle: "Elaborazione Standard",
	northLabel:"Nord",
    westLabel:"Ovest",
    eastLabel:"Est",
    southLabel:"Sud",
    aioFieldSetTitle: "Ambito Terriroriale",
    setAoiText: "Seleziona Area",
    setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
    // End i18n.
        
	// TODO: bbox piemonte	
	spatialFilterOptions: {
		lonMax: 20037508.34,   
		lonMin: -20037508.34,
		latMax: 20037508.34,   
		latMin: -20037508.34  
    },	
	
	defaultBBOXFilterExtent: [735120.17754268, 5467346.1565839, 1028638.3661169, 5856257.7564448],
	
	toggleGroup: "toolGroup",
		
	outputTarget: null,
	
	syntheticView: "syntheticview",
	
	appTarget: null,
	
	geometryName: "the_geom",
	accidentTipologyName: "tipology",
	
	selectionLayerName: "geosolutions:aggregated_data_selection",
	selectionLayerTitle: "ElaborazioneStd", 		
	selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
	selectionLayerProjection: "EPSG:32632",	
	
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.StandardProcessing.superclass.constructor.apply(this, arguments);
    },
    
    /** public: method[show]
     *  :arg appTarget: ``Object``
     */
    show: function(appTarget) {
	    if(!this.appTarget)
			this.appTarget = appTarget;
			
        var map = this.appTarget.mapPanel.map;
        map.enebaleMapEvent = true;
		
		var processing = this.buildForm(map);
       
        return processing;
    },
    
    /** private: method[buildForm]
     *  :arg map: ``Object``
     */
    buildForm: function(map){
		var containerTab = Ext.getCmp(this.outputTarget);
		
		var syntView = this.appTarget.tools[this.syntheticView];
		syntView.getControlPanel().disable();
		
		//
		// Elaborazione
		//
		
        var elabStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
				['Elaborazione Standard'],
				['Personalizzazione'],
				['Simulazione'],
				['Danno']
			]
        });
		
		this.elab = new Ext.form.ComboBox({
            fieldLabel: this.elabLabel,
            id: "elabcb",
            width: 150,
            hideLabel : false,
            store: elabStore,	
            displayField: 'name',	
			typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,	
			value: "Elaborazione Standard",
            listeners: {
				beforeselect: function(cb, record, index){
					var value = record.get('name');  
					
					if(value != 'Elaborazione Standard'){
						Ext.Msg.show({
							title: "Elaborazione",
							msg: "Tipo di elaborazione non ancora disponibile",
							icon: Ext.MessageBox.WARNING
						});
						
						return false;
					}
				},
                select: function(cb, record, index) {
					//var value = record.get('name');             
                }
            }			  
        });
		
		var formStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
				['Rischio Totale']
			]
        });
		
		this.form = new Ext.form.ComboBox({
            fieldLabel: this.formLabel,
            id: "elabfr",
            width: 150,
            hideLabel : false,
            store: formStore,	
            displayField: 'name',	
			typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,	
			value: "Rischio Totale",
            listeners: {
                select: function(cb, record, index) {
					//var value = record.get('name');             
                }
            }			  
        });
       
	    this.elabSet = new Ext.form.FieldSet({
            title: "Elaborazione",
            id: 'elabfset',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
                 this.elab,
				 this.form
            ]
        });
		
		//
		// Ambito Territoriale
		//
		
		this.northField = new Ext.form.NumberField({
              fieldLabel: this.northLabel,
              id: "NorthBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.lonMin,
              maxValue: this.spatialFilterOptions.lonMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
        
        this.westField = new Ext.form.NumberField({
              fieldLabel: this.westLabel,
              id: "WestBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.latMin,
              maxValue: this.spatialFilterOptions.latMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
        
        this.eastField = new Ext.form.NumberField({
              fieldLabel: this.eastLabel,
              id: "EastBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.latMin,
              maxValue: this.spatialFilterOptions.latMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
              
        this.southField = new Ext.form.NumberField({
              fieldLabel: this.southLabel,
              id: "SouthBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.lonMin,
              maxValue: this.spatialFilterOptions.lonMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
                  
        //
        // Geographical Filter Field Set
        //        
        var selectAOI = new OpenLayers.Control.SetBox({      
            map: map,    
            onChangeAOI: function(){
                var aoiArray = this.currentAOI.split(',');
                
                document.getElementById('WestBBOX').value = aoiArray[0];
                document.getElementById('SouthBBOX').value = aoiArray[1];
                document.getElementById('EastBBOX').value = aoiArray[2];
                document.getElementById('NorthBBOX').value = aoiArray[3];
            } 
        }); 
        
        map.addControl(selectAOI);
        
        this.aoiButton = new Ext.Button({
              text: this.setAoiText,
              tooltip: this.setAoiTooltip,
              enableToggle: true,
              toggleGroup: this.toggleGroup,
              iconCls: 'aoi-button',
              height: 50,
              width: 50,
              listeners: {
                  scope: this, 
                  toggle: function(button, pressed) {
                     if(pressed){
                     
                          //
                          // Reset the previous control
                          //
						  this.removeAOILayer(map);
                          
                          if(this.northField.isDirty() && this.southField.isDirty() && 
                              this.eastField.isDirty() && this.westField.isDirty()){
                              this.northField.reset();
                              this.southField.reset();
                              this.eastField.reset();
                              this.westField.reset();
                          }

                          //
                          // Activating the new control
                          //                          
                          selectAOI.activate();
                      }else{
                          selectAOI.deactivate();
                      }
                  }
              }
        });
              
        this.spatialFieldSet = new Ext.form.FieldSet({
            title: this.aioFieldSetTitle,
            id: 'bboxAOI-set',
            autoHeight: true,
            layout: 'table',
            layoutConfig: {
                columns: 3
            },
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            bodyCssClass: 'aoi-fields',
            items: [
                {
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 3,
                    items: [
                        this.northField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    items: [
                        this.westField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    border: false,
                    items: [
                        this.aoiButton
                    ]                
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    items: [
                       this.eastField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 3,
                    items: [
                        this.southField
                    ]
                }
            ]
        });
        
	    //
		// Bersaglio
		//
		
        var targetStore = new Ext.data.ArrayStore({
            fields: ['name', 'property'],
            data :  [
			    ['Tutti i Bersagli', 'calc_formula_tot'],
				['Zone Urbanizzate', 'calc_formula_zone_urbanizzate'],
				['Boschi', 'calc_formula_aree_boscate'],
				['Aree Agricole', 'calc_formula_aree_agricole']
			]
        });
		
		this.bers = new Ext.form.ComboBox({
            fieldLabel: "Bersaglio",
            id: "bers",
            width: 150,
            hideLabel : false,
            store: targetStore,	
            displayField: 'name',	
			typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,	
			value: "Tutti i Bersagli",
            listeners: {
				scope: this,
                select: function(cb, record, index) {
					var value = record.get('property'); 
					if(value == "calc_formula_tot")
						value = null;
					this.selectedTargetProp = value;
                }
            }			  
        });
		
	    this.bersSet = new Ext.form.FieldSet({
            title: "Tipo bersaglio",
            id: 'bersfset',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
                 this.bers
            ]
        });
		
	    //
		// incidente
		//
		
        var accidentStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
			    ['Tutti gli Incidenti'],
				['POOL FIRE DA LIQUIDO INFIAMMABILE'],
				['FLASH FIRE DA VAPORI LIQUIDO INFIAMMABILE']/*,
				['POOL FIRE DA LIQUIDO ESTREMAMENTE INFIAMMABILE'],
				['FLASH FIRE DA VAPORI LIQUIDO ESTREMAMENTE INFIAMMABILE'],
				['JET FIRE DI GAS ESTREMAMENTE INFIAMMABILE'],
				['FIRE BALL'],
				['DISPERSIONE COMBURENTE'],
				['RILASCIO SUL SUOLO E NELLE ACQUE'],
				['DISPERSIONE VAPORI DA LIQUIDO TOSSICO'],
				['DISPERSIONE VAPORI DA LIQUIDO REFRIGERATO TOSSICO'],
				['DISPERSIONE GAS DA GAS LIQUEFATTO TOSSICO']*/
			]
        });
		
		this.accident = new Ext.form.ComboBox({
            fieldLabel: "Incidente",
            id: "accidentcb",
            width: 150,
            hideLabel : false,
            store: accidentStore,	
            displayField: 'name',	
			typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
			value: "Tutti gli Incidenti",
            listeners: {
			    beforeselect: function(cb, record, index){
					var value = record.get('name');  

					if(value != 'Tutti gli Incidenti' && 
						value != 'POOL FIRE DA LIQUIDO INFIAMMABILE'){
						Ext.Msg.show({
							title: "Scenario Incidentale",
							msg: "Dati non ancora disponibili per questo scenario",
							icon: Ext.MessageBox.WARNING
						});
						
						return false;
					}
				},
                select: function(cb, record, index) {
					//var value = record.get('name');             
                }
            }			  
        });
		
	    this.accidentSet = new Ext.form.FieldSet({
            title: "Tipo Incidente",
            id: 'accidentfset',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
				 this.accident
            ]
        });
		
        this.panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
			title: "Impostazioni di Elaborazione",
			items:[
                this.elabSet,
				this.spatialFieldSet,
				this.bersSet,
				this.accidentSet
            ],
			buttons: [{
				text: "Reimposta",
				scope: this,
				handler: function(){
					this.panel.getForm().reset();
					this.resetBBOX();
				}
			}, {
				text: "Visualizza Mappa",
				scope: this,
				handler: function(){
					var params = this.makeParams(this.panel.getForm());
				    this.showLayer(params);
					
					var status = this.getStatus(this.panel.getForm());				
					
				    //
				    // Remove the AOI box
				    //
				    this.removeAOILayer(this.appTarget.mapPanel.map);
					selectAOI.deactivate();
					
					var active = containerTab.getActiveTab();
					containerTab.remove(active);
					
				    var syntView = this.appTarget.tools[this.syntheticView];
					syntView.getControlPanel().enable();
					syntView.setStatus(status);
				}
			}]
        });
		
     	containerTab.add(this.panel);
		containerTab.setActiveTab(this.panel);
		
		if(!this.status){
			this.resetBBOX();
		}
    },
	
	removeAOILayer: function(map){
	    var aoiLayer = map.getLayersByName("AOI")[0];
	  
	    if(aoiLayer)
			map.removeLayer(aoiLayer);	
	},
	
	resetBBOX: function(){
		    var defBBOX = new OpenLayers.Bounds.fromArray(this.defaultBBOXFilterExtent);
			var bboxArray = defBBOX.toArray();
			this.westField.setValue(bboxArray[0]);
			this.southField.setValue(bboxArray[1]); 
			this.eastField.setValue(bboxArray[2]);
			this.northField.setValue(bboxArray[3]);
	},
	
	makeParams: function(form){
	    var map = this.appTarget.mapPanel.map;
		var params = {};
		var filters = [];
		
		//
		// Spatial filter
		// 
		var roi;
		if(this.westField.isDirty() && 
			this.southField.isDirty() && 
				this.eastField.isDirty() && 
					this.northField.isDirty()){
			roi = new OpenLayers.Bounds(
				this.westField.getValue(), 
				this.southField.getValue(), 
				this.eastField.getValue(), 
				this.northField.getValue()
			);	
		}else{
			roi = new OpenLayers.Bounds.fromArray(this.defaultBBOXFilterExtent);
		}
		
		params.roi = new OpenLayers.Bounds.fromString(roi.toBBOX());
		
		//
		// Check about the projection (this could needs Proj4JS definitions inside the mapstore config)
		//
		var mapPrj = map.getProjectionObject();
		var selectionPrj = new OpenLayers.Projection(this.selectionLayerProjection);
		if(!mapPrj.equals(selectionPrj)){
			roi = roi.transform(
				mapPrj,	
				selectionPrj
			);
		}
	
		filters.push(new OpenLayers.Filter.Spatial({
		   type: OpenLayers.Filter.Spatial.BBOX,
		   property: this.geometryName,
		   value: roi
		}));
	
		//
		// Accident Scenarios filter
		//
		var accidentValue = this.accident.getValue();
		if(accidentValue != "Tutti gli Incidenti"){
			filters.push(new OpenLayers.Filter.Comparison({
			   type: OpenLayers.Filter.Comparison.EQUAL_TO,
			   property: this.accidentTipologyName,
			   value: this.accident.getValue()
			}));
		}
		
	    //
		// Target filter OpenLayers.Filter.Logical.NOT
		//
		if(this.selectedTargetProp){
			filters.push(new OpenLayers.Filter.Logical({
				type: OpenLayers.Filter.Logical.NOT,
				filters: [new OpenLayers.Filter.Comparison({
					type: OpenLayers.Filter.Comparison.IS_NULL,
					property: this.selectedTargetProp
				})]
			}));
		}
		
		params.filters = filters;
		
	    return params;
	},
	
	showLayer: function(params){
		var map = this.appTarget.mapPanel.map;
		
		var filter = new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.AND,
			filters: params.filters
		});
		
		var filterFormat = new OpenLayers.Format.Filter();
        var ogcFilterString = filterFormat.write(filter);  
		
		var xmlFormat = new OpenLayers.Format.XML();                  
        ogcFilterString = xmlFormat.write(ogcFilterString);
					
	    //
	    // Check if the selection layer already exists
	    //
	    var stdElabLayer = map.getLayersByName(this.selectionLayerTitle)[0];
	  
	    if(!stdElabLayer){
			stdElabLayer = new OpenLayers.Layer.WMS(
				this.selectionLayerTitle, 		
				this.selectionLayerBaseURL,
				{
					layers: this.selectionLayerName, 
					transparent: true, 
					format: this.selectionLayerFormat,
					filter: ogcFilterString
				},
				{
					isBaseLayer: false,
					singleTile: true,
					displayInLayerSwitcher: false
				}
			);
					
			map.addLayer(stdElabLayer);
		}else{
		    // ES: &env=formula:calc_formula_tot;basso_rischio:6000;medio_rischio_a:25000:medio_rischio_b:6001;alto_rischio:25001
			/*var env;
			if(this.selectedTargetProp == "calc_formula_tot"){
				env = "formula:" + this.selectedTargetProp + "basso_rischio:6000;medio_rischio_a:25000:medio_rischio_b:6001;alto_rischio:25001";
			}else if(this.selectedTargetProp == "calc_formula_aree_boscate"){
				env = "formula:" + this.selectedTargetProp + "basso_rischio:5000;medio_rischio_a:20000:medio_rischio_b:5001;alto_rischio:70001";
			}else if(this.selectedTargetProp == "calc_formula_aree_agricole"){
				env = "formula:" + this.selectedTargetProp + "basso_rischio:30000;medio_rischio_a:40000:medio_rischio_b:30001;alto_rischio:40001";
			}else{
				env = "formula:" + this.selectedTargetProp + "basso_rischio:6000;medio_rischio_a:25000:medio_rischio_b:6001;alto_rischio:25001";
			}*/
			
			stdElabLayer.mergeNewParams({
				filter: ogcFilterString //,
				//env: env
				//styles: this.selectedTargetProp ? this.selectedTargetProp : ''
			});
			
			if(params.roi){
				map.zoomToExtent(params.roi);
			}			
		}
	},
	
	setStatus: function(status){
	    this.status = status;
		this.elab.setValue(this.status.processing);
		this.form.setValue(this.status.form);
		
		var bboxArray = this.status.roi.bbox.toArray();
		this.westField.setValue(bboxArray[0]);
		this.southField.setValue(bboxArray[1]); 
		this.eastField.setValue(bboxArray[2]);
		this.northField.setValue(bboxArray[3]);
		
		this.bers.setValue(this.status.target);
		this.accident.setValue(this.status.accident);
	},
	
	getStatus: function(form){
		var obj = {};
		
		obj.processing = this.elab.getValue();
		obj.form = this.form.getValue();
		
		if(this.westField.isDirty() && 
			this.southField.isDirty() && 
				this.eastField.isDirty() && 
					this.northField.isDirty()){
			obj.roi = {
				label: "Area Selezionata", 
				bbox : new OpenLayers.Bounds(
					this.westField.getValue(), 
					this.southField.getValue(), 
					this.eastField.getValue(), 
					this.northField.getValue()
				)
			};	
		}else{
			obj.roi = {
				label: "Regione Piemonte", 
				bbox : new OpenLayers.Bounds.fromArray(this.defaultBBOXFilterExtent)
				/*new OpenLayers.Bounds(
					this.westField.getValue(), 
					this.southField.getValue(), 
					this.eastField.getValue(), 
					this.northField.getValue()
				)*/
			}
		}

		obj.target = this.bers.getValue();
		obj.accident = this.accident.getValue();
		
		return obj;
	}
});

Ext.preg(gxp.plugins.StandardProcessing.prototype.ptype, gxp.plugins.StandardProcessing);
