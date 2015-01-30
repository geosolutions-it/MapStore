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
 *  .. class:: MobileXDataTypeComboBox(config)
 *   
 *      A combo box for selecting XDataType 
 *      .
 */
mxp.widgets.MobileXDataTypeComboBox = Ext.extend(Ext.form.ComboBox, {

    allowedTypes: [
["string", "String"],
["date", "Date"],
["datetime", "Date Time"],
["integer", "Integer"],
["decimal", "Decimal"],
["phone", "Phone"],
["person", "Person"], 
["real","Real"],
["text","Text"]
],

    allowBlank: true,
    mode: "local",
	queryMode: 'local',
	typeAhead: true,
    forceSelection: true,
    triggerAction: "all",
	editable: false,
	lastQuery:'',
	blankText :'Xtype not needed',
  
    initComponent: function() {
        var defConfig = {
            displayField: "name",
            valueField: "value",
            store: new Ext.data.SimpleStore({
            	data: this.allowedTypes,
            	fields: ["value", "name"]
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
        
    	//Si auto bolocca se non ha campi!!
        this.getStore().on('datachanged',function(str){
        	this.enable();
        	this.clearValue();
        	var rec= str.getAt(0)
        	if(rec)this.setValue(rec.data.value);
         else this.disable();
        
        },this),
        
       mxp.widgets.MobileXDataTypeComboBox.superclass.initComponent.call(this);   
    }
    
    
});

Ext.reg("mxp_mobilexdatatypecombobox", mxp.widgets.MobileXDataTypeComboBox);

