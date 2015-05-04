Ext.namespace("gxp.plugins");

gxp.plugins.NestedLayerTree = Ext.extend(gxp.plugins.LayerTree, {

    /** api: ptype = gxp_nestedlayertree */
    ptype: "gxp_nestedlayertree",

    /** api: config[groupConfig]
     *  ``Array``
     *  Configuration for the nested structure. The array containts objects
     *  with a title and a children property. The children are objects with
     *  a title and a name.
     */
    groupConfig: null,

    createGroup: function(text, groupCode, expanded, checked) {
        var target = this.target, me = this;
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
                        if(node.isLeaf() && node.getUI().isChecked()){
                            node.parentNode.getUI().toggleCheck(true);
                        }
                    });
                }else{
                    node.on("rendernode", function() {
                        // ///////////////////////////////////////////////////////////////////////
                        // to check the group at startup (if the layer node should be checked) 
                        // or when a layer is added.
                        // ///////////////////////////////////////////////////////////////////////
                        if(node.isLeaf() && node.getUI().isChecked()){
                            node.parentNode.getUI().toggleCheck(true);
                        }
                    });
                }
            }
        };    
        var LayerNodeUI = Ext.extend(gxp.tree.LayerNodeUI,
            new GeoExt.tree.TreeNodeUIEventMixin());    
        return {
            text: text,
            expanded: expanded,
            iconCls: "gxp-folder",
            nodeType: 'gx_layercontainer',
            group: groupCode,
            checked: checked,
            singleClickExpand: true,
            allowDrag: true,            
            loader: new GeoExt.tree.LayerLoader({
                store: this.target.mapPanel.layers,
                filter: function(record) {
                    return record.get("group") == groupCode;
                },
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
                    
                    return node;
                }                
            }),
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }            
        };
    },

    addOutput: function(config) {
        var treePanel = gxp.plugins.NestedLayerTree.superclass.addOutput.call(this, arguments);
        treePanel.enableDD = true;
        var root = treePanel.getRootNode();
        var overlays = root.childNodes[0];
        var baseLayers = root.childNodes[1];
        var count = 2;
        //root.removeChild(overlays);
        for (var i=0, ii=this.groupConfig.length; i<ii; ++i) {
            var group = this.groupConfig[i];
            var node = new Ext.tree.TreeNode({
                text: group.title,
                expanded: true,
                //checked: false,
                singleClickExpand: false,
                allowDrag: true                
            });
            if (group.folder){
                for (var j=0, jj=group.folder.length; j<jj; ++j) {
                    root.appendChild(this.createGroup(group.folder[j].title, group.folder[j].name, group.expanded, group.checked));
                }
                var node2 = root.childNodes[count];
                root.insertBefore(node2, baseLayers);
            }else if(group.children){
                for (var j=0, jj=group.children.length; j<jj; ++j) {
                    node.appendChild(this.createGroup(group.children[j].title, group.children[j].name, group.expanded, group.checked));
                }
                root.insertBefore(node, baseLayers);            
            }else{
                root.removeChild(root.childNodes[count])
            }
            count++;
        }
        return treePanel;
    }

});

Ext.preg(gxp.plugins.NestedLayerTree.prototype.ptype, gxp.plugins.NestedLayerTree);