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
mxp.widgets.XtypeLabel = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_label */
	xtype:'mxp_gc_xtype_label',
	
	//Utilizzat per ripulire i campi valori
   clV:new RegExp("^(\\${origin.)(.*)(})$"),
   jObj:null,
   
initComponent: function() {

this.items=[{
   				xtype:'textfield', 
				fieldLabel:'Field ',
				ref:'idField',
				disabled:true,
				hidden:!this.isFielIdActive(),
				allowBlank:false
},			
{
   				xtype:'textfield', 
				fieldLabel:'Value',
				ref:'valueField',
				disabled:!this.isFielIdActive(),
				allowBlank:this.isFielIdActive()
				
		     },{
   				xtype:'textfield', 
				fieldLabel:'Label',
				ref:'labField',
				allowBlank:false,
		    }
    		 ];
    
    
this.on('render',this.setField,this)
this.on('render',this.setidField,this)
    
             mxp.widgets.XtypeLabel.superclass.initComponent.call(this, arguments);
	
	
	
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
	if(o.value)this.valueField.setValue(o.value);
	if(o.fieldId)this.setidField();
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
   
   this.jObj={
    	"type":null,
    	"value":this.valueField.getValue(),
    	"label":this.labField.getValue(),
    	 "xtype":"label"
   };
   if(this.isFielIdActive())this.jObj.fieldId=this.idField.getValue();
   	
	return this.jObj;
},
/**
 * api: method[isValid]
 * Validate xtype label obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	a= (this.isFielIdActive())? this.idField.isValid():true;
	b= (this.isSegActive())? this.valueField.isValid():true;
	if(this.labField.isValid() && b && a)return true;
		return false;
},

/**
 * api: method[segUpdated]
 * Update the form on field change
 * 
 * */
segUpdated:function(){
	
	this.setField();
	
},
/**
 * api: method[sopUpdated]
 * Update the form on field change
 * 
 * */
sopUpdated:function(){
	
	this.setidField();
	
},

setField:function(){
	 if(this.isSegActive())
	 	{parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.fieldSelector.getValue();
	    this.valueField.setValue('${origin.'+val+'}');}
	    
},
//Recupera il valore dal widget fields e lo setta!!
setidField:function(){
	 if(this.isFielIdActive())	
	 	{parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.sopSelector.getValue();
	    this.idField.setValue(val);}
},
isFielIdActive:function(){
	
		parent= this.findParentByType('mxp_gc_mobile_widget_panel');
		return !parent.sopSelector.hidden;
		
	},
isSegActive:function(){
	
		parent= this.findParentByType('mxp_gc_mobile_widget_panel');
		return !parent.fieldSelector.hidden;
		
		}
});

Ext.reg(mxp.widgets.XtypeLabel.prototype.xtype, mxp.widgets.XtypeLabel);


