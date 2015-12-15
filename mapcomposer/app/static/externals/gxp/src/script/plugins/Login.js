/**
 * Copyright (c) 2008-2015 The Open Planning Project
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
 *    Base Abstract Plugin for Login. 
 */
gxp.plugins.Login = Ext.extend(gxp.plugins.Tool, {
    /** private: property[logged]
     *  toggle when user login
     */
    logged:false,
	
    /** api: config[loginText]
     *  ``String``
     *  Text for the tool text in login (i18n).
     */
    loginText: "Login",
	
	/** api: config[loginText]
     *  ``String``
     *  Text for the tool text in login (i18n).
     */
    loginButtonText: "Login",
	
    /** api: config[logoutTitle]
     *  ``String``
     *  Text for the tool text in logout (i18n).
     */
    logoutTitle: "Logout from MapStore",
	
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
	
    /** api: config[closable]
     *  ``boolean`` The Login window can be closed or not .
     */
    closable: true,
	
    /** api: config[draggable]
     *  ``boolean``
     *   The Login window can be dragged or not.
     */
    draggable: true,

    loginAction: null,
	
    logoutAction: null,
	
    user:null,
	
    pass:null,
    		
	loginLoadingMask: "Login ...",

	logoutLoadingMask: "Logout ...",
    
    scale: 'small',
    
    windowWidth: 275,
    windowHeight:140,
	
	reloadOnLogin: true,
    
    authParam: "authkey",
    
    loginService: null,

    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var actions = gxp.plugins.Login.superclass.addActions.apply(this, [
			[{
				menuText: this.loginText,
				iconCls: "login",
				text: this.loginText,
				disabled: false,
				hidden: this.hideInIframe && this.isEmbed,
				scale: this.scale || 'small',
				tooltip: this.loginText,
				handler: function() {
					if(!this.logged){
						this.showLoginDialog();                            
					}	
				},
				scope: this
			}, {
				menuText: this.logoutTitle,
				iconCls: "logout",
				scale: this.scale || 'small',
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
		this.logoutAction = actions[1];
		
		this.target.on('ready',function(){
			var auth = this.target.getAuth();
			if(auth){
				var userDetails = Ext.util.JSON.decode(sessionStorage["userDetails"]);
				
				// save auth info					
				if (userDetails) {
					this.token = userDetails.token;
                    this.authHeader = userDetails.authHeader;
					this.user = userDetails.user;
					this.userid = userDetails.user.id;
					this.username = userDetails.user.name;
					this.role = userDetails.user.role;       
				}
			
				this.loginSuccess();
			}     
		}, this);
		if(this.showOnStartup){
            this.target.on('ready',function(){
                this.showLoginDialog();
            },this);
        }
		return actions;
    },
	
    /** api: method[showLoginDialog]
     * Shows the window for login.
     */    
    showLoginDialog: function() {
        this.panel = new Ext.FormPanel({
            frame: true,
            labelWidth: 80,
            region:'center',
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
                text: this.loginButtonText,
                iconCls:'login',
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
            iconCls:'user-icon',
            title: this.loginText,
            layout: "border",
            width: this.windowWidth,
            closable:this.closable,
            draggable:this.draggable,
            closeAction: 'close',
            height: this.windowHeight,
            plain: true,
            border: false,
            modal: true,
            items: [this.panel]
        });
		if(this.addPanels){
             this.win.add(this.addPanels);
        }
        this.win.show();
        
    },
    
        
    getService: function(mUrl) {
        var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost = pattern.exec(mUrl);

        return (mHost[2] == location.host ? mUrl : this.target.proxy + encodeURIComponent(mUrl));
    },
    
    initLoginService: function() {},
    
    getBasicAuth: function(user, pass) {
        return 'Basic ' + Base64.encode(user + ':' + pass);
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
        
		
		this.mask = new Ext.LoadMask(this.panel.getEl(), {msg: this.loginLoadingMask});
		this.mask.show();
		
        if (!this.loginService) {
            this.initLoginService();
		}
        
        this.callLoginService(form, user, pass);
    },
    
    callLoginService: function(form, user, pass) {},
    
    getLoginInfo: function(response,json) {
        this.mask.hide();            
        this.win.hide();
        
        this.panel.getForm().reset();
        if(json) {
            try{
                return Ext.util.JSON.decode(response.responseText);
            }catch(e){
                 Ext.MessageBox.show({
                    title: this.loginErrorTitle,
                    msg: this.loginParseErrorText,
                    buttons: Ext.MessageBox.OK,
                    animEl: 'mb4',
                    icon: Ext.MessageBox.WARNING
                });
                return null;
            }
        } else {
            return response.responseText;
        }
    },
    
    
    loginSuccess: function(silent) {
        this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
        Ext.getCmp('paneltbar').items.each(function(tool) {
            if (tool.needsAuthorization === true) {
                tool.enable();
                tool.authHeader=login.authHeader;
            }           
        }, this);
        
        this.loginAction.disable();
		
		this.loginAction.hide();
		if(!(this.hideInIframe && this.isEmbed)) {
            this.logoutAction.show();
        }
        this.logoutAction.enable();

        this.logged = true;
		
		if(this.win){
			this.win.close();
		}    
        if(!silent) {
            this.fireEvent("login", this.user, this.ptype);
        }
    },

    loginFailure: function() {
        this.mask.hide(); 
        Ext.MessageBox.show({
            title: this.loginErrorTitle,
            msg: this.loginErrorText,
            buttons: Ext.MessageBox.OK,
            animEl: 'mb4',
            icon: Ext.MessageBox.WARNING
        });
        
        this.panel.uname.markInvalid({
            "loginUsername": this.loginErrorText,
            "loginPassword": this.loginErrorText
        });
    },
    
    saveUser: function(user, authHeader, token) {
        // save auth info
        this.authHeader = authHeader;
        this.token = token;
        
        if (user) {
            this.user= user;
            this.userid = user.id;
            this.username = user.name;
            this.role = user.role;       
        }
        
        if(this.user){	
            this.user.authParam = this.authParam;
            var uDetails = {
                authHeader: this.authHeader,
                token: this.token,
                user: this.user,
                provider: "geostore"
            };
            
            sessionStorage["userDetails"] = Ext.util.JSON.encode(uDetails);							
        }
        
        if(this.reloadOnLogin){
            this.mask = new Ext.LoadMask(Ext.getBody(), {msg: this.loginLoadingMask});
            this.mask.show();
            location.reload();
        }else{	
            this.loginSuccess();
        }
    },
	
    doLogout: function(callback, scope) {
        if(callback) {
            callback.call(scope);
        }
    },
    
    /** api: method[showLogout]
     * Shows the window for logout confirmation.
     */ 
    showLogout : function(){    
        var logoutFunction = function(buttonId, text,opt){        
            if(buttonId === 'ok'){
                if (!this.loginService) {
                    this.initLoginService();
                }
                this.doLogout(function() {
                    // Clear the sessionStorage
                    for(var i = 0; i < sessionStorage.length; i++) {
                        var key = sessionStorage.key(i);
                        if(key) {
                            sessionStorage.removeItem(key);
                        }
                    }
                    
                    this.loginAction.show();
                    this.loginAction.enable();
                    this.logoutAction.hide();
                    this.logoutAction.disable();
                    this.logged = false;
                    
                    this.fireEvent("logout", this.ptype);
                    
                    // /////////////////////////////
                    // Restore the initial status 
                    // /////////////////////////////
                    this.mask = new Ext.LoadMask(Ext.getBody(), {msg: this.logoutLoadingMask});
                    this.mask.show();
                    location.reload();
                }, this);
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
    }, 
	
	hideLogin: function(){
		this.loginAction.hide();
	},
	
	showLogin: function(){
		this.loginAction.show();
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