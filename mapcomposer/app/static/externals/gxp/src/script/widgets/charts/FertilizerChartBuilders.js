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
 * This file contain Chart builders for fertilizers.
 * they need to implement:
 * getData (json, aggregatedDataOnly,customOpt): parse data from features and generate the proper series for their chart
 *     * json 'Object' :  the geojson from the server.
 *     * aggregatedDataOnly: boolean that tells to get only the aggregated chart (used, ie. to get only whole pakistan chart)
 *     * customOpt: some options: mandatory object with following options
 *         * variableCompare
 *         * highChartExportUrl
 *         *
 * makeChart(data, opt, listVar, aggregatedDataOnly,customOpt): return a array of HighCharts charts
 */

nrl.chartbuilder.fertilizer = {
    getData: function(json, granType){
        var data = [];
        var regionToDataIndex = {};
        var getChartTitle = function(gran_type, prov, dist){
            prov = (prov == 'KPK' ? 'KHYBER PAKHTUNKHWA' : prov);
            switch(gran_type){
                case 'province': return prov; break;
                case 'district': return dist + ' (' + prov + ')'; break;
                case 'pakistan': return 'Pakistan'; break;
            }
        }

        // for each feature in json data...
        for (var i=0; i<json.features.length; i++){
            var feature = json.features[i].properties;

            // get an index in data that it's relative (same region) to the
            // current feature i
            var dataIndex = regionToDataIndex[feature[granType]];

            // if there is not entry (in data array) relative to the
            // current feature, it create one and push them in data array
            // and store the data index in regionToDataIndex mapping-structure.
            var chartData;
            if (dataIndex == undefined){
                chartData = {
                    title: getChartTitle(granType, feature.province, feature.district),
                    rows: []
                };
                regionToDataIndex[feature[granType]] = data.push(chartData)-1;
            }else{
                chartData = data[regionToDataIndex[feature[granType]]];
            }

            var rowEntry = undefined;
            for(var j=0; j<chartData.rows.length; j++){
                if (chartData.rows[j].time == feature.time){
                    rowEntry = chartData.rows[j];
                    break;
                }
            }
            if (!rowEntry){
                rowEntry = {
                    time: feature.time
                };
                chartData.rows.push(rowEntry);
            }
            rowEntry[feature.nutrient] = feature.tons/1000;
        }

        // it doesn't copute aggregate data if there is only one chart
        if (data.length == 1) return data;

        // greates a new data entry for the aggregate velues
        var aggregated = {
            title: 'aggregate',
            rows: []
        }
        // this object maps time value on row index for aggregated data
        var timeToRowIndex = {};

        // for each dataEntry in data...
        for(var d=0; d<data.length; d++){
            var dataEntry = data[d];
            // for each rowEntry in rows of the current data entry...
            for(var r=0; r<dataEntry.rows.length; r++){
                var rowEntry = dataEntry.rows[r];
                // search for a row in aggregated that it has the same time value of current row
                var aggregateRowIndex = timeToRowIndex[rowEntry.time];
                var aggregateRowEntry;
                if (aggregateRowIndex == undefined){
                    timeToRowIndex[rowEntry.time] = aggregated.rows.length;
                    aggregated.rows.push({
                        time: rowEntry.time
                    });
                    aggregateRowIndex = timeToRowIndex[rowEntry.time];
                }
                aggregateRowEntry = aggregated.rows[aggregateRowIndex];

                for(var nutrient in rowEntry){
                    if(nutrient != 'time'){
                        if (aggregateRowEntry[nutrient] == undefined)
                            aggregateRowEntry[nutrient] = 0;
                        aggregateRowEntry[nutrient] += rowEntry[nutrient];
                    }
                }
            }
        }
        data.push(aggregated);
        return data;
    },

    getChartConfig: function(opt, customOpt){
        var ret = {
            fields: [
                {
                    name: 'time',
                    type: 'string'
                }
            ],
            series: [],
            yAxis: [],
            plotOptions: customOpt.stackedCharts
        };
        /*
        for (var nutrient in opt.series){
            ret.series.push(opt.series[nutrient]);
            var yAxisConfig = {
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    style: {
                        color: opt.series[nutrient].color
                    }
                },
                title: {
                    text: opt.series[nutrient].name + ' ' + opt.series[nutrient].unit,
                    rotation: 270,
                    style: {
                        color: opt.series[nutrient].color,
                        backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                    }
                }
            };
            ret.yAxis.push(yAxisConfig);
        }
        */
        for (var nutrient in opt.series){
            ret.series.push(opt.series[nutrient]);
        }
        ret.yAxis = [{ // AREA
            title: {
                text: customOpt.stackedCharts.series.stacking == 'percent' ? 'Percentage (%)' : 'Offtake (000 tons)'
            },
            labels: {
                formatter: function () {
                    return this.value;
                },
                style: {
                    color: "#666666"
                }
            }
        }];
/*
        for(var s=0; s<ret.series.length; s++){
            if (s>0){
                ret.series[s].yAxis = s;
                ret.yAxis[s].opposite = true;
            }
        }
*/
        return ret;
    },

    makeChart: function(data, opt, customOpt, queryParams){
        var zeroPadding = function(n, padding){
            var nstr = n + '';
            if (nstr.length < padding){
                for(var i=padding-nstr.length; i>0; i--){
                    nstr = '0' + nstr;
                }
            }
            return nstr;
        };
        // this function assums that the aggregate data chart are as last
        // in the chartData array.
        //  queryParams = {
        //      timerange,
        //      from_year,
        //      from_month,
        //      to_year,
        //      to_month
        //  }
        var getChartInfo = function(chartData, chartIndex, queryParams){
            var info = '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />';

            // 'today' will contain the current date in dd/mm/yyyy format
            var now = new Date();
            var dd = zeroPadding(now.getDate(), 2);
            var mm = zeroPadding(now.getMonth()+1, 2); //January is 0!
            var yyyy = now.getFullYear();
            var today = dd + '/' + mm + '/' + yyyy;
            info += '<span style="font-size:10px;">Date: '+ today +'</span><br />';

            // build a list of aoi for the current chart.
            var aoi = '';
            var aoiList = [];
            if (chartData[chartIndex].title == 'aggregate'){
                for (var i=0; i<chartIndex; i++){
                    aoiList.push(chartData[i].title);
                }
                aoi = aoiList.join(', ');
            }else{
                aoi = chartData[chartIndex].title;
            }
            info += '<span style="font-size:10px;">Region: '+ aoi + '</span><br />'

            switch (queryParams.timerange){
                case 'annual': {
                    var fromYear = queryParams.from_year;
                    var toYear = queryParams.to_year;
                    info += '<span style="font-size:10px;">Years: '+ fromYear + '-' + toYear + '</span><br />'
                }break;
                case 'monthly': {
                    var referenceYear = queryParams.from_year;
                    info += '<span style="font-size:10px;">Year: '+ referenceYear + '</span><br />'

                    var fromMonth = nrl.chartbuilder.util.numberToMonthName(queryParams.from_month);
                    var toMonth = nrl.chartbuilder.util.numberToMonthName(queryParams.to_month);
                    info += '<span style="font-size:10px;">Months: '+ fromMonth + '-' + toMonth + '</span><br />'
                }break;
            }

            return info;
        };

        var getChartTitle = function(chartData, chartIndex){
            var title = 'Fertilizer: ';
            var region = (chartData[chartIndex].title == 'aggregate' ? 'REGION' : chartData[chartIndex].title);
            title += region;
            return title;
        };

        var charts = [];

        for (var r=0; r<data.length; r++){

            // defines fields for the store of the chart.
            var fields = [
                {
                    name: 'time',
                    type: 'string'
                }
            ];
            for(var nutrient in opt.series){
                fields.push({
                    name: nutrient,
                    type: 'float'
                });
            }

            // retreive chart configuration from plot options
            // chartConfig will contain configuration chart series and yAxis.
            var chartConfig = this.getChartConfig(opt, customOpt);

            var info = getChartInfo(data, r, queryParams);
            var chartTitle = getChartTitle(data, r);

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
                        y: 16
                    },
                    xAxis: [{
                        type: 'datetime',
                        categories: 'time',
                        tickWidth: 0,
                        gridLineWidth: 1,
                        labels: {
                            formatter: function(){
                                var time = parseInt(this.value);
                                return (time <= 12 ? nrl.chartbuilder.util.numberToMonthName(time, false) : time);
                            }
                        }
                    }],
                    yAxis: chartConfig.yAxis,
                    plotOptions: chartConfig.plotOptions,
                    tooltip: {
                        formatter: function() {
                            var time = parseInt(this.x);
                            var xVal = (time <= 12 ? nrl.chartbuilder.util.numberToMonthName(time, true) : time);
                            var s = '<b>'+ xVal +'</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name +': </span>'+
                                    '<span style="font-size:12px;">'+ i.y.toFixed(2) +'</span>';
                            });

                            return s;
                        },
                        shared: true,
                        crosshairs: true
                    },
                    legend: {
                        labelFormatter: function() {
                            if (this.name == 'Area (000 hectares)'){
                                return 'Area (000 ha)';
                            }else{
                                return this.name;
                            }

                        }
                    }
                },
                info: info
            });
            charts.push(chart);
        }
        return charts;
    }
}