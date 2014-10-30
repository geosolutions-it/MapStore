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

    buttonText: "Workflows",
	flowsListTitle:'Flows',
    runButtonText:'Run',
    consumersGridTitle: 'Consumers',
    flowRunFormCategory: 'GEOBATCH_RUN_CONFIGS',
    loginManager: null,    
    setActiveOnOutput: true,
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
        
        this.outputConfig = this.outputConfig || {};
        // create the selection model
        var selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect:true,
            listeners:{
                 scope:this,
                  //update the right grid on select
                 rowselect: function(flowsgrid,rowIndex,record){
                    var flowid = record.get('id');
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
        var buttons = []
        if(this.flowRunFormCategory){
            buttons.push({
                iconCls:'update_manager_ic',
                ref:'../runBtn',
                text: this.runButtonText,
                disabled:true,
                scope:this,
                handler:function(btn){
                    this.showRunLocalForm(btn.flowId);
                }
            });
            buttons.push("->");
        }
       
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
            sm: selectionModel
        }
        
        Ext.apply(this.outputConfig,{
            layout: 'border',
			itemId:'GBflows',
            xtype:'panel',
            closable: true,
            closeAction: 'close',
            iconCls: 'geobatch_ic',  
            header: false,
            deferredReneder:false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            items:[
                {
                    xtype:'mxp_geobatch_consumer_grid',
                    geoBatchRestURL: this.geoBatchRestURL,
                    title: this.consumersGridTitle,
                    layout:'fit',
                    autoScroll:true,
                    flowId: this.flowId,
                    auth: this.auth,
                    autoWidth:true,
                    region:'center',
                    ref:'consumers'
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
    showRunLocalForm: function(flowId,fileId){
        //apply local parameters to the configuration flor the selected flow
        if(this.runConfigs[flowId]){
            var me = this;
            
            var runFormConfig = Ext.apply(this.runConfigs[flowId],{
                //xtype:'geobatch_run_local_form',
                //layout:'fit',
                flowId: flowId,
                fileId:fileId,
                geoBatchRestURL: this.geoBatchRestURL,
                //baseDir: this.baseDir,
                //mediaContent: this.target.initialConfig.mediaContent
                listeners:{
                    success: function(flowId){
                        win.close();
                        setTimeout(function(){
                            var consumers = me.tab.consumers;
                            consumers.store.load()}
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
    }
});

Ext.preg(mxp.plugins.GeoBatchFlows.prototype.ptype, mxp.plugins.GeoBatchFlows);
