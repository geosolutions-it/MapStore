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
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
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
	layerNodeName: "Resources",
	
	/** api: config[waitMsg]
     *  ``String``
     */
	waitMsg: "Loading Resources",
	
	/** api: config[expandAllText]
     *  ``String``
     */
	expandAllText: "Expand All Nodes",
	
	/** api: config[collapseAllText]
     *  ``String``
     */
	collapseAllText: "Collapse All Nodes",
	
	/** api: config[expandServices]
     *  ``boolean``
	 *  This property is used to change the representation of the imported resource in a tree:
	 *  If true ... TODO
	 *  If false ... TODO
     */
	expandServices: false,
	
    /** api: config[showAllLayers]
     *  ``boolean``
     */
	showAllLayers: false,
	
	/** api: config[disableAllNotifications]
     *  ``boolean``
     */
	disableAddLayerNotifications: true,
    
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
				this.addLayerTool.disableAllNotifications = this.disableAddLayerNotifications;
				
				this.layerTreePanel = Ext.getCmp("layertree");
				
				//
				// Enable this panel by default.
				//
				var westContainer = Ext.getCmp("west");
				
				if(westContainer && westContainer instanceof Ext.TabPanel){
					var tree = Ext.getCmp(this.outputConfig.id);
					westContainer.setActiveTab(tree);
					
					this.mask = new Ext.LoadMask(tree.getEl(), {msg: this.waitMsg});
					//this.mask.show();
				}	
				
				this.addLayerTool.on({
					'ready' : function(records){
						var layerRecords = [];
						this.mask.show();
						
						for(var k=0; k<records.length; k++){
							var record = records[k];
							var opts = {
								leaf: record.report.type == "service" ? (this.expandServices === true ? false : true) : true,							
								text: record.report.title || record.report.name,
								name: record.report.name,
								url: record.report.url,
								type: record.report.type,
								msg: record.report.msg,
								sourceId: record.report.id,
								record: record.record && record.data ? record.record.clone() : record.record
							};
							
							if(record.report.type != "service"){
								opts.checked = true;
							}else{
								opts.expanded = true;
							}
							
							//
							// Find or create the parent (group) node for this node if any;
							//
							var parent;
							if(record.report.group){
								parent = this.getParentGroup(record.report);
							}
						
							var node = new Ext.tree.TreeNode(opts);						
							var parentNode = parent || this.treeRoot.findChild("id", "resource-node");
							
							if(record.report.type == "service"){
								// If we have a group parent node we have to use it
								parentNode.appendChild(node);
								
								// If report contains 'msg' there was an error
								if(record.report.msg){
									node.setIconCls("gx-tree-resource-icon-error");
									node.setCls("service_error");
									this.setServiceNodeError(node);
								}else{
									if(this.expandServices === true){
										this.populateServiceNode(node);
									}else{
										node.setIconCls("gx-tree-resource-icon-add");
										this.showServiceLayerNodeAvailable(node);
									}
								}										
							}else{
								// If we have a group parent node we have to use it
								parentNode.appendChild(node);
								
								node.setIconCls("gx-tree-resource-icon");
								this.joinNodeWithLayerTreeNode(node);
								
								if(this.expandServices === true){
									layerRecords.push(record);
								}
							}
						}	

						if(this.expandServices === true){
							this.setServiceNodes(layerRecords);
						}
						
						this.mask.hide();
					},
					scope: this
				});
				
				if(this.layerTreePanel){
					this.layerTreePanel.on({
						'checkchange' : function(node, checked){
							if(node.isLeaf() && node.attributes.layer.params){
								var nodesToCheck = [];									
								
								var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
								resourcesRootNode.eachChild(function(importedNode){
									if(importedNode.isLeaf()){
									    //
										// In this case we have a layer resource node
										//
										var layer = importedNode.attributes.record.getLayer();
										if(importedNode.attributes.type == "layer" && layer.name == node.attributes.layer.name 
											&& layer.url == node.attributes.layer.url){
											nodesToCheck.push(importedNode);
										}
									}else{
										//
										// In this case we can have a group node or a service resource node
										//
										importedNode.eachChild(function(resourceChild){
											if(resourceChild.isLeaf() && resourceChild.attributes.type == "layer"){
												var l = resourceChild.attributes.record.getLayer();
												if(l.name == node.attributes.layer.name && l.url == node.attributes.layer.url){
													nodesToCheck.push(resourceChild);
												}
											}else{
												// In this case we find a layer inside a service resource node
												var layerNode = resourceChild.findChildBy(function(n){	
													var layer = n.attributes.record.getLayer();
													if(layer.name == node.attributes.layer.name && layer.url == node.attributes.layer.url){
														return true;
													}									
												}, this);
												
												if(layerNode){
													nodesToCheck.push(layerNode);
												}	
											}
										}, this);
									}									
								}, this);
									
								if(nodesToCheck){
									for(var i=0; i<nodesToCheck.length; i++){
										if(nodesToCheck[i]){
											nodesToCheck[i].getUI().toggleCheck(checked);
										}
									}
								}
							}
						}, 
						'beforeremove': function(tree, parent, node){
							if(node.isLeaf() && node.attributes.layer.params){								
								var nodesRestore = [];									
								
								var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
								resourcesRootNode.eachChild(function(importedNode){
									if(importedNode.isLeaf()){
									    //
										// In this case we have a layer resource node
										//
										var layer = importedNode.attributes.record.getLayer();
										if(importedNode.attributes.type == "layer" && layer.name == node.attributes.layer.name 
											&& layer.url == node.attributes.layer.url/*importedNode.text == text*/){
											nodesRestore.push(importedNode);
										}
									}else{
										//
										// In this case we can have a group node or a service resource node
										//
										if(importedNode.attributes.type == "service"){
											// //////////////////////////////////////////////////////////////////////
											// If the node represent a layer of a service resource node, uncheck the 
											// node before the GXP LayerTree's reload (see also the load event). In 
											// order to avoid events tree conflicts, the only way to do this is 
											// restoring the node.
											// ///////////////////////////////////////////////////////////////////////
											importedNode.eachChild(function(layerChild){
												var layer = layerChild.attributes.record.getLayer();
												if(layer.name == node.attributes.layer.name && layer.url == node.attributes.layer.url){
													this.nodeRestore(layerChild, true, true);
												}
											}, this);
										}else{
											importedNode.eachChild(function(resourceChild){
												if(resourceChild.isLeaf() && resourceChild.attributes.type == "layer"){
													var l = resourceChild.attributes.record.getLayer();
													if(l.name == node.attributes.layer.name && l.url == node.attributes.layer.url){
														// If the node is a layer's resource node
														nodesRestore.push(resourceChild);
													}
												}else if(resourceChild.attributes.type == "service" && this.expandServices === true){
													// //////////////////////////////////////////////////////////////////////
													// If the node represent a layer of a service resource node, uncheck the 
													// node before the GXP LayerTree's reload (see also the load event). In 
													// order to avoid events tree conflicts, the only way to do this is 
													// restoring the node.
													// ///////////////////////////////////////////////////////////////////////
													resourceChild.eachChild(function(layerChild){
														var layer = layerChild.attributes.record.getLayer();
														if(layer.name == node.attributes.layer.name && layer.url == node.attributes.layer.url){
															this.nodeRestore(layerChild, true, true);
														}
													}, this);
																									
												}
											}, this);
										}			
									}
									
								}, this);
									
								if(nodesRestore){
									for(var i=0; i<nodesRestore.length; i++){
										if(nodesRestore[i]){
											this.nodeRestore(nodesRestore[i], true);	
										}
									}
								}
							}
						},
						'load': function(tree, parent, node){							
							/*if(this.expandServices === true){
								var root = this.layerTreePanel.getRootNode();
								var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
								
								root.eachChild(function(layerTreeChild){
									layerTreeChild.eachChild(function(layerTreeNode){
										if(layerTreeNode.attributes.group != 'background'){
											var url = layerTreeNode.attributes.layer.url;
											var layerName = layerTreeNode.attributes.layer.name;
										
											resourcesRootNode.eachChild(function(importedNode){
												if(!importedNode.isLeaf()){
													//
													// with groups provided
													//
													importedNode.eachChild(function(resourceChild){
														if(resourceChild.attributes.type == "service"){
															// /////////////////////////////////////////////////////////
															// If the layer node (in LayerTree) have a conrispondence 
															// in a resource service node, (in ResourcesTree) align the 
															// second one during the LayerTree reload.
															// /////////////////////////////////////////////////////////
															resourceChild.eachChild(function(serviceChild){
																var layer = serviceChild.attributes.record.getLayer();
																if(layer.name == layerName && layer.url == url){
																	var checked = layerTreeNode.getUI().isChecked();
																	//serviceChild.getUI().toggleCheck(checked);
																}
															}, this);
														}
													}, this);
												}								
											}, this);
										}
									}, this);							
								}, this);
							}*/						
						},
						scope: this
					});
				}				
			},
			scope: this
		});
        
		return gxp.plugins.ResourceStatus.superclass.init.apply(this, arguments);
    },
	
	/** private: method[setServiceNodes]
     *  :arg layerRecords: ``Array``
	 * 
	 *  Used at startup after loading resources in teh tree in order to set the checks 
	 *  accordingly the layer present in the map.
     */
	setServiceNodes: function(layerRecords){
		var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
		
		resourcesRootNode.eachChild(function(importedNode){
			if(importedNode.attributes.type == "service"){
				importedNode.eachChild(function(layerChild){				
					var layer = layerChild.attributes.record.getLayer();
					for(var j=0; j<layerRecords.length; j++){
						var addedLayer = layerRecords[j].record.getLayer();
						if(layer.name == addedLayer.name && layer.url == addedLayer.url){
							layerChild.getUI().toggleCheck(true);
						}
					}					
				}, this);
			}else{
				importedNode.eachChild(function(resourceChild){				
					if(!resourceChild.isLeaf() && resourceChild.attributes.type == "service"){
						resourceChild.eachChild(function(layerChild){						
							var layer = layerChild.attributes.record.getLayer();
							for(var j=0; j<layerRecords.length; j++){
								var addedLayer = layerRecords[j].record.getLayer();
								if(layer.name == addedLayer.name && layer.url == addedLayer.url){
									layerChild.getUI().toggleCheck(true);
								}
							}							
						}, this);
					}					
				}, this);
			}		
		}, this);
	},
	
	/** private: method[nodeRestore]
     *  :arg node: ``Ext.TreeNode``
	 *  :arg def: ``boolean``
	 *  :arg isServiceLayer: ``boolean``
	 * 
	 *  Restore a node when required after user operations
     */
	nodeRestore: function(node, def, isServiceLayer){	
		if(isServiceLayer === true){
			def = true;
		}
		
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
			if(layer){
				if(layer.getVisibility()){
					opts.checked = true;
				}else{
					opts.checked = false;
				}	
			}else{
				if(isServiceLayer === true){
					opts.checked = false;
				}else{
					def = false;
				}				
			}		
		}
	
		var newNode = new Ext.tree.TreeNode(opts);	
			
		var layersRootNode = node.parentNode;		
		layersRootNode.removeChild(node, true);		
		
		layersRootNode.appendChild(newNode);
		
		if(def){
			if(isServiceLayer === true){
				newNode.setIconCls("gx-tree-layer-icon");				
				this.setServiceLayerNodeListener(newNode, false);
			}else{
				newNode.setIconCls("gx-tree-resource-icon");
				this.joinNodeWithLayerTreeNode(newNode);
			}
		}else{
			newNode.setIconCls("gx-tree-resource-icon-add");
			this.setLayerNodeToAdd(newNode);
		}
	},
	
	/** private: method[getParentGroup]
     *  :arg report: ``Object``
	 * 
	 *  Finf or create the resource group for imported resource if provided from the resource report
	 *  (see also gxp.AddLayer)
     */
	getParentGroup: function(report){
        var parent = this.treeRoot.findChild("id", "resource-node");			
		var groupNode = parent.findChild("name", report.group);
		
		if(!groupNode){		
			var opts = {
				leaf: false,							
				text: report.group,
				name: report.group,
				expanded: true,
				type: "group"
			};	
			
			groupNode = new Ext.tree.TreeNode(opts);
			parent.appendChild(groupNode);			
		}
		
		return groupNode;
	},
	
	/** private: method[joinNodeWithLayerTreeNode]
     *  :arg node: ``Ext.TreeNode``
	 * 
	 *  Align the layers elements check event betwee the gxp.LayerTree and the gxp.ResourceStatus tree
     */
	joinNodeWithLayerTreeNode: function(node){
		node.on({
			'checkchange': function(node, evt){
				var map = this.target.mapPanel.map;
				var layer = map.getLayersByName(node.attributes.record.data.layer.name)[0];
				layer.setVisibility(node.attributes.checked);
			},
			scope: this
		});
	},
	
	/** private: method[setLayerNodeToAdd]
     *  :arg node: ``Ext.TreeNode``
	 * 
	 *  Set the 'click' listener for a layer resource node. 
	 *  The listener add the layer to the gxp.LayerTree and performs some required check 
	 *  on services nodes.
     */
	setLayerNodeToAdd: function(node){	
		node.on({
			'click': function(node, evt){
				var layerStore = this.target.mapPanel.layers;  
				layerStore.add([node.attributes.record]);

				this.nodeRestore(node, true);
				
				// /////////////////////////////////////////////////////////
				// In case of services expanded in the resource tree, at 
				// this point we have also to check nodes representing the 
				// same layer in other WMS service nodes(eg. other imported 
				// WMS resource services that include this layer) if any. 
				// /////////////////////////////////////////////////////////
				if(this.expandServices === true){
					var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
					
					var url = node.attributes.record.getLayer().url;
					var layerName = node.attributes.record.getLayer().name;
				
					resourcesRootNode.eachChild(function(importedNode){
						if(!importedNode.isLeaf()){
							//
							// Here we can have a group or a service resource node
							//
							if(importedNode.attributes.type == "service"){
								// If the node is a layer of a resource service node											
								importedNode.eachChild(function(serviceChild){
									var layer = serviceChild.attributes.record.getLayer();
									if(layer.name == layerName && layer.url == url){
										serviceChild.getUI().toggleCheck(true);
									}
								}, this);
							}else{
								importedNode.eachChild(function(resourceChild){
									if(resourceChild.attributes.type == "service"){
										// If the node is a layer of a resource service node											
										resourceChild.eachChild(function(serviceChild){
											var layer = serviceChild.attributes.record.getLayer();
											if(layer.name == layerName && layer.url == url){
												serviceChild.getUI().toggleCheck(true);
											}
										}, this);
									}
								}, this);
							}
						}								
					}, this);
				}
			},
			scope: this
		});
	},
	
	/** private: method[setServiceNodeError]
     *  :arg node: ``Ext.TreeNode``
     *
	 *  Set the 'click' event in order to show the error message foe a service unrecheable 
     */
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
	
	/** private: method[showServiceLayerNodeAvailable]
     *  :arg node: ``Ext.TreeNode``
	 *
	 *  Used in order to set the 'click'  listener for a service unexpanded node.
	 *  When the node is clicked the AddLayers dialog is shown.
     */
	showServiceLayerNodeAvailable: function(node){
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
	
	/** private: method[populateServiceNode]
     *  :arg node: ``Ext.TreeNode``
	 *
	 *  Populate a service resource nodes with layers records from the loaded WMS source 
     */
	populateServiceNode: function(node){
		var source = this.target.layerSources[node.attributes.sourceId];
				
		// //////////////////////////////////////////////
		// List oll layers inside the service
		// //////////////////////////////////////////////
		switch(source.ptype){
			case "gxp_wmssource":
			case "gxp_wmtssource":
				var store = source.store;
				if (store) {
					var records = store.getRange();

					var size = store.getCount();
					for(var i=0; i<size; i++){
						var record = records[i]; 		
						
						var opts = {
							leaf: true,		
							checked: false,
							text: record.data.title || record.data.name,
							name: record.data.name,
							type: "layer",
							sourceId: node.attributes.sourceId,
							record: record.clone()
						};
						
						var layerNode = new Ext.tree.TreeNode(opts);	
						layerNode.setIconCls("gx-tree-layer-icon");
						
						node.appendChild(layerNode);
						
						this.setServiceLayerNodeListener(layerNode, true);
					}              
				}
		}
	},
	
	/** private: method[setServiceLayerNodeListener]
     *  :arg layerNode: ``Ext.TreeNode``
	 *  :arg checked: ``boolean``
	 * 
	 *  Set the 'checkchange' listener for all layers inside a resource service node 
     */
	setServiceLayerNodeListener: function(layerNode, checked){
		layerNode.on({
			'checkchange': function(node, evt){
				var map = this.target.mapPanel.map;
				var layer = map.getLayersByName(node.attributes.record.data.layer.name)[0];
				if(layer){
					layer.setVisibility(node.attributes.checked);
				}else if(node.attributes.checked == true){
					var layerStore = this.target.mapPanel.layers;  
					
					var nodeRecord = node.attributes.record;
					var source = this.target.layerSources[node.attributes.sourceId];
									
					var layerDefaultProps = {
						name: nodeRecord.get("name"),
						title: nodeRecord.get("title"),
						source: node.attributes.sourceId
					};	
					
					var record = source.createLayerRecord(layerDefaultProps);
					layerStore.add([record]);
					
					// /////////////////////////////////////////////////////////
					// At this point we have to restore:
					// 1 - Other conresponding resource layer nodes if any. 
					// 2 - Other layer nodes inside the resources service nodes 
					//     if any.
					// /////////////////////////////////////////////////////////
					var resourcesRootNode = this.treeRoot.findChild("id", "resource-node");
					
					var url = node.attributes.record.getLayer().url;
					var layerName = node.attributes.record.getLayer().name;
				
					resourcesRootNode.eachChild(function(importedNode){					
						if(importedNode.attributes.type == "group"){  // with groups						
							importedNode.eachChild(function(groupChild){
								if(groupChild.attributes.type == "service"){  // service type
									// If the node is a layer of a resource service node											
									groupChild.eachChild(function(layerChild){
										var layer = layerChild.attributes.record.getLayer();
										if(layer.name == layerName && layer.url == url){
											layerChild.getUI().toggleCheck(true);
										}
									}, this);
								}else{ // layer type
									this.nodeRestore(groupChild, true);
								}
							}, this);
						}else if(importedNode.attributes.type == "service"){ // with no groups (service node)
								importedNode.eachChild(function(layerChild){
									var layer = layerChild.attributes.record.getLayer();
									if(layer.name == layerName && layer.url == url){
										layerChild.getUI().toggleCheck(true);
									}
								}, this);
						}else{ // with no groups (layer node)
							this.nodeRestore(importedNode, true);
						}					
					}, this);
					
				}							
			},
			scope: this
		});
		
		if(checked){
			layerNode.getUI().toggleCheck(this.showAllLayers === true ? true : false);
		}
	},					

    /** private: method[addOutput]
     *  :arg config: ``Object``
	 *
	 *  Create the GUI of this plugin using the config provided  
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
			autoScroll: true,
			tbar: new Ext.Toolbar({
				items: [
					'->',
					{
						iconCls: "tree-icon-expand-all",
						tooltip: this.expandAllText,
						handler: function(){
							var tree = Ext.getCmp(this.outputConfig.id);
							tree.expandAll();
						},
						scope: this
					},
					{
						iconCls: "tree-icon-collapse-all",
						tooltip: this.collapseAllText,
						handler: function(){
							var tree = Ext.getCmp(this.outputConfig.id);
							tree.collapseAll();
						},
						scope: this
					}
				]
			}),
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
		
		var resourceNode = new Ext.tree.TreeNode({
			text: this.layerNodeName,
			id: "resource-node",
			expanded: true,
			singleClickExpand: true,
			iconCls: 'gx-tree-resource-folder-icon'
		});
		resourceTree.getRootNode().appendChild(resourceNode);	
		
		return resourceTree;
    }

});

Ext.preg(gxp.plugins.ResourceStatus.prototype.ptype, gxp.plugins.ResourceStatus);
