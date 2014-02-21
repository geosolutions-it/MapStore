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
    viewMapButton: "Visualizza Mappa",
    formLabel: "Impostazioni di Elaborazione",
    bboxValidationTitle: "Selezione Area di Interesse",
    requiredMaterial: "Questa formula richiede di specificare la sostanza",
    requiredAccident: "Questa formula richiede di specificare l\'incidente",
    requiredSeriousness: "Questa formula richiede di specificare la gravità",
    requiredDamageArea: "Selezionare l'area di danno",
    validationTitle: "Errore nei parametri",
    invalidAOI: "Le coordinate dell'area di interesse non sono valide.",
    bboxTooBig: "L'area selezionata e' troppo grande e il server potrebbe impiegare molto tempo a rispondere. Se si desidera continuare ugualmente premere OK.",
    //weatherLabel: "Meteo",  
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
    
    loadUserElab: false,
    geostoreElab: null,
    geostoreFormula: null,
    geostoreTemporal: null,    
    // End i18n.
        
    cellViewScale: 500010,
        
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
    
    maxROIArea: null,
    
    urlEPSG: null,
    epsgWinHeight: null,
    epsgWinWidth: null,  

    aoiFieldset: null,
    
    selDamage: null,
    
    /*WFSStores settings*/
    wfsURL: "http://84.33.2.23/geoserver/wfs",
    wfsVersion: "1.1.0",
    destinationNS: "destinationprod",
    temporalFeature: "siig_t_variabile",
    //weatherFeature: "siig_t_variabile",
    bersFeature: "siig_t_bersaglio",
    elabFeature: "siig_mtd_d_elaborazione",
    formulaFeature: "formule",
    classFeature: "siig_d_classe_adr",
    sostFeature: "siig_t_sostanza",
    scenFeature: "siig_t_scenario",
    sostAccFeature: "siig_r_scenario_sostanza",        

    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        /* this.epsgWinHeight= Ext.getBody().getHeight()*.7;
       this.epsgWinWidth= Ext.getBody().getWidth()*.8;*/
        gxp.plugins.StandardProcessing.superclass.constructor.apply(this, arguments);
    },
    
    
    /** public: method[show]
     *  :arg appTarget: ``Object``
     */
    show: function(appTarget) {
       
        if(!this.appTarget)
            this.appTarget = appTarget;
            
        var map = this.appTarget.mapPanel.map;    
        
        this.aoiFieldset=this.appTarget.tools[this.aoi].getAOI();
        
        this.selDamage=this.appTarget.tools[this.seldamage].getSelDamage();
        this.selDamage.hide();
            
        var processing = this.buildForm(map);
     
        map.enebaleMapEvent = true;
        return processing;
    },
    
    getLayerGeometry: function(map, geometry, destSRS) {
        if(geometry && destSRS) {
            if(destSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
                var targetColl=coll.transform(                    
                    map.getProjectionObject(),
                    new OpenLayers.Projection(destSRS)
                );
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        }
        return geometry;
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
    
    /** private: method[buildElaborazioneForm]
     *    builds the form for processing and formula choosing
     */
    buildElaborazioneForm: function() {        
        //
        // Tipo Elaborazione
        //                
        var elaborazioneStore= new GeoExt.data.FeatureStore({ 
             id: "elaborazioneStore",
             fields: [{
                        "name": "id",              
                        "mapping": "id_elaborazione"
              },{
                        "name": "name",              
                        "mapping": "descrizione_elaborazione_" + GeoExt.Lang.locale
              }],
             proxy: this.getWFSStoreProxy(this.elabFeature) , 
             autoLoad: true 
       });
        
        
        
        this.elaborazione = new Ext.form.ComboBox({
            fieldLabel: this.elaborazioneLabel,
            id: "elabcb",
            width: 150,
            hideLabel : false,
            store: elaborazioneStore, 
            valueField: 'id',
            displayField: 'name',   
            lastQuery: '',
            typeAhead: true,
            //mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,            
            //editable: true,
            resizable: true,    
            //value: "Elaborazione Standard" ,
            listeners: {
                scope: this,                
                expand: function(combo) {
                    this.loadUserElab = false;
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(combo, record, index) {
                    /*this.formula.getStore().filter('id_elaborazione', record.get('id'));
                    this.formula.setValue(this.formula.getStore().getAt(0).get('id_formula'));*/
                    
                    // to change formula according to scale
                    var store = this.formula.getStore();
                    this.filterComboFormulaScale(this.formula);
                    this.formula.setValue(store.data.items[0].get('id_formula'));
                    
                    this.enableDisableForm(this.getComboRecord(this.formula, 'id_formula'), record);
                    this.enableDisableSimulation(record.get('id') === 3);
                }
            }          
        });
        
        elaborazioneStore.on('load', function(store, records, options) {
            if(!this.loadUserElab){
                this.elaborazione.setValue(records[0].get('id'));
            }else{
                this.elaborazione.setValue(this.geostoreElab);
            }
        }, this);
        
        //
        // Formula
        //        
        var formulaVisibleFilter= new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
            property: 'flg_visibile',
            value: 1
        });
        
         var elaborazioneFilter= new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "id_elaborazione",
            value: 1
         });
         
        var formulaFilter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [
                    formulaVisibleFilter,
                    elaborazioneFilter
                ]
        });
        
        var formulaStore= new GeoExt.data.FeatureStore({ 
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
              }],
             proxy: this.getWFSStoreProxy(this.formulaFeature, null, 'ordine_visibilita') , 
             autoLoad: true 
       });
       
       //formulaStore.filter('id_elaborazione', 1);
        
        this.formula = new Ext.form.ComboBox({
            fieldLabel: this.formulaLabel,
            id: "elabfr",
            width: 150,
            hideLabel : false,
            store: formulaStore, 
            valueField: 'id_formula',            
            displayField: 'name',    
            lastQuery: '',
            typeAhead: true,
            //mode: 'local',
            //forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            //editable: true,
            resizable: true,    
            //value: 26,
            listeners: {
                scope: this,                
                expand: function(combo) {
                    this.loadUserElab = false;
                    
                    // to change formula according to scale
                    this.filterComboFormulaScale(combo);
                    
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(combo, record, index) {
                    this.enableDisableForm(record, this.getComboRecord(this.elaborazione, 'id'));
                }
            } 
        });
        
        formulaStore.on('load', function(store, records, options) {
            //this.formula.getStore().filter('id_elaborazione', this.elaborazione.getValue());
            
            // to change formula according to scale
            this.filterComboFormulaScale(this.formula);
            if(!this.loadUserElab){
                //this.formula.setValue(records[0].get('id_formula'));
                this.formula.setValue(store.data.items[0].get('id_formula'));
            }else{
                this.formula.setValue(this.geostoreFormula);
            }
            
            //fire select formula combo to update target combo
            this.formula.fireEvent('select',this.formula,store.data.items[0]);
        }, this);
       
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
            this.formula
            ]
        });
        
        return this.elabSet;
    },
    
    filterComboFormulaScale: function(combo){
        var store = combo.getStore();
        
        var syntView = this.appTarget.tools[this.syntheticView];
        var map = app.mapPanel.map;
        var scale = Math.round(map.getScale());
        
        /*analiticViewScale: 17070,
        cellViewScale: 500010,*/
        
        if(scale>=syntView.cellViewScale){
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
        }else{
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
        }
    },
    
    enableDisableForm: function(formula, elaborazione) {
        this.enableDisableAOI(formula, elaborazione);
        this.enableDisableSelAreaDamage(formula, elaborazione);
        this.enableDisableTemporali(formula, elaborazione);
        //this.enableDisableMeteo(record);
        this.enableDisableTargets(formula, elaborazione);
        this.enableDisableScenario(formula, elaborazione);        
        //this.enableDisableFormula(formula, elaborazione);        
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
    /*
    expandCollapse: function(condition, widget) {
        if(condition) {
            if(widget.collapsed) {
                widget.expand();
            }
            Ext.getCmp("featuregrid").removeAllGrids();
            mapPanelContainerBbar.removeAll(true);
            mapPanelContainerBbar.add(syntView.simulationViewBbar);
            mapPanelContainer.doLayout(false,true);
        } else if(!widget.collapsed) {
            widget.collapse();
            mapPanelContainerBbar.removeAll(true);
            mapPanelContainerBbar.add(syntView.analyticViewBbar);
            mapPanelContainer.doLayout(false,true);
        }
    },*/
    isAllHumanTargets: function(status) {
        return status.target['id_bersaglio'] === -2;
    },
    
    isAllNotHumanTargets: function(status) {
        return status.target['id_bersaglio'] === -3;
    },
    
    isSingleTarget: function(status) {
        return parseInt(status.target['id_bersaglio'],10) > 0;
    },

    updateSimulationTabPabel: function(wfsGrid,syntView,map){
    
        var viewParams;                
        var status = this.getStatus();        
        var bounds = syntView.getBounds(null, map);
        viewParams = "bounds:" + bounds;
        
        if(this.isSingleTarget(status)) {
            wfsGrid.loadGrids(["id", "type"], [status.target['id_bersaglio'], 'all'], syntView.selectionLayerProjection, viewParams,undefined,undefined,true);                                
        } else if(this.isAllHumanTargets(status)) {
            wfsGrid.loadGrids("type", ['umano', 'all'], syntView.selectionLayerProjection, viewParams,undefined,undefined,true);
        } else if(this.isAllNotHumanTargets(status)) {
            wfsGrid.loadGrids("type", ['ambientale','all'], syntView.selectionLayerProjection, viewParams,undefined,undefined,true);
        } else {
            wfsGrid.loadGrids(null ,null , syntView.selectionLayerProjection, viewParams,undefined,undefined,true);
        }
        
    },
    
    enableDisableSimulation: function(enable) {
        var syntView = this.appTarget.tools[this.syntheticView];
        var southPanel = Ext.getCmp("south");        
        var wfsGrid = Ext.getCmp("featuregrid");
        var map = this.appTarget.mapPanel.map;
        
        var scale = Math.round(map.getScale()); 
        
        // nothing to do!!! Set target panels according to target combo selection
        if((enable && syntView.simulationEnabled) || (!enable && !syntView.simulationEnabled)) {

            syntView.simulationLoaded = true;
            if(enable) {
                this.updateSimulationTabPabel(wfsGrid,syntView,map);
            }
                
            return;
        }
  
        
        if(enable) {
            syntView.simulationRestore = {
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
                syntView.simulationRestore.grids = wfsGrid.currentGrids;
            }
            
            wfsGrid.removeAllGrids();
            
            syntView.simulationLoaded = false;
            
            var wfsGrid = Ext.getCmp("featuregrid");
            wfsGrid.setCurrentPanel('simulation');
            
            if(scale <= syntView.analiticViewScale) {
            
                syntView.simulationLoaded = true;
                this.updateSimulationTabPabel(wfsGrid,syntView,map);
                
            } 
/*            else {
                Ext.getCmp("targets_view").disable();
                Ext.getCmp("roadGraph_view").disable(); 
            }*/
            Ext.getCmp("analytic_view").disable();
            Ext.getCmp("targets_view").disable();
            Ext.getCmp("roadGraph_view").disable(); 
            Ext.getCmp("areaDamage_view").disable();
			Ext.getCmp("refresh_grid").enable();
            Ext.getCmp("refresh_grid").show();
            
            Ext.getCmp("targets_view").toggle(false, true);
            Ext.getCmp("roadGraph_view").toggle(false, true);               
            Ext.getCmp("areaDamage_view").toggle(false, true);
            
            syntView.simulationEnabled = true;
        } else {
            if(syntView.simulationRestore) {
                if(syntView.simulationRestore.collapsed) {
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
                    if(syntView.simulationRestore.grids && syntView.simulationRestore.grids.length > 0) {
                        wfsGrid.removeAllGrids();
                        wfsGrid.restoreGrids(syntView.simulationRestore.grids);
                    }
                }
                for(var buttonId in syntView.simulationRestore.buttons) {
                    if(syntView.simulationRestore.buttons.hasOwnProperty(buttonId)) {
                        var button = Ext.getCmp(buttonId);
                        var status = syntView.simulationRestore.buttons[buttonId];
                        button.toggle(status, true);
                    }
                }
            }            
            syntView.removeLayersByName(map, syntView.vectorLayers);
            syntView.simulationRestore = null;
            syntView.simulationEnabled = false;
        }
        
        //this.expandCollapse(enable ,southPanel);
    },
    
    enableDisableTemporali: function(formula, elaborazione) {
        if(formula){
            this.enableDisable(formula.get('condizioni_temporali') && elaborazione.get('id') === 2, this.temporal);        
        }else{
            this.enableDisable(elaborazione.get('id') !== 4, this.temporal);
        }
    },
    
    enableDisableAOI: function(formula, elaborazione) {
        if(formula){
            this.enableDisable(formula.get('ambito_territoriale') || elaborazione.get('id') !== 4, this.aoiFieldset);
        }else{
            this.enableDisable(elaborazione.get('id') !== 4, this.aoiFieldset);      
        }
    },
    
    //disable combo formula if elaboration method is Damage Assessment
    enableDisableFormula: function(formula, elaborazione) {
        this.enableDisable(elaborazione.get('id') !== 4, this.formula);
   },
    
    enableDisableSelAreaDamage: function(formula, elaborazione) {
        this.enableDisable(elaborazione.get('id') === 4, this.selDamage);        
    },
    
    /*enableDisableMeteo: function(record) {
        this.enableDisable(record.get('condizioni_meteo'), this.weather);
    },*/
    
    enableDisableTargets: function(record) {
        if(record){
            var hasTargets = record.get('bersagli_tutti') || record.get('bersagli_umani') || record.get('bersagli_ambientali');
            this.enableDisable(hasTargets, this.macrobers);
            this.enableDisable(hasTargets, this.bers);
            //this.enableDisable(hasTargets, this.temasPanel);
            
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
                this.macrobers.getStore().loadData(data);
                this.macrobers.setValue(data[0][1]);
                this.updateTargetCombo(type);
            }
        }
    },
    
    updateTargetCombo: function(type) {        
                    
        var store=this.bers.getStore();
        
        if(type !== null) {
            store.filter('humans', type);
        } else {
            store.clearFilter();
        }
        //this.updateTemaSliders(type);
        
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
    
    /** private: method[buildConditionsForm]
     *    builds the form for temporal and weather choosing
     */
    buildConditionsForm: function() {        
       
       /*var filter= new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: this.destinationNS + ":fk_tipo_variabile",
            value: 2
        });
       
       var weatherStore= new GeoExt.data.FeatureStore({ 
             id: "weatherStore",
             fields: [{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "value",        
                        "mapping": "id_variabile"
              }],
             proxy: this.getWFSStoreProxy(this.temporalFeature, filter) , 
             autoLoad: true 
       });
    
        
        this.weather = new Ext.form.ComboBox({
            fieldLabel: this.weatherLabel,
            id: "meteo",
            width: 150,
            hideLabel : false,
            store: weatherStore,    
            displayField: 'name',    
            typeAhead: true,
            //mode: 'local',
            lastQuery: '',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,    
            listeners: {
                beforeselect: function(cb, record, index){
                    
                },
                select: function(cb, record, index) {
                      
                },
                scope: this
            }              
        });*/
        
        var filter= new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "fk_tipo_variabile",
            value: 1
        });
        
        var temporalStore= new GeoExt.data.FeatureStore({ 
             id: "temporalStore",
             fields: [{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "value",        
                        "mapping": "campo_fp"
              }],
             proxy: this.getWFSStoreProxy(this.temporalFeature, filter, 'id_variabile') , 
             autoLoad: true 
       });
       
       temporalStore.on('load', function(store, records, options) {
            if(!this.loadUserElab){       
                this.temporal.setValue(records[0].get('value'));
            }else{
                this.temporal.setValue(this.geostoreTemporal);
            }
       }, this);
        
                
        this.temporal = new Ext.form.ComboBox({
            fieldLabel: this.temporalLabel,
            id: "time",
            width: 150,
            hideLabel : false,
            store: temporalStore,    
            displayField: 'name', 
            valueField: 'value',
            typeAhead: true,            
            //mode: 'local',
            lastQuery: '',
            forceSelection: true,
            disabled: true,
            triggerAction: 'all',
            selectOnFocus:true,
            //editable: true,
            resizable: true,    
            listeners: {                
                scope: this
            }              
        });
        
       
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
        //
        // Bersaglio
        //
        var me= this;
        var layers= [null,'popolazione_residente','popolazione_turistica','popolazione_turistica',
            'industria_servizi','strutture_sanitarie','strutture_scolastiche',
            'centri_commerciali','utenti_coinvolti','utenti_territoriali','zone_urbanizzate','aree_boscate',
            'aree_protette','aree_agricole','acque_sotterranee',
            'acque_superficiali','beni_culturali'];
        
        
        var targetStore= new GeoExt.data.FeatureStore({ 
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
             proxy: this.getWFSStoreProxy(this.bersFeature, undefined, "id_bersaglio") , 
             autoLoad: true 
       });
       
       targetStore.on('load', function(str, records) {
                var allIDsArray= []; 
                var code=0;
                var humanIDsArray= [];
                var notHumanIDsArray= [];
                var allDescsMap = {};
                var humanDescsMap = {};
                var notHumanDescsMap = {};
                Ext.each(records,function(record){
                          var flg_umano= parseInt(record.get("flg_umano"));
                          var id= parseInt(record.get("id_bersaglio"));
                          allIDsArray.push(id);
                          allDescsMap[id] = record.get("name");
                          record.set( "layer", layers[parseInt(id)]);
                          record.set( "property", 'calc_formula_tot');
                          record.set( "humans", flg_umano == 1 ? true: false);
                          
                          var code="-1";
                          
                          switch(id){
                              case 10:
                                   code='0';
                                  break;
                              case 11:
                                   code='1';
                                  break;    
                              case 12:
                                   code='2';
                                  break;
                              case 13:
                                   code='3';
                                  break;
                              case 14:
                                   code='4';
                                  break;    
                              case 15:
                                   code='5';
                                  break;
                              case 16:
                                   code='6';
                                  break;    
                          }
                          record.set( "code", code);

                          record.set( "macro", false);
                          record.set( "description", {id: record.get("name")});
                          record.set( "severeness", flg_umano ? '1,2,3,4' : '5');
                          
                          record.set( "id", [record.get("id_bersaglio")]);
                          if(flg_umano!= 1){
                             notHumanIDsArray.push(id);
                             notHumanDescsMap[id] = record.get("name");
                          }else{
                             humanIDsArray.push(id); 
                             humanDescsMap[id] = record.get("name");
                          }
                 });
               me.macroBersData = [
                ['bersagli_all', me.allTargetOption, 'calc_formula_tot', null, '-2', true, allIDsArray, -1, allDescsMap, '1,2,3,4,5'],
                ['bersagli_umani', me.allHumanTargetOption, 'calc_formula_tot', true, '-1', true, humanIDsArray, -2, humanDescsMap, '1,2,3,4'],
                ['bersagli_ambientali', me.allNotHumanTargetOption, 'calc_formula_tot', false, '-2', true, notHumanIDsArray, -3, notHumanDescsMap, '5']
                ];
               me.macrobers.getStore().loadData(me.macroBersData, true);
      });
        
       var targetMacroStore = new Ext.data.ArrayStore({
            fields: ['layer', 'name', 'property', 'humans', 'code', 'macro', 'id', 'id_bersaglio', 'description', 'severeness'],
            data :  []
        });
        
        
        
        this.macrobers = new Ext.form.ComboBox({
            fieldLabel: this.macroTargetLabel,
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
            value: this.allTargetOption,
            listeners: {
                scope: this,
                select: function(cb, record, index) {
                    var type = record.get('humans');
                    this.updateTargetCombo(type);
                    var processingCombo = this.elaborazione.getValue();
                    this.enableDisableSimulation(processingCombo === 3);
                }
            }              
        });
       

        this.bers = new Ext.form.ComboBox({
            fieldLabel: this.targetLabel,
            id: "bers",
            width: 150,
            hideLabel : false,
            store: targetStore,    
            clearFilterOnReset: false,
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
            lastQuery: '',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            
            editable: true,
            resizable: true,
            listeners: {
                scope: this,
                select: function(cb, record, index) {
                    var processingCombo = this.elaborazione.getValue();
                    this.enableDisableSimulation(processingCombo === 3);                    
                },
                expand: function(combo) {
                    this.loadUserElab = false;
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
    
    updateTemaSliders: function(type) {
        if(type === null) {
            this.temasPanel.unhideTabStripItem(0);
            this.temasPanel.unhideTabStripItem(1);
        } else if(type === true) {
            this.temasPanel.unhideTabStripItem(0);
            this.temasPanel.hideTabStripItem(1);
            this.temasPanel.setActiveTab(0);
        } else {
            this.temasPanel.unhideTabStripItem(1);
            this.temasPanel.hideTabStripItem(0);
            this.temasPanel.setActiveTab(1);
        }            
    },
    
    /** private: method[buildAccidentForm]
     *    builds the form for accidents choosing (with 4 cascading combos)
     */
    buildAccidentForm: function(map){
        //
        // Classi ADR
        //
        
      var me= this;
      
      //Set filter with Destination ADR Class
      var filterDest=new OpenLayers.Filter.FeatureId({
          fids: ["siig_d_classe_adr.2","siig_d_classe_adr.3","siig_d_classe_adr.9"]
      });
      
      var classiADRStore= new GeoExt.data.FeatureStore({ 
             id: "calssiStore",
             fields: [{
                        "name": "name",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              },{
                        "name": "value",        
                        "mapping": "id_classe_adr"
              }],
             proxy: this.getWFSStoreProxy(this.classFeature, filterDest, "id_classe_adr") , 
             autoLoad: true 
       });
       
      classiADRStore.on('load', function(str, records) {
        str.insert(0, new str.recordType({name: me.allClassOption, value:'0'}, 1000));
      });
                
        
        this.classi = new Ext.form.ComboBox({
            fieldLabel: this.adrLabel,
            id: "classicb",
            width: 150,
            hideLabel : false,
            store: classiADRStore,    
            displayField: 'name',    
            typeAhead: true,
            mode: 'local',
         //   queryParam: 'remoteStore',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            editable: true,
            resizable: true,
            value: this.allClassOption,
            lazyInit: false,
            listeners: {
                "expand": function(combo) {
                    this.loadUserElab = false;
                    var store=combo.getStore();
                    delete store.baseParams.filter;
                    combo.getStore().reload();
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },                
                select: function(cb, record, index) {                    
                    // filtra solo la combo delle sostanze in base alla classe scelta, resetta gli altri filtri
                    var classe = record.get('value'); 

                    var store=me.sostanze.getStore();
                    delete store.baseParams.filter;
                    store.proxy.protocol.filter.filters= new Array();

                    if(classe != "0"){
                       var filter= new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: "fk_classe_adr",
                            value: classe
                        });
                        
                        store.proxy.protocol.filter.filters.push(filter);                        
                    }       
                    me.resetCombos([me.sostanze]);
                },
                scope: this
            }              
        });            
        
    
      var sostanzeStore= new GeoExt.data.FeatureStore({ 
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
             proxy: this.getWFSStoreProxy(this.sostFeature) , 
             autoLoad: true 
       });
                    
      sostanzeStore.on('load', function(str, records) {
            var allIDsArray= new Array(); 
            Ext.each(records,function(record){
                  var id= parseInt(record.get("value"));
                  allIDsArray.push(id);
                  record.set( "id", [id]);
            });
            str.insert(0, new str.recordType({name: me.allSostOption, value:'0', id: allIDsArray}, 1000));
      });
      

    
      this.sostanze = new Ext.form.ComboBox({
            fieldLabel: this.sostanzeLabel,
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
            lazyInit: false,            
            value: this.allSostOption,
            listeners: {
                "expand": function(combo) {
                    this.loadUserElab = false;
                    combo.getStore().reload();
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                
                select: function(cb, record, index) {
                    var sost=record.get('value');

                    var filter= new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "id_sostanza",
                        value: sost
                    });
                    me.resetCombos([me.accident]);
                    new GeoExt.data.FeatureStore({ 
                        id: "sostaccStore",
                        fields: [{
                            "name": "scen",              
                            "mapping": "id_scenario"
                        }],
                        proxy: me.getWFSStoreProxy(me.sostAccFeature, filter), 
                        listeners:{
                            load : function(str, records) {
                                var fids= new Array();
                                var fid=null;
                                
                                var store=me.accident.getStore();
                                var len
                                while(store.proxy.protocol.filter.fids.length > 0) {
                                     store.proxy.protocol.filter.fids.pop();
                                }
                                
                                if(sost != "0") {

                                    Ext.each(records,function(record){
                                        fid="siig_t_scenario."+record.get("scen");
                                        if(fids.indexOf(fid) == -1){
                                            store.proxy.protocol.filter.fids.push("siig_t_scenario."+record.get("scen"));
                                        }

                                    });
                                 
                                }
                                
                                
                            }
                        },
                        autoLoad: true 
                    });            
                },
                scope: this
            }              
        });
        
         var accidentStore= new GeoExt.data.FeatureStore({ 
             id: "sostStore",
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
             proxy: this.getWFSStoreProxy(this.scenFeature, new OpenLayers.Filter.FeatureId({
                fids: []
             })) , 
             autoLoad: true 
          });       

          accidentStore.on('load', function(str, records) {
              var allIDsArray= []; 
              var allDescsMap = {};
              Ext.each(records,function(record){
                      var id= parseInt(record.get("id"));
                      allIDsArray.push(id);
                      record.set( "id", [id]);
                      allDescsMap[id] = record.get("name");
                      record.set( "description",  {id: record.get("name")});
              });
              str.insert(0, new str.recordType({name: me.allScenOption, value:'0', id:allIDsArray, "description": allDescsMap }, 1000));
          });
                
        
        this.accident = new Ext.form.ComboBox({
            fieldLabel: this.accidentLabel,
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
            lazyInit: false,
            value: this.allScenOption,
            listeners: {
                "expand": function(combo) {
                    this.loadUserElab = false;
                    combo.getStore().reload();
                    combo.list.setWidth( 'auto' );
                    combo.innerList.setWidth( 'auto' );
                },
                select: function(cb, record, index) {
                    this.resetCombos([this.seriousness]);                           
                },
                scope: this
            }              
        });
        
        //
        // Entità
        //
        var seriousnessStore = new Ext.data.ArrayStore({
            fields: ['name', 'value', 'id'],
            data :  [
            [this.allEntOption, '0', [0,1]],
            [this.entLieve, 'L', [0]],
            [this.entGrave, 'G', [1]]
            ]
        });
        
        this.seriousness = new Ext.form.ComboBox({
            fieldLabel: this.seriousnessLabel,
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
    
    /** private: method[buildForm]
     *  :arg map: ``Object``
     *    builds the standard processing main (all including) form
     */
    buildForm: function(map){        
        // disable synthetic view tab: why do we have tabs if we can't switch from one tab to the other?
        var syntView = this.appTarget.tools[this.syntheticView];
        var me= this;
      
        // updates the AOI on map pan / zoom
        this.aoiUpdater = function() {            
            var extent=map.getExtent().clone();
            me.aoiFieldset.setAOI(extent);                    
            me.aoiFieldset.removeAOILayer(map);            
        };
        map.events.register("move", this, this.aoiUpdater);
        
        syntView.getControlPanel().disable();

        var containerTab = Ext.getCmp(this.outputTarget);
        
        /*################
        ##################
        this.sliderFiledRischioSociale=new gxp.form.SliderRangesFieldSet({
            title: this.humanRiskLabel,
            id:"rischio_sociale",    
            labels: true,
            multiSliderConf:{
                vertical : false,
                ranges: [
                {
                    maxValue: 100, 
                    name:this.lowRiskLabel, 
                    id:"range_low_sociale"
                },
                {
                    maxValue: 500, 
                    name:this.mediumRiskLabel, 
                    id:"range_medium_sociale"
                },
                {
                    maxValue: 1000, 
                    name:this.highRiskLabel
                }
                ],                                        
                width   : 330,
                minValue: 0,
                maxValue: 1000
            }
        });
        
        
        this.sliderFiledRischioAmbientale=new gxp.form.SliderRangesFieldSet({
            title: this.notHumanRiskLabel,
            id:"rischio_ambientale",    
            labels: true,
            multiSliderConf:{
                vertical : false,
                ranges: [
                {
                    maxValue: 100, 
                    name:this.lowRiskLabel, 
                    id:"range_low_ambientale"
                },

                {
                    maxValue: 500, 
                    name:this.mediumRiskLabel, 
                    id:"range_medium_ambientale"
                },
                {
                    maxValue: 1000, 
                    name:this.highRiskLabel
                }
                ],                                        
                width   : 330,
                minValue: 0,
                maxValue: 1000
            }
        });
        
        this.temasPanel = new Ext.TabPanel({
            autoTabs:true,
            activeTab:0,
            deferredRender:false,
            border:false,
            items:[{   
                title: this.humanRiskLabel,
                listeners: {
                    activate: function(p){
                       me.sliderFiledRischioSociale.render(Ext.get('rischio_sociale_slider'));
                    }
                },
                html: "<div id='rischio_sociale_slider'/>"
            },{   
                title: this.notHumanRiskLabel,
                listeners: {
                    activate: function(p){
                       me.sliderFiledRischioAmbientale.render(Ext.get('rischio_ambientale_slider'));
                    }
                },
                html: "<div id='rischio_ambientale_slider'/>"
            } 
            ]
        });
        ################
        ################*/
        
        this.panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            title: this.title,
            autoScroll: true,
            items:[
                this.buildElaborazioneForm(),  
                //this.temasPanel,
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
                    var params = this.viewMap();
                }
            }]
        });
        
        //containerTab.add(this.panel);
        containerTab.insert(1,this.panel);
        containerTab.setActiveTab(this.panel);

        
        if(!this.status){
            this.resetBBOX();
        }    
    },
        
    
    /** private: method[resetCombos]
     *  :arg combos: ``Array``
     *    resets the given combos to their initial value ("all values")
     */
    resetCombos: function(combos) {
        Ext.each(combos, function(combo) {
            var record = combo.store.getAt(0);
            combo.setValue(record.get('name'));
            combo.fireEvent('select', combo, record, 0);
        });
    },
    
    /** private: method[filterCombos]
     *  :arg combos: ``Array``
     *    sets the filter options on the given combos; each element
     *    of the array is an object with 2 properties, combo and filter,
     *    the filter is the function to filter the combo via filterBy.
     */
    filterCombos: function(combos) {
        Ext.each(combos, function(comboInfo) {
            var store=comboInfo.combo.getStore(); 
            store.clearFilter();
            if(comboInfo.filter) {
                store.filterBy(comboInfo.filter);                
            }
        });
    },
    
    
    
    /** private: method[doProcess]
     *  :arg params: ``Object``     
     *     executes the processing using given parameters
     */
    doProcess: function(params){
        if(params){
            //  this.showLayer(params);            

            var status = this.getStatus(this.panel.getForm());                
            
            //
            // Remove the AOI box
            //
            this.aoiFieldset.removeAOILayer();
            // this.selectAOI.deactivate();
            
            this.selDamage.clearDrawFeature();
            
            this.switchToSyntheticView();
            var syntView = this.appTarget.tools[this.syntheticView];
            
            //  syntView.getControlPanel().enable();
            
            syntView.setStatus(status);
            
            Ext.getCmp("south").collapse();
            
            syntView.doProcess(params.roi);
            this.appTarget.mapPanel.map.events.unregister("move", this, this.aoiUpdater);
        }
    },
    
    cancelProcessing: function() {
        this.enableDisableSimulation(false);
        this.switchToSyntheticView();
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
    
    
    /** private: method[resetBBOX]
     *  :arg extent: ``Boolean``     
     *     reset bbox to current extent (if asked esplicitly or no status is defined) or saved status
     */
    resetBBOX: function(extent){    
   
        if(this.status && !extent){
            this.aoiFieldset.setAOI(this.status.roi.bbox/*, true*/);
        }else{
            this.aoiFieldset.setAOI(this.appTarget.mapPanel.map.getExtent());
        }              
    },
    
    /** private: method[makeParams]
     *  :arg form: ``Object``     
     *  :arg roi: ``Object``     
     *     builds processing params with form values and selected roi
     */
    makeParams: function(form, roi){
        var error = null;
        
        var map = this.appTarget.mapPanel.map;
        var params = {};
        var filters = [];
        
        //
        // Spatial filter
        //       
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
        if(accidentValue != this.allScenOptions){
            filters.push(new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: this.accidentTipologyName,
                value: 'POOL FIRE DA LIQUIDO INFIAMMABILE' //this.accident.getValue()
            }));
        }
        
        //
        // Target filter OpenLayers.Filter.Logical.NOT
        //        
        var targetRecord = this.getSelectedTarget();
        if(targetRecord){
            filters.push(new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.NOT,
                filters: [new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.IS_NULL,
                    property: targetRecord.get('property')
                })]
            }));
        }
        
        params.filters = filters;
        
        var formula = this.formula.getValue();
        var sostanza = parseInt(this.getComboRecord(this.sostanze).data.value, 10);
        var incidente = parseInt(this.getComboRecord(this.accident).data.value, 10);
        var entita = this.getComboRecord(this.seriousness).data.value;
        
        var formulaRec = this.formula.store.getAt(this.formula.store.findExact("id_formula",this.formula.getValue()));                
        
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
        if(!error) {
        
            var scale = Math.round(map.getScale());   
            
            var visibleOnArcs = formulaRec.get('visibile') === 1 || formulaRec.get('visibile') === 3;
            var visibleOnGrid = formulaRec.get('visibile') === 2 || formulaRec.get('visibile') === 3;
            
            if(scale <= this.cellViewScale && !visibleOnArcs) {
                error = this.notVisibleOnArcsMessage;
            } else if(scale > this.cellViewScale && !visibleOnGrid) {
                error = this.notVisibleOnGridMessage;
            }
        }
        
        if(!error) {
            this.doProcess(params);
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
    
    /** private: method[viewMap]    
     *     handler of the "View Map" button, checks input data and proceed to process
     *     if everything is ok
     */
    viewMap: function(){
      
        if(! this.aoiFieldset.isValid()){            
            Ext.Msg.show({
                title: this.bboxValidationTitle,
                buttons: Ext.Msg.OK,
                msg: this.invalidAOI,
                icon: Ext.MessageBox.WARNING
            });        
                        
            this.makeParams(this.panel.getForm(), null);
        }else{
            var selbbox =  this.aoiFieldset.getAOIMapBounds();
      
            if(this.maxROIArea ? selbbox.toGeometry().getArea() > this.maxROIArea : false){
                
                var useROI = function(buttonId, text, opt){
                    this.makeParams(this.panel.getForm(), buttonId === 'ok' ? selbbox : null);
                };
                
                Ext.Msg.show({
                    title: this.bboxValidationTitle,
                    buttons: Ext.Msg.OKCANCEL,
                    fn: useROI,
                    msg: this.bboxTooBig,
                    icon: Ext.MessageBox.WARNING,
                    scope: this
                });                
            }else{     
            
                this.makeParams(this.panel.getForm(), selbbox);
            }
        }
    },
    
    /** private: method[viewMap]   
     *  :arg params: ``Object``        
     *     updates the risk thema on the map with the given processing parameters
     */
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
        /*stdElabLayer = new OpenLayers.Layer.WMS(
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
                    
            map.addLayer(stdElabLayer);*/
        }else{                        
            stdElabLayer.mergeNewParams({
                filter: ogcFilterString 
            });
            
            if(params.roi){
                map.zoomToExtent(params.roi);
            }            
        }
    },
    
    /** private: method[setStatus]   
     *  :arg status: ``Object``        
     *     set current processing parameter when the form is open
     */
    setStatus: function(status){        
        var store;
        
        this.status = status;
        this.elaborazione.setValue(this.status.processing);
        this.formula.setValue(this.status.formula);
        
        if(!this.loadUserElab){
            this.formula.fireEvent('select',this.formula, this.formula.getStore().getAt(this.formula.getStore().findExact("id_formula", this.status.formula)));
        }
        
        this.aoiFieldset.setAOI(this.appTarget.mapPanel.map.getExtent());
                
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
        /*Ext.getCmp('rischio_sociale_multislider').setValue(0, status.themas.sociale[0]);
        Ext.getCmp('rischio_sociale_multislider').setValue(1, status.themas.sociale[1]);
        Ext.getCmp('rischio_ambientale_multislider').setValue(0, status.themas.ambientale[0]);
        Ext.getCmp('rischio_ambientale_multislider').setValue(1, status.themas.ambientale[1]);        */
        
        
        //this.setComboStatus(this.weather, 'weather');
        this.setComboStatus(this.temporal, 'temporal', 'value');
        
        this.setComboStatus(this.classi, 'classe');
        this.setComboStatus(this.sostanze, 'sostanza');
        this.setComboStatus(this.accident, 'accident');
        this.setComboStatus(this.seriousness, 'seriousness');   

        // simulation
        if(this.status.processing === 3) {
            this.enableDisableSimulation(true);
        }
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
    
    /** private: method[getStatus]   
     *  :arg form: ``Object``        
     *     extract processing parameters (status) from the compiled form
     */
    getStatus: function(form){
        var obj = {};
    
        obj.processing = this.elaborazione.getValue();        
        obj.processingDesc = this.elaborazione.getEl().getValue();
        obj.formula = this.formula.getValue();
        obj.formulaDesc = this.formula.getEl().getValue();
        var formulaRec = this.formula.store.getAt(this.formula.store.findExact("id_formula",obj.formula));
        
        obj.formulaUdm = [formulaRec.get('udm'), formulaRec.get('udm_soc'), formulaRec.get('udm_env')];
        
        obj.formulaInfo = {
            dependsOnTarget: formulaRec.get('bersagli_tutti') > 0 || formulaRec.get('bersagli_umani') > 0 || formulaRec.get('bersagli_ambientali') > 0,
            dependsOnArcs: formulaRec.get('ambito_territoriale'),
            visibleOnArcs: formulaRec.get('visibile') === 1 || formulaRec.get('visibile') === 3,
            visibleOnGrid: formulaRec.get('visibile') === 2 || formulaRec.get('visibile') === 3
        };
        if(obj.processing === 4) {
            
            var geometry = this.getLayerGeometry(
                map,
                this.selDamage.getDamageArea(),
                this.selectionLayerProjection
            );
            
            obj.damageAreaGeometry = geometry;
            obj.damageArea = geometry.toString();
        }
        
        obj.simulation = {
            cff:[],
            padr:[],
            pis:[],
            targets:[],
            targetsInfo:[],
            exportInfo:[]
        };
        
        if(obj.processing === 3) {
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
        
        if(this.aoiFieldset.isDirty()){
            obj.roi = {
                label: "Area Selezionata", 
                bbox : this.aoiFieldset.getAOIMapBounds()
            };    
        }else{
            obj.roi = {
                label: "Regione Piemonte", 
                bbox : this.aoiFieldset.getAOIMapBounds()
            
            }
        }
        
        obj.target = this.getSelectedTarget().data; 
        obj.macroTarget = this.macrobers.getValue();
        
        //obj.weather = this.weather.getValue();
        obj.temporal = this.getComboRecord(this.temporal, 'value').data;
        
        obj.classe = this.getComboRecord(this.classi).data; //this.classi.getValue();
        obj.sostanza = this.getComboRecord(this.sostanze).data; //this.sostanze.getValue();
        obj.accident = this.getComboRecord(this.accident).data; //this.accident.getValue();
        obj.seriousness = this.getComboRecord(this.seriousness).data; //this.seriousness.getValue();
        
        if(formulaRec) {
            var low = parseFloat(formulaRec.get('tema_low'));
            var medium = parseFloat(formulaRec.get('tema_medium'));
            var max = parseFloat(formulaRec.get('tema_max'));
            
            obj.themas = {
                'sociale': [low,medium,max], //Ext.getCmp('rischio_sociale_multislider').getValues(),
                'ambientale': [low,medium,max] //Ext.getCmp('rischio_ambientale_multislider').getValues()
            };
        } else if(obj.processing === 4) {
            // damage calculus
            obj.themas = {
                'sociale': [100,500,1000], //Ext.getCmp('rischio_sociale_multislider').getValues(),
                'ambientale': [100,500,1000] //Ext.getCmp('rischio_ambientale_multislider').getValues()
            };
        }
            
        return obj;
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
    
    getWFSStoreProxy: function(featureName, filter, sortBy){
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
                url: this.wfsURL, 
                featureType: featureName, 
                readFormat: new OpenLayers.Format.GeoJSON(),
                featureNS: this.destinationNS, 
                filter: filterProtocol, 
                outputFormat: "application/json",
                version: this.wfsVersion,
                sortBy: sortBy || undefined
            }) 
        });
        return proxy;         
        
    }

    
});

Ext.preg(gxp.plugins.StandardProcessing.prototype.ptype, gxp.plugins.StandardProcessing);
