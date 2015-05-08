/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = StandardProcessing
 *    This module implements a panel to insert parameters for Standard Processing evaluation.
 *    This includes: type of processing and formula selection, area of interest, type of targets involved, types of accident involved
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
    elaborazioneLabel: "Tipo elaborazione",
    formulaLabel: "Formula",                
    resolutionLabel: "Risoluzione",                
    northLabel:"Nord",
    westLabel:"Ovest",
    eastLabel:"Est",
    southLabel:"Sud",
    aoiFieldSetTitle: "Ambito Territoriale",
    setAoiText: "Seleziona Area",        
    setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
    notAvailableProcessing: "Tipo di elaborazione non ancora disponibile",
    targetLabel: "Bersaglio",
    macroTargetLabel: "Categoria",
    targetSetLabel: "Tipo bersaglio",
    adrLabel: "Classe ADR",
    sostanzeLabel: "Sostanza",
    accidentLabel: "Incidente",
    accidentSetLabel: "Tipo Incidente",
    seriousnessLabel: "Entità",
    resetButton: "Reimposta",
    cancelButton: "Annulla",
    viewMapButton: "Avvia Elaborazione",
    formLabel: "Impostazioni di Elaborazione",
    bboxValidationTitle: "Selezione Area di Interesse",
    requiredMaterial: "Questa formula richiede di specificare la sostanza",
    requiredAccident: "Questa formula richiede di specificare l\'incidente",
    requiredSeriousness: "Questa formula richiede di specificare la gravità",
    requiredDamageArea: "Selezionare l'area di danno",
    validationTitle: "Errore nei parametri",
    invalidAOI: "Le coordinate dell'area di interesse non sono valide.",
    bboxTooBig: "L'area selezionata e' troppo grande e il server potrebbe impiegare molto tempo a rispondere. Se si desidera continuare ugualmente premere OK.",
    temporalLabel: "Temporali",
    conditionsFielSetLabel: "Condizioni",   
    allClassOption: "Tutte le classi",
    allSostOption: "Tutte le sostanze",
    allScenOption: "Tutti gli incidenti",
    allEntOption: "Tutte le entità",
    allTargetOption: "Tutti i Bersagli",
    allHumanTargetOption: "Tutti i Bersagli Umani",
    allNotHumanTargetOption: "Tutti i Bersagli Ambientali",
    entLieve: "Lieve",
    entGrave: "Grave",
    humanRiskLabel: "Rischio Sociale",
    notHumanRiskLabel: "Rischio Ambientale",
    lowRiskLabel: "Basso Rischio",
    mediumRiskLabel: "Medio Rischio",
    highRiskLabel: "Alto Rischio",
    notVisibleOnArcsMessage: "Formula non visibile a questa scala",
    notVisibleOnGridMessage: "Formula non visibile a questa scala",
    areaTooBigMessage: "Area selezionata troppo grande per questa formula / risoluzione",
    resolutionNotAllowedMessage: "La risoluzione selezionata non è compatibile con l'ambito territoriale",
    resolutionLevel1: "Segmento 100m",
    resolutionLevel2: "Segmento 500m",
    resolutionLevel3: "Griglia",
    resolutionLevel4: "Rappr. Amministrativa Comunale",
    resolutionLevel5: "Rappr. Amministrativa Provinciale",
    selectionAreaLabel: "Area Selezionata",
    alertSimGridReloadTitle: "Aggiornamento Bersagli",
    alertSimGridReloadMsg: "Vuoi aggiornare i Bersagli? - Tutte le modifica andranno perse!",    
    formulaHelpTitle: "Descrizione Formula",
    // End i18n.
        
    cellViewScale: 500010,
    maxProcessingArea: {
        0: 10000000,
        1: 100000000,
        2: 10000000000,
        3: 1000000000000,
        4: 10000000000000,
        5: 100000000000000
    },
        
    // TODO: bbox piemonte    
    spatialFilterOptions: {
        lonMax: 20037508.34,   
        lonMin: -20037508.34,
        latMax: 20037508.34,   
        latMin: -20037508.34  
    },           
    
    toggleGroup: "toolGroup",
        
    outputTarget: null,
    
    aoi: null,
    
    seldamagearea: null,
    
    syntheticView: "syntheticview",
    
    appTarget: null,
    
    geometryName: "the_geom",
    accidentTipologyName: "tipology",
    
    selectionLayerName: "geosolutions:aggregated_data_selection",
    selectionLayerTitle: "ElaborazioneStd", 
    selectionLayerBaseURL: "http://localhost:8080/geoserver/wms",
    selectionLayerProjection: "EPSG:32632",    
    
    urlEPSG: null,
    epsgWinHeight: null,
    epsgWinWidth: null,  

    aoiFieldset: null,
    
    selDamage: null,
    
    /*WFSStores settings*/
    wfsURL: "http://84.33.2.23/geoserver/wfs",
    wfsVersion: "1.1.0",
    destinationNS: "destinationprod",
    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
       gxp.plugins.StandardProcessing.superclass.constructor.apply(this, arguments);
       this.createStores();
    },
    
    createStores: function() {
        this.createElaborazioneStores();
        this.createConditionsStores();
        this.createTargetStores();
        this.createAccidentStores();
    },
    
    createElaborazioneStores: function() {
        //
        // Tipo Elaborazione
        //                
        this.elaborazioneStore = new GeoExt.data.FeatureStore({ 
             id: "elaborazioneStore",
             fields: [{
                        "name": "id",              
                        "mapping": "id_elaborazione"
              },{
                        "name": "name",              
                        "mapping": "descrizione_elaborazione_" + GeoExt.Lang.locale
              }],
             proxy: this.getWFSStoreProxy("siig_mtd_d_elaborazione")
        });
        this.elaborazioneStore.load(); 
        
        //
        // Formula
        //        
        this.formulaStore = new GeoExt.data.FeatureStore({ 
             id: "formulaStore",
             fields: [{
                        "name": "id_formula",              
                        "mapping": "id_formula"
              },{
                        "name": "id_elaborazione",              
                        "mapping": "id_elaborazione"
              },{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "help",              
                        "mapping": "help_" + GeoExt.Lang.locale
              },{
                        "name": "udm",              
                        "mapping": "udm_" + GeoExt.Lang.locale
              },{
                        "name": "udm_soc",              
                        "mapping": "udm_" + GeoExt.Lang.locale + "_soc"
              },{
                        "name": "udm_env",              
                        "mapping": "udm_" + GeoExt.Lang.locale + "_env"
              },{
                        "name": "visibile",              
                        "mapping": "flg_visibile"
              },{
                        "name": "ambito_territoriale",              
                        "mapping": "ambito_territoriale"
              },{
                        "name": "condizioni_temporali",              
                        "mapping": "condizioni_temporali"
              },{
                        "name": "condizioni_meteo",              
                        "mapping": "condizioni_meteo"
              },{
                        "name": "bersagli_tutti",              
                        "mapping": "bersagli_tutti"
              },{
                        "name": "bersagli_umani",              
                        "mapping": "bersagli_umani"
              },{
                        "name": "bersagli_ambientali",              
                        "mapping": "bersagli_ambientali"
              },{
                        "name": "sostanze",              
                        "mapping": "sostanze"
              },{
                        "name": "incidenti",              
                        "mapping": "incidenti"
              },{
                        "name": "gravita",              
                        "mapping": "gravita"
              },{
                        "name": "tema_low",              
                        "mapping": "tema_low"
              },{
                        "name": "tema_medium",              
                        "mapping": "tema_medium"
              },{
                        "name": "tema_max",              
                        "mapping": "tema_max"
              },{
                        "name": "tema_low_soc",              
                        "mapping": "tema_low_soc"
              },{
                        "name": "tema_medium_soc",              
                        "mapping": "tema_medium_soc"
              },{
                        "name": "tema_max_soc",              
                        "mapping": "tema_max_soc"
              },{
                        "name": "tema_low_env",              
                        "mapping": "tema_low_env"
              },{
                        "name": "tema_medium_env",              
                        "mapping": "tema_medium_env"
              },{
                        "name": "tema_max_env",              
                        "mapping": "tema_max_env"
              }],
             proxy: this.getWFSStoreProxy('formule' , null, 'ordine_visibilita')
        });
        this.formulaStore.load();
        
        this.resolutionStore = new Ext.data.ArrayStore({
            fields: ['id_resolution', 'name'],
            data :  [[1,this.resolutionLevel1], [2,this.resolutionLevel2], [3,this.resolutionLevel3], [4,this.resolutionLevel4], [5,this.resolutionLevel5]]
        });
    },
    
    createConditionsStores: function() {
        //
        // Temporal
        //
        var temporalFilter= new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "fk_tipo_variabile",
            value: 1
        });
        
        this.temporalStore= new GeoExt.data.FeatureStore({ 
             id: "temporalStore",
             fields: [{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "value",        
                        "mapping": "campo_fp"
              }],
             proxy: this.getWFSStoreProxy("siig_t_variabile", temporalFilter, 'id_variabile')
        });
        this.temporalStore.load();
    },
    
    createTargetStores: function() {
        //
        // Target
        //
        this.targetStore = new GeoExt.data.FeatureStore({ 
             id: "targetStore",
             fields: [{
                        "name": "id_bersaglio",              
                        "mapping": "id_bersaglio"
              },{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "flg_umano",        
                        "mapping": "flg_umano"
              },{
                        "name": "description",        
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "severeness",        
                        "mapping": "id_bersaglio"
              }],
             proxy: this.getWFSStoreProxy("siig_t_bersaglio", undefined, "id_bersaglio")
        });
        
        this.targetMacroStore = new Ext.data.ArrayStore({
            fields: ['layer', 'name', 'property', 'humans', 'code', 'macro', 'id', 'id_bersaglio', 'description', 'severeness'],
            data :  []
        });
        
        var layers= [null,'popolazione_residente_pl','popolazione_turistica','popolazione_turistica',
            'industria_servizi_pl','strutture_sanitarie_pl','strutture_scolastiche_pl',
            'centri_commerciali_pl','utenti_coinvolti','utenti_territoriali','zone_urbanizzate','aree_boscate',
            'aree_protette','aree_agricole','acque_sotterranee_pl',
            'acque_superficiali','beni_culturali_pl'];
        
        this.targetStore.on('load', function(str, records) {
            var allIDsArray= []; 
            var code=0;
            var humanIDsArray= [];
            var notHumanIDsArray= [];
            var allDescsMap = {};
            var humanDescsMap = {};
            var notHumanDescsMap = {};
            Ext.each(records,function(record) {
                var flg_umano = parseInt(record.get("flg_umano"), 10);
                var id = parseInt(record.get("id_bersaglio"), 10);
                allIDsArray.push(id);
                allDescsMap[id] = record.get("name");
                record.set( "layer", layers[parseInt(id, 10)]);
                record.set( "property", 'calc_formula_tot');
                record.set( "humans", flg_umano === 1);
                
                // TODO: mah!?!
                var code = {
                    10: '0',
                    11: '1',
                    12: '2',
                    13: '3',
                    14: '4',
                    15: '5',
                    16: '6'
                }[id] || '-1';
                
                record.set( "code", code);

                record.set( "macro", false);
                record.set( "description", {id: record.get("name")});
                record.set( "severeness", flg_umano ? '1,2,3,4' : '5');
                  
                record.set( "id", [record.get("id_bersaglio")]);
                if(flg_umano!= 1){
                    notHumanIDsArray.push(id);
                    notHumanDescsMap[id] = record.get("name");
                } else {
                    humanIDsArray.push(id); 
                    humanDescsMap[id] = record.get("name");
                }
            }, this);
            this.macroBersData = [
                ['bersagli_all', this.allTargetOption, 'calc_formula_tot', null, '-2', true, allIDsArray, -1, allDescsMap, '1,2,3,4,5'],
                ['bersagli_umani', this.allHumanTargetOption, 'calc_formula_tot', true, '-1', true, humanIDsArray, -2, humanDescsMap, '1,2,3,4'],
                ['bersagli_ambientali', this.allNotHumanTargetOption, 'calc_formula_tot', false, '-2', true, notHumanIDsArray, -3, notHumanDescsMap, '5']
            ];
            this.targetMacroStore.loadData(this.macroBersData, true);
        }, this);
        this.targetStore.load();
    },
    
    createAccidentStores: function() {
        //
        // Classi ADR
        //
        var filterDest = new OpenLayers.Filter.FeatureId({
            fids: ["siig_d_classe_adr.2","siig_d_classe_adr.3","siig_d_classe_adr.9"]
        });
      
        this.classiADRStore = new GeoExt.data.FeatureStore({ 
             id: "classiStore",
             fields: [{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "value",        
                        "mapping": "id_classe_adr"
              }],
             proxy: this.getWFSStoreProxy("siig_d_classe_adr", filterDest, "id_classe_adr")
        });
        
        this.classiADRStore.on('load', function(str, records) {
            str.insert(0, new str.recordType({name: this.allClassOption, value:'0'}, 1000));
        }, this);
        this.classiADRStore.load();
       
        //
        // Sostanze
        //
        this.sostanzeStore= new GeoExt.data.FeatureStore({ 
            id: "sostStore",
            fields: [{
                "name": "name",              
                "mapping": "nome_sostanza_" + GeoExt.Lang.locale
            },{
                "name": "value",        
                "mapping": "id_sostanza"
            },{
                "name": "class",        
                "mapping": "fk_classe_adr"
            }],
            proxy: this.getWFSStoreProxy("siig_t_sostanza")
        });
                    
        this.sostanzeStore.on('load', function(str, records) {
            var allIDsArray= new Array(); 
            Ext.each(records,function(record){
                var id = parseInt(record.get("value"), 10);
                allIDsArray.push(id);
                record.set( "id", [id]);
            },this);
            str.insert(0, new str.recordType({name: this.allSostOption, value:'0', id: allIDsArray}, 1000));
        }, this);
        this.sostanzeStore.load();
        
        this.sostanzeToAccidentStore = new GeoExt.data.FeatureStore({ 
            id: "sostaccStore",
            fields: [{
                "name": "sostanza",              
                "mapping": "id_sostanza"
            }, {
                "name": "scenario",              
                "mapping": "id_scenario"
            }, {
                name: 'psc',
                mapping: 'psc'
            }],
            proxy: this.getWFSStoreProxy("siig_r_scenario_sostanza")
        });
        this.sostanzeToAccidentStore.load();
        
        //
        // Scenari
        //
        this.accidentStore = new GeoExt.data.FeatureStore({ 
            id: "accStore",
            fields: [{
                "name": "name",              
                "mapping": "tipologia_" + GeoExt.Lang.locale
            },{
                "name": "value",        
                "mapping": "codice"
            },{
                "name": "id",        
                "mapping": "id_scenario"
            },{
                "name": "description",        
                "mapping": "tipologia_" + GeoExt.Lang.locale
            }],
            proxy: this.getWFSStoreProxy("siig_t_scenario")
        });       

        this.accidentStore.on('load', function(str, records) {
            var allIDsArray= []; 
            var allDescsMap = {};
            Ext.each(records,function(record){
                var id= parseInt(record.get("id"));
                allIDsArray.push(id);
                record.set( "id", [id]);
                allDescsMap[id] = record.get("name");
                record.set( "description",  {id: record.get("name")});
            }, this);
            str.insert(0, new str.recordType({name: this.allScenOption, value:'0', id:allIDsArray, "description": allDescsMap }, 1000));
        }, this);
        
        this.accidentStore.load();
        
        //
        // Entità
        //
        this.seriousnessStore = new Ext.data.ArrayStore({
            fields: ['name', 'value', 'id'],
            data :  [
            [this.allEntOption, '0', [0,1]],
            [this.entLieve, 'L', [0]],
            [this.entGrave, 'G', [1]]
            ]
        });
    },
    
    /** public: method[show]
     *  
     */
    show: function() {
        this.initialized = true;
        this.map = this.appTarget.mapPanel.map;    
        
        // init tools
        this.aoiFieldset = this.appTarget.tools[this.aoi].getAOI();
        this.syntView = this.appTarget.tools[this.syntheticView];
        this.selDamage=this.appTarget.tools[this.seldamage].getSelDamage();
        this.selDamage.hide();
            
        this.buildForm(this.map);
    },
    
    reshow: function(containerTab) {
        var active = containerTab.getActiveTab();
        this.map.events.register("move", this, this.aoiUpdater);
        active.disable();
        containerTab.setActiveTab(1);
        active = containerTab.getActiveTab();
        active.enable();
    },
    
    /** private: method[buildForm]
     *  :arg map: ``Object``
     *    builds the standard processing main (all including) form
     */
    buildForm: function(map){        
      
        // updates the AOI on map pan / zoom
        this.aoiUpdater = function() {            
            var extent=map.getExtent().clone();
            this.aoiFieldset.setAOI(extent);                    
            this.aoiFieldset.removeAOILayer(map);            
        };
        map.events.register("move", this, this.aoiUpdater);
        
        this.syntView.getControlPanel().disable();

        var containerTab = Ext.getCmp(this.outputTarget);
        
        this.panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            title: this.title,
            autoScroll: true,
            items:[
                this.buildElaborazioneForm(),  
                this.buildConditionsForm(),
                this.selDamage,
                this.aoiFieldset, 
                this.buildTargetForm(),
                this.buildAccidentForm()
            ],
            buttons: [{
                text: this.cancelButton,
                iconCls: 'cancel-button',
                scope: this,
                handler: this.cancelProcessing
            },{
                text: this.resetButton,
                iconCls: 'reset-button',
                scope: this,
                handler: this.resetForm
            }, {
                text: this.viewMapButton,
                iconCls: 'visualizzation-button',
                scope: this,
                handler: function(){                    
                    var params = this.startProcessing();
                }
            }]
        });
        containerTab.insert(1,this.panel);
        containerTab.setActiveTab(this.panel);

        
        if(!this.status){
            this.resetBBOX();
        }    
    },
    
    /** private: method[buildElaborazioneForm]
     *    builds the form for processing and formula choosing
     */
    buildElaborazioneForm: function() {        
        
        this.elaborazione = new Ext.form.ComboBox({
            fieldLabel: this.elaborazioneLabel,
            id: "elabcb",
            width: 150,
            hideLabel : false,
            store: this.elaborazioneStore, 
            valueField: 'id',
            displayField: 'name',   
            lastQuery: '',
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,            
            editable: false,
            resizable: true,    
            listeners: {
                scope: this,                
                expand: function(combo) {
                    //this.loadUserElab = false;
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(combo, record, index) {
                    // to change formula according to scale
                    var store = this.formula.getStore();
                    this.filterComboFormulaScale(this.formula);
                    this.formula.setValue(store.getAt(0).get('id_formula'));
                    Ext.getCmp('warning_message').setValue(''); 
                    this.enableDisableForm(this.getComboRecord(this.formula, 'id_formula'), record);
                    this.enableDisableSimulation(record.get('id') === 3);
                }
            }          
        });
        
        this.elaborazione.setValue(this.elaborazioneStore.getAt(0).get('id'));
              
        this.formula = new Ext.form.ComboBox({
            fieldLabel: this.formulaLabel,
            id: "elabfr",
            width: 150,
            hideLabel : false,
            store: this.formulaStore, 
            valueField: 'id_formula',            
            displayField: 'name',    
            lastQuery: '',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,
            onRender: function() {
                Ext.form.ComboBox.prototype.onRender.apply(this, arguments);
                this.el.up('').appendChild(Ext.DomHelper.createDom({
                    tag: 'span',
                    cls: 'formula-help'
                }));
                this.el.up('').select('.formula-help').on('click', function() {
                    this.fireEvent('help', this);
                }, this);
            },
            listeners: {
                scope: this,                
                expand: function(combo) {
                    //this.loadUserElab = false;
                    
                    // change formula according to scale
                    this.filterComboFormulaScale(combo);
                    
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(combo, record, index) {
                    this.enableDisableForm(record, this.getComboRecord(this.elaborazione, 'id'));
                },
                help: function(combo) {
                    var formulaRec = this.formulaStore.getAt(this.formulaStore.findExact("id_formula",this.formula.getValue()));
                    this.showFormulaHelp(formulaRec.get('help') || 'help');
                }
            } 
        });
        
        
        this.filterComboFormulaScale(this.formula);
        this.formula.setValue(this.formulaStore.getAt(0).get('id_formula'));
       
        this.resolution = new Ext.form.ComboBox({
            fieldLabel: this.resolutionLabel,
            id: "elabres",
            width: 150,
            hideLabel : false,
            store: this.resolutionStore, 
            valueField: 'id_resolution',            
            displayField: 'name',    
            lastQuery: '',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,    
            listeners: {
                scope: this,                
                expand: function(combo) {
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(combo, record, index) {
                    //this.enableDisableForm(record, this.getComboRecord(this.elaborazione, 'id'));
                }
            } 
        });
        
        this.resolution.setValue(this.resolutionStore.getAt(0).get('id_resolution'));
       
        this.elabSet = new Ext.form.FieldSet({
            title: this.formLabel,
            id: 'elabfset',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
            this.elaborazione,
            this.formula,
            this.resolution
            ]
        });
        
        return this.elabSet;
    },
    
    showFormulaHelp: function(helpMsg) {
        this.formulaHelpWin = new Ext.Window({
			title: this.formulaHelpTitle,
			layout: "fit",
			width: 600,
			height: 500,
			closeAction: 'close',
			resizable: false,
			plain: true,
			border: false,
			modal: true,
			items: [
				{
					xtype:'box',
                    style: 'background-color: white; overflow: auto;',
					html: '<div class="formula-help-text">' + helpMsg + '</div>'
				}
			],
			keys: [{ 
				key: [Ext.EventObject.ESC], 
				handler: function() {
					this.formulaHelpWin.close();
				},
				scope: this
			}]
		});
		this.formulaHelpWin.show();
    },
    
    /** private: method[buildConditionsForm]
     *    builds the form for temporal and weather choosing
     */
    buildConditionsForm: function() {        
        this.temporal = new Ext.form.ComboBox({
            fieldLabel: this.temporalLabel,
            id: "time",
            width: 150,
            hideLabel : false,
            store: this.temporalStore,    
            displayField: 'name', 
            valueField: 'value',
            mode: 'local',
            lastQuery: '',
            forceSelection: true,
            disabled: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,    
            listeners: {                
                scope: this
            }              
        });
        
        this.temporal.setValue(this.temporalStore.getAt(0).get('value'));
       
        this.conditionsSet = new Ext.form.FieldSet({
            title: this.conditionsFielSetLabel,
            id: 'conditionStoreSet',
            autoHeight: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
            this.temporal/*,    
            this.weather*/
            ]
        });
        
        return this.conditionsSet;
    },
    
    /** private: method[buildTargetForm]
     *    builds the form for target type choosing
     */
    buildTargetForm: function() {
        
        this.macrobers = new Ext.form.ComboBox({
            fieldLabel: this.macroTargetLabel,
            id: "macrobers",
            width: 150,
            hideLabel : false,
            store: this.targetMacroStore,    
            displayField: 'name',    
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,    
            value: this.allTargetOption,
            listeners: {
                scope: this,
                select: function(cb, record, index) {
                    var type = record.get('humans');
                    var startValue = cb.startValue;
                    this.updateTargetCombo(type);
                    var processingCombo = this.elaborazione.getValue();
                    this.enableDisableSimulation(processingCombo === 3,type,startValue);
                }
            }              
        });
       

        this.bers = new Ext.form.ComboBox({
            fieldLabel: this.targetLabel,
            id: "bers",
            width: 150,
            hideLabel : false,
            store: this.targetStore,    
            clearFilterOnReset: false,
            displayField: 'name',    
            mode: 'local',
            lastQuery: '',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,            
            editable: false,
            resizable: true,
            listeners: {
                scope: this,
                select: function(cb, record, index) {
                    var type = 'bers';
                    var startValue = cb.startValue;
                    var processingCombo = this.elaborazione.getValue();
                    this.enableDisableSimulation(processingCombo === 3,type,startValue);                    
                },
                expand: function(combo) {
                    //this.loadUserElab = false;
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                } 
            } 
        });
        
        this.bersSet = new Ext.form.FieldSet({
            title: this.targetSetLabel,
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
        return this.bersSet;
    },
    
    /** private: method[buildAccidentForm]
     *    builds the form for accidents choosing (with 4 cascading combos)
     */
    buildAccidentForm: function(map){
        
        this.classi = new Ext.form.ComboBox({
            fieldLabel: this.adrLabel,
            id: "classicb",
            width: 150,
            hideLabel : false,
            store: this.classiADRStore,    
            displayField: 'name',    
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,
            value: this.allClassOption,
            lazyInit: false,
            listeners: {
                "expand": function(combo) {
                    //this.loadUserElab = false;
                    var store=combo.getStore();
                    delete store.baseParams.filter;
                    combo.getStore().reload();
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },                
                select: function(cb, record, index) {
                    // filtra solo la combo delle sostanze in base alla classe scelta, resetta gli altri filtri
                    var classe = record.get('value'); 

                    if(classe != "0"){
                        this.sostanzeStore.filterBy(function(record, id) {
                            return id === 1000 || record.get('class') === classe;
                        }, this);
                    } else {
                        this.sostanzeStore.clearFilter();
                    }
                    this.resetCombos([this.sostanze]);
                },
                scope: this
            }              
        });            
        
        this.sostanze = new Ext.form.ComboBox({
            fieldLabel: this.sostanzeLabel,
            id: "sostanzecb",
            width: 150,
            hideLabel : false,
            store: this.sostanzeStore, 
            displayField: 'name',    
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,    
            lazyInit: false,            
            value: this.allSostOption,
            listeners: {
                "expand": function(combo) {
                    //this.loadUserElab = false;
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                
                select: function(cb, record, index) {
                    var sost = record.get('value');
                    if(sost != "0") {
                        this.sostanzeToAccidentStore.filter('sostanza', sost);
                        var fids = {};
                        
                        this.sostanzeToAccidentStore.each(function(record){
                            if(record.get("psc") > 0.0) {
                                fids[record.get("scenario")] = true;
                            }
                        }, this);
                        this.accidentStore.filterBy(function(record, id) {
                            return id === 1000 || fids[record.get('id')[0]];
                        }, this);
                    } else {
                        this.accidentStore.clearFilter();
                    }

                    this.resetCombos([this.accident]);
                },
                scope: this
            }              
        });
        
        this.accident = new Ext.form.ComboBox({
            fieldLabel: this.accidentLabel,
            id: "accidentcb",
            width: 150,
            hideLabel : false,
            store: this.accidentStore,   
            lastQuery:'',
            displayField: 'name',    
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,
            lazyInit: false,
            value: this.allScenOption,
            listeners: {
                "expand": function(combo) {
                    //this.loadUserElab = false;
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(cb, record, index) {
                    this.resetCombos([this.seriousness]);                           
                },
                scope: this
            }              
        });
        
        this.seriousness = new Ext.form.ComboBox({
            fieldLabel: this.seriousnessLabel,
            id: "seriousnesscb",
            width: 150,
            hideLabel : false,
            store: this.seriousnessStore,    
            displayField: 'name',    
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: false,
            resizable: true,
            value: this.allEntOption,
            lazyInit: false          
        });
        
        this.accidentSet = new Ext.form.FieldSet({
            title: this.accidentSetLabel,
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
        
        return this.accidentSet;
    },
    
    filterComboFormulaScale: function(combo) {
        var store = combo.getStore();
        /**
        TODO: do we need scale based formula filter also with resolutions?
        var scale = Math.round(this.map.getScale());
        
        if(scale>=this.syntView.cellViewScale){
            store.filter([
              {
                fn   : function(record) {
                  return (record.get('visibile') >= 2);
                },
                scope: this
              },{
                fn   : function(record) {
                  return (record.get('id_elaborazione') == this.elaborazione.getValue());
                },
                scope: this
              }                      
            ]);
        }else{**/
        store.filter([
          {
            fn   : function(record) {
              return ((record.get('visibile') == 1) || (record.get('visibile') == 3));
            },
            scope: this
          },{
            fn   : function(record) {
              return (record.get('id_elaborazione') == this.elaborazione.getValue());
            },
            scope: this
          }                          
        ]);
        /*}*/
    },
    
	reproject: function(coll, sourceProjection, destProjection) {
		// workaround to make transform consider towgs84 params
		var epsg4326 = new OpenLayers.Projection('EPSG:4326');
		coll = coll.transform(
			sourceProjection,
			epsg4326
		);
		return coll.transform(
			epsg4326,
			destProjection													
		);	
	},
    
    /** private: method[resetForm]
     *     resets the form with initial values
     */
    resetForm: function(){                
        this.panel.getForm().reset();
        this.aoiFieldset.removeAOILayer();
        this.selDamage.clearDrawFeature();
        this.resetBBOX(true);
    },
    
    
    enableDisableForm: function(formula, elaborazione) {
        this.enableDisableAOI(formula, elaborazione);
        this.enableDisableSelAreaDamage(formula, elaborazione);
        this.enableDisableTemporali(formula, elaborazione);
        this.enableDisableTargets(formula, elaborazione);
        this.enableDisableScenario(formula, elaborazione);
        this.enableDisableResolution(formula, elaborazione);
    },
    
    enableDisableTemporali: function(formula, elaborazione) {
        if(formula){
            this.enableDisable(formula.get('condizioni_temporali') && elaborazione.get('id') === 2, this.temporal);        
        }else{
            this.enableDisable(elaborazione.get('id') !== 4, this.temporal);
        }
    },
    
    enableDisableResolution: function(formula, elaborazione) {
        var enable = false;
        if(formula){
            enable = formula.get('ambito_territoriale')  && elaborazione.get('id') <= 2;
        }
        this.enableDisable(enable, this.resolution);
        if(!enable) {
            this.resolution.setValue(this.resolutionStore.getAt(0).get('id_resolution'));
        }
    },
    
    enableDisableAOI: function(formula, elaborazione) {
        if(formula){
            this.enableDisable(formula.get('ambito_territoriale') && elaborazione.get('id') !== 4, this.aoiFieldset);
        }else{
            this.enableDisable(elaborazione.get('id') !== 4, this.aoiFieldset);      
        }
    },
    
    enableDisableSelAreaDamage: function(formula, elaborazione) {
        this.enableDisable(elaborazione.get('id') === 4, this.selDamage);        
    },
    
    enableDisableTargets: function(record) {
        if(record){
            var hasTargets = record.get('bersagli_tutti') || record.get('bersagli_umani') || record.get('bersagli_ambientali');
            this.enableDisable(hasTargets, this.macrobers);
            this.enableDisable(hasTargets, this.bers);
            
            if(hasTargets) {
                var data;
                var type;            
                
                if(record.get('bersagli_tutti')) {
                    data = this.macroBersData;
                    type = null;
                } else if(record.get('bersagli_umani')) {
                    data = [this.macroBersData[1]];
                    type = true;
                } else if(record.get('bersagli_ambientali')) {
                    data = [this.macroBersData[2]];
                    type = false;
                }
                this.targetMacroStore.loadData(data);
                this.macrobers.setValue(data[0][1]);
                this.updateTargetCombo(type);
            }
        }
    },
    
    enableDisable: function(condition, widget) {
        if(condition) {
            if(widget.id === "aoi_widget" || widget.id ==="seldamage_widget"){
                widget.show()
            }else{
                widget.enable();
            }
        } else {
            if(widget.id === "aoi_widget" || widget.id ==="seldamage_widget"){
                widget.hide()
            }else{
                widget.disable();
            }
        }
    },
    
    
    // apply simulation grid reload
    updateSimulationTabPabelConfirm: function(wfsGrid,syntView,map,type,startValue){

        if(type !== 'bers' && type !== 'reload' && type !== 'init')
            this.updateTargetCombo(type);
            
        var viewParams;                
        var status = this.getStatus();        
        var bounds = syntView.getBounds(status, map);
        viewParams = "bounds:" + bounds;
        var extraTargets;
        var allowExtraTargetsUpdate = false;
        if(type === 'init') {
            extraTargets = this.status.simulation.targetsInfo;
            allowExtraTargetsUpdate = true;
        }
        if(this.isSingleTarget(status)) {
            wfsGrid.loadGrids(["id", "type"], [status.target['id_bersaglio'], 'all'], syntView.selectionLayerProjection, viewParams,undefined,extraTargets,true,allowExtraTargetsUpdate);                                
        } else if(this.isAllHumanTargets(status)) {
            wfsGrid.loadGrids("type", ['umano', 'all'], syntView.selectionLayerProjection, viewParams,undefined,extraTargets,true,allowExtraTargetsUpdate);
        } else if(this.isAllNotHumanTargets(status)) {
            wfsGrid.loadGrids("type", ['ambientale','all'], syntView.selectionLayerProjection, viewParams,undefined,extraTargets,true,allowExtraTargetsUpdate);
        } else {
            wfsGrid.loadGrids(null ,null , syntView.selectionLayerProjection, viewParams,undefined,extraTargets,true,allowExtraTargetsUpdate);
        }
    
    },
    
    // check if same target is change then apply the simulation grid reload
    updateSimulationTabPabel: function(wfsGrid,syntView,map,type,startValue){
        // check modify on grafo_simulazione 
        var arcIsEmpty = true;
        var targetsAreEmpty = true;
        var isEmpty = function (obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        
        if(wfsGrid.currentGrids && wfsGrid.currentGrids.length >0){
            for (var i=0,c=wfsGrid.currentGrids.length;i<c;i++){
                if (wfsGrid.currentGrids[i].featureType === "grafo_simulazione"){
                    var save = wfsGrid.currentGrids[i].save;
                    arcIsEmpty = isEmpty(save);
                } else {
					var save = wfsGrid.currentGrids[i].save;
                    if(!isEmpty(save)) {
						targetsAreEmpty = false;
					}
				}
            }
        }
        
        // get simulation layers
        var map = app.mapPanel.map;
        var selectedTargetLayer = map.getLayersByName(syntView.selectedTargetLayer)[0];       
        
        var selectedTargetLayerEditing = map.getLayersByName(syntView.selectedTargetLayerEditing)[0];
        var simulationAddedLayer = map.getLayersByName(syntView.simulationAddedLayer)[0];
        var simulationChangedLayer = map.getLayersByName(syntView.simulationChangedLayer)[0];
        var simulationRemovedLayer = map.getLayersByName(syntView.simulationRemovedLayer)[0];
        
        var simulationModLayer = map.getLayersByName(syntView.simulationModLayer)[0];        

        // function to apply refresh or not
        var reloadGrid = function(btn, text){
            if (btn == 'yes'){
                /*if (selectedTargetLayer)
                    selectedTargetLayer.removeAllFeatures();*/
                if (selectedTargetLayerEditing)
                    selectedTargetLayerEditing.removeAllFeatures(); 
                if (simulationAddedLayer)
                    simulationAddedLayer.removeAllFeatures();                     
                if (simulationChangedLayer)
                    simulationChangedLayer.removeAllFeatures();               
                if (simulationRemovedLayer)
                    simulationRemovedLayer.removeAllFeatures();
                /*if (simulationModLayer)
                    simulationModLayer.removeAllFeatures();*/

                this.updateSimulationTabPabelConfirm(wfsGrid,syntView,map,type,startValue);                  
                
                if (selectedTargetLayer && selectedTargetLayer.features.length !== 0){
                    //if (selectedTargetLayer)
                        selectedTargetLayer.removeAllFeatures();              
                }
                
            }else{
                if(type === "bers"){
                    Ext.getCmp("bers").setValue(startValue);
                }else if (type !== "reload"){
                    Ext.getCmp("macrobers").setValue(startValue);
                }
            }
        }; 
        
        // check if grid is changed. If it is changed, appear an alert, else the grid reload
        //if ((selectedTargetLayer && selectedTargetLayer.features.length !== 0) ||
        if ((type !== 'init') && (!this.ignoreSimulationUpdate) && (
            (selectedTargetLayerEditing && selectedTargetLayerEditing.features.length !== 0) || 
            (simulationAddedLayer && simulationAddedLayer.features.length !== 0) || 
            (simulationChangedLayer && simulationChangedLayer.features.length !== 0) || 
            (simulationRemovedLayer && simulationRemovedLayer.features.length !== 0) || 
            //(simulationModLayer && simulationModLayer.features.length !== 0) ||
            !arcIsEmpty || !targetsAreEmpty)){
            
            Ext.Msg.show({
                title: this.alertSimGridReloadTitle,
                buttons: Ext.Msg.YESNO,                
                msg: this.alertSimGridReloadMsg,
                fn: reloadGrid,
                icon: Ext.MessageBox.QUESTION,
                scope: this
            });   
        }else{

            this.updateSimulationTabPabelConfirm(wfsGrid,syntView,map,type,startValue);
            
            if (selectedTargetLayer && selectedTargetLayer.features.length !== 0){
                //if (selectedTargetLayer)
                    selectedTargetLayer.removeAllFeatures();              
            }            
        
        }
        
    },    
    
    enableDisableSimulation: function(enable,type,startValue) {
        var southPanel = Ext.getCmp("south");        
        var wfsGrid = Ext.getCmp("featuregrid");
        if(type === 'init') {
            wfsGrid.currentGrids = null;
        }
        var map = this.appTarget.mapPanel.map;
        
        var scale = Math.round(map.getScale()); 
        
        // nothing to do!!! Set target panels according to target combo selection
        if((enable && this.syntView.simulationEnabled) || (!enable && !this.syntView.simulationEnabled)) {

            this.syntView.simulationLoaded = true;
            if(enable) {
                this.updateSimulationTabPabel(wfsGrid,this.syntView,map,type,startValue);
            }
                
            return;
        }
  
        
        if(enable) {
            this.syntView.simulationRestore = {
                collapsed: southPanel.collapsed,
                buttons: {
                    'roadGraph_view': Ext.getCmp('roadGraph_view').pressed,
                    'areaDamage_view': Ext.getCmp('areaDamage_view').pressed,
                    'targets_view': Ext.getCmp('targets_view').pressed
                }
            };
            
            if(southPanel.collapsed) {
                southPanel.expand();
            } else {
                this.syntView.simulationRestore.grids = wfsGrid.currentGrids;
            }
            
            wfsGrid.removeAllGrids();
            
            this.syntView.simulationLoaded = false;
            
            var wfsGrid = Ext.getCmp("featuregrid");
            wfsGrid.setCurrentPanel('simulation');
            
            if(scale <= this.syntView.analiticViewScale) {
            
                this.syntView.simulationLoaded = true;
                this.updateSimulationTabPabel(wfsGrid,this.syntView,map,type,startValue);
                
            } 

            Ext.getCmp("analytic_view").disable();
            Ext.getCmp("targets_view").disable();
            Ext.getCmp("roadGraph_view").disable(); 
            Ext.getCmp("areaDamage_view").disable();
			Ext.getCmp("refresh_grid").enable();
            Ext.getCmp("refresh_grid").show();
            
            Ext.getCmp("targets_view").toggle(false, true);
            Ext.getCmp("roadGraph_view").toggle(false, true);               
            Ext.getCmp("areaDamage_view").toggle(false, true);
            
            this.syntView.simulationEnabled = true;
        } else {
            if(this.syntView.simulationRestore) {
                if(this.syntView.simulationRestore.collapsed) {
                    southPanel.collapse();
					Ext.getCmp("refresh_grid").hide();
                } else {
					Ext.getCmp("refresh_grid").hide();
                    Ext.getCmp("areaDamage_view").enable();
                    Ext.getCmp("roadGraph_view").enable();
                    Ext.getCmp("targets_view").enable();
                    Ext.getCmp("analytic_view").enable();
					Ext.getCmp("refresh_grid").disable();
					var mapPanelContainer = Ext.getCmp("mapPanelContainer_id");
                    mapPanelContainer.doLayout(false,true);  
                    if(this.syntView.simulationRestore.grids && this.syntView.simulationRestore.grids.length > 0) {
                        wfsGrid.removeAllGrids();
                        wfsGrid.restoreGrids(this.syntView.simulationRestore.grids);
                    }
                }
                for(var buttonId in this.syntView.simulationRestore.buttons) {
                    if(this.syntView.simulationRestore.buttons.hasOwnProperty(buttonId)) {
                        var button = Ext.getCmp(buttonId);
                        var status = this.syntView.simulationRestore.buttons[buttonId];
                        button.toggle(status, true);
                    }
                }
            }            
            this.syntView.removeLayersByName(map, this.syntView.vectorLayers);
            this.syntView.simulationRestore = null;
            this.syntView.simulationEnabled = false;
        }
    },
    
    
    
    isAllHumanTargets: function(status) {
        return status.target['id_bersaglio'] === -2;
    },
    
    isAllNotHumanTargets: function(status) {
        return status.target['id_bersaglio'] === -3;
    },
    
    isSingleTarget: function(status) {
        return parseInt(status.target['id_bersaglio'], 10) > 0;
    },
    
    
    updateTargetCombo: function(type) {        
        if(type !== null) {
            this.targetStore.filter('humans', type);
        } else {
            this.targetStore.clearFilter();
        }
        
        this.bers.setValue(null);
    },
    
    enableDisableScenario: function(record) {
        if(record){
            var hasScenario = record.get('sostanze') || record.get('incidenti') || record.get('gravita');
            this.enableDisable(hasScenario, this.classi);
            this.enableDisable(hasScenario, this.sostanze);
            this.enableDisable(hasScenario, this.accident);
            this.enableDisable(hasScenario, this.seriousness);
            
            if(record.get('sostanze') && !record.get('incidenti')) {
                this.accident.disable();
                this.seriousness.disable();
            } 
            if(record.get('sostanze') && record.get('incidenti') && !record.get('gravita')) {
                this.seriousness.disable();
            }
        }
    },
        
    
    /** private: method[resetCombos]
     *  :arg combos: ``Array``
     *    resets the given combos to their initial value ("all values")
     */
    resetCombos: function(combos) {
        combos = combos || [this.sostanze, this.accident, this.seriousness];
        Ext.each(combos, function(combo) {
            var record = combo.store.getAt(0);
            combo.setValue(record.get('name'));
            combo.fireEvent('select', combo, record, 0);
        });
    },
    
    /** private: method[startProcessing]    
     */
    startProcessing: function(){
        if(!this.aoiFieldset.isValid()){            
            Ext.Msg.show({
                title: this.bboxValidationTitle,
                buttons: Ext.Msg.OK,
                msg: this.invalidAOI,
                icon: Ext.MessageBox.WARNING
            });        
        } else {
            this.validateForm(this.panel.getForm(), this.getAOI());
        }
    },
    
    getAOI: function() {
        var processing = this.getComboRecord(this.elaborazione, "id").get("id");
        if(processing === 4) {
            return this.selDamage.getDamageArea().getBounds();
        } else {
            return this.aoiFieldset.getAOIMapBounds();
        }
    },
    
    matchRoiAndResolution: function(processing, formulaRec, resolutionRec, roi) {
        var resolutionId;
        if(processing >= 3) {
            // seriously limit simulation and damage calculus
            resolutionId = 0;
        } else {
            resolutionId = resolutionRec.get('id_resolution');
        }
        var bbox, area;
        if(roi instanceof OpenLayers.Bounds) {
            bbox = roi;
            
        } else {
            if((resolutionId >= 4 && roi.type === 'comune') || 
                (resolutionId === 5 && roi.type === 'provincia')) {
                return this.resolutionNotAllowedMessage;
            }
            area = roi.area;
            bbox = roi.bbox;
        }
        if(!area) {
            area = (bbox.right - bbox.left) * (bbox.top - bbox.bottom);
        }
        if(area && area > this.maxProcessingArea[resolutionId]) {
            return this.areaTooBigMessage;
        }
        
        
        return null;
    },
    
    /** private: method[validateForm]
     *  :arg form: ``Object``     
     *  :arg roi: ``Object``     
     *     validate forms parameters. If there is no error, processing is started.
     */
    validateForm: function(form, roi) {
        var error = null;
        
        var map = this.appTarget.mapPanel.map;
        
        var formula = this.formula.getValue();
        var sostanza = parseInt(this.getComboRecord(this.sostanze).data.value, 10);
        var incidente = parseInt(this.getComboRecord(this.accident).data.value, 10);
        var entita = this.getComboRecord(this.seriousness).data.value;
        
        var processingRec = this.getComboRecord(this.elaborazione, "id");
        var formulaRec = this.formulaStore.getAt(this.formulaStore.findExact("id_formula",this.formula.getValue()));                
        
        if(formulaRec.get('sostanze') === 2 && sostanza === 0) {
            error = this.requiredMaterial;
        }
        if(!error && formulaRec.get('incidenti') === 2 && incidente === 0) {
            error = this.requiredAccident;
        }
        if(!error && formulaRec.get('gravita') === 2 && entita === '0') {
            error = this.requiredSeriousness;
        }
        if(this.elaborazione.getValue() === 4) {
            // damage calculus
            if(!error && (!this.selDamage.getDamageArea())) {
                error = this.requiredDamageArea;
            }
        }
        
        var resolutionRec = this.resolutionStore.getAt(this.resolutionStore.findExact("id_resolution", this.resolution.getValue()));
        
        if(!error && formulaRec.get('ambito_territoriale')) {
            error = this.matchRoiAndResolution(processingRec.get("id"), formulaRec, resolutionRec, roi); 
        }
        
        if(!error) {
            this.doProcess();
        } else {
            Ext.Msg.show({
                title: this.validationTitle,
                buttons: Ext.Msg.OK,                
                msg: error,
                icon: Ext.MessageBox.ERROR,
                scope: this
            }); 
        }
    },
    
    /** private: method[doProcess]
     *  :arg params: ``Object``     
     *     executes the processing using given parameters
     */
    doProcess: function(){
        var status = this.getStatus();                
        
        //
        // Remove the AOI box
        //
        this.aoiFieldset.removeAOILayer();
        
        // remove Damage Calculus drawn area
        this.selDamage.clearDrawFeature();
        
        this.switchToSyntheticView();
        
        this.syntView.setStatus(status);
        
        
        Ext.getCmp("south").collapse();
        
        this.syntView.doProcess();
        this.map.events.unregister("move", this, this.aoiUpdater);
    },
    
    cancelProcessing: function() {
        this.enableDisableSimulation(false);
        this.switchToSyntheticView();
        Ext.getCmp('warning_message').setValue('');
        this.syntView.restorePreviousState();
        this.selDamage.clearDrawFeature();
    },
    
    switchToSyntheticView: function(){
        var containerTab = Ext.getCmp(this.outputTarget);
        var active = containerTab.getActiveTab();
        active.disable();
            
        containerTab.setActiveTab(0);
        active = containerTab.getActiveTab();
        active.enable(); 
    },
    
    getRoiObject: function() {
        var bbox, roiType, roiId;
        
        var roi = this.getAOI();
        var label;
        if(roi instanceof OpenLayers.Bounds) {
            roiType = 'aoi';
            bbox = roi;
            label = this.selectionAreaLabel;
        } else {
            roiType = roi.type;
            bbox = roi.bbox;
            roiId = roi.id;
            label = roi.name;
        }
        
        return {
            label: label,
            bbox : bbox,
            type: roiType,
            id: roiId
        };
    },
    
    getDamageArea: function(processing) {
        var damageAreaGeometry;
        if(processing === 4) {
            damageAreaGeometry = this.getLayerGeometry(
                this.map,
                this.selDamage.getDamageArea(),
                this.selectionLayerProjection
            );
        }
        return damageAreaGeometry;
    },
    
    getThemasObj: function(processing, formulaRec) {
        if(formulaRec) {
            var low_soc = parseFloat(formulaRec.get('tema_low_soc') || formulaRec.get('tema_low'));
            var medium_soc = parseFloat(formulaRec.get('tema_medium_soc') || formulaRec.get('tema_medium'));
            var max_soc = parseFloat(formulaRec.get('tema_max_soc') || formulaRec.get('tema_max'));
            
            var low_env = parseFloat(formulaRec.get('tema_low_env') || formulaRec.get('tema_low'));
            var medium_env = parseFloat(formulaRec.get('tema_medium_env') || formulaRec.get('tema_medium'));
            var max_env = parseFloat(formulaRec.get('tema_max_env') || formulaRec.get('tema_max'));
            
            return {
                'sociale': [low_soc,medium_soc,max_soc], //Ext.getCmp('rischio_sociale_multislider').getValues(),
                'ambientale': [low_env,medium_env,max_env] //Ext.getCmp('rischio_ambientale_multislider').getValues()
            };
        } else if(processing === 4) {
            // damage calculus
            return {
                'sociale': [100,500,1000], 
                'ambientale': [100,500,1000]
            };
        }
    },
    
    
    /** private: method[getStatus]   
     *  :arg form: ``Object``        
     *     extract processing parameters (status) from the compiled form
     */
    getStatus: function() {
        var processingRec = this.getComboRecord(this.elaborazione, "id");
        var formulaRec = this.getComboRecord(this.formula, "id_formula");
        var resolutionRec = this.getComboRecord(this.resolution, "id_resolution");
        
        var damageAreaGeometry = this.getDamageArea(processingRec.get('id'));
        
        var obj = {
            processing: processingRec.get('id'),
            processingDesc: processingRec.get('name'),
            
            formula: formulaRec.get('id_formula'),
            formulaDesc: formulaRec.get('name'),
            formulaUdm: [formulaRec.get('udm'), formulaRec.get('udm_soc'), formulaRec.get('udm_env')],
            formulaInfo: {
                dependsOnTarget: formulaRec.get('bersagli_tutti') > 0 || formulaRec.get('bersagli_umani') > 0 || formulaRec.get('bersagli_ambientali') > 0,
                dependsOnArcs: formulaRec.get('ambito_territoriale'),
                visibleOnArcs: formulaRec.get('visibile') === 1 || formulaRec.get('visibile') === 3,
                visibleOnGrid: formulaRec.get('visibile') === 2 || formulaRec.get('visibile') === 3
            },
            resolution: resolutionRec.get('id_resolution'),
            resolutionDesc: resolutionRec.get('name'),
            themas: this.getThemasObj(processingRec.get('id'), formulaRec),
            
            roi : this.getRoiObject(),
            
            temporal : this.getComboRecord(this.temporal, 'value').data,
            
            target : this.getSelectedTarget().data,
            macroTarget : this.macrobers.getValue(),
            
            classe : this.getComboRecord(this.classi).data,
            sostanza : this.getComboRecord(this.sostanze).data,
            accident : this.getComboRecord(this.accident).data,
            seriousness : this.getComboRecord(this.seriousness).data,
            
            damageAreaGeometry:  damageAreaGeometry,
            damageArea: damageAreaGeometry ? damageAreaGeometry.toString() : undefined,
            damageAreaType: this.selDamage.getDamageAreaType(),
            simulation : {
                cff:[],
                padr:[],
                pis:[],
                targets:[],
                targetsInfo:[],
                exportInfo:[]
            }
        };

        // simulation
        if(processingRec.get('id') === 3) {
            var wfsGrid = Ext.getCmp("featuregrid");
            
            Ext.each(wfsGrid.currentGrids, function(grid) {
                if(grid.save) {                    
                    for(var id in grid.save) {
                        if(grid.save.hasOwnProperty(id)) {
                            var recordInfo = grid.save[id];
                            for(var propName in recordInfo) {
                                if(recordInfo.hasOwnProperty(propName)) {
                                    var changed = recordInfo[propName];
                                    if(propName === 'pis') {
                                        if(typeof changed !== 'undefined') {
                                            obj.simulation[propName].push(id+','+changed);
                                        }
                                    } else if(changed && Ext.isArray(changed) && changed.length > 0) {
                                        for(var count = 0; count < changed.length; count++) {
                                            obj.simulation[propName].push(id+','+changed[count].id+','+changed[count].value);
                                        }
                                    } 
                                }
                            }
                            
                            // targets
                            if(recordInfo.oldgeometry || recordInfo.geometry) {
                                recordInfo.gridId = grid.id;
                                obj.simulation.targetsInfo.push(recordInfo);
                                obj.simulation.exportInfo.push({
                                    id: recordInfo.id,
                                    type: grid.featureType,
                                    geometry: recordInfo.geometry.toString(),
                                    newfeature: recordInfo.newfeature || false,
                                    removed: recordInfo.removed || false,
                                    value: recordInfo.value
                                });
                            }
                            if(recordInfo.oldgeometry) {
                                // remove
                                obj.simulation.targets.push('-'+grid.id+','+(recordInfo.oldvalue || 0)+','+recordInfo.oldgeometry.toString());
                            }
                            if(recordInfo.geometry) {
                                // add
                                obj.simulation.targets.push(grid.id+','+(recordInfo.value || 0)+','+recordInfo.geometry.toString());
                            }
                        }
                    }
                }
            },this);
        }
        
        return obj;
    },
    
    /** private: method[resetBBOX]
     *  :arg extent: ``Boolean``     
     *     reset bbox to current extent (if asked esplicitly or no status is defined) or saved status
     */
    resetBBOX: function(extent){    
        if(this.status && !extent){
            this.aoiFieldset.setAOI(this.status.roi.bbox/*, true*/);
        }else{
            this.aoiFieldset.setAOI(this.map.getExtent());
        }              
    },
    
    
    /** private: method[getSelectedTarget]    
     *     gets the currently selected target (or macro target) record
     */
    getSelectedTarget: function() {
        var combo = this.bers.getValue() ? this.bers : this.macrobers;
        return combo.store.getAt(combo.store.findExact('name', combo.getValue()));        
    },
    
    getComboRecord: function(combo, field) {    
        return combo.store.getAt(combo.store.findExact(field || 'name', combo.getValue()));
    },
    
	updateAOI: function(roi) {
		this.aoiFieldset.setAOI(roi.bbox.clone());
        this.aoiFieldset.setType(roi.type === 'aoi' ? 'byrect' : 'byfeature');
        if(roi.type !== 'aoi') {
            this.aoiFieldset.selectFeature(roi.type, roi.id);
        }
	},
	
    /** private: method[setStatus]   
     *  :arg status: ``Object``        
     *     set current processing parameter when the form is open
     */
    setStatus: function(status){
        this.ignoreSimulationUpdate = true;
        var store;
        
        this.status = status;
        this.elaborazione.setValue(this.status.processing);
        var elaborazionePos = this.elaborazioneStore.findExact("id", this.status.processing);
        this.elaborazione.fireEvent('select',this.elaborazione, this.elaborazioneStore.getAt(elaborazionePos));
        // TODO: migrate ongrid formulas to standard ones
        var formulaPos = this.formulaStore.findExact("id_formula", this.status.formula);
        if(formulaPos !== -1) {
            this.formula.setValue(this.status.formula);
            this.formula.fireEvent('select',this.formula, this.formulaStore.getAt(formulaPos));
            /*if(!this.loadUserElab){
                this.formula.fireEvent('select',this.formula, this.formula.getStore().getAt(formulaPos));
            }*/
        }
        this.resolution.setValue(this.status.resolution || 1);
        this.updateAOI(status.roi);
                
        store=this.macrobers.getStore(); 
        this.macrobers.setValue(this.status.macroTarget);
        if(store.findExact("name", this.status.macroTarget) !== -1) {
            this.macrobers.fireEvent('select',this.macrobers, store.getAt(store.findExact("name", this.status.macroTarget)));
        }
        
        store=this.bers.getStore(); 
        if(this.status.target['macro']) {
            this.bers.setValue(null);
        } else {
            var value = this.status.target['name'];
            this.bers.setValue(value);
            this.bers.fireEvent('select',this.bers, store.getAt(store.findExact("name", value)));
        }
                
        //this.setComboStatus(this.weather, 'weather');
        this.setComboStatus(this.temporal, 'temporal', 'value');
        
        this.setComboStatus(this.classi, 'classe');
        this.setComboStatus(this.sostanze, 'sostanza');
        this.setComboStatus(this.accident, 'accident');
        this.setComboStatus(this.seriousness, 'seriousness');   

        // simulation
        if(this.status.processing === 3) {
            this.enableDisableSimulation(true, 'init');
        }
        
        if(this.status.processing === 4) {
            var geometry = this.reproject(status.damageAreaGeometry.clone(),
                new OpenLayers.Projection(this.selectionLayerProjection),
                this.map.getProjectionObject());
            this.selDamage.setDamageArea(geometry, status.damageAreaType);
        }
        this.ignoreSimulationUpdate = false;
    },        
    
    /** private: method[setComboStatus]   
     *  :arg combo: ``Object``        
     *  :arg statusName: ``String``        
     *     Updates the given combo value from the status object
     */
    setComboStatus: function(combo, statusName, field) {
        field = field || 'name';
        var store = combo.getStore();      
        var value = this.status[statusName][field];
        combo.setValue(value);
        if(store.findExact(field, value) !== -1) {
            combo.fireEvent('select',combo, store.getAt(store.findExact(field, value)));
        }
    },
    
    getInitialStatus: function() {
        var obj = {};
    
        obj.initial = true;
        obj.processing = 1;        
        obj.processingDesc = '';
        obj.formula = 26;
        obj.formulaDesc = '';
        var formulaRec = {};
        obj.formulaInfo = {
            dependsOnTarget: true,
            dependsOnArcs: true,
            visibleOnArcs: true,
            visibleOnGrid: true
        };                
        obj.resolution = 1;
        obj.simulation = {
            cff:[],
            padr:[],
            pis:[],
            targets:[],
            targetsInfo:[],
            exportInfo: []
        };
        
        obj.target = {humans: null, code:'-2', layer: 'bersagli_all', severeness: '1,2,3,4,5', macro: true}; 
        obj.macroTarget = this.allTargetOption;
        
        //obj.weather = "0";
        obj.temporal = "0";
        
        obj.classe = {ivalue:"0"};
        obj.sostanza = {value:"0", id: [1,2,3,4,5,6,7,8,9,10]};
        obj.accident = {value:"0", id: [1,2,3,4,5,6,7,8,9,10,11]};
        obj.seriousness = {value:"0", id: [0,1]};
        
        var low = 100;
        var medium = 500;
        var max = 1000;
        
        obj.themas = {
            'sociale': [low,medium,max], //Ext.getCmp('rischio_sociale_multislider').getValues(),
            'ambientale': [low,medium,max] //Ext.getCmp('rischio_ambientale_multislider').getValues()
        };

        return obj;
    },
    
    getAuthKey: function(target) {
        var user = (target || this.appTarget).user || {};
        if(user && user.attribute) {
            var attributes = (user.attribute instanceof Array) ? user.attribute : [user.attribute];
            for(var i=0, l = attributes.length; i < l; i++) {
                var attribute = attributes[i];
                if(attribute.name === 'UUID') {
                    return attribute.value;
                }
            }
        }
        return null;
    },
    
    getWFSStoreProxy: function(featureName, filter, sortBy, target){
        var authkey = this.getAuthKey(target);
        var filterProtocol=new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: new Array()
        });
        if(filter) {
            if(filter.type== "FID")
                filterProtocol=filter;
           else
              filterProtocol.filters.push(filter);
        }
        var proxy= new GeoExt.data.ProtocolProxy({ 
            protocol: new OpenLayers.Protocol.WFS({ 
                url: this.wfsURL + (authkey ? '?authkey='+authkey : ''), 
                featureType: featureName, 
                readFormat: new OpenLayers.Format.GeoJSON(),
                featureNS: this.destinationNS, 
                filter: filterProtocol, 
                outputFormat: "application/json",
                version: this.wfsVersion,
                headers: (target || this.appTarget).tools[this.syntheticView].getBasicAuthentication(),
                sortBy: sortBy || undefined
            }) 
        });
        return proxy;         
        
    },
    
    getLayerGeometry: function(map, geometry, destSRS) {
        if(geometry && destSRS) {
            if(destSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
				var targetColl=this.reproject(
					coll,
					map.getProjectionObject(),
					new OpenLayers.Projection(destSRS)
				);
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        }
        return geometry;
    }

    
});

Ext.preg(gxp.plugins.StandardProcessing.prototype.ptype, gxp.plugins.StandardProcessing);
