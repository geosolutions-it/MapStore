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
 *  .. class:: NrlIrrigationTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlIrrigationTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlIrrigationTabButton',
    iconCls: "gxp-icon-nrl-tab",
    form: null,
    url: null,
    targetTab: 'irrigation_tab',
    tabPanel: 'id_mapTab',
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Irrigation"},
    text: 'Generate Table',
    queryOptions: {},
    handler: function () {
        var getViewParams = {
            getTimeOptions: function(form){
                // gets the options used in the query for grouping data
                var time_opt = (form.timerange.getValue().inputValue == 'monthly' ? 'decade_year' : 'month');

                var from_abs_dec, to_abs_dec, group_opt, month_list = [];

                from_abs_dec = form.yearRangeSelector.slider.getValues()[0] * 36 + 1; // jan_dek-1
                to_abs_dec = form.yearRangeSelector.slider.getValues()[1] * 36 + 36; // dec_dek-3

                switch (time_opt) {
                    case 'decade_year':
                        {
                            var fromMonth = form.monthRangeSelector.slider.getValues()[0];
                            var toMonth = form.monthRangeSelector.slider.getValues()[1];
                            for(var i=fromMonth; i<=toMonth; i++){
                                month_list.push("'" + (nrl.chartbuilder.util.numberToMonthName(i+1)).toLowerCase() + "'");
                            }
                            group_opt = '"decade_absolute"';
                        }
                        break;
                    case 'month':
                        {
                            for(var i=0; i<12; i++){
                                month_list.push("'" + (nrl.chartbuilder.util.numberToMonthName(i+1)).toLowerCase() + "'");
                            }
                            group_opt = '"month"';
                        }
                }

                return {
                    time_opt: time_opt,
                    group_opt: group_opt,
                    to_abs_dec: to_abs_dec,
                    from_abs_dec: from_abs_dec,
                    month_list: month_list
                };
            },

            flow: function(form){
                form.submitButton.queryOptions.source_type = 'flow';

                var selectedRivers = form.riversGrid.getSelections();
                var riverList = [];
                for (var i = 0; i < selectedRivers.length; i++){
                    riverList.push('\'' + selectedRivers[i].data.river + '\'');
                }
                var river_list = riverList.join('\\,');
                form.submitButton.queryOptions.river_list = riverList;

                var factor = form.uomFlow.getValue();
                var uomLabel = form.uomFlow.getRawValue();
                form.submitButton.queryOptions.factor = factor;
                form.submitButton.queryOptions.uomLabel = uomLabel;

                var tOpts = this.getTimeOptions(form);
                form.submitButton.queryOptions.time_opt = tOpts.time_opt;
                form.submitButton.queryOptions.from_abs_dec = tOpts.from_abs_dec;
                form.submitButton.queryOptions.to_abs_dec = tOpts.to_abs_dec;
                form.submitButton.queryOptions.group_opt = tOpts.group_opt;
                form.submitButton.queryOptions.month_list = tOpts.month_list.join('\\,');

                return 'group_opt:' + tOpts.group_opt + ';' +
                       'river_list:' + river_list + ';' +
                       'to_abs_dec:' + tOpts.to_abs_dec + ';' +
                       'from_abs_dec:' + tOpts.from_abs_dec + ';' +
                       'month_list:' + tOpts.month_list.join('\\,') + ';' +
                       'factor:' + factor + ';';
            },
            supply: function(form){
                form.submitButton.queryOptions.source_type = 'supply';
                // gets the gran type parameter
                var gran_type = form.aoiFieldSet.gran_type.getValue().inputValue;
                form.submitButton.queryOptions.gran_type = gran_type;

                var gran_type_str = '\'' + gran_type + '\'';
                form.submitButton.queryOptions.gran_type_str = gran_type_str;

                var region_list = form.aoiFieldSet.selectedRegions.getValue();
                form.submitButton.queryOptions.region_list = region_list;

                var factor = form.uomSupply.getValue();
                var uomLabel = form.uomSupply.getRawValue();
                form.submitButton.queryOptions.factor = factor;
                form.submitButton.queryOptions.uomLabel = uomLabel;

                var tOpts = this.getTimeOptions(form);
                form.submitButton.queryOptions.time_opt = tOpts.time_opt;
                form.submitButton.queryOptions.from_abs_dec = tOpts.from_abs_dec;
                form.submitButton.queryOptions.to_abs_dec = tOpts.to_abs_dec;
                form.submitButton.queryOptions.group_opt = tOpts.group_opt;
                form.submitButton.queryOptions.month_list = tOpts.month_list.join('\\,');

                return 'group_opt:' + tOpts.group_opt + ';' +
                       'to_abs_dec:' + tOpts.to_abs_dec + ';' +
                       'from_abs_dec:' + tOpts.from_abs_dec + ';' +
                       'region_list:' + region_list + ';' +
                       'gran_type:' + gran_type + ';' +
                       'gran_type_str:' + gran_type_str + ';' +
                       'month_list:' + tOpts.month_list.join('\\,') + ';' +
                       'factor:' + factor + ';';
            }
        };

        var getTypeName = function(sourceType) {
            if (sourceType == 'flow')
                return 'nrl:irrigation_data_flow';
            else
                return 'nrl:irrigation_data_supply';
        };

        var getPropertyName = function(sourceType) {
            if (sourceType == 'flow') {
                return 'river,abs_dec,waterflow';
            } else {
                return 'province,district,abs_dec,withdrawal';
            }
        };

        var sourceType = this.refOwner.source.getValue().inputValue;

        var viewparams = getViewParams[sourceType](this.refOwner);
        var typeName = getTypeName(sourceType);
        var propertyName = getPropertyName(sourceType);

        var storeConf = {
            flow: {
                url: this.url,
                root: 'features',
                fields: [
                    {name: 'river',     mapping: 'properties.river'    },
                    {name: 'abs_dec',   mapping: 'properties.abs_dec'  },
                    {name: 'waterflow', mapping: 'properties.waterflow'}
                ]
            },
            supply: {
                url: this.url,
                root: 'features',
                fields: [
                    {name: 'province',   mapping: 'properties.province'   },
                    {name: 'district',   mapping: 'properties.district'   },
                    {name: 'abs_dec',    mapping: 'properties.abs_dec'    },
                    {name: 'withdrawal', mapping: 'properties.withdrawal' }
                ]
            }
        };

        var store = new Ext.data.JsonStore(storeConf[sourceType]);

        store.load({
            callback: function(records, req){
                var pNameList = req.params.propertyName.split(',');
                // removes the property that will be empty
                if (this.queryOptions.source_type == 'supply' && this.queryOptions.gran_type == 'province')
                    pNameList.remove('district');

                // sets the property name for the csv exporting query
                store.exportParams = req.params;
                store.exportParams.propertyName = pNameList.join(',');

                var sortRules;
                if(this.queryOptions.source_type == 'flow'){
                    sortRules = [{field: 'river', direction: 'ASC'},{field: 'abs_dec', direction: 'ASC'}];
                }else{
                    if (this.queryOptions.gran_type == 'province'){
                        sortRules = [
                            {field: 'province', direction: 'ASC'},
                            {field: 'abs_dec', direction: 'ASC'}
                        ];
                    }else{
                        sortRules = [
                            {field: 'province', direction: 'ASC'},
                            {field: 'district', direction: 'ASC'},
                            {field: 'abs_dec', direction: 'ASC'}
                        ];
                    }
                }
                store.sort(sortRules);

                this.createResultPanel(store, this.queryOptions);
            },
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: typeName,
                outputFormat: "json",
                propertyName: propertyName,
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
        var getChartInfo = function(sourceType) {
            var info = '<span style="font-size:10px;">Source: Pakistan Crop Portal</span><br />';

            // 'today' will contain the current date in dd/mm/yyyy format
            var now = new Date();
            var dd = nrl.chartbuilder.util.zeroPadding(now.getDate(), 2);
            var mm = nrl.chartbuilder.util.zeroPadding(now.getMonth() + 1, 2); //January is 0!
            var yyyy = now.getFullYear();
            var today = dd + '/' + mm + '/' + yyyy;

            info += '<span style="font-size:10px;">Date: ' + today + '</span><br />';
            info += '<span style="font-size:10px;">Data source: ' + (sourceType == 'flow' ? 'Punjab Irrigation Department' : 'Indus River System Authority (IRSA)') + '</span><br />';
            return info;
        };

        var tabs = Ext.getCmp(this.targetTab);
        var gridCols = {
            flow: [
                {
                    sortable: true,
                    id: 'river',
                    header:'River',
                    name: 'river',
                    dataIndex: 'river',
                    renderer: function(value){
                        return nrl.chartbuilder.util.toTitleCase(value);
                    }
                },{
                    sortable: true,
                    id: 'abs_dec',
                    header:'Data',
                    name: 'abs_dec',
                    dataIndex: 'abs_dec',
                    renderer: function(value){
                        var parsedDate = nrl.chartbuilder.util.getDekDate(value);
                        var outputStr = parsedDate.year + ' ' + nrl.chartbuilder.util.numberToMonthName(parsedDate.month);
                        if (queryOptions.time_opt != "month"){
                            outputStr += ' - dec ' + parsedDate.dec;
                        }
                        return outputStr;
                    }
                },{
                    sortable: true,
                    id: 'waterflow',
                    header:'Volume Flow Rate (' + queryOptions.uomLabel + ')',
                    name: 'waterflow',
                    //width:50,
                    dataIndex: 'waterflow',
                    renderer: Ext.util.Format.numberRenderer('0.000')
                }
            ],
            supply: [
                {
                    sortable: true,
                    id: 'province',
                    header:'Province',
                    name: 'province',
                    dataIndex: 'province',
                    renderer: function(value){
                        return nrl.chartbuilder.util.toTitleCase(value);
                    }
                },{
                    sortable: true,
                    id: 'district',
                    header:'District',
                    name: 'district',
                    dataIndex: 'district',
                    renderer: function(value){
                        return nrl.chartbuilder.util.toTitleCase(value);
                    }
                },{
                    sortable: true,
                    id: 'abs_dec',
                    header:'Data',
                    name: 'abs_dec',
                    dataIndex: 'abs_dec',
                    renderer: function(value){
                        var parsedDate = nrl.chartbuilder.util.getDekDate(value);
                        var outputStr = parsedDate.year + ' ' + nrl.chartbuilder.util.numberToMonthName(parsedDate.month);
                        if (queryOptions.time_opt != "month"){
                            outputStr += ' - dec ' + parsedDate.dec;
                        }
                        return outputStr;
                    }
                },{
                    sortable: true,
                    id: 'withdrawal',
                    header:'Volume (' + queryOptions.uomLabel + ')',
                    name: 'withdrawal',
                    //width:50,
                    dataIndex: 'withdrawal',
                    renderer: Ext.util.Format.numberRenderer('0.000')
                }
            ]
        };

        if (queryOptions.gran_type == 'province'){
            gridCols.supply.splice(1,1);
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
            autoExpandColumn: (queryOptions.source_type == 'flow' ? 'waterflow' : 'withdrawal'),
            title: '',
            columns: gridCols[queryOptions.source_type]
        });
        var tableTitle = (queryOptions.source_type == 'flow' ? 'River Water Flow' : 'Irrigation Water Supply');

        var info = getChartInfo(queryOptions.source_type);
        var win = new Ext.Window({
            title: tableTitle,
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

Ext.reg(gxp.widgets.button.NrlIrrigationTabButton.prototype.xtype, gxp.widgets.button.NrlIrrigationTabButton);