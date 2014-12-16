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
	autoload : false,
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
	startDateText : "Start Execution Date",
    runDateText : "Run Date",
	refreshText : "Refresh",
    autoRefreshText: "Auto-Refresh",
	loadingMessage : "Loading...",
	textConfirmDeleteMsg : "Do you confirm you want to delete event consumer with UUID:{uuid} ? ",
	errorDeleteConsumerText : "There was an error while deleting consumer",
	confirmClearText : "Do you really want to remove all consumers with SUCCESS or FAIL state?",
    legend:'Status Legend: <span style:="margin:5px" class="row-green">SUCCESSFUL</span> <span class="row-yellow">RUNNING</span> <span class="row-red">FAILED</span>',      
	/* end of i18n */
	
	//extjs grid specific config
	loadMask : true,
    /**
     * api config[autoRefreshTime]
     * auto-refresh interval
     */
    autoRefreshTime: 60000,
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
	 * 
	 */
	initComponent : function() {
		// create the Data Store
        var baseParams ={};
        if(this.pageSize){
            baseParams.start = 0;
            baseParams.limit = this.pageSize;
        }
		this.store = new Ext.data.Store({
			autoLoad : this.autoload,
            method: 'GET',
            auth:this.auth,
			// load using HTTP
			url : this.osdi2ManagerRestURL + 'services/' + this.flowId + '/runtimes',
			record : 'consumer',
			idPath : 'id',
			fields : ['id', 'name', 'status', 'progress', 'startDate', 'endDate', 'refDate', 'description','details','results'],
			reader : new Ext.data.JsonReader({
				root : 'data',
				idPath : 'id',
				fields : ['id', 'name', 'status', 'progress', 'startDate', 'endDate', 'refDate', 'description','details','results']
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
			id : 'refDate',
			header : this.runDateText,
			width : 180,
			dataIndex : 'refDate',
			sortable : true
		}];
        //add custom action columns
        if(this.actionColumns){
            this.columns = this.columns.concat(this.actionColumns);
        }
        
        //pagination
        this.bbar= {
            store: this.store,       // grid and PagingToolbar using same store
            displayInfo: false,
            pageSize: this.pageSize || 2,
            xtype: this.pageSize ? 'paging' : 'toolbar',
            // prependButtons: true,
            items: [ "->" ,this.legend
            ]
        };
        
        mxp.widgets.CMREOnDemandRuntimesGrid.superclass.initComponent.call(this, arguments);
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
