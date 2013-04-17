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
    
    dataUrl: null,
    
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
			id:'mio_pannello',
			border: false,
            layout: "fit",
            items:[{
                xtype:'form',
                //title: 'Select Range',
                layout: "form",
                autoScroll:true,
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
                            plugins: 'monthPickerPlugin'
                        },{
                            xtype: 'combo',
							forceSelected:true,
							allowBlank:false,
							autoLoad:true,                            
                            name:'decad',
                            ref:'decad',      
                            width: 100,
                            fieldLabel: "Decad",
                            anchor:'100%',
                            typeAhead: true,
                            triggerAction: 'all',
                            lazyRender:false,
                            mode: 'local',
                            store: new Ext.data.ArrayStore({
                                id: 0,
                                fields: [
                                    'myId',
                                    'displayText'
                                ],
                                data: [[01, 'First'], [02, 'Second'], [03, 'Third']]
                            }),
                            valueField: 'myId',
                            displayField: 'displayText'
                        }
                    ]}],	
                    buttons:[{
                        url: this.dataUrl,
                        text: "View NDVI",
                        //xtype: 'gxp_nrlCropDataButton',
                        ref: '../submitButton',
                        target:this.target,
                        form: this,
                        disabled:false,
                        scope: this,
                        handler: function(){
                            //2012-01-01T00:00:00.000Z,2012-01-02T00:00:00.000Z,2012-01-03T00:00:00.000Z,2012-02-01T00:00:00.000Z
                            var data1 = this.output[0].items.items[0].items.items[0].decad.value;
                            var data2 = this.output[0].items.items[0].items.items[0].sel_month_years.value.split('-');
                            var intero = parseInt(data2[0]);
                            var dateUTC = new Date(Date.UTC(data2[1],intero-1,data1));
                            var dateISOString = dateUTC.toISOString();
                            var layer = app.mapPanel.map.getLayersByName("NDVI-SPOT")[0];
                            layer.mergeNewParams({
                                time : dateISOString
                            });     
                            if(!layer.visiblity) {
                                layer.setVisibility(true);
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
    }  
});

Ext.preg(gxp.plugins.ndvi.NDVI.prototype.ptype, gxp.plugins.ndvi.NDVI);
