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

Ext.namespace('gxp.plugins.printreport');

/**
 * @author Alejandro Diaz
 */

/**
 * @requires plugins/printreport/Generator.js
 */

/** api: constructor
 *  .. class:: CropDataChartGenerator(config)
 *
 *    Component to generate the crop data charts for the PrintReportHelper
 *
 */
gxp.plugins.printreport.CropDataChartGenerator = Ext.extend(gxp.plugins.printreport.Generator, {

    /** config parameters **/
    chartsSVG: [],
    reportTypeName: "nrl:report_crop",
    
    generate:function(store,listVar){
        this.chartsSVG = [];

        this.reportWindow = new Ext.Window({
            title: 'Test',
            width: 900,
            height: 600,
            layout: 'fit',
            modal: false,
            items: [new gxp.charts.ChartPanel({
                url: this.url,
                ref: '../chartPanel',
                targetTab: null,
                target:this.target,
                form: this.form,
                listeners:{
                    chartrefresh: function(chart){
                        // here we get the svg content of the chart
                        var svg = chart.getSVG();
                        if(svg){
                            this.addChartSVG(svg);
                        }
                    }, 
                    scope: this
                }
            })],
            constrain: true,
        });
        this.reportWindow.show();
        if(this.hideAndCloseReportWindow){
            this.reportWindow.setPosition(-100000, 0); //hide the window
        }
        //TODO: Print and destroy!!
    },

    addChartSVG: function(svg){
        this.chartsSVG.push(svg);
        if(this.isReportCompleted()){
            this.onDone();
        }
    },

    getChartPanel: function(){
        return this.reportWindow.items.get(this.reportWindow.items.keys[0]);
    },

    isReportCompleted: function(){
        //TODO: change this function
        if(this.chartsSVG.length > 0 && --this.getChartPanel().chartsToLoad == 0)
            return true;
        else
            return false;
    },

    onDone: function(){
        if(this.hideAndCloseReportWindow){
            this.reportWindow.close();
        }
        this.fireEvent("done", this.chartsSVG);
    }

});