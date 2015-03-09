/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @include widgets/grid/ScheduledCapacitiesGrid.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureGrid
 */

/** api: (extends)
 *  plugins/gxp.plugins.he.FeatureGrid.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */   
gxp.plugins.he.ResultsGrid = Ext.extend(gxp.plugins.FeatureGrid, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "he_results_grid",

    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,

    /** api: config[showTotalResults]
     *  ``Boolean`` If set to true, the total number of records will be shown
     *  in the bottom toolbar of the grid, if available.
     */
    showTotalResults: false,
    
    /** api: config[alwaysDisplayOnMap]
     *  ``Boolean`` If set to true, the features that are shown in the grid
     *  will always be displayed on the map, and there will be no "Display on
     *  map" button in the toolbar. Default is false. If set to true, no
     *  "Display on map" button will be shown.
     */
    alwaysDisplayOnMap: false,
    
    /** api: config[showExportCSV]
     *  ``Boolean`` If set to true, show CSV export bottons.
     *  Deprecated. Use exportFormats = ["CSV"]
     */
    showExportCSV: false,

    /** api: config[exportFormats]
     *  ``Array`` With the extra formats to download.
     *  For example: "CSV","shape-zip","excel", "excel2007"
     */
    exportFormats: null,
    
    /** api: config[ignoreFields]
     *  ``Array`` don't show columns in this set as columns in the grid
     */
    ignoreFields: ['count'],

    /** api: config[exportFormatsConfig]
     *  ``Object`` With specific configuration by export format.
     *  Allowed configurations are: <ul>
     *     <li>`addGeometry`: to append the geometry to the `propertyName` url parameter</li>
     *     <li>`exportAll`: to not include `propertyName` url parameter and export all layer data</li>
     *  </ul>
     *  The default one include a valid configuration for shp-zip export
     */
    exportFormatsConfig:{
        "shape-zip": {
            addGeometry: true
        }
    },

    /** api: config[exportAction]
     *  ``String`` Export action type. 
     *  It can be `button` (append one button for each export format) 
     *  or `window` (append only one button `Export` and show options in a new window).
     *  Default is `window`.
     */
    exportAction: "window",
    
    /** api: config[displayMode]
     *  ``String`` Should we display all features on the map, or only the ones
     *  that are currently selected on the grid. Valid values are "all" and
     *  "selected". Default is "all".
     */
    displayMode: "all",
    
    /** api: config[autoExpand]
     *  ``Boolean`` If set to true, and when this tool's output is added to a
     *  container that can be expanded, it will be expanded when features are
     *  loaded. Default is false.
     */
    autoExpand: false,
    
    /** api: config[autoCollapse]
     *  ``Boolean`` If set to true, and when this tool's output is added to a
     *  container that can be collapsed, it will be collapsed when no features
     *  are to be displayed. Default is false.
     */
    autoCollapse: false,
    
    /** api: config[selectOnMap]
     *  ``Boolean`` If set to true, features can not only be selected on the
     *  grid, but also on the map, and multi-selection will be enabled. Only
     *  set to true when no feature editor or feature info tool is used with
     *  the underlying feature manager. Default is false.
     */
    selectOnMap: false,
    
    filterPropertyNames: true,

    /** private: method[displayTotalResults]
     */
    displayTotalResults: function() {
        var featureManager = this.target.tools[this.featureManager];
        if (this.showTotalResults === true && featureManager.numberOfFeatures !== null) {
            this.displayItem.setText(
                String.format(
                    this.totalMsg,
                    featureManager.numberOfFeatures
                )
            );
        }
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        config = Ext.apply({
            xtype: "he_scheduled_capacities_grid",
            loadMask:true
        }, config || {});
        var featureGrid = gxp.plugins.he.ResultsGrid.superclass.addOutput.call(this, config);
        
        
        
        return featureGrid;
    },

    /** api: method[getExportWindowButton]
     *  Generate a export button to open a new dialog with the configured formats
     */    
    getExportWindowButton: function(){
        var exportWindow = this.exportWindow;
        if(!exportWindow){
            var formatStore = [];
            var appendedCSVExporter = false;
            for (var i = 0; i < this.exportFormats.length; i++){
                var format = this.exportFormats[i];
                // Retrocompatibilty
                if(format == "CSV"){
                    appendedCSVExporter = true;
                }
                formatStore.push({
                    name: format,
                    value: format,
                    iconCls: "gxp-icon-" + format.toLowerCase() + "export"
                });
            }
            // Retrocompatibilty
            if(!appendedCSVExporter && this.showExportCSV){
                formatStore.push({
                    name: "CSV",
                    value: "CSV",
                    iconCls: "gxp-icon-csvexport-single"
                });
            }
            var selectionFormatCombo = {
                xtype : 'combo',
                width: 179,
                fieldLabel : this.comboFormatMethodLabel,
                typeAhead : true,
                triggerAction : 'all',
                lazyRender : false,
                mode : 'local',
                name : 'format',
                forceSelected : true,
                emptyText : this.comboFormatEmptyText,
                value : this.defaultComboFormatValue,
                allowBlank : false,
                autoLoad : true,
                displayField : 'name',
                valueField : 'value',
                editable : false,
                readOnly : false,
                tpl: this.comboFormatTpl,
                listConfig: {
                      getInnerTpl: function(displayField) {
                        return '<div class="{iconCls}"> {' + displayField + '}' + "</div>";
                      }
                },
                store : new Ext.data.JsonStore({
                    fields : [{
                        name : 'name',
                        dataIndex : 'name'
                    }, {
                        name : 'value',
                        dataIndex : 'value'
                    }, {
                        name : 'iconCls',
                        dataIndex : 'iconCls'
                    }],
                    data : formatStore
                })
            };
            exportWindow = new Ext.Window({
                title: this.exportTitleText,
                width: 300,
                closeAction: 'hide',
                items: [{
                    xtype: 'form',
                    ref: "form",
                    items: [selectionFormatCombo],
                    bbar: ["->", {
                        iconCls: "gxp-icon-csvexport-single",
                        text: this.exportCSVSingleText,
                        handler: function() {
                            if(this.exportWindow.form.getForm().isValid()){
                                var format = this.exportWindow.form.getForm().getValues().format;
                                this.doExport(true, format);
                            }else{
                                Ext.Msg.show({
                                    title: this.noFormatTitleText,
                                    msg: this.noFormatBodyText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                }); 
                            }
                        },
                        scope: this
                    },{
                        iconCls: "gxp-icon-csvexport-multiple",
                        text: this.exportCSVMultipleText,
                        handler: function() {
                            if(this.exportWindow.form.getForm().isValid()){
                                var format = this.exportWindow.form.getForm().getValues().format;
                                this.doExport(false, format);
                            }else{
                                Ext.Msg.show({
                                    title: this.noFormatTitleText,
                                    msg: this.noFormatBodyText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                }); 
                            }
                        },
                        scope: this
                    }]
                }]
            });
            this.exportWindow = exportWindow;
        }
        return {
            text: this.exportTitleText,
            xtype: 'button',
            disabled: true,
            iconCls: "gxp-icon-csvexport",
            ref: "../exportButton",
            handler:function() {                    
                this.exportWindow.show();
            },
            scope: this
        };
    }, 

    /** api: method[getExportButton]
     *  Generate a export button for an specific format
     */    
    getExportButton: function(format){
        var displayExportText = String.format(this.displayExportText, format);
        return {
            text: displayExportText,
            xtype: 'button',
            disabled: true,
            iconCls: "gxp-icon-" + format.toLowerCase() + "export",
            ref: "../export" + format + "Button",
            menu:{
                xtype: "menu",
                showSeparator: true, 
                items: [{
                    iconCls: "gxp-icon-csvexport-single",
                    text: this.exportCSVSingleText,
                    handler: function() {                    
                        this.me.doExport(true, this.format);
                    },
                    scope: {
                        me: this,
                        format: format
                    }
                },{
                    iconCls: "gxp-icon-csvexport-multiple",
                    text: this.exportCSVMultipleText,
                    handler: function() {                    
                        this.me.doExport(false, this.format);
                    },
                    scope: {
                        me: this,
                        format: format
                    }
                }]
            }
        };
    },

    /** api: method[doExport]
     */    
    doExport: function(single, outputFormat){
    
        var featureManager = this.target.tools[this.featureManager];
        var grid = this.output[0];
        var protocol = grid.getStore().proxy.protocol;
        var allPage = {};
        
        allPage.extent = featureManager.getPagingExtent("getMaxExtent");
        //IF WFS_PAGING create filter with fid id
       if (featureManager.pagingType === gxp.plugins.FeatureManager.WFS_PAGING) {
           var fidsA=[];
           featureManager.featureStore.each(function(r){
               fidsA.push(r.get("fid"));
           });
            var filter= new OpenLayers.Filter.FeatureId({fids: fidsA});
           }
       else{
         var filter = featureManager.setPageFilter(single ? featureManager.page : allPage);
        
        }
        
        var node = new OpenLayers.Format.Filter({
            version: protocol.version,
            srsName: protocol.srsName
        }).write(filter);
        
        this.xml = new OpenLayers.Format.XML().write(node);
        
        var colModel = grid.getColumnModel();
        //get all columns and see if they are visible
        var numColumns = colModel.getColumnCount(false);
        var propertyName = [];
        
        for (var i=0; i<numColumns; i++){
            var header = colModel.getColumnHeader(i) ;
            if( header && header != "" && !colModel.isHidden(i)){
                 var fieldName= colModel.getDataIndex(i);
                propertyName.push(fieldName);
            }
        }   
        var failedExport = String.format(this.failedExport, outputFormat);
        
        // Url generation
        var url =  protocol.url;
        var propertyNamesString = "";
        if(this.exportFormatsConfig[outputFormat]){
            // Read specific xonfiguration for the output format
            if(this.exportFormatsConfig[outputFormat].addGeometry){
                propertyName.push(featureManager.featureStore.geometryName);
            }
            if(!this.exportFormatsConfig[outputFormat].exportAll){
                propertyNamesString += "propertyName=" + propertyName.join(',') + "&";
            }
        }else{
            propertyNamesString += "propertyName=" + propertyName.join(',') + "&";
        }
        //get the name space
        var prefix = featureManager.layerRecord.get("prefix");
        var namespace = (prefix && prefix !="")  ?  featureManager.layerRecord.get("prefix") + ":" : "";
        url += "service=WFS" +
                (this.filterPropertyNames ? "&" + propertyNamesString : "") +
                (featureManager.featureStore.viewparams ? "&VIEWPARAMS=" + featureManager.featureStore.viewparams : "") +
                (featureManager.featureStore.cql_filter ? "&VIEWPARAMS=" + featureManager.featureStore.cql_filter : "") +
                "&version=" + protocol.version +
                "&request=GetFeature" +
                "&typeName=" + namespace + protocol.featureType +
                "&exceptions=application/json" +
                "&outputFormat="+ outputFormat;
        this.url =  url;

        if(this.exportDoubleCheck){
            //show mask
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
            myMask.show();
            OpenLayers.Request.POST({
                //add the maxFeatures attribute if present to the test request
                url: this.url + (this.exportCheckLimit ? "&maxFeatures=" + this.exportCheckLimit :"") ,
                data: this.xml,
                callback: function(request) {
                    myMask.hide();
                    if(request.status == 200){
                    
                        try
                          {
                                var serverError = Ext.util.JSON.decode(request.responseText);
                                Ext.Msg.show({
                                    title: "Error",
                                    msg: "outputFormat: " + outputFormat + "</br></br>" +
                                         failedExport + "</br></br>" +
                                         "Error: " + serverError.exceptions[0].text,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                });                        
                          }
                        catch(err)
                          {
                            // submit filter in a standard form (before check)
                            this.doDownloadPost(this.url, this.xml,outputFormat);
                          }
                          
                    }else{
                        Ext.Msg.show({
                            title: failedExport,
                            msg: request.statusText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                scope: this
            });   
        }else{
            // submit filter in a standard form to skip double check
            this.doDownloadPost(this.url, this.xml,outputFormat);
        }     

    },

    /** api: method[doDownloadPost]
     * create a dummy iframe and a form. Submit the form 
     */    
     
    doDownloadPost: function(url, data,outputFormat){
        //        
        //delete other iframes appended
        //
        if(document.getElementById(this.downloadFormId)) {
            document.body.removeChild(document.getElementById(this.downloadFormId)); 
        }
        if(document.getElementById(this.downloadIframeId)) {
            document.body.removeChild(document.getElementById(this.downloadIframeId));
        }
        // create iframe
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style","visiblity:hidden;width:0px;height:0px;");
        this.downloadIframeId = Ext.id();
        iframe.setAttribute("id",this.downloadIframeId);
        iframe.setAttribute("name",this.downloadIframeId);
        document.body.appendChild(iframe);
        iframe.onload = function(){
            if(!iframe.contentWindow) return;
            
            var error ="";
            var body = iframe.contentWindow.document.getElementsByTagName('body')[0];
            var content ="";
            if (body.textContent){
              content = body.textContent;
            }else{
              content = body.innerText;
            }
            try{
                var serverError = Ext.util.JSON.decode(content);
                error = serverError.exceptions[0].text
            }catch(err){
                error = body.innerHTML || content;
            }
             Ext.Msg.show({
                title: me.invalidParameterValueErrorText,
                msg: "outputFormat: " + outputFormat + "</br></br>" +
                      "</br></br>" +
                     "Error: " + error,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });   
        }
        var me = this;
        
        // submit form with enctype = application/xml
        var form = document.createElement("form");
        this.downloadFormId = Ext.id();
        form.setAttribute("id", this.downloadFormId);
        form.setAttribute("method", "POST");
        //this is to skip cross domain exception notifying the response body
        var urlregex =/^https?:\/\//i;
        //if absoulte url and do not contain the local host
        var iframeURL = (!urlregex.test(url) || url.indexOf(location.host)>0) ? url :  proxy + encodeURIComponent(url);
        form.setAttribute("action", iframeURL );
        form.setAttribute("target",this.downloadIframeId);
        
        var hiddenField = document.createElement("input");      
        hiddenField.setAttribute("name", "filter");
        hiddenField.value= data;
        form.appendChild(hiddenField);
        document.body.appendChild(form);
        form.submit(); 
    } ,
    /** api: method[getCustomActions]
     * find the custom actions if a customActionsProvider option is defined.
     * The provider is a plugin that have a method getCustomActions
     */       
    getCustomActions: function(){
        if(this.customActionsProvider && this.target.tools[this.customActionsProvider] && this.target.tools[this.customActionsProvider].getCustomActions){
            return this.target.tools[this.customActionsProvider].getCustomActions();
        } else return []
    }
    /** api: method[doDownloadPost]
     */   
/*     
    doDownloadPost: function(url, data){
        //        
        //delete other iframes appended
        //
        if(document.getElementById(this.downloadFormId)) {
            document.body.removeChild(document.getElementById(this.downloadFormId)); 
        }
        // submit form with filter
        var form = document.createElement("form");
        form.setAttribute("id", this.downloadFormId);
        form.setAttribute("method", "POST");
        form.setAttribute("action", url);
        var hiddenField = document.createElement("input");      
        hiddenField.setAttribute("name", "filter");
        hiddenField.setAttribute("value", data);
        form.appendChild(hiddenField);
        document.body.appendChild(form);
        form.submit(); 
    }
    */
});

Ext.preg(gxp.plugins.he.ResultsGrid .prototype.ptype, gxp.plugins.he.ResultsGrid);
