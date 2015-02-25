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
 * @include src/Ext.ux/Spinner.js
 * @include src/Ext.ux/SpinnerField.js
 */
 
 
Ext.ns("mxp.widgets");

/**
 * GoeMobileWidgetPanel
 * Allow to create mobile widget
 * Map Panel is a specia widjet 
 * EXPECTED MODEL: 
 * {    "type":"geoPoint", 							//FISSO
 * 		"value":"${origin.the_geom}", 				//SEMPERE DALLA FONTE SEGNALAZIONI
 *		"xtype":"mapViewPoint", 					//FISSO
 *		"fieldId": "GEOMETRY", 						//SEMPRE DALLA FONTE SOPRALLUOGHI
 *		"attributes":{
 *			"editable":false,  						//OPTIONAL
 *			"disablePan":true,  					//OPTIONAL
 *			"description":"${origin.RIFIUTI_NO}",   //OPTIONAL
 *			"height":640,							//OPTIONAL
 *			"displayOriginalValue":true				//OPTIONAL
 *					}
 *				}
 * */
mxp.widgets.XtypeMap = Ext.extend(Ext.FormPanel,{

    /** api: xtype = mxp_gc_xtype_mapViewPoint */
	xtype:'mxp_gc_xtype_mapViewPoint',
	descrFieldLabel:"Description",
	editableFieldLabel:"Ediatable",
	panFieldLabel:"Allow Pan",
	zoomFieldLabel:"Allow Zoom",
	displayFieldLabel:"Dispaly Value",
	centerFieldLabel:"Center",
	centerMsgLabel:"Message",
	localizeFieldLabel:"Localize",
	localizeMsgLabel:"Message",
	zoomLevelLabel:"Zoom Level",
	mapHeightLabel:"Map heigth",
	//Utilizzat per ripulire i campi valori
   clV:new RegExp("^(\\${origin.)(.*)(})$"),
   jObj:null,
initComponent: function() {

this.items=[ {
   				xtype:'textfield', 
				fieldLabel:this.descrFieldLabel,
				ref:'descriptionField',
				allowBlank:true
				
		     },{
   				xtype:'checkbox', 
				fieldLabel:this.editableFieldLabel,
				ref:'editCk'
				
		    }
		    ,{
   				xtype:'checkbox', 
				fieldLabel:this.panFieldLabel,
				ref:'panCk'
				
		    }
		    ,{
   				xtype:'checkbox', 
				fieldLabel:this.zoomFieldLabel,
				ref:'zoomCk'
			},{
   				xtype:'checkbox', 
				fieldLabel:this.displayFieldLabel,
				ref:'origValCk'
				
		    },{
           	xtype:'compositefield',
           
           	items:[{
   				xtype:'checkbox',
				fieldLabel: this.centerFieldLabel,
				ref:'/centerCk',
				listeners:{
					check:function( o, checked ){
						if(checked)this.centerMsg.enable();
						else 	this.centerMsg.disable();					
					},scope:this
				}
				
		    },{
		    	xtype:'label',
		    	text:this.centerMsgLabel,
		    	style:{
		    		paddingTop:'3px'
		    	}
		    	
		    },{
   				xtype:'textfield',
				ref:'/centerMsg',
				disabled:true
				
		    }
		    ]},{
           	xtype:'compositefield',
           
           	items:[{
   				xtype:'checkbox', 
				fieldLabel:this.localizeFieldLabel,
				ref:'/localizeCk',
				listeners:{
					check:function( o, checked ){
						if(checked)this.localizeMsg.enable();
						else 	this.localizeMsg.disable();					
					},scope:this
				}
				
		    }
		    ,{
		    	xtype:'label',
		    	text:this.localizeMsgLabel,
		    	style:{
		    		paddingTop:'3px'
		    	}
		    	
		    },{
   				xtype:'textfield',
				ref:'/localizeMsg',
				disabled:true
				
		    }
		    ]},{
            	xtype: 'spinnerfield',
            	fieldLabel: this.zoomLevelLabel,
            	name: 'Map Height',
            	ref:'zoomLev',
            	minValue: 1,
            	maxValue: 30,
				value:18
           }
		    ,{
            	xtype: 'spinnerfield',
            	fieldLabel: this.mapHeightLabel,
            	name: 'Map Height',
            	ref:'heigthFild',
            	minValue: 300,
            	maxValue: 900,
				value:640
           }
			
    		 ];
    
    
//this.on('render',this.setLabel,this)
    
    
             mxp.widgets.XtypeMap.superclass.initComponent.call(this, arguments);
	
	
	
	},

/**
 * api: method[loadXtype]
 * Laad xt	ype mobile widget in form panel
 * Parameters:
 * xtype mapViewPoint - obj:
 *
 *					"type":"geoPoint",
 *					"value":"${origin.the_geom}",
 *					"xtype":"mapViewPoint",
 *					"fieldId": "GEOMETRY",
 *					"attributes":{
 *						"editable":false,
 *						"disablePan":true,
 *						"description":"${origin.RIFIUTI_NO}",
 *						"height":640,
 *						"displayOriginalValue":true
 *					}
 * 
 * */
loadXtype:function(o){
	this.jObj=o;
	if(o.attributes){	
		if(o.attributes.editable) this.editCk.setValue(o.attributes.editable);
		if(o.attributes.disablePan) this.panCk.setValue(!o.attributes.disablePan);
		if(o.attributes.disableZoom) this.zoomCk.setValue(!o.attributes.disableZoom);
		if(o.attributes.displayOriginalValue) this.origValCk.setValue(o.attributes.displayOriginalValue);
		if(o.attributes.description)this.descriptionField.setValue(o.attributes.description);
		if(o.attributes.height)this.heigthFild.setValue(o.attributes.height);
		if(o.attributes.zoom)this.zoomLev.setValue(o.attributes.zoom);
		if(o.localize){
			this.localizeCk.setValue(o.localize);
			this.localizeMsg.setValue(o.localizeMsg);
			}
		if(o.center){
			this.centerCk.setValue(o.center);
			this.centerMsg.setValue(o.centerMsg);
			}			
	}

},

/**
 * api: method[getXtype]
 * Create xtype mobile mapViewPoint from form panel
 * Return:
 *
 *					"type":"geoPoint",
 *					"value":"${origin.the_geom}",
 *					"xtype":"mapViewPoint",
 *					"fieldId": "GEOMETRY",
 *					"attributes":{
 *						"editable":false,
 *						"disablePan":true,
 *						"description":"${origin.RIFIUTI_NO}",
 *						"'height":640,
 *						"displayOriginalValue":true
 *					}
 * */
getXtype:function(){
   
   var attributes={
   	'editable':this.editCk.getValue(),
   	'disablePan':!this.panCk.getValue(),
   	'disableZoom':!this.zoomCk.getValue(),
   	'displayOriginalValue':this.origValCk.getValue(),
   	'height':this.heigthFild.getValue()
   	
   };
    if(this.zoomCk.getValue())attribute.zoom=this.zoomLev.getValue();
    if(this.descriptionField.getValue()) attributes.description=this.descriptionField.getValue();
   
   geom= this.getGeometryFields();
   var o={
    	"type":'geoPoint',
//    	"value":(this.isSegActive())? "${origin."+geom.value+"}":"",
        "value":(this.isSegActive())? "${origin.the_geom}":"",
    	"xtype":"mapViewPoint",
    	"fieldId":geom.fieldId,
    	"attributes":attributes
      	
   };
  if(this.localizeCk.getValue()){
  	o.localize=this.localizeCk.getValue();
  		o.localizeMsg=this.localizeMsg.getValue();
  };
  if(this.centerCk.getValue()){
  	o.center= this.centerCk.getValue();
  	o.centerMsg= this.centerMsg.getValue();
  	 }
   
	return o;
},
/**
 * api: method[isValid]
 * Validate xtype label obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	return true;
	
},

/**
 * api: method[fieldUpdated]
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

/*
 * Recupera le geometrie dai dal parent
 */
getGeometryFields:function(){
	
	var parent= this.findParentByType('mxp_gc_mobile_widget_panel');
 		
	value =      parent.fieldSelector.getValue(); 
	fieldId=	 parent.sopSelector.getValue();
	
	return  {
		"value":value,
		"fieldId":fieldId
		};
	
},
isSegActive:function(){
	
		var parent= this.findParentByType('mxp_gc_mobile_widget_panel');
		return !parent.fieldSelector.hidden;
		
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

Ext.reg(mxp.widgets.XtypeMap.prototype.xtype, mxp.widgets.XtypeMap);


