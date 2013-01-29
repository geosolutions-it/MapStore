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
 * @requires widgets/button/SelectFeatureButton.js
 */

Ext.namespace('gxp.widgets');

gxp.widgets.SelectFeatureGrid = Ext.extend(Ext.grid.GridPanel,{
	xtype:'gxp_selectfeaturegrid',
	toggleGroup: "toolGroup",
	displayField:"fname",
	multiSelect: true,
	
	
	hideHeaders:true,
	reserveScrollOffset: true,
	height:150,
	autoScroll:true,
	multiSelect: true,
	overClass:'x-view-over',
	itemSelector:'div.thumb-wrap',
	emptyText: 'No images to display',
	loadingMask: true,
	viewConfig: {
				
		forceFit: true
		//Return CSS class to apply to rows depending upon data values
		
	},
	initComponent: function() {
		this.store =  new Ext.data.SimpleStore({
		mode:'local',
		autoload:true,
		fields:[,
				{name:'data',		mapping:'data'}
			]
			
		}),
		itemdeleter = new Ext.ux.grid.ItemDeleter();
		this.columns=[
			{
				id: 'name',
				dataIndex:'data', 
				renderer:{
					fn:function(data){
						return data[this.displayField];
					},
					scope:this
				}
			},
			itemdeleter
		];
		this.sm =itemdeleter;
		
		//add buttons to the bbar
		this.selectButton = new gxp.widgets.button.SelectFeatureButton({
				ref:'selectButton',
				selectableLayer: ['nrl:Province_Boundary'],
                layerStyle: this.layerStyle,
				hilightLayerName:this.hilightLayerName,
				nativeSrs : "EPSG:32642",
				target:this.target,
				text:'Add from map',
				iconCls:'icon-map-add',
				store: this.store,
				toggleGroup:this.toggleGroup
		});
		this.bbar=[
			
			{
				xtype:'tbbutton',
				text:'Add',
				iconCls:'icon-add',
				handler:function(){
						Ext.Msg.alert("Add Area","Not Yet Implemented");
				}
			},
			
			this.selectButton,
			'->',
			{
				xtype:'tbbutton',
				text:'Clear',
				iconCls:'icon-delete',
				handler:function(){
						this.store.removeAll();
				},
				scope:this
			}
		];
		return gxp.widgets.SelectFeatureGrid.superclass.initComponent.apply(this, arguments);
		
	},
	changeLayer :function(layer){
		this.selectButton.setSelectableLayer(layer);
	}
});
Ext.reg(gxp.widgets.SelectFeatureGrid.prototype.xtype,gxp.widgets.SelectFeatureGrid);