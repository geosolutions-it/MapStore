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
 *  .. class:: NrlChart(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlAgrometChartButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
	url:'http://84.33.2.24/geoserver/ows',
    xtype: 'gxp_nrlAgrometButton',
    iconCls: "gxp-icon-nrl-chart",
	text: 'Generate Chart',
    form: null,
    chartOpt:{
		series:{
			prod:{
					name: '2009',
					color: '#89A54E',
                    lcolor: 'rgb(207,235,148)',                    
					type: 'line',
					dataIndex: 'current',
					unit:'(000 tons)',
					xField:'s_dec'

				},
			yield:{
					name: '2008',
					dashStyle: 'shortdot',
					type: 'line',
					color: '#4572A7',
                    lcolor: 'rgb(139,184,237)',
					dataIndex: 'previous',
					unit:'(kg/ha)',
					xField:'s_dec'

				},
			area:{
					name: '2000-2009',
					color: '#AA4643',
                    lcolor: 'rgb(240,140,137)',                    
					type: 'line',
					dataIndex: 'aggregated',
					unit:'(000 ha)',
					xField:'s_dec'
			}
		},
        height: 400
	},
    handler: function () {
			
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
				name: 'current',
				mapping: 'properties.current'
			},{
				name: 'previous',
				mapping: 'properties.previous'
			},{
				name: 'aggregated',
				mapping: 'properties.aggregated'
			}],
			
		});
		store.load({
			callback:function(){
				this.createResultPanel(store);
			},

			scope:this,
			params :{
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:agromet_aggregated",
				outputFormat: "json",
				viewparams:"start_year:2001;end_year:2013;season_flag:NOT"
				
				/*propertyName: "region,crop,year,production,area,yield",
				viewparams: "crop:" + commodity + ";" +
					"gran_type:" + granType + ";" +
					"start_year:" + fromYear + ";" +
					"end_year:" + toYear + ";" +
					"region_list:" + regionList + ";" +
					"yield_factor:" + prodCoeffUnits*/
			},
		});
                    
               

            
        
    },
	createResultPanel:function(store){
		 var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropData_tab');
		var charts  = this.makeChart(store);
		var resultpanel = {
			columnWidth: .95,
			style:'padding:10px 10px 10px 10px',
			xtype: 'gxp_controlpanel',
			commodity: "XXX",
			season: "XXX",
			province: "XXX",
			fromYear: "XXX",
			toYear: "XXX",
			chart: charts,
			//chartHeight: this.chartOpt.height
		};
		if(!tabs){
			var cropDataTab = new Ext.Panel({
				title: 'Crop Data',
				id:'cropData_tab',
				itemId:'cropData_tab',
				border: true,
				layout: 'form',
				autoScroll: true,
				tabTip: 'Crop Data',
				closable: true,
				items: resultpanel
			});
			tabPanel.add(cropDataTab);  
		   
		}else{
			tabs.items.each(function(a){a.collapse()});
			tabs.add(resultpanel);
		}
		Ext.getCmp('id_mapTab').doLayout();
		Ext.getCmp('id_mapTab').setActiveTab('cropData_tab');
                    
	
	},
	makeChart: function(store ){
		
		var grafici = [];
		
		
		for (var r = 0;r<1;r++){
        
			// Store for random data


			var chart;
			
			chart = new Ext.ux.HighChart({
				animation:false,
				series: [
					this.chartOpt.series.prod,
					this.chartOpt.series.yield,
					this.chartOpt.series.area
					
				],
				//height: opt.height,
				//width: 900,
				store: store,
				animShift: true,
				
				chartConfig: {
					chart: {
						zoomType: 'x',
                        spacingBottom: 23                
					},
                    exporting: {
                        enabled: true,
                        width: 1200,
                        url: "http://84.33.2.24/highcharts-export/"
                    },
					title: {
						text: 'TEST'
						
					},
					
					xAxis: [{
						type: 'datetime',
						categories: ['s_dec'],
						tickWidth: 0,
						gridLineWidth: 1
					}],
					yAxis: [{ // AREA
						title: {
							text: 'min Temperature'
							
						},                    
						labels: {
							formatter: function () {
								return this.value;
							},
							
						}
                        /*plotLines: [{ //mid values
							value: areaavg,
							color: opt.series.area.lcolor,
							dashStyle: 'LongDash',
							width: 1                       
						}] */

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
			grafici.push(chart);
		}
		
		return grafici; 
	}	
});

Ext.reg(gxp.widgets.button.NrlAgrometChartButton.prototype.xtype, gxp.widgets.button.NrlAgrometChartButton);