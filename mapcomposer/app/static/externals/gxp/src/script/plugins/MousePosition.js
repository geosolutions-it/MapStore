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
 * @author Tobia Di Pisa
 */

/** api: (define)
 *  module = gxp
 *  class = MousePosition
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class::MousePosition(config)
 *   
 *      create a panel to display a MousePosition on the map
 */
gxp.plugins.MousePosition = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_mouseposition */
    ptype: "gxp_mouseposition",
	
	/** api: config[map]
     *  ``OpenLayers.Map`` or :class:`GeoExt.MapPanel`
     *  The map where to show the watermark.
     */
    map: null,
    /**
     *api: config[config]
     * custom configuration to pass to the control
     */
    config:{},
    /**
     *api: config[customCss]
     * custom css to pass to the control
     */
	customCss:"",
	/** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;		
        Ext.apply(this, config);		
		
        gxp.plugins.MousePosition.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
		gxp.plugins.MousePosition.superclass.init.apply(this, arguments);
		this.target = target;
		
		if(!this.map) {
            this.map = this.target.mapPanel.map;
            this.addMousePosition();
        }  
    },
	
    /** private: method[addWatermark]
     *  
     *  Create the map position control and add it to the map.
     */
    addMousePosition: function() {
        var config = this.config;
        //set display code
        if(this.displayProjectionCode){
            config.displayProjection = new OpenLayers.Projection(this.displayProjectionCode);
        }
        config.prefix="<span style=\""+this.customCss+"\">" + (config.prefix || "");
        config.suffix= (config.suffix || "")+ "</span>"
        this.map.addControl(new OpenLayers.Control.MousePosition(config));	
    }
});

Ext.preg(gxp.plugins.MousePosition.prototype.ptype, gxp.plugins.MousePosition);