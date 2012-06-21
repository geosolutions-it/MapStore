/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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
        
        this.target.mapPanel.map.addControl(zoomBoxIn);
        this.target.mapPanel.map.addControl(zoomBoxOut);
        
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
                        zoomBoxOut.deactivate();
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
                        zoomBoxIn.deactivate();
                        zoomBoxOut.activate();
                    }else{
                        zoomBoxOut.deactivate();
                    } 
                }
            },
            scope: this
        });
        
        var actions = [zoomInButton, zoomOutButton];
        return gxp.plugins.ZoomBox.superclass.addActions.apply(this, [actions]);
    }
  
});

Ext.preg(gxp.plugins.ZoomBox.prototype.ptype, gxp.plugins.ZoomBox);
