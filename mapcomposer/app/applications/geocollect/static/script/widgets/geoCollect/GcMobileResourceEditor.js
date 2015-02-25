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
 * @include widgets/geoCollect/GcMListResourceEditor.js
 * @include widgets/geoCollect/GcPViewResourceEditor.js
 * @include widgets/geoCollect/GcFormResourceEditor.js
 */



Ext.ns("mxp.widgets");


/**
 * GoeCollectDBResourceEditor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcMobileResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_mobile_resourcce_editor */
	xtype:'mxp_gc_mobile_resource_editor',
    title:'Mobile',
    previewTabTitle:"Short Preview",
    infoTabTitle:"Info",
    surveyTabTitle:"Survey Form",
    noticeTabTitle:"Notice Form",
    previewMsgTitle:"Attention",
    previewMsg:"Preview Must Be Valid To Proceed",
    initComponent: function() {
      
//Setto le impostazioni di base del panel!!
this.iconCls='gc-mobile-resource-edit';

this.border= false;
this.autoScroll=true;
this.disabled=true;
this.layout='fit',
this.frame=true,

this.items=[{
	
	ref:'tabbi',
	xtype:'tabpanel',
	autoDestroy: false,
	items:[],listeners:{
	    beforetabchange:function( me, newTab, currentTab ){
	        //Check is panel is dirty
	       if(currentTab){
	        if((currentTab.isXType( 'mxp_gc_form_resource_editor') || currentTab.isXType( 'mxp_gc_formseg_resourcce_editor'))&&currentTab.isDirty()){
	             
               currentTab.saveMe();
               return false;
	            
	        }
	        else if(currentTab.isXType( 'mxp_gc_pview_resource_editor') ){
	           if(currentTab.xpanelForm && !currentTab.xpanlForm.disabled &&  currentTab.xpanlForm.isDirty()){
	                currentTab.saveMe();
                        return false;
	               
	           }
                       
	        }
	        else  if(currentTab.isXType( 'mxp_gc_ml_resource_editor')&& !currentTab.canCommit() ){
	               
	                
                                    Ext.Msg.show({
                                        title:this.previewMsgTitle,
                                        msg:this.previewMsg,
                                        animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
                                    });
	               
	               return false;

	        }
	        
	        }
	        
	    },scope:this
	    
	},
	}];
                         
		mxp.widgets.GcMobileResourceEditor.superclass.initComponent.call(this, arguments);
	},
	
	//aggiorna gli store locali
	updateStore:function(dbp){
		this.pView.updateStore(dbp.seg_fieldStore.reader.raw.featureTypes[0].properties,dbp.sop_fieldStore.reader.raw.featureTypes[0].properties);
},
	
	//Setta lo store per il sistema e lo attiva
	setStore:function(dbp){
	
		this.enable();	
		
		this.tabbi.add({xtype:'mxp_gc_ml_resource_editor',title:this.previewTabTitle,store:dbp.getSeg_Store(),ref:'/mList'});
		this.tabbi.add({xtype:'mxp_gc_pview_resource_editor',title:this.infoTabTitle,seg_store:dbp.getSeg_Store(),sop_store:dbp.getSop_Store(),ref:'/pView'});
		this.tabbi.add({xtype:'mxp_gc_form_resource_editor',title:this.surveyTabTitle,seg_store:dbp.getSeg_Store(),sop_store:dbp.getSop_Store(),ref:'/pForm'});
		this.tabbi.add({xtype:'mxp_gc_formseg_resourcce_editor',title:this.noticeTabTitle,seg_store:dbp.getSop_Store(),sop_store:dbp.getSeg_Store(),ref:'/pFormseg'});//GLi passo store invertiti!!
		this.tabbi.doLayout();
		this.tabbi.setActiveTab(0);		
},
updateStore:function(dbp){
	this.mList.updateStore(dbp.seg_fieldStore.reader.raw.featureTypes[0].properties);
	this.pView.updateStore(dbp.seg_fieldStore.reader.raw.featureTypes[0].properties,dbp.sop_fieldStore.reader.raw.featureTypes[0].properties);
	this.pForm.updateStore(dbp.seg_fieldStore.reader.raw.featureTypes[0].properties,dbp.sop_fieldStore.reader.raw.featureTypes[0].properties);
	this.pForm.updateStore(dbp.sop_fieldStore.reader.raw.featureTypes[0].properties,dbp.seg_fieldStore.reader.raw.featureTypes[0].properties);
		},
	
getResourceData: function(){
	             mlRes= this.mList.getResourceData();
	             pvRes= this.pView.getResourceData();
	             frRes=this.pForm.getResourceData();
	             frSeg=this.pFormseg.getResourceData();
             	 res=Ext.apply(mlRes,pvRes);
             	 res.sop_form=frRes;
             	 if(frSeg)res.seg_form=frSeg;
             	 return res;
                },              
                    
loadResourceData: function(resource){
	
	this.mList.loadResourceData(resource);
	if(resource.preview)this.pView.loadResourceData(resource.preview);
	if(resource.sop_form)this.pForm.loadResourceData(resource.sop_form);
	if(resource.seg_form)this.pFormseg.loadResourceData(resource.seg_form);
	//Per caricare le risorse devi prima caricare il pannello db poi caricare il resto
		
	
},
 
canCommit :function(){
	
	if(this.mList.canCommit() && this.pView.canCommit() && this.pForm.canCommit() && this.pFormseg.canCommit()) return true;
	else return false;	
},

});
Ext.reg(mxp.widgets.GcMobileResourceEditor.prototype.xtype, mxp.widgets.GcMobileResourceEditor);


