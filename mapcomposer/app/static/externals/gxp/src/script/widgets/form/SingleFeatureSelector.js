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
    
    fieldLabel: 'Gate',
    url: "http://destination.geo-solutions.it/geoserver_test/ows?",
    typeName:"siig_gate_geo_gate",
    predicate:"ILIKE",
	toggleGroup:'toolGroup',
	vendorParams: this.vendorParams,
     recordModel:[
        {
          name:"id_gate",
           mapping:"id_gate"
        },
        {
           name:"geometry",
           mapping:"geometry"
        },
        {
           name:"descrizione",
           mapping:"properties.descrizione"
        } 
    ],
    queriableAttributes:[
        "descrizione"  
     ],
    sortBy:"id_gate",
	displayField:"descrizione",
    pageSize:10,
    //wsfsComboSize:140,
    tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{descrizione}</span></h3>({descrizione})</div></tpl>",
    //for get feature info
    nativeSrs : "EPSG:4326",
    iconCls:'icon-map-add',
    loadMask:true,
	initEvents : function(){
		if(this.loadMask){
			gxp.widgets.form.SingleFeatureSelector.superclass.initEvents.call(this);
			if(this.loadMask){
				var destEl = this.ownerCt.getEl(); //owner, a fieldset is to little
				this.loadMask = new Ext.LoadMask(destEl, {msg:"Please wait..."});
			}
		}
	},
	initComponent:function(){
        this.enableBubble('update');
		var selectFeatureButton = new gxp.widgets.button.SelectFeatureButton({
                xtype:'gxp_selectFeatureButton',
				vendorParams:this.vendorParams,
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
					startSelection:function(){
						if(this.loadMask){
							this.loadMask.show();
						}
						
					},
					endSelection:function(){
						if(this.loadMask){
							this.loadMask.hide();
						}
					},
                    update:function(store){
                        this.fireEvent('update',store);
                    },
					scope:this
				}
			});
		selectFeatureButton.on('addfeature',function(a,b){
			if (!this.selectCombo){ return }//TODO remove when you find why the this function is called also on other intances of SelectFeatureButton
            this.setComboDisplayValue(this.selectCombo,a);
			
		},this);
		var selectCombo = new gxp.form.WFSSearchComboBox({
                name: this.name,
                target: this.target,
                clearOnFocus:true,
                forceAll :'false',
				xtype: 'gxp_searchboxcombo',
				ref:'selectCombo',
				vendorParams:this.vendorParams,
				autoWidth:false,
                width:this.wfsComboSize,
				flex:1,
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
                hideTrigger: this.hideTrigger
			});
		selectCombo.on('select', function(combo,record,index){
				var geom_json = record.get('geometry');
				var attributes = record.json.properties; //record.get('properties');
				var geom = new OpenLayers.Format.GeoJSON().parseGeometry(geom_json);
				var location = new OpenLayers.Feature.Vector(geom,attributes);
				var store = combo.refOwner.selectButton.store;
				store.removeAll();
				var record =new store.recordType(location);
				store.add(record);
                this.fireEvent('update',store);
		},this);
        selectCombo.on('blur', function(cb){
            this.setComboDisplayValue(cb,cb.refOwner.selectButton.store.getAt(0)); //restore value on blur
        },this);
		this.items=[selectCombo,selectFeatureButton];
		this.selectFeatureButton=selectFeatureButton;
		
		return  gxp.widgets.form.SingleFeatureSelector.superclass.initComponent.apply(this, arguments);
	},
    setComboDisplayValue: function (selectCombo,record){
		if(!record) return false;
        var attributes = record.get('attributes');
        if (!attributes) return;
        var rm = selectCombo.recordModel;
        var displayAttribute;
        //get correct object to display (WFS properties are named attributes in openlayers object decoded from GML )
        for(var i = 0;i<rm.length;i++){
            if (rm[i].name==selectCombo.displayField) {
                displayAttribute=rm[i].mapping;
                var index =displayAttribute.indexOf(".");
                if(index>=0){
                    var displayAttribute =  displayAttribute.substring(index+1);
                    
                }
            }
        }
        selectCombo.setValue(attributes[displayAttribute]);
    },
    setDisabled: function(disabled){
        if(this.selectCombo){
            this.selectCombo.setDisabled(disabled);
        }
        if(this.selectFeatureButton){
            this.selectFeatureButton.toggle(false);
            this.selectFeatureButton.setDisabled(disabled);
        }
    }
    
    
    
    
});
Ext.reg(gxp.widgets.form.SingleFeatureSelector.prototype.xtype,gxp.widgets.form.SingleFeatureSelector);