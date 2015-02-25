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
mxp.widgets.XtypeCheckBox = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_label */
	xtype:'mxp_gc_xtype_checkbox',
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
				
		     },{
   				xtype:'textfield', 
				fieldLabel:this.labFieldLabel,
				ref:'labField',
				allowBlank:false,
		    }
    		 ];
    
    
this.on('render',this.setfieldId,this);
    
    
             mxp.widgets.XtypeCheckBox.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * xtype label - obj
 * {
 * 	"type":"text",
 *	"xtype":"label",
 *	"value":"${origin.DATA_RILEV}",
 *	"label":"Data Rilevazione"
 *	}
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	this.labField.setValue(o.label);
	this.setfieldId;
},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype checkbox - obj
 * {
 * 	"type":"text",
 *	"xtype":"checkbox",
 *	"fieldId": "CODICE"
 *	"label":"Data Rilevazione"
 *	}
 * 
 * */
getXtype:function(){
   
  o={
    	"type":"text",
    	"fieldId":this.idField.getValue(),
    	"label":this.labField.getValue(),
    	 "xtype":"checkbox"
   };
	return o;
},
/**
 * api: method[isValid]
 * Validate xtype label obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.labField.isValid() && this.idField.getValue())return true;
		return false;
},

/**
 * api: method[segUpdated]
 * Update the form on field change
 * 
 * */
segUpdated:function(){
	
	//this.setLabel();
	
},
/**
 * api: method[sopUpdated]
 * Update the form on field change
 * 
 * */
sopUpdated:function(){
	
this.setfieldId();
	
},
//Recupera il valore dal widget fields e lo setta!!
setfieldId:function(){
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

Ext.reg(mxp.widgets.XtypeCheckBox.prototype.xtype, mxp.widgets.XtypeCheckBox);


