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

/**
 * @author Alejandro Diaz
 */

/**
 * @requires widgets/button/cropstatus/NrlCropStatusChartButton.js
 */

/** api: constructor
 *  .. class:: NrlReportCropStatusChartButton(config)
 *
 *    Base class to create chart and send to the print module
 *
 */
gxp.widgets.button.NrlReportCropStatusChartButton = Ext.extend(gxp.widgets.button.NrlCropStatusChartButton, {

    /** api: xtype = gxp_nrlReportCropStatusChartButton */
    xtype: 'gxp_nrlReportCropStatusChartButton',
    iconCls: "gxp-icon-nrl-chart", //TODO: Change
    text: 'Generate Report',

    firstSVGTitle: "AGGREGATED DATA -",

    // save mask
    myMask: null,

    handler: function () {
        
        //loading mask
        var loadingMsg ="Please wait...";
        var myMask = new Ext.LoadMask(this.findParentByType('form').getEl(),
        {msg:loadingMsg} );
        myMask.show();
        this.myMask = myMask;

        // obtain the printreporthelper plugin (see mapStoreConfig.js)
        var helper = this.target.tools["printreporthelper"];

        helper.form = this.form;

        // Data generators:
        // Map
        var mapGenerator = new gxp.plugins.printreport.MapGenerator({
            form: this.form,
            target: this.target,
            printReportHelper: helper,
            defaultRegionList: helper.defaultRegionList,
            printConfig: helper.printConfig,
            mapGenerationVariables: helper.mapGenerationVariables,
            url: helper.dataUrl,
            addLayers: !helper.hideAll
        });
        mapGenerator.on({
            done: function(printConfig, layers){
                helper.printConfig = printConfig;
                helper.layers = layers;
            },
            error: this.onError,
            scope: this
        });
        // CropData
        var cropDataChartGenerator = new gxp.plugins.printreport.CropDataChartGenerator({
            form: this.form,
            target: this.target,
            printReportHelper: helper,
            defaultRegionList: helper.defaultRegionList,
            printConfig: helper.printConfig,
            hideAndCloseReportWindow: helper.hideAll,
            url: helper.dataUrl
        });
        cropDataChartGenerator.on({
            done: function(chartsSVG){
                if(chartsSVG.length > 1){
                    for(var i = 0; i < chartsSVG.length; i++){
                        if(chartsSVG[i].indexOf(this.firstSVGTitle) > -1){
                            helper.firstSVG = chartsSVG[i];
                        }else{
                            // we don't need the extra charts!!
                            //helper.chartsSVG.push(chartsSVG[i]);
                        }
                    }
                }else{
                    helper.firstSVG = chartsSVG[0];
                }
            },
            error: this.onError,
            scope: this
        })
        // Agromet
        var agrometChartGenerator = new gxp.plugins.printreport.AgrometChartGenerator({
            form: this.form,
            target: this.target,
            printReportHelper: helper,
            defaultRegionList: helper.defaultRegionList,
            printConfig: helper.printConfig,
            hideAndCloseReportWindow: helper.hideAll,
            url: helper.dataUrl
        });
        agrometChartGenerator.on({
            done: function(chartsSVG){
                for(var i = 0; i < chartsSVG.length; i++){
                    helper.chartsSVG.push(chartsSVG[i]);
                }
            },
            error: this.onError,
            scope: this
        })
        var generators = [];
        generators.push(mapGenerator);
        generators.push(cropDataChartGenerator);
        generators.push(agrometChartGenerator);
        helper.generators = generators;

        // loading mark hide
        helper.printProvider.on({
            print: function(url){
                myMask.hide();
            },
            printexception: function(response){
                this.onError("Error","Error printing the report");
            },
            scope:this
        });

        //Print
        helper.print();
    },

    onError: function(name, cause){
        this.myMask.hide();
        Ext.Msg.alert(name, cause);
    }
});

Ext.reg(gxp.widgets.button.NrlReportCropStatusChartButton.prototype.xtype, gxp.widgets.button.NrlReportCropStatusChartButton);