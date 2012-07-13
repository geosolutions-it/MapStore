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
		    * Property: textDelete
		    * {string} label for delete button
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
		    * Property: tooltipCancel
		    * {string} tooltip for cancel button
		    * 
		    */
			tooltipCancel: 'Cancel saving',
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
			 * Property: url
			 * {string} base url for user geostore services
			 * 
			 */			
			url:null,

			/**
			 * Property: auth
			 * {string} auth token to access geostore services
			 * 
			 */
			auth:null,

			/**
		    * Constructor: initComponent 
		    * Initializes the component
		    * 
		    */
			initComponent: function(){
				
				// assets used within the interface
				const ASSET = {
				    delete_icon: './theme/img/user_delete.png',	
				};


				/*
				 * building blocks for ui
				 */
				
				// a reference for this object to be used in closures
				var userManager = this;
				
				// input search box to search for users by name
				this.inputSearch =
					new Ext.form.TextField({
			            id: 'user-input-search',
			            style: 'margin-right:8px; margin-left:8px;',
			            listeners: {
			                specialkey: function(f,e){
			                    if (e.getKey() == e.ENTER) {
									var keyword = Ext.getCmp("user-input-search").getValue();
									if ( !keyword || keyword==='' ){
										userManager.store.filter('*');
									} else {
										userManager.store.filter([
											  {
											    property     : 'name',
											    value        : keyword,
											    anyMatch     : true, 
											    caseSensitive: true  
											  }]);			
									}

			                    }
			                },
			            }
			        });
			
				 // search button
			     this.searchButton =  {
			            id: 'userSearchBtn',
			            tooltip: userManager.tooltipSearch,
			            iconCls: 'find',
			            disabled: false,
			            handler : function() {  
			     				var keyword = Ext.getCmp("user-input-search").getValue();
								if ( !keyword || keyword==='' ){
									userManager.store.filter('*');
								} else {
									userManager.store.filter([
										  {
										    property     : 'name',
										    value        : keyword,
										    anyMatch     : true, 
										    caseSensitive: true  
										  }]);			
								}
			                }
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
							var win = new Ext.Window({
					           width: 415, height: 200, resizable: false, modal: true, border:false,
					           title: userManager.textAddUserTitle,
					           items: [
					              new Ext.form.FormPanel({
					                  width: 415, height: 200,
					                  items: [
					                                {
					                                  xtype: 'fieldset',
					                                  id: 'name-field-set',
					                                  
					                                  items: [
					                                      {
					                                            xtype: 'textfield',
					                                            width: 150,
					                                            id: 'user-textfield',
					                                            fieldLabel: userManager.textName,
					                                            value: ''
					                                      },
					                                      {
					                                            xtype: 'textfield',
					                                            width: 150,
					                                            id: 'password-textfield',
					                                            fieldLabel: userManager.textPassword,
					                                            value: ''                
					                                      },
														  {
					                                            xtype: 'combo',
																displayField:'role',
																valueField:'role',
																emptyText: userManager.textSelectRole,
																allowBlank: false,
																triggerAction: 'all',
																mode: 'local',
					                                            id: 'role-dropdown',
					                                            fieldLabel: userManager.textRole,
					                                            store: new Ext.data.SimpleStore({
																             fields:['id', 'role'],
																             data:[['1', 'USER'], ['2', 'ADMIN']],
																          }),
				           
					                                      }	
					                                  ]
					                                }
					                          ]
					                        })
					                    ],
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
						                                    win.hide(); 
						 									var name = Ext.getCmp("user-textfield").getValue();
															var password = Ext.getCmp("password-textfield").getValue();
															var role = Ext.getCmp("role-dropdown").getValue(); 

															userManager.users.create( 
																{ name:name, password:password, role:role}, 
																function(response){
																		// refresh the store
																		userManager.reloadData();
																	});
						                                    win.destroy(); 
						                                }
						                            },
													{
						                                text: userManager.textCancel,
						                                tooltip: userManager.tooltipCancel,
						                                iconCls: "close",
						                                id: "user-cancelbutton",
						                                scope: this,
						                                handler: function(){      
						                                    win.hide(); 
														    // do nothing
						                                    win.destroy(); 
						                                }
						                            }
						                        ]
						                    }),
					            });
								win.show();						   
						},
					};
					// column definitions for the grid panel
					this.cm = new Ext.grid.ColumnModel({
				            id: 'id_mapstore_cm',
							columns: [
			            	{
			                	id       :'id',
			                	header   : userManager.textId, 
			                	sortable : true, 
			                	dataIndex: 'id',
								hidden:true,
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
								hidden: true,
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
										userManager.users.delete( record.get('id'), function(data){
											// refresh the store
											userManager.reloadData();
										} );
				                    }
				                }
				                ]
				            }
				        ]});		
				
				// the top bar of the user manager window
				this.tbar = [ this.inputSearch, this.searchButton, '-', this.addUserButton ];

				// data store
				this.store = new Ext.data.JsonStore({
							        fields: ['id', 'name', 'password', 'role']
							 });
				// create a content provider with init options
				this.users = new GeoStore.Users(
								{ authorization: userManager.auth,
								  url: userManager.url,
								}).failure( function(data){ console.error(data); } );

				this.loadData = function(){
					// get all users
					userManager.users.find( function( data ){
						// populate store
						userManager.store.loadData(data);
					});		
				};

				this.reloadData = function(){
					userManager.store.removeAll();
					userManager.loadData();
				};

				
				// load data
				userManager.loadData();
				
				// call parent
				UserManagerView.superclass.initComponent.call(this, arguments);
			},
			loadMask:true,  
	        stripeRows: true,
			autoExpandColumn: 'name',
	        height: 200,
	        width: 415,
	        stateful: true,
	        stateId: 'grid',
		    border:false,
		  		
	    });
