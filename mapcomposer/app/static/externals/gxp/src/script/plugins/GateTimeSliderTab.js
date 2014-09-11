/**
 *  Copyright (C) 2007 - 2013 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/form/WFSSearchComboBox.js
 * @requires widgets/form/destination/SingleAOISelector.js
 * @requires widgets/form/SingleFeatureSelector.js
 * @requires widgets/button/SelectFeatureButton.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GateTimeSliderTab
 */

/** api: (extends)
 *  plugins/GateTimeSliderTab.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GateTimeSliderTab(config)
 *
 *  Insert description of plugin
 */   
gxp.plugins.GateTimeSliderTab = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_GateTimeSliderTab */
    ptype: "gxp_gatetimeslidertab",
    
    /** WFSStores settings*/    
    wfsUrl: null,
    wfsVersion: null,
    destinationNS: null,
    statisticFeature: null,
    intervalsFeature: null,
    timeFeature: null,
    layerGates: null,

    /** Start i18n */
    gateLabel: 'Gate',
    gateSelection: 'Selezione Gate',
    gatePanelTitle: "Dati in tempo reale - Gate",
    gateStatGridStart: "Data Inizio Stat",
    gateStatGridEnd: "Data Fine Stat",
    gateStatGridRoute: "Corsia",
    gateStatGridInterval: "Intervallo",
    gateStatGridDirection: "Direzione",
    gateStatGridKemler: "Kemler Cod",
    gateStatGridOnu: "Onu Cod",
    gateStatGridAmount: "Quantita",
    gateElementText: "Elemento",
    gateElementsText: "Elementi",
    gateTotalRenderer: "Totale",
    gateStatFieldsetTitle: "Dati Statistici precalcolati",
    gateStartDateText: 'Data inizio',
    gateEndDateText: 'Data fine',
    gateViewTimeGateButtonText: 'Visualizza dati Gate',
    gateInfoTimeTitle: "Visualizzazione dati Gate",
    gateInfoTimeMsg: "Selezionare un intervallo temporale!",    
    gateTimeSelectorTitle: "Seleziona intervallo temporale",    
    gateSliderFieldsetTitle: "Dati a scelta libera",
    gateTimeGridDetectionDate: "Data rilevamento",
    gateAggregationAveragePerHour: "Media Oraria",
    gateAggregationTotal: "Totale",
    gateTimeGridHourTimeZone: "Ora",
    gateTimeGridMinuteTimeZone: "Minuto",
    gateTimeGridReceptionDate: "Data Ricezione",
    gateTimeGridRoute: "Corsia",
    gateTimeGridDirection: "Direzione",
    gateTimeGridKemler: "Kemler Cod",
    gateTimeGridOnu: "Onu Cod",
    gateStatGridDescOnu: "Onu Desc",
    gateViewAllDataText: 'Tutte le statistiche',
    aggregationSelectorLabel: "Statistica",
    intervalSelectorLabel: "Intervallo",
    gateLastMonthText: 'Ultimo mese',
    gateLastYearText: 'Ultimo anno',    
    unauthorizedLabel: 'Funzione non disponibile con questo profilo',
    /** End i18n */
    
    currentAggregation: "mediaOraria",
    currentInterval: 1,
    
    hilightLayerName: "Gate_Selection_Layer",
    
	layerStyle:{
        strokeColor: "purple",
        strokeWidth: 2,
        fillOpacity:0.6,
        graphicName: "circle",
        cursor: "pointer",
        pointRadius: 10
    },    

	featureSelectorConfigs:{
        base:{
            toggleGroup:'toolGroup',
            xtype: 'gxp_searchboxcombo',
            anchor:'100%',
            fieldLabel: 'Gate',
            predicate:"ILIKE",
            sortBy:"id_gate",
            ref:'singleSelector',
            displayField:"descrizione",
            pageSize:10            
        },
        gate:{
            queriableAttributes:[
                "descrizione"                
             ],
             recordModel:[
                {
                  name:"id_gate",
                   mapping:"id_gate"
                },
                {
                   name:"geometry",
                   mapping:"geometry"
                },
                {
                   name:"descrizione",
                   mapping:"properties.descrizione"
                } 
            ],
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{descrizione}</span></h3>({descrizione})</div></tpl>"       
        }   
    },    
    
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.GateTimeSliderTab.superclass.constructor.apply(this, arguments);            
    },
	
	/** private: method[init]
     *  :arg target: ``Object``
	 * 
	 *  Provide the initialization code defining necessary listeners and controls.
     */
	init: function(target) {
		target.on({
		    scope: this,
			'ready' : function(){
				//
				// Show the Time Slider only when this tool is activated 
				//
			    this.controlPanel.on("show", function(){
					//
					// Make visible the OBU layer if it is deactivated inside the layertree
					//
					var gates = this.target.mapPanel.map.getLayersByName(this.layerGatesTitle)[0];
					if(gates && !gates.getVisibility()){
						gates.setVisibility(true);
					}
				}, this);
                
			    this.controlPanel.on("hide", function(){
					//
					// Make visible the OBU layer if it is deactivated inside the layertree
					//
					var gates = this.target.mapPanel.map.getLayersByName(this.layerGatesTitle)[0];
					if(gates && gates.getVisibility()){
						gates.setVisibility(false);
					}
				}, this);                
			}
		});
		return gxp.plugins.GateTimeSliderTab.superclass.init.apply(this, arguments);
	},

    /** private: method[destroy]
     */
    destroy: function() {
        this.selectedRecord = null;
        gxp.plugins.GateTimeSliderTab.superclass.destroy.apply(this, arguments);
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
    
        var me = this;
        
        this.summaryLabels = {
            'mediaOraria': this.gateAggregationAveragePerHour,
            'count': this.gateAggregationTotal
        };
        
        this.editorFieldSet = new Ext.form.FieldSet({
            title: "Gate Editor",
            id: 'editorfieldset',
            autoHeight: true,
            autoScroll: true,
            items:[{
                xtype:'label',
                id:'feature_edit_unauthorized',
                text:this.unauthorizedLabel
            }],
            bbar: [],
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            }
        });
        
        var fieldSetBottomToolbar = this.editorFieldSet.getBottomToolbar();
        fieldSetBottomToolbar.addClass("my-toolbar");        
        
        this.featureSelectorConfigs.base.url = this.wfsUrl;
        this.featureSelectorConfigs.base.fieldLabel = this.gateLabel;        
        this.featureSelectorConfigs.gate.typeName = this.layerGates;
        
        this.singleGateSelector = {
            xtype:'dest_single_aoi_selector',
            title: this.gateSelection,
            target:this.target,
            nativeSrs: this.nativeSrs,
            name:'region_list',
            ref:'singleFeatureSelector',
            featureSelectorConfigs:this.featureSelectorConfigs,
            hilightLayerName: this.hilightLayerName,
            vendorParams: {cql_filter:this.areaFilter},
            layerStyle: this.layerStyle
        };
        
        var panel = new Ext.Panel({
            id: "realTimeGateTab_id",
            border: false,
            layout: "form",
            title: this.gatePanelTitle,
            autoScroll: true,
            closable: false,
            labelWidth: '10px',
            items:[
                this.editorFieldSet,
                this.singleGateSelector
            ]
        });
        
        config = Ext.apply(panel, config || {});
        
        this.controlPanel = gxp.plugins.GateTimeSliderTab.superclass.addOutput.call(this, config);

        this.controlPanel.on('update',function(store){
            if(!store.getCount()<=0){
                var feature = store.data.items[0].data.attributes.id_gate;
                me.addTimePanelTab(feature);
            }
        },this);
        
        //hide selection layer on tab change
        this.controlPanel.on('beforehide',function(){
			var button = this.controlPanel.singleFeatureSelector.singleSelector.selectButton;
			button.toggle(false);
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(false);
            
        },this);
        this.controlPanel.on('show',function(){
			var button = this.controlPanel.singleFeatureSelector.singleSelector.selectButton;
			
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(true);
            
        },this);
        
        var featureManager = this.target.tools["featuremanager"];
        featureManager.on("layerchange", function() {
            featureManager.featureStore.on('write', function() {
                this.target.mapPanel.layers.getAt(
                    this.target.mapPanel.layers.find('name',this.layerGates)
                ).get('layer').redraw(true);
            }, this);
        }, this);
        
        return this.controlPanel
       
    },
    
    addTimePanelTab: function(feature){
        this.currentGate = feature;
        var realTimeGateTab = Ext.getCmp("realTimeGateTab_id");
        
        var statData = Ext.getCmp('statdatafset');
        var timeData = Ext.getCmp('timedatafset');
        
        var containerTab = Ext.getCmp('realTimeGateTab_id');

        this.filter = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "fk_gate",
            value: this.currentGate
        });
        
        var statisticsFilter = this.buildStatisticsFilter();
                
        if (!statData){
            containerTab.add(this.buildStatisticsData(statisticsFilter));
            containerTab.add(this.buildSliderData());
            containerTab.doLayout();
        }else{            
            this.statisticStore.proxy = this.getWFSStoreProxy(this.statisticFeature,statisticsFilter);
            this.statisticStore.load();
            
            if(this.gateTimeGrid){
                this.gateTimeGrid.hide();
            }
            if(this.gateTimeAggregationSelector) {
                this.gateTimeAggregationSelector.hide();
            }
        }
    },

    buildStatisticsFilter: function() {
        return new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "fk_gate",
                value: this.currentGate
            }),new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "fk_interval",
                value: this.currentInterval
            })
            ]
        });
    },
    
    buildStatisticsData: function(filter){
    
        var me = this;
        //http://dev.sencha.com/deploy/ext-3.4.0/examples/grid/totals.html
        
        // utilize custom extension for Group Summary
        var summaryStat = new Ext.ux.grid.GroupSummary();    
        
        this.statisticStore= new (Ext.extend(Ext.data.GroupingStore, new GeoExt.data.FeatureStoreMixin))({
             id: "statisticStore",
             fields: [{
                        "name": "id",              
                        "mapping": "id_dato"
              },{
                        "name": "fk_gate",              
                        "mapping": "fk_gate"
              },{
                        "name": "data_stat_inizio",              
                        "mapping": "data_stat_inizio"
              },{
                        "name": "data_stat_fine",              
                        "mapping": "data_stat_fine"
              },{
                        "name": "flg_corsia",              
                        "mapping": "flg_corsia",
                        "type": "int"
              },{
                        "name": "direzione",              
                        "mapping": "flg_direzione"
              },{
                        "name": "codice_kemler",              
                        "mapping": "codice_kemler"
              },{
                        "name": "codice_onu",              
                        "mapping": "codice_onu"
              },{
                        "name": "descrizione_onu",              
                        "mapping": "descrizione_onu_" + GeoExt.Lang.locale
              },{
                        "name": "quantita",              
                        "mapping": "quantita"
              }],
             proxy: this.getWFSStoreProxy(this.statisticFeature,filter), 
             autoLoad: true,
             groupField: 'fk_gate',
             groupOnSort: false,
             remoteGroup: false             
       });
       
       var intervalsStore= new GeoExt.data.FeatureStore({ 
             id: "intervalsStore",
             fields: [{
                        "name": "interval",              
                        "mapping": "id_intervallo"
              },{
                        "name": "description",              
                        "mapping": "descrizione_" + GeoExt.Lang.locale
              }],
             proxy: this.getWFSStoreProxy(this.intervalsFeature) , 
             autoLoad: true 
       });
       
       intervalsStore.on('load', function(store, records, options) {
            this.intervalSelector.setValue(records[0].get('interval'));
        }, this);
       
       this.intervalSelector = new Ext.form.ComboBox({
                fieldLabel: this.intervalSelectorLabel,
                width: 150,
                hideLabel : false,
                store: intervalsStore, 
                valueField: 'interval',
                displayField: 'description',   
                lastQuery: '',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus:true,            
                listeners: {
                    scope: this,                
                    
                    select: function(combo, record, index) {
                        this.currentInterval = record.get('interval');
                        var filter = this.buildStatisticsFilter();
                        this.statisticStore.proxy = this.getWFSStoreProxy(this.statisticFeature,filter);
                        this.statisticStore.reload();
                    }
                }          
            });
       
        this.statisticGrid= new Ext.grid.GridPanel({
            id: 'statisticgate_grid_id',    
            //split: true,
            autoScroll: true,
            autoHeight: true,
            //height: 100,
            layout: 'fit',
            store: this.statisticStore,
            header: false,
            loadMask: true,
            cm: new Ext.grid.ColumnModel({
                columns: [{
                    header: this.gateViewAllDataText,
                    width: 120,
                    sortable: true,
                    dataIndex: 'fk_gate',
                    hidden: true,
                    groupable: false
                },{
                    header: this.gateStatGridStart,
                    width: 120,
                    sortable: true,
                    dataIndex: 'data_stat_inizio',
                    groupable: false,
                    hidden: true,
                    renderer: Ext.util.Format.dateRenderer('d-m-Y')
                },{
                    header: this.gateStatGridEnd,
                    width: 120,
                    sortable: true,
                    dataIndex: 'data_stat_fine',
                    hidden: true,
                    groupable: false,
                    renderer: Ext.util.Format.dateRenderer('d-m-Y')
                },{
                    header: this.gateStatGridRoute,
                    width: 120,
                    sortable: true,
                    dataIndex: 'flg_corsia'
                },{
                    header: this.gateStatGridDirection,
                    width: 120,
                    sortable: true,
                    dataIndex: 'direzione'
                },{
                    header: this.gateStatGridKemler,
                    width: 120,
                    sortable: true,
                    dataIndex: 'codice_kemler'
                },{
                    header: this.gateStatGridOnu,
                    width: 120,
                    sortable: true,
                    dataIndex: 'codice_onu'
                },{
                    header: this.gateStatGridDescOnu,
                    width: 120,
                    sortable: true,
                    dataIndex: 'descrizione_onu'
                },{
                    header: this.gateStatGridAmount,
                    width: 120,
                    sortable: true,
                    dataIndex: 'quantita',
                    groupable: false,
                    summaryType: 'sum',
                    summaryRenderer: function(v, params, data){
                        return ((v === 0 || v > 1) ? '(' + me.gateTotalRenderer + ': ' + v +')' : '(Totale 1)');
                    }
                }]
            }),
            plugins: summaryStat,
            view: new Ext.grid.GroupingView({
                id:'statViewId',
                forceFit: true,
                // custom grouping text template to display the number of items per group
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + me.gateElementsText + '" : "' + me.gateElementText + '"]})'
            }),            
            /*viewConfig: {
                forceFit: true
            },*/
            listeners: {
                afterrender: function (grid) {
                    /*grid.getStore().filter('description', this.currentInterval);
                    grid.getStore().load();*/
                }
            },
            scope: this
        });
       
        this.statDataFieldSet = new Ext.form.FieldSet({
            title: this.gateStatFieldsetTitle,
            id: 'statdatafset',
            autoHeight: true,
            autoScroll: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
                this.intervalSelector,
                this.statisticGrid
            ]
        });
        
        return this.statDataFieldSet;    
    },

    buildSliderData: function(filter){
        
        this.dateTimeSelector = {
            xtype: 'fieldset',
            title: this.gateTimeSelectorTitle,
            defaultType: 'datefield',
            labelWidth: 60,            
            items: [{
                    xtype: 'displayfield',
                    text: this.rangeChoiceText
                }, {
                    xtype: 'xdatetime',
                    id: 'starttime',
                    fieldLabel: this.gateStartDateText,
                    editable: false,
                    //width:360,
                    anchor: '-18',
                    timeFormat: 'H:i:s',
                    timeConfig: {
                        altFormats: 'H:i:s',
                        allowBlank: true
                    },
                    dateFormat: 'd-m-Y',
                    dateConfig: {
                        altFormats: 'd-m-Y|Y-n-d',
                        allowBlank: true
                    },
                    ref: '../rangeStartField'
                }, {
                    xtype: 'xdatetime',
                    id: 'endtime',
                    fieldLabel: this.gateEndDateText,
                    editable: false,
                    //width:360,
                    anchor: '-18',
                    timeFormat: 'H:i:s',
                    timeConfig: {
                        altFormats: 'H:i:s',
                        allowBlank: true
                    },
                    dateFormat: 'd-m-Y',
                    dateConfig: {
                        altFormats: 'd-m-Y|Y-n-d',
                        allowBlank: true
                    },
                    ref: '../rangeEndField'                 
                }
            ],
            buttons:[{
                    text: this.gateViewTimeGateButtonText,
                    id: 'datebutton',
                    iconCls: 'icon-view-gate',
                    disabled: false,
                    handler: function(){
                        
                        var start = this.sliderDataFieldSet.rangeStartField;
                        var end = this.sliderDataFieldSet.rangeEndField;

                        
                        if(start.dateValue && end.dateValue){
                            var startToISO = OpenLayers.Date.toISOString(new Date(start.dateValue.getTime() + 1000*60*60));
                            var endToISO = OpenLayers.Date.toISOString(new Date(end.dateValue.getTime() + 1000*60*60));        
                            
                            this.loadGateTimeGrid(this.buildDateFilter(this.filter,startToISO,endToISO));
                        }else{
                            Ext.Msg.show({
                                title: this.gateInfoTimeTitle,
                                buttons: Ext.Msg.OK,
                                msg: this.gateInfoTimeMsg,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        }
                    },
                    scope: this
                }
            ]
        };
                        
        this.sliderDataFieldSet = new Ext.form.FieldSet({
            title: this.gateSliderFieldsetTitle,
            id: 'timedatafset',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            collapsed: true,
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            items: [
                this.dateTimeSelector
            ]
        });
        
        return this.sliderDataFieldSet;
    },
    
    loadGateTimeGrid: function(filter){
        
        var me = this;
        
        //http://dev.sencha.com/deploy/ext-3.4.0/examples/grid/totals.html
        
        // Custom summary function to calculate average per hour
        Ext.ux.grid.GroupSummary.Calculations['mediaOraria'] = function(v, record, field, data){
            var count = data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
            
            /*var v = OpenLayers.Date.parse(record.data[field]).getTime();
            var q = OpenLayers.Date.parse(record.data[field]).getTime();
            
            var min = data[field+'min'] === undefined ? (data[field+'min'] = v) : data[field+'min'];
            var max = data[field+'max'] === undefined ? (data[field+'max'] = q) : data[field+'max'];
            */
            var mediaOraria = 0;
            var endtime = Ext.getCmp('endtime').getValue().getTime();
            var starttime = Ext.getCmp('starttime').getValue().getTime();
            if(count >= 1) {
                mediaOraria = (count / Math.round((endtime - starttime) / 3600000));
            }
            
            return Math.round10(mediaOraria,-4);

        };
        
        Ext.ux.grid.GroupSummary.Calculations['gate'] = function(v, record, field, data){
            return Ext.ux.grid.GroupSummary.Calculations[me.currentAggregation].call(this, v, record, field, data);
        };
        
        // defina Group Summary plugin
        var summaryTime = new Ext.ux.grid.GroupSummary({
            cellTpl: new Ext.XTemplate(
                '<tpl if="id == \'1\'"><td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
                "</td></tpl>"
            )
        });

        
        if(!this.gateTimeGrid){
    
            this.timeStore= new (Ext.extend(Ext.data.GroupingStore, new GeoExt.data.FeatureStoreMixin))({
                 id: "timeStore",
                 fields: [{
                            "name": "id",              
                            "mapping": "id_dato"
                  },{
                            "name": "fk_gate",              
                            "mapping": "fk_gate"
                  },{
                            "name": "data_rilevamento",              
                            "mapping": "data_rilevamento"
                  },{
                            "name": "ora_fuso_orario",              
                            "mapping": "ora_fuso_orario"
                  },{
                            "name": "minuto_fuso_orario",              
                            "mapping": "minuto_fuso_orario"
                  },{
                            "name": "data_ricezione",              
                            "mapping": "data_ricezione"/*,
                            "type": "date",
                            "dateFormat": 'timestamp'*/
                  },{
                            "name": "flg_corsia",              
                            "mapping": "flg_corsia",
                            "type": "int"
                  },{
                            "name": "direzione",              
                            "mapping": "flg_direzione"
                  },{
                            "name": "codice_kemler",              
                            "mapping": "codice_kemler"
                  },{
                            "name": "codice_onu",              
                            "mapping": "codice_onu"
                  },{
                            "name": "descrizione_onu",              
                            "mapping": "descrizione_onu_" + GeoExt.Lang.locale
                 }],
                 proxy: this.getWFSStoreProxy(this.timeFeature,filter), 
                 autoLoad: true,
                 groupField: 'flg_corsia',
                 groupOnSort: false,
                 remoteGroup: false  
           });
           
            this.gateTimeGrid= new Ext.grid.GridPanel({
                id: 'gatetime_grid_id',    
                //split: true,
                autoScroll: true,
                autoHeight: true,
                //height: 100,
                layout: 'fit',
                store: this.timeStore,
                header: false,
                loadMask: true,
                cm: new Ext.grid.ColumnModel({
                    columns: [{
                        header: "fk_gate",
                        width: 120,
                        sortable: true,
                        dataIndex: 'fk_gate',
                        hidden: true,
                        groupable: false
                    },{
                        header: this.gateTimeGridDetectionDate,
                        width: 120,
                        sortable: true,
                        dataIndex: 'data_rilevamento',
                        groupable: false,
                        renderer: Ext.util.Format.dateRenderer('d-m-Y H:i:s'),
                        summaryType: 'gate',
                        summaryRenderer: function(v, params, data){
                            //return ((v === 0 || v > 1) ? '(Media Oraria: ' + v +')' : '(Media Oraria 1)');
                            return ('(' + me.summaryLabels[me.currentAggregation] + ': ' + v +')');
                        }
                    },{
                        header: this.gateTimeGridHourTimeZone,
                        width: 120,
                        sortable: true,
                        dataIndex: 'ora_fuso_orario',
                        groupable: false
                    },{
                        header: this.gateTimeGridMinuteTimeZone,
                        width: 120,
                        sortable: true,
                        dataIndex: 'minuto_fuso_orario',
                        groupable: false
                    },{
                        header: this.gateTimeGridReceptionDate,
                        width: 120,
                        sortable: true,
                        dataIndex: 'data_ricezione',
                        //renderer: Ext.util.Format.dateRenderer('d-m-Y'),
                        renderer: function(date){
                            var newDate = OpenLayers.Date.parse(date);
                            newDate = new Date(newDate.getTime() + 24*60*60*1000)
                            // hack: bug su Geoserver per le date
                            var d = Ext.util.Format.date(newDate,"d-m-Y")
                            return d;
                        },
                        groupable: false
                    },{
                        header: this.gateTimeGridRoute,
                        width: 120,
                        sortable: true,
                        dataIndex: 'flg_corsia'
                    },{
                        header: this.gateTimeGridDirection,
                        width: 120,
                        sortable: true,
                        dataIndex: 'direzione'
                    },{
                        header: this.gateTimeGridKemler,
                        width: 120,
                        sortable: true,
                        dataIndex: 'codice_kemler'
                    },{
                        header: this.gateTimeGridOnu,
                        width: 120,
                        sortable: true,
                        dataIndex: 'codice_onu'
                    },{
                        header: this.gateStatGridDescOnu,
                        width: 120,
                        sortable: true,
                        dataIndex: 'descrizione_onu'
                    }]
                }),
                plugins: summaryTime,
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    id:'timeViewId',
                    startCollapsed: true, 
                    // custom grouping text template to display the number of items per group
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + me.gateElementsText + '" : "' + me.gateElementText + '"]})'
                }),
                listeners: {
                    afterrender: function (grid) {
                        grid.getStore().load();
                    }
                },
                scope: this
            });    
        
            this.gateTimeAggregationSelector = new Ext.form.ComboBox({
                fieldLabel: this.aggregationSelectorLabel,
                width: 150,
                hideLabel : false,
                store: new Ext.data.ArrayStore({
                    fields: ['summary', 'description'],
                    data :  [
                    ['count', this.gateAggregationTotal],
                    ['mediaOraria', this.gateAggregationAveragePerHour]
                    ]
                }), 
                valueField: 'summary',
                displayField: 'description',   
                lastQuery: '',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus:true,            
                value: 'mediaOraria',
                listeners: {
                    scope: this,                
                    
                    select: function(combo, record, index) {
                        this.currentAggregation = record.get('summary');
                        this.gateTimeGrid.getView().refresh();
                    }
                }          
            });
        
            var timeDataFieldSet = Ext.getCmp('timedatafset');            
            timeDataFieldSet.add(this.gateTimeAggregationSelector);
            timeDataFieldSet.add(this.gateTimeGrid);
            timeDataFieldSet.doLayout(false,true);
        }else{
            this.gateTimeGrid.show();
            this.gateTimeAggregationSelector.show();
            this.timeStore.proxy = this.getWFSStoreProxy(this.timeFeature,filter);
            this.timeStore.load();        
        }
    
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
                url: this.wfsUrl, 
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
        
    },
    
    buildDateFilter: function(filter,startDate,endDate){
    
        var newFilter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [
                filter,
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "data_rilevamento",
                    lowerBoundary: startDate,
                    upperBoundary: endDate
                })
            ]
        });
        
        return newFilter;
    
    }
            
});

// Closure
(function(){

    /**
     * Decimal adjustment of a number.
     *
     * @param	{String}	type	The type of adjustment.
     * @param	{Number}	value	The number.
     * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
     * @returns	{Number}			The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();    
    
Ext.preg(gxp.plugins.GateTimeSliderTab.prototype.ptype, gxp.plugins.GateTimeSliderTab);
