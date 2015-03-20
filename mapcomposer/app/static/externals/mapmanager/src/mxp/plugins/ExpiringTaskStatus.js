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
 *  .. class:: he.ExpiringTaskStatus(config)
 *
 *    Open a plugin to check the status of the Expire user task
 *    and OpenSDI Mangager to :
 *   
 */
mxp.plugins.ExpiringTaskStatus = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_he_expiring_task_status */
    ptype: "mxp_he_expiring_task_status",
    serverDateFormat: 'D M d H:i:s T Y',
    displayDateFormat: 'd/m/Y H:i:s',
    buttonText: "Account Expiration",
    latestAccountExpiringText : "Recent Expired Accounts",
    taskStatusText : "Expiring Task Status",
    taskDetailText: "Event Detail",
    reloadText: "Reload",
    lastExecutionLabel: "Last Execution",
    executedLabel: "Executed",
    lastExecutionStatusLabel: "Last Run Status",
    statusLabel:'Execution Outcome',
    emailNotificationStatusLabel:'Email Notification',
    currentStatusLabel: "Current Status",
    lastMessageLabel: "Last Message",
    emailText:"Email",
    statusText:"Status",
    messageText:"Message",
    receiverText:"Receiver",
    emailNotificationText:"Email Notification",
    expiredAccountsText: "Expired Accounts",
    dateText: "Date",
    loginManager: null,    
    setActiveOnOutput: true,
    
    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            iconCls:'sheduled_task_ic', 
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
                this.addOutput(); 

               
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.ExpiringTaskStatus.superclass.addActions.apply(this, [actions]);
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

        var statusUrl = this.statusUrl ? this.statusUrl : // the upload URL is configured in th plugin
            this.target.adminUrl ? this.target.adminUrl + "/mvc/admin/tasks/status" : // use relative path from adminUrl
            "/opensdi2-manager/mvc/admin/tasks/status"; // by default search on root opensdi-manager2
            
        var me = this;
        var objId =Ext.id();
        Ext.apply(this.outputConfig,{   
            layout: 'border',
            id: objId, //The unique identifier for the panel
            itemId:'task_status',
            xtype:'panel',
            closable: true,
            closeAction: 'close',
            iconCls: "sheduled_task_ic",  
            header: false,
            deferredReneder:false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            
            items:[
                  //EXPIRED USER PANEL
                 {
                    title: this.latestAccountExpiringText,
                    iconCls: 'group_delete_ic',
                    xtype:'grid',
                    ref:'statuslog',
                    loadMask:true,
                    autoExpandColumn: 'expiredUsers',
                    tbar: [{
                      ref:'../reloadBtn',
                      iconCls:'refresh_ic', 
                      text: this.reloadText,
                      tooltip: this.reloadText,
                      handler:function(bt){
                        bt.refOwner.getStore().load();
                        bt.refOwner.getSelectionModel().clearSelections();
                        bt.refOwner.refOwner.detail.hide();
                      }
                    }],
                    sm: new Ext.grid.RowSelectionModel(
                      {
                        singleSelect:true,
                        listeners:{
                          //load details
                          rowSelect: function(sm,rowIndex,record){
                            var detailPanel = sm.grid.refOwner.detail
                            detailPanel.form.getForm().loadRecord(record);
                            if(record.json.emailNotificationLog){
                              detailPanel.notificationLogGrid.getStore().loadData(record.json);
                            }
                            detailPanel.show();
                          }
                        }
                      }
                    ),
                    columns:[
                      { 
                        header: this.dateText,
                        width: 170,
                        xtype:'datecolumn',
                        format:this.displayDateFormat,
                        dataIndex: 'date'
                      }, {
                        
                        id: 'expiredUsers',
                        xtype: 'templatecolumn',
                        tpl: '<tpl for="expiredUsers">{name} </tpl>',
                        header: this.expiredAccountsText,
                        dataIndex: 'expiredUsers'
                      }, { 
                        header: this.statusText,
                        width: 170,
                        dataIndex: 'status',
                        xtype:'gridcolumn',
                        renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                                    //render icon in case of success
                                    var classes = 'x-grid-center-icon action_column_btn ' + (value =="Success" ? 'accept' : 'close');
                                     return '<div class="'+ classes +'" style="width:15px;float:left;margin-right:2px;">'+'</div>' + value;
                                return value;
                             }
                      },{ 
                        header: this.emailNotificationText,
                        width: 170,
                        dataIndex: 'emailNotificationStatusSummary',
                        xtype:'gridcolumn',
                        renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                                    //render icon in case of success
                                    var classes = 'x-grid-center-icon action_column_btn ' + (value =="Success" ? 'accept' : 'close');
                                     return '<div class="'+ classes +'" style="width:15px;float:left;margin-right:2px;">'+'</div>' + value;
                                return value;
                             }
                      }
                    ],
                    store: new Ext.data.JsonStore({
                      root: 'expiredUsersLog',
                      id: 'date',
                      sortInfo: {
                          field: 'date',
                          direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
                      },
                      fields: [ 
                        { name: 'date', type: 'date', dateFormat: this.serverDateFormat}, 
                        'expiredUsers',
                        'status',
                        'emailNotificationStatusSummary',
                        'emailNotificationLog'
                      ],
                      autoLoad: true,
                      url: statusUrl,
                      auth:this.auth,
                      headers: {Authorization:this.auth},
                      listeners: {
                        beforeload: function(a,b,c){
                            a.proxy.conn.headers = a.proxy.conn.headers ? a.proxy.conn.headers : {};
                            if( a.proxy.conn.headers ){
                                if(this.auth){
                                    a.proxy.conn.headers['Authorization'] = me.auth;
                                }
                            }else{
                                if(this.auth){
                                    a.proxy.conn.headers['Authorization'] = me.auth;
                                }
                            }
                           
                        },
                        load : function( store, records, options ){
                          var json = store.reader.jsonData;
                          var CurrentStatus = Ext.data.Record.create([
                              {name: "lastExecutionOutCome", type: "date",dateFormat: this.serverDateFormat },
                              {name: "lastRun", type: "string"},
                              {name: "status", type: "string"},
                              {name: "message", type: "string"}
                          ]);
                          var record = new CurrentStatus(json);
                          var container = Ext.getCmp(objId);
                          if(container!=null){
                            container.status.getForm().loadRecord(record); 
                          }
                        }
                      }
                    }),
                    layout:'fit',
                    autoScroll:true,
                    auth: this.auth,
                    autoWidth:true,
                    region:'center'
                },{
                  frame: true,
                  region:'west',
                  resizable:true,
                  width:400,
                  autoScroll:true,
                  items:[
                  //LAST RUN STATUS
                  {
                    title: this.taskStatusText,
                    bodyStyle:'padding:5px 5px 0',
                    iconCls: 'clock_ic', 
                    xtype:'form',
                    frame: true,
                    ref:'../status',
                    items:[{
                      xtype:'displayfield',
                      anchor:'90%',
                      renderer: Ext.util.Format.dateRenderer(this.displayDateFormat),
                      fieldLabel: this.lastExecutionLabel,
                      
                      name: 'lastRun'
                    },{
                      xtype:'displayfield',
                      fieldLabel:this.lastExecutionStatusLabel,
                      name: 'lastExecutionOutCome'
                    },{
                      xtype:'displayfield',
                      fieldLabel:this.currentStatusLabel,
                      name: 'status'
                    },{
                      xtype:'displayfield',
                      fieldLabel:this.lastMessageLabel,
                      name: 'message'
                    }
                    ]
                  },{
                    //DETAIL PANEL
                    title: this.taskDetailText,
                    iconCls: 'clock_ic', 
                    ref:'../detail',
                    hidden:true ,
                    frame: true,

                    items:[
                      {
                        xtype:'form',
                        ref:'form',
                        items:[
                      
                          {
                            xtype:'displayfield',
                            renderer: Ext.util.Format.dateRenderer(this.displayDateFormat),
                            fieldLabel: this.executedLabel,
                            
                            name: 'date'
                          },{
                            xtype:'displayfield',
                            fieldLabel:this.statusLabel,
                            name: 'status'
                          },{
                            xtype:'displayfield',
                            fieldLabel:this.emailNotificationStatusLabel,
                            name: 'emailNotificationStatusSummary'
                          }]
                      },{
                        xtype:'grid',
                        ref: 'notificationLogGrid',
                        autoExpandColumn:'message',
                        columns:[
                          {
                            name:'receiver',
                            dataIndex:'receiver',
                            header:this.receiverText
                          },{
                            name:'address',
                            dataIndex:'address',
                            hidden: true,
                            header:this.emailText
                           },{
                            name:'status',
                            dataIndex:'status',
                            header:this.statusText,
                            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                                    //render icon in case of success
                                    var classes = 'x-grid-center-icon action_column_btn ' + (value =="Success" ? 'accept' : 'close');
                                     return '<div class="'+ classes +'" style="width:15px;float:left;margin-right:2px;">'+'</div>' + value;
                                return value;
                             }
                           },{
                            id:'message',
                            dataIndex:'message',
                            header: this.messageText
                           }
                        ],
                        height: 200,
                        
                        
                        store: new Ext.data.JsonStore({
                          
                          title:'Expired Users',//TODO i18n
                          root:'emailNotificationLog',
                          fields: ['receiver','address','status','message']
                        }),
                        name: 'expiredUsers'
                      }
                    ]
                  }]
                }
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
                        var isCurrentItem = "task_status" == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
        return mxp.plugins.ExpiringTaskStatus.superclass.addOutput.apply(this, arguments);
    }
});

Ext.preg(mxp.plugins.ExpiringTaskStatus.prototype.ptype, mxp.plugins.ExpiringTaskStatus);