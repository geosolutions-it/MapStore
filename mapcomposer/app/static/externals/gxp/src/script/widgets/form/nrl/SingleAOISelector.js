Ext.namespace('nrl.form');
nrl.form.SingleAOISelector = Ext.extend( Ext.form.FieldSet,
{
	xtype: 'nrl_single_aoi_selector',
	hilightLayerName: 'hilight_layer_selectAction',
	anchor:'100%',
	title: 'Area of interest',
	layerStyle:{
        strokeColor: "blue",
        strokeWidth: 1,
        fillOpacity:0.6        
    },
    startConfig:'PROVINCE',
    featureSelectorConfigs:{
        base:{
		toggleGroup:'toolGroup',
        xtype: 'gxp_searchboxcombo',
            anchor:'100%',
            fieldLabel: 'District',
            url: "http://84.33.2.24/geoserver/ows?",
            predicate:"ILIKE",
            sortBy:"province",
			ref:'singleSelector',
            displayField:"name",
            pageSize:10            
        },
        DISTRICT:{
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
        PROVINCE:{ 
            fieldLabel: 'Province',
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
	
	initComponent: function() {		
		this.currentCombo = this.createCombo(this.startConfig);
		this.items = [
			{
				fieldLabel: 'Type',
				xtype: 'radiogroup',
                name:'areatype',
				ref:'gran_type',
				autoHeight:true,
				checkboxToggle:true,
				defaultType: 'radio', // each item will be a radio button
				items:[
					{boxLabel: 'Province', itemId:'PROVINCE', name: 'areatype', inputValue: 'PROVINCE' , checked: true},
					{boxLabel: 'District', itemId:'DISTRICT', name: 'areatype', inputValue: 'DISTRICT'}/*,
                    {boxLabel: 'Pakistan', itemId:'PAKISTAN', name: 'areatype', inputValue: 'PAKISTAN',disabled:true}*/
				],
				listeners: {
					change: function(cbg,checkedarray){
						var value = cbg.getValue();
						var outputValue = value.inputValue;
						
						if (value && outputValue){
                            if(this.ownerCt.featureSelectorConfigs[outputValue]){
                                this.ownerCt.currentCombo = this.ownerCt.createCombo(outputValue);
                                this.ownerCt.remove(this.ownerCt.singleSelector,true);
                                this.ownerCt.add(this.ownerCt.currentCombo);
                                this.ownerCt.doLayout();
                                this.ownerCt.currentCombo.setDisabled(false);
                            }else{
                                this.ownerCt.currentCombo.setDisabled(true);
                            }
						}
					}
				}				
			},
			this.currentCombo
		];
		
		return nrl.form.SingleAOISelector.superclass.initComponent.apply(this, arguments);
	},
	
	createHilightLayer: function(){		
		this.hilightLayer = new OpenLayers.Layer.Vector(
			this.hilightLayerName,
			{
				style: this.layerStyle
			}		
		);
		
		this.target.mapPanel.map.addLayer(this.hilightLayer);
        return this.hilightLayer;	
	},
	
	createCombo: function(type){
        return new gxp.widgets.form.SingleFeatureSelector(Ext.apply(
			{
                target:this.target,
                layerStyle:this.layerStyle,
				vendorParams:this.vendorParams,
                name:this.name,
                bubbleEvents:['update']
            },this.featureSelectorConfigs[type],this.featureSelectorConfigs.base
		));
	}
});

Ext.reg(nrl.form.SingleAOISelector.prototype.xtype,nrl.form.SingleAOISelector);
