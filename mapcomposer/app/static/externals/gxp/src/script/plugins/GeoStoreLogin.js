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
 *  class = GeoStoreLogin
 */

/** api: (extends)
 *  plugins/Login.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoStoreLogin(config)
 *
 *    Plugin for GeoStore Login. When user login the tools that require authorization
 *    will be enabled. the user, pass and auth (Base64 string) are saved in 
 *    target.
 */
gxp.plugins.GeoStoreLogin = Ext.extend(gxp.plugins.Login, {
    
    /** api: ptype = gxp_geostore_login */
    ptype: "gxp_geostore_login",
    
	authenticationMethod: 'basic',
	
    initLoginService: function() {
        this.loginService = this.getService(this.target.geoStoreBaseURL + "users/user/details?includeattributes=true");
    },
    
	/** api: method[callLoginService]
     * Submits the login.
     */ 
    callLoginService: function(form, user, pass) {        
        
        var auth = this.getBasicAuth(user, pass);
		
        Ext.Ajax.request({
            method: 'GET',
            url: this.loginService,
            scope: this,
            headers: {
                'Accept': 'application/json',
                'Authorization' : auth
            },
            success: function(response, form, action) {
                var user = this.getLoginInfo(response, true);
				if(user && user.User) {
                    var token = user.User ? this.getAuthToken(user.User) : undefined;
                    var authHeader = (token && this.authenticationMethod === 'token') ? 
                            'Bearer ' + token : auth;
                    
                    this.saveUser(user.User, authHeader, token);
                } else {
                    this.loginFailure();
                }
            },
            failure: this.loginFailure
        });
    },

    getAuthToken: function(user) {
        if(user && user.attribute) {
            var attributes = (user.attribute instanceof Array) ? user.attribute : [user.attribute];
            for(var i=0, l = attributes.length; i < l; i++) {
                var attribute = attributes[i];
                if(attribute.name === 'UUID') {
                    return attribute.value;
                }

            }
        }
        return null;
    }
        
});

Ext.preg(gxp.plugins.GeoStoreLogin.prototype.ptype, gxp.plugins.GeoStoreLogin);