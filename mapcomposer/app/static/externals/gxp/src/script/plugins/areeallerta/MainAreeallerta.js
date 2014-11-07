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

/**
 * @author Riccardo Mari
 */
 
/** api: (define)
 *  module = gxp.plugins.areeallerta
 *  class = MainAreeallerta
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.areeallerta");

/** api: constructor
 *  .. class:: MainAreeallerta(config)
 *
 *    Plugin for adding MainAreeallerta modules to a :class:`gxp.Viewer`.
 */   
gxp.plugins.areeallerta.MainAreeallerta = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_mainareeallerta */
    ptype: "gxp_mainareeallerta",

    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
		
        var target = this.target, me = this;
		
        config = Ext.apply({
			xtype: 'tabpanel',
			id:'mainAreeallertaWrapper',
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
        

        var mainAreeallerta = gxp.plugins.areeallerta.MainAreeallerta.superclass.addOutput.call(this, config);
        
        return mainAreeallerta;
    },
    enableData: function(){
        var areeallertaTab = this.output[0].items;
        for (var i = 0; i<areeallertaTab.items.length;i++){
            if (areeallertaTab.items[i].outputType.items.items){
                areeallertaTab.items[i].outputType.items.items[0].enable();
            }else{
                areeallertaTab.items[i].outputType.items[0].disabled = false;
            }
        }
    },
    disableData: function(){
        var areeallertaTab = this.output[0].items;
        for (var i = 0; i<areeallertaTab.items.length;i++){
            if (areeallertaTab.items[i].outputType.items.items){
                areeallertaTab.items[i].outputType.items.items[0].disable();
                areeallertaTab.items[i].outputType.items.items[1].setValue("chart");                
            }else{
                areeallertaTab.items[i].outputType.items[0].disabled = true;
                areeallertaTab.items[i].outputType.items[0].inputValue = "chart";
            }
        }
    }
});

Ext.preg(gxp.plugins.areeallerta.MainAreeallerta.prototype.ptype, gxp.plugins.areeallerta.MainAreeallerta);
