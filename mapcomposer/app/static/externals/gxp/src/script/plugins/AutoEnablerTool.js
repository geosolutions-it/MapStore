/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = QueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AutoEnablerTool(config)
 *
 *   Enables Tools 
 */
gxp.plugins.AutoEnablerTool = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wms_layer_filter */
   ptype: "gxp_autoenabler_tool",
   options:{},
   init: function(target) {
        if(this.options.id){
            target.on("ready",function(){
                var control = Ext.getCmp(this.options.id);
                if(control){
                    control.toggle();
                }
            },this);
        }
        return gxp.plugins.AutoEnablerTool.superclass.init.apply(this, arguments);
   }
    
    
    
    
});

Ext.preg(gxp.plugins.AutoEnablerTool.prototype.ptype, gxp.plugins.AutoEnablerTool);
