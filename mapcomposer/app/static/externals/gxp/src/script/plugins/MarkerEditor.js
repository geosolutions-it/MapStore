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
    markerName:'Markers',
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
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
	 
	 /**private Panel markerChooser
	  */
	 
	
    addOutput: function(config) {
		target =this.target;
		this.markerChooser = new Ext.Button({
			xtype: 'button',
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
							emptyText: 'No images to display',
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
					}],
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

        markerName= this.markerName;
		
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
                                this.markerChooser
								 ,{
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
								render: function(editor) {
									editor.getToolbar().insertButton(5, {
										iconCls: 'x-icon-addimage',
										handler: function(b,e) {
											Ext.Msg.prompt('Insert Image', 'Image URL', function(btn, txt) {
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
                    ref:'grid',
                    region:'center',
              
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
                                
                                }
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
                           
                            target.showMarkerGeoJSON(markerName,geoJson);
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
                            load: function(store){store.initIframe(store.getGeoJson());controlPanel.form.resetAll();}
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
                            },
                            
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
                    },{
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
                                    text:'Import GeoJson',
                                    iconCls:'icon-addserver',
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
                            
                        },scope:this
                    },'->',{
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
	
		this.output = gxp.plugins.MarkerEditor.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
		
		//hide selection layer on tab change
		
		return this.output;
		
	}
 });
 Ext.preg(gxp.plugins.MarkerEditor.prototype.ptype, gxp.plugins.MarkerEditor);