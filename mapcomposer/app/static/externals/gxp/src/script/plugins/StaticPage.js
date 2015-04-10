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
 *  class = StaticPage
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: StaticPage(config)
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */ 
gxp.plugins.StaticPage = Ext.extend(gxp.plugins.Tool, {

    ptype:'gxp_staticpage',

	tabTitle: "Static Page",
	
	url: null,
	
	tabPosition: 0,
	
    /** api: method[addOutput]
     */
    addOutput: function(config) {
		var page_url = this.url;		
		var appTabs = Ext.getCmp(this.target.renderToTab);
		
		if(appTabs instanceof Ext.TabPanel && page_url){					
			this.staticPanel = new Ext.Panel({
				id: 'staticPanel',
				title: this.tabTitle,
				layout: 'fit', 
				items: [ 
					new Ext.ux.IFrameComponent({ 
						id: 'static-panel',
						url: page_url 
					}) 
				]
			});
	
			appTabs.insert(this.tabPosition, this.staticPanel);
		}else{
			Ext.Msg.show({
				title: "Static Page Plugin",
				msg: "The 'StaticPage' plugin cannot be enabled because you're not in 'tab' mode ('tab: true' in configuration) or the URL is not available.",
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox.INFO  
			});	
		}

        return gxp.plugins.StaticPage.superclass.addOutput.apply(this, []);
    } 
});

Ext.preg(gxp.plugins.StaticPage.prototype.ptype, gxp.plugins.StaticPage);