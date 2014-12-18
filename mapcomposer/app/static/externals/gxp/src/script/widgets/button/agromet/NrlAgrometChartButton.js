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
 *  .. class:: NrlAgrometChartButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlAgrometChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
	url: null,
    xtype: 'gxp_nrlAgrometChartButton',
    targetTab: 'agromet_tab',
	tabPanel: 'id_mapTab',
    iconCls: "gxp-icon-nrl-chart",
	text: 'Generate Chart',
    form: null,
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Agromet"},
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
    menu : {
        
        items:[{
            ref:'../chartoptions',
            iconCls:'ic_wrench',
            text: 'Options', handler: function(option){
                //Main Button
                var mainButton = this.refOwner;
                var options = mainButton.chartOpt;
                var current =  mainButton.createOptionsFildset("Reference Year",options.series['current'],'current');
                var previous =  mainButton.createOptionsFildset("Previous Year",options.series['previous'],'previous');
                var aggregated =  mainButton.createOptionsFildset("Period Mean",options.series['aggregated'],'aggregated');
                var win = new Ext.Window({
                    iconCls:'ic_wrench',
                    title:   mainButton.optionsTitle,
                    height: 400,
                    width:  350, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    layout:'fit',
                    items:  {
                        ref:'form',
                        xtype:'form',
                        frame:'true',
                        layout:'form',
                        items: [current,previous,aggregated]
                    }
                    
                    
                });
                win.show();
            }
        }]
    },
    chartOpt:{
		series:{
			current:{
					color: '#FF0000',
                    lcolor: 'rgb(207,235,148)',                    
					type: 'line',
					dataIndex: 'current',
					unit:'(000 tons)',
					xField:'s_dec'

				},
			previous:{
					type: 'line',
					color: '#4572A7',
                    lcolor: 'rgb(139,184,237)',
					dataIndex: 'previous',
					unit:'(kg/ha)',
					xField:'s_dec'

				},
			aggregated:{
					color: '#808080',
                    lcolor: 'rgb(240,140,137)', 
                    dashStyle: 'dash',                    
					type: 'line',
					dataIndex: 'aggregated',
					unit:'(000 ha)',
					xField:'s_dec'
			}
		},
        height: 400
	},
	
    handler: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} 
        if(mm<10){mm='0'+mm} 
        var today = mm+'/'+dd+'/'+yyyy;    
        
        var numRegion = [];
        var regStore = this.form.output.aoiFieldSet.AreaSelector.store
        var records = regStore.getRange();
		
        for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
			var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
            numRegion.push(region.toLowerCase());
        }
        
        var data = this.form.output.getForm().getValues();
        var regionList = data.region_list.toLowerCase();
        var season = data.season.toLowerCase();
        var granType = data.areatype;
        var fromYear = data.startYear;
        var toYear = data.endYear;
        //get start and end dekads.
        var months = this.form.output.monthRangeSelector.slider.getValues();
        var start_dec = (months[0])*3;
        var end_dec = (months[1]+1)*3; //the end month is included
        var factorStore = this.form.output.factors.getSelectionModel().getSelections();
        var factorValues = [];
        var factorList = "";
        if (factorStore.length === 0){
            Ext.Msg.alert("Grid Factors","Must be selected at least one Factor!");
            return;
        }else{
            for (var i=0;i<factorStore.length;i++){
                var factor = factorStore[i].data;
                var factorValue = factor.factor;
                factorValues.push(factorValue);
                if( i == factorStore.length - 1){
                    factorList += "'" + factorValue + "'";
                }else{
                    factorList += "'" + factorValue.concat("'\\,");                    
                }
            }
        }

        var chartTitle = "";
        var splitRegion;
        
        /*if (listVar.numRegion.length == 1){
            if (listVar.granType == "province"){
                chartTitle = listVar.numRegion[0].slice(0,1).toUpperCase() + listVar.numRegion[0].slice(1);
            }else{
                splitRegion = listVar.numRegion[0].split(',');
                chartTitle = splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
            }
        }else{*/
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
        //} 
        
        var listVar = {
            today: today,
            chartTitle: chartTitle,
            numRegion: numRegion,
            season: season,
            granType: granType,
            fromYear: fromYear,
            toYear: toYear,
            factorValues: factorValues,
			factorStore: factorStore,
            startDec: start_dec,
            endDec: end_dec
        };
        
        //loading mask
        var loadingMsg ="Please wait...";
        /* not needed anymore
        if( (granType == "province" || numRegion.length >20 ) && factorValues.lenth >1){
            loadingMsg += "<br/>This request could take a long time to be served";        
        }
        */
        var myMask = new Ext.LoadMask(this.findParentByType('form').getEl(),
        {msg:loadingMsg} );
        
        myMask.show();
		var store = new Ext.data.JsonStore({
			url: this.url,
			 sortInfo: {field: "s_dec", direction: "ASC"},
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
		
		var params =             
			(fromYear   ? "start_year:"  + fromYear + ";" : "") +
            (toYear     ? "end_year:"    + toYear + ";" : "") +
            (factorList ? "factor_list:" + factorList + ";" : "") +
            (regionList ? "region_list:" + regionList + ";" : "") +
            (start_dec  ? "start_dec:"   + start_dec + ";" : "") +
            (end_dec    ? "end_dec:"     + end_dec + ";" : "") +
            (granType   ? (granType != "pakistan" ? "gran_type:" + granType + ";" : "gran_type:province;") : "") ;
            
            
			
		var viewparams = params;
					
		store.load({
			callback:function(){
				var allPakistanRegions = (granType == "pakistan");
				this.createResultPanel(store, listVar, allPakistanRegions);
                myMask.hide();
			},
			scope:this,
			params :{
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:agromet_aggregated2",
				outputFormat: "json",
				viewparams: viewparams /*season == 'rabi' ? "start_year:"+ fromYear + ";" +
                    "end_year:"+ toYear + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "gran_type:" + granType + ";" +                            
                    "season_flag:NOT" :  
                    "start_year:"+ fromYear + ";" +
                    "end_year:"+ toYear + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "gran_type:" + granType*/
			}
		});         
    },
	
	createResultPanel:function(store, listVar, allPakistanRegions){

		var charts  = this.makeChart(store, listVar, allPakistanRegions);
		/*
		var resultpanel = {
			columnWidth: .95,
			style: 'padding:10px 10px 10px 10px',
			xtype: 'gxp_controlpanel',
			//panelTitle: "XXX",
			season: listVar.season,
			province: listVar.numRegion,
			fromYear: listVar.fromYear,
			toYear: listVar.toYear,
            today: listVar.today,
            chartTitle: listVar.chartTitle,
			chart: charts,
			chartHeight: this.chartOpt.height
		};
       
		
		if(!tabs){
			var cropDataTab = new Ext.Panel({
				title: 'AgroMet',
				id:this.targetTab,
				itemId:this.targetTab,
				border: true,
				layout: 'form',
				autoScroll: true,
				tabTip: 'AgroMet',
				closable: true,
				items: resultpanel
			});
			
			tabPanel.add(cropDataTab); 
		}else{
			tabs.items.each(function(a){a.collapse()});
			tabs.add(resultpanel);
		}
		 */
        var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,listVar);
        gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab,this.windowManagerOptions);
	},
	
	makeChart: function(store, listVar, allPakistanRegions){		
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
						},this.chartOpt.series.previous),
					Ext.apply({
							//name: ((listVar.season == 'rabi') &&  (new Date().getFullYear() == listVar.toYear)) ? listVar.toYear -1 + " - " + listVar.toYear : listVar.toYear
                            name: listVar.season == 'rabi' ? (listVar.toYear -1) + "-" + listVar.toYear : listVar.toYear
						},this.chartOpt.series.current),
					Ext.apply({
							name:"mean " + listVar.fromYear +"-"+ (listVar.toYear -1)
						},this.chartOpt.series.aggregated)					
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
				height: this.chartOpt.height,
				//width: 900,
				store: factorStore[i],
				animShift: true,				
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: 65           
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: this.highChartExportUrl
                    },
					title: {
						//text: listVar.factorStore[i].get('label') + " - " + (listVar.numRegion.length == 1 ? listVar.chartTitle : "REGION")
						text: text
					},
					subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />' +
                              '<span style="font-size:10px;">Date: ' + listVar.today + '</span><br />' +
                              '<span style="font-size:10px;">AOI: ' + (allPakistanRegions ? "Pakistan" : listVar.chartTitle) + '</span><br />' +
                              '<span style="font-size:10px;">Season: ' + listVar.season.toUpperCase() + '</span><br />' +
                              '<span style="font-size:10px;">Years: ' + listVar.fromYear + "-" + listVar.toYear + '</span><br />',
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: -15
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
				}
			});
			grafici.push(chart);
		}		
		return grafici; 
	}	
});

Ext.reg(gxp.widgets.button.NrlAgrometChartButton.prototype.xtype, gxp.widgets.button.NrlAgrometChartButton);