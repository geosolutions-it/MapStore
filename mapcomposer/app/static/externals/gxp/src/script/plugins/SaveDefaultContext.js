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
 *  .. class:: saveDefaultContext(config)
 *
 *    Plugin for Save Context Map as geostore resource.
 */
gxp.plugins.SaveDefaultContext = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_saveDefaultContext */
    ptype: "gxp_saveDefaultContext",
    
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
            return this.target.userDetails.user.name;
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
						  //console.log(configStr);
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
						  this.save(url, method, contentType, configStr, auth);
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
							  
							  thisObj.save(url, method, contentType, configStr, thisObj.authHeader);
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
        
        return gxp.plugins.SaveDefaultContext.superclass.addActions.apply(this, [actions]);        
    },
    
    save: function(url, method, contentType, configStr, auth){    
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

    metadataDialog: function(configStr){
        var enableBtnFunction = function(){
            if(this.getValue() != "")
                Ext.getCmp("resource-addbutton").enable();
            else
                Ext.getCmp("resource-addbutton").disable();
        };

        var templateId = this.target.templateId;
		var plugin = this;
        var win = new Ext.Window({
		    title: this.mapMetadataTitle,
            width: 415,
            height: 200,
            resizable: false,
            //title: "Map Name",
            items: [
                new Ext.form.FormPanel({
                    width: 400,
                    height: 150,
                    items: [
                        {
                          xtype: 'fieldset',
                          id: 'name-field-set',
                          title: this.mapMedatataSetTitle,
                          items: [
                              {
                                    xtype: 'textfield',
                                    width: 120,
                                    id: 'diag-text-field',
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
                                    fieldLabel: this.mapDescriptionLabel,
                                    readOnly: false,
                                    hideLabel : false                    
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
                        text: this.addResourceButtonText,
                        iconCls: "gxp-icon-addgroup-button",
                        id: "resource-addbutton",
                        scope: this,
                        disabled: true,
                        handler: function(){      
                            win.hide(); 
                            
                            var mapName = Ext.getCmp("diag-text-field").getValue();        
                            var mapDescription = Ext.getCmp("diag-text-description").getValue(); 
                            var auth = plugin.getAuth();
                            var owner = plugin.getUser();
							//var owner = Base64.decode(auth.split(' ')[1]);
							owner = owner.split(':')[0];
                            var resourceXML = 
								'<Resource>' +
									'<Attributes>' +
                    '<attribute>' +
                      '<name>owner</name>' +
                      '<type>STRING</type>' +
                      '<value>' + owner + '</value>' +
                    '</attribute>' +
                    '<attribute>' +
                      '<name>templateId</name>' +
                      '<type>STRING</type>' +
                      '<value>' + templateId + '</value>' +
                    '</attribute>' +
									'</Attributes>' +
									'<description>' + mapDescription + '</description>' +
									'<metadata></metadata>' +
									'<name>' + mapName + '</name>' +
									'<category>' +
										'<name>MAP</name>' +
									'</category>' +
									'<store>' +
										'<data><![CDATA[ ' + configStr + ' ]]></data>' +
									'</store>' +
								'</Resource>';
                                
                            //var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
                            //var mHost=pattern.exec(geoStoreBaseURL);

                            var mUrl = this.target.geoStoreBaseURL + "resources";
                            
                            var url = /*mHost[2] == location.host ? mUrl : this.target.proxy +*/ mUrl;
                            var method = 'POST';
                            var contentType = 'text/xml';              
                            
                            this.save(url, method, contentType, resourceXML, auth);
                            
                            win.destroy(); 
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
    }        
});

Ext.preg(gxp.plugins.SaveDefaultContext.prototype.ptype, gxp.plugins.SaveDefaultContext);