Ext.namespace('nrl.form');
nrl.form.SeasonRadioGroup = Ext.extend(Ext.form.RadioGroup,
{
	xtype: 'nrl_seasonradiogroup',
	fieldLabel: 'Season',
	autoHeight:true,
	checkboxToggle:true,
	title: this.outputTypeText,
	autoHeight: true,
	defaultType: 'radio', // each item will be a radio button
	
	
	initComponent: function() {
		this.items=[
						{boxLabel: 'Rabi(Nov-Apr)' , name: 'season', inputValue: 'RABI', checked: true},
						{boxLabel: 'Kharif(May-Oct)', name: 'season', inputValue: 'KHARIF'}
						
						
		],
        this.listeners={
            change: function(r,checked){
                this.refOwner.Commodity.seasonFilter(checked.inputValue);
                this.refOwner.Commodity.setValue(this.refOwner.Commodity.store.data.items[0].data.label);
            }
        }
		
		return nrl.form.SeasonRadioGroup.superclass.initComponent.apply(this, arguments);
	}	
	
	
});
Ext.reg('nrl_seasonradiogroup',nrl.form.SeasonRadioGroup);