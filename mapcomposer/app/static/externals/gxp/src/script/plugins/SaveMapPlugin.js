/**
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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = saveDefaultContext
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SaveMapPlugin(config)
 *
 *    Plugin for Save Context Map as geostore resource.
 */
gxp.plugins.SaveMapPlugin = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_saveMapPlugin */
    ptype: "gxp_saveMapPlugin",
    
    /** api: config[saveDefaultContextMenuText]
     *  ``String``
     */
    saveDefaultContextMenuText: "Save default context",

    /** api: config[saveDefaultContextActionTip]
     *  ``String``
     */
    saveDefaultContextActionTip: "Save Map context",
	
    /** api: config[contextSaveSuccessString]
     *  ``String``
     */
    contextSaveSuccessString: "Context saved succesfully",
    	
    /** api: config[contextSaveFailString]
     *  ``String``
     */
    contextSaveFailString: "Context not saved succesfully",
    
    /** api: config[addResourceButtonText]
     *  ``String``
     */
    addResourceButtonText: "Add Map",

    selectionErrorTitle:"Error",

    groupSelectionError:"Select at least one group",

    permissionsLabel:"Permissions",

    groupsLabel:"User groups",
    /** api: config[authHeader]
     *  ``String``
     */
    authHeader: null,
	
    /**
    * Property: contextMsg
    * {string} string to add in loading message
    * 
    */
    contextMsg: 'Loading...',
	
	/**
    * Property: userLabel
    * {string} 
    * 
    */
	userLabel: "User",
	
	/**
    * Property: passwordLabel
    * {string} 
    * 
    */
	passwordLabel: "Password", 
	
	/**
    * Property: loginLabel
    * {string} 
    * 
    */
	loginLabel: "Login",
	
	/**
    * Property: mapMetadataTitle
    * {string} 
    * 
    */
	mapMetadataTitle: "Insert Map Metadata",
	
	/**
    * Property: mapMedatataSetTitle
    * {string} 
    * 
    */
	mapMedatataSetTitle: "Map Metadata",
	
	/**
    * Property: mapNameLabel
    * {string} 
    * 
    */
	mapNameLabel: "Name",
	
	/**
    * Property: mapDescriptionLabel
    * {string} 
    * 
    */
	mapDescriptionLabel: "Description",
	
    getUser: function() {
        if(this.target.userDetails && this.target.userDetails.user) {
            return this.target.userDetails.user;
        } else {
            var auth = this.getAuth();
            if(auth) {
                return Base64.decode(auth.split(' ')[1]);
            }
        }
        return '';
    },
    
	/**
	 * Property: conflictErrMsg
	 * {string}
	 */
	conflictErrMsg: "A map with the same name already exists",
	
    /** api: method[addActions]
     */
    addActions: function() {
        
        //var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        //var mHost=pattern.exec(geoStoreBaseURL);
        var plugin =this;
		    var saveContext = new Ext.Button({
		        id: "save-context-button",
            menuText: this.saveDefaultContextMenuText,
            iconCls: "gxp-icon-savedefaultcontext",
            disabled: false,
            tooltip: this.saveDefaultContextActionTip,
            handler: function() {	
			
				  if(this.target.authHeader || this.authHeader){
                      
					  var configStr = Ext.util.JSON.encode(this.target.getState()); 
					  
					  if(this.target.mapId == -1){
						  //
						  // SAVE MAP
						  //
						  this.metadataDialog(configStr); 
					  }else{
						  //
						  // UPDATE MAP
						  //
              var mUrl = this.target.geoStoreBaseURL + "data/" + this.target.mapId;
						  var url = /*mHost[2] == location.host ? mUrl : this.target.proxy + */mUrl;
						  var method = 'PUT';
						  var contentType = 'application/json';
              var auth = plugin.getAuth();
						  this.updateMap(url, method, contentType, configStr, auth);
					  }
				  }else{
				  	   var loginPanel;
					     var loginWin;
					     var thisObj = this;
					  
					     var submitLogin = function() {
						   var form = loginPanel.getForm();
						   var fields = form.getValues();
						  
						   var pass = fields.password;
						   var user = fields.username;
									  
						   loginWin.destroy();
						  
						    thisObj.authHeader = 'Basic ' + Base64.encode(user + ':' + pass);           
						    var configStr = Ext.util.JSON.encode(thisObj.target.getState()); 
						  
						  if(thisObj.target.mapId == -1){
							  //
							  // SAVE MAP
							  //
							  thisObj.metadataDialog(configStr);                      
						  }else{
							  //
							  // UPDATE MAP
							  //
                var mUrl = thisObj.target.geoStoreBaseURL + "data/" + thisObj.target.mapId;
							  var url = /*mHost[2] == location.host ? mUrl : this.target.proxy +*/ mUrl;
							  var method = 'PUT';
							  var contentType = 'application/json';
							  
							  thisObj.updateMap(url, method, contentType, configStr, thisObj.authHeader);
						  }
					  };
					  
					  loginPanel = new Ext.FormPanel({
						  frame: true,
						  labelWidth: 80,
						  defaultType: "textfield",
						  items: [{
							  fieldLabel: this.userLabel,
							  name: "username",
							  allowBlank: false
						  }, {
							  fieldLabel: this.passwordLabel,
							  name: "password",
							  inputType: "password",
							  allowBlank: false
						  }],
						  buttons: [{
							  text: this.loginLabel,
							  formBind: true,
							  handler: submitLogin
						  }],
						  keys: [{ 
							  key: [Ext.EventObject.ENTER], 
							  handler: submitLogin
						  }]
					  });
					  
					  var loginWin = new Ext.Window({
						  title: "Login",
						  layout: "fit",
						  width: 275,
						  height: 130,
						  plain: true,
						  border: false,
						  modal: true,
						  items: [loginPanel]
					  });
					  
					  loginWin.show();
				  }
            },
            scope: this
        });
		
        var actions = [saveContext]; 
        
        return gxp.plugins.SaveMapPlugin.superclass.addActions.apply(this, [actions]);        
    },
    
    updateMap: function(url, method, contentType, configStr, auth){    
        var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.contextMsg});
        mask.show();

        Ext.Ajax.request({
           url: url,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : auth
           },
           params: configStr,
           scope: this,
           success: function(response, opts){
              mask.hide();
              this.target.modified = false;
              
			  //
			  // if the user change language the page is reloaded and this.authHeader is cleared
			  //
			  if(!this.authHeader)
				    this.authHeader = auth;
				
              this.target.mapId = response.responseText;
              
              var reload = function(buttonId, text, opt){
                  if(buttonId === 'ok'){  
                      var href = location.href;
                      if(href.indexOf('mapId') == -1){
                          if(href.indexOf('?') != -1){
                              window.open(href + '&mapId=' + this.target.mapId, '_self');
                          }else{
                              window.open(href + '?mapId=' + this.target.mapId, '_self');
                          }
                      }
                  } 
              };
    
              Ext.Msg.show({
                   title: this.contextSaveSuccessString,
                   msg: response.statusText + " " + this.contextSaveSuccessString,
                   buttons: Ext.Msg.OK,
                   fn: reload,
                   icon: Ext.MessageBox.OK,
                   scope: this
              });
           },
           failure:  function(response, opts){
              mask.hide();
			  
			       this.authHeader = null;
			  
              Ext.Msg.show({
                 title: this.contextSaveFailString,
                 msg: this.getSaveFailedErrMsg(response),
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
           }
        }); 
    },
    
    getSaveFailedErrMsg: function(response) {
    	var errMsg = null;
    	var defaultErrMsg = response.statusText + "(status " + response.status + "):  " + response.responseText;
    	
    	switch (response.status) {
    		case 409:
    			errMsg = this.conflictErrMsg;
    			break;
    		default:
    			errMsg = defaultErrMsg;
    			break;
    	}
    	
    	return errMsg;
    },
    createMap :function (url, method, contentType, configStr, auth,permissions){

        var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.contextMsg});
        mask.show();

        Ext.Ajax.request({
           url: url,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : auth
           },
           params: configStr,
           scope: this,
           success: function(response, opts){
              mask.hide();
              this.target.modified = false;
                   
        //
        // if the user change language the page is reloaded and this.authHeader is cleared
        //
        if(!this.authHeader)
            this.authHeader = auth;
              this.target.mapId = response.responseText
               var reload = function(buttonId, text, opt){
                  if(buttonId === 'ok'){  
                      var href = location.href;
                      if(href.indexOf('mapId') == -1){
                          if(href.indexOf('?') != -1){
                              window.open(href + '&mapId=' + this.target.mapId, '_self');
                          }else{
                              window.open(href + '?mapId=' + this.target.mapId, '_self');
                          }
                      }
                  } 
              };
              //Save permissions
              permissionUrl= url+'/resource/'+this.target.mapId+'/permissions';
              this.createPermission(permissionUrl, method, contentType, permissions, auth,reload);        
           },
           failure:  function(response, opts){
              mask.hide();
        
             this.authHeader = null;
        
              Ext.Msg.show({
                 title: this.contextSaveFailString,
                 msg: this.getSaveFailedErrMsg(response),
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
           }
        });   
    },
