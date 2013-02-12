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
gxp.widgets.button.NrlChartButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlChartButton',
    iconCls: "gxp-icon-nrl-chart",
    form: null,
    
    handler: function () {
		
        var numRegion = [];
        var regStore = this.form.output.aoiFieldSet.AreaSelector.store
        var records = regStore.getRange();
		
        for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
			var region = attrs.district || attrs.province;
            numRegion.push(region.toLowerCase());
        }
        
        var data = this.form.output.getForm().getValues();
        var regionList = data.region_list.toLowerCase();
        var commodity = data.crop.toLowerCase();        
        var granType = data.areatype;
        var fromYear = data.startYear;
        var toYear = data.endYear;
        
        var media = [];
        
        var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropData_tab');
        /*
        if (tabs && tabs.length > 0) {
            tabPanel.setActiveTab(tabs[0]);
        } else {
            */
            Ext.Ajax.request({
                url : "http://84.33.2.24/geoserver/nrl/ows",
                method: 'POST',
                params :{
                    service: "WFS",
                    version: "1.0.0",
                    request: "GetFeature",
                    typeName: "nrl:CropData",
                    outputFormat: "json",
                    propertyName: "region,crop,year,production,area,yield",
                    viewparams: "crop:" + commodity + ";" +
                                "gran_type:" + granType + ";" +
                                "start_year:" + fromYear + ";" +
                                "end_year:" + toYear + ";" +
                                "region_list:" + regionList
                },
                success: function ( result, request ) {
					
						var jsonData = Ext.util.JSON.decode(result.responseText);
						if (jsonData.features.length <=0){
							Ext.Msg.alert("No data","Data not available for these search criteria");
							return;
						}
						var charts  = makeChart(jsonData);
						var resultpanel = {
							columnWidth: .99,
							style:'padding:10px 0 10px 10px',
							xtype: 'gxp_controlpanel',
							commodity: commodity,
							province: numRegion,
							fromYear: fromYear,
							toYear: toYear,
							chart: charts
							
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
                failure: function ( result, request ) {
					Ext.Msg.alert("Error","Server response error");
                }
            });           

            function makeChart( json ){
				
                var grafici = [];
                
                for (var r = 0;r<numRegion.length;r++){

                    var obj = {
                        rows: []
                    };

                    for (var i = json.features.length; i>0; i--) {
                    
                        if (json.features[i-1].properties.region.toLowerCase() == numRegion[r]){
                        
                            var aaa = json.features[i-1].properties.year.substring(0, json.features[i-1].properties.year.lastIndexOf("-"));
                            var bbb = json.features[i-1].properties.area;
                            var ccc = json.features[i-1].properties.production;
                            var ddd = json.features[i-1].properties.yield;
                
                            obj.rows.push({
                                "time": aaa,
                                "area": parseFloat(bbb.toFixed(2)),
                                "prod": parseFloat(ccc.toFixed(2)),
                                "yield": parseFloat(ddd.toFixed(2))
                            });
                            
                        }
                        
                    }
                
                    media.push(obj.rows);
                    
                    // Store for random data
                    var store = new Ext.data.JsonStore({
                        data: obj,
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

                    chart = new Ext.ux.HighChart({
                        series: [{
                            name: 'Production Tons',
                            color: '#4572A7',
                            type: 'spline',
                            yAxis: 1,
                            dataIndex: 'prod'

                        }, {
                            name: 'Yield Tons / Ha',
                            type: 'spline',
                            color: '#AA4643',
                            yAxis: 2,
                            dataIndex: 'yield'

                        }, {
                            name: 'Area Ha',
                            color: '#89A54E',
                            type: 'spline',
                            dataIndex: 'area'
                        }],
                        height: 600,
                        width: 900,
                        store: store,
                        animShift: true,
                        xField: 'time',
                        chartConfig: {
                            chart: {
                                zoomType: 'x'
                            },
                            title: {
                                text: numRegion[r].toUpperCase()
                            },
                            subtitle: {
                                text: json.features[0].properties.crop
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
                                        return this.value + ' Ha';
                                    },
                                    style: {
                                        color: '#89A54E'
                                    }
                                },
                                title: {
                                    text: 'Area Ha',
                                    style: {
                                        color: '#89A54E'
                                    }
                                }

                            }, { // Secondary yAxis
                                gridLineWidth: 0,
                                title: {
                                    text: 'Production Tons',
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                labels: {
                                    formatter: function () {
                                        return this.value + ' Tons';
                                    },
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                opposite: true

                            }, { // Tertiary yAxis
                                gridLineWidth: 0,
                                title: {
                                    text: 'Yield Tons / Ha',
                                    style: {
                                        color: '#AA4643'
                                    }
                                },
                                labels: {
                                    formatter: function () {
                                        return this.value + ' Tons / Ha';
                                    },
                                    style: {
                                        color: '#AA4643'
                                    }
                                },
                                opposite: true/*,
                                plotLines: [{ //mid values
                                    value: 1,
                                    color: 'green',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: 'Last quarter minimum'
                                    }
                                }, {
                                    value: 2,
                                    color: 'red',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    zIndex: 10,
                                    label: {
                                        text: 'Last quarter maximum'
                                    }
                                }],
                                plotBands: [{ // mark the weekend
                                    color: 'rgba(68, 170, 213, 0.2)',
                                    from: 2,
                                    to: 20000000
                                }]*/

                            }],
                            tooltip: {
                                shared: true,
                                crosshairs: true
                            }
                        }
                    });
                    grafici.push(chart);
                }
                
                if (media.length>=2){

                    var year = [];
                    var area = [];
                    var prod = [];
                    var yield = [];
                    for (var c = 0; c < media[0].length; c++){
                    
                        var area_sum = 0;
                        var prod_sum = 0;
                        var yield_sum = 0;                    
                        for(var i = 0;i<media.length;i++){
							if (media[i][c]){
								area_sum = area_sum + parseFloat(media[i][c].area);
								prod_sum = prod_sum + parseFloat(media[i][c].prod);
                            }                      
                        }
                        year.push(  media[0][c].time);
                        area.push(parseFloat(area_sum.toFixed(2)));
                        prod.push(parseFloat(prod_sum.toFixed(2)));
                        yield.push(parseFloat((prod[c] / area[c]).toFixed(2)));
                        
                    }
                    
                    var obj = {
                        rows: []
                    };

                    for (var i = 0; i < year.length; i++) {

                        var aaa = year[i];
                        var bbb = area[i];
                        var ccc = prod[i];
                        var ddd = yield[i];
            
                        obj.rows.push({
                            "time": aaa,
                            "area": bbb,
                            "prod": ccc,
                            "yield": ddd
                        });
                    }
                    
                    // Store for random data
                    var store = new Ext.data.JsonStore({
                        data: obj,
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

                    chart = new Ext.ux.HighChart({
                        series: [{
                            name: 'Production Tons',
                            color: '#4572A7',
                            type: 'spline',
                            yAxis: 1,
                            dataIndex: 'prod'

                        }, {
                            name: 'Yield Tons / Ha',
                            type: 'spline',
                            color: '#AA4643',
                            yAxis: 2,
                            dataIndex: 'yield'

                        }, {
                            name: 'Area Ha',
                            color: '#89A54E',
                            type: 'spline',
                            dataIndex: 'area'
                        }],
                        height: 600,
                        width: 900,
                        store: store,
                        animShift: true,
                        xField: 'time',
                        chartConfig: {
                            chart: {
                                zoomType: 'x'
                            },
                            title: {
                                text: "MEAN"
                            },
                            subtitle: {
                                text: json.features[0].properties.crop
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
                                        return this.value + ' Ha';
                                    },
                                    style: {
                                        color: '#89A54E'
                                    }
                                },
                                title: {
                                    text: 'Area Ha',
                                    style: {
                                        color: '#89A54E'
                                    }
                                }

                            }, { // Secondary yAxis
                                gridLineWidth: 0,
                                title: {
                                    text: 'Production Tons',
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                labels: {
                                    formatter: function () {
                                        return this.value + ' Tons';
                                    },
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                opposite: true

                            }, { // Tertiary yAxis
                                gridLineWidth: 0,
                                title: {
                                    text: 'Yield Tons / Ha',
                                    style: {
                                        color: '#AA4643'
                                    }
                                },
                                labels: {
                                    formatter: function () {
                                        return this.value + ' Tons / Ha';
                                    },
                                    style: {
                                        color: '#AA4643'
                                    }
                                },
                                opposite: true

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
        
    }
});

Ext.reg(gxp.widgets.button.NrlChartButton.prototype.xtype, gxp.widgets.button.NrlChartButton);