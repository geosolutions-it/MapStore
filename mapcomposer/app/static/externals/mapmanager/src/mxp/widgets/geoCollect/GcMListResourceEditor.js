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
 * GcMainListResourceEditor
 *
 */
mxp.widgets.GcMListResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_db_resourcce_editor */
	xtype:'mxp_gc_ml_resourcce_editor',
    
    store:null,
  	resource:null,
    resourceNotValid: "Resource not valid",
    id:'MainListResourceEditor',
    
initComponent: function() {
console.log("creo mxp_gc_ml_resourcce_editor");   
     //Setto le impostazioni di base del panel!!
this.frame=true;
this.layout='form';
this.border= false;

defaultComboList={
		                 	clearFilterOnReset:false,
		                 	displayField: 'name',
		                 	mode:'local',
		                 	editable : false,
							forceSelection : true, 
		    				triggerAction:'all',
		    				lastQuery:'',
		    				typeAhead:false,
		    				style: {
		          			  marginBottom: '5px'
        					}};


//Filtro lo store dai campi gemoetry

//creao i combo box
  this.listName= new Ext.form.ComboBox(Ext.apply(defaultComboList,{fieldLabel:'Name field',store:this.store}));
  this.listDescription= new Ext.form.ComboBox(Ext.apply(defaultComboList,{fieldLabel:'Description field',store:this.store}));
  this.listOrdering= new Ext.form.ComboBox(Ext.apply(defaultComboList,{fieldLabel:'Ordering field',store:this.store}));
  this.listIcon= new Ext.form.ComboBox(Ext.apply(defaultComboList,{fieldLabel:'Select icon field',store:this.store,
  listeners:{
	    select:function(a,rec,c){
		    this.addConFilter.enable();
		    this.filterContainer.removeAll();
			var flCt=	this.generatePrFieldFilter(rec);
		    this.filterContainer.add(flCt);
		    this.filterContainer.doLayout(); 
		 },scope:this} }));
//lo store va caricato
this.store.reload();

this.store.filter('localType',/^((?!PointPropertyType).)*$/);
this.items=[ {
                	xtype:'container',
       				collapsible: false,
        			layout:'form',
        			ref:'listsContainer',
        			items:[
        				this.listName,
        				this.listDescription,
        				this.listOrdering
        				]
        			},
                	{ //Contenitore per selezionare icona
                    	xtype:'fieldset',
                    	ref:'iconSet',
                   		title: 'Icon',
       					collapsible: false,
        				autoHeight:true,
        			
  						items :[
  							this.listIcon,
  						
		  					{
			                	xtype:'container',
			                	layout:'form',
			       				collapsible: false,
			        			autoHeight:true,
			        			ref:'/filterContainer'
		        			},
		        			{
			                    xtype: "button",
			                    ref:'/addConFilter',
			                    tooltip: 'Add conditionns',
			                    style: "padding-left: 2px",	
			                    iconCls: "add",
			                    disabled:true,
			                    handler: function(btn){    
				   					var	ltIcon=this.listIcon;
				    				//recuperi  ultimo filtro e controlli se valido prima di poter aggiungeren un'altro
				    				var filterArray=this.filterContainer.findByType('mxp_filterfield');
				    				var lastFilter=filterArray[filterArray.length - 1];
				    				if(lastFilter && !lastFilter.validateValue()){
				    					Ext.Msg.alert('Status',' Condition must be valid, needed condition type, value and color ');
				    					return;
				    				};
				    					idx =this.listIcon.store.find('name',ltIcon.getValue());
									var	rec=this.listIcon.store.getAt(idx);
				    					this.filterContainer.add(this.generatePrFieldFilter(rec));
				    					this.filterContainer.doLayout();  
				                    },
				                    scope: this
				                }
        			]},{
        				
        				xtype:'button',
        				text:'Validate',
			                    tooltip: 'Check Page Validity',
			                    iconCls: "accept",
			                    handler: function(btn){ 
			                    	Ext.Msg.alert('Status', 'Page valid:'+this.canCommit()); 
			                    		                    	
			                    },scope:this
        			}
               ];
              
                         
		mxp.widgets.GcMListResourceEditor.superclass.initComponent.call(this, arguments);
	},
	
	//aggiorna gli store locali
	updateStore:function(rawData){
		this.store.loadData(rawData);
		this.resetMe();
		this.store.filter('localType',/^((?!PointPropertyType).)*$/);
	},
	
	//genera la form  filtri
	
	generatePrFieldFilter:function(rec,filter){
		
		var filterContainer = new  mxp.widgets.FilterField  ({
                allowBlank: false,
                columnWidth: 1,
                selRecord:rec,
                attributes: rec.store ,
                filter: filter 
                });
          
		//Crei il pannellino con il meno
        var ct = new Ext.Container({
            layout: "column",
            items: [{
                xtype: "container",
                width: 28,
                height: 26,
                style: "padding-left: 2px",
                items: {
                    xtype: "button",
                    tooltip: 'Remove conditionns',
                    iconCls: "delete",
                    handler: function(btn){
                    	console.log("removecondition");
                    	var grandParent=btn.findParentByType('container').findParentByType('container');
                       	grandParent.removeAll(true);
                       	grandParent.destroy();
                    },
                    scope: this
                }
            }, filterContainer,
            ]
        });
      
        return ct;
},
/*    
 * 
 "nameField":"CODICE",		// Main text to be displayed on the main list
    "descriptionField":"NOTE",		// Secondary text to be displayed on the main list
    "priorityField":"GRAVITA",		// Field to be used to color the main list icon
    "priorityValuesColors":{		// Rules to be used to color the main list icon
   			 "elevata":"#FF0000",  // <priorityField value> : <color to use>
   			 "media":"#FF9933",
   			 "scarsa":"#FDF600",
   			 "area pulita":"#00FF00"
   		 },
    "orderingField":"CODICE",
*/
			//
	getResourceData: function(){
			                	
			                	jsonObj={
			                		"nameField":this.listName.getValue(),
			                		"descriptionField":this.listDescription.getValue(),
			                		"priorityField":this.listIcon.getValue(),
			                		"priorityValuesColors" : this.getPriorityValuesColors(),
			                		"orderingField":this.listOrdering.getValue()
			                	};
                 
                    return jsonObj;
                  
                },//Attenzione lo puoi caricare solo dopo che sono arrivati gli store!!
