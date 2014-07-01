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
        window.onbeforeunload = function(e) {
          if(me.target.modified){
            return me.alertMessage;
          }
        };

        gxp.plugins.OnBeforeUnloadAlert.superclass.constructor.apply(this, arguments);
    }  
});

Ext.preg(gxp.plugins.OnBeforeUnloadAlert.prototype.ptype, gxp.plugins.OnBeforeUnloadAlert);
