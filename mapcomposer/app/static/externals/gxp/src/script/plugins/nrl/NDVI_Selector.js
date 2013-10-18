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
        //Old IE versions workaround
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
        //get available data 
        this.target.on('ready',this.loadDimensions,this);

       
        
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
                                
                                scope:this,
                                select:function(selector,date){
                                    //get Allowed values
                                    var submitButton =selector.refOwner.refOwner.submitButton;
                                    var y = this.values[date.format('Y')];
                                    if(!y){
                                        submitButton.disable();
                                        return;
                                    }
                                    var deks =y[date.format('m')];
                                    if(!deks){
                                         submitButton.disable();
                                        return;
                                    }
                                     var decadCombo = selector.refOwner.decad;
                                     var decStore = decadCombo.getStore();
                                     decadCombo.filterByDekad(deks);
                                        
                                    
                                    var count =decStore.getCount();
                                    if(count>0){
                                        decadCombo.setValue(decStore.getAt(0).get(decadCombo.valueField));
                                        submitButton.enable();
                                    }else{
                                        submitButton.disable();
                                    }
                                    
                                }
                            }
                        },{
                            xtype: 'combo',
                            triggerAction:'all',
                            forceSelection:true,
							forceSelected:true,
                            disableKeyFilter: true,
                            editable: false,
							allowBlank:false,
							autoLoad:true,                            
                            name:'decad',
                            ref:'decad',      
                            width: 100,
                            fieldLabel: "Dekad",
                            anchor:'100%',
                            typeAhead: true,
                            lazyRender:false,
                            mode: 'local',
                            value:5,
                            filterByDekad:function(deks){
                                this.getStore().clearFilter();
                                this.getStore().filterBy(function(_rc,id){
                                    //look for 5 15 25 
                                    for(var i = 0;i<deks.length;i++){
                                        if( parseInt(deks[i])*10+5 == id){
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            },
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
                            
                            
                            if(me.sourceObj){
                                
                                var record = me.sourceObj.createLayerRecord(props);   
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
        this.form = ndvi_Modules.form;
        return ndvi_Modules;
    },
    /**
     * create a structure to mantain available dekads in this.values
     * this.values:{
     *      2013:{
     *          11:[0] // first dekad available for Nov 2013
     *          12:[0,1] // first and second dekad available for Dec 2013
     *      }
     *  }
     * then updates the fildset
     */
    loadDimensions:function(){
        if(this.source){
            this.sourceObj = this.target.layerSources[this.source];
            }else if(this.dataUrl){
                this.sourceObj = this.searchSource();
            }
             var props ={
                name: this.layer,
                title: this.name,
                layers: this.layer,
                //layerBaseParams:{time : dateISOString},
                tiled:true,
                format:this.format
            };
            var dummyRec = this.sourceObj.createLayerRecord(props);
            if(!dummyRec){
                this.disableAll();
                return;
            }
            var dim = dummyRec.get("dimensions");
            if(!dim.time){
                this.disableAll();
                return;
            }
            // : "2013-01-01T00:00:00.000Z/2013-01-10T00:00:00.000Z/PT1S"
            var values = dim.time.values;
            //To store them we take the first 9 chars "2013-01-0" "2013-01-1" "2013-01-2"
            //this should identify the first(0) second(1) third(2) dekads availability
            if(values.length==0){
                this.diableAll();
                return;
            }
            this.values= {};
            var max="0";min = "9999";
            for(var i=0;i<values.length;i++){
                var year = values[i].substring(0,4);
                var month = values[i].substring(5,7);
                var dek = values[i][8];
                var dateString = values[i].substring(0,10);
                if(!this.values[year]){
                    this.values[year]={};
                }
                 if(!this.values[year][month]){
                    this.values[year][month]=[];
                }
                //add the dekad to the available list
                this.values[year][month].push(dek);
                //set max and min years
                max = dateString >max ?dateString:max;
                min = dateString <min ?dateString:min;
            }
            //only one granule published
            if(max == min) {
               var value = Date.parseDate(max, "Y-m-d");
               this.form.range.sel_month_years.setValue(value);
               this.form.range.sel_month_years.setReadOnly(true);
               this.form.range.decad.filterByDekad(this.values[year][month]);
               return;
            }
            //if we have more than one granule available we set proper disabled
            //dates
            this.form.range.sel_month_years.setMaxValue(new Date(max));
            this.form.range.sel_month_years.setMinValue(new Date(min));
        
    },
    disableAll: function(){
        this.form.range.sel_month_years.setDisabled(true);
        this.form.range.decad.setDisabled(true);
        this.values={};
        return;
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
