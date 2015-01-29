/*
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
 *  class = LoginMenu
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LoginMenu(config)
 *
 *    Plugin for LoginMenu. 
 */
gxp.plugins.LoginMenu = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_login_menu */
    ptype: "gxp_login_menu",
    
    /** private: property[logged]
     *  toggle when user login
     */
    logged: false,
	
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
	
	/** api: config[defaultToolType]
     *  ``String``
     *  The default tool plugin type. Default is "gxp_tool"
     */
    defaultToolType: "gxp_tool",
	
	/** api: config[loginConfig]
     * ``Object``
     * Login plugins configurations.
     */
    loginConfig:{
        default_login: {
            ptype : 'gxp_geostore_login',
			actionTarget: "login_menu.menu",
			loginText: "MapStore Login"
        }
    },
	
    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var apptarget = this.target;
		
		// /////////////////////////////////////////////
	    // Initialize Login Tools from configuration
		// /////////////////////////////////////////////
		var items = [];
		if(this.loginConfig){
			for (var key in this.loginConfig){
				var lgConfig = this.loginConfig[key];				
				
				var plugin = Ext.ComponentMgr.createPlugin(
					lgConfig, this.defaultToolType
				);				
				plugin.init(apptarget);
				
				items.push(plugin);
			}	
		}
		
		this.button = new Ext.SplitButton({
            iconCls: "login",
			id: "login_menu",
			text: this.loginText,
            tooltip: this.loginText,
            allowDepress: true,
			// //////////////////////////////////////////////
			// If we open the map from the manager the login 
			// button should not be visible
			// //////////////////////////////////////////////
			hidden: apptarget.auth, 
            handler: function(button, event) {
				this.button.showMenu();
            },
            scope: this,
            menu: new Ext.menu.Menu({
                items: []
            })
        });
		
		for(var i=0; i<items.length; i++){
			items[i].addActions();
			
			items[i].on("login", function(user, ptype){
				this.button.setText(this.logoutTitle + " - " + user.name);
				this.button.setIconClass("logout");
				for(var j=0; j<items.length; j++){
					var plugin = items[j];
					if(plugin.ptype != ptype){
						plugin.hideLogin();
					}
				}
			}, this);
			
			items[i].on("logout", function(ptype){
				this.button.setText(this.loginText);
				this.button.setIconClass("login");
				for(var j=0; j<items.length; j++){
					var plugin = items[j];
					if(plugin.ptype != ptype){
						plugin.showLogin();
					}
				}
			}, this);
		}		
		
		var actions = gxp.plugins.LoginMenu.superclass.addActions.call(this, [this.button]);
    }   
        
});

Ext.preg(gxp.plugins.LoginMenu.prototype.ptype, gxp.plugins.LoginMenu);