createPermission :function (url, method, contentType, configStr, auth,reload){

        var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.contextMsg});
        mask.show();

        Ext.Ajax.request({
           url: url,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : auth
           },
           params: configStr,
           scope: this,
           success: function(response, opts){
              mask.hide();
             
        // if the user change language the page is reloaded and this.authHeader is cleared
        //
        if(!this.authHeader)
            this.authHeader = auth;
              
    
              Ext.Msg.show({
                   title: this.contextSaveSuccessString,
                   msg:   this.contextSaveSuccessString,
                   buttons: Ext.Msg.OK,
                   fn: reload,
                   icon: Ext.MessageBox.OK,
                   scope: this
              });
           },
           failure:  function(response, opts){
              mask.hide();
        
             this.authHeader = null;
        
              Ext.Msg.show({
                 title: this.contextSaveFailString,
                 msg: this.getSaveFailedErrMsg(response),
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
           }
        }); 

    },


    metadataDialog: function(configStr){
        var enableBtnFunction = function(){
            if(this.getValue() != "")
                Ext.getCmp("resource-addbutton").enable();
            else
                Ext.getCmp("resource-addbutton").disable();
        };
        var saveBtn=Ext.getCmp("save-context-button");
        var templateId = this.target.templateId;
		    var plugin = this;
        var win = new Ext.Window({
		    title: this.mapMetadataTitle,
            width: 415,
            height: 400,
            resizable: true,
            plain: true,
            layout: "fit",
            listeners:{

              destroy:function(){
                saveBtn.enable();
              },
              show:function(){
                saveBtn.disable();
              }
            },
            //title: "Map Name",
            items: [
                {
                    xtype:'form',
                    layout: "fit",
                    border:true,
                    items: [
                        {
                          xtype: 'fieldset',
                          id: 'name-field-set',
                          items: [
                              {
                                  xtype: 'textfield',
                                  width: 200,
                                  allowBlank:false,
                                  id: 'diag-text-field',
                                  ref: "../../mapName",
                                  fieldLabel: this.mapNameLabel,
                                  listeners: {
                                      render: function(f){
                                          f.el.on('keydown', enableBtnFunction, f, {buffer: 350});
                                      }
                                  }
                              },
                              {
                                  xtype: 'textarea',
                                  width: 200,
                                  id: 'diag-text-description',
                                  ref: "../../mapDescription",
                                  fieldLabel: this.mapDescriptionLabel,
                                  readOnly: false,
                                  hideLabel : false                    
                              },
                              {
                                  xtype:'combo',
                                  typeAhead: true,
                                  triggerAction: 'all',
                                  mode: 'local',
                                  width: 200,
                                  fieldLabel: this.permissionsLabel,
                                  ref: "../../generalPermissions",
                                  store: new Ext.data.ArrayStore({
                                      id: 0,
                                      fields: ['value','displayText'],
                                      data: [['public', 'Public (default)'], ['private', 'Private'],['group','Group']]
                                  }),
                                  valueField: 'value',
                                  displayField: 'displayText',
                                  value:'public',
                                  listeners:{
                                      scope: this,
                                      'select': function( combo, record, index){
                                      if(index==2){
                                              win.groupPermissions.enable();
                                      }
                                      else win.groupPermissions.disable();
                                    }
                                  }
                              },{
                                    xtype:'gxp_usergroupmultiselect',
                                    width: 200,
                                    ref:"../../groupPermissions",
                                    disabled:true,
                                    fieldLabel:this.groupsLabel,
                                    url: this.target.geoStoreBaseURL +'/usergroups',
                                    auth: this.getAuth(),
                                    name:'groupId',
                                    editable:false,
                                    maxLength:200,
                                    allowBlank:true,
                                    target: this.target
                                }
                          ]
                        }
                    ]
                }
            ],
            bbar: new Ext.Toolbar({
                items:[
                    '->',
                    {
                        text: this.addResourceButtonText,
                        iconCls: "gxp-icon-addgroup-button",
                        id: "resource-addbutton",
                        scope: this,
                        disabled: true,
                        handler: function(){   
                                    
                                    var mapName = win.mapName.getValue();        
                                    var mapDescription = win.mapDescription.getValue();
                                    var generalPermission= win.generalPermissions.getValue();
                                    var groups=win.groupPermissions.getValue();

                                    if(mapName){
                                    
                                    // /////////////////////////////////////
                                    // Get info about logged user if any
                                    // /////////////////////////////////////
                                    var auth =plugin.getAuth();
                                    
                                    // /////////////////////////
                                    // Fetch base url
                                    // /////////////////////////
                                    var url =  plugin.target.geoStoreBaseURL+'resources';
                                  
                                    var owner=null,userId=null;
                                    var user=plugin.getUser();
                                    
                                    if(user.name ) {
                                          owner= user.name;
                                          userId=user.id
                                     }

                                    var attributes=null;
                                    if(templateId)
                                        attributes=[{name:'templateId','@type':'STRING',value:templateId}];
                                     
                                    var objConfig=  {
                                            owner: owner,
                                            name:mapName, 
                                            description: mapDescription,                                            
                                            attributes:attributes,
                                            blob:configStr
                                        };
                                        //owner rule
                                    var permissionsConfig=[{
                                                user:{name:owner,id:userId},
                                                canRead:true,
                                                canWrite:true
                                            }];
                                    if(generalPermission=='public'){
                                        //get everyone group id
                                        var everyone=win.groupPermissions.store.getAt(win.groupPermissions.store.find('name','everyone'));
                                            permissionsConfig.push({
                                            group:{name:everyone.get('name'),id:everyone.get('id')},
                                            canRead:true,
                                            canWrite:false
                                        });
                                    }else if(generalPermission=='group'){

                                           if(groups==""){
                                                Ext.Msg.show({  
                                                    title: plugin.selectionErrorTitle,                                            
                                                    msg: plugin.groupSelectionError,
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                }); 
                                                return; 
                                           }else{
                                                var st=win.groupPermissions.store;
                                                    Ext.each(groups.split(','), function(id){
                                                    
                                                        permissionsConfig.push({
                                                        	group:{name:st.getById(id).get('name'),id:id},
                                                            canRead:true,
                                                            canWrite:false
                                                        });
                                                });
                                           }
                                    }
                            
                                    var method = 'POST';
                                    var contentType = 'text/xml';              
              
                                    plugin.createMap(url, method, contentType, plugin.createXmlMapResource(objConfig), auth,plugin.createXmlPermissionsResource(permissionsConfig));

                                        win.destroy(); 
                                        
                                      }
                                        else{
                                            Ext.Msg.show({
                                                title: "Error",
                                                msg: plugin.mapRequiredError,
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.ERROR
                                            });  

                                        }
                                }
                    }
                ]
            })
        });
      
        win.show();
    },
	
	/**
     * Retrieves auth from (in this order)
     * * the parent window (For usage in manager)
     * * the session storage (if enabled userDetails, see ManagerViewPort.js class of mapmanager)
     * We should imagine to get the auth from other contexts.
     */
    getAuth: function(){
		var authorization = this.target.getAuth();
        return (authorization ? authorization : this.authHeader);
    }, 
    createXmlMapResource: function(data){
      // ///////////////////////////////////////
      // Wrap new map within an xml envelop
      // ///////////////////////////////////////
      //var addedAttributes = false;
      var xml = '<Resource>';
      
      if(data.owner || data.attributes){
        xml +=  '<Attributes>';
        
        if(data.owner){
          xml += 
            '<attribute>' +
              '<name>owner</name>' +
              '<type>STRING</type>' +
              '<value>' + data.owner + '</value>' +
            '</attribute>';
        }
        
        if(data.attributes){
          for(var i=0; i<data.attributes.length; i++){
            xml += 
              '<attribute>' +
                '<name>' + data.attributes[i].name + '</name>' +
                '<type>' + data.attributes[i]["@type"] + '</type>' +
                '<value>' + data.attributes[i].value + '</value>' +
              '</attribute>';
          }
        }
        
        xml += '</Attributes>';
      }
        
      xml +=
        '<description>' + data.description + '</description>' +
        '<metadata></metadata>' +
        '<name>' + data.name + '</name>';
      if (data.blob)
        xml+=
        '<category>' +
          '<name>MAP</name>' +
        '</category>' +
        '<store>' +
          '<data><![CDATA[ ' + data.blob + ' ]]></data>' +
        '</store>';
        
      xml += '</Resource>';
      return xml;
    },

    createXmlPermissionsResource: function(data){
      // wrap security rule list
      var xml = '<SecurityRuleList>';
      if(data && data.length > 0){
        for(var i = 0; i < data.length; i++){
          var rule = data[i];
          // valid rule
          if(rule && (rule.user || rule.group)){
            xml += 
            '<SecurityRule>' +
              '<canRead>' + rule.canRead + '</canRead>' +
              '<canWrite>' + rule.canWrite + '</canWrite>';
            if(rule.user){
              xml += 
                '<user>' + 
                  '<id>' + rule.user.id + '</id>' +
                  '<name>' + rule.user.name + '</name>' +
                '</user>';
            } else if(rule.group){
              xml += 
                '<group>' + 
                  '<id>' + rule.group.id + '</id>' +
                  '<groupName>' + rule.group.groupName + '</groupName>' +
                '</group>';
            }

            xml += 
              '</SecurityRule>';
          }
        }
      }

      xml += '</SecurityRuleList>';


      return xml;
    },      
});

Ext.preg(gxp.plugins.SaveMapPlugin.prototype.ptype, gxp.plugins.SaveMapPlugin);