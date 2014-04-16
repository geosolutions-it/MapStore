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
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ResourceStatus
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ResourceStatus(config)
 *
 */
gxp.plugins.ResourceStatus = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_resourcestatus */
    ptype: "gxp_resourcestatus",
	
	/** api: config[rootNodeText]
     *  ``String``
     *  Text for root node of resources tree (i18n).
     */
    rootNodeText: "Imported Resources",
	
	/** api: config[serviceErrorTitle]
     *  ``String``
     */
	serviceErrorTitle: "Service Error",
	
    /** api: config[tabTitle]
     *  ``String``
     */
	tabTitle: "Imported",
	
	/** api: config[layerNodeName]
     *  ``String``
     */
	layerNodeName: "Layers",
	
	/** api: config[serviceNodeName]
     *  ``String``
     */
	serviceNodeName: "Services",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.ResourceStatus.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
     *  :arg target: ``Object``
	 * 
	 *  Provide the initialization code defining necessary listeners and controls.
     */
	init: function(target) {
		//
		// Manage the report of the added resources (layers on WMS services)
		//		
		target.on({
			'ready' : function(){
			    this.addLayerTool = this.target.tools["addlayer"];
				this.addLayerTool.disableAllNotifications = true;
				
				this.layerTreePanel = Ext.getCmp("layertree");
				
				//
				// Enable this panel by default.
				//
				var westContainer = Ext.getCmp("west");
				
				if(westContainer && westContainer instanceof Ext.TabPanel){
					var tree = Ext.getCmp(this.outputConfig.id);
					westContainer.setActiveTab(tree);
				}	
				
				this.addLayerTool.on({
					'ready' : function(record, report){		
						var opts = {
							leaf: true,							
							text: report.title || report.name,
							name: report.name,
							url: report.url,
							type: report.type,
							msg: report.msg,
							sourceId: report.id,
							record: record
						};
						
						if(report.type != "service"){
							opts.checked = true;
						}
						
						var node = new Ext.tree.TreeNode(opts);						
						
						if(report.type == "service"){
							var servicesNode = this.treeRoot.findChild("id", "services-node");
							servicesNode.appendChild(node);
							
							// If report contains 'msg' there was an error
							if(report.msg){
								node.setIconCls("gx-tree-resource-icon-error");
								this.setServiceNodeError(node);
							}else{
								node.setIconCls("gx-tree-resource-icon-add");
								this.setServiceNodeAvailable(node);
							}							
						}else{
							var layersNode = this.treeRoot.findChild("id", "layers-node");
							layersNode.appendChild(node);							
							node.setIconCls("gx-tree-resource-icon");
							this.joinNodeWithLayerTreeNode(node);
						}			
					},
					scope: this
				});
				
				if(this.layerTreePanel){
					this.layerTreePanel.on({
						'checkchange' : function(node, evt){
							if(node.isLeaf()){
								var layerNode = this.treeRoot.findChild("name", node.attributes.layer.params.LAYERS, true);
								
								if(layerNode){	
									layerNode.getUI().toggleCheck(node.attributes.checked);
								}
							}
						}, 
						'beforeremove': function(tree, parent, node){
							if(node.isLeaf()){
								var layerNode = this.treeRoot.findChild("name", node.attributes.layer.params.LAYERS, true);
								
								if(layerNode){			
									this.nodeRestore(layerNode, false);								
								}
							}
						},
						'load': function(tree, parent, thenode){
							var layersRootNode = this.treeRoot.findChild("id", "layers-node");	
							var root = this.layerTreePanel.getRootNode();

							var nodesToRestore = [];
							layersRootNode.eachChild(function(node){
							
								var text = node.text;
															
								var layerNode = root.findChildBy(function(n){
								
									if(n.layer && (n.layer.name == text)){
										return true;
									}
									
								}, this, true);
								
								if(layerNode){
									nodesToRestore.push(node);
								}
								
							}, this);
							
							for(var i=0; i<nodesToRestore.length; i++){
								var node = nodesToRestore[i];
								this.nodeRestore(node, true);
							}
						},
						scope: this
					});
				}				
			},
			scope: this
		});
        
		return gxp.plugins.ResourceStatus.superclass.init.apply(this, arguments);
    },
	
	nodeRestore: function(node, def){
		var opts = {
			leaf: true,
			text: node.attributes.text,
			name: node.attributes.name,
			url: node.attributes.url,
			type: node.attributes.type,
			msg: node.attributes.msg,
			sourceId: node.attributes.sourceId,
			record: node.attributes.record
		};
		
		if(def){
			var layer = this.target.mapPanel.map.getLayersByName(opts.record.data.layer.name)[0];
			if(layer.getVisibility()){
				opts.checked = true;
			}else{
				opts.checked = false;
			}			
		}
	
		var newNode = new Ext.tree.TreeNode(opts);	
			
		var layersRootNode = this.treeRoot.findChild("id", "layers-node");			
		layersRootNode.removeChild(node, true);		
		
		layersRootNode.appendChild(newNode);
		
		if(def){
			newNode.setIconCls("gx-tree-resource-icon");
			this.joinNodeWithLayerTreeNode(newNode);
		}else{
			newNode.setIconCls("gx-tree-resource-icon-add");
			this.setLayerNodeToAdd(newNode);
		}
	},
	
	joinNodeWithLayerTreeNode: function(node){
		// //////////////////
		// Set visibility
		// //////////////////
		node.on({
			'checkchange': function(node, evt){
				var map = this.target.mapPanel.map;
				var layer = map.getLayersByName(node.attributes.record.data.layer.name)[0];
				layer.setVisibility(node.attributes.checked);
			},
			scope: this
		});
	},
	
	setLayerNodeToAdd: function(node){	
		node.on({
			'click': function(node, evt){
				var layerStore = this.target.mapPanel.layers;  
				layerStore.add([node.attributes.record]);

				this.nodeRestore(node, true);
			},
			scope: this
		});
	},
	
	setServiceNodeError: function(node){
		node.on({
			'click': function(node, evt){
				Ext.Msg.show({
					 title: this.serviceErrorTitle,
					 msg: node.attributes.msg,
					 width: 300,
					 icon: Ext.MessageBox.ERROR
				});  
			},
			scope: this
		})
	},
	
	setServiceNodeAvailable: function(node){
		node.on({
			'click': function(node, evt){
				var addLayerAction = this.target.tools["addlayers"];
				addLayerAction.showCapabilitiesGrid();
				
				//
				// Select requested source
				//
				var combo = addLayerAction.getSourceComboBox();
				
				var store = combo.getStore();
				
				var index = store.find('id', node.attributes.sourceId);
				var record = store.getAt(index);
				
				combo.onSelect(record, 0);
			},
			scope: this
		})
	},

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
	    this.treeRoot = new Ext.tree.TreeNode({
            text: this.rootNodeText,
            expanded: true,
            isTarget: false,
            allowDrop: true
        });
		
		config = Ext.apply({
            xtype: "treepanel",
			title: this.tabTitle,
            root: this.treeRoot,
            rootVisible: false,
            border: false,
            enableDD: false,
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    beforeselect: function(selModel, node) {
                    },
                    scope: this
                }
            }),
            listeners: {
                afterlayout: function(cmp, layout){
                },
                contextmenu: function(node, e) {
                },
                checkchange: function(node, checked){  
				},
                scope: this
            },
            contextMenu: new Ext.menu.Menu({
                items: []
            })
        }, config || {});

        var resourceTree = gxp.plugins.ResourceStatus.superclass.addOutput.call(this, config);
		
		var servicesNode = new Ext.tree.TreeNode({
            text: this.serviceNodeName,
			id: "services-node",
            expanded: true,
			singleClickExpand: true,
			iconCls: 'gx-tree-resource-folder-icon'
        });
		resourceTree.getRootNode().appendChild(servicesNode);
		
		var layersNode = new Ext.tree.TreeNode({
            text: this.layerNodeName,
			id: "layers-node",
            expanded: true,
			singleClickExpand: true,
			iconCls: 'gx-tree-resource-folder-icon'
        });
		resourceTree.getRootNode().appendChild(layersNode);
		
		return resourceTree;
    }

});

Ext.preg(gxp.plugins.ResourceStatus.prototype.ptype, gxp.plugins.ResourceStatus);
