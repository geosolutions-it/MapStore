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
    
	numericFields: false,
	
	labels: false,

	multiSliderConf: {},
	
	tipFormat: '<b>{2}</b> [<b>{0}</b> , <b>{1}</b>]',
	
	labelsTpl: [
		'<tpl for="ranges">',
			'<tpl if="xindex === 1">',
				'{name}: {parent.minValue} - {[parent.thumbs[xindex-1].value]}',
			'</tpl>',
			'<tpl if="xindex !== 1 &amp;&amp; xindex !== xcount">',
				', {name}: {[parent.thumbs[xindex-2].value]} - {[parent.thumbs[xindex-1].value]}',
			'</tpl>',
			'<tpl if="xindex === xcount">',
				', {name}: {[parent.thumbs[xindex-2].value]} - {parent.maxValue}',
			'</tpl>',
		'</tpl>'
		
	],

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        var me= this;
        var multi=null;
        
        this.multiSliderConf.id= this.id+"_multislider";
        
      
        this.multiSliderConf.plugins = new Ext.slider.Tip({
            getText: function(thumb){                
                 return String.format(me.tipFormat, thumb.minValue ,thumb.value, thumb.name);
            }
        });
		
        this.multiSlider= new gxp.form.SliderRangesField(this.multiSliderConf);
		this.multiSlider.on('change', function(slider, value, thumb) {
			if(this.numericFields){
				Ext.getCmp(thumb.id+"_minValue").setValue(thumb.minValue);
				Ext.getCmp(thumb.id+"_maxValue").setValue(thumb.value);
				
				if(thumb.index < multi.thumbs.length-1) {
					Ext.getCmp(multi.thumbs[thumb.index+1].id+"_minValue").setValue(thumb.value+1);
                }
			}
			if(this.labels) {
				Ext.getCmp(this.id+'_labels').setValue(this.labelsTpl.apply(this.multiSlider));
			}
            if(thumb.index < multi.thumbs.length-1) {
                multi.thumbs[thumb.index+1].minValue = value;
            }
			this.fireEvent('change', this, value, thumb.id);
		}, this);
        multi=this.multiSlider;
        
		this.labelsTpl = new Ext.XTemplate(this.labelsTpl, {compiled: true});
        
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
		this.configureNumericFields();
		this.configureLabels();        
        
        gxp.form.SliderRangesFieldSet.superclass.initComponent.call(this);
    },
	
	configureLabels: function() {
		if(this.labels) {
			this.items.push({
				layout: "form",
				labelAlign: "top",
				cellCls: 'multislider-label',
				border: false,
				colspan: 1,
				items: [
				new Ext.form.DisplayField({
					id: this.id+"_labels",
					value: this.labelsTpl.apply(this.multiSlider, {compiled: true})
				})]
			});
		}
	},
	
	configureNumericFields: function() {
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
	}
});

Ext.reg("gxp_sliderrangesfieldset", gxp.form.SliderRangesFieldSet);
