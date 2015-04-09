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



Ext.namespace('nrl.chartbuilder.agromet');

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
nrl.chartbuilder.agromet.composite = {
    
    
    makeChart: function(store, chartOpt, listVar, allPakistanRegions,customOpts){		
		var grafici = [];
        var factorFields =[];
        var fields = [];
		for (var i = 0;i<listVar.factorValues.length;i++){
            factorFields.push({
                name: listVar.factorValues[i]
            });
        }
        fields = [{
                name: 'month',
                mapping: 'properties.month'
            },{
                name: 'dec',
                mapping: 'properties.dec'
            },{
                name: 's_dec',
                mapping: 'properties.order'
            }].concat(factorFields);
       
        //create the composite records
        var current = this.createCompositeRecords(fields,store,listVar.compositevalues);
        
		for (var i = 0;i<listVar.factorStore.length;i++){
            var dataStore = new Ext.data.JsonStore({
                root: 'features',
                fields: fields
            });
            dataStore.add(current);
           
			
            dataStore.sort("s_dec", "ASC");    
			var chart;

            var getChartTitle = function(multiline){
                var title = "Agromet analysis: Composite";
                if(allPakistanRegions){
                    title += " - Pakistan";
                }else{
                    title += " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : "REGION");
                }
                title += '<br/>';
                switch (listVar.compositevalues){
                    case 'abs': {
                        title += listVar.refYear;
                    }break;
                    case 'avg': {
                        title += 'Factors mean ' + listVar.fromYear + '-' + listVar.toYear;
                    }break;
                    case 'anomalies': {
                        title += 'Factor anomalies ' + listVar.refYear + ' - (' + listVar.fromYear + '-' + listVar.toYear +')'
                    }break;
                }
                return (multiline ? title : title.replace('<br/>', ' - '));
            }

            var text = getChartTitle(true);

            var chartOpts = {
                series:[],
                height: 400
            };
            var yAxis = [];
            var unitMap = {}
            for (var f = 0; i < listVar.factorStore.length; i++){
                var factorRecord = listVar.factorStore[i];
                var serie = {
                    
                    xField:'s_dec'
                };
                serie = Ext.apply(serie,chartOpt.series[factorRecord.get('factor')]);
                chartOpts.series.push(serie);
                if(!unitMap[serie.unit]){
                    var axisUomLabel = (listVar.compositevalues == 'anomalies' && listVar.anomaliesoutput == 'rel') ? '%' : factorRecord.get('unit');
                    var axisLabel = factorRecord.get('label').replace(/(Min |Max )/g,'');
                    var yAx = { 
                        title: {
                            text: axisLabel + ' ' + axisUomLabel,
                            style: { 
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                            }							
                        },                    
                        labels: {                   
                            formatter: function () {
                                return this.value;
                            }							
                        },
                        opposite: yAxis.length % 2 != 0
                    }
                    unitMap[serie.unit] = yAx;
                    yAxis.push(yAx);
                    serie.yAxis = yAxis.length - 1;
                }else{
                    serie.yAxis = yAxis.indexOf(unitMap[serie.unit]);
                }
                
                
                
            }
            chartOpts.series.sort(function(a,b){
                //area,bar,line,spline are aphabetically ordered as we want
                return a.type < b.type ? -1 : 1;
            });
            
            var getFactorList = function(){
                var list = [];
                for(var factor in chartOpt.series)
                    list.push(chartOpt.series[factor].name);

                return list.join(', ');
            }

            var getChartDetails = function(usedInChartInfoWin){
                var details = '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />' +
                              '<span style="font-size:10px;">Date: ' + listVar.today + '</span><br />' +
                              (usedInChartInfoWin ? '<span style="font-size:10px;">Title: ' + getChartTitle(false) + '</span><br />' : '') +
                              '<span style="font-size:10px;">AOI: ' + (allPakistanRegions ? "Pakistan" : listVar.chartTitle) + '</span><br />' +
                              (usedInChartInfoWin ? '<span style="font-size:10px;">Factors: ' + getFactorList() + '</span><br />' : '') +
                              '<span style="font-size:10px;">Season: ' + listVar.season.toUpperCase() + '</span><br />';

                switch (listVar.compositevalues){
                    case 'abs': details += '<span style="font-size:10px;">Year: ' + listVar.refYear  + '</span><br />'; break;
                    case 'avg': details += '<span style="font-size:10px;">Years: ' + listVar.fromYear + '-' + listVar.toYear  + '</span><br />'; break;
                    case 'anomalies':{
                        details += '<span style="font-size:10px;">Average on: ' + listVar.fromYear + '-' + listVar.toYear  + '</span><br />';
                        details += '<span style="font-size:10px;">Reference year: ' + listVar.refYear + '</span><br />';
                    } break;
                }
                return details;
            }

			chart = new Ext.ux.HighChart({
				animation:false,
				series: chartOpts.series,
				height: chartOpt.height,
				//width: 900,
				store: dataStore,
				animShift: true,				
                alignYAxisZero: (listVar.compositevalues == 'anomalies'),
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: 144,
                        marginTop: 64
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: customOpts.highChartExportUrl
                    },
					title: {
						//text: listVar.factorStore[i].get('label') + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : "REGION")
						text: text
					},
					subtitle: {
                        text: getChartDetails(false),
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 16
					},					
					xAxis: [{
						type: 'linear',
						categories: ['s_dec'],
						tickWidth: 0,
						gridLineWidth: 1,
                        style: { 
                            backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                        },                        
						labels: {
                            style: { 
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                            },                        
                            rotation: 320,
                            y: +22,
							formatter: function () {
                               // var months = ["Nov-1","Nov-2","Nov-3","Dec-1","Dec-2","Dec-3","Jan-1","Jan-2","Jan-3","Feb-1","Feb-2","Feb-3","Mar-1","Mar-2","Mar-3","Apr-1","Apr-2","Apr-3","May-1","May-2","May-3","Jun-1","Jun-2","Jun-3","Jul-1","Jul-2","Jul-3","Aug-1","Aug-2","Aug-3","Sep-1","Sep-2","Sep-3","Oct-1","Oct-2","Oct-3"];
                                var dek = (listVar.startDec + this.value -2) % 36 +1;
                                var dek_in_mon = ((dek -1)% 3)+1;
                                var mon =Math.floor((dek-1)/3);
                                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                                return months[mon] + "-" + dek_in_mon ;//+ "(" + this.value +")" + dek;
							}							
						}                        
					}],
                    yAxis: yAxis, 
					tooltip: {
                        formatter: function() {
                            var data =  this.points[0].point.data;
                            var s = '<b>'+data.month + "-" + data.dec+'</b>';
                            
                            Ext.each(this.points, function(i, point) {
                                var uom = (listVar.compositevalues == 'anomalies' && listVar.anomaliesoutput == 'rel') ? '%' : i.series.options.unit;
                                s += '<br/><span style="color:'+i.series.color+'">' +  i.series.name + (listVar.compositevalues == 'avg' ? ' (avg)' : '') + ': </span>'+
                                    '<span style="font-size:12px;">'+ (i.y ? i.y.toFixed(2) : 'n/a') + " " + uom + '</span>';
                            });                            
                            return s;
                        },
                        shared: true,
						crosshairs: true
					}
					
					
				},
				info: getChartDetails(true)
			});
			grafici.push(chart);
		}		
		return grafici; 
	},
    createCompositeRecords: function(fields,store, compositeOpt){
        var CompositeField = Ext.data.Record.create(fields);
        var current =[];
        // map of s_dec -> factor ->record
        var map = {}
        var records = store.getRange();
        var results =[];
        var dataType = (compositeOpt == 'avg' ? 'aggregated' : 'current');
        for (var i = 0; i< records.length; i++){
            var record = records[i];
            var s_dec = record.get('s_dec');
            if(!map[s_dec]){
                map[s_dec] = {};
            } 
            map[s_dec][record.get('factor')] = record;
        }
        for (var s_dec in map ){
             obj = {
                s_dec: s_dec
            };
             for (var f = 0 in map[s_dec]){
                obj.dec = map[s_dec][f].get('dec');
                 obj.s_dec = map[s_dec][f].get('s_dec');
                obj.month = map[s_dec][f].get('month');
                obj[f] = map[s_dec][f].get( dataType );
             }
            var rec = new CompositeField(obj);
            results.push(rec);
        }
        return results;
    }

}

