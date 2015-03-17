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
 *  module = mxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: CMREOnDemandServices(config)
 *
 *    Open a plugin to interact with GeoBatch flows :
 *    * obtain information and clean consumers of all the flows on a GeoBath Instance 
 */
mxp.plugins.CMREOnDemandServices = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_cmre_ondemand_services */
    ptype: "mxp_cmre_ondemand_services",
    //i18n
    buttonText: "Control Panel",
	flowsListTitle:'Algorithms',
    runButtonText:'Run',
    consumersGridTitle: 'Outcomes',
    flowRunFormCategory: 'WPS_RUN_CONFIGS',
    loginManager: null,    
    setActiveOnOutput: true,
    autoRefreshTime: 60000,
    /* api configuration
    baseDir: '/home/geosolutions/admin/',
    
     /** api: configuration[runConfigs]
      * a map of run configurations.
      * has the base configuration for each flow to run
      */
    runConfigs: {},
     /** api: configuration[defaultRunConfig]
      * a default configuration to use.
      * if present it will be used as configuration when a 
      * runConfig is not found in runConfigs map
      * if null, no run config is defined for this flow,
      * so the action can not be runned from this UI
      */
    defaultRunConfig: null,
    /**
     * Action Columns for the outcomes grid
     */
    customRunColumns:[],
    serviceAreaLimitsTolerance : 0.01,
    serviceAreaLimits : {
		bottom: -90,
		left: -180,
		right: 180,
		top: 90
	},
	defaultData: {
		maxlon: "70",
		maxlat: "20",
		minlat: "0",
		minlon: "50"
	},
	riskMapTypes : {},
    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            //iconCls:'nato_ic', 
            //text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
                this.addOutput(); 
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.CMREOnDemandServices.superclass.addActions.apply(this, [actions]);
    },
    
    /** api: method[addOutput]
     *  :arg config: ``Object`` configuration for the ``Ext.Component`` to be
     *      added to the ``outputTarget``. Properties of this configuration
     *      will be overridden by the applications ``outputConfig`` for the
     *      tool instance.
     *  :return: ``Ext.Component`` The component added to the ``outputTarget``. 
     *
     *  Adds output to the tool's ``outputTarget``. This method is meant to be
     *  called and/or overridden by subclasses.
     */
    addOutput: function(config) {
        this.setupCustomColumns();
        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;
        this.auth = this.target.auth;
        this.geoStoreBase = this.geoStoreBase || this.target.geoStoreBase;
        //inject auth and geostore url in actionColumn
        for(var i = 0 ; i < this.customRunColumns.length ; i++){
             this.customRunColumns[i].geoStoreBase = this.geoStoreBase;
             this.customRunColumns[i].auth = this.auth;
             this.customRunColumns[i].target = this.target;
        }
        this.outputConfig = this.outputConfig || {};
        // create the selection model
        var selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect:true,
            listeners:{
                 scope:this,
                  //update the right grid on select
                 rowselect: function(flowsgrid,rowIndex,record){
                    var flowid = record.get('serviceId');
                    flowsgrid.grid.refOwner.consumers.changeFlowId(flowid);
                    if(flowsgrid.grid.runBtn){
                        //TODO manage run local or other forms
                        var runBtn = flowsgrid.grid.runBtn;
                        if(this.runConfigs[flowid]){
                            runBtn.setDisabled(false);
                            runBtn.flowId = flowid;
                        }else{
                            runBtn.setDisabled(true);
                            runBtn.flowId = null;
                        }
                        
                    }
                } 
            }
        });
        //button for button runner
        var buttons = [];
        if(this.flowRunFormCategory){
            /*buttons.push({
                iconCls:'update_manager_ic',
                ref:'../runBtn',
                text: this.runButtonText,
                disabled:true,
                scope:this,
                handler:function(btn){
                    this.showRunLocalForm(btn.flowId);
                }
            });*/
            buttons.push("->");
        }
       
        var me = this;
        //configuration of the left grid of the flows 
        var flowsGrid = {
            xtype:'mxw_cmre_ondemand_services_grid',
            serviceAreaLimitsTolerance : me.serviceAreaLimitsTolerance,
            serviceAreaLimits: this.serviceAreaLimits,
            defaultData: this.defaultData,
            riskMapTypes: this.riskMapTypes,
            selectFirst: true,
            geoStoreBase: this.geoStoreBase,
            tbar:buttons,
            osdi2ManagerRestURL: this.osdi2ManagerRestURL,
            region:'west',
			iconCls:'nato_ic',
			title:this.flowsListTitle,
            autoScroll:true,
            width:500,
            ref:'list',
            collapsible:true,   
            auth: this.auth,
            sm: selectionModel,
            listeners: {
            	needsrefresh: function (){
            		this.refOwner.consumers.store.load();
            	}
            	
            }
        };
        
        var menuHandler = function(grid, index, event) {
		      event.stopEvent();
		      var record = grid.getStore().getAt(index);
		      var menu = new Ext.menu.Menu({
		      	  record: record,
		      	  grid: grid,
		      	  index: index,
		      	  event : event, 
		          items: me.getRunContextMenuItems()
		      }).showAt(event.xy);
		};
        
        this.outputConfig = Ext.apply({
            layout: 'border',
			itemId:'CMREOnDemandServices',
            xtype:'panel',
            closable: true,
            closeAction: 'close',
            iconCls: 'nato_ic',  
            header: false,
            deferredReneder:false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            items:[
                {
                    xtype:'mxp_cmre_ondemand_runtimes_grid',
                    osdi2ManagerRestURL: this.osdi2ManagerRestURL,
                    title: this.consumersGridTitle,
                    layout:'fit',
                    autoScroll:true,
                    autoRefreshTime: this.autoRefreshTime,
                    flowId: this.flowId,
                    auth: this.auth,
                    autoWidth:true,
                    region:'center',
                    ref:'consumers',
                    actionColumns:this.customRunColumns,
                    listeners: {
                    	rowcontextmenu: function(grid, index, event) {
                    		menuHandler(grid, index, event);
                    	}
                    }
                },  
                flowsGrid
            ]
        },this.outputConfig);
		// In user information the output is generated in the component and we can't check the item.initialConfig.
        if(this.output.length > 0
            && this.outputTarget){
            for(var i = 0; i < this.output.length; i++){
                if(this.output[i].ownerCt
                    && this.output[i].ownerCt.xtype 
                    && this.output[i].ownerCt.xtype == "tabpanel"
                    && !this.output[i].isDestroyed){
                    var outputConfig = config || this.outputConfig;
                    // Not duplicate tabs
                    for(var index = 0; index < this.output[i].ownerCt.items.items.length; index++){
                        var item = this.output[i].ownerCt.items.items[index];
                        // only check iconCls
                        var isCurrentItem = "CMREOnDemandServices" == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
        this.tab = mxp.plugins.CMREOnDemandServices.superclass.addOutput.apply(this, arguments);
        return this.tab;
    },
    showRunLocalForm: function(flowId,fileId){
        //apply local parameters to the configuration flor the selected flow
        if(this.runConfigs[flowId]){
            var me = this;
            
            var runFormConfig = Ext.apply(this.runConfigs[flowId],{
                //xtype:'geobatch_run_local_form',
                //layout:'fit',
                flowId: flowId,
                fileId:fileId,
                osdi2ManagerRestURL: this.osdi2ManagerRestURL,
                //baseDir: this.baseDir,
                //mediaContent: this.target.initialConfig.mediaContent
                listeners:{
                    success: function(flowId){
                        win.close();
                        setTimeout(function(){
                            var consumers = me.tab.consumers;
                            consumers.store.load();}
                        ,5000);
                    }
                }
            });
        }else if(this.defaultConfig){
            //TODO manage default config
        }
        var win = new Ext.Window({
                    iconCls:'update_manager_ic',
                    xtype:'form',
                    title:this.runButtonText + " " + flowId,
                    width: 300,
                    height: 400, 
                    path:'csv/New Folder',
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    closeAction:'hide',
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    items: [runFormConfig]
        });
        win.show();
    },
    // CUSTOMER SPECIFIC I18N
    ownerText: "Owner",
    viewMapText: "View Map",
    editPermissionsText: "Edit Permissions",
    loadingMessage:'Loading...',
    visibilityHeaderText: "Visibility",
    // CUSTOMER SPECIFIC configuration
    renderMapToTab: "mainTabPanel",
    mapIdPath: "results.mapId",
    errorPath: "details.message",
    resultsField: "results",
    detailsField: "details",
    baseMapUrl: "/?config=assetAllocatorResult",
    ownerPath:"details.owner",
    titlePath:'results.title',
    visibilityPath: "details.resourceVisibility",
    resourcePermissionPath: "details.resourceId",
    startFromHereText:"Start from this run",
    titleConfirmDeleteMsg:"Outcome delete confirm",
    textConfirmDeleteMsg:"Are you sure to delete the outcome : {name}",
    /**
     * setup action columns to add
     */
    setupCustomColumns: function(){
      var me = this;
      this.customRunColumns = [{
                id : 'owner',
                header : "Owner",
                width : 100,
                dataIndex : 'results',
                sortable : false,
                renderer: function(value, metaData, rec, rowIndex, colIndex, store) {
                  var results = rec.get(me.resultsField); 
                  var details = rec.get(me.detailsField);
                  try{
                    var owner = eval(me.ownerPath);
                    return owner;
                  }catch(E){
                    return "(not available)";
                  }

                }
        },{
            xtype : 'actioncolumn',
            hideable: false,
            header: this.visibilityHeaderText,
            width : 80,
            renderMapToTab: this.renderMapToTab,
            mapIdPath: this.mapIdPath,
            resultsField: this.resultsField,
            baseMapUrl: this.baseMapUrl,
            ownerPath:this.ownerPath,
            titlePath:this.titlePath,
            resourcePermissionPath: this.resourcePermissionPath,
            visibilityPath: this.visibilityPath,
            detailsField: this.detailsField,
            loadingMessage:this.loadingMessage,
            items : [{
                iconCls : 'visibility_ic',
                width : 25,
                getClass : function(v, meta, rec) {
                    var results = rec.get(me.resultsField); 
                    var details = rec.get(this.detailsField); 
                    
                    
                    try{
                        var resourceId = eval(this.resourcePermissionPath);
                        var owner = eval(this.ownerPath);
                        var visibility = eval(this.visibilityPath);
                        var target = Ext.getCmp(this.renderMapToTab);
                        var display =rec.get('status') != 'RUNNING' && resourceId;
                        this.items[0].tooltip = visibility;
                        if (display){
                           return 'x-grid-center-icon action_column_btn ' + visibility;
                        }
                    }catch(e){
                        return 'x-hide-display';
                    }
                    var target = Ext.getCmp(this.renderMapToTab);
                    var display =rec.get('status') != 'RUNNING' && resourceId;
                    display = display && ( owner == (this.target && this.target.user && this.target.user.name) );
                    if (display){
                       return 'x-grid-center-icon action_column_btn ' +  visibility;
                    }
                     return 'x-hide-display';

                }
            },{
                iconCls : 'ic_edit',
                width : 25,
                tooltip : this.editPermissionsText,
                getClass : function(v, meta, rec) {
                    var results = rec.get(me.resultsField); 
                    var details = rec.get(this.detailsField); 
                    
                    
                    try{
                        var resourceId = eval(this.resourcePermissionPath);
                        var owner = eval(this.ownerPath);
                        var visibility = eval(this.visibilityPath);
                        var target = Ext.getCmp(this.renderMapToTab);
                        var display =rec.get('status') != 'RUNNING' && resourceId;
                        var isAdmin  = (this.target && this.target.user && this.target.user.role == 'ADMIN');
                        display = display && ( owner == (this.target && this.target.user && this.target.user.name) || isAdmin);
                        if (display){
                           return 'action_column_btn';
                        }
                    }catch(e){
                        return 'x-hide-display';
                    }
                    var target = Ext.getCmp(this.renderMapToTab);
                    var display =rec.get('status') != 'RUNNING' && resourceId;
                    display = display && ( owner == (this.target && this.target.user && this.target.user.name) );
                    if (display){
                       return 'action_column_btn';
                    }
                     return 'x-hide-display';

                },
                handler : function(grid, rowIndex, colIndex){
                    var rec = grid.store.getAt(rowIndex);
                    var results = rec.get(this.resultsField); 
                    var details = rec.get(this.detailsField); 
                    
                    var resourceId = eval(this.resourcePermissionPath);
                    var title;
                    try{
                        title = eval(this.titlePath);
                    }catch(e){
                    	title = rec.get("name");
                    }
                    
                    var  winPermission = new mxp.widgets.ResourceGroupPermissionWindow({
                        resourceId: resourceId,
                        title: this.permissionTitleText,
                        hideCanWrite:true,
                        auth: this.auth,
                        closeAction:'close',
                        geostoreURL: this.geoStoreBase,
                        target: this.target,
                        listeners: {
                        	close: function(){
                        		grid.store.load();
                        		
                        	}
                        	
                        }
                    });
                    winPermission.show();  
                    return winPermission;
                }
            }]
        },{
            xtype : 'actioncolumn',
            hideable: false,
            width : 45,
            renderMapToTab: this.renderMapToTab,
            mapIdPath: this.mapIdPath,
            resultsField: this.resultsField,
            errorPath: this.errorPath,
            baseMapUrl: this.baseMapUrl,
            ownerPath:this.ownerPath,
            titlePath:this.titlePath,
            resourcePermissionPath: this.resourcePermissionPath,
            visibilityPath: this.visibilityPath,
            detailsField: this.detailsField,
            loadingMessage:this.loadingMessage,
            items : [{
                iconCls : 'gx-map-go',
                width : 25,
                tooltip : "View Map",
                getClass : function(v, meta, rec) {
                    
                    var results = rec.get(this.resultsField); 
                    var details = rec.get(this.detailsField);
                     try{
                         var mapId = eval(this.mapIdPath);
                         var target = Ext.getCmp(this.renderMapToTab);
                         if (rec.get('status') == 'SUCCESS' && mapId){
                             return 'x-grid-center-icon action_column_btn';
                         }
                         return 'x-hide-display';
                      }catch(E){
                        return 'x-hide-display';
                      }
                },
                handler : function(grid, rowIndex, colIndex){
                    var rec = grid.store.getAt(rowIndex);
                    var results = rec.get(me.resultsField); 
                    var details = rec.get(me.detailsField);
                    try{
                        var mapId = eval(this.mapIdPath);
                    }catch(e){
                        return ;
                    }
                    var target = Ext.getCmp(this.renderMapToTab);
                    
                    var title = rec.get('name');
                    var src = this.baseMapUrl; //TODO '?locale=' + this.target.lang ;
                    var iframeTitle = title ;
                    if(!(src.indexOf("?")>=0)){
                       src+='?';
                    } 
                    if(mapId != -1){
                        src += '&mapId=' + mapId;
                    }

                    var iframeTitle =  title ;
                    var iframeconfig = {
                        waitMsg: this.loadingMessage,
                        width:900,
                        height:650,
                        collapsible:false,
                        maximizable: true,
                        maximized: true,
                        closable: true,
                        modal: true,
                        closeAction: 'close',
                        constrainHeader: true,
                        maskEmpty: true,
                        title: iframeTitle,
                        src: src,
                        onEsc: Ext.emptyFn
                    };

                    var iframe = new Ext.IframeTab(iframeconfig);

                    if(target){
                        target.add(iframe);
                        if(target.xtype=='tabpanel'){
                            target.setActiveTab(iframe);
                        }
                    }
                }
            },{
                iconCls : 'information_ic',
                width : 25,
                tooltip : "View Map",
                getClass : function(v, meta, rec) {
                    
                    var results = rec.get(this.resultsField); 
                    var details = rec.get(this.detailsField);
                     try{
                         var mapId = eval(this.mapIdPath);
                         var target = Ext.getCmp(this.renderMapToTab);
                         if (rec.get('status') == 'FAIL'){
                             return 'x-grid-center-icon action_column_btn';
                         }
                         return 'x-hide-display';
                      }catch(E){
                        return 'x-hide-display';
                      }
                },
                handler : function(grid, rowIndex, colIndex){
                    var rec = grid.store.getAt(rowIndex);
                    var results = rec.get(me.resultsField); 
                    var details = rec.get(me.detailsField);
                    var error;
                    try{
                        error = eval(this.errorPath);
                    }catch(e){
                        return ;
                    }

                    var src = this.baseMapUrl; //TODO '?locale=' + this.target.lang ;
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
                                
                                items: [{
                                    xtype:'textarea',
                                    layout:'fit',
                                    cls:'geobatch_log',
                                    readOnly:false,
                                    ref:'log',
                                    value: error
                                    }
                                ]
                                
                                
                    });
                    win.show();
                }
            }]
        },{
            xtype : 'actioncolumn',
            hideable: false,
            width : 30,
            renderMapToTab: this.renderMapToTab,
            mapIdPath: this.mapIdPath,
            resultsField: this.resultsField,
            errorPath: this.errorPath,
            baseMapUrl: this.baseMapUrl,
            ownerPath:this.ownerPath,
            titlePath:this.titlePath,
            resourcePermissionPath: this.resourcePermissionPath,
            visibilityPath: this.visibilityPath,
            detailsField: this.detailsField,
            loadingMessage:this.loadingMessage,
            items : [{
	            tooltip: this.startFromHereText,
	    		iconCls:'add_ic',
	    		width : 25,
                getClass : function(v, meta, rec) {
                    
                    return 'x-grid-center-icon action_column_btn';
                },
	    		handler: function(grid, rowIndex, colIndex){
	    			var rec = grid.store.getAt(rowIndex);
	    			var resourceId = rec.get('details').resourceId;
	    			var servicesGrid = me.output[0].list;
	    			var record = servicesGrid.getSelectionModel().getSelected();
	    			var rowIndex = servicesGrid.store.indexOf(record);
	    			if(record && rowIndex >= 0){
	    				servicesGrid.createNewProcessRun(servicesGrid,rowIndex,me.defaultData,resourceId);
	    			}
	    		}
    		}]
	    		
        },{
			xtype : 'actioncolumn',
            hideable:false,
			width : 35,
			renderMapToTab: this.renderMapToTab,
            mapIdPath: this.mapIdPath,
            resultsField: this.resultsField,
            errorPath: this.errorPath,
            baseMapUrl: this.baseMapUrl,
            ownerPath:this.ownerPath,
            titlePath:this.titlePath,
            resourcePermissionPath: this.resourcePermissionPath,
            visibilityPath: this.visibilityPath,
            detailsField: this.detailsField,
            loadingMessage: this.loadingMessage,
            titleConfirmDeleteMsg:this.titleConfirmDeleteMsg,
            textConfirmDeleteMsg:this.textConfirmDeleteMsg,
			items : [{
				iconCls : 'delete_ic',
				width : 25,
				tooltip : this.tooltipDelete,
				handler : this.confirmCleanRow,
				
				getClass : function(v, meta, rec) {
					var results = rec.get(me.resultsField); 
                    var details = rec.get(this.detailsField); 
                    
                    
                    try{
                        var resourceId = eval(this.resourcePermissionPath);
                        var owner = eval(this.ownerPath);
                        var visibility = eval(this.visibilityPath);
                        var target = Ext.getCmp(this.renderMapToTab);
                        var display = (this.target && this.target.user && this.target.user.role == 'ADMIN');
                        display = display || ( owner == (this.target && this.target.user && this.target.user.name) );
                        
                        if (display){
                           return 'x-grid-center-icon action_column_btn ' ;
                        }else{
                        	return 'x-hide-display';
                        }
                    }catch(e){
                        return 'x-hide-display';
                    }
				},
				handler: function(grid, rowIndex, colIndex){
	    			var rec = grid.store.getAt(rowIndex);
	    			var id = rec.get('id');
	    			var name = rec.get('name');
	    			var servicesGrid = me.output[0].list;
	    			var record = servicesGrid.getSelectionModel().getSelected();
	    			var serviceId = record.get("serviceId");
	    			Ext.Msg.confirm(this.titleConfirmDeleteMsg, this.textConfirmDeleteMsg.replace('{name}', name), function(btn) {
						if (btn == 'yes') {
							var loadMask = new Ext.LoadMask(Ext.getBody(), {
								msg : me.loadingMessage
							});
							var errorCallback = function(response, form, action) {
								Ext.Msg.show({
									msg : this.errorDeleteConsumerText,
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
								grid.store.load();
								loadMask.hide();
							};
							var successCallback = function(response, form, action) {
								grid.store.load();
								loadMask.hide();
							};
							this.deleteRuntime(serviceId, id, successCallback, errorCallback, grid);
							
			
						}
					},this);
	    		}
			}],
			/**
			 *    private: method[deleteRuntime] deletes a consumer
			 *      * serviceId : the serviceId of the runtime
			 *      * name : the name of the runtime
			 *      * successCallback: function to call in case of success
			 *      * errorCallback: function to call in case of error
			 *      * scope: the scope of the callbacks (optional)
			 */
			deleteRuntime : function(serviceId, id, successCallback, errorCallback, scope) {
				
				var url = scope.osdi2ManagerRestURL + "services/"+ serviceId +"/runtimes/" + id;
				Ext.Ajax.request({
					method : 'DELETE',
					url : url,
					headers : {
						'Authorization' : scope.auth
					},
					scope : scope || this,
					success : successCallback,
					failure : errorCallback
				});
		
			},
		}];
    
    },
    /* retrieve the contextual menu for run
     * containers have record,grid,index,event
     */
    getRunContextMenuItems : function(){
    	var me =this;
    	return [{
    		ref: 'starthere',
    		
    		text: this.startFromHereText,
    		iconCls:'add_ic',
    		handler: function(){
    			var resourceId = this.refOwner.record.get('details').resourceId;
    			var servicesGrid = me.output[0].list;
    			var record = servicesGrid.getSelectionModel().getSelected();
    			var rowIndex = servicesGrid.store.indexOf(record);
    			if(record && rowIndex >= 0){
    				servicesGrid.createNewProcessRun(servicesGrid,rowIndex,me.defaultData,resourceId);
    			}
    		}	
    		
    	}];
    	
    }
});

Ext.preg(mxp.plugins.CMREOnDemandServices.prototype.ptype, mxp.plugins.CMREOnDemandServices);
