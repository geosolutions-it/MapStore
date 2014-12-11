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
 * @include src/mxp/widgets/geoCollect/GcMobileWidgetPanel.js
 * */

Ext.ns("mxp.widgets");


/**
 * GoeCollect Pre view Resource editor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcFormSegResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_formseg_resourcce_editor */
	xtype:'mxp_gc_formseg_resourcce_editor',
    
    seg_store:null,
    sop_store:null,
    pages_store:null,	
  	layout: 'border',
  	frame:true,
  	
initComponent: function() {                    
console.log('mxp_gc_form_resourcce_editor');
 //Nella preview ho solo questi widget!!
 this.allowedTypes= [
['textfield' , "Text Field"],
['textarea', "Text Area"],
['label', "Label"],
['separator', "Separator"],
['datefield', "Date Field"],
['checkbox', "Checkbox"],
['mapViewPoint', "Map"],
['photo',"Photo"],
['actionsend',"Action Send"],
['spinner',"Spinner"]
];
  
 
 //Configuri store per le pagine mantine il titolo e oggetto json con tutta la pagina
 this.pages_store=new Ext.data.JsonStore({fields:['title',{name:'_created',type:'boolean'}],proxy:new Ext.data.MemoryProxy()});
 
  
  this.tbar=[
  {
			xtype:'toolbar',
			
			items:[ '-',{
			                   xtype:'label',
			                   text:'Form Title '
			                    	
			                    },' ',{
			                    	ref:'//formTitle',
			                    	xtype:'textfield',
			                    	allowBlank:false
			                    	
			                    },'-',{
								ref:'//addP',
			 					text:'New Page',
                				iconCls: "add",
			                    tooltip: 'Create a new Page',
			                    handler: function(btn){ 
			                    		     this.pages_store.loadData([{title:"New Page",_created:true}],true);
					                   	 	 this.pageList.getSelectionModel().selectLastRow();;
			                    	                 	
			                    },scope:this
			                    },
				 			 {	
				 			 	ref:'//delP',
			 					text:'Delete Page',
                				iconCls: "delete",
			                    tooltip: 'Delete active Page',
			                    handler: function(btn){ 
			                    	
			                    	if(rec = this.pageList.getSelectionModel().getSelected()){
			                    			Ext.Msg.show({
  											 title:'Delete Page?',
   											msg: 'Would you like to delete your Page?',
  										 	buttons: Ext.Msg.YESNOCANCEL,
   											
   											fn: function(res){
   										
   										if(res=='yes'){
   											rec = this.pageList.getSelectionModel().getSelected();
   											if(rec) this.pages_store.remove(rec);	
   											//eliminate record nel pannello e resettare
   											
   											this.disableForm();
   											this.pageList.getSelectionModel().unlock();
   										}
   									},
   									scope:this,
   									animEl: 'elId',
  									icon: Ext.MessageBox.QUESTION
									});}
			                    	
			                    	
			                    		                    	
			                    },scope:this
			                    },'-',
			                    {
			                    ref:'//saveP',	
			 					text:'Save',
                				iconCls: "accept",
			                    tooltip: 'Save active Page',
			                    handler: function(btn){ 
			                    		      
			                    		      	Ext.Msg.show({
  									 		title:'Save Page?',
   											msg: 'Would you like to save your page?',
  											 buttons: Ext.Msg.YESNOCANCEL,
   									fn: function(res){
   										if(res=='yes'){
   											console.log(this.pageWidget.isValid());
   											if(this.pageWidget.isValid())this.sevePage();
   											 else Ext.Msg.alert('Status', 'Invalid page properties');   
   										}else if(res=='no'){
   											//se è nuovo devo eliminarlo
   											rec = this.pageList.getSelectionModel().getSelected();
   											if(rec.get('_created')===true)this.pages_store.remove(rec);
   											this.pageList.getSelectionModel().unlock();
   											this.pageList.getSelectionModel().clearSelections();
   							
   											this.disableForm();
   										}
   									},
   									scope:this,
   									animEl: 'elId',
  									icon: Ext.MessageBox.QUESTION
									});
									  },scope:this
			                    }
				]
	
			}
  
  ];
this.items=[

				{
              
              	region:'west',
				ref:'pageList',
				xtype:'grid',
				width: 130,
				collapsible:true,
				title: "Page List",
				store:this.pages_store,
				autoScroll:true,
				style:{padding:'2px'},
				frame:true,
				cm: new Ext.grid.ColumnModel([
					{id: "title", header: "Title", dataIndex: "title", sortable: false}
				 ]),
				 autoExpandColumn:'title',
				 sm: new  Ext.grid.RowSelectionModel({singleSelect:true,
				 	listeners:{
				 		rowselect:function(slm,idx,r){
				 			//abilito pannello per editing e blocco selezione!
				 			r.beginEdit();
				 			this.enableForm();
				 			this.pageWidget.loadPage(r.json);
			            	slm.lock();
				 		},scope:this			
				 	}
				 	}),
				 		bbar:{
			 		
			 		xtype:'toolbar',
			 		items:[ {
			 					text:'Check Form',
               					ref:'/../ckForm',
                				iconCls: "accept",
			                    tooltip: 'Check Preview Validity',
			                    handler: function(btn){ 
			                    	this.getResourceData();
			                    	Ext.Msg.alert('Status', 'Page valid:'+this.isValid()); 
			                    		                    	
			                    },scope:this}],
				 	
				 	
				 	}
				 	
				 	}
  	,{
  	region:'center',
  	xtype:'mxp_gc_mobile_widget_panel',
  	seg_store:this.seg_store,
  	sop_store:this.sop_store,
  	ref:'pageWidget',
  	disabled:true,
  	destLabel:'Origin Fields',
  	segHidden:true,
  	border:false,
  	allowedTypes:this.allowedTypes,
  	}];
  	
  	
//this.on('render',this.disableForm,this);  	
 	
		mxp.widgets.GcFormSegResourceEditor.superclass.initComponent.call(this, arguments);
	},
	
