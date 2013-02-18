/**
 *  Copyright (C) 2007 - 2013 GeoSolutions S.A.S.
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
 * @author Lorenzo Natali
 */
Ext.onReady(function(){
	var description = 
		'<a href="http://www.geo-solutions.it/" target="_blank"><div class="geosolutions_logo"></div></a>'+
		'The Map Below loaded in  an IFrame. Click on the marker to see the content in a popup <br/>'+
		'You can add and remove marker from it using the controls on the right.<br>'+
		'Export and import all the makers using the button "Export Markers" or "Import Marker(Simply copy and paste code)."<br>';
	var ItemDeleter = Ext.extend(Ext.grid.RowSelectionModel, {

		width: 30,
		iconCls:"icon-delete",
		sortable: false,
		dataIndex: 0, // this is needed, otherwise there will be an error
		
		menuDisabled: true,
		fixed: true,
		id: 'deleter',
		
		initEvents: function(){
			ItemDeleter.superclass.initEvents.call(this);
			this.grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
				if(columnIndex==grid.getColumnModel().getIndexById('deleter')) {
					var record = grid.getStore().getAt(rowIndex);
					grid.getStore().remove(record);
					grid.getView().refresh();
				}
			});
		},
		
		renderer: function(v, p, record, rowIndex){
			return '<div class="'+this.iconCls+'" style="width: 15px; height: 16px;"></div>';
		}
	});

	Ext.namespace('exemples.inclusion');
		
	
	
	exemples.inclusion.addMarker=function(geoJson){
		//clearTimeout(timer);
		
		var iframe = ifp.iframe.getEl().dom;	
		geoJson = Ext.util.JSON.encode(geoJson);
		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
		myMask.show();
		iframe.contentWindow.app.showMarkerGeoJSON("marker", geoJson);	
		
	};
	
	var itemdeleter = new ItemDeleter({
		iconCls:'reset'
	}
	);
	var controlPanel = new Ext.Panel({
		collapsible:true,
		resizable:true,
		layout:'border',
		title: 'Add Marker',
		width:550,
		border:false,
		//renderTo:'form',
		region:'east',
		items:[
			new Ext.FormPanel({
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
				defaultType: 'textfield',
				monitorValid :true,
				items: [
					{
						xtype: 'compositefield',
						items:[
							{
								flex:1,
								xtype:'textfield',
								fieldLabel: 'Title',
								name: 'title',
								allowBlank:false
							},{
								xtype:'textfield',
								fieldLabel:'Label',
								name:'label',
								allowBlank:false,
								maxLength:2,
								width:30
							}
						]
					},{
						xtype: 'compositefield',
						fieldLabel:'Coordinates',
						items:[
							{
								xtype     : 'numberfield',
								emptyText : 'Latitude',
								flex      : 1,
								allowBlank:false,
								name: 'lat'
							},{
								xtype     : 'numberfield',
								emptyText : 'Longitude',
								flex      : 1,
								allowBlank:false,
								name: 'lon'
							}
						]
					},{
						xtype:'htmleditor',
						name:'html',
						allowBlank:false,
						fieldLabel:'Content',
						height:200
					}
				],
				
				buttons: [{
					ref:'../AddToMap',
					text: 'Add To the Map',
					iconCls:'map_add',
					disabled:true,
					handler: function(){
						var form = this.refOwner.getForm();
						var vals = form.getValues();
						
						var store =this.refOwner.refOwner.grid.getStore();
						
						var record = new store.recordType({
							title:	vals.title,
							label:	vals.label,
							html:	vals.html,
							lat:	vals.lat,
							lon:	vals.lon
						},Ext.id());
						//var record = store.reader.readRecords([obj]);
						store.add(record);
						//exemples.inclusion.addMarker()
					}
				},{
					text: 'Reset',
					ref:'../clear',
					iconCls:'reset',
					handler:function(){
						this.refOwner.getForm().reset();
					}
				}],
				listeners: {
					clientvalidation:function(el,valid){valid  ? el.AddToMap.enable():el.AddToMap.disable();} ,
					valid: function(el){el.form.AddToMap.enable();},
					scope: this
				}
			}),
		
			new Ext.grid.GridPanel({
				forceFit: true,
				border:false,
				ref:'grid',
				region:'center',
				//renderTo:'grid',
				
				store:new Ext.data.Store({
					mode:'local',
					autoload:true,
					data:{
						"type":"FeatureCollection",
						"features":[
							{	
								"type":"Feature",
								"geometry":{"type":"Point","coordinates":["12","43"]},
								"properties":{"title":"Sample Marker","label":"1","html":"<b>Sample Marker:</b><br>The map is inside an Iframe.<br>You can add and remove iframes from the map inside an Iframe using showMarkerGeoJSON method.<br><br><br><b>Use it inside your CMS</b><br>You can simply manage your site contents in your CMS and let MapStore do all the the work!<br><br>","highlights":false,"cluster":false}
							}
						]},
					
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
									cluster: false
								}
							
							}
							features.push(obj);
						}
						
						var jsonObj = { type: "FeatureCollection", features: features}
						return  Ext.util.JSON.encode(jsonObj);
						
					},
					updateIframe:function(geoJson){
						var iframe = ifp.iframe.getEl().dom;
						iframe.contentWindow.app.showMarkerGeoJSON("Marker", geoJson);	
					},
					initIframe: function(geoJson){
						
						geoJsonInjection = function(){
							var iframe;
							if(ifp){
								var iframe = ifp.iframe.getEl().dom;
								
								var appMask = new Ext.LoadMask(ifp.getEl(), {msg:"Please Wait..."});
							}
							
							
							appMask.show();                                    
							if (iframe && iframe.contentWindow && iframe.contentWindow.app){
								if(iframe.contentWindow.app.mapPanel){
									if(iframe.contentWindow.app.mapPanel.map && iframe.contentWindow.app.mapPanel.map.getProjectionObject()){
										clearTimeout(timer);                                            
										iframe.contentWindow.app.showMarkerGeoJSON("Marker",geoJson);
										var controls = iframe.contentWindow.app.mapPanel.map.getControlsByClass('OpenLayers.Control.Navigation');
										for(var i = 0; i<controls.length; ++i){
											controls[i].disableZoomWheel();
										}                                                
										       
										appMask.hide();                                                  
									}                                        
								}
							}
						};
						
						var timer = setInterval(geoJsonInjection, 100);  
					},
					reader:new  Ext.data.JsonReader({root:'features'},[
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
						clear: function(store){store.updateIframe(store.getGeoJson())},
						load: function(store){store.initIframe(store.getGeoJson())}
					}
					
				}),
				autoExpandColumn:'html',
				columns:[
					{
						id: 'title',
						flex:1,
						dataIndex:'title',
						header:'Title'
						
					},{
						id: 'label',
						width:40,
						dataIndex:'label',
						header:'Label'
						
					},{
						id: 'latitude',
						width:30,
						dataIndex:'lat',
						header:'Lat'
						
					},{
						id: 'longitude',
						width:30,
						dataIndex:'lon',
						header:'Lon'
						
					},{
						id: 'html',
						dataIndex:'html',
						header:'HTML',
						renderer: function(value, p, record){
							return value.substring(0,100) + "...";
						},
						
					},
					{
						xtype: 'actioncolumn',
						width: 40,
						items: [{
								iconCls  : 'reset',  // Use a URL in the icon config
								
								tooltip: 'Remove',
								handler: function(grid, rowIndex, colIndex) {
									var store= grid.getStore();
									var rec = store.getAt(rowIndex);
									store.remove(rec);
								}
							}]
					}
				],
				sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true,
                    listeners: {
                        rowselect: function(sm, row, rec) {
                            controlPanel.form.getForm().loadRecord(rec);
                        }
                    }
                }),
				
				bbar:[{
					xtype:'button',
					text:'Export Markers',
					iconCls:'clone_map',
					ref:'../exportButton',
					handler:function(b){
						var store = b.refOwner.getStore();
						new Ext.Window({
							title:'GeoJson',
							layout:'fit',
							width:500,
							tbar:[{
								xtype: 'tbtext', 
								text:'Copy the text below and paste it in  the "Import Markers" window in a second time...'
							}],
							items:[
							{
								height:400,
								region:'center',
								xtype:'textarea',
								value:store.getGeoJson()
							}]
						}).show();
					}
				},{
					xtype:'button',
					text:'Import Markers',
					iconCls:'table_edit',
					ref:'../importButton',
					handler:function(b){
						var store = b.refOwner.getStore();
						new Ext.Window({	
							title:'GeoJson',
							width:500,
							layout:'fit',
							tbar:[{
								xtype: 'tbtext', 
								text:'Paste the text in the text area and click on imoport.'
							}],
							items:[
							{
								xtype:'textarea',
								ref:'geojsonTxT',
								height:400
							}],
							buttons:[{
								xtype:'button',
								text:'Import GeoJson',
								iconCls:'map_add',
								ref:'../importButton',
								handler:function(b){
									var geojsonstring = b.refOwner.geojsonTxT.getValue();
									try{
										var geojson = Ext.util.JSON.decode(geojsonstring);
										store.loadData(geojson);
										b.refOwner.close();
									}
									catch(e){Ext.Msg.alert("Error", "The Text you added is not well formed. Please check it");}								
									
								}
							}]
						}).show();
						
					}
				},'->',{
					xtype:'button',
					text:'Remove All',
					ref: '../clearButton',
					iconCls:'reset',
					handler: function(b){
						b.refOwner.getStore().removeAll();
					}
				
				}]
			})]
			
	});
			

	//exemples.inclusion.form.on('clientvalidation',function(el,valid){valid  ? el.AddToMap.enable():el.AddToMap.disable() ;}, this);
	//exemples.inclusion.form.on('valid', function(){exemples.inclusion.form.AddToMap.enable();}, this);
	if(!Ext.ux.IFrameComponent){
		Ext.ux.IFrameComponent = Ext.extend(Ext.BoxComponent, {
			 onRender : function(ct, position){
				  this.el = ct.createChild({
					tag: 'iframe',
					id: 'iframeid',
					frameBorder: 0, 
					src: this.url
				  });
			 }
		});
	}
	
	var ifp = new Ext.Panel({
		//renderTo:'viewer',
		layout:'border', 
		width: 650,
		height: 500,
		header: false,
		region:'center',
		
		items: [ {
			xtype:'panel',
			title: 'Iframe Embedding Sample',
			border:false,
			region:'north',
			bodyStyle:'padding:5px',
			autoScroll:true,
			html: description,
			collapsible:true,
			height:200
			},
			new Ext.ux.IFrameComponent({ 
				region:'center',
				ItemId: 'iframe',
				url: "../../mapcomposer/viewer?config=minimal" ,
				ref:'iframe'
		
			})
		]
	});
	new Ext.Viewport({
		layout:'border',
		items:[controlPanel,ifp]
	});
    
    
});