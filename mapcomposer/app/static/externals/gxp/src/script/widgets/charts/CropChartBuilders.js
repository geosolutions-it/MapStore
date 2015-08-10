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



Ext.namespace('nrl.chartbuilder.crop');

/**
 * @author Lorenzo Natali
 * This file contain Chart builders for crops.
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

/**
 *
 *    Builder for Composite Charts
 *
 */
nrl.chartbuilder.crop.composite = {

    getData: function (json, aggregatedDataOnly,customOpt){
		var chartData = [];

		for (var i=0 ; i<json.features.length; i++) {
			var feature = json.features[i];
			var obj = null;

			//search already existing entries
			for (var j=0; j<chartData.length; j++){
				if(chartData[j].region == feature.properties.region){
					obj = chartData[j];
				}
			}

			//create entry if doesn't exists yet
			if(!obj){
				obj = {
					region:feature.properties.region,
					title:feature.properties.region,
					subtitle:feature.properties.crop,
					rows: []/*,
					avgs:{
						area:0,
						prod:0,
						yield:0,
						years:0
					},
					*/
				};
				chartData.push(obj);
			}

			//create a row entry
			var yr = feature.properties.year;
			var a = feature.properties.area;
			var p = feature.properties.production;
			var yi = feature.properties.yield;

			obj.rows.push({
				time: yr,
				area: parseFloat(a.toFixed(2)),
				prod: parseFloat(p.toFixed(2)),
				yield: parseFloat(yi.toFixed(2))//,
				//crop: feature.properties.crop
			});

			//obj.avgs.area+=a;
			//obj.avgs.prod+=p;
			//obj.avgs.yield+=yi;
			//obj.avgs.years+=1;
		}

		//create mean chart if needed
		var mean;
		if (chartData.length > 1){
			mean = {
				region: "all",
				title: "Aggregated data",
				subtitle: json.features[0].properties.crop,
				rows: []/*,
				avgs:{
					area:0,
					prod:0,
					yield:0,
					years:0
				}*/
			};

			var meanareas = []
			var meanproductions = [];
			var meanyields = [];
			var nyears = {};

			//sum all values
			for (var i=0; i<chartData.length; i++){
				var rows = chartData[i].rows;
				for (var j=0; j<rows.length; j++){
					var yr = rows[j].time;
					var area = rows[j].area;
					var prod = rows[j].prod;
					var yield = rows[j].yield;
					meanareas[yr] = (meanareas[yr] ? meanareas[yr] :0) + area;
					meanproductions[yr] = (meanproductions[yr] ? meanproductions[yr]:0) +prod;
					meanyields[yr] = (meanyields[yr] ? meanyields[yr]:0) +yield;
					nyears[yr] = (nyears[yr]?nyears[yr]:0) + 1;
				}
			}

			//divide by nyears
			for(var i=0 in nyears){
				mean.rows.push({
					time: i,
					area: parseFloat(meanareas[i].toFixed(2)), //(meanareas[i]/nyears[i]).toFixed(2),
					prod: parseFloat(meanproductions[i].toFixed(2)), //(meanproductions[i]/nyears[i]).toFixed(2),
					yield: parseFloat((meanyields[i]/nyears[i]).toFixed(2))
				});
			}

			chartData.push(mean);
		}

		if(aggregatedDataOnly && mean){
			chartData = [mean];
		}else{
			// Sorts array elements in ascending order numerically.
			function CompareForSort(first, second){
				if (first.time == second.time)
					return 0;
				if (first.time < second.time)
					return -1;
				else
					return 1;
			}

			//sort all year ascending
			for (var i=0; i<chartData.length; i++){
				//chartData[i].rows.sort(function(a,b){return a.time > b.time});
				chartData[i].rows.sort(CompareForSort);
			}
		}

		var getAvg = function(array){
			var sum = 0;
			for(var i=0; i<array.length; i++){
				sum += array[i];
			}
			return sum/array.length;
		};

		/*
		 * edits data for dif chart
		 */
		if (customOpt.compositeMode != 'abs'){
			var chartMeanValues = [];
			/*
			 * for each chart it builds an object that
			 * keep mean values for each data (not for time)
			 */
			for(var i=0; i<chartData.length; i++){
				var chartMeanValue = {};
				for(var r=0; r<chartData[i].rows.length; r++){
					for(var data in chartData[i].rows[r]){
						if (data != 'time')
							chartMeanValue[data] = (chartMeanValue[data] ? chartMeanValue[data] : 0 ) + chartData[i].rows[r][data];
					}
				}
				for(var data in chartMeanValue){
					if (data != 'time')
						chartMeanValue[data] = chartMeanValue[data]/chartData[i].rows.length;
				}
				chartMeanValues[i] = chartMeanValue;
			}
			/*
			 * compute new data values
			 */
			for(var i=0; i<chartData.length; i++){
				var chartValue = chartData[i];
				var chartAVGs = chartMeanValues[i];
				for(var r=0; r<chartValue.rows.length; r++){
					var chartRow = chartValue.rows[r];
					/*
					 * replace data with the difference (absolute or percent) from the average
					 */
					for(var data in chartAVGs){
						chartRow[data] = parseFloat(( customOpt.compositeMode == 'diff' ? chartRow[data] - chartAVGs[data] : 100*(chartRow[data]/chartAVGs[data] -1)).toFixed(2));
					}
				}
			}
		}
		return chartData;
	},

    /**
     * private method[getOrderedChartConfigs]
     * get chart configurations properly sorted
     * to place charts with line style on top and
     * area styles behind. The fields of the ExtJs store
     * needs and yAxis configuration needs to be sorted in the same way.
     * ``Object`` opt chartOpts object
     * data. data to use for the chart
     *
     */
	getOrderedChartConfigs:function(opt,avgs){
        var ret = {};
        ret.series = [opt.series.prod,
					opt.series.yield,
					opt.series.area		];
        //sort series in an array (lines on top, than bars then areas)
        ret.series.sort(function(a,b){
            //area,bar,line,spline are aphabetically ordered as we want
            return a.type < b.type ? -1 : 1;
        });
        ret.avgs = [];
        //first element must be time, the other element
        // must have the same order of the opt and yAxis
        ret.fields=  [{
            name: 'time',
            type: 'string'
        }];
        //sort avg objects
        for (var k in opt.series){
            for(var i = 0; i < ret.series.length; i++){
                if(ret.series[i]===opt.series[k]){
                    ret.avgs[i] = (avgs ? avgs[k] : undefined);

                }
            }
        }

        // generate yAxisConfig for each element
        ret.yAxis = [];
        for(var i = 0 ; i < ret.series.length; i++){
            //TODO FIX THIS: THE SORTING MUST BE DIFFERENT
            var yAxisIndex = i;
            //invert last 2 axes.
            switch(ret.series[i].dataIndex){
                case "area": yAxisIndex=0 ; break;
                case "prod": yAxisIndex=1 ; break;
                case "yield": yAxisIndex=2 ; break;
            }

            ret.yAxis[yAxisIndex] = this.generateyAxisConfig(ret.series[i],ret.avgs[i]);
            //console.log("yAxis:"+  yAxisIndex + ",chartOpt:" + i + ret.yAxis[yAxisIndex].title.text + ";" + ret.series[i].name);
            // add opposite option to the yAxis config (except the first)
            if(yAxisIndex>0){
                var yAxis = ret.yAxis[yAxisIndex];
                yAxis.opposite = true;
            }
        }
        return ret;


    },
    /**
     * private method[generateyAxisConfig]
     * generates the yAxis config.
     * opt: chartOpt
     * avg: average line value
     */
    generateyAxisConfig: function(opt,avg){
        return { // AREA
            title: {
                text: opt.name,
                rotation: 270,
                style: {
                    color: opt.color,
                    backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                }
            },
            labels: {
                formatter: function () {
                    return this.value;
                },
                style: {
                    color: opt.color
                }
            },
            plotLines: ( avg ? [{ //mid values
                	value: avg,
                	color: opt.color,//opt.series.area.lcolor,
                	dashStyle: 'LongDash',
                	width: 1
            	}] : undefined)

        }

    },

	makeChart: function(data, opt, listVar, aggregatedDataOnly,customOpt){

		var charts = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += arr[i][type];
			}
			return sum/len;
		};
		var getAbsMaximums = function(chartRows){
			var maximums = {};
			for (var r=0; r<chartRows.length; r++){
				var row = chartRows[r];
				for(var item in row){
					if (item != 'time'){
						if (!maximums[item]) maximums[item] = [];
						maximums[item].push(row[item]);
					}
				}
			}
			for (var item in maximums){
				//the max is the max distance from zero.
				maximums[item] = Math.max(
					Math.abs(Math.max.apply(null, maximums[item])),
					Math.abs(Math.min.apply(null, maximums[item]))
				);

				//approx value to the next integer.
				maximums[item] = Math.round(maximums[item]+0.5);
			}
			return maximums;
		};
		var addMaxMinConfig = function(chartConfig, maximums){
			var yAxisDataIdIndexMap = {};
			for(var i=0; i<chartConfig.series.length; i++){
				for(var j=0; j<chartConfig.yAxis.length; j++){
					if (chartConfig.series[i].name == chartConfig.yAxis[j].title.text){
						yAxisDataIdIndexMap[chartConfig.series[i].dataIndex] = j;
					}
				}
			}

			for(var item in maximums){
				chartConfig.yAxis[yAxisDataIdIndexMap[item]].max =  maximums[item];
				chartConfig.yAxis[yAxisDataIdIndexMap[item]].min = -maximums[item];
			}
		};
		for (var r=0; r<data.length; r++){
            //calculate avg
            var prodavg = getAvg(data[r].rows,'prod');
			var yieldavg = getAvg(data[r].rows,'yield');
			var areaavg = getAvg(data[r].rows,'area');
			var avgs = {
                prod :prodavg,
                yield:yieldavg,
                area:areaavg
            }
            //get chart configs (sorting them properly)
            var chartConfig = this.getOrderedChartConfigs(opt,(customOpt.compositeMode == 'abs' ? avgs : undefined));
            if (customOpt.compositeMode != 'abs'){
				var maxes = getAbsMaximums(data[r].rows);
				addMaxMinConfig(chartConfig, maxes);
			}
            //console.log(chartConfig);
			// Store for random data
			var fields = [{
					name: 'time',
					type: 'string'
				} , {
					name: 'area',
					type: 'float'
				}, {
					name: 'prod',
					type: 'float'
				}, {
					name: 'yield',
					type: 'float'
				},{
					name:'crop',
					type:'string'
			}];

			var store = new Ext.data.JsonStore({
				data: data[r],
				fields:  fields,
				root: 'rows'
			});

			var chart;

			//
			// Making Chart Title
			//
			var text = "";
			var dataTitle = data[r].title.toUpperCase();
			var commodity = listVar.commodity.toUpperCase().replace(/[']/g,'');

			var chartTitle = listVar.chartTitle.split(',')[r];

			if(dataTitle){
				if(dataTitle == "AGGREGATED DATA"){
					if(aggregatedDataOnly){
						//text += dataTitle + " (Pakistan) - " + commodity;
                        text += 'Crop Data Analysis: Composite - Pakistan';
					}else{
						text += 'Crop Data Analysis: Composite - REGION';
					}
				}else{
					text += 'Crop Data Analysis: Composite - ' + chartTitle;
				}
			}
			text += (customOpt.compositeMode != 'abs' ? '<br /><span style="font-size: 12px;">' + commodity + ' Anomalies '+ listVar.toYear + ' - (' + listVar.fromYear + "-"+ listVar.toYear + ')</span>' : '<br />' + commodity);

			//
			// AOI Subtitle customization
			//
			var aoiSubtitle = "";
			if(dataTitle == "AGGREGATED DATA"){
				if(aggregatedDataOnly){
					aoiSubtitle += "Pakistan";
				}else{
					aoiSubtitle += listVar.chartTitle;
				}
			}else{
				aoiSubtitle += chartTitle;
			}

			var commoditiesListStr = nrl.chartbuilder.util.toTitleCase(listVar.commodity.replace(/[']/g, '').replace(/\\,/g,', ').toUpperCase());
			chart = new Ext.ux.HighChart({
				series: chartConfig.series,
				alignYAxisZero: (customOpt.compositeMode != 'abs'),
				height: opt.height,
				//width: 900,
				store: store,
				animShift: true,
				xField: 'time',
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: (customOpt.compositeMode == 'abs' ? 196 :128)
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: customOpt.highChartExportUrl
                    },
					title: {
						//text: (data[r].title.toUpperCase()=="AGGREGATED DATA" ? data[r].title.toUpperCase() + " - " + listVar.commodity.toUpperCase() : listVar.commodity.toUpperCase() +" - "+listVar.chartTitle.split(',')[r]) // + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : listVar.chartTitle.split(',')[r])
						text: text,
						useHTML: true,
						margin: 32
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              '<span style="font-size:10px;">AOI: '+ aoiSubtitle /*(data[r].title.toUpperCase()=="AGGREGATED DATA" ? listVar.chartTitle : listVar.chartTitle.split(',')[r])*/ + '</span><br />' +
                              '<span style="font-size:10px;">Commodity: '+commoditiesListStr+'</span><br />'+
                              '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />'+
                              (customOpt.compositeMode == 'abs'
                              	?
	                            	'<span style="font-size:10px; color: '+opt.series.area.color+'">Area mean: '+areaavg.toFixed(2)+' '+opt.series.area.unit+'</span><br />'+
	                            	'<span style="font-size:10px; color: '+opt.series.prod.color+'">Prod mean: '+ prodavg.toFixed(2)+' '+opt.series.prod.unit+'</span><br />'+
	                            	'<span style="font-size:10px; color: '+opt.series.yield.color+'">Yield mean: '+ yieldavg.toFixed(2)+' '+opt.series.yield.unit+'</span>'
                              	:
                              		''),
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
						gridLineWidth: 1
					}],
					yAxis: chartConfig.yAxis,
					tooltip: {
                        formatter: function() {
                            var s = '<b>'+ this.x +'</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name +': </span>'+
                                    '<span style="font-size:12px;">'+ i.y+'</span>';
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
				info: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                      '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                      '<span style="font-size:10px;">AOI: '+ aoiSubtitle + '</span><br />' +
                      '<span style="font-size:10px;">Commodity: '+commoditiesListStr+'</span><br />'+
                      '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />'+
                      '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />'+
                      (customOpt.compositeMode == 'abs'
                      	?
                        	'<span style="font-size:10px; color: '+opt.series.area.color+'">Area mean: '+areaavg.toFixed(2)+' '+opt.series.area.unit+'</span><br />'+
                        	'<span style="font-size:10px; color: '+opt.series.prod.color+'">Prod mean: '+ prodavg.toFixed(2)+' '+opt.series.prod.unit+'</span><br />'+
                        	'<span style="font-size:10px; color: '+opt.series.yield.color+'">Yield mean: '+ yieldavg.toFixed(2)+' '+opt.series.yield.unit+'</span>'
                      	:
                      		'')
			});
			charts.push(chart);
		}

		return charts;
	}

}

nrl.chartbuilder.crop.compareRegion = {

	getData: function (json, aggregatedDataOnly,customOpt){
		var chartData = [];


		for (var i=0 ; i<json.features.length; i++) {
			var feature = json.features[i];
			var obj = null;

			//search already existing entries
			for (var j=0; j<chartData.length; j++){
				if(chartData[j].time == feature.properties.year){
					obj = chartData[j];
				}
			}
			var yr = feature.properties.year;
			var a = feature.properties.area;
			var p = feature.properties.production;
			var yi = feature.properties.yield;
			//create entry if doesn't exists yet
			if(!obj){
				obj = {
                    time: feature.properties.year
				};
				chartData.push(obj);
			}

			//create a row entry
			var row = {
				time: yr,
				area: parseFloat(a.toFixed(2)),
				prod: parseFloat(p.toFixed(2)),
				yield: parseFloat(yi.toFixed(2))
			};


			//obj.rows.push(row);
            obj[feature.properties.region.toLowerCase()] = row[customOpt.variableCompare]

		}
		var newChartData = [];

		var newObj = {
			title: customOpt.variableCompare,
			rows: chartData
		};



		chartData.reverse();



		newChartData.push(newObj);

		if(aggregatedDataOnly && mean){
			chartData = [mean];
		}else{
			// Sorts array elements in ascending order numerically.
			function CompareForSort(first, second){
				if (first.time == second.time)
					return 0;
				if (first.time < second.time)
					return -1;
				else
					return 1;
			}

			//sort all year ascending
			for (var i=0; i<newChartData.length; i++){
				//chartData[i].rows.sort(function(a,b){return a.time > b.time});
				newChartData[i].rows.sort(CompareForSort);
			}
		}

		return newChartData;
	},


	makeChart: function(data, opt, listVar, aggregatedDataOnly, customOpt){

		var charts = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += (arr[i][type] === undefined) ? 0 : arr[i][type];
			}
			return sum/len;
		};

		/**
		 * create an object where any keys is a region and
		 * any values is a AVG of data region
		 */
		var avgs = {};
		for(var region in opt.series){
			var avg = getAvg(data[0].rows, region);
			avgs[region] = avg;
		}

		for (var r=0; r<data.length; r++){
            //calculate avg
            /*var prodavg = getAvg(data[r].rows,'prod');
			var yieldavg = getAvg(data[r].rows,'yield');
			var areaavg = getAvg(data[r].rows,'area');
			var avgs = {
                prod :prodavg,
                yield:yieldavg,
                area:areaavg
            }*/
            //get chart configs (sorting them properly)
            var chartConfig = this.getOrderedChartConfigs(opt,listVar,customOpt.stackedCharts, avgs);

			var fields = [{
					name: 'time',
					type: 'string'
				},{
					name:'crop',
					type:'string'
			}];

			for (var listFields in opt.series){
				fields.push(
					{
						name: listFields,
						type: 'float'

					}
				);
			}

            //console.log(chartConfig);
			// Store for random data

			var store = new Ext.data.JsonStore({
				data: data[r],
				fields:  fields,
				root: 'rows'
			});

			var chart;
			var text = listVar.commodity.toUpperCase() + ' - ' + opt.name;

			//var text = 'Crop Data Analysis: Comparsion by Region\n' + listVar.commodity.toUpperCase();

			//
			// AOI Subtitle customization
			//
			/*var aoiSubtitle = "";
			if(dataTitle == "AGGREGATED DATA"){
				if(aggregatedDataOnly){
					aoiSubtitle += "Pakistan";
				}else{
					aoiSubtitle += listVar.chartTitle;
				}
			}else{
				aoiSubtitle += chartTitle;
			}*/

			//
			// Making Chart Title
			//
			var commoditiesListStr = listVar.cropTitles.join(', ');
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
					title: { // 2 line title (part of issue #104 fixing)
						useHTML: true,
						text: '<p>Crop Data Analysis: Comparison by Region' + '<br>' + listVar.cropTitles[0].toUpperCase() + '</p>',
						margin: 32
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />',
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
						gridLineWidth: 1
					}],
					yAxis: chartConfig.yAxis,
					plotOptions: chartConfig.plotOptions,
					tooltip: {
                        formatter: function() {
                            var s = '<b>'+ this.x +'</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name +': </span>'+
                                    '<span style="font-size:12px;">'+ i.y+'</span>';
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
						borderWidth: 0,
                        labelFormatter: function() {
                            if (this.name == 'Area (000 hectares)'){
                                return 'Area (000 ha)';
                            }else{
                                return this.name;
                            }

                        }
                    }
				},
				info: "<div id='list2' style='border: none; border='0'>" +
                      "<ol>" +
                          "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                          "<li><p><em> Date: </em>"+listVar.today+"</p></li>" +
                          "<li><p><em> Crop Data Analysis: Comparison by Region</p></li>" +
                          "<li><p><em> AOI: </em>"+listVar.chartTitle+"</p></li>" +
                          (listVar.commodity ? "<li><p><em> Commodity: </em>" + commoditiesListStr + "</p></li>" :"")+
                          "<li><p><em> Season: </em>" + listVar.season.toUpperCase() + "</p></li>" +
                          "<li><p><em> Years: </em>" + listVar.fromYear + "-" + listVar.toYear + "</p></li>" +
                      "</ol>" +
                      "</div>"
			});

            var avgInfos = '<table style="width:100%; margin-top: 4px;">' +
                             '<tr>'+
                               '<th colspan="4"><b>Mean Values</b></th>'+
                             '</tr>';

			for(var i=0; i<chartConfig.series.length; i++){
				var regionID = chartConfig.series[i].dataIndex;
				var regionLbl = chartConfig.series[i].name;
				var regionAvg = avgs[regionID].toFixed(2);
				var regionColor = chartConfig.series[i].color;
				var uom = opt.unit;

				avgInfos += '<tr>' +
				              '<td><span style="color:' + regionColor +'"> &#x25A0; </span></td>' +
				              '<td>' + regionLbl + '</td>' +
				              '<td>' + regionAvg + '</td>' +
				              '<td>' + uom + '</td>' +
				            '</tr>';
			}

            avgInfos += '</table>';
            // removes mean-values from info if chart is a percentage-stack plot
            chart.info = chartConfig.plotOptions.series.stacking != 'percent' ? chart.info + avgInfos : chart.info;
			charts.push(chart);
		}


		return charts;
	},
    /**
     * private method[getOrderedChartConfigs]
     * get chart configurations properly sorted
     * to place charts with line style on top and
     * area styles behind. The fields of the ExtJs store
     * needs and yAxis configuration needs to be sorted in the same way.
     * ``Object`` opt chartOpts object
     * data. data to use for the chart
     *
     */
	getOrderedChartConfigs:function(opt,listVar,stackedCharts, avgs){
        var ret = {};

		ret.series = [];

		for (var listFields in opt.series){
			ret.series.push(opt.series[listFields]);
		};

		// TODO
        ret.series.sort(function(a,b){
            //area,bar,line,spline are aphabetically ordered as we want
            return a.type < b.type ? -1 : 1;
        });


        //ret.avgs = [];
        //first element must be time, the other element
        // must have the same order of the opt and yAxis
        ret.fields=  [{
            name: 'time',
            type: 'string'
        }];

		ret.yAxis = [{ // AREA
			endOnTick: false,
			title: {
				text: stackedCharts.series.stacking == 'percent' ? 'Percentage (%)' : opt.name
			},
			labels: {
				formatter: function () {
					return this.value;
				},
				style: {
					color: "#666666"
				}
			},
			// doesn't plot mean-lines if chart is a percentage-stack plot
			plotLines: stackedCharts.series.stacking == 'percent' ? null : this.getChartAvgLinesConfig(opt, avgs)

		}];

		ret.plotOptions = stackedCharts;

        return ret;
    },

    /**
     * private method [getChartAvgLinesConfig]
     * makes configs to add avg-lines to charts.
     *
     * ``Object`` opt chartOpts object
     * ``Object`` avgs dictionary within name-regions and avg-values
     *
     * return: ``Array`` an array for Highcharts yAxis plotLines property.
     */
    getChartAvgLinesConfig: function(opt, avgs){
		var ret = [];
		for (var region in avgs){
			ret.push(this.getLineConfig(opt.series[region], avgs[region]));
		}
		return ret;
    },
    /**
     * private method [getLineConfig]
     * makes a configuration for an avg-line
     *
     * ``Object`` region plot configuration set
     * ``Number`` avg-value
     *
     * return: ``Object`` line configuration with value, color, ...
     */
	getLineConfig: function(regionPlotConf, regionAvg){
		var color = nrl.chartbuilder.util.hexColorToRgba(regionPlotConf.color);
		color.setAlpha(0.4);

		return {
			value: regionAvg,
			color: color.toString(),
			dashStyle: 'LongDash',
			width: 1
		}
	}
}

