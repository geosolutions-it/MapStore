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
 * @author Lorenzo Natali
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
    /** i18n */
    copyText:'Copy the text below and paste it in  the "Import Markers" window in a second time...',
    pasteText:'Paste the text in the text area and click on imoport.',
    addToTheMapText:'Add To the Map',
    resetText:'Reset',
    removeText:'Remove',
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		var controlPanel = {
            collapsible:false,
            resizable:true,
            layout:'border',
            width:550,
            border:false,
            //renderTo:'form',
            
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
                        },/*{
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
                        },*/{
                                xtype:'gxp_coordinate_picker',
                                map:this.target.mapPanel.map,
                                toggleGroup:this.toggleGroup
                            
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
                        text: this.addToTheMapText,
                        iconCls:'gx-map-add',
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
                        text: this.resetText,
                        ref:'../clear',
                        iconCls:'icon-removelayers',
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
                        /*
                        data:{
                            "type":"FeatureCollection",
                            "features":[
                                {	
                                    "type":"Feature",
                                    "geometry":{"type":"Point","coordinates":["12","43"]},
                                    "properties":{"title":"Sample Marker","label":"1","html":"<b>Sample Marker:</b><br>The map is inside an Iframe.<br>You can add and remove iframes from the map inside an Iframe using showMarkerGeoJSON method.<br><br><br><b>Use it inside your CMS</b><br>You can manage your site contents in your CMS and let MapStore do all the the work!<br><br>","highlights":false,"cluster":false}
                                }
                            ]},
                        */
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
                            //var iframe = ifp.iframe.getEl().dom;
                            app.showMarkerGeoJSON("Marker", geoJson);
                        },
                        initIframe: function(geoJson){
                            /*
                            geoJsonInjection = function(){
                                var iframe;
                                //TODO replace
                                
                                if(ifp){
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
                            
                            var timer = setInterval(geoJsonInjection, 100);  */
                            app.showMarkerGeoJSON("Marker",geoJson);
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
                                    
                                    tooltip: this.removeText,
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
                        text:'Import Markers',
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
                        text:'Remove All',
                        ref: '../clearButton',
                        iconCls:'icon-removelayers',
                        handler: function(b){
                            b.refOwner.getStore().removeAll();
                        }
                    
                    }]
                })]
                
        };
	
		this.output = gxp.plugins.MarkerEditor.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
		
		//hide selection layer on tab change
		
		return this.output;
		
	}
 });
 Ext.preg(gxp.plugins.MarkerEditor.prototype.ptype, gxp.plugins.MarkerEditor);