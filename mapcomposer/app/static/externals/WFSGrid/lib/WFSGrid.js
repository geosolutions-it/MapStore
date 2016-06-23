/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires
 * include
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSGrid
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSGrid(config)
 *
 *    Plugin for displaying WFS features in a grid.
 */
gxp.plugins.WFSGrid = Ext.extend(gxp.plugins.TableableTool, {

	/** api: ptype = gxp_wfsgrid */
	ptype : "gxp_wfsgrid",

	/** api: config[id]
	 *  ``String``
	 *
	 */
	id : "wfsGridPanel",

	/** api: config[featureType]
	 *  ``String``
	 *
	 */
	featureType : null,

	/** api: config[wfsURL]
	 *  ``String``
	 *
	 */
	wfsURL : null,

	/** api: config[featureNS]
	 *  ``String``
	 *
	 */
	featureNS : null,

	/** api: config[srsName]
	 *  ``String``
	 *
	 */
	srsName : null,

	/** api: config[filter]
	 *  ``OpenLayers.Filter``
	 *
	 */
	filter : null,

	/** api: config[version]
	 *  ``String``
	 *
	 */
	version : null,

	/** api: config[pageSize]
	 *  ``Integer``
	 *
	 */
	pageSize : 10,

	/** api: config[autoRefreshInterval]
	 *  ``Integer``
	 *
	 */
	autoRefreshInterval : null,

	/** api: config[columns]
	 *  ``Array Object``
	 *
	 */
	columns : null,

	/** api: config[columns]
	 *  ``Array Object``
	 *
	 */
	actionColumns : null,

	/** api: config[sourcePrefix]
	 *  ``String``
	 *  Default prefix for sources layer title
	 */
	sourcePrefix : "Sources of ",

	// start i18n
	displayMsgPaging : "Displaying topics {0} - {1} of {2}",
	emptyMsg : "No topics to display",
	addLayerTooltip : "Add Layer to Map",
	helpTooltip : "Information",
	detailsTooltip : "View Details",
	deleteTooltip : "Delete Feature",
	deleteConfirmMsg : "Are you sure you want delete this feature?",
	detailsHeaderName : "Property Name",
	detailsHeaderValue : "Property Value",
	detailsWinTitle : "Details",
	// end i18n

	/** private: countFeature
	 *  ``Integer``
	 */
	countFeature : null,

	addLayerIconPath : "theme/app/img/silk/add.png",
	helpIconPath : "theme/app/img/silk/help.png",
	detailsIconPath : "theme/app/img/silk/information.png",
	deleteIconPath : "theme/app/img/silk/delete.png",
	addLayerTool : null,

	featureFields : null,
	geometryType : null,

	// config for the details action
	featureTypeDetails: null,


	/** api: config[wfsResumeID]
	 *  ``String`` identifier for the WFS Resume tool 
	 */
	wfsResumeID: "gxp_wfsresume",

	/** private: method[constructor]
	 */
	constructor : function(config) {
		gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);

		this.setTotalRecord();

		if (config.autoRefresh) {
			this.setAutoRefresh(config.autoRefresh);
		}
	},

	setTotalRecord : function(callback) {
		var hitCountProtocol = new OpenLayers.Protocol.WFS({
			url : this.wfsURL,
			featureType : this.featureType,
			readOptions : {
				output : "object"
			},
			featureNS : this.featureNS,
			resultType : "hits",
			filter : this.filter,
			//outputFormat : "text/xml",
			outputFormat : "application/json",
			maxFeatures : 1000000000,
			srsName : this.srsName,
			version : this.version
		});

		hitCountProtocol.read({
			callback : function(response) {
				this.countFeature = response.numberOfFeatures;
				if (callback)
					callback.call();
			},
			scope : this
		});
		
		return this.countFeature;
	},

	getSchema : function(callback, scope) {
		var schema = new GeoExt.data.AttributeStore({
			url : this.wfsURL,
			baseParams : {
				SERVICE : "WFS",
				VERSION : "1.1.0",
				REQUEST : "DescribeFeatureType",
				TYPENAME : this.featureType
			},
			autoLoad : true,
			listeners : {
				"load" : function() {
					callback.call(scope, schema);
				},
				scope : this
			}
		});
	},

	/** private: method[getAddLayerAction]
	 */
	getAddLayerAction : function(actionConf) {
		var addLayer = this.target.tools[this.addLayerTool];
		var addLayerTT = this.addLayerTooltip;
		var layerNameAtt = actionConf.layerNameAttribute || "layerName";
		var layerTitleAtt = actionConf.layerTitleAttribute || "name";
		var wsAtt = actionConf.wsNameAttribute || "wsName";
		var wmsURLAtt = actionConf.wmsURLAttribute || "outputUrl";
		var showEqualFilter = actionConf.showEqualFilter;
		var me = this;
		return {
			xtype : 'actioncolumn',
			sortable : false,
			width : 10,
			items : [{
				tooltip : addLayerTT,
				getClass : function(v, meta, rec) {
					this.items[0].tooltip = addLayerTT;
					if (showEqualFilter) {
						if (rec.get(showEqualFilter.attribute) == showEqualFilter.value) {
							return 'action-add-layer';
						} else {
							this.items[0].tooltip = null;
							return 'no-action-add-layer';
						}
					} else
						return 'action-add-layer';

				},
				handler : function(gpanel, rowIndex, colIndex) {
					var store = gpanel.getStore();
					var record = store.getAt(rowIndex);
					// prevent ExtJs to generate title
					var title = record.get(layerTitleAtt);
					if (title === undefined)
						title = record.get(layerNameAtt);

					addLayer.addLayer({
						msLayerTitle : title,
						msLayerName : record.get(wsAtt) + ":" + record.get(layerNameAtt),
						wmsURL : record.get(wmsURLAtt)
					}, function(r) {
						// only spm has source points to be displayed
						if (me.displaySource == true) {
							addLayer.addLayer({
								msLayerTitle : me.sourcePrefix + record.get(layerNameAtt),
								msLayerName : me.featureType,
								wmsURL : me.wmsURL,
								// the CQL_FILTER must be lowercase (see WMSSource)
								customParams : {
									cql_filter : 'layerName = \'' + record.get(layerNameAtt) + '\''
								},
								zoomAfterAdd : false
							});

							// TODO: temporary fix
							addLayer.zoomAfterAdd = true;
						}
					});
				}
			}]
		};
	},

	/** private: method[getDetailsAction]
	 */
	getDetailsAction : function(actionConf) {
		//TODO: Improve this to allow different output handling
		var me = this;
		return {
			xtype : 'actioncolumn',
			sortable : false,
			width : 10,
			items : [{
				icon : me.detailsIconPath,
				tooltip : me.detailsTooltip,
				scope : me,
				handler : function(gpanel, rowIndex, colIndex) {
					var store = gpanel.getStore();
					var record = store.getAt(rowIndex);
					if (!(record.data.itemStatus === 'COMPLETED')) {
						Ext.Msg.show({
						   title: this.detailsTooltip,
						   msg: record.data.itemStatusMessage,
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.WARNING
						});
						return;
					}

					var wfsResumeTool = me.target.tools[me.wfsResumeID];
                    
                    /*
                     * Check if featureType is "weatherstats" and check if "featureTypeDetails" === "stats"
                     * If so, if featureTypeDetails is not empty, the chart is add, otherwise the layers is added to the map
                     */
                    if (gpanel.featureType === "weatherstats" && me.featureTypeDetails === "stats"){
                        if(record.get(me.featureTypeDetails) !== ""){
                            var responseData = JSON.parse(record.get(me.featureTypeDetails));
                        }else{
                            if(wfsResumeTool){
                                var layerName = record.get("layerName");
                                wfsResumeTool.addLayer(layerName, "Raster", gpanel.featureType);
                            }
                            return;
                        }
                    }else{
                        var responseData = JSON.parse(record.get(me.featureTypeDetails));
                    }
                    
					responseData.jcuda          = record.data.jcuda;
					responseData.jobUid         = record.data.jobUid;
					responseData.indexName      = record.data.index;
					if (record.data.subindex)
						responseData.index.subindex = record.data.subindex;
					responseData.itemStatus     = record.data.itemStatus;

                    if(wfsResumeTool){
                    	var grid = wfsResumeTool.createResultsGrid(
                    		responseData, 
                    		responseData.rasterName, 
                    		me.parseYear(record.data.referenceFilter), me.parseYear(record.data.nowFilter), 
                    		record.data.referenceName, 
                    		me.featureType);
                    	
						/*
						 * Check if tabs exists and if we are allowed to render to a tab or a floating window
						 */
						var hasTabPanel = false;
						if (me.target.renderToTab) {
							var container = Ext.getCmp(me.target.renderToTab);
							if (container.isXType('tabpanel'))
								hasTabPanel = true;
						}
				
						if (hasTabPanel) {
							if (grid.win)
								grid.win.destroy();
							var now = new Date();
							grid.title += ' - ' + Ext.util.Format.date(now, 'H:i:s');
							container.add(grid);
							container.setActiveTab(container.items.length - 1);
						} else {
							if (me.resultWin)
								me.resultWin.destroy();
				
							//remove title to avoid double header
							grid.title = undefined;
				
							me.resultWin = new Ext.Window({
								width : 450,
								height : 450,
								layout : 'fit',
								title : grid.changeMatrixResultsTitle,
								constrainHeader : true,
								renderTo : me.target.mapPanel.body,
								items : [grid]
							});
							me.resultWin.show();
						}
						//if(this.win) this.win.destroy();
						grid.doLayout();
					}
				}
			}]
		};
	},

	/**
	 * private: method[parseYear]
	 */
	parseYear : function(filter) {
		if(filter.indexOf("time")<0)
			return null;

		year = filter.match(/\d{4}/);
		return year[0];
	},
	
	/** private: method[getHelpAction]
	 */
	getHelpAction: function(actionConf) {
		var idAtt = actionConf.idAttribute || "fid";
		var layerNameAtt = actionConf.layerNameAttribute || "layerName";
		var wsAtt = actionConf.wsNameAttribute || "wsName";

		var me = this;
		return {
			xtype : 'actioncolumn',
			sortable : false,
			width : 10,
			items : [{
				icon : me.helpIconPath,
				tooltip : me.helpTooltip,
				scope : me,
				handler : function(gpanel, rowIndex, colIndex) {
					var store = gpanel.getStore();
					var record = store.getAt(rowIndex);
					// var map = me.target.mapPanel.map;
					var mapPanel = me.target.mapPanel;
					var layerName = record.get(wsAtt) + ":" + record.get(layerNameAtt);
					var layerSrcTitle = me.sourcePrefix + record.get(layerNameAtt);
					
					var indexHtml = null;
					var indexAbstract = null;
					if(record.data.index) {
						for (var indexHelpData=0; indexHelpData<me.indexesHelpInfo.length; indexHelpData++) {
							if (me.indexesHelpInfo[indexHelpData]["name"] === record.data.index) {
								indexHtml     = me.indexesHelpInfo[indexHelpData]["html"];
								indexAbstract = me.indexesHelpInfo[indexHelpData]["abstract"];
							}
						}
					}

					var appInfo;
					if (indexHtml) {
						appInfo = new Ext.Panel({
							title: this.appInfoText,
							html: "<iframe style='border: none; height: 100%; width: 100%' src='"+indexHtml+"' frameborder='0' border='0'/>"
						});
					} else if (indexAbstract) {
						appInfo = new Ext.Panel({
							title: this.appInfoText,
							html: indexAbstract
						});
					} else {
						indexHtml     = me.indexesHelpInfo[0]["html"];
						indexAbstract = me.indexesHelpInfo[0]["abstract"];
						
						var html = null;
						if (indexHtml) html = "<iframe style='border: none; height: 100%; width: 100%' src='"+indexHtml+"' frameborder='0' border='0'/>";
						else           html = indexAbstract;
						
						appInfo = new Ext.Panel({
							title: this.appInfoText,
							html: html
						});
					}
					
					var win = new Ext.Window({
			            title: me.helpTooltip,
			            modal: true,
			            layout: "fit",
			            width: 640,
			            height: 460,
			            items: [appInfo]
			        });
			        win.show();
				}
			}]
		};
	},
 
	/** private: method[getDeleteAction]
	 */
	getDeleteAction : function(actionConf) {
		var idAtt = actionConf.idAttribute || "fid";
		var layerNameAtt = actionConf.layerNameAttribute || "layerName";
		var wsAtt = actionConf.wsNameAttribute || "wsName";

		var me = this;
		return {
			xtype : 'actioncolumn',
			sortable : false,
			width : 10,
			items : [{
				icon : me.deleteIconPath,
				tooltip : me.deleteTooltip,
				scope : me,
				handler : function(gpanel, rowIndex, colIndex) {
					var store = gpanel.getStore();
					var record = store.getAt(rowIndex);
					// var map = me.target.mapPanel.map;
					var mapPanel = me.target.mapPanel;
					var layerName = record.get(wsAtt) + ":" + record.get(layerNameAtt);
					var layerSrcTitle = me.sourcePrefix + record.get(layerNameAtt);
					Ext.MessageBox.confirm(me.deleteTooltip, me.deleteConfirmMsg, function showResult(btn) {

						if (btn == "yes") {
							var fidFilter = new OpenLayers.Filter.FeatureId({
								fids : [record.get(idAtt)]
							});

							var deleteProtocol = new OpenLayers.Protocol.WFS({
								url : me.wfsURL,
								featureType : me.featureType,
								readOptions : {
									output : "object"
								},
								featureNS : me.featureNS,
								filter : me.filter,
								outputFormat : "application/json",
								srsName : me.srsName,
								version : me.version
							});

							deleteProtocol.filterDelete(fidFilter, {
								callback : function(resp) {
									//
									// Remove the related layer from the layer tree
									//
									var layers = mapPanel.layers;
									layers.data.each(function(record, index, totalItems) {
										var name = record.get('name');
										var title = record.get('title');
										if (name == layerName || title == layerSrcTitle) {
											layers.remove(record);
										}
									});
									
									//
									// Remove all the involved plot tabs
									//
									var hasTabPanel = false;
									var container;
									if (me.target.renderToTab) {
										container = Ext.getCmp(me.target.renderToTab);
										if (container && container.isXType('tabpanel')){
											hasTabPanel = true;
										}
									}
							
									if (hasTabPanel) {
										var existingLayerTabs = container.find("rasterName", layerName.split(":")[1]);
										for(var i=0; i<existingLayerTabs.length; i++){
											if(existingLayerTabs[i]){
												container.remove(existingLayerTabs[i]);
											}
										}
									}
									
									me.refresh();
								}
							});
						}
					});
				}
			}]
		};
	},

	setFilter : function(filter) {
		this.filter = filter;
		this.setPage(1);
	},

	setAutoRefresh : function(ms) {
		var me = this;
		this.autoRefreshInterval = setInterval(function() {
			me.refresh()
		}, ms);
	},

	clearAutoRefresh : function() {
		if (this.autoRefreshInterval)
			clearInterval(this.autoRefreshInterval);
	},

	resetFilter : function() {
		this.filter = null;
		this.setPage(1);
	},

	refresh : function() {
		var pagID = this.id + "_paging";
		this.setTotalRecord(function() {
			var paging = Ext.getCmp(pagID);
			paging.doRefresh();
		});
	},

	setPage : function(pageNumber) {
		var pagID = this.id + "_paging";
		this.setTotalRecord(function() {
			var paging = Ext.getCmp(pagID);
			paging.changePage(pageNumber);
		});
	},

	/** api: method[addOutput]
	 */
	getPanelContent : function(config) {
		var me = this;
		me.setTotalRecord();
		var kk;

		var wfsGridPanel = new Ext.grid.GridPanel({
			title : this.title,
			header: false,
			store : [],
			id : this.id,
			layout : "fit",
			viewConfig : {
				forceFit : true
			},
			colModel : new Ext.grid.ColumnModel({
				columns : []
			}),
			listeners : {
				render : function() {

					//this.doLayout();
				}
			},
			bbar : new Ext.PagingToolbar({
				pageSize : this.pageSize,
				wfsParam : this,
				id : this.id + "_paging",
				store : /*wfsStore*/[],
				displayInfo : true,
				listeners : {
					render : function() {
						this.last.setVisible(false);
						//this.doLayout();
					},
					"beforechange" : function(paging, params) {
						paging.store.removeAll(true);
						paging.store.proxy = new GeoExt.data.ProtocolProxy({
							protocol : new OpenLayers.Protocol.WFS({
								url : this.wfsParam.wfsURL,
								featureType : this.wfsParam.featureType,
								readFormat : new OpenLayers.Format.GeoJSON(),
								featureNS : this.wfsParam.featureNS,
								filter : this.wfsParam.filter,
								sortBy : {
									property : "runEnd",
									order : "DESC"
								},
								maxFeatures : params.limit,
								startIndex : params.start,
								outputFormat : "application/json",
								srsName : this.wfsParam.srsName,
								version : this.wfsParam.version
							})
						});
					}
				},
				displayMsg : this.displayMsgPaging,
				emptyMsg : this.emptyMsg
			})
		});

		config = Ext.apply(wfsGridPanel, config || {});
		//var wfsGrid = gxp.plugins.WFSGrid.superclass.getPanel.call(this, config);
		var wfsGrid = config;

		this.getSchema(function(schema) {
			this.featureFields = new Array();
			var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
			var types = {
				"xsd:boolean" : "boolean",
				"xsd:int" : "int",
				"xsd:integer" : "int",
				"xsd:short" : "int",
				"xsd:long" : "int",
				/*  "xsd:date": "date",
				 "xsd:dateTime": "date",*/
				"xsd:date" : "string",
				"xsd:dateTime" : "string",
				"xsd:string" : "string",
				"xsd:float" : "float",
				"xsd:double" : "float"
			};
			schema.each(function(r) {
				var match = geomRegex.exec(r.get("type"));
				if (match) {
					geometryName = r.get("name");
					me.geometryType = match[1];
				} else {
					var type = types[r.get("type")];
					var field = {
						name : r.get("name"),
						type : type
					};
					/* if (type == "date") {
					 field.dateFormat = "Y-m-d H:i:s";
					 }"format": "Y-m-d H:i:s"*/
					me.featureFields.push(field);
				}
			}, this);

			var wfsStore = new GeoExt.data.FeatureStore({
				wfsParam : me,
            	listeners:{
            		'load': function(store, records, options){
                        if(wfsGrid.rendered){
                            var selModel = wfsGrid.getSelectionModel();
                            selModel.selectFirstRow();
                        }
                    }
            	},                
				sortInfo : {
					field : "runEnd",
					direction : "DESC"
				},
				id : this.id + "_store",
				fields : me.featureFields,
				loadRecords : function(o, options, success) {
					if (this.isDestroyed === true) {
						return;
					}
					if (!o || success === false) {
						if (success !== false) {
							this.fireEvent('load', this, [], options);
						}
						if (options.callback) {
							options.callback.call(options.scope || this, [], options, false, o);
						}
						return;
					}
					
					var parent = me;
					me = this;
					parent.setTotalRecord(
						function() {
							
							o.totalRecords = parent.countFeature;
							var r = o.records, t = o.totalRecords || r.length;
							if (!options || options.add !== true) {
								if (me.pruneModifiedRecords) {
									me.modified = [];
								}
								for (var i = 0, len = r.length; i < len; i++) {
									r[i].join(me);
								}
								if (me.snapshot) {
									me.data = me.snapshot;
									delete me.snapshot;
								}
								me.clearData();
								me.data.addAll(r);
								me.totalLength = t;
								me.applySort();
								me.fireEvent('datachanged', me);
							} else {
								me.totalLength = Math.max(t, me.data.length + r.length);
								me.add(r);
							}
							me.fireEvent('load', me, r, options);
							if (options.callback) {
								options.callback.call(options.scope || me, r, options, true);
							}
							
							me = parent;
						}
					);
				},
				proxy : new GeoExt.data.ProtocolProxy({
					protocol : new OpenLayers.Protocol.WFS({
						url : me.wfsURL,
						featureType : me.featureType,
						readFormat : new OpenLayers.Format.GeoJSON(),
						featureNS : me.featureNS,
						filter : me.filter,
						maxFeatures : me.pageSize,
						sortBy : {
							property : "runEnd",
							order : "DESC"
						},
						startIndex : 0,
						outputFormat : "application/json",
						srsName : me.srsName,
						version : me.version
					})
				}),
				autoLoad : true
			});

			var columns = [];

			if (me.actionColumns) {
				for ( kk = 0; kk < me.actionColumns.length; kk++) {
					switch (me.actionColumns[kk].type) {
						case "help":
							columns.push(me.getHelpAction(me.actionColumns[kk]));
							break;						
						case "addLayer":
							columns.push(me.getAddLayerAction(me.actionColumns[kk]));
							break;
						case "details":
							columns.push(me.getDetailsAction(me.actionColumns[kk]));
							break;
						case "delete":
							columns.push(me.getDeleteAction(me.actionColumns[kk]));
							break;
					}
				}
			}

			if (me.columns) {
				for ( kk = 0; kk < me.columns.length; kk++) {
					columns.push(me.columns[kk]);
				}
			} else {
				for ( kk = 0; kk < me.featureFields.length; kk++) {
					columns.push({
						header : me.featureFields[kk].name,
						dataIndex : me.featureFields[kk].name,
						sortable : true
					});
				}
			}

			wfsGrid.reconfigure(wfsStore, new Ext.grid.ColumnModel({
				columns : columns
			}));

			wfsGrid.getBottomToolbar().bind(wfsStore);

		}, this);
		//Ext.getCmp(this.outputTarget).setActiveTab(wfsGrid);

		///opt/tomcat_gui/webapps/xmlJsonTranslate/tem

		return wfsGrid;
	}
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
