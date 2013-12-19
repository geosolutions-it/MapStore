Ext.namespace('destination.form');
destination.form.SingleAOISelector = Ext.extend( Ext.form.FieldSet,
{
	xtype: 'dest_single_aoi_selector',
	hilightLayerName: 'hilight_layer_selectAction',
	//anchor:'100%',
    autoHeight: true,
    autoScroll: true,
    defaults: {
        // applied to each contained panel
        bodyStyle:'padding:5px;'
    },    
	title: 'Area of interest',
	layerStyle:{
        strokeColor: "blue",
        strokeWidth: 1,
        fillOpacity:0.6,
        'pointRadius': 20
    },
    startConfig:'gate',
    featureSelectorConfigs:{
        base:{
		toggleGroup:'toolGroup',
        xtype: 'gxp_searchboxcombo',
            anchor:'100%',
            fieldLabel: 'Gate',
            url: "",
            predicate:"ILIKE",
            sortBy:"id_gate",
			ref:'singleSelector',
            displayField:"descrizione",
            pageSize:10            
        },
        gate:{
            typeName:"siig_gate_geo_gate",
            queriableAttributes:[
                "descrizione"                
             ],
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
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{descrizione}</span></h3>({descrizione})</div></tpl>"       
        }   
    },
	
	initComponent: function() {		
		this.currentCombo = this.createCombo(this.startConfig);
		this.items = [
			this.currentCombo
		];
		
		return destination.form.SingleAOISelector.superclass.initComponent.apply(this, arguments);
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
                nativeSrs : this.nativeSrs,
                name:this.name,
                bubbleEvents:['update']
            },this.featureSelectorConfigs[type],this.featureSelectorConfigs.base
		));
	}
});

Ext.reg(destination.form.SingleAOISelector.prototype.xtype,destination.form.SingleAOISelector);
