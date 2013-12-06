/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchCatasto
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchCatasto(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchCatasto = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchcatasto",
	
	serviceUrl: null,
	
	waitMsg: "Si prega di attendere ...",	
	titleError: "Errore",	
	
	catastoTitle: 'Particella Catastale',
	comCatTitle: 'CC',
	comCatEmpty: 'Selez. CC',
	comTipoTitle: 'Tipo',
	comTipoEmpty: 'Selez. tipo part.',
	particellaTitle: 'Particella',
	particellaEmpty: 'Inserisci codice part.',
	cercaText: 'Cerca',
	
	bzText: 'Bolzano',
	dvText: 'Dodiciville',
	griesText: 'Gries',
	
	pEdText: 'Particella Edificabile',
	pFondText: 'Particella Fondiaria',

	selectionProperties: null,
		
	constructor: function(config) {
        gxp.plugins.SearchCatasto.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchCatasto.superclass.init.apply(this, arguments);
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;
        		
		
		var dsCC = new Ext.data.ArrayStore({
			// store configs
			autoDestroy: true,
			storeId: 'ccStore',
			// reader configs
			idIndex: 1,  
			fields: [
			   'cc',
			   {name: 'codice', type: 'string'},
			   {name: 'descrizione', type: 'string'}
			],
			data: [
				['BZ', '613', this.bzText],
				['DV', '652', this.dvText],
				['GR', '669', this.griesText]
			]
		});
		
		
		var dsTipoPart = new Ext.data.ArrayStore({
			// store configs
			autoDestroy: true,
			storeId: 'tpStore',
			// reader configs
			idIndex: 1,  
			fields: [
			   'cc',
			   {name: 'codice', type: 'string'},
			   {name: 'descrizione', type: 'string'}
			],
			data: [
				['PE', 'partedif', this.pEdText],
				['PF', 'partfond', this.pFondText]				
			]
		});
		
		
		var dsParticelle = new Ext.data.Store({
			url: this.serviceUrl + 'ParticelleServlet',			
			reader: new Ext.data.JsonReader({
				root: 'particelle',
				totalProperty: 'totalCount',
				successProperty: 'success',
				fields: [
					{name: 'codice', type: 'string'},					
				]
			})
		});			
		dsParticelle.setBaseParam('comcat', '613');		
		dsParticelle.setBaseParam('tipo', 'partedif');
		
		var catastoForm = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: this.catastoTitle,
			labelWidth: 80,
			bodyStyle:'padding:5px 5px 0',  
			items: [
				{
					xtype: 'combo',
					fieldLabel: this.comCatTitle,
					labelStyle:'font-weight:bold;',
					store: dsCC,
					mode: 'local',	
					displayField: 'descrizione',
					valueField: 'codice', 
					value: '613',
					typeAhead: true,
					triggerAction: 'all',
					emptyText: this.comCatEmpty,
					width: 150,					
					id: 'ccBox',
					listeners:{
						select: function(combo, record, index) {
							dsParticelle.removeAll(false);
							var partCombo = Ext.getCmp("particellaBox"); 
							partCombo.clearValue();
							dsParticelle.setBaseParam('comcat', combo.getValue());
						}
					}
				},
				{
					xtype: 'combo',
					fieldLabel: this.comTipoTitle,
					labelStyle:'font-weight:bold;',
					 store: dsTipoPart,
					mode: 'local',	
					displayField: 'descrizione',
					valueField: 'codice', 
					value: 'partedif',
					typeAhead: true,
					triggerAction: 'all',
					emptyText: this.comTipoEmpty,
					width: 150,					
					id: 'tipoPartBox',
					listeners:{
						select: function(combo, record, index) {
							dsParticelle.removeAll(false);
							var partCombo = Ext.getCmp("particellaBox"); 
							partCombo.clearValue();
							dsParticelle.setBaseParam('tipo', combo.getValue());
						}
					}
				},
				{
					xtype: 'combo',
					fieldLabel: this.particellaTitle,
					emptyText: this.particellaEmpty,
					labelStyle:'font-weight:bold;',
					store: dsParticelle,
					mode: 'remote',
					displayField: 'codice',
					valueField: 'codice', 					
					width: 150,
					minChars: 1,
					id: 'particellaBox',
					hideTrigger:true,
					forceSelection: false
				},
				{
					xtype: 'button',
					text: this.cercaText,
					scope: this,
					handler: function(){
						var particella = Ext.getCmp('particellaBox').getValue();
						var comCat = Ext.getCmp('ccBox').getValue();
						var tipoPart = Ext.getCmp('tipoPartBox').getValue();
						
						
						if (particella && comCat && tipoPart) {
							var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
							mask.show();
							
							Ext.Ajax.request({
								url: this.serviceUrl + 'BoundsServlet?tipo=particella&codice=' + particella + '&comcat=' + comCat + '&tipopart=' + tipoPart,
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
									if(bounds && addLayer){
										var selectionLayerName = 'Cartografia:particelle';
										
										var layer = apptarget.mapPanel.map.getLayersByName(this.selectionProperties.selectionLayerTitle)[0];
										if(!layer){
											var customParams = {
												cql_filter: "NUM='" + particella +"' AND COM=" + comCat,
												styles: 'highlight_polygon',
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
										}else{
											layer.mergeNewParams({
												"cql_filter": "NUM='" + particella +"' AND COM=" + comCat,
												"layers": selectionLayerName,
												"styles": 'highlight_polygon'
											});
										}
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
		
        
		var panel = gxp.plugins.SearchCatasto.superclass.addOutput.call(this, catastoForm);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchCatasto.prototype.ptype, gxp.plugins.SearchCatasto);