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

/** api: (define)
 *  module = MapStore.widgets.form
 *  class = DecadFieldSet
 */
Ext.ns("MapStore.widgets.form");

/** api: constructor
 *  .. class:: DecadFieldSet(config)
 *   
 *    Decad fieldset
 *
 * 	Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
MapStore.widgets.form.DecadFieldSet = Ext.extend(Ext.form.FieldSet,  {

    /** api: ptype = gxp_decadfieldset */
    ptype: "mapstore_decadfieldset",
    
    /** api: config[id]
     *  ``String``
     */
    id: "decadFieldSet",
	
	title: "NDVI",    
	
	anchor: "100%",
					
	layer: "nrl:NDVI-SPOT",
		
    replace: false,

    dataUrl: null,

    monthShortNames: [
		[01,'Jan'],
		[02, 'Feb'],
		[03, 'Mar'],
		[04, 'Apr'],
		[05, 'May'],
		[06, 'Jun'],
		[07, 'Jul'],
		[08, 'Aug'],
		[09, 'Sep'],
		[10, 'Oct'],
		[11, 'Nov'],
		[12, 'Dec']
	],
	
    dekadsNames: [
		[1, 'First'], 
		[2, 'Second'], 
		[3, 'Third']
	],
	
	/** 
	 * method[constructor]
     */
	constructor: function(config){
        MapStore.widgets.form.DecadFieldSet.superclass.constructor.call(this, config);		
    },
	
    /** 
	 * private: method[initComponent]
     */
    initComponent: function(config){
		// //////////////////////////////
	    // Old IE versions workaround
        // //////////////////////////////
		if (!Date.prototype.toISOString){
             
            (function(){             
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
            }());
        }  
			
		// ////////////////////
        // Get available data 
		// ////////////////////
		this.on('beforerender', function(){
			var me = this;
			OpenLayers.Request.GET({ 
				url: me.dataUrl + "/?service=WMS&request=getCapabilities", 
				success: function(response) { 
					var xml_format = new OpenLayers.Format.XML(); 
					var xml = xml_format.read(response.responseText); 
					var capabilities_format = new OpenLayers.Format.WMSCapabilities(); 
					var wms_capabilities = capabilities_format.read(xml); 

					var layers = wms_capabilities.capability.layers;
					for(var i=0; i<layers.length; i++){
						if(layers[i] && layers[i].name == me.layer.split(":")[1]){
							var layer = layers[i];
							if(layer.dimensions && layer.dimensions.time){
								var time_dimension = layer.dimensions.time;
								me.loadDimensions(time_dimension);
								break;
							}
						}
					}				
				} 
			});				
		}, this);
		
		this.items = [{
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
					name: 'year',
					ref: '../year',      
					width: 72,
					fieldLabel: "Year",
					anchor: '100%',
					typeAhead: false,
					lazyRender:false,
					mode: 'local',
					valueField:'year',
					displayField:'year',
					setValue: function(v, fireSelect){
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
					listeners: {
						scope: this,
						select: function(cmb,record,index){
							var monthStore = this.getMonthsForAYear(record.id);
							var monthSelector = cmb.refOwner.month;
							monthSelector.bindStore(monthStore);
							monthSelector.enable(true);
							var firstRecord = monthSelector.getStore().getAt(0);
							monthSelector.setValue(firstRecord.get(monthSelector.valueField),true);
						}
					}
				}, {
					xtype: 'combo',
					disabled:true,
					forceSelection:true,
					disableKeyFilter: true,
					editable: false,
					allowBlank:false,
					autoLoad:true,                            
					name:'month',
					ref:'../month',      
					width: 70,
					fieldLabel: "Month",
					anchor:'100%',
					typeAhead: true,
					lazyRender:false,
					mode: 'local',
					valueField:'num',
					displayField:'name',
					value:1,
					triggerAction: "all",
					setValue: function(v, fireSelect){
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
			}, {
				xtype: 'combo',
				forceSelection:true,
				disabled:true,
				forceSelected:true,
				disableKeyFilter: true,
				editable: false,
				allowBlank: false,
				autoLoad:true,                            
				name:'decad',
				ref:'decad',      
				width: 100,
				fieldLabel: "Ten Days Period",
				anchor:'100%',
				typeAhead: true,
				lazyRender:false,
				mode: 'local',
				valueField: 'id',
				value: 1,
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
						// Look for 5 15 25 
						for(var i = 0;i<deks.length;i++){
							if( parseInt(deks[i])*10+5 == id){
								return true;
							}
						}
						return false;
					});
				},
				store: new Ext.data.ArrayStore({
					idIndex: 0,
					fields: [
						'myId',
						'displayText'
					],
					data: this.dekadsNames
				}),
				valueField: 'myId',
				displayField: 'displayText'
			}
		];
		
		MapStore.widgets.form.DecadFieldSet.superclass.initComponent.call(this);
    },
	
	/**
     * private method[isValid]
     */
	isValid: function(){
		var valid = this.year.isValid();
		if(!valid){
			this.year.markInvalid();
		}
		
		return valid;
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
    loadDimensions:function(time_dimensions){
		// ////////////////////////////////////////////////////////////
		// : "2013-01-01T00:00:00.000Z/2013-01-10T00:00:00.000Z/PT1S"
		// ////////////////////////////////////////////////////////////
		var values = time_dimensions.values;
		
		// //////////////////////////////////////////////////////////////////
		// To store them we take the first 9 chars "2013-01-0" "2013-01-1" 
		// "2013-01-2" this should identify the first(0) second(1) third(2) 
		// dekads availability.
		// //////////////////////////////////////////////////////////////////
		if(values.length == 0){
			this.disableAll();
			return;
		}
		
		this.values = {};
		var max="0"; min = "9999";
		for(var i=0; i<values.length; i++){
			var year = parseInt(values[i].substring(0,4));
			var monthStr = values[i].substring(5,7);
			
			// ///////////////////////////////////////////////
			// Fix IE 8 problem when a number starts with 0
			// ///////////////////////////////////////////////
			if(monthStr.indexOf("0") == 0){
				monthStr = monthStr.replace("0", "");
			}
			var month = parseInt(monthStr);
			var dek = parseInt(values[i].substring(8,9));
			var dateString = values[i].substring(0,10);
			
			if(!this.values[year]){
				this.values[year] = {};
			}
			
			if(!this.values[year][month]){
				this.values[year][month] = [];
			}
			
			// Add the dekad to the available list
			this.values[year][month].push(dek);
			
			// Set max and min years
			max = dateString > max ?dateString:max;
			min = dateString < min ?dateString:min;
		}
		
		// No year
		if(this.values == {}){
			this.disableAll();
			return;
		}
		
		// One date at least
		var range = this;
		var years = [];
		for(var key in this.values){
			years.push([key]);
		}
		
		range.year.getStore().loadData(years);       
    },
	
    /**
     * private method[disableAll]
     */
    disableAll: function(){
        var range = this;
        range.year.setDisabled(true);
        range.month.setDisabled(true);
        range.decad.setDisabled(true);
        this.values = {};
        return;
    },
	
	/**
	 * Obtain store with the months available for a year
	 */
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
	
    /** 
	 * Obtain store with the dekads for a month and a year
	 */
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
    },
	
	/**
     * private method[getFileName]
     */
	getFileName: function(){				
		var decad = this.decad.getValue();
		var monthNumber = this.month.getValue();
		var year = this.year.getValue();		
		
	    // ////////////////////////////////////
		// File name should be something like 
		// that: dv_20130101_20130110.tiff
		// ////////////////////////////////////
		var month = this.monthShortNames[monthNumber - 1][0];
		var name = "";
		
		var m = month < 10 ? "0" + month : month;
		switch(decad){
			case 1:				
				name = "dv_" + year + m + "01_" + year + m + "10";
				break;
			case 2: 
				name = "dv_" + year + m + "11_" + year + m + "20";
				break;
			case 3:
				var date = new Date(year, month - 1, decad);
				name = "dv_" + year + m + "21_" + year + m + date.getDaysInMonth();			
				break;
		}

		return name + ".tif";
	}
	
});

Ext.reg("mapstore_decadfieldset", MapStore.widgets.form.DecadFieldSet);
