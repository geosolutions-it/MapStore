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

    outputTypeText:'Output Type',
    areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
    seasonText:'Season',
	
    /** layer Name **/
    hilightLayerName:"CropData_Selection_Layer", //TODO doesn't seems to run
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
            //url: "http://84.33.2.24/geoserver/ows?",
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
		
        //Override the comboconfig url;
        this.comboConfigs.base.url = this.dataUrl;
        var rangeData ;
        //download from WFS available year ranges for each crops.
        
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
                        change: function(c, checked){
                            var outputValue = c.getValue().inputValue;
                            var variable = this.output.variable;
                            var submitButton = this.output.submitButton;
                            var aoiFieldSet = this.output.aoiFieldSet;
                            var areaSelector = aoiFieldSet.AreaSelector;
                            var gran_type = aoiFieldSet.gran_type.getValue().inputValue;
							
                            if(outputValue == 'data'){
                                variable.disable();
                                areaSelector.enable();
                                submitButton.destroy();
                                delete submitButton;
								
                                this.output.addButton({              
                                    url: this.dataUrl, 
                                    xtype: 'gxp_nrlCropDataTabButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                });
								
								// Avoid 'pakistan' checked when 'outputValue' = 'data'
								if(gran_type == "pakistan"){
									aoiFieldSet.gran_type.reset();
								}
									
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');                                
                                this.output.doLayout();
                                this.output.syncSize();

                            }else if(outputValue == 'map'){
                                variable.enable();
                                //set area selector constraints and status
                                aoiFieldSet.disableWidth= ['district','pakistan'];
                                if('province'== gran_type){
                                    areaSelector.enable();// if pakistan is selected selection is not allowed!!
                                }else{
                                    areaSelector.setDisabled(true);
                                }
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({
                                    url: this.dataUrl,
                                    xtype: 'gxp_nrlCropDataMapButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('beforehide');
                                this.output.doLayout();
                                this.output.syncSize();
                                
                            }else{
                                variable.disable();
                                
                                //set area selector constraints and status
                                aoiFieldSet.disableWidth = ['pakistan'];
                                if('pakistan' != gran_type){
                                    areaSelector.enable();// if pakistan is selected selection is not allowed!!
                                }else{
                                    areaSelector.setDisabled(true);
                                }
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
							
                            //set Labels of gran_type for map
                            var mapConvert, pakenabled;
                            if(outputValue == "map"){
                                mapConvert = {
                                    province:"Province (District)",
                                    district:"National (District)",
                                    pakistan:"National (Province)"
                                }
                                //pakenabled=true;
								pakenabled = outputValue != 'data';
                            }else{
                                mapConvert = {
                                    province:"Province ",
                                    district:"District",
                                    pakistan:"Pakistan"
                                }
                                //pakenabled=false;
								pakenabled = outputValue != 'data';
                            }
							
                            aoiFieldSet.gran_type.eachItem(function(item){
								if(item.inputValue == "pakistan"){
									item.setDisabled(!pakenabled);					
								}
								var el = item.wrap.child('.x-form-cb-label');
								el.update(mapConvert[item.inputValue]);                     
                            },this);
							
                            this.output.doLayout();
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
                        change: function(c,checked){
                            var commodityCB = this.ownerCt.Commodity;
                            commodityCB.seasonFilter(checked.inputValue);
                            var selectedCommodity = commodityCB.getStore().getAt(0);
							
                            if(selectedCommodity){
                                commodityCB.setValue(selectedCommodity.get(commodityCB.valueField));
                                var yrs= commodityCB.ownerCt.yearRangeSelector;
                                yrs.setMaxValue(selectedCommodity.get('max'));
                                yrs.setMinValue(selectedCommodity.get('min'));
                                
                            }
							
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
                    selectOnFocus:true,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name:'label',  mapping:'properties.label'},
                            {name:'season',mapping: 'properties.seasons'},
                            {name:'crop',   mapping:'properties.crop'},
                            {name:'max',    mapping:'properties.max' },
                            {name:'min',    mapping:'properties.min' }
                        ],
                        autoLoad: true,
                        url: this.rangesUrl,
                        root: 'features',
                        idProperty:'crop'                        
                    }),
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
                            var selectedCommodity = record;
                            var yrs= cb.ownerCt.yearRangeSelector;
                            yrs.setMaxValue(selectedCommodity.get('max'));
                            yrs.setMinValue(selectedCommodity.get('min'));
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
                    collapsible:true,
                    forceLayout:true, //needed to force to read values from this fieldset
                    collapsed:true,
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
                                    {label: '000 tons', coeff:1,	shortName:'(000 tons)', cid:'cotton,sugarcane,rice,maize'},//TODO set proper values for coef
                                    {label: '000 kgs',    coeff:2,	shortName:'(000 kgs)', cid:'cotton,sugarcane,rice,maize'},//TODO set proper values for coef
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
                target:this,
                form: this,
                disabled:true
            }]
        };
        
        config = Ext.apply(cropData,config || {});
        
        this.output = gxp.plugins.nrl.CropData.superclass.addOutput.call(this, config);
		
        //Enable Disable button when regions are selected
        this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
			
			var values = this.output.getForm().getValues();
			var gran_type = values.areatype;
				
            if (button == "gxp_nrlCropDataButton" || button == 'gxp_nrlCropDataTabButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0 && gran_type != "pakistan");
            }else{
                //map button
                this.output.submitButton.setDisabled(store.getCount()<=0 && gran_type == "province");
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