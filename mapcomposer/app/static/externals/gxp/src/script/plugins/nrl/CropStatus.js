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
 *  class = CropStatus
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: NRL_Modules(config)
 *
 *    Plugin for adding NRL CropStatus Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.nrl.CropStatus = Ext.extend(gxp.plugins.Tool, {
 /** api: ptype = nrl_crop_status */
    ptype: "nrl_crop_status",

	areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
    radioQtipTooltip: "You have to be logged in to use this method",
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		var cropStatus  = {
					xtype:'form',
					title: 'Crop Status',
					layout: "form",
					minWidth:180,
					autoScroll:true,
					frame:true,
					items:[
						{ 
							fieldLabel: 'Output Type',
							xtype: 'radiogroup',
							anchor:'100%',
							autoHeight:true,
                            name:'outputType',
                            ref:'outputType',                            
							checkboxToggle:true,
							//title: this.outputTypeText,
							autoHeight: true,

							defaultType: 'radio', // each item will be a radio button
							items:[
								{boxLabel: 'Data' , name: 'outputtype', listeners: this.setRadioQtip(this.radioQtipTooltip), inputValue: 'data', disabled: true},
								{boxLabel: 'Chart', name: 'outputtype', inputValue: 'chart', checked: true}
							],                 
                            listeners: {           
                                change: function(c,checked){
                                    var outputValue = c.getValue().inputValue;
                                    var submitButton = this.output.submitButton;
                                    //var areaSelector = this.output.aoiFieldSet.AreaSelector;                            
                                    if(outputValue == 'data'){
                                        //areaSelector.enable();
                                        submitButton.destroy();
                                        delete submitButton;
                                        this.output.addButton({              
                                            url: 'http://84.33.2.24/geoserver/ows',//TODO externalize this
                                            xtype: 'gxp_nrlCropStatusTabButton',
                                            ref: '../submitButton',
                                            target:this.target,
                                            form: this
                                        })
                                        //var store = areaSelector.store;
                                        //this.output.fireEvent('update',store);
                                        this.output.fireEvent('show');                                
                                        this.output.doLayout();
                                        this.output.syncSize();

                                    }else{
                                        //areaSelector.enable();
                                        submitButton.destroy();
                                        delete submitButton;
                                        this.output.addButton({               
                                            xtype: 'gxp_nrlCropStatusChartButton',
                                            ref: '../submitButton',
                                            target:this.target,
                                            form: this
                                        })
                                        //var store = areaSelector.store;
                                        //this.output.fireEvent('update',store);
                                        this.output.fireEvent('show');
                                        this.output.doLayout();
                                        this.output.syncSize();
                                    }                               
                                },                        
                                scope: this                        
                            }
						},{ 
							fieldLabel: 'Season',
							xtype: 'nrl_seasonradiogroup',
							ref:'season',
							name:'season',
							anchor:'100%',
							listeners:{
								change: function(c,checked){
									var commodity = this.ownerCt.Commodity;
									commodity.seasonFilter(checked.inputValue);
									var selectedCommodity = commodity.store.data.items[0].data.label
									commodity.setValue(selectedCommodity);

									var comboProd = Ext.getCmp('comboProd');
									comboProd.setValue('000 tons');  

								}
							}
						},{
							xtype:'nrl_single_aoi_selector',
							target:this.target,
							ref:'singleFeatureSelector',
							hilightLayerName: 'hilight_layer_selectAction',
							vendorParams: {cql_filter:this.areaFilter}
						},{
							xtype: 'singleyearcombobox',
							anchor:'100%'
							
						},{
					xtype: 'nrl_commoditycombobox',
					forceSelection:true,
					allowBlank:false,
					name:'crop',
					anchor:'100%',
					ref: 'Commodity',
                    listeners: {
                        expand: function( combo ){
                            var season = this.ownerCt.season;
							var radio = season.getValue();
							
							if (radio && radio.getValue()){
                               this.seasonFilter(radio.inputValue);
                            }                           
                        },
                        select: function(cb,record,index){
                            //set year range for the selected crop
                            var selectedCommodity = record.get('label');
                            var yrs= cb.ownerCt.yearRangeSelector;
                            
                            
                            var comboProd = Ext.getCmp('comboProd');
                            
                            var comValue = cb.getValue();
                            if (comValue == 'cotton'){
                                comboProd.setValue('000 bales');               
                            }else{
                                comboProd.setValue('000 tons');                                  
                            }
                        }
                    }
				},new Ext.ux.grid.CheckboxSelectionGrid({
                            title:'Factors',
                            enableHdMenu:false,
                            hideHeaders:true,
                            autoHeight:true,
                            
							viewConfig: {forceFit: true},
                            columns: [{id:'name',mapping:'label',header:'Factor'}],
                            autoScroll:true,
                            store: new Ext.data.ArrayStore({
								fields:Ext.data.Record.create([{name:'name',mapping:'name'},{name:'label',mapping:'boxLabel'}]),
								data: [//TODO get it from remote services
                                    {boxLabel: 'NDVI' , name: 'NDVI', inputValue: 'NDVI'},
                                    {boxLabel: 'Max Temperature' , name: 'MaxTemperature', inputValue: 'MaxTemperature'},
                                    {boxLabel: 'Min Temperature' , name: 'MinTemperature', inputValue: 'MinTemperature'},
                                    {boxLabel: 'Precipitation' , name: 'Precipitation', inputValue: 'Precipitation'},
                                    {boxLabel: 'Canals Discharge' , name: 'canaldischarge', inputValue: 'canaldischarge'},
                                    {boxLabel: 'Hot Wave' , name: 'hotwave', inputValue: 'hotwave'},
                                    {boxLabel: 'Cold Wave' , name: 'coldwave', inputValue: 'coldwave'},
                                    {boxLabel: 'Wind Storm' , name: 'windstorm', inputValue: 'windstorm'},
                                    {boxLabel: 'Hail Storm' , name: 'hailstorm', inputValue: 'hailstorm'},
                                    {boxLabel: 'Flood' , name: 'Flood', inputValue: 'Flood'}
                                ]
							})
                        
                        })
					
					],	
			buttons:[{               
                xtype: 'gxp_nrlCropStatusChartButton',
				ref: '../submitButton',
                target:this.target,
				form: this,
                disabled:true
            }]
		};
		config = Ext.apply(cropStatus,config || {});
		
		this.output = gxp.plugins.nrl.CropStatus.superclass.addOutput.call(this, config);
		this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlCropStatusChartButton" || button == 'gxp_nrlCropStatusTabButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }
		},this);		
		//hide selection layer on tab change
		this.output.on('beforehide',function(){
			var button = this.output.singleFeatureSelector.singleSelector.selectButton;
			button.toggle(false);
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(false);
			
		},this);
		this.output.on('show',function(){
			var button = this.output.singleFeatureSelector.singleSelector.selectButton;
			
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(true);
			
		},this);
		return this.output;
		
	},
    setRadioQtip: function (t){ 
        var o = { 
            afterrender: function() {
                //Ext.QuickTips.init();
                var id  = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.register({ target:  id.elements[id.elements.length-1].id, text: t});
            },
            destroy:function(){
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length-1].id);
            },                                
            enable: function() {
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length-1].id);
            },
            disable: function() {
                //Ext.QuickTips.init();
                var id  = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.register({ target:  id.elements[id.elements.length-1].id, text: t});
            }
        }        
        return o;
    } 
 });
 Ext.preg(gxp.plugins.nrl.CropStatus.prototype.ptype, gxp.plugins.nrl.CropStatus);