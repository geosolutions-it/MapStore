/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.form
 *  class = SliderRangesField
 *  base_link = `Ext.form.Field <http://extjs.com/deploy/dev/docs/?class=Ext.form.TextArea>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: SliderRangesField(config)
 *   

 */
gxp.form.SliderRangesField = Ext.extend(Ext.slider.MultiSlider, {

    tip: null,

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {

        if(! this.plugins)
            this.plugins = new Ext.slider.Tip({
                getText: function(thumb){
                    return String.format('Range <b>{2}</b> {<b>{0}</b> - <b>{1}</b>}', thumb.minValue ,thumb.value, thumb.name);
                }
            });
       
        
        
        
         this.thumbs=new Array();
         
         if(this.ranges) {
			 for(var i=0; i<this.ranges.length-1; i++){
				 this.addThumb(this.ranges[i]);
			 }
        }

         this.values= null;
    },
    
    
    /** public: method[addThumb]
     *  Override
     */
    addThumb: function(thumbConf) {
        
        var multiSlider= this;
        
        if(this.thumbs.length == 0)
           thumbConf.minValue= multiSlider.minValue;
        else
           thumbConf.minValue= multiSlider.thumbs[this.thumbs.length-1].maxValue+1;
         
        thumbConf.value= thumbConf.maxValue;
        
        var thumb = new Ext.slider.Thumb(Ext.apply({
            slider   : this,
            index    : this.thumbs.length,
            constrain: this.constrainThumbs
        }, thumbConf));               
        
        this.thumbs.push(thumb);

        
        if (this.rendered) thumb.render();
    }
    
   
    
});

Ext.reg("gxp_sliderrangesfield", gxp.form.SliderRangesField);
