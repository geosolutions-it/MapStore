/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchServizioApertura
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchServizioApertura(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchServizioApertura = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchservizioapertura",
	
	serviceUrl: null,
		
		
	constructor: function(config) {
        gxp.plugins.SearchServizioApertura.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchServizioApertura.superclass.init.apply(this, arguments);
		
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
	
		var formPanel =  {
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
			};
	
		
		var serviziForm = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: 'Ricerca Apertura Servizi',
			labelWidth: 80,
			bodyStyle:'padding:5px 5px 0',  
			items: [
				formPanel,
			    {
				xtype: 'checkboxgroup',
				fieldLabel: 'Tipo Servizi',
				// Arrange checkboxes into two columns, distributed vertically
				columns: 1,
				vertical: true,
				id: 'serviziCheck',
				labelStyle:'font-weight:bold;',					
				items: [{
					boxLabel: 'Amministrativo',
					name: 'rbAmm',
					inputValue: '01',
					checked: true
				}, {
					boxLabel: 'Chiese',
					name: 'rbAmm',
					inputValue: '04',
					checked: true
				}, {
					boxLabel: 'Commercio',
					name: 'rbAmm',
					inputValue: '10',
					checked: true
				}, {
					boxLabel: 'Cultura',
					name: 'rbAmm',
					inputValue: '05',
					checked: true
				}, {
					boxLabel: 'Finanziari',
					name: 'rbAmm',
					inputValue: '11',
					checked: true
				}, {
					boxLabel: 'Giustizia',
					name: 'rbAmm',
					inputValue: '02',
					checked: true
				}, {
					boxLabel: 'Informazione',
					name: 'rbAmm',
					inputValue: '13',
					checked: true
				}, {
					boxLabel: 'Istruzione',
					name: 'rbAmm',
					inputValue: '06',
					checked: true
				}, {
					boxLabel: 'Libera Prof.',
					name: 'rbAmm',
					inputValue: '12',
					checked: true
				}, {
					boxLabel: 'Sanita',
					name: 'rbAmm',
					inputValue: '07',
					checked: true
				}, {
					boxLabel: 'Sicurezza',
					name: 'rbAmm',
					inputValue: '03',
					checked: true
				}, {
					boxLabel: 'Sociali',
					name: 'rbAmm',
					inputValue: '14',
					checked: true
				}, {
					boxLabel: 'Sport',
					name: 'rbAmm',
					inputValue: '09',
					checked: true
				}]
				},				
				lineconfig,
				
				{
					xtype: 'timefield',
					fieldLabel: 'Da',
					labelStyle:'font-weight:bold;',					
					emptyText: 'Orario Da',
					minValue: '7:00',
     				maxValue: '22:00',
					format: 'H:i',
					increment: 30,
					width: 150,
					id: 'daBox',
					scope: this					
				},
				{
					xtype: 'timefield',
					fieldLabel: 'A',
					labelStyle:'font-weight:bold;',					
					emptyText: 'Orario A',
					minValue: '7:00',
     				maxValue: '22:00',
					format: 'H:i',
					increment: 30,
					width: 150,
					id: 'aBox',
					scope: this	
				}, 			
				{
					xtype: 'datefield',
					anchor: '100%',
					fieldLabel: 'Data',
					labelStyle:'font-weight:bold;',					
					name: 'date',
					id: 'searchDate',
					format: 'd/m/Y'
				},				
				{
					xtype: 'button',
					text: 'Aggiorna',
					scope: this,
					handler: function(){	
					   
					   
					   aggiornaServizi();
					   
					   /*serviziLayer.mergeNewParams({
					       "viewparams": "begin_datetime:2014-11-03 20:00:00;end_datetime:2014-11-03 22:30:00"
					   });*/
					   //viewparams = 'begin_datetime:' + aDate.format('Y-m-d') + ' ' + startTime + ':00;end_datetime:' + aDate.format('Y-m-d') + ' ' + endTime + ':00';
					}
				}
            ]
		});
		
		
		var actualDate = new Date();
		Ext.getCmp("searchDate").setValue(actualDate);
		
		if (actualDate.getHours() <= 12)
		{
			Ext.getCmp("daBox").setValue('8:30');
			Ext.getCmp("aBox").setValue('12:30');
		}
		else 
		{
			Ext.getCmp("daBox").setValue('14:30');
			Ext.getCmp("aBox").setValue('18:00');
		}
		
		function aggiornaServizi(layer) {
		   var startTime = Ext.getCmp("daBox").getValue();
		   var endTime = Ext.getCmp("aBox").getValue();
		   var aDate = Ext.getCmp("searchDate").getValue();
		   var serviziLayer;
		   
		   if (!layer) {
		   	   serviziLayer = apptarget.mapPanel.map.getLayersByName('servizi_apertura')[0];
		   } else {
			   serviziLayer = layer;
		   }
		   
		  
		   var selectedServices = Ext.getCmp("serviziCheck").getValue();
		   var inServices = "";
			for(var i=0;i<selectedServices.length;i++){
				inServices = inServices + "'" + selectedServices[i].inputValue + "'";
				if (i < (selectedServices.length - 1))
				{
					inServices = inServices + ',';
				}
			}
			
			var params = {
			   "viewparams": "begin_datetime:" + aDate.format("Y-m-d") + " " + startTime + ":00;end_datetime:" + aDate.format("Y-m-d") + " " + endTime + ":00",
			   "cql_filter": "CATE_ROOT_CODE IN (" + inServices + ")"
		   };
		   
		   
		   serviziLayer.mergeNewParams(params);
		   
		   var index = apptarget.mapPanel.layers.findExact('name', 'Cartografia:servizi_apertura');
		   apptarget.mapPanel.layers.getAt(index).getLayer().vendorParams = params;
		   apptarget.mapPanel.layers.getAt(index).getLayer().mergeNewParams(params);		  
		   
		}
		
		apptarget.mapPanel.map.events.register('preaddlayer', apptarget.mapPanel.map, function (e) {
		
			if (e.layer.params && e.layer.params.LAYERS ==  'Cartografia:servizi_apertura'){
				aggiornaServizi(e.layer);
			}
		});
		
        
		// Imposto il tab di ricerca come tab attivo
		Ext.getCmp("west").setActiveTab(2);				
		
		var panel = gxp.plugins.SearchServizioApertura.superclass.addOutput.call(this, serviziForm);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchServizioApertura.prototype.ptype, gxp.plugins.SearchServizioApertura);