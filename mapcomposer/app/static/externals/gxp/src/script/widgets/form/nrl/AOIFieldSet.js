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
nrl.form.AOIFieldSet = Ext.extend(Ext.form.FieldSet, {

	xtype: 'nrl_aoifieldset',
	anchor:'100%',
	title: 'Area of interest',
	displayField: 'province',
	selectableLayer: 'nrl:province_boundary',
    disableWidth:['pakistan'],
	comboConfigs:{
        base:{
            anchor:'100%',
            fieldLabel: 'District',
            url: "http://84.33.2.24/geoserver/ows?",
            predicate:"ILIKE",
            width:250,
            sortBy:"province",
			ref:'singleSelector',
            displayField:"name",
            pageSize:10
            
        },
        district:{
            typeName:"nrl:district_boundary",
            queriableAttributes:[
                "district",
                "province"                
            ],
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
                   mapping:"properties.district"
                },
				{
                   name:"province",
                   mapping:"properties.province"
                },
				{
                   name:"properties",
                   mapping:"properties"
                } 
            ],
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"       
        },
        province:{            
            typeName:"nrl:province_boundary",
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
                   mapping:"properties.province"
                },
				{
                   name:"properties",
                   mapping:"properties"
                }
            ],
            sortBy:"province",
            queriableAttributes:[
                "province"
            ],
            displayField:"name",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"                            
        }    
    },
    disabledGrantype: [],
    constructor: function(config){
        Ext.apply(this, config);
        nrl.form.AOIFieldSet.superclass.constructor.call(this, config);
        
        this.addEvents(
            /** api: event[regionsChange]
             *  Fires when a region is added or removed.
             */
            "regionsChange",
            'grantypeChange'
        );
    },
	initComponent: function() {
        this.grantypesState = {};
        for (var i=0; i<this.disabledGrantype.length; i++){
            this.grantypesState[this.disabledGrantype[i]] = true;
        }

        this.currentComboConfig = Ext.apply({},this.comboConfigs.base,this.comboConfigs.province);
		this.items = [
			{ 
				fieldLabel: 'Type',
				xtype: 'radiogroup',
				ref: 'gran_type',
				name: 'gran_type',
				autoHeight:true,
				checkboxToggle:true,
				title: this.outputTypeText,
				defaultType: 'radio', // each item will be a radio button
				items:[
					{boxLabel: 'Province' , name: 'areatype', inputValue: 'province' , checked: true, disabled: this.grantypesState['province']},
					{boxLabel: 'District', name: 'areatype', inputValue: 'district', disabled: this.grantypesState['district']},
                    {boxLabel: 'Pakistan', name: 'areatype', inputValue: 'pakistan', disabled: this.grantypesState['pakistan']}
				],
				listeners: {
					change: function(cbg, checkedarray){
						var as = cbg.ownerCt.AreaSelector;
                        //TODO ask to confirm, before loose all selection
                        
						as.store.removeAll();
						if (! cbg.getValue())return;
						var val = cbg.getValue().inputValue	;
						
						var newLayerName = cbg.ownerCt.layers[val];
                        if(newLayerName){
                            as.displayField = cbg.ownerCt.comboConfigs[val].displayField;
                            as.changeLayer(newLayerName);
                            as.comboConfig  = Ext.apply(
                                {},
                                cbg.ownerCt.comboConfigs.base,
                                cbg.ownerCt.comboConfigs[val]
                            );
                            
                            as.setDisabled(false);
                        }else{
                            as.setDisabled(true);
                        }
                        if(this.disableWidth.indexOf(val)>-1){
                            as.setDisabled(true);
                        }else{
                            as.setDisabled(false);
                        } 

						var outputValue = cbg.getValue().inputValue;
                        // check if disable with 'this.disableWidth' config param
                        var disable = false;
                        if(this.disableWidth && this.disableWidth.length > 0){
                            for(var i=0; i<this.disableWidth.length; i++){
                                if(outputValue == this.disableWidth[i]){
                                    disable = true;
                                    break;
                                }    
                            }
                        }
						if(disable){
							this.ownerCt.submitButton.setDisabled(false);
							this.AreaSelector.selectButton.toggle(false);
						}else{
							var store = this.AreaSelector.getStore();
							this.ownerCt.submitButton.setDisabled(store.getCount()<=0);
						}
                        this.fireEvent("grantypeChange", checkedarray);
					},
                    scope: this
				}
			},
			{
				xtype: 'gxp_selectfeaturegrid',
				target:this.target,
				vendorParams: {cql_filter: this.areaFilter},
				selectableLayer:this.selectableLayer,
                hilightLayerName:this.hilightLayerName,
				ref:'AreaSelector',
                comboConfig:this.currentComboConfig,
				displayField: 'fname',
				layerStyle:this.layerStyle,
				listeners: {
					update: function(store){
						records = store.getRange();
						var len = records.length ;
						if (len <= 0 ){ 
							sel = "";
						}else{
							var attrs = records[0].get("attributes");
							var name = attrs[this.gran_type.getValue().inputValue];
							var sel =  "'" + name +"'";
						}
						for (var i = 1; i < len; i++) {
							var attrs = records[i].get("attributes");
							var name = attrs[this.gran_type.getValue().inputValue];
							
							sel +="\\,'" + name +"'";
						}
						this.selectedRegions.setValue(sel);
                        // call to listener
                        this.fireEvent("regionsChange", store);
					},
					scope:this
				}
            },{   
                xtype:'hidden',//<--hidden field  
                name:this.name, //name of the field sent to the server  
				ref: 'selectedRegions',
                value:''//value of the field  
        }
		];
		
		return nrl.form.AOIFieldSet.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('nrl_aoifieldset',nrl.form.AOIFieldSet);

