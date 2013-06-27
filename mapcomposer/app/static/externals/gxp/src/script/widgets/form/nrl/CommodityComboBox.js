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
 
Ext.namespace('nrl.form');
nrl.form.CommodityComboBox = Ext.extend(Ext.form.ComboBox,{
	xtype: 'nrl_commoditycombobox',
	anchor:'100%',
	fieldLabel: 'Commodity',
    forceSelection:true,
	typeAhead: true,
    enableKeyEvents: true,
	triggerAction: 'all',
	lazyRender:false,
	mode: 'local',
	autoLoad:true,
	displayField: 'label',
	valueField:'crop',

    setValueAndFireSelect: function(v) {
        this.setValue(v);
        var r = this.findRecord(this.valueField, v);         
        if (!Ext.isEmpty(r)) {
            var index = this.store.indexOf(r);
            this.initSelect = true;
            this.fireEvent("select", this, r, index);
            this.initSelect = false;
        }
    },
	seasonFilter: function(season){
		this.store.filter('season',season,true,true);
	},
    
    initComponent: function() {
        if(this.store){
            this.store.on('load', function(store,records,opt){
                    if (records.length<1) return;
                    var value =this.getStore().getAt(0).get(this.valueField);
                    this.setValueAndFireSelect(value);
                },this);
        }
        
		return nrl.form.CommodityComboBox.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('nrl_commoditycombobox',nrl.form.CommodityComboBox);