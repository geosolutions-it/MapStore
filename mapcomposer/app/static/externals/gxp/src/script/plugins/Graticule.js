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
