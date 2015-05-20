/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 * @author Lorenzo Natali, Tobia Di Pisa
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = MarkerEditor
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: MarkerEditor(config)
 *
 *    Plugin for adding a MarkerEditor Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.MarkerEditor = Ext.extend(gxp.plugins.Tool, {

	/** api: ptype = gxp_marker_editor */
    ptype: "gxp_marker_editor",
	
    /** markerName */
    markerName: 'Markers',
	
	zoomToMarkersExtent: false,
	
    /** i18n */
    copyText:'Copy the text below and paste it in  the "Import Markers" window in a second time...',
    pasteText:'Paste the text in the text area and click on imoport.',
    addToTheMapText:'Add To the Map',
	updateText: 'Update',
    resetText:'Reset',
    removeText:'Remove',	
	compositeFieldTitle:  'Title',
	compositeFieldLabel: 'Label',	
	coordinatesText: 'Coordinates',
	contentText: 'Content',	
	gridColTitle: 'Title',
	gridColLabel: 'Label',
	gridColLat: 'Lat',
	gridColLon: 'Lon',
	gridColContent: 'Content',	
	exportBtn:  'Export Markers',
	importBtn: 'Import Markers',	
	removeAllBnt: 'Remove All',	
	markerChooserTitle:'Choose a marker',
	useThisMarkerText:'Use this Marker',
	selectMarkerText:'Select Marker',
	insertImageText:'Insert Image',
	imageUrlText:'Image URL',
	importGeoJsonText:'Import GeoJson',
	errorText:"Error",
	notWellFormedText:"The Text you added is not well formed. Please check it",	
	invalidURLText: "Enter a valid URL to endpoint (e.g. http://example.com/)",
	contactingServerText: "Contacting Server...",
	okButtonText: "OK",
	cancelButtonText: "Cancel",	
	urlMarkersTitle: "Load Markers from URL",    
	urlMarkersMsg: "The provided URL is not valid",	
	importTooltipButton: "Import Text",
	importTextButton: "Import Text",
	importURLTooltipButton: "Impora from URL",
	importURLTextButton: "Importa from URL",
	importURLWinTitle: "External Markers Link",
	
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
	 
	/**
	 * private Panel markerChooser
	 */
	 
	/** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function (target) {
        gxp.plugins.MarkerEditor.superclass.init.apply(this, arguments);
       	
		target.on({
			'ready' : function(){
				this.loadMarkers(false);
			},
		    'markersloadend' : function(){
				this.loadMarkers(false);
			},
			scope: this
		});
    },
	
	loadMarkers: function(loadInMap){
		if(this.target.markers){
			var store = this.panel ? this.panel.grid.getStore() : null;
			
			if(store){
				var geojsonstring = this.target.markers;
				
				try {
					var geojson = Ext.util.JSON.decode(geojsonstring);
					store.loadData(geojson, {loadInMap: loadInMap});									
				}catch(e){
					Ext.Msg.alert(this.errorText, this.notWellFormedText);
				}  
			}  				
		}
	},
	
    addOutput: function(config) {
		target = this.target;
		
		//var isEmbed = window != window.parent;
		if(/*isEmbed && */this.getAuth()){
			this.markerChooser = new Ext.Button({
				xtype: 'button',
				margins: {top:0, right:5, bottom:10, left:0},
				width:30,
				ref:'../markerChooser',
				tooltip:this.selectMarkerText,
				handler: function(){
					
					 var win = new Ext.Window({
						closeAction: 'hide',
						title:  this.markerChooserTitle,
						modal: true,
						layout: "fit",
						width: 360,
						height: 360,
						items: [{
							xtype:'panel',
							id:'images-view',
							frame:true,
							layout:'fit',
							items: new Ext.DataView({
								ref:'../markerDataView',
								store: this.markerConfigStore,
								tpl: new Ext.XTemplate(
									'<tpl for=".">',
										'<div class="thumb-wrap" id="{name}">',
										'<div class="thumb"><img src="{url}"></div>',
										'<span>{shortName}</span></div>',
									'</tpl>',
									'<div class="x-clear"></div>'
								),
								autoScroll:true,
								
								singleSelect: true,
								overClass:'x-view-over',
								itemSelector:'div.thumb-wrap',
								prepareData: function(data){							
									data.shortName = Ext.util.Format.ellipsis(data.name, 15);
									return data;
								},
								
								listeners: {
									selectionchange: {
										fn: function(dv,nodes){
											var l = nodes.length;
											dv.refOwner.useMarkerBtn.setDisabled(l<1);
										}
									}
								}
							})
						}],
						buttons:[{
							xtype:'button',
							iconCls:'icon-addlayers',
							text:this.useThisMarkerText,
							ref:'../useMarkerBtn',
							disabled:true,
							handler:function(btn){
								var selected = btn.refOwner.markerDataView.getSelectedRecords()[0];//single select
								var cfg = selected.get('icons');
								//save json in the hidden input field
								controlPanel.form.updateIcon(cfg);
								
								btn.refOwner.close();
							},
							scope:this
						}]
					});
					
					win.show();
				},
				scope:this,
				text:this.chooseMarkerText
			});
			
			//MARKER CONFIGURATION STORE
			this.markerConfigStore =new Ext.data.JsonStore({
				ref:'store',
				url: 'data/markerconfigurations.js',
				root: 'markers',
				autoLoad:'true',
				fields: [
					'name',
					'icons',
					{name:'url', mapping: 'icons.img.markerDefault'}
					
				],
				listeners:{
					scope:this,
					load:function(store,records,options){
						var cfg = records[0].get('icons');
						var img =cfg.img.markerDefault;
						controlPanel.form.defaultIcons=cfg;
						controlPanel.form.updateIcon(this.defaultIcons);
					}
				}
				
			});

			markerName = this.markerName;		
			
			var me = this;
			this.activeIndex = 0;
			var controlPanel = new Ext.Panel({
				collapsible:false,
				resizable:true,
				layout:'border',
				width:550,
				border:false,
				//renderTo:'form',            
				items:[
					{
						xtype:'form',
						border:false,
						labelAlign: 'top',
						ref:'form',
						region:'north',
						autoHeight:'true',
						//labelWidth: 75, // label settings here cascade unless overridden
						//url:'save-form.php',
						frame:true,
						//renderTo:'form',                    
						bodyStyle:'padding:5px 5px 0',                    
						defaults: {anchor: '97%',msgTarget:'side'},                   
						monitorValid :false,
						items: [
							{
								ref:'icons',
								xtype:'hidden',
								name: 'icons'
							},
							{
								xtype: 'compositefield',
								items:[
									this.markerChooser,
									{
										xtype:'textfield',
										fieldLabel: this.compositeFieldLabel,
										name:'label',
										allowBlank:true,
										maxLength:2,
										width:30
									},{
										flex:1,
										xtype:'textfield',
										fieldLabel: this.compositeFieldTitle,
										name: 'title',
										allowBlank:true
									}								
								]
							},{
									xtype:'gxp_coordinate_picker',
									map: this.target.mapPanel.map,
									toggleGroup:this.toggleGroup,
									ref:'coordinatePicker'                            
							},{
								xtype:'htmleditor',
								name:'html',
								allowBlank:false,
								fieldLabel: this.contentText,
								height:200,
								listeners: {
									scope:this,
									render: function(editor) {
										editor.getToolbar().insertButton(17, {
											iconCls: 'x-icon-addimage',
											scope:this,
											handler: function(b,e) {
												Ext.Msg.prompt(this.insertImageText, this.imageUrlText, function(btn, txt) {
													if (btn == 'ok') {
														editor.relayCmd('insertimage', txt);
													}
												});                                            
											}
										});
									}
								}
							}
						],                    
						buttons: [{
							ref:'../AddToMap',
							text: this.addToTheMapText,
							appearances:{
								update:{
									text:this.updateText,
									iconCls: 'icon-save'
								},add:{
									text:this.addToTheMapText,
									iconCls: 'gx-map-add'
								}
							},
							iconCls:'gx-map-add',
							disabled:false,
							setAppearance:function(app){
								this.setText(this.appearances[app].text);
								this.setIconClass(this.appearances[app].iconCls);							
							},
							handler: function(){
								var formPanel = this.refOwner
								var form = formPanel.getForm();
								if( !formPanel.coordinatePicker.isValid() ) return;
								var vals = form.getValues();
								var grid = this.refOwner.refOwner.grid;
								var store= grid.getStore();
								var sm = grid.getSelectionModel();
								var selected = sm.getSelected();
								var id =  Ext.id();
								if(selected){
									id = selected.id;
									store.remove(selected);
								}
								var record = new store.recordType({
									title:	vals.title,
									label:	vals.label,
									html:	vals.html,
									lat:	vals.lat,
									lon:	vals.lon,
									icons:  Ext.util.JSON.decode(vals.icons)
								},id);
								//var record = store.reader.readRecords([obj]);
								store.add(record);
								formPanel.resetAll();                            
							}
						},{
							text: this.resetText,
							ref:'../clear',
							iconCls:'icon-removelayers',
							handler:function(){
								this.refOwner.resetAll();						
							}
						}],
						listeners: {
							clientvalidation:function(el,valid){valid  ? el.AddToMap.enable():el.AddToMap.disable();} ,
							valid: function(el){el.form.AddToMap.enable();},
							scope: this
						},
						resetAll:function(){
							var form = this.getForm();
							var sm = controlPanel.grid.getSelectionModel();
							form.reset();
							this.coordinatePicker.resetPoint();
							sm.clearSelections();
							this.AddToMap.setAppearance("add");
							this.updateIcon();					
						},
						updateIcon:function(icons){
							if(!icons) icons = this.defaultIcons;
							this.markerChooser.setText('<img src="' + icons.img.markerDefault +'" style="width:15px;height:15px" />');
							this.icons.setValue(Ext.util.JSON.encode(icons));					
						}
					},            
					new Ext.grid.GridPanel({
						forceFit: true,
						border:false,
						ref: 'grid',
						id: "markerGrid",
						region: 'center',              
						store:new Ext.data.Store({
							mode:'local',
							autoload:true,
							getGeoJson: function(){
								//clearTimeout(timer);
								var records = this.getRange();
								var features=[];
								
								for(var i = 0;i<records.length;i++){                                
									var vals= records[i];
									var obj = {
										type: "Feature",
										geometry:{
											type:"Point", 
											coordinates:[vals.get('lon'),vals.get('lat')]
										},
										properties:{
											title:vals.get('title'),
											id:vals.get('id'),
											label:vals.get('label'),
											html:vals.get('html'),
											highlights: false,
											cluster: false,
											icons:vals.get('icons')
										}                                
									};
									
									features.push(obj);
								}
								
								var jsonObj = { type: "FeatureCollection", features: features}
								return  Ext.util.JSON.encode(jsonObj);
								
							},
							updateIframe:function(geoJson){
								//var iframe = ifp.iframe.getEl().dom;
								target.showMarkerGeoJSON(markerName, geoJson);
							},
							initIframe: function(geoJson){                           
								target.showMarkerGeoJSON(markerName, geoJson, me.zoomToMarkersExtent);
							},
							reader:new  Ext.data.JsonReader({root:'features'},[
									{name:'icons', mapping:'properties.icons'},
									{name:'title', mapping:'properties.title'},
									{name:'label', mapping:'properties.label'},
									{name:'html', mapping:'properties.html'},
									{name:'lat', mapping:'geometry.coordinates[1]'},
									{name:'feature',mapping:'data'},
									{name:'lon',mapping:'geometry.coordinates[0]'}
								]
							),
							listeners:{
								add: function(store){store.updateIframe(store.getGeoJson())},
								remove: function(store){store.updateIframe(store.getGeoJson())},
								clear: function(store){store.updateIframe(store.getGeoJson());controlPanel.form.resetAll();},
								load: function(store, records, options){
									if(options.add.loadInMap){
										store.initIframe(store.getGeoJson());
									}								
									controlPanel.form.resetAll();
								}
							}                        
						}),
						autoExpandColumn:'html',
						columns:[
							{	
								id:'marker',
								dataIndex:'icons',
								width:25,
								renderer: function(value,p,record){								
									return "<img style='height:15px;width:15px;' src=\""+value.img.markerDefault+"\"/>";							
								}
							},{
								id: 'label',
								width:50,
								dataIndex:'label',
								header: this.gridColLabel
								
							},{
								id: 'title',
								flex:1,
								dataIndex:'title',
								header: this.gridColTitle
								
							},{
								id: 'latitude',
								width:50,
								dataIndex:'lat',
								header: this.gridColLat
								
							},{
								id: 'longitude',
								width:50,
								dataIndex:'lon',
								header: this.gridColLon
								
							},{
								id: 'html',
								dataIndex:'html',
								header: this.gridColContent,
								renderer: function(value, p, record){								
										var xf = Ext.util.Format;
										return '<p>' + xf.ellipsis(xf.stripTags(value), 50) +   '</p>';
								}                            
							},
							{
								xtype: 'actioncolumn',
								width: 40,
								items: [{
										iconCls  : 'reset',  // Use a URL in the icon config
										
										tooltip: this.removeText,
										handler: function(grid, rowIndex, colIndex) {
											var sm = grid.getSelectionModel();
											var sel = sm.getSelected();
											var store= grid.getStore();
											var rec = store.getAt(rowIndex);
											if(sel){
												if(sel.id == rec.id){controlPanel.form.resetAll()}											
											}
											store.remove(rec);										
										}
								}]
							}
						],
						sm: new Ext.grid.RowSelectionModel({
							singleSelect: true,
							listeners: {
								rowselect: function(sm, row, rec) {
									var formPanel = controlPanel.form;
									formPanel.getForm().loadRecord(rec);
									//TODO: update hidden record of markerconfig
									formPanel.coordinatePicker.updatePoint();
									formPanel.AddToMap.setAppearance('update');
									formPanel.updateIcon(rec.get('icons'));
								},
								rowdeselect: function(sm,rowIndex,record){
									controlPanel.form.resetAll();
								},
								scope: this
							}
						}),                    
						bbar:[{
							xtype:'button',
							text: this.exportBtn,
							iconCls:'gx-map-go',
							ref:'../exportButton',
							handler:function(b){
								var store = b.refOwner.getStore();
								new Ext.Window({
									title:'GeoJson',
									layout:'fit',
									width:500,
									tbar:[{
										xtype: 'tbtext', 
										text:this.copyText
									}],
									items:[
									{
										height:400,
										region:'center',
										xtype:'textarea',
										value:store.getGeoJson()
									}]
								}).show();
							},scope:this
						},
						new Ext.SplitButton({
							id: "gxp_marker_editor_split_button",
							iconCls: "gx-map-edit",
							text: this.importBtn,
							//enableToggle: true,
							//toggleGroup: "test",
							//allowDepress: false,
							/*handler: function(button, event) {
								if(button.pressed) {
									button.menu.items.itemAt(this.activeIndex).setChecked(true);
								}
							},*/
							scope: this,
							menu: new Ext.menu.Menu({
								items: [
									new Ext.menu.CheckItem({
										tooltip: this.importTooltipButton,
										text: this.importTextButton,
										iconCls: "gx-map-edit",
										//toggleGroup: "test",
										group: "test",
										listeners: {
											click: function(item, checked) {
												this.activeIndex = 0;
												
												var button = Ext.getCmp("gxp_marker_editor_split_button");
												button.toggle(checked);
												
												if (checked) {
													button.setIconClass(item.iconCls);
													
													//
													// Magane manual import procedure
													//											
													var store = me.panel.grid.getStore()
													new Ext.Window({	
														title:'GeoJson',
														width:500,
														modal: true,
														layout:'fit',
														tbar:[{
															xtype: 'tbtext', 
															text:this.pasteText
														}],
														items:[
														{
															xtype:'textarea',
															ref:'geojsonTxT',
															height:400
														}],
														buttons:[{
															xtype:'button',
															text: this.importGeoJsonText,
															iconCls:'icon-addserver',
															ref:'../importButton',
															scope:this,
															handler:function(b){
																var geojsonstring = b.refOwner.geojsonTxT.getValue();
																try {
																	var geojson = Ext.util.JSON.decode(geojsonstring);
																	store.loadData(geojson, {loadInMap: true});
																	b.refOwner.close();											
																}catch(e){
																	Ext.Msg.alert(this.errorText, this.notWellFormedText);
																}                                        
															}
														}]
													}).show();	
												}											
											},
											scope: this
										}
									}),new Ext.menu.CheckItem({
										tooltip: this.importURLTooltipButton,
										text: this.importURLTextButton,
										iconCls: "gx-map-link",		
										//toggleGroup: "test",
										group: "test",
										//allowDepress: false,							
										listeners: {
											click: function(item, checked) {
												this.activeIndex = 1;
												var button = Ext.getCmp("gxp_marker_editor_split_button");
												button.toggle(checked);
												
												if (checked) {
													button.setIconClass(item.iconCls);
													
													var urlForm = new Ext.form.FormPanel({
														width: 300,
														items: [
															{
																hidden: false,
																width: 180,
																xtype: 'textfield',
																allowBlank: false,
																ref: "urlField",
																fieldLabel: "URL",
																flex: 1,
																validator: this.urlValidator.createDelegate(this)
															}
														]
													});
													
													urlForm.on("render", function() {
														this.loadMask = new Ext.LoadMask(urlForm.getEl(), {msg: this.contactingServerText});
													}, this);
													
													var urlWindow = new Ext.Window({
														title: this.importURLWinTitle,
														width: 315,
														modal: true,
														items: [
															urlForm
														],
														bbar: ["->", {
															text: this.okButtonText,
															iconCls: "save",
															scope: this,
															handler: function(){
																var urlField = urlForm.urlField;
																
																if(urlField.isDirty() && urlField.isValid()){
																	this.loadMask.show();
																	
																	var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
																	
																	var mUrl = urlField.getValue();
																	var mHost = pattern.exec(mUrl);

																	Ext.Ajax.request({
																	   url: mHost[2] == location.host ? mUrl : proxy + mUrl,
																	   method: 'GET',
																	   scope: this,
																	   headers:{
																		  'Accept': "application/json"
																	   },
																	   success: function(response, opts){  																		
																			this.target.markers = response.responseText;
																			
																			this.loadMarkers(true);
																			
																			this.loadMask.hide();
																			urlWindow.close();
																	   },
																	   failure: function(response, opts){
																		  Ext.Msg.show({
																				 title: this.urlMarkersTitle,
																				 msg: response.responseText,
																				 width: 300,
																				 icon: Ext.MessageBox.ERROR
																		  });
																		  
																		  this.loadMask.hide();
																	   }
																	}); 
																}else{
																	Ext.Msg.show({
																		 title: this.urlMarkersTitle,
																		 msg: this.urlMarkersMsg + ": " + this.invalidURLText,
																		 width: 300,
																		 icon: Ext.MessageBox.WARNING
																	});
																}
															}
														}, {	
															text: this.cancelButtonText,
															scope: this,
															iconCls: "cancel",
															handler: function(){
																urlWindow.close();
															}
														}]
													});
													
													urlWindow.show();												
												}
											},
											scope: this
										}
									})
								]
							})
						})/*{
							xtype:'button',
							iconCls:'gx-map-edit',
							text: this.importBtn,
							ref:'../importButton',
							handler:function(b){
								var store = b.refOwner.getStore();
								new Ext.Window({	
									title:'GeoJson',
									width:500,
									layout:'fit',
									tbar:[{
										xtype: 'tbtext', 
										text:this.pasteText
									}],
									items:[
									{
										xtype:'textarea',
										ref:'geojsonTxT',
										height:400
									}],
									buttons:[{
										xtype:'button',
										text:this.importGeoJsonText,
										iconCls:'icon-addserver',
										ref:'../importButton',
										scope:this,
										handler:function(b){
											var geojsonstring = b.refOwner.geojsonTxT.getValue();
											try {
												var geojson = Ext.util.JSON.decode(geojsonstring);
												store.loadData(geojson, {loadInMap: true});
												b.refOwner.close();											
											}catch(e){
												Ext.Msg.alert(this.errorText, this.notWellFormedText);
											}                                        
										}
									}]
								}).show();
								
							},scope:this
						}*/,'->',{
							xtype:'button',
							text: this.removeAllBnt,
							ref: '../clearButton',
							iconCls:'icon-removelayers',
							handler: function(b){
								b.refOwner.getStore().removeAll();
							}                    
						}]
					})]
					
			});
		
			this.panel = controlPanel;
			this.output = gxp.plugins.MarkerEditor.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
			
			//hide selection layer on tab change
			
			return this.output;
		}else{
			var plugin = this;
			var container = Ext.getCmp(plugin.initialConfig.outputTarget);
			container.hide();
		}				
	},
    
	/** api: method[getState]
     *  :returns {Object} - CSW catalogs added by the user
     *  
     */    
    getState: function(state) {
        var newState = state;
		
		var store = this.panel ? this.panel.grid.getStore() : null;
		
		if(store){
			var markers = store.getGeoJson();		
			newState.markers = markers
		}
        
        return newState;
    },
	
    /** private: property[urlRegExp]
     *  `RegExp`
     *
     *  We want to allow protocol or scheme relative URL  
     *  (e.g. //example.com/).  We also want to allow username and 
     *  password in the URL (e.g. http://user:pass@example.com/).
     *  We also want to support virtual host names without a top
     *  level domain (e.g. http://localhost:9080/).  It also makes sense
     *  to limit scheme to http and https.
     *  The Ext "url" vtype does not support any of this.
     *  This doesn't have to be completely strict.  It is meant to help
     *  the user avoid typos.
     */
    urlRegExp: /^(http(s)?:)?\/\/([\w%]+:[\w%]+@)?([^@\/:]+)(:\d+)?\//i,
    
    /** private: method[urlValidator]
     *  :arg url: `String`
     *  :returns: `Boolean` The url looks valid.
     *  
     *  This method checks to see that a user entered URL looks valid.  It also
     *  does form validation based on the `error` property set when a response
     *  is parsed.
     */
    urlValidator: function(url) {
        var valid;
		
        if (!this.urlRegExp.test(url)) {
            valid = this.invalidURLText;
        } else {
            valid = true;
        }

        return valid;
    }
	
 });
 
 Ext.preg(gxp.plugins.MarkerEditor.prototype.ptype, gxp.plugins.MarkerEditor);