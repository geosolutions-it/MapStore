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
 *  class = CMREOnDemandRuntimesGrid
 *
 */
Ext.ns('mxp.widgets');

/**
 * Class: CMREOnDemandRuntimesGrid
 * Grid panel that shows consumers for a particular flow.
 * Allows also to see details and perform actions for a particular consumer.
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
mxp.widgets.CMREOnDemandRuntimesGrid = Ext.extend(Ext.grid.GridPanel, {

	/** api: xtype = mxp_cmre_ondemand_runtimes_grid */
	xtype : "mxp_cmre_ondemand_runtimes_grid",

	/**
	 * Property: osdi2ManagerRestURL
	 * {string} the OpenSDI2-Manager REST Url
	 */
	osdi2ManagerRestURL : 'http://localhost:8180/opensdi2-manager/mvc/process/geobatch/',
	autoload : true,
	autoExpandColumn : 'description',
    /**
     * api config[actionColumn]
     * Actions to plug to the runtimes grid rows.
     */
    actionColumns : null,
    
	/* i18n */
    nameText: "Name",
    descriptionText : "Description",
    progressText: "Progress",
	statusText : "Status",
	startDateText : "Start Date",
    endDateText : "End Date",
	refreshText : "Refresh",
    autoRefreshText: "Auto-Refresh",
	loadingMessage : "Loading...",
	textConfirmDeleteMsg : "Do you confirm you want to delete event consumer with UUID:{uuid} ? ",
	errorDeleteConsumerText : "There was an error while deleting consumer",
	confirmClearText : "Do you really want to remove all consumers with SUCCESS or FAIL state?",
	/* end of i18n */
	
	//extjs grid specific config
	loadMask : true,
    /**
     * api config[autoRefreshTime]
     * auto-refresh interval
     */
    autoRefreshTime: 3000,
	viewConfig : {
		getRowClass : function(record, index) {
			var c = record.get('status');
			if (c == 'SUCCESS') {
				return 'row-green';
			} else if (c == 'RUNNING') {
				return 'row-yellow';
			} else if (c == 'FAIL') {
				return 'row-red';
			}
		}
	},

	/*
	 * 
	 */
	initComponent : function() {
		// create the Data Store
		this.store = new Ext.data.Store({
			autoLoad : this.autoload,
			// load using HTTP
			url : this.osdi2ManagerRestURL + 'services/' + this.flowId + '/runtimes',
			record : 'consumer',
			idPath : 'id',
			fields : ['id', 'name', 'status', 'progress', 'startDate', 'endDate', 'description','details','results'],
			reader : new Ext.data.JsonReader({
				root : 'data',
				idPath : 'id',
				fields : ['id', 'name', 'status', 'progress', 'startDate', 'endDate', 'description','details','results']
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
				field : 'startDate',
				direction : 'DESC' // or 'DESC' (case sensitive for local sorting)
			}
		});

		this.tbar = [{
			iconCls : 'refresh_ic',
			xtype : 'button',
			text : this.refreshText,
			scope : this,
			handler : function() {
				this.store.load();
			}
		}, {
			iconCls : 'clock_ic',
			xtype : 'button',
			text : this.autoRefreshText,
			enableToggle : true,
			scope : this,
			handler : function(button) {
				var me = this;
				if (button.pressed) {
                    if(this.loadMask){
                        this.loadMask.disable();
                    }
					button.timer = setInterval(function() {
						me.store.load();
					}, this.autoRefreshTime);
				} else {
					clearInterval(button.timer);
                    if(this.loadMask){
                        this.loadMask.enable();
                    }
				}
			}
		}, "->", {
			iconCls : 'broom_ic',
			xtype : 'button',
			text : this.clearFinishedText,
			scope : this,
			handler : function() {
				var me = this;
				Ext.Msg.confirm(this.titleConfirmClearMsg, this.confirmClearText, function(btn) {
					if (btn == 'yes') {
						me.clearFinished();

					}
				});
			}
		}];

		this.columns = [{
			id : 'name',
			header : this.nameText,
			width : 100,
			dataIndex : 'name',
			sortable : true
		}, {
			id : 'description',
			header : this.descriptionText,
			dataIndex : 'description',
			sortable : true
		}, {
			id : 'progress',
			header : this.progressText,
			//text: 'Progress',
			width : 120,
			dataIndex : 'progress',
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				var id = Ext.id();
				(function() {
					new Ext.ProgressBar({
						renderTo : id,
						text : value + "%",
						value : (value / 100)
					});
				}).defer(25);
				return '<span id="' + id + '"></span>';
			}
		}, {
			id : 'startDate',
			header : this.startDateText,
			width : 180,
			dataIndex : 'startDate',
			sortable : true
		}, {
			id : 'endDate',
			header : this.endDateText,
			width : 180,
			dataIndex : 'endDate',
			sortable : true
		}];
        //add custom action columns
        if(this.actionColumns){
            this.columns = this.columns.concat(this.actionColumns);
        }
        //add delete column
        this.columns.push({
			xtype : 'actioncolumn',
            hideable:false,
			width : 35,
			items : [{
				iconCls : 'delete_ic',
				width : 25,
				tooltip : this.tooltipDelete,
				handler : this.confirmCleanRow,
				scope : this,
				getClass : function(v, meta, rec) {
					return 'x-grid-center-icon action_column_btn';
				}
			}]
		});
        
        mxp.widgets.CMREOnDemandRuntimesGrid.superclass.initComponent.call(this, arguments);
	},
	/**
	 *    private: method[confirmCleanRow] show the confirm message to remove a consumer
	 *      * grid : the grid
	 *      * rowIndex: the index of the row
	 *      * colIndex: the actioncolumn index
	 */
	confirmCleanRow : function(grid, rowIndex, colIndex) {
		var record = grid.getStore().getAt(rowIndex);
		var uuid = record.get('id');
		var me = this;
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
			msg : me.loadingMessage
		});
		var errorCallback = function(response, form, action) {
			Ext.Msg.show({
				msg : this.errorDeleteConsumerText,
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR
			});
			this.store.load();
			loadMask.hide();
		};
		var successCallback = function(response, form, action) {
			this.store.load();
			loadMask.hide();
		};
		Ext.Msg.confirm(this.titleConfirmDeleteMsg, this.textConfirmDeleteMsg.replace('{id}', uuid), function(btn) {
			if (btn == 'yes') {
				me.deleteConsumer(uuid, successCallback, errorCallback, me);
				loadMask.show();

			}
		});
	},
	/**
	 *    private: method[deleteConsumer] deletes a consumer
	 *      * uuid : the uuid of the consumer
	 *      * successCallback: function to call in case of success
	 *      * errorCallback: function to call in case of error
	 *      * scope: the scope of the callbacks (optional)
	 */
	deleteConsumer : function(uuid, successCallback, errorCallback, scope) {

		var url = this.osdi2ManagerRestURL + "consumers/" + uuid + "/clean";
		Ext.Ajax.request({
			method : 'PUT',
			url : url,
			headers : {
				'Authorization' : this.auth
			},
			scope : scope || this,
			success : successCallback,
			failure : errorCallback
		});

	},
	/**
	 *    private: method[clearFinished] deletes all the consumers with SUCCESS or FAIL status
	 */
	clearFinished : function() {
		var me = this;
		var count = 0, error = false;
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
			msg : me.cleanMaskMessage
		});
		var finish = function() {
			loadMask.hide();
			if (error) {
				Ext.Msg.show({
					msg : this.errorDeleteConsumerText,
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.ERROR
				});
			}
			me.store.load();
		};
		var successCallback = function() {
			count--;
			if (count == 0) {
				finish();
			} else {
				loadMask.hide();
			}
		};
		var errorCallback = function() {
			count--;
			error = true;
			if (count == 0) {
				finish();
			}
		};
		this.store.each(function(rec) {
			//count the records to delete
			var status = rec.get('status');
			if (status == 'SUCCESS' || status == 'FAIL') {
				count++;
			}
		});
		if (count == 0)
			return;
		loadMask.show();
		this.store.each(function(rec) {
			var status = rec.get('status');
			if (status == 'SUCCESS' || status == 'FAIL') {
				me.deleteConsumer(rec.get('uuid'), successCallback, errorCallback, me);
			}
		});
	},
	/**
	 * public: change flow id and load the new list
	 * [flowId] string: the id of the flow
	 *
	 */
	changeFlowId : function(flowId) {
		var url = this.osdi2ManagerRestURL + 'services/' + flowId + '/runtimes';
		this.store.proxy.setUrl(url, true);

		this.store.load();
	}
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.CMREOnDemandRuntimesGrid.prototype.xtype, mxp.widgets.CMREOnDemandRuntimesGrid);
