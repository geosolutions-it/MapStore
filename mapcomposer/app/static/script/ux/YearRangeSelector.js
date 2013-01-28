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
	sliderWidth:80,
	events:['change'],
	initComponent:function(){
		this.addEvents('change');
		
		var slider  = new Ext.slider.MultiSlider({
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
			{xtype:'numberfield',width:36,value:this.values[0],ref:'startValue',minValue: this.minValue, maxValue: this.maxValue,enableKeyEvents:true,//TODO smarter validation
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
			{xtype:'numberfield',width:36,value:this.values[1],ref:'endValue',minValue: this.minValue, maxValue: this.maxValue,enableKeyEvents:true,
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