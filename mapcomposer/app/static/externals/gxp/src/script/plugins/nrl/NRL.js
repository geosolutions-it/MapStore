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
 * @author Lorenzo Natali
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins.nrl
 *  class = NRL
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: NRL(config)
 *
 *    Plugin for adding NRL modules to a :class:`gxp.Viewer`.
 */   
gxp.plugins.nrl.NRL = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_nrl */
    ptype: "gxp_nrl",

    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		
        var target = this.target, me = this;
		
        config = Ext.apply({
			xtype: 'tabpanel',
			id:'modulewrapper',
			border: false,
			split: true,
			deferredRender:true,
            collapseMode: "mini",
			activeItem:0,
			activeTab:0,
			enableTabScroll : true,
            header: false,
			
			listeners:{
				afterrender: function(tabpanel){
					//set active tab after render
					app.on('ready',function(){
						if(tabpanel.startTab){
							tabpanel.setActiveTab(tabpanel.startTab);
						}else{
							tabpanel.setActiveTab(0);
						}
					});
				}
			}
			
        }, config || {});
        

        var nrl_Modules = gxp.plugins.nrl.NRL.superclass.addOutput.call(this, config);
        
        return nrl_Modules;
    }
});

Ext.preg(gxp.plugins.nrl.NRL.prototype.ptype, gxp.plugins.nrl.NRL);
