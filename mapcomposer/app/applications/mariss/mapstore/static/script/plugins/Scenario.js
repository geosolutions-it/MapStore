/** api: (define)
 *  module = gxp.npa.grid
 *  class = FootprintsGrid
 */
Ext.namespace("gxp.plugins.npa");

/** api: constructor
 *  .. class:: FootprintsGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` for Scheduled Capacities .
 */
gxp.plugins.npa.Scenario = Ext.extend(gxp.plugins.Tool, {
    ptype: 'npa_scenario',
    unavailableLayer: 'Layer unavailable at this resolution',

    filteredGroup: null,
    init: function(target) {
        gxp.plugins.npa.Scenario.superclass.init.apply(this, arguments);
        this.target = target;
        this.map = this.target.mapPanel.map;
        this.store = new Ext.data.JsonStore({
            fields: [
                'servicename',
                'identifier',
                'bbox',
                'time',
                'layerlist',
                'variablelist',
                'sartypelist',
                'originalfilepath'
            ],
            idIndex: 0,
            proxy: new Ext.data.MemoryProxy()
        });
        var nodeTooltip = this.unavailableLayer;
        this.target.on(
            "portalready",
            function() {
                if (!this.layerTree) this.layerTree = Ext.getCmp("layertree");
                var me = this;
                window.setTimeout(function() {
                    me.checkLayerVisibility();
                }, 2000);
                //Checks layer visibility and changes node tree ui
                this.map.events.register('zoomend', this, this.checkLayerVisibility);
                this.managers = [];
                if (this.infoManagers) {

                    for (var managerId in this.infoManagers) {
                        var a = {
                            featuremanager: this.target.tools[this.infoManagers[managerId].featuremanager],
                            filter: new OpenLayers.Filter.Comparison({
                                type: this.infoManagers[managerId].operator,
                                property: this.infoManagers[managerId].property
                            })
                        };
                        this.managers.push(a);
                    };
                }
                this.layerTree.on("click", function(node) {
                    if (node instanceof GeoExt.tree.LayerContainer && node.attributes) {
                        this.selectGroup(node.attributes.group);
                    }
                    if (node instanceof GeoExt.tree.LayerNode && node.parentNode) {
                        this.selectGroup(node.parentNode.attributes.group);
                    }
                }, this);
            }, this);

    },

    checkLayerVisibility: function() {
        if (!this.layerTree) this.layerTree = Ext.getCmp("layertree");
        var treeRoot = this.layerTree.getRootNode();
        var unavailableLayer = this.unavailableLayer;
        treeRoot.childNodes.forEach(function(node) {
            if (node instanceof GeoExt.tree.LayerContainer)
                node.childNodes.forEach(function(cnode) {

                    if (cnode instanceof GeoExt.tree.LayerNode && cnode.layer instanceof OpenLayers.Layer.WMS) {
                        if (cnode.layer.calculateInRange()) {
                            cnode.ui.removeClass('x-tree-node-outofrange');
                            cnode.setTooltip('');
                        } else {
                            cnode.ui.addClass('x-tree-node-outofrange');
                            cnode.setTooltip(unavailableLayer);
                        }
                    }
                });
        });
    },
    /**
     * :api method[loadElement]
     * :arg row:  ``Ext.data.Record``
     * :org type:  ``String``
     * Load Element to grid store
     * 
     * */
    loadElement: function(row, type) {
        var data = row.data;
        var gId = new Ext.XTemplate(this.gIdTmp).apply(data);

        var rec = this.store.getById(gId);
        if (!rec) {
            var nRec = {
                id: gId,
                fid: data.fid,
                identifier: data.identifier,
                layerlist: data.layerlist,
                originalfilepath: data.originalfilepath,
                sartypelist: data.sartypelist,
                servicename: data.servicename,
                state: data.state,
                time: data.time,
                variablelist: data.variablelist,
                bounds: data.feature.geometry.getBounds()
            };

            this.store.loadData([nRec], true);
            this.createGroup(this.store.getById(gId));
        }
    },
    /**
     * :private method[filterInfoManager]
     * :arg r:  ``Ext.data.Record``
     * Filter feature manager configured
     * 
     * */
    filterInfoManager: function(r) {
        if (r) {
            if (this.filteredGroup) this.resetLayerGroupCQL(this.filteredGroup);
            for (i = 0; i < this.managers.length; i++) {
                var filter = this.managers[i].filter;
                var identifier = r.data.identifier;
                if (filter.type == '..') {
                    filter.lowerBoundary = identifier - 1;
                    filter.upperBoundary = identifier + 1;
                    filter.value = identifier;
                } else if (filter.type == '~')
                    filter.value = identifier.toString();
                else
                    filter.value = identifier;
                this.managers[i].featuremanager.clearFeatures();
                this.managers[i].featuremanager.loadFeatures(filter);
                this.managers[i].featuremanager.npaGroup = r.id;
            }
            this.filteredGroup = r;
        }
    },
    /**
     * :private method[resetLayerGroupCQL]
     * :arg r:  ``Ext.data.Record```
     * Reset layer cql filter if modified by infomanager
     * 
     * */
    resetLayerGroupCQL: function(r) {
        var tree = this.layerTree;
        var gId = r.id;
        var groupNode = tree.getNodeById(gId);
        if (groupNode) {
            var layers = this.target.mapPanel.layers;
            layers.data.each(function(record, index, totalItems) {
                if (record.get('group') == groupNode.attributes.group) {
                    if (record.npaCqlModified) {
                        record.getLayer().mergeNewParams({
                            cql_filter: record.npaCql,
                        });
                    }
                }
            });
        }
    },

    /**
     * :private method[createGroup]
     * 
     * add a new layers group to layers tree 
     * */
    createGroup: function(r) {
        var layerNameList = r.data.layerlist.split(',');
        var layersToGroup = {};
        
        layersToGroup = {};
        for (var layerName in this.layersgroup) {

            // skips layers thar there aren't in the layer list
            if (layerName != 'ship_detections' && layerNameList.indexOf(layerName) == -1)
                continue

            var index = this.target.mapPanel.layers.find("name", layerName);
            var l = this.target.mapPanel.layers.getAt(index);
            //If not in map we have to get configuration and create!!
            if (l)
                layersToGroup[layerName] = {
                    layer: l,
                    visible: (this.layersgroup[layerName].visible == undefined) ? true : this.layersgroup[layerName].visible,
                    disabled: (this.layersgroup[layerName].disabled == undefined) ? false : this.layersgroup[layerName].disabled,
                    title: (this.layersgroup[layerName].title == undefined) ? null : this.layersgroup[layerName].title,
                    tmpl: new Ext.XTemplate(this.layersgroup[layerName].tpl, {
                        compiled: true,
                        addZero: function(val, n) {
                            val = '' + val;
                            var newVal = '';
                            for (var i = 0; i < n - val.length; i++) {
                                newVal += '0';
                            }
                            return newVal + val;
                        }
                    })
                };
        };
        

        var gId = r.id;
        var gTitle = new Ext.XTemplate(this.gTitleTmp).apply(r.data);
        var tree = this.layerTree;
        //If already added return
        if (tree.getNodeById(gId))
            return;

        var layerStore = this.target.mapPanel.layers;
        var groupConfig;
        var group = gId;
        var groupConfig = {
            title: gTitle,
            exclusive: false

        };
        var target = this.target,
            me = this.target.tools["layertree_plugin"];

        var addListeners = function(node, record) {
            if (record) {

                target.on("layerselectionchange", function(rec) {
                    if (!me.selectionChanging && rec === record) {
                        node.select();
                    }
                });

                if (record === target.selectedLayer) {
                    node.on("rendernode", function() {
                        node.select();

                        // ///////////////////////////////////////////////////////////////////////
                        // to check the group at startup (if the layer node should be checked) 
                        // or when a layer is added.
                        // ///////////////////////////////////////////////////////////////////////
                        if (node.isLeaf() && node.getUI().isChecked()) {
                            node.parentNode.getUI().toggleCheck(true);
                        }
                    });
                } else {
                    node.on("rendernode", function() {
                        // ///////////////////////////////////////////////////////////////////////
                        // to check the group at startup (if the layer node should be checked) 
                        // or when a layer is added.
                        // ///////////////////////////////////////////////////////////////////////
                        if (node.isLeaf() && node.getUI().isChecked()) {
                            node.parentNode.getUI().toggleCheck(true);
                        }
                    });
                }
            }
        };
        var nodeTooltip = this.unavailableLayer;
        var LayerNodeUI = Ext.extend(gxp.tree.LayerNodeUI,
            new GeoExt.tree.TreeNodeUIEventMixin());
        var node = new GeoExt.tree.LayerContainer({
            id: gId,
            text: groupConfig.title,
            iconCls: "gxp-folder",
            expanded: false,
            checked: true,
            group: group,
            loader: new GeoExt.tree.LayerLoader({
                baseAttrs: groupConfig.exclusive ? {
                    checkedGroup: group
                } : undefined,
                store: this.target.mapPanel.layers,
                filter: (function(group) {
                    return function(record) {
                        return (record.get("group") || "default") == group && record.getLayer().displayInLayerSwitcher == true;
                    };
                })(group),
                createNode: function(attr) {
                    attr.uiProvider = LayerNodeUI;
                    var layer = attr.layer;
                    var store = attr.layerStore;
                    if (layer && store) {
                        var record = store.getAt(store.findBy(function(r) {
                            return r.getLayer() === layer;
                        }));
                        if (record) {
                            if (!record.get("queryable")) {
                                attr.iconCls = "gxp-tree-rasterlayer-icon";
                            }
                            if (record.get("fixed")) {
                                attr.allowDrag = false;
                            }
                        }
                    }
                    var node = GeoExt.tree.LayerLoader.prototype.createNode.apply(this, arguments);
                    addListeners(node, record);
                    if (!layer.inRange) node.setTooltip(nodeTooltip);
                    node.on("rendernode", function(n) {
                        if (!layer.inRange) {
                            n.ui.addClass('x-tree-node-outofrange');
                            n.setTooltip(nodeTooltip);
                        }
                    });
                    if (layer.disabled) node.disable();
                    return node;
                }
            }),
            singleClickExpand: false,
            allowDrag: true,
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }
        });
        tree.root.insertBefore(node, tree.root.firstChild);
        tree.on("remove", function(tree, s, node) {
            this.removeGroup(node);
        }, this);

        for (var layerName in layersToGroup) {
            var l = layersToGroup[layerName].layer;
            var nL = l.clone();

            nL.data.group = group;
            nL.data.name = nL.data.name + "_" + group;
            nL.data.infoTitle = nL.data.title + " " + group.split('_')[1];

            var nLayer = nL.getLayer();

            if (layersToGroup[layerName].title)
                nLayer.name = layersToGroup[layerName].title;

            nLayer.setVisibility(layersToGroup[layerName].visible);
            nLayer.disabled = layersToGroup[layerName].disabled;
            nLayer.displayInLayerSwitcher = true;
            nLayer.addOptions({
                maxExtent: r.json.bounds
            });

            nLayer.addOptions({
                tileOrigin: l.getLayer().getTileOrigin()
            });

            nLayer.restrictedExtent = r.json.bounds;

            var cql = layersToGroup[layerName].tmpl.apply(r.data);

            nL.npaCql = cql;
            nL.npaCqlModified = false;
            nLayer.vendorParams = (nLayer.vendorParams) ? Ext.apply(nLayer.vendorParams, {
                "cql_filter": cql
            }) : {
                "cql_filter": cql
            };

            nLayer.mergeNewParams({
                cql_filter: cql,
            });

            var nb = r.json.bounds.clone();
            nb.transform(nLayer.projection, new OpenLayers.Projection("EPSG:4326"));
            var nBBOX = {
                "EPSG:4326": {
                    bbox: nb.toArray(),
                    srs: "EPSG:4326"
                }
            };

            nL.data.bbox = nBBOX;
            nL.data.llbbox = nb.toArray();
            layerStore.add([nL]);
        }

        this.selectTreeNode(r);
        var bounds = r.json.bounds;
        if (bounds) {
            this.map.zoomToExtent(bounds);
        }
    },

    /** private: method[removeGroup]
     *  :arg record:  ``Ext.treenode``
     *  Remove layers group from layers tree and map
     **/
    removeGroup: function(r) {
        var gId = r.id;
        var group = this.store.getById(gId);
        if (group) {
            if (group == this.filteredGroup) {
                for (i = 0; i < this.managers.length; i++)
                    this.managers[i].featuremanager.clearFeatures();
            }
            this.store.remove(group);

        }
    },
    /** private: method[selectGroup]
     *  :arg gId:  ``String``
     *  Select group in grid 
     **/
    selectGroup: function(gId) {

        var r = this.store.getById(gId);
        if (r && this.filteredGroup != r) {
            this.filterInfoManager(r);
            var bounds = r.json.bounds;
            if (bounds) {
                this.map.zoomToExtent(bounds);
            }
        } else if (!r) {
            if (this.filteredGroup) this.resetLayerGroupCQL(this.filteredGroup);
            for (i = 0; i < this.managers.length; i++)
                this.managers[i].featuremanager.clearFeatures();
            this.filteredGroup = null;
        }
    },
    selectTreeNode: function(r) {
        var tree = this.layerTree;
        var gId = r.id;
        var groupNode = tree.getNodeById(gId);
        if (groupNode && !groupNode.isSelected()) {
            groupNode.select();
            this.filterInfoManager(r);
        }
    }
});
Ext.preg(gxp.plugins.npa.Scenario.prototype.ptype, gxp.plugins.npa.Scenario);