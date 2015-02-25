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
 *  @include widgets/geoCollect/GcMobileResourceEditor.js
 *  @include widgets/geoCollect/GcDbResourceEditor.js
 * 
 */

/**
 * Resource Editor for Mission geocollect
 * Allow to edit and commit changes for a GeoStore Resource
 * 
 */

mxp.widgets.GcResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_resource_editor */
	xtype:'mxp_gc_resource_editor',
	//Strings:
	jsonPanel:'Advanced Configuration',
	jsonToGuiBtnText:'Apply',
	jsonToGuiBtnTooltip:'Apply Configuration To User  Interface',
	guiToJSONBtnText:'Get',
    guiToJSONBtnTooltip:'Get Configuration  From User Interface',
    checkMissionBtn:"Validate",
    checkMissionBtnTooltip:"Validate Configuration",
    validateMsgValid:"Mission Template Valid",
    validateMsgInvalid:"Mission Template Invalid",
    validateMsgTitle:"Is Valid?",
	layout:'accordion',
	border:false,
	resource:null, // la risorsa caricata
	authParam:null,
	layoutConfig: {
        // layout-specific configs go here
        titleCollapse: true,
        hideCollapseTool:true,
        fill:true,
      
    },
	
initComponent: function() {
this.items=[{
	xtype:"mxp_gc_db_resource_editor",
	ref:"dbEdit",
	authParam:this.authParam,
	gcSource:this.gcSource,
	listeners:{
		ready:function(dbp){	
		this.mobEdit.setStore(dbp);	
		
		},
		change:function(dbp){
			this.mobEdit.updateStore(dbp);	
		},
		resLoaded:function(){
			//caricare le risorse in tutti i pannelli :-D
			//Va ritardato
			task= new Ext.util.DelayedTask(function(){
    			 this.mobEdit.loadResourceData(this.resource);
			 },this);
			task.delay(500);
		},
	 afterrender: function(me, eOpts){
                    me.header.on('mousedown',function(e){
                    if(!me.collapsed)  me.stopCollapse=true;//Blocca chiusura panel alemeno non posso chiudere accordion e ne ho uno sempre aperto
                });
                },
                beforecollapse: function(me, dir, an, opt){
                
                    if(me.stopCollapse){
                        me.stopCollapse=false;
                        return false;
                    }
                },	
	scope:this	
	}
},{
	xtype:'mxp_gc_mobile_resource_editor',
	ref:'mobEdit',
	listeners: {
                afterrender: function(me, eOpts){
                    me.header.on('mousedown',function(e){
                    if(!me.collapsed)  me.stopCollapse=true;
                });
                },
                beforecollapse: function(me, dir, an, opt){
                
                    if(me.stopCollapse){
                        me.stopCollapse=false;
                        return false;
                    }
                } 
                }
	
},//pannello con json modificabile a mano non so se 
 new Ext.form.FormPanel({
                frame:true,
                layout:'fit',
                xtype:'form',
                title: this.jsonPanel,
                iconCls:"gc_advanced_resource_edit",
                border:false,
                ref:'jsonP',
                listeners: {
                afterrender: function(me, eOpts){
                    me.header.on('mousedown',function(e){
                    if(!me.collapsed)  me.stopCollapse=true;
                });
                },
                beforecollapse: function(me, dir, an, opt){
                
                    if(me.stopCollapse){
                        me.stopCollapse=false;
                        return false;
                    }
                } 
                
                    
                },
                tbar:[	{xtype:'toolbar',
			 				items:[
			 				{
                                text:this.checkMissionBtn,
                                
                                tooltip: this.checkMissionBtnTooltip,
                                iconCls: "accept",
                                handler: function(btn){ 
                                    
                                    Ext.Msg.show({
                                        title:this.validateMsgTitle,
                                        msg:this.jsonP.canCommit()? this.validateMsgValid:this.validateMsgInvalid,
                                        animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
});
                                                                
                                },scope:this}, ]},'-',
			 				
			 				
			 				{
		       					text:this.guiToJSONBtnText,
			                    tooltip: this.guiToJSONBtnTooltip,
			                    iconCls: "gui_json",
			                    style:{'text indent':0},
			                    handler: function(btn){ 
			                    //Se sono in editing il bottone è disabilitato|| 
			             	
			                    			 this.getResourceData();
     			                    	 },
                                scope:this
			                    
			                  		},'-',{
		       					text:this.jsonToGuiBtnText,
			                    tooltip: this.jsonToGuiBtnTooltip,
			                    iconCls: "json_gui",
			                    handler: function(btn){ 
			                    //Se sono in editing il bottone è disabilitato|| 
			                   
			                    			this.loadResourceData(this.jsonP.getResourceData());
			                    	 },scope:this
			                    
			                  		}],
                items:[
               			
                {
                    xtype:'textarea',
                    name:'blob',
                    fieldLabel:null,
                    anchor: '100% 0',
                    allowBlank: true
                }],
                getResourceData: function(){
                    return this.getForm().getValues().blob;
                },
                loadResourceData: function(resource){
                    var f = this.getForm();
					f.setValues({blob:resource});
                },
                canCommit :function(){
                    var f = this.getForm().getValues().blob;
                    if (f.length<1)return false;
                    try{
                    var res= Ext.util.JSON.decode(f);}
                    catch (e){
                        return false;    
                    }
                    return true;
                }
            })

];	
mxp.widgets.GcResourceEditor.superclass.initComponent.call(this, arguments);	
},
//Ritorna json completo da salvare montando i vari pezzi
getResourceData: function(){
  	//Devo recuperare il titolo da fuori!!
  	 var	parent =this.findParentByType('mxp_geostoreresourceform');
  		if(parent && parent.general  && parent.general.getForm()){
  					catField=parent.general.getForm().getFieldValues();
  					
  					if(catField.name) tit= catField.name;
					if(catField.id)id=catField.id;
 }
 
  					var pr=new  OpenLayers.Format.JSON();    
        
                 	dbRes=this.dbEdit.getResourceData();
                    mobRes=this.mobEdit.getResourceData();
                  	a={id:""+id+"",title:tit};
                   	Ext.apply(a,dbRes);
                    Ext.apply(a,mobRes);
                    this.jsonP.loadResourceData(pr.write(a,true));
                  return pr.write(a,true);
  	
                   
                },
loadResourceData: function(resource){
                   		var pr=new  OpenLayers.Format.JSON();
    					res= pr.read(resource);
                   		this.resource=res;
                   	//	this.jsonP.loadResourceData(resource);		
                   		this.dbEdit.loadResourceData(this.resource.schema_seg);
                   //Carichi solo il db panle le altre vanno caricate dopo di lui
                },
canCommit :function(){
    //Se vogliamo che sia salvabile dobbiamo ritornare true anche se non valido, altrimenti il resource editor non salva
                   dbV=this.dbEdit.canCommit();
                   moV=this.mobEdit.canCommit();
                    if(dbV===true || moV ===true)return true;
                    return false;
                }

});

Ext.reg(mxp.widgets.GcResourceEditor.prototype.xtype, mxp.widgets.GcResourceEditor);