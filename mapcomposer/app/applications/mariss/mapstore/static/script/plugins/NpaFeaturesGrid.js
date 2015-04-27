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
gxp.plugins.npa.NpaFeaturesGrid = Ext.extend(gxp.plugins.FeatureGrid, {

    ptype: "npa_features_grid",

    displayFeatureText: "Highlight",

    /** api: method[addOutput]
     */
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
        var tbar = [];
        var exportBtn;
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
        var prevMenu = new Ext.menu.Menu({
            items: [{
                text: 'Show Raster Quicklooks',
                checked: false,
                checkHandler: function(obj) {
                    this.toggleRasterQuicklooks(obj.checked);
                },
                scope: this
            }]
        });
        if (this.rasterLayerPreview) {
            tbar.push({
                text: 'Raster Preview',
                iconCls: 'icon-raster', // <-- icon
                menu: prevMenu // assign menu by instance
            });
            tbar.push('-');
        };
        var loadInExtent;
        if (this.filterByextent) {

            loadInExtent = new Ext.Button({
                width: 120,
                enableToggle: true,
                text: 'List Visible OilSlicks',
                pressed: false,
                iconCls: 'icon-filtervec',

                toggleHandler: function(btn, state) {
                    // btn.setText((state)?'Footprints In Extent':'All Footprints');
                    this.toggleFootprintsLoad(state);
                },
                scope: this
            });
        }
        if (loadInExtent) tbar.push(loadInExtent);
        if (this.selectOnMap) {
            var toggleGroup = this.toggleGroup || Ext.id();
            var selectOnMap = new GeoExt.Action({
                text: "Select Oilslicks On Map",
                pressed: false,
                iconCls: 'gxp-icon-selectfeature',
                toggleHandler: function(btn, state) {
                    if (!state) this.filterFootprints();
                    //this.toggleFootprintsLoad(state);
                },
                scope: this,
                enableToggle: true,
                toggleGroup: toggleGroup,
                allowDepress: true,
                control: this.selectControl,
                deactivateOnDisable: true,
                map: this.target.mapPanel.map
            });

            tbar.push(selectOnMap);
        }
        if (!this.alwaysDisplayOnMap) {
            tbar.push(displayBtn);
            displayBtn.toggle(true);
        }
        if (this.exportFormats) tbar.push(exportBtn);

        config = Ext.apply({
            xtype: "npa_oilslicks_grid",
            actionTooltip: this.zoomToFeature,
            map: this.target.mapPanel.map,
            sm: new GeoExt.grid.FeatureSelectionModel(smCfg),
            autoScroll: true,
            tbar: tbar,
            disabled: true,
            ftMan: featureManager,
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
            },
            contextMenu: new Ext.menu.Menu({
                items: [{
                    text: this.zoomToFeature,
                    tooltip: this.zoomToFeature,
                    iconCls: 'gxp-icon-zoom-to',
                    scope: this,
                    handler: function(cmp) {
                        var grid = this.output[0];
                        var selection = grid.getSelectionModel().getSelections()[0];
                        var feature = selection.data.feature;
                        if (feature) {
                            var bounds = feature.geometry.getBounds();
                            if (bounds) {
                                this.target.mapPanel.map.zoomToExtent(bounds);

                                var showButton = Ext.getCmp("showButton");
                                if (!showButton.pressed) {
                                    showButton.toggle(true);
                                    this.selectControl.select(feature);
                                }
                            }
                        }
                    }
                }]
            })
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
        var panRegion = Ext.getCmp('east');
        var waitingFilter = null;
        featureManager.on('clearfeatures', function() {
            if (featureGrid.layersTofilter) featureGrid.layersTofilter = null;
            panRegion.setTitle("");
            featureGrid.disable();
            this.extentFilter = null;
            this.origFilter == null;
        });
        featureManager.on("beforequery", function(t, f, c, s) {
            if (!this.origFilter) this.origFilter = f;
            panRegion.expand();
            featureGrid.enable();
        }, this);
        featureManager.on("query", function() {
            if (featureManager.npaGroup)
                panRegion.setTitle("Scenario " + featureManager.npaGroup.split('_')[1]);
        }, this);
              if(this.featureFilter)this.target.tools[this.featureFilter].on("filterupdated",function(filter){
                    this.attrFilter=filter;
                    this.filterFootprints();
        
                },this);
        return featureGrid;

    },
    toggleRasterQuicklooks: function(state) {
        if (!this.layerTree)
            this.layerTree = Ext.getCmp("layertree");
        //rasterLayerPreview index of default group and rasterlayre to filter
        var rstNode = null;
        var lname = this.rasterLayerPreview;

        this.layerTree.getRootNode().childNodes.forEach(function(groupNode) {
            if (groupNode instanceof GeoExt.tree.LayerContainer) {
                groupNode.childNodes.forEach(function(node) {
                    if (node.layer && node.layer.params && node.layer.params.LAYERS == lname)
                        if (state) {
                            node.layer.setVisibility(true);
                            node.enable();
                        } else {
                            node.disable();
                            node.layer.setVisibility(false);
                        }
                });
            }
        });
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
            filters: [this.origFilter, this.attrFilter, this.extentFilter]
        });
        else if (this.attrFilter) filter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [this.origFilter, this.attrFilter]
        });
        else if (this.extentFilter)
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [this.origFilter, this.extentFilter]
            });
        else filter = this.origFilter;
        featureManager.loadFeatures(filter);
    },
    noFeatureClick: function(evt) {
        if (!this.selectControl) {
            this.selectControl = new OpenLayers.Control.SelectFeature(
                this.target.tools[this.featureManager].featureLayer
            );
        }
        var evtLL = this.target.mapPanel.map.getLonLatFromPixel(evt.xy);
        var featureManager = this.target.tools[this.featureManager];
        var page = featureManager.page;
        if (featureManager.visible() == "all" && featureManager.paging && page && page.extent.containsLonLat(evtLL)) {
            // no need to load a different page if the clicked location is
            // inside the current page bounds and all features are visible
            return;
        }

        var layer = featureManager.layerRecord && featureManager.layerRecord.getLayer();
        if (!layer) {
            // if the feature manager has no layer currently set, do nothing
            return;
        }
        // construct params for GetFeatureInfo request
        // layer is not added to map, so we do this manually
        var map = this.target.mapPanel.map;
        var size = map.getSize();
        var params = Ext.applyIf({
            REQUEST: "GetFeatureInfo",
            BBOX: map.getExtent().toBBOX(),
            WIDTH: size.w,
            HEIGHT: size.h,
            X: evt.xy.x,
            Y: evt.xy.y,
            CQL_FILTER: this.origFilter,
            QUERY_LAYERS: layer.params.LAYERS,
            INFO_FORMAT: "application/vnd.ogc.gml",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            FEATURE_COUNT: 1
        }, layer.params);
        if (typeof this.tolerance === "number") {
            for (var i = 0, ii = this.toleranceParameters.length; i < ii; ++i) {
                params[this.toleranceParameters[i]] = this.tolerance;
            }
        }
        var projectionCode = map.getProjection();
        if (parseFloat(layer.params.VERSION) >= 1.3) {
            params.CRS = projectionCode;
        } else {
            params.SRS = projectionCode;
        }

        var store = new GeoExt.data.FeatureStore({
            fields: {},
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.HTTP({
                    url: (typeof layer.url === "string") ? layer.url : layer.url[0],
                    params: params,
                    format: new OpenLayers.Format.WMSGetFeatureInfo()
                })
            }),
            autoLoad: true,
            listeners: {
                "load": function(store, records) {
                    if (records.length > 0) {
                        var fid = records[0].get("fid");
                        var filter = new OpenLayers.Filter.FeatureId({
                            fids: [fid]
                        });

                        var autoLoad = function() {
                            featureManager.loadFeatures(
                                filter,
                                function(features) {
                                    this.autoLoadedFeature = features[0];
                                    this.select(features[0]);
                                }, this
                            );
                        }.createDelegate(this);

                        var feature = featureManager.featureLayer.getFeatureByFid(fid);
                        if (feature) {
                            this.select(feature);
                        } else if (featureManager.paging && featureManager.pagingType === gxp.plugins.FeatureManager.QUADTREE_PAGING) {
                            var lonLat = this.target.mapPanel.map.getLonLatFromPixel(evt.xy);
                            featureManager.setPage({
                                lonLat: lonLat
                            }, function() {
                                var feature = featureManager.featureLayer.getFeatureByFid(fid);
                                if (feature) {
                                    this.select(feature);
                                } else if (this.autoLoadFeatures === true) {
                                    autoLoad();
                                }
                            }, this);
                        } else {
                            autoLoad();
                        }
                    }
                },
                scope: this
            }
        });
    }

});

Ext.preg(gxp.plugins.npa.NpaFeaturesGrid.prototype.ptype, gxp.plugins.npa.NpaFeaturesGrid);