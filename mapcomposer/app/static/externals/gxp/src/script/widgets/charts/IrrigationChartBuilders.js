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



Ext.namespace('nrl.chartbuilder');

/**
 * @author Mirco Bertelli
 * This file contain Chart builders for irrigation.
 * they need to implement:
 * getData (json, granType): parse data from features and generate the proper series for their chart
 *     * json 'Object' :  the geojson from the server.
 *     * granType: type of aoi selections
 *         * district
 *         * province
 *         * pakistan
 * makeChart(data, opt, customOpt, queryParams): return a array of HighCharts charts
 */
nrl.chartbuilder.irrigation = {};
nrl.chartbuilder.irrigation.commons = {
    getXAxisLabel: function(xVal, queryParams) {
        var mills = parseInt(xVal);
        var date = new Date(mills);
        var monthStr = date.dateFormat('M');

        var lbl = monthStr;

        if (queryParams.time_opt != 'month') {
            var dayInMonth = parseInt(date.dateFormat('d'));
            var dec;
            if (dayInMonth > 20)
                dec = 3;
            else if (dayInMonth > 10)
                dec = 2;
            else
                dec = 1;

            lbl += '-' + dec;
        }
        return lbl;
    },
    getChartTitle: function(chartData, chartIndex, sourceType) {
        var title = (sourceType == 'flow' ? 'River Water Inflow' : 'Irrigation Water Supply') + ': ';
        var subtitle = chartData[chartIndex].title;
        title += subtitle;
        return title;
    },
    getChartInfo: function(sourceType) {
        var info = '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />';

        // 'today' will contain the current date in dd/mm/yyyy format
        var now = new Date();
        var dd = nrl.chartbuilder.util.zeroPadding(now.getDate(), 2);
        var mm = nrl.chartbuilder.util.zeroPadding(now.getMonth() + 1, 2); //January is 0!
        var yyyy = now.getFullYear();
        var today = dd + '/' + mm + '/' + yyyy;
        info += '<span style="font-size:10px;">Date: ' + today + '</span><br />';
        info += '<span style="font-size:10px;">Data source: ' + (sourceType == 'flow' ? 'Punjab Irrigation Department' : 'Indus River System Authority (IRSA)') + '</span><br />';

        return info;
    },
    getChartConfig: function(opt, customOpt, sourceType) {
        var lblPrefix = sourceType == 'flow' ? 'Volume flow rate' : 'Volume' ;
        var ret = {
            fields: [{
                name: 'time',
                type: 'string'
            }],
            series: [],
            yAxis: [],
            plotOptions: customOpt.stackedCharts
        };

        for(var year in opt.series){
            ret.series.push(opt.series[year]);
        }

        ret.yAxis = [{ // AREA
            title: {
                text: customOpt.stackedCharts.series.stacking == 'percent' ? 'Percentage (%)' : lblPrefix + ' (' + customOpt.uomLabel + ')'
            },
            labels: {
                formatter: function() {
                    return this.value;
                },
                style: {
                    color: "#666666"
                }
            }
        }];
        //sort series in an array (lines on top, than bars then areas)
        ret.series.sort(function(a,b){
            //area,bar,line,spline are aphabetically ordered as we want
            return a.type < b.type ? -1 : 1;
        });
        return ret;
    }
};
nrl.chartbuilder.irrigation.flow = {
    getData: function(json, granType) {
        var data = [];
        var riverToDataIndex = {};

        // for each feature in json data...
        for (var i = 0; i < json.features.length; i++) {
            var feature = json.features[i].properties;

            // gets an index from the data that it's relative (same river) to the
            // current feature i
            var dataIndex = riverToDataIndex[feature.river];

            // if there is not entry (in data array) relative to the
            // current feature, it creates one, push it in data array
            // and store the data index in riverToDataIndex mapping-structure.
            var chartData;
            if (dataIndex == undefined) {
                chartData = {
                    title: feature.river,
                    rows: []
                };
                riverToDataIndex[feature.river] = data.push(chartData) - 1;
            } else {
                chartData = data[riverToDataIndex[feature.river]];
            }

            var rowEntry = undefined;
            var parsedAbsDek = nrl.chartbuilder.util.getDekDate(feature.abs_dec);
            var refStrDate = 1970 + '/' + parsedAbsDek.month + '/' + ((parsedAbsDek.dec - 1) * 10 + 1);
            var timeVal = new Date(refStrDate).getTime();

            for (var j = 0; j < chartData.rows.length; j++) {
                if (chartData.rows[j].time == timeVal) {
                    rowEntry = chartData.rows[j];
                    break;
                }
            }
            if (!rowEntry) {
                rowEntry = {
                    time: timeVal
                };
                chartData.rows.push(rowEntry);
            }
            var serieName = parsedAbsDek.year + '';
            rowEntry[serieName] = feature.waterflow;
        }

        for (var i = 0; i < data.length; i++) {
            var dataRows = data[i].rows;
            dataRows.sort(function(r1, r2) {
                return r1.time - r2.time;
            });
        }
        return data;
    },
    makeChart: function(data, opt, customOpt, queryParams) {

        var charts = [];
        
        var info = nrl.chartbuilder.irrigation.commons.getChartInfo('flow');

        for (var r = 0; r < data.length; r++) {
            // defines fields for the store of the chart.
            var fields = [{
                name: 'time',
                type: 'string'
            }];

            for(var year in opt.series){
                fields.push({
                    name: year,
                    type: 'float'
                });
            }

            // retreive chart configuration from plot options
            // chartConfig will contain configuration chart series and yAxis.
            var chartConfig = nrl.chartbuilder.irrigation.commons.getChartConfig(opt, customOpt, 'flow');

            var chartTitle = nrl.chartbuilder.irrigation.commons.getChartTitle(data, r, 'flow');

            var store = new Ext.data.JsonStore({
                data: data[r],
                fields: fields,
                root: 'rows'
            });

            chart = new Ext.ux.HighChart({
                series: chartConfig.series,
                height: opt.height,
                store: store,
                animShift: true,
                xField: 'time',
                chartConfig: {
                    chart: {
                        zoomType: 'x',
                        spacingBottom: 145
                    },
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: customOpt.highChartExportUrl
                    },
                    title: {
                        text: chartTitle
                    },
                    subtitle: {
                        text: info,
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 30
                    },
                    xAxis: [{
                        type: 'datetime',
                        categories: 'time',
                        tickWidth: 0,
                        gridLineWidth: 1,
                        labels: {
                            formatter: function() {
                                return nrl.chartbuilder.irrigation.commons.getXAxisLabel(this.value, queryParams);
                            },
                            rotation: -45,
                            y: 24
                        }
                    }],
                    yAxis: chartConfig.yAxis,
                    plotOptions: chartConfig.plotOptions,
                    tooltip: {
                        formatter: function() {
                            var xVal = nrl.chartbuilder.irrigation.commons.getXAxisLabel(this.x, queryParams);
                            var s = '<b>' + xVal + '</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:' + i.series.color + '">' + i.series.name + ': </span>' +
                                    '<span style="font-size:12px;">' + i.y.toFixed(2) + '</span>';
                            });

                            return s;
                        },
                        shared: true,
                        crosshairs: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    }
                },
                info: info
            });
            charts.push(chart);
        }

        return charts;
    }
};
nrl.chartbuilder.irrigation.supply = {
    getData: function(json, granType) {
        var data = [];
        var regionToDataIndex = {};

        // for each feature in json data...
        for (var i = 0; i < json.features.length; i++) {
            var feature = json.features[i].properties;

            // gets an index from the data that it's relative (same river) to the
            // current feature i
            var dataIndex = regionToDataIndex[feature[granType]];

            // if there is not entry (in data array) relative to the
            // current feature, it creates one, push it in data array
            // and store the data index in regionToDataIndex mapping-structure.
            var chartData;
            if (dataIndex == undefined) {
                chartData = {
                    title: feature[granType] + (granType == 'district' ? ' ('+feature.province+')' : ''),
                    rows: []
                };
                regionToDataIndex[feature[granType]] = data.push(chartData) - 1;
            } else {
                chartData = data[regionToDataIndex[feature[granType]]];
            }

            var rowEntry = undefined;
            var parsedAbsDek = nrl.chartbuilder.util.getDekDate(feature.abs_dec);
            var refStrDate = 1970 + '/' + parsedAbsDek.month + '/' + ((parsedAbsDek.dec - 1) * 10 + 1);
            var timeVal = new Date(refStrDate).getTime();

            for (var j = 0; j < chartData.rows.length; j++) {
                if (chartData.rows[j].time == timeVal) {
                    rowEntry = chartData.rows[j];
                    break;
                }
            }
            if (!rowEntry) {
                rowEntry = {
                    time: timeVal
                };
                chartData.rows.push(rowEntry);
            }
            var serieName = parsedAbsDek.year + '';
            rowEntry[serieName] = feature.withdrawal;
        }

        for (var i = 0; i < data.length; i++) {
            var dataRows = data[i].rows;
            dataRows.sort(function(r1, r2) {
                return r1.time - r2.time;
            });
        }
        return data;
    },
    makeChart: function(data, opt, customOpt, queryParams) {
        var charts = [];

        for (var r = 0; r < data.length; r++) {

            // defines fields for the store of the chart.
            var fields = [{
                name: 'time',
                type: 'string'
            }];
            for (var year in opt.series) {
                fields.push({
                    name: year,
                    type: 'float'
                });
            }

            // retreive chart configuration from plot options
            // chartConfig will contain configuration chart series and yAxis.
            var chartConfig = nrl.chartbuilder.irrigation.commons.getChartConfig(opt, customOpt, 'supply');

            var info = nrl.chartbuilder.irrigation.commons.getChartInfo(data, r, queryParams, 'supply');
            var chartTitle = nrl.chartbuilder.irrigation.commons.getChartTitle(data, r, 'supply');

            var store = new Ext.data.JsonStore({
                data: data[r],
                fields: fields,
                root: 'rows'
            });

            chart = new Ext.ux.HighChart({
                series: chartConfig.series,
                height: opt.height,
                store: store,
                animShift: true,
                xField: 'time',
                chartConfig: {
                    chart: {
                        zoomType: 'x',
                        spacingBottom: 145
                    },
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: customOpt.highChartExportUrl
                    },
                    title: {
                        text: chartTitle
                    },
                    subtitle: {
                        text: info,
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 30
                    },
                    xAxis: [{
                        type: 'datetime',
                        categories: 'time',
                        tickWidth: 0,
                        gridLineWidth: 1,
                        labels: {
                            formatter: function() {
                                return nrl.chartbuilder.irrigation.commons.getXAxisLabel(this.value, queryParams);
                            },
                            rotation: -45,
                            y: 24
                        }
                    }],
                    yAxis: chartConfig.yAxis,
                    plotOptions: chartConfig.plotOptions,
                    tooltip: {
                        formatter: function() {
                            var xVal = nrl.chartbuilder.irrigation.commons.getXAxisLabel(this.x, queryParams);
                            var s = '<b>' + xVal + '</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:' + i.series.color + '">' + i.series.name + ': </span>' +
                                    '<span style="font-size:12px;">' + i.y.toFixed(2) + '</span>';
                            });

                            return s;
                        },
                        shared: true,
                        crosshairs: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    }
                },
                info: info
            });
            charts.push(chart);
        }
        return charts;
    }
};