/*
*  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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

/** api: (define)
 *  module = mxp.widgets
 *  class = CMREOnDemandServicesGrid
 *
 */
Ext.ns('mxp.widgets');

/**
 * Class: CMREOnDemandServicesGrid
 * Grid panel that shows the list of services.
 * Selection Model can be attached to get the data of a flow.
 *
 * GeoBatch REST API used
 * * (GET) "/process/{plugin_name}/services" : list of available services (e.g.: flows for GeoBatch)
 * * (GET) "/process/{plugin_name}/services/{serviceId}" : details about a service
 * * (GET) "/process/{plugin_name}/services/{serviceId}/runtimes" : the active intances of a service (e.g.: consumers for GeoBatch)
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
mxp.widgets.CMREOnDemandServicesGrid = Ext.extend(Ext.grid.GridPanel, {

	/** api: xtype = mxw_cmre_ondemand_services_grid */
	xtype : "mxw_cmre_ondemand_services_grid",

	/**
	 * Property: osdi2ManagerRestURL
	 * {string} the OpenSDI2-Manager REST Url
	 */
	osdi2ManagerRestURL : null,

	/* i18n */
	nameText : 'Title',
	descriptionText : 'Description',
	newRunTitle : 'Create a new Service Process Run',
	newRunMessage : 'Running a new service will drop all previous inputs. Continue with the definition of a new process run?',
    newServiceText: "Input values for process: ",
    inputsText:" Inputs",
    issueANewRunText: "Issue a new run",
	/* end of i18n */
	//extjs grid specific config
	autoload : true,
	autoExpandColumn : 'description',

	//map panel configuration
	bounds : "-20037508.34, -20037508.34, 20037508.34, 20037508.34",
	serviceAreaLimitsTolerance : 0.01,
	serviceAreaLimits : {
		bottom: -90,
		left: -180,
		right: 180,
		top: 90
	},
	riskMapTypes : {},
	
	//if true, select the fist row on load
	selectFirst: true,
	numZoomLevels : 19,
	maxZoomLevel : 3,
	zoom : 4,
	displayProjection : "EPSG:4326",
	projection : "EPSG:900913",
	units : "m",
	center : [10416231.543771133, -1365528.5403454066], // Indian Ocean
	
	viewConfig : {
		getRowClass : function(record, index) {
			var c = record.json.activeStatus;
			if (c == 'ENABLED') {
				return 'row-green';
			} else if (c == 'DISABLED') {
				return 'row-red';
			} else {
				return 'row-yellow';
			}
		}
	},

	/**
	 *
	 */
	initComponent : function() {
		this.bounds = new OpenLayers.Bounds.fromString(this.bounds);
		this.addEvents('needsrefresh');
		// create the Data Store
		this.store = new Ext.data.Store({
            paramNames:{
                start: 'page',
                limit: 'pagesize'
            },
			autoLoad : this.autoload,
			// load using HTTP
			url : this.osdi2ManagerRestURL + 'services/',
			record : 'service',
			idPath : 'serviceId',
			auth:this.auth,
			fields : ['serviceId', 'name', 'description', 'activeStatus'],
			reader : new Ext.data.JsonReader({
				root : 'data',
				idPath : 'serviceId',
				fields : ['serviceId', 'name', 'description', 'activeStatus']
			}),
			listeners : {
				beforeload : function(a, b, c) {
                    
					if (a.proxy.conn.headers) {
						if (this.auth) {
							a.proxy.conn.headers['Authorization'] = this.auth;
						}
						a.proxy.conn.headers['Accept'] = 'application/json';
					} else {
						a.proxy.conn.headers = {
							'Accept' : 'application/json'
						};
						if (this.auth) {
							a.proxy.conn.headers['Authorization'] = this.auth;
						}
					}

				}
			},
			sortInfo : {
				field : 'serviceId',
				direction : 'ASC' // or 'DESC' (case sensitive for local sorting)
			}
		});
		//select first 
		if(this.selectFirst){
			this.store.on('load',function(){this.getSelectionModel().selectFirstRow();},this);
		}
		
		
		this.tbar = this.tbar || [];
		this.tbar.push({
			iconCls : 'refresh_ic',
			xtype : 'button',
			text : this.refreshText,
			scope : this,
			handler : function() {
				this.store.load();
			}
		});

		this.columns = [{
			id : 'id',
			header : "ID",
			width : 100,
			dataIndex : 'serviceId',
			sortable : true,
			hidden : true
		}, {
			id : 'name',
			header : this.nameText,
			width : 200,
			dataIndex : 'name',
			sortable : true
		}, {
			id : 'description',
			header : this.descriptionText,
			dataIndex : 'description',
			sortable : true
		}, {
			xtype : 'actioncolumn',
			width : 35,
			tooltip : this.issueANewRunText,
			handler : function(grid,rowIndex,colIndex){
				var record = grid.getStore().getAt(rowIndex);
				var defaultData =  record.get('defaultData') ||grid.defaultData || null;
				this.createNewProcessRun(grid,rowIndex,defaultData);
				
			},
			scope : this,
			items : [{
				iconCls : 'add_ic',
				width : 25,
				tooltip : this.tooltipLog,
				scope : this,
				getClass : function(v, meta, rec) {
					if (rec.get('activeStatus') == 'DISABLED')
						return 'x-hide-display';
					return 'x-grid-center-icon action_column_btn';
				}
			}]
		}], mxp.widgets.CMREOnDemandServicesGrid.superclass.initComponent.call(this, arguments);
	},

	/**
	 *    private: method[createNewProcessRun] creates a new service input panel
	 *      * grid : the grid
	 *      * rowIndex: the index of the row
	 *      * colIndex: the actioncolumn index
	 */
	createNewProcessRun : function(grid, rowIndex, defaultData,dataId) {
		var record = grid.getStore().getAt(rowIndex);
		var serviceId = record.get('serviceId');
		var serviceName = record.get('name');
		var me = this;

		Ext.Msg.show({
			title : this.newRunTitle,
			msg : this.newRunMessage,
			buttons : Ext.Msg.OKCANCEL,
			fn : function(buttonId, text, opt) {
				if (buttonId === 'ok') {
					var mainPanel = Ext.getCmp("mainTabPanel");
					try {
						//mainPanel.removeAll();
						var serviceConfigurationPanel;

						if (mainPanel.items.containsKey("CMREOnDemandServiceInputPanel")) {
							serviceConfigurationPanel = mainPanel.items.get("CMREOnDemandServiceInputPanel");
						}

						if (serviceConfigurationPanel) {
							mainPanel.remove(serviceConfigurationPanel);
						}

						var vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
			                styleMap: new OpenLayers.StyleMap(
			                     { 'default': 
			                        {
			                        strokeColor: "#00FF00",
			                        strokeOpacity: 0.7,
			                        strokeWidth: 1.5,
			                        fillColor: "#FF5500",
			                        fillOpacity: 0.7,
			                        pointRadius: 6,
			                        pointerEvents: "visiblePainted",
			                        //Supported values include “circle”, “square”, “star”, “x”, “cross”, and “triangle”.
			                        graphicName: "circle",
			                        label: "${order}",
			                        fontColor: "#000000",
			                        fontSize: "11px",
			                        fontFamily: "Courier New, monospace",
			                        fontWeight: "bold",
			                        //Valid values for horizontal alignment: “l”=left, “c”=center, “r”=right.  
			                        //Valid values for vertical alignment: “t”=top, “m”=middle, “b”=bottom.  
			                        //Example values: “lt”, “cm”, “rb”
			                        labelAlign: "cm",
			                        labelXOffset: "0",
			                        labelYOffset: "0"
			                    }
			                })
			            });
			            
						var mapPanel = new GeoExt.MapPanel({
							region : "center",
							map : {
								controls : [
									new OpenLayers.Control.Navigation(), 
									new OpenLayers.Control.ScaleLine(), 
									new OpenLayers.Control.MousePosition({
										prefix : '<strong>'+me.displayProjection+'</strong> coordinates: ',
										separator : ' | ',
										numDigits : 4,
										emptyString : 'Mouse is not over map.'
									})],
								wrapDateLine: true,
								maxExtent : me.bounds,
								
								maxZoomLevel : me.maxZoomLevel,
								zoom : me.zoom,
								displayProjection : me.displayProjection,
								projection : me.projection,
								units : me.units,
								center : me.center
							},
							layers : [
								new OpenLayers.Layer.OSM("OpenStreetMap", 
									[
										"http://a.tile.openstreetmap.org/${z}/${x}/${y}.png", 
								 		"http://b.tile.openstreetmap.org/${z}/${x}/${y}.png", 
								 		"http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
								 	], 
									OpenLayers.Util.applyDefaults({
											attribution : "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
											type : "mapnik"
									},
									//options
									{
										projection : me.projection,
										maxExtent : me.bounds,
										numZoomLevels : me.numZoomLevels,
										units : me.units,
										buffer : 1,
										transitionEffect : "resize",
										tileOptions : {
											crossOriginKeyword : null
										}
									})
								),
								vectorLayer
							],
							extent : me.bounds,
							items : [{
								xtype : "gx_zoomslider",
								vertical : true,
								height : 100,
								x : 10,
								y : 20,
								plugins : new GeoExt.ZoomSliderTip()
							}]
						});
						
						var itemId = 'CMREOnDemandServiceInputPanel';
						mainPanel.add({
							layout : 'border',
							itemId : itemId,
							xtype : 'panel',
							closable : true,
							closeAction : 'close',
							iconCls : 'nato_ic',
							header : false,
							deferredReneder : false,
							viewConfig : {
								forceFit : true
							},
							title : me.newServiceText + serviceName,
							items : [{
								xtype : 'mxp_cmre_ondemand_services_input_form',
								geoStoreBase: me.geoStoreBase,
								serviceAreaLimitsTolerance : me.serviceAreaLimitsTolerance,
								serviceAreaLimits: me.serviceAreaLimits,
								riskMapTypes : me.riskMapTypes,
								auth: me.auth,
								defaultData: defaultData,
								dataId: dataId,
								tbar : null,
								osdi2ManagerRestURL : me.osdi2ManagerRestURL,
								serviceId: serviceId,
								serviceName: serviceName,
								mapPanel : mapPanel,
								vectorLayer : vectorLayer,
								region : 'west',
								iconCls : 'nato_ic',
								title : serviceName + " " + me.inputsText,
								autoScroll : true,
								width : 600,
								ref : 'list',
								collapsible : true,
								auth : me.auth,
								sm : null,
								listeners: {
									execute: function(panel){
										mainPanel.setActiveTab(0);
										me.fireEvent('needsrefresh',this);
									}
								}
							}, mapPanel]
						}).show();
					} catch (e) {
						// FIXME: some error here
						console.log(e);
						console.log('Stack Trace: ' + e.stack);
					}
				}
			},
			icon : Ext.MessageBox.QUESTION
		});
	}
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.CMREOnDemandServicesGrid.prototype.xtype, mxp.widgets.CMREOnDemandServicesGrid);
