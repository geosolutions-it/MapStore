/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires plugins/Login.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SessionLogin
 */

/** api: (extends)
 *  plugins/Login.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SessionLogin(config)
 *
 *    Plugin for Session Login. When user login the tools that require authorization
 *    will be enabled. the user, pass and auth (Base64 string) are saved in 
 *    target.
 */
gxp.plugins.SessionLogin = Ext.extend(gxp.plugins.Login, {
    
    /** api: ptype = gxp_geostore_login */
    ptype: "gxp_session_login",
    
    sessionExpireTime: 1, // 1 hour of default session expire time

    initLoginService: function() {
        this.loginService = this.getService(this.target.adminUrl + "mvc/session/");
    },
    
    initDetailService: function() {
        this.detailService = this.getService(this.target.geoStoreBaseURL + "users/user/details?includeattributes=true");
    },
    
	/** api: method[callLoginService]
     * Submits the login.
     */ 
    callLoginService: function(form, user, pass) {          
        Ext.Ajax.request({
            method: 'PUT',
            url: this.loginService + '?expires=' + this.getExpiration(),
            scope: this,
            headers: {
                'Accept': 'application/json',
                'Authorization' : this.getBasicAuth(user, pass)
            },
            success: function(response, form, action) {
				
				var token = this.getLoginInfo(response);
                if(token) {
                    this.token = token;
                    this.getUserDetails(token);
                } else {
                    this.loginFailure();
                }
                
            },
            failure: this.loginFailure
        });
    },

    getExpiration: function() {
        var expiration = new Date().add(Date.HOUR, this.sessionExpireTime);
        return expiration.format('c');
    },
    
    checkSession: function(token, callback, scope) {
        if(!this.loginService) {
            this.initLoginService();
        }
        Ext.Ajax.request({
            method: 'GET',
            url: this.loginService + 'username/' + token,
            scope: this,
            headers: {
                'Accept': 'application/json'
            },
            success: function(response, form, action) {
                if(response.responseText) {
                    callback.call(scope, true);
                } else {
                    callback.call(scope, false);
                }
            },
            failure: function(response, form, action) {
                callback.call(scope, false);
            }
        });
    },
    
    getUserDetails: function(token) {
        if(!this.detailService) {
            this.initDetailService();
        }
		
        var authHeader = 'Bearer ' + token;
        
        Ext.Ajax.request({
            method: 'GET',
            url: this.detailService,
            scope: this,
            headers: {
                'Accept': 'application/json',
                'Authorization' : authHeader
            },
            success: function(response, form, action) {
				var user = this.getLoginInfo(response, true);       
				if(user && user.User) {
                    this.saveUser(user.User, authHeader, token);
                } else {
                    this.loginFailure();
                }
            },
            failure: this.loginFailure
        });
    },
    
    doLogout: function(callback, scope) {
        if(sessionStorage["userDetails"]) {
            var userDetails = Ext.util.JSON.decode(sessionStorage["userDetails"]);
            var token = userDetails.token;
            Ext.Ajax.request({
                method: 'DELETE',
                url: this.loginService + token,
                scope: this,
                headers: {
                    'Accept': 'application/json',
                    'Authorization' : userDetails.authHeader
                },
                success: function(response, form, action) {
                    if(callback) {
                        callback.call(scope);
                    }
                    
                },
                failure: function(response, form, action) {
                    if(callback) {
                        callback.call(scope);
                    }
                }
            });
        } else if(callback) {
            callback.call(scope);
        }
    }      
});

Ext.preg(gxp.plugins.SessionLogin.prototype.ptype, gxp.plugins.SessionLogin);