loadResourceData: function(resource){
                	this.resource=resource;
                	res=resource;
                	this.setComboValue(this.listName,res.nameField);
                	this.setComboValue(this.listDescription,res.descriptionField);
                	this.setComboValue(this.listIcon,res.priorityField);
                	this.setComboValue(this.listOrdering,res.orderingField);
                   	this.setPriorityValuesColors(res);	
                    
                },
                canCommit :function(){//Condizioni per sapere se è committabile 
                	//Deve avere selezionato tutto e avere alemno un filtro
                	
                	if(this.listName.getValue()&&this.listDescription.getValue()&&this.listIcon.getValue()&&this.listOrdering.getValue()&& this.validatePriority())
                	return true;
                	else
                	return false;
                	
                },                
                    
                //genera oggetto con condizioni e colori
    getPriorityValuesColors:function(){
    	obj={};
    	var filterArray=this.filterContainer.findByType('mxp_filterfield');	
				    for(i=0;i<filterArray.length;i++){
				    	filter=filterArray[i].filter;
				    	//console.log(filter);
				    	obj[filter.value]=(filter.color.indexOf('#')==0)?filter.color:'#'+filter.color;
				}
	return obj
    }  ,     
    //genera le condizioni se esiste il campo   
    setPriorityValuesColors:function(res){
  
    	var filterArray=this.filterContainer.findByType('mxp_filterfield');	
    	rec=filterArray[0].selRecord;
		//Se il campo priorityField == a quello slezionato carico le condizioni
		if(res.priorityField==this.listIcon.getValue()){
			rec=filterArray[0].selRecord;
				if(filterArray[0])filterArray[0].findParentByType('container').destroy();
			obj=res.priorityValuesColors;
				  Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
  				var filter=new OpenLayers.Filter.Comparison({
							property:res.priorityField,
							type: OpenLayers.Filter.Comparison.EQUAL_TO,
							name:res.priorityField,
							value:val,
							color:obj[val]		
					});
				    this.filterContainer.add(this.generatePrFieldFilter(rec,filter));
				    	},this);
				}

    }  ,        
                
                //contorlla se esiste almeno una condizione
                
                validatePriority:function(){
                	
    	var filterArray=this.filterContainer.findByType('mxp_filterfield');
                	if(filterArray[0]&&   filterArray[0].validateValue())    
                	return true;
                	else return false;      	
                	
                },
       //Se il trova il valore lo setta!!         
      setComboValue:function(combo,val){
		idx =combo.getStore().find('name',val);
		if(idx > -1){//SE TROVO PER TYPENAME ALLORA SETTO
			rec=combo.getStore().getAt(idx);
			combo.setValue(rec.get("name"));
			 combo.fireEvent("select",
			 combo, rec, idx);
			return true;	
		}else {	
		combo.reset();
			return false;
		}
	},          
//Elimina tutti i campi
 resetMe:function(){
 this.listName.clearValue();
  this.listDescription.clearValue();
  this.listOrdering.clearValue();
  this.listIcon.clearValue();
  this.filterContainer.removeAll();
 }
});
Ext.reg(mxp.widgets.GcMListResourceEditor.prototype.xtype, mxp.widgets.GcMListResourceEditor);


