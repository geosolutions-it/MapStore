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
        
        
      /*  this.epsgButton = new Ext.Button({
               text: me.wgs84Projection.getCode() ,
               handler: function(){
                      new Ext.Window({
                          layout:'fit',
                          width:me.epsgWinWidth,
                          height:me.epsgWinHeight,
                          closeAction:'hide',
                          html: '<iframe src="'+url_epsg+'" width="99%" height="99%"></iframe>'
                      }).show();
              },
              tooltip: this.currentExtentTooltip                          
            
        });*/
              
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
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    colspan:3,
                    border: false,
                    items: [
                        this.currentExtentButton
                    ]                
                }
            ]
        });
        
        //
        // Bersaglio
        //
        
        var targetStore = new Ext.data.ArrayStore({
            fields: ['name', 'property', 'humans'],
            data :  [
              //  ['Tutti i Bersagli', 'calc_formula_tot', ''],
                ['Popolazione residente', 'calc_formula_residenti', true],
                ['Popolazione fluttuante turistica (medio)', 'invalid', true],
                ['Popolazione fluttuante turistica (max)', 'invalid', true],
                ['Addetti industria e servizi', 'invalid', true],
                ['Addetti/utenti strutture sanitarie', 'invalid', true],
                ['Addetti/utenti strutture scolastiche', 'invalid', true],
                ['Addetti/utenti centri commerciali', 'invalid', true],
                ['Utenti della strada coinvolti', 'invalid', true],
                ['Utenti della strada territoriali', 'invalid', true],
                ['Zone urbanizzate', 'invalid', false],
                ['Aree boscate', 'calc_formula_aree_boscate', false],
                ['Aree protette', 'invalid', false],
                ['Aree agricole', 'calc_formula_aree_agricole', false],
                ['Acque sotterranee', 'invalid', false],
                ['Acque superficiali', 'invalid', false],
                ['Beni culturali', 'invalid', false]
            ]
        });
        
        var targetMacroStore = new Ext.data.ArrayStore({
            fields: ['name', 'property'],
            data :  [
                ['Tutti i Bersagli', 'calc_formula_tot'],
                ['Tutti i Bersagli Umani', 'calc_formula_tot'],
                ['Tutti i Bersagli Ambientali', 'calc_formula_tot']
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
                    var humans,tmpRec,i; 
                    this.selectedTargetProp = value;
                    this.selectedTargetName = record.get('name');
                    var store=this.bers.getStore();
                    
                    store.removeAll();
                    switch (this.selectedTargetName){
                        case "Tutti i Bersagli":
                            for(i=0; i<targetStore.getCount(); i++){ 
                                store.add(targetStore.getAt(i));
                            }
                            return;
                            break;
                        case "Tutti i Bersagli Umani":
                            humans=true;
                            break;
                        case "Tutti i Bersagli Ambientali":
                            humans=false;
                            break;
                    }
                  
                    for(i=0; i<targetStore.getCount(); i++){
                        tmpRec=targetStore.getAt(i);
                        if(humans == tmpRec.get('humans'))
                           store.add(targetStore.getAt(i));
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
            store: new Ext.data.ArrayStore({
                fields: ['name', 'property', 'humans']
            }),    
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
                render: function(cb){
                    var store=cb.getStore();
                    for(var i=0; i<targetStore.getCount(); i++){ 
                       store.add(targetStore.getAt(i));
                    }
                },
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
            fields: ['name'],
            data :  [
                ['Tutte le classi'],
                ['MATERIE E OGGETTI ESPLOSIVI'],
                ['GAS COMPRESSI, LIQUEFATTI O DISCIOLTI IN PRESSIONE'],
                ['MATERIE LIQUIDE INFIAMMABILI'],
                ['MATERIE SOLIDE INFIAMMABILI'],
                ['MATERIE SOGGETTE AD ACCENSIONE SPONTANEA'],
                ['MATERIE CHE A CONTATTO CON L?ACQUA SVILUPPANO GAS INFIAMMABILI'],
                ['MATERIE COMBURENTI'],
                ['PEROSSIDI ORGANICI'],
                ['MATERIE TOSSICHE'],
                ['MATERIE INFETTANTI'],
                ['MATERIE RADIOATTIVE'],
                ['MATERIE CORROSIVE'],
                ['MATERIE E OGGETTI PERICOLOSE DI ALTRA NATURA']
            ]
        });
        
        var sostanzeStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
                ['Tutte le sostanze'],
                ['IDROGENO COMPRESSO'],
                ['OSSIGENO COMPRESSO'],
                ['GAS DI PETROLIO LIQUEFATTO'],
                ['OSSIDO DI ETILENE (+AZOTO)'],
                ['AMMONIACA ANIDRA'],
                ['OSSIGENO LIQUIDO REFRIGERATO'],
                ['GASOLIO'],
                ['BENZINA'],
                ['METANOLO'],
                ['EPICLORIDRINA']
            ]
        });
               
        
        var accidentStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
                ['Tutti gli Incidenti'],
                ['POOL FIRE DA LIQUIDO INFIAMMABILE'],
                ['FLASH FIRE DA VAPORI LIQUIDO INFIAMMABILE'],
                ['POOL FIRE DA LIQUIDO ESTREMAMENTE INFIAMMABILE'],
                ['FLASH FIRE DA VAPORI LIQUIDO ESTREMAMENTE INFIAMMABILE'],
                ['JET FIRE DI GAS ESTREMAMENTE INFIAMMABILE'],
                ['FIRE BALL'],
                ['DISPERSIONE COMBURENTE'],
                ['RILASCIO SUL SUOLO E NELLE ACQUE'],
                ['DISPERSIONE VAPORI DA LIQUIDO TOSSICO'],
                ['DISPERSIONE VAPORI DA LIQUIDO REFRIGERATO TOSSICO'],
                ['DISPERSIONE GAS DA GAS LIQUEFATTO TOSSICO']
            ]
        });
        
        var seriousnessStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data :  [
                ['Tutte le entità'],
                ['Lieve'],
                ['Grave']
            ]
        });
        
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
            value: "Tutti le classi",
            listeners: {
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                beforeselect: function(cb, record, index){
                    var value = record.get('name');  

                    if(value != 'Tutti le classi'){
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
        
        this.sostanze = new Ext.form.ComboBox({
            fieldLabel: "Sostanze",
            id: "sostanzecb",
            width: 150,
            hideLabel : false,
            store: sostanzeStore,    
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
            value: "Tutti le sostanze",
            listeners: {
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                beforeselect: function(cb, record, index){
                    var value = record.get('name');  

                    if(value != 'Tutti le sostanze'){
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
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
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
                /*beforeselect: function(cb, record, index){
                    var value = record.get('name');  

                    if(value != 'Tutte le entità'){
                        Ext.Msg.show({
                            title: "Scenario Incidentale",
                            msg: "Dati non ancora disponibili per questo scenario",
                            icon: Ext.MessageBox.WARNING
                        });
                        
                        return false;
                    }
                },*/
                "expand": function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
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
                    this.resetBBOX();
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
    
    setAOI: function(bounds) {
        var wgs84Bounds = bounds.transform(this.mapProjection,this.wgs84Projection);
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
            console.log(status);
            syntView.setStatus(status);
        }
    },
    
    removeAOILayer: function(map){
        var aoiLayer = map.getLayersByName("AOI")[0];
      
        if(aoiLayer)
            map.removeLayer(aoiLayer);    
    },
    
    resetBBOX: function(){
            var defBBOX;
            if(this.status){
                defBBOX = this.status.roi.bbox;
            }else{
                defBBOX = new OpenLayers.Bounds.fromString(this.defaultBBOXFilterExtent);
            }
            this.setAOI(defBBOX);            
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
        this.status = status;
        this.elab.setValue(this.status.processing);
        this.form.setValue(this.status.form);
        this.setAOI(this.status.roi.bbox);
        
        this.macrobers.setValue(this.status.macroTarget);
        if(this.status.macroTarget != this.status.target)
            this.bers.setValue(this.status.target);
        else
            this.bers.setValue(null);
        
        this.accident.setValue(this.status.accident);        
        this.seriousness.setValue(this.status.seriousness);
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
        obj.macroTarget = this.macrobers.getValue();
        obj.accident = this.accident.getValue();
        obj.seriousness = this.seriousness.getValue();
        
        return obj;
    }
});

Ext.preg(gxp.plugins.StandardProcessing.prototype.ptype, gxp.plugins.StandardProcessing);
