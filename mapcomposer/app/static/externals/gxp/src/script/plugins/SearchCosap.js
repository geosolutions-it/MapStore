/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchCosap
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchCosap(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchCosap = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchcosap",
	
	serviceUrl: null,
	
	waitMsg: "Si prega di attendere ...",	
	titleError: "Errore",	
	cercaText: 'Cerca',
	
	cosapTitle: 'Ricerca Occupazioni',	
	
	viaText: "Via",
	civicoText: "N. Civico",
	vieLang: "it",
		
	civicoEmpty: 'Inserisci civico',
	viaEmpty: 'Inserisci via',
	
	daDataText: 'Da data',
	aDataText: 'A data',
	
	errorData1: 'Inserire una data di inizio e una data fine valida.',
	errorData2: 'La data di inizio è maggiore della data di fine.',
	
	errorLayer: 'Layer occupazioni non definito: ',
	
	viaToolTip: 'Per esempio per Via Roma digitare "Roma"',
		
	constructor: function(config) {
        gxp.plugins.SearchCosap.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchCosap.superclass.init.apply(this, arguments);
		
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;        					
		
		var dsVie = new Ext.data.Store({
			url: this.serviceUrl + 'VieServlet',			
			reader: new Ext.data.JsonReader({
				root: 'vie',
				totalProperty: 'totalCount',
				successProperty: 'success',
				fields: [
					{name: 'codice', type: 'string'},
					{name: 'descrizione',  type: 'string'}
				]
			})
		});
		dsVie.setBaseParam('lang', this.vieLang);
		
		var dsCivici = new Ext.data.Store({
			url: this.serviceUrl + 'CiviciServlet',
			reader: new Ext.data.JsonReader({
				root: 'vie',
				totalProperty: 'totalCount',
				successProperty: 'success',
				fields: [
					{name: 'idVia',  type: 'string'},
					{name: 'codice', type: 'string'},
					{name: 'descrizione',  type: 'string'}                       
				]
			})
		});
		
		//CQL Filter: DATE_COL AFTER 2012-01-01T00:00:00Z AND DATE_COL BEFORE 2012-12-31T23:59:59Z
		
		/*
		
		      APER_DATA_INIZIO BEFORE 2013-02-31T00:00:00Z AND APER_DATA_FINE AFTER 2013-02-01T00:00:00Z
		*/
		
		var me = this;
		
		var cosapForm = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: this.cosapTitle,
			labelWidth: 80,
			bodyStyle:'padding:5px 5px 0',  
			items: [
			    {
					xtype: 'combo',
					fieldLabel: this.viaText,
					labelStyle:'font-weight:bold;',
					store: dsVie,
					mode: 'remote',
					displayField: 'descrizione',
					emptyText: this.viaEmpty,
					valueField: 'codice', 
					width: 150,
					minChars: 3,
					id: 'vieBox',
					hideTrigger:true,
					forceSelection: false,
					scope: this,
					listeners:{
						select: function(combo, record, index) {
							dsCivici.removeAll(false);
							var civiciCombo = Ext.getCmp("civicoBox"); 
							civiciCombo.clearValue();
							dsCivici.setBaseParam('idVia', combo.getValue());
						}
					}
				},
				{
					xtype: 'combo',
					fieldLabel: this.civicoText,
					labelStyle:'font-weight:bold;',
					emptyText: this.civicoEmpty,
					store: dsCivici,
					mode: 'remote',
					displayField: 'descrizione',
					valueField: 'codice', 
					width: 150,
					minChars: 1,
					id: 'civicoBox',
					hideTrigger:true,
					forceSelection: false
				}, 
				{
					xtype: 'datefield',
					fieldLabel: this.daDataText,
					labelStyle:'font-weight:bold;',
					id: 'daDataBox',
					format: 'd/m/Y',
					submitFormat: 'Y-m-d H:i:s',
					allowBlank: false,
					value: new Date()
				},
				{
					xtype: 'datefield',
					fieldLabel: this.aDataText,
					id: 'aDataBox',
					labelStyle:'font-weight:bold;',	
					format: 'd/m/Y',
					submitFormat: 'Y-m-d H:i:s',
					allowBlank: false,
					value: new Date()
				},
				{
					xtype: 'button',
					text: this.cercaText,
					scope: this,
					handler: function(){	
					   //FILTRO SULLE OCCUPAZIONI 
					   var startDate = Ext.getCmp("daDataBox").getValue();
					   var endDate = Ext.getCmp("aDataBox").getValue();
					   
					   if ((! startDate) || (!endDate)) {
							Ext.Msg.show({
								  title: this.titleError,
								  msg: this.errorData1,
								  width: 300,
								  icon: Ext.MessageBox.WARNING
							});
							return;
					   }
					   
					   if (startDate > endDate) {
							Ext.Msg.show({
								  title: this.titleError,
								  msg: this.errorData2,
								  width: 300,
								  icon: Ext.MessageBox.WARNING
							});
							return;
					   }
					   

					   var cosapLayers = [this.selectionProperties.layerCosapTitle, this.selectionProperties.layerCosapLogoTitle];	
					   for (var i=0; i<cosapLayers.length; i++) {
						   var cosapLayer = apptarget.mapPanel.map.getLayersByName(cosapLayers[i])[0];
						   if(cosapLayer){
								cosapLayer.vendorParams =  {
									//"cql_filter": "APER_DATA_INIZIO <= '"+ endDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + startDate.format('Y-m-d') + "'"
									"viewparams": "begin_datetime:" + startDate.format('Y-m-d') + ";end_datetime:" + endDate.format("Y-m-d") + ""
								};
								
								cosapLayer.mergeNewParams({
									//"cql_filter": "APER_DATA_INIZIO <= '"+ endDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + startDate.format('Y-m-d') + "'"
									"viewparams": "begin_datetime:" + startDate.format('Y-m-d') + ";end_datetime:" + endDate.format("Y-m-d") + ""
								});						
								
								var params = {					   
								   //"cql_filter": "APER_DATA_INIZIO <= '"+ endDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + startDate.format('Y-m-d') + "'"
								   "viewparams": "begin_datetime:" + startDate.format('Y-m-d') + ";end_datetime:" + endDate.format("Y-m-d") + ""
							   };
								
								var index = apptarget.mapPanel.layers.findExact('name', cosapLayer.params.LAYERS);
								apptarget.mapPanel.layers.getAt(index).getLayer().vendorParams = params;
								apptarget.mapPanel.layers.getAt(index).getLayer().mergeNewParams(params);
								
								
									/*"vendorParams": {
										"cql_filter": "APER_DATA_INIZIO BEFORE " + endDate.format('Y-m-d') + "T00:00:00Z AND APER_DATA_FINE AFTER " + startDate.format('Y-m-d') + "T00:00:00Z"
									}*/
						   } else {
								Ext.Msg.show({
									  title: this.titleError,
									  msg: this.errorLayer + cosapLayers[i],
									  width: 300,
									  icon: Ext.MessageBox.WARNING
								});
						   }
					   }
					   
					   //ZOOM SU VIA/N.CIVICO
					   var url = '';
						
						var civico = Ext.getCmp('civicoBox').getValue();
						var via = Ext.getCmp('vieBox').getValue();
						
						var selectionLayerName;
						var filterAttribute;
						var selectionStyle;

						
						if (civico) {
							url = this.serviceUrl + 'BoundsServlet?tipo=civico&codice=' + civico;
							if(this.selectionProperties){
								selectionLayerName = this.selectionProperties.selectionLayerCiviciName;
								filterAttribute = this.selectionProperties.filterCiviciAttribute;
								selectionStyle = this.selectionProperties.selectionCiviciStyle;
							}
						} else if (via) {
							url = this.serviceUrl + 'BoundsServlet?tipo=via&codice=' + via;
							if(this.selectionProperties){
								selectionLayerName = this.selectionProperties.selectionLayerViaName;
								filterAttribute = this.selectionProperties.filterViaAttribute;
								selectionStyle = this.selectionProperties.selectionViaStyle;
							}
						}
						
						if (url != '') {
						
							var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
							mask.show();
						
							Ext.Ajax.request({
								url: url,
								scope: this,
								success: function(response, opts) {
									mask.hide();
									var obj = Ext.decode(response.responseText);
									var bounds = obj.bounds;
									var comProjection = new OpenLayers.Projection("EPSG:25832"); 
									var googleProjection = new OpenLayers.Projection("EPSG:900913");
									
									var comBounds = new OpenLayers.Bounds(bounds.x1, bounds.y1, bounds.x2, bounds.y2);
									var newBounds = comBounds.transform(comProjection, googleProjection);
									
									//
									// Add the WMS layer
									//
									var addLayer = apptarget.tools["addlayer"];
									if(selectionLayerName && this.selectionProperties && 
										filterAttribute && selectionStyle && addLayer){
									
										var layer = apptarget.mapPanel.map.getLayersByName(this.selectionProperties.selectionLayerTitle)[0];
										if(!layer){
											var customParams = {
												cql_filter: filterAttribute + "=" + bounds.codice,
												styles: selectionStyle,
												displayInLayerSwitcher: false,
												enableLang: false
											};
											
											var opts = {
												msLayerTitle: this.selectionProperties.selectionLayerTitle,
												msLayerName: selectionLayerName,
												wmsURL: this.selectionProperties.wmsURL,
												customParams: customParams
											};
											
											addLayer.addLayer(opts);																					
											
											layer = apptarget.mapPanel.map.getLayersByName(this.selectionProperties.selectionLayerTitle)[0];
										} //else{ Nota: a seguito di alcune modifiche, bisogna riassegnare il cql_filter
											layer.mergeNewParams({
												"cql_filter": filterAttribute + "=" + bounds.codice,
												"layers": selectionLayerName,
												"styles": selectionStyle
											});
										//}
									}
									
									apptarget.mapPanel.map.zoomToExtent(newBounds);
								},
								failure: function(response, opts) {
									mask.hide();
									
									Ext.Msg.show({
										  title: this.titleError,
										  msg: response.responseText + " - " + response.status,
										  width: 300,
										  icon: Ext.MessageBox.WARNING
									});
									
									console.log('server-side failure with status code ' + response.status);
								}
							});
						}
					}
				}
            ]
		});
		
		
		apptarget.mapPanel.map.events.register('preaddlayer', apptarget.mapPanel.map, function (e) {
		
		
			// if ((e.layer.name == 'Occupazioni Area') || 
			    // (e.layer.name == 'Occupazioni Icone')){
			if ((e.layer.params && e.layer.params.LAYERS ==  me.selectionProperties.wsCosapName  +':' + me.selectionProperties.layerCosapLogoName) || 
			    (e.layer.params && e.layer.params.LAYERS == me.selectionProperties.wsCosapName  +':' + me.selectionProperties.layerCosapName)){
				var aDate = new Date();
				
				//Impostazione di un filtro iniziale.
				e.layer.vendorParams =  {
					//"cql_filter": "APER_DATA_INIZIO <= '"+ aDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + aDate.format('Y-m-d') + "'",
					"viewparams": "begin_datetime:" + aDate.format('Y-m-d') + ";end_datetime:" + aDate.format("Y-m-d") + "",
					"buffer": 20
				};
				
				e.layer.mergeNewParams({
					//"cql_filter": "APER_DATA_INIZIO <= '"+ aDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + aDate.format('Y-m-d') + "'",
					"viewparams": "begin_datetime:" + aDate.format('Y-m-d') + ";end_datetime:" + aDate.format("Y-m-d") + "",
					"buffer": 20
				});
				
				var params = {					   
					   //"cql_filter": "APER_DATA_INIZIO <= '"+ aDate.format('Y-m-d') + "' AND APER_DATA_FINE >= '" + aDate.format('Y-m-d') + "'"
					   "viewparams": "begin_datetime:" + aDate.format('Y-m-d') + ";end_datetime:" + aDate.format("Y-m-d") + ""
				   };
				
				var index = apptarget.mapPanel.layers.findExact('name', e.layer.params.LAYERS);
				apptarget.mapPanel.layers.getAt(index).getLayer().vendorParams = params;
				apptarget.mapPanel.layers.getAt(index).getLayer().mergeNewParams(params);
			}
		});
		
        
		// Imposto il tab di ricerca come tab attivo
		Ext.getCmp("west").setActiveTab(2);
		
		var panel = gxp.plugins.SearchCosap.superclass.addOutput.call(this, cosapForm);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchCosap.prototype.ptype, gxp.plugins.SearchCosap);