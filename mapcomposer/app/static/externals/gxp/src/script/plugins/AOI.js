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
 *  class = AOI
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AOI(config)
 *
 *    Plugin for set the  Area Of Interest on the map
 */   
gxp.plugins.AOI = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_aoi */
    ptype: "gxp_aoi",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "aoi",
    
    
    /** api: config[container]
     *  ``String``
     *  
     */
    container: 'fieldset',
    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.AOI.superclass.constructor.apply(this, arguments); 

    },
    
    init: function(target) {
        
        var me=this;
        
        var aoiFielset = new gxp.form.AOIFieldset(Ext.apply({
            map: target.mapPanel.map,
            id: me.id+"_widget"
        }, this.outputConfig));
        
       
        this.aoiFielset = aoiFielset;
       
   
      
        return gxp.plugins.AOI.superclass.init.apply(this, arguments);

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
    getAOI: function(){
        return this.aoiFielset;
    },
    
    
    /** public: method[getAOIPanel]
     *  
     *  return the AOI Panel   
     */
    getAOIPanel: function(){
        return new Ext.FormPanel({
            border: false,
            layout: "fit",
            id: me.id+"_mainPanel",
            autoScroll: true,
           
            items:[
            this.aoiFielset,		
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
                return this.getAOI();
                break;
            case "panel":
                return this.getAOIPanel();
                break;
        }
        
        return null;
        
    }
   
});

Ext.preg(gxp.plugins.AOI.prototype.ptype, gxp.plugins.AOI);
