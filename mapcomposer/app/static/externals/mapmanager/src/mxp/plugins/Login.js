/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 
/** api: (define)
 *  module = mxp.plugins
 *  class = Login
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: Login(config)
 *
 *    Login Plugin
 */
mxp.plugins.Login = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_login */
    ptype: "mxp_login",

    buttonText: "Login",
    /**
    * api: config[forceLogin]
    * login is mandatory.
    */
    forceLogin: false,
    /**
     * api config[statelessSession]
     * (boolean) if false, the session is managed by 
     * external application, so the login will be attempted
     * on startup without credentials
     */
    statelessSession: true,

    /** api: method[addActions]
     */
    addActions: function() {
        
        // ///////////////////////////////////
        // Inizialization of MSMLogin class
        // ///////////////////////////////////
        this.login = new MSMLogin({
            // grid: this,
            forceLogin: this.forceLogin,
            geoStoreBase : this.target.config.geoStoreBase,
            adminUrl : this.target.config.adminUrl,
            authHeader: this.target.authHeader,
            token: this.target.token,
            statelessSession: this.statelessSession,
            defaultHeaders: this.target.defaultHeaders,
            authenticationMethod: this.target.authenticationMethod || 'basic',
            sessionLogin: this.target.sessionLogin || false
        });

        // Add listeners for login and logout
        this.login.on("login", this.onLogin, this);
        this.login.on("logout", this.onLogout, this);
		
        var actions = [
            this.login.userLabel,
            Ext.create({xtype: 'tbseparator'}),
            this.login.loginButton
		];

        return mxp.plugins.Login.superclass.addActions.apply(this, [actions]);
    },

    /** private: method[onLogin]
     *  Listener with actions to be executed when an user makes login.
     */
    onLogin: function(user, auth, token, details){
        this.target.onLogin(user, auth, token, details);
        this.fireEvent("login", user, auth, token, details);
    },

    /** private: method[onLogout]
     *  Listener with actions to be executed when an user makes logout.
     */
    onLogout: function(){
        this.target.onLogout();
        this.fireEvent("logout");
    }
});

Ext.preg(mxp.plugins.Login.prototype.ptype, mxp.plugins.Login);