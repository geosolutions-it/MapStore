

(function(){

	var root = this;
	
	// ui labels
	const LABEL = {
		id: 'Id',
		name: 'Name',
		password: 'Password',
		role: 'Role',
		delete_tooltip: 'Delete this user',
		delete_label: 'Delete', 
		save_tooltip: 'Save this user',
		save_label: 'Save',
		cancel_tooltip: 'Cancel saving',
		cancel_label: 'Cancel',
		add_user: '', //'Add user',
		add_user_tooltip: 'Create a new user',
		title: 'User Manager',
		search_tooltip: "Search",
	};
	const ASSET = {
	    delete_icon: './theme/img/user_delete.png',	
	};

  /*
   *  this view represents the user manager
   */
  var UserManagerView = root.UserManagerView = function(options){
	
	// data store
	var store = new Ext.data.JsonStore({
				        fields: ['id', 'name', 'password', 'role']
				 });
	// create a content provider with init options
	var users = new GeoStore.Users(
					{ authorization: options.auth,
					  url: options.url,
					}).failure( function(data){ console.error(data); } );
					
	var loadData = function(){
		// get all users
		users.find( function( data ){
			// populate store
			store.loadData(data);
		});		
	};
	
	var reloadData = function(){
		store.removeAll();
		loadData();
	};

	/*
	 * utility function to build ui
	 */
	var createInputSearch = function(parent){
		return new Ext.form.TextField({
            id: 'user-input-search',
            style: 'margin-right:8px; margin-left:8px;',
            listeners: {
                specialkey: function(f,e){
                    if (e.getKey() == e.ENTER) {
						var keyword = Ext.getCmp("user-input-search").getValue();
						if ( !keyword || keyword==='' ){
							store.filter('*');
						} else {
							store.filter([
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
	};
	
	var createSearchButton = function(){
		return {
            id: 'userSearchBtn',
            tooltip: LABEL.search_tooltip,
            iconCls: 'find',
            disabled: false,
            handler : function() {  
     				var keyword = Ext.getCmp("user-input-search").getValue();
					if ( !keyword || keyword==='' ){
						store.filter('*');
					} else {
						store.filter([
							  {
							    property     : 'name',
							    value        : keyword,
							    anyMatch     : true, 
							    caseSensitive: true  
							  }]);			
					}
                }
            };
	};
	
	var createAddUserWindow = function(users){
		var win = new Ext.Window({
           width: 415, height: 200, resizable: false, modal: true,
           items: [
              new Ext.form.FormPanel({
                  width: 415, height: 200,
                  items: [
                                {
                                  xtype: 'fieldset',
                                  id: 'name-field-set',
                                  title: LABEL.add_user,
                                  items: [
                                      {
                                            xtype: 'textfield',
                                            width: 100,
                                            id: 'user-textfield',
                                            fieldLabel: LABEL.name,
                                            value: ''
                                      },
                                      {
                                            xtype: 'textfield',
                                            width: 100,
                                            id: 'password-textfield',
                                            fieldLabel: LABEL.password,
                                            value: ''                
                                      },
									  {
                                            xtype: 'textfield',
                                            width: 100,
                                            id: 'role-textfield',
                                            fieldLabel: LABEL.role,
                                            value: ''                
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
	                                text: LABEL.save_label,
	                                tooltip: LABEL.save_tooltip,
	                                iconCls: "accept",
	                                id: "user-addbutton",
	                                scope: this,
	                                handler: function(){      
	                                    win.hide(); // non definita 
	 									var name = Ext.getCmp("user-textfield").getValue();
										var password = Ext.getCmp("password-textfield").getValue();
										var role = Ext.getCmp("role-textfield").getValue(); 
										
										users.create( 
											{ name:name, password:password, role:role}, 
											function(response){
													// refresh the store
													reloadData();
												});
	                                    win.destroy(); 
	                                }
	                            },
								{
	                                text: LABEL.cancel_label,
	                                tooltip: LABEL.cancel_tooltip,
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
	                    })
            });
			win.show();
			return win;
		};		
	
	
	var createAddUserButton = function(parent){
		 return {
			id: 'id_addUser_button',
			scope: this,
			disabled: false,
	 		text: LABEL.add_user,
			tooltip: LABEL.add_user_tooltip,
			iconCls: 'user_add',
	        handler : function(){
					 createAddUserWindow(parent);
			},
		};
	};


	
	// create a local copy of UserManagerView
	var UserManagerView = Ext.extend(
		Ext.grid.GridPanel, {

			initialize: function( ){
				loadData();
				return this;
			},
			loadMask:true,
			store: store,
			columns: [
	            	{
	                	id       :'id',
	                	header   : LABEL.id, 
	                	sortable : true, 
	                	dataIndex: 'id',
						hidden:true,
	            	},
		            {
		                id       :'name',
		                header   : LABEL.name, 
		                sortable : true, 
		                dataIndex: 'name'
		            },
		            {
		                header   : LABEL.password, 
		                sortable : false, 
		                dataIndex: 'password',
						hidden: true,
		            },
		            {
		                header   : LABEL.role, 
		                sortable : true, 
		                dataIndex: 'role'
		            },
		            {
		                xtype: 'actioncolumn',
		                width: 50,
		                items: [{
		                    icon   : ASSET.delete_icon, 
		                    tooltip: LABEL.delete_tooltip,
		                    handler: function(grid, rowIndex, colIndex) {
		                       var record = grid.store.getAt(rowIndex);
								users.delete( record.get('id'), function(data){
									// refresh the store
									reloadData();
								} );
		                    }
		                }
		                ]
		            }
		        ],	    
			tbar: [ createInputSearch( users ), createSearchButton(), '-', createAddUserButton( users ) ],  
	        stripeRows: true,
			autoExpandColumn: 'name',
	        height: 200,
	        width: 415,
	        // title: LABEL.title,
	        stateful: true,
	        stateId: 'grid',
		    
		  		
	    });
	
		// return an instance of the UserManagerView
		return (new UserManagerView()).initialize();
  };




}).call(this);