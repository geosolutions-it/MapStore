/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/tree/LayerNodeUI.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LayerTree
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LayerTree(config)
 *
 *    Plugin for adding a tree of layers to a :class:`gxp.Viewer`. Also
 *    provides a context menu on layer nodes.
 */
gxp.plugins.LayerTree = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_layertree */
    ptype: "gxp_layertree",

    /** api: config[rootNodeText]
     *  ``String``
     *  Text for root node of layer tree (i18n).
     */
    rootNodeText: "Layers",

    /** api: config[overlayNodeText]
     *  ``String``
     *  Text for overlay node of layer tree (i18n).
     */
    overlayNodeText: "Default",

    /** api: config[baseNodeText]
     *  ``String``
     *  Text for baselayer node of layer tree (i18n).
     */
    baseNodeText: "Base Layers",

    /** api: config[groups]
     *  ``Object`` The groups to show in the layer tree. Keys are group names,
     *  and values are either group titles or an object with ``title`` and
     *  ``exclusive`` properties. ``exclusive`` means that nodes will have
     *  radio buttons instead of checkboxes, so only one layer of the group can
     *  be active at a time. Optional, the default is
     *
     *  .. code-block:: javascript
     *
     *      groups: {
     *          "default": "Overlays", // title can be overridden with overlayNodeText
     *          "background": {
     *              title: "Base Layers", // can be overridden with baseNodeText
     *              exclusive: true
     *          }
     *      }
     */
    groups: null,

    /** api: config[defaultGroup]
     *  ``String`` The name of the default group, i.e. the group that will be
     *  used when none is specified. Defaults to ``default``.
     */
    defaultGroup: "default",


    /** api: config[localLabelSep]
     *  ``String`` Language separator for the groups name
     */
    localLabelSep: "_",

    /** api: config[localLabelSep]
     *  ``Object`` Contains the index position (in the groupName array obtained from the group name splitted with the "localLabelSep" separator)
     *   for each language supported
     */
    localIndexs:{
            "en": 0,
            "it": 1,
            "fr": 2,
            "de": 3
    },

    collapsedGroups: false,

    /** private: method[constructor]
     *  :arg config: ``Object``
     */
    constructor: function(config) {
        gxp.plugins.LayerTree.superclass.constructor.apply(this, arguments);
        if (!this.groups) {
            this.groups = {
                "default": this.overlayNodeText,
                "background": {
                    title: this.baseNodeText,
                    exclusive: true
                }
            };
        }
    },

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {

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

        //
        // create our own layer node UI class, using the TreeNodeUIEventMixin
        //
        var LayerNodeUI = Ext.extend(gxp.tree.LayerNodeUI,
            new GeoExt.tree.TreeNodeUIEventMixin());

        var treeRoot = new Ext.tree.TreeNode({
            text: this.rootNodeText,
            expanded: true,
            isTarget: false,
            allowDrop: true
        });

        var groupConfig, defaultGroup = this.defaultGroup;


        /*
         * The locIndex is obtained from the localIndexs, with the current local code,
         * which contains the index position for each language supported
         **/
        var locIndex= this.localIndexs[GeoExt.Lang.locale];
        var groupNames;
        for (var group in this.groups) {

            /*
             * The groupNames array, obtained from the group name
             * splitted with the "localLabelSep" separator, contains
             * the group name for each language supported
             **/
            if(typeof this.groups[group] === "string"){
                groupNames=this.groups[group].split(this.localLabelSep);
                groupConfig= new Object();
            }else{
                if(typeof this.groups[group].title === "string") {
                groupNames=this.groups[group].title.split(this.localLabelSep);
                } else {
                    groupNames=this.groups[group].title;
                }
                groupConfig= this.groups[group];
            }
            /*
             * If the language is not supported, the group name
             * is the first contained in groupNames
             **/
            if(groupNames.length > 0){
                groupConfig.title= groupNames[locIndex] ? groupNames[locIndex] : groupNames[0];
            }

            //
            // Managing withe spaces in strings
            //
            var text = groupConfig.title;
            /*if(groupConfig.title.indexOf("_") != -1)
                text = text.replace(/_+/g, " ");   */

            treeRoot.appendChild(new GeoExt.tree.LayerContainer({
                text: text,
                iconCls: "gxp-folder",
                checked: false,
                expanded: true,
                group: group == defaultGroup ? undefined : group,
                loader: new GeoExt.tree.LayerLoader({
                    baseAttrs: groupConfig.exclusive ?
                        {checkedGroup: group} : undefined,
                    store: this.target.mapPanel.layers,
                    filter: (function(group) {
                        return function(record) {
                            return (record.get("group") || defaultGroup) == group &&
                                record.getLayer().displayInLayerSwitcher == true;
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

                                var titles = record.get('title');
                                if (titles && typeof titles != "string") {
                                    /*
                                     * If the language is not supported, the layer name
                                     * is the first contained in titles
                                     **/
                                    if(titles.length > 0){
                                        var layerTitle = (titles[locIndex] ? titles[locIndex] : titles[0]);
                                        record.set('title', layerTitle);
                                        layer.name = layerTitle;
                                    }
                                }
                            }
                        }

                        var node = GeoExt.tree.LayerLoader.prototype.createNode.apply(this, arguments);
                        addListeners(node, record);

                        return node;
                    }
                }),
                singleClickExpand: true,
                allowDrag: true,
                listeners: {
                    append: function(tree, node) {
                        if (this.collapsedGroups) {
                            node.collapse();
                        } else {
                            node.expand();
                        }
                    },
                    scope: this
                }
            }));
        }

        config = Ext.apply({
            xtype: "treepanel",
            root: treeRoot,
            rootVisible: false,
            localIndexs: this.localIndexs,
            localLabelSep: this.localLabelSep,
            border: false,
            enableDD: true,
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    beforeselect: function(selModel, node) {
                        var changed = true;
                        var layer = node && node.layer;
                        if (layer) {
                            var store = node.layerStore;
                            var record = store.getAt(store.findBy(function(r) {
                                return r.getLayer() === layer;
                            }));
                            this.selectionChanging = true;
                            changed = this.target.selectLayer(record);
                            this.selectionChanging = false;

                            this.target.selectGroup(null);
                        }else{
                            this.target.selectGroup(node);
                        }

                        return changed;
                    },
                    scope: this
                }
            }),
            listeners: {
                afterlayout: function(cmp, layout){
                    target.modified = false;
                    //modified = false;
                },
                contextmenu: function(node, e) {
                    if(node /*&& node.layer*/) {//NOTE: commented for enable menu for groups
                        node.select();
                        var tree = node.getOwnerTree();
                        if (tree.getSelectionModel().getSelectedNode() === node) {
                            var c = tree.contextMenu;
                            c.contextNode = node;
                            c.items.getCount() > 0 && c.showAt(e.getXY());
                        }
                    }
                },
                beforemovenode: function(tree, node, oldParent, newParent, i) {
                    this.oldParent = oldParent;
                    // change the group when moving to a new container
                    if(node.loader && i == 0 ){
                        this.nodeIndex = false;
                        return false;
                    }else{
                        this.nodeIndex = true;

                        if(node.attributes.group != "background"){
                            if(oldParent !== newParent) {
                                if(newParent.attributes.group != "background"){
                                    this.nodeIndex = false;
                                    try{
                                        var store = newParent.loader.store;
                                        var index = store.findBy(function(r) {
                                            return r.getLayer() === node.layer;
                                        });
                                        var record = store.getAt(index);
                                        record.set("group", newParent.attributes.group);
                                    }catch(e){
                                        return false;
                                    }
                                }else{
                                    return false;
                                }
                            }else{
                                if(node.loader){
                                    if(node.attributes.group != undefined){
                                        this.oldOffset = 0;
                                        var previous = node.previousSibling;

                                        while(previous != null){
                                            var childs = previous.childNodes.length;
                                            this.oldOffset += childs;
                                            previous = previous.previousSibling;
                                        }
                                    }else{
                                        return false;
                                    }
                                }
                            }
                        }else{
                            return false;
                        }
                    }
                },
                enddrag: function(tree, node, e){
                    target.modified = true;
                    //modified = true;

                    if(node.loader && node.attributes.group != undefined && this.nodeIndex){
                        var newOffset = 0;

                        var previous = node.previousSibling;
                        while(previous != null){
                            var childs = previous.childNodes.length;
                            newOffset += childs;
                            previous = previous.previousSibling;
                        }

                        var records = [];
                        var store = node.loader.store;

                        for(var i=0; i<node.childNodes.length; i++){
                            var recordIndex = store.findBy(function(r) {
                                return node.childNodes[i].layer === r.getLayer();
                            });

                            var record = store.getAt(recordIndex);
                            records.push({index: recordIndex, record: record});
                        }

                        for(var u=0; u<records.length; u++){
                            store.remove(records[u].record);
                        }

                        for(var k=records.length-1; k>=0; k--){
                            var indexOffset = this.oldOffset - newOffset;
                            store.insert(records[k].index + indexOffset, [records[k].record]);
                        }

                        window.setTimeout(function() {
                            for(var x=0; x<tree.root.childNodes.length; x++){
                                tree.root.childNodes[x].reload();
                            }
                        });
                    }else{
                        // //////////////////////////////////////////////////////////////////
                        // If the new parent is unchecked the new child must be unchecked
                        // //////////////////////////////////////////////////////////////////
                        var parent = node.parentNode;
                        if(parent.getUI().isChecked())
                            node.getUI().toggleCheck(true);
                        else
                            node.getUI().toggleCheck(false);

                        // /////////////////////////////////////////////////////////////
                        // If in the drag operation the old parent remains without
                        // checked nodes it must be unchecked
                        // /////////////////////////////////////////////////////////////
                        var oldChilds = this.oldParent.childNodes;
                        var size = oldChilds.length;
                        var checkedNodes = 0;
                        for(var d=0; d<size; d++){
                            if(oldChilds[d].getUI().isChecked()){
                                checkedNodes++;
                            }
                        }

                        if(checkedNodes < 1){
                            this.oldParent.getUI().toggleCheck(false)
                        }
                    }
                },
                checkchange: function(node, checked){
                    target.modified = true;
                    //modified = true;

                    if(!node.isLeaf()){
                        var childs = node.childNodes;
                        var size = childs.length;

                        if(!checked){
                            for(var i=0; i<size; i++){
                                childs[i].getUI().toggleCheck(checked);
                            }
                        }else{
                            var checkedNodes = 0;
                            for(var y=0; y<size; y++){
                                if(childs[y].getUI().isChecked())
                                    checkedNodes++;
                            }

                            if(checkedNodes < 1){
                                for(var z=0; z<size; z++){
                                    childs[z].getUI().toggleCheck(checked);
                                }
                            }
                        }
                    }else{
                        var parent = node.parentNode;
                        if(checked && !parent.getUI().isChecked()){
                            parent.getUI().toggleCheck(checked);
                        }else if(!checked && parent.getUI().isChecked()){
                            var childNodes = parent.childNodes;
                            var childSize = childNodes.length;

                            var checkedNodes = 0;
                            for(var t=0; t<childSize; t++){
                                if(parent.childNodes[t].getUI().isChecked())
                                    checkedNodes++;
                            }

                            if(checkedNodes == 0){
                                parent.getUI().toggleCheck(checked);
                            }
                        }
                    }
                },
                scope: this
            },
            contextMenu: new Ext.menu.Menu({
                items: []
            })
        }, config || {});

        var layerTree = gxp.plugins.LayerTree.superclass.addOutput.call(this, config);

        return layerTree;
    }
});

Ext.preg(gxp.plugins.LayerTree.prototype.ptype, gxp.plugins.LayerTree);
