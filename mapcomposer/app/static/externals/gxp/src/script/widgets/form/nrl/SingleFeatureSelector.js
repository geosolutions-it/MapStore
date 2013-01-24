Ext.namespace('nrl.form');
nrl.form.SingleFeatureSelector = Ext.extend( Ext.form.FieldSet,
{
	xtype: 'nrl_singlefeatureselector',
	hilightLayerName: 'hilight_layer_selectAction',
	anchor:'100%',
	title: 'Area of interest',
	
	
	initComponent: function() {
		this.combos = {};
		this.combos.PROVINCE = this.createProvinceCombo();
		this.combos.DISTRICT = this.createDistrictCombo();
		this.currentCombo = this.combos.PROVINCE;
		this.items = [
			{ 
				fieldLabel: 'Type',
				xtype: 'radiogroup',
				autoHeight:true,
				checkboxToggle:true,
				defaultType: 'radio', // each item will be a radio button
				items:[
					{boxLabel: 'Province' , name: 'areatype', inputValue: 'PROVINCE' , checked: true},
					{boxLabel: 'District', name: 'areatype', inputValue: 'DISTRICT'}	
				],
				listeners: {
					change: function(cbg,checkedarray){
						
						
						if (cbg.getValue() && cbg.getValue().inputValue){
							var newType = cbg.getValue().inputValue;
							this.remove(this.currentCombo,true);
							this.combos.PROVINCE = this.createProvinceCombo();
							this.combos.DISTRICT =  this.createDistrictCombo();
							this.currentCombo = this.combos[newType];
							this.add(this.currentCombo);
							this.doLayout();
						}

					},
					scope:this
				
				}
				
			},this.currentCombo
		]
		return nrl.form.SingleFeatureSelector.superclass.initComponent.apply(this, arguments);
	},
	onComboSelect: function(combo,record,index){
		var location = record.get('geometry');
		
		if(!this.hilightLayer) this.createHilightLayer();
		this.hilightLayer.removeAllFeatures();
		this.hilightLayer.addFeatures([location]);
	
	},
	createHilightLayer: function(){
		
		this.hilightLayer = new OpenLayers.Layer.Vector(
			this.hilightLayerName,
			{
				displayInLayerSwitcher:false
			}
		
		);
		
		this.target.mapPanel.map.addLayer(this.hilightLayer);
	
	},
	createDistrictCombo: function(){
		return new gxp.form.WFSSearchComboBox(Ext.apply(
			{
				listeners: {
					select: this.onComboSelect,
							scope: this
						}
			}, {
				xtype: 'gxp_searchboxcombo',
				anchor:'100%',
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
						}
					],
					 sortBy:"PROVINCE",
					 queriableAttributes:[
						"DISTRICT",
						"PROVINCE"
						
					 ],
					 displayField:"name",
					 pageSize:10,
					 tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"
								
			}
		));
	},
	createProvinceCombo: function(){
		return new gxp.form.WFSSearchComboBox(Ext.apply({
				listeners: {
					select: this.onComboSelect,
					scope: this
				}
			}, {
					xtype: 'gxp_searchboxcombo',
					anchor:'100%',
					fieldLabel: 'Province',
					url:"http://84.33.2.24/geoserver/ows?",
					typeName:"nrl:Province_Boundary",
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
						   mapping:"properties.PROVINCE"
						}
						 ],
						 sortBy:"PROVINCE",
						 queriableAttributes:[
							"PROVINCE"
							
						 ],
						 displayField:"name",
						 pageSize:10,
						 tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"
								
			})
		);
	}
	
	
});
Ext.reg(nrl.form.SingleFeatureSelector.prototype.xtype,nrl.form.SingleFeatureSelector);

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		