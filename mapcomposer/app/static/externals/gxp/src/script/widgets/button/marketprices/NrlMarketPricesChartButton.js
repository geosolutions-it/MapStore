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

Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: NrlFertilizerButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlMarketPricesChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlMarketPricesChartButton',
    iconCls: "gxp-icon-nrl-chart",
    text: 'Generate Chart',
    optionsTitle: "Chart Options",
    tabPanel: 'id_mapTab',
    targetTab: 'marketPrices_tab',
    form: null,
    url: null,
    typeName: "nrl:marketprices_data",
    stackedCharts: {
        series: {
            stacking: null
        }
    },
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions: {
        title: "Market Prices"
    },
    /**
     * private method[createOptionsFildset]
     * ``String`` title the title of the fieldset
     * ``Object`` opts the chartopts object to manage
     * ``String`` prefix the prefix to use in radio names
     */
    createOptionsFildset: function(title, opts, prefix) {
        var fieldSet = {
            xtype: 'fieldset',
            title: title,
            items: [{ //type
                fieldLabel: "Type",
                xtype: "radiogroup",
                columns: 2,
                items: [{
                    boxLabel: '<span class="icon_span ic_chart-line">Line</span>',
                    name: prefix + "_chart_type",
                    inputValue: "line",
                    checked: opts.type == "line"
                }, {
                    boxLabel: '<span class="icon_span ic_chart-spline">Curve</span>',
                    name: prefix + "_chart_type",
                    inputValue: "spline",
                    checked: opts.type == "spline"
                }, {
                    boxLabel: '<span class="icon_span ic_chart-bar">Bar</span>',
                    name: prefix + "_chart_type",
                    inputValue: "column",
                    checked: opts.type == "column"
                }, {
                    boxLabel: '<span class="icon_span ic_chart-area">Area</span>',
                    name: prefix + "_chart_type",
                    inputValue: "area",
                    checked: opts.type == "area"
                }],
                listeners: {
                    change: function(group, checked) {
                        if (checked) {
                            opts.type = checked.inputValue;
                        }
                    }
                }
            }, { //color
                fieldLabel: 'Color',
                xtype: 'colorpickerfield',
                anchor: '100%',
                value: opts.color.slice(1),
                listeners: {
                    select: function(comp, hex, a, b, c, d, e) {
                        if (hex) {
                            opts.color = '#' + hex;
                            var rgb = comp.menu.picker.hexToRgb(hex);
                            opts.lcolor = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                        }
                    }
                }
            }]
        }
        return fieldSet;
    },
    createStackChartsOptions: function(stackedCharts) {
        var fieldSet = {
            xtype: 'fieldset',
            title: 'Stack charts of the same type',
            items: [{
                xtype: 'radiogroup',
                columns: 1,
                fieldLabel: "Stack charts",
                hideLabel: true,
                items: [{
                    checked: stackedCharts.series.stacking == null,
                    boxLabel: 'Do not stack',
                    name: 'stackcharts',
                    inputValue: null
                }, {
                    checked: stackedCharts.series.stacking == "normal",
                    boxLabel: 'Stack',
                    name: 'stackcharts',
                    inputValue: 'normal'
                }, {
                    checked: stackedCharts.series.stacking == "percent",
                    boxLabel: 'Stack as percent of the total',
                    labelSeparator: '',
                    name: 'stackcharts',
                    inputValue: 'percent'
                }],
                listeners: {
                    change: function(c, checked) {
                        stackedCharts.series.stacking = checked.inputValue;
                    }
                }
            }]
        };
        return fieldSet;
    },
    queryOptions: {},
    chartOpt: {},
    menu: {
        items: [{
            ref: '../chartoptions',
            iconCls: 'ic_wrench',
            text: 'Options',
            handler: function(option) {
                //get mode
                var mainButton = this.refOwner;

                var stackedCharts = mainButton.stackedCharts;
                var fieldSetList = [];

                for (var item in this.refOwner.chartOpt.series) {
                    var itemOpts = this.refOwner.chartOpt.series[item];
                    var itemName = itemOpts.name;
                    fieldSetList.push(mainButton.createOptionsFildset(itemName, itemOpts, itemName));
                }
                //fieldSetList.push(mainButton.createStackChartsOptions(stackedCharts));

                var win = new Ext.Window({
                    iconCls: 'ic_wrench',
                    title: mainButton.optionsTitle,
                    height: 400,
                    width: 350,
                    minWidth: 250,
                    minHeight: 200,
                    layout: 'fit',
                    autoScroll: true,
                    maximizable: true,
                    modal: true,
                    resizable: true,
                    draggable: true,
                    layout: 'fit',
                    items: {
                        ref: 'form',
                        xtype: 'form',
                        autoScroll: true,
                        frame: 'true',
                        layout: 'form',
                        items: fieldSetList
                    }
                });
                win.show();
            }
        }]
    },
    /**
     * api method[handler]
     * generate the chart
     */
    handler: function() {
        var getViewParams = function(form) {
            // gets a list of selected crops
            var cropsSelected = form.crops.getSelections();
            var cropList = [];
            for (var i = 0; i < cropsSelected.length; i++)
                cropList.push('\'' + cropsSelected[i].data.crop + '\'');
            var crop_list = cropList.join('\\,');
            form.submitButton.queryOptions.crop_list = cropList;

            // gets the options used in the query for grouping data
            var time_opt = (form.timerange.getValue().inputValue == 'monthly' ? 'decade_year' : 'month');
            form.submitButton.queryOptions.time_opt = time_opt;

            // set max & min time for query
            var start_abs_dec_year, end_abs_dec_year;
            switch (time_opt) {
                case 'decade_year':
                    {
                        var refYear = parseInt(form.yearSelector.getValue());
                        start_abs_dec_year = (refYear - 1) * 36 + 3 * form.monthRangeSelector.slider.getValues()[0] + 1; // 1st dek of the selected month
                        end_abs_dec_year = (refYear - 1) * 36 + 3 * form.monthRangeSelector.slider.getValues()[1] + 3; // 3rd dek of the selected month
                    }
                    break;
                case 'month':
                    {
                        start_abs_dec_year = form.yearRangeSelector.slider.getValues()[0] * 36 + 1; // jan_dek-1
                        end_abs_dec_year = form.yearRangeSelector.slider.getValues()[1] * 36 + 36; // dec_dek-3
                    }
            }

            form.submitButton.queryOptions.start_abs_dec_year = start_abs_dec_year;
            form.submitButton.queryOptions.end_abs_dec_year = end_abs_dec_year;

            // gets the gran type parameter
            var gran_type = form.aoiFieldSet.gran_type.getValue().inputValue;
            form.submitButton.queryOptions.gran_type = gran_type;

            // gets the gran type parameter as string
            //var gran_type_str = '\'' + gran_type + '\'';

            // gets the list of selected regions
            var region_list = form.aoiFieldSet.selectedRegions.getValue();
            //region_list = region_list.replace("'KHYBER PAKHTUNKHWA'","'FATA'\\,'KPK'");
            form.submitButton.queryOptions.region_list = region_list;

            var currency; // identifies the column to query
            var currencyOpt; // identifies the value obtained
            var exrate; // exchange rate used to convert maketprices by the server
            switch (form.currency.getValue()) {
                case 'usd':{
                    currencyOpt = 'market_price_usd';
                    if (form.exchangeRateRadio.getValue().length != 0){
                        currency = 'market_price_kpr';
                        exrate = parseFloat(form.customExchangeRate.getValue());
                    }else{
                        currency = 'market_price_usd';
                        exrate = 1;
                    }
                }break;
                case 'pkr':{
                    currency = 'market_price_kpr';
                    currencyOpt = 'market_price_kpr';
                    exrate = 1;
                }break;
                default:{
                    currency = 'market_price_usd';
                    currencyOpt = 'market_price_usd';
                    exrate = 1;
                }
            }
            form.submitButton.queryOptions.currency = currencyOpt;

            var factor = form.denominator.getValue();
            form.submitButton.queryOptions.factor = factor;

            form.submitButton.queryOptions.comparisonby = form.comparisonby.getValue().inputValue;

            if (gran_type == 'pakistan') {
                return 'time_opt:' + time_opt + ';' +
                    'start_abs_dec_year:' + start_abs_dec_year + ';' +
                    'end_abs_dec_year:' + end_abs_dec_year + ';' +
                    'currency:' + currency + ';' +
                    'exRate:' + exrate + ';' +
                    'factor:' + factor + ';' +
                    'crop_list:' + crop_list + ';';
            } else {
                return 'time_opt:' + time_opt + ';' +
                    'start_abs_dec_year:' + start_abs_dec_year + ';' +
                    'end_abs_dec_year:' + end_abs_dec_year + ';' +
                    'currency:' + currency + ';' +
                    'exRate:' + exrate + ';' +
                    'factor:' + factor + ';' +
                    'crop_list:' + crop_list + ';' +
                    'region_list:' + region_list + ';' +
                    'gran_type:' + gran_type + ';';
            }
        };

        var getTypeName = function(granType) {
            if (granType == 'pakistan')
                return 'nrl:marketprices_data_pakistan';
            else
                return 'nrl:marketprices_data';
        };

        var getPropertyName = function(granType) {
            if (granType == 'pakistan') {
                return 'crop,abs_dek,value';
            } else {
                return 'province,region,crop,abs_dek,value';
            }
        }

        var viewparams = getViewParams(this.refOwner);
        var typeName = getTypeName(this.queryOptions.gran_type);
        var propertyName = getPropertyName(this.queryOptions.gran_type);

        Ext.Ajax.request({
            scope: this,
            url: this.url,
            method: 'POST',
            params: {
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: typeName,
                outputFormat: "json",
                propertyName: propertyName,
                viewparams: viewparams
            },
            success: function(result, request) {
                try {
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                } catch (e) {
                    Ext.Msg.alert("Error", "Error parsing data from the server");
                    return;
                }
                if (jsonData.features.length <= 0) {
                    Ext.Msg.alert("No data", "Data not available for these search criteria");
                    return;
                }

                var customOpt = {
                    stackedCharts: this.stackedCharts,
                    highChartExportUrl: this.target.highChartExportUrl,
                    uomLabel: this.refOwner.lblOutput.text
                };

                var gran_type = this.refOwner.aoiFieldSet.gran_type.getValue().inputValue;
                var comparisonby = this.refOwner.comparisonby.getValue().inputValue;

                var data = nrl.chartbuilder.marketprices[comparisonby].getData(jsonData, gran_type);
                var charts = nrl.chartbuilder.marketprices[comparisonby].makeChart(data, this.chartOpt, customOpt, this.queryOptions);

                var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts, undefined);
                gxp.WindowManagerPanel.Util.showInWindowManager(wins, this.tabPanel, this.targetTab, this.windowManagerOptions);
            },
            failure: function(result, request) {
                console.log('FAIL!');
                console.log(result);
                console.log(request);
            }
        });
    },
    initChartOpt: function(form) {

        var comparisonby = form.comparisonby.getValue().inputValue;

        var ret = {
            height: 500,
            series: {}
        };

        var options = form.submitButton.chartOpt;
        var uomLabel = form.lblOutput.text;

        if (comparisonby == 'commodity') {
            // one serie for each selected crop
            var selectedCrops = form.crops.getSelections();
            var colorRGB = nrl.chartbuilder.util.randomColorsRGB(selectedCrops.length);
            var colorHEX = nrl.chartbuilder.util.randomColorsHEX(selectedCrops.length);

            for (var i = 0; i < selectedCrops.length; i++) {
                var selCrop = selectedCrops[i];
                ret.series[selCrop.data.crop] = {
                    name: nrl.chartbuilder.util.toTitleCase(selCrop.data.crop),
                    data: [],
                    color: colorHEX[i],
                    lcolor: 'rgb(' + colorRGB[i] + ')',
                    type: 'column',
                    dataIndex: selCrop.data.crop,
                    unit: uomLabel
                }
            }
        } else {
            // one serie for each selected region
            var selectedRegions, lenSelectedRegions;
            var granType = this.form.output.aoiFieldSet.gran_type.getValue().inputValue;
            if (granType == 'pakistan') {
                selectedRegions = [granType];
                lenSelectedRegions = selectedRegions.length;
            } else {
                selectedRegions = form.aoiFieldSet.selectedRegions.getValue().replace(/['\\]/g, '').split(',');
                lenSelectedRegions = form.aoiFieldSet.AreaSelector.getStore().getCount();
            }

            var colorRGB = nrl.chartbuilder.util.randomColorsRGB(lenSelectedRegions);
            var colorHEX = nrl.chartbuilder.util.randomColorsHEX(lenSelectedRegions);

            for (var i = 0; i < lenSelectedRegions; i++) {
                var selReg = selectedRegions[i];

                ret.series[selReg] = {
                    name: selReg,
                    data: [],
                    color: colorHEX[i],
                    lcolor: 'rgb(' + colorRGB[i] + ')',
                    type: 'column',
                    dataIndex: selReg,
                    unit: uomLabel
                }
            }
        }

        Ext.apply(options, ret);
        return ret;
    }
});

Ext.reg(gxp.widgets.button.NrlMarketPricesChartButton.prototype.xtype, gxp.widgets.button.NrlMarketPricesChartButton);