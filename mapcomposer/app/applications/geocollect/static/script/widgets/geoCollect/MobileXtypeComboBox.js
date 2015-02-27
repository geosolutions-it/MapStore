/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 
Ext.ns("mxp.widgets");

/** api: constructor
 *  .. class:: ComparisonComboBox(config)
 *   
 *      A combo box for selecting comparison operators available in OGC
 *      filters.
 */


mxp.widgets.MobileXtypeComboBox = Ext.extend(Ext.form.ComboBox, {

//Impostare qui i filtri per input 
filterType:{
	'textfield':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'textarea':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'separator':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'label':new RegExp(
            "^((?!PointPropertyType).)*$", "i"
        ),
	'datefield':new RegExp("^(date|datetime|string|text)$", "i" ),
	//'checkbox':new RegExp("^(boolean|string|text)$", "i" ),
	'checkbox':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'photo':new RegExp("^(!?)$", "i" ),
	'mapViewPoint':new RegExp("^(PointPropertyType)$", "i" ),
	'separatorWithIcon':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'actionsend':new RegExp("^(!?)$", "i" ),
	'actionsave':new RegExp("^(!?)$", "i" )

},
    
    filterXDataType:{
	'textfield':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'textarea':new RegExp("^((?!PointPropertyType).)*$", "i"),
	'separator':new RegExp("^(!?)$", "i" ),
	'label':new RegExp("^(!?)$", "i" ),
	'datefield':new RegExp("^(!?)$", "i" ),
	'checkbox':new RegExp("^(!?)$", "i" ),
	'photo':new RegExp("^(!?)$", "i" ),
	'mapViewPoint':new RegExp("^(!?)$", "i" ),
	'separatorWithIcon':new RegExp("^(!?)$", "i" ),
	'actionsend':new RegExp("^(!?)$", "i" ),
	'actionsave':new RegExp("^(!?)$", "i" )
},
    
    


    allowBlank: false,
    mode: "local",
	queryMode: 'local',
	typeAhead: true,
    forceSelection: true,
    triggerAction: "all",
    editable:false,
    lastQuery:'',
  
    initComponent: function() {
  
  if(!this.allowedTypes)
  this.allowedTypes= [
['textfield' , "Text Field"],
['textarea', "Text Area"],
['separator', "Separator"],
['label', "Label"],
['datefield', "Date Field"],
['checkbox', "Checkbox"],
['photo',"Photo"],
['mapViewPoint', "Map"],
['separatorWithIcon',"Separator With Icon"]
['actionsend',"Action Send"],
['actionsave',"Action Save"],
['spinner',"Spinner"]
];
  
  
  
  
  
  
        var defConfig = {
            displayField: "name",
            valueField: "value",
            store: new Ext.data.SimpleStore({
            	data: this.allowedTypes,
            	fields: ["value", "name"],
            	listeners:{
            		'datachanged':function(str){
            			this.enable();
        				this.clearValue();
        				var rec= str.getAt(0)
        				if(rec)this.setValue(rec.data.value);
        				 else this.disable();
            		},
            		scope:this
            		
            	}
            	
            }),
            value: (this.value === undefined) ? [this.allowedTypes[0][0]] : this.value,  
            listeners: {
                // workaround for select event not being fired when tab is hit
                // after field was autocompleted with forceSelection
                "blur": function() {
                    var index = this.store.findExact("value", this.getValue());
                    if (index != -1) {
                        this.fireEvent("select", this, this.store.getAt(index));
                    } else if (this.startValue != null) {
                        this.setValue(this.startValue);
                    }
                }
            }
        };
        Ext.applyIf(this, defConfig);
        
       mxp.widgets.MobileXtypeComboBox.superclass.initComponent.call(this);
},
    
     //Ritorna array con XdataType dato xtype di input
    getFilter:function(){
   		return {
   			'field':this.filterType[this.getValue()],
   			'xdatatype':this.filterXDataType[this.getValue()]
   			};	
 	}
      
    
    
});

Ext.reg("mxp_mobilextypecombobox", mxp.widgets.MobileXtypeComboBox);

