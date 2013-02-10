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
						{boxLabel: 'Rabi(Nov-Apr)' , name: 'season', inputValue: 'RABI'},
						{boxLabel: 'Kharif(May-Oct)', name: 'season', inputValue: 'KHARIF'}
						
						
		]
		
		return nrl.form.SeasonRadioGroup.superclass.initComponent.apply(this, arguments);
	}	
	
	
});
Ext.reg('nrl_seasonradiogroup',nrl.form.SeasonRadioGroup);