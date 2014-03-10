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
 *  class = ZoomBox
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Zoom(config)
 *
 *    Provides two actions for zooming in and out.
 */
gxp.plugins.ZoomBox = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_zoombox */
    ptype: "gxp_zoombox",
    
    /** api: config[zoomInMenuText]
     *  ``String``
     *  Text for zoom in menu item (i18n).
     */
    zoomInMenuText: "Zoom Box In",

    /** api: config[zoomOutMenuText]
     *  ``String``
     *  Text for zoom out menu item (i18n).
     */
    zoomOutMenuText: "Zoom Box Out",

    /** api: config[zoomInTooltip]
     *  ``String``
     *  Text for zoom in action tooltip (i18n).
     */
    zoomInTooltip: "Zoom Box In",

    /** api: config[zoomOutTooltip]
     *  ``String``
     *  Text for zoom out action tooltip (i18n).
     */
    zoomOutTooltip: "Zoom Box Out",

    /** api: config[appendZoomIn]
     * ``Boolean``
     * Flag to append zoomIn. Default it's true
     */
    appendZoomIn: true,

    /** api: config[appendZoomOut]
     * ``Boolean``
     * Flag to append zoomOut. Default it's true
     */
    appendZoomOut: true,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.ZoomBox.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
    
        var zoomBoxIn = new OpenLayers.Control.ZoomBox({out:false});        
        var zoomBoxOut = new OpenLayers.Control.ZoomBox({out:true});
        
        if(this.appendZoomIn){
            this.target.mapPanel.map.addControl(zoomBoxIn);   
        }
        if(this.appendZoomOut){
            this.target.mapPanel.map.addControl(zoomBoxOut);
        }
        
        var zoomInButton = new Ext.Button({
            menuText: this.zoomInBoxMenuText,
            iconCls: "gxp-icon-zoombox-in",
            tooltip: this.zoomInTooltip,
            enableToggle: true,
            allowDepress: true,
            toggleGroup: this.toggleGroup,
            listeners: {
                toggle: function(button, pressed) {
                    if(pressed){
                        //zoomOutButton.toggle(false);
                        this.appendZoomOut && zoomBoxOut.deactivate();
                        zoomBoxIn.activate();  
                    }else{
                        zoomBoxIn.deactivate();
                    } 
                }
            },
            scope: this
        });
        
        var zoomOutButton = new Ext.Button({
            menuText: this.zoomOutBoxMenuText,
            iconCls: "gxp-icon-zoombox-out",
            tooltip: this.zoomOutTooltip,
            enableToggle: true,
            allowDepress: true,
            toggleGroup: this.toggleGroup,
            listeners: {
                toggle: function(button, pressed) {
                    if(pressed){
                        //zoomInButton.toggle(false);
                        this.appendZoomIn && zoomBoxIn.deactivate();
                        zoomBoxOut.activate();
                    }else{
                        zoomBoxOut.deactivate();
                    } 
                }
            },
            scope: this
        });

        // make configurable the zoom actions append
        var actions = [];
        this.appendZoomIn && actions.push(zoomInButton);
        this.appendZoomOut && actions.push(zoomOutButton);

        return gxp.plugins.ZoomBox.superclass.addActions.apply(this, [actions]);
    }
  
});

Ext.preg(gxp.plugins.ZoomBox.prototype.ptype, gxp.plugins.ZoomBox);
