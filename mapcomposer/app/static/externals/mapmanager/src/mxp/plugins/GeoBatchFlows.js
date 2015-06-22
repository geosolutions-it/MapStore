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
 *  .. class:: GeoBatchFlows(config)
 *
 *    Open a plugin to interact with GeoBatch flows :
 *    * obtain information and clean consumers of all the flows on a GeoBath Instance 
 */
mxp.plugins.GeoBatchFlows = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_geobatch_flows */
    ptype: "mxp_geobatch_flows",
    
    // i18n
    buttonText: "Workflows",
	
    flowsListTitle:'Flows',
	
    runButtonText:'Run',
	
    consumersGridTitle: 'Active',
	
    archivedGridTitle: 'Archived',
    // end i18n
    
    flowRunFormCategory: 'GEOBATCH_RUN_CONFIGS',
	
    loginManager: null,    
	
    setActiveOnOutput: true,
	
    showConsumersDetails: false,
	
    forceOrder: false,
    /* api configuration
        closable: if true the output element is closable
    */
    closable: true,
	
    /* api configuration
    baseDir: '/home/geosolutions/admin/',
    
     /** api: configuration[runConfigs]
      * a map of run configurations.
      * has the base configuration for each flow to run
      */
    runConfigs: {},
	
    /** api: configuration[skipFlowsNotInRunConfigs]
      * a true/false value used to only show flows configured
      * runConfigs. By default all geobatch flows are shown.
      */
    skipFlowsNotInRunConfigs: false,
	
     /** api: configuration[defaultRunConfig]
      * a default configuration to use.
      * if present it will be used as configuration when a 
      * runConfig is not found in runConfigs map
      * if null, no run config is defined for this flow,
      * so the action can not be runned from this UI
      */
    defaultRunConfig: null,
	
    /** api: method[addActions]
     */
    addActions: function() {        
        var thisButton = new Ext.Button({
            iconCls:'geobatch_ic', 
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
                this.addOutput();                
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.GeoBatchFlows.superclass.addActions.apply(this, [actions]);
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
        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;
				
        this.auth = this.target.auth;
        this.geoStoreRestURL = this.geoStoreRestURL || this.target.config.geoStoreBase || "/geostore/rest/";
        this.outputConfig = this.outputConfig || {};
		
        // create the selection model
        var selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect:true,
            listeners:{
                scope:this,
                //update the right grid on select
                rowselect: function(flowsgrid,rowIndex,record){
                    var flowid = record.get('id');
                    var flowName = record.get('name');
                    flowsgrid.grid.refOwner.consumers.changeFlowId(flowid);
                    flowsgrid.grid.refOwner.archived.changeFlowId(flowid);
                    flowsgrid.grid.refOwner.tabs.activate(flowsgrid.grid.refOwner.consumers);
                    if(flowsgrid.grid.runBtn){
                        //TODO manage run local or other forms
                        var runBtn = flowsgrid.grid.runBtn;
                        if(this.runConfigs[flowid]){
                            runBtn.setDisabled(false);
                            runBtn.flowId = flowid;
                            runBtn.flowName = flowName;
                        }else{
                            runBtn.setDisabled(true);
                            runBtn.flowId = null;
                            runBtn.flowName = null;
                        }                        
                    }
                } 
            }
        });
		
        //button for button runner
        var buttons = ['->'];
        
        var me = this;
		
        //configuration of the left grid of the flows 
        var flowsGrid = {
            xtype:'mxw_geobatch_flows_grid',
            tbar:buttons,
            geoBatchRestURL: this.geoBatchRestURL,
            region:'west',
            iconCls:'geobatch_ic',
            title:this.flowsListTitle,
            autoScroll:true,
            width:500,
            ref:'list',
            collapsible:true,   
            auth: this.auth,
            sm: selectionModel,
            forceOrder: this.forceOrder,
            flows: this.skipFlowsNotInRunConfigs ? this.runConfigs : null,
            runHandler: function(flowId, flowName) {
                this.runWorkflow(flowId, flowName);
            },
            scope: this
        }
        
        Ext.apply(this.outputConfig,{
            layout: 'border',
            itemId:'GBflows',
            xtype:'panel',
            closable: this.closable,
            closeAction: 'close',
            iconCls: 'geobatch_ic',  
            header: false,
            deferredReneder:false,
            hideMode:'offsets',
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            items:[
                {
                    xtype:'tabpanel',
                    region:'center',
                    ref:'tabs',
                    //activeItem: 0,
                    items:[{
                        xtype:'mxp_geobatch_consumer_grid',
                        geoBatchRestURL: this.geoBatchRestURL,
                        geoStoreRestURL: this.geoStoreRestURL,
                        title: this.consumersGridTitle,
                        layout:'fit',
                        autoScroll:true,
                        flowId: this.flowId,
                        auth: this.auth,
                        autoWidth:true,
                        mode: 'active',
                        hideMode:'offsets',
                        ref:'../consumers',
                        disabled: true,
                        showDetails: this.showConsumersDetails,
                        plugins: this.consumersPlugins
                    },{
                        xtype:'mxp_geobatch_consumer_grid',
                        geoStoreRestURL: this.geoStoreRestURL,
                        title: this.archivedGridTitle,
                        layout:'fit',
                        autoScroll:true,
                        flowId: this.flowId,
                        auth: this.auth,
                        autoWidth:true,
                        mode: 'archived',
                        hideMode:'offsets',
                        disabled: true,
                        ref:'../archived',
                        showDetails: this.showConsumersDetails,
                        plugins: this.consumersPlugins
                    }]
                },  
                flowsGrid
            ]
        });
		
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
                        var isCurrentItem = "GBflows" == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
		
        this.tab = mxp.plugins.GeoBatchFlows.superclass.addOutput.apply(this, arguments);
        return this.tab;
    },
	
    runWorkflow: function(flowId,flowName){
        if(this.runConfigs[flowId]){
            var config = Ext.apply(this.runConfigs[flowId],{
                flowId: flowId,
                geoBatchRestURL: this.geoBatchRestURL,
                adminUrl: this.target.adminUrl,                
            });
			
            var handler = Ext.create(config);
            if(handler.isForm()) {
                this.showRunLocalForm(flowId, flowName, handler, config);
            } else {
                handler.on({
                    success: function(flowId){
                        Ext.defer(function(){
                            var consumers = this.tab.consumers;
                            consumers.store.load()
                        },5000, this);
                    },
                    scope: this
                });
                handler.startFlow(flowId,flowName);
            }
        }
    },
    
    showRunLocalForm: function(flowId, flowName, handler, config){       
        var win = new Ext.Window({
			iconCls:'update_manager_ic',
			xtype:'form',
			title:this.runButtonText + " " + flowName,
			width: 325,
			height: config.height || 400, 
			//path:'csv/New Folder',
			minWidth:250,
			minHeight:200,
			layout:'fit',
			autoScroll:false,
			//closeAction:'hide',
			maximizable: true, 
			modal:true,
			resizable:true,
			draggable:true,
			items: [handler]
        });
		
        win.show();
		
        handler.on({
            success: function(flowId){
                win.close();
                Ext.defer(function(){
                    var consumers = this.tab.consumers;
                    consumers.store.load()
                },5000, this);
            },
            scope: this
        });
    }
});

Ext.preg(mxp.plugins.GeoBatchFlows.prototype.ptype, mxp.plugins.GeoBatchFlows);
