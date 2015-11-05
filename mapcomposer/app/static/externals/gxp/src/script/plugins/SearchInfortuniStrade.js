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
		  
			
		   var infortuniLayer;
		   if (!layer) {
		   	   infortuniLayer = apptarget.mapPanel.map.getLayersByName('view_str_inc')[0];
		   } else {
			   infortuniLayer = layer;
		   }
		   			
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
			 

			var dateParam = "fromdate_p:" + startDate.format('Y-m-d') + ';' + "todate_p:" + endDate.format('Y-m-d');
			
			var params = {
			   "viewparams": dateParam + ';' + giornoParam + ';' + tipoIncParam
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
		   
		  

		   var inYears = "";           

			
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
			
			var params = {
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