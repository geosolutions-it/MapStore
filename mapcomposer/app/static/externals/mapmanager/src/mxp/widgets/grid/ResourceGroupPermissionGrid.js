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
 *  class = ResourceGroupPermissionGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: ResourceGroupPermissionGrid
 * Grid panel that shows security rules for a resource
 *
 */
mxp.widgets.ResourceGroupPermissionGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_resource_gruop_permission */
    xtype: "mxp_resource_gruop_permission",

     /**
	 * Property: geostoreURL
	 * {string} the geostore REST Url
	 */
    geostoreURL: null,

     /**
     * Property: resourceId
     * {string} the resource id to manage
     */
    resourceId: null,

    /* i18n */
    refreshText: "Refresh grid",
    addText: "Add a new security rule based on user groups",
    addNewSecurityRuleTitleText: "Create a new Security Rule",
    editSecurityRuleTitleText: "Edit Security Rule for group '{0}'",
    groupNameTitleText: "Error", 
    groupNameExistsText: 'Already exists a rule for this group name, please select another one or edit his rule',
    groupNameIncompleteText: 'Not group selected. Please select one before save.',
    textSave:'Save',
    textClose:'Close',
    textGroupName: 'Group',
    textUserName: 'User',
    textCanRead: 'Can Read',
    textCanWrite: 'Can Write',
    editText: "Edit selected security rule",
    deleteText: "Delete selected security rule",
    trueBooleanText: "Yes",
    falseBooleanText: "No",
    confirmDeleteTitleText: "Delete Security Rule",
    confirmDeleteText: "Do you really want to delete the rule for the '{0}' group?",
    /* end of i18n */
    
    //extjs grid specific config
    autoload:true,
    loadMask:true,
    autoload:true,
    hideCanWrite: false,
    // runtime parameters
    selectedGroup: null,
    selectedRecord: null,

    // icons
    addIcon: 'add_ic',
    editIcon: 'table_edit',
    refreshIcon: 'refresh_ic',
    deleteIcon: 'delete_ic',

    initComponent : function() {
        
        // auth
        this.auth = this.auth ? this.auth : this.initialConfig.auth;

        //this object allows to save,get and delete groups
        this.resourcePermission = new GeoStore.ResourcePermission({ 
          authorization: this.auth,
          url: this.geostoreURL + 'resources/resource/' + this.resourceId + '/permissions'
        }).failure( function(response){ 
              Ext.Msg.show({
               title: this.failSuccessTitle,
               msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
        } );

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
                        var ret =  this.readRecords(data);
                        return ret;
                    }
        });

        // create the Data Store
        this.store = new Ext.data.Store({
            autoLoad: this.autoload,
            // load using HTTP
            url: this.geostoreURL + 'resources/resource/' + this.resourceId + '/permissions',

            record: 'SecurityRule',

            fields: [
                   'canRead',
                   'canWrite',
                   'groupId',
                   'groupName',
                   'userId',
                   'userName'],
            reader:  new ie10XmlStore({
                record: 'SecurityRule',
                fields: [{
                        name: 'canRead', 
                        type: 'boolean',
                        mapping: 'canRead'
                    },{
                        name: 'canWrite', 
                        type: 'boolean',
                        mapping: 'canWrite'
                    },{
                        name: 'userId', 
                        mapping: 'user/id'
                    },{
                        name: 'userName', 
                        mapping: 'user/name'
                    },{
                        name: 'groupName', 
                        mapping: 'group/groupName'
                    },{
                        name: 'groupId', 
                        mapping: 'group/id'
                    }]
            }),
            listeners:{
                beforeload: function(a,b,c){
                   
                    if( a.proxy.conn.headers ){
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                        a.proxy.conn.headers['Accept'] = 'text/xml';
                    }else{
                        a.proxy.conn.headers = {'Accept': 'text/xml'};
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                    }
                },
                load: function(store){
                    // only show rows with groupName (hide users' rows)
                    var index = 0;
                    store.each(function (record){
                        if(record.get("groupName") == null || record.get("groupName") == ""){
                            this.getView().getRow(index).style.display = 'none';
                        }
                        index++;
                    }, this);
                },
                scope:this
            }
        });

        this.tbar = [{
                iconCls:this.refreshIcon,
                xtype:'button',
                tooltip:this.refreshText,
                scope:this,
                handler:function(){
                    this.store.load();
                }
            },"->",{
                iconCls:this.addIcon,
                xtype:'button',
                tooltip:this.addText,
                scope:this,
                handler:function(){
                    this.addNewSecurityRule();
                }
            },{
                iconCls: this.editIcon,
                xtype:'button',
                id: this.id + "_edit_button",
                tooltip:this.editText,
                disabled: true,
                scope:this,
                handler:function(){
                    this.editSecurityRule();
                }
            },{
                iconCls: this.deleteIcon,
                xtype:'button',
                id: this.id + "_delete_button",
                tooltip:this.deleteText,
                disabled: true,
                scope:this,
                handler:function(){
                    this.deleteSecurityRule();
                }
        }];       
        this.columns= [{
                header: this.textGroupName, 
                width: 150, 
                dataIndex: 'groupName',
                sortable: true
            // Not show users' rows
            // },{
            //     header: this.textUserName, 
            //     width: 70, 
            //     dataIndex: 'userName',
            //     sortable: true
            },{
                id: 'canRead', 
                header: this.textCanRead, 
                xtype: "booleancolumn",
                trueText: this.trueBooleanText,
                falseText: this.falseBooleanText,
                width: 70, 
                dataIndex: 'canRead', 
                sortable: true
            },{
                id: 'canWrite', 
                header: this.textCanWrite, 
                xtype: "booleancolumn",
                trueText: this.trueBooleanText,
                falseText: this.falseBooleanText,
                width: 70, 
                dataIndex: 'canWrite',
                sortable: true
            }
        ];

        this.on("rowclick", this.onRowClick, this);

        mxp.widgets.ResourceGroupPermissionGrid.superclass.initComponent.call(this, arguments);
    },

    onRowClick: function(grid, rowIndex, columnIndex, e){
        var record = grid.store.getAt(rowIndex);
        this.selectedGroup = record.get("groupName");
        this.selectedRecord = record;
        if(this.selectedGroup){
            Ext.getCmp(this.id + "_edit_button").enable();
            Ext.getCmp(this.id + "_delete_button").enable();
        }else{
            Ext.getCmp(this.id + "_edit_button").disable();
            Ext.getCmp(this.id + "_delete_button").disable();
        }
    },

    editSecurityRule: function(){
        this.openSecurityRule(this.selectedGroup);
    },

    addNewSecurityRule: function(){
        this.openSecurityRule();
    },

    deleteSecurityRule: function(){
        var me = this;
        var msgText = String.format(this.confirmDeleteText, this.selectedGroup);
          Ext.MessageBox.confirm(
            this.confirmDeleteTitleText,
            msgText,
            function(response){
                 if(response == "yes"){
                    me.savePermissions({groupName: me.selectedGroup}, null, me.selectedGroup, true);
                 }
            }
         );    
    },

    openSecurityRule: function(selectedGroup){
        var me = this;

        var winnewgroup = new Ext.Window({
            iconCls: selectedGroup ? 'group_edit_ic' : 'group_add_ic',
            title: selectedGroup ? String.format(this.editSecurityRuleTitleText, selectedGroup): this.addNewSecurityRuleTitleText,
            width: 280,
            height: 145, 
            resizable: true, 
            modal: true, 
            border:false,
            plain:true,
            closeAction: 'hide', 
            layout: 'fit', 
            items: [{
                layout:'form',
                xtype:'form',
                frame:true,  
                border:false,
                ref:'form',
                buttons:[{
                        text:me.textSave,
                        iconCls:'accept',
                        ref:'../save',
                        handler:function(btn){
                            var form = btn.refOwner.getForm();
                             if(form.isValid()){
                                var values = form.getFieldValues();
                                values.groupName = form.getValues().groupId;
                                me.savePermissions(values, winnewgroup, selectedGroup);
                            }
                        }
                    },{
                        text:me.textClose,
                        iconCls:'close',
                        ref:'../close',
                        handler:function(){
                            winnewgroup.close();
                        }
                    }
                ],
                items:[{
                    xtype:'msm_usergroupcombobox',
                    anchor:'90%',
                    url: this.geostoreURL + "usergroups/",
                    auth: this.auth,
                    name:'groupId',
                    value: selectedGroup,
                    readOnly: selectedGroup != null,
                    maxLength:200,
                    allowBlank:true,
                    target: this.target
                },{
                    xtype:'checkbox',
                    anchor:'90%',
                    name:'canRead',
                    fieldLabel: this.textCanRead,
                    checked: selectedGroup ? this.selectedRecord.get("canRead") : false,
                    maxLength:20,                            
                    allowBlank:false
                },{
                    xtype:'checkbox',
                    anchor:'90%',
                    name:'canWrite',
                    fieldLabel: this.textCanWrite,
                    checked: selectedGroup ? this.selectedRecord.get("canWrite") : false,
                    maxLength:200,
                    hidden: me.hideCanWrite,
                    allowBlank:true
                }]
            }]
        });
        winnewgroup.show();
    },

    savePermissions: function (addedPermission, winnewgroup, selectedGroup, deleteFlag){
        var finalPermissions = [];
        var alreadyPresentGroups = {};

        // add already included permissions
        if(this.store){
            this.store.each(function(record){
                // security rule model
                var obj = {
                    canRead: record.data.canRead,
                    canWrite: record.data.canWrite
                };
                if(record.data.userId && record.data.userId != ""){
                    obj.user = {
                        id: record.data.userId,
                        name: record.data.userName
                    };
                    finalPermissions.push(obj);
                }else if(record.data.groupId && record.data.groupId != ""){
                    alreadyPresentGroups[record.data.groupName] = true;
                    obj.group = {
                        id: record.data.groupId,
                        groupName: record.data.groupName
                    };
                    finalPermissions.push(obj);
                }
            });
        }

        if(addedPermission.groupName){
            if(!alreadyPresentGroups[addedPermission.groupName] 
                && addedPermission.groupName 
                && addedPermission.groupId){
                // add new rule (security rule model)
                var obj = {
                    canRead: addedPermission.canRead,
                    canWrite: addedPermission.canWrite,
                    group:{
                        id: addedPermission.groupId, 
                        groupName: addedPermission.groupName
                    }
                };
                finalPermissions.push(obj);
            }else if(this.selectedGroup && selectedGroup){
                // update or delete the group permission
                for(var i = 0; i < finalPermissions.length; i++){
                    if(finalPermissions[i].group 
                        && finalPermissions[i].group.groupName == this.selectedGroup){
                        if(deleteFlag){
                            // delete
                            finalPermissions.remove(finalPermissions[i]);
                        }else{
                            // update
                            Ext.apply(finalPermissions[i],{
                                canRead: addedPermission.canRead,
                                canWrite: addedPermission.canWrite
                            });
                        }
                        break;
                    }
                }
                // reset buttons and selection
                this.selectedGroup = null;
                this.selectedRecord = null;
                Ext.getCmp(this.id + "_edit_button").disable();
                Ext.getCmp(this.id + "_delete_button").disable();
            }else{
                // try to create one rule for a group that already exists
                Ext.Msg.show({
                   title: this.groupNameTitleText,
                   msg: this.groupNameExistsText,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                });
                return null;
            }

            // save
            var me = this;
            var callback = function(response){
                me.store.load();
                if(winnewgroup){
                    winnewgroup.close();
                }
            };
            this.resourcePermission.create(finalPermissions, callback, callback);
        }else{
            // Couldn't create without group
            Ext.Msg.show({
               title: this.groupNameTitleText,
               msg: this.groupNameIncompleteText,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            });
        }
        
    }
});

