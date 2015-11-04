/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SelDamage
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SelDamage(config)
 *
 *    Plugin for set...
 */   
gxp.plugins.SelDamage = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_damage */
    ptype: "gxp_seldamage",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "seldamage",
    
    
    /** api: config[container]
     *  ``String``
     *  
     */
    container: 'fieldset',
    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.SelDamage.superclass.constructor.apply(this, arguments); 

    },
    
    init: function(target) {
        
        var me=this;
        
        var selDamageArea = new gxp.form.SelDamageArea(Ext.apply({
            map: target.mapPanel.map,
			mapPanel: target.mapPanel,
            id: me.id+"_widget"
        }, this.outputConfig));
        
       
        this.selDamageArea = selDamageArea;
       
   
      
        return gxp.plugins.SelDamage.superclass.init.apply(this, arguments);

    },
    

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        if(this.outputTarget)
            this.show();
    },
    
    
    /** public: method[getAOI]
     *  
     *  return the AOI Widget (Fieldset)   
     */
    getSelDamage: function(){
        return this.selDamageArea;
    },
    
    
    /** public: method[getAOIPanel]
     *  
     *  return the AOI Panel   
     */
    getSelDamagePanel: function(){
        return new Ext.FormPanel({
            border: false,
            layout: "fit",
            id: me.id+"_mainPanel",
            autoScroll: true,
           
            items:[
            this.selDamageArea,		
            ]
        });
    },
    
    
    /** api: method[show]
     *  
     *  
     */
    show: function() {
        
        
        switch (this.container){
            case "fieldset":
                return this.getSelDamage();
                break;
            case "panel":
                return this.getSelDamagePanel();
                break;
        }
        
        return null;
        
    }
   
});

Ext.preg(gxp.plugins.SelDamage.prototype.ptype, gxp.plugins.SelDamage);
