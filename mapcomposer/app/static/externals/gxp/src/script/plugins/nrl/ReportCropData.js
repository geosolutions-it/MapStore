/**
 *  Copyright (C) 2007 - 2013 GeoSolutions S.A.S.
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
 * @author Alejandro Diaz
 */

/**
 * @requires plugins/nrl/CropStatus.js
 */

/** api: (define)
 *  module = gxp.plugins.nrl
 *  class = ReportCropData
 */

/** api: (extends)
 *  plugins/nrl/CropStatus.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: ReportCropData(config)
 *
 *    Plugin for print NRL CropData report Module to a :class:`gxp.Viewer`.
 */
gxp.plugins.nrl.ReportCropData = Ext.extend(gxp.plugins.nrl.CropStatus, {
	/** api: ptype = nrl_report_crop_data */
    ptype: "nrl_report_crop_data",

    /** i18n **/
    titleText: 'Crop Report',
    disclaimerText: '',

    aoiSimpleSelection: false,
    hilightLayerName:"hilight_layer_selectAction",
    targetLayerName:"hidden_hilight_layer",
    // In map style
    layerStyle:{
        strokeColor: "red",
        strokeWidth: 1,
        fillOpacity:0.6,
        cursor: "pointer"
    },
    // print style
    targetLayerStyle:{
        strokeColor: "red",
        strokeWidth: 0.5,
        fillOpacity:0
    },

    // combo configs
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
            displayField:"district",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"
        },
        province:{
            typeName:"nrl:province_view",
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
            displayField:"fname",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"
        }
    },

    // area filter
    //areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",

    /** config:[defaultAreaTypeMap]
     *  ``String`` for the area type for the map generation for Pakistan. Can be 'province' or 'district' .Default it's 'province'.
     **/
    defaultAreaTypeMap: 'province',

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
            {name:'cid',   mapping: 'properties.cid'}
    ],
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        this.featureSelectorConfigs.base.url = this.dataUrl;

        //Override the comboconfig url;
        this.comboConfigs.base.url = this.dataUrl;

        var cropStatus = this.getTabPanel();

        config = Ext.apply(cropStatus,config || {});

        this.output = gxp.plugins.nrl.CropStatus.superclass.addOutput.call(this, config);
        this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlReportCropStatusChartButton" || button == 'gxp_nrlReportCropStatusChartButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }

            if(this.output.submitButton.xtype == 'gxp_nrlReportCropStatusChartButton'){
                this.output.optBtn.setDisabled(this.output.submitButton.disabled);
            }else{
                this.output.optBtn.disable();
            }
        },this);

        if(this.aoiSimpleSelection){
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
        }else{
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
        }

        this.prodUnitStore = new Ext.data.JsonStore({
             baseParams:{
                viewParams: 'class:production'
            },
            fields:this.uomFields,
            autoLoad:true,
            url: this.unitsUrl,
            root: 'features',
            idProperty:'uid'
        });

        this.areaUnitStore = new Ext.data.JsonStore({
             baseParams:{
                viewParams: 'class:area'
            },
            fields:this.uomFields,
            autoLoad:true,
            url: this.unitsUrl,
            root: 'features',
            idProperty:'uid'
        });
        this.yieldUnitStore = new Ext.data.JsonStore({
             baseParams:{
                viewParams: 'class:yield'
            },
            fields:this.uomFields,
            autoLoad:true,
            url: this.unitsUrl,
            root: 'features',
            idProperty:'uid'
        });
        return this.output;

    },

    /** private: method[getTabPanel]
     *  :arg config: ``Object``
     *  Obtain panel for the tab
     */
    getTabPanel: function(){
        var retval = {
            xtype:'form',
            title: this.titleText,
            layout: "form",
            minWidth:180,
            autoScroll:true,
            frame:true,
            buttonAlign: 'left',
            items:this.generateAllFieldItems(),
            buttons:['->', {
                iconCls:'ic_wrench',
                ref: '../optBtn',
                disabled: true,
                listeners: {
                    click: function () {
                        this.refOwner.submitButton.chartoptions.fireEvent('click');
                    }
                }
            }, this.getTabButtons()]
        };
        if (this.helpPath && this.helpPath != ''){
            retval.buttons.unshift({
                xtype: 'gxp_nrlHelpModuleButton',
                portalRef: this.portalRef,
                helpPath: this.helpPath
            });
        }
        return retval;
    },

    getTabButtons: function(){
        return this.submitButton = {
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                hilightLayerName: this.hilightLayerName,
                hilightLayerLayerStyle: this.hilightLayerStyle,
                targetLayerName: this.targetLayerName,
                targetLayerStyle: this.targetLayerStyle,
                defaultAreaTypeMap: this.defaultAreaTypeMap,
                disclaimerText: this.disclaimerText,
                url:this.dataUrl,
                prodUnitStore : new Ext.data.JsonStore({
                     baseParams:{
                        viewParams: 'class:production'
                    },
                    fields:this.uomFields,
                    autoLoad:true,
                    url: this.unitsUrl,
                    root: 'features',
                    idProperty:'uid'
                }),

                areaUnitStore : new Ext.data.JsonStore({
                     baseParams:{
                        viewParams: 'class:area'
                    },
                    fields:this.uomFields,
                    autoLoad:true,
                    url: this.unitsUrl,
                    root: 'features',
                    idProperty:'uid'
                }),
                yieldUnitStore : new Ext.data.JsonStore({
                     baseParams:{
                        viewParams: 'class:yield'
                    },
                    fields:this.uomFields,
                    autoLoad:true,
                    url: this.unitsUrl,
                    root: 'features',
                    idProperty:'uid'
                }),
                target:this.target,
                form: this,
                disabled:true,
                listeners: {
                    enable: function() {
                        this.refOwner.optBtn.enable();
                    },
                    disable: function() {
                        this.refOwner.optBtn.disable();
                    }
                }
        };
    },

    generateAllFieldItems: function(){
        var items = [
            this.getSeasonFieldItem(),
            this.getMonthRangeSelectorItem(),
            this.getAoIFieldItem()
        ];

        items.push(this.getCommodityFieldItem());

        // year filed need two fields
        var yeardFieldItems= this.getYearFieldItem();
        for(var i = 0; i< yeardFieldItems.length; i++)
            items.push(yeardFieldItems[i]);

        items.push(this.getFactorsFieldItem());

        // helper fieldset
        var helper = this.target.tools["printreporthelper"];
        items.push(helper.getFormParamatersFieldset());

        return items;
    },

    getOutputFieldItem: function(){
        return {
            fieldLabel: 'Output Type',
            xtype: 'radiogroup',
            visible:false,
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
                change: this.outputRadioChange,
                scope: this
            }
        };
    },

    outputRadioChange: function(c,checked){
        var outputValue = c.getValue().inputValue;
        var submitButton = this.output.submitButton;
        var areaSelector = this.output.singleFeatureSelector;
        //console.log("Radio change!!");

        this.selectedProvince = null;

        if(outputValue == 'data'){
            areaSelector.enable();
            submitButton.destroy();
            delete submitButton;
            this.output.addButton({
                url: this.dataUrl,//TODO externalize this
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                hilightLayerName: this.hilightLayerName,
                hilightLayerLayerStyle: this.hilightLayerStyle,
                targetLayerName: this.targetLayerName,
                targetLayerStyle: this.targetLayerStyle,
                defaultAreaTypeMap: this.defaultAreaTypeMap,
                disclaimerText: this.disclaimerText,
                target:this.target,
                form: this
            })
            var store = areaSelector.currentCombo.selectButton.store;
            //console.log(store);
            this.output.fireEvent('update',store);
            this.output.fireEvent('show');
            this.output.doLayout();
            this.output.syncSize();

        }else{
            areaSelector.enable();
            submitButton.destroy();
            delete submitButton;
            this.output.addButton({
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                hilightLayerName: this.hilightLayerName,
                hilightLayerLayerStyle: this.hilightLayerStyle,
                targetLayerName: this.targetLayerName,
                targetLayerStyle: this.targetLayerStyle,
                defaultAreaTypeMap: this.defaultAreaTypeMap,
                disclaimerText: this.disclaimerText,
                target:this.target,
                form: this
            })
            var store = areaSelector.currentCombo.selectButton.store;
            this.output.fireEvent('update',store);
            this.output.fireEvent('show');
            this.output.doLayout();
            this.output.syncSize();
        }

        if(this.output.submitButton.xtype == 'gxp_nrlReportCropStatusChartButton'){
            this.output.optBtn.setDisabled(this.output.submitButton.disabled);
        }else{
            this.output.optBtn.disable();
        }
    },

    getSeasonFieldItem: function(){
        return {
            fieldLabel: 'Season',
            xtype: 'nrl_seasonradiogroup',
            ref:'season',
            name:'season',
            anchor:'100%',
            listeners:{
                change: this.seasonRadioChange
            }
        };
    },

    getMonthRangeSelectorItem: function(){
        return {
            ref: 'monthRangeSelector',
            xtype: 'monthyearrangeselector',
            anchor:'100%'
        };
    },

    seasonRadioChange: function(c,checked){
        var commodity = this.ownerCt.Commodity;
        commodity.seasonFilter(checked.inputValue);
        var selectedCommodity = commodity.getStore().getAt(0);
        commodity.setValue(selectedCommodity.get(commodity.valueField));

        if(selectedCommodity){
            var yrs= commodity.ownerCt.yearRangeSelector;
            yrs.setMaxValue(selectedCommodity.get('max'));
            yrs.setMinValue(selectedCommodity.get('min'));

        }

        if(checked.inputValue == 'RABI'){
            //Nov-Apr
            this.refOwner.monthRangeSelector.setValue(0,10,true);
            this.refOwner.monthRangeSelector.setValue(1,15  ,true);
        }else{
            //May-Oct
            this.refOwner.monthRangeSelector.setValue(1,21,true);
            this.refOwner.monthRangeSelector.setValue(0,16,true);
        }
    },

    getAoIFieldItem: function(){
        if(!this.aoiSimpleSelection){
            return this.aoiFieldSet = {
                xtype:'nrl_aoifieldset',
                target:this.target,
                name:'region_list',
                ref:'aoiFieldSet',
                featureSelectorConfigs:this.featureSelectorConfigs,
                hilightLayerName:this.hilightLayerName,
                targetLayerName: this.targetLayerName,
                targetLayerStyle: this.targetLayerStyle,
                defaultAreaTypeMap: this.defaultAreaTypeMap,
                disclaimerText: this.disclaimerText,
                vendorParams: {cql_filter:this.areaFilter},
                layers:this.layers,
                selectableLayer: this.layers.province,
                layerStyle: this.layerStyle,
                comboConfigs:this.comboConfigs,
                target:this.target,
                areaFilter:this.areaFilter,
                listeners: {
                    regionsChange: function(store){
                        this.selectedProvince = store.getAt(0);
                        this.regionsStore = store;
                    },
                    scope:this
                }
            };
        }else{
            return this.aoiFieldSet = {
                xtype:'nrl_single_aoi_selector_alt',
                target:this.target,
                name:'region_list',
                ref:'singleFeatureSelector',
                featureSelectorConfigs:this.featureSelectorConfigs,
                hilightLayerName:this.hilightLayerName,
                vendorParams: {cql_filter:this.areaFilter},
                listeners: {
                    select: function(store){
                        this.selectedProvince = store.getAt(0);
                    },
                    scope:this
                }
            };
        }
    },

    getYearFieldItem: function(){
        return [{
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
        }];
    },

    getCommodityFieldItem: function (){
        return {
            xtype: 'nrl_commoditycombobox',
            forceSelection:true,
            allowBlank:false,
            name:'crop',
            anchor:'100%',
            ref: 'Commodity',
            store:new Ext.data.JsonStore({
                fields:this.commodityFields,
                autoLoad: true,
                url: this.rangesUrl,
                root: 'features',
                idProperty:'crop'

            }),
            listeners: {
                expand: function( combo ){
                    var season = this.ownerCt.season;
                    var radio = season.getValue();

                    if (radio && radio.getValue()){
                       this.seasonFilter(radio.inputValue);

                    }
                    var selectedRecord= combo.getStore().getById(combo.getValue());

                },
                select: function(cb,record,index){
                    //set year range for the selected crop
                    var selectedCommodity = record;
                    var yrs= cb.ownerCt.yearRangeSelector;
                    if(yrs){
                        yrs.setMaxValue(selectedCommodity.get('max'));
                        yrs.setMinValue(selectedCommodity.get('min'));
                        cb.ownerCt.referenceYear.setText(yrs.endValue.getValue());
                    }

                }
            }
        };
    },

    getFactorsFieldItem: function(){
        return new Ext.ux.grid.CheckboxSelectionGrid({
            title: 'Factors',
            enableHdMenu:false,
            hideHeaders:false,
            autoHeight:true,
            ref: 'factors',
            viewConfig: {forceFit: true},
            columns: [{
                id:'name',
                dataIndex:'label',
                header:'Factor'
            },{
                id:'unit',
                dataIndex:'unit',
                header:'Unit'
            },{
                id:'aggregation',
                dataIndex:'aggregation',
                header:'Aggregation'
            }],
            autoScroll:true,
            store: new Ext.data.JsonStore({
                url:this.factorsurl,
                root:'features',
                idProperty:'factor',
                autoLoad:true,
                fields:[
                    {name:'factor', mapping:'properties.factor'},
                    {name:'label', mapping:'properties.label'},
                    {name:'aggregation', mapping:'properties.aggregation'},
                    {name:'unit', mapping:'properties.unit'},
                    {name:'max', mapping: 'properties.max'},
                    {name:'min', mapping: 'properties.min'}
                ]
            }),
            listeners:{
                selectionchange:function(records){
                    var yearSelector = this.ownerCt.yearRangeSelector;
                    if(records.length<=0){
                       yearSelector.setDisabled(true);
                    }else{
                        var max=-99999,min=99999;
                        for(var i=0;i<records.length ;i++){
                            var rec = records[i];
                            var curmax = rec.get('max');
                            var curmin = rec.get('min');
                            if(curmax > max){
                                max = curmax;
                            }
                            if(curmin < min){
                                min = curmin;
                            }
                        }
                        if(max==99999|| min == -99999){
                             yearSelector.setDisabled(true);
                        }else{
                            yearSelector.setDisabled(false);
                            yearSelector.minValue = min;
                            yearSelector.maxValue = max;
                            yearSelector.doLayout();
                        }
                    }
                }
            }
        });
    }

 });

 Ext.preg(gxp.plugins.nrl.ReportCropData.prototype.ptype, gxp.plugins.nrl.ReportCropData);
