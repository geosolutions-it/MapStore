/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchVia
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchVia(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchVia = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchvia",
	
	serviceUrl: null,
	
	waitMsg: "Si prega di attendere ...",	
	titleError: "Errore",		
	viaText: "Via",
	civicoText: "N. Civico",
	vieLang: "it",
	
	viaTitle: 'Via / N. civico',
	cercaText: 'Cerca',
	civicoEmpty: 'Inserisci civico',
	viaEmpty: 'Inserisci via',

	selectionProperties: null,
		
	constructor: function(config) {
        gxp.plugins.SearchVia.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchVia.superclass.init.apply(this, arguments);
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
				
		var form = new Ext.form.FormPanel({
			header: true,
			border: true,
			title: this.viaTitle,
			labelWidth: 80,
			height: 300,
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
					xtype: 'button',
					text: this.cercaText,
					scope: this,
					handler: function(){
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
        
		var panel = gxp.plugins.SearchVia.superclass.addOutput.call(this, form);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchVia.prototype.ptype, gxp.plugins.SearchVia);