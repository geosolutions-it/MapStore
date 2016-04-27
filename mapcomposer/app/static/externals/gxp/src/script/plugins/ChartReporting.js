/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @include widgets/ChartReportingPanel.js
 */

/** api: (define)
 *  module = gxp.ChartReporting
 *  class = FeatureGrid
 */

Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying current session generated charts.
 *
 */
gxp.plugins.ChartReporting = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_chartReporting */
    ptype: "gxp_chartReporting",

    category: "CHARTS",

    saveText: "Download",
    shareText: "Save",
    loadChartText: "Load Chart",
    loadFromFileText: "Open from a file",
    loadByIdText: "Open from a shared ID",
    fileErrorText: "Unable to parse the input file",
    pleaseSelectChartText: "Please select a chart first",
    reloadConfigText: "Reload Configuration",
    editChartOptionsText: "Edit",
    exportCsvText: "Export as CSV",
    clearAllText: "Remove all charts",
    dataText: "Data",
    csvSeparator: ",",
    chartSharedIdText: "Chart shared ID",
    invalidSharedId: "Invalid shared ID",
    provideSharedIdText: "Please provide a shared ID",
    cannotCreateResourceText: "Unable to create resource",
    cannotupdateResourceDataText: "Unable to update resource",
    cannotCreateDuplicateResourceText: "A resource with the same name already exists",
    cannotDeleteResourceText: "Unable to delete resource",
    cannotMakeResourcePublicText: "Unable to make resource public",
    chartTypeText: "Chart Type",
    aggregationText: "Aggregation",
    chartTitleText: "Chart Title",
    colourText: "Color",
    histogramText: "histogram",
    lineText: 'Line',
    pieText: 'Pie',
    gaugeText: 'Gauge',
    closeText: 'Close',
    editChartText: 'Edit Chart',
    loadText: "Load",
    browseText: "Browse...",
    invalidChartText: "Invalid chart",
    fileText: "File",
    sharedText: "Saved",
    chartAlreadyLoadedText: "Chart already loaded",
    deleteSharedChartText: "Delete Chart From Server",
    deleteSessionChartText: "Delete Chart From Current Session",
    deleteChartConfirmationText: "Are you sure you want to delete this chart ? It will be removed from the server permanently.",
    deleteSessionChartConfirmationText: "Are you sure you want to delete this chart from the current session ?",
    shareUrlText: "Share URL",

    wpsErrorWindowMsgTitle: 'WPS Request Error',
    wpsErrorWindowMsgText: "The WPS request was not successful.",   
    tooManyFeaturesWindowMsgText: "The WPS internal GetFeature request uses to many features.",

    exportPngText: "Export as PNG",

    spatialSelectorFormId: null,

    // REMOVE THIS WHEN ALL FEATURES ARE IMPLEMENTED
    tbi : function(){
        Ext.Msg.show({
            title:'Feature to be implemented',
            msg: "Not yet implemented"}
         );
    },

    init : function(target) {
        this.target = target;
        gxp.plugins.ChartReporting.superclass.init.call(this, target);
        this.geoStoreUrl = this.geoStoreUrl ? this.geoStoreUrl : this.target.geoStoreBaseURL;
    },
    /**
     * private: openWindows
     * map of the opened window
    */
    openWindows: {},
    /** api: method[addOutput]
     */
    addOutput: function(config) {

        var me = this;
        
        this.chartStore =  new Ext.data.JsonStore({
            // store configs
            autoLoad:true,
            autoDestroy: true,
            // reader configs
            idProperty: 'id',
            fields: [
               'id',
               'title',
               'chartType',
               'typeName',
               'aggFunction',
               'url',
               'xaxisValue','yaxisValue',
               'xFieldType','yFieldType',
               'gaugeMax',
               'spatialSelectorForm',
               'chartSource',
               {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
            ],
        });

        var downloadButton =  new Ext.Button({
                iconCls: 'icon-download',
                text: this.saveText,
                hidden: true,
                handler: function(){
                    var selected = me.chartPanel.view.getSelectedRecords();
                    if(selected.length > 0){
                        me.downloadChart(selected[0]);
                    } else {
                        Ext.Msg.alert(null, me.pleaseSelectChartText);
                    }

                }
        });
        
        var saveButton =  new Ext.Button({
                iconCls: 'icon-database-save',
                text: this.shareText,
                hidden: true,
                handler: function(){
                    var selected = me.chartPanel.view.getSelectedRecords();
                    if(selected.length > 0){
                        me.shareChart(selected[0]);
                    } else {
                        Ext.Msg.alert(null, me.pleaseSelectChartText);
                    }
                }
        });

        var authorized = function(chartInfo) {
                var userDetails = me.getUserDetails();
                if (!userDetails) {
                    return false;
                }
                if (chartInfo.data.chartSource != 'share' || userDetails.user.role == 'ADMIN') {
                    return true;
                }
                return userDetails.user.id == chartInfo.data.ownerId;
        };

        var chartPanel = {
            xtype: "gxp_chartreportingpanel",
            store: this.chartStore,
            ref: 'view',
            //TODO context menu to re-import
            scope:this,
            listeners: {
                selectionchange: function(view, selections) {
                    if (selections.length > 0) {
                        downloadButton.show();
                        if (authorized(view.store.getAt(view.getSelectedIndexes()[0]))) {
                            saveButton.show();
                        } else {
                            saveButton.hide();
                        }
                    } else {
                        downloadButton.hide();
                        saveButton.hide();
                    }
                },
                contextMenu: function(view, index, node, e){
                   var obj = this.store.getAt(index);
                   var contextMenu = new Ext.menu.Menu({items: [{
                            iconCls: 'icon-download',
                            text: me.saveText,
                            handler: function(){
                                var obj = view.store.getAt(index);
                                obj.set('win', undefined);
                                me.downloadChart(obj);
                            }
                        },
                        {
                            iconCls: 'icon-database-save',
                            text: me.shareText,
                            hidden: !authorized(view.store.getAt(index)),
                            handler: function() {
                                var selected = view.store.getAt(index);
                                selected.set('win', undefined);
                                me.shareChart(selected);
                            }
                        }
                        ,{
                        text: me.editChartOptionsText,
                        tooltip: me.editChartOptionsText,
                        iconCls: 'icon-chart-edit',
                        scope: this,
                        handler: function(){
                            var obj = view.store.getAt(index);
                            var win = new Ext.Window({
                                iconCls: 'icon-chart-edit',
                                layout:'fit',
                                width:280,
                                modal: true,
                                title: me.editChartText,
                                // height:300,
                                autoHeight:true,
                                closeAction:'close',
                                plain: true,
                                items: [{
                                    xtype: 'form',
                                    labelWidth: 75,
                                    data: obj,
                                    frame:true,
                                    bodyStyle:'padding:5px 5px 0',
                                    width: 600,
                                    autoHeight:true,
                                    defaults: {anchor: '0'},
                                    defaultType: 'textfield',
                                    listeners: {
                                        scope: this,
                                        'afterlayout': function(f){
                                            var Record = Ext.data.Record.create([
                                                {name: 'id', type: 'string'},
                                                {name: 'title', type: 'string'},
                                                {name: 'chartType', type: 'string'},
                                                {name: 'aggFunction', type: 'string'},
                                                {name: 'color', type: 'string'},
                                                {name: 'gaugeMax', type: 'float'}
                                            ]);
                                            f.form.loadRecord(new Record(
                                                f.form.data.data
                                            ));
                                            if (f.form.data.data.chartType === 'gauge')
                                                f.gaugeMax.setVisible(true);
                                            if (f.form.data.data.chartType === 'gauge' || f.form.data.data.chartType === 'pie')
                                                f.colorpicker.setVisible(false);
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'id',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'title',
                                            fieldLabel: me.chartTitleText,
                                            anchor: '-10'
                                        },
                                        {
                                            anchor: '-10',
                                            xtype: 'combo',
                                            mode: 'local',
                                            triggerAction: 'all',
                                            forceSelection: true,
                                            editable: false,
                                            fieldLabel: me.aggregationText,
                                            name: 'aggFunction',
                                            displayField: 'name',
                                            valueField: 'value',
                                            store: new Ext.data.JsonStore({
                                                fields: ['name', 'value'],
                                                data: [
                                                    {name: 'Count', value: 'Count'},
                                                    {name: 'Sum', value: 'Sum'},
                                                    {name: 'Max', value: 'Max'},
                                                    {name: 'Min', value: 'Min'},
                                                    {name: 'Average', value: 'Average'}
                                                ]
                                            }),
                                            listeners: {
                                                expand: function(combo){
                                                    this.chartDataConfig = view.store.getAt(index);
                                                    combo.getStore().filterBy(function(record,id){
                                                        if(record.get('value') !== 'Count' && /(string|date|dateTime).*/.exec(this.chartDataConfig.get('yFieldType'))){
                                                            return false;
                                                        }else{
                                                            return true;
                                                        }
                                                    },this);
                                                }
                                            }
                                        },{
                                            anchor: '-10',
                                            xtype: 'combo',
                                            mode: 'local',
                                            triggerAction: 'all',
                                            forceSelection: true,
                                            editable: false,
                                            fieldLabel: this.chartTypeText,
                                            name: 'chartType',
                                            displayField: 'name',
                                            valueField: 'value',
                                            store: new Ext.data.JsonStore({
                                                fields: ['name', 'value'],
                                                data: [
                                                    {name: me.histogramText, value: 'bar'},
                                                    {name: me.lineText, value: 'line'},
                                                    {name: me.pieText, value: 'pie'},
                                                    {name: me.gaugeText, value: 'gauge'}
                                                ]
                                            }),
                                            listeners: {
                                                select: function(combo, record){
                                                    combo.ownerCt.gaugeMax.setVisible(record.get("value") === 'gauge');
                                                    combo.ownerCt.colorpicker.setVisible(record.get("value") !== 'gauge' && record.get("value") !== 'pie');
                                                }
                                            }
                                        },{
                							xtype: 'colorpickerfield',
                							fieldLabel: me.colourText,
                                            editable: false,
                                            ref: 'colorpicker',
                							name: 'color',
                                            anchor: '-10',
                                            value: 'FFFFFF'
                						},{
                                            xtype: 'numberfield',
                                            name: 'gaugeMax',
                                            ref: 'gaugeMax',
                                            fieldLabel: 'Max',
                                            anchor: '-10',
                                            hidden: true
                                        }
                                    ],
                                    buttons: [
                                        {
                                            iconCls: 'icon-accept',
                                            text: me.applyChangesText,
                                            handler: function() {
                                                var record = view.store.getAt(index);
                                                var data = this.ownerCt.ownerCt.form.getFieldValues();
                                                var modified = false;
                                                record.set('oldTitle', record.data.title);
                                                for (var r in data) {
                                                    if (data.hasOwnProperty(r)) {
                                                       if(record.data.hasOwnProperty(r)){
                                                           record.set(r, data[r]);
                                                           modified = true;
                                                       }
                                                    }
                                                }
                                                if (modified && record.data.chartSource == 'share') {
                                                    record.set('chartStatus', 'modified');
                                                }
                                                win.close();
                                            }
                                        },{
                                            iconCls: 'cancel',
                                            text: me.closeText,
                                            handler: function(){
                                                win.close();
                                            }
                                        }]
                                    }]
                            });
                            win.show();
                        }
                        },{
                        text: me.reloadConfigText,
                        tooltip: me.reloadConfigText,
                        iconCls: 'icon-reload-settings',
                        scope: this,
                        handler: function() {
                            me.reloadSettings(view.store.getAt(index))
                        }},
                        {
                            text: me.shareUrlText,
                            tooltip: me.shareUrlText,
                            iconCls: 'icon-share',
                            scope: this,
                            hidden: view.store.getAt(index).data.chartSource != 'share',
                            handler: function() {
                                var geoStoreId = view.store.getAt(index).data.geoStoreId;
                                me.params.chart = geoStoreId;
                                var shareUrl = me.paramsParts[0] + '?' + Ext.urlEncode(me.params);

                                var showUrlWindow = new Ext.Window({
                                    iconCls: 'icon-share',
                                    resizable: false,
                                    title: me.shareUrlText,
                                    width: 400,
                                    buttonAlign : 'center',
                                    items: [
                                        {
                                            xtype: 'compositefield',
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    flex: 1,
                                                    value: shareUrl,
                                                    readOnly: true
                                                },
                                                {
                                                    xtype: 'button',
                                                    scope: this,
                                                    iconCls: 'icon-link-go',
                                                    width: 30,
                                                    handler: function(){
                                                        var win = window.open(shareUrl, '_blank');
                                                        win.focus();
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    buttons: [{
                                        text: 'Close',
                                        handler: function(){
                                            showUrlWindow.hide();
                                        }
                                    }]
                                });
                                showUrlWindow.show();
                            }
                        },
                        {
                            text: me.deleteSharedChartText,
                            tooltip: me.deleteSharedChartText,
                            iconCls: 'icon-database-delete',
                            scope: this,
                            hidden:  authorized(view.store.getAt(index)) ? view.store.getAt(index).data.chartSource != 'share' : true,
                            handler: function() {
                                Ext.MessageBox.show({
                                    title: me.deleteSharedChartText,
                                    msg: me.deleteChartConfirmationText,
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.WARNING,
                                    fn: function(button) {
                                        if(button == 'yes') {
                                            var chart = view.store.getAt(index);
                                            var authHeader = me.getUserDetails().token;
                                            me.deleteResource(authHeader, chart.data.geoStoreId, me, 
                                                function() {
                                                    view.store.remove(chart);
                                                }
                                            ); 
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text: me.deleteSessionChartText,
                            tooltip: me.deleteSessionChartText,
                            iconCls: 'error',
                            scope: this,
                            handler: function() {
                                Ext.MessageBox.show({
                                    title: me.deleteSessionChartText,
                                    msg: me.deleteSessionChartConfirmationText,
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.WARNING,
                                    fn: function(button) {
                                        if(button == 'yes') {
                                            var chart = view.store.getAt(index);
                                            view.store.remove(chart);
                                        }
                                    }
                                });
                            }
                        }
                   ]});
                   contextMenu.showAt(e.xy);
                   e.preventDefault();
                },
                dblclick: function(view, index, node, e) {
                    var rec = me.chartStore.getAt(index);
                    me.generateChart(rec);
                }
            }
        };
        var tbi = this.tbi;
        config = Ext.apply({
             tbar: [downloadButton,
                    saveButton,
                    {
                    xtype: "button",
                    iconCls: 'icon-open',
                    text: this.loadChartText,
                    handler:function() {
                        me.openFileWindow();
                    }
                },{
                    xtype: "button",
                    iconCls: 'cancel',
                    text: this.clearAllText,
                    handler: function(){
                        Ext.Msg.confirm(null, me.clearAllText , function(btn, text){
                          if (btn == 'yes'){
                             me.chartStore.removeAll();
                          } else {
                            this.close;
                          }
                        });
                    }
            }],
            
            xtype: "panel",
            border: false,
            iconCls: "icon-chart-report",
            layout: "fit",
            items: [chartPanel]
        }, config || {});

        this.chartPanel = gxp.plugins.ChartReporting.superclass.addOutput.call(this, config);

        this.paramsParts = document.URL.split("?");
        this.params = {};
        if (this.paramsParts.length == 2) {
            this.params = Ext.urlDecode(this.paramsParts[1]);
        }

        if (this.params.chart) {
            var panel = Ext.getCmp('south');
            this.getChartById(this.params.chart, 
                function(record) {
                    panel.expand();
                    panel.doLayout();
                });
        }

        return this.chartPanel;
    },
    shareChart: function(obj) {
        var me = this;
        if (obj.data.chartStatus != 'modified' && obj.data.chartSource == 'share') {
            return;
        }
        var userDetails = this.getUserDetails();
        obj.data.ownerId = userDetails.user.id;
        var chartInfo = {
            name: obj.get('title'),
            category: this.category,
            data: JSON.stringify(obj.data),
        }
        var authHeader = this.getUserDetails().token;
        if (obj.data.chartSource != 'share') {
            this.createResource(authHeader, null, chartInfo, me, 
                function(resourceId) {
                    obj.set('geoStoreId', resourceId);
                    obj.set('chartStatus', 'share');
                    obj.set('chartSource', 'share');
                }
            );
        } else if (obj.data.oldTitle != obj.data.title) {
            this.updateResource(authHeader, obj.data.geoStoreId, chartInfo, me, 
                function() {
                    obj.set('chartStatus', 'share');
                    obj.set('chartSource', 'share');
                }
            );
        } else {
            this.updateResourceData(authHeader, obj.data.geoStoreId, chartInfo.data, me,
                function() {
                    obj.set('chartStatus', 'share');
                    obj.set('chartSource', 'share');
                }
            );
        }
    },
    loadSharedChart: function(chartId) {
        var items = this.chartPanel.view.store.data.items;
        for (var i = 0; i < items.length; i++) {
            if (items[i].data.geoStoreId == chartId) {
                Ext.Msg.show({ 
                    msg: this.chartAlreadyLoadedText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
                return;
            }
        }
        this.getChartById(chartId);
    },
    addChart( chartConfig, autoOpen ){
        chartConfig.id= Ext.id();
        chartConfig.chartSource = 'new';
        chartConfig.chartStatus = 'new';
        var record = new this.chartStore.recordType(chartConfig, chartConfig.id);
        this.chartStore.add(record);
        if(autoOpen){
            this.generateChart(record);
        }
    },
    generateChart: function(record){
        var me = this;
        var chartConfig = record.data;
        var store = new Ext.data.ArrayStore({
            root: 'AggregationResults',
            autoLoad: true,
            fields: [
                {name: 'label', type: chartConfig.xFieldType},
                {name: 'value', type: chartConfig.yFieldType}
            ],
            proxy : new Ext.data.HttpProxy({
                method: 'POST',
                url: chartConfig.url,
                xmlData: this.getWpsRequest(chartConfig),
                listeners:{
                   exception: function(proxy, type, action, options, response, arg) {
                        me.canvasWindow.hide();

                        var errorDetails = response.responseText;
                        var errorMessage = me.wpsErrorWindowMsgText;

                        if (errorDetails.indexOf("The query in queryCollection returns too many features") >= 0) {
                            errorMessage = me.tooManyFeaturesWindowMsgText;
                        }

                        var messagePanel = new Ext.Panel({
                              layout:'Anchor',
                              border:false,
                              bodyBorder:false,
                              hideBorders:true,
                              items: [{
                                xtype:'textarea',
                                layout:'anchor',
                                anchor: '100%',
                                height: '20%',
                                readOnly:true,
                                value: errorMessage,
                                autoScroll: true
                              }]
                        });

                        var detailsPanel = new Ext.Panel({
                            title: 'Details',
                            layout:'Anchor',
                            collapsible: true,
                            collapsed: true,
                            border:false,
                            bodyBorder:false,
                            hideBorders:true,
                            items: [{
                                xtype:'textarea',
                                layout:'anchor',
                                anchor: '100%',
                                readOnly:true,
                                value: errorDetails,
                                autoScroll: true
                            }]
                        });

                        var errorWindow = new Ext.Window({
                            resizable: false,
                            title: me.wpsErrorWindowMsgTitle,
                            closeAction: "hide",
                            layout: "Anchor",
                            width: 550,
                            modal: true,
                            iconCls: 'error',
                            iconMask: true,
                            items: [messagePanel, detailsPanel],
                             buttons: [{
                                text: 'Close',
                                handler: function(){
                                    errorWindow.hide();
                                }
                            }]
                        });
                        errorWindow.show();
                   }
                }
            })
        });
        var exportPng = function(event, toolEl, panel){
            //regex is for IE11 so we have to use a servlet
            if(Ext.isIE11 === undefined){
                Ext.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
            }
            var me = this;
            // canvasWindow.chartsPanel.items.items[0].items.items[0].getEl().dom is mad. Use a method from the panel
            var target = me.canvasWindow.chartsPanel.items.items[0].items.items[0].getEl().dom
            var tgtparent = target.parentElement;
            var originalClass = target.className;

            $(target).appendTo(document.body)
            $(target).addClass("html2canvasreset");
            html2canvas( target , {
                    proxy: this.target.proxy,
                   // allowTaint:true,  
                    //CORS errors not managed with ie11, so disable
                    useCORS: !Ext.isIE11,
                    //logging:true,
                    onrendered: function(c) {

                        target.className = originalClass;
                        var canvasData = c.toBlob(function(blob){
                            me.download(blob,chartConfig.title + ".png","image/png");
                        });


                        $(target).appendTo(tgtparent);
                    }
            });

        };
        this.canvasWindow = new Ext.Window({
            title: chartConfig.title,
            layout:'border',
            modal: true,
            autoScroll:false,
            height:Math.min(Ext.getBody().getViewSize().height, 700),
            width:800,
            maximizable:true,
            items:[{
                xtype: 'gxp_chartcontainer',
                ref: 'chartsPanel',
                chartConfig: chartConfig,
                store: store,
                region:'center',
                border:false
            },{
                region:'south',
                height: 240,
                title: this.dataText,
                collapsible: true,
                layout:'fit',
                items:[{
                    xtype:'grid',
                    store: store,
                    loadMask: new Ext.LoadMask(Ext.getBody(), {msg: "Please wait..."}),
                    ref:'dataGrid',
                    viewConfig: {
                        forceFit: true
                    },
                    autoScroll: true,
                    colModel: new Ext.grid.ColumnModel({
                        defaults: {
                            width: 120,
                            sortable: true
                        },
                        columns: [
                            {id: 'groupbyattribute', header: chartConfig.xaxisValue, dataIndex: 'label'},
                            {header: 'valueattribute',  header: chartConfig.aggFunction + "(" + chartConfig.yaxisValue + ")" , dataIndex: 'value'}
                        ]
                    }),
                    bbar: ["->",{
                        xtype: 'button',
                        ref:'../../csvExport',
                        iconCls: 'icon-table-save',
                        text: this.exportCsvText,
                        scope: this,
                        handler: function(btn){
                            var lstore = btn.refOwner.dataGrid.getStore();
                            var rows = [];
                            var data = lstore.getRange()
                            for(var i = 0; i < data.length; i++){
                                var item = data[i];
                                rows.push([item.get('label'), item.get('value')]);
                            }
                            var headers = [
                               chartConfig.xaxisValue,
                               chartConfig.aggFunction + "(" + chartConfig.yaxisValue + ")"
                            ];
                            var finalFile = headers.join(this.csvSeparator);
                            for(var i = 0; i < rows.length; i++){
                                var row = rows[i];
                                finalFile += "\n" + row.join(this.csvSeparator);
                            }
                            this.download(finalFile, chartConfig.title + ".csv", "attachment/csv");

                        }
                    },{
                        xtype: 'button',
                        ref:'../../print',
                        iconCls: 'gxp-icon-pngexport',
                        text: this.exportPngText,
                        scope: this,
                        handler: exportPng
                    }]
                }]
            }]
        }).show();
        this.openWindows[record.get('id')] = this.canvasWindow;
    },
    getWpsRequest: function(chartConfig) {
        return String.format(
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<wps:Execute service="WPS" ' +
            '  version="1.0.0" ' +
            '  xmlns="http://www.opengis.net/wps/1.0.0" ' +
            '  xmlns:gml="http://www.opengis.net/gml" ' +
            '  xmlns:ogc="http://www.opengis.net/ogc" ' +
            '  xmlns:ows="http://www.opengis.net/ows/1.1" ' +
            '  xmlns:wcs="http://www.opengis.net/wcs/1.1.1" ' +
            '  xmlns:wfs="http://www.opengis.net/wfs" ' +
            '  xmlns:wps="http://www.opengis.net/wps/1.0.0" ' +
            '  xmlns:xlink="http://www.w3.org/1999/xlink" ' +
            '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            '  xsi:schemaLocation="http://www.opengis.net/wps/1.0.0' +
            '  http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">' +
            '  <ows:Identifier>gs:Aggregate</ows:Identifier>' +
            '  <wps:DataInputs>' +
            '    {0}' +
            '    {1}' +
            '    {2}' +
            '    {3}' +
            '    {4}' +
            '  </wps:DataInputs>' +
            '  <wps:ResponseForm>' +
            '    <wps:RawDataOutput mimeType="application/json">' +
            '      <ows:Identifier>result</ows:Identifier>' +
            '    </wps:RawDataOutput>' +
            '  </wps:ResponseForm>' +
            '</wps:Execute>',
            this.getWpsGetFeatureInput(chartConfig.typeName, chartConfig.ogcFilter),
            this.getWpsLiteralInput("aggregationAttribute", chartConfig.yaxisValue),
            this.getWpsLiteralInput("function", chartConfig.aggFunction),
            this.getWpsLiteralInput("singlePass", "false"),
            this.getWpsLiteralInput("groupByAttributes", chartConfig.xaxisValue));
    },
    getWpsLiteralInput: function(name, value) {
        return String.format(
            '<wps:Input>' +
            '  <ows:Identifier>{0}</ows:Identifier>' +
            '  <wps:Data>' +
            '    <wps:LiteralData>{1}</wps:LiteralData>' +
            '  </wps:Data>' +
            '</wps:Input>', name, value);
    },
    getWpsGetFeatureInput: function(name, filter) {
        return String.format(
            '<wps:Input>' +
            '  <ows:Identifier>features</ows:Identifier>' +
            '  <wps:Reference method="POST" mimeType="text/xml" xlink:href="http://geoserver/wfs">' +
            '    <wps:Body>' +
            '      <wfs:GetFeature outputFormat="GML2" service="WFS" version="1.0.0">' +
            '        <wfs:Query typeName="{0}">' +
            '        {1}' +
            '        </wfs:Query>' +
            '      </wfs:GetFeature>' +
            '    </wps:Body>' +
            '  </wps:Reference>' +
            '</wps:Input>', name, filter);
    },
    download: function(text, name, type) {
        var a = document.createElement("a");
        var file = new Blob([text], {type: type});
        // a.href = URL.createObjectURL(file);
        saveAs(file, name);
        // a.href = 'data:' + type + ',' +  encodeURI(text);
        // a.target = '_blank';
        // a.href = URL.createObjectURL(file);
        // a.setAttribute("download",name);
        // this.emulateClick(a);
    },
    emulateClick: function(comp){
        try { //in firefox
            comp.click();
            return;
        } catch(ex) {}
        try { // in chrome
            if(document.createEvent) {
                var e = document.createEvent('MouseEvents');
                e.initEvent( 'click', true, true );
                comp.dispatchEvent(e);
                return;
            }
        } catch(ex) {}
        try { // in IE
            if(document.createEventObject) {
                 var evObj = document.createEventObject();
                 comp.fireEvent("onclick", evObj);
                 return;
            }
        } catch(ex) {}
    },
    openFileWindow: function() {

        var me = this;

        var ds = new Ext.data.JsonStore({
            root: 'results',
            autoLoad: true,
            totalProperty: 'totalCount',
            fields: [
                {name: 'canCopy', type: 'boolean'},
                {name: 'canDelete', type: 'boolean'},
                {name: 'canEdit', type: 'boolean'},
                {name: 'creation', type: 'string'},
                {name: 'id', type: 'int'},
                {name: 'name', type: 'string'}
            ],
            sortInfo: { field: "name", direction: "ASC" },
            proxy : new Ext.data.HttpProxy({
                method: 'GET',
                url: me.geoStoreUrl + "/extjs/search/category/" + me.category+ "/*",
                disableCaching: true,
                headers: {'Accept': 'application/json', 'Authorization' : this.auth}
            })
        });

        var resultTpl = new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
                '<span>{name}</span>',
            '</div></tpl>'
        );
        
        var search = new Ext.form.ComboBox({
            store: ds,
            displayField:'name',
            loadingText: 'Searching...',
            minChars: 0,
            pageSize:10,
            tpl: resultTpl,
            fieldLabel: this.loadByIdText,
            itemSelector: 'div.search-item',
            width: 320,
            onSelect: function(record) {
                me.loadSharedChart(record.data.id);
                me.win.close();
            },
            listeners: {
                beforequery: function (queryEvent) {
                    this.store.proxy.setUrl(me.geoStoreUrl + "/extjs/search/category/" 
                        + me.category+ "/*" + this.getValue() + "*");
                }
            }
        });

        var win = new Ext.Window({
                iconCls: 'icon-open',
                layout:'fit',
                width:360,
                modal: true,
                resizable: false,
                // height:300,
                title: me.loadChartText,
                autoHeight:true,
                closeAction:'close',
                plain: true,
                items: [{
                    xtype: 'form',
                    labelWidth: 75,
                    frame:true,
                    bodyStyle:'padding:5px 5px 0',
                    width: 350,
                    autoHeight:true,
                    defaults: {width: 240},
                    defaultType: 'textfield',
                    items: [
                        new Ext.TabPanel({
                            renderTo: Ext.getBody(),
                            activeTab: 0,
                            items: [
                                {
                                    xtype: 'panel',
                                    title: this.fileText,
                                    layout:'fit',
                                    iconCls: 'icon-upload',
                                    items: [
                                        new Ext.ux.form.FileUploadField({
                                            id: "chart-file-form",
                                            buttonText: me.browseText,
                                            listeners: {
                                                scope: this,
                                                fileselected: function(selector, value) {
                                                    var fileElId = selector.getFileInputId();
                                                    var fileInput = document.getElementById(fileElId).files[0];
                                                    selector.getAsText(fileInput);
                                                }
                                            },
                                            getAsText: function(readFile) {
                                                var reader = new FileReader();
                                                reader.readAsText(readFile, "UTF-8");
                                                reader.onprogress = this.onProgress;
                                                reader.onload = this.onLoad;
                                                reader.onerror = this.onError;
                                            },
                                            onLoad: function(evt) {
                                                me.loadFromString(evt.target.result, "file");
                                                win.close();
                                            },
                                            onError: function(evt) {
                                                Ext.Msg.show({
                                                   msg: me.fileErrorText,
                                                   buttons: Ext.Msg.OK,
                                                   animEl: 'elId',
                                                   icon: Ext.MessageBox.ERROR
                                                });
                                                win.close();
                                            }
                                        })
                                    ]
                                },
                                {
                                    xtype: 'compositefield',
                                    iconCls: 'chart-icon-share',
                                    title: this.sharedText,
                                    items: [search]
                                }
                            ]
                        })
                       ],
                    buttons: [{
                        iconCls: 'cancel',
                        text: me.closeText,
                        handler: function(){
                            win.close();
                        }
                    }]
                }]
        });
        win.show();
        me.win = win;
    },
    downloadChart: function(obj) {
        this.download(JSON.stringify(obj.data), obj.get("title") + ".mschart", 'application/json');
    },
    loadFromString: function(jsonString, chartSource, geoStoreId){
        try{
            var plainObj = JSON.parse(jsonString);
        } catch(e) {
             Ext.Msg.show({
               msg: this.fileErrorText,
               buttons: Ext.Msg.OK,
               animEl: 'elId',
               icon: Ext.MessageBox.ERROR
            });
            return;
        }
        if (plainObj.id !== null){
            plainObj.id = Ext.id();
        }
        plainObj.chartSource = chartSource;
        plainObj.chartStatus = chartSource;
        plainObj.geoStoreId = geoStoreId;
        var record = new this.chartStore.recordType(plainObj, plainObj.id);
        this.chartStore.add(record);
        return record;
    },
    guid: function() {
        var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    getUserDetails: function() {
        if (this.target.userDetails) {
            return this.target.userDetails;
        }
        if (this.target.getAuth()) {
            return Ext.util.JSON.decode(sessionStorage["userDetails"]);
        }
    },
    getEveryoneGroupIdFromUserDetails: function(userDetails) {
        if (!userDetails
            || !userDetails.user
            || !userDetails.user.groups
            || !userDetails.user.groups.group) {
            return undefined;
        }
        var groups = userDetails.user.groups.group;
        if (!(userDetails.user.groups.group instanceof Array)) {
            groups = [groups];
        }
        for (i = 0; i < groups.length; ++i) {
            if(groups[i].groupName == 'everyone') {
                return groups[i].id;
            }
        }
        return undefined;
    },
    getChartById: function(chartId, callback) {
        var loadMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
        loadMask.show();
        Ext.Ajax.request({
            url: this.geoStoreUrl + 'resources/resource/' + chartId + '/?full=true',
            method: 'GET',
            headers:{
                'Accept': 'application/json'
            },
            scope: this,
            success:  function(response, opts) {
                var record = this.loadFromString(
                    Ext.util.JSON.decode(response.responseText).Resource.data.data, "share", chartId);
                loadMask.hide();
                if (callback) {
                    callback(record);
                }
            },
            failure:  function(response, opts) {
                loadMask.hide();
                Ext.Msg.show({ 
                    msg: this.invalidSharedId,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    createResource: function(authHeader, geoStoreId, chartInfo, scope, successCallback) {
        var requestBody = '<Resource>' +
                          '   <name>' + chartInfo.name + '</name>' +
                          '   <category>' +
                          '      <name>' + chartInfo.category + '</name>' +
                          '   </category>'+
                          '   <store>' +
                          '      <data><![CDATA[ ' + chartInfo.data + ']]></data>' +
                          '   </store>' +
                          '</Resource>';
        var loadMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
        loadMask.show();
        Ext.Ajax.request({
            url: scope.geoStoreUrl + 'resources',
            method: 'POST',
            headers:{
                'Content-Type' : 'text/xml',
                'Authorization' : authHeader
            },
            params: requestBody,
            scope: scope,
            success:  function(response, opts) {
                scope.makeResourcePublic(response.responseText, loadMask, scope, successCallback);
            },
            failure:  function(response, opts) {
                loadMask.hide();
                if (response.responseText.indexOf('CONSTRAINT_INDEX_9 ON PUBLIC.GS_RESOURCE(NAME)') > -1
                    || response.status == 409) {
                    Ext.Msg.show({
                        title: 'GeoStore Exception',
                        msg: scope.cannotCreateDuplicateResourceText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                } else {
                    Ext.Msg.show({
                        title: 'GeoStore Exception',
                        msg: scope.cannotCreateResourceText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        });
    },
    updateResource: function(authHeader, geoStoreId, chartInfo, scope, successCallback) {
        var requestBody = '<Resource>' +
                          '   <name>' + chartInfo.name + '</name>' +
                          '   <category>' +
                          '      <name>' + chartInfo.category + '</name>' +
                          '   </category>'+
                          '</Resource>';
        var loadMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
        loadMask.show();
        Ext.Ajax.request({
            url: scope.geoStoreUrl + 'resources/resource/' + geoStoreId,
            method: 'PUT',
            headers:{
                'Content-Type' : 'text/xml',
                'Authorization' : authHeader
            },
            params: requestBody,
            scope: scope,
            success:  function(response, opts) {
                scope.updateResourceData(authHeader, geoStoreId, chartInfo.data, scope, successCallback, loadMask);
            },
            failure:  function(response, opts) {
                loadMask.hide();
                if (response.responseText.indexOf('CONSTRAINT_INDEX_9 ON PUBLIC.GS_RESOURCE(NAME)') > -1
                    || response.status == 409) {
                    Ext.Msg.show({
                        title: 'GeoStore Exception',
                        msg: scope.cannotCreateDuplicateResourceText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                } else {
                    Ext.Msg.show({
                        title: 'GeoStore Exception',
                        msg: scope.cannotCreateResourceText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        });
    },
    updateResourceData: function(authHeader, geoStoreId, data, scope, successCallback, loadMask) {
        if (!loadMask) {
            loadMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
            loadMask.show();
        }
        Ext.Ajax.request({
            url: scope.geoStoreUrl + 'data/' + geoStoreId,
            method: 'PUT',
            headers:{
                'Authorization' : authHeader
            },
            params: data,
            scope: scope,
            success:  function(response, opts) {
                loadMask.hide();
                if (successCallback) {
                    successCallback();
                }
            },
            failure:  function(response, opts) {
                loadMask.hide();
                Ext.Msg.show({
                    title: 'GeoStore Exception',
                    msg: scope.cannotupdateResourceDataText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },
    deleteResource: function(authHeader, geoStoreId, scope, successCallback) {
        var loadMask = new Ext.LoadMask(Ext.getBody(), { msg: "Please wait..." });
        loadMask.show();
        Ext.Ajax.request({
            url: scope.geoStoreUrl + 'resources/resource/' + geoStoreId,
            method: 'DELETE',
            headers: { 'Authorization' : authHeader },
            scope: scope,
            success:  function(response, opts) {
                loadMask.hide();
                if (successCallback) {
                    successCallback();
                }
            },
            failure:  function(response, opts) {
                loadMask.hide();
                Ext.Msg.show({
                    title: 'GeoStore Exception',
                    msg: scope.cannotDeleteResourceText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },
    makeResourcePublic: function(resourceId, loadMask, scope, successCallback) {
        var userDetails = scope.getUserDetails();
        var everyoneGroupId = scope.getEveryoneGroupIdFromUserDetails(userDetails);
        var authHeader = userDetails.token;
        var requestBody = '<SecurityRuleList>' +
                          '   <SecurityRule>' +
                          '       <canRead>true</canRead>' +
                          '       <canWrite>true</canWrite>' +
                          '       <user>' +
                          '           <name>' + userDetails.user.name + '</name>' +
                          '           <id>' + userDetails.user.id + '</id>' +
                          '       </user>' +
                          '   </SecurityRule>' +
                          '   <SecurityRule>' +
                          '       <canRead>true</canRead>' +
                          '       <canWrite>false</canWrite>' +
                          '       <group>' +
                          '           <groupName>everyone</groupName>' +
                          '           <id>' + everyoneGroupId + '</id>' +
                          '       </group>' +
                          '   </SecurityRule>' +
                          '</SecurityRuleList>';
        Ext.Ajax.request({
            url: scope.geoStoreUrl + 'resources/resource/' + resourceId + '/permissions',
            method: 'POST',
            headers:{
                'Content-Type' : 'text/xml',
                'Authorization' : authHeader
            },
            params: requestBody,
            scope: scope,
            success:  function(response, opts) {
                loadMask.hide();
                if (successCallback) {
                    successCallback(resourceId);
                }
            },
            failure:  function(response, opts) {
                loadMask.hide();
                Ext.Msg.show({
                    title: 'GeoStore Exception',
                    msg: scope.cannotMakeResourcePublicText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },
    reloadSettings: function(record) {
        if (record.data.spatialSelectorFormState && record.data.spatialSelectorFormState.chartOptions) {
            record.data.spatialSelectorFormState.chartOptions.type = record.data.chartType;
            record.data.spatialSelectorFormState.chartOptions.function = record.data.aggFunction;
            record.data.spatialSelectorFormState.chartOptions.max = record.data.gaugeMax;
        }
        var spatialSelectorQueryForm = this.target.tools[this.spatialSelectorFormId];
        spatialSelectorQueryForm.setState(record.data.spatialSelectorFormState);
    }
});

Ext.preg(gxp.plugins.ChartReporting.prototype.ptype, gxp.plugins.ChartReporting);
