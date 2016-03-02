/**
* Copyright (c) 2014-2016 Geo-Solutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * requires plugins/ClickableFeatures.js
 * include widgets/grid/FeatureGrid.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureGrid
 */

/** api: (extends)
 *  plugins/ClickableFeatures.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */
gxp.plugins.GcSegGrid = Ext.extend(gxp.plugins.ClickableFeatures, {

    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_gcseggrid",

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

    /** api: config[comboFormatTpl]
     *  ``String`` Tpl for the export combo in the export window.
     */
    comboFormatTpl: "<tpl for=\".\"><div class=\"x-combo-list-item gxp-icon-featuregrid-export {iconCls}\">{name}</div></tpl>",

    editButtonText: "Edit",

    deleteButtonText: "Delete",

    //Strings
    btnDetailsIconCls: "gc-icon-notice",
    btnDetailsText:  "Notice Details",
    btnDetailsTooltip: "Show Notice Details",
    btnMapIconCls: "gc-icon-map",
    btnMapText:  "Map",
    btnMapTooltip: "Show Map",
    noticeDetailsPanelTitle:"Notice Details",
    photoBrowserPanelTitle:"Surveys Images",
    noticePhotoBrowserPanelTitle:"Notice Images",
    surveysPanelTitle:"Surveys",
    noticePanelTitle:"Notice",
    /** api: config[displayFeatureText]
     * ``String``
     * Text for feature display button (i18n).
     */
    displayFeatureText: "Display on map",

    /** api: config[displayExportCSVText]
     * ``String``
     * Text for CSV Export buttons (i18n).
     */
    displayExportCSVText: "Export to CSV",

    /** api: config[displayExportText]
     * ``String``
     * Text for Export buttons (i18n).
     */
    displayExportText: "Export to {0}",

    /** api: config[exportCSVSingleText]
     * ``String``
     * Text for CSV Export Single Page button (i18n).
     */
    exportCSVSingleText: "Single Page",

    /** api: config[exportCSVMultipleText]
     * ``String``
     * Text for CSV Export Multiple Pages button (i18n).
     */
    exportCSVMultipleText: "Whole Page",

    /** api: config[failedExportCSV]
     * ``String``
     * Text for CSV Export error (i18n).
     */
    failedExportCSV: "Failed to find response for output format CSV",

    /** api: config[failedExport]
     * ``String``
     * Text for Export error (i18n).
     */
    failedExport: "Failed to find response for output format {0}",

    /** api: config[nvalidParameterValueErrorText]
     * ``String``
     * Text for CSV Export error (i18n).
     */
    invalidParameterValueErrorText: "Invalid Parameter Value",

    /** api: config[zoomFirstPageTip]
     *  ``String``
     *  Tooltip string for first page action (i18n).
     */
    firstPageTip: "First page",

    /** api: config[previousPageTip]
     *  ``String``
     *  Tooltip string for previous page action (i18n).
     */
    previousPageTip: "Previous page",

    /** api: config[zoomFirstPageTip]
     *  ``String``
     *  Tooltip string for zoom to page extent action (i18n).
     */
    zoomPageExtentTip: "Zoom to page extent",

    /** api: config[nextPageTip]
     *  ``String``
     *  Tooltip string for next page action (i18n).
     */
    nextPageTip: "Next page",

    /** api: config[lastPageTip]
     *  ``String``
     *  Tooltip string for last page action (i18n).
     */
    lastPageTip: "Last page",

    /** api: config[totalMsg]
     *  ``String``
     *  String template for showing total number of records (i18n).
     */
    totalMsg: "Total: {0} records",

    /** api: config[comboFormatMethodLabel]
     *  ``String``
     *  String for the export format label (i18n).
     */
    comboFormatMethodLabel: "Format",

    /** api: config[comboFormatEmptyText]
     *  ``String``
     *  String for the export format empty combo (i18n).
     */
    comboFormatEmptyText: "Please, select format",

    /** api: config[noFormatTitleText]
     *  ``String``
     *  SString for the unselected format title (i18n).
     */
    noFormatTitleText: "Incorrect format",

    /** api: config[noFormatBodyText]
     *  ``String``
     *  String for the unselected format body (i18n).
     */
    noFormatBodyText: "Please, select a valid format",

    /** api: config[exportTitleText]
     *  ``String``
     *  String for the Export button i18n).
     */
    exportTitleText: "Export",

    /** api: config[title]
     *  ``String``
     *  Feature Grid title.
     */
    title: "Features",

    /** api: config[defaultComboFormatValue]
     *  ``String``
     *  Default output format selection for export. Default is 'CSV'
     */
    defaultComboFormatValue: "CSV",

    /** api: config[zoomToFeature]
     *  ``String``
     */
    zoomToFeature: "Zoom To Feature",

    fKey:"",//chiave esterna per caricare tabelle history e sopralluoghi

    /** api: config[exportDoubleCheck]
     *  ``Boolean``
     *  Do check on feature grid export (one to show a possible error and another one to download the file)
     */
     exportDoubleCheck: true,

    /** api: config[exportCheckLimit]
     *  ``integer``
     *  if present, limit the number of feature to query for the first check
     */
    exportCheckLimit: null,

    /** api: config[pageLabel]
     *  ``String``
     */
    pageLabel: "Page",

    /** api: config[pageOfLabel]
     *  ``String``
     */
    pageOfLabel: "of",

    /** api: config[totalRecordsLabel]
     *  ``String``
     */
    totalRecordsLabel: "Total Records",
    filterPropertyNames: true,

    /**
     * PLUpload config
     */
    pluploadWindowWidth: 400,
    pluploadWindowHeigth: 300,
    pluploadWindowResizable: false,
    pluploadMultipart: true,
    
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
    init:function(targt)
    {
        gxp.plugins.FeatureManager.superclass.init.apply(this, arguments);
        //TODO RIMUOVERE E METTERE IN CONFIGURAZIONE
        // /////////////////////////////////////////////////////
        // Get the user's corrensponding authkey if present
        // (see MSMLogin.getLoginInformation for more details)
        // /////////////////////////////////////////////////////
        if(this.authParam && sessionStorage.userDetails){
            var userInfo = Ext.decode(sessionStorage.userDetails);
            var authkey;
            if(userInfo.user.attribute instanceof Array){
                for(var i = 0 ; i < userInfo.user.attribute.length ; i++ ){
                    if( userInfo.user.attribute[i].name == "UUID" ){
                        authkey = userInfo.user.attribute[i].value;
                    }
                }
            }else{
                if(userInfo.user.attribute && userInfo.user.attribute.name == "UUID"){
                   authkey = userInfo.user.attribute.value;
                }
            }
            if(authkey){
                this.authkey=authkey;
            }
        }
    },
    /**
     * private method[createPhotoBrowser]
     * Create e DataView that loads surveys photos
     * return Ext.DataView();
     */
    createPhotoBrowser:function(){

        var photoBrowserDataView= new Ext.DataView({
            itemSelector: 'div.thumb-wrap',
            style:'overflow:auto',
            ref:'picview',
            multiSelect: true,
            title:'Pictures',
            authParam:this.authParam,
            authKey:this.authkey,
            //ref:'../../../phBrowser',
            picturesBrowserConfig:this.configSurvey.picturesBrowserConfig,
            store: new Ext.data.JsonStore({
                    url: "http://geosolution.it",
                    autoLoad: false,
                    root: 'data',
                    id:'name',
                    fields:[
                        'name', 'web_path','mtime','size',
                        {name: 'shortName', mapping: 'name'}
                    ],
                    listeners:{
                        load:function (store,records,req){
                            if(records.length <= 0 ){
                                if(photoBrowserDataView.ownerCt.isVisible()){
                                    photoBrowserDataView.ownerCt.ownerCt.layout.setActiveItem(0);
                                }
                                photoBrowserDataView.ownerCt.disable();
                            }else{
                                photoBrowserDataView.ownerCt.enable();
                            }
                        }
                    }
                }),
            loadPhotos:function(r){
                if(r == null){
                    photoBrowserDataView.ownerCt.disable();
                    return;
                }
                var ds=this.getStore();
                var url=this.picturesBrowserConfig.baseUrl
                        +'?action=get_filelist&folder='
                        +this.picturesBrowserConfig.folder
                        +r.data[this.picturesBrowserConfig.featureProperty]+"/"+r.data.fid;
                if(this.authKey){
                    url+="&"+this.authParam+"="+this.authKey;
                }
                ds.proxy.setUrl(url,true);
                ds.load();
            },

            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img height="100px" width="100px" src="'+this.configSurvey.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}" class="thumb-img"></div>',
                '<span></span></div>',
                '</tpl>'
            ),
            listeners:{
                dblclick:function (scope, index, node, e){
                    window.open(node.getElementsByTagName("img")[0].src);
                }
            }
        });

        return photoBrowserDataView;

    },

        /**
     * private method[createGridPhotoBrowser]
     * Create e DataView that loads surveys photos
     * return Ext.DataView();
     */
    createGridPhotoBrowser:function(){

        /**
         * universal show error function
         * @private
         * @param {String} msg message
         * @param {String} title title
         */
        var showError = function(msg, title) {
            Ext.Msg.show({
                 title: title || "Error"
                ,msg:Ext.util.Format.ellipsis(msg, 2000)
                ,fixCursor:true
                ,icon:Ext.Msg.ERROR
                ,buttons:Ext.Msg.OK
                ,minWidth:1200 > String(msg).length ? 360 : 600
            });
        };
    
        /**
         * runs after an Ajax requested command has completed/failed
         * @private
         * @param {Object} options Options used for the request
         * @param {Boolean} success true if ajax call was successful (cmd may have failed)
         * @param {Object} response ajax call response object
         */
        var cmdCallback = function(options, success, response) {
            var i, o, node;
            var showMsg = true;

            // process Ajax success
            if(true === success) {

                // try to decode JSON response
                try {
                    o = Ext.decode(response.responseText);
                }
                catch(ex) {
                    showError(response.responseText);
                }

                // process command success
                if(true === o.success) {
                    switch(options.params.action) {
                        case 'file_delete':
                        case 'file_rename':
                            photoBrowserDataView.reload();
                        break;
                    }
                }
                // process command failure
                else {
                    // show default message box with server error
                    showError(o.msg || response.responseText);
                }
            }
            // process Ajax failure
            else {
                this.showError(o && o.msg || "Error sending request to server");
            }
        };
        
        var expander = new Ext.ux.grid.RowExpander({
            
            // The RowExpander will apply record.data to this XTemplate
            // In this context: values=record.data
            tpl : new Ext.XTemplate(
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><a target="_blank" href="'+this.configSurvey.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}">',
                '<img height="100px" width="100px" src="'+this.configSurvey.picturesBrowserConfig.baseUrl+'?action=get_image&file={web_path}" class="thumb-img"></div>',
                '</a><span></span></div>',
                '<table class="x-btn x-btn-text-icon" align="right" cellspacing="5" cellpadding="5" border="0" style="table-layout:auto">',
                    '<tr>',
                    '<td >'+
                        '<tpl>'+
                            '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonId(values,\'_downloadBtn\')]}\'>' +
                            '<tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>' +
                            '<tr><td class="x-btn-ml"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-mc"><em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;" class=" x-btn-text icon-open-download" title="Download" ></button>'+
                            '</em></td><td class="x-btn-mr"><i>&nbsp;</i></td>' +
                            '</tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>' +
                            '</tbody>' +
                            '</table>' +
                        '</tpl>'+
                    '</td>',
                    '<td >'+
                        '<tpl>'+
                            '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonId(values,\'_renameBtn\')]}\'>' +
                            '<tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>' +
                            '<tr><td class="x-btn-ml"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-mc"><em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;" class=" x-btn-text icon-pencil" title="Rename" ></button>'+
                            '</em></td><td class="x-btn-mr"><i>&nbsp;</i></td>' +
                            '</tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>' +
                            '</tbody>' +
                            '</table>' +
                        '</tpl>'+
                    '</td>',
                    '<td >'+
                        '<tpl>'+
                            '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonId(values,\'_deleteBtn\')]}\'>' +
                            '<tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>' +
                            '<tr><td class="x-btn-ml"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-mc"><em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;" class=" x-btn-text icon-cross" title="Delete" ></button>'+
                            '</em></td><td class="x-btn-mr"><i>&nbsp;</i></td>' +
                            '</tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>' +
                            '</tbody>' +
                            '</table>' +
                        '</tpl>'+
                    '</td>',
                    '</tr>'+
                '</table>',
                {
                    getButtonId: function(values, buttonRef) {
                        var result = Ext.id() + buttonRef;
                        
                        // Add listener based on reference
                        switch(buttonRef){
                            case '_downloadBtn':
                                // defer() ensures the getButtonId() result has been consumed
                                this.defererUtil.defer(
                                    1,  
                                    this, // scope
                                    [  // Arguments
                                        result, // Button ID
                                        {
                                            values:values,
                                            baseUrl:photoBrowserDataView.picturesBrowserConfig.baseUrl
                                        },
                                        this.downloadItem  // clickListener
                                    ]);
                                break;
                            case '_renameBtn':
                                // defer() ensures the getButtonId() result has been consumed
                                this.defererUtil.defer(
                                    1,  
                                    this, // scope
                                    [  // Arguments
                                        result, // Button ID
                                        {
                                            values:values,
                                            baseUrl:photoBrowserDataView.picturesBrowserConfig.baseUrl
                                        },
                                        this.renameItem  // clickListener
                                    ]);
                                break;
                            case '_deleteBtn':
                                // defer() ensures the getButtonId() result has been consumed
                                this.defererUtil.defer(
                                    1,  
                                    this, // scope
                                    [  // Arguments
                                        result, // Button ID
                                        {
                                            values:values,
                                            baseUrl:photoBrowserDataView.picturesBrowserConfig.baseUrl
                                        },
                                        this.deleteItem  // clickListener
                                    ]);
                                break;
                            default:
                                break;
                        }

                        return result;
                    },
                    defererUtil: function(id, args, listenerFunc){
                        // Here we use the "options" object to pass listener arguments
                        Ext.get(id).on('click', listenerFunc, this, args);
                    },
                    downloadItem:function(event, target, args) {
                        var filepath = args.baseUrl + "?action=file_download&file=" + args.values.web_path;
                        window.open(filepath);
                    },
                    renameItem:function(event, target, args) {
                        
                        var onEditComplete = function(btnId, newName) {
                            
                            var path = args.values.web_path.substring(0,args.values.web_path.lastIndexOf("/")+1);
                            
                            var options = {
                                 url: args.baseUrl
                                ,method: 'POST'
                                ,scope: this
                                ,callback: cmdCallback
                                ,params:{
                                     action: 'file_rename'
                                    ,oldName: args.values.web_path
                                    ,name: path + '/' + newName
                                }
                            };

                            Ext.Ajax.request(options);
                        }
                        
                        Ext.MessageBox.prompt("Rename", "Insert the new filename", onEditComplete, this, false, args.values.shortName);

                    },
                    deleteItem:function(event, target, args) {
                        
                        Ext.Msg.show({
                            title: "Delete"
                            ,msg: "Do you really want to" + ' ' + "delete"  + ' <b>' + args.values.shortName + '</b>?'
                            ,icon:Ext.Msg.WARNING
                            ,buttons:Ext.Msg.YESNO
                            ,scope:this
                            ,fn:function(response) {
                                // do nothing if answer is not yes
                                if('yes' !== response) {
                                    return;
                                }
                                // setup request options
                                var options = {
                                     url: args.baseUrl
                                    ,method: 'POST'
                                    ,scope:this
                                    ,callback: cmdCallback
                                    ,params:{
                                         action: 'file_delete'
                                        ,file: args.values.web_path
                                    }
                                };
                                Ext.Ajax.request(options);
                            }
                        });
                    }
                }
            )
        });
        
        var photoUploadUrl = this.uploadUrl ? this.uploadUrl: // the upload URL is configured in the plugin
            localConfig.adminUrl ? localConfig.adminUrl + "mvc/fileManager/upload" : // use relative path from adminUrl
            "/opensdi2-manager/mvc/fileManager/upload"; // by default search on root opensdi-manager2
            
        var photoBrowserDataView = new Ext.ux.GridBrowser({
            style:'overflow:auto',
            ref:'picview',
            multiSelect: true,
            autoHeight: true,
            authParam:this.authParam,
            authKey:this.authkey,
            picturesBrowserConfig:this.configSurvey.picturesBrowserConfig,
            rowExpander: expander,
            store: new Ext.data.JsonStore({
                    url: "http://geosolution.it",
                    autoLoad: false,
                    root: 'data',
                    id:'name',
                    fields:[
                        'name', 'web_path','mtime','size','leaf',
                        {name: 'shortName', mapping: 'name'},
                        {name: 'text', mapping: 'name'}
                    ],
                    listeners:{
                        load:function (store,records,req){
                            if(records.length <= 0 ){
                                if(photoBrowserDataView.ownerCt.isVisible()){
                                    photoBrowserDataView.ownerCt.ownerCt.layout.setActiveItem(0);
                                }
                                photoBrowserDataView.ownerCt.disable();
                            }else{
                                photoBrowserDataView.ownerCt.enable();
                            }
                        }
                    }
            }),
            loadPhotos:function(r){
                if(r == null){
                    photoBrowserDataView.ownerCt.disable();
                    return;
                }
                var ds=this.getStore();
                photoBrowserDataView.currentFolder = this.picturesBrowserConfig.folder
                        +r.data[this.picturesBrowserConfig.featureProperty]+"/"+r.data.fid;
                var url=this.picturesBrowserConfig.baseUrl
                        + '?action=get_filelist&folder='
                        + photoBrowserDataView.currentFolder ;
                if(this.authKey){
                    url+="&"+this.authParam+"="+this.authKey;
                }
                ds.proxy.setUrl(url,true);
                ds.load();
            },
            reload:function(  ){
                if(photoBrowserDataView.currentFolder){
                    var ds=this.getStore();
                    var url=this.picturesBrowserConfig.baseUrl
                        + '?action=get_filelist&folder='
                        + photoBrowserDataView.currentFolder ;
                    if(this.authKey){
                        url+="&"+this.authParam+"="+this.authKey;
                    }
                    ds.proxy.setUrl(url,true);
                    ds.load();
                }
            },
            readOnly:true,
            ddGroup:null,
            tbar:{
                items: [
                    '->',
                    {
                        // xtype: 'button', // default for Toolbars, same as 'tbbutton'
                        text: 'Upload',
                        iconCls:'icon-upload',
                        scope: this,
                        handler: function(){

                            var pluploadPanel = new Ext.ux.PluploadPanel({
                                autoScroll:true,
                                layout:'fit',
                                url: photoUploadUrl,
                                multipart: true,
                                mediaContent: "./externals/mapmanager/theme/media",
                                currentFolder : this.currentFolder,
                                listeners:{
                                    beforestart:function() {  
                                        var multipart_params =  pluploadPanel.multipart_params || {};
                                        Ext.apply(multipart_params, {
                                            folder: photoBrowserDataView.currentFolder
                                        })
                                        pluploadPanel.multipart_params = multipart_params;
                                    },
                                    fileUploaded:function(file) {
                                        photoBrowserDataView.reload();
                                    },
                                    scope: this
                                }
                            });
                            var win = new Ext.Window({
                                title: this.uploadText,
                                width: this.pluploadWindowWidth,
                                height: this.pluploadWindowHeigth,
                                layout:'fit',
                                resizable: this.pluploadWindowResizable,
                                items: [pluploadPanel]
                            });
                            win.show();
                        }
                    }
                ]
            }
        });

        return photoBrowserDataView;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];
        var map = this.target.mapPanel.map, smCfg;
        var mapPanelContainer= this.target.mapPanelContainer;
        var target=this.target;
        var bParams={};
        if(this.authkey){
            bParams[this.authParam] = this.authkey;
        }
        //Creo il pannello che carica i dettagli segnalazione!!
        if(this.configSurvey.picturesBrowserConfig){
            var photoBrowser=this.createGridPhotoBrowser();
        }
        if(this.configHistory.picturesBrowserConfig){
            var photoBrowserNotice=this.createPhotoBrowser();
        }

        this.segdet=
        new Ext.Panel({
            title:this.noticeDetailsPanelTitle,
            target: this.target,
            westVisible:false,
            layout:'border',
            fKey:this.fKey,
            ref:'noticeDetailsPanel',
            // autoScroll: true,
            // align : "stretch",
            // pack  : 'start',
            items:[{
                xtype:"panel",
                region:'west',
                ref:'seg',
                width:300,
                split: true, // enable resizing
                items:[],
                border:'true',
                layout:'fit'
            },{
                xtype:"tabpanel",
                region:'center',
                ref:'centerPanel',
                activeItem:0,
                height:500,
                items:[{
                    xtype:'panel',
                    layout:'accordion',
                    title:this.noticePanelTitle,
                    ref:'noticeAccordion',
                    items:[
                        Ext.apply(
                            {
                                xtype:"gxp_gchistorygrid",
                                ref:'../../seg_history',
                                mapPanel:this.target.mapPanel,
                                baseParams:bParams
                            },
                            this.initialConfig.configHistory||{}
                        ),{
                            title:this.noticePhotoBrowserPanelTitle,
                            disabled:true,
                            ref:'noticePhotoBrowser',
                            hidden:(!photoBrowserNotice),
                            items:[photoBrowserNotice||{}]
                        }
                    ]
                },{
                    xtype:'panel',
                    layout:'accordion',
                    title:this.surveysPanelTitle,
                    ref:'surveyAccordion',
                    items: [
                        Ext.apply(
                            {
                                xtype:"gxp_gcsopgrid",
                                target:this.target,
                                baseParams:bParams,
                                authParam:this.authParam,
                                authKey:this.authkey,
                                wfsURL: "http://geocollect.geo-solutions.it/geoserver/it.geosolutions/ows",
                                typeName: "rilevamenti_effettuati",
                                ref:"../../sop",
                                listeners:{
                                    'sopselected': photoBrowser.loadPhotos,
                                    scope: photoBrowser
                                }
                            },
                            this.initialConfig.configSurvey||{}
                        ),{
                            title:this.photoBrowserPanelTitle,
                            disabled:true,
                            ref:'surveyPhotoBrowser',
                            hidden:(!photoBrowser),
                            items:[photoBrowser||{}],
                        }
                    ]
                }]
            }],
            listeners: {
                beforeadd: function(record) {
                    return record.get("group") !== "background";
                },
                pluginready: function(istance) {}
            },
            showMe:function(record){
                if(!this.target.mapPanelContainer.items.get(2).isVisible()){
                    this.target.toolbar.hide();
                    //Se visibile cambi solo i dati delle tabelle altrimetni lo attivi
                    var west = Ext.getCmp('west');
                    //Nascondo west se è aperto
                    if(west.isVisible()) {
                        west.collapse();
                        this.westVisible=true;
                    }else{
                        this.westVisible=false;
                    }
                    //Attivo il pannello
                    this.target.mapPanelContainer.layout.setActiveItem(2);
                }
                if(record){
                    this.seg_history.loadHistory(record.data[this.fKey]);
                    this.sop.loadSop(record.data[this.fKey]);
                    if(photoBrowserNotice){
                        photoBrowserNotice.loadPhotos(record);
                    }
                    if(photoBrowser){
                        // Reset Survey Photos tab
                        photoBrowser.loadPhotos();
                    }
                    // Check if the accordion has been instantiated
                    if(this.sop.ownerCt.surveyPhotoBrowser.ownerCt.layout.setActiveItem){
                        this.sop.ownerCt.surveyPhotoBrowser.ownerCt.layout.setActiveItem(0);
                    }
                    this.doLayout();
                }
            },
            hideMe:function(){
                this.target.toolbar.show();
                if(this.westVisible){
                    var west = Ext.getCmp('west');
                    west.expand();
                }
                //Attivi mappa
                this.target.mapPanelContainer.layout.setActiveItem(0);
            }
        });
        //Aggingo al panello mappa
        mapPanelContainer.add(this.segdet);

        // a minimal SelectFeature control - used just to provide select and
        // unselect, won't be added to the map unless selectOnMap is true
        this.selectControl = new OpenLayers.Control.SelectFeature(featureManager.featureLayer);
        if (this.selectOnMap) {
             if (featureManager.paging) {
                this.selectControl.events.on({
                    "activate": function() {
                        map.events.register(
                            "click", this, this.noFeatureClick
                        );
                    },
                    "deactivate": function() {
                        map.events.unregister(
                            "click", this, this.noFeatureClick
                        );
                    },
                    scope: this
                });
            }
            map.addControl(this.selectControl);
            smCfg = {
                selectControl: this.selectControl
            };
        } else {
            smCfg = {
                selectControl: this.selectControl,
                singleSelect: true,
                autoActivateControl: false,
                listeners: {
                    "beforerowselect": function(sm, rowIndex, keepExisting, record ) {
                        //While editing, the selection model il locked
                    },
                    "rowselect": function(r) {
                        //Abilito i bottoni!
                        this.enableTools();
                        featureManager.showLayer(
                            featureManager.layer.id,
                            "selected"
                        );
                    },
                    "rowdeselect": function() {
                        //Abilito i bottoni!
                        this.disableTools();
                    },
                    scope: this
                }
            };
        }
        this.displayItem = new Ext.Toolbar.TextItem({});
        var toolbarElements = [];
        toolbarElements.push(
            {
                iconCls: "x-tbar-page-first",
                ref: "../firstPageButton",
                tooltip: this.firstPageTip,
                disabled: true,
                handler: function() {
                    featureManager.setPage({index: 0});
                }
            }, {
                iconCls: "x-tbar-page-prev",
                ref: "../prevPageButton",
                tooltip: this.previousPageTip,
                disabled: true,
                handler: function() {
                    featureManager.previousPage();
                }
            }
        );

        if(featureManager.pagingType == 1){
            toolbarElements.push(
                '-'
                ,{
                    xtype: 'compositefield',
                    width: 120,
                    items: [{
                            xtype: 'label',
                            text: this.pageLabel,
                            autoWidth: true,
                            style: {
                                marginTop: '3px'
                            }
                        },{
                            ref: "../../currentPage",
                            xtype: "textfield",
                            width: 40,
                            value: "0",
                            disabled: true,
                            enableKeyEvents: true,
                            listeners:{
                                scope: this,
                                keypress: function(field, e){
                                    var charCode = e.getCharCode();
                                    if(charCode == 13){
                                        var value = field.getValue();
                                        featureManager.setPage({index: value - 1});
                                    }
                                }
                            }
                        },{
                            xtype: 'label',
                            width: 15,
                            text: this.pageOfLabel,
                            style: {
                                marginTop: '3px'
                            }
                        },{
                            xtype: 'label',
                            ref: "../../numberOfPagesLabel",
                            width: 20,
                            text: '0',
                            style: {
                                marginTop: '3px'
                            }
                    }]
                }
            );

            if(this.showNumberOfRecords === true){
                toolbarElements.push(
                    /*{
                        xtype: 'compositefield',
                        width: 120,
                        items: [*/{
                                xtype: 'label',
                                text: "{" + this.totalRecordsLabel + " - ",
                                autoWidth: true,
                                style: {
                                    marginTop: '3px'
                                }
                            }, {
                                xtype: 'label',
                                ref: "../totalRecords",
                                width: 20,
                                text: "0}",
                                style: {
                                    marginTop: '3px'
                                }
                            }
                        /*]
                    }*/
                );
            }
        }

        toolbarElements.push(
            '-',
            {
                iconCls: "gxp-icon-zoom-to",
                ref: "../zoomToPageButton",
                tooltip: this.zoomPageExtentTip,
                disabled: true,
                hidden: featureManager.autoZoomPage,
                handler: function() {
                    map.zoomToExtent(featureManager.getPageExtent());
                }
            },
            '-'
            , {
                iconCls: "x-tbar-page-next",
                ref: "../nextPageButton",
                tooltip: this.nextPageTip,
                disabled: true,
                handler: function() {
                    featureManager.nextPage();
                }
            }, {
                iconCls: "x-tbar-page-last",
                ref: "../lastPageButton",
                tooltip: this.lastPageTip,
                disabled: true,
                handler: function() {
                    featureManager.setPage({index: "last"});
                }
            }, {
                xtype: 'tbspacer',
                width: 10
            },
            this.displayItem
        );

        var bbar = (featureManager.paging ? [toolbarElements] : []).concat(["->"].concat(!this.alwaysDisplayOnMap ? [{
               /*text: this.displayFeatureText,
                id: "showButton",
                hidden:true,
                iconCls: "gxp-icon-addtomap",
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    this.selectOnMap && this.selectControl[pressed ? "activate" : "deactivate"]();
                    featureManager[pressed ? "showLayer" : "hideLayer"](this.id, this.displayMode);
                },
                scope: this
            */}] : [])).concat(["->"]);

        // Export formats
        if(this.exportFormats){
            if(this.exportAction == 'window'){
                bbar.push(this.getExportWindowButton());
            }else{
                var appendedCSVExporter = false;
                for (var i = 0; i < this.exportFormats.length; i++){
                    var format = this.exportFormats[i];
                    // Retrocompatibilty
                    if(format == "CSV"){
                        appendedCSVExporter = true;
                    }
                    bbar.push(this.getExportButton(format));
                }
                // Retrocompatibilty
                if(!appendedCSVExporter && this.showExportCSV){
                    bbar.push(this.getExportButton("CSV"));
                }
            }
        }else{
            // Retrocompatibilty
            if(this.showExportCSV){
                bbar.push(this.getExportButton("CSV"));
            }
        }

        config = Ext.apply({
            xtype: "gxp_gcfeaturegrid",
            viewConfig: {forceFit: true},
            actionTooltip: null,
            colConfig:this.colConfig,
            map: this.target.mapPanel.map,
            sm: new GeoExt.grid.FeatureSelectionModel(smCfg),
            autoScroll: true,
            title: this.title,
            segDetPanel:this.segdet,
            bbar: bbar,
            tbar:[{
                xtype:'buttongroup',
                ref:'/zommInfo',
                disabled:true,
                items:[{
                    ref:'/../toggleInfo',
                    disabled:false,
                    width:100,
                    iconCls:this.btnDetailsIconCls ,
                    text:this.btnDetailsText  ,
                    tooltip: this.btnDetailsTooltip ,
                    enableToggle: true,
                    toggleHandler: function(btn, pressed) {
                        this.showInfo=(pressed)? true:false;
                        if(!pressed){
                            this.segdet.hideMe();
                            btn.setIconClass(this.btnDetailsIconCls);
                            btn.setText(this.btnDetailsText);
                            btn.setTooltip(this.btnDetailsTooltip);
                        }else{
                              this.segdet.showMe(this.output[0].selModel.getSelected());
                              btn.setIconClass(this.btnMapIconCls);
                              btn.setText(this.btnMapText);
                              btn.setTooltip(this.btnMapTooltip);
                        }
                        if(!this.segEditing){
                            (pressed)?this.segGrid.getTopToolbar().items.first().disable() : this.segGrid.getTopToolbar().items.first().enable();
                        }
                    },
                    scope:this
                },{
                    text: this.zoomToFeature,
                    ref:'/../zToF',
                    tooltip: this.zoomToFeature,
                    iconCls: 'gxp-icon-zoom-to',
                    scope: this,
                    handler: function(cmp){
                        if(this.segGrid.toggleInfo.pressed===true)this.segGrid.toggleInfo.toggle(false);
                        var selection = this.segGrid.getSelectionModel().getSelections()[0];
                        var feature = selection.data.feature;
                        if(feature){
                            var geom=feature.geometry;
                            this.target.mapPanel.map.setCenter(new OpenLayers.LonLat(geom.x,geom.y),15,false,true);
                        }
                    }
                }]
            },{
                xtype:'buttongroup',
                ref:'./fBtGroup',
                disabled:true,
                items:[{
                    width:60,
                    text: this.editButtonText,
                    iconCls: "edit"
                },{
                    text: this.deleteButtonText,
                    width:60,
                    iconCls: "delete"
                }]
            }],
            listeners: {
                "added": function(cmp, ownerCt) {
                    var onClear = OpenLayers.Function.bind(function() {
                        if(this.exportFormats){
                            if(this.exportAction == 'window'){
                                this.output[0]["exportButton"].disable();
                            }else{
                                for (var i = 0; i < this.exportFormats.length; i++){
                                    var format = this.exportFormats[i];
                                    this.output[0]["export" + format + "Button"].disable();
                                }
                            }
                        }else if(this.showExportCSV){
                            this.output[0].exportCSVButton.disable();
                        }
                        this.displayTotalResults();
                        this.selectOnMap && this.selectControl.deactivate();
                        this.autoCollapse && typeof ownerCt.collapse == "function" &&
                            ownerCt.collapse();
                    }, this);
                    var onPopulate = OpenLayers.Function.bind(function() {
                        if(this.exportFormats){
                            if(this.exportAction == 'window'){
                                this.output[0]["exportButton"].enable();
                            }else{
                                for (var i = 0; i < this.exportFormats.length; i++){
                                    var format = this.exportFormats[i];
                                    this.output[0]["export" + format + "Button"].enable();
                                }
                            }
                        }else if(this.showExportCSV){
                            this.output[0].exportCSVButton.enable();
                        }
                        this.displayTotalResults();
                        this.selectOnMap && this.selectControl.activate();
                        this.autoExpand && typeof ownerCt.expand == "function" &&
                            ownerCt.expand();
                    }, this);
                    featureManager.on({
                        "query": function(tool, store) {
                            store && store.getCount() ? onPopulate() : onClear();
                        },
                        "layerchange": onClear,
                        "clearfeatures": onClear
                    });
                },
                scope: this
            },
        }, config || {});
        var featureGrid = gxp.plugins.GcSegGrid.superclass.addOutput.call(this, config);

        this.segGrid=featureGrid;
        // this.segGrid.getSelectionModel().lock();

        featureGrid.selModel.on(
            'rowselect',
            function(sm, rowIndex, r ){
                if(!r.data.feature.geometry){
                    this.segGrid.zToF.disable();
                } else if(this.segGrid.zToF.disabled){
                    this.segGrid.zToF.enable();
                }
                if(this.showInfo==true){
                    this.segdet.showMe(r);
                }
            },this);

        if (this.alwaysDisplayOnMap || this.selectOnMap) {
            featureManager.showLayer(this.id, this.displayMode);
        }

        // /////////////////////////////////////
        // FeatureManager events's listeners
        // /////////////////////////////////////
        var me = this;
        featureManager.paging && featureManager.on("setpage", function(mgr, condition, callback, scope, pageIndex, numPages) {
            this.disableTools();
            this.segGrid.toggleInfo.toggle(false);
            var paging = (mgr.page && (mgr.page.numFeatures > 0)) || numPages > 1;
            featureGrid.zoomToPageButton.setDisabled(!paging);
            var prev = (paging && (pageIndex !== 0));
            featureGrid.firstPageButton.setDisabled(!prev);
            featureGrid.prevPageButton.setDisabled(!prev);
            var next = (paging && (pageIndex !== numPages-1));
            featureGrid.lastPageButton.setDisabled(!next);
            featureGrid.nextPageButton.setDisabled(!next);

            if(featureManager.pagingType == 1){
                featureGrid.currentPage.enable();
                featureGrid.currentPage.setValue(featureManager.pageIndex + 1);
                featureGrid.numberOfPagesLabel.setText(featureManager.numPages);

                if(me.showNumberOfRecords === true){
                    featureGrid.totalRecords.setText(featureManager.numberOfFeatures + "}");
                }
            }
        }, this);

        featureManager.on("layerchange", function(mgr, rec, schema) {
            if(featureManager.pagingType == 1){
                featureGrid.currentPage.disable();
                featureGrid.currentPage.setValue("0");
                featureGrid.numberOfPagesLabel.setText("0");

                if(me.showNumberOfRecords === true){
                    featureGrid.totalRecords.setText("0}");
                }
            }

            //TODO use schema instead of store to configure the fields
            var ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);
            schema && schema.each(function(r) {
                r.get("type").indexOf("gml:") == 0 && ignoreFields.push(r.get("name"));
            });
            featureGrid.ignoreFields = ignoreFields;
            if(this.mainFields){
                featureGrid.mainFields = this.mainFields;
            }
            featureGrid.setStore(featureManager.featureStore, schema);
        }, this);

        featureManager.on("clearfeatures", function(mgr, rec, schema) {
            if(featureManager.pagingType == 1){
                featureGrid.currentPage.disable();
                featureGrid.currentPage.setValue("0");
                featureGrid.numberOfPagesLabel.setText("0");

                if(me.showNumberOfRecords === true){
                    featureGrid.totalRecords.setText("0}");
                }
            }
        }, this);

        return featureGrid;
    },

    enableTools: function(){
                       this.segGrid.zommInfo.enable();
                       var btns=this.segGrid.getTopToolbar().items.last();
                       if (btns!=this.segGrid.fBtnGroup){
                           btns.enable();
                       }
    },
    disableTools: function(){
         this.segGrid.zommInfo.disable();
         this.segGrid.getTopToolbar().items.last().disable();
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

        var filter = featureManager.setPageFilter(single ? featureManager.page : allPage);

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
                propertyName.push(header);
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
                        try {
                                var serverError = Ext.util.JSON.decode(request.responseText);
                                Ext.Msg.show({
                                    title: "Error",
                                    msg: "outputFormat: " + outputFormat + "</br></br>" +
                                         failedExport + "</br></br>" +
                                         "Error: " + serverError.exceptions[0].text,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                        } catch(err) {
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
            if(!iframe.contentWindow){
                return;
            }

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
                error = serverError.exceptions[0].text;
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
        };
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

Ext.preg(gxp.plugins.GcSegGrid.prototype.ptype, gxp.plugins.GcSegGrid);
