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
 *  .. class:: NrlMarketPricesTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlMarketPricesTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlMarketPricesTabButton',
    iconCls: "gxp-icon-nrl-tab",
    form: null,
    url: null,
    targetTab: 'marketPrices_tab',
    tabPanel: 'id_mapTab',
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Market Prices"},
    text: 'Generate Table',
    queryOptions: {},
    handler: function () {
        var getViewParams = function(form) {
            // gets a list of selected crops
            var cropsSelected = form.crops.getSelections();
            var cropList = [];
            for (var i = 0; i < cropsSelected.length; i++)
                cropList.push('\'' + cropsSelected[i].data.crop + '\'');
            var crop_list = cropList.join('\\,');
            form.submitButton.queryOptions.crop_list = cropList;

            // gets the options used in the query for grouping data
            var time_opt = (form.timerange.getValue().inputValue == 'monthly' ? 'decade_year' : 'month');
            form.submitButton.queryOptions.time_opt = time_opt;

            // set max & min time for query
            var start_abs_dec_year, end_abs_dec_year;
            switch (time_opt) {
                case 'decade_year':
                    {
                        var refYear = parseInt(form.yearSelector.getValue());
                        start_abs_dec_year = (refYear - 1) * 36 + 3 * form.monthRangeSelector.slider.getValues()[0] + 1; // 1st dek of the selected month
                        end_abs_dec_year = (refYear - 1) * 36 + 3 * form.monthRangeSelector.slider.getValues()[1] + 3; // 3rd dek of the selected month
                    }
                    break;
                case 'month':
                    {
                        start_abs_dec_year = form.yearRangeSelector.slider.getValues()[0] * 36 + 1; // jan_dek-1
                        end_abs_dec_year = form.yearRangeSelector.slider.getValues()[1] * 36 + 36; // dec_dek-3
                    }
            }

            form.submitButton.queryOptions.start_abs_dec_year = start_abs_dec_year;
            form.submitButton.queryOptions.end_abs_dec_year = end_abs_dec_year;

            // gets the gran type parameter
            var gran_type = form.aoiFieldSet.gran_type.getValue().inputValue;
            form.submitButton.queryOptions.gran_type = gran_type;

            // gets the gran type parameter as string
            //var gran_type_str = '\'' + gran_type + '\'';

            // gets the list of selected regions
            var region_list = form.aoiFieldSet.selectedRegions.getValue();
            //region_list = region_list.replace("'KHYBER PAKHTUNKHWA'","'FATA'\\,'KPK'");
            form.submitButton.queryOptions.region_list = region_list;

            var currency; // identifies the column to query
            var currencyOpt; // identifies the value obtained
            var exrate; // exchange rate used to convert maketprices by the server
            switch (form.currency.getValue()) {
                case 'usd':{
                    currencyOpt = 'market_price_usd';
                    if (form.exchangeRateRadio.getValue().length != 0){
                        currency = 'market_price_kpr';
                        exrate = parseFloat(form.customExchangeRate.getValue());
                    }else{
                        currency = 'market_price_usd';
                        exrate = 1;
                    }
                }break;
                case 'pkr':{
                    currency = 'market_price_kpr';
                    currencyOpt = 'market_price_kpr';
                    exrate = 1;
                }break;
                default:{
                    currency = 'market_price_usd';
                    currencyOpt = 'market_price_usd';
                    exrate = 1;
                }
            }
            form.submitButton.queryOptions.currency = currencyOpt;

            var factor = form.denominator.getValue();
            form.submitButton.queryOptions.factor = factor;

            form.submitButton.queryOptions.comparisonby = form.comparisonby.getValue().inputValue;
            form.submitButton.queryOptions.priceUOM = form.lblOutput.text;

            if (gran_type == 'pakistan') {
                return 'time_opt:' + time_opt + ';' +
                    'start_abs_dec_year:' + start_abs_dec_year + ';' +
                    'end_abs_dec_year:' + end_abs_dec_year + ';' +
                    'currency:' + currency + ';' +
                    'exRate:' + exrate + ';' +
                    'factor:' + factor + ';' +
                    'crop_list:' + crop_list + ';';
            } else {
                return 'time_opt:' + time_opt + ';' +
                    'start_abs_dec_year:' + start_abs_dec_year + ';' +
                    'end_abs_dec_year:' + end_abs_dec_year + ';' +
                    'currency:' + currency + ';' +
                    'exRate:' + exrate + ';' +
                    'factor:' + factor + ';' +
                    'crop_list:' + crop_list + ';' +
                    'region_list:' + region_list + ';' +
                    'gran_type:' + gran_type + ';';
            }
        };
        var getTypeName = function(granType) {
            if (granType == 'pakistan')
                return 'nrl:marketprices_data_pakistan';
            else
                return 'nrl:marketprices_data';
        };
        var getPropertyName = function(granType) {
            if (granType == 'pakistan') {
                return 'crop,abs_dek,value';
            } else {
                return 'province,region,crop,abs_dek,value';
            }
        };

        var viewparams = getViewParams(this.refOwner);
        var typeName = getTypeName(this.queryOptions.gran_type);
        var propertyName = getPropertyName(this.queryOptions.gran_type);

        var storeConf = {
            url: this.url,
            root: 'features',
            fields: [
                {name: 'abs_dek',  mapping: 'properties.abs_dek' },
                {name: 'crop',     mapping: 'properties.crop'    },
                {name: 'value',    mapping: 'properties.value'   }
            ]
        };

        if (this.queryOptions.gran_type != 'pakistan'){
            storeConf.fields.push({name: 'province', mapping: 'properties.province'});
            storeConf.fields.push({name: 'region',   mapping: 'properties.region'  });
        }

        var store = new Ext.data.JsonStore(storeConf);

        store.load({
            callback: function(records, req){
                var pNameList = req.params.propertyName.split(',');
                // removes the property that will be empty
                if (this.queryOptions.gran_type == 'province')
                    pNameList.remove('province');

                // sets the property name for the csv exporting query
                store.exportParams = req.params;
                store.exportParams.propertyName = pNameList.join(',');

                var sortRules;
                if (this.queryOptions.gran_type == 'pakistan')
                    sortRules = [{field: 'crop', direction: 'ASC'},{field: 'abs_dek', direction: 'ASC'}];
                else
                    sortRules = [
                        {field: 'crop', direction: 'ASC'},
                        {field: 'region', direction: 'ASC'},
                        {field: 'abs_dek', direction: 'ASC'}
                    ];
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
        var gridCols = [
            {
                sortable: true,
                id: 'crop',
                header:'Crop',
                name: 'crop',
                dataIndex: 'crop',
                renderer: function(value){
                    return nrl.chartbuilder.util.toTitleCase(value);
                }
            },{
                sortable: true,
                id: 'abs_dek',
                header:'Data',
                name: 'abs_dek',
                dataIndex: 'abs_dek',
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
                id: 'value',
                header:'Price (' + queryOptions.priceUOM + ')',
                name: 'value',
                //width:50,
                dataIndex: 'value',
                renderer: Ext.util.Format.numberRenderer('0.00')
            }
        ];

        if (gran_type != 'pakistan'){
            gridCols.splice(2,0,
                {
                    sortable: true,
                    id: 'province',
                    header:'Province',
                    name: 'province',
                    dataIndex: 'province',
                    hidden: (gran_type == 'province')/*,
                    renderer: function(value){
                        value = (value == 'KPK' ? 'KHYBER PAKHTUNKHWA' : value);
                        return nrl.chartbuilder.util.toTitleCase(value);
                    }*/
                },{
                    sortable: true,
                    id: 'region',
                    header:(gran_type == 'district' ? 'District' : 'Province'),
                    name: 'region',
                    dataIndex: 'region'/*,
                    renderer: function(value){
                        value = (value == 'KPK' ? 'KHYBER PAKHTUNKHWA' : value);
                        return nrl.chartbuilder.util.toTitleCase(value);
                    }*/
                }
            );
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
            autoExpandColumn: 'value',
            title: '',
            columns: gridCols
        });

        var tabelTitle = 'Market Prices: ';
        if (gran_type == 'pakistan'){
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

Ext.reg(gxp.widgets.button.NrlMarketPricesTabButton.prototype.xtype, gxp.widgets.button.NrlMarketPricesTabButton);