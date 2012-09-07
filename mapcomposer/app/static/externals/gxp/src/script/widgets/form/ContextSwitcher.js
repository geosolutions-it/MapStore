/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.form
 *  class = ContextSwitcher
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: ContextSwitcher(config)
 *
 *  Creates a combo box that issues switch mapstore context
 *  It can switch trow various urls, templates, and change one GET parameter.
 *  eg. /mapcomposer/?config=myconf
 *      /mapcomposer/?config=myconf1
 *		/mapcomposer/viewer?config=myconf2
 *      ....
 *
 */   
gxp.form.ContextSwitcher = Ext.extend(Ext.form.ComboBox, {
    
    /** api: xtype = gxp_contextswitcher */
    xtype: "gxp_contextswitcher",
	mode:'local',
    triggerAction:'all',
	typeAhead: false,
	displayInfo: false,
	hideTrigger:false,
	forceSelection:true,
	editable:false,
	/** api: config[currentContext]
	 * If a template is not defined, this is the field to show.
     */
	
    /** api: config[displayField]
	 * If a template is not defined, this is the field to show.
     */
	valueField: "name",
	displayField: "name",
	/** api: config[recordModel]
	 *	
     */
	fields: ['id','name','base','newpar','description'],
	
	/** api: config[emptyText]
     *  ``String`` empty text for i18n 
     */
	emptyText: "Select Context",
	switchActionTip : "Switch Context",
	switchConfirmationText : "You are sure to change context? All unsaved data will be lost",
	/** api: config[width]
     *  ``int`` width of the text box. default is 200
     */
	width: 110,
	paramName:'config',
	/**
	 * eg. [["id","Default Viewer", "viewer","","descript"],
	 * ["id","Custom Viewer", "viewer","config","descript"] ,
	 * ["id","Custom Composer", "","config","descript"] ]
	 */
	data:[],
	/** api: config[tpl]
     *  ``Ext.XTemplate`` the template to show results.
     */
	

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function(arguments) {
		
        this.store = new Ext.data.ArrayStore({
			combo:this,
			fields:this.fields,
			data:this.data,
			autoload:true,
			idIndex: 0
			
        });
	
		 this.setValue(this.store.getById(this.currentContext).get(this.displayField));
         return gxp.form.ContextSwitcher.superclass.initComponent.apply(this, arguments);
		 
	},
	listeners:{
		scope:this,
		beforeselect: function(cb, record, index){
			
		   if(cb.getValue() == record.get(cb.valueField)){
		   
			  return false; 
		  }else{
			  cb.prev = cb.getValue();
		  }
		},   
		
		select: function(cb, record, index) {         
			
			
			
			
			/*
			if(code === 'fr'){
				switchActionTip = "Changement de contexte";
				switchConfirmationText = "Vous êtes certain que vous souhaitez modifier le contexte ? toutes les données non enregistrées seront a perdu";
			}else if(code === 'it'){
				switchActionTip = "Cambiamento contesto";
				switchConfirmationText = "Si è sicuri di voler cambiare contesto? I dati non salvati saranno persi";
			}
			*/
			Ext.Msg.show({
				title: cb.switchActionTip,
				msg: cb.switchConfirmationText,
				buttons: Ext.Msg.OKCANCEL,
				fn: function(buttonId, text, opt){
					var url = location.search;        
					if(url && url.substr(0,1) === "?"){
						url = url.substring(1);
					}

					var query = Ext.urlDecode(url); 
					
					if(buttonId === 'ok'){

						var c = record.get('newpar');
						var rurl = record.get('base');
						//if url present set it
						var u =(rurl&& rurl!="") ?rurl:location.pathname;
						if(cb.paramName && cb.paramName!=""){
							u+= '?'+cb.paramName+'=' + c;
						}else{
							u+='?';
						}
						//TODO make it use more than one parameter
						for(x in query) {
							if(x!=cb.paramName){
								u += '&'+x+'=' + query[x];
							}
						}

						location.replace(u);                                
					}else{																
						cb.setValue(cb.prev);
					}
				},
			    icon: Ext.MessageBox.QUESTION
			});  
		}
		
	}
	
	
	
});

Ext.reg(gxp.form.ContextSwitcher.prototype.xtype, gxp.form.ContextSwitcher);
