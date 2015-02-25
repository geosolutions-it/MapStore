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
 * Composit field to create an otion list
 * Allow to create mobile widget
 * */
mxp.widgets.OptionsCreator = Ext.extend(Ext.form.CompositeField,{
    /** api: xtype = mxp_gc_otions */
	xtype:'mxp_gc_options',
	erroMsg:"Must not contain spaces",
	insertLabel:"Insert options",
	btnAddTooltip:"Add Options",
	btnRemoveTooltip:"Remove Options",
	
   
	fieldLabel:'Options',   
    
initComponent: function() {

Ext.apply(Ext.form.VTypes, {
                GCOPT: function(v) {
                    return  new RegExp("[A-Za-z0-9_éèàì',]","i").test(v);
                },
                GCOPTText: this.erroMsg,
                GCOPTMask: new RegExp("[A-Za-z0-9_éèàì',]","i")
           });

this.items=[ {
   				xtype:'combo',
   				displayField: "name",
           		valueField: "name",
				ref:'optList',
				 allowBlank: true,
    			mode: "local",
				queryMode: 'local',
				forceSelection: true,
   				 triggerAction: "all",
    			editable:false,
    			lastQuery:'',
    		
				store: new Ext.data.SimpleStore({
            	fields:["name"]
           			 }),
				
		     },{
		     	xtype:'label',
		     	text:this.insertLabel,
		     	style:{
		     		paddingTop:'5px',
		     	}
		     },{
   				xtype:'textfield', 
				ref:'optField',
				allowBlank:true,
				vtype:'GCOPT',
					width:200,
				listeners:{
					specialkey:function(f,e){
						if(e.getKey() == e.ENTER) {
						
						
						this.addOptions();
						}
					},scope:this
					
					
				}
		    },{                 xtype: "button",
			                    tooltip: this.btnAddTooltip,
			                    iconCls: "add",
			                    handler: function(btn){ 
			                    	this.addOptions();
			                    	
			                    	 },scope:this
			                    
			                    },
    						 { 
    						 	xtype: "button",
			                    tooltip: this.btnRemoveTooltip,
			                    iconCls: "delete",
			                    handler: function(btn){ 
			                    	this.optList.getStore().removeAll();
			                    	this.optList.clearValue();
			                    	this.optField.reset();
			                    	 },scope:this
			                    
			                    }
    		 ];
    
    

             mxp.widgets.OptionsCreator.superclass.initComponent.call(this, arguments);
	
	
	
	},
	
	
	addOptions:function(o){
		
		
	
	if(o){
		 var nOpt=[];
		Ext.each(o, function(r){
    			nOpt.push( [r]);
			});			
			this.optList.getStore().loadData(nOpt,true);
			this.optList.setValue(this.optList.getStore().getAt(0).get('name'));
		}
	else
		{
			var opt =this.optField.getValue();
			if(opt){
			
			optArr=opt.split(',');
			
			 var nOpt=[];
			Ext.each(optArr, function(r){
    			nOpt.push( [r]);
			});			
			this.optList.getStore().loadData(nOpt,true);
			this.optList.setValue(this.optList.getStore().getAt(0).get('name'));
			}}
		
	},

/**
 * api: method[otions]
 * Laad xtype mobile widget in form panel
 * Parameters:
 * "options":["Soggetto Pubblico","Soggetto Privato"]
 * 
 * */
loadOptions:function(o){
	//CARICA LE OPTIONS
	this.addOptions(o);
	return;

},

/**
 * api: method[getXtype]
 * Create xtype mobile widget from form panel
 * Return:
 * xtype label - obj
 * 
 * 
 * */
getOptions:function(){
   var options=[];
  
  this.optList.getStore().each(function(o){
  	options.push(o.get('name'));  	
  });
	return options;
},
/**
 * api: method[isValid]
 * Validate xtype label obj
 * Return:
 * true or msg
 * */
isValid:function(){
	
	if(this.optList.getStore().getCount()>0)
		return true; 
	else return false;	
}
});

Ext.reg(mxp.widgets.OptionsCreator.prototype.xtype, mxp.widgets.OptionsCreator);


