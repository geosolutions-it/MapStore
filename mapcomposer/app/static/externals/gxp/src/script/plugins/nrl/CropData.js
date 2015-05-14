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
	typeNameData:"nrl:CropData2",
    /** layer Name **/
    hilightLayerName:"CropData_Selection_Layer", //TODO doesn't seems to run
    radioQtipTooltip: "You have to be logged in to use this method",
	layerStyle:{
        strokeColor: "red",
        strokeWidth: 1,
        fillOpacity:0.6,
        cursor: "pointer"
    },
    /** URL for ranges **/
	rangesUrl: "http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
	/** base url for data **/ 
    dataUrl: null, //"http://84.33.2.24/geoserver/ows?",
    /** Base URL for UOM **/
    unitsUrl:"http://84.33.2.75/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:measure_units_for_crop&outputFormat=json",
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
    commodityFields:[
            {name:'label',  mapping:'properties.label'},
            {name:'season',mapping: 'properties.seasons'},
            {name:'crop',   mapping:'properties.crop'},
            {name:'max',    mapping:'properties.max' },
            {name:'min',    mapping:'properties.min' },
            {name:'prod_default_unit',    mapping:'properties.prod_default_unit' },
            {name:'area_default_unit',    mapping:'properties.area_default_unit' },
            {name:'yield_default_unit',    mapping:'properties.yield_default_unit' }
    ],    
    /** fields for unit of measure combo boxes **/
	uomFields:[
	        {name:'id',mapping:'properties.id'},
            {name:'uid',mapping:'properties.uid'},
            {name:'name',mapping:'properties.name'},
            {name:'label', mapping :'properties.name'},
            {name:'coefficient', mapping:'properties.coefficient', type: Ext.data.Types.FLOAT},
            {name:'shortname',  mapping: 'properties.shortname'},
            {name:'description', mapping: 'properties.description'},
            {name:'class',  mapping :'properties.cls'},   
            {name:'cid',   mapping: 'properties.cid'} //TODO this should be added statically somewhere
    ],
    startCommodity:'Wheat',

    addOutput: function(config) {
        var conf = {
            //TODO year ranges (from available data)
        };
		
        //Override the comboconfig url;
        this.comboConfigs.base.url = this.dataUrl;
        var rangeData;
        //filter unit stores for selected crop
        
        var  filterUnitByCrop =  function(units,crop){
            units.area.filterByCrop(crop);
            units.production.filterByCrop(crop);
            units.yield.filterByCrop(crop);
        };
        //reset unit combobox to defaults for the selected crop
        var resetUnitComboboxes = function(unitFieldset,selectedCommodity){
			unitFieldset.production.selectUnit(selectedCommodity.get('prod_default_unit'));
			unitFieldset.area.selectUnit(selectedCommodity.get('area_default_unit'));
			unitFieldset.yield.selectUnit(selectedCommodity.get('yield_default_unit'));
        };
        var loadStoreTrigger =  function(){
            this.pendingStores--;
            if(this.pendingStores === 0){
                resetUnitComboboxes(units,Commodity.getStore().getAt(0));
            }
        };
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
							this.output.changeMode('composite');
                            this.output.mode.setValue('composite',true);
                            if(outputValue == 'data'){
                                this.output.outputmode.setVisible(false);
                                this.output.mode.setVisible(false);
                                variable.setVisible(false);
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
                                this.output.outputmode.setVisible(false);
                                this.output.mode.setVisible(false);
                                variable.setVisible(true);
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
                                    mapToolPosition: this.mapToolPosition,
                                    target:this.target,
                                    form: this
                                });
                               
                                var selectedCommodity = this.output.Commodity.getSelectedRecord();
                                resetUnitComboboxes(this.output.units,selectedCommodity );
                                this.output.units.setDisabled(true);
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('beforehide');
                                this.output.doLayout();
                                this.output.syncSize();
                                
                            }else{
                                this.output.outputmode.setVisible(true);
                                this.output.mode.setVisible(true);
                                this.output.units.setDisabled(false);
                                variable.setVisible(false);
                                
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
                                });
                                var st = areaSelector.store;
                                this.output.fireEvent('update',st);
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
                                };
                                //pakenabled=true;
								pakenabled = outputValue != 'data';
                            }else{
                                mapConvert = {
                                    province:"Province ",
                                    district:"District",
                                    pakistan:"Pakistan"
                                };
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
                                //TODO SET UNIT COMBO BOXES
                                resetUnitComboboxes(commodityCB.refOwner.units,selectedCommodity);
                            }
                        }
                    }
                //
                // AOI SELECTOR
                //
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
                    layers:this.layers,
                    selectableLayer: this.layers.province,
                },{ 
                    fieldLabel: 'Mode',
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'mode',
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 1,
                    disabled:false,
                    items:[
                        {boxLabel: 'Composite' , name: 'mode', inputValue: 'composite',checked:true},
                        {boxLabel: 'Comparison by Region' , name: 'mode', inputValue: 'compareRegion'},
						{boxLabel: 'Comparison by Commodity' , name: 'mode', inputValue: 'compareCommodity'}
                    ],
                    listeners: {
                        change: function(c,checked){
                            this.ownerCt.changeMode(checked.inputValue);
                            if(checked.inputValue == 'composite' && !c.ownerCt.outputmode.isVisible()){
                            	c.ownerCt.outputmode.show();
                            	c.ownerCt.doLayout();
                            }else if (c.ownerCt.outputmode.isVisible()){
                            	c.ownerCt.outputmode.hide();
                            }
                        }
                    }
                //
                // UNIT OF MEASURE
                //
                },
                
                
                //COMMODITY GRID
                 new Ext.ux.grid.CheckboxSelectionGrid({
                    title: 'Commodities',
                    enableHdMenu:false,
                    hideHeaders:true,
                    hidden:true,
                    //autoHeight:true,
                    ref: 'commodities',
                    height:160,
                    //viewConfig: {forceFit: true},
                    store: new Ext.data.JsonStore({
                        fields: this.commodityFields,
                        autoLoad: true,
                        url: this.rangesUrl,
                        root: 'features',
                        idProperty:'crop',
                        listeners:{
                            scope:this,
                            load:loadStoreTrigger
                        }
                    }),
                    columns: {
                        id:'commodity_label',
                        header:'Commodity',
                        dataIndex: 'label'
                    },
                    allowBlank:false,
                    name:'crop',
                    anchor:'100%',
                    
                    listeners: {
                        scope:this,
                        selectionchange:function(records){
                           //update selected crops
                            var cseries = {};
                            var button = this.output.submitButton;
                            var optionsCompare = nrl.chartbuilder.util.generateDefaultChartOpt(records,'label','crop');
                            button.optionsCompareCommodities = optionsCompare;
                            //var commoditySelected = records.length >0;
                            //button.setDisabled( !commoditySelected );
                        }   
                    } 
                    
                //
                //REFERENCE YEAR
                //
                }),{
                    xtype: 'nrl_commoditycombobox',
                    forceSelection:true,
                    selectOnFocus:true,
                    store: new Ext.data.JsonStore({
                        fields: this.commodityFields,
                        autoLoad: true,
                        url: this.rangesUrl,
                        root: 'features',
                        idProperty:'crop',
                        listeners:{
                            scope:this,
                            load:loadStoreTrigger
                        }
                    }),
                    allowBlank:false,
                    name:'crop',
                    anchor:'100%',
                    ref: 'Commodity',
                    listeners: {
                        expand: function( combo ){
                            var season = this.ownerCt.season;
                            var radio = season.getValue();
							
							var mode = this.ownerCt.mode.getValue().inputValue;
                            
                            if (radio && radio.getValue() && mode === 'composite'){
                               this.seasonFilter(radio.inputValue);
                            }else{
							   this.reset();
							}
                        },
                        select: function(cb,record,index){
                            //set year range for the selected crop
                            var selectedCommodity = record;
                            var yrs= cb.ownerCt.yearRangeSelector;
                            yrs.setMaxValue(selectedCommodity.get('max'));
                            yrs.setMinValue(selectedCommodity.get('min'));
                            cb.ownerCt.referenceYear.setText(yrs.endValue.getValue());
                            var comValue = cb.getValue();
                            //filter and set unit of measures
                            var units = this.refOwner.units;
                            filterUnitByCrop(units,comValue);
                            resetUnitComboboxes(this.refOwner.units,selectedCommodity);
                            
                            
                        }
                    }
                //
                //REFERENCE YEAR
                //
                },{
					fieldLabel: 'Chart Type',
					xtype: 'radiogroup',
					anchor: '100%',
					autoHeight: true,
					ref: 'outputmode',
					title: this.outputTypeText,
					defaultType: 'radio',
					columns: 1,
					hidden: false,
					items: [
						{boxLabel: 'Values' , name: 'outputmode', inputValue: 'abs',checked:true},
						{boxLabel: 'Anomalies' , name: 'outputmode', inputValue: 'diff'},
						{boxLabel: 'Anomalies (%)' , name: 'outputmode', inputValue: 'percent'}
					]
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
                            if(this.output.yearRangeSelector!=component) {return;}
                        }
                    }
                //
                // VARIABLE
                //
                },{ 
                    fieldLabel: 'Variable',
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'variable',
                    //checkboxToggle:true,
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 2,
                    disabled:false,
                    hidden:true,
                    items:[
                        {boxLabel: 'Area' , name: 'variable', inputValue: 'Area'},
                        {boxLabel: 'Reference Year', name: 'type', inputValue: 'total', checked: true},
                        {boxLabel: 'Production', name: 'variable', inputValue: 'Production', checked: true},
                        {boxLabel: 'Difference' , name: 'type', inputValue: 'difference'},
                        {boxLabel: 'Yield' , name: 'variable', inputValue: 'Yield'},
                        {boxLabel: 'Average' , name: 'type', inputValue: 'average'}
                        
                    ]
                },{ 
                    fieldLabel: 'Variable',
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'compare_variable',
                    //checkboxToggle:true,
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 1,
                    disabled:false,
                    hidden:true,
                    items:[
                        {boxLabel: 'Area' , name: 'compare_variable', inputValue: 'area'},
                        {boxLabel: 'Production', name: 'compare_variable', inputValue: 'prod', checked: true},
                        {boxLabel: 'Yield' , name: 'compare_variable', inputValue: 'yield'}
                    ]
                //
                // UNIT OF MEASURE
                //
                },{
                    xtype: 'fieldset',
                    title:'Unit',
                    anchor:'100%',
                    ref: 'units',
                    collapsible:true,
                    forceLayout:true, //needed to force to read values from this fieldset
                    collapsed:false,
                    getSelectedUnits: function(){
                        // get selected record for each combo
                        var units = this;
                        var prodRec = units.production.getUnitRecordById( units.production.getValue() );
                        var areaRec = units.area.getUnitRecordById( units.area.getValue() );
                        var yieldRec = units.yield.getUnitRecordById( units.yield.getValue() );
                        return {
                                prod: prodRec,
                                area:areaRec,
                                yield:yieldRec,
                                prod_factor: prodRec.get('coefficient'),
                                area_factor: areaRec.get("coefficient"),
                                yield_factor: yieldRec.get("coefficient")
                        };
                        
                    },
                    items:[{
                            //PRODUCTION UOM
                            xtype: 'nrl_uom_combobox',
                            ref: 'production',
                            id: 'comboProd',
                            anchor:'100%',
                            fieldLabel: 'Production',
                            mode: 'local',
                            typeAhead: true,
                            triggerAction: 'all',
                            lazyRender:false,
                            hiddenName:'production_unit',
                            forceSelected:true,
                            allowBlank:false,
                            value:this.startProdUom,
                            displayField: 'name',
                            valueField: 'uid',
                            readOnly:false,
                            store: new Ext.data.JsonStore({
                                 baseParams:{
                                    viewParams: 'class:production'
                                },
                                fields:this.uomFields,
                                autoLoad:true,
                                url: this.unitsUrl,
                                root: 'features',
                                idProperty:'uid'
                            }),
                            //filter by class the store of the combobox.
                            //uses the 3rd parameter as additional filter for Crops (TODO)
                           
                            listeners: {
                                expand: function( combo ){
                                    
                                     var commodity = this.ownerCt.ownerCt.Commodity;
                                        var radio = commodity.getValue();
                                    //enable before do filter
                                    if (combo.disabled === true){
                                        combo.enable();
                                        this.filterByCrop(radio);
                                        combo.disable();
                                    }else{
                                       this.filterByCrop(radio);
                                    }
                                }
                            }
						},{
						    //AREA UOM
                            xtype: 'nrl_uom_combobox',
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
                            hiddenName:'area_unit',
                            displayField: 'label',
                            valueField:'uid',
                            value: this.startAreaUom,
                            readOnly:false,
                            store: new Ext.data.JsonStore({
                                baseParams:{
                                    viewParams: 'class:area'
                                },
                                fields:this.uomFields,
                                autoLoad:true,
                                url: this.unitsUrl,
                                root: 'features',
                                idProperty:'uid'
                            }),
                            listeners: {
                                expand: function( combo ){
                                    
                                     var commodity = this.ownerCt.ownerCt.Commodity;
                                        var radio = commodity.getValue();
                                    //enable before do filter
                                    if (combo.disabled === true){
                                        combo.enable();
                                        this.filterByCrop(radio);
                                        combo.disable();
                                    }else{
                                       this.filterByCrop(radio);
                                    }
                                }
                            }
                        },{
                            //YIELD UOM
                            xtype: 'nrl_uom_combobox',
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
                            hiddenName:'yield_unit',
                            displayField: 'label',
                            valueField:'uid',
                            value: this.startYieldUom,
                            readOnly:false,
                            store: new Ext.data.JsonStore({
                                baseParams:{
                                    viewParams: 'class:yield'
                                },
                                fields:this.uomFields,
                                autoLoad:true,
                                url: this.unitsUrl,
                                root: 'features',
                                idProperty:'uid'
                                
                            }),
                            listeners: {
                                expand: function( combo ){
                                    
                                     var commodity = this.ownerCt.ownerCt.Commodity;
                                        var radio = commodity.getValue();
                                    //enable before do filter
                                    if (combo.disabled === true){
                                        combo.enable();
                                        this.filterByCrop(radio);
                                        combo.disable();
                                    }else{
                                        this.filterByCrop(radio);
                                    }
                                }
                            }
                    }]
                }
            ],
            changeMode: function(mode){	
                this.mode.setValue(mode);
                var commodityCB = this.Commodity;
                commodityCB.setVisible(mode == 'composite' || mode == 'compareRegion');
                var commoditygrid = this.commodities;
                commoditygrid.setVisible(mode == 'compareCommodity');
                /*var season = this.season;
                season.setVisible(mode == 'composite');*/
                this.compare_variable.setVisible(mode == 'compareRegion' || mode == 'compareCommodity');
				
				var gran_type = this.aoiFieldSet.gran_type;
                //update button
                
                if(mode == 'compareCommodity' ){
                    var commoditySelected = commoditygrid.getSelectionModel().getSelections().length >0;
                    //this.submitButton.setDisabled( commoditySelected );
                }
				
				gran_type.eachItem(function(item){
					if(item.inputValue === 'pakistan'){
						item.setDisabled(mode !== 'composite');
						if(item.checked === true)
							item.setValue('province');
					}
				},this);
				
                this.doLayout();
            },
            buttons:[{
                url: this.dataUrl,
                xtype: 'gxp_nrlCropDataButton',
                typeName: this.typeNameData,
                ref: '../submitButton',
                target:this,
                form: this,
                disabled:true
            }/*, {
                url: this.dataUrl,
				iconCls: 'process',
                //xtype: 'gxp_nrlCropDataButton',
                typeName: this.typeNameData,
                ref: '../submitButton',
                target:this,
                form: this,
                disabled:true
            }*/]
        };
        
        config = Ext.apply(cropData,config || {});
        
        this.output = gxp.plugins.nrl.CropData.superclass.addOutput.call(this, config);
        
		
		
        //Enable Disable xTypeButton when regions are selected
        this.output.on('update',function(store){
			
			var button = this.output.submitButton;
            var xTypeButton = button.getXType();
			
			var values = this.output.getForm().getValues();
			var gran_type = values.areatype;
			
            if (xTypeButton == "gxp_nrlCropDataButton"){
                button.setDisabled(store.getCount()<=0 && gran_type != "pakistan");
				
				// Set chartOptCompare object
				var numRegion = [];
				var regStore = this.output.aoiFieldSet.AreaSelector.store;
				var records = regStore.getRange();
				
				for (var i=0;i<records.length;i++){
					var attrs = records[i].get("attributes");
					var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
					numRegion.push(region.toLowerCase());
				}
				
				var chartOptCompare = {};
				var series = {};
				
				var colorRGB = nrl.chartbuilder.util.randomColorsRGB(numRegion.length);
				var colorHEX = nrl.chartbuilder.util.randomColorsHEX(numRegion.length);
				// update selected regions
				for (var i = 0;i<numRegion.length;i++){
					
					var dataIndex = numRegion[i].split(',')[0];
					
					if (gran_type == "province"){
						var newNumRegion = numRegion[i].slice(0,1).toUpperCase() + numRegion[i].slice(1);
					}else{
						var splitRegion = numRegion[i].split(',');
						var newNumRegion = splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
					}
					
					series[dataIndex] = {
						name: newNumRegion,
						color: colorHEX[i],
						lcolor: 'rgb(' + colorRGB[i] + ')',
						type: 'column',
						dataIndex: dataIndex
					};
					
				}
                chartOptCompare = {
					series:series,
					height:500
				};
                
                
				button.chartOptCompare = chartOptCompare;
				
            }else if(xTypeButton == 'gxp_nrlCropDataTabButton'){
				button.setDisabled(store.getCount()<=0 && gran_type != "pakistan");
			}else{
                //map xTypeButton
                button.setDisabled(store.getCount()<=0 && gran_type == "province");
            }			
            
        },this);
		
        //hide selection layer on tab change
        this.output.on('beforehide',function(){
            var button = this.output.aoiFieldSet.AreaSelector.selectButton;
            button.toggle(false);
            var lyr = button.hilightLayer;
            if(!lyr) {return;}
            lyr.setVisibility(false);
            
        },this);
        this.output.on('show',function(){
            var button = this.output.aoiFieldSet.AreaSelector.selectButton;
            
            var lyr = button.hilightLayer;
            if(!lyr) {return;}
            lyr.setVisibility(true);
            
        },this);
        
        
        // initialize units of measure when finish loading
        this.pendingStores = 4;
        var units = this.output.units;
        var Commodity = this.output.Commodity;
        
        this.output.units.production.getStore().on('load',loadStoreTrigger);
        this.output.units.area.getStore().on('load',loadStoreTrigger);
        this.output.units.yield.getStore().on('load',loadStoreTrigger);
        Commodity.on('load',loadStoreTrigger);
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
        };        
        return o;
    } 
 });
 
 Ext.preg(gxp.plugins.nrl.CropData.prototype.ptype, gxp.plugins.nrl.CropData);
