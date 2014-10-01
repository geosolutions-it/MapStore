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
 
Ext.ux.SingleYearComboBox = Ext.extend(Ext.form.ComboBox,{
	xtype: 'singleyearcombobox',
	fieldLabel: 'Year',
	typeAhead: true,
	triggerAction: 'all',
	lazyRender:false,
	mode: 'local',
	autoLoad:true,
	displayField:'year',
	valueField:'year',
	store:new Ext.data.ArrayStore({
		data: [
				[2000],[2001],[2002],[2003],[2004],[2005],[2006],[2006],[2007],[2008],[2009],[2010],[2011],[2012]//TODO externalize data
				
		],
		fields:[{name:'year',dataIndex:0}]
		
	}),
    //private: fixes expand when load data
	onLoad: function(){
		Ext.ux.SingleYearComboBox.superclass.onLoad.call(this);
        this.hasFocus = this.isReloading ? this.previousFocusValue : this.hasFocus;
        this.isReloading = false;
	},
    setRange:function(start,end){
        var data = [];
        var currentValue= this.getValue();
        if(!currentValue)currentValue=end;
        if(currentValue >end){
            currentValue = end;
        }
        if (currentValue < start){
            currentValue = start;
        }
        this.setValue(currentValue);
        for(var i = start;i<=end ; i++){
            data.push([i]);
        }
        // fixes expand when load data
        this.isReloading = true;
        this.previousFocusValue = this.hasFocus;
        this.hasFocus = false;
        this.getStore().loadData(data);
    }
});

Ext.reg( 'singleyearcombobox',Ext.ux.SingleYearComboBox);