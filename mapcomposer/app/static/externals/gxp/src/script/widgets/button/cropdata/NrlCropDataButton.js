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
 *  .. class:: NrlCropDataButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropDataButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropDataButton',
    iconCls: "gxp-icon-nrl-chart",
	text: 'Generate Chart',
    optionsTitle: "Chart Options",
    tabPanel:'id_mapTab',
    targetTab: 'cropData_tab',
    form: null,
    url: null,
    typeName:"nrl:CropData2",
	stackedCharts: {
		series: {
			stacking:null
		}
	},
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Crop Data"},
    /**
     * private method[createOptionsFildset]
     * ``String`` title the title of the fieldset 
     * ``Object`` opts the chartopts object to manage
     * ``String`` prefix the prefix to use in radio names
     */
    createOptionsFildset: function(title,opts,prefix){
        
        var fieldSet = {
                xtype:'fieldset',
                title:title,
                items:[{
                    //type
                    fieldLabel:"Type",
                    xtype:"radiogroup", 
                    columns:2,
                     items:[
                        {  boxLabel:"<span class=\"icon_span ic_chart-line\">Line</span>",name:prefix+"_chart_type",inputValue:"line", checked : opts.type == "line"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-spline\">Curve</span>",name:prefix+"_chart_type",inputValue:"spline", checked : opts.type == "spline"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-bar\">Bar</span>",name:prefix+"_chart_type", inputValue:"column",checked : opts.type == "column"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-area\">Area</span>",name:prefix+"_chart_type", inputValue:"area",checked : opts.type == "area"}
                        
                    ],
                    listeners: {
                        change: function(group,checked){
                            if(checked){
                                opts.type = checked.inputValue;
                            }
                        }
                    },
                    scope:this
                },{ //color
                    fieldLabel: 'Color', 
                    xtype:'colorpickerfield',
                    anchor:'100%',
                    value : opts.color.slice(1),
                     listeners: {
                        select: function(comp,hex,a,b,c,d,e){
                            if(hex){
                                opts.color = '#' + hex;
                                var rgb = comp.menu.picker.hexToRgb(hex);
                                opts.lcolor = "rgb(" +rgb[0]+ "," +rgb[1]+ ","+rgb[2]+ ")";
                            }
                        }
                    }
                }]
        }
        return fieldSet;
    },
    createStackChartsOptions: function(stackedCharts){
		
		var fieldSet = {
			xtype: 'fieldset',
			title: 'Stack charts of the same type',
			scope: this,
			items: [{
				xtype: 'radiogroup',
				columns:1,			
				fieldLabel: "Stack charts",
				hideLabel: true,
				items:[{
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
					change: function(c,checked){
						stackedCharts.series.stacking = checked.inputValue;
					}
				},
				scope: this
			}]
		};
		return fieldSet;
		
	},	
    menu : {
        
        items:[{
            ref:'../chartoptions',
            iconCls:'ic_wrench',
            text: 'Options',
			handler:function(option){
				
                //Main Button
                var mainButton = this.refOwner;
				var options = mainButton.chartOpt;				
				var optionsCompare = mainButton.chartOptCompare;			
				var stackedCharts = mainButton.stackedCharts;
				var fieldSetList = [];
				
				var form = mainButton.form.output.getForm();
				var data = form.getValues();
				var mode = data.mode;	
				
				if (mode === 'composite'){
					
					var prodOpt =  mainButton.createOptionsFildset("Production",options.series['prod'],'prod');
					var areaOpt =  mainButton.createOptionsFildset("Area",options.series['area'],'area');
					var yieldOpt =  mainButton.createOptionsFildset("Yield",options.series['yield'],'yield');
					
					fieldSetList = [prodOpt,areaOpt,yieldOpt];
					
				}else{
					for (var compareRegion in optionsCompare.series){
						fieldSetList.push(mainButton.createOptionsFildset(compareRegion,optionsCompare.series[compareRegion],compareRegion));						
					}
					fieldSetList.push(mainButton.createStackChartsOptions(stackedCharts));					
				}
				
                var win = new Ext.Window({
                    iconCls:'ic_wrench',
                    title:   mainButton.optionsTitle,
                    height: 400,
                    width:  350, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:true,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    layout:'fit',
                    items:  {
                        ref:'form',
                        xtype:'form',
						autoScroll:true,
                        frame:'true',
                        layout:'form',
                        items: fieldSetList
                    }
                    
                    
                });
                win.show();
				
            }
        }]
    },
	
	chartOptCompare:{},	
	
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
        height: 500
	},
    /**
     * api method[handler]
     * generate the chart
     */
    handler: function () {   
    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy; 
        
        var numRegion = [];
        var regStore = this.form.output.aoiFieldSet.AreaSelector.store
        var records = regStore.getRange();
		
        for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
            var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
            numRegion.push(region.toLowerCase());
        }
		
        var form = this.form.output.getForm();
        var data = form.getValues();
        var data2 = form.getFieldValues();
        var units = this.form.output.units;
        
        var regionList = data.region_list.toLowerCase();
        var commodity = data2.crop; // fixes #66 issue;
        var season = data.season.toLowerCase();
        var granType = data.areatype;
        var fromYear = data.startYear;
        var toYear = data.endYear;

		/* START COMPARE SECTION*/
		
		this.mode = data.mode;		
		this.variableCompare = data.compare_variable;
		
		var commoditiesStore  = this.form.output.commodities.getSelectionModel().getSelections();
		var factorValues = [];
		var factorList = "";

		if (this.mode === 'compareCommodity'){
			if (commoditiesStore.length === 0){
				Ext.Msg.alert("Grid Commodities","Must be selected at least one Commodity!");
				return;
			}else{
				var commodities = commoditiesStore[0].data;
				
				for (var i=0;i<commoditiesStore.length;i++){
					var crop = commoditiesStore[i].data;
					var factorValue = crop.crop;
					factorValues.push(factorValue);
					if( i == commoditiesStore.length - 1){
						factorList += "'" + factorValue + "'";
					}else{
						factorList += "'" + factorValue.concat("'\\,");                    
					}
				}
				Ext.Msg.alert("Grid Commodities","Comparison by Commodity not yet implemented!!!");
				return;
			}
		}

		/* END
		###############################
		## new var for compareRegion ##
		###############################
		*/
        
        //get unit of measure id
        var prodUnits = data2.production_unit;
        var areaUnit = data2.area_unit;
        var yieldUnit = data2.yield_unit;
        //get the full record 
        var getSelectedRecord = function(combo,uid){
            var store = combo.getStore();
            var i = store.findExact('uid',uid);
            return store.getAt(i);
        }
        // get selected record for each combo
        var prodRec = units.production.getUnitRecordById( prodUnits );
        var areaRec = units.area.getUnitRecordById( areaUnit );
        var yieldRec = units.yield.getUnitRecordById( yieldUnit );
        
        if(!(prodRec && areaRec && yieldRec)){
            //DEBUG
            console.log(prodRec);
            console.log(areaRec);
            console.log(yieldRec);
            //alert("prod "+prodCoeffUnits+"area "+ areaCoeffUnits+ "yield "+ yieldCoeffUnits)
        }
        
        // get coefficient for yield,area and production
        var prodCoeffUnits = prodRec &&  prodRec.get('coefficient');
        var areaCoeffUnits = areaRec && areaRec.get('coefficient');
        var yieldCoeffUnits = yieldRec && yieldRec.get('coefficient');
        
		
        //set labels for chart opts
        this.chartOpt.series.prod.unit  = '('+prodRec.get('shortname')+')';
        this.chartOpt.series.area.unit = '('+areaRec.get('shortname')+')';
        this.chartOpt.series.yield.unit = '('+yieldRec.get('shortname')+')';
        
        this.chartOpt.series.prod.name  = 'Production ('+prodRec.get('name')+')';
        this.chartOpt.series.area.name = 'Area ('+areaRec.get('name')+')';
        this.chartOpt.series.yield.name = 'Yield ('+yieldRec.get('name')+')';
		
		for (var compareRegion in this.chartOptCompare.series){
			switch (this.variableCompare) {
				case ('prod'):
					this.chartOptCompare.unit = '('+prodRec.get('shortname')+')';
					this.chartOptCompare.name = 'Production ('+prodRec.get('name')+')';
					break;
				case ('area'):
					this.chartOptCompare.unit = '('+areaRec.get('shortname')+')';
					this.chartOptCompare.name = 'Area ('+areaRec.get('name')+')';
					break;
				case ('yield'):
					this.chartOptCompare.unit = '('+yieldRec.get('shortname')+')';
					this.chartOptCompare.name = 'Yield ('+yieldRec.get('name')+')';
					break;
			}
		}	
		
        var chartTitle = "";
        var splitRegion;
        
        for (var i = 0;i<numRegion.length;i++){
            if (granType == "province"){
                if(i==numRegion.length-1){
                    chartTitle += numRegion[i].slice(0,1).toUpperCase() + numRegion[i].slice(1);
                }else{
                    chartTitle += numRegion[i].slice(0,1).toUpperCase() + numRegion[i].slice(1) + ", ";
                }                
            }else{
                splitRegion = numRegion[i].split(',');
                if(i==numRegion.length-1){
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
                }else{
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + "), ";
                }                       
            }            
        }
        
		// check if composite or compareRegion
		var viewParamsCrop = commodities ? commodities : commodity;
		//var viewParamsCrop = commodities ? commodities.crop : commodity;
		
        var listVar = {
            today: today,
            chartTitle: chartTitle,
            numRegion: numRegion,
            season: season,
            fromYear: fromYear,
            toYear: toYear,
            commodity: viewParamsCrop,
			variableCompare: this.variableCompare
        };       
        
        var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropData_tab');
		
		var viewparams = (viewParamsCrop     ? "crops:'" + viewParamsCrop + "';" : "") +
                         (granType        ? (granType != "pakistan" ? "gran_type:" + granType + ";" : "gran_type:province;") : "") +
                         (fromYear        ? "start_year:" + fromYear + ";" : "") +
                         (toYear          ? "end_year:" + toYear + ";" : "") +
                         (regionList      ? "region_list:" + regionList + ";" : "") +
                         (prodCoeffUnits  ? "prod_factor:" + prodCoeffUnits + ";" : "") +
                         (areaCoeffUnits  ? "area_factor:" + areaCoeffUnits + ";" : "") +
                         (yieldCoeffUnits ? "yield_factor:" + yieldCoeffUnits + ";" : "");
			
        Ext.Ajax.request({
            scope:this,
            url : this.url,
            method: 'POST',
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: this.typeName,
                outputFormat: "json",
                propertyName: "region,crop,year,production,area,yield",
                viewparams: viewparams 
            },
            success: function ( result, request ) {
                try{
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                }catch(e){
                    Ext.Msg.alert("Error","Error parsing data from the server");
                    return;
                }
                if (jsonData.features.length <=0){
                    Ext.Msg.alert("No data","Data not available for these search criteria");
                    return;
                }
				
				var aggregatedDataOnly = (granType == "pakistan");
				
				
				if (this.mode === 'composite'){
					var data = this.getData(jsonData, aggregatedDataOnly);
					var charts  = this.makeChart(data, this.chartOpt, listVar, aggregatedDataOnly);
				}else{
					var data = this.getDataCompare(jsonData, aggregatedDataOnly);
					var charts  = this.makeChartCompare(data, this.chartOptCompare, listVar, aggregatedDataOnly, this.stackedCharts);
				}

                var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,listVar);
                gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab, this.windowManagerOptions);
            },
            failure: function ( result, request ) {
                Ext.Msg.alert("Error","Server response error");
            }
        });       
        
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
	
	getDataCompare: function (json, aggregatedDataOnly){
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
					crop: feature.properties.crop,
					title:feature.properties.region,
					subtitle:feature.properties.crop,
					rows: []
				};
				chartData.push(obj);
			}
			
			//create a row entry
			var yr = feature.properties.year;
			var a = feature.properties.area;
			var p = feature.properties.production;
			var yi = feature.properties.yield;
			
			var row = {
				time: yr,
				area: parseFloat(a.toFixed(2)),
				prod: parseFloat(p.toFixed(2)),
				yield: parseFloat(yi.toFixed(2))
			};
			
			obj.rows.push(row);

		}
		
		var newChartData = [];

		var newObj = {
			title: this.variableCompare,
			rows: []
		};	
		
		var count = 0;
		
		chartData.reverse();
		
		for (var i = 0; i<chartData.length;i++){

			for (var x = 0; x<chartData[i].rows.length;x++){
				var variable = chartData[i].rows[x][this.variableCompare];
				var time = chartData[i].rows[x]['time'];
				var newRegion = chartData[i].region.toLowerCase();
				
				var newRows = {};
				
				newRows[newRegion] = variable;
				newRows['time'] = time;

				if  (count===0){
					newObj.rows.push(newRows);
				}
				
				if(typeof newObj.rows[x] != 'undefined'){
					if (newObj.rows[x].time === newRows['time']){
						newObj.rows[x][newRegion] = variable;						
					}				
				}
			}
			
			count++;			
		}
		
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
            plotLines: [{ //mid values
                value: avg,
                color: opt.color,//opt.series.area.lcolor,
                dashStyle: 'LongDash',
                width: 1                       
            }]

        }
    
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
                    ret.avgs[i] = avgs[k];
                    
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
                //yAxis.rotation = 90;
                
            }
        }
        return ret;

    
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
	getOrderedChartConfigsCompare:function(opt,listVar,stackedCharts){
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
				text: ""
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
		
		ret.plotOptions = stackedCharts;
		
        return ret;    
    },
	
	makeChart: function(data, opt, listVar, aggregatedDataOnly){
		
		var charts = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += arr[i][type];
			}
			return sum/len;
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
            var chartConfig = this.getOrderedChartConfigs(opt,avgs);
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
			var commodity = listVar.commodity.toUpperCase();
            
			var chartTitle = listVar.chartTitle.split(',')[r];
			
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
				series: chartConfig.series,				
				
				height: opt.height,
				//width: 900,
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
				}
			});
			charts.push(chart);
		}
		
		return charts; 
	},
	
	makeChartCompare: function(data, opt, listVar, aggregatedDataOnly, stackedCharts){
		
		var charts = [];
		var getAvg = function(arr,type) {
			var sum = 0,len = arr.length;
			for (var i=0;i<len;i++){
				sum += arr[i][type];
			}
			return sum/len;
		};
		
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
            var chartConfig = this.getOrderedChartConfigsCompare(opt,listVar,stackedCharts);
			
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
			chart = new Ext.ux.HighChart({
				series: chartConfig.series,				
				
				height: opt.height,
				//width: 900,
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
                        url: this.target.highChartExportUrl
                    },
					title: {
						//text: (data[r].title.toUpperCase()=="AGGREGATED DATA" ? data[r].title.toUpperCase() + " - " + listVar.commodity.toUpperCase() : listVar.commodity.toUpperCase() +" - "+listVar.chartTitle.split(',')[r]) // + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : listVar.chartTitle.split(',')[r])
						text: text
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              //'<span style="font-size:10px;">AOI: '+ listVar.chartTitle  + '</span><br />' +
                              '<span style="font-size:10px;">Commodity: '+listVar.commodity.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />'+
                              '<span style="font-size:10px;">Years: '+ listVar.fromYear + "-"+ listVar.toYear+'</span><br />', //+ 
                              //'<span style="font-size:10px; color: '+opt.series.area.color+'">Area mean: '+areaavg.toFixed(2)+' '+opt.series.area.unit+'</span><br />'+
                              //'<span style="font-size:10px; color: '+opt.series.prod.color+'">Prod mean: '+ prodavg.toFixed(2)+' '+opt.series.prod.unit+'</span><br />'+
                              //'<span style="font-size:10px; color: '+opt.series.yield.color+'">Yield mean: '+ yieldavg.toFixed(2)+' '+opt.series.yield.unit+'</span>',
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
				}
			});
			charts.push(chart);
		}
		
		return charts; 
	},
    randomColorsRGB: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return rgb;
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    randomColorsHEX: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    }	
});


Ext.reg(gxp.widgets.button.NrlCropDataButton.prototype.xtype, gxp.widgets.button.NrlCropDataButton);