nrl.chartbuilder.crop.compareCommodity = {

    getData: function (json, aggregatedDataOnly,customOpt){
		var chartData = [];

		for (var i=0 ; i<json.features.length; i++) {
			var feature = json.features[i];
            //obj represent for the chart related to the selected region
			var obj = null;

			//search already existing entries
			for (var j=0; j<chartData.length; j++){
				if(chartData[j].region == feature.properties.region){
					obj = chartData[j];
				}
			}

			//create entry if doesn't exists yet
			if(!obj){
				obj = {
					region:feature.properties.region,
					title:feature.properties.region,
					rows: []
				};
				chartData.push(obj);
			}

			//create a row entry (element of the chart, time dependent)
			var yr = feature.properties.year;
			var a = feature.properties.area;
			var p = feature.properties.production;
			var yi = feature.properties.yield;
            var crop = feature.properties.crop;
			// utility object to get the proper property.
			var tempFeatureDataMap = {
				time: yr,
				area: parseFloat(a.toFixed(2)),
				prod: parseFloat(p.toFixed(2)),
				yield: parseFloat(yi.toFixed(2))
			};
            var row = null;
            //search already existing entries
			for (var j=0; j< obj.rows.length; j++){
				if(obj.rows[j].time == feature.properties.year){
					row = obj.rows[j]
				}
			}
            //create row if doesn't exists yet
			if(!row){
				row = {
                    time: feature.properties.year
				};
                obj.rows.push(row);
			}
			/*
			 * if the values requested by client are 'yield' then crop value
			 * becomes an object that carry on yield value and area to allow the
			 * computing of mean value of yield
			 */
            row[feature.properties.crop] = (customOpt.variableCompare == 'yield')
				?
					{
						value: tempFeatureDataMap[customOpt.variableCompare],
						area: tempFeatureDataMap.area
					}
				:
					tempFeatureDataMap[customOpt.variableCompare]
			;
		}

		//creates an aggregate chart
		var aggrData;
		if (chartData.length > 1){
			aggrData = {
				region: "all",
				title: "Region",
				rows: []
			};
			/*
			 * in all data that are already parsed:
			 * for each region...
			 */
			for (var i=0; i<chartData.length; i++){
				/*
				 * for each row in a region...
				 */
				for (var j=0; j<chartData[i].rows.length; j++){
					/*
					 * get the year of the data and look for an entry
					 * in the aggregate-data collection that has the same year;
					 * if there isn't, it creates one.
					 */
					var year = chartData[i].rows[j].time;
					var entry = null;
					for (var z=0; z<aggrData.rows.length; z++){
						if (aggrData.rows[z].time == year)
							entry = aggrData.rows[z];
					}
					if(!entry){
						entry = {
							time: year
						};
						aggrData.rows.push(entry);
					}
					/*
					 * for each corp in the data, update the relative value in
					 * the 'entry'.
					 */
					for(var crop in chartData[i].rows[j]){
						if (crop != 'time'){
							/*
							 * adds the sum of areas beside yield values to allow
							 * the computing of weighted average.
							 */
							if (customOpt.variableCompare == 'yield'){
								if (!entry[crop])
									entry[crop] = {
										value: 0,
										area: 0
									};
								entry[crop].value += chartData[i].rows[j][crop].value * chartData[i].rows[j][crop].area;
								entry[crop].area  += chartData[i].rows[j][crop].area;
							}else{
								var newCropData = chartData[i].rows[j][crop];
								entry[crop] = (!entry[crop]) ? newCropData : entry[crop] + newCropData;
							}
						}
					}
				}
			}

			/*
			 * computes mean values in aggregate data if the
			 * data requested by client is 'yield'.
			 */
			if (customOpt.variableCompare == 'yield')
				for(var i=0; i<aggrData.rows.length; i++){
					for(var crop in aggrData.rows[i]){
						if (crop != 'time'){
							var rowItem = aggrData.rows[i];
							rowItem[crop].value = rowItem[crop].value / rowItem[crop].area;
						}
					}
				}

			chartData.push(aggrData);

		}

		/*
		 * makes chartData matching to the highcharts specifics
		 * if necessary.
		 */
		if (customOpt.variableCompare == 'yield')
			for(var i=0; i<chartData.length; i++){
				for(var j=0; j<chartData[i].rows.length; j++){
					for(var crop in chartData[i].rows[j]){
						if (crop != 'time'){
							var rowItem = chartData[i].rows[j];
							rowItem[crop] = rowItem[crop].value;
						}
					}
				}
			}

		// Sorts array elements in ascending order numerically.
		function CompareForSort(first, second){
			if (first.time == second.time)
				return 0;
			if (first.time < second.time)
				return -1;
			else
				return 1;
		}

		//sort all year ascending
		for (var i=0; i<chartData.length; i++){
			chartData[i].rows.sort(CompareForSort);
		}

		return chartData;
	},
	/**
     * private method[getOrderedChartConfigs]
     * get chart configurations properly sorted
     * to place charts with line style on top and
     * area styles behind. The fields of the ExtJs store
     * needs and yAxis configuration needs to be sorted in the same way.
     * ``Object`` opt chartOpts object
     * data. data to use for the chart
     *
     */
	getOrderedChartConfigs:function(opt,listVar,stackedCharts, avgs){
        var ret = {};

		ret.series = [];

		for (var listFields in opt.series){
			ret.series.push(opt.series[listFields]);
		};

		// TODO
        ret.series.sort(function(a,b){
            //area,bar,line,spline are aphabetically ordered as we want
            return a.type < b.type ? -1 : 1;
        });


        //ret.avgs = [];
        //first element must be time, the other element
        // must have the same order of the opt and yAxis
        ret.fields=  [{
            name: 'time',
            type: 'string'
        }];

		ret.yAxis = [{ // AREA
			title: {
				text: stackedCharts.series.stacking == 'percent' ? 'Percentage (%)' : opt.name
			},
			labels: {
				formatter: function () {
					return this.value;
				},
				style: {
					color: "#666666"
				}
			},
			// doesn't plot mean-lines if chart is a percentage-stack plot
			plotLines: stackedCharts.series.stacking == 'percent' ? null : this.getChartAvgLinesConfig(opt, avgs)

		}];

		ret.plotOptions = stackedCharts;

        return ret;
    },
    /**
     * private method [getChartAvgLinesConfig]
     * makes configs to add avg-lines to charts.
     *
     * ``Object`` opt chartOpts object
     * ``Object`` avgs dictionary within name-regions and avg-values
     *
     * return: ``Array`` an array for Highcharts yAxis plotLines property.
     */
    getChartAvgLinesConfig: function(opt, avgs){
		var ret = [];
		for (var crop in avgs){
			ret.push(this.getLineConfig(opt.series[crop], avgs[crop]));
		}
		return ret;
    },
    /**
     * private method [getLineConfig]
     * makes a configuration for an avg-line
     *
     * ``Object`` cropPlotConf crop plot configuration set
     * ``Number`` cropAvg avg-value
     *
     * return: ``Object`` line configuration with value, color, ...
     */
	getLineConfig: function(cropPlotConf, cropAvg){
		var color = nrl.chartbuilder.util.hexColorToRgba(cropPlotConf.color);
		color.setAlpha(0.4);

		return {
			value: cropAvg,
			color: color.toString(),
			dashStyle: 'LongDash',
			width: 1
		}
	},
	makeChart: function(data, opt, listVar, aggregatedDataOnly,customOpt){

		var charts = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += arr[i][type];
			}
			return sum/len;
		};

		listVar.numRegion.sort();

		for (var r=0; r<data.length; r++){

			// makes an object of mean values, one for each crops.
            var commodityList = listVar.commodity.replace(/['\\]/g, '').split(',');
            var avgs = {};
			for(var i=0; i<commodityList.length; i++){
				var crop = commodityList[i];
				var sum = 0;
				for(var j=0; j<data[r].rows.length; j++){
					sum += data[r].rows[j][crop] == undefined ? 0 : data[r].rows[j][crop];
				}
				var avg = sum/data[r].rows.length;
				avgs[crop] = avg;
			}

            //get chart configs (sorting them properly)
            var chartConfig = this.getOrderedChartConfigs(opt,listVar,customOpt.stackedCharts, avgs);
            //console.log(chartConfig);
			// Store for random data
			var fields = [{
					name: 'time',
					type: 'string'
				}];
			for (var listFields in opt.series){
				fields.push(
					{
						name: listFields,
						type: 'float'
					}
				);
			}
			var store = new Ext.data.JsonStore({
				data: data[r],
				fields:  fields,
				root: 'rows'
			});

			var chart;

			//
			// Making Chart Title
			//

			var text = "Crop Data Analysis: Comparison by Commodity<br>";
			if (listVar.numRegion[r] === undefined){
				text += data[r].title;
			}else {
				if (listVar.numRegion[r].split(',')[1] != undefined){
					var province = '(' + listVar.numRegion[r].split(',')[1].toUpperCase() + ')';
					var district = nrl.chartbuilder.util.toTitleCase(listVar.numRegion[r].split(',')[0]);
				} else {
					var province = listVar.numRegion[r].split(',')[0].toUpperCase();
					var district = '';
				}

				text += (district == '' ? province : district + ' ' + province);
			}


			var dataTitle = data[r].title;
			var commodity = listVar.commodity.toUpperCase();

			var chartTitle = dataTitle;

			//
			// AOI Subtitle customization
			//
			var aoiSubtitle = chartTitle;
			var commoditiesListStr = listVar.cropTitles.join(', ');
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
						text: text,
						useHTML: true,
						margin: 28,
						style: {
							'font-size': '14px'
						}
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              '<span style="font-size:10px;">' + (data[r].title == 'Region' ? 'Region: ' + listVar.chartTitle : 'AOI: ' + aoiSubtitle ) + '</span><br />' +
                              '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />',

                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 10,
                        style: {
							'margin-top': '12px'
                        }
					},
					xAxis: [{
						type: 'datetime',
						categories: 'time',
						tickWidth: 0,
						gridLineWidth: 1
					}],
					yAxis: chartConfig.yAxis,
					tooltip: {
                        formatter: function() {
                            var s = '<b>'+ this.x +'</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name +': </span>'+
                                    '<span style="font-size:12px;">'+ i.y.toFixed(2)+'</span>';
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
                    ,plotOptions: chartConfig.plotOptions
				},
				info: "<div id='list2' style='border: none; border='0'>" +
                      "<ol>" +
                          "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                          "<li><p><em> Date: </em>"+listVar.today+"</p></li>" +
                          '<li><p><em> Crop Data Analysis: Comparison by Commodity </p></li>' +
                          '<li><p><em> ' + (data[r].title == 'Region' ? 'Region: </em>' + listVar.chartTitle : 'AOI: </em>' + aoiSubtitle ) + '</p></li>' +
                          (listVar.commodity ? '<li><p><em> '+ (commodityList.length > 1 ? 'Commodities' : 'Commodity') +': </em>' + commoditiesListStr + '</p></li>' :'')+
                          "<li><p><em> Years: </em>" + listVar.fromYear + "-" + listVar.toYear + "</p></li>" +
                      "</ol>" +
                      "</div>"
			});

			var avgInfos = '<table style="width:100%; margin-top: 4px;">' +
                             '<tr>'+
                               '<th colspan="4"><b>Mean Values</b></th>'+
                             '</tr>';

			for(var i=0; i<chartConfig.series.length; i++){
				var cropID = chartConfig.series[i].dataIndex;
				var cropLbl = chartConfig.series[i].name;
				var cropAvg = avgs[cropID].toFixed(2);
				var cropColor = chartConfig.series[i].color;
				var uom = opt.unit;

				avgInfos += '<tr>' +
				              '<td><span style="color:' + cropColor +'"> &#x25A0; </span></td>' +
				              '<td>' + cropLbl + '</td>' +
				              '<td>' + cropAvg + '</td>' +
				              '<td>' + uom + '</td>' +
				            '</tr>';
			}

            avgInfos += '</table>';
            // removes mean-values from info if chart is a percentage-stack plot
            chart.info = chartConfig.plotOptions.series.stacking != 'percent' ? chart.info + avgInfos : chart.info;

			charts.push(chart);
		}

		return [charts[charts.length-1]];
	}
}

