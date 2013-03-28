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
 *  class = SliderRanges
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SliderRanges(config)
 *
 *    Plugin for the definition of range values
 */   
gxp.plugins.SliderRanges = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_sliderranges */
    ptype: "gxp_sliderranges",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "sliderranges",
    
    
    /** api: config[container]
     *  ``String``
     *  
     */
    container: 'fieldset',
    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.SliderRanges.superclass.constructor.apply(this, arguments); 

    },
    
    init: function(target) {
        
        var me=this;
        
        this.sliderFieldSet= new Ext.form.FieldSet({
            id: this.id,
            title: this.title,
            items: [new gxp.form.SliderRangesField(this.sliderConf)]
        });
        
       
        if(this.numericField){
            this.sliderFieldSet.items.push(this.getRangeFields()); 
        }
       
   
      
        return gxp.plugins.SliderRanges.superclass.init.apply(this, arguments);

    },
    

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        if(this.outputTarget)
            this.show();
    },
    
    
    /** private: method[getRangeFields]
     *  
     *  return range form fields
     */
    getRangeFields: function(sliderRange){
       
        return new Ext.Component({
            layout: {
                type: 'table',
                columns: 3
            },
            items: [
                new Ext.form.NumberField({
                    id: sliderRange.id+"_minValue",
                    value: 
                }),
                "",
                new Ext.form.NumberField({
                    
                }),
            ]
        });
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
