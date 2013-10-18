Ext.namespace('nrl.form');
nrl.form.SingleAOISelectorAlt = Ext.extend(nrl.form.SingleAOISelector,
{
	xtype: 'nrl_single_aoi_selector_alt',

	constructor: function(config){
		nrl.form.SingleAOISelectorAlt.superclass.constructor.call(this, config);
        
        this.addEvents(
            /** api: event[select]
             *  Fires when a province is selected.
             */
            "select"
        );
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
				items:this.getItemsArray(),
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
                                this.ownerCt.ownerCt.submitButton.setDisabled(true); // tab button
                            }else{
                                this.ownerCt.ownerCt.submitButton.setDisabled(false); // tab button
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

    getItemsArray: function(){
        return [{boxLabel: 'Province', itemId:'PROVINCE', name: 'areatype', inputValue: 'PROVINCE' , checked: true},
            {boxLabel: 'District', itemId:'DISTRICT', name: 'areatype', inputValue: 'DISTRICT'},
            {boxLabel: 'Pakistan', itemId:'PAKISTAN', name: 'areatype', inputValue: 'PAKISTAN'}];
    },
	
	createCombo: function(type){
        var combo = nrl.form.SingleAOISelectorAlt.superclass.createCombo.call(this, type);
        combo.on({
        	update: function(store){
        		this.fireEvent("select", store);
        	},
        	scope:this
        })
        return combo;
	}
});

Ext.reg(nrl.form.SingleAOISelectorAlt.prototype.xtype,nrl.form.SingleAOISelectorAlt);
