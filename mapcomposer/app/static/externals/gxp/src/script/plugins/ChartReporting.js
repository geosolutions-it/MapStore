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
               'aggType',
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
                        handler: me.tbi
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
            height:Math.min(Ext.getBody().getViewSize().height,456),
            width:800,
            maximizable:true,
            items:[{
                xtype: 'gxp_chartcontainer',
                ref: 'chartsPanel',
                chartConfig: chartConfig,
                store: store,
                region:'center',
                border:false
            }]/*,
            tools: windowTools*/
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
            this.getWpsLiteralInput("aggregationAttribute", chartConfig.xaxisValue), 
            this.getWpsLiteralInput("function", chartConfig.aggFunction), 
            this.getWpsLiteralInput("singlePass", "false"), 
            this.getWpsLiteralInput("groupByAttributes", chartConfig.yaxisValue));
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
      a.href = URL.createObjectURL(file);
      a.setAttribute("download",name);
      a.click();
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
                                    xtype     : 'button',
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
