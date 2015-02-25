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

/**
 * GoeMobileWidgetPanel
 * Allow to create mobile widget
 * */
mxp.widgets.XtypeDateField = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_textfield */
	xtype:'mxp_gc_xtype_datefield',
	idFieldLabel:"Field",
    labFieldLabel:"Label",
	//Utilizzat per ripulire i campi valori
   clV:new RegExp("^(\\${origin.)(.*)(})$"),
   jObj:null,
   
initComponent: function() {

this.items=[{
   				xtype:'textfield', 
				fieldLabel:this.idFieldLabel,
				ref:'idField',
				disabled:true,
				allowBlank:false
			},
			{
   				xtype:'textfield', 
				fieldLabel:this.labFieldLabel,
				ref:'labField',
				allowBlank:false,
		    },

			{
   				xtype:'textfield', 
				fieldLabel:'Date Format',
				ref:'formatField',
				hidden:"true",
				allowBlank:true	
		     }
		     ];
    
    
this.on('render',this.setidField,this);

    
             mxp.widgets.XtypeDateField.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * xtype datefield - obj
 * {
 *	"fieldId": "NOME_RILEVATORE",
 *	"type":null,
 *	"xtype":"datefield",
 *	"format:"YYYMMDD",
 *	"label":"Nome Rilevatore",
 * 	
 *				 }
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	if(o.label)this.labField.setValue(o.label);
	this.setidField();
	if(o.format)this.formatField.setValue(o.format);

},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype datefield - obj
 * {
 *	"fieldId": "NOME_RILEVATORE",
 *	"type":null,
 *	"xtype":"datefield",
 *	"format:"YYYMMDD",
 *	"label":"Nome Rilevatore",
 * 	} 
 */
getXtype:function(){
   
   o={  
        "type":"text",
   		"fieldId":this.idField.getValue(),
    	"label":this.labField.getValue(),
    	"xtype":"datefield"
   };
   if(this.formatField.getValue())o.format=this.formatField.getValue();
  
	return o;
},
/**
 * api: method[isValid]
 * Validate xtype datefield obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.labField.isValid()&&this.formatField.isValid())return true;
		return false;
},

/**
 * api: method[fieldUpdated]
 * Update the form on field change
 * 
 * */
segUpdated:function(){
	

	
},
/**
 * api: method[sopUpdated]
 * Update the form on field change
 * 
 * */
sopUpdated:function(){
	
	this.setidField();
	
	
},
//Recupera il valore dal widget fields e lo setta!!
setidField:function(){
	 var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.sopSelector.getValue();
	    this.idField.setValue(val);
},
/**
 * api method[isDirty]
 * Check if the form has been modified
 * Return boolean
 */
isDirty:function(){
    a=Ext.encode(this.jObj);
    b=Ext.encode(this.getXtype());
    return (a==b)? false:true;      
}
});

Ext.reg(mxp.widgets.XtypeDateField.prototype.xtype, mxp.widgets.XtypeDateField);


