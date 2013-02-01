Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: NrlChart(config)
 *
 *    Base class to create chart
 
 *    ``createLayerRecord`` method.
 */
gxp.widgets.button.NrlChartButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlChartButton',
    iconCls: "gxp-icon-nrl-chart",
    handler: function () {



        var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = tabPanel.find('title', 'Crop Data');

        if (tabs && tabs.length > 0) {
            tabPanel.setActiveTab(tabs[0]);
        } else {

            var data = this.target.chartData;

            var year = [];
            var area = [];
            var prod = [];
            var yield = [];

            //unique array
            function unique(arrayName) {
                var newArray = new Array();
                label: for (var a = 0; a < arrayName.length; a++) {
                    for (var j = 0; j < newArray.length; j++) {
                        if (newArray[j] == arrayName[a]) continue label;
                    }
                    newArray[newArray.length] = arrayName[a];
                }
                return newArray;
            };

            for (var i = 0; i < data.length; i++) {
                year.push(data[i].year.substring(0, data[i].year.lastIndexOf("-")));
            }

            var uniqueYear = new Array;
            uniqueYear = unique(year);

            for (var i = 0; i < uniqueYear.length; i++) {
                var area_sum = 0;
                var prod_sum = 0;
                var yield_sum = 0;
                for (var c = 0; c < data.length; c++) {
                    if (year[c] == uniqueYear[i]) {
                        area_sum = area_sum + parseFloat(data[c].area_mHa);
                        prod_sum = prod_sum + parseFloat(data[c].prod_mTo);
                    }
                }
                area.push(parseFloat(area_sum.toFixed(2)));
                prod.push(parseFloat(prod_sum.toFixed(2)));
                yield.push(parseFloat((prod[i] / area[i]).toFixed(2)));
            }

            var obj = {
                rows: []
            };

            for (var i = 0; i < uniqueYear.length; i++) {

                var aaa = uniqueYear[i];
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
           
            var panels = [];

            for (var i = 0; i < 2; i++) {

                var chart1;
                var chart2;

                chart1 = new Ext.ux.HighChart({
                    series: [{
                        name: 'Production Tons',
                        color: '#4572A7',
                        type: 'spline',
                        yAxis: 1,
                        dataIndex: 'prod'

                    }, {
                        name: 'Yield Tons',
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
                            text: 'PUNJAB'
                        },
                        subtitle: {
                            text: 'Maize'
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
                                text: 'Yield Tons',
                                style: {
                                    color: '#AA4643'
                                }
                            },
                            labels: {
                                formatter: function () {
                                    return this.value + ' Tons';
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

                chart2 = new Ext.ux.HighChart({
                    series: [{
                        name: 'Production Tons',
                        color: '#4572A7',
                        type: 'spline',
                        yAxis: 1,
                        dataIndex: 'prod'

                    }, {
                        name: 'Yield Tons',
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
                            text: 'PUNJAB'
                        },
                        subtitle: {
                            text: 'Maize'
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
                                text: 'Yield Tons',
                                style: {
                                    color: '#AA4643'
                                }
                            },
                            labels: {
                                formatter: function () {
                                    return this.value + ' Tons';
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

                var pannello1 = new Ext.Panel({
                    title: 'Grafico ' + 2 * i,
                    layout: 'fit',
                    style:'padding:5px  5px',
                    border: true,                    
                    items: [chart1],
                    tools: [{
                        id: 'gear',
                        handler: function () {
                            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
                        }
                    }, {
                        id: 'close',
                        handler: function (e, target, panel) {
                            panel.ownerCt.remove(panel, true);
                        }
                    }],
                    collapsible: true
                });

                var pannello2 = new Ext.Panel({
                    title: 'Grafico ' + (2 * i + 1),
                    border: false,
                    layout: 'fit',
                    items: [chart2],
                    tools: [{
                        id: 'gear',
                        handler: function () {
                            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
                        }
                    }, {
                        id: 'close',
                        handler: function (e, target, panel) {
                            panel.ownerCt.remove(panel, true);
                        }
                    }],
                    collapsible: true
                });

                panels.push(pannello1);
                //panels.push(pannello2);

            }

            var cropDataTab = new Ext.Panel({
                title: 'Crop Data',
                border: true,
                layout: 'form',
                autoScroll: true,
                tabTip: 'Crop Data',
                closable: true,
                items: {
                    xtype: 'portal',
                    region: 'center',
                    //margins: '35 5 5 0',
                    //layout: 'fit',
                    title: "Commodity: " + data[0].crop + " - Season: Rabi",
                    items: [{
                        columnWidth: .99,
                        style:'padding:10px 0 10px 10px',
                        items:[{items: [panels]}]
                    }],
                    tools: [{
                        id: 'gear',
                        handler: function () {
                            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
                        }
                    }, {
                        id: 'close',
                        handler: function (e, target, panel) {
                            panel.ownerCt.remove(panel, true);
                        }
                    }],
                    collapsible: true
                }
            });

            tabPanel.add(cropDataTab);

            Ext.getCmp('id_mapTab').doLayout();
            Ext.getCmp('id_mapTab').setActiveTab(1);

            //linkTab.update();
            //linkTab.doLayout();


        }
    }
});

Ext.reg(gxp.widgets.button.NrlChartButton.prototype.xtype, gxp.widgets.button.NrlChartButton);