/**
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
 *  class = Privacy
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Privacy(config)
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.Privacy = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_privacy */
    ptype: "gxp_privacy", 
	
	privacyURL: "http://www.comune.genova.it/content/note-legali-e-privacy",
	
	maximizedOnShow: false,
	
	windowTitle: "Legge sulla Privacy",
	
	buttonText: "Privacy",
	
	buttonTooltip: "Note sulla Privacy",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Privacy.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
		var iframe = "<iframe style='border: none; height: 100%; width: 100%' src='" + this.privacyURL + "' frameborder='0' border='0' />";
					 
		var privacyButton = new Ext.Button({
			text: this.buttonText,
			tooltip: this.buttonTooltip,
			iconCls: "icon-privacy",
			scope: this,
			handler: function(){
				var appInfo = new Ext.Panel({
					header: false,
					html: iframe
				});

				var win = new Ext.Window({
					title:  this.windowTitle,
					modal: true,
					maximizable: true,
					maximized: this.maximizedOnShow,
					layout: "fit",
					width: 1000,
					height: 600,
					items: [appInfo]
				});
				
				win.show();
			}
		});
        
        var actions = ["->", privacyButton];
        return gxp.plugins.Privacy.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.Privacy.prototype.ptype, gxp.plugins.Privacy);
