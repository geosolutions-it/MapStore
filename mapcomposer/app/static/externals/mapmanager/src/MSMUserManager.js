/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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

	
/**
 * Class: UserManagerView
 * this view represents the user manager
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 */
UserManagerView = Ext.extend(Ext.grid.GridPanel, {

            /** xtype = msm_usermanager **/
            xtype: "msm_usermanager",

            /**
            * Property: id
            * {string} id of user manager
            * 
            */
            id: 'id_usermanager_grid',
            /**
            * Property: border
            * {boolean} If set to true, a border is drawn.
            * 
            */ 
            border: false,

            /**
            * Property: textId
            * {string} string 
            * 
            */
            textId: 'Id',
            /**
            * Property: textName
            * {string} column name for username
            * 
            */
            textName: 'Name',
            /**
            * Property: textPassword
            * {string} column name for password
            * 
            */
            textPassword: 'Password',
            /**
            * Property: textPassword
            * {string} column name for confirm the password
            * 
            */
            textConfirmPassword: 'Confirm Password',
            /**
            * Property: textPassword
            * {string} column name for password
            * 
            */
            textPasswordEdit: 'New Password',
            /**
            * Property: textPasswordConf
            * {string} 
            * 
            */						
            textPasswordConf: 'Confirm Password',
            /**
            * Property: textPasswordConfError
            * {string} 
            * 
            */						
            textPasswordConfError: 'Password not confirmed',
            /**
            * Property: textBlankUserName
            * {string} 
            * 
            */	
            textBlankUserName: 'Name should not be null',
            /**
            * Property: textBlankPw
            * {string} 
            * 
            */	
            textBlankPw: 'Password should not be null',
            /**
            * Property: textBlankRole
            * {string} 
            * 
            */	
            textBlankRole: 'Role should be selected',

            /**
            * Property: textRole
            * {string} column name for role
            * 
            */
            textRole: 'Role',
            /**
            * Property: tooltipDelete
            * {string} tooltip for delete button
            * 
            */
            tooltipDelete: 'Delete this user',
            /**
            * Property: tooltipDelete
            * {string} tooltip for delete button
            * 
            */
            tooltipEdit: 'Edit user data',
            /**
            * Property: tooltipEdit
            * {string} label for edit button
            * 
            */
            textDelete: 'Delete', 
            /**
            * Property: tooltipSave
            * {string} tooltip for save button
            * 
            */
            tooltipSave: 'Save this user',
            /**
            * Property: textSave
            * {string} label for save button
            * 
            */
            textSave: 'Save',
            /**
            * Property: tooltipSave
            * {string} tooltip for save button
            * 
            */
            tooltipCancel: 'Cancel',
            /**
            * Property: textCancel
            * {string} label for cancel button
            * 
            */
            textCancel: 'Cancel',
            /**
            * Property: textAddUser
            * {string} label for add user button
            * 
            */
            textAddUser: '', 
            /**
            * Property: textAddUserTitle
            * {string} title for the window add user
            * 
            */
            textAddUserTitle: 'Add user',

            /**
            * Property: textEditUserTitle
            * {string} title for the window edit user data
            * 
            */
            textEditUserTitle: 'Edit user data',			
            /**
            * Property: tooltipAddUser
            * {string} tooltip for add user button
            * 
            */
            tooltipAddUser: 'Create a new user',
            /**
            * Property: textTitle
            * {string} window title 
            * 
            */
            textTitle: 'User Manager',
            /**
            * Property: tooltipSearch
            * {string} tooltip for search button
            * 
            */
            tooltipSearch: "Search",
            /**
            * Property: textSelectRole
            * {string} default for combo box
            * 
            */			
            textSelectRole: 'Select a role...',
           /**
            * Property: textGeneral
            * {string} text for General Tab title
            */
            textGeneral:"General",
            /**
            * Property: textAttributes
            * {string} text for Attributes Tab title
            */
            textAttributes:"Attributes",
             /**
            * Property: textGroups
            * {string} text for Groups Tab title
            */
            textGroups:"Groups",
            
            titleConfirmDeleteMsg: "Confirm delete user",
            textConfirmDeleteMsg: "Are you sure you want to delete this user?",

            invalidFormMsg: 'Some fields are invalid or empty',
            userAlreadyTaken: 'User is already taken',
            textManageGroups: 'Manage Groups',

            /**
            * Property: url
            * {string} base url for user geostore services
            * 
            */			
            url: null,

            /**
            * Property: searchUrl
            * {string} base url for user geostore search services
            * 
            */			
            searchUrl: null,

            /**
            * Property: currentFilter
            * {string} currentSearchFilter
            * 
            */	
            currentFilter: '*',

            /**
            * Property: pageSize
            * {int} users grid page size
            * 
            */			
            pageSize: 5,

            /**
            * Property: displayMsg
            * {string} string to add in displayMsg of Ext.PagingToolbar
            * 
            */
            displayMsg: 'Displaying results {0} - {1} of {2}',

            /**
            * Property: beforePageText
            * {string} The text displayed before the input item (defaults to 'Page')
            */
            beforePageText: 'Page',
            /**
            * Property: afterPageText
            * {string} Customizable piece of the default paging text (defaults to 'of {0}')
            */
            afterPageText : "of {0}",

            /**
            * Property: auth
            * {string} auth token to access geostore services
            */
            auth: null,

            gridPanelBbar: null,

            mapUrl: null, 

            /**
            * Property: successTitle
            * {string} User update information
            * 
            */		
            successTitle: "User updated",
            /**
            * Property: validFormMsg
            * {string} default for message to show on user information update
            * 
            */		
            validFormMsg: "The user information has been updated",
            /**
            * Property: autogenerateUUID
            * {string} Add a field to that autogenerate UUID attribute for a user
            * 
            */
            autogenerateUUID:true,

            loadMask:true,  
            stripeRows: true,
            autoExpandColumn: 'name',
            height: 200,
            width: 415,
            stateful: true,
            stateId: 'grid',
            border:false,
            /**
            * Property: customFields
            * {string} additional Fields to place in the Information panel.
            * NOTE: limit to 255 user attributes
            * 
            */	
            customFields:[{
                xtype: 'textfield',
                anchor:'90%',
                id: 'email',
                maxLength:255,
                blankText: 'email',
                name: 'attribute.email',
                fieldLabel: 'email',
                inputType: 'text',
                vtype:'email',
                value: ''
            },{
                xtype: 'textfield',
                anchor:'90%',
                maxLength:255,
                id: 'attribute.company',
                blankText: 'Company',
                fieldLabel: 'Company',
                inputType: 'text',
                value: ''
                
            }/*,{
                xtype: 'datefield',
                anchor:'90%',
                id: 'expires',
                name: 'attribute.expries',
                fieldLabel: 'Expiring Date',
                inputType: 'text',
                value: ''
                
            }*/,{
                xtype: 'textarea',
                anchor:'90%',
                id: 'notes',
                maxLength:255,
                name: 'attribute.notes',
                blankText: 'Notes',
                fieldLabel: 'Notes',
                inputType: 'text',
                value: ''
                
            }],
            /**
             * Property: showEnabled
             * Show 'enabled' property of the user as a checkbox and allows to change it
             */
            showEnabled:false,
            
			/**
		    * Constructor: initComponent 
		    * Initializes the component
		    * 
		    */
			initComponent: function(){
				
				
				// assets used within the interface
				var ASSET = this.ASSET  || {
				    delete_icon: './theme/img/user_delete.png',
				    edit_icon: './theme/img/user_edit.png'
				};

				/*
				 * building blocks for ui
				 */
				
				// a reference for this object to be used in closures
				var userManager = this,
					isAdmin = (this.login.role == 'ADMIN');
								
				// input search box to search for users by name
				this.inputSearch =
					new Ext.form.TextField({
			            id: 'user-input-search',
			            style: 'margin-right:8px; margin-left:8px;',
			            listeners: {
			                specialkey: function(f,e){
			                    if (e.getKey() == e.ENTER) {
                                    this.searchUser();                                    
			                }
			                },
                            scope: this
			            }
			        });
			
				 // search button
			     this.searchButton =  {
			            id: 'userSearchBtn',
			            tooltip: this.tooltipSearch,
			            iconCls: 'find',
			            disabled: false,
			            handler: function() {  
                            this.searchUser();		     				
			            },
                        scope: this
					};
			            
				// reset search button
				this.resetSearchButton =  {
						id: 'userClearBtn',
						text: this.textReset,
						tooltip: this.tooltipReset,
						iconCls: 'reset',
						disabled: false,
						handler : function() {
							Ext.getCmp('user-input-search').setValue('');
                            this.searchUser();	                 
						},
                        scope: this
				};
					
                // create a content provider with init options
                this.users = new GeoStore.Users(
                    { authorization: userManager.auth,
                      url: userManager.url
                    }).failure( function(response){ 
                        console.error(response); 
                          Ext.Msg.show({
                           title: userManager.failSuccessTitle,
                           msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        });
                    } );
                
                if(isAdmin){
                    // column definitions for the grid panel
                    this.cm = new Ext.grid.ColumnModel({
                        id: 'id_mapstore_cm',
                        columns: [
                        {
                            id       :'id',
                            header   : userManager.textId, 
                            sortable : true, 
                            dataIndex: 'id',
                            hidden   : true
                        },
                        {
                            id       :'name',
                            header   : userManager.textName, 
                            maxLength:20,
                            sortable : true, 
                            dataIndex: 'name'
                        },
                        {
                            header   : userManager.textPassword, 
                            sortable : false, 
                            maxLength:255,
                            dataIndex: 'password',
                            hidden   : true
                        },
                        {
                            header   : userManager.textRole, 
                            sortable : true, 
                            dataIndex: 'role'
                        },
                        {
                            xtype: 'actioncolumn',
                            
                            width: 50,
                            items: [{
                                icon   : ASSET.delete_icon, 
                                tooltip: userManager.tooltipDelete,
                                getClass: function(v, meta, rec) {
                                  if(rec.get('name') == "admin" || rec.get('role')=='GUEST') {
                                      return 'x-hide-display';
                                  }
                                },
                                handler: function(grid, rowIndex, colIndex) {
                                   var record = grid.store.getAt(rowIndex);
                
                                    Ext.Msg.confirm(
                                        userManager.titleConfirmDeleteMsg,
                                        userManager.textConfirmDeleteMsg,
                                        function(btn) {
                                            if(btn=='yes') {
                                                // ------ DELETE USER'S MAPS ------- //
                                                
                                                // ///////////////////////////
                                                // Get the api for GeoStore
                                                // ///////////////////////////
                                                var geostore = new GeoStore.Maps({ 
                                                    authorization: userManager.auth,
                                                    url: userManager.mapUrl
                                                });
                                                
                                                geostore.failure(
                                                    function(response){ 
                                                        //console.error(response); 
                                                        Ext.MessageBox.alert("failure");	
                                                    }
                                                );
                                                
                                                var filterData = {
                                                    name: "owner", 
                                                    operator: "EQUAL_TO", 
                                                    type: "STRING", 
                                                    value: record.data.name
                                                };
                                                
                                                geostore.deleteByFilter(filterData, function(response){
                                                    // ------ DELETE USER ------- //
                                                    userManager.users.deleteByPk( record.get('id'), function(data){
                                                        // refresh the store
                                                        userManager.reload();
                                                    });
                                                });
                                            }									
                                        });										
                                    }
                                }]
                          },
                          {
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [{
                                icon   : ASSET.edit_icon, 
                                tooltip: userManager.tooltipEdit,
                                getClass: function(v, meta, rec) {
                                  if(rec.get('role')=='GUEST') {
                                      return 'x-hide-display';
                                  }
                                },
                                handler: function(grid, rowIndex, colIndex) {
                                   var record = grid.store.getAt(rowIndex);

                                   var userdata = {id: record.get('id'), name: record.data.name, role: record.data.role };
                                   var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:'Wait message'});
                                   loadMask.show();
                                   userManager.users.findByPk( record.get('id'), function(data){
                                                        // refresh the store
                                                        userManager.showEditUserWindow(data);
                                                        loadMask.hide();
                                                    },{includeattributes:true});
                                   
                                   //open edit user data window				
                                }, 
                                scope: this
                            }]
                        }
                    ]});		
				
					// the top bar of the user manager window
					this.tbar = [ this.inputSearch, this.searchButton, this.resetSearchButton, '-', this.createAddUserButton(),"->",this.createManageGroupsButton() ];

					// data store
					this.store = new Ext.data.JsonStore({
                        storeId: 'id_userstore',
                        autoDestroy: true,
                        root: 'ExtUserList.User || []',
                        totalProperty: 'ExtUserList.UserCount',
                        successProperty: 'ExtUserList',
                        idProperty: 'id',
                        remoteSort: false,
                        fields: ['id', 'name', 'password', 'role'],
                        sortInfo: { field: "name", direction: "ASC" },
                        proxy: new Ext.data.HttpProxy({
                            url: this.getSearchUrl(),
                            restful: true,
                            method : 'GET',
                            disableCaching: true,
                            failure: function (response) {
                                console.error(response); 
                                  Ext.Msg.show({
                                   title: userManager.failSuccessTitle,
                                   msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.ERROR
                                });                                
                            },
                            defaultHeaders: {'Accept': 'application/json', 'Authorization' : userManager.auth}
                        })
                        
					});
                    
					var paging = new Ext.PagingToolbar({
                        pageSize: this.pageSize,
										store: this.store,
										grid: this,
                        displayInfo: true,
						displayMsg: this.displayMsg,
						beforePageText: this.beforePageText,
						afterPageText: this.afterPageText
                    });	         
				
                    this.bbar = paging;					
								
                    userManager.reload = function() {
                        userManager.store.reload();
                    };
                    
                    this.store.load({
                            params:{
                            start:0,
                            limit:this.pageSize
                            }
                        });                        

				
				} else { //not Admin

					var userdata = {id: this.login.userid, name: this.login.username, role: this.login.role };

					userManager.showEditUserWindow(userdata, this.renderMapToTab);
				
				}
				
				
				// call parent
				UserManagerView.superclass.initComponent.call(this, arguments);
			},
            /**
             * private: method[guid]
             * Generate a random UUID for the user
             */
            guid: function() {
              var s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                           .toString(16)
                           .substring(1);
              }
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                     s4() + '-' + s4() + s4() + s4();
            },
            /**
            * private: method[getSearchUrl]
            * returns the search url with the current filter
            */
            getSearchUrl: function() {
                return this.searchUrl + '/' + this.currentFilter;
            },
            /**
            * private: method[searchUser]
            * Filters the store with the string contained in the input search
            */
            searchUser: function() {                
                var keyword = Ext.getCmp("user-input-search").getValue();
                
                if ( !keyword || keyword==='' ){
                    this.currentFilter = '*';                    
                } else {
                    this.currentFilter = '*'+keyword+'*';                                        
                }
                this.store.proxy.api.read.url = this.getSearchUrl();
                this.store.load({
					params:{
						start:0,
						limit:this.pageSize
					}
				});
            },
            /**
            * private: method[createNewUserTabPanel]
            * creates the tab panel for the new user.
            * This contains 3 tabs:
            * * General
            * * Attributes
            * * Groups
            */
            createNewUserTabPanel: function(){
                var userDataFields =[{
                        xtype: 'textfield',
                        anchor:'90%',
                        id: 'user-textfield',
                        maxLength:20,
                        allowBlank: false,
                        blankText: this.textBlankUserName,
                        fieldLabel: this.textName,
                        value: '',
                        listeners: {
                          beforeRender: function(field) {
                            field.focus(false, 1000);
                          }
                        }
                  },
                  {
                        xtype: 'textfield',
                        anchor:'90%',
                        id: 'password-textfield',
                        maxLength:255,
                        allowBlank: false,
                        blankText: this.textBlankPw,
                        fieldLabel: this.textPassword,
                        inputType:'password',
                        value: ''                
                  },
                  {
                        xtype: 'textfield',
                        anchor:'90%',
                        id: 'password-confirm-textfield',
                        allowBlank: false,
                        maxLength:255,
                        blankText: this.textBlankPw,
                        invalidText: this.textPasswordConfError,
                        fieldLabel: this.textPasswordConf,
                        validator: function(value){
                            var passwordField = Ext.getCmp("password-textfield");
                            
                            if(passwordField.getValue() == value){
                                return true;
                            }else{
                                return false;
                            } 
                        },
                        inputType:'password',
                        value: ''                
                  },
                  {
                        xtype: 'combo',
                        displayField:'role',
                        anchor:'90%',
                        allowBlank: false,
                        editable: false,
                        blankText: this.textBlankRole,
                        valueField:'role',
                        emptyText: this.textSelectRole,
                        allowBlank: false,
                        triggerAction: 'all',
                        mode: 'local',
                        id: 'role-dropdown',
                        value:'USER',
                        fieldLabel: this.textRole,
                        store: new Ext.data.SimpleStore({
                             fields:['id', 'role'],
                             data:[['1', 'USER'], ['2', 'ADMIN']]
                        })
                  }	];
                  if( this.showEnabled ) {
                     userDataFields.push({xtype:'checkbox',fieldLabel:this.textEmabled || "Enabled",name:'enabled',checked:true,uncheckedValue: 'false'});

                  }
                  
                  var newUserTabPanel = {
                        xtype:'tabpanel',
                        activeTab: 0,
                        border:'false',
                        deferredRender: false,
                        items:[{
                              frame:true,
                              layout:'form',
                              iconCls:'vcard_ic',
                              id: 'name-field-set',
                              ref:'../general',
                              border: false,
                              title:this.textGeneral,
                              items: userDataFields
                            },{
                              xtype: 'panel',
                              frame:true,
                              layout:'form',
                              iconCls:'information_ic',
                              ref:'../attributes',
                              id: 'attributes-field-set',
                              title:this.textAttributes,//i18n
                              border: false,
                              autoScroll:true,
                              items: this.customFields
                            },{
                              xtype: 'panel',
                              frame:true,
                              iconCls:'group_ic',
                              layout:'fit',
                              ref:'../groups',
                              id: 'groups-field-set',
                              title:this.textGroups,//i18n
                              autoScroll:true,
                              border: false,
                              listeners:{
                                afterrender:function(p){
                                    p.doLayout();
                                }
                              },
                               items:[{
                                xtype: 'itemselector',
                                name: 'groups',
                                labelWidth: 0,
                                anchor:'100%',
                                imagePath: 'externals/ext/ux/images/',
                                multiselects:[{
                                    width: 175,
                                    height: 200,
                                    valueField:'groupName',
                                    displayField:'groupName',
                                    store:  new Ext.data.JsonStore({
                                        autoDestroy: true,
                                        autoLoad:true,
                                        root: 'UserGroupList.UserGroup || []',
                                        idProperty: 'id',
                                        fields: ['id','groupName', 'description'],
                                        proxy: new Ext.data.HttpProxy({
                                            url: this.geoStoreBase + "usergroups/",
                                            restful: true,
                                            method : 'GET',
                                            disableCaching: true,
                                            sortInfo: { field: "groupName", direction: "ASC" },
                                            defaultHeaders: {'Accept': 'application/json', 'Authorization' : this.auth},
                                            failure: function (response) {
                                                console.error(response); 
                                                  Ext.Msg.show({
                                                   title: this.failSuccessTitle,
                                                   msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                                                   buttons: Ext.Msg.OK,
                                                   icon: Ext.MessageBox.ERROR
                                                })                                
                                            }
                                        }) 
                                    })
                                  },{
                                    width: 175,
                                    height: 200,
                                    valueField:'groupName',
                                    displayField:'groupName',
                                    store: new Ext.data.JsonStore({
                                        autoDestroy: true,
                                        autoLoad:true,
                                        root: 'UserGroupList.UserGroup || []',
                                        idProperty: 'id',
                                        data: {UserGroupList:{UserGroup:[]}}, //empty
                                        fields: ['id','groupName', 'description']
                                       
                                    })
                                     
                                }]
                              }]
                              
                            }]
                };
                return newUserTabPanel;
            },
            /**
            * private: method[createAddUserButton]
            * creates the Add User button That shows the window to create a new user.
            */ 
            createAddUserButton : function(){
                var userManager = this;
                // button to open the add user window
				var addUserButton = {
						id: 'id_addUser_button',
						scope: this,
						disabled: false,
				 		text: this.textAddUserTitle,
						tooltip: this.tooltipAddUser,
						iconCls: 'user_add',
				        handler : function(){
							// form in user add window
							var form = new Ext.form.FormPanel({
								    layout:'fit',
								    frame:true,  border:false,
								    items: [this.createNewUserTabPanel()]
						});
                        // check autogeneration of UUID
                        if (this.autogenerateUUID){
                            //add an hidden field for the new userid
                            var generated = this.guid();
                           
                            form.add({
                                xtype: 'textfield',
                                id: 'UUID-hidden',
                                name:'attribute.UUID',
                                value: generated
                            });
                        }
						var winAdd = new Ext.Window({
					           width: 410, height: 320, resizable: true, modal: true, border:false, plain:true,
							   closeAction: 'hide', layout: 'fit', 
					           title: userManager.textAddUserTitle,
                               iconCls: 'user_add',
					           items: [ form ],
					           listeners: {
				                afterRender: function(){
				                    form.getForm().clearInvalid();
				                },
				                hide: function(){
				                    form.getForm().reset();
									winAdd.destroy();
				                }
				               },
							    bbar: new Ext.Toolbar({
								        items:[
					                            '->',
					                            {
					                                text: userManager.textSave,
					                                tooltip: userManager.tooltipSave,
					                                iconCls: "accept",
					                                id: "user-addbutton",
					                                scope: this,
					                                handler: function(){      
					                                    // winAdd.hide(); 
					 									var nameField = Ext.getCmp("user-textfield");
														var passwordField = Ext.getCmp("password-textfield");
														var passwordConfirmField = Ext.getCmp("password-confirm-textfield");
														var roleDropdown = Ext.getCmp("role-dropdown"); 
                                                        // Check Form Validity
														if ( form.getForm().isValid() && passwordField.getValue() == passwordConfirmField.getValue()){
                                                            var values = form.getForm().getFieldValues();
                                                            //get attributes with name attribute.<att_name>
                                                            var attribute = {};
                                                            for(var name in values ){
                                                                var arr = name.split('.');
                                                                if(arr.length >1 && arr[0]=='attribute'){
                                                                    attribute[arr[1]] = values[name];
                                                                }
                                                            }
                                                            //create groups;
                                                            var groups;
                                                            if(values.groups){
                                                              var arr = values.groups.split(',');
                                                              if(arr.length >0 ){
                                                                groups =[];
                                                              }
                                                              for (var i =0; i < arr.length;i++){
                                                                groups.push({groupName:arr[i]});
                                                              }
                                                            }
                                                            
                                                            // Save user
                                                            userManager.users.create({ 
                                                                    name: nameField.getValue(), 
                                                                    password:passwordField.getValue(), 
                                                                    role:roleDropdown.getValue(),
                                                                    attribute: attribute,
                                                                    groups: groups,
                                                                    enabled: values.enabled 
                                                                }, 
                                                                function success(response){                                                                            
                                                                    winAdd.hide();
                                                                    form.getForm().reset();
                                                                    // refresh the store
                                                                    userManager.store.reload();
                                                                    winAdd.destroy();
                                                                },
                                                                function failure(response) {
                                                                     Ext.Msg.show({
                                                                       title: userManager.failSuccessTitle,
                                                                       msg: userManager.userAlreadyTaken,
                                                                       buttons: Ext.Msg.OK,
                                                                       icon: Ext.MessageBox.ERROR
                                                                    });
                                                            });
														
														} else {
															Ext.Msg.show({
						                                       title: userManager.failSuccessTitle,
						                                       msg: userManager.invalidFormMsg,
						                                       buttons: Ext.Msg.OK,
						                                       icon: Ext.MessageBox.ERROR
						                                    });
														}
														
														
					                                    
					                                }
					                            },
												{
					                                text: userManager.textCancel,
					                                tooltip: userManager.tooltipCancel,
					                                iconCls: "close",
					                                id: "user-cancelbutton",
					                                scope: this,
					                                handler: function(){      
					                                    winAdd.hide(); 
													    // do nothing
					                                    winAdd.destroy(); 
					                                }
					                            }
					                        ]
					                    })
					            });
								winAdd.show();			   
						}
					};
                    return addUserButton;
            
            },
            /**
            * private: method[showEditUserWindow]
            * Shows the window to edit user info,attributes and groups.
            */ 
            showEditUserWindow : function(userdata, renderToTab) {
                // a reference for this object to be used in closures
                var userManager = this,
                    isAdmin = (this.login.role == 'ADMIN');
                //create the generic data field
                var userDataFields = [{
                            xtype: 'hidden',
                            id: 'userid-hidden',
                            value: userdata.id
                      },
                      {
                            xtype: 'textfield',
                            anchor:'90%',
                            id: 'user-textfield',
                            disabled: true,
                            maxLength:20,
                            allowBlank: false,
                            blankText: userManager.textBlankUserName,
                            fieldLabel: userManager.textName,
                            value: userdata.name,//TODO set from record
                            listeners: {
                              beforeRender: function(field) {
                                field.focus(false, 1000);
                              }
                            }
                      },
                      {
                            xtype: 'textfield',
                            anchor:'90%',
                            maxLength:255,
                            id: 'password-textfield',
                            allowBlank: true,
                            blankText: userManager.textBlankPw,
                            fieldLabel: userManager.textPasswordEdit,
                            inputType:'password',
                            value: '',
                            validator: function() {

                                if( Ext.getCmp('password-textfield').getValue() == 
                                    Ext.getCmp('passwordconf-textfield').getValue()
                                    )
                                    return true;
                                else
                                    return userManager.textPasswordConfError;
                            }
                      },
                      {
                            xtype: 'textfield',
                            anchor:'90%',
                            maxLength:255,
                            id: 'passwordconf-textfield',
                            allowBlank: true,
                            blankText: userManager.textPasswordConf,
                            fieldLabel: userManager.textPasswordConf,
                            inputType: 'password',
                            value: '',
                            validator: function() {

                                if( Ext.getCmp('password-textfield').getValue() == 
                                    Ext.getCmp('passwordconf-textfield').getValue()
                                    )
                                    return true;
                                else
                                    return userManager.textPasswordConfError;
                            }
                      },
                      {
                            xtype: 'combo',
                            displayField:'role',
                            anchor:'90%',
                            disabled: !isAdmin,	//limit only to admin
                            allowBlank: false,
                            editable: false,
                            blankText: userManager.textBlankRole,
                            valueField: 'role',
                            emptyText: userManager.textSelectRole,
                            allowBlank: false,
                            triggerAction: 'all',
                            mode: 'local',
                            id: 'role-dropdown',
                            //TODO set value
                            value: userdata.role,
                            fieldLabel: userManager.textRole,
                            store: new Ext.data.SimpleStore({
                                         fields:['id', 'role'],
                                         data:[['1', 'USER'], ['2', 'ADMIN']]
                                      })
                      }];
                 if( this.showEnabled ) {
                     userDataFields.push({xtype:'checkbox',fieldLabel:this.textEmabled || "Enabled",name:'enabled',checked:userdata.enabled});
                  }
                // for user is the tab content!!
                var userFormTabPanel ={
                    xtype:'tabpanel',
                    activeTab: 0,
                    deferredRender: false,
                    items:[{
                          iconCls:'vcard_ic',
                          frame:true,
                          layout:'form',
                          id: 'name-field-set',
                          border: false,
                          title:this.textGeneral,
                          items: userDataFields
                        },{
                          iconCls:'information_ic',
                          xtype: 'panel',
                          frame:true,
                          ref:'../attribute',
                          layout:'form',
                          id: 'attributes-field-set',
                          title:this.textAttributes,//i18n
                          border: false,
                          autoScroll:true,
                          items: userManager.customFields
                        }]
                    };
                    //the admin user doesn't belongs to any group
                    if(userdata.role != 'ADMIN'){
                      userFormTabPanel.items.push({
                          xtype: 'panel',
                          frame:true,
                          iconCls:'group_ic',
                          layout:'fit',
                          ref:'../groups',
                          id: 'groups-field-set',
                          title:this.textGroups,//i18n
                          autoScroll:true,
                          border: false,
                          listeners:{
                            afterrender:function(p){
                                p.doLayout();
                            }
                          },
                           items:[{
                            xtype: 'itemselector',
                            name: 'groups',
                            labelWidth: 0,
                            anchor:'100%',
                            imagePath: 'externals/ext/ux/images/',
                            multiselects:[{
                                width: 175,
                                height: 200,
                                valueField:'groupName',
                                displayField:'groupName',
                                store:  new Ext.data.JsonStore({
                                    autoDestroy: true,
                                    autoLoad:true,
                                    root: 'UserGroupList.UserGroup || []',
                                    idProperty: 'id',
                                    fields: ['id','groupName', 'description'],
                                    proxy: new Ext.data.HttpProxy({
                                        url: this.geoStoreBase + "usergroups/",
                                        restful: true,
                                        method : 'GET',
                                        disableCaching: true,
                                        sortInfo: { field: "groupName", direction: "ASC" },
                                        defaultHeaders: {'Accept': 'application/json', 'Authorization' : userManager.auth},
                                        failure: function (response) {
                                            console.error(response); 
                                              Ext.Msg.show({
                                               title: userManager.failSuccessTitle,
                                               msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                                               buttons: Ext.Msg.OK,
                                               icon: Ext.MessageBox.ERROR
                                            })                                
                                        }
                                    }),
                                    listeners:{
                                        //remove the user's groups from the available ones
                                        load:function(store,records,options){
                                            store.filterBy( function(f) {
                                                    //the userdata.groups can also miss
                                                    //in this case the filter let pass all the records
                                                    if(!userdata || !userdata.groups) return true;
                                                    var name =  f.get('groupName'); 
                                                    for(var i = 0; i < userdata.groups.length;i++){
                                                        if(userdata.groups[i].groupName == name){
                                                            return false;
                                                        }
                                                    }
                                                    return true;
                                                }
                                            );
                                        }
                                    }
                                })
                              },{
                                width: 175,
                                height: 200,
                                valueField:'groupName',
                                displayField:'groupName',
                                store: new Ext.data.JsonStore({
                                    autoDestroy: true,
                                    autoLoad:true,
                                    root: 'groups || []',
                                    idProperty: 'id',
                                    data: userdata,
                                    sortInfo: { field: "groupName", direction: "ASC" },
                                    fields: ['id','groupName','description']
                                   
                                })
                                 
                            }]
                          }]
                        });  
                    }
                 
                
                
                    var formEdit = new Ext.form.FormPanel({
                          //width: 415, height: 200, border:false,
                          frame:true,  border:false,layout:'fit',
                          items: [userFormTabPanel],
                          listeners:{
                            afterrender: function(){
                                //populate attribute fields
                                for( var attrname in userdata.attribute ){
                                    var field = formEdit.getForm().findField('attribute.' + attrname); 
                                    // if the attribute is present populate the field
                                    if(field){
                                        field.setValue(userdata.attribute[attrname]);
                                    // if not present, create a dummy hidden field for it
                                    }else{
                                        formEdit.add({
                                            xtype: 'hidden',
                                            name:'attribute.' + attrname,
                                            value: userdata.attribute[attrname]
                                      })
                                    }
                                }
                            }
                          
                          }
                      
                          
                    });

                    // for admin it shows the window
                    var winEdit = new Ext.Window({
                        iconCls:'user_edit',
                        width: 410, height: 320, resizable: true, modal: true, border:false, plain:true,
                        closeAction: 'hide', layout: 'fit', 
                        title: userManager.textEditUserTitle,
                        items: [ formEdit ],
                        listeners: {
                            afterRender: function(){
                                formEdit.getForm().clearInvalid();
                            },
                            hide: function(){
                                formEdit.getForm().reset();
                                winEdit.destroy();
                            }
                        },
                        bbar: new Ext.Toolbar({
                                 items:[
                                        '->',
                                        {
                                            text: userManager.textSave,
                                            tooltip: userManager.tooltipSave,
                                            iconCls: "accept",
                                            id: "user-addbutton",
                                            scope: this,
                                            handler: function(){      
                                                //TODO remove all getCmp
                                                var useridField = Ext.getCmp("userid-hidden"); 
                                                var nameField = Ext.getCmp("user-textfield");
                                                var passwordField = Ext.getCmp("password-textfield");
                                                var passwordConfField = Ext.getCmp("passwordconf-textfield");
                                                var roleDropdown = Ext.getCmp("role-dropdown"); 
                                                var form = formEdit.getForm();
                                                var values = form.getFieldValues();
                                                if ( form.isValid() && (passwordField.getValue() == passwordConfField.getValue()) && (isAdmin ? roleDropdown.isValid(false) : true) ){
                                                    
                                                    //get attributes with name attribute.<att_name>
                                                    var attribute = {};
                                                    for(var name in values ){
                                                        var arr = name.split('.');
                                                        if(arr.length >1 && arr[0]=='attribute'){
                                                            attribute[arr[1]] = values[name];
                                                        }
                                                    }
                                                    //create groups;
                                                    var groups;
                                                    if(values.groups){
                                                      var arr = values.groups.split(',');
                                                      if(arr.length >0 ){
                                                        groups =[];
                                                      }
                                                      for (var i =0; i < arr.length;i++){
                                                        groups.push({groupName:arr[i]});
                                                      }
                                                    }
                                                    userManager.users.update( useridField.getValue(),
                                                            { name: nameField.getValue(), 
                                                              password:passwordField.getValue(), 
                                                              role:roleDropdown.getValue(),
                                                              attribute:attribute,
                                                              groups:groups,
                                                              enabled: values.enabled //only if present
                                                            }, 
                                                              function(response) {
                                                                winEdit.hide();
                                                                formEdit.getForm().reset();
                                                                if(typeof(userManager.reload) === 'function') {
                                                                // refresh the store
                                                                userManager.reload();
                                                                }
                                                                winEdit.destroy();
                                                            });
                            
                        
                                                } else {
                                                      Ext.Msg.show({
                                                       title: userManager.failSuccessTitle,
                                                       msg: userManager.invalidFormMsg,
                                                       buttons: Ext.Msg.OK,
                                                       icon: Ext.MessageBox.ERROR
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            text: userManager.textCancel,
                                            tooltip: userManager.tooltipCancel,
                                            iconCls: "close",
                                            id: "user-cancelbutton",
                                            scope: this,
                                            handler: function(){      
                                                winEdit.hide(); 
                                                // do nothing
                                                winEdit.destroy(); 
                                            }
                                        }
                                    ]
                                })
                        });
                        winEdit.show();	
                                       
            },
            createManageGroupsButton : function(){
                var um = this;
                return {
                    xtype:'button',
                    iconCls:'group_ic',
                    text: um.textManageGroups,//TODO i18n
                    handler:function(){
                        var groupView = {
                            xtype:'msm_usergroupmanager',
                            geoStoreBase:um.geoStoreBase,
                            auth: um.auth,
                            layout:'fit'
                        };
                        // for admin it shows the window
                        var wingroup = new Ext.Window({
                            iconCls:'group_ic',
                            title:um.textGroups,
                            width: 500, height: 500, 
                            resizable: true, 
                            modal: true, 
                            border:false,
                            plain:true,
                            closeAction: 'hide', 
                            layout: 'fit', 
                            items: groupView
                        });
                        wingroup.show();
                    }
                };
            }
		  		
});

/** api: xtype = msm_usermanager */
Ext.reg(UserManagerView.prototype.xtype, UserManagerView);
// ****************************************************************
// UserGroup manager 
// ****************************************************************
/**
 * Class: MSMUserGroupManager
 * this view represents the usergroup manager
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 */
MSMUserGroupManager = Ext.extend(Ext.grid.GridPanel, {

    xtype: 'msm_usergroupmanager',
    
    //i18n
    textGroupName: 'Group Name',
    textId: 'Id',
    textDescription: 'Description',
    textAddGroupButton: 'Create a New Group',
    groupNameAlreadyTaken: 'Group Name already taken',
    titleConfirmDeleteMsg: "Confirm delete group",
    textConfirmDeleteMsg: "Are you sure you want to delete this group?",
    textName:'Name',
    textRole:'Role',
    textGroup:'Group',
    textUsers:'Users',
    textSave:'Save',
    textClose:'Close',
    textDetails: 'Details',
    tooltipGroupInfo:'Informations about this group',
    tooltipDelete:'Delete this Group',
    // end of i18n
    /**
    * Property: auth
    * {string} auth token to access geostore services
    */
    auth: null,
    /**
    * Property: geoStoreBase
    * {string} the base geoStore string
    */
    geoStoreBase:null,
    loadMask:true,  
    stripeRows: true,
    autoExpandColumn: 'description',
    stateful: true,
    initComponent: function(){
        //groups store (not pagination support because of extjs needs total count to use the pagination bar
        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            autoLoad:true,
            root: 'UserGroupList.UserGroup || []',
            idProperty: 'id',
            fields: ['id','groupName', 'description'],
            proxy: new Ext.data.HttpProxy({
                url: this.geoStoreBase + "usergroups/",
                restful: true,
                method : 'GET',
                disableCaching: true,
                sortInfo: { field: "groupName", direction: "ASC" },
                defaultHeaders: {'Accept': 'application/json', 'Authorization' : this.auth},
                failure: function (response) {
                    console.error(response); 
                      Ext.Msg.show({
                       title: this.failSuccessTitle,
                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    })                                
                }
            })
        });
        //this object allows to save,get and delete groups
        this.groups = new GeoStore.UserGroups({ 
                      authorization: this.auth,
                      url: this.geoStoreBase + 'usergroups'
                    }).failure( function(response){ 
                        console.error(response); 
                          Ext.Msg.show({
                           title: this.failSuccessTitle,
                           msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        });
                    } );
        // the top bar contains a button to create groups
        this.tbar=[{
            iconCls:'group_add_ic',
            text:this.textAddGroupButton,
            handler: this.createNewGroupWindow,
            scope:this
        }];
       
        //create the column model of the grid
        this.cm = new Ext.grid.ColumnModel({
            columns: [{
                    id       :'id',
                    header   : this.textId, 
                    sortable : true, 
                    dataIndex: 'id',
                    hidden   : true
                },{
                    id       :'groupName',
                    maxLength: 20,
                    header   : this.textGroupName, 
                    sortable : true, 
                    dataIndex: 'groupName',
                    hidden   : false
                },{
                    id       :'description',
                    maxLength: 200,
                    header   : this.textDescription, 
                    sortable : true, 
                    dataIndex: 'description',
                    hidden   : false,
                    renderer: function(value, p, record){
                        
                            var xf = Ext.util.Format;
                            return '<p>' + xf.ellipsis(xf.stripTags(value), 50) +   '</p>';
                    } 
                },{
                    xtype:'actioncolumn',
                    width: 35,
                    items:[ {
                        iconCls:'group_delete_ic',
                        width:25,
                        tooltip: this.tooltipDelete,
                        scope:this,
                        getClass: function(v, meta, rec) {
                          if( rec.get('groupName') == "everyone") {
                              return 'x-hide-display';
                          }else{
                            return 'x-grid-center-icon action_column_btn';
                          }
                        },
                        handler: this.deleteRow 
                    }]
                },{
                    xtype:'actioncolumn',
                    width: 35,
                    items:[ {
                        iconCls:'information_ic',
                        width:25,
                        tooltip: this.tooltipGroupInfo,
                        scope:this,
                        getClass: function(v, meta, rec) {
                          if( /*rec.get('groupName') == "everyone"*/false) {
                              return 'x-hide-display';
                          }else{
                            return 'x-grid-center-icon action_column_btn';
                          }
                        },
                        handler: this.groupDetails 
                    }]
                }]
        });
        //call superclass initComponent
        MSMUserGroupManager.superclass.initComponent.call(this, arguments);
    },
    /**
    * private: method[createNewGroupWindow]
    * Shows a new Window that allows to create a new Group
    */
    createNewGroupWindow: function(){
       var ugmanager = this;
       var  winnewgroup = new Ext.Window({
                    iconCls:'group_add_ic',
                    title:this.textAddGroupButton,
                    width: 300,
                    height: 200, 
                    minWidth:250,
                    minHeight:200,
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
                                text:ugmanager.textSave,
                                iconCls:'accept',
                                ref:'../save',
                                handler:function(btn){
                                    var form = btn.refOwner.getForm();
                                     if(form.isValid()){
                                        var values = form.getValues();
                                        ugmanager.groups.create({
                                            groupName: values.groupName,
                                            description: values.description
                                            },function success(response){                                                                            
                                                winnewgroup.hide();
                                                form.reset();
                                                // refresh the store
                                                ugmanager.store.reload();
                                                winnewgroup.destroy();
                                            },
                                            function failure(response) {
                                                 Ext.Msg.show({
                                                   title: ugmanager.failSuccessTitle,
                                                   msg: ugmanager.groupNameAlreadyTaken,
                                                   buttons: Ext.Msg.OK,
                                                   icon: Ext.MessageBox.ERROR
                                                });
                                        });
                                    }
                                  
                                }
                            },{
                                text:ugmanager.textClose,
                                iconCls:'close',
                                ref:'../close',
                                handler:function(){
                                    winnewgroup.close();
                                }
                            }
                        ],
                        items:[{
                            xtype:'textfield',
                            anchor:'90%',
                            name:'groupName',
                            maxLength:20,                            
                            fieldLabel:ugmanager.textGroupName,
                            allowBlank:false
                        },{
                            xtype:'textarea',
                            anchor:'90%',
                            name:'description',
                            fieldLabel:ugmanager.textDescription,
                            maxLength:200,
                            allowBlank:true
                        }]
                    }]
        });
        winnewgroup.show();
            
    },
    /**
    * private: method[deleteRow]
    * Delete a row from the grid with rowIndex as second parameter
    */ 
    deleteRow:function(grid, rowIndex, colIndex) {
        var record = grid.store.getAt(rowIndex);
        //show the confirm message
        Ext.Msg.confirm(
            grid.titleConfirmDeleteMsg,
            grid.textConfirmDeleteMsg,
            function(btn) {
                if(btn=='yes') {
                        // ------ DELETE Group ------- //
                        grid.groups.deleteByPk( record.get('id'), function(data){
                        // refresh the store
                        grid.store.reload();
                        });
                    
                }
            });
    } ,
    /**
    * private: method[groupDetails]
    * Shows the window with group details.
    */ 
    groupDetails:function(grid, rowIndex, colIndex) {
        var record = grid.store.getAt(rowIndex);

        //get the group with the id taken from the record
        grid.groups.findByPk( record.get('id'), function(data){
            var ugForm = {
                layout:'form',
                xtype:'form',
                title: grid.textDetails,
                iconCls:'information_ic',
                frame:true,
                border:false,
                ref:'form',
                // the PUT method is not available for now.
                // remove the comment and test it once implemented
                /*buttons:[{
                        text:grid.textSave,
                        iconCls:'accept',
                        ref:'../save',
                        handler:function(btn){
                            var form = btn.refOwner.getForm();
                             if(form.isValid()){
                                var values = form.getValues();
                                grid.groups.update(data.id,{
                                    groupName: values.groupName,
                                    description: values.description,
                                    },function success(response){                                                                            
                                        winnewgroup.hide();
                                        form.reset();
                                        // refresh the store
                                        grid.store.reload();
                                        winnewgroup.destroy();
                                    },
                                    function failure(response) {
                                         Ext.Msg.show({
                                           title: grid.failSuccessTitle,
                                           msg: grid.groupNameAlreadyTaken,
                                           buttons: Ext.Msg.OK,
                                           icon: Ext.MessageBox.ERROR
                                        });
                                });
                            }
                          
                        }
                    },{
                        text:grid.textClose,
                        iconCls:'close',
                        ref:'../close',
                        handler:function(){
                            winnewgroup.close();
                        }
                    }
                ],*/
                items:[{
                    xtype:'hidden',
                    anchor:'90%',
                    name:'id',
                    value: data.id
                },{
                    xtype:'textfield',
                    anchor:'90%',
                    name:'groupName',
                    value: data.groupName,
                    readOnly:true,
                    fieldLabel:grid.textGroupName,
                    allowBlank:false
                },{
                    xtype:'textarea',
                    anchor:'90%',
                    name:'description',
                    readOnly:true,
                    value: data.description,
                    fieldLabel:grid.textDescription,
                    allowBlank:true
                }]
            };
            var users=[];
            //get the users
            if(data.restUsers instanceof Array){
                users= data.restUsers 
            }else if(data.restUsers){
                users = [data.restUsers];
            }
            //grid with users associated with the group
            var usersPanel = {
                autoExpandColumn:'name',
                xtype:'grid',
                iconCls:'group_link_ic',
                headers:false,
                columns:[{
                        id:'name',
                        dataIndex:'name',
                        header:grid.textName
                    },{
                        id:'role',
                        dataIndex:'role',
                        header:grid.textRole
                    }],
                layout:'fit',
                store: new Ext.data.JsonStore({
                    fields:['name','role'],
                    autoDestroy:true,
                    data:users
                }),
                title: grid.textUsers
            }
            
            // tab panel with group info and members
            var groupInfoTabPanel ={
                xtype:'tabpanel',
                activeTab:0,
                items:[ugForm,usersPanel]
                
            }
            //the window will contain the group info and members tabs
           var wingroup = new Ext.Window({
                iconCls:'group_ic',
                title:data.groupName,
                width: 300, height: 200, 
                resizable: true, 
                modal: true, 
                border:false,
                plain:true,
                closeAction: 'hide', 
                layout: 'fit', 
                items: [groupInfoTabPanel]
            });
            wingroup.show();
        });
 
    }  
});

/** api: xtype = msm_usergroupmanager */
Ext.reg(MSMUserGroupManager.prototype.xtype, MSMUserGroupManager);