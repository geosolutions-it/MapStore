/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchInfortuni
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchInfortuni(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchInfortuni = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchinfortuni",
	
	serviceUrl: null,
	vieLang: "it",
	viaText: "Via",
	viaEmpty: 'Inserisci via',
	selectionProperties: null,
	infortuniLayerName: 'view_incidenti',
	infortuniLayerCopyName: 'view_incidenti_copy',
	infortuniLayerWs: 'Cartografia',
	
	viaToolTip: 'Per esempio per Via Roma digitare "Roma"',
	
	annoText: 'Anno',
	dowText: 'Giorno della settimana',
	typeText: 'Tipo di infortunio',
	lunediText: 'Lunedì',
	martediText: 'Martedì',
	mercolediText: 'Mercoledì',
	giovediText: 'Giovedì',
	venerdiText: 'Venerdì',
	sabatoText: 'Sabato',
	domenicaText: 'Domenica',
	filterText: 'Filtra Infortuni',
	noFeritiText: 'Senza Feriti',
	feritiText: 'Con Feriti',
	mortaleText: 'Mortale',	
		
	constructor: function(config) {
        gxp.plugins.SearchInfortuni.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchInfortuni.superclass.init.apply(this, arguments);
		
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;     		

		var me = this;
		
		var comProjection = new OpenLayers.Projection("EPSG:25832"); 
		var googleProjection = new OpenLayers.Projection("EPSG:900913");
		
	
		
		var serviziForm = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: me.filterText,
			labelWidth: 80,
			bodyStyle:'padding:5px 5px 0', 
				
			items: [
				//formPanel,
				{
					xtype: "fieldset",
					items:[{
						xtype: 'checkboxgroup',
						fieldLabel: me.annoText,
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						id: 'annoCheck',
						labelStyle:'font-weight:bold;',					
						items: [{
							boxLabel: '2013',
							name: 'rbAmm',
							inputValue: '2013',
							checked: false
						}, {
							boxLabel: '2014',
							name: 'rbAmm',
							inputValue: '2014',
							checked: false
						}, {
							boxLabel: '2015',
							name: 'rbAmm',
							inputValue: '2015',
							checked: true
						}],
						listeners: {
							change: function(field, newValue, oldValue, eOpts){
								aggiornaInfortuni(me.infortuniLayerName);						
								aggiornaInfortuni(me.infortuniLayerCopyName);	
							}
						}
					}]
				},				
				{
					xtype: "fieldset",
					items:[{
						xtype: 'checkboxgroup',
						fieldLabel: me.dowText,
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						id: 'gSettCheck',
						labelStyle:'font-weight:bold;',					
						items: [{
							boxLabel: me.lunediText,
							name: 'rbAmm',
							inputValue: '1',
							checked: true
						}, {
							boxLabel: me.martediText,
							name: 'rbAmm',
							inputValue: '2',
							checked: true
						}, {
							boxLabel: me.mercolediText,
							name: 'rbAmm',
							inputValue: '3',
							checked: true
						}, {
							boxLabel: me.giovediText,
							name: 'rbAmm',
							inputValue: '4',
							checked: true
						}, {
							boxLabel: me.venerdiText,
							name: 'rbAmm',
							inputValue: '5',
							checked: true
						}, {
							boxLabel: me.sabatoText,
							name: 'rbAmm',
							inputValue: '6',
							checked: true
						}, {
							boxLabel: me.domenicaText,
							name: 'rbAmm',
							inputValue: '7',
							checked: true
						}],
						listeners: {
							change: function(field, newValue, oldValue, eOpts){
								aggiornaInfortuni(me.infortuniLayerName);						
								aggiornaInfortuni(me.infortuniLayerCopyName);	
							}
						}
					}]
				},						
				{
					xtype: "fieldset",
					items:[{
						xtype: 'checkboxgroup',
						fieldLabel: me.typeText,
						// Arrange checkboxes into two columns, distributed vertically
						columns: 1,
						vertical: true,
						id: 'tpIncCheck',
						labelStyle:'font-weight:bold;',					
						items: [{
							boxLabel: me.noFeritiText,
							name: 'rbAmm',
							inputValue: '1',
							checked: true
						}, {
							boxLabel: me.feritiText,
							name: 'rbAmm',
							inputValue: '2',
							checked: true
						}, {
							boxLabel: me.mortaleText,
							name: 'rbAmm',
							inputValue: '3',
							checked: true
						}],
						listeners: {
							change: function(field, newValue, oldValue, eOpts){
								aggiornaInfortuni(me.infortuniLayerName);						
								aggiornaInfortuni(me.infortuniLayerCopyName);	
							}
						}
					}]
				}	
				/*{
					xtype: 'button',
					text: 'Aggiorna',
					scope: this,
					handler: function(){					   
					   aggiornaInfortuni(me.infortuniLayerName);						
					   aggiornaInfortuni(me.infortuniLayerCopyName);						
					}
				}*/
            ]
		});		
				
		
		function aggiornaInfortuni(layerName, layer) {
			
		   var infortuniLayer;
		   if (!layer) {
		   	   infortuniLayer = apptarget.mapPanel.map.getLayersByName(layerName)[0];
		   } else {
			   infortuniLayer = layer;
		   }
		   
		  
		   var selectedYears = Ext.getCmp("annoCheck").getValue();
		   var inYears = "";           
            for(var i=0; i<selectedYears.length; i++){
                var inYear = "ANNOINC=" + selectedYears[i].inputValue + "";
                inYears += inYear;
                
                if(i+1 < selectedYears.length){
                    inYears += " OR ";
                }         
            }
			
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
		
		var panel = gxp.plugins.SearchInfortuni.superclass.addOutput.call(this, serviziForm);
		
		// Imposto il tab di ricerca come tab attivo
		var container = Ext.getCmp(this.initialConfig.outputTarget);
		
		if(container instanceof Ext.TabPanel){
			container.setActiveTab(panel);
		}	
        
		return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchInfortuni.prototype.ptype, gxp.plugins.SearchInfortuni);