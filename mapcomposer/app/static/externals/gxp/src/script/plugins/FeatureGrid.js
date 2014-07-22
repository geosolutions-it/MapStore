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
				, {
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
										featureManager.setPage({index: value - 1})
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
                text: this.displayFeatureText,
                id: "showButton",
                iconCls: "gxp-icon-addtomap",
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    this.selectOnMap && this.selectControl[pressed ? "activate" : "deactivate"]();
                    featureManager[pressed ? "showLayer" : "hideLayer"](this.id, this.displayMode);
                },
                scope: this
            }] : [])).concat(["->"]);

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
            xtype: "gxp_featuregrid",
            actionTooltip: this.zoomToFeature,
            map: this.target.mapPanel.map,
            sm: new GeoExt.grid.FeatureSelectionModel(smCfg),
            autoScroll: true,
            title: this.title,
            bbar: bbar,
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
            contextMenu: new Ext.menu.Menu({items: [{
                text: this.zoomToFeature,
                tooltip: this.zoomToFeature,
                iconCls: 'gxp-icon-zoom-to',
                scope: this,
                handler: function(cmp){
                    var grid = this.output[0];
                    var selection = grid.getSelectionModel().getSelections()[0];
                    var feature = selection.data.feature;
                    if(feature){
                        var bounds = feature.geometry.getBounds();
                        if(bounds){
                            this.target.mapPanel.map.zoomToExtent(bounds);
                            
                            var showButton = Ext.getCmp("showButton");
                            if(!showButton.pressed){
                                showButton.toggle(true);
                                this.selectControl.select(feature);
                            }
                        }
                    }
                }               
            }]})
        }, config || {});
        var featureGrid = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
        if (this.alwaysDisplayOnMap || this.selectOnMap) {
            featureManager.showLayer(this.id, this.displayMode);
        }
       
	   // /////////////////////////////////////
	   // FeatureManager events's listeners
	   // /////////////////////////////////////
	    var me = this;
        featureManager.paging && featureManager.on("setpage", function(mgr, condition, callback, scope, pageIndex, numPages) {
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
            var ignoreFields = ["feature", "state", "fid"];
            schema && schema.each(function(r) {
                r.get("type").indexOf("gml:") == 0 && ignoreFields.push(r.get("name"));
            });
            featureGrid.ignoreFields = ignoreFields;
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

Ext.preg(gxp.plugins.FeatureGrid.prototype.ptype, gxp.plugins.FeatureGrid);
