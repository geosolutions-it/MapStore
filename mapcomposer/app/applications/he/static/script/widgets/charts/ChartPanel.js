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

Ext.namespace('gxp.he');

/**
 * @author Lorenzo Natali
 */

/** api: constructor
 *  .. class:: JSChartsPanel(config)
 *
 *    Chart Panel with Legend
 *
 */
gxp.charts.ChartPanel = Ext.extend(Ext.Panel, {

    xtype: 'gxp_chart_panel',
    style: 'padding: 0px  5px 0px 0',
           
    frame: true,
    header: true,
    layout: 'border',
    
    
    initComponent: function () {


        var chartConfig = Ext.apply({
            ref: 'chart',
            region: 'center',
            xtype: 'gxp_ChartJsChart',
            type: 'pie',
            legendRef: 'legendPanel',
            data: this.data
        },this.chartOptions);
        //TODO apply this too
        var legendConfig = {
            region: 'east',
            width: 150,
            ref: 'legendPanel'

        };
        this.items = [chartConfig, legendConfig];

        gxp.charts.ChartPanel.superclass.initComponent.call(this);
    }

});
Ext.reg(gxp.charts.ChartPanel.prototype.xtype, gxp.charts.ChartPanel);