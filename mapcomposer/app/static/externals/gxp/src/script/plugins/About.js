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
 *  class = About
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: About(config)
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.About = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_about */
    ptype: "gxp_about", 
	
	poweredbyURL: "http://www.geo-solutions.it/about/contacts/",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.About.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
		var poweredByGeoSol = new Ext.Button({
			tooltip: 'Powered by GeoSolutions',
			iconCls: "icon-geosol",
			width : 150,
			scope: this,
			handler: function(btn){
				window.open(this.poweredbyURL, '_blank');
			}
		}); 
			
		var iframe = "<iframe style='border: none; height: 100%; width: 100%' src='about.html' frameborder='0' border='0'>" + 
					 "<a target='_blank' href='about.html'>" + GeoExplorer.prototype.aboutText + "</a> </iframe>";
					 
		var aboutButton = new Ext.Button({
			text: GeoExplorer.prototype.appInfoText,
			iconCls: "icon-geoexplorer",
			handler: function(){
				var appInfo = new Ext.Panel({
					header: false,
					html: iframe
				});

				var win = new Ext.Window({
					title:  GeoExplorer.prototype.aboutThisMapText,
					modal: true,
					layout: "fit",
					width: 360,
					height: 360,
					items: [appInfo]
				});
				
				win.show();
			}
		});
        
        var actions = [poweredByGeoSol, '-', aboutButton];
        return gxp.plugins.About.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.About.prototype.ptype, gxp.plugins.About);
