/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchInfortuniStrade
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchInfortuniStrade(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchInfortuniStrade = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchinfortunistrade",
	
	serviceUrl: null,
	vieLang: "it",
	viaText: "Via",
	viaEmpty: 'Inserisci via',
	selectionProperties: null,
	
	viaToolTip: 'Per esempio per Via Roma digitare "Roma"',
		
	infortuniLayerName: 'view_incidenti',
	infortuniLayerCopyName: 'view_incidenti_copy',
	infortuniLayerWs: 'Cartografia',	
	
	constructor: function(config) {
        gxp.plugins.SearchInfortuniStrade.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchInfortuniStrade.superclass.init.apply(this, arguments);
		
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;     		

		//CQL Filter: DATE_COL AFTER 2012-01-01T00:00:00Z AND DATE_COL BEFORE 2012-12-31T23:59:59Z
		/*
		      APER_DATA_INIZIO BEFORE 2013-02-31T00:00:00Z AND APER_DATA_FINE AFTER 2013-02-01T00:00:00Z
		*/
		
		var me = this;
		
		var comProjection = new OpenLayers.Projection("EPSG:25832"); 
		var googleProjection = new OpenLayers.Projection("EPSG:900913");
		
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
		
		var dsServizi = new Ext.data.Store({
			url: this.serviceUrl + 'DescServiziServlet',			
			reader: new Ext.data.JsonReader({
				root: 'servizi',
				totalProperty: 'totalCount',
				successProperty: 'success',
				fields: [
					{name: 'codice', type: 'string'},
					{name: 'descrizione',  type: 'string'}
				]
			})
		});
		dsServizi.setBaseParam('lang', this.vieLang);
		
		
		var dsQuart = new Ext.data.ArrayStore({
			// store configs
			autoDestroy: true,
			storeId: 'quartStore',
			// reader configs
			idIndex: 1,  
			fields: [
			   'quart',
			   {name: 'codice', type: 'string'},
			   {name: 'descrizione', type: 'string'}
			],
			data: [
			    ['TT', '0', '-TUTTI-'],
				['DB', '4', 'DON BOSCO'],
				['EU', '3', 'EUROPA NOVACELLA'],
				['CP', '1', 'CENTRO P. RENCIO'],
				['GR', '5', 'GRIES S.QUIRINO'],
				['OL', '2', 'OLTRISARCO ASLAGO']
			]
		});
		
		/*var quartieriBounds = new Array(new OpenLayers.Bounds(676378.506299966,5146295.22456535,678948.527007408,5151668.14303656),
										new OpenLayers.Bounds(678466.28086363,5150788.14999069,679766.270519622,5151733.93921576),
										new OpenLayers.Bounds(679592.610573759,5146771.96139754,686694.123215321,5153840.62514496),
										new OpenLayers.Bounds(674670.741214438,5150321.92017395,681330.48838804,5155672.9491575),
										new OpenLayers.Bounds(676774.543313356,5146071.45289345,680640.700936764,5151231.94294201)
										);*/
		
		var quartieriBounds = new Array(new OpenLayers.Bounds(1257678.91320766,5852261.07912094,1261441.1885092,5860011.5664276),
										new OpenLayers.Bounds(1260744.90851826,5858721.29277957,1262629.25908689,5860082.35535871),
										new OpenLayers.Bounds(1262261.33008108,5852716.30969585,1272699.68342259,5863090.83195279),
										new OpenLayers.Bounds(1255276.74739195,5858156.79274919,1265077.53955173,5865757.69329878),
										new OpenLayers.Bounds(1258145.07649538,5851905.9397528,1263878.7098088,5859314.92879478)
										);	
		
		
		var lineconfig = {
			xtype: 'box',
			autoEl:{
				tag: 'div',
				style:'line-height:1px; font-size: 1px;margin-bottom:4px',
				children: [{
					tag: 'img',
					src: '1pxLine.gif',
					height: '2px',
					width: '100%'
				}]
			}
		};
		
		var verLine = {
			xtype: 'box',
			autoEl:{
				tag: 'div',
				style:'line-height:1px; font-size: 1px;margin-bottom:4px',
				children: [{
					tag: 'img',
					src: '1pxLine.gif',
					height: '2px',
					width: '100%'
				}]
			}
		};
	
		/*var formPanel =  {
			xtype       : 'panel',
			height:      35,
			border:0,
			autoScroll  : false,
			layout:'column',
			bodyStyle:'padding:0px 0px 0; background-color:transparent;',
			id          : 'formpanel',
			defaultType : 'field',
			frame       : true,
			items:[				   
						{
							xtype: 'button',
							id: 'ckBtn',
							text: 'Seleziona tutto',
							iconCls: 'icon-addlayers',
							width: 50,
							handler: function(){
								Ext.getCmp('serviziCheck').items.each(function(oEl) {
									oEl.setValue(true);
								});
							}
						},
						verLine,
						{
							xtype: 'button',
							id: 'unckBtn',
							text: 'Deseleziona tutto',
							iconCls: 'icon-removelayers',
							width: 50,
							handler: function(){
								Ext.getCmp('serviziCheck').items.each(function(oEl) {
									oEl.setValue(false);
								});
							}
						}
				   ]
			};*/
	
		
		var serviziForm = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: 'Filtra Infortuni',
			labelWidth: 80,
			bodyStyle:'padding:5px 5px 0', 
				
			items: [
				//formPanel,
				{
					xtype: "fieldset",
					title: 'Periodo:',
					items:[
					{
						xtype: 'datefield',
						fieldLabel: 'Da',
						labelStyle:'font-weight:bold;',
						id: 'daDataBox',
						format: 'd/m/Y',
						submitFormat: 'Y-m-d H:i:s',
						allowBlank: false,
						value: new Date()
					}, {
						xtype: 'datefield',
						fieldLabel: 'A',
						labelStyle:'font-weight:bold;',
						id: 'aDataBox',
						format: 'd/m/Y',
						submitFormat: 'Y-m-d H:i:s',
						allowBlank: false,
						value: new Date()
					}
					]
				},				
				{
					xtype: "fieldset",
					items:[{
						xtype: 'checkboxgroup',
						fieldLabel: 'Giorno della settimana',
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						id: 'gSettCheck',
						labelStyle:'font-weight:bold;',					
						items: [{
							boxLabel: 'Lunedì',
							name: 'rbAmm',
							inputValue: '1',
							checked: true
						}, {
							boxLabel: 'Martedì',
							name: 'rbAmm',
							inputValue: '2',
							checked: true
						}, {
							boxLabel: 'Mercoledì',
							name: 'rbAmm',
							inputValue: '3',
							checked: true
						}, {
							boxLabel: 'Giovedì',
							name: 'rbAmm',
							inputValue: '4',
							checked: true
						}, {
							boxLabel: 'Venerdì',
							name: 'rbAmm',
							inputValue: '5',
							checked: true
						}, {
							boxLabel: 'Sabato',
							name: 'rbAmm',
							inputValue: '6',
							checked: true
						}, {
							boxLabel: 'Domenica',
							name: 'rbAmm',
							inputValue: '7',
							checked: true
						}]
					}]
				},						
				{
					xtype: "fieldset",
					items:[{
						xtype: 'checkboxgroup',
						fieldLabel: 'Tipo di infortunio',
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						id: 'tpIncCheck',
						labelStyle:'font-weight:bold;',					
						items: [{
							boxLabel: 'Senza Feriti',
							name: 'rbAmm',
							inputValue: '1',
							checked: true
						}, {
							boxLabel: 'Con Feriti',
							name: 'rbAmm',
							inputValue: '2',
							checked: true
						}, {
							boxLabel: 'Mortale',
							name: 'rbAmm',
							inputValue: '3',
							checked: true
						}]
					}]
				},	
				{
					xtype: 'button',
					text: 'Aggiorna',
					scope: this,
					handler: function(){					   
					   aggiornaServizi();						
					}
				}
            ]
		});		
		
		var dtToday = new Date();
		Ext.getCmp("aDataBox").setValue(new Date(dtToday.getFullYear(), 11, 31));
		Ext.getCmp("daDataBox").setValue(new Date(dtToday.getFullYear(), 0, 1));
				
		
		function aggiornaServizi(layer) {
		  /* var startTime = Ext.getCmp("daBox").getValue();
		   var endTime = Ext.getCmp("aBox").getValue();
		   var aDate = Ext.getCmp("searchDate").getValue();
		   var via = Ext.getCmp('vieBox').getValue();
		   var quartiere = Ext.getCmp('quartBox').getValue();
		   var servizio = Ext.getCmp('servDescBox').getValue();
		   var serviziLayer;
		   var url;
		   var qBounds;
		   
		   if (via) {
				url = me.serviceUrl + 'BoundsServlet?tipo=via&codice=' + via;
				if(me.selectionProperties){
					selectionLayerName = me.selectionProperties.selectionLayerViaName;
					filterAttribute = me.selectionProperties.filterViaAttribute;
					selectionStyle = me.selectionProperties.selectionViaStyle;
				}
				
				zoomVia(url, selectionLayerName, filterAttribute, selectionStyle, comProjection, googleProjection);
			} else if (quartiere > 0) {
				//var record = Ext.getCmp('quartBox').findRecord(Ext.getCmp('quartBox').valueField || Ext.getCmp('quartBox').displayField, quartiere);
				//var index = Ext.getCmp('quartBox').store.indexOf(record) - 1;
				qBounds = quartieriBounds[Ext.getCmp('quartBox').selectedIndex - 1];
				
				selectionLayerName = 'Ambiente:quartieri';
				filterAttribute = 'BOLZANO_CI';
				selectionStyle = 'highlight_polygon';
				
				zoomQuartiere(url, selectionLayerName, filterAttribute, selectionStyle, quartiere, qBounds, comProjection, googleProjection);
			} else if (servizio) {
				url = me.serviceUrl + 'BoundsServlet?tipo=servizio&codice=' + servizio;
				if(me.selectionProperties){
					selectionLayerName = 'Cartografia:SERVIZI_RICERCA';
					filterAttribute = 'SERV_ID';
					selectionStyle = 'highlight_point';
				}
				
				zoomServizio(url, selectionLayerName, filterAttribute, selectionStyle, servizio, comProjection, googleProjection);
			}*/
			
			
			
		   var infortuniLayer;
		   if (!layer) {
		   	   infortuniLayer = apptarget.mapPanel.map.getLayersByName('view_str_inc')[0];
		   } else {
			   infortuniLayer = layer;
		   }
		   
		  
		   /*var selectedYears = Ext.getCmp("annoCheck").getValue();
		   var inYears = "";           
            for(var i=0; i<selectedYears.length; i++){
                var inYear = "" + selectedYears[i].inputValue + "";
                inYears += inYear;
                
                if(i+1 < selectedYears.length){
                    inYears += "\\,";
                }         
            }*/
			
			var selectedDays = Ext.getCmp("gSettCheck").getValue();
		    var inDays = "";           
            for(var i=0; i<selectedDays.length; i++){
                var inDay = "" + selectedDays[i].inputValue + "";
                inDays += inDay;
                
                if(i+1 < selectedDays.length){
                    inDays += "\\,";
                }         
            }
			
			var selectedTypes = Ext.getCmp("tpIncCheck").getValue();
		    var inTypes = "";           
            for(var i=0; i<selectedTypes.length; i++){
                var inType = "" + selectedTypes[i].inputValue + "";
                inTypes += inType;
                
                if(i+1 < selectedTypes.length){
                    inTypes += "\\,";
                }         
            }
			
			//var sCqlFilter = "(" + (inYears == "" ? "ANNOINC=0" : inYears) + ") AND (" + (inTypes == "" ? "TPINCID='0'" : inTypes) + ") AND (" + (inDays == "" ? "DOW='-1'" : inDays) + ")";
           // var sParam = "gionrnos_p:'" + (inDays == "" ?  "''-1''" : inDays) + "'";
		   // var annoParam = "anno_p:" + (inYears == "" ? "0" : inYears);
			var giornoParam = "dow_p:" + (inDays == "" ? "0" : inDays);
			var tipoIncParam = "tpinc_p:" + (inTypes == "" ? "0" : inTypes);
			
			 var startDate = Ext.getCmp("daDataBox").getValue();
			 var endDate = Ext.getCmp("aDataBox").getValue();
			 
			 
			 if ((! startDate) || (!endDate)) {
					Ext.Msg.show({
						  title: 'Errore',
						  msg: 'Date non valide',
						  width: 300,
						  icon: Ext.MessageBox.WARNING
					});
					return;
			   }
			   
			   if (startDate > endDate) {
					Ext.Msg.show({
						  title: 'Errore',
						  msg: 'Data fine inferiore alla data inizio',
						  width: 300,
						  icon: Ext.MessageBox.WARNING
					});
					return;
			   }
			 
			
			/*if (!via) {
				via = 0;
			}*/
			
			var dateParam = "fromdate_p:" + startDate.format('Y-m-d') + ';' + "todate_p:" + endDate.format('Y-m-d');
			
			var params = {
			   "viewparams": dateParam + ';' + giornoParam + ';' + tipoIncParam
			   //"cql_filter": "CATE_ROOT_CODE IN (" + inServices + ")"
                //"cql_filter": inServices == "" ? "INCLUDE" : inServices
				//"cql_filter": sCqlFilter
		    };
		   
		   
		   infortuniLayer.mergeNewParams(params);
		   
		   var index = apptarget.mapPanel.layers.findExact('name', 'Cartografia:view_str_inc');
		   apptarget.mapPanel.layers.getAt(index).getLayer().vendorParams = params;
		   apptarget.mapPanel.layers.getAt(index).getLayer().mergeNewParams(params);		  
		   
		   // /////////////////////////////////////////////////////////////////////////////
		   // We need to deactivate and then reactivate the info-hover control if active 
		   // in order to refresh the vendorParams
		   // /////////////////////////////////////////////////////////////////////////////
		    for(var tool in apptarget.tools){
				if(apptarget.tools[tool].ptype == "gxp_wmsgetfeatureinfo_menu"){
					apptarget.tools[tool].button.menu.items.each(function(i) {
						if(i.id == "info-hover" && i.checked){
							//apptarget.tools[tool].toggleActiveControl();
							i.setChecked(false);
							i.setChecked(true);
						}
					}, this);
					
					break;
				}
			}   
			
			aggiornaInfortuni(me.infortuniLayerName);						
			aggiornaInfortuni(me.infortuniLayerCopyName);	
		}
		
		
		function aggiornaInfortuni(layerName, layer) {
	
			
		   var infortuniLayer;
		   if (!layer) {
		   	   infortuniLayer = apptarget.mapPanel.map.getLayersByName(layerName)[0];
		   } else {
			   infortuniLayer = layer;
		   }
		   
		  
		  // var selectedYears = Ext.getCmp("annoCheck").getValue();
		   var inYears = "";           
           /* for(var i=0; i<selectedYears.length; i++){
                var inYear = "ANNOINC=" + selectedYears[i].inputValue + "";
                inYears += inYear;
                
                if(i+1 < selectedYears.length){
                    inYears += " OR ";
                }         
            }*/
			
			var selectedDays = Ext.getCmp("gSettCheck").getValue();
		    var inDays = "";           
            for(var i=0; i<selectedDays.length; i++){
                var inDay = "DOW='" + selectedDays[i].inputValue + "'";
                inDays += inDay;
                
                if(i+1 < selectedDays.length){
                    inDays += " OR ";
                }         
            }
			
			var selectedTypes = Ext.getCmp("tpIncCheck").getValue();
		    var inTypes = "";           
            for(var i=0; i<selectedTypes.length; i++){
                var inType = "TPINCID='" + selectedTypes[i].inputValue + "'";
                inTypes += inType;
                
                if(i+1 < selectedTypes.length){
                    inTypes += " OR ";
                }         
            }
			
			
			var startDate = Ext.getCmp("daDataBox").getValue();
			var endDate = Ext.getCmp("aDataBox").getValue();
			
			inYears = "DTINCID <= '"+ endDate.format('Y-m-d') + "' AND DTINCID >= '" + startDate.format('Y-m-d') + "'"
			
			var sCqlFilter = "(" + (inYears == "" ? "ANNOINC=0" : inYears) + ") AND (" + (inTypes == "" ? "TPINCID='0'" : inTypes) + ") AND (" + (inDays == "" ? "DOW='-1'" : inDays) + ")";
           // var sParam = "gionrnos_p:'" + (inDays == "" ?  "''-1''" : inDays) + "'";
			
			/*if (!via) {
				via = 0;
			}*/
			
			var params = {
			   //"viewparams": sParam,
			   //"cql_filter": "CATE_ROOT_CODE IN (" + inServices + ")"
                //"cql_filter": inServices == "" ? "INCLUDE" : inServices
				"cql_filter": sCqlFilter
		    };
		   
		   
		   infortuniLayer.mergeNewParams(params);
		   
		   var index = apptarget.mapPanel.layers.findExact('name', me.infortuniLayerWs + ':' + layerName);
		   apptarget.mapPanel.layers.getAt(index).getLayer().vendorParams = params;
		   apptarget.mapPanel.layers.getAt(index).getLayer().mergeNewParams(params);		  
		   
		   // /////////////////////////////////////////////////////////////////////////////
		   // We need to deactivate and then reactivate the info-hover control if active 
		   // in order to refresh the vendorParams
		   // /////////////////////////////////////////////////////////////////////////////
		    for(var tool in apptarget.tools){
				if(apptarget.tools[tool].ptype == "gxp_wmsgetfeatureinfo_menu"){
					apptarget.tools[tool].button.menu.items.each(function(i) {
						if(i.id == "info-hover" && i.checked){
							//apptarget.tools[tool].toggleActiveControl();
							i.setChecked(false);
							i.setChecked(true);
						}
					}, this);
					
					break;
				}
			}   
		}
		
		function zoomVia(url, selectionLayerName, filterAttribute, selectionStyle, comProjection, googleProjection) {
			if (url != '') {
								
					var mask = new Ext.LoadMask(Ext.getBody(), {msg: me.waitMsg});
					mask.show();
				
					Ext.Ajax.request({
						url: url,
						scope: me,
						success: function(response, opts) {
							mask.hide();
							var obj = Ext.decode(response.responseText);
							var bounds = obj.bounds;
							
							
							var comBounds = new OpenLayers.Bounds(bounds.x1, bounds.y1, bounds.x2, bounds.y2);
							var newBounds = comBounds.transform(comProjection, googleProjection);
						
							
							//
							// Add the WMS layer
							//
							var addLayer = apptarget.tools["addlayer"];
							if(selectionLayerName && me.selectionProperties && 
								filterAttribute && selectionStyle && addLayer){
							
								var layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								if(!layer){
									var customParams = {
										cql_filter: filterAttribute + "=" + bounds.codice,
										styles: selectionStyle,
										displayInLayerSwitcher: false,
										enableLang: false
									};
									
									var opts = {
										msLayerTitle: me.selectionProperties.selectionLayerTitle,
										msLayerName: selectionLayerName,
										wmsURL: me.selectionProperties.wmsURL,
										customParams: customParams
									};
									
									addLayer.addLayer(opts);																					
									
									layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								}//else{   Nota: a seguito di alcune modifiche, bisogna riassegnare il cql_filter
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
								  title: me.titleError,
								  msg: response.responseText + " - " + response.status,
								  width: 300,
								  icon: Ext.MessageBox.WARNING
							});
							
							console.log('server-side failure with status code ' + response.status);
						}
					});
				}
		}
		
		function zoomQuartiere(url, selectionLayerName, filterAttribute, selectionStyle, quartiere, qBounds) {
			if (url != '') {
								
					var mask = new Ext.LoadMask(Ext.getBody(), {msg: me.waitMsg});
					mask.show();
				
					
					var addLayer = apptarget.tools["addlayer"];
							if(selectionLayerName && me.selectionProperties && 
								filterAttribute && selectionStyle && addLayer){
							
																
								var newBounds = qBounds;
								
								var layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								if(!layer){
									var customParams = {
										cql_filter: filterAttribute + "=" + quartiere,
										styles: selectionStyle,
										displayInLayerSwitcher: false,
										enableLang: false
									};
									
									var opts = {
										msLayerTitle: me.selectionProperties.selectionLayerTitle,
										msLayerName: selectionLayerName,
										wmsURL: me.selectionProperties.wmsURL,
										customParams: customParams
									};
									
									addLayer.addLayer(opts);																					
									
									layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								}//else{   Nota: a seguito di alcune modifiche, bisogna riassegnare il cql_filter
								layer.mergeNewParams({
									"cql_filter": filterAttribute + "=" + quartiere,
									"layers": selectionLayerName,
									"styles": selectionStyle
								});
								//}
								
							}
					mask.hide();
					
					if (newBounds) {
						apptarget.mapPanel.map.zoomToExtent(newBounds);
					}
				}
		}
		
		function zoomServizio(url, selectionLayerName, filterAttribute, selectionStyle, servizio, comProjection, googleProjection) {
			if (url != '') {
								
					var mask = new Ext.LoadMask(Ext.getBody(), {msg: me.waitMsg});
					mask.show();
				
					Ext.Ajax.request({
						url: url,
						scope: me,
						success: function(response, opts) {
							mask.hide();
							var obj = Ext.decode(response.responseText);
							var bounds = obj.bounds;
							
							
							var comBounds = new OpenLayers.Bounds(bounds.x1, bounds.y1, bounds.x2, bounds.y2);
							var newBounds = comBounds.transform(comProjection, googleProjection);
						
							
							//
							// Add the WMS layer
							//
							var addLayer = apptarget.tools["addlayer"];
							if(selectionLayerName && me.selectionProperties && 
								filterAttribute && selectionStyle && addLayer){
							
								var layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								if(!layer){
									var customParams = {
										cql_filter: filterAttribute + "=" + bounds.codice,
										styles: selectionStyle,
										displayInLayerSwitcher: false,
										enableLang: false
									};
									
									var opts = {
										msLayerTitle: me.selectionProperties.selectionLayerTitle,
										msLayerName: selectionLayerName,
										wmsURL: me.selectionProperties.wmsURL,
										customParams: customParams
									};
									
									addLayer.addLayer(opts);																					
									
									layer = apptarget.mapPanel.map.getLayersByName(me.selectionProperties.selectionLayerTitle)[0];
								}//else{   Nota: a seguito di alcune modifiche, bisogna riassegnare il cql_filter
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
								  title: me.titleError,
								  msg: response.responseText + " - " + response.status,
								  width: 300,
								  icon: Ext.MessageBox.WARNING
							});
							
							console.log('server-side failure with status code ' + response.status);
						}
					});
				}
		}
		
		apptarget.mapPanel.map.events.register('preaddlayer', apptarget.mapPanel.map, function (e) {
		
			if (e.layer.params && e.layer.params.LAYERS ==  me.infortuniLayerWs + ':' + me.infortuniLayerName){
				aggiornaInfortuni(me.infortuniLayerName, e.layer);
			}
			if (e.layer.params && e.layer.params.LAYERS ==  me.infortuniLayerWs + ':' + me.infortuniLayerCopyName){
				aggiornaInfortuni(me.infortuniLayerCopyName, e.layer);
			}
		});				
		
		var panel = gxp.plugins.SearchInfortuniStrade.superclass.addOutput.call(this, serviziForm);
		
		// Imposto il tab di ricerca come tab attivo
		var container = Ext.getCmp(this.initialConfig.outputTarget);
		
		if(container instanceof Ext.TabPanel){
			container.setActiveTab(panel);
		}	
        
		return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchInfortuniStrade.prototype.ptype, gxp.plugins.SearchInfortuniStrade);