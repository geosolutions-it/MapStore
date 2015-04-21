/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @author Lorenzo Natali
 */

Ext.ux.YearRangeSelector = Ext.extend(Ext.form.CompositeField,{
	xtype: 'yearrangeselector',
	minValue: 1992,
	maxValue: 2012,
	values:[1992,2012],
	increment:1,
	//sliderWidth:100,
	events:['change'],
	setMaxValue: function(value){
		var endValue = this.slider.thumbs[1].value;
		var startValue = this.slider.thumbs[0].value;
        var changed = false;
		if(value < endValue){
			//this.slider.setValue(1,value,true);
			this.endValue.setValue(value);
             var changed = true;
		}
		if(value < startValue){
			//this.slider.setValue(1,value,true);
			this.startValue.setValue(value);
             var changed = true;
		}
		this.slider.setMaxValue(value);
		this.startValue.setMaxValue(value);
		this.endValue.setMaxValue(value);
		if(changed){
            endValue = this.slider.thumbs[1].value;
            startValue = this.slider.thumbs[0].value;
            this.fireEvent('change',startValue,endValue);
        }
		
	},
	setMinValue: function(value){
		var endValue = this.slider.thumbs[1].value;
		var startValue = this.slider.thumbs[0].value;
        var changed = false;
		if(value > endValue){
			//this.slider.setValue(1,value,true);
			this.endValue.setValue(value);
            var changed = true;
		}
		if(value > startValue){
			//this.slider.setValue(1,value,true);
			this.startValue.setValue(value);
            var changed = true;
		}
		this.slider.setMinValue(value);
		this.startValue.setMinValue(value);
		this.endValue.setMinValue(value);
        if(changed){
            endValue = this.slider.thumbs[1].value;
            startValue = this.slider.thumbs[0].value;
            this.fireEvent('change',startValue,endValue);
        }
		
	},
	valid: function(){
		this.slider.valid();
		this.startValue.valid();
		this.endValue.valid();
	},
	initComponent:function(){
		this.addEvents('change');
		
		var slider  = new Ext.slider.MultiSlider({
				flex:1,
				fieldLabel:'Range',
				width:this.sliderWidth,
				ref:'slider',
				minValue: this.minValue,
				maxValue: this.maxValue,
				increment:this.increment,
				values  : this.values,
				plugins:new Ext.slider.Tip(),
				listeners:{
					change: function(slider){
						var startVal = slider.thumbs[0].value;
						var endVal =slider.thumbs[1].value
						slider.refOwner.startValue.setValue(startVal);
						slider.refOwner.endValue.setValue(endVal);
						this.fireEvent('change',startVal,endVal);
						
					},
					scope:this
				}
		});
		this.items=[
			{xtype:'numberfield',width:36,value:this.values[0],name:'startYear',ref:'startValue',minValue: this.minValue, maxValue: this.maxValue,enableKeyEvents:true,//TODO smarter validation
				listeners:{
					keyPress: function(e){
						if(e.isValid()) { 
							slider.setValue(0,e.getValue(),true);
						}
					},
					 blur:function(e){
						if(e.isValid()) { 
							slider.setValue(0,e.getValue(),true);
						}
					}
				}
			},
			slider,
			{xtype:'numberfield',width:36,value:this.values[1],name:'endYear',ref:'endValue',minValue: this.minValue, maxValue: this.maxValue,enableKeyEvents:true,
			listeners:{
					keyPress: function(e){
						if(e.isValid()) { 
							slider.setValue(1,e.getValue(),true);
						}
					},
					blur:  function(e){
						if(e.isValid()) { 
							slider.setValue(1,e.getValue(),true);
						}
					}
				}
			}
		]
		return Ext.ux.YearRangeSelector.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('yearrangeselector',Ext.ux.YearRangeSelector);


/**
 * MounthYearRangeSelector select a month
 * @author Lorenzo Natali
 *
 * new config:
 * noCrossYear `Boolean` if true it's possible to select a month range
 *   in the same year.
 * @author Mirco Bertelli
 */
Ext.ux.MonthYearRangeSelector = Ext.extend(Ext.form.CompositeField,{
	xtype: 'monthyearrangeselector',
	minValue: 0,
	maxValue: 23,
	values:[0,23],
	increment:1,
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	//sliderWidth:100,
	events:['change'],
	setMaxValue: function(value){
		var endValue = this.slider.thumbs[1].value;
		var startValue = this.slider.thumbs[0].value;
        var changed = false;
		if(value < endValue){
			//this.slider.setValue(1,value,true);
			this.endValue.setValue(value);
             var changed = true;
		}
		if(value < startValue){
			//this.slider.setValue(1,value,true);
			this.startValue.setValue(value);
             var changed = true;
		}
		this.slider.setMaxValue(value);
		if(changed){
            endValue = this.slider.thumbs[1].value;
            startValue = this.slider.thumbs[0].value;
            this.fireEvent('change',startValue,endValue);
        }
		
	},
	setMinValue: function(value){
		var endValue = this.slider.thumbs[1].value;
		var startValue = this.slider.thumbs[0].value;
        var changed = false;
		if(value > endValue){
			//this.slider.setValue(1,value,true);
			this.endValue.setValue(value);
            var changed = true;
		}
		if(value > startValue){
			//this.slider.setValue(1,value,true);
			this.startValue.setValue(this.getMonthValue(value));
            var changed = true;
		}
		this.slider.setMinValue(value);
        if(changed){
            endValue = this.slider.thumbs[1].value;
            startValue = this.slider.thumbs[0].value;
            this.fireEvent('change',startValue,endValue);
        }
		
	},
     getMonthValue: function(value){
        return this.months[value%12];
    },
	valid: function(){
		this.slider.valid();
		this.startValue.valid();
		this.endValue.valid();
	},
	initComponent:function(){
		this.addEvents('change');
        var me = this;
		var tipText = function(thumb){
                return me.getMonthValue(thumb.value);
        };
        if (me.noCrossYear){
            this.maxValue = 11;
            this.values[1] = 11;
        }
		var slider  = new Ext.slider.MultiSlider({
				flex:1,
				fieldLabel:'Range',
				width:this.sliderWidth,
                constrainThumbs: true,
				ref: 'slider',
				//increment:this.increment,
                maxValue: this.maxValue,
                minValue: this.minValue,
				values  : this.values,
				plugins:new Ext.slider.Tip({
                    getText: tipText
                }),
				listeners:{
					change: function( slider, newValue, thumb){
						var startVal = slider.thumbs[0].value;
						var endVal =slider.thumbs[1].value;
                        //avoid size >12 month 
                        var diff = endVal - startVal;
                        if (diff > 11){
                            var index = thumb.index;
                            if( index === 0 ){
                                me.setValue(1,startVal + 11,true );
                            }else{
                                me.setValue(0,endVal - 11,true );
                            }
                            return;
                        //not empty interval
                        } else if (diff < 0){   
                            var index = thumb.index;
                            if( index === 0 ){
                                me.setValue(1,startVal ,true );
                            }else{
                                me.setValue(0,endVal ,true );
                            }
                            
                        
                        }
						slider.refOwner.startValue.setValue(this.getMonthValue(startVal));
						slider.refOwner.endValue.setValue(this.getMonthValue(endVal));
						this.fireEvent('change',startVal,endVal);
						
					},
					scope:this
				}
		});
		this.items=[
			{xtype:'textfield',
             readOnly:true,
             width:36,
             value:this.getMonthValue(this.values[0]),
             name:'startmonth',
             ref:'startValue'
				
			},
			slider,
            {xtype:'textfield',
             readOnly:true,
             width:36,
             value:this.getMonthValue(this.values[1]),
             name:'endmonth',
             ref:'endValue'
            }
        ];
		return Ext.ux.MonthYearRangeSelector.superclass.initComponent.apply(this, arguments);
	},
    setValue: function(start,end,animate){
        var slider = this.slider;
        slider.setValue(start,end,true);
        var startVal = slider.thumbs[0].value;
        var endVal =slider.thumbs[1].value
        slider.refOwner.startValue.setValue(this.getMonthValue(startVal));
        slider.refOwner.endValue.setValue(this.getMonthValue(endVal));
        this.fireEvent('change',startVal,endVal);
    }
});
Ext.reg('monthyearrangeselector',Ext.ux.MonthYearRangeSelector);