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
Ext.namespace('gxp.widgets.form');
gxp.widgets.form.SingleFeatureSelector = Ext.extend(Ext.form.CompositeField,{
	xtype: 'gxp_single_feature_selector',
    
    fieldLabel: 'District',
    url: "http://84.33.2.24/geoserver/ows?",
    typeName:"nrl:District_Boundary",
    predicate:"ILIKE",

    recordModel:[
        {
          name:"id",
           mapping:"id"
        },
        {
           name:"geometry",
           mapping:"geometry"
        },
        {
           name:"name",
           mapping:"properties.DISTRICT"
        },{
           name:"province",
           mapping:"properties.PROVINCE"
        },{
           name:"properties",
           mapping:"properties"
        }
        
    ],
    queriableAttributes:[
        "DISTRICT",
        "PROVINCE"
     ],
     sortBy:"PROVINCE",
	displayField:"name",
    pageSize:10,
    wfsComboSize:100,
    tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>",
    //for get feature info
    nativeSrs : "EPSG:32642",
    iconCls:'icon-map-add',
    
	events:['change'],
	initComponent:function(){
		
		this.items=[
			{
				xtype: 'gxp_searchboxcombo',
				autoWidth:true,
                width:this.wfsComboSize,
				fieldLabel: this.fieldLabel,
                url: this.url,
                typeName:this.typeName,
				predicate:this.predicate,
				recordModel:this.recordModel,
                queriableAttributes:this.queriableAttributes,
				sortBy:this.sortBy,
				displayField:this.displayField,
                pageSize:this.pageSize,
                tpl:this.tpl,
                listeners:{
                    select:this.onComboSelect,
                    scope:this
                }
			},{
                xtype:'gxp_selectFeatureButton',
                singleSelect:true,
                ref:'selectButton',
				selectableLayer: [this.typeName],
                //TODO add layer
                layerStyle: this.layerStyle,
				nativeSrs:this.nativeSrs,
				target:this.target,
				text:'',
				iconCls:this.iconCls,
				//store: this.store,
				toggleGroup:this.toggleGroup,
                listeners:{
                    'addfeature':function(a,b){
                        //alert(a);
                        //alert(b);
                    }
                }
            }
		]
		return gxp.widgets.form.SingleFeatureSelector.superclass.initComponent.apply(this, arguments);
	},
    onComboSelect: function(combo,record,index){
		var geom_json = record.get('geometry');
        var attributes = record.get('properties');
		var geom = new OpenLayers.Format.GeoJSON().parseGeometry(geom_json);
        var location = new OpenLayers.Feature.Vector(geom,attributes);
        var store = this.selectButton.store;
        store.removeAll();
        var record =new store.recordType(location);
        store.add(record);
	}
    
});
Ext.reg(gxp.widgets.form.SingleFeatureSelector.prototype.xtype,gxp.widgets.form.SingleFeatureSelector);