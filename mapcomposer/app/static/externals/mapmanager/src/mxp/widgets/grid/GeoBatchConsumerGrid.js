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
 *  class = GeoBatchConsumerGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: GeoBatchConsumerGrid
 * Grid panel that shows consumers for a particular flow.
 * Allows also to see details and perform actions for a particular consumer.
 * 
 * GeoBatch REST API used
 * * (GET) "/flows" : list of flows 
 * * (GET) "/flows/{flowid}" : details about the flow
 * * (GET) "/flows/{flowId}/consumers" : the consumers for the flow
 * * (GET) "/consumers/{consumerid}/status" : the status of a consumer
 * * (GET) "/consumers/{consumerid}/log" the log of a consumer
 * * (PUT) "/consumers/{consumerid}/pause" pause the consumer 
 * * (PUT) "/consumers/{consumerid}/resume" resume a paused consumer
 * * (PUT) "/consumers/{consumerid}/clean" clean the consumer 
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
mxp.widgets.GeoBatchConsumerGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_viewport */
    xtype: "mxp_geobatch_consumer_grid",
    
    /**
	 * Property: flowId
	 * {string} the GeoBatch flow name to manage
	 */	
    flowId: 'ds2ds_zip2pg',
    /**
	 * Property: geoBatchRestURL
	 * {string} the GeoBatch ReST Url
	 */
    geoBatchRestURL: 'http://localhost:8080/geobatch/rest/',
	
	/**
	 * Property: geoStoreRestURL
	 * {string} the GeoStore ReST Url
	 */
    geoStoreRestURL: 'http://localhost:8080/geostore/rest/',
	
	/**
	 * Property: mode
	 * {string} mode of the grid (active or archived)
	 */
    mode: 'active',
	
	 /**
	 * Property: autoRefreshInterval
	 * {integer} the Consumers auto refresh interval (in seconds).
	 */
    autoRefreshInterval: 5,
	
	autoRefreshState: false,
    /**
	 * Property: GWCRestURL
	 * {string} the GWC ReST Url. If present, a button
     * that allows to manage GWC layers to clean tile cache will be present
	 */
    GWCRestURL: null,
	
	/**
	 * Property: showDetails
	 * {boolean} include a row body with run details for each run
	 */
    showDetails: false,
    
    autoExpandColumn: 'task',
    
    /* i18n */
    statusText: 'Status',
    startDateText: 'StartDate',
    fileText:'File',
    actionText:'Action',
    taskText:'Task',
    progressText:'Progress',
    refreshText:'Refresh',
    autoRefreshText:'Auto Refresh',
    descriptionText:'Description',
    tooltipDelete: 'Clear this',
    tooltipLog: 'Check Log',
    clearFinishedText: 'Clear Finished',
    archiveText: 'Archive Selected',
    loadingMessage: 'Loading...',
    cleanMaskMessage:'Removing consumer data...',
    textConfirmDeleteMsg: 'Do you confirm you want to delete this workflow instance? ',
    errorDeleteConsumerText:'There was an error while deleting consumer',
    errorArchiveConsumerText:'There was an error while archiving consumer',
    confirmClearText: 'Do you really want to remove all consumers with SUCCESS or FAIL state?',
    titleConfirmClearMsg: 'Confirm',
    confirmArchiveText: 'Do you want to archive the selected runs?',
    titleConfirmArchiveMsg: 'Confirm',
    GWCButtonLabel: 'Tile Cache',
	errorContactingGeobatch: 'Error loading runs from GeoBatch',
	errorContactingGeostore: 'Error loading archived runs from GeoStore',
    /* end of i18n */
    
	cls:'geobatch-consumer-grid',
   
	viewConfig: {
		listeners: {
			refresh: function() {
				Ext.select('.action-progress', this.grid.el).each(function(progressContainer) {
					var progress = Math.round(parseFloat(progressContainer.dom.innerHTML)*100)/100;
					var progressBarEl = progressContainer.next();
                    if(progress < 100) {
                        progressBarEl.update('');
                        this.grid.progressBars.push(new Ext.ProgressBar({
                          renderTo : progressBarEl,
                          text : progress + "%",
                          value : (progress / 100)
                        }));
                    }
				}, this);
			}
		},
		getRowClass : function(record, rowIndex, p, ds){
			var c = record.get('status');
			var colorClass;
			if (c == 'SUCCESS') {
				colorClass =  'row-green';
			} else if (c == 'RUNNING') {
				colorClass =  'row-yellow';
			}else if (c == 'FAIL'){
				colorClass =  'row-red';
			}
			
			return colorClass;
		}
	},
   
    initComponent : function() {
        //FIX FOR IE10 and responseXML TODO: port this as a global fix
         var ie10XmlStore  = Ext.extend(Ext.data.XmlReader, {
            read : function(response){
                        var data = response.responseXML;
                        if(!data || !data.documentElement) {
                            if(window.ActiveXObject) {
                                var doc = new ActiveXObject("Microsoft.XMLDOM");
                                if(doc.loadXML(response.responseText)){
                                    data = doc;
                                }
                            }
                        }
                        return this.readRecords(data);
                    }
        });
		
		this.resourceManager = new GeoStore.Resource({
			authorization: this.auth,
            url: this.geoStoreRestURL + 'resources'
		});
		
        // create the Data Store
		if(this.mode === 'active') {

			this.store = new Ext.data.Store({
				// load using HTTP
				url: this.geoBatchRestURL + 'flows/' + this.flowId + '/consumers?includeDetails=true',
				record: 'consumer',
				reader:  new ie10XmlStore({
					record: 'consumer',
					idProperty: 'uuid',
					fields: [{name: 'status', mapping: '@status'},
					   'uuid',
					   'startDate',
					   'description',
					   {name:'details',convert: function(v) {
							return v ? Ext.decode(v) : {actions:[]}
					   }}]
				}),
				listeners:{
					beforeload: function(a,b,c){
					   this.cleanProgressBars();
					   if( a.proxy.conn.headers ){
							if(this.auth){
								a.proxy.conn.headers['Authorization'] = this.auth;
							}
							a.proxy.conn.headers['Accept'] = 'application/xml';
						}else{
							a.proxy.conn.headers = {'Accept': 'application/xml'};
							if(this.auth){
								a.proxy.conn.headers['Authorization'] = this.auth;
							}
						}
					   
					},
					load: function() {
						this.checkCanArchive();
					},
					exception: function(proxy, type, action, options, response) {
						Ext.Msg.show({
						   msg: this.errorContactingGeobatch,
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.ERROR
						});
					},
					scope: this
				},
				sortInfo: {
					field: 'startDate',
					direction: 'DESC' 
				}
			});
		} else {
			this.store = new MapStore.data.GeoStoreStore({
				
				categoryName: "ARCHIVEDRUNS",
				geoStoreBase: this.geoStoreRestURL,
				fullResource: true,
				auth: this.auth,
				idProperty: 'id',
                autoLoad: false,
				fields: [
					'id',
					'status',
					'uuid',
					'startDate',
					{name: 'description', mapping: 'data', convert: function(v) {
						return v ? Ext.decode(v).description : ''
					}},
					{name: 'details', mapping: 'data', convert: function(v) {
						return v ? Ext.decode(v).details : {actions:[]}
					}},
					{name: 'log', mapping: 'data', convert: function(v) {
						return v ? Ext.decode(v).log : {}
					}}
				],
				sortInfo: { field: "id", direction: "ASC" },
				listeners: {
                    beforeload: function(a,b,c){
					   this.cleanProgressBars();
					},
					exception: function(proxy, type, action, options, response) {
						Ext.Msg.show({
						   msg: this.errorContactingGeostore,
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.ERROR
						});
					},
					scope: this
				}
			});
		}
    
		var expander;
        this.fakeProgress = [
            '<div class="x-progress-wrap">',
                '<div class="x-progress-inner">',
                    '<div class="x-progress-bar" style="height: 16px; width: 167px;">',
                    '<div class="x-progress-text" style="z-index: 99; width: 158px;"><div style="width: 168px; height: 18px;">100%</div></div>',
                '</div>',
                '<div class="x-progress-text x-progress-text-back"><div style="width: 168px; height: 18px;">100%</div></div>',
                '</div>',
            '</div>'].join('');
		if(this.showDetails) {
			expander = new Ext.ux.grid.RowExpander({
				lazyRender : false,
				getRowClass : function(record, rowIndex, p, ds){
					var c = record.get('status');
					var colorClass;
					if (c == 'SUCCESS') {
						colorClass =  'row-green';
					} else if (c == 'RUNNING') {
						colorClass =  'row-yellow';
					}else if (c == 'FAIL'){
						colorClass =  'row-red';
					}
					p.cols = p.cols-1;
					var content = this.bodyContent[record.id];
					if(!content && !this.lazyRender){
						content = this.getBodyContent(record, rowIndex);
					}
					if(content){
						p.body = content;
					}
					
					return (this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed') + ' ' + colorClass;
				},
				tpl: new Ext.XTemplate(
					'<table width="100%">',
						'<tr><th width="200"><b>'+this.actionText+'</b></th><th><b>'+this.taskText+'</b></th><th width="172"><b>'+this.progressText+'</b></th></tr>',
						'<tpl for="details.actions">',
							'<tr>',
								'<td>{name}</td>',
								'<tpl for="progress">',
									'<td>{task}</td><td><span style="display: none" class="action-progress">{progress}</span><span class="action-progress-bar"><tpl if="progress &gt;= 100">' + this.fakeProgress + '</tpl></span></td>',
								'</tpl>',
							'</tr>',
						'</tpl>',
					'</table>'
				),
				enableCaching: false
			});
		}
	
		this.listeners = {
			activate: function() {
				this.store.load();
			},
			scope: this
		};
		
		this.plugins = (this.plugins || []).concat(this.showDetails ? [expander] : []);
       
		if(this.mode === 'active') {
			this.getSelectionModel().on({
				rowselect: function(selModel) {
					this.checkCanArchive();
					
				},
				rowdeselect: function(selModel) {
					this.checkCanArchive();
				},
				scope: this
			});
		}
	   
        this.tbar = [{
                iconCls:'refresh_ic',
                xtype:'button',
                text:this.refreshText,
                scope:this,
                handler:function(){
                    this.store.load();
                }
            },{
                iconCls:'auto_refresh_ic',
                xtype:'button',
				hidden: this.mode === 'archived',
                text:this.autoRefreshText,
				enableToggle: true,
                scope:this,
                toggleHandler:function(btn, state){
                    this.autoRefreshState = state;
					if(state) {
						this.autoRefresh();
					}
                }
            },"->",{
                iconCls:'archive_ic',
                xtype:'button',
				ref:'../archive',
				hidden: this.mode === 'archived',
                text:this.archiveText,
				disabled:true,
                scope:this,
                handler:function(){
                    Ext.Msg.confirm(
						this.titleConfirmArchiveMsg,
						this.confirmArchiveText,
						function(btn) {
							if(btn=='yes') {
								this.archiveSelected();
							}
						}, 
						this
					);
                }
        },{
                iconCls:'broom_ic',
                xtype:'button',
                text:this.clearFinishedText,
				hidden: this.mode === 'archived',
                scope:this,
                handler:function(){
                    var me = this;
                     Ext.Msg.confirm(
                    this.titleConfirmClearMsg,
                    this.confirmClearText,
                    function(btn) {
                        if(btn=='yes') {
                            me.clearFinished();
                            
                        }
                    });
                }
        }];
		
		
		
        if(this.GWCRestURL){
            this.bbar =[
            {
                text:this.GWCButtonLabel,
                iconCls:'gwc_ic',
                handler: this.showGWCGridWin,
                scope:this
            }
        ]
        }
        
        this.progressBars = [];
        
        var me = this;
        this.columns= (this.showDetails ? [expander] : []).concat([
            {id: 'uuid', header: "ID", width: 220, dataIndex: 'uuid', sortable: true, hidden: true},
            {id: 'status', header: this.statusText, width: 100, dataIndex: 'status', sortable: true},
            {id: 'startDate', header: this.startDateText, width: 180, dataIndex: 'startDate', sortable: true},
            {id: 'file', header: this.fileText, dataIndex: 'details',width: 180, 
                renderer: function(val){
                    return (val && val.events && val.events.length > 0) ? val.events[0] : ''
                } 
            },
			{id: 'task', header: this.taskText, dataIndex: 'details',width: 180, 
                renderer: function(val){
                    return (val && val.progress && val.progress.length > 0) ? (val.progress[0].task || '') : ''
                } 
            },
			{id: 'progress', header: this.progressText, dataIndex: 'details',width: 180, 
				renderer : function(val, metaData, record, rowIndex, colIndex, store) {
					if(val && val.progress && val.progress.length > 0) {
						var progress = Math.round((val.progress[0].progress || 0) * 100) / 100;
						var id = Ext.id();
                        if(progress < 100) {
                            (function() {
                             var progressBar = new Ext.ProgressBar({
                              renderTo : 'progressbar-' + id,
                              text : progress + "%",
                              value : (progress / 100)
                             });
                             me.progressBars.push(progressBar);
                            }).defer(25);
                        }
						return '<span style="display:none" id="' + id + '"></span><span id="progressbar-' + id + '">' + ( progress >= 100 ? me.fakeProgress : '') + '</span>';
					} else {
						return '';
					}
					
				} 
            },
            {
                    xtype:'actioncolumn',
                    width: 35,
                    items:[{
                        iconCls:'delete_ic',
                        width:25,
                        tooltip: this.tooltipDelete,
                        handler: this.confirmCleanRow,
                        scope:this,
                        getClass: function(v, meta, rec) {
                           if(rec.get('status')=='RUNNING')return 'x-hide-display';
                            return 'x-grid-center-icon action_column_btn';
                          
                        }
                    }]
            },{
                    xtype:'actioncolumn',
                    width: 35,
                    tooltip: this.tooltipLog,
                    handler: this.checkLog,
                    scope: this,
                    items:[ {
                        iconCls:'information_ic',
                        width:25,
                        tooltip: this.tooltipLog,
                        scope:this,
                        getClass: function(v, meta, rec) {
                            return 'x-grid-center-icon action_column_btn';
                        }
                    }]
            }
        ]),
        mxp.widgets.GeoBatchConsumerGrid.superclass.initComponent.call(this, arguments);
    },
	
    cleanProgressBars: function() {
        Ext.each(this.progressBars, function(bar) {
            bar.destroy();
        }, this);
    },
    
	checkCanArchive: function() {
		var selections = this.getSelectionModel().getSelections();
		var enable = false;
		if(selections.length === 1) {
			var status = selections[0].get('status');
			if(status === 'SUCCESS' || status === 'FAIL') {
				enable = true;
			}
		}
		this.archive.setDisabled(!enable);
	},
	
	/**
     *    private: method[archiveSelected] archive on GeoStore the currently selected row
     *      
     */
	archiveSelected: function() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:this.loadingMessage});
		var workflow = this.getSelectionModel().getSelections()[0];
		var uuid = workflow.get('uuid');
		
		this.getLog(uuid, null, function(log, form, action) {
			this.doArchiveSelected(workflow, uuid, loadMask, log);
		}, function() {
			Ext.Msg.show({
			   msg: this.errorArchiveConsumerText,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.ERROR
			});
			this.store.load();
			loadMask.hide();
		}, this);
	},
	
	
	
	/**
     *    private: method[doArchiveSelected] archive on GeoStore the currently selected row
     *      
     */
	doArchiveSelected: function(workflow, uuid, loadMask, log) {
		
		var resource = {
			name: this.flowId + '_' + uuid,
			description: this.flowId + '_' + uuid,
			category: 'ARCHIVEDRUNS',
			attributes: {
				'uuid': {
					name: 'uuid',
					value: uuid
				},
				'status': {
					name: 'status',
					value: workflow.get('status')
				},
				'startDate': {
					name: 'startDate',
					value: workflow.get('startDate')
				}
			}
			
		};
		
		resource.blob = Ext.encode({
			description: workflow.get('description'),
			details: workflow.get('details'),
			log: log
		});
		loadMask.show();
		this.resourceManager.create(resource,
			// archived resource created
			function() {
				// remove GeoBatch consumer
				this.deleteGeoBatchConsumer(uuid, function() {
					this.store.load();
					loadMask.hide();
				}, function() {
					Ext.Msg.show({
					   msg: this.errorArchiveConsumerText,
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.ERROR
					});
					this.store.load();
					loadMask.hide();
				}, this)
			},
			// error
			function() {
				Ext.Msg.show({
				   msg: this.errorArchiveConsumerText,
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.ERROR
				});
				this.store.load();
				loadMask.hide();
			},
			this
		);
	},
	
	/**
     *    private: method[autoRefresh] refresh the grid, and if autoRefresh is active, schedule next refresh
     *      
     */
    autoRefresh: function() {
		if(this.autoRefreshState) {
			this.store.on('load', function() {
				this.autoRefresh.createDelegate(this).defer(this.autoRefreshInterval * 1000);
			}, this, {single: true});
		}
		this.store.load();
	},
	
    /**
     *    private: method[confirmCleanRow] show the confirm message to remove a consumer
     *      * grid : the grid
     *      * rowIndex: the index of the row 
     *      * colIndex: the actioncolumn index
     */
    confirmCleanRow: function(grid, rowIndex, colIndex){
         var record =  grid.getStore().getAt(rowIndex);
         var uuid = record.get('uuid');
         var me = this;
         var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:me.loadingMessage});
         var errorCallback = function(response, form, action) {
            Ext.Msg.show({
               msg: this.errorDeleteConsumerText,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
            this.store.load();
            loadMask.hide();
        };
        var successCallback = function(response, form, action) {
            this.store.load();
            loadMask.hide();
        };
        Ext.Msg.confirm(
            this.titleConfirmDeleteMsg,
            this.textConfirmDeleteMsg,
            function(btn) {
                if(btn=='yes') {
					loadMask.show();
                    me.deleteConsumer(record.id,successCallback,errorCallback,me);
                }
            }
		);
    },
    /**
     *    private: method[checkLog] show the log of a consumer
     *      * grid : the grid
     *      * rowIndex: the index of the row 
     *      * colIndex: the actioncolumn index
     */
    checkLog: function(grid, rowIndex, colIndex){
        var record =  grid.getStore().getAt(rowIndex);
        var uuid = record.get('uuid');
        var me = this;
        
        var win = new Ext.Window({
                    iconCls:'information_ic',
                    title:this.tooltipLog,
                    width: 700,
                    height: 600, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    closeAction:'hide',
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    tbar:[{
                        text:this.refreshText,
                        iconCls:'refresh_ic',
                        handler: function(btn){
                            win.refreshLog();
                        } 
                    }],
                    items: [{
                        xtype:'textarea',
                        layout:'fit',
                        cls:'geobatch_log',
                        readOnly:false,
                        ref:'log'
                        }
                    ],
                    listeners: {
                        scope: this,
                        afterrender : function(win){
                            win.refreshLog();
                             
                        }
                    },
                    refreshLog: function(){
                        var loadMask = new Ext.LoadMask(win.getEl(), {msg:me.loadingMessage});
						loadMask.show();
						me.getLog(uuid, record, function(log, form, action) {
                                win.log.setValue(log);
                                loadMask.hide();
                            },function(response, form, action) {
                                loadMask.hide();
                            }, me);
                        
                        
                    }
        });
        win.show();
    },
	
	getLog: function(uuid, record, successCallback, failureCallback, scope) {
		if(this.mode === 'archived') {
			successCallback.call(scope, record.get('log'), null, null);
		} else {
			var url = this.geoBatchRestURL + "consumers/" + uuid + "/log";
			Ext.Ajax.request({
				method: 'GET',
				url: url,
				bodyStyle:"font-family: monospace;",
				headers: {
					'Authorization' : this.auth
				},
				scope: this,
				success: function(response, form, action) {
					successCallback.call(scope, response.responseText, form, action);
				},
				failure: function(response, form, action) {
					failureCallback.call(scope, response, form, action);
				}
			});
		}
	},
     /**
     *    private: method[deleteConsumer] deletes a consumer
     *      * uuid : the uuid of the consumer
     *      * successCallback: function to call in case of success 
     *      * errorCallback: function to call in case of error
     *      * scope: the scope of the callbacks (optional)
     */
    deleteConsumer: function(id,successCallback,errorCallback,scope){
        if(this.mode === 'archived') {
			this.deleteGeoStoreConsumer(id,successCallback,errorCallback,scope);
			
		} else {
			this.deleteGeoBatchConsumer(id,successCallback,errorCallback,scope);
        }
    },
	
	/**
     *    private: method[deleteGeoStoreConsumer] deletes a consumer from GeoStore archived
     *      * uuid : the uuid of the consumer
     *      * successCallback: function to call in case of success 
     *      * errorCallback: function to call in case of error
     *      * scope: the scope of the callbacks (optional)
     */
	deleteGeoStoreConsumer: function(id,successCallback,errorCallback,scope){
		var url = this.geoStoreRestURL + "resources/resource/" + id;
		Ext.Ajax.request({
			method: 'DELETE',
			url: url,
			headers: {
				'Authorization' : this.auth
			},
			scope: scope || this,
			success: successCallback,
			failure: errorCallback
		});
	},
	/**
     *    private: method[deleteGeoStoreConsumer] deletes a consumer from GeoStore archived
     *      * uuid : the uuid of the consumer
     *      * successCallback: function to call in case of success 
     *      * errorCallback: function to call in case of error
     *      * scope: the scope of the callbacks (optional)
     */
	deleteGeoBatchConsumer: function(id,successCallback,errorCallback,scope){
		var url = this.geoBatchRestURL + "consumers/" + id + "/clean";
		Ext.Ajax.request({
			method: 'PUT',
			url: url,
			headers: {
				'Authorization' : this.auth
			},
			scope: scope || this,
			success: successCallback,
			failure: errorCallback
		});
	},
    /**
     *    private: method[clearFinished] deletes all the consumers with SUCCESS or FAIL status
     */
    clearFinished: function(){
        var me =this;
        var count = 0,error=false;
        var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:me.cleanMaskMessage});
        var finish =function(){
            loadMask.hide();
            if(error){
                Ext.Msg.show({
                   msg: this.errorDeleteConsumerText,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                });
            }
            me.store.load();
            
            
        }
        var successCallback = function(){
            count--;
            if(count == 0){
                finish();
            }else{
                loadMask.hide();
            }
        };
        var errorCallback = function(){
            count--;
            error = true;
            if(count == 0){
                finish();
            }
        };
        this.store.each(function(rec){
        //count the records to delete
        var status = rec.get('status')
            if( status =='SUCCESS' || status =='FAIL' ){
                count++;
            }
        });
        if(count == 0) return;
        loadMask.show();
        this.store.each(function(rec){
            var status = rec.get('status')
            if( status =='SUCCESS' || status =='FAIL' ){
                me.deleteConsumer(rec.get('uuid'),successCallback,errorCallback,me);
            }
        });
    },
     /**
     *    private: method[showGWCGridWin] show the GWC manage window
     */
    showGWCGridWin:function(){
            
        var w = new Ext.Window({
                iconCls:'gwc_ic',
                title:this.GWCButtonLabel,
                width: 700,
                height: 600, 
                minWidth:250,
                minHeight:200,
                layout:'fit',
                autoScroll:false,
                closeAction:'hide',
                maximizable: true, 
                modal:true,
                resizable:true,
                draggable:true,
            items:{
                xtype:'mxp_gwc_grid',
				GWCRestURL:this.GWCRestURL,
                layout:'fit',
                autoScroll:true,
                auth: this.auth,
                autoWidth:true,
                ref:'gwc'
            } 
        });
        w.show();
    },
    /**
     * public: change flow id and load the new list
     * [flowId] string: the id of the flow
     * 
     */
    changeFlowId: function ( flowId ) {
		if(this.mode === 'archived') {
			this.store.currentFilter = flowId+'_*';
			this.store.proxy.api.read.url = this.store.getSearchUrl();
		} else {
			var url = this.geoBatchRestURL + 'flows/' + flowId + '/consumers?includeDetails=true';
			this.store.proxy.setUrl(url, true);
		}
		this.setDisabled(false);
		this.flowId = flowId;
		this.archive.setDisabled(true);
        this.store.load();
    }
    
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.GeoBatchConsumerGrid.prototype.xtype, mxp.widgets.GeoBatchConsumerGrid);
