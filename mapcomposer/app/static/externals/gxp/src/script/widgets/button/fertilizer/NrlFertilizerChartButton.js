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
 *  .. class:: NrlFertilizerButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlFertilizerChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlFertilizerChartButton',
    iconCls: "gxp-icon-nrl-chart",
    text: 'Generate Chart',
    optionsTitle: "Chart Options",
    tabPanel:'id_mapTab',
    targetTab: 'fertilizers_tab',
    form: null,
    url: null,
    typeName:"nrl:fertilizer_data",
    stackedCharts: {
        series: {
            stacking: null
        }
    },
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions: {
        title: "Fertilizers"
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
            items:[
                {   //type
                    fieldLabel:"Type",
                    xtype:"radiogroup",
                    columns:2,
                    items: [
                        {
                            boxLabel: '<span class="icon_span ic_chart-line">Line</span>',
                            name: prefix + "_chart_type",
                            inputValue: "line",
                            checked: opts.type == "line"
                        },{
                            boxLabel: '<span class="icon_span ic_chart-spline">Curve</span>',
                            name: prefix + "_chart_type",
                            inputValue: "spline",
                            checked: opts.type == "spline"
                        },{
                            boxLabel: '<span class="icon_span ic_chart-bar">Bar</span>',
                            name: prefix + "_chart_type",
                            inputValue:"column",
                            checked: opts.type == "column"
                        },{
                            boxLabel: '<span class="icon_span ic_chart-area">Area</span>',
                            name: prefix + "_chart_type",
                            inputValue: "area",
                            checked: opts.type == "area"
                        }
                    ],
                    listeners: {
                        change: function(group,checked){
                            if(checked){
                                opts.type = checked.inputValue;
                            }
                        }
                    }
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
                }
            ]
        }
        return fieldSet;
    },
    createStackChartsOptions: function(stackedCharts){
        var fieldSet = {
            xtype: 'fieldset',
            title: 'Stack charts of the same type',
            items: [
                {
                    xtype: 'radiogroup',
                    columns:1,
                    fieldLabel: "Stack charts",
                    hideLabel: true,
                    items:[
                        {
                            checked: stackedCharts.series.stacking == null,
                            boxLabel: 'Do not stack',
                            name: 'stackcharts',
                            inputValue: null
                        },{
                            checked: stackedCharts.series.stacking == "normal",
                            boxLabel: 'Stack',
                            name: 'stackcharts',
                            inputValue: 'normal'
                        },{
                            checked: stackedCharts.series.stacking == "percent",
                            boxLabel: 'Stack as percent of the total',
                            labelSeparator: '',
                            name: 'stackcharts',
                            inputValue: 'percent'
                        }
                    ],
                    listeners: {
                        change: function(c,checked){
                            stackedCharts.series.stacking = checked.inputValue;
                        }
                    }
                }
            ]
        };
        return fieldSet;
    },
    queryOptions: {},
    chartOpt: {},
    menu: {
        items: [
            {
                ref:'../chartoptions',
                iconCls:'ic_wrench',
                text: 'Options',
                handler:function(option){
                    //get mode
                    var mainButton = this.refOwner;

                    var stackedCharts = mainButton.stackedCharts;
                    var fieldSetList = [];

                    for(var nutrient in this.refOwner.chartOpt.series)
                        fieldSetList.push(mainButton.createOptionsFildset(nutrient, this.refOwner.chartOpt.series[nutrient], nutrient));
                    fieldSetList.push(mainButton.createStackChartsOptions(stackedCharts));

                    var win = new Ext.Window({
                        iconCls:'ic_wrench',
                        title:   mainButton.optionsTitle,
                        height: 400,
                        width:  350,
                        minWidth:250,
                        minHeight:200,
                        layout:'fit',
                        autoScroll:true,
                        maximizable: true,
                        modal:true,
                        resizable:true,
                        draggable:true,
                        layout:'fit',
                        items:  {
                            ref:'form',
                            xtype:'form',
                            autoScroll:true,
                            frame:'true',
                            layout:'form',
                            items: fieldSetList
                        }
                    });
                    win.show();
                }
            }
        ]
    },
    /**
     * api method[handler]
     * generate the chart
     */
    handler: function(){
        var getViewParams = function(form){
            // gets a list of nutrients selected
            var fertSelected = form.fertilizers.getSelections();
            var fertList = [];
            for(var i=0; i<fertSelected.length; i++)
                fertList.push('\'' + fertSelected[i].data.nutrient + '\'');
            var nutrient_list = fertList.join('\\,');

            // gets the options used in the query for grouping data
            var grouping_opt = (form.timerange.getValue().inputValue == 'monthly' ? 'month_num' : 'year');
            form.submitButton.queryOptions.timerange = form.timerange.getValue().inputValue;

            // gets the min & max year
            // gets max & min month
            var from_year, to_year;
            var from_month_num, to_month_num;
            switch (grouping_opt){
                case 'year': {
                    from_year = form.yearRangeSelector.slider.getValues()[0];
                      to_year = form.yearRangeSelector.slider.getValues()[1];
                    from_month_num = 1;
                      to_month_num = 12;
                }break;
                case 'month_num': {
                    from_year = form.yearSelector.getValue();
                      to_year = form.yearSelector.getValue();
                    from_month_num = form.monthRangeSelector.slider.getValues()[0]+1;
                      to_month_num = form.monthRangeSelector.slider.getValues()[1]+1;
                }break;
            }
            form.submitButton.queryOptions.from_year = from_year;
            form.submitButton.queryOptions.to_year = to_year;
            form.submitButton.queryOptions.from_month = from_month_num;
            form.submitButton.queryOptions.to_month = to_month_num;

            // gets the gran type parameter
            var gran_type = form.aoiFieldSet.gran_type.getValue().inputValue;
            form.submitButton.queryOptions.gran_type = gran_type;

            // gets the gran type parameter as string
            var gran_type_str = '\'' + gran_type + '\'';

            // gets the list of selected regions
            var region_list = form.aoiFieldSet.selectedRegions.getValue();

            if (gran_type == 'pakistan'){
                return 'grouping_opt:'   + grouping_opt   + ';' +
                       'from_year:'      + from_year      + ';' +
                       'to_year:'        + to_year        + ';' +
                       'from_month_num:' + from_month_num + ';' +
                       'to_month_num:'   + to_month_num   + ';' +
                       'nutrient_list:'  + nutrient_list  + ';' +
                       'region_list:'    + "''"           + ';' +
                       'gran_type_str:'  + gran_type_str  + ';' +
                       'gran_type:'      + 'province'     + ';' ;
            }else{
                return 'grouping_opt:'   + grouping_opt   + ';' +
                       'from_year:'      + from_year      + ';' +
                       'to_year:'        + to_year        + ';' +
                       'from_month_num:' + from_month_num + ';' +
                       'to_month_num:'   + to_month_num   + ';' +
                       'nutrient_list:'  + nutrient_list  + ';' +
                       'region_list:'    + region_list    + ';' +
                       'gran_type_str:'  + gran_type_str  + ';' +
                       'gran_type:'      + gran_type      + ';' ;
            }
        };

        var viewparams = getViewParams(this.refOwner);

        Ext.Ajax.request({
            scope:this,
            url : this.url,
            method: 'POST',
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: this.typeName,
                outputFormat: "json",
                propertyName: "time,nutrient,province,district,tons",
                viewparams: viewparams
            },
            success: function(result, request){
                try{
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                }catch(e){
                    Ext.Msg.alert("Error","Error parsing data from the server");
                    return;
                }
                if (jsonData.features.length <=0){
                    Ext.Msg.alert("No data","Data not available for these search criteria");
                    return;
                }

                var customOpt = {
                    stackedCharts: this.stackedCharts,
                    highChartExportUrl: this.target.highChartExportUrl
                }
                var gran_type = this.refOwner.aoiFieldSet.gran_type.getValue().inputValue;

                var data = nrl.chartbuilder.fertilizer.getData(jsonData, gran_type);
                var charts = nrl.chartbuilder.fertilizer.makeChart(data, this.chartOpt, customOpt, this.queryOptions);
                var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,undefined);
                gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab, this.windowManagerOptions);
            },
            failure: function(result, request){
                console.log('FAIL!');
                console.log(result);
                console.log(request);
            }
        });
    },
    initChartOpt: function(form){

        var selectedNutrients = form.fertilizers.getSelections();
        var colorRGB = nrl.chartbuilder.util.randomColorsRGB(selectedNutrients.length);
        var colorHEX = nrl.chartbuilder.util.randomColorsHEX(selectedNutrients.length);
        var options = form.submitButton.chartOpt;
        var ret = {
            height: 500,
            series: {}
        }

        for(var i = 0; i < selectedNutrients.length; i++){
            var selNut = selectedNutrients[i];
            ret.series[selNut.data.nutrient] = {
                name: selNut.data.nutrient,
                data:[],
                color: colorHEX[i],
                lcolor: 'rgb(' + colorRGB[i] + ')',
                type: 'column',
                dataIndex: selNut.data.nutrient,
                unit: '(000 tons)'
            }
        }
        Ext.apply(options, ret);
        return ret;
    }
});

Ext.reg(gxp.widgets.button.NrlFertilizerChartButton.prototype.xtype, gxp.widgets.button.NrlFertilizerChartButton);
