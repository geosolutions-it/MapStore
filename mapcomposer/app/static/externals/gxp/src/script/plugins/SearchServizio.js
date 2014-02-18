/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchServizio
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchServizio(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchServizio = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchservizio",
	
	serviceUrl: null,
	
	waitMsg: "Si prega di attendere ...",	
	titleError: "Errore",		
	serviziText: "Servizio",
	serviziLang: "it",
	
	serviziTitle: 'Servizio',
	cercaText: 'Cerca',
	serviziEmpty: 'Inserisci nome servizio',
	
	serviziToolTip: 'Digitare nome servizio',

	selectionProperties: null,
		
	constructor: function(config) {
        gxp.plugins.SearchServizio.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchServizio.superclass.init.apply(this, arguments);
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;
        
		var dsServizi = new Ext.data.Store({
			url: this.serviceUrl + 'ServiziServlet',			
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
		dsServizi.setBaseParam('lang', this.serviziLang);
				
				
		var me = this;
		
		
		
		var form = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: this.serviziTitle,
			labelWidth: 80,
			height: 300,			
			bodyStyle:'padding:5px 5px 0',  
			items: [
				{
					xtype: 'combo',
					fieldLabel: this.serviziText,
					labelStyle:'font-weight:bold;',
					store: dsServizi,
					mode: 'remote',
					displayField: 'descrizione',
					emptyText: this.serviziEmpty,
					valueField: 'codice', 
					layout: 'fit',
					minChars: 3,
					id: 'serviziBox',
					hideTrigger:true,
					forceSelection: false,
					scope: this,	
					listeners:{					    						
						render: function(c) {
						  Ext.QuickTips.register({
							target: c.getEl(),
							text: me.serviziToolTip
						  });
						}
					}
				},				
				{
					xtype: 'button',
					text: this.cercaText,
					scope: this,
					handler: function(){
						var url = '';
												
						var servizio = Ext.getCmp('serviziBox').getValue();
						
						var selectionLayerName;
						var filterAttribute;
						var selectionStyle;

						
						
						url = this.serviceUrl + 'BoundsServlet?tipo=servizio&codice=' + servizio;
						if(this.selectionProperties){
							selectionLayerName = this.selectionProperties.selectionLayerServizioName;
							filterAttribute = this.selectionProperties.filterServizioAttribute;
							selectionStyle = this.selectionProperties.selectionServizioStyle;
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
											
											
										}else{
											layer.mergeNewParams({
												"cql_filter": filterAttribute + "=" + bounds.codice,
												"layers": selectionLayerName,
												"styles": selectionStyle
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

		
        
		var panel = gxp.plugins.SearchServizio.superclass.addOutput.call(this, form);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchServizio.prototype.ptype, gxp.plugins.SearchServizio);