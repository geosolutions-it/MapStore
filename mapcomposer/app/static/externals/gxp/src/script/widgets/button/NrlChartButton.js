Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: NrlChart(config)
 *
 *    Base class to create chart
 
 *    ``createLayerRecord`` method.
 */   
gxp.widgets.button.NrlChartButton = Ext.extend(Ext.Button,{
   
    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlChartButton',
    iconCls: "gxp-icon-nrl-chart",
    handler:function(){
            //Ext.Msg.alert("Add Area","Not Yet Implemented");
            
        Ext.getCmp('id_mapTab').add({
            title: 'Crop',
            resizeTabs: true,
            closable: true,
            html: "<div id='chartContainer' style='min-height: 305px; min-width: 584px'></div>"
        });
        
        Ext.getCmp('id_mapTab').doLayout();
        
        Ext.getCmp('id_mapTab').setActiveTab(1);  
        
        var chart;    
        Ext.onReady(function () {
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'chartContainer',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Monthly Weather Data for Tokyo'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: [{
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        formatter: function() {
                            return this.value +'°C';
                        },
                        style: {
                            color: '#89A54E'
                        }
                    },
                    title: {
                        text: 'Temperature',
                        style: {
                            color: '#89A54E'
                        }
                    },
                    opposite: true
        
                }, { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Rainfall',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    labels: {
                        formatter: function() {
                            return this.value +' mm';
                        },
                        style: {
                            color: '#4572A7'
                        }
                    }
        
                }, { // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Sea-Level Pressure',
                        style: {
                            color: '#AA4643'
                        }
                    },
                    labels: {
                        formatter: function() {
                            return this.value +' mb';
                        },
                        style: {
                            color: '#AA4643'
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    formatter: function() {
                        var unit = {
                            'Rainfall': 'mm',
                            'Temperature': '°C',
                            'Sea-Level Pressure': 'mb'
                        }[this.series.name];
        
                        return ''+
                            this.x +': '+ this.y +' '+ unit;
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 80,
                    floating: true,
                    backgroundColor: '#FFFFFF'
                },
                series: [{
                    name: 'Rainfall',
                    color: '#4572A7',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        
                }, {
                    name: 'Sea-Level Pressure',
                    type: 'spline',
                    color: '#AA4643',
                    yAxis: 2,
                    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                    marker: {
                        enabled: false
                    },
                    dashStyle: 'shortdot'
        
                }, {
                    name: 'Temperature',
                    color: '#89A54E',
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }]
            });  
        });        
    }    

});

Ext.reg(gxp.widgets.button.NrlChartButton.prototype.xtype,gxp.widgets.button.NrlChartButton);
