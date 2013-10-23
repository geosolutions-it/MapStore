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

Ext.namespace('gxp.charts');

/**
 * @author Alejandro Diaz
 */

/** api: constructor
 *  .. class:: ChartPanel(config)
 *
 *    Base class to create chart in a panel
 *
 */
 gxp.charts.ChartPanel = Ext.extend(Ext.Panel, {

 	/* ptype =  gxp_chartpanel */
 	ptype: "gxp_chartpanel",

 	chartWidth:1200,
    chartsToLoad: 0,

	text: 'Generate Chart',

    /**
     * Default provinces to generate the map (when select pakistan)
     **/
    defaultRegionList: 'Balochistan,Sindh,Pubjab,Fata,Kpk', //TODO: generate a new one or use the filter
    mapGenerationVariables: ['Area','Production','Yield'],

	// we need it to obtain the data
    form: null,

    // Geoserver url to obtain the data
    url: null,

    // config param verbose. Show messages when an error is ocurred
    verbose: false,

    /* Panel parameters */
    title: 'Crop Data',
    id:'cropData_tab',
    itemId:'cropData_tab',
    border: true,
    layout: 'form',
    autoScroll: true,
    tabTip: 'Crop Data',
    targetTab: 'id_mapTab',

    /** Chart options **/
    chartOpt:{
		series:{
			prod:{
				name: 'Production (000 tons)',
				color: '#89A54E',
				lcolor: 'rgb(207,235,148)',                    
				type: 'line',
				yAxis: 1,
				dataIndex: 'prod',
				unit:'(000 tons)'
			},
			yield:{
				name: 'Yield (kg/ha)',
				dashStyle: 'shortdot',
				type: 'line',
				color: '#4572A7',
				lcolor: 'rgb(139,184,237)',
				yAxis: 2,
				dataIndex: 'yield',
				unit:'(kg/ha)'
			},
			area:{
				name: 'Area (000 hectares)',
				color: '#AA4643',
				lcolor: 'rgb(240,140,137)',                    
				type: 'line',
				dataIndex: 'area',
				unit:'(000 ha)'
			}
		},
        spacingBottom: 145,
        height: 500,
        width: 800
	},

	initComponent: function(config){
		Ext.apply(this, config);
		this.generateData();
		gxp.charts.ChartPanel.superclass.initComponent.call(this, config);
	},
    generateData: function () {   
    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy; 
        
        var numRegion = this.getRegionArray();
        
        var data = this.form.output.getForm().getValues();
        var data2 = this.form.output.getForm().getFieldValues();
        
        var regionList = data.region_list ? data.region_list.toLowerCase() : null;//this.defaultRegionList.toLowerCase();
        var commodity = data.crop.toLowerCase();
        var season = data.season.toLowerCase();
        var granType = data.areatype.toLowerCase() == "pakistan" ? "province": data.areatype.toLowerCase();
        var fromYear = data.startYear;
        var toYear = data.endYear;
        
        var prodUnits = data2.production_unit;
        //var areaUnits = data2.area_unit == 1 ? 'Ha' : 'Sqr Km';
        
        switch(prodUnits)
        {
        case "000 tons":
          this.chartOpt.series.prod.unit = '(000 tons)';
          this.chartOpt.series.prod.name = 'Production (000 tons)';
          var prodCoeffUnits = '1000';
          break;
        case "000 kgs":
          this.chartOpt.series.prod.unit = '(000 kgs)';
          this.chartOpt.series.prod.name = 'Production (000 kgs)';
          var prodCoeffUnits = '1000';
          break;
        default:
          this.chartOpt.series.prod.unit = '(000 bales)';
          this.chartOpt.series.prod.name = 'Production (000 bales)';          
          var prodCoeffUnits = '170';
        }
        //FIXME: this may be not necessary
        // prodCoeffUnits = '1000';

        var chartTitle = "";
        var splitRegion;
        
        if (numRegion.length == 1){
        	chartTitle = this.generateChartTitle(numRegion[0]);
	        //TODO: fix it
    	}else{
        	for (var i = 0;i<numRegion.length;i++){
	        	chartTitle += this.generateChartTitle(numRegion[i]);
	            if(i<numRegion.length-1){
	                chartTitle += ", ";
	            }                
	        }
        }
        var listVar = {
            today: today,
            chartTitle: chartTitle,
            numRegion: numRegion,
            season: season,
            fromYear: fromYear,
            toYear: toYear,
            commodity: commodity
        };       
        
        var tabPanel = Ext.getCmp(this.targetTab);

        var tabs = Ext.getCmp(this.id);

        if(regionList && regionList.indexOf("'")<0){
        	regionList = "'" + regionList + "'";
        }
		
		var viewparams = (commodity      ? "crop:" + commodity + ";" : "") +
                         (granType       ? (granType.toLowerCase() != "pakistan" ? "gran_type:" + granType + ";" : "gran_type:province;") : "") +
                         (fromYear       ? "start_year:" + fromYear + ";" : "") +
                         (toYear         ? "end_year:" + toYear + ";" : "") +
                         (regionList     ? "region_list:" + regionList + ";" : "") +
                         (prodCoeffUnits ? "yield_factor:" + prodCoeffUnits : "");

        this.chartsToLoad = 0;
			
        Ext.Ajax.request({
            scope:this,
            url : this.url,
            method: 'POST',
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: "nrl:CropData",
                outputFormat: "json",
                propertyName: "region,crop,year,production,area,yield",
                viewparams: viewparams /*"crop:" + commodity + ";" +
                            "gran_type:" + granType + ";" +
                            "start_year:" + fromYear + ";" +
                            "end_year:" + toYear + ";" +
                            "region_list:" + regionList + ";" +
                            "yield_factor:" + prodCoeffUnits*/
            },
            success: function ( result, request ) {
                try{
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                }catch(e){
                    this.handleError("Error","Error parsing data from the server");
                    return;
                }
                if (jsonData.features.length <=0){
                    this.handleError("No data","Data not available for these search criteria");
                    return;
                }
				
				var aggregatedDataOnly = (granType == "pakistan");
                var data = this.getData(jsonData, aggregatedDataOnly);
                
                var charts  = this.makeChart(data, this.chartOpt, listVar, aggregatedDataOnly);
                var resultpanel = {
                    columnWidth: .95,
                    style:'padding:10px 10px 10px 10px',
                    xtype: 'gxp_controlpanel',
                    commodity: commodity,
                    today: today,
                    chartTitle: chartTitle,                        
                    season: season,
                    province: numRegion,
                    fromYear: fromYear,
                    toYear: toYear,
                    chart: charts,
                    chartHeight: this.chartOpt.height
                };
                
                if(tabPanel){
                	if(!tabs){
                    	tabPanel.add(this);  
                	}else{
	                    tabs.items.each(function(a){a.collapse()});
	                    tabs.add(resultpanel);
                	}

		            tabPanel.doLayout();
		            tabPanel.setActiveTab(this.id);
                }else{
                	this.add(resultpanel);
                	this.ownerCt.doLayout();
                }
            },
            failure: function ( result, request ) {
                this.handleError("Error","Server response error");
            }
        });       
        
    },

    handleError: function(title, cause){
    	if(this.verbose)
        	Ext.Msg.alert(title, cause);
        // TODO: Add doc for this listener and function
    	this.fireEvent("charterror", title, cause);
    },

    generateChartTitle: function(region){
    	var chartTitle = this.cleanAndCapitalize(region);
        regionList = region;
        return chartTitle;
    },

    /** config: method[cleanAndCapitalize]
     *  Utility to clean a string of "'" characters and capitalize it
     */
    cleanAndCapitalize: function(str){
        var cleanAndCap = str.replace("'", "").replace("'", ""); // clean "'" char of 'name'
        cleanAndCap = cleanAndCap.slice(0,1).toUpperCase() + cleanAndCap.slice(1).toLowerCase(); // Capitalize: Name
        return cleanAndCap;
    },

    getRegionArray: function(){
    	//TODO: Improve this function
    	var numRegion = [];
    	var records = this.regionsRecords;
        if(this.form.output.aoiFieldSet){
        	var regStore = this.form.output.aoiFieldSet.AreaSelector.store;
        	records = regStore.getRange();	

	        for (var i=0;i<records.length;i++){
				var attrs = records[i].get("attributes");
	            var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
	            numRegion.push(region.toLowerCase());
	        }
        }else{
	        var data = this.form.output.getForm().getValues();
	        // var fields = this.form.output.getForm().getFieldValues();
	        // var regionList = "'" + data.region_list.toLowerCase() +"'" ;
	        // var crop = fields.crop;
	        // numRegion.push(regionList);
	        // this code may be in the form
	        if(data.region_list){
	            // a province
	            var regionList = "'" + data.region_list.toLowerCase() +"'" ;
	            numRegion.push(regionList);
	        }else{
	            // all country. we need the default regions
	            var splittedRegions = this.defaultRegionList.split(',');
	            for(var i = 0; i < splittedRegions.length; i++){
	                numRegion.push("'" + splittedRegions[i].toLowerCase() + "'"); 
	            }
	        }
        }
        return numRegion;
    },

	getData: function (json, aggregatedDataOnly){
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
        
		return chartData;
	},
	
	makeChart: function(data, opt, listVar, aggregatedDataOnly){
		
		var grafici = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += arr[i][type];
			}
			return sum/len;
		};
		
		for (var r=0; r<data.length; r++){
        
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
			var yieldavg = getAvg(data[r].rows,'yield');
			var areaavg = getAvg(data[r].rows,'area');
			
			//
			// Making Chart Title
			//
			var text = "";
			var dataTitle = data[r].title.toUpperCase();
			var commodity = listVar.commodity.toUpperCase();
			var chartTitle = (listVar.chartTitle.indexOf(',') > -1) ? listVar.chartTitle.split(',')[r] : listVar.chartTitle;
				
			if(dataTitle){				
				if(dataTitle == "AGGREGATED DATA"){
					if(aggregatedDataOnly){
						text += dataTitle + " (Pakistan) - " + commodity;
					}else{
						text += dataTitle + " - " + commodity;
					}					
				}else{
					text += commodity + " - " + chartTitle;
				}
			}
			
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
						zoomType: 'x',
                        spacingBottom: this.chartOpt.spacingBottom,
                        height: this.chartOpt.height,
                        width: this.chartOpt.width                     
					},
                    exporting: {
                        enabled: true,
                        width: this.chartWidth,
                        url: this.target.highChartExportUrl
                    },
					title: {
						//text: (data[r].title.toUpperCase()=="AGGREGATED DATA" ? data[r].title.toUpperCase() + " - " + listVar.commodity.toUpperCase() : listVar.commodity.toUpperCase() +" - "+listVar.chartTitle.split(',')[r]) // + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : listVar.chartTitle.split(',')[r])
						text: text
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              '<span style="font-size:10px;">AOI: '+ aoiSubtitle /*(data[r].title.toUpperCase()=="AGGREGATED DATA" ? listVar.chartTitle : listVar.chartTitle.split(',')[r])*/ + '</span><br />' +
                              '<span style="font-size:10px;">Commodity: '+listVar.commodity.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />'+ 
                              '<span style="font-size:10px; color: '+opt.series.area.color+'">Area mean: '+areaavg.toFixed(2)+' '+opt.series.area.unit+'</span><br />'+
                              '<span style="font-size:10px; color: '+opt.series.prod.color+'">Prod mean: '+ prodavg.toFixed(2)+' '+opt.series.prod.unit+'</span><br />'+
                              '<span style="font-size:10px; color: '+opt.series.yield.color+'">Yield mean: '+ yieldavg.toFixed(2)+' '+opt.series.yield.unit+'</span>',
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: -10
					},
					xAxis: [{
						type: 'datetime',
						categories: 'time',
						tickWidth: 0,
						gridLineWidth: 1
					}],
					yAxis: [{ // AREA
						title: {
							text: opt.series.area.name,
                            rotation: 270,
							style: {
								color: opt.series.area.color,
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
							}
						},                    
						labels: {
							formatter: function () {
								return this.value;
							},
							style: {
								color: opt.series.area.color
							}
						},
                        plotLines: [{ //mid values
							value: areaavg,
							color: opt.series.area.lcolor,
							dashStyle: 'LongDash',
							width: 1                       
						}]

					}, { // PRODUCTION yAxis
						gridLineWidth: 0,
						title: {
							text: opt.series.prod.name,
                            rotation: 270,
							style: {
								color: opt.series.prod.color,
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
							}
						},
						labels: {
							formatter: function () {
								return this.value;
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
							dashStyle: 'LongDash',
							width: 1
						}]

					}, { // Tertiary yAxis
						gridLineWidth: 0,
						dashStyle: 'shortdot',
						title: {
							text: opt.series.yield.name,
                            rotation: 270,
							style: {
								color: opt.series.yield.color,
                                backgroundColor: Ext.isIE ? '#ffffff' : "transparent"
							},
                            x: 6
						},
						labels: {
							formatter: function () {
								return this.value;
							},
							style: {
								color: opt.series.yield.color
							}
						},
						opposite: true,
                        plotLines: [{ //mid values
							value: yieldavg,
							color: opt.series.yield.lcolor,
							dashStyle: 'LongDash',
							width: 1
						}]
					}],
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
				}
			});
			this.chartsToLoad++;
			chart.on({
				chartrefresh: function(chartRefreshed){
                    this.fireEvent('chartrefresh', chartRefreshed);
                }, 
				scope: this
			});
			grafici.push(chart);
		}
		return grafici; 
	}

});
