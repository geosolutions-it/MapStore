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
mxp.widgets.XtypeTextField = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_textfield */
	xtype:'mxp_gc_xtype_textfield',
	   idFieldLabel:"Field",
    labFieldLabel:"Label",
    valueFieldLabel:"Value",
    mandatoryFieldLabel:"Mandatory",
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
		    },

			{
   				xtype:'textfield', 
				fieldLabel:this.valueFieldLabel,
				ref:'valueField',
				allowBlank:true	
		     },{
   				xtype:'checkbox', 
				fieldLabel:this.mandatoryFieldLabel,
				ref:'mandCk'
				
		     },{
   				xtype:'mxp_gc_options', 
				fieldLabel:this.optFieldLabel,
				ref:'optField'
			}
		     ];
    
    
this.on('render',this.setidField,this);
this.on('render',this.setMandatory,this);
    
             mxp.widgets.XtypeTextField.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * xtype textfield - obj
 * {
 *	"fieldId": "NOME_RILEVATORE",
 *	"type":"person",
 *	"xtype":"textfield",
 *	"value":"${local.user_name}",
 *	"label":"Nome Rilevatore",
 * 	"mandatory":"true"
 *				 }
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	if(o.label)this.labField.setValue(o.label);
	this.setidField();
	if(o.value)this.valueField.setValue(o.value);
	if(!this.getMandatory())this.setMandatory();
	else if(o.mandatory) this.mandCk.setValue(o.mandatory);
	 if(o.options)this.optField.loadOptions(o.options);
},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype textfield - obj
 * {
 *	"fieldId": "NOME_RILEVATORE",
 *	"type":"person",
 *	"xtype":"textfield",
 *	"value":"${local.user_name}",
 *	"label":"Nome Rilevatore",
 * 	"mandatory":"true"
 *				 }
 * */
getXtype:function(){
   o={
   		"fieldId":this.idField.getValue(),
    	"type":this.getType(),
    	"label":this.labField.getValue(),
    	"xtype":"textfield",
    	"mandatory":(this.mandCk.getValue())?"true":"false"
   };
   var opt=this.optField.getOptions();
  if(opt.length)o.options=opt;
   else if(this.valueField.getValue())o.value=this.valueField.getValue();

	
	return o;
},
/**
 * api: method[isValid]
 * Validate xtype label obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.labField.isValid())return true;
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
	this.setMandatory();
	
},
//Recupera il valore dal widget fields e lo setta!!
setidField:function(){
	 var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.sopSelector.getValue();
	    this.idField.setValue(val);
},
//Recupera il valore dal widget fields e lo setta!!
setMandatory:function(){
	 	//Recupero il mandatory se il fild se è mandatory lo chekko e lo bolocco altrimenti la scelta è libera
	    if(!this.getMandatory()){
	    	this.mandCk.setValue(true);
	    	this.mandCk.disable();
	    }else this.mandCk.enable();
	   
},
//Recupera il valore dal widget fields e lo setta!!
setField:function(){
	 var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    val = parent.fieldSelector.getValue();
	    this.valueField.setValue('${origin.'+val+'}');
},
getMandatory:function(){
	
		var parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    rec= parent.fieldSelector.getStore().query('name',parent.fieldSelector.getValue());
	    nillable =rec.get(0).get('nillable');
	    return nillable;
	
},
getType:function(){
	
	var	parent= this.findParentByType('mxp_gc_mobile_widget_panel');
	    return parent.xdatatypeSelector.getValue();
	 
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

Ext.reg(mxp.widgets.XtypeTextField.prototype.xtype, mxp.widgets.XtypeTextField);


