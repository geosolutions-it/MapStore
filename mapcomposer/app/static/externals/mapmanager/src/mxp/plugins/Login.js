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
     * Property: statelessSession
     * {Boolean} If the session is stateless is not needed check user details at startup
     * 
     */
    statelessSession: true,
    /**
     * Property: externalHeaders
     * {Boolean} Use external headers
     * 
     */
    externalHeaders: false,

    /** api: method[addActions]
     */
    addActions: function() {

        // ///////////////////////////////////
        // Inizialization of MSMLogin class
        // ///////////////////////////////////
        this.login = new MSMLogin({
            // grid: this,
            geoStoreBase : this.target.config.geoStoreBase,
            token: this.target.auth,
            defaultHeaders: this.target.defaultHeaders,
            statelessSession: this.statelessSession,
            externalHeaders: this.externalHeaders,
            target: this.target
        });

        // Add listeners for login and logout
        this.login.on("login", this.onLogin, this);
        this.login.on("logout", this.onLogout, this);

        // for external header, we don't need the login button
        var actions = [this.login.userLabel, Ext.create({xtype: 'tbseparator'}), this.login.loginButton];

        return mxp.plugins.TemplateManager.superclass.addActions.apply(this, [actions]);
    },

    /** private: method[onLogin]
     *  Listener with actions to be executed when an user makes login.
     */
    onLogin: function(user, auth, details){
        this.target.loggedOut = false;
        this.target.onLogin(user, auth, details);
        this.fireEvent("login", user, auth, details);
    },

    /** private: method[onLogout]
     *  Listener with actions to be executed when an user makes logout.
     */
    onLogout: function(){
        this.target.loggedOut = true;

        if(this.externalHeaders){
            // clean the authentication and refresh page
            var refreshUrl = window.location.href;
            var geostoreUrl = this.target.initialConfig.geoStoreBase;
            function logout() {
                var xmlhttp;
                if (window.XMLHttpRequest) {
                      xmlhttp = new XMLHttpRequest();
                }
                // code for IE
                else if (window.ActiveXObject) {
                  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (window.ActiveXObject) {
                  // IE clear HTTP Authentication
                  document.execCommand("ClearAuthenticationCache");
                  window.location.href = refreshUrl;
                } else {
                    xmlhttp.open("GET", geostoreUrl, true, "logout", "logout");
                    xmlhttp.send("");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4) {
                            window.location.href= refreshUrl;
                        }
                    }
                }
                return false;
            }
            logout();
        }else{
            this.fireEvent("logout");
        }
    }
});

Ext.preg(mxp.plugins.Login.prototype.ptype, mxp.plugins.Login);