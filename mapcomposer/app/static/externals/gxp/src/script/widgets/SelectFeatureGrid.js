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
	
	/**   api: xtype = gxp_selectfeaturegrid */
	/** api: config[toggleGroup]
     *  ``String`` the toggleGroup of selection button
     */
	toggleGroup: "toolGroup",
	
	/**  api: config[displayField]
	 *the feature name to display, as returned by WMS getFeatureInfo 
	 */
	displayField:"fname",
	
    searchWindowTitle:  "Seach for a region typing the text below",
	
    tooltipAdd: "Seach the region by name",	
    
    tooltipClear: "Remove all the selected areas",
    
    tooltipAddFromMap: "Select the regions clicking on the map",
	
	/*NOTE 
		contains the configuration of comboBox, for pratical reason
		useful the develop of this application, the component is defined 
		using this variable instead of a mixed value. TODO: make it better */
	comboConfig:{
                        
    },
	
	/** Configuration of the Ext.grid.GridPanel component */
	hideHeaders:true,
	
	reserveScrollOffset: true,
	
	height:150,
	
	selectableLayer: 'nrl:province_boundary',
	
	autoScroll:true,
	
	loadMask: true,
	
	viewConfig: {				
		forceFit: true
		//Return CSS class to apply to rows depending upon data values		
	},
	
	initComponent: function() {
		this.addEvents('update');
		this.store =  new Ext.data.SimpleStore({
		mode:'local',
		autoload:true,
		fields:[
				{name:'data',		mapping:'data'},
				{name:'attributes',	mapping:'attributes'}
			]			
		}),
		itemdeleter = new Ext.ux.grid.ItemDeleter();
		this.columns = [
			{
				id: 'name',
				dataIndex:'attributes', 
				renderer:{
					fn:function(data){
						return data[this.displayField];
					},
					scope:this
				}
			},
			itemdeleter
		];
		this.sm = itemdeleter;
		
		//add buttons to the bbar
		this.selectButton = new gxp.widgets.button.SelectFeatureButton({
			ref:'selectButton',
			vendorParams:this.vendorParams,
			selectableLayer: this.selectableLayer,
			layerStyle: this.layerStyle,
			hilightLayerName:this.hilightLayerName,
			nativeSrs : "EPSG:32642",
			target:this.target,
			text: 'Add from map',
			tooltip: this.tooltipAddFromMap,
			iconCls:'icon-map-add',
			store: this.store,
			toggleGroup:this.toggleGroup,
			listeners:{
				startSelection:function(){
					this.loadMask.show();
				},
				endSelection:function(){
					this.loadMask.hide();
				},
				update:function(store){
					this.fireEvent('update',store);
				},
				scope:this
			}
		});
		this.bbar = [			
			{
				xtype:'tbbutton',
				text:'Add',
                tooltip: this.tooltipAdd,
				iconCls:'icon-add',
				handler:function(){
					var selectCombo = new gxp.form.WFSSearchComboBox(Ext.apply({vendorParams:this.vendorParams},this.comboConfig));
					var window = new Ext.Window({
						title:this.searchWindowTitle,
						items:[selectCombo],
						//layout:'form',
						width:265,
						y:250,
						modal:true,
						resizable:false,
						draggable:false
					});
					
					selectCombo.on('select', function(combo,record,index){
							//create the OpenLayers.Feature.Vector obj
							var geom_json = record.get('geometry');
							var attributes = record.get('properties');
							var geom = new OpenLayers.Format.GeoJSON().parseGeometry(geom_json);
							var location = new OpenLayers.Feature.Vector(geom,attributes);
							//add if missing to the store
							var store = this.store;
							var record =new store.recordType(location);
							var presentRecord = this.store.getById(record.id);
							
							if(!presentRecord){
								store.add(record);
							}

							window.close();
					},this);
					
					window.show();
				},
                scope:this
			},
			
			this.selectButton,
			'->',
			{
				xtype:'tbbutton',
				text:'Clear',
                tooltip: this.tooltipClear,
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
	},
	
    getComboConfig: function(){
        return Ext.apply(this.comboConfig, {
			//displayField:this.displayField,
            vendorParams:this.vendorParams
        });          
    }
});
Ext.reg(gxp.widgets.SelectFeatureGrid.prototype.xtype,gxp.widgets.SelectFeatureGrid);