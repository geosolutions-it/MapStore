/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 *  class = OnBeforeUnloadAlert
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: OnBeforeUnloadAlert(config)
 *
 *    This tool check if the page is modified and show an alert with a message,
 *    before leaving.
 *    It checks the modified flag in the target
 *	  modified: the modified flag
 *    safeLeaving: if set, the application is allowed to leave page without alert
 */   
gxp.plugins.OnBeforeUnloadAlert = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_enablelabel */
    ptype: "gxp_onpageunloadalert",
    
    /** api: config[alertMessage]
     * the message to show (should be localized
     */
    alertMessage: "Leaving or reloading this page will cause the loss of all the selections and filters applied.",

    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
    },
     constructor: function(config) {
        this.initialConfig = config || {};
        this.active = false;
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        this.output = [];
        var me = this;
		
		// IE9 IE10 and IE11 sometimes call it twice
		// so we have to set a flag to avoid multiple calls
		// and prompt just once
		var promptBeforeLeaving = true,
		alreadPrompted = false,
		timeoutID = 0,
		reset = function () {
			alreadPrompted = false;
			timeoutID = 0;
		};
        window.onbeforeunload = function(e) {
			//SafeLeaving is a variable that GeoStoreLogin plugin have to set to 
			//notify the user confirmed page leaving 
			if (promptBeforeLeaving && !alreadPrompted) {
				alreadPrompted = true;
				timeoutID = setTimeout(reset, 2000);
				if(me.target.modified && !me.target.safeLeaving){
				//reset safeLeaving anyway
				if (me.target.safeLeaving){
					me.target.safeLeaving =false;
				}
				return me.alertMessage;
			  }else if (me.target.safeLeaving){
				me.target.safeLeaving =false;
			  }
			}
          
        };

        gxp.plugins.OnBeforeUnloadAlert.superclass.constructor.apply(this, arguments);
    }  
});

Ext.preg(gxp.plugins.OnBeforeUnloadAlert.prototype.ptype, gxp.plugins.OnBeforeUnloadAlert);
