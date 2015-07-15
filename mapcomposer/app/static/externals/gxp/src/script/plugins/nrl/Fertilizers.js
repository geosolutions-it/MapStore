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
 * @author Mirco Bertelli
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Fertilizers
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: Fertilizers(config)
 *
 *    Plugin for adding NRL Fertilizers Module to a : class:`gxp.Viewer`.
 */
gxp.plugins.nrl.Fertilizers = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = nrl_fertilizers */
    titleText: 'Fertilizers',
    outputTypeText: 'Output Type',
    ptype: "nrl_fertilizers",
    hilightLayerName: "Fertilizers_Selection_Layer",
    comboConfigs: {
        base: {
            anchor: '100%',
            fieldLabel: 'District',
            predicate: "ILIKE",
            width: 250,
            sortBy: "province",
            ref: 'singleSelector',
            displayField: "name",
            pageSize: 10

        },
        district:{
            typeName: "nrl:district_select",
            queriableAttributes: [
                "district",
                "province"
            ],
            recordModel: [
                {
                    name: "id",
                    mapping: "id"
                },{
                    name: "geometry",
                    mapping: "geometry"
                },{
                    name: "name",
                    mapping: "properties.district"
                },{
                    name: "province",
                    mapping: "properties.province"
                },{
                    name: "properties",
                    mapping: "properties"
                }
            ],
            displayField: "district",
            tpl: "<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"
        },
        province:{
            typeName: "nrl:province_view",
            recordModel: [
                {
                    name: "id",
                    mapping: "id"
                },{
                    name: "geometry",
                    mapping: "geometry"
                },{
                    name: "name",
                    mapping: "properties.province"
                },{
                    name: "properties",
                    mapping: "properties"
                }
            ],
            sortBy: "province",
            queriableAttributes: [
                "province"
            ],
            displayField: "fname",
            tpl: "<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"
        }
    },
    metadataUrl: "http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:fertilizers_metadata&outputFormat=json",
    metadataFields: [
        {name: 'nutrient', mapping: 'properties.nutrient'},
        {name: 'oldest_nat_y', mapping: 'properties.oldest_nat_y'},
        {name: 'newest_nat_y', mapping: 'properties.newest_nat_y'},
        {name: 'oldest_prov_y', mapping: 'properties.oldest_prov_y'},
        {name: 'newest_prov_y', mapping: 'properties.newest_prov_y'},
        {name: 'oldest_dist_y', mapping: 'properties.oldest_dist_y'},
        {name: 'newest_dist_y', mapping: 'properties.newest_dist_y'}
    ],
    radioQtipTooltip: "You have to be logged in to use this method",
     /**
      * api: method[addActions]
      */
    addOutput: function(config) {
        var loadStoreTrigger = function(){
            var dataStore = this.output.fertilizers.getStore();
            for(var i=0; i<dataStore.data.items.length; i++){
                var dataItem = dataStore.data.items[i].data;
                var fertMetadata = {
                    dataNationalYears: {
                        oldest: undefined,
                        newest: undefined
                    },
                    dataProvincialYears: {
                        oldest: undefined,
                        newest: undefined
                    },
                    dataDistrictYears: {
                        oldest: undefined,
                        newest: undefined
                    }
                };
                var fertLbl;
                for(var prop in dataItem){
                    switch(prop){
                        case 'nutrient': fertLbl = dataItem[prop]; break;
                        case 'oldest_nat_y': fertMetadata.dataNationalYears.oldest = dataItem[prop]; break;
                        case 'newest_nat_y': fertMetadata.dataNationalYears.newest = dataItem[prop]; break;
                        case 'oldest_prov_y': fertMetadata.dataProvincialYears.oldest = dataItem[prop]; break;
                        case 'newest_prov_y': fertMetadata.dataProvincialYears.newest = dataItem[prop]; break;
                        case 'oldest_dist_y': fertMetadata.dataDistrictYears.oldest = dataItem[prop]; break;
                        case 'newest_dist_y': fertMetadata.dataDistrictYears.newest = dataItem[prop]; break;
                    }
                }
                this.output.fertilizers.metadata[fertLbl] = fertMetadata;
            }
            var max = -1, min = 999999;
            for(var f in this.output.fertilizers.metadata){
                var oldestY = this.output.fertilizers.metadata[f].dataProvincialYears.oldest;
                var newestY = this.output.fertilizers.metadata[f].dataProvincialYears.newest;
                max = Math.max(max, newestY);
                min = Math.min(min, oldestY);
            }
            this.output.yearRangeSelector.setMaxValue(max);
            this.output.yearRangeSelector.setMinValue(min);
        };

        this.comboConfigs.base.url = this.dataUrl;
        var apptarget = this.target;
        var Fertilizers = {
            isRendered: false,
            xtype: 'form',
            title: this.titleText,
            layout: "form",
            minWidth: 180,
            autoScroll: true,
            frame: true,
            buttonAlign: 'left',
            items:[
                {   // OUTPUT TYPE radiogroup ------------------------------
                    fieldLabel: this.outputTypeText,
                    xtype: 'radiogroup',
                    anchor: '100%',
                    autoHeight: true,
                    name: 'outputType',
                    ref: 'outputType',
                    checkboxToggle: true,
                    title: this.outputTypeText,
                    autoHeight: true,
                    defaultType: 'radio', // each item will be a radio button
                    items: [
                        {
                            boxLabel: 'Data',
                            name: 'outputtype',
                            listeners: this.setRadioQtip(this.radioQtipTooltip),
                            inputValue: 'data',
                            disabled: true
                        },{
                            boxLabel: 'Chart',
                            name: 'outputtype',
                            inputValue: 'chart',
                            checked: true
                        }
                    ],
                    listeners: {
                        change: function(c,checked){
                            var outputValue = c.getValue().inputValue;
                            var submitButton = this.output.submitButton;
                            var aoiFieldSet = this.output.aoiFieldSet;
                            var areaSelector = aoiFieldSet.AreaSelector;
                            var gran_type = aoiFieldSet.gran_type.getValue().inputValue;
                            var submitButtonState = submitButton.disabled;
                            var xType = 'gxp_nrlFertilizer' + (outputValue == 'data' ? 'Tab' : 'Chart') + 'Button';

                            this.output.outputMode = outputValue;
                            submitButton.destroy();
                            delete submitButton;

                            this.output.addButton({
                                url: this.dataUrl,
                                typeName: this.typeNameData,
                                xtype: xType,
                                ref: '../submitButton',
                                highChartExportUrl: this.highChartExportUrl,
                                target:this.target,
                                form: this
                            });

                            var store = areaSelector.store;
                            this.output.fireEvent('update',store);
                            this.output.fireEvent('show');
                            this.output.doLayout();
                            this.output.syncSize();

                            this.output.submitButton.setDisabled(submitButtonState);

                            if(this.output.submitButton.xtype == 'gxp_nrlFertilizerChartButton'){
                                this.output.optBtn.setDisabled(this.output.submitButton.disabled);
                            }else{
                                this.output.optBtn.disable();
                            }
                        },
                        scope: this
                    }
                },{ // TIME RANGE  radiogroup ------------------------------
                    style: {
                        marginTop: '6px'
                    },
                    fieldLabel: 'Data Aggregation',
                    xtype: 'radiogroup',
                    anchor: '100%',
                    autoHeight: true,
                    ref: 'timerange',
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    disabled: true,
                    columns: 2,
                    items:[
                        {boxLabel: 'Annual' , name: 'timerange', inputValue: 'annual', checked: true},
                        {boxLabel: 'Monthly' , name: 'timerange', inputValue: 'monthly'}
                    ],
                    listeners: {
                        change: function(c, checked){
                            var checkedVal = checked.inputValue;
                            switch (checkedVal){
                                case ('annual'):{
                                    this.setAnnualMode();
                                }break;
                                case ('monthly'):{
                                    this.setMonthlyMode();
                                }break;
                            }
                        }
                    },
                    // shows controllers for select a years range.
                    setAnnualMode: function(){
                        this.ownerCt.yearRangeSelector.show();
                        this.ownerCt.yearSelector.hide();
                        this.ownerCt.monthRangeSelector.hide();
                    },
                    // shows controller to select a month range
                    // from a selected reference year.
                    setMonthlyMode: function(){
                        this.ownerCt.yearRangeSelector.hide();
                        this.ownerCt.yearSelector.show();
                        this.ownerCt.monthRangeSelector.show();
                    },
                    // sets the initial state for the components
                    // used to select time options.
                    initTimeSelection: function(){
                        this.setAnnualMode();
                        this.ownerCt.setShowNoDataInfo(true);
                        this.ownerCt.monthRangeSelector.show();
                        this.ownerCt.monthRangeSelector.slider.setValue(1, 11);
                        this.ownerCt.monthRangeSelector.hide();
                    }
                },{ // YEAR compobox ---------------------------------------
                    fieldLabel: 'Data series',
                    name: 'year',
                    disabled: false,
                    xtype: 'singleyearcombobox',
                    anchor: '100%',
                    ref: 'yearSelector',
                    disabled: true
                },{ // MONTH range selector --------------------------------
                    fieldLabel: 'Time span',
                    ref: 'monthRangeSelector',
                    xtype: 'monthyearrangeselector',
                    anchor: '100%',
                    noCrossYear: false,
                    disabled: true
                },{ // YEAR range selector ---------------------------------
                    fieldLabel: 'Data series',
                    ref: 'yearRangeSelector',
                    xtype: 'yearrangeselector',
                    anchor: '100%',
                    disabled: true
                },{ // AOI selector ----------------------------------------
                    style: {
                        marginTop: '6px'
                    },
                    xtype: 'nrl_aoifieldset',
                    name: 'region_list',
                    ref: 'aoiFieldSet',
                    layerStyle: this.layerStyle,
                    anchor: '100%',
                    target: this.target,
                    comboConfigs: this.comboConfigs,
                    areaFilter: this.areaFilter,
                    hilightLayerName: this.hilightLayerName,
                    layers: this.layers,
                    selectableLayer: this.layers.province,
                    listeners: {
                        grantypeChange: function(itemSelected){
                            var granType = itemSelected.inputValue;
                            var records = this.ownerCt.fertilizers.getSelections();

                            this.ownerCt.enableOptionsIfDataExists(records, granType);
                        },
                        regionsChange: function(s){
                            var granType = this.gran_type.getValue().inputValue;
                            var records = this.ownerCt.fertilizers.getSelections();

                            this.ownerCt.enableOptionsIfDataExists(records, granType);
                        }
                    }
                },{   // FERTILIZERS grid ------------------------------------
                    xtype: 'nrl_checkboxcelectiongrid',
                    title: 'Fertilizers (tons)',
                    enableHdMenu: false,
                    hideHeaders: false,
                    hidden: false,
                    ref: 'fertilizers',
                    height: 160,
                    store: new Ext.data.JsonStore({
                        fields: this.metadataFields,
                        autoLoad: true,
                        url: this.metadataUrl,
                        root: 'features',
                        idProperty:'nutrient',
                        listeners:{
                            scope:this,
                            load:loadStoreTrigger
                        }
                    }),
                    columns: {
                        id: 'nutrient_lbl',
                        header: '',
                        dataIndex: 'nutrient'
                    },
                    allowBlank: false,
                    name: 'fertilizers',
                    anchor: '100%',
                    listeners: {
                        scope: this,
                        selectionchange: function(records){
                            var granType = this.output.aoiFieldSet.gran_type.getValue().inputValue;
                            this.output.enableOptionsIfDataExists(records, granType);
                            // generates default chart options
                            if(this.output.outputMode != 'data')
                                this.output.submitButton.initChartOpt(this.output);
                        }
                    },
                    // it'll contains, for each retilizers, start and end year for
                    // national data, province data and district data.
                    metadata: {},
                    setDisabledTimeOptions: function(boolVal){
                        var timeWidgets = [
                            this.ownerCt.timerange,
                            this.ownerCt.yearRangeSelector,
                            this.ownerCt.yearSelector,
                            this.ownerCt.monthRangeSelector
                        ];
                        for(var i=0; i<timeWidgets.length; i++)
                            if (boolVal)
                                timeWidgets[i].disable();
                            else
                                timeWidgets[i].enable();
                    }
                },{ // INFO fieldset ---------------------------------------
                    title: 'Note',
                    style: {
                        marginTop: '12px'
                    },
                    xtype: 'fieldset',
                    ref: 'infofieldset',
                    anchor: '100%',
                    items: [
                        {
                            xtype: 'label',
                            html: 'ok',
                            ref: 'lbl'
                        }
                    ],
                    setInfo: function(html){
                        this.lbl.setText(html, false);
                    },
                    hidden: true
                }
            ],
            listeners: {
                                                    ////////
                afterlayout: function(f){                 // this couple of handler is used with the
                    if (f.isRendered){                    // varible 'isRendered' to execute 'initTimeSelection()'
                        f.isRendered = false;             // only one time at the beginning, when the form is show
                        f.timerange.initTimeSelection();  // for the first time.
                    }                                     //
                },                                        //
                afterRender: function(f){                 //
                    f.isRendered = true;                  //
                }                                         //
                                                    ////////
            },
            buttons:['->', {
                    iconCls:'ic_wrench',
                    ref: '../optBtn',
                    disabled: true,
                    listeners: {
                        click: function () {
                            this.refOwner.submitButton.chartoptions.fireEvent('click');
                        }
                    }
                }, {
                    url: this.dataUrl,
                    xtype: 'gxp_nrlFertilizerChartButton',
                    typeName: this.typeNameData,
                    ref: '../submitButton',
                    target: this,
                    form: this,
                    disabled: true
                }
            ],
            noDataAlertWasShown: false,
            showNoDataAlert: function(){
                if (!this.noDataAlertWasShown){
                    //Ext.MessageBox.alert('No data available', 'There are not data available for this search criteria.');
                    this.noDataAlertWasShown = true;
                }
            },
            setShowNoDataInfo: function(b){
                if (b){
                    var gran_type = this.aoiFieldSet.gran_type.getValue().inputValue;
                    var selectedFert = this.fertilizers.getSelections();
                    var fertList = [];
                    for(var i=0; i<selectedFert.length; i++){
                        fertList.push('<b>' + selectedFert[i].data.nutrient + '</b>');
                    }
                    var msg = "";
                    if (fertList.length > 0)
                        msg = 'There are not <b>' + (gran_type == 'pakistan' ? 'national' : gran_type) + '</b> data for the fertilizer' + (fertList.length > 1 ? 's' : '') + ': ' + fertList.join(', ');
                    else{
                        msg = 'There are not fertilizers selected';
                    }
                    this.infofieldset.setInfo(msg);
                    this.infofieldset.show();
                }else{
                    this.infofieldset.hide();
                }
            },
            enableOptionsIfDataExists: function(records, granType){
                if(records.length == 0){
                    // there aren't fertilizers selected.
                    // all time-options should be disabled.
                    this.fertilizers.setDisabledTimeOptions(true);
                    // the next selection of a fertilizer, if there aren't
                    // data then an alert will show.
                    this.noDataAlertWasShown = false;
                    this.submitButton.disable();
                    this.setShowNoDataInfo(true);
                }else{
                    // in this case, time-options should be initialized
                    // with the shorter year renge for which the data
                    // exist.
                    // time-options must be enabled.
                    this.fertilizers.setDisabledTimeOptions(false);
                    this.setShowNoDataInfo(false);
                    if (this.aoiFieldSet.selectedRegions.getValue().length != 0 || granType == 'pakistan')
                        this.submitButton.enable();
                    else
                        this.submitButton.disable();

                    // computes min & max year given the area-option selected and
                    // the fertilizers.
                    var oldest_year, newest_year;
                    var oldests = [], newests = [];
                    for(var i=0; i<records.length; i++){
                        var record = records[i].data;

                        switch(granType){
                            case 'province': {
                                if (record.oldest_prov_y) oldests.push(record.oldest_prov_y);
                                if (record.newest_prov_y) newests.push(record.newest_prov_y);
                            }break;
                            case 'district': {
                                if (record.oldest_dist_y) oldests.push(record.oldest_dist_y);
                                if (record.newest_dist_y) newests.push(record.newest_dist_y);
                            }break;
                            case 'pakistan': {
                                if (record.oldest_nat_y) oldests.push(record.oldest_nat_y);
                                if (record.newest_nat_y) newests.push(record.newest_nat_y);
                            }break;
                        }
                    }
                    oldest_year = oldests.length ? Math.min.apply(null, oldests) : undefined;
                    newest_year = newests.length ? Math.max.apply(null, newests) : undefined;

                    if (!oldest_year || !newest_year){
                        // there aren't data for this criteria
                        this.fertilizers.setDisabledTimeOptions(true);
                        this.submitButton.disable();
                        this.showNoDataAlert();
                        this.setShowNoDataInfo(true);
                    }else{
                        // setup store for year combo
                        var yearSelector = this.yearSelector;
                        var years = [];
                        for (var y=oldest_year; y<=newest_year; y++)
                            years.push([y]);

                        yearSelector.getStore().removeAll();
                        yearSelector.getStore().loadData(years, false);
                        yearSelector.setValue(oldest_year);

                        // setup max and min for year range selector
                        var yearRangeSelector = this.yearRangeSelector;
                        var currentMax = yearRangeSelector.endValue.getValue();
                        var currentMin = yearRangeSelector.startValue.getValue();

                        // avoids validation error
                        if (oldest_year > currentMin){
                            yearRangeSelector.setMaxValue(newest_year);
                            yearRangeSelector.setMinValue(oldest_year);
                        }else{
                            yearRangeSelector.setMinValue(oldest_year);
                            yearRangeSelector.setMaxValue(newest_year);
                        }
                    }
                }
                if(this.submitButton.xtype == 'gxp_nrlFertilizerChartButton'){
                    this.optBtn.setDisabled(this.submitButton.disabled);
                }else{
                    this.optBtn.disable();
                }
            },
            outputMode: 'chart'
        };

        if (this.helpPath && this.helpPath != ''){
            Fertilizers.buttons.unshift({
                xtype: 'gxp_nrlHelpModuleButton',
                portalRef: this.portalRef,
                helpPath: this.helpPath
            });
        }

        config = Ext.apply(Fertilizers, config || {});
        this.output = gxp.plugins.nrl.Fertilizers.superclass.addOutput.call(this, config);

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

Ext.preg(gxp.plugins.nrl.Fertilizers.prototype.ptype, gxp.plugins.nrl.Fertilizers);
