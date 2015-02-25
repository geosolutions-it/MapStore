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
 
 /**
 * @include widgets/geoCollect/OptionsCreator.js
 **/
Ext.ns("mxp.widgets");

/**
 * GoeMobileWidgetPanel
 * Allow to create mobile widget
 * */
mxp.widgets.XtypeSpinner= Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_spinner */
	xtype:'mxp_gc_xtype_spinner',
	idFieldLabel:"Field",
    labFieldLabel:"Label",
    optFieldLabel:"Options",
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
		    },{
   				xtype:'mxp_gc_options', 
				fieldLabel:this.optFieldLabel,
				ref:'optField'
			}
		     ];
    
    
this.on('render',this.setidField,this);

    
             mxp.widgets.XtypeSpinner.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * xtype spinner - obj
 *{
 *	"fieldId": "PRESA_IN_CARICO",
 *	"type":"text",
 *	"xtype":"spinner",
 *	"label":"Presa in Carico",
 *	"options":["Rilevatore ","Ufficio afferente"]
 *				}
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	if(o.label){
	    this.labField.setRawValue(o.label);
	    }
	this.setidField();
	if(o.options)this.optField.loadOptions(o.options);
},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype spinner - obj
 *{
 *	"fieldId": "PRESA_IN_CARICO",
 *	"type":"text",
 *	"xtype":"spinner",
 *	"label":"Presa in Carico",
 *	"options":["Rilevatore ","Ufficio afferente"]
 *				}
 * e"
 *				 }
 * */
getXtype:function(){
  o={   
        "type":"text",
   		"fieldId":this.idField.getValue(),
    	"label":this.labField.getValue(),
    	"xtype":"spinner"
   };
   var opt=this.optField.getOptions();
  if(opt.length)o.options=opt;
   else if(this.valueField.getValue())o.value=this.valueField.getValue();

	return o
},
/**
 * api: method[isValid]
 * Validate xtype spinneer obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.labField.isValid()&&this.idField.isValid()&&this.optField.isValid())return true;
		return false;
},

/**
 * api: method[fieldUpdated]
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
//Recupera il valore dal widget fields e lo setta!!
setidField:function(){
	 var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.sopSelector.getValue();
	    this.idField.setValue(val);
},/**
 * api method[isDirty]
 * Check if the form has been modified
 * Return boolean
 */
isDirty:function(){
	   
    a=Ext.encode(this.jObj);
    b=Ext.encode(this.getXtype());
    return (a==b)? false:true;      }
});

Ext.reg(mxp.widgets.XtypeSpinner.prototype.xtype, mxp.widgets.XtypeSpinner);


