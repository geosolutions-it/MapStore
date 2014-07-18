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
	
    scale: 'small',
	
	loginAction: null,
	
	logoutAction: null,

    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var apptarget = this.target;
	
		var actions = gxp.plugins.SiracLogin.superclass.addActions.apply(this, [
			[{
				menuText: this.loginText,
				iconCls: "login",
				text: this.loginText,
				disabled: false,
				hidden: apptarget.userDetails && apptarget.userDetails.user.attribute[1].value,
				scale: this.scale || 'small',
				tooltip: this.loginText,
				handler: function() {
					document.location.href='login';
				},
				scope: this
			},{
				menuText: this.logoutTitle,
				iconCls: "logout",
				scale: this.scale || 'small',
				text: this.logoutTitle,
				hidden: !apptarget.userDetails || !apptarget.userDetails.user.attribute[1].value,
				
				disabled: false,
				tooltip: this.logoutTitle,
				handler: function() {
					document.location.href='cleanSession';
				},
				scope: this
			},{
				xtype: 'tbtext',
				text: apptarget.userDetails ? apptarget.userDetails.user.attribute[0].value : '',
				hidden: !apptarget.userDetails || !apptarget.userDetails.user.attribute[1].value
			}]
		]);
		
		this.loginAction = actions[0];
		this.logoutAction= actions[1];
		
		return actions;
    }
    
        
});

Ext.preg(gxp.plugins.SiracLogin.prototype.ptype, gxp.plugins.SiracLogin);