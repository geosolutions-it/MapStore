/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 
Ext.ns("mxp.widgets");
//HACK TO MAKE FIND FIELD RECOURSIVE (TO SUPPORT MULTIPLE CHECKBOXES

/**
 * Generic Entity Manager for Json CRUD services.
 * These services can be provided by OpenSDI Manager 2
 * 
 * 
 */
mxp.widgets.JSONEntityRESTManager = Ext.extend(Ext.Panel, {
	 /** api: xtype = mxp_geostore_category_manger */
    xtype: "json_entity_rest_manager",
    loginManager: null,    
    setActiveOnOutput: true,
    /**
     * i18n
     */
    resourceListTitle: "Resources",
    emptyMessage: 'No resource to display',
    displayMessage: 'Displaying {0} - {1} of {2}',
    saveText: "Save",
    createTitle:"Create",
    createText:"Create",
    refreshText:"Refresh",
    dumpText: "Dump",
    dumpDataText: "Dump Data",
    restoreText:"Restore",
    restoreDataText: "Restore Data",
    restoreSuccessText: "Data restored successfully",
    editTitle:"Edit",
    destroyTitle:"Delete",
    successText:"Success",
    destroySuccessText: " deleted successfully",
    errorText:"Error",
    createSuccessText: " created successfully",
    editSuccessText: " updated successfully",
    titleConfirmDeleteMsg: "Confirm Deletion",
    textConfirmDeleteMsg: "Are you sure you want to delete {uuid}?",
    /** api: config[category]
     *  ``String``
     *  The category to browse
     */
    /** api: config[leftPanelWidth]
     *  ``String``
     *  Width of the category list
     */
    leftPanelWidth: 430,
    /** api: config[iconCls]
     *  ``String``
     *  Icon for the tool
     */
    iconCls: null,
     /** api: config[baseUrl]
     *  ``String``
     *  The URL of to append to the component
     */
    baseUrl: "",

	initComponent: function() {
        var entityButtons = this.createEntityButtons();
        var leftPanel = {
            region:'west',
            layout:'fit',

            tbar: new Ext.Toolbar(
            {
                layout: "auto",
                items: {
                        xtype: 'buttongroup',
                        border:false,
                        columns:1,
                        items:[entityButtons]
                }
            }),
            //fill the remaining space with a panel
            items:{xtype:'panel',frame:true, border: false},
            border: false
        };
        // create default writer
        if(!this.writer){
            this.writer = new Ext.data.JsonWriter({
                encode: true,
                writeAllFields: true // write all fields, not just those that changed
            });
        }
        //The editor panel
        this.editorContainer = new Ext.Panel({
            xtype:'panel',
            layout:'card',
            deferredRender:false,
            layoutOnCardChange:true,
            activeItem:0,
            autoScroll:false,
            region:'center',
            
            
            ref:'editorContainer',
            items: this.createEntityEditors()
        });
        
        this.items=[leftPanel,this.editorContainer]

		
		mxp.widgets.JSONEntityRESTManager.superclass.initComponent.call(this, arguments);
	},
   
    /**
     * private method[loadEditor] Open a resource in the editor from its button
     * ``Ext.Button`` button with the same itemId
     * 
     */
    loadEditor: function(btn,cat){
        var category =cat;
        var editor = this.editorContainer
        //TODO check if dirty
        editor.layout.setActiveItem(btn.itemId);
        var editor = editor.getComponent(btn.itemId);
        var grid = editor.grid;
        editor.doLayout();
        //load data
        grid.store.load();
        
    },
    
    createEntityButtons: function(){
        var buttons = [];
        for(var i = 0; i < this.entities.length; i++){
            var entity = this.entities[i];
            buttons.push({
                pressed: i ==0,
                iconCls: entity.iconCls,
                xtype:'button',
                toggleGroup:'entityManagerMenu',
                text: entity.pluralName,
                itemId: entity.id,
                handler: this. loadEditor,
                scope:this
            });  
        }
        
        return buttons;
    },
    /**
     * private method[createEntityEditors]
     * creates the entity editors.
     */
    createEntityEditors: function(){
        
        var editors = [];
        var me = this;
        for(var i = 0; i < this.entities.length; i++){
            var entity = this.entities[i];
            var columns = this.createColumns(entity);
            editors.push({
                id: entity.id,
                border:false,
                xtype:'panel',
                layout:'border',
                title: entity.pluralName,
                iconCls: entity.iconCls,
                itemId: entity.id,
                items:[{
                        region:'center',
                        xtype:'grid',// xtype:'editorgrid',
                        border:false,
                        //plugins:[editor],
                        ref:'grid',
                        entity: entity, // add the entity the configuration available everywhere
                        loadMask:true,
                        autoExpandColumn: entity.autoExpandColumn,
                        viewConfig: {
                            forceFit:true,
                            //fitcontainer:true
                        },
                        tbar:[{
                                xtype:'button',
                                text: entity.createText || this.createText,
                                iconCls:'row_expand',
                                ref:'../create',
                                hidden: !entity.canCreate,
                                scope:this,
                                handler : function(btn){
                                   this.createEntity(btn.refOwner.entity,btn.refOwner);
                                },
                            },{
                                xtype:'button',
                                text: entity.refreshText || this.refreshText,
                                iconCls:'refresh_ic',
                                ref:'../refresh',
                                scope:this,
                                handler : function(btn){
                                   btn.refOwner.store.load();
                                }
                            },"->",{
                                xtype:'button',
                                text: entity.dumpText || this.dumpText,
                                iconCls:'inbox-download_ic',
                                ref:'../refresh',
                                hidden: !entity.api.dump,
                                scope:this,
                                handler : function(btn){
                                   this.dumpData(btn.refOwner.entity); 
                                }
                            },{
                                xtype:'button',
                                text: entity.restoreText || this.restoreText,
                                iconCls:'inbox-upload_ic',
                                ref:'../refresh',
                                hidden: !entity.api.restore,
                                scope:this,
                                handler : function(btn){
                                   this.restoreData(btn.refOwner.entity); 
                            }
                        }],
                        columns:columns,
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect:true,
                            entityId: entity.id,
                            listeners:{
                                rowselect:function(sm,rowIndex,record){
                                    /*var container = me.editorContainer.getComponent(sm.entityId);
                                    var formPanel = container.form;
                                    var form = formPanel.getForm();
                                    form.loadRecord(record);*/
                                    
                                }
                            }
                        }),
                        store : new Ext.data.Store({
                            autoLoad: entity.autoload,
                            autoSave: true,
                            // load using HTTP
                            url: this.baseUrl + entity.basePath,
                            
                            fields: entity.fields,
                            reader:  new Ext.data.JsonReader({
                                fields: entity.fields,
                                restful: entity.restful,
                                idProperty: entity.idProperty,
                                root:entity.root,
                                totalProperty: entity.totalProperty || "total",
                                writer: this.writer
                            }),
                            

                            listeners:{
                             beforeload: function(store,opt){
                                
                             },
                             load:function(store,records,opts){
                                
                             }
                            }
                        }),
                        listeners:{
                            scope:this,
                            success:  function(response){
                                var grid = this.editorContainer.getComponent(entity.id).grid;
                                grid.store.load();
                            }
                        }
                        
                        
                }]
            });  
        }
        return editors;
    },
    /**
     * private method[createColumns] 
     * create columns for an entity
     */
    createColumns: function(entity){
        //copy the entity configuration od columns
        var columns = entity.columns.slice(0);
        if(entity.canEdit){
            columns.push({
                    xtype:'actioncolumn',
                    hideable:false,
                    width: 35,
                    maxWidth:35,
                    tooltip: this.tooltipEdit,
                    handler: this.editEntity,
                    fixed: true,
                    items:[{
                        iconCls:'pencil_ic',
                        width:25,
                        scope:this,
                        getClass: function(v, meta, rec) {
                           if(rec.get('canEdit') && rec.get('canEdit') == false )return 'x-hide-display';
                            return 'x-grid-center-icon action_column_btn';
                          
                        }
                    }]
            });
        }
        if(entity.canDelete){
            columns.push({
                    xtype:'actioncolumn',
                    hideable:false,
                    width: 35,
                    maxWidth:35,
                    fixed: true,
                    tooltip: this.tooltipDelete,
                    handler: this.confirmDeleteEntity,
                    items:[{
                        iconCls:'delete_ic',
                        width:25,
                        tooltip: this.tooltipDelete,
                        scope:this,
                        getClass: function(v, meta, rec) {
                            if(rec.get('canDelete') && rec.get('canDelete') == false )return 'x-hide-display';
                            return 'x-grid-center-icon action_column_btn';
                          
                        }
                    }]
            });
        }
        return columns;
    
    },
    /**
     * private method[getEntityEditor] 
     * get an entity editor for the selected entity,
     * using the passed mode
     * ``Object`` entity 
     * ``string`` mode (create or edit)
     */
    getEntityEditor: function (entity,mode){
        var formFields = entity.form ? entity.form[mode] : entity.formFields;
        //Workaround: 
        // the form fields are written from extjs constructor (for combobox)
        // and after the first destruction they can are not usable anymore.
        // we have to copy each field to make the new form work.
        
        
        var editor = {
                    xtype: 'form',
                    frame:true,
                    ref: 'editor',
                    monitorValid:true,
                    defaults:{
                        anchor: '100%',
                        xtype:'textfield'
                    },
                    //allowed items for the selected mode or 
                    items: formFields,
                    buttons: [{
                        text: this.saveText,
                        ref:'../saveBtn',
                        formBind:true,
                        iconCls: 'accept',
                        scope:this,
                        entity: entity,
                        mode: mode,
                        handler: function(button){
                            var form = button.refOwner.getForm();
                            this.upsertEntity(button);
                            
                        }
                    }]
                    
                };
        return editor;
    },
    
    /**
     * private method[editEntity] 
     * show editing window from a record in a grid,
     * is binded to action column action event 
     */
    editEntity: function(grid, rowIndex, colIndex) {
        var rec = grid.store.getAt(rowIndex);
        var entity = grid.entity;
        var win = new Ext.Window({
                    iconCls:'pencil_ic',
                    title:  entity.editTitle  || this.editTitle,
                    height: entity.editHeight || 500,
                    width:  entity.editWidth  || 300, 
                    store:grid.store,
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    title:this.edit,
                    layout:'fit',
                    items:  this.getEntityEditor(entity,'edit'),
                    listeners: {
                        scope: this,
                        afterrender : function(win){
                            //TODO get complete resource
                            win.editor.getForm().loadRecord(rec);
                           
                        }
                    }
                    
                    
        });
        win.show();
        //TODO edit
        
    },
    /**
     * private method[createEntity] 
     * create a new entity-
     * ``Object`` entity the configuration of the Entity
     */
    createEntity: function(entity,grid) {
        
        var win = new Ext.Window({
                    iconCls:'add',
                    title: entity.createTitle || this.createTitle,
                    height: entity.editHeight || 500,
                    width: entity.editWidth || 300, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    title:this.edit,
                    layout:'fit',
                    items:  this.getEntityEditor(entity,'create')
                    
        });
        
        win.show();
        //TODO edit
        
    },
    /**
     * private method[confirmDeleteEntity] 
     * show a window to confirm delete
     * Same parameters of the grid action column handler
     */
    confirmDeleteEntity: function(grid, rowIndex, colIndex) {
        var rec = grid.store.getAt(rowIndex);
        var entity = grid.entity;
        var uuid = rec.get(entity.displayField);
        var me = this;
        Ext.Msg.confirm(
            this.titleConfirmDeleteMsg,
            this.textConfirmDeleteMsg.replace('{uuid}',uuid),
            function(btn) {
                if(btn=='yes') {
                    me.deleteEntity(rec,entity,me.onSuccess,me.onFailure);
                    
                    //TODO LOAD MASK
                    //loadMask.show();
                    
                }
            });
        
    },
    /**
     * private method[upsertEntity] CREATES OR UPDATE AN ENTITY (BASED ON THE entity api object or with default values).
     * ``ExtButton`` the button that run the event (contains useful references to the other GUI component.
     *               button fires events ('success','failure') 
     */
    upsertEntity: function(button){
        var entity = button.entity;
        var mode = button.mode;
        var form = button.refOwner.getForm();
        var entity = button.entity;
        var api ={ url : this.baseUrl +  entity.basePath,method: mode =='create' ? 'POST' : 'PUT'}
        if(entity.api && entity.api[mode] ){
          api = entity.api[mode] ;
          api["url"] = this.baseUrl + api["url"];
          
        }

       
        //var Record = Ext.data.Record.create(entity.fields);
        
        data = this.getJsonFromForm(form,entity);
        Ext.Ajax.request({

            url: api.url,
            jsonData:data,
            params:{
                //TODO headers auth
             },
            headers: api.headers || {
                Accept:'application/json'
            },
            extraParams: {
                entity: entity,
                mode: mode
                
            },
            method: api.method,
            scope:  this,
            success: function (a,b,c,d){
                var w = button.refOwner.refOwner;
                if(w.close){
                    w.close();
                }
                this.onSuccess(a,b,c,d);
            },
            failure: this.onFailure
        });
    },
    /**
     * private method[deleteEntity] 
     * delete an entity-
     * ``Object`` Record the record to delete
     * ``Object`` entity the configuration of the Entity
     * ``function`` success callback
     * ``function`` error callback
     */
    deleteEntity: function(rec, entity, success,error){
        var api ={ url : this.baseUrl +  entity.basePath, method: 'DELETE'};
        var mode = 'destroy';
        var data = this.getJsonFromRecord(rec,entity);
        if(entity.api && entity.api[mode] ){
          api = Ext.apply({},entity.api[mode]);
          api["url"] = this.replaceValues(api["url"],data,entity);
          api["url"] = this.baseUrl + api["url"];
        }

        Ext.Ajax.request({

            url: api.url,
            jsonData:data,
            params:{
                //TODO headers auth
             },
            headers: api.headers || {
                Accept:'application/json'
            },
            extraParams: {
                entity: entity,
                mode: mode
            },
            method:api.method,
            scope:this,
            success: success,
            failure: error
        });
    },    
    /**
     * fold the mapping and recreate the original object
     */
    getJsonFromForm: function(form,entity){
        var fields = entity.fields;
        var res = {};
        var fieldData = form.getFieldValues();
        var data = form.getValues();
        //console.log(data);
        //console.log(fieldData);
        for(var i = 0; i< entity.fields.length; i++){
            var field = entity.fields[i];
            var name = field.name || field;
            var mapping = field.mapping || field.name ||field;
            //inverse conversion (should be biettive transformation)
            res[mapping] = data[name];
           
            
        }
        return res;
    },
    /**
     * fold the mapping and recreate the original object
     */
    getJsonFromRecord: function(rec,entity){
        var res = {};
        //console.log(data);
        //console.log(fieldData);
        for(var i = 0; i< entity.fields.length; i++){
            var field = entity.fields[i];
            var name = field.name || field;
            var mapping = field.mapping || field.name ||field;
            //inverse conversion (should be biettive transformation)
            res[mapping] = rec.get(name);
            if(entity.idProperty == name){
                res[mapping] = rec.id;
            }
           
            
        }
        return res;
    },
    
    /**
     * private method[dumpData] 
     * prompt dump
     */
    dumpData: function(entity){
        var me = this;
        var win = new Ext.Window({
                    iconCls:'inbox-download_ic',
                    title:me.dumpDataText,
                    width: 700,
                    height: 600, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    tbar:["->",{
                        text:this.refreshText,
                        iconCls:'refresh_ic',
                        handler: function(btn){
                            win.refreshDump();
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
                            win.refreshDump();
                             
                        }
                    },
                    refreshDump: function(){
                        var loadMask = new Ext.LoadMask(win.getEl(), {msg:me.loadingMessage});
                        var mode = 'dump';
                        var api = {method:"GET"};
                        if(entity.api && entity.api[mode] ){
                          api = Ext.apply({},entity.api[mode]);
                          //api["url"] = this.replaceValues(api["url"],data,entity);
                          api["url"] = me.baseUrl + api["url"];
                        }   
                        var url =api.url;
                        
                        Ext.Ajax.request({
                            method: api.method,
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
     * private method[restoreData] 
     * prompt dump
     */
    restoreData: function(entity){
        var me = this;
        var win = new Ext.Window({
                    iconCls:'inbox-upload_ic',
                    title:me.restoreDataText,
                    width: 700,
                    height: 600, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:false,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    
                    items: [{
                        xtype:'textarea',
                        layout:'fit',
                        cls:'geobatch_log',
                        readOnly:false,
                        ref:'log'
                        }
                    ],
                    buttons:[{
                        text:this.restoreText,
                        iconCls:'inbox-upload_ic',
                        ref:'../restore',
                        handler: function(btn){
                            var dump =  btn.refOwner.log.getValue();
                            win.restoreDump(dump);
                        } 
                    }],
                    restoreDump: function(dump){
                        var loadMask = new Ext.LoadMask(win.getEl(), {msg:me.loadingMessage});
                        var mode = 'restore';
                        var api = {method:"POST"};
                        if(entity.api && entity.api[mode] ){
                          api = Ext.apply({},entity.api[mode]);
                          //api["url"] = this.replaceValues(api["url"],data,entity);
                          api["url"] = me.baseUrl + api["url"];
                        }   
                        var url =api.url;
                        
                        Ext.Ajax.request({
                            method: api.method,
                            headers: api.headers || {
                                Accept:'application/json'
                            },
                            extraParams: {
                                entity: entity,
                                mode: mode
                            },
                            url: url,
                            jsonData: dump,
                            bodyStyle:"font-family: monospace;",
                            headers: {
                                'Authorization' : this.auth
                            },
                            scope: me,
                            success: function( a,b,c){
                                loadMask.hide();
                                me.onSuccess(a,b,c);
                            },
                            failure: function( a,b,c){
                                loadMask.hide();
                                me.onFailure(a,b,c);
                            }
                        });
                        loadMask.show();
                    }
        });
        win.show();
    },
    /**
     * replace string with {VARNAME} notation with content from data object
     */
    replaceValues : function(destination,data,entity){        
        destination = destination.replace(/{(\w+)}/g, function() {
           var varName = arguments[1];
           return data[varName];
        });
        return destination;
    },

     /**
     * private method[onFailure]
     * manage the negative response of Run call
     */
    onFailure : function(response){
        Ext.Msg.show({
            title: this.errorText,
            msg: response.statusText + "(status " + response.status + "):  " ,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });	
    },
    /**
     * private method[onSuccess]
     * manage positive response of Run call (ID of the consumer)
     */
    onSuccess : function(response,options){
        var msg = response.responseText;
        var mode = options.extraParams.mode;        
        var entity = options.extraParams.entity;
        //create and update have response text with Id
        if(mode == 'create' || mode == 'update'){
            msg += this[mode + "SuccessText"];
        }else{
            msg = this[mode + "SuccessText"];
        }
        Ext.Msg.show({
            title: this.successText,
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO  
        });	
        this.editorContainer.getComponent(entity.id).grid.store.reload();
    }
});
Ext.reg(mxp.widgets.JSONEntityRESTManager.prototype.xtype, mxp.widgets.JSONEntityRESTManager);