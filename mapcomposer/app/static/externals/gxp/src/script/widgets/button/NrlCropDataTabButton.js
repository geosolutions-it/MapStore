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
 *  .. class:: NrlCropDataTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropDataTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropDataTabButton',
    iconCls: "gxp-icon-nrl-tab",
    form: null,
	text: 'Generate Table',
    handler: function () {    

            Ext.Msg.alert("Generate Table","Not Yet Implemented");
        
    },
	getData: function (json){
		var chartData=[];
		
		for (var i =0 ; i<json.features.length; i++) {

			var feature =json.features[i];
			var obj=null;
			//search already existing entries
			for (var j= 0; j<chartData.length;j++){
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
			var yr = feature.properties.year.substring(0, feature.properties.year.lastIndexOf("-"));
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
		if (chartData.length >1){
			
			var mean = {
				region:"all",
				title:"Aggregated data",
				subtitle:json.features[0].properties.crop,
				rows: []/*,
				avgs:{
					area:0,
					prod:0,
					yield:0,
					years:0
				}*/
			};

			var meanareas = []
			var meanproductions= [];
			var meanyields = [];
			var nyears = {};
			//sum all values
			for (var i= 0; i<chartData.length;i++){
				var rows = chartData[i].rows;
				for (var j= 0; j<rows.length;j++){
					var yr = rows[j].time;
					var area =rows[j].area;
					var prod = rows[j].prod;
					var yield =rows[j].yield;
					meanareas[yr] = (meanareas[yr] ? meanareas[yr] :0) + area;
					meanproductions[yr] = (meanproductions[yr] ? meanproductions[yr]:0) +prod;
					meanyields[yr] = (meanyields[yr] ? meanyields[yr]:0) +yield;
					nyears[yr] =(nyears[yr]?nyears[yr]:0) + 1;
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
        //sort all year ascending
        for (var i= 0; i< chartData.length;i++){
            //chartData[i].rows.sort(function(a,b){return a.time > b.time});
            chartData[i].rows.sort(CompareForSort);
        
        }
        // Sorts array elements in ascending order numerically.
        function CompareForSort(first, second)
        {
            if (first.time == second.time)
                return 0;
            if (first.time < second.time)
                return -1;
            else
                return 1; 
        }
        
		return chartData;

	},
	makeChart: function( data,opt,prodUnits,areaUnits ){
		
		var grafici = [];
		var getAvg= function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum+=arr[i][type];
			}
			return sum/len;
		};
		
		for (var r = 0;r<data.length;r++){

			
			
			// Store for random data
			var store = new Ext.data.JsonStore({
				data: data[r],
				fields: [{
					name: 'time',
					type: 'string'
				}, {
					name: 'area',
					type: 'float'
				}, {
					name: 'prod',
					type: 'float'
				}, {
					name: 'yield',
					type: 'float'
				}],
				root: 'rows'
			});

			var chart;
			var prodavg = getAvg(data[r].rows,'prod');
			var yieldavg=getAvg(data[r].rows,'yield');
			var areaavg=getAvg(data[r].rows,'area');
			chart = new Ext.ux.HighChart({
				series: [
					opt.series.prod,
					opt.series.yield,
					opt.series.area
					
				],
				height: opt.height,
				//width: 900,
				store: store,
				animShift: true,
				xField: 'time',
				chartConfig: {
					chart: {
						zoomType: 'x'
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: "http://84.33.2.24/highcharts-export/"
                    },
					title: {
						text: data[r].title.toUpperCase()
					},
					subtitle: {
                        text: '<span style="font-size:10px; color: '+opt.series.area.color+'">Area mean: '+areaavg.toFixed(2)+' '+areaUnits+'</span><br />'+
                              '<span style="font-size:10px; color: '+opt.series.prod.color+'">Prod mean: '+ prodavg.toFixed(2)+' '+prodUnits+'</span><br />'+
                              '<span style="font-size:10px; color: '+opt.series.yield.color+'">Yield mean: '+ yieldavg.toFixed(2)+' '+prodUnits+'/'+areaUnits+'</span>',
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: -25
					},
					xAxis: [{
						type: 'datetime',
						categories: 'time',
						tickWidth: 0,
						gridLineWidth: 1
					}],
					yAxis: [{ // Primary yAxis
						labels: {
							formatter: function () {
								return this.value + opt.series.area.unit;
							},
							style: {
								color: opt.series.area.color
							}
						},
						title: {
							text: opt.series.area.name,
							style: {
								color: opt.series.area.color
							}
						},
                        plotLines: [{ //mid values
							value: areaavg,
							color: opt.series.area.lcolor,
							dashStyle: 'line',
							width: 2
						}]

					}, { // Secondary yAxis
						gridLineWidth: 0,
						title: {
							text: opt.series.prod.name,
							style: {
								color: opt.series.prod.color
							}
						},
						labels: {
							formatter: function () {
								return this.value + opt.series.prod.unit;
							},
							style: {
								color: opt.series.prod.color
							}
						},
						opposite: true,
                        plotLines: [{ //NOTE all the mid values are overlapping in the middle of the chart
						 //mid values
							value: prodavg,
							color: opt.series.prod.lcolor,
							dashStyle: 'line',
							width: 2
						}]

					}, { // Tertiary yAxis
						gridLineWidth: 0,
						dashStyle: 'shortdot',
						title: {
							text: opt.series.yield.name,
							style: {
								color: opt.series.yield.color
							}
						},
						labels: {
							formatter: function () {
								return this.value + opt.series.yield.unit;
							},
							style: {
								color: opt.series.yield.color
							}
						},
						opposite: true,
                        plotLines: [{ //mid values
							value: yieldavg,
							color: opt.series.yield.lcolor,
							dashStyle: 'line',
							width: 2
						}]
					}],
					tooltip: {
						shared: true,
						crosshairs: true
					}
				}
			});
			grafici.push(chart);
		}
		
		return grafici; 
	}	
});

Ext.reg(gxp.widgets.button.NrlCropDataTabButton.prototype.xtype, gxp.widgets.button.NrlCropDataTabButton);