//Return a Form
getResourceData: function(){
	
	
	if(this.pages_store.getCount()==0)return null;
               var pages=[];
	this.pages_store.each(function(r){		
		pages.push(r.json);
	});
	
	return {id:1,name:this.formTitle.getValue(),pages:pages};
	 },//Attenzione lo puoi caricare solo dopo che sono arrivati gli store!!
loadResourceData: function(res){
       //Setto il titolo e la lista delle pagine
       this.formTitle.setValue(res.name);
       this.pages_store.loadData(res.pages);
              },
        	  
        	  //Condizioni di validità : La pagina deve avere almno un titolo e campo valido altrimenti è invalida
canCommit :function(){//Condizioni per sapere se è committabile 
                
                 return this.isValid();
                 },   

//Condizioni di validità per la form, 1) Deve avere tutti i campi del sopralluogo implementati altrimenti non è valida!!
//Condizione pesante da valitare devi ciclare fra tutte le pagine e  tutti i campi e controllare che siano presenti
//forse conviene fare un array dei campi e confrontarli uno ad uno bo :D
isValid:function() {
	//Se in editing non la valido
	if(this.ckForm.disabled)return false;
	//Se non ho nessuna pagina è valida vuol dire che non la vogliono mettere
	if(this.pages_store.getCount()==0) return true;
	//ho creato store con i nomi dei campi impostati nella form

	fId_str=this.getFieldsList();
	

	//recupero store dal pannello sotto rimuovo tutti i filtri se ce ne fossero
	sop=this.pageWidget.sop_store;
	sop.clearFilter();
	if(!this.formTitle.isValid())return false;
	//primo controllo se numero differente non posso accettare
	
	if(fId_str.getCount()<sop.getCount()&& false)return false
		else {   //cicli per controllare validita
			
			for(i=0, ilen=sop.getCount();i<ilen;i++){
				
			 if(fId_str.find('fId',sop.getAt(i).get('name'))==-1){
			 	fId_str.destroy();
			 	return false;
			 }
			
				
			}
			
		}    	
			fId_str.destroy();
		return true;
	 
},   

getFieldsList:function(){
	var send,photo;
		fId_str=st=new Ext.data.ArrayStore({fields:[{name:'fId',mapping:0}]});

	this.pages_store.each(function(r){		
		fs=r.json.fields;
		for(i=0,ilen=fs.length;i<ilen;i++){
			
			if(fs[i].fieldId)fId_str.loadData([[fs[i].fieldId]],true);
		}
		
	});return fId_str;
	
},
  
//gestiece configurazione interfaccia qunado vado in editing
enableForm:function(){
		this.pageWidget.enable();
		this.delP.enable(true);
		this.saveP.enable(true);
		this.addP.disable(true);
	    this.ckForm.disable(true);

		
		
		
},
//gestiece configurazione interfaccia qunado termino editing
disableForm:function(){
		this.cleanWidegtPanl();
		this.pageWidget.disable();
		this.delP.disable(true);
		this.saveP.disable(true);
		this.addP.enable(true);
	    this.ckForm.enable(true);
	
	
},

cleanWidegtPanl:function(){
	this.pageWidget.cleanAll();
},
//Aggiorna il widget corrente nella lista
sevePage:function(){
	rec = this.pageList.getSelectionModel().getSelected();	
	obj=this.pageWidget.getPage();
	rec.json=obj;
	rec.set('title',obj.title);
	rec.set('_created',false);
	rec.endEdit();
	rec.commit();
//	this.pages_store.fireEvent('datachanged',this.pages_store);
	this.pageList.getSelectionModel().unlock();
	this.pageList.getSelectionModel().clearSelections();
		
	this.disableForm();
},
//Updatea fli store
updateStore:function(seg,sop){
	this.pageWidget.updateStore(seg,sop);
	this.resetMe();		
},//ripulisce tutti i campi e gli store
resetMe:function(){
	this.pageList.getSelectionModel().unLock();
	this.pages_store.removeAll();
	this.formTitle.setValue('');
	this.disableForm();
	
}


});
Ext.reg(mxp.widgets.GcFormSegResourceEditor.prototype.xtype, mxp.widgets.GcFormSegResourceEditor);


