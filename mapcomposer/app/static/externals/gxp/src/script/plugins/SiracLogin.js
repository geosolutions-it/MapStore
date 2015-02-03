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
 *  class = SiracLogin
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SiracLogin(config)
 *
 *    Plugin for SiracLogin. 
 */
gxp.plugins.SiracLogin = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_sirac_login */
    ptype: "gxp_sirac_login",
    
    /** private: property[logged]
     *  toggle when user login
     */
    logged: false,
	
    /** api: config[loginText]
     *  ``String``
     *  Text for the tool text in login (i18n).
     */
    loginText: "SiRAC Login",
	
    /** api: config[logoutTitle]
     *  ``String``
     *  Text for the tool text in logout (i18n).
     */
    logoutTitle: "Logout from SiRAC",
	
    scale: 'small',
	
	loginAction: null,
	
	logoutAction: null,

    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var apptarget = this.target;
	
		var userInfo = apptarget.userDetails;
		if(userInfo && userInfo.user.attribute){
			if(userInfo.user.attribute instanceof Array){
				for(var i = 0 ; i < userInfo.user.attribute.length ; i++ ){
					if( userInfo.user.attribute[i].name == "UUID"){
						this.logged = true;
					}
				}
			}else if(userInfo.user.attribute && 
					userInfo.user.attribute.name == "UUID"){
			   this.logged = true;
			}
		}
		
		var actions = gxp.plugins.SiracLogin.superclass.addActions.apply(this, [
			[{
				menuText: this.loginText,
				iconCls: "login",
				text: this.loginText,
				disabled: false,
				//hidden: apptarget.userDetails && apptarget.userDetails.user.attribute[1].value,
				hidden: this.logged && (userInfo && userInfo.provider == "sirac"),
				scale: this.scale || 'small',
				tooltip: this.loginText,
				handler: function() {
					document.location.href = 'login';
					this.fireEvent("login", this.user, this.ptype);
				},
				scope: this
			},{
				menuText: this.logoutTitle,
				iconCls: "logout",
				scale: this.scale || 'small',
				text: this.logoutTitle,
				//hidden: !apptarget.userDetails || !apptarget.userDetails.user.attribute[1].value,
				hidden: !(this.logged || (userInfo && userInfo.provider == "sirac")),
				disabled: false,
				tooltip: this.logoutTitle,
				handler: function() {
					document.location.href = 'cleanSession';
					this.fireEvent("logout", this.ptype);
				},
				scope: this
			},{
				xtype: 'tbtext',
				text: userInfo && userInfo.provider == "sirac" && userInfo.user.attribute[0] ? userInfo.user.attribute[0].value : '',
				hidden: !(this.logged || (userInfo && userInfo.provider == "sirac"))
			}]
		]);
		
		this.loginAction = actions[0];
		this.logoutAction = actions[1];
		
		return actions;
    }, 
	
	hideLogin: function(){
		this.loginAction.hide();
	},
	
    showLogin: function(){
		this.loginAction.show();
	}
	
});

Ext.preg(gxp.plugins.SiracLogin.prototype.ptype, gxp.plugins.SiracLogin);