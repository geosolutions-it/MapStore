/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.form
 *  class = SliderRangesFieldSet
 *  base_link = `Ext.form.SliderRangesFieldSet <http://extjs.com/deploy/dev/docs/?class=Ext.form.FieldSet>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: SliderRangesFieldSet(config)
 *   

 */
gxp.form.SliderRangesFieldSet = Ext.extend(Ext.form.FieldSet, {

    tip: null,


    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        var me= this;
        var multi=null;
        this.multiSliderConf.plugins = new Ext.slider.Tip({
            getText: function(thumb){
                if(me.numericFields){
                    Ext.getCmp(thumb.id+"_minValue").setValue(thumb.minValue);
                    Ext.getCmp(thumb.id+"_maxValue").setValue(thumb.value);
                    
                    if(thumb.index < multi.thumbs.length-1)
                        Ext.getCmp(multi.thumbs[thumb.index+1].id+"_minValue").setValue(thumb.value+1);
                }
                    
                 return String.format('<b>{2}</b> [<b>{0}</b> , <b>{1}</b>]', thumb.minValue ,thumb.value, thumb.name);
            }
        });
        this.multiSlider= new gxp.form.SliderRangesField(this.multiSliderConf);
        multi=this.multiSlider;
        
        
        this.autoHeight= true;
        this.layout='table';
        this.layoutConfig= {
            columns: 3
        };
        this.items = [];
        
     
        
        this.items.push({
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 3,
                    items: [this.multiSlider]
                });
        if(this.numericFields){
            var minValue,maxValue, id, rangeName, index;
            var mindis= false, maxdis=false;
            var thumbs=this.multiSlider.thumbs;
            for(var i=0; i< thumbs.length; i++){
                mindis= (i==0) ? true: false;
               // maxdis= (i==thumbs.length-1) ? true: false;
                id=thumbs[i].id;
                index=thumbs[i].index;
                minValue=thumbs[i].minValue;
                maxValue=thumbs[i].maxValue;
                rangeName=thumbs[i].name;
                
                this.items.push({
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 1,
                    items: [
                    new Ext.form.NumberField({
                        width: 80,
                        disabled: mindis,
                        id: id+"_minValue",
                        value: minValue,
                        minValue: multi.minValue,
                        maxValue: multi.maxValue,
                        listeners:{
                            "change": function(it, newValue){
                                
                                multi.setValue(index-1, newValue, true); 
                            }
                        }
                    })]
                });
                    
                this.items.push({
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 1,
                    items: [{
                       xtype: "label",     
                      // cls: 'x-form-item-label',
                       text: rangeName       
                    }]
                    
                });
                    
                this.items.push({
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 1,
                    items: [
                    new Ext.form.NumberField({
                        width: 80,
                        disabled: maxdis,
                        id: id+"_maxValue",
                        value: maxValue,
                        minValue: multi.minValue,
                        maxValue: multi.maxValue,
                        listeners:{
                            "change": function(it, newValue){
                                //alert(index);
                                multi.setValue(index, newValue, true); 
                                if(index < multi.thumbs.length-1)
                                Ext.getCmp(multi.thumbs[index+1].id+"_minValue").setValue(newValue+1);
                            }
                        }
                    })]
                });
            }
                       
        }
        
        gxp.form.SliderRangesFieldSet.superclass.initComponent.call(this);
    }
});

Ext.reg("gxp_sliderrangesfieldset", gxp.form.SliderRangesFieldSet);
