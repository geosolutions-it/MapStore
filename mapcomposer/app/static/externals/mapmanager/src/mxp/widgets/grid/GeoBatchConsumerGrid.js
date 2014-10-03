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
	 * Property: GWCRestURL
	 * {string} the GWC ReST Url. If present, a button
     * that allows to manage GWC layers to clean tile cache will be present
	 */
    GWCRestURL: null,
    autoload:true,
    /* i18n */
    statusText: 'Status',
    startDateText: 'StartDate',
    startFileText:'File',
    refreshText:'Refresh',
    descriptionText:'Description',
    tooltipDelete: 'Clear this',
    tooltipLog: 'Check Log',
    autoExpandColumn: 'description',
    clearFinishedText: 'Clear Finished',
    loadingMessage: 'Loading...',
    cleanMaskMessage:'Removing consumer data...',
    textConfirmDeleteMsg: 'Do you confirm you want to delete event consumer with UUID:{uuid} ? ',
    errorDeleteConsumerText:'There was an error while deleting consumer',
    confirmClearText: 'Do you really want to remove all consumers with SUCCESS or FAIL state?',
    GWCButtonLabel: 'Tile Cache',
    /* end of i18n */
    //extjs grid specific config
    autoload: this.flowsgrid ? true : false,
    loadMask:true,
    viewConfig: {
        getRowClass: function(record, index) {
            var c = record.get('status');
            if (c == 'SUCCESS') {
                return 'row-green';
            } else if (c == 'RUNNING') {
                return 'row-yellow';
            }else if (c == 'FAIL'){
                return 'row-red';
            }
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
        // create the Data Store
        this.store = new Ext.data.Store({
            autoLoad: this.autoload,
            // load using HTTP
            url: this.geoBatchRestURL + 'flows/' + this.flowId + '/consumers',
            record: 'consumer',
            idPath: 'uuid',
            fields: [{name: 'status', mapping: '@status'},
                   'uuid',
                   'startDate',
                   'description'],
            reader:  new ie10XmlStore({
                 record: 'consumer',
                idPath: 'uuid',
                fields: [{name: 'status', mapping: '@status'},
                   'uuid',
                   'startDate',
                   'description']
            }),
            listeners:{
                beforeload: function(a,b,c){
                   
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
                   
                }
            },
            sortInfo: {
                field: 'startDate',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            }
        });
    
    
       
        this.tbar = [{
                iconCls:'refresh_ic',
                xtype:'button',
                text:this.refreshText,
                scope:this,
                handler:function(){
                    this.store.load();
                }
            },"->",{
                iconCls:'broom_ic',
                xtype:'button',
                text:this.clearFinishedText,
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
        this.columns= [
            {id: 'uuid', header: "ID", width: 220, dataIndex: 'uuid', sortable: true},
            {id: 'status', header: this.statusText, width: 100, dataIndex: 'status', sortable: true},
            {id: 'startDate', header: this.startDateText, width: 180, dataIndex: 'startDate', sortable: true},
            {id: 'file', header: this.startFileText, dataindex: 'description',width: 180, 
                renderer: function(val){
                    var index = val.indexOf('first event:');
                    if( index > 0) {
                        return val.substring(index + 12,val.length -1); 
                    } 
                } 
            },
            {id: 'description', header: this.descriptionText, dataIndex: 'description', sortable: true},
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
        ],
        mxp.widgets.GeoBatchConsumerGrid.superclass.initComponent.call(this, arguments);
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
            this.textConfirmDeleteMsg.replace('{uuid}',uuid),
            function(btn) {
                if(btn=='yes') {
                    me.deleteConsumer(uuid,successCallback,errorCallback,me);
                    loadMask.show();
                    
                }
            });
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
        var url = this.geoBatchRestURL + "consumers/" + uuid + "/log";
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
                            
                        Ext.Ajax.request({
                            method: 'GET',
                            url: url,
                            bodyStyle:"font-family: monospace;",
                            headers: {
                                'Authorization' : this.auth
                            },
                            scope: this,
                            success: function(response, form, action) {
                                
                                win.log.setValue(response.responseText);
                                loadMask.hide();
                            },
                            failure: function(response, form, action) {
                                loadMask.hide();
                            }
                        });
                        loadMask.show();
                    }
        });
        win.show();
    },
     /**
     *    private: method[deleteConsumer] deletes a consumer
     *      * uuid : the uuid of the consumer
     *      * successCallback: function to call in case of success 
     *      * errorCallback: function to call in case of error
     *      * scope: the scope of the callbacks (optional)
     */
    deleteConsumer: function(uuid,successCallback,errorCallback,scope){
        
        var url = this.geoBatchRestURL + "consumers/" + uuid + "/clean";
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
        var url = this.geoBatchRestURL + 'flows/' + flowId + '/consumers';
		this.store.proxy.setUrl(url, true);
        
        this.store.load();
    }
    
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.GeoBatchConsumerGrid.prototype.xtype, mxp.widgets.GeoBatchConsumerGrid);
