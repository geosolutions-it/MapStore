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
 * @include src/mxp/widgets/geoCollect/GcMListResourceEditor.js
 * @include src/mxp/widgets/geoCollect/GcPViewResourceEditor.js
 * @include src/mxp/widgets/geoCollect/GcFormResourceEditor.js
 */



Ext.ns("mxp.widgets");


/**
 * GoeCollectDBResourceEditor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcMobileResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_mobile_resourcce_editor */
	xtype:'mxp_gc_mobile_resourcce_editor',
    
    
initComponent: function() {
console.log("mxp_gc_mobile_resourcce_editor");		
      
//Setto le impostazioni di base del panel!!
this.iconCls='resource_edit';
this.title='Mobile';
this.border= false;
this.autoScroll=true;
this.disabled=true;
this.layout='fit',
this.frame=true,

this.items=[{
	
	ref:'tabbi',
	xtype:'tabpanel',
	autoDestroy: false,
	items:[]
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
		
		this.tabbi.add({xtype:'mxp_gc_ml_resourcce_editor',title:'MainList',store:dbp.getSeg_Store(),ref:'/mList'});
		this.tabbi.add({xtype:'mxp_gc_pview_resourcce_editor',title:'Preview',seg_store:dbp.getSeg_Store(),sop_store:dbp.getSop_Store(),ref:'/pView'});
		this.tabbi.add({xtype:'mxp_gc_form_resourcce_editor',title:'Form sop',seg_store:dbp.getSeg_Store(),sop_store:dbp.getSop_Store(),ref:'/pForm'});
		this.tabbi.add({xtype:'mxp_gc_formseg_resourcce_editor',title:'Form seg',seg_store:dbp.getSop_Store(),sop_store:dbp.getSeg_Store(),ref:'/pFormseg'});//GLi passo store invertiti!!
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
	             console.log(pvRes);
	             frRes=this.pForm.getResourceData();
	             frSeg=this.pFormseg.getResourceData();
             	 res=Ext.apply(mlRes,pvRes);
             	 res.form_sop=frRes;
             	 if(frSeg)res.form_seg=frSeg;
             	 return res;
                },              
                    
loadResourceData: function(resource){
	
	this.mList.loadResourceData(resource);
	if(resource.preview)this.pView.loadResourceData(resource.preview);
	if(resource.form_sop)this.pForm.loadResourceData(resource.form_sop);
	if(resource.form_seg)this.pFormseg.loadResourceData(resource.form_seg);
	//Per caricare le risorse devi prima caricare il pannello db poi caricare il resto
		
	
},
 
canCommit :function(){
	
	if(this.mList.canCommit() && this.pView.canCommit() && this.pForm.canCommit() && this.pFormseg.canCommit())return true;
	else return false;	
},

});
Ext.reg(mxp.widgets.GcMobileResourceEditor.prototype.xtype, mxp.widgets.GcMobileResourceEditor);


