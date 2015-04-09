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
 *  .. class:: NrlCropStatusChartButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropStatusChartButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    url:'http://84.33.2.24/geoserver/ows',
    xtype: 'gxp_nrlCropStatusChartButton',
    iconCls: "gxp-icon-nrl-chart",
    text: 'Generate Chart',
    form: null,
    tabPanel: 'id_mapTab',
    targetTab: 'cropstatus_tab',
	/**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Crop Status"},
    chartOpt:{
        series:{
            range:{
                color: '#89A54E',
                lcolor: 'rgb(207,235,148)',      
                fillOpacity: 0.1,
                type: 'arearange',
                highDataIndex: 'max',
                lowDataIndex:'min',
                xField:'s_dec',
                enableMouseTracking:false,
                lineWidth:0,
                showInLegend:false
            },
            max:{
                name:"Max",
                color: '#89A54E',
                lcolor: 'rgb(207,235,148)',                    
                type: 'line',
                dataIndex: 'max',
                xField:'s_dec',
                lineWidth:1,
                marker: {
                    symbol: 'triangle-down'
                }
            },
            min:{
                name:"Min",
                color: '#89A54E',
                lcolor: 'rgb(207,235,148)',                    
                type: 'line',
                dataIndex: 'min',
                xField:'s_dec',
                lineWidth:1,
                marker: {
                    symbol: 'triangle'
                }
            },
             opt:{
                name:"Optimal",
                color: '#89A54E',
                lcolor: 'rgb(207,235,148)',                    
                type: 'line',
                lineWidth:1,

                dashStyle: 'dash',                    
                dataIndex: 'opt',
                xField:'s_dec',
                marker: {
                    enabled: false
                }
            },
            data:{
                color: '#AA4643',
                lcolor: 'rgb(240,140,137)',                    
                type: 'line',
                dataIndex: 'value',
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
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy;    
        //Ext.Msg.alert("Generate Chart","Not Yet Implemented");
        //return;
            
        var numRegion = [];
        var data = this.form.output.getForm().getValues();
        var fields = this.form.output.getForm().getFieldValues();
        var regionList = "'" + data.region_list.toLowerCase() +"'" ;
        var crop = this.form.output.form.getValues().crop;
        numRegion.push(regionList);
        
        
        var season = data.season.toLowerCase();
        var granType = data.areatype;
        var year = data.year;
        var toYear = data.endYear;

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
                if(i==factorStore.length-1){
                    factorList += "'" + factorValue + "'";
                }else{
                    factorList += "'" + factorValue.concat("'\\,");
                    
                }
            }
        }
        
        var district = this.form.output.singleFeatureSelector.singleSelector.selectButton.store.data.items[0].data.attributes.district;
        var province = this.form.output.singleFeatureSelector.singleSelector.selectButton.store.data.items[0].data.attributes.province;

        var listVar = {
            numRegion: numRegion,
            season: season,
            granType: granType,
            year: year,
            crop:crop,
            factorValues: factorValues,
            factorStore: factorStore,
            today:today,
            place: {
                district: district,
                province: province
            }
        };
        
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
                mapping: 'properties.s_dec'
            }, {
                name: 'value',
                mapping: 'properties.value'
            },{
                name: 'max',
                mapping: 'properties.max'
            },{
                name: 'min',
                mapping: 'properties.min'
            },{
                name: 'opt',
                mapping: 'properties.opt'
            }]
            
		});
		store.load({
			callback:function(){
				this.createResultPanel(store,listVar);
			},

			scope:this,
			params :{
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:crop_status",
				outputFormat: "json",
				viewparams: season == 'rabi' ? 
                    "year:"+ year + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "gran_type:" + granType + ";" +      
                    "crop:" + crop.toLowerCase() + ";" +
                    "season_flag:NOT" :  
                    "year:"+ year + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "crop:" + crop.toLowerCase() + ";" +
                    "gran_type:" + granType
			}
		}); 
        
    },
	createResultPanel:function(store,listVar){
		 var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropstatus_tab');
		var charts  = this.makeChart(store,listVar);
		var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,listVar);
        gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab,this.windowManagerOptions);
                    
	
	},
	makeChart: function(store,listVar){
		
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
                    mapping: 'properties.s_dec'
                }, {
                    name: 'value',
                    mapping: 'properties.value'
                },{
                    name: 'max',
                    mapping: 'properties.max'
                },{
                    name: 'min',
                    mapping: 'properties.min'
                }]
                
            });

            store.queryBy(function(record,id){
                if (record.get('factor') == listVar.factorValues[i]){
                    factorStore[i].insert(id,record);
                }
            });
            
            factorStore[i].sort("s_dec", "ASC");    
			var chart;
			var unit =listVar.factorStore[i].get('unit');
            var refYear = parseInt(listVar.year);
            if (listVar.season == 'rabi'){
                var yearInTitle = refYear-1 + "-" + (refYear+"").substr(2,2);
            }else{
                var yearInTitle = refYear;
            }
            var chartTitle = yearInTitle + ' - ' + listVar.factorStore[i].get('label');
            var aoiLabel = listVar.numRegion[0].replace(/[']/g,'');
            if (listVar.granType == 'PROVINCE'){
                aoiLabel = listVar.place.province;
            }else{
                aoiLabel = listVar.place.district + ' (' +listVar.place.province+')';
            }
			chart = new Ext.ux.HighChart({
				animation:true,
				series: [
                        this.chartOpt.series.opt,
                        this.chartOpt.series.range,
						this.chartOpt.series.max,
                        this.chartOpt.series.min,
                        Ext.apply({
							name: listVar.factorStore[i].get('label')
						},
                        this.chartOpt.series.data)
                        
				],
				height: this.chartOpt.height,
				//width: 900,
				store: factorStore[i],
				animShift: true,
				info:   "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                            
                            "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                            "<li><p><em> Date: </em>" +  listVar.today +   "</p></li>" +
                            "<li><p><em> AOI: </em>" + aoiLabel +"</p></li>" +
                            "<li><p><em> Commodity: </em>" + listVar.crop  + "</p></li>" +
							"<li><p><em> Season: </em>" + listVar.season.toUpperCase() + "</p></li>" +
						"</ol>" +                                        
						"</div>",
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: 128
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: this.highChartExportUrl
                    },
					title: {
						text: chartTitle
					},					
					xAxis: [{
						type: 'datetime',
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
                                var months = ["Nov-1","Nov-2","Nov-3","Dec-1","Dec-2","Dec-3","Jan-1","Jan-2","Jan-3","Feb-1","Feb-2","Feb-3","Mar-1","Mar-2","Mar-3","Apr-1","Apr-2","Apr-3","May-1","May-2","May-3","Jun-1","Jun-2","Jun-3","Jul-1","Jul-2","Jul-3","Aug-1","Aug-2","Aug-3","Sep-1","Sep-2","Sep-3","Oct-1","Oct-2","Oct-3"];
                                if (this.axis.dataMin == 1){
                                    //return months[this.value-1] + "-" + this.value;
                                    return months[this.value-1];
                                }else{
                                    return months[this.value-1];
                                }								
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
                            var months = ["Nov-1","Nov-2","Nov-3","Dec-1","Dec-2","Dec-3","Jan-1","Jan-2","Jan-3","Feb-1","Feb-2","Feb-3","Mar-1","Mar-2","Mar-3","Apr-1","Apr-2","Apr-3","May-1","May-2","May-3","Jun-1","Jun-2","Jun-3","Jul-1","Jul-2","Jul-3","Aug-1","Aug-2","Aug-3","Sep-1","Sep-2","Sep-3","Oct-1","Oct-2","Oct-3"];
                            if (this.x>=1 && this.x<=18){
                                var s = '<b>'+ months[this.x-1] +'</b>';
                            }else{
                                var s = '<b>'+ months[this.x-1] +'</b>';
                            }
                            Ext.each(this.points, function(i, point) {
                                s += '<br/><span style="color:'+i.series.color+'">'+ i.series.name  +': </span>'+
                                    '<span style="font-size:12px;">'+ i.y.toFixed(2)+( unit !=null ? unit: "" )+'</span>';
                            });                            
                            return s;
                        },
                        shared: true,
						crosshairs: true
					},
                    
                    subtitle: {
                        text: '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />'+
                              '<span style="font-size:10px;">Date: '+ listVar.today +'</span><br />'+
                              '<span style="font-size:10px;">AOI: '+ aoiLabel +'</span><br />'+
                              '<span style="font-size:10px;">Commodity: '+listVar.crop+'</span><br />'+
                              '<span style="font-size:10px;">Season: '+listVar.season.toUpperCase()+'</span><br />',
                        align: 'left',
                        verticalAlign: 'bottom',
                        useHTML: true,
                        x: 30,
                        y: 16
					}                    
				}
			});
			grafici.push(chart);
		}		
		return grafici; 
	}	
});

Ext.reg(gxp.widgets.button.NrlCropStatusChartButton.prototype.xtype, gxp.widgets.button.NrlCropStatusChartButton);