nrl.chartbuilder.crop.compareSources = {
    getData: function(jsonData, variable, aoiStore){
        var getRegionValue = function(grantype, store, qParam){
            var item = store.queryBy(function(r){
                return r.data.attributes[grantype] == qParam;
            }).items[0];
            if(grantype == 'district'){
                return item.data.attributes.district + ' (' + item.data.attributes.province + ')';
            }else{
                return item.data.attributes.province;
            }
        };

        var grantype = undefined;
        if(aoiStore.data.items[0].data.attributes.district){
            grantype = 'district';
        }else{
            grantype = 'province';
        }

        var data = [];
        var regionToDataIndex = {};

        for(var i=0; i<jsonData.features.length; i++){
            var properties = jsonData.features[i].properties;
            var region = properties.region;
            var dataIndex = regionToDataIndex[region];
            var chartData = undefined;
            if (dataIndex == undefined){
                chartData = {
                    region: getRegionValue(grantype, aoiStore, region),
                    variable: variable,
                    rows: [],
                    timeToRowIndex: {}
                };
                data.push(chartData);
                regionToDataIndex[region] = data.length-1;
            }else{
                chartData = data[dataIndex];
            }

            var timeToRowIndex = chartData.timeToRowIndex;
            var x = properties.year;
            var value = properties[variable];
            var src = properties.src;

            var rowIndex = timeToRowIndex[x];
            var row = undefined;
            if (rowIndex == undefined){
                row = {
                    time: x
                };
                chartData.rows.push(row);
                timeToRowIndex[x] = chartData.rows.length-1;
            }else{
                row = chartData.rows[timeToRowIndex[x]];
            }
            row[src] = value;
        }
        return data;
    },
    getChartConfigs: function(opt,listVar){
        var ret = {};
        ret.series = [];

        for (var listFields in opt.series){
            ret.series.push(opt.series[listFields]);
        };

        // TODO
        ret.series.sort(function(a,b){
            //area,bar,line,spline are aphabetically ordered as we want
            return a.type < b.type ? -1 : 1;
        });

        ret.fields=  [{
            name: 'time',
            type: 'string'
        }];
        for (var listFields in opt.series){
            ret.fields.push({
                name: listFields,
                useNull: true
            });
        };

        ret.yAxis = [{
            title: {
                text: opt.name
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

        return ret;
    },
    getChartInfo: function(opt){
        return '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
        '<span style="font-size:10px;">Date: '     + opt.today +'</span><br />'+
        '<span style="font-size:10px;">Season: '   + opt.season.toUpperCase()+'</span><br />'+
        '<span style="font-size:10px;">Years: '    + opt.fromYear + "-"+ opt.toYear+'</span><br />'+
        '<span style="font-size:10px;">Commodity: '+ opt.commodity + '</span><br />';
    },
    makeChart: function(data, chartOpts, customOpt){
        var charts = [];
        var chartOpt = nrl.chartbuilder.crop.compareSources.getChartConfigs(chartOpts);
        var chartInfo = nrl.chartbuilder.crop.compareSources.getChartInfo(chartOpts);

        for(var i=0; i<data.length; i++){

            var store = new Ext.data.JsonStore({
                data: data[i],
                fields:  chartOpt.fields,
                root: 'rows'
            });

            var chart = new Ext.ux.HighChart({
                series: chartOpt.series,
                height: chartOpt.height,
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
                    title: { // 2 line title (part of issue #104 fixing)
                        useHTML: true,
                        text: '<p>Crop Data Analysis: Comparison by Source<br>'+ data[i].region +'</p>',
                        margin: 32
                    },
                    subtitle: {
                        text: chartInfo,
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
                        gridLineWidth: 1
                    }],
                    yAxis: [{
                        title: {
                            text: chartOpts.uomLabel.name
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            },
                            style: {
                                color: "#666666"
                            }
                        }
                    }],
                    plotOptions: chartOpt.plotOptions,
                    tooltip: {
                        formatter: function() {
                            var s = '<b>'+ this.x +'</b>';

                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name +': </span>'+
                                     '<span style="font-size:12px;">'+ (i.y != undefined ? i.y.toFixed(2) : 'n/a') +'</span>';
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
                        borderWidth: 0,
                        labelFormatter: function() {
                            if (this.name == 'Area (000 hectares)'){
                                return 'Area (000 ha)';
                            }else{
                                return this.name;
                            }
                        }
                    }
                },
                info: chartInfo
            });
            charts.push(chart);
        }
        return charts;
    }
}
