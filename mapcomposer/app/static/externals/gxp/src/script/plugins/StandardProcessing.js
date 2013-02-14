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
    aioFieldSetTitle: "Ambito Territoriale",
    setAoiText: "Seleziona Area",
    currentExtentText: "Area visualizzata",
    currentExtentTooltip: "Usa l'area visualizzata sulla mappa come regione di interesse",
    setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
        
    // End i18n.
        
    // TODO: bbox piemonte    
    spatialFilterOptions: {
        lonMax: 20037508.34,   
        lonMin: -20037508.34,
        latMax: 20037508.34,   
        latMin: -20037508.34  
    },    
    
    defaultBBOXFilterExtent: "738789.1549,5474684.1113,1028026.86989,5843416.33569",
    
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
    
    maxROIArea: null,
    
    urlEPSG: null,
    epsgWinHeight: null,
    epsgWinWidth: null,
    seriousnessCode: '0',
    accidentCode: '0',
    sostanzeCode: '0',
    selectedTargetCode: '-1',
    
    holdValues: {
        "L": 8,
        "G": 25 
    },
 
    
    // -1 HOLD Values, null not defined value
    radiusData : {
                 "1":{
                    "E" : {
                        "L": { "humans": [15,32,51,75],        "notHumans": [15,-1,-1,-1,null,null]},
                        "G": { "humans": [75,90,110,130],      "notHumans": [75,-1,-1,-1,null,null]}
                    }
                 },
                 "2":{
                    "G" : {
                        "L": { "humans": [25,-1,81,-1],    "notHumans": [null,-1,-1,-1,null,null]},
                        "G": { "humans": [45,-1,90,-1],    "notHumans": [null,-1,-1,-1,null,null]}
                    }
                },
                "3":{
                    "D" : {
                        "L": { "humans": [35,70,-1,-1],    "notHumans": [null,-1,-1,null,null,null]},
                        "G": { "humans": [65,132,-1,-1],   "notHumans": [null,-1,-1,null,null,null]}
                    },
                    "F" : {
                        "L": { "humans": [60,95,110,140],      "notHumans": [60,-1,-1,null,null,null]},
                        "G": { "humans": [180,230,420,500],    "notHumans": [180,-1,-1,null,null,null]}
                    }
                },
                "4":{
                    "E" : {
                        "L": { "humans": [30,65,-1,-1],    "notHumans": [null,-1,-1,null,null,null]},
                        "G": { "humans": [60,148,-1,-1],   "notHumans": [null,-1,-1,null,null,null]}
                    },
                    "F" : {
                        "L": { "humans": [55,93,100,131],      "notHumans": [55,-1,-1,null,null,null]},
                        "G": { "humans": [112,210,339,467],    "notHumans": [112,-1,-1,null,null,null]}
                    },
                    "M" : {
                        "L": { "humans": [60,-1,110,-1],   "notHumans": [null,-1,-1,-1,null,null]},
                        "G": { "humans": [110,-1,230,-1],  "notHumans": [null,-1,-1,-1,null,null]}
                    }
                },
                "5":{
                    "B" : {
                        "L": { "humans": [45,96,-1,-1],    "notHumans": [null,-1,-1,null,null,null]},
                        "G": { "humans": [110,150,-1,-1],  "notHumans": [null,-1,-1,null,null,null]}
                    },
                    "L" : {
                        "L": { "humans": [130,-1,567,-1],  "notHumans": [null,-1,-1,-1,null,null]},
                        "G": { "humans": [250,-1,780,-1],  "notHumans": [null,-1,-1,-1,null,null]}
                    }
                },
                "6":{
                    "G" : {
                        "L": { "humans": [25,-1,81,-1],    "notHumans": [null,-1,-1,-1,null,null]},
                        "G": { "humans": [45,-1,90,-1],    "notHumans": [null,-1,-1,-1,null,null]}
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
                        "L": { "humans": [35,45,52,60],        "notHumans": [35,-1,-1,-1,null,null]},
                        "G": { "humans": [80,110,130,145],     "notHumans": [80,-1,-1,-1,null,null]}
                    },
                    "D" : {
                        "L": { "humans": [45,90,-1,-1],    "notHumans": [null,-1,-1,null,null,null]},
                        "G": { "humans": [127,250,-1,-1],  "notHumans": [null,-1,-1,null,null,null]}
                    },
                    "H" : {
                        "L": { "humans": [null,null,null,null],"notHumans": [null,null,null,8,8,8]},
                        "G": { "humans": [null,null,null,null],"notHumans": [null,null,null,25,25,25]}
                    }
                },
                "9":{
                    "A" : {
                        "L": { "humans": [30,42,48,58],        "notHumans": [30,-1,-1,null,null,null]},
                        "G": { "humans": [75,109,125,138],     "notHumans": [75,-1,-1,null,null,null]}
                    },
                    "B" : {
                        "L": { "humans": [40,88,-1,-1],    "notHumans": [-1,-1,null,null,null,null]},
                        "G": { "humans": [70,150,-1,-1],   "notHumans": [-1,-1,null,null,null,null]}
                    },
                    "I" : {
                        "L": { "humans": [30,-1,60,-1],    "notHumans": [-1,-1,-1,-1,null,null]},
                        "G": { "humans": [80,-1,160,-1],   "notHumans": [-1,-1,-1,-1,null,null]}
                    }
                },
                 "10":{
                    "H" : {
                        "L": { "humans": [null,null,null,null],"notHumans": [null,null,null,8,8,8]},
                        "G": { "humans": [null,null,null,null],"notHumans": [null,null,null,25,25,25]}
                    }
                }
        },

    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
       this.epsgWinHeight= Ext.getBody().getHeight()*.7;
       this.epsgWinWidth= Ext.getBody().getWidth()*.8;
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
        
        this.mapProjection = new OpenLayers.Projection(map.getProjection());
        this.wgs84Projection = new OpenLayers.Projection("EPSG:4326")
        
        var processing = this.buildForm(map);
       
        return processing;
    },
    
    /** private: method[buildForm]
     *  :arg map: ``Object``
     */
    buildForm: function(map){
        var me=this; 
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
              allowBlank: false,
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
              allowBlank: false,
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
              allowBlank: false,
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
              allowBlank: false,
              minValue: this.spatialFilterOptions.lonMin,
              maxValue: this.spatialFilterOptions.lonMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
        
            
        
        //
        // Geographical Filter Field Set
        //     
        this.selectAOI = new OpenLayers.Control.SetBox({      
            map: map,            
            onChangeAOI: function(){                               
                me.setAOI(new OpenLayers.Bounds.fromString(this.currentAOI));             
            } 
        }); 
        
        map.addControl(this.selectAOI);
        
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
                          this.selectAOI.activate();
                      }else{
                          this.selectAOI.deactivate();
                      }
                  }
              }
        });
        
        this.currentExtentButton = new Ext.Button({
              text: this.currentExtentText,
              tooltip: this.currentExtentTooltip,                            
              iconCls: 'current-extent-button',
              height: 30,
              width: 50,
              listeners: {
                  scope: this, 
                  click: function(button) {
                    var extent=map.getExtent();
                    this.setAOI(extent);                    
                    this.removeAOILayer(map);                  
                  }
              }
        });
        

        var urlEPSG= this.urlEPSG ? this.urlEPSG : "http://spatialreference.org/ref/epsg/"+me.wgs84Projection.getCode().split(":")[1]+"/";;
        
      
        this.spatialFieldSet = new Ext.form.FieldSet({
            title:  this.aioFieldSetTitle+" <a href='#' id='bboxAOI-set-EPSG'>["+me.wgs84Projection.getCode()+"]</a>",//["+this.wgs84Projection.getCode()+"]</div></b>",
            //title: this.aioFieldSetTitle,
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
               /* {
                    layout: "form",
                    cellCls: 'spatial-cell',
                    colspan:3,
                    border: false,
                    items: [
                        this.epsgButton
                    ]                
                },*/
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
                }/*,{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    colspan:3,
                    border: false,
                    items: [
                        this.currentExtentButton
                    ]                
                }*/
            ]
        });
        this.aoiUpdater = function() {			
			var extent=map.getExtent().clone();
			this.setAOI(extent);                    
			this.removeAOILayer(map);			
        };
        map.events.register("move", this, this.aoiUpdater);
        
        //
        // Bersaglio
        //
        
        var targetStore = new Ext.data.ArrayStore({
            fields: ['layer','name', 'property', 'humans', 'code', 'type'],
            data :  [
              //  ['Tutti i Bersagli', 'calc_formula_tot', ''],
                ['popolazione_residente','Popolazione residente', 'calc_formula_tot', true, '-1', 'umano'],
                //['popolazione_turistica','Popolazione fluttuante turistica (medio)', 'calc_formula_tot', true, '-1', 'umano'],
                ['popolazione_turistica','Popolazione fluttuante turistica', 'calc_formula_tot', true, '-1', 'umano'],
                ['industria_servizi','Addetti industria e servizi', 'calc_formula_tot', true, '-1', 'umano'],
                ['strutture_sanitarie','Addetti/utenti strutture sanitarie', 'calc_formula_tot', true, '-1', 'umano'],
                ['strutture_scolastiche','Addetti/utenti strutture scolastiche', 'calc_formula_tot', true, '-1', 'umano'],
                ['centri_commerciali','Addetti/utenti centri commerciali', 'calc_formula_tot', true, '-1', 'umano'],
                //['xx','Utenti della strada coinvolti', 'calc_formula_tot', true, '-1', 'umano'],
                //['yy','Utenti della strada territoriali', 'calc_formula_tot', true, '-1', 'umano'],
                ['zone_urbanizzate','Zone urbanizzate', 'calc_formula_tot', false, '0', 'ambientale'],
                ['aree_boscate','Aree boscate', 'calc_formula_tot', false, '1', 'ambientale'],
                ['aree_protette','Aree protette', 'calc_formula_tot', false, '2', 'ambientale'],
                ['aree_agricole','Aree agricole', 'calc_formula_tot', false, '3', 'ambientale'],
                ['acque_sotterranee','Acque sotterranee', 'calc_formula_tot', false, '4', 'ambientale'],
                ['acque_superficiali','Acque superficiali', 'calc_formula_tot', false, '5', 'ambientale'],
                ['beni_culturali','Beni culturali', 'calc_formula_tot', false, '6', 'ambientale']

            ]
        });
        
        var targetMacroStore = new Ext.data.ArrayStore({
            fields: ['name', 'property', 'code', 'type'],
            data :  [
                ['Tutti i Bersagli', 'calc_formula_tot', '1', 'mixed'],
                ['Tutti i Bersagli Umani', 'calc_formula_tot', '-1', 'umano'],
                ['Tutti i Bersagli Ambientali', 'calc_formula_tot', '1', 'ambientale']
            ]
        });
        
        
        
        this.macrobers = new Ext.form.ComboBox({
            fieldLabel: "Categoria",
            id: "macrobers",
            width: 150,
            hideLabel : false,
            store: targetMacroStore,    
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
                    
                    this.selectedTargetProp = value;
                    this.selectedTargetName = record.get('name');
                    this.selectedTargetCode = record.get('code');
                    var store=this.bers.getStore();
                    
                    switch (this.selectedTargetName){
                        case "Tutti i Bersagli":
                            store.clearFilter();
							this.selectedTargetLayer = 'bersagli_all';                            
                            break;
                        case "Tutti i Bersagli Umani":     
							store.filter('type','umano');
							this.selectedTargetLayer = 'bersagli_umani';
                            break;
                        case "Tutti i Bersagli Ambientali": 
							store.filter('type','ambientale');
							this.selectedTargetLayer = 'bersagli_ambientali';
                            break;
                    }
                                      
                    
                    this.bers.setValue(null);
                }
            }              
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
            listeners: {
                scope: this,                
                select: function(cb, record, index) {
                    var value = record.get('property');                     
                    if(value){
                       if(value === 'invalid'){
                        Ext.Msg.show({
                            title: "Bersaglio",
                            msg: "Dati non ancora disponibili per questo bersaglio",
                            icon: Ext.MessageBox.WARNING
                        });
                        
                        return false;
                    }
                    if(value == "calc_formula_tot")
                        value = null;
                    
                    this.selectedTargetProp = value;
                    this.selectedTargetName = record.get('name'); 
                    this.selectedTargetCode = record.get('code');
					this.selectedTargetLayer = record.get('layer');
                  } 
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
                this.macrobers,
                 this.bers
            ]
        });
        
        //
        // incidente
        //
        var classiADRStore = new Ext.data.ArrayStore({
            fields: ['name','value', 'sost'],
            data :  [
                ['Tutte le classi', '0', [1,2,3,4,5,6,7,8,9,10]],
             //   ['MATERIE E OGGETTI ESPLOSIVI', '1', []],
                ['GAS COMPRESSI, LIQUEFATTI O DISCIOLTI IN PRESSIONE', '2', [1,2,3,4,5,6]],
                ['MATERIE LIQUIDE INFIAMMABILI', '3', [7,8,9]],
             //   ['MATERIE SOLIDE INFIAMMABILI', '4.1', []],
             //   ['MATERIE SOGGETTE AD ACCENSIONE SPONTANEA', '4.2', []],
             //   ['MATERIE CHE A CONTATTO CON L?ACQUA SVILUPPANO GAS INFIAMMABILI', '4.3', []],
             //   ['MATERIE COMBURENTI', '5.1', []],
             //   ['PEROSSIDI ORGANICI', '5.2', []],
                ['MATERIE TOSSICHE', '6.1', [10]],
             //   ['MATERIE INFETTANTI', '6.2', []],
             //   ['MATERIE RADIOATTIVE', '7', []],
             //   ['MATERIE CORROSIVE', '8', []],
             //   ['MATERIE E OGGETTI PERICOLOSE DI ALTRA NATURA', '9', []]
            ]
        });
        
        var sostanzeStore = new Ext.data.ArrayStore({
            fields: ['name', 'value', 'accidents'],
            data :  [
                ['Tutte le sostanze', 0, ['A','B','C','D','E','F','G','H','I','L','M']],
                ['IDROGENO COMPRESSO', 1, ['E'] ],
                ['OSSIGENO COMPRESSO', 2, ['G']],
                ['GAS DI PETROLIO LIQUEFATTO', 3, ['D', 'F']],
                ['OSSIDO DI ETILENE (+AZOTO)', 4, ['D', 'F', 'M']],
                ['AMMONIACA ANIDRA', 5, ['B', 'L']],
                ['OSSIGENO LIQUIDO REFRIGERATO', 6, ['G']],
                ['GASOLIO', 7, ['H']],
                ['BENZINA', 8, ['C', 'D', 'H']],
                ['METANOLO', 9, ['A', 'B', 'I']],
                ['EPICLORIDRINA', 10, ['H']]
            ]
        });
               
        
        var accidentStore = new Ext.data.ArrayStore({
            fields: ['name', 'value'],
            data :  [
                ['Tutti gli Incidenti', '0'],
                ['POOL FIRE DA LIQUIDO INFIAMMABILE', 'A'],
                ['FLASH FIRE DA VAPORI LIQUIDO INFIAMMABILE', 'B'],
                ['POOL FIRE DA LIQUIDO ESTREMAMENTE INFIAMMABILE', 'C'],
                ['FLASH FIRE DA VAPORI LIQUIDO ESTREMAMENTE INFIAMMABILE', 'D'],
                ['JET FIRE DI GAS ESTREMAMENTE INFIAMMABILE', 'E'],
                ['FIRE BALL', 'F'],
                ['DISPERSIONE COMBURENTE', 'G'],
                ['RILASCIO SUL SUOLO E NELLE ACQUE', 'H'],
                ['DISPERSIONE VAPORI DA LIQUIDO TOSSICO', 'I'],
                ['DISPERSIONE VAPORI DA LIQUIDO REFRIGERATO TOSSICO', 'L'],
                ['DISPERSIONE GAS DA GAS LIQUEFATTO TOSSICO', 'M']
            ]
        });
        
        var seriousnessStore = new Ext.data.ArrayStore({
            fields: ['name', 'value'],
            data :  [
                ['Tutte le entità', '0'],
                ['Lieve', 'L'],
                ['Grave', 'G']
            ]
        });
        
        
      /*  var radiusData = new Ext.data.ArrayStore({
            fields: ['id', 'humans', 'notHumans'],
            data :  [
                ['1-E-L', [15,32,51,75],        [15,-1,-1,-1,null,null]],
                ['1-E-G', [75,90,110,130],      [75,-1,-1,-1,null,null]],
                ['2-G-L', [25,null,81,null],    [null,-1,-1,-1,null,null]],
                ['2-G-G', [45,null,90,null],    [null,-1,-1,-1,null,null]],
                ['3-D-L', [35,70,null,null],    [null,-1,-1,null,null,null]],
                ['3-D-G', [65,132,null,null],   [null,-1,-1,null,null,null]],
                ['3-F-L', [60,95,110,140],      [60,-1,-1,null,null,null]],
                ['3-F-G', [180,230,420,500],    [180,-1,-1,null,null,null]],
                ['4-D-L', [30,65,null,null],    [null,-1,-1,null,null,null]],
                ['4-D-G', [60,148,null,null],   [null,-1,-1,null,null,null]],
                ['4-F-L', [55,93,100,131],      [55,-1,-1,null,null,null]],
                ['4-F-G', [112,210,339,467],    [112,-1,-1,null,null,null]], 
                ['4-M-L', [60,null,110,null],   [null,-1,-1,-1,null,null]],
                ['4-M-G', [110,null,230,null],  [null,-1,-1,-1,null,null]],
                ['5-B-L', [45,96,null,null],    [null,-1,-1,null,null,null]],
                ['5-B-G', [110,150,null,null],  [null,-1,-1,null,null,null]], 
                ['5-L-L', [130,null,567,null],  [null,-1,-1,-1,null,null]],
                ['5-L-G', [250,null,780,null],  [null,-1,-1,-1,null,null]],
                ['6-G-L', [25,null,81,null],    [null,-1,-1,-1,null,null]],
                ['6-G-G', [45,null,90,null],    [null,-1,-1,-1,null,null]], 
                ['7-H-L', [null,null,null,null],[null,null,null,8,8,8]],
                ['7-H-G', [null,null,null,null],[null,null,null,25,25,25]], 
                ['8-C-L', [35,45,52,60],        [35,-1,-1,-1,null,null]],
                ['8-C-G', [80,110,130,145],     [80,-1,-1,-1,null,null]],
                ['8-D-L', [45,90,null,null],    [null,-1,-1,null,null,null]],
                ['8-D-G', [127,250,null,null],  [null,-1,-1,null,null,null]], 
                ['8-H-L', [null,null,null,null],[null,null,null,8,8,8]],
                ['8-H-G', [null,null,null,null],[null,null,null,25,25,25]], 
                ['9-A-L', [30,42,48,58],        [30,-1,-1,null,null,null]],
                ['9-A-G', [75,109,125,138],     [75,-1,-1,null,null,null]],
                ['9-B-L', [40,88,null,null],    [-1,-1,null,null,null,null]],
                ['9-B-G', [70,150,null,null],   [-1,-1,null,null,null,null]], 
                ['9-I-L', [30,null,60,null],    [-1,-1,-1,-1,null,null]],
                ['9-I-G', [80,null,160,null],   [-1,-1,-1,-1,null,null]],
                ['10-H-L',[null,null,null,null],[null,null,null,8,8,8]],
                ['10-H-G',[null,null,null,null],[null,null,null,25,25,25]]
            ]
        });*/
        
        this.classi = new Ext.form.ComboBox({
            fieldLabel: "Classe ADR",
            id: "classicb",
            width: 150,
            hideLabel : false,
            store: classiADRStore,    
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
            value: "Tutte le classi",
            listeners: {
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                beforeselect: function(cb, record, index){
                    var sostArray = record.get('sost');  
                    var value= record.get('value');
                    
                    if(sostArray.length ==0 && value != '0'){
                        Ext.Msg.show({
                            title: "Scenario Incidentale",
                            msg: "Dati non di interesse per il modello",
                            icon: Ext.MessageBox.WARNING
                        });
                        return false;
                    }
                },
                select: function(cb, record, index) {
                     var store=me.sostanze.getStore();                     
                     store.clearFilter();
					 
					 var sostArray = record.get('sost'); 
                     store.filterBy(function (record){
                        var value=record.get('value'); 
                        return (sostArray.indexOf(value) != -1 || value == '0');
                     });
					 
					 store=me.accident.getStore();                     
                     store.clearFilter();

                     me.sostanze.setValue('Tutte le sostanze');
                     me.accident.setValue('Tutti gli Incidenti');
                     me.seriousness.setValue('Tutte le entità');
                     me.seriousnessCode= '0';
                     me.accidentCode= '0';
                     me.sostanzeCode= '0';
                }
            }              
        });
        
        this.sostanze = new Ext.form.ComboBox({
            fieldLabel: "Sostanze",
            id: "sostanzecb",
            width: 150,
            hideLabel : false,
            store: sostanzeStore, 
            lastQuery:'',
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
            value: "Tutte le sostanze",
            listeners: {
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                beforeselect: function(cb, record, index){
                     
                },
                select: function(cb, record, index) {
                    me.sostanzeCode = record.get('value');
                    var store=me.accident.getStore();
                    var accidentsArray = record.get('accidents'); 
                    store.clearFilter();
                    
                    store.filterBy(function (record){
                        var value=record.get('value');
                        return (accidentsArray.indexOf(value)!= -1 || value == '0');
                     });
                    
                    
                    me.accident.setValue('Tutti gli Incidenti');
                    me.seriousness.setValue('Tutte le entità');
                    me.seriousnessCode= '0';
                    me.accidentCode= '0';
                }
            }              
        });
        
        this.accident = new Ext.form.ComboBox({
            fieldLabel: "Incidente",
            id: "accidentcb",
            width: 150,
            hideLabel : false,
            store:  accidentStore,   
            lastQuery:'',
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
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(cb, record, index) {
                    me.accidentCode = record.get('value');       
                    me.seriousness.setValue('Tutte le entità');
                    me.seriousnessCode= '0';
                }
            }              
        });
        
        this.seriousness = new Ext.form.ComboBox({
            fieldLabel: "Entità",
            id: "seriousnesscb",
            width: 150,
            hideLabel : false,
            store: seriousnessStore,    
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
            value: "Tutte le entità",
            listeners: {
                beforeselect: function(cb, record, index){
                    var value = record.get('value');  
                    var notValid=false;
                    var rad=me.radiusData[me.sostanzeCode][me.accidentCode][value];

                    if((me.selectedTargetCode != "-1")){
                        notValid= rad.notHumans[me.selectedTargetCode] == null;
                    }else
                        notValid= rad.humans[0] == null;
                    
                    if(notValid){
                        Ext.Msg.show({
                            title: "Scenario Incidentale",
                            msg: "Combinazione non consentita",
                            icon: Ext.MessageBox.WARNING
                        });
                      return false;
                    }
                },
                "expand": function(combo) {
                   /* combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );*/
                },
                select: function(cb, record, index) {
                    me.seriousnessCode = record.get('value');  
                   
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
                this.classi,
                this.sostanze,
                this.accident,
                this.seriousness
            ]
        });
        
        this.panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            title: "Impostazioni di Elaborazione",
            autoScroll: true,
            items:[
                this.elabSet,
                this.spatialFieldSet,
                this.bersSet,
                this.accidentSet
            ],
            buttons: [{
                text: "Reimposta",
                iconCls: 'reset-button',
                scope: this,
                handler: function(){
                    this.panel.getForm().reset();
                    this.resetBBOX(true);
                }
            }, {
                text: "Visualizza Mappa",
                iconCls: 'visualizzation-button',
                scope: this,
                handler: function(){                    
                    var params = this.makeParams();
                }
            }]
        });
        
        containerTab.add(this.panel);
        containerTab.setActiveTab(this.panel);
        
        Ext.get("bboxAOI-set-EPSG").addListener("click", function(){
         var win= new Ext.Window({
                layout:'fit',
                
                width:me.epsgWinWidth,
                height:me.epsgWinHeight,
                closeAction:'destroy',
                html: '<div id="loaderIframe"><iframe id="epsgIframe" src="'+urlEPSG+'" width="99%" height="99%"></iframe></div>',
                listeners: {
                    afterrender: function(thisss, eOpts) {
                        var ml=new Ext.LoadMask(document.getElementById('loaderIframe'), 
                            { msg:"Prego Attendere...",removeMask: true});
                        ml.show();   
                        function rml(){
                            ml.hide();
                        }
                        var iframe = document.getElementById('epsgIframe');
                        if (iframe.attachEvent) {
                            iframe.attachEvent("onload", rml);
                        } else if (iframe.addEventListener) {
                            iframe.addEventListener("load", rml, false);
                        } 
                 }   
               }
           });
           
           win.show();
           
           
        });
        
        if(!this.status){
            this.resetBBOX();
        }
    },
    
    setAOI: function(bounds, wgs84) {
        var wgs84Bounds = wgs84 ? bounds : bounds.transform(this.mapProjection,this.wgs84Projection);
        this.northField.setValue(wgs84Bounds.top);
        this.southField.setValue(wgs84Bounds.bottom);
        this.westField.setValue(wgs84Bounds.left);
        this.eastField.setValue(wgs84Bounds.right);  
    },
    
    showMap: function(params){
        if(params){
            this.showLayer(params);
            
            var status = this.getStatus(this.panel.getForm());                
            
            //
            // Remove the AOI box
            //
            this.removeAOILayer(this.appTarget.mapPanel.map);
            this.selectAOI.deactivate();
            
            var containerTab = Ext.getCmp(this.outputTarget);
            var active = containerTab.getActiveTab();
            containerTab.remove(active);
            
            var syntView = this.appTarget.tools[this.syntheticView];
            syntView.getControlPanel().enable();
            syntView.setStatus(status);
			
			this.appTarget.mapPanel.map.events.unregister("move", this, this.aoiUpdater);
        }
    },
    
    removeAOILayer: function(map){
        var aoiLayer = map.getLayersByName("AOI")[0];
      
        if(aoiLayer)
            map.removeLayer(aoiLayer);    
    },
    
    resetBBOX: function(extent){    
		if(this.status && !extent){
			this.setAOI(this.status.roi.bbox, true);
		}else{
			this.setAOI(this.appTarget.mapPanel.map.getExtent());
		}              
    },
    
    _makeParams: function(form){
        var map = this.appTarget.mapPanel.map;
        var params = {};
        var filters = [];
        
        //
        // Spatial filter
        //
        var roi = this.bboxParam;
        if(!roi){
            return null;
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
               value: 'POOL FIRE DA LIQUIDO INFIAMMABILE' //this.accident.getValue()
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
        
        this.showMap(params);
    },
    
    makeParams: function(){
        this.bboxValidation();
    },
    
    bboxValidation: function(){
        if(!this.westField.isValid() || 
            !this.southField.isValid() || 
                !this.eastField.isValid() || 
                    !this.northField.isValid()){
            Ext.Msg.show({
                title: "Selezione Area di Interesse",
                buttons: Ext.Msg.OK,
                msg: "Le coordinate dell'area di interesse non sono valide.",
                icon: Ext.MessageBox.WARNING
            });        
            
            this.bboxParam = null;
            this._makeParams(this.panel.getForm());
        }else{
            var selbbox = new OpenLayers.Bounds(
                this.westField.getValue(), 
                this.southField.getValue(), 
                this.eastField.getValue(), 
                this.northField.getValue()
            ).transform(this.wgs84Projection,this.mapProjection);
            
            if(this.maxROIArea ? selbbox.toGeometry().getArea() > this.maxROIArea : false){
                var useROI = function(buttonId, text, opt){
                    if(buttonId === 'ok'){
                        this.bboxParam = selbbox;
                    }else{
                        this.bboxParam = null;
                    }
                    
                    this._makeParams(this.panel.getForm());
                };
                
                Ext.Msg.show({
                    title: "Selezione Area di Interesse",
                    buttons: Ext.Msg.OKCANCEL,
                    fn: useROI,
                    msg: "L'area selezionata e' troppo grande e il server potrebbe impiegare molto tempo a rispondere. Se si desidera continuare ugualmente premere OK.",
                    icon: Ext.MessageBox.WARNING,
                    scope: this
                });                
            }else{
                this.bboxParam = selbbox;
                this._makeParams(this.panel.getForm());
            }
        }
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
        var store;
        this.status = status;
        this.elab.setValue(this.status.processing);
        this.form.setValue(this.status.form);
        this.setAOI(this.status.roi.bbox);
        
        this.macrobers.setValue(this.status.macroTarget);
        if(this.status.macroTarget != this.status.target)
            this.bers.setValue(this.status.target);
        else
            this.bers.setValue(null);
        
        store=this.classi.getStore();
        this.classi.fireEvent('select',this.classi, store.getAt(store.find("name", this.status.classe)));
        this.classi.setValue(this.status.classe);
        
        store=this.sostanze.getStore();
        this.sostanze.fireEvent('select',this.sostanze, store.getAt(store.find("name", this.status.sostanza)));
        this.sostanze.setValue(this.status.sostanza);

        
        this.accident.setValue(this.status.accident);        
        this.seriousness.setValue(this.status.seriousness);
    },
    
	getTargetType: function() {		
		var record = this.bers.store.getAt(this.bers.store.find("name",this.bers.getValue()));
		if(!record) {
			record = this.macrobers.store.getAt(this.macrobers.store.find("name",this.macrobers.getValue()));
		}
		return record.get('type');		
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
                ).transform(this.wgs84Projection,this.mapProjection)
            };    
        }else{
            obj.roi = {
                label: "Regione Piemonte", 
                bbox : //new OpenLayers.Bounds.fromString(this.defaultBBOXFilterExtent)
                    new OpenLayers.Bounds(
                        this.westField.getValue(), 
                        this.southField.getValue(), 
                        this.eastField.getValue(), 
                        this.northField.getValue()
                    ).transform(this.wgs84Projection,this.mapProjection)
            }
        }

        obj.target = this.selectedTargetName || 'Tutti i Bersagli';/*this.bers.getValue()*/ ;
        obj.targetName = this.selectedTargetName || 'Tutti i Bersagli';
		obj.targetLayer = this.selectedTargetLayer || 'bersagli_all';
		obj.targetType = this.getTargetType();
        obj.macroTarget = this.macrobers.getValue();
        obj.classe = this.classi.getValue();
        obj.sostanza = this.sostanze.getValue();
        obj.accident = this.accident.getValue();
        obj.seriousness = this.seriousness.getValue();
		

        return obj;
    }

    
});

Ext.preg(gxp.plugins.StandardProcessing.prototype.ptype, gxp.plugins.StandardProcessing);
