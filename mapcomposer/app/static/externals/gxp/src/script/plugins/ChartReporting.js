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

    saveText: "Save",
    shareText: "Share",
    loadChartText: "Load Chart",
    loadFromFileText: "Open from a file",
    loadByIdText: "Open from a shared ID",
    fileErrorText: "Unable to parse the input file",
    pleaseSelectChartText: "Please select a chart first",
    reloadConfigText: "Reload Configuration",
    editChartOptionsText: "Edit",
    exportCsvText: "Export as CSV", 
    dataText: "Data",
    csvSeparator: ",",
    
    // REMOVE THIS WHEN ALL FEATURES ARE IMPLEMENTED
    tbi : function(){
        Ext.Msg.show({
            title:'Feature to be implemented',
            msg: "Not yet implemented"}
         );
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
               {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
                
            ],
           
        });
        var chartPanel = {
            xtype: "gxp_chartreportingpanel",
            store: this.chartStore,
            ref: 'view',
            //TODO context menu to re-import
            scope:this,
            listeners: {
                contextMenu: function(view, index, node, e){
                   var obj = this.store.getAt(index);
                   var contextMenu = new Ext.menu.Menu({items: [{
                            iconCls: 'icon-disk',
                            text: me.saveText,
                            handler: function(){
                                var obj = view.store.getAt(index);
                                obj.set('win', undefined);
                                me.downloadChart(obj);
                            }
                        },{
                        text: me.editChartOptionsText,
                        tooltip: me.editChartOptionsText,
                        iconCls: 'icon-chart-edit',
                        scope: this,
                        handler: function(){
                            var obj = view.store.getAt(index);
                            var win = new Ext.Window({
                                layout:'fit',
                                width:280,
                                modal: true,
                                title:'Edit Chart',
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
                                            fieldLabel: 'Titolo Grafico',
                                            anchor: '-10'
                                        },
                                        {
                                            anchor: '-10',
                                            xtype: 'combo',
                                            mode: 'local',
                                            triggerAction: 'all',
                                            forceSelection: true,
                                            editable: false,
                                            fieldLabel: 'Aggregazione',
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
                                            fieldLabel: 'Tipo grafico',
                                            name: 'chartType',
                                            displayField: 'name',
                                            valueField: 'value',
                                            store: new Ext.data.JsonStore({
                                                fields: ['name', 'value'],
                                                data: [
                                                    {name: 'Istogramma', value: 'bar'},
                                                    {name: 'Linea', value: 'line'},
                                                    {name: 'Torta', value: 'pie'},
                                                    {name: 'Cruscotto', value: 'gauge'}
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
                							fieldLabel: 'Colore',
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
                                            iconCls: 'icon-disk',
                                            text: me.saveText,
                                            handler: function() {
                                                var record = view.store.getAt(index);
                                                var data = this.ownerCt.ownerCt.form.getFieldValues();
                                                for (var r in data) {
                                                    if (data.hasOwnProperty(r)) {
                                                       if(record.data.hasOwnProperty(r)){
                                                           record.set(r, data[r]);
                                                       }
                                                    }
                                                }
                                                win.close();
                                            }
                                        },{
                                            iconCls: 'cancel',
                                            text: 'Close',
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
                        handler: me.tbi
                   }]});
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
             tbar: [{
                    xtype: "button",
                    iconCls: 'icon-disk',
                    text: this.saveText,
                    handler: function(){
                        var selected = me.chartPanel.view.getSelectedRecords();
                        if(selected.length > 0){
                            me.downloadChart(selected[0]);
                        } else {
                            Ext.Msg.alert(null, me.pleaseSelectChartText);
                        }

                    }
                },{
                    xtype: "button",
                    iconCls: 'icon-share',
                    text: this.shareText,
                    handler:tbi
                },"->",{
                    xtype: "button",
                    iconCls: 'icon-open',
                    text: this.loadChartText,
                    handler:function() {
                        me.openFileWindow();
                    }
            }],
            xtype: "panel",
            border: false,
            iconCls: "icon-chart-report",
            layout: "fit",
            items: [chartPanel]
        }, config || {});
       
        this.chartPanel = gxp.plugins.ChartReporting.superclass.addOutput.call(this, config);
        
       
        
        return this.chartPanel;
    },
    addChart( chartConfig, autoOpen ){
        chartConfig.id= Ext.id();
        var record = new this.chartStore.recordType(chartConfig, chartConfig.id);
        this.chartStore.add(record);
        if(autoOpen){
            this.generateChart(record);
        }
    },
    generateChart: function(record){
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
                xmlData: this.getWpsRequest(chartConfig)
            })
        });

        var canvasWindow = new Ext.Window({
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
                    }]
                }]
            }],
            tools : [{
                id:'print',
                scope: this,
                handler: function(event, toolEl, panel){
                    //regex is for IE11 so we have to use a servlet
                    if(Ext.isIE11 === undefined){
                        Ext.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
                    }
                    var me = this;
                    // canvasWindow.chartsPanel.items.items[0].items.items[0].getEl().dom is mad. Use a method from the panel
                    var target = canvasWindow.chartsPanel.items.items[0].items.items[0].getEl().dom
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

                }
            }]
        }).show();
        this.openWindows[record.get('id')] = canvasWindow;
        
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
    openFileWindow: function(){
        var me = this;
        var win = new Ext.Window({
                layout:'fit',
                width:360,
                modal: true,
                // height:300,
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
                        new Ext.ux.form.FileUploadField({
                            id: "chart-file-form",
                            fieldLabel: this.loadFromFileText,
                            width: 240,
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
                                me.loadFromString(evt.target.result);
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
                        }),
                        {
                            xtype: 'compositefield',
                            items: [
                               {
                                    xtype     : 'textfield',
                                    fieldLabel: this.loadByIdText,
                                    width: 180
                                },
                                {
                                    xtype: 'button',
                                    text: 'Load',
                                    flex      : 1,
                                    scope: this,
                                    handler: function(){
                                        this.tbi();
                                        win.close();
                                    }
                                }
                            ]
                        }
                        
                        
                        
                        
                       ],
                    buttons: [{
                        text: 'Close',
                        handler: function(){
                            win.close();
                        }
                    }]  
                }]
        });
        win.show();
    },
    downloadChart: function(obj) {
        this.download(JSON.stringify(obj.data), obj.get("title") + ".mschart", 'application/json');
    },
    loadFromString: function( jsonString ){
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
        var record = new this.chartStore.recordType(plainObj, plainObj.id);
        this.chartStore.add(record);
    }

    
});

Ext.preg(gxp.plugins.ChartReporting.prototype.ptype, gxp.plugins.ChartReporting);