/** api: xtype = mxp_resource_gruop_permission */
Ext.reg(mxp.widgets.ResourceGroupPermissionGrid.prototype.xtype, mxp.widgets.ResourceGroupPermissionGrid);

/** api: (define)
 *  module = mxp.widgets
 *  class = ResourceGroupPermissionWindow
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: ResourceGroupPermissionWindow
 * Window with this panel that shows security rules for a resource
 *
 */

mxp.widgets.ResourceGroupPermissionWindow = Ext.extend(Ext.Window,{

    /** xtype = mxp_resource_gruop_permission_window **/
    xtype: "mxp_resource_gruop_permission_window",
    iconCls:'lock_ic',
    title:"Resource permissions",
    width: 300,
    height: 200, 
    minWidth:250,
    minHeight:200,
    resizable: true, 
    modal: true, 
    border:false,
    plain:true,
    closeAction: 'hide',
    hideCanWrite: false,
    initComponent : function() {
        this.items = [{
            xtype:'mxp_resource_gruop_permission',
            resourceId: this.resourceId,
            height: 200, 
            auth: this.auth,
            hideCanWrite: this.hideCanWrite,
            geostoreURL: this.geostoreURL,
            target: this.target
        }];
        mxp.widgets.ResourceGroupPermissionWindow.superclass.initComponent.call(this, arguments);
    }
});

/** api: xtype = mxp_resource_gruop_permission_window */
Ext.reg(mxp.widgets.ResourceGroupPermissionWindow.prototype.xtype, mxp.widgets.ResourceGroupPermissionWindow);