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

/**
 * @requires widgets/SelectFeatureGrid.js
 */

Ext.namespace('nrl.form');
nrl.form.AOIFieldSet = Ext.extend(Ext.form.FieldSet,
{
	xtype: 'nrl_aoifieldset',
	anchor:'100%',
	title: 'Area of interest',
	
	initComponent: function() {
		this.items = [
			{ 
				fieldLabel: 'Type',
				xtype: 'radiogroup',
				autoHeight:true,
				checkboxToggle:true,
				title: this.outputTypeText,
				defaultType: 'radio', // each item will be a radio button
				items:[
					{boxLabel: 'Province' , name: 'areatype', inputValue: 'PROVINCE' , checked: true},
					{boxLabel: 'District', name: 'areatype', inputValue: 'DISTRICT'}
				],
				listeners: {
					change: function(cbg,checkedarray){
						var as = this.ownerCt.AreaSelector;
						as.store.removeAll();
						if (! cbg.getValue())return;
						var val = cbg.getValue().inputValue	;
						as.displayField = val;
						var newLayerName = this.ownerCt.layers[val];
						as.changeLayer(newLayerName);
					
					}
				
				}
				
			},
			{
				xtype: 'gxp_selectfeaturegrid',
				target:this.target,
				vendorParams:{cql_filter:this.areaFilter},
				ref:'AreaSelector',
				displayField:'PROVINCE',
				layerStyle:this.layerStyle}
		]
		return nrl.form.AOIFieldSet.superclass.initComponent.apply(this, arguments);
	}	
	
	
});
Ext.reg('nrl_aoifieldset',nrl.form.AOIFieldSet);

