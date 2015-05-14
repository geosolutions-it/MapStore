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
 *  .. class:: NrlFertilizerTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlFertilizerTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlFertilizerTabButton',
    iconCls: "gxp-icon-nrl-tab",
    form: null,
    url: null,
    targetTab: 'fertilizers_tab',
    tabPanel: 'id_mapTab',
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Fertilizer"},
    text: 'Generate Table',
    queryOptions: {},
    handler: function () {
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
            region_list = region_list.replace("'KHYBER PAKHTUNKHWA'","'FATA'\\,'KPK'");

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

        var store = new Ext.data.JsonStore({
            url: this.url,
            root: 'features',
            fields: [
                {name: 'time'    , mapping: 'properties.time'},
                {name: 'nutrient', mapping: 'properties.nutrient'},
                {name: 'province', mapping: 'properties.province'},
                {name: 'district', mapping: 'properties.district'},
                {name: 'tons'    , mapping: 'properties.tons'}
            ]
        });


        store.load({
            callback: function(records, req){
                var pNameList = req.params.propertyName.split(',');
                // removes the property that will be empty
                switch (this.queryOptions.gran_type){
                    case 'pakistan': pNameList.remove('province').remove('district'); break;
                    case 'province': pNameList.remove('district'); break;
                }
                // sets the property name for the csv exporting query
                store.exportParams = req.params;
                store.exportParams.propertyName = pNameList.join(',');

                if (this.queryOptions.timerange == 'monthly'){
                    store.sort([
                        {field: 'province', direction: 'ASC'},
                        {field: 'district', direction: 'ASC'},
                        {field: 'nutrient', direction: 'ASC'},
                        {field: 'time',     direction: 'ASC'},
                        {field: 'tons',     direction: 'ASC'}
                    ]);
                }else{
                    store.sort([
                        {field: 'province', direction: 'ASC'},
                        {field: 'district', direction: 'ASC'},
                        {field: 'time',     direction: 'ASC'},
                        {field: 'nutrient', direction: 'ASC'},
                        {field: 'tons',     direction: 'ASC'}
                    ]);
                }
                this.createResultPanel(store, this.queryOptions);
            },
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: this.typeName,
                outputFormat: "json",
                propertyName: "time,nutrient,province,district,tons",
                viewparams: viewparams
            },
            scope: this
        });
    },

    createResultPanel: function(store, queryOptions){
        var gran_type = queryOptions.gran_type;
        var timeHeader = (queryOptions.timerange == 'monthly' ? 'Month' : 'Year');
        var tabPanel = Ext.getCmp(this.tabPanel);
        var regionList = this.refOwner.aoiFieldSet.selectedRegions.getValue().replace(/[']/g,'').split('\\,');

        var yearOrMonthName = function(value){
            return (value < 13 ? nrl.chartbuilder.util.numberToMonthName(value, true) : value);
        };
        var zeroPadding = function(n, padding){
            var nstr = n + '';
            if (nstr.length < padding){
                for(var i=padding-nstr.length; i>0; i--){
                    nstr = '0' + nstr;
                }
            }
            return nstr;
        };
        var getChartInfo = function(aoiList, queryParams){
            var info = '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />';

            // 'today' will contain the current date in dd/mm/yyyy format
            var now = new Date();
            var dd = zeroPadding(now.getDate(), 2);
            var mm = zeroPadding(now.getMonth()+1, 2); //January is 0!
            var yyyy = now.getFullYear();
            var today = dd + '/' + mm + '/' + yyyy;
            info += '<span style="font-size:10px;">Date: '+ today +'</span><br />';

            // build a list of aoi for the current chart.
            var aoi = '';
            if (queryParams.gran_type == 'pakistan'){
                aoi += 'Pakistan';
            }else{
                aoi = aoiList.join(', ');
            }
            
            info += '<span style="font-size:10px;">Region: '+ aoi + '</span><br />'

            switch (queryParams.timerange){
                case 'annual': {
                    var fromYear = queryParams.from_year;
                    var toYear = queryParams.to_year;
                    info += '<span style="font-size:10px;">Years: '+ fromYear + '-' + toYear + '</span><br />'
                }break;
                case 'monthly': {
                    var referenceYear = queryParams.from_year;
                    info += '<span style="font-size:10px;">Year: '+ referenceYear + '</span><br />'

                    var fromMonth = nrl.chartbuilder.util.numberToMonthName(queryParams.from_month);
                    var toMonth = nrl.chartbuilder.util.numberToMonthName(queryParams.to_month);
                    info += '<span style="font-size:10px;">Months: '+ fromMonth + '-' + toMonth + '</span><br />'
                }break;
            }

            return info;
        };

        var tabs = Ext.getCmp(this.targetTab);
        var gridCols;
        if (queryOptions.timerange == 'monthly'){
            gridCols = [
                {
                    sortable: true,
                    id: 'province',
                    header:'Province',
                    name: 'province',
                    dataIndex: 'province',
                    //width:50,
                    hidden: (gran_type == 'pakistan'),
                    renderer: function(value){
                        return (value == 'KPK' ? 'KHYBER PAKHTUNKHWA' : value);
                    }
                },{
                    sortable: true,
                    id: 'district',
                    header:'District',
                    name: 'district',
                    dataIndex: 'district',
                    //width:50,
                    hidden: (gran_type != 'district')
                },{
                    sortable: true,
                    id: 'nutrient',
                    header:'Nutrient',
                    name: 'nutrient',
                    //width:50,
                    dataIndex: 'nutrient'
                },{
                    sortable: true,
                    id:'time',
                    header: timeHeader,
                    name: 'time',
                    dataIndex: 'time',
                    //width:50,
                    renderer: yearOrMonthName
                },{
                    sortable: true,
                    id: 'tons',
                    header:'Offtake (tons)',
                    name: 'tons',
                    dataIndex: 'tons',
                    //width: 100,
                    renderer: Ext.util.Format.numberRenderer('0.00')
                }
            ]
        }else{
            gridCols = [
                {
                    sortable: true,
                    id: 'province',
                    header:'Province',
                    name: 'province',
                    dataIndex: 'province',
                    //width:50,
                    hidden: (gran_type == 'pakistan'),
                    renderer: function(value){
                        return (value == 'KPK' ? 'KHYBER PAKHTUNKHWA' : value);
                    }
                },{
                    sortable: true,
                    id: 'district',
                    header:'District',
                    name: 'district',
                    dataIndex: 'district',
                    //width:50,
                    hidden: (gran_type != 'district')
                },{
                    sortable: true,
                    id:'time',
                    header: timeHeader,
                    name: 'time',
                    dataIndex: 'time',
                    //width:50,
                    renderer: yearOrMonthName
                },{
                    sortable: true,
                    id: 'nutrient',
                    header:'Nutrient',
                    name: 'nutrient',
                    //width:50,
                    dataIndex: 'nutrient'
                },{
                    sortable: true,
                    id: 'tons',
                    header:'Offtake (tons)',
                    name: 'tons',
                    dataIndex: 'tons',
                    //width: 100,
                    renderer: Ext.util.Format.numberRenderer('0.00')
                }
            ]
        }
        var grid = new Ext.grid.GridPanel({
            bbar:["->",
                {
                    xtype: 'button',
                    text: 'Export',
                    tooltip: 'Export',
                    iconCls: 'icon-disk',
                    handler: function(){
                        var store = this.ownerCt.ownerCt.getStore();
                        var exportParams = store.exportParams;
                        var dwl = store.url + "?";
                        exportParams.outputFormat = "CSV";
                        for (var i in exportParams){
                            dwl+=i + "=" +encodeURIComponent(exportParams[i])+"&";
                        }
                        window.open(dwl);
                    }
                }
            ],
            forceFit: true,
            loadMask: true,
            border: false,
            layout: 'fit',
            store: store,
            autoExpandColumn: 'tons',
            title: '',
            columns: gridCols
        });

        var tabelTitle = 'Fertilizer: ';
        if (queryOptions.gran_type == 'pakistan'){
            tabelTitle += 'Pakistan'
        }else if (regionList.length == 1){
            tabelTitle += regionList[0];
        }else{
            tabelTitle += 'REGION';
        }

        var info = getChartInfo(regionList, this.queryOptions);
        var win = new Ext.Window({
            title: tabelTitle,
            collapsible: true,
            iconCls: this.iconCls,
            constrainHeader: true,
            maximizable: true,
            height: 400,
            width: 700,
            autoScroll: false,
            header: true,
            layout: 'fit',
            items: grid,
            tools: [{
                id: 'help',
                handler: function () {
                    var iframe ='prova';

                    var appInfo = new Ext.Panel({
                        header: false,
                        autoScroll: true,
                        html: info
                    });

                    var win = new Ext.Window({
                        title:  "Table Info",
                        modal: true,
                        layout: "fit",
                        width: 400,
                        height: 180,
                        items: [appInfo]
                    });

                    win.show();
                },
                scope: this
            }]
        });


        gxp.WindowManagerPanel.Util.showInWindowManager([win],this.tabPanel,this.targetTab,this.windowManagerOptions);
    }
});

Ext.reg(gxp.widgets.button.NrlFertilizerTabButton.prototype.xtype, gxp.widgets.button.NrlFertilizerTabButton);