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
	typeAhead: true,
    enableKeyEvents: true,
	triggerAction: 'all',
	lazyRender:false,
	mode: 'local',
	autoLoad:true,
	displayField: 'label',
	valueField:'name',
	value:'wheat',
	
	store: new Ext.data.JsonStore({
		data: [
				{name:'wheat',label:'Wheat',season:'RABI'},
				{name:'cotton',label:'Cotton',season:'KHARIF'},
				{name:'sugarcane',label:'Sugarcane',season:'KHARIF'},
				{name:'rice',label:'Rice',season:'KHARIF'},
				{name:'maize',label:'Maize',season:'KHARIF'},
				{name:'fodder',label:'Fodder',season:''}
				
		],
		fields:[
				{name:'name',dataIndex:'name'},
				{name:'label',dataIndex:'label'},
				{name:'season',dataIndex:'season'}
		]
	}),
	seasonFilter: function(season){
		this.store.filter('season',season,true,true);
	}
});
Ext.reg('nrl_commoditycombobox',nrl.form.CommodityComboBox);