nrl.chartbuilder.agromet.compareTime = {

	makeChart: function(store,chartOpt, listVar, allPakistanRegions,customOpts){		
		var grafici = [];
		var factorStore = [];
		
		for (var i = 0;i<listVar.factorValues.length;i++){
            factorStore[i] = new Ext.data.JsonStore({
                root: 'features',
                fields: [{
                    name: 'factor',
                    mapping: 'properties.factor'
                },{
                    name: 'month',
                    mapping: 'properties.month'
                },{
                    name: 'dec',
                    mapping: 'properties.dec'
                },{
                    name: 's_dec',
                    mapping: 'properties.order'
                }, {
                    name: 'current',
                    mapping: 'properties.current'
                },{
                    name: 'previous',
                    mapping: 'properties.previous'
                },{
                    name: 'aggregated',
                    mapping: 'properties.aggregated'
                }]                
            });

            store.queryBy(function(record,id){
                if (record.get('factor') == listVar.factorValues[i]){
                    factorStore[i].insert(id,record);
                }
            });
			
            factorStore[i].sort("s_dec", "ASC");    
			var chart;
			
			var text = "";
			if(allPakistanRegions){
				text += listVar.factorStore[i].get('label') + " - Pakistan";
			}else{
				text += listVar.factorStore[i].get('label') + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : "REGION");
			}
			var chartOpts = {
                series :  [
					Ext.apply({
							//name:listVar.toYear -1
                            name: listVar.season == 'rabi' ? (listVar.toYear -2) + "-" + (listVar.toYear -1) : listVar.toYear -1
						},chartOpt.series.previous),
					Ext.apply({
							//name: ((listVar.season == 'rabi') &&  (new Date().getFullYear() == listVar.toYear)) ? listVar.toYear -1 + " - " + listVar.toYear : listVar.toYear
                            name: listVar.season == 'rabi' ? (listVar.toYear -1) + "-" + listVar.toYear : listVar.toYear
						},chartOpt.series.current),
					Ext.apply({
							name:"mean " + listVar.fromYear +"-"+ (listVar.toYear -1)
						},chartOpt.series.aggregated)					
				]
            };
            //SORT charts layers to follow the rule (area,bar,line)
            chartOpts.series.sort(function(a,b){
                //area,bar,line,spline are aphabetically ordered as we want
                return a.type < b.type ? -1 : 1;
            });
			chart = new Ext.ux.HighChart({
				animation:false,
				series: chartOpts.series,
				height: chartOpt.height,
				//width: 900,
				store: factorStore[i],
				animShift: true,				
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: 96
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: customOpts.highChartExportUrl
                    },
					title: {
						//text: listVar.factorStore[i].get('label') + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : "REGION")
						text: text
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />' +
                              '<span style="font-size:10px;">Date: ' + listVar.today + '</span><br />' +
                              '<span style="font-size:10px;">AOI: ' + (allPakistanRegions ? "Pakistan" : listVar.chartTitle) + '</span><br />',
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 16
					},					
					xAxis: [{
						type: 'linear',
						categories: ['s_dec'],
						tickWidth: 0,
						gridLineWidth: 1,
                        style: { 
                            backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                        },                        
						labels: {
                            style: { 
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                            },                        
                            rotation: 320,
                            y: +22,
							formatter: function () {
                               // var months = ["Nov-1","Nov-2","Nov-3","Dec-1","Dec-2","Dec-3","Jan-1","Jan-2","Jan-3","Feb-1","Feb-2","Feb-3","Mar-1","Mar-2","Mar-3","Apr-1","Apr-2","Apr-3","May-1","May-2","May-3","Jun-1","Jun-2","Jun-3","Jul-1","Jul-2","Jul-3","Aug-1","Aug-2","Aug-3","Sep-1","Sep-2","Sep-3","Oct-1","Oct-2","Oct-3"];
                                var dek = (listVar.startDec + this.value -2) % 36 +1;
                                var dek_in_mon = ((dek -1)% 3)+1;
                                var mon =Math.floor((dek-1)/3);
                                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                                return months[mon] + "-" + dek_in_mon ;//+ "(" + this.value +")" + dek;
							}							
						}                        
					}],
					yAxis: [{ // YEARS
						title: {
							text: listVar.factorStore[i].get('label')	+ " " + listVar.factorStore[i].get('unit'),
                            style: { 
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
                            }							
						},                    
						labels: {                   
							formatter: function () {
								return this.value;
							}							
						}
					}], 
					tooltip: {
                        formatter: function() {
                            var data =  this.points[0].point.data;
                            var s = '<b>'+data.month + "-" + data.dec+'</b>';
                            
                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">' + ((i.key>=1&&i.key<=18) ? ((i.key>=1&&i.key<=6) && (i.series.index==1 || i.series.index==0) ? i.series.name : ((i.series.index==1 || i.series.index==0) ? i.series.name.split("-")[1].replace(/\s/g, "") : i.series.name)) :  i.series.name) + ': </span>'+
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
				},
                info: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />' +
                      '<span style="font-size:10px;">Date: ' + listVar.today + '</span><br />' +
                      '<span style="font-size:10px;">AOI: ' + (allPakistanRegions ? "Pakistan" : listVar.chartTitle) + '</span><br />'
			});
			grafici.push(chart);
		}		
		return grafici; 
	}

}

