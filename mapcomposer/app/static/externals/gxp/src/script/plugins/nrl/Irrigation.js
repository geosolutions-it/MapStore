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
 *  class = Irrigation
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: Irrigation(config)
 *
 *    Plugin for adding NRL Irrigation Module to a : class:`gxp.Viewer`.
 */
gxp.plugins.nrl.Irrigation = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = nrl_irrigation */
    titleText: 'Irrigation',
    outputTypeText: 'Output Type',
    ptype: "nrl_irrigation",
    hilightLayerName: "Irrigation_Selection_Layer",
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
        district: {
            typeName: "nrl:district_select",
            queriableAttributes: [
                "district",
                "province"
            ],
            recordModel: [{
                name: "id",
                mapping: "id"
            }, {
                name: "geometry",
                mapping: "geometry"
            }, {
                name: "name",
                mapping: "properties.district"
            }, {
                name: "province",
                mapping: "properties.province"
            }, {
                name: "properties",
                mapping: "properties"
            }],
            displayField: "district",
            tpl: "<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"
        },
        province: {
            typeName: "nrl:province_view",
            recordModel: [{
                name: "id",
                mapping: "id"
            }, {
                name: "geometry",
                mapping: "geometry"
            }, {
                name: "name",
                mapping: "properties.province"
            }, {
                name: "properties",
                mapping: "properties"
            }],
            sortBy: "province",
            queriableAttributes: [
                "province"
            ],
            displayField: "fname",
            tpl: "<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"
        }
    },
    metadataFlowFields: [
        {
            name: 'river',
            mapping: 'properties.river'
        }, {
            name: 'label',
            mapping: 'properties.river',
            convert: function(v, rec){
                return nrl.chartbuilder.util.toTitleCase(v);
            }
        }, {
            name: 'max_dec_abs',
            mapping: 'properties.max_dec_abs'
        }, {
            name: 'min_dec_abs',
            mapping: 'properties.min_dec_abs'
        }
    ],
    uomFields: [
        {
            name: 'id',
            mapping: 'properties.uid'
        }, {
            name: 'cid',
            mapping: 'properties.cid'
        }, {
            name: 'cls',
            mapping: 'properties.cls'
        }, {
            name: 'coefficient',
            mapping: 'properties.coefficient'
        }, {
            name: 'description',
            mapping: 'properties.description'
        }, {
            name: 'filter',
            mapping: 'properties.filter'
        }, {
            name: 'name',
            mapping: 'properties.name'
        }, {
            name: 'shortname',
            mapping: 'properties.shortname'
        }
    ],
    radioQtipTooltip: "You have to be logged in to use this method",
    /**
     * api: method[addActions]
     */
    addOutput: function(config) {
        var loadFlowStoreTrigger = function() {
            var dataStore = this.output.riversGrid.getStore();
            // keep in mind: there is only one record for each river
            for (var i = 0; i < dataStore.data.items.length; i++) {
                var dataItem = dataStore.data.items[i].data;

                var riverMetadata = {};
                for (var prop in dataItem)
                    if (prop != 'river')
                        riverMetadata[prop] = dataItem[prop];

                if (this.output.metadata.flow == undefined)
                    this.output.metadata.flow = {};
                this.output.metadata.flow[dataItem.river] = riverMetadata;
            }
        };

        this.comboConfigs.base.url = this.dataUrl;
        var apptarget = this.target;

        var Irrigation = {
            isRendered: false,
            xtype: 'form',
            title: this.titleText,
            layout: "form",
            minWidth: 180,
            autoScroll: true,
            frame: true,
            items: [{ // OUTPUT TYPE radiogroup ------------------------------
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
                items: [{
                    boxLabel: 'Data',
                    name: 'outputtype',
                    listeners: this.setRadioQtip(this.radioQtipTooltip),
                    inputValue: 'data',
                    disabled: true
                }, {
                    boxLabel: 'Chart',
                    name: 'outputtype',
                    inputValue: 'chart',
                    checked: true
                }],
                listeners: {
                    change: function(c, checked) {
                        var outputValue = c.getValue().inputValue;
                        var submitButton = this.output.submitButton;
                        var aoiFieldSet = this.output.aoiFieldSet;
                        var areaSelector = aoiFieldSet.AreaSelector;
                        var gran_type = aoiFieldSet.gran_type.getValue().inputValue;
                        var submitButtonState = submitButton.disabled;
                        var xType = 'gxp_nrlIrrigation' + (outputValue == 'data' ? 'Tab' : 'Chart') + 'Button';

                        this.output.outputMode = outputValue;
                        submitButton.destroy();
                        delete submitButton;

                        this.output.addButton({
                            url: this.dataUrl,
                            typeName: this.typeNameData,
                            xtype: xType,
                            ref: '../submitButton',
                            highChartExportUrl: this.highChartExportUrl,
                            target: this.target,
                            form: this
                        });

                        var store = areaSelector.store;
                        this.output.fireEvent('update', store);
                        this.output.fireEvent('show');

                        this.output.doLayout();
                        this.output.syncSize();

                        this.output.submitButton.setDisabled(submitButtonState);

                        if (outputValue != 'data')
                            this.output.submitButton.initChartOpt(this.output);
                    },
                    scope: this
                }
            }, { // TIME RANGE  radiogroup ------------------------------
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
                disabled: false,
                columns: 2,
                items: [{
                    boxLabel: 'Monthly',
                    name: 'timerange',
                    inputValue: 'annual',
                    checked: true
                }, {
                    boxLabel: '10-day',
                    name: 'timerange',
                    inputValue: 'monthly'
                }],
                listeners: {
                    change: function(c, checked) {
                        var checkedVal = checked.inputValue;
                        switch (checkedVal) {
                            case ('annual'):
                                {
                                    this.setAnnualMode();
                                }
                                break;
                            case ('monthly'):
                                {
                                    this.setMonthlyMode();
                                }
                                break;
                        }
                        if (this.ownerCt.source.getValue().inputValue == 'flow'){
                            var selectedRivers = this.ownerCt.riversGrid.getSelections();
                            if (selectedRivers.length != 0)
                                this.ownerCt.setUpMaxAndMin(selectedRivers);
                        }
                    }
                },
                // shows controllers for select a years range.
                setAnnualMode: function() {
                    this.ownerCt.monthRangeSelector.hide();
                },
                // shows controller to select a month range
                // from a selected reference year.
                setMonthlyMode: function() {
                    this.ownerCt.monthRangeSelector.show();
                },
                // sets the initial state for the components
                // used to select time options.
                initTimeSelection: function() {
                    this.setAnnualMode();
                }
            }, { // YEAR range selector ---------------------------------
                fieldLabel: 'Data Series',
                ref: 'yearRangeSelector',
                xtype: 'yearrangeselector',
                anchor: '100%',
                disabled: false,
                hidden: false,
                listeners: {
                    change: function(from, to){
                        if (this.output.outputType.getValue()){
                            var outputtype = this.output.outputType.getValue().inputValue;
                            if (outputtype != 'data')
                                this.output.submitButton.initChartOpt(this.output);
                        }
                    },
                    scope: this
                }
            }, { // MONTH range selector --------------------------------
                ref: 'monthRangeSelector',
                xtype: 'monthyearrangeselector',
                anchor: '100%',
                noCrossYear: true,
                disabled: false,
                hidden: true
            }, { // SOURCE radio ----------------------------------------
                style: {
                    marginTop: '6px'
                },
                fieldLabel: 'Source',
                xtype: 'radiogroup',
                anchor: '100%',
                autoHeight: true,
                ref: 'source',
                title: this.outputTypeText,
                defaultType: 'radio',
                disabled: false,
                columns: 1,
                items: [{
                    boxLabel: 'River Water Inflow at Rim Stations',
                    name: 'source',
                    inputValue: 'flow',
                    checked: true,
                    dataUrl: this.metadataFlowUrl
                }, {
                    boxLabel: 'Irrigation Water Supply from Canal Head Works',
                    name: 'source',
                    inputValue: 'supply',
                    dataUrl: this.metadataSupplyUrl
                    
                }],
                listeners: {
                    change: function(radioGroup, checked){
                        this.refOwner.aoiFieldSet.setVisible(checked.inputValue == 'supply');
                        this.refOwner.riversGrid.setVisible(checked.inputValue == 'flow');
                        this.refOwner.uomFlow.setVisible(checked.inputValue == 'flow');
                        this.refOwner.uomSupply.setVisible(checked.inputValue == 'supply');
                        // TODO: remove selection on map when river source is activate !
                        if (this.refOwner.metadata[checked.inputValue] == undefined){
                            // TODO: load metadata to init time selection controls
                            var url = checked.dataUrl;
                            if (checked.inputValue == 'supply'){
                                Ext.Ajax.request({
                                    url: url,
                                    success: function(response, opts) {
                                        var obj = Ext.decode(response.responseText);
                                        var data = obj.features[0].properties;
                                        this.refOwner.metadata.supply = {};
                                        this.refOwner.metadata.supply.district = {
                                            min_dec_abs: data.min_district,
                                            max_dec_abs: data.max_district
                                        };
                                        this.refOwner.metadata.supply.province = {
                                            min_dec_abs: data.min_province,
                                            max_dec_abs: data.max_province
                                        };
                                        this.ownerCt.setUpMaxAndMin();
                                    },
                                    failure: function(response, opts) {
                                        console.log('server-side failure with status code ' + response.status);
                                    },
                                    scope: radioGroup
                                });
                            }else{
                                // DO NOTHING: metadata related to rivers flow are loaded
                                //             at riversGrid store load time.
                            }
                        }else{
                            if (checked.inputValue == 'flow'){
                                var selectedRivers = this.ownerCt.riversGrid.getSelections();
                                if (selectedRivers.length != 0)
                                    this.ownerCt.setUpMaxAndMin(selectedRivers);
                            }else{
                                this.ownerCt.setUpMaxAndMin();
                            }
                        }
                        this.refOwner.updateSubmitBtnState();
                        var outputtype = this.refOwner.outputType.getValue().inputValue;
                        if (outputtype != 'data')
                            this.refOwner.submitButton.initChartOpt(this.refOwner);
                    }
                }
            }, { // AOI selector ----------------------------------------
                style: {
                    marginTop: '6px'
                },
                xtype: 'nrl_aoifieldset',
                hidden: true,
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
                disabledGrantype: ['pakistan'],
                listeners: {
                    grantypeChange: function(itemSelected) {
                        var granType = itemSelected.inputValue;
                        var outputtype = this.ownerCt.outputType.getValue().inputValue;
                        
                        this.refOwner.updateSubmitBtnState();
                        this.refOwner.setUpMaxAndMin();
                       if (outputtype != 'data')
                           this.ownerCt.submitButton.initChartOpt(this.ownerCt);
                    },
                    regionsChange: function(s) {
                        var granType = this.gran_type.getValue().inputValue;
                        var outputtype = this.ownerCt.outputType.getValue().inputValue;

                        this.refOwner.updateSubmitBtnState();
                       if (outputtype != 'data')
                           this.ownerCt.submitButton.initChartOpt(this.ownerCt);
                    }
                }
            }, { // RIVES grid ------------------------------------------
                xtype: 'nrl_checkboxcelectiongrid',
                title: 'Rivers at Rim Station',
                enableHdMenu: false,
                hideHeaders: false,
                hidden: false,
                ref: 'riversGrid',
                height: 160,
                store: new Ext.data.JsonStore({
                    fields: this.metadataFlowFields,
                    autoLoad: true,
                    url: this.metadataFlowUrl,
                    root: 'features',
                    idProperty: 'river',
                    listeners: {
                        scope: this,
                        load: loadFlowStoreTrigger
                    }
                }),
                columns: {
                    id: 'river_lbl',
                    header: '',
                    dataIndex: 'label'
                },
                allowBlank: false,
                name: 'rivers',
                anchor: '100%',
                listeners: {
                    scope: this,
                    selectionchange: function(records) {
                        if (records.length != 0)
                            this.output.setUpMaxAndMin(records);
                        this.output.updateSubmitBtnState();

                        var outputtype = this.output.outputType.getValue().inputValue;
                       if (outputtype != 'data')
                           this.output.submitButton.initChartOpt(this.output);
                    }
                },
                setDisabledTimeOptions: function(boolVal) {
                    var timeWidgets = [
                        this.ownerCt.timerange,
                        this.ownerCt.yearRangeSelector,
                        this.ownerCt.yearSelector,
                        this.ownerCt.monthRangeSelector
                    ];
                    for (var i = 0; i < timeWidgets.length; i++)
                        if (boolVal)
                            timeWidgets[i].disable();
                        else
                            timeWidgets[i].enable();
                }
            }, { // UOM fieldset ----------------------------------------
                style: {
                    marginTop: '12px'
                },
                xtype: 'fieldset',
                title: 'Unit Of Measure',
                items: [{
                    xtype: 'combo',
                    fieldLabel: 'Water Flow',
                    editable: false,
                    ref: '../uomFlow',
                    anchor: '100%',
                    store: new Ext.data.JsonStore({
                        baseParams: {
                            viewParams: 'class:waterflow'
                        },
                        fields: this.uomFields,
                        autoLoad: true,
                        url: this.factorsurl,
                        root: 'features',
                        idProperty: 'uid'
                    }),
                    displayField: 'shortname',
                    valueField: 'coefficient',
                    triggerAction: 'all',
                    mode: 'local',
                    autoLoad: true,
                    allowBlank: false,
                    value: this.defaultUOMFlow,
                    hidden: false,
                    listeners: {
                        select: function(){
                            var outputtype = this.ownerCt.ownerCt.outputType.getValue().inputValue;
                            if (outputtype != 'data')
                                this.ownerCt.ownerCt.submitButton.initChartOpt(this.ownerCt.ownerCt);
                        },
                        scope: this.refOwner
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Water Supply',
                    editable: false,
                    ref: '../uomSupply',
                    anchor: '100%',
                    store: new Ext.data.JsonStore({
                        baseParams: {
                            viewParams: 'class:watersupply'
                        },
                        fields: this.uomFields,
                        autoLoad: true,
                        url: this.factorsurl,
                        root: 'features',
                        idProperty: 'uid'
                    }),
                    displayField: 'shortname',
                    valueField: 'coefficient',
                    triggerAction: 'all',
                    mode: 'local',
                    autoLoad: true,
                    allowBlank: false,
                    value: this.defaultUOMSupply,
                    hidden: true,
                    listeners: {
                        select: function(){
                            var outputtype = this.ownerCt.ownerCt.outputType.getValue().inputValue;
                            if (outputtype != 'data')
                                this.ownerCt.ownerCt.submitButton.initChartOpt(this.ownerCt.ownerCt);
                        },
                        scope: this.refOwner
                    }
                }]
            }],
            listeners: {
                                                    ////////
                afterlayout: function(f) {                // this couple of handler is used with the
                    if (f.isRendered) {                   // varible 'isRendered' to execute 'initTimeSelection()'
                        f.isRendered = false;             // only once at the beginning, when the form is show
                        f.timerange.initTimeSelection();  // for the first time.
                    }                                     //
                },                                        //
                afterRender: function(f) {                //
                        f.isRendered = true;              //
                    }                                     //
                                                    ////////
            },
            buttons: [{
                url: this.dataUrl,
                xtype: 'gxp_nrlIrrigationChartButton',
                typeName: this.typeNameData,
                ref: '../submitButton',
                target: this,
                form: this,
                disabled: true
            }],
            metadata: {
                flow: undefined,
                supply: undefined
            },
            // set the max and min values for
            //  - yearRangeSelector
            //  - monthRangeSelector
            //  - yearSelector
            setUpMaxAndMin: function(records) {
                var startRange;
                var endRange;

                if (records){
                    startRange = (Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Math.pow(2,53)-1);
                    endRange = (Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : -(Math.pow(2, 53) - 1));

                    for (var rIndex = 0; rIndex < records.length; rIndex++) {
                       var recData = records[rIndex].data;
                        startRange = recData.min_dec_abs < startRange ? recData.min_dec_abs : startRange;
                        endRange = recData.max_dec_abs > endRange ? recData.max_dec_abs : endRange;
                    }
                }else{
                    var gran_type = this.aoiFieldSet.gran_type.getValue().inputValue;
                    startRange = parseInt(this.metadata.supply[gran_type].min_dec_abs);
                    endRange = parseInt(this.metadata.supply[gran_type].max_dec_abs);
                }

                // gets min and max year from absolute decade
                var minYear = nrl.chartbuilder.util.getDekDate(startRange).year;
                var maxYear = nrl.chartbuilder.util.getDekDate(endRange).year;

                // sets up yearRangeSelector max & min values
                this.yearRangeSelector.setMaxValue(maxYear);
                this.yearRangeSelector.setMinValue(minYear);

                this.yearRangeSelector.slider.setValue(0, minYear);
                this.yearRangeSelector.slider.setValue(1, maxYear);
            },
            updateSubmitBtnState: function(){
                var gran_type = this.aoiFieldSet.gran_type.getValue().inputValue;
                var selectedRivers = this.riversGrid.getSelections();
                var regionList = this.aoiFieldSet.selectedRegions.getValue();
                var sourceIsFlow = (this.source.getValue().inputValue == 'flow');

                var disableBtn = (sourceIsFlow ? (selectedRivers.length == 0) : (gran_type != 'pakistan' && regionList.length == 0) );
                this.submitButton.setDisabled(disableBtn);
            },
            outputMode: 'chart'
        };

        config = Ext.apply(Irrigation, config || {});
        this.output = gxp.plugins.nrl.Irrigation.superclass.addOutput.call(this, config);

        //hide selection layer on tab change
        this.output.on('beforehide', function() {
            var button = this.output.aoiFieldSet.AreaSelector.selectButton;
            button.toggle(false);
            var lyr = button.hilightLayer;
            if (!lyr) {
                return;
            }
            lyr.setVisibility(false);

        }, this);
        this.output.on('show', function() {
            var button = this.output.aoiFieldSet.AreaSelector.selectButton;

            var lyr = button.hilightLayer;
            if (!lyr) {
                return;
            }
            lyr.setVisibility(true);

        }, this);

        return this.output;
    },
    setRadioQtip: function(t) {
        var o = {
            afterrender: function() {
                //Ext.QuickTips.init();
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-' + this.id + ' div'));
                Ext.QuickTips.register({
                    target: id.elements[id.elements.length - 1].id,
                    text: t
                });
            },
            destroy: function() {
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-' + this.id + ' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length - 1].id);
            },
            enable: function() {
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-' + this.id + ' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length - 1].id);
            },
            disable: function() {
                //Ext.QuickTips.init();
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-' + this.id + ' div'));
                Ext.QuickTips.register({
                    target: id.elements[id.elements.length - 1].id,
                    text: t
                });
            }
        };
        return o;
    }
});

Ext.preg(gxp.plugins.nrl.Irrigation.prototype.ptype, gxp.plugins.nrl.Irrigation);