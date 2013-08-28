/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/ClickableFeatures.js
 * @include widgets/grid/FeatureGrid.js
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
gxp.plugins.FeatureGrid = Ext.extend(gxp.plugins.ClickableFeatures, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_featuregrid",

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
     */
    showExportCSV: false,    
    
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
    
    /** api: config[title]
     *  ``String``
     *  Feature Grid title.
     */
    title: "Features",

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
        var featureManager = this.target.tools[this.featureManager];
        var map = this.target.mapPanel.map, smCfg;
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
                singleSelect: false,
                autoActivateControl: false,
                listeners: {
                    "beforerowselect": function() {
                        if(this.selectControl.active || featureManager.featureStore.getModifiedRecords().length) {
                            return false;
                        }
                    },
                    scope: this
                }
            };
        }
        this.displayItem = new Ext.Toolbar.TextItem({});
        config = Ext.apply({
            xtype: "gxp_featuregrid",
            sm: new GeoExt.grid.FeatureSelectionModel(smCfg),
            autoScroll: true,
            title: this.title,
            bbar: (featureManager.paging ? [{
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
            }, {
                iconCls: "gxp-icon-zoom-to",
                ref: "../zoomToPageButton",
                tooltip: this.zoomPageExtentTip,
                disabled: true,
                hidden: featureManager.autoZoomPage,
                handler: function() {
                    map.zoomToExtent(featureManager.getPageExtent());
                }
            }, {
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
            }, {xtype: 'tbspacer', width: 10}, this.displayItem] : []).concat(["->"].concat(!this.alwaysDisplayOnMap ? [{
                text: this.displayFeatureText,
				iconCls: "gxp-icon-addtomap",
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    this.selectOnMap && this.selectControl[pressed ? "activate" : "deactivate"]();
                    featureManager[pressed ? "showLayer" : "hideLayer"](this.id, this.displayMode);
                },
                scope: this
            }] : [])).concat(["->"].concat(this.showExportCSV ? [{
                text: this.displayExportCSVText,
                xtype: 'button',
                disabled: true,
                iconCls: "gxp-icon-csvexport",
                ref: "../exportCSVButton",
                menu:{
                    xtype: "menu",
                    showSeparator: true, 
                    items: [{
                        iconCls: "gxp-icon-csvexport-single",
                        text: this.exportCSVSingleText,
                        handler: function() {                    
                            this.csvExport(true);
                        },
                        scope: this
                    },{
                        iconCls: "gxp-icon-csvexport-multiple",
                        text: this.exportCSVMultipleText,
                        handler: function() {                    
                            this.csvExport(false);
                        },
                        scope: this
                    }]
                }
            }] : [])),
            listeners: {
                "added": function(cmp, ownerCt) {
                    var onClear = OpenLayers.Function.bind(function() {
                        this.showExportCSV ? this.output[0].exportCSVButton.disable() : {};
                        this.displayTotalResults();
                        this.selectOnMap && this.selectControl.deactivate();
                        this.autoCollapse && typeof ownerCt.collapse == "function" &&
                            ownerCt.collapse();
                    }, this);
                    var onPopulate = OpenLayers.Function.bind(function() {
                        this.showExportCSV ? this.output[0].exportCSVButton.enable() : {};
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
                contextmenu: function(event) {
                    if (featureGrid.contextMenu.items.getCount() > 0) {
                        var rowIndex = featureGrid.getView().findRowIndex(event.getTarget());
                        if (rowIndex !== false) {
                            featureGrid.getSelectionModel().selectRow(rowIndex);
                            featureGrid.contextMenu.showAt(event.getXY());
                            event.stopEvent();
                        }
                    }
                },
                scope: this
            },
            contextMenu: new Ext.menu.Menu({items: []})
        }, config || {});
        var featureGrid = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
        if (this.alwaysDisplayOnMap || this.selectOnMap) {
            featureManager.showLayer(this.id, this.displayMode);
        }
       
        featureManager.paging && featureManager.on("setpage", function(mgr, condition, callback, scope, pageIndex, numPages) {
            var paging = (numPages > 0);
            featureGrid.zoomToPageButton.setDisabled(!paging);
            var prev = (paging && (pageIndex !== 0));
            featureGrid.firstPageButton.setDisabled(!prev);
            featureGrid.prevPageButton.setDisabled(!prev);
            var next = (paging && (pageIndex !== numPages-1));
            featureGrid.lastPageButton.setDisabled(!next);
            featureGrid.nextPageButton.setDisabled(!next);
        }, this);
                
        featureManager.on("layerchange", function(mgr, rec, schema) {
            //TODO use schema instead of store to configure the fields
            var ignoreFields = ["feature", "state", "fid"];
            schema && schema.each(function(r) {
                r.get("type").indexOf("gml:") == 0 && ignoreFields.push(r.get("name"));
            });
            featureGrid.ignoreFields = ignoreFields;
            featureGrid.setStore(featureManager.featureStore, schema);
        }, this);
        
        return featureGrid;
    },
    /** api: method[csvExport]
     */    
    csvExport: function(single){
    
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
        
        var numColumns = colModel.getColumnCount(true);
        var propertyName = [];
        
        for (var i=0; i<numColumns; i++){        
            propertyName.push(colModel.getColumnHeader(i));
        }
        
        this.url =  protocol.url +
                    "propertyName=" + propertyName.join(',') +
                    "&service=WFS" +
                    "&version=" + protocol.version +
                    "&request=GetFeature" +
                    "&typeName=" + protocol.featureType +
                    "&exceptions=application/json" +
                    "&outputFormat=CSV"

        OpenLayers.Request.POST({
            url: this.url,
            data: this.xml,
            callback: function(request) {

                if(request.status == 200){
                
                    try
                      {
                            var serverError = Ext.util.JSON.decode(request.responseText);
                            Ext.Msg.show({
                                title: this.invalidParameterValueErrorText,
                                msg: "outputFormat: CSV</br></br>" +
                                     this.failedExportCSV + "</br></br>" +
                                     "Error: " + serverError.exceptions[0].text,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                            });                        
                      }
                    catch(err)
                      {
                            //        
                            //delete other iframes appended
                            //
                            if(document.getElementById("downloadIFrame")) {
                                document.body.removeChild( document.getElementById("downloadIFrame") ); 
                            }
                            
                            //
                            //Create an hidden iframe for forced download
                            //
                            var elemIF = document.createElement("iframe"); 
                            elemIF.setAttribute("id","downloadIFrame");

                            var mUrl = this.url + "&filter=" + this.xml;
                            elemIF.src = mUrl; 
                            elemIF.style.display = "none"; 
                            document.body.appendChild(elemIF); 
                      }
                      
                }else{
                    Ext.Msg.show({
                        title: this.failedExportCSV,
                        msg: request.statusText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            },
            scope: this
        });        

    }
    
});

Ext.preg(gxp.plugins.FeatureGrid.prototype.ptype, gxp.plugins.FeatureGrid);
