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
    monthShortNames : [[01,'Jan'],[02, 'Feb'],[03, 'Mar'],[04, 'Apr'],[05, 'May'],[06, 'Jun'],[07, 'Jul'],[08, 'Aug'],[09, 'Sep'],[10, 'Oct'],[11, 'Nov'],[12, 'Dec']],
    dekadsNames: [[5, 'First'], [15, 'Second'], [25, 'Third']],
    
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
                layout: "form",
                autoScroll:true,
                ref:"form",
                frame:true,
                items:[{            
                    xtype: 'fieldset',
                    ref:'range',     
                    anchor:'100%',
                    title: 'NDVI',
                        items:[{
                            xtype:'compositefield',
                            items:[{
                                xtype: 'combo',
                                triggerAction:'all',
                                forceSelection:true,
                                forceSelected:true,
                                disableKeyFilter: true,
                                editable: false,
                                allowBlank:false,
                                autoLoad:true,                            
                                name:'year',
                                ref:'../year',      
                                width: 55,
                                fieldLabel: "Year",
                                anchor:'100%',
                                typeAhead: false,
                                lazyRender:false,
                                mode: 'local',
                                valueField:'year',
                                displayField:'year',
                                setValue : function(v, fireSelect){
                                    var text = v;
                                    if(this.valueField){
                                        var r = this.findRecord(this.valueField, v);
                                        if(r){
                                            text = r.data[this.displayField];
                                            if (fireSelect) {
                                                this.fireEvent('select', this, r, this.store.indexOf(r));
                                            }
                                        }else if(Ext.isDefined(this.valueNotFoundText)){
                                            text = this.valueNotFoundText;
                                        }
                                    }
                                    this.lastSelectionText = text;
                                    if(this.hiddenField){
                                        this.hiddenField.value = v;
                                    }
                                    Ext.form.ComboBox.superclass.setValue.call(this, text);
                                    this.value = v;
                                    return this;
                                },
                                store: new Ext.data.ArrayStore({
                                    idIndex:0,
                                    fields: ['year'],
                                    data:[]    
                                }),
                                listeners:{
                                    scope:this,
                                    select:function(cmb,record,index){
                                        var monthStore = this.getMonthsForAYear(record.id);
                                        var monthSelector = cmb.refOwner.month;
                                        monthSelector.bindStore(monthStore);
                                        monthSelector.enable(true);
                                        var firstRecord = monthSelector.getStore().getAt(0);
                                        monthSelector.setValue(firstRecord.get(monthSelector.valueField),true);
                                    }
                                }
                            },{
                                xtype: 'combo',
                                disabled:true,
                                forceSelection:true,
                                disableKeyFilter: true,
                                editable: false,
                                allowBlank:false,
                                autoLoad:true,                            
                                name:'month',
                                ref:'../month',      
                                width: 50,
                                fieldLabel: "Month",
                                anchor:'100%',
                                typeAhead: true,
                                lazyRender:false,
                                mode: 'local',
                                valueField:'num',
                                displayField:'name',
                                value:1,
                                triggerAction: "all",
                                setValue : function(v, fireSelect){
                                    var text = v;
                                    if(this.valueField){
                                        var r = this.findRecord(this.valueField, v);
                                        if(r){
                                            text = r.data[this.displayField];
                                            if (fireSelect) {
                                                this.fireEvent('select', this, r, this.store.indexOf(r));
                                            }
                                        }else if(Ext.isDefined(this.valueNotFoundText)){
                                            text = this.valueNotFoundText;
                                        }
                                    }
                                    this.lastSelectionText = text;
                                    if(this.hiddenField){
                                        this.hiddenField.value = v;
                                    }
                                    Ext.form.ComboBox.superclass.setValue.call(this, text);
                                    this.value = v;
                                    return this;
                                },
                                store: new Ext.data.ArrayStore({
                                    idIndex:0,
                                    fields: ['num', 'name'],
                                    data : this.monthShortNames
                                }),
                                listeners:{
                                    scope:this,
                                    select:function(cmb,record,index){
                                        var decSelector = cmb.refOwner.decad;
                                        var year = parseInt(cmb.refOwner.year.getValue());
                                        var dekadsStore = this.getDekadsByYearMonth(year, record.id);
                                        decSelector.bindStore(dekadsStore);
                                        decSelector.enable(true);
                                        var firstRecord = decSelector.getStore().getAt(0);
                                        decSelector.setValue(firstRecord.get(decSelector.valueField),true);
                                    }
                                }
                            }]
                        },
                        {
                            xtype: 'combo',
                            forceSelection:true,
                            disabled:true,
							forceSelected:true,
                            disableKeyFilter: true,
                            editable: false,
							allowBlank:false,
							autoLoad:true,                            
                            name:'decad',
                            ref:'decad',      
                            width: 100,
                            fieldLabel: "Ten Day Period",
                            anchor:'100%',
                            typeAhead: true,
                            lazyRender:false,
                            mode: 'local',
                            valueField:'id',
                            value:5,
                            triggerAction: "all",
                            setValue : function(v, fireSelect){
                                var text = v;
                                if(this.valueField){
                                    var r = this.findRecord(this.valueField, v);
                                    if(r){
                                        text = r.data[this.displayField];
                                        if (fireSelect) {
                                            this.fireEvent('select', this, r, this.store.indexOf(r));
                                        }
                                    }else if(Ext.isDefined(this.valueNotFoundText)){
                                        text = this.valueNotFoundText;
                                    }
                                }
                                this.lastSelectionText = text;
                                if(this.hiddenField){
                                    this.hiddenField.value = v;
                                }
                                Ext.form.ComboBox.superclass.setValue.call(this, text);
                                this.value = v;
                                return this;
                            },
                            filterByDekad:function(deks){
                                this.getStore().clearFilter();
                                this.getStore().filterBy(function(_rc,id){
                                    //look for 5 15 25 
                                    for(var i = 0;i<deks.length;i++){
                                        if( parseInt(deks[i])*10+5 == id){
                                            //console.log(id + " dekad present");
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            },
                            listeners:{
                                select:function(){
                                    this.refOwner.refOwner.submitButton.enable();
                                }
                            },
                            store: new Ext.data.ArrayStore({
                                idIndex: 0,
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
                            var day = button.refOwner.range.decad.getValue();
                            var monthNumber = button.refOwner.range.month.getValue();
                            var year = button.refOwner.range.year.getValue();
                            
                           
                            var dateUTC = new Date(Date.UTC(year,monthNumber-1,day));
                            var dateISOString = dateUTC.toISOString();
                            var dekName = "";
                            var dekad = (Math.floor(day / 10) + 1);
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
                            var name =this.layerName+" "+ year +" "+ me.monthShortNames[monthNumber-1][1] + " " +dekName + " dekad";
                            //this.layerObject = target.mapPanel.map.getLayersByName(this.layerName)[0];
                            
                            //create the properties
                            var props ={
                                        name: this.layer,
                                        title: name,
                                        layers: this.layer,
                                        layerBaseParams:{time : dateISOString},
                                        tiled:true,
                                        format:me.format
                                };
                            
                            
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
                this.disableAll();
                return;
            }
            this.values= {};
            var max="0";min = "9999";
            for(var i=0;i<values.length;i++){
                var year = parseInt(values[i].substring(0,4));
                var monthStr = values[i].substring(5,7);
                // fix IE 8 problem when a number starts with 0
                if(monthStr.indexOf("0") == 0){
                    monthStr = monthStr.replace("0", "");
                }
                var month = parseInt(monthStr);
                var dek = parseInt(values[i].substring(8,9));
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
            //no year
            if(this.values=={}){
                this.disableAll();
                return;
            }
            //one date at least
            var range=this.form.range;
            var years=[];
            for(var key in this.values){
                years.push([key]);
            }
            range.year.getStore().loadData(years);

            // show all values, only for testing
            // for(var year in this.values){
            //     console.log("YEAR --> "+year);
            //     for (var month in this.values[year]){
            //         console.log(month + "=");
            //         console.log(this.values[year][month]);
            //     }
            // }
            //range.year.setValue(range.year.getStore().getAt(0).get(range.year.valueField),true);
            
            
        
    },
    disableAll: function(){
        var range = this.form.range;
        range.year.setDisabled(true);
        range.month.setDisabled(true);
        range.decad.setDisabled(true);
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
    },
    // obtain store with the months available for a year
    getMonthsForAYear: function(selectedYear){
        var availableMonths = this.values[selectedYear];
        var monthsData = [];
        for(var i = 0; i < this.monthShortNames.length; i++){
            var month = this.monthShortNames[i][0];
            var text = this.monthShortNames[i][1];
            if(!!availableMonths[parseInt(month)]){
                monthsData.push(this.monthShortNames[i]);
            }
        }
        return new Ext.data.ArrayStore({
            idIndex:0,
            fields: ['num', 'name'],
            data: monthsData
        });
    },
    // obtain store with the dekads for a month and a year
    getDekadsByYearMonth: function(selectedYear, selectedMonth){
        var availableDekads = this.values[selectedYear][selectedMonth];
        var dekadsData = [];
        for(var dekad in this.dekadsNames){
            if(parseInt(dekad) in availableDekads){
                dekadsData.push(this.dekadsNames[availableDekads[parseInt(dekad)]]);
            }
        }
        return new Ext.data.ArrayStore({
            idIndex: 0,
            fields: [
                'myId',
                'displayText'
            ],
            data: dekadsData
        });
    }
});

Ext.preg(gxp.plugins.ndvi.NDVI.prototype.ptype, gxp.plugins.ndvi.NDVI);
