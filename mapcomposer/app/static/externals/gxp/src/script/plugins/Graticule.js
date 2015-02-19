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
 *  class = Graticule
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Graticule(config)
 *
 *    Provides graticule on the map.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.Graticule = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_graticule */
    ptype: "gxp_graticule",
    
    /** api: config[graticuleMenuText]
     *  ``String``
     *  Text for Graticule menu item (i18n).
     */
    graticuleMenuText: "Graticule",

    /** api: config[graticuleTooltip]
     *  ``String``
     *  Text for Graticule action tooltip (i18n).
     */
    graticuleTooltip: "Graticule",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.ZoomBox.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
    
	    var graticule = new OpenLayers.Control.Graticule({ 
			  //targetSize: 600,
			  displayInLayerSwitcher: false,
			  labelled: true, 
			  visible: true                  
		});
		 
		graticule.labelSymbolizer.fontColor = '#45F760';   
		graticule.lineSymbolizer.strokeColor = "#45F760";  
        
        var graticuleButton = new Ext.Button({
            menuText: this.graticuleMenuText,
            iconCls: "gxp-icon-graticule",
            tooltip: this.graticuleTooltip,
            enableToggle: true,
            allowDepress: true,
            listeners: {
			    scope: this,
                toggle: function(button, pressed) {
                    if(pressed){
					    var ctrl = this.target.mapPanel.map.getControlsByClass("OpenLayers.Control.Graticule");
					    if(ctrl < 1)
							this.target.mapPanel.map.addControl(graticule); 
						
						graticule.activate();  
                    }else{
                        graticule.deactivate();
                    } 
                }
            }
        });
        
        var actions = ['-',graticuleButton];
        return gxp.plugins.Graticule.superclass.addActions.apply(this, [actions]);
    }
});

Ext.preg(gxp.plugins.Graticule.prototype.ptype, gxp.plugins.Graticule);
