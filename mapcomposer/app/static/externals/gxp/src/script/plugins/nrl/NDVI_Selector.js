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
 * @author 
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins.ndvi
 *  class = NDVI
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.ndvi");

/** api: constructor
 *  .. class:: NDVI(config)
 *
 *    Plugin for adding NDVI modules to a :class:`gxp.Viewer`.
 */   
gxp.plugins.ndvi.NDVI = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_ndvi */
    ptype: "gxp_ndvi",

    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		
        var target = this.target, me = this;
		
        config = Ext.apply({
			xtype: 'panel',
			id:'mio_pannello',
			border: false,
			split: true,
			deferredRender:true,
            collapseMode: "mini",
			activeItem:0,
			activeTab:0,
			enableTabScroll : true,
            header: false,
            items:[{
                xtype:'form',
                title: 'Select Range',
                layout: "form",
                minWidth:180,
                autoScroll:true,
                frame:true,
                items:[            
                    {
                        xtype: 'datefield',
                        fieldLabel: "Select",
                        anchor:'100%',
                        format: 'm-Y', // or other format you'd like
                        plugins: 'monthPickerPlugin'					
                    }
                    ]
            }],			
			listeners:{
				afterrender: function(tabpanel){
					//set active tab after render
					target.on('ready',function(){
						if(tabpanel.startTab){
							tabpanel.setActiveTab(tabpanel.startTab);
						}else{
							tabpanel.setActiveTab(0);
						}
					});
				}
			}
			
        }, config || {});
        

        var ndvi_Modules = gxp.plugins.ndvi.NDVI.superclass.addOutput.call(this, config);
        
        return ndvi_Modules;
    }
});

Ext.preg(gxp.plugins.ndvi.NDVI.prototype.ptype, gxp.plugins.ndvi.NDVI);
