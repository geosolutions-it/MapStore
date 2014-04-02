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
UserManagerView = Ext.extend(
		Ext.grid.GridPanel, {
			
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

			titleConfirmDeleteMsg: "Confirm delete user",
			textConfirmDeleteMsg: "Are you sure you want to delete this user?",
			
			invalidFormMsg: 'Some fields are invalid',
			userAlreadyTaken: 'User is already taken',

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
			* 
			*/
			beforePageText: 'Page',
		   /**
			* Property: afterPageText
			* {string} Customizable piece of the default paging text (defaults to 'of {0}')
			* 
			*/
			afterPageText : "of {0}",
			
			/**
			 * Property: auth
			 * {string} auth token to access geostore services
			 * 
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
				
				//userManager.showEditUserWindow(record);
				
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
			            tooltip: userManager.tooltipSearch,
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

				// button to open the add user window
				this.addUserButton = {
						id: 'id_addUser_button',
						scope: this,
						disabled: false,
				 		text: userManager.textAddUser,
						tooltip: userManager.tooltipAddUser,
						iconCls: 'user_add',
				        handler : function(){
							// form in user add window
							var form = new Ext.form.FormPanel({
								    // width: 415, height: 200, border:false,
								    frame:true,  border:false,
								    items: [
										{
										  xtype: 'fieldset',
										  id: 'name-field-set',
										  border:false,
										  items: [
											  {
													xtype: 'textfield',
													width: 150,
													id: 'user-textfield',
													allowBlank: false,
													blankText: userManager.textBlankUserName,
													fieldLabel: userManager.textName,
													value: '',
													listeners: {
													  beforeRender: function(field) {
														field.focus(false, 1000);
													  }
													}
											  },
											  {
													xtype: 'textfield',
													width: 150,
													id: 'password-textfield',
													allowBlank: false,
													blankText: userManager.textBlankPw,
													fieldLabel: userManager.textPassword,
													inputType:'password',
													value: ''                
											  },
											  {
													xtype: 'textfield',
													width: 150,
													id: 'password-confirm-textfield',
													allowBlank: false,
													blankText: userManager.textBlankPw,
													invalidText: userManager.textPasswordConfError,
													fieldLabel: userManager.textPasswordConf,
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
													width: 150,
													allowBlank: false,
													editable: false,
													blankText: userManager.textBlankRole,
													valueField:'role',
													emptyText: userManager.textSelectRole,
													allowBlank: false,
													triggerAction: 'all',
													mode: 'local',
													id: 'role-dropdown',
													fieldLabel: userManager.textRole,
													store: new Ext.data.SimpleStore({
														 fields:['id', 'role'],
														 data:[['1', 'USER'], ['2', 'ADMIN']]
													})
											  }	
										  ]
										}
									]
						});

						var winAdd = new Ext.Window({
					           width: 415, height: 200, resizable: false, modal: true, border:false, plain:true,
							   closeAction: 'hide', layout: 'fit', 
					           title: userManager.textAddUserTitle,
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

														if ( nameField.isValid(false) &&
													           passwordField.isValid(false) &&
													              roleDropdown.isValid(false) &&
																	passwordField.getValue() == passwordConfirmField.getValue()){
																	
																userManager.users.create( 
																	{ name: nameField.getValue(), 
																	  password:passwordField.getValue(), 
																	  role:roleDropdown.getValue() }, 
                                                                        function success(response){                                                                            
																		winAdd.hide();
																        form.getForm().reset();
																		// refresh the store
                                                                            userManager.reload();
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

				this.showEditUserWindow = function(userdata, renderToTab) {
					
					var userDataFields = [{
									            xtype: 'hidden',
									            id: 'userid-hidden',
									            value: userdata.id
									      },
										  {
									            xtype: 'textfield',
									            width: 150,
									            id: 'user-textfield',
									            disabled: true,
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
									            width: 150,
									            id: 'password-textfield',
												allowBlank: false,
												blankText: userManager.textBlankPw,
									            fieldLabel: userManager.textPasswordEdit,
												inputType:'password',
									            value: '' //TODO set from record               
									      },
									      {
									            xtype: 'textfield',
									            width: 150,
									            id: 'passwordconf-textfield',
												allowBlank: false,
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
												width: 150,
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

					// for user is the tab content!!
					if(renderToTab){
						var formEdit = new Ext.form.FormPanel({
							  title: userManager.textEditUserTitle,
							  iconCls: userManager.iconCls,
							  frame:true,  border:false,
							  id: userManager.id,
							  items: [{
									  xtype: 'fieldset',
									  id: 'name-field-set',
									  border: false,
									  items: userDataFields
							  }],
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

													var useridField = Ext.getCmp("userid-hidden"); 
													var nameField = Ext.getCmp("user-textfield");
													var passwordField = Ext.getCmp("password-textfield");
													var passwordConfField = Ext.getCmp("passwordconf-textfield");
													var roleDropdown = Ext.getCmp("role-dropdown"); 

													if ( nameField.isValid(false) &&
														 passwordField.isValid(false) &&
														 passwordConfField.isValid(false) &&
														 (passwordField.getValue() == passwordConfField.getValue()) &&
														 (isAdmin ? roleDropdown.isValid(false) : true)
														)
													{
														userManager.users.update( useridField.getValue(),
																{ name: nameField.getValue(), 
																  password:passwordField.getValue(), 
																  role:roleDropdown.getValue() }, 
																  function(response) {
																	formEdit.getForm().reset();
																	Ext.Msg.show({
																		title: userManager.successTitle,
																		msg: userManager.validFormMsg,
																		buttons: Ext.Msg.OK,
																		icon: Ext.MessageBox.INFO
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
											}
										]
									})
						});
						Ext.getCmp(renderToTab).add(formEdit);
					}else{
					
						var formEdit = new Ext.form.FormPanel({
							  // width: 415, height: 200, border:false,
							  frame:true,  border:false,
							  items: [{
									  xtype: 'fieldset',
									  id: 'name-field-set',
									  border: false,
									  items: userDataFields
									  }]
						});

						// for admin it shows the window
						var winEdit = new Ext.Window({
							width: 415, height: 200, resizable: false, modal: true, border:false, plain:true,
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

													var useridField = Ext.getCmp("userid-hidden"); 
													var nameField = Ext.getCmp("user-textfield");
													var passwordField = Ext.getCmp("password-textfield");
													var passwordConfField = Ext.getCmp("passwordconf-textfield");
													var roleDropdown = Ext.getCmp("role-dropdown"); 

													if ( nameField.isValid(false) &&
														 passwordField.isValid(false) &&
														 passwordConfField.isValid(false) &&
														 (passwordField.getValue() == passwordConfField.getValue()) &&
														 (isAdmin ? roleDropdown.isValid(false) : true)
														)
													{
														userManager.users.update( useridField.getValue(),
																{ name: nameField.getValue(), 
																  password:passwordField.getValue(), 
																  role:roleDropdown.getValue() }, 
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
					}					   
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
                    
					if(isAdmin)
					{			
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
						            sortable : true, 
						            dataIndex: 'name'
						        },
						        {
						            header   : userManager.textPassword, 
						            sortable : false, 
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
															userManager.gridPanelBbar.doRefresh();
															
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
							            handler: function(grid, rowIndex, colIndex) {
							               var record = grid.store.getAt(rowIndex);
			
							               var userdata = {id: record.get('id'), name: record.data.name, role: record.data.role };
							               
							               userManager.showEditUserWindow(userdata);
							               //open edit user data window				
							            }, 
							            scope: this
							        }]
						        }
						    ]});		
				
					// the top bar of the user manager window
					this.tbar = [ this.inputSearch, this.searchButton, this.resetSearchButton, '-', this.addUserButton ];

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
                        }),
                        
                        sortInfo: { field: "name", direction: "ASC" }
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
            
            getSearchUrl: function() {
                return this.searchUrl + '/' + this.currentFilter;
            },

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
			loadMask:true,  
	        stripeRows: true,
			autoExpandColumn: 'name',
	        height: 200,
	        width: 415,
	        stateful: true,
	        stateId: 'grid',
		    border:false
		  		
	    });