/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ObuForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ObuForm(config)
 *
 */   
gxp.plugins.ObuForm = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_layertree */
    ptype: "gxp_obu",

    // Begin i18n.
	
	title: "Dati in tempo reale-Obu",
	
	filterTitle: "Filtro",
	
	fieldIDLabel: "Semirimorchio",
	
	fieldTypeLabel: "Tipo Evento",
	
	idEmptyText: "Cerca per semirimorchio",
	
	typeEmptyText: "Cerca per tipo evento",
	
	velocityRange: "Intervallo velocita",
	
	velocityMin: "Min",
	
	velocityMax: "Max",
	
	descriptionRange: "Intervallo direzione",
	
	descriptionMin: "Min",
	
	descriptionMax: "Max",
	
	graphicStyle: "Tematizzazione",
	
	showTrack: "Mostra traccia",
	
	styleData: "Visualizzazione",
	
	applyText: "Applica",
    
	resetText: "Reset",

	clearFieldTooltip: "Clear Field",
    
    timeSliderDataTitle: "Data",
	
    // End i18n.
	
	wfsComboSize: 180,
    
    wfsUrl: "http://destination.geo-solutions.it/geoserver_test/ows?",
	
	search: {
	    pageSize: 10,
		predicate: "ILIKE",
		query: [{
		        typeName: "siig_obu_semirimorchio",
				queriableAttributes: [
					"semirimorchio"  
				],
				sortBy: "semirimorchio",
				displayField: "semirimorchio",	
				tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{semirimorchio}</span></h3></div></tpl>",
				recordModel:[
					{
						name:"semirimorchio",
						mapping:"properties.semirimorchio"
					},
					{
						name: "semirimorchio",
						mapping: "properties.semirimorchio"
					} 
				]
			},{
				typeName: "siig_d_obu_tipo",
				queriableAttributes: [
					"descrizione_${locale}"
				],
				sortBy: "id_tipo",
				displayField: "descrizione",
				tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{descrizione}</span></h3></div></tpl>",
				recordModel:[
					{
						name:"tipo",
						mapping:"properties.id_tipo"
					},
					{
						name: "descrizione",
						mapping: "properties.descrizione_${locale}"
					} 
				]
			}
		]
	},
	
	styleStore: {
        fields: [
            'obu-value',
            'obu-text'
        ],
        data: [
            ["obu-point", 'obu-point'],
            ["obu-point-speed", 'obu-point-speed'],
            ["obu-point-direction", 'obu-point-direction']]
	},

    styleRenamedStore: null,
    
	layerTrackTitle: "obu_track",
	
	layerTrackName: "siig_geo_obu_line",
	
	layerTrackUrl: "http://destination.geo-solutions.it/geoserver_test/destination/ows",
	
    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.ObuForm.superclass.constructor.apply(this, arguments);
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
			    this.formPanel.on("show", function(){
                
					//
					// Make visible the OBU layer if it is deactivated inside the layertree
					//
					var track = this.target.mapPanel.map.getLayersByName(this.layerToFilter)[0];
					if(track && !track.getVisibility()){
						track.setVisibility(true);
					}
                    
					this.playbackTool = this.target.tools["destination_playback"];
					if(this.playbackTool && this.playbackTool.playbackToolbar){
                        
                        //populate timeslider settings panel with values
                        this.formPanel.optionsPanel.timeManager = this.playbackTool.playbackToolbar.control;
                        this.formPanel.optionsPanel.playbackToolbar = this.playbackTool.playbackToolbar;
                        
						this.playbackTool.playbackToolbar.show();
                        
                        var end = OpenLayers.Date.parse(this.playbackTool.playbackToolbar.control.layers[0].metadata.timeInterval[0][1]);
                        var start = OpenLayers.Date.parse(this.playbackTool.playbackToolbar.control.layers[0].metadata.timeInterval[0][0]);
                        
                        this.playbackTool.playbackToolbar.control.setEnd(OpenLayers.Date.parse(this.playbackTool.playbackToolbar.control.layers[0].metadata.timeInterval[0][1]));
                        
                        this.playbackTool.playbackToolbar.control.setStart(OpenLayers.Date.parse(this.playbackTool.playbackToolbar.control.layers[0].metadata.timeInterval[0][0]));
                        
                        this.playbackTool.playbackToolbar.control.setRange([start,end]);
                        this.playbackTool.playbackToolbar.control.nowtime(false,this.playbackTool.playbackToolbar.control.step,this.playbackTool.playbackToolbar.control.layers[0].metadata.timeInterval[0][0]);                        
                        
					}
               
				}, this);
				
				//
				// Hide the Time Slider when this tool is deactivated 
				//
			    this.formPanel.on("hide", function(){
					this.playbackTool = this.target.tools["destination_playback"];
					if(this.playbackTool && this.playbackTool.playbackToolbar){
						this.playbackTool.playbackToolbar.hide();
					}
                    
					//
					// Make active the OBU layer if it is activated inside the layertree
					//
					var track = this.target.mapPanel.map.getLayersByName(this.layerToFilter)[0];
					if(track && track.getVisibility()){
						track.setVisibility(false);
					}                    
				}, this);
			}
		});
		return gxp.plugins.ObuForm.superclass.init.apply(this, arguments);
	},
	
    addLocaleSupport: function(obj) {
        if(Ext.isArray(obj)) {
            for(var i = 0, l=obj.length; i<l; i++) {
                obj[i] = this.addLocaleSupport(obj[i]);
            }
        } else if(Ext.isObject(obj)) {
            for(var key in obj) {
                obj[key] = this.addLocaleSupport(obj[key]);
            }
       } else if(Ext.isString(obj)) {
            return obj.replace('${locale}', GeoExt.Lang.locale);
       }
       return obj;
    },
    
	/** private: method[addOutput]
     *  :arg config: ``Object``
	 * 
	 *  Contains the output definitions of the FormPanel. 
     */
    addOutput: function(config) {

		this.selectIdCombo = new gxp.form.WFSSearchComboBox({
			name: "selectIDCombo",
			target: this.target,
			clearOnFocus: true,
			forceAll: 'false',
			xtype: 'gxp_searchboxcombo',
			ref: 'selectIDCombo',
			vendorParams: this.search.query[0].vendorParams,
			autoWidth: false,
			width: this.wfsComboSize,
			flex: 1,
			fieldLabel: this.fieldIDLabel,
			url: this.wfsUrl,
			typeName: this.search.query[0].typeName,
			predicate: this.search.predicate,
			recordModel: this.addLocaleSupport(this.search.query[0].recordModel),
			queriableAttributes: this.addLocaleSupport(this.search.query[0].queriableAttributes),
			sortBy: this.search.query[0].sortBy,
			displayField: this.addLocaleSupport(this.search.query[0].displayField),
			pageSize: this.search.pageSize,
			tpl: this.addLocaleSupport(this.search.query[0].tpl),
			emptyText: this.idEmptyText,
			resizable: true
		});	
		
		this.selectIdCombo.removeListener("focus", this.selectIdCombo.listeners.focus);
		
		//
		// The store content is filtered in order to keep distinct values
		//
		var idStore = this.selectIdCombo.getStore();
		idStore.on({
			scope: this,
			"load": function(store, records, options){			
				var existingRecords = [];				
				
				store.filterBy(
					function(rec, recId){
						var tipo = rec.get("semirimorchio").trim().toLowerCase();

						if(existingRecords.indexOf(tipo) > -1){
							return false;
						}else{
							existingRecords.push(tipo);
							return true
						}
					}
				); 
			}
		});
		
		this.selectIdCombo.addListener("select", function(combo, record, index){
			this.trackCheckEnable(combo ? combo.getValue() : undefined);
		}, this);
		
		/*this.selectIdCombo.addListener("keyup", function(field, evt){
			var value = field.getValue();		
			this.trackCheckEnable(value);
		}, this);*/

		this.selectTypeCombo = new gxp.form.WFSSearchComboBox({
			name: "selectTypeCombo",
			target: this.target,
			clearOnFocus: true,
			forceAll: 'false',
			xtype: 'gxp_searchboxcombo',
			ref: 'selectTypeCombo',
			vendorParams: this.search.query[1].vendorParams,
			autoWidth: false,
			width: this.wfsComboSize,
			flex: 1,
			fieldLabel: this.fieldTypeLabel,
			url: this.wfsUrl,
			typeName: this.search.query[1].typeName,
			predicate: this.search.predicate,
			recordModel: this.addLocaleSupport(this.search.query[1].recordModel),
			queriableAttributes: this.addLocaleSupport(this.search.query[1].queriableAttributes),
			sortBy: this.search.query[1].sortBy,
			displayField: this.addLocaleSupport(this.search.query[1].displayField),
			valueField: "tipo",
			pageSize: this.search.pageSize,
			tpl: this.addLocaleSupport(this.search.query[1].tpl),
			emptyText: this.typeEmptyText,
			resizable: true
		});	
		
		this.selectTypeCombo.removeListener("focus", this.selectTypeCombo.listeners.focus);
		
		this.idCompositeField = new Ext.form.CompositeField({
			items:[
				this.selectIdCombo, 
				{
					xtype: 'button',
					id: "infoBtn",
					tooltip: this.clearFieldTooltip,
					iconCls: "obu-clear-button",
					width: 23,
					scope: this,
					handler: function(){
					   	this.selectIdCombo.reset();  
						this.trackCheckEnable(undefined);						
					}
				}
			]
		});
		
		this.typeCompositeField = new Ext.form.CompositeField({
			items:[
				this.selectTypeCombo, 
				{
					xtype: 'button',
					id: "infoBtn",
					tooltip: this.clearFieldTooltip,
					iconCls: "obu-clear-button",
					width: 23,
					scope: this,
					handler: function(){
					   	this.selectTypeCombo.reset(); 
					}
				}
			]
		});
		
		this.velocityField = new Ext.form.CompositeField({		
			labelWidth: 110,
			items: [
                {
                    xtype: 'numberfield',
					id: "vminField",	
					width: 80,
					fieldLabel: this.velocityRange,
                    emptyText: this.velocityMin,
                    flex: 1
                }, {
                    xtype: 'label',
					id: "vlabelField",	
					text: "to",
					width: 10,
                    flex: 1
                }, {
                    xtype: 'numberfield',
					id: "vmaxField",	
					width: 80,
                    emptyText: this.velocityMax,
                    flex: 1
                }, {
					xtype: 'button',
					id: "infoBtn",
					tooltip: "Clear Field",
					iconCls: "obu-clear-button",
					width: 23,
					scope: this,
					handler: function(){
					   	var vminField = Ext.getCmp("vminField");
						var vmaxField = Ext.getCmp("vmaxField"); 
						vminField.reset();
						vmaxField.reset();
					}
				}
			]
		});
		
		this.directionField = new Ext.form.CompositeField({		
			labelWidth: 110,
			items: [
                {
                    xtype: 'numberfield',
					id: "dminField",	
					width: 80,
					fieldLabel: this.descriptionRange,
                    emptyText: this.descriptionMin,
                    flex: 1
                }, {
                    xtype: 'label',
					id: "dlabelField",	
					text: "to",
					width: 10,
                    flex: 1
                }, {
                    xtype: 'numberfield',
					id: "dmaxField",	
					width: 80,
                    emptyText: this.descriptionMax,
                    flex: 1
                }, {
					xtype: 'button',
					id: "infoBtn",
					tooltip: "Clear Field",
					iconCls: "obu-clear-button",
					width: 23,
					scope: this,
					handler: function(){
					   	var dminField = Ext.getCmp("dminField");
						var dmaxField = Ext.getCmp("dmaxField");
						dminField.reset();
						dmaxField.reset();
					}
				}
			]
		});
		
	    // /////////////////////////////////////
		// FieldSet definitions.
		// /////////////////////////////////////
        
		this.filterData = new Ext.form.FieldSet({
			title: this.filterTitle,
			items: [
				this.idCompositeField,
				this.typeCompositeField,
				this.velocityField,
				this.directionField
			]
		});
		
        if(this.styleRenamedStore) {
            for(var i = 0; i<this.styleStore.data.length; i++){
                this.styleStore.data[i][1] = this.styleRenamedStore[i][GeoExt.Lang.getLocaleIndex()];            
            }
        }
        
		this.styleCombo = new Ext.form.ComboBox({
            typeAhead: true,
            lazyRender:true,        
			fieldLabel: this.graphicStyle,
			width: 200,
			allowBlank: false,
			mode: 'local',
		    triggerAction: 'all',
			editable: false,
            displayField: "obu-text",
            valueField: "obu-value",
			value: this.styleStore.data[0][0],
			store: new Ext.data.ArrayStore(this.styleStore)
		});
		
		this.trackCheckBox = new Ext.form.Checkbox({
			disabled: true,
			fieldLabel: this.showTrack
		});
		
		this.styleData = new Ext.form.FieldSet({
			title: this.styleData,
			items: [
				this.styleCombo,
				this.trackCheckBox
			]
		});
		
	    this.container = new Ext.form.FieldSet({
            layout: 'anchor',
			items: [
                //this.timeSliderData,
				this.filterData,
				this.styleData
			],
			buttons:[
				{
					text: this.applyText,
					buttonAlign: "left",
					scope: this,
					iconCls: "obu-filter-apply",
					handler: function(){
						var cql = "";
						var formValid = true;						
						var filter = [];

						//
						// ID check before apply
						//
						if(this.selectIdCombo.isDirty()){
							var idStore = this.selectIdCombo.getStore();
							var count = idStore.getCount();
							if(count < 1){
								this.selectIdCombo.markInvalid();
							}
							
							if(this.selectIdCombo.isValid() && count > 0){
								var id = this.selectIdCombo.getValue();
								var idFilter = "semirimorchio='" + id + "' "; 
								filter.push(idFilter);
						    } else {
                                formValid = false;
                            }
						}
						
						//
						// Type check before apply
						//
						if(this.selectTypeCombo.isDirty()){
							var typeStore = this.selectTypeCombo.getStore();
							var count = typeStore.getCount();
							if(count < 1){
								this.selectTypeCombo.markInvalid();
							}
							
							if(this.selectTypeCombo.isValid() && count > 0){
								var type = this.selectTypeCombo.getValue();
								var typeFilter = "tipo='" + type + "'";
								filter.push(typeFilter);
						    } else {
                                formValid = false;
                            }
						}
						
						//
						// Velocity check before apply
						//
						var vminField = Ext.getCmp("vminField");
						var vmaxField = Ext.getCmp("vmaxField");
						var vIntervalFilter;
						if(vminField.isDirty() && vmaxField.isDirty()){
							var vmin = vminField.getValue();
							var vmax = vmaxField.getValue();
							
							if(vminField.isValid() && vmaxField.isValid()){
								if(vmin < vmax){
									vIntervalFilter = "( ";
									vIntervalFilter += "velocita >= " + vmin;
									vIntervalFilter += " AND velocita <= " + vmax;
									vIntervalFilter += " )";
									filter.push(vIntervalFilter);
								}else{
									//vminField.markInvalid();
									vmaxField.markInvalid();
									formValid = false;
								}
							}else{
								formValid = false;
							}							
						}else if(vmaxField.isDirty()){	
							if(vmaxField.isValid()){
								var vmax = vmaxField.getValue();	
								vIntervalFilter = "velocita <= " + vmax; 
								filter.push(vIntervalFilter);
							} else {
                                formValid = false;
                            }

						}else if(vminField.isDirty()){
							if(vminField.isValid()){
								var vmin = vminField.getValue();	
								vIntervalFilter = "velocita >= " + vmin;
								filter.push(vIntervalFilter);
							} else {
                                formValid = false;
                            }
						}	
						
						//
						// Direction check before apply
						//
						var dminField = Ext.getCmp("dminField");
						var dmaxField = Ext.getCmp("dmaxField");
						var dIntervalFilter;
						if(dminField.isDirty() && dmaxField.isDirty()){
							var dmin = dminField.getValue();
							var dmax = dmaxField.getValue();
							
							if(dminField.isValid() && dmaxField.isValid()){
								if(dmin < dmax){
									dIntervalFilter = "( ";
									dIntervalFilter += "direzione >= " + dmin;
									dIntervalFilter += " AND direzione <= " + dmax;
									dIntervalFilter += " )";
									filter.push(dIntervalFilter);
								}else{
									//dminField.markInvalid();
									dmaxField.markInvalid();
									formValid = false;
								}
							}else{
								formValid = false;
							}							
						}else if(dmaxField.isDirty()){	
							if(dmaxField.isValid()){
								var dmax = dmaxField.getValue();	
								dIntervalFilter = "direzione <= " + dmax; 
								filter.push(dIntervalFilter);
							} else {
                                formValid = false;
                            }
						}else if(dminField.isDirty()){
							if(dminField.isValid()){
								var dmin = dminField.getValue();	
								dIntervalFilter = "direzione >= " + dmin;
								filter.push(dIntervalFilter);
							} else {
                                formValid = false;
                            }
						}	
						
						if(filter.length > 0){
							cql = filter.join(" AND ");
						}				

						if(formValid){
							// ///////////////////////////
							// Obu filter management
							// ///////////////////////////
							var params = {
								STYLES: this.styleCombo.getValue()
							};
							
							if(cql){
								params.CQL_FILTER = cql;
							} else {
                                params.CQL_FILTER = "INCLUDE";
                            }
							
							var layer = this.target.mapPanel.map.getLayersByName(this.layerToFilter)[0];
							layer.mergeNewParams(params);
				
						    // ///////////////////////////
							// Obu Track
							// ///////////////////////////
							var track  = this.target.mapPanel.map.getLayersByName(this.layerTrackName)[0];
							if(track){
								this.target.mapPanel.map.removeLayer(track);
							}
								
							if(!this.trackCheckBox.disabled && this.trackCheckBox.getValue()){								
                                var times = (this.playbackTool.timeManager.layers[0].params.TIME || this.playbackTool.timeManager.layers[0].params.time).split('/');
								var customParams = {
									//viewparams: "semirimorchio:" + this.selectIdCombo.getValue() + ";start_date:" +OpenLayers.Date.toISOString(this.playbackTool.timeManager.timeSpans[0].end || this.playbackTool.timeManager.range[0])+ ";end_date:" + OpenLayers.Date.toISOString(this.playbackTool.timeManager.currentTime),
                                    viewparams: "semirimorchio:" + this.selectIdCombo.getValue() + ";start_date:" +times[0]+ ";end_date:" + times[1],
									displayInLayerSwitcher: false
								};
								
								var opts = {
									msLayerTitle: this.layerTrackTitle,
									msLayerName: this.layerTrackName,
									wmsURL: this.layerTrackUrl,
									customParams: customParams,
                                    doNotZoom: true
								};
								
								var addLayer = this.target.tools["addlayer"];
								addLayer.addLayer(opts);
							}
							
						}else{										
							Ext.Msg.show({
								title: "Form Validation",
								msg: "Some fields are empty or not valid",
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.WARNING
							});
						}
					}
				},
				{
					text: this.resetText,
					iconCls: "obu-filter-reset",
					scope: this,
					handler: function(){
                        var defaultStyle = this.styleCombo.getStore().getAt(0).get("obu-value");
						this.formPanel.form.reset();
					    var layer = this.target.mapPanel.map.getLayersByName(this.layerToFilter)[0];
						layer.mergeNewParams({
							CQL_FILTER: "INCLUDE",
							STYLES: defaultStyle
						});
						
						this.trackCheckEnable(undefined);
					}
				}
			]
		});
		
	    var opuForm = new Ext.Panel({
			title: this.title,
            layout: 'anchor',
			items:[
				this.container,
                {
                    xtype: 'gxp_playbackoptions' //add timeslider settings panel to obuForm panel
                } 
			]          
		});
		
		this.formPanel = opuForm;
        
		var panel = gxp.plugins.ObuForm.superclass.addOutput.call(this, opuForm);		
		panel.autoScroll = true;

		return panel;
	},

	trackCheckEnable: function(valueField){
		if(valueField){
			this.trackCheckBox.enable();
		}else{
			this.trackCheckBox.disable();
			this.trackCheckBox.setValue(false);
		}
	}
});

Ext.preg(gxp.plugins.ObuForm.prototype.ptype, gxp.plugins.ObuForm);
