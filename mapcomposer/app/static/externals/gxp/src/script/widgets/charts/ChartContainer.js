/**
 *  Copyright (C) 2007 - 2016 GeoSolutions S.A.S.
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

/** api: constructor
 *  .. class:: JSChartsPanel(config)
 *
 *    Chart that renders pipeline statistics
 *
 */
gxp.charts.ChartContainer = Ext.extend(Ext.Container, {
    
    /* ptype =  gxp_chartcontainer */
    xtype: "gxp_chartcontainer",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: true,
    style:'padding:10px',
    chartConfig: {},
    store: null,
    initComponent: function () {
        
        this.store.on('beforeload',function(){
            this.getEl().mask("Please wait...","x-mask-loading");
        },this);
        this.store.on('load',function(){
            this.getEl().unmask();
        },this);
        this.store.on('loadexception',function(){
            this.getEl().unmask();
        },this);

        var me = this;
        this.items = [{
                xtype:'gxp_chart_panel',
                title: this.chartTypeTitleText,
                anchor:'100%',
                layout:'border',
                height:400,
                legendRef:'legendPanel',
                store:this.store,
                // showLegend: this.chartConfig.chartType !== 'gauge' && this.chartConfig.chartType !== 'line' && this.chartConfig.chartType !== 'bar',
                showLegend: this.chartConfig.chartType !== 'gauge',
                autoScroll: this.chartConfig.chartType === 'gauge',
                chartOptions:{
                    xtype: this.chartConfig.chartType === 'gauge' ? 'gxp_JustGageChart' : 'gxp_ChartJsChart',
                    mask:false,
                    legendRef:'legendPanel',
                    ref: 'chart',
                    store:this.store,
                    type: this.chartConfig.chartType,
                    gaugeMax: this.chartConfig.gaugeMax,
                    color: this.chartConfig.color,
                    valueField:'value',
                    labelField:'label',
                    autoColorOptions:{base:180,range:300, s: 0.67,v :0.67},
                    listeners: {
                        chartrefresh: function (chart){
                            me.doLayout();
                        },
                        animationend: function(){
                            if(this.chart){
                                this.chart.draw();
                            }
                        }
                    }
                }
        }];

        gxp.charts.ChartContainer.superclass.initComponent.call(this);
    }

});
Ext.reg(gxp.charts.ChartContainer.prototype.xtype, gxp.charts.ChartContainer);
