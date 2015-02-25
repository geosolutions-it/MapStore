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
mxp.widgets.XtypeSepIc = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_separatorWithIcon */
	xtype:'mxp_gc_xtype_separatorWithIcon',
	  labFieldLabel:"Label",
    valueFieldLabel:"Value of PriorityField",
	//Utilizzat per ripulire i campi valori
   clV:new RegExp("^(\\${origin.)(.*)(})$"),
   jObj:null,
initComponent: function() {


this.items=[ {	//contiene il valore del priority field 
   				xtype:'textfield', 
				fieldLabel:this.valueFieldLabel,
				ref:'valueField',
				disabled:true,
				allowBlank:false,
				
		     },{
   				xtype:'textfield', 
				fieldLabel:this.labFieldLabel,
				ref:'labField',
				allowBlank:false,
		    }
    		 ];
    
    
this.on('render',this.setPfield,this);
    
    
             mxp.widgets.XtypeSepIc.superclass.initComponent.call(this, arguments);
	
	
	
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
	this.valueField.setValue(o.value);

},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype separatorWithIcon - obj
 * {
 * 	"type":"text",
 *	"xtype":"label",
 *	"value":"${origin.DATA_RILEV}", //il prority field
 *	"label":"Data Rilevazione"
 *	}
 * 
 * */
getXtype:function(){
   
   o={
    	"type":"text",
    	"value":"${origin."+this.getPriorityField()+"}",
    	"label":this.labField.getValue(),
    	 "xtype":"separatorWithIcon"
   };
	return o;
},
/**
 * api: method[isValid]
 * Validate xtype separatorWithIcon obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.labField.isValid() && this.getPriorityField())return true;
		return false;
},

/**
 * api: method[fieldUpdated]
 * Update the form on field change
 * 
 * */
segUpdated:function(){
	
	this.setLabel();
	
},
/**
 * api: method[sopUpdated]
 * Update the form on field change
 * 
 * */
sopUpdated:function(){
	
	//this.setLabel();
	
},
//Recupera il valore dal priority fiesld e lo setta!!
setPfield:function(){
	 	if( pfield=this.getPriorityField())
	    this.valueField.setValue(pfield);
},

//Recupera il valore dal widget fields e lo setta!!
setLabel:function(){
	 var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.fieldSelector.getValue();
	    this.labField.setValue('${origin.'+val+'}');
},


getPriorityField:function(){
	
	if(Ext.getCmp('MainListResourceEditor') &&  Ext.getCmp('MainListResourceEditor').listIcon.getValue() ) return Ext.getCmp('MainListResourceEditor').listIcon.getValue();
	else return undefined;
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




Ext.reg(mxp.widgets.XtypeSepIc.prototype.xtype, mxp.widgets.XtypeSepIc);


