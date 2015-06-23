/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include widgets/grid/FootprintsGrid.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureGrid
 */

/** api: (extends)
 *  plugins/gxp.plugins.FeatureGrid.js
 */
Ext.namespace("gxp.plugins.npa");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */
gxp.plugins.npa.ResultsGrid = Ext.extend(gxp.plugins.FeatureGrid, {

    /** api: ptype = gxp_featuregrid */
    ptype: "npa_results_grid",

    displayFeatureText: "Highlight",


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
    exportFormatsConfig: {
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

    /** api: config[rasterLayerPreview]
     *  ``Array`` With node index for Default group and raster layer preview
     * rasterLayerPreview:[1,1],*/

    attrFilter: null,
    extentFilter: null,

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
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];
        var map = this.target.mapPanel.map,
            smCfg;
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
                        if (this.selectControl.active || featureManager.featureStore.getModifiedRecords().length) {
                            return false;
                        }
                    },
                    scope: this
                }
            };
        }
        this.displayItem = new Ext.Toolbar.TextItem({});

        var toolbarElements = [];
        toolbarElements.push({
            iconCls: "x-tbar-page-first",
            ref: "../firstPageButton",
            tooltip: this.firstPageTip,
            disabled: true,
            handler: function() {
                featureManager.setPage({
                    index: 0
                });
            }
        }, {
            iconCls: "x-tbar-page-prev",
            ref: "../prevPageButton",
            tooltip: this.previousPageTip,
            disabled: true,
            handler: function() {
                featureManager.previousPage();
            }
        });

        if (featureManager.pagingType == 1) {
            toolbarElements.push(
                '-', {
                    xtype: 'compositefield',
                    width: 120,
                    items: [{
                        xtype: 'label',
                        text: this.pageLabel,
                        autoWidth: true,
                        style: {
                            marginTop: '3px'
                        }
                    }, {
                        ref: "../../currentPage",
                        xtype: "textfield",
                        width: 40,
                        value: "0",
                        disabled: true,
                        enableKeyEvents: true,
                        listeners: {
                            scope: this,
                            keypress: function(field, e) {
                                var charCode = e.getCharCode();
                                if (charCode == 13) {
                                    var value = field.getValue();
                                    featureManager.setPage({
                                        index: value - 1
                                    })
                                }
                            }
                        }
                    }, {
                        xtype: 'label',
                        width: 15,
                        text: this.pageOfLabel,
                        style: {
                            marginTop: '3px'
                        }
                    }, {
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

            if (this.showNumberOfRecords === true) {
                toolbarElements.push(
                    /*{
                        xtype: 'compositefield',
                        width: 120,
                        items: [*/
                    {
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
            '-', {
                iconCls: "gxp-icon-zoom-to",
                ref: "../zoomToPageButton",
                tooltip: this.zoomPageExtentTip,
                disabled: true,
                hidden: featureManager.autoZoomPage,
                handler: function() {
                    map.zoomToExtent(featureManager.getPageExtent());
                }
            },
            '-', {
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
                    featureManager.setPage({
                        index: "last"
                    });
                }
            },{
                xtype: 'tbspacer',
                width: 10
            },{
                iconCls: "x-tbar-loading",
                ref: "../refreshButton",
                disabled: false,
                handler: function() {
                    featureManager.setPage({index: featureManager.pageIndex});
                }
            }, {
                xtype: 'tbspacer',
                width: 10
            },
            this.displayItem
        );

        var bbar = (featureManager.paging ? [toolbarElements] : []);



        var displayBtn = new Ext.Button({
            text: this.displayFeatureText,
            iconCls: "gxp-icon-addtomap",
            enableToggle: true,
            toggleHandler: function(btn, pressed) {
                this.selectOnMap && this.selectControl[pressed ? "activate" : "deactivate"]();
                featureManager[pressed ? "showLayer" : "hideLayer"](this.id, this.displayMode);
            },
            scope: this
        });
        var exportBtn;
        var toggleRaster = new Ext.Button({
            width: 160,
            enableToggle: true,
            text: 'Show Raster Quicklooks',
            pressed: false,
            iconCls: 'icon-raster',
            toggleHandler: function(btn, state) {
                // btn.setText((state)?'Show Raster Quicklooks':'Hide Raster Quicklooks');
                this.toggleRasterQuicklooks(state);
            },
            scope: this
        });

        // Export formats 
        if (this.exportFormats) {
            if (this.exportAction == 'window') {
                exportBtn = this.getExportWindowButton();
            } else {
                var appendedCSVExporter = false;
                for (var i = 0; i < this.exportFormats.length; i++) {
                    var format = this.exportFormats[i];
                    // Retrocompatibilty
                    if (format == "CSV") {
                        appendedCSVExporter = true;
                    }
                    exportBtn = this.getExportButton(format);
                }
                // Retrocompatibilty
                if (!appendedCSVExporter && this.showExportCSV) {
                    exportBtn = this.getExportButton("CSV");
                }
            }
        } else {
            // Retrocompatibilty
            if (this.showExportCSV) {
                exportBtn = this.getExportButton("CSV");
            }
        }

        var tbar = [];


        var loadInExtent = new Ext.Button({
            width: 120,
            enableToggle: true,
            text: 'List Visible Products',
            pressed: false,
            iconCls: 'icon-filtervec',

            toggleHandler: function(btn, state) {
                // btn.setText((state)?'Footprints In Extent':'All Footprints');
                this.toggleFootprintsLoad(state);
            },
            scope: this
        });
        var toggleGroup = this.toggleGroup || Ext.id();
        var selectOnMap = new GeoExt.Action({
            text: "Select Product On Map",
            pressed: false,
            iconCls: 'gxp-icon-selectfeature',
            toggleHandler: function(btn, state) {
                //this.toggleFootprintsLoad(state);
            },

            enableToggle: true,
            toggleGroup: toggleGroup,
            allowDepress: true,
            control: this.selectControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        });
        tbar.push(loadInExtent);
        tbar.push(selectOnMap);
        if (this.rasterLayerPreview) {
            tbar.push(toggleRaster);
            tbar.push('-');
        };
        if (!this.alwaysDisplayOnMap) {
            tbar.push(displayBtn);
            tbar.push('-');
            displayBtn.toggle(true);
        }
        if (this.exportFormats) tbar.push(exportBtn);
        config = Ext.apply({
            xtype: "npa_footprints_grid",
            actionTooltip: this.zoomToFeature,
            map: this.target.mapPanel.map,
            tbar: tbar,
            sm: new GeoExt.grid.FeatureSelectionModel(smCfg),
            autoScroll: true,
            target: this.target,
            title: this.title,
            bbar: bbar,

            listeners: {
                "added": function(cmp, ownerCt) {
                    var onClear = OpenLayers.Function.bind(function() {
                        if (this.exportFormats) {
                            if (this.exportAction == 'window') {
                                this.output[0]["exportButton"].disable();
                            } else {
                                for (var i = 0; i < this.exportFormats.length; i++) {
                                    var format = this.exportFormats[i];
                                    this.output[0]["export" + format + "Button"].disable();
                                }
                            }
                        } else if (this.showExportCSV) {
                            this.output[0].exportCSVButton.disable();
                        }
                        this.displayTotalResults();
                        this.selectOnMap && this.selectControl.deactivate();
                        this.autoCollapse && typeof ownerCt.collapse == "function" &&
                            ownerCt.collapse();
                    }, this);
                    var onPopulate = OpenLayers.Function.bind(function() {
                        if (this.exportFormats) {
                            if (this.exportAction == 'window') {
                                this.output[0]["exportButton"].enable();
                            } else {
                                for (var i = 0; i < this.exportFormats.length; i++) {
                                    var format = this.exportFormats[i];
                                    this.output[0]["export" + format + "Button"].enable();
                                }
                            }
                        } else if (this.showExportCSV) {
                            this.output[0].exportCSVButton.enable();
                        }
                        this.displayTotalResults();
                        // this.selectOnMap && this.selectControl.activate();
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
            }
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
            var next = (paging && (pageIndex !== numPages - 1));
            featureGrid.lastPageButton.setDisabled(!next);
            featureGrid.nextPageButton.setDisabled(!next);

            if (featureManager.pagingType == 1) {
                featureGrid.currentPage.enable();
                featureGrid.currentPage.setValue(featureManager.pageIndex + 1);
                featureGrid.numberOfPagesLabel.setText(featureManager.numPages);

                if (me.showNumberOfRecords === true) {
                    featureGrid.totalRecords.setText(featureManager.numberOfFeatures + "}");
                }
            }
        }, this);

        featureManager.on("layerchange", function(mgr, rec, schema) {
            if (featureManager.pagingType == 1) {
                featureGrid.currentPage.disable();
                featureGrid.currentPage.setValue("0");
                featureGrid.numberOfPagesLabel.setText("0");

                if (me.showNumberOfRecords === true) {
                    featureGrid.totalRecords.setText("0}");
                }
            }

            //TODO use schema instead of store to configure the fields
            var ignoreFields = this.ignoreFields;
            schema && schema.each(function(r) {
                r.get("type").indexOf("gml:") == 0 && ignoreFields.push(r.get("name"));
            });
            featureGrid.ignoreFields = ignoreFields;
            featureGrid.setStore(featureManager.featureStore, schema);
        }, this);

        featureManager.on("clearfeatures", function(mgr, rec, schema) {
            if (featureManager.pagingType == 1) {
                featureGrid.currentPage.disable();
                featureGrid.currentPage.setValue("0");
                featureGrid.numberOfPagesLabel.setText("0");

                if (me.showNumberOfRecords === true) {
                    featureGrid.totalRecords.setText("0}");
                }
            }
        }, this);



        var managers = [];


        if (this.infoManagers) {
            featureGrid.on("filterreseted", function() {
                for (i = 0; i < managers.length; i++) {
                    managers[i].clearFeatures();

                }

            });


            for (var managerId in this.infoManagers)
                managers.push(this.target.tools[this.infoManagers[managerId]]);
            featureGrid.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {

                var usid = r.data.feature.data.usid;
                var filter = new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "usid",
                    value: usid
                });

                for (i = 0; i < managers.length; i++) {
                    managers[i].clearFeatures();
                    managers[i].loadFeatures(filter);
                }

            }, this);
        }
        if (this.rasterLayerPreview) {
            featureManager.on("query", function(t, s, f) {
                this.toggleRasterQuicklooks(false);
                featureManager.un("query", arguments.callee, this);
            }, this);
        }

        if (this.footPrintsFilter) this.target.tools[this.footPrintsFilter].on("filterupdated", function(filter) {
            this.attrFilter = filter;
            this.filterFootprints();

        }, this);
        return featureGrid;
    },
    toggleRasterQuicklooks: function(state) {

        if (!this.layerTree)
            this.layerTree = Ext.getCmp("layertree");
        //rasterLayerPreview index of default group and rasterlayre to filter
        var rstNode = null;
        var lname = this.rasterLayerPreview[1];
        if (!this.defaultGroup)
            this.defaultGroup = this.layerTree.getRootNode().childNodes[this.rasterLayerPreview[0]];

        this.defaultGroup.childNodes.forEach(function(node) {
            if (node.layer && node.layer.params && node.layer.params.LAYERS == lname)
                return rstNode = node;
        });
        if (rstNode) {

            if (state) {
                rstNode.layer.setVisibility(true);
                rstNode.enable();
            } else {
                rstNode.disable();
                rstNode.layer.setVisibility(false);
            }
        }
    },
    toggleFootprintsLoad: function(state) {
        if (state) {
            this.target.mapPanel.map.events.register('moveend', this, this.addExtentFilter);
            this.addExtentFilter();

        } else {
            this.target.mapPanel.map.events.unregister('moveend', this, this.addExtentFilter);
            this.extentFilter = null;
            this.filterFootprints();
        }
    },
    addExtentFilter: function() {
        if (this.loadFt) clearTimeout(this.loadFt);
        this.extentFilter = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.target.mapPanel.map.getExtent()

        });
        var me = this;
        this.loadFt = setTimeout(function() {
            me.filterFootprints();
        }, 1500);
    },
    filterFootprints: function() {

        var featureManager = this.target.tools[this.featureManager];
        var filter = null;
        if (this.attrFilter && this.extentFilter) filter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [this.attrFilter, this.extentFilter]
        });
        else if (this.attrFilter) filter = this.attrFilter;
        else if (this.extentFilter) filter = this.extentFilter;
        featureManager.loadFeatures(filter);
    }
});

Ext.preg(gxp.plugins.npa.ResultsGrid.prototype.ptype, gxp.plugins.npa.ResultsGrid);