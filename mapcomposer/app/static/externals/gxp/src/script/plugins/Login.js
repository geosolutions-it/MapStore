/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Login
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Login(config)
 *
 *    Plugin for Login. When user login the tools that require authorization
 *    will be enabled. the user, pass and auth (Base64 string) are saved in 
 *    target.
 */
gxp.plugins.Login = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_login */
    ptype: "gxp_login",
    
	/** private: property[logged]
     *  toggle when user login
     */
	logged:false,
	/** api: config[loginText]
     *  ``String``
     *  Text for the tool text in login (i18n).
     */
    loginText: "Login",
	/** api: config[logoutTitle]
     *  ``String``
     *  Text for the tool text in logout (i18n).
     */
    logoutTitle: "Logout",
	/** api: config[logoutText]
     *  ``String``
     *  Text for confirmation window (i18n).
     */
    logoutText: "Are you sure to logout?",
	/** api: config[loginErrorText]
     *  ``String``
     *  Text for invalid user or password (i18n).
     */
    loginErrorText: "Invalid username or password.",
	/** api: config[userFieldText]
     *  ``String``
     *  Text for the user field in login window (i18n).
     */
    userFieldText: "User",
	/** api: config[passwordFieldText]
     *  ``String``
     *  Text for the password field in login window(i18n).
     */
    passwordFieldText: "Password", 
	
    loginAction: null,
	logoutAction: null,
	user:null,
	pass:null,
	loginService: null,
	
	
    /** 
     * api: method[addActions]
     */
    addActions: function() {
		if (this.loginService !== null) {
		    var apptarget = this.target;
        
			var actions = gxp.plugins.Login.superclass.addActions.apply(this, [
				
				[{
					menuText: this.loginText,
					iconCls: "gxp-icon-login",
					anchor:'100%',
					text: this.loginText,
					disabled: false,
					hidden: false,
					tooltip: this.loginText,
					handler: function() {
						if(!this.logged){
							this.showLoginDialog();
							
						}	
					},
					scope: this
				},{
					menuText: this.logoutTitle,
					iconCls: "gxp-icon-logout",
					anchor:'100%',
					text: this.logoutTitle,
					hidden: true,
					disabled: true,
					tooltip: this.logoutTitle,
					handler: function() {
						if(this.logged){
							this.showLogout();
						}		
					},
					scope: this
				}]
			]);
			
			this.loginAction = actions[0];
			this.logoutAction= actions[1];
			
			return actions;
		}
	},
	/** api: method[showLoginDialog]
     * Shows the window for login.
     */    
    showLoginDialog: function() {
	
        this.panel = new Ext.FormPanel({
            url: this.loginService,
            frame: true,
            labelWidth: 80,
			layout: "form",
            defaultType: "textfield",
            errorReader: {
                read: function(response) {
                    var success = false;
                    var records = [];
                    if (response.status === 200) {
                        success = true;
                    } else {
                        records = [
                            {data: {id: "username", msg: this.loginErrorText}},
                            {data: {id: "password", msg: this.loginErrorText}}
                        ];
                    }
                    return {
                        success: success,
                        records: records
                    };
                }
            },
            items: [{
                fieldLabel: this.userFieldText,
				anchor:'100%',
                name: "username",
                allowBlank: false
            }, {
                fieldLabel: this.passwordFieldText,
                name: "password",
				anchor:'100%',
                inputType: "password",
                allowBlank: false
            }],
            buttons: [{
                text: this.loginText,
                formBind: true,
                handler: this.submitLogin,
                scope: this
            }],
            keys: [{ 
                key: [Ext.EventObject.ENTER], 
                handler: this.submitLogin,
                scope: this
            }]
        });
                
        this.win = new Ext.Window({
            title: this.loginText,
            layout: "fit",
            width: 275,
			closeAction: 'close',
            height: 130,
            plain: true,
            border: false,
            modal: true,
            items: [this.panel]
        });
        this.win.show();
    },
	/** api: method[submitLogin]
     * Submits the login.
     */ 
	submitLogin: function () {
		//if(this.isDummy) return this.dummyLogin();
		var form = this.panel.getForm();
		var fields = form.getValues();
		var pass = fields.password;
		var user = fields.username;
        if (this.isDummy) return this.dummyLogin(user,pass);

		var auth= 'Basic ' + this.encode(user+':'+pass);
		Ext.Ajax.request({
			method: 'GET',
			//** REMOVE USER AND PASS IN URL WHEN PROXY WILL SUPPORT BASIC AUTH **//
			url: proxy + this.loginService,
			scope: this,
			//proxy: '',
			headers: {
				'Authorization' : auth
			},
			success: this.loginSuccess,
			failure: this.loginFailure
			
		});	

	},
	
	loginSuccess: function(request) {
		this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
		Ext.getCmp('paneltbar').items.each(function(tool) {
			if (tool.needsAuthorization === true) {
				tool.enable();	
			}           
		},this);
        
        for(var tool in this.target.tools){            
            if(this.target.tools[tool].ptype == "gxp_nrl"){  
                this.target.tools[tool].enableData();
            }                          
        }
        
		//app.auth = auth;
		//app.user=user;
		//app.pass=pass;
		//save user and password
		//this.pass=pass;
		//this.user=user;
		
		//change button to logout
		this.loginAction.hide();
		this.loginAction.disable();
		this.logoutAction.show();
		this.logoutAction.enable();
		//this.target.setIconClass("gxp-icon-logout");
		this.logged=true;
		this.win.close();
	},

	loginFailure: function(request) {
		var form =this.panel.getForm();
		form.markInvalid({
			"username": this.loginErrorText,
			"password": this.loginErrorText
		});										
	},
	/** api: method[showLogout]
     * Shows the window for logout confirmation.
     */ 
	showLogout : function(){
    
		var logoutFunction = function(buttonId, text,opt){        
            if(buttonId === 'ok'){ 
                for(var tool in this.target.tools){            
                    if(this.target.tools[tool].ptype == "gxp_nrl"){  
                        this.target.tools[tool].disableData();
                    }                          
                }
                this.loginAction.show();
                this.loginAction.enable();
                this.logoutAction.hide();
                this.logoutAction.disable();
                this.logged=false;
            }
        }
        
        Ext.Msg.show({
           title: this.logoutTitle,
           msg: this.logoutText,
           buttons: Ext.Msg.OKCANCEL,
           fn: logoutFunction,
           icon: Ext.MessageBox.QUESTION,
           scope: this
        });        
            
			/*if(buttonId === 'ok'){                        
				window.location.reload( false );
			}else if(buttonId === 'no'){
				window.location.reload( false );
			}else if(buttonId === 'yes'){
				var xmlContext;
				var handleSave = function(){
					var xmlContext = this.xmlContext;            
					var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
					mask.show();
					var auth =  'Basic ' + this.encode(this.user+':'+this.pass);
					Ext.Ajax.request({
					   url: proxy + server + "exist/rest/mapadmin/context.xml", //TODO parametrize
					   //url: this.loginService,
					   headers:{
							'Authorization' : auth
					   },
					   method: 'PUT',
					   params: xmlContext,
					   scope: this,
					   success: function(response, opts){
						  mask.hide();
						  window.location.reload( false );
					   },
					   failure:  function(response, opts){
						  mask.hide();
						  Ext.Msg.show({
							 title: this.contextSaveFailString,
							 msg: response.statusText,
							 buttons: Ext.Msg.OK,
							 icon: Ext.MessageBox.ERROR
						  });
					   }
					});		
				};
				
				var configStr = Ext.util.JSON.encode(app.getState());  
				var saveUrl = app.xmlJsonTranslateService + "HTTPWebGISSave";		
				
				OpenLayers.Request.issue({
					method: 'POST',
					url: saveUrl,
					data: configStr,
					callback: function(request) {
						if (request.status == 200) {
							this.xmlContext = request.responseText;
							handleSave.call(this);
							this.logged=false;
						} else {
							throw request.responseText;
						}						
					},
					scope: this
				});
			}
		};
						
		if(modified || app.modified){
			Ext.Msg.show({
			   title: this.logoutTitle,
			   msg: "Save changes before logout?",
			   buttons: Ext.Msg.YESNOCANCEL,
			   fn: logoutFunction,
			   icon: Ext.MessageBox.QUESTION,
			   scope: this
			});
		}else{
			Ext.Msg.show({
			   title: this.logoutTitle,
			   msg: this.logoutText,
			   buttons: Ext.Msg.OKCANCEL,
			   fn: logoutFunction,
			   icon: Ext.MessageBox.QUESTION,
			   scope: this
			});
		}*/
		
	},
	/** private: property[_keyStr]
     *  avaible chars for Base64 conversion.
     */
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = this._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	},
	dummyLogin: function(user,pass){
        if (user == "admin" && pass == "admin"){
            this.loginSuccess();
        }else{
            this.loginFailure();
        }
	}
        
});

Ext.preg(gxp.plugins.Login.prototype.ptype, gxp.plugins.Login);