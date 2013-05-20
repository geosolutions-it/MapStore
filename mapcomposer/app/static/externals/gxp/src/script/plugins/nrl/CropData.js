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
 *  .. class:: CropStatus(config)
 *
 *    Plugin for adding NRL CropData Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.nrl.CropData = Ext.extend(gxp.plugins.Tool, {
 /** api: ptype = nrl_crop_data */
    ptype: "nrl_crop_data",
	/** i18n **/
	outputTypeText:'Output Type',
	areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
	seasonText:'Season',
	/** layer Name **/
    hilightLayerName:"CropData_Selection_Layer",//TODO doesn't seems to run
    radioQtipTooltip: "You have to be logged in to use this method",
	layerStyle:{
        strokeColor: "red",
        strokeWidth: 1,
        fillOpacity:0.6,
        cursor: "pointer"
    },
	rangesUrl: "http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
    dataUrl: null, //"http://84.33.2.24/geoserver/ows?",
	comboConfigs:{
        base:{
            anchor:'100%',
            fieldLabel: 'District',
            url: "http://84.33.2.24/geoserver/ows?",
            predicate:"ILIKE",
            width:250,
            sortBy:"province",
			ref:'singleSelector',
            displayField:"name",
            pageSize:10
            
        },
        district:{
            typeName:"nrl:district_crop",
            queriableAttributes:[
                "district",
                "province"
                
             ],
             recordModel:[
                {
                  name:"id",
                   mapping:"id"
                },
                {
                   name:"geometry",
                   mapping:"geometry"
                },
                {
                   name:"name",
                   mapping:"properties.district"
                },{
                   name:"province",
                   mapping:"properties.province"
                },{
                   name:"properties",
                   mapping:"properties"
                } 
            ],
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"       
        },
        province:{ 
            
            typeName:"nrl:province_crop",
            recordModel:[
                {
                   name:"id",
                   mapping:"id"
                },
                {
                   name:"geometry",
                   mapping:"geometry"
                },
                {
                   name:"name",
                   mapping:"properties.province"
                },{
                   name:"properties",
                   mapping:"properties"
                }
            ],
            sortBy:"province",
            queriableAttributes:[
                "province"
            ],
            displayField:"name",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"
                            
        }
    
    },
    startCommodity:'Wheat',
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		var conf = {
			//TODO year ranges (from available data)
			
		}
		var rangeData ;
        //download from WFS available year ranges for each crops.
		var yearRangeStore = new Ext.data.JsonStore({
			fields: [
                {name:'crop',mapping:'properties.crop'},
                {name:'max', mapping:'properties.max' },
                {name:'min', mapping:'properties.min' }
            ],
			//autoLoad: true,
			url: this.rangesUrl,
            root: 'features',
            idProperty:'properties.crop'
            
            
		
		
		});
		var cropData  = {
			xtype:'form',
			title: 'Crop Data',
			layout: "form",
			minWidth:180,
			autoScroll:true,
			frame:true,
			items:[
			
				{ 
					fieldLabel: this.outputTypeText,
					xtype: 'radiogroup',
					anchor:'100%',
					autoHeight:true,
					checkboxToggle:true,
					name:'outputType',
					ref:'outputType',
					autoHeight: true,
					defaultType: 'radio', // each item will be a radio button
					items:[
						{boxLabel: 'Data' , name: 'outputtype', listeners: this.setRadioQtip(this.radioQtipTooltip), inputValue: 'data', disabled: true},
						{boxLabel: 'Chart', name: 'outputtype', inputValue: 'chart', checked: true},
						{boxLabel: 'Map'  , name: 'outputtype', inputValue: 'map'}
						
					],
                 
                    listeners: {           
                        change: function(c,checked){
                            var outputValue = c.getValue().inputValue;
                            var variable = this.output.variable;
                            var submitButton = this.output.submitButton;
                            var areaSelector = this.output.aoiFieldSet.AreaSelector;                            
                            if(outputValue == 'data'){
                                variable.disable();
                                areaSelector.enable();
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({              
									url: this.dataUrl, //'http://84.33.2.24/geoserver/ows',//TODO externalize this
                                    xtype: 'gxp_nrlCropDataTabButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');                                
                                this.output.doLayout();
                                this.output.syncSize();

                            }else if(outputValue == 'map'){
                                variable.enable();
                                areaSelector.disable();
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({
                                    url: this.dataUrl,
                                    xtype: 'gxp_nrlCropDataMapButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                this.output.fireEvent('beforehide');
                                this.output.doLayout();
                                this.output.syncSize();
                                this.output.submitButton.enable();
                            }else{
                                variable.disable();
                                areaSelector.enable();
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({
                                    url: this.dataUrl,
                                    xtype: 'gxp_nrlCropDataButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');
                                this.output.doLayout();
                                this.output.syncSize();
                            }                               
                        },                        
                        scope: this                        
                    }
				},{ 
					fieldLabel: this.seasonText,
					xtype: 'nrl_seasonradiogroup',
					anchor:'100%',
					name:'season',
					ref:'season',
					listeners: {
						/*select: function(group,checked){
							//TODO (smart check if commodity is present in the filtered combo)
							this.ownerCt.Commodity.setValue(this.startValue)
							this.ownerCt.Commodity.seasonFilter(checked.inputValue);  //check it : first time dosn't run
							
						}*/
                        change: function(c,checked){
                            var commodity = this.ownerCt.Commodity;
                            commodity.seasonFilter(checked.inputValue);
                            var selectedCommodity = commodity.store.data.items[0].data.label
                            commodity.setValue(selectedCommodity);
                            var yrs= commodity.ownerCt.yearRangeSelector;
                            var yearrange = yearRangeStore.getById(selectedCommodity);
                            yrs.setMaxValue(yearrange.get('max'));
                            yrs.setMinValue(yearrange.get('min'));

                            var comboProd = Ext.getCmp('comboProd');
                            comboProd.setValue('000 tons');  

                        }
					}
				},{
					xtype: 'nrl_aoifieldset',
					name:'region_list',
					ref:'aoiFieldSet',
                    layerStyle:this.layerStyle,
					anchor:'100%',
					comboConfigs:this.comboConfigs,
					target:this.target,
					areaFilter:this.areaFilter, 
					hilightLayerName:this.hilightLayerName,
					layers:this.layers
					
				},
				{
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
                            var yearrange = yearRangeStore.getById(selectedCommodity);
                            yrs.setMaxValue(yearrange.get('max'));
                            yrs.setMinValue(yearrange.get('min'));
                            cb.ownerCt.referenceYear.setText(yrs.endValue.getValue());
                            
                            var comboProd = Ext.getCmp('comboProd');
                            
                            var comValue = cb.getValue();
                            if (comValue == 'cotton'){
                                comboProd.setValue('000 bales');               
                            }else{
                                comboProd.setValue('000 tons');                                  
                            }
                        }
                    }
				},{
					xtype: 'label',
					anchor:'100%',
					fieldLabel:'Reference Year',
					text:2009, //TODO conf
					ref: 'referenceYear'
				},{
					ref: 'yearRangeSelector',
					xtype: 'yearrangeselector',
					anchor:'100%',
					
					
					listeners:{
						scope:this,
						change:function(start,end){
							this.output.referenceYear.setText(end);
						},
                        afterrender: function(component) {
							if(this.output.yearRangeSelector!=component)return;
                            yearRangeStore.load({
								 callback:function(){
									var start  = yearRangeStore.getById('Wheat');
									if(this.output.yearRangeSelector){
										var max = start.get('max');
										var min = start.get('min');
										this.output.yearRangeSelector.setMaxValue(max);
										this.output.yearRangeSelector.setMinValue(min);
                                        this.output.referenceYear.setText(max);
									}else{
										rangeData = start;
									}
								},
								scope:this
							});
						}
					}
					
				},{ 
					fieldLabel: 'Variable',
					xtype: 'radiogroup',
					anchor:'100%',
					autoHeight:true,
                    ref: 'variable',
					//checkboxToggle:true,
					title: this.outputTypeText,
					autoHeight: true,
					defaultType: 'radio',
					columns: 1,
					disabled:true,
					items:[
						{boxLabel: 'Area' , name: 'variable', inputValue: 'Area'},
						{boxLabel: 'Production', name: 'variable', inputValue: 'Production', checked: true},
						{boxLabel: 'Yield' , name: 'variable', inputValue: 'Yield'}
						
					]
				},{
					xtype: 'fieldset',
					title:'Unit',
					anchor:'100%',
                    ref: 'units',
					items:[{
							xtype: 'combo',
                            ref: 'production',
                            id: 'comboProd',
							anchor:'100%',
							fieldLabel: 'Production',
							typeAhead: true,
							triggerAction: 'all',
							lazyRender:false,
							mode: 'local',
							name:'production_unit',
							forceSelected:true,
							allowBlank:false,
							autoLoad:true,
							displayField: 'label',
							valueField:'label',
							value:'000 tons',
							readOnly:true,
							store: new Ext.data.JsonStore({
								fields:[
										{name:'name',dataIndex:'name'},
										{name:'label',dataIndex:'label'},
										{name:'coeff',dataIndex:'coeff'},
										{name:'shortName', dataindex: 'shortName'},
                                        {name:'cid', dataindex: 'cid'}
								],
								data:[
									{label: '000 tons', coeff:1,	shortName:'(000 tons)', cid:'wheat,cotton,sugarcane,rice,maize'},//TODO set proper values for coef
									{label: '000 kgs',    coeff:2,	shortName:'(000 kgs)', cid:'wheat,cotton,sugarcane,rice,maize'},//TODO set proper values for coef
									{label: '000 bales', coeff:3,	shortName:'(000 bales)', cid:'cotton'} //TODO set proper values for coef
								]
							}),
                            listeners: {
                                expand: function( combo ){
                                    if (combo.disabled == true){
                                        combo.enable();
                                        var commodity = this.ownerCt.ownerCt.Commodity;
                                        var radio = commodity.getValue();
                                        
                                        if(radio){
                                            combo.store.filter('cid', radio.toLowerCase(),true,true); 
                                        }
                                        combo.disable();
                                    }
                                }                        
                            }                      
						},{
							xtype: 'combo',
                            ref: 'area',
							anchor:'100%',
							fieldLabel: 'Area',
							typeAhead: true,
							triggerAction: 'all',
							lazyRender:false,
							mode: 'local',
							autoLoad:true,
							forceSelected:true,
							allowBlank:false,
							name:'area_unit',
							displayField: 'label',
							valueField:'label',
							value: '000 hectares',
							readOnly:true,
							store: new Ext.data.JsonStore({
								fields:[
										{name:'name',dataIndex:'name'},
										{name:'label',dataIndex:'label'},
										{name:'coeff',dataIndex:'coeff'},
										{name:'shortName', dataindex: 'shortName'}
								],
								data:[
									{label: '000 hectares',		coeff:1,	shortName:'000 ha'        },//TODO set proper values for coef
									{label: 'square kilometers',	coeff:2,	shortName:'Km<sup>2</sup>'} //TODO set proper values for coef
								]
							})
                        },{
							xtype: 'combo',
                            ref: 'yield',
							anchor:'100%',
							fieldLabel: 'Yield',
							typeAhead: true,
							triggerAction: 'all',
							lazyRender:false,
							mode: 'local',
							autoLoad:true,
							forceSelected:true,
							allowBlank:false,
							name:'yield_unit',
							displayField: 'label',
							valueField:'label',
							value: 'kg/ha',
							readOnly:true,
							store: new Ext.data.JsonStore({
								fields:[
										{name:'name',dataIndex:'name'},
										{name:'label',dataIndex:'label'},
										{name:'coeff',dataIndex:'coeff'},
										{name:'shortName', dataindex: 'shortName'}
								],
								data:[
									{label: 'kg/ha', coeff:1, shortName:'kg/ha'}//TODO set proper values for coef
								]
							})
					}]
				  
					
				}
			
				
			],	
			buttons:[{
                url: this.dataUrl,
                xtype: 'gxp_nrlCropDataButton',
				ref: '../submitButton',
                target:this.target,
				form: this,
                disabled:true
            }]
		};
		
		config = Ext.apply(cropData,config || {});
		
		this.output = gxp.plugins.nrl.CropData.superclass.addOutput.call(this, config);
		this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlCropDataButton" || button == 'gxp_nrlCropDataTabButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }
		},this);
		//hide selection layer on tab change
		this.output.on('beforehide',function(){
			var button = this.output.aoiFieldSet.AreaSelector.selectButton;
			button.toggle(false);
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(false);
			
		},this);
		this.output.on('show',function(){
			var button = this.output.aoiFieldSet.AreaSelector.selectButton;
			
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
 Ext.preg(gxp.plugins.nrl.CropData.prototype.ptype, gxp.plugins.nrl.CropData);