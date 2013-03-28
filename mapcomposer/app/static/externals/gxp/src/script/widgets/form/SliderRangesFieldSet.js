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
        this.multiSlider= new gxp.form.SliderRangesField(this.multiSliderConf);
       
        var me= this;
        
        this.autoHeight= true;
        this.layout='table';
        this.layoutConfig= {
            columns: 1
        };
        this.items = [];
        
        this.multiSlider.plugins = new Ext.slider.Tip({
            getText: function(thumb){
                var rangeMin;
                 
                if(thumb.index == 0)
                    rangeMin= me.multiSlider.minValue;
                else
                    rangeMin= me.multiSlider.thumbs[thumb.index-1].value+1;
                    
                if(me.numericField){
                    Ext.getCmp(thumb.id+"_min").setValue(rangeMin);
                    Ext.getCmp(thumb.id+"_max").setValue(thumb.value);
                }
                    
                return String.format('Range <b>{2}</b> {<b>{0}</b> - <b>{1}</b>}', rangeMin ,thumb.value, thumb.name);
            }
        });
        
        this.items.push(this.multiSlider);
        if(this.numericFields){
            alert("numericField");
            var minValue,maxValue, id;
            var thumbs=this.multiSlider.thumbs;
            alert(thumbs.length);
            for(var i=0; i< thumbs.length; i++){
                alert(thumbs[i].id);
                id=thumbs[i].id;
                minValue=thumbs[i].minValue;
                maxValue=thumbs[i].maxValue;
                
                this.items.push(
                /* new Ext.Component({
                        layout: {
                            type: 'table',
                            columns: 3
                        },
                        items: [
                        new Ext.form.NumberField({
                            id: id+"_minValue",
                            value: minValue
                        }),
                        new Ext.Component({
                        html: "<a href='#'>TEST</a>"
                        }),*/
                    {
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 1,
                    items: [
                    new Ext.form.NumberField({
                        id: id+"_maxValue",
                        value: maxValue
                    })]
                    }
                /*]
                    })*/
                );
            }
                       
        }
        
        gxp.form.SliderRangesFieldSet.superclass.initComponent.call(this);
    }
});

Ext.reg("gxp_sliderrangesfieldset", gxp.form.SliderRangesFieldSet);
