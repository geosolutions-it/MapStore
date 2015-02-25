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
mxp.widgets.XtypePhoto = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_photo */
	xtype:'mxp_gc_xtype_photo',
	labFieldLabel:"Action Text",
	//Utilizzat per ripulire i campi valori
   jObj:null,
   
initComponent: function() {

this.items=[
{
   				xtype:'textfield', 
				fieldLabel:this.labFieldLabel,
				ref:'labField',
				allowBlank:true,
		    }
    		 ];
    
    
             mxp.widgets.XtypePhoto.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * {
 *					"xtype":"photo",
 *					"text": ""
 * 	},
 *	
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	this.labField.setValue(o.text);
	
},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype label - obj
 * {
 * 	"type":"text",
 *	"xtype":"label",
 *	"value":"${origin.DATA_RILEV}",
 *	"label":"Data Rilevazione"
 *	}
 * 
 * */
getXtype:function(){
   
   o={
    	
    	"text":this.labField.getValue(),
    	"xtype":"photo"
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
	
	//if(this.labField.isValid())return true;
		//return false;
		return true;
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
	
	//this.setLabel();
	
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

Ext.reg(mxp.widgets.XtypePhoto.prototype.xtype, mxp.widgets.XtypePhoto);


