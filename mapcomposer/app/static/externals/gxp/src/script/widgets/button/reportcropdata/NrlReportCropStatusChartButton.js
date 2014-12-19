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
gxp.widgets.button.NrlReportCropStatusChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlReportCropStatusChartButton */
    xtype: 'gxp_nrlReportCropStatusChartButton',
    iconCls: "gxp-icon-nrl-chart", //TODO: Change
    text: 'Generate Report',
    disclaimerText: '',
    
    firstSVGTitle: "AGGREGATED DATA -",
    targetLayerName:"hidden_hilight_layer",
    targetLayerStyle:{
        strokeColor: "red",
        strokeWidth: 1,
        fillOpacity:0
    },
    agrometchartOpt:{
		series:{
			current:{
					color: '#FF0000',
                    lcolor: 'rgb(207,235,148)',                    
					type: 'line',
					dataIndex: 'current',
					unit:'(000 tons)',
					xField:'s_dec'

				},
			previous:{
					type: 'line',
					color: '#4572A7',
                    lcolor: 'rgb(139,184,237)',
					dataIndex: 'previous',
					unit:'(kg/ha)',
					xField:'s_dec'

				},
			aggregated:{
					color: '#808080',
                    lcolor: 'rgb(240,140,137)', 
                    dashStyle: 'dash',                    
					type: 'line',
					dataIndex: 'aggregated',
					unit:'(000 ha)',
					xField:'s_dec'
			}
		},
        spacingBottom: 100,
        height: 500,
        width: 800
	},
    cropDatachartOpt:{
		series:{
			prod:{
				name: 'Production (000 tons)',
				color: '#89A54E',
				lcolor: 'rgb(207,235,148)',                    
				type: 'line',
				yAxis: 1,
				dataIndex: 'prod',
				unit:'(000 tons)'
			},
			yield:{
				name: 'Yield (kg/ha)',
				dashStyle: 'shortdot',
				type: 'line',
				color: '#4572A7',
				lcolor: 'rgb(139,184,237)',
				yAxis: 2,
				dataIndex: 'yield',
				unit:'(kg/ha)'
			},
			area:{
				name: 'Area (000 hectares)',
				color: '#AA4643',
				lcolor: 'rgb(240,140,137)',                    
				type: 'line',
				dataIndex: 'area',
				unit:'(000 ha)'
			}
		},
        spacingBottom: 145,
        height: 500,
        width: 800
	},
    
     /**
     * private method[createOptionsFildset]
     * ``String`` title the title of the fieldset 
     * ``Object`` opts the chartopts object to manage
     * ``String`` prefix the prefix to use in radio names
     */
    createOptionsFildset: function(title,opts,prefix){
        
        var fieldSet = {
                xtype:'fieldset',
                title:title,
                items:[{
                    //type
                    fieldLabel:"Type",
                    xtype:"radiogroup", 
                    columns:2,
                     items:[
                        {  boxLabel:"<span class=\"icon_span ic_chart-line\">Line</span>",name:prefix+"_chart_type",inputValue:"line", checked : opts.type == "line"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-spline\">Curve</span>",name:prefix+"_chart_type",inputValue:"spline", checked : opts.type == "spline"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-bar\">Bar</span>",name:prefix+"_chart_type", inputValue:"column",checked : opts.type == "column"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-area\">Area</span>",name:prefix+"_chart_type", inputValue:"area",checked : opts.type == "area"}
                        
                    ],
                    listeners: {
                        change: function(group,checked){
                            if(checked){
                                opts.type = checked.inputValue;
                            }
                        }
                    },
                    scope:this
                },{ //color
                    fieldLabel: 'Color', 
                    xtype:'colorpickerfield',
                    anchor:'100%',
                    value : opts.color.slice(1),
                     listeners: {
                        select: function(comp,hex,a,b,c,d,e){
                            if(hex){
                                opts.color = '#' + hex;
                                var rgb = comp.menu.picker.hexToRgb(hex);
                                opts.lcolor = "rgb(" +rgb[0]+ "," +rgb[1]+ ","+rgb[2]+ ")";
                            }
                        }
                    }
                }]
        }
        return fieldSet;
    },
    menu : {
        
        items:[{
            ref:'../chartoptions',
            iconCls:'ic_wrench',
            text: 'Options', 
            handler: function(option){
                //Main Button
                var mainButton = this.refOwner;
                var options = mainButton.cropDatachartOpt;
                var prodOpt =  mainButton.createOptionsFildset("Production",options.series['prod'],'prod');
                var areaOpt =  mainButton.createOptionsFildset("Area",options.series['area'],'area');
                var yieldOpt =  mainButton.createOptionsFildset("Yield",options.series['yield'],'yield');
                
                var cropDataForm =  {
                    title:'Crop Data',
                    ref:'form',
                    xtype:'form',
                    frame:'true',
                    layout:'form',
                    items: [prodOpt,areaOpt,yieldOpt]
                 };
                
                options = mainButton.agrometchartOpt;
                var current =  mainButton.createOptionsFildset("Reference Year",options.series['current'],'current');
                var previous =  mainButton.createOptionsFildset("Previous Year",options.series['previous'],'previous');
                var aggregated =  mainButton.createOptionsFildset("Period Mean",options.series['aggregated'],'aggregated');
                
                
                 var agrometForm =  {
                    title:'Agromet',
                    ref:'form',
                    xtype:'form',
                    frame:'true',
                    layout:'form',
                    items: [current,previous,aggregated]
                 };
                var win = new Ext.Window({
                    iconCls:'ic_wrench',
                    title:   mainButton.optionsTitle,
                    height: 420,
                    width:  350, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    layout:'fit',
                    items: {
                        xtype:'tabpanel', 
                        items:[cropDataForm,agrometForm],
                        activeTab:0
                   }
                });
                win.show();
            }
        }]
    },
    /** config:[defaultAreaTypeMap]
     *  ``String`` for the area type for the map generation for Pakistan. Can be 'province' or 'district' .Default it's 'province'.
     **/
    defaultAreaTypeMap: 'province',

    // save mask
    myMask: null,

    handler: function () {
        var units = this.getUnits();
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
            units: units,
            target: this.target,
            printReportHelper: helper,
            defaultRegionList: helper.defaultRegionList,
            printConfig: helper.printConfig,
            mapGenerationVariables: helper.mapGenerationVariables,
            url: helper.dataUrl,
            addLayers: !helper.hideAll,
            defaultAreaType: this.defaultAreaTypeMap
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
            units: units,
            chartOpt: this.cropDatachartOpt,
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
            chartOpt: this.agrometchartOpt,
            untis: units,
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
            targetLayerName: this.targetLayerName,
            targetLayerStyle: this.targetLayerStyle,
            addLayers: !helper.hideAll,
            disclaimerText: this.disclaimerText
        });
        extraInfoGenerator.on({
            done: function(printConfig){
                // TODO: repair it
                // helper.selectedVector = printConfig.selectedVector;
                // helper.printConfig.region = printConfig.region;
                // helper.printConfig.disclaimer = this.printConfig.disclaimer;
                Ext.apply(helper.printConfig, printConfig);
                if(printConfig.layers){
                    var commonLayers = [];
                    for(var i = 0; i < printConfig.layers.length; i++){
                        commonLayers.push(printConfig.layers[i]);
                    }
                    helper.commonLayers = commonLayers;
                }
            },
            error: this.onError,
            scope: this
        });
        var generators = [];
        generators.push(mapGenerator);
        generators.push(cropDataChartGenerator);
        generators.push(agrometChartGenerator);
        generators.push(extraInfoGenerator);
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
    getUnits : function(){
        var commodityRecord = this.form.output.Commodity.getSelectedRecord();
        var pu = commodityRecord.get("prod_default_unit");
        var au = commodityRecord.get("area_default_unit");
        var yu = commodityRecord.get("yield_default_unit");
        
        var units = {
            prod:  this.prodUnitStore.getAt(this.prodUnitStore.findExact('uid',pu)),
            area:  this.areaUnitStore.getAt(this.areaUnitStore.findExact('uid',au)),
            yield: this.yieldUnitStore.getAt(this.yieldUnitStore.findExact('uid',yu))
        };
        
        return units;
    },
    onError: function(name, cause){
        this.myMask.hide();
        Ext.Msg.alert(name, cause);
    }
});

Ext.reg(gxp.widgets.button.NrlReportCropStatusChartButton.prototype.xtype, gxp.widgets.button.NrlReportCropStatusChartButton);