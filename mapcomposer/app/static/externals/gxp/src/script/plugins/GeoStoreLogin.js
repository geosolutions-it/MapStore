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
 *  .. class:: GeoStoreLogin(config)
 *
 *    Plugin for GeoStore Login. When user login the tools that require authorization
 *    will be enabled. the user, pass and auth (Base64 string) are saved in 
 *    target.
 */
gxp.plugins.GeoStoreLogin = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_geostore_login */
    ptype: "gxp_geostore_login",
    
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
	
    /** api: config[loginParseErrorText]
     *  ``String``
     *  Text for for invalid response (user details) (i18n).
     */
     loginParseErrorText: "Sorry, there was a problem parsing the server resonse.",
	 
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
	
	loginLoadingMask: "Login ...",
    
    /** api: config[passwordFieldText]
     *  ``String``
     *  Text for the password field in login window(i18n).
     */
    adminTitle: "Admin GUI",
    
    /** api: config[adminIconCls]
     *  ``String``
     *  Icon class for the admin GUI link.
     */
    adminIconCls: "gxp-icon-ms-admin-link",
    
    /** api: config[logoutDropMenuIconCls]
     *  ``String``
     *  Icon class for drop menu for a user logged.
     */
    logoutDropMenuIconCls: "gxp-icon-ms-user",
    
    /** api: config[logoutDropMenuIconCls]
     *  ``String``
     *  Icon class for drop menu for a admin logged.
     */
    logoutDropMenuAdminIconCls: "gxp-icon-ms-admin",
    
    /** api: config[adminGUIUrl]
     *  ``String``
     *  Admin app url.
     */
    adminGUIUrl: null, // TODO: remove from here!!
    // adminGUIUrl: "http://localhost:9191/admin", // TODO: remove from here!!
    
    /** api: config[enableAdminGUILogin]
     *  ``Boolean``
     *  Flag to activate the login with the admin app
     */
    enableAdminGUILogin: false,
    
    /** api: config[adminGUIHome]
     *  ``String``
     *  Relative url for a logged user link inside the admin GUI.
     */
    adminGUIHome: null,
    
    /** api: config[adminLoginInvalidResponseValidator]
     *  ``String``
     *  The response invalid from the admin GUI contains this string. In this case, the login is not succesfull with the admin GUI.
     */
    adminLoginInvalidResponseValidator: "No AuthenticationProvider found",
    
    /** api: config[enableAdminAppWindowFocus]
     *  ``Boolean``
     *  Flag to activate forbid open more than one page for the admin GUI
     */
    enableAdminAppWindowFocus: false,

    /** private: config[adminAppWindowKey]
     *  ``String``
     *  String key for control child window close and don't open more than one adminApp
     */
    adminAppWindowKey: "__ADMIN_APP_ACTIVE",

    /** private: config[adminLinkAction]
     *  Action to show the admin GUI link
     **/ 
    adminLinkAction: null,

    /** 
     * api: method[addActions]
     */
    addActions: function() {
        if (this.loginService !== null) {
            var apptarget = this.target;
            var adminAppWindow;
            var adminGUIId = "adminGUILink";

            var actionsArray = [{
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
            }];

            var menuOptions = [];
            if(this.enableAdminGUILogin){
                menuOptions.push({
                    menuText: this.logoutTitle,
                    iconCls: "gxp-icon-logout",
                    anchor:'100%',
                    text: this.logoutTitle,
                    tooltip: this.logoutTitle,
                    listeners:{
                        click: function() {
                            if(this.logged){
                                this.showLogout();
                            }
                        },
                        scope: this
                    }
                });
                menuOptions.push({
                    menuText: this.adminTitle,
                    iconCls: this.adminIconCls,
                    anchor:'100%',
                    text: this.adminTitle,
                    id: adminGUIId,
                    hidden: true,
                    disabled: true,
                    tooltip: this.adminTitle,
                    handler: function() {
                        if(this.logged){
                            if(!this.enableAdminAppWindowFocus){
                                // We open always a new window
                                window.open(this.adminGUIUrl +  this.adminGUIHome);
                            }else{
                                /*
                                 * TODO: Repair this option. Now it's different for each browser:
                                 * 
                                 *  * Chrome: let you focus and manage the window openend with the 'adminAppWindowKey'
                                 *  * Firefox: don't allow window.focus.
                                 *  * IE: Nothing allowed
                                 */
                                var agt=navigator.userAgent.toLowerCase();
                                var browserType = null;
                                if (agt.indexOf("msie") != -1){
                                    browserType = "IE";
                                }
                                if (browserType != null && browserType == "IE"){ 
                                    // msie not support focus or beforeunload event
                                    window.open(this.adminGUIUrl +  this.adminGUIHome);
                                }else{
                                    var adminAppWindowKey = this.adminAppWindowKey;
                                    if(adminAppWindow && window[adminAppWindowKey]){
                                        // only run with chrome
                                        adminAppWindow.focus();
                                    }else{
                                        adminAppWindow = window.open(this.adminGUIUrl +  this.adminGUIHome);
                                        // beforeunload, we need to mark as invalid the window
                                        $(adminAppWindow).on("beforeunload", function(){
                                            window.parent[adminAppWindowKey] = false;
                                        });
                                        window[adminAppWindowKey] = true;
                                    }
                                }
                            }
                        }
                    },
                    scope: this
                });
                actionsArray.push({
                    xtype: 'menu',
                    menuText: this.logoutTitle,
                    iconCls: this.logoutDropMenuIconCls,
                    anchor:'100%',
                    text: this.logoutTitle,
                    hidden: true,
                    disabled: true,
                    tooltip: this.logoutTitle,
                    defaults: {
                        xtype: 'button',
                        scale: 'large',
                        width: '100%',
                        iconAlign: 'left'
                    },
                    menu:{
                        xtype: 'menu',
                        items: menuOptions
                    }
                });
            }else{
                actionsArray.push({
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
                });
            }
        
            var actions = gxp.plugins.GeoStoreLogin.superclass.addActions.apply(this, [actionsArray]);
            
            this.loginAction = actions[0];
            if(this.enableAdminGUILogin){
                this.logoutAction = actions[1];
                this.adminLinkAction = actionsArray[1].items[0].menu.items.get(adminGUIId);
            }else{
                this.logoutAction= actions[1];
            }

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
				ref: "uname",
                name: "username",
                allowBlank: false
            }, {
                fieldLabel: this.passwordFieldText,
				ref: "pwd",
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
        var form = this.panel.getForm();
        var fields = form.getValues();
        
        var pass = fields.password;
        var user = fields.username;
        if (this.isDummy) return this.dummyLogin(user, pass);
        var auth = 'Basic ' + Base64.encode(user + ':' + pass);
		
		this.mask = new Ext.LoadMask(this.panel.getEl(), {msg: this.loginLoadingMask});
		this.mask.show();
		
        Ext.Ajax.request({
            method: 'GET',
            url: this.loginService,
            scope: this,
            headers: {
                'Accept': 'application/json',
                'Authorization' : auth
            },
            success: function(response, form, action) {
				this.mask.hide();            
                this.win.hide();

                // obatain again the usernaem and pass before reset
                var fields = this.panel.getForm().getValues();
                var password = fields.password;
                var username = fields.username;
				
                this.panel.getForm().reset();
				
                try{
                    var user = Ext.util.JSON.decode(response.responseText);
                }catch(e){
                     Ext.MessageBox.show({
                        title: this.loginErrorTitle,
                        msg: this.loginParseErrorText,
                        buttons: Ext.MessageBox.OK,
                        animEl: 'mb4',
                        icon: Ext.MessageBox.WARNING
                    });
                    return;
                }
				
                if(this.enableAdminGUILogin){
                    this.adminGUILogin(username, password);
                }else{
                    this.loginSuccess(false);
                }
				
                // save auth info
                this.token = auth;
                if (user.User) {
                    this.userid = user.User.id;//TODO geostore don't return user id! in details request
                    this.username = user.User.name;
                    this.role = user.User.role;
                }
            },
            failure: function(response, form, action) {
			    this.mask.hide(); 
                Ext.MessageBox.show({
                    title: this.loginErrorTitle,
                    msg: this.loginErrorText,
                    buttons: Ext.MessageBox.OK,
                    animEl: 'mb4',
                    icon: Ext.MessageBox.WARNING
                });
				
				this.panel.uname.markInvalid({
                    "loginUsername": this.loginErrorText
                });
				
				this.panel.pwd.markInvalid({
                    "loginPassword": this.loginErrorText
                });
            }
        });
    },

    // try to login with the Admin GUI
    adminGUILogin: function(username, password){
        var adminLoginService = this.adminGUIUrl + "/j_spring_security_check";

        this.logoutAction.setText(username);
        Ext.Ajax.request({
            url: adminLoginService,
            scope: this,
            params : {
                j_username: username,
                j_password: password
            },
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            success: function(response, form, action) {
                // we check if the response include the 'adminLoginInvalidResponseValidator' string
                this.loginSuccess(response.responseText 
                    && response.responseText.indexOf(this.adminLoginInvalidResponseValidator) < 0);
            },
            failure: function(response, form, action) {
                // maybe is not admin!!
                this.loginSuccess(false);
            }
        });
    },

    /** api: method[loginSuccess]
     *  Login success handler.
     *  :arg allLoginSuccess: ``Boolean`` Flag to indicate if the admin GUI login was succesfull.
     */ 
    loginSuccess: function(allLoginSuccess) {
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
        
        this.loginAction.hide();
        this.loginAction.disable();
        if(allLoginSuccess && this.enableAdminGUILogin){
            this.logoutAction.setIconClass(this.logoutDropMenuAdminIconCls);
            this.adminLinkAction.setIconClass(this.adminIconCls);
            this.adminLinkAction.show();
            this.adminLinkAction.enable();
        }else if(this.enableAdminGUILogin){
            this.logoutAction.setIconClass(this.logoutDropMenuIconCls);
        }
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
                if(this.enableAdminGUILogin){
                    this.adminLinkAction.hide();
                    this.adminLinkAction.disable();
                }
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

Ext.preg(gxp.plugins.GeoStoreLogin.prototype.ptype, gxp.plugins.GeoStoreLogin);