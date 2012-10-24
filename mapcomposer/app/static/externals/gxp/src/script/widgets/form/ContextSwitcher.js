/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
	 * ``String`` The current Configuration (to set as selected).
     */
	 
	 /** api: config[saveMessage]
	 * ``boolean`` Add a save Message in the alert.
     */
	saveMessage:false,
	
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
	switchConfirmationText : "You are sure to change context?",
	switchSaveAlert: "All unsaved data will be lost.",
	
	/** api: config[width]
     *  ``int`` width of the text box. default is 200
     */
	width: 130,
	
	paramName:'config',
	
	/** api: config[data]
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
    initComponent: function() {
		
        this.store = new Ext.data.ArrayStore({
			combo:this,
			fields:this.fields,
			data:this.data,
			autoload:true,
			idIndex: 0
			
        });
		var record = this.store.getById(this.currentContext);
		if(record){
			this.setValue(record.get(this.displayField));
			return gxp.form.ContextSwitcher.superclass.initComponent.apply(this, arguments);
		}
		 
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
			Ext.Msg.show({
				title: cb.switchActionTip,
				msg: cb.switchConfirmationText +( cb.saveMessage ? " "+cb.switchSaveAlert : ""),
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
						var separator='';
						if(cb.paramName && cb.paramName!="" && c!=""){
							u+= '?'+cb.paramName+'=' + c;
							separator ='&';
						}else{
							u+='?';
						}
						
						//TODO make it use more than one parameter
						for(x in query) {
							if(x!=cb.paramName){
								u += separator +x+'=' + query[x];
								separator='&';
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
