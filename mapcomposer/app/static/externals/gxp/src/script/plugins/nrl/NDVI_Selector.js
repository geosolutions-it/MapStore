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
 * @author 
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins.ndvi
 *  class = NDVI
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.ndvi");

/** api: constructor
 *  .. class:: NDVI(config)
 *
 *    Plugin for adding NDVI modules to a :class:`gxp.Viewer`.
 */   
gxp.plugins.ndvi.NDVI = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_ndvi */
    ptype: "gxp_ndvi",
    layer: "nrl:NDVI-SPOT",
    layerName:"NDVI-SPOT",
    source: "nrl", //TODO use it
    format: "image/png8",
    replace:false,
    multipleMethod:'add',
    dataUrl: null,
    addNDVItext: "Add NDVI layer",
    monthShortNames : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {

        if ( !Date.prototype.toISOString ) {
             
            ( function() {
             
                function pad(number) {
                    var r = String(number);
                    if ( r.length === 1 ) {
                        r = '0' + r;
                    }
                    return r;
                }
          
                Date.prototype.toISOString = function() {
                    return this.getUTCFullYear()
                        + '-' + pad( this.getUTCMonth() + 1 )
                        + '-' + pad( this.getUTCDate() )
                        + 'T' + pad( this.getUTCHours() )
                        + ':' + pad( this.getUTCMinutes() )
                        + ':' + pad( this.getUTCSeconds() )
                        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                        + 'Z';
                };
           
            }() );
        }  
        
        var target = this.target, me = this;
		
        config = Ext.apply({
			xtype: 'panel',
			border: false,
            layout: "fit",
            items:[{
                xtype:'form',
                //title: 'Select Range',
                layout: "form",
                autoScroll:true,
                ref:"form",
                frame:true,
                items:[{            
                    xtype: 'fieldset',
                    ref:'range',     
                    //iconCls: 'user_edit',
                    anchor:'100%',
                    title: 'NDVI',
                         items:[
                        {
                            xtype: 'datefield',
                            name:'sel_month_years',
                            ref:'sel_month_years',                            
                            fieldLabel: "Select Date",
                            anchor:'100%',
                            format: 'm-Y', // or other format you'd like
                            plugins: 'monthPickerPlugin',
                            listeners:{
                                select:function(){
                                    this.refOwner.refOwner.submitButton.enable();
                                }
                            }
                        },{
                            xtype: 'combo',
							forceSelected:true,
							allowBlank:false,
							autoLoad:true,                            
                            name:'decad',
                            ref:'decad',      
                            width: 100,
                            fieldLabel: "Dekad",
                            anchor:'100%',
                            typeAhead: true,
                            triggerAction: 'all',
                            lazyRender:false,
                            mode: 'local',
                            value:5,
                            store: new Ext.data.ArrayStore({
                                id: 0,
                                fields: [
                                    'myId',
                                    'displayText'
                                ],
                                data: [[5, 'First'], [15, 'Second'], [25, 'Third']]
                            }),
                            valueField: 'myId',
                            displayField: 'displayText'
                        }
                    ]}],	
                    buttons:[{
                        url: me.dataUrl,
                        layer:me.layer,
                        text: me.addNDVItext,
                        //xtype: 'gxp_nrlCropDataButton',
                        ref: '../submitButton',
                        iconCls:"gxp-icon-ndvi",
                        target: me.target,
                        form: me,
                        layerName:me.layerName,
                        disabled:true,
                        handler: function(button, event){
                            //2012-01-01T00:00:00.000Z,2012-01-02T00:00:00.000Z,2012-01-03T00:00:00.000Z,2012-02-01T00:00:00.000Z
                            var day = button.refOwner.range.decad.value;
                            var date = button.refOwner.range.sel_month_years.value.split('-');
                            var monthNumber = parseInt(date[0]);
                            var year = date[1];
                            var dateUTC = new Date(Date.UTC(date[1],monthNumber-1,day));
                            var dateISOString = dateUTC.toISOString();
                            var dekName = "";
                            var dekad = (Math.floor(day / 10) + 1)
                            switch(dekad){
                                case 1: 
                                    dekName="1st";
                                    break;
                                case 2: 
                                    dekName="2nd";
                                    break;
                                case 3: 
                                    dekName="3rd";
                                    break;
                            }
                            var map= target.mapPanel.map;
                            //name of layer: <layerName> 2 
                            var name =this.layerName+" "+ year +" "+ me.monthShortNames[monthNumber-1] + " " +dekName + " dekad";
                            //this.layerObject = target.mapPanel.map.getLayersByName(this.layerName)[0];
                            
                            //create the properties
                            var props ={
                                        name: this.layer,
                                        title: name,
                                        layers: this.layer,
                                        layerBaseParams:{time : dateISOString},
                                        tiled:true,
                                        format:me.format
                                    }
                            var source
                            //find the source 
                            if(me.source){
                                source = this.target.layerSources[me.source];
                            }else if(me.dataUrl){
                                source = this.searchSource();
                            }
                            
                            if(source){
                                var record = source.createLayerRecord(props);   
                                if(record){
                                    var layerStore = this.target.mapPanel.layers;
                                    layerStore.add([record]);
                                }
                            // map.addLayer(this.layerObject);
                            }else{
                              //TODO add a wms layer
                            }
                            this.layerObject = record.get("layer");
                            if (this.layerObject){
                                this.layerObject.mergeNewParams({
                                    time : dateISOString
                                }); 
                                if(!this.layerObject.visiblity) {
                                    this.layerObject.setVisibility(true);
                                }
                            }
                            
                        }
                    }]
                }],			
			listeners:{
				afterrender: function(tabpanel){
					//set active tab after render
					target.on('ready',function(){
						if(tabpanel.startTab){
							tabpanel.setActiveTab(tabpanel.startTab);
						}else{
							tabpanel.setActiveTab(0);
						}
					});
				}
			}
			
        }, config || {});
        

        var ndvi_Modules = gxp.plugins.ndvi.NDVI.superclass.addOutput.call(this, config);
        
        return ndvi_Modules;
    },
    searchSource:function(){
        for (var id in this.target.layerSources) {
              var src = this.target.layerSources[id];    
              var url  = src.initialConfig.url; 
              
              // //////////////////////////////////////////
              // Checking if source URL aldready exists
              // //////////////////////////////////////////
              if(url && url.indexOf(this.dataUrl) != -1){
                  source = src;
                  break;
              }
        } 
    }
});

Ext.preg(gxp.plugins.ndvi.NDVI.prototype.ptype, gxp.plugins.ndvi.NDVI);
