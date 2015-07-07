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
gxp.widgets.button.NrlIrrigationChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlIrrigationChartButton',
    iconCls: "gxp-icon-nrl-chart",
    text: 'Generate Chart',
    optionsTitle: "Chart Options",
    tabPanel: 'id_mapTab',
    targetTab: 'irrigation_tab',
    form: null,
    url: null,
    typeName: "nrl:irrigation_data",
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
        title: "Irrigation"
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
        };
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
        var getViewParams = {
            getTimeOptions: function(form){
                // gets the options used in the query for grouping data
                var time_opt = (form.timerange.getValue().inputValue == 'monthly' ? 'decade_year' : 'month');

                var from_abs_dec, to_abs_dec, group_opt, month_list = [];

                from_abs_dec = form.yearRangeSelector.slider.getValues()[0] * 36 + 1; // jan_dek-1
                to_abs_dec = form.yearRangeSelector.slider.getValues()[1] * 36 + 36; // dec_dek-3

                switch (time_opt) {
                    case 'decade_year':
                        {
                            var fromMonth = form.monthRangeSelector.slider.getValues()[0];
                            var toMonth = form.monthRangeSelector.slider.getValues()[1];
                            for(var i=fromMonth; i<=toMonth; i++){
                                month_list.push("'" + (nrl.chartbuilder.util.numberToMonthName(i+1)).toLowerCase() + "'");
                            }
                            group_opt = '"decade_absolute"';
                        }
                        break;
                    case 'month':
                        {
                            for(var i=0; i<12; i++){
                                month_list.push("'" + (nrl.chartbuilder.util.numberToMonthName(i+1)).toLowerCase() + "'");
                            }
                            group_opt = '"month"';
                        }
                }

                return {
                    time_opt: time_opt,
                    group_opt: group_opt,
                    to_abs_dec: to_abs_dec,
                    from_abs_dec: from_abs_dec,
                    month_list: month_list
                };
            },

            flow: function(form){
                form.submitButton.queryOptions.source_type = 'flow';

                var selectedRivers = form.riversGrid.getSelections();
                var riverList = [];
                for (var i = 0; i < selectedRivers.length; i++){
                    riverList.push('\'' + selectedRivers[i].data.river + '\'');
                }
                var river_list = riverList.join('\\,');
                form.submitButton.queryOptions.river_list = riverList;

                var factor = form.uomFlow.getValue();
                var uomLabel = form.uomFlow.getRawValue();
                form.submitButton.queryOptions.factor = factor;
                form.submitButton.queryOptions.uomLabel = uomLabel;

                var tOpts = this.getTimeOptions(form);
                form.submitButton.queryOptions.time_opt = tOpts.time_opt;
                form.submitButton.queryOptions.from_abs_dec = tOpts.from_abs_dec;
                form.submitButton.queryOptions.to_abs_dec = tOpts.to_abs_dec;
                form.submitButton.queryOptions.group_opt = tOpts.group_opt;
                form.submitButton.queryOptions.month_list = tOpts.month_list.join('\\,');

                return 'group_opt:' + tOpts.group_opt + ';' +
                       'river_list:' + river_list + ';' +
                       'to_abs_dec:' + tOpts.to_abs_dec + ';' +
                       'from_abs_dec:' + tOpts.from_abs_dec + ';' +
                       'month_list:' + tOpts.month_list.join('\\,') + ';' +
                       'factor:' + factor + ';';
            },
            supply: function(form){
                form.submitButton.queryOptions.source_type = 'supply';
                // gets the gran type parameter
                var gran_type = form.aoiFieldSet.gran_type.getValue().inputValue;
                form.submitButton.queryOptions.gran_type = gran_type;

                var gran_type_str = '\'' + gran_type + '\'';
                form.submitButton.queryOptions.gran_type_str = gran_type_str;

                var region_list = form.aoiFieldSet.selectedRegions.getValue();
                form.submitButton.queryOptions.region_list = region_list;

                var factor = form.uomFlow.getValue();
                var uomLabel = form.uomFlow.getRawValue();
                form.submitButton.queryOptions.factor = factor;
                form.submitButton.queryOptions.uomLabel = uomLabel;

                var tOpts = this.getTimeOptions(form);
                form.submitButton.queryOptions.time_opt = tOpts.time_opt;
                form.submitButton.queryOptions.from_abs_dec = tOpts.from_abs_dec;
                form.submitButton.queryOptions.to_abs_dec = tOpts.to_abs_dec;
                form.submitButton.queryOptions.group_opt = tOpts.group_opt;
                form.submitButton.queryOptions.month_list = tOpts.month_list.join('\\,');

                return 'group_opt:' + tOpts.group_opt + ';' +
                       'to_abs_dec:' + tOpts.to_abs_dec + ';' +
                       'from_abs_dec:' + tOpts.from_abs_dec + ';' +
                       'region_list:' + region_list + ';' +
                       'gran_type:' + gran_type + ';' +
                       'gran_type_str:' + gran_type_str + ';' +
                       'month_list:' + tOpts.month_list.join('\\,') + ';' +
                       'factor:' + factor + ';';
            }
        };

        var getTypeName = function(sourceType) {
            if (sourceType == 'flow')
                return 'nrl:irrigation_data_flow';
            else
                return 'nrl:irrigation_data_supply';
        };

        var getPropertyName = function(sourceType) {
            if (sourceType == 'flow') {
                return 'river,abs_dec,waterflow';
            } else {
                return 'province,district,abs_dec,withdrawal';
            }
        };

        var sourceType = this.refOwner.source.getValue().inputValue;

        var viewparams = getViewParams[sourceType](this.refOwner);
        var typeName = getTypeName(sourceType);
        var propertyName = getPropertyName(sourceType);

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

                var sourceType = this.refOwner.source.getValue().inputValue;

                var customOpt = {
                    stackedCharts: this.stackedCharts,
                    highChartExportUrl: this.target.highChartExportUrl,
                    uomLabel: (sourceType == 'flow' ? this.refOwner.uomFlow.getRawValue() : this.refOwner.uomSupply.getRawValue())
                };

                var gran_type = this.refOwner.aoiFieldSet.gran_type.getValue().inputValue;
                var sourceType = this.refOwner.source.getValue().inputValue;

                var data = nrl.chartbuilder.irrigation[sourceType].getData(jsonData, gran_type);
                var charts = nrl.chartbuilder.irrigation[sourceType].makeChart(data, this.chartOpt, customOpt, this.queryOptions);

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

        var ret = {
            height: 500,
            series: {}
        };

        //one serie for each year in the interval
        var options = form.submitButton.chartOpt;

        var fromYear = form.yearRangeSelector.slider.getValues()[0];
        var toYear   = form.yearRangeSelector.slider.getValues()[1];
        var numOfSeries = toYear - fromYear + 1;

        var colorRGB = nrl.chartbuilder.util.randomColorsRGB(numOfSeries);
        var colorHEX = nrl.chartbuilder.util.randomColorsHEX(numOfSeries);
        
        var uomLabel = undefined;
        if (!form.uomFlow.hidden){
            uomLabel = form.uomFlow.getRawValue();
        }else{
            uomLabel = form.uomSupply.getRawValue();
        }

        for(var i=0; i<numOfSeries; i++){
            var sName = fromYear + i + '';
            ret.series[sName] = {
                name: sName,
                data: [],
                color: colorHEX[i],
                lcolor: 'rgb(' + colorRGB[i] + ')',
                type: 'column',
                dataIndex: sName,
                unit: uomLabel
            };
        }

        Ext.apply(options, ret);
        return ret;
    }
});

Ext.reg(gxp.widgets.button.NrlIrrigationChartButton.prototype.xtype, gxp.widgets.button.NrlIrrigationChartButton);