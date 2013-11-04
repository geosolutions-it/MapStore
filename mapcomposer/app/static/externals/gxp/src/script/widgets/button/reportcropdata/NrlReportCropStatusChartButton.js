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
                Ext.apply(helper.printConfig, printConfig);
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
        // Extra info for the report
        var extraInfoGenerator = new gxp.plugins.printreport.ExtraInformationGenerator({
            form: this.form,
            target: this.target,
            printReportHelper: helper,
            defaultRegionList: helper.defaultRegionList,
            printConfig: helper.printConfig,
            mapGenerationVariables: helper.mapGenerationVariables,
            url: helper.dataUrl,
            addLayers: !helper.hideAll
        });
        extraInfoGenerator.on({
            done: function(printConfig){
                helper.selectedVector = printConfig.selectedVector;
                helper.printConfig.region = printConfig.region;
                if(printConfig.layers){
                    for(var i = 0; i < printConfig.layers.length; i++){
                        helper.layers.push(printConfig.layers[i]);
                    }
                }
            },
            error: this.onError,
            scope: this
        });
        var generators = [];
        generators.push(mapGenerator);
        generators.push(cropDataChartGenerator);
        generators.push(agrometChartGenerator);
        // generators.push(extraInfoGenerator);
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

        // TODO: Repair extra info generator and remove it
        // add selected regions
        var values = this.form.output.getForm().getValues();
        if(!this.ownerCt.aoiSimpleSelection){
            if(values.areatype == 'province' || values.areatype == 'district'){
                helper.printConfig.region = helper.cleanAndCapitalize(values.region_list);
                // add layer
                this.ownerCt.selectedRegions;
                var layer;
                if(this.form.hilightLayerName){
                    layer = this.target.mapPanel.map.getLayersByName(this.form.hilightLayerName)[0];
                    helper.layers.push(layer);
                }
                // change bounds
                var bounds = new OpenLayers.Bounds();
                this.form.regionsStore.each(function(reg){
                    bounds.extend(reg.data.geometry.getBounds());
                });
                helper.selectedVector = new OpenLayers.Feature.Vector(bounds.toGeometry());
                helper.selectedVector.layer = layer;
            }else{
                helper.printConfig.region = "Pakistan";
                helper.selectedVector = null;
            }
            //TODO: helper.selectedVector = bbox;
        }else{        
            this.ownerCt.selectedRegions;
            // Common data of the form
            if(values.areatype.toLowerCase() != 'pakistan' 
                && this.form.selectedProvince && this.form.selectedProvince.data.geometry){
                // copy vector feature selected
                helper.selectedVector = this.form.selectedProvince.data;
                helper.printConfig.region = printer.cleanAndCapitalize(values.region_list); // region
            }else{
                helper.printConfig.region = "Pakistan";
                helper.selectedVector = null;
            }
        }
        // Eof TODO

        //Print
        helper.print();
    },

    onError: function(name, cause){
        this.myMask.hide();
        Ext.Msg.alert(name, cause);
    }
});

Ext.reg(gxp.widgets.button.NrlReportCropStatusChartButton.prototype.xtype, gxp.widgets.button.NrlReportCropStatusChartButton);