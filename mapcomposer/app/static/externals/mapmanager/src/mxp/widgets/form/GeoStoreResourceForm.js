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
 * Generic Resource Editor for GeoStore
 * Allow to edit and commit changes for a GeoStore Resource
 * 
 */
mxp.widgets.GeoStoreResourceForm = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_geostore_category_manger */
	xtype:'mxp_geostoreresourceform',
    category:'MAP',
     //ResourceEditor can be plugged to customize 
    //the resource stored data. It must implement 2 methods: 
    // getResourceData() and 
    // loadResourceData(resource) --> return data string
    // canCommit --> return true if the resource is valid
    /** api: config[resourceEditor]
     *  ``Object``
     * The Pluggable Resource Editor. If null the default one (a form with a text area) is used.
     * This object needs 3 methods: 
     * getResourceData() : returns the string of the resource
     * loadResourceData(resource) : load the resource in the component (typically a form)
     * canCommit() : return true if the resource edited is valid (typically check the internal form validity)
     */
    resourceEditor: null,
    /** api: config[forceUpdateStoredData]
     * ``boolean`` if true, force a second call to the /data service of GeoStore to commit the Stored Data.
     * this is needed because GeoStore service at the current time, doesn't update stored data in the resource 
     * udate service
     */
    forceUpdateStoredData:true,
    hideId: true,
    //Can Be everyone to load resource with visibility everyone
    defaultGroupVisibility:null,
    //i18n
	dataFieldLabel: 'Resource',
	nameLabel: 'Name',
    textAttribute: 'Attributes',
    textGeneral: 'General',
	descriptionLabel: 'Description',
    visibilityLabel:'Visibility',
    textSave: 'Save',
    savingMessage:"Saving...",
    loadingMessage: "Loading...",
    saveSuccessTitle:"Saved",
    saveSuccessMessage:"Resource saved succesfully",
    failSaveTitle: "Failed Saving resource",
    resourceNotValid: "Resource not valid",
    deleteSuccessMessage: "Resource Deleted Successfully",
    permissionTitleText: "Permissions",
    generalPanelHeight: 165,
    
	initComponent: function() {
		var values = this.values ||{
            category:this.category
        };
        
        this.addEvents(
            /**
             * @event save
             * Fires after save.
             * @param {Ext.DataView} this
             * @param {id} the id of the saved resource
             */
            "save",
            /**
             * @event delete
             * Fires after delete.
             * @param {Ext.DataView} this
             */
            "delete"
        
        );
        // initialize resource manager
        this.resourceManager = new GeoStore.Resource({
            authorization: this.auth,
            url: this.geoStoreBase + 'resources'
        });
        //the resource editor is a text editor by default
		
			this.resourceEditorContainer =new Ext.Panel({
			  xtype: 'panel',
              region:'center',
			  frame:true,
              layout:'fit',
			  iconCls:'resource_edit',
			  ref:'../resource',
			  id: 'attributes-field-set',
			  title:this.dataFieldLabel,//i18n
			  border: false,
			  autoScroll:true,
              getResourceEditor:function(){
                    return this.items.items[0];
              }
			});
        if(!this.resourceEditor){
        //you can override passing the resource editor, now is a tab
        //define this with methods getResourceData(resource) and loadResourceData(resource)
        //getResourceData MUST edit resource.blob field
            this.resourceEditor = new Ext.form.FormPanel({
                frame:true,
                layout:'fit',
                xtype:'form',
                border:false,
                items:{
                    xtype:'textarea',
                    name:'blob',
                    fieldLabel:null,
                    anchor: '100% 0',
                    allowBlank: true
                },
                getResourceData: function(){
                    return this.getForm().getValues().blob;
                },
                loadResourceData: function(resource){
                    var f = this.getForm();
					f.setValues({blob:resource});
                },
                canCommit :function(){
                    var f = this.getForm();
                    return f.isValid();
                }
            });
            
		}
        this.resourceEditorContainer.add(this.resourceEditor);
        
        //set generic GeoStore Resource fields form
		if(!this.genericFields){
			this.genericFields = [
              {
					xtype: "textfield",
					name: "id",
                    fieldLabel:"ID",
                    anchor:'95%',
                    readOnly:true,
					hidden: this.hideId,
					value: values.id
			  },{
					xtype: "textfield",
					name: "category",
                    anchor:'95%',
					hidden: true,
					value: values.category
			  },{
					xtype: 'textfield',
					maxLength: 200,
                    anchor:'95%',
					name: "name",
					fieldLabel: this.nameLabel,
					value: values.templateName,
                    allowBlank:false
			  }, {
					xtype: 'textarea',
					maxLength: 200,
                    anchor: '95%',
					name: "description",
					fieldLabel: this.descriptionLabel,
					readOnly: false,
					hideLabel : false,
					value: values.description
			  }
			];
		
		}
        if(!this.attributeFields){
        this.attributeFields = [];
        }
		var mainPanel = {
			xtype:'panel',
            layout:'border',
			border:false,
			items:[{
			  frame:true,
              xtype:'form',
			  layout:'column',
              region:'north', 
              ref:'resourceform',
			  id: 'name-field-set',
			  ref:'../general',
			  border: false,
			  collapsible:true,
              height:this.generalPanelHeight || 165,
              title:this.textGeneral,
              iconCls:'table_edit',
                autoScroll:true,
			  items: [{
                    xtype:'panel',
                    autoScroll:true,
                    layout:'form',
                    columnWidth:.5,
                    items:this.genericFields
                },{
                    xtype:'panel',
                    ref:'attributeColumn',
                    columnWidth:.5,
                    layout:'form',
                    items:this.attributeFields
              }]
			},this.resourceEditorContainer
            ]
		};
		
		this.items = [mainPanel];
        this.bbar = [ "->",
            //SAVE
            {
                text: this.textSave,
                tooltip: this.tooltipSave,
                ref:'../save',
                iconCls: "accept",
                id: "save-btn",
                scope: this,
                handler: function(){
                    this.saveResource();
                    
                }
            },
            //PERMISSION 
            {
                text: this.permissionTitleText,
                tooltip: this.permissionTitleText,
                ref:'../permission',
                iconCls: 'lock_ic',
                disabled:true,
                id: "permission-btn",
                scope: this,
                handler: function(){
                    var resource = this.getResource();
                    if(resource.id){
                        this.showPermissionPrompt(resource.id);
                    }
                    
                }
            }
        ];

		
		mxp.widgets.GeoStoreResourceForm.superclass.initComponent.call(this, arguments);
	},
    /**
     * Return the GeoStore Resource in the form
     */
    getResource : function(){
        var form = this.general.getForm();
        var values = form.getFieldValues();
        if (form.isValid() && this.resource.getResourceEditor().canCommit()){
            
            //get attributes with name attribute.<att_name>
            var attribute = {};
            for(var name in values ){
                var arr = name.split('.');
                if(arr.length >1 && arr[0]=='attribute'){
                    //special behiviour for dates
                    var value =values[name];
                    attribute[arr[1]] = {
                        name: name
                    }
                    if(value instanceof Date){
                      //TODO insert correct format
                      var field = form.findField(name);
                      if(field && field.format){
                        attribute[arr[1]].value = value.format(field.format);
                      }else{
                        attribute[arr[1]].value = value;
                      }
                    }else{
                      attribute[arr[1]].value = value
                    }
                }
            }
           var resource = {
				id: values.id,
                name: values.name,
                description: values.description,
                category: values.category,
				attributes: attribute
                
            };
            //if the resource editor has the metod, call it
            
            resource.blob = this.resource.getResourceEditor().getResourceData(resource);
            
            return resource;
        }else{
            Ext.Msg.show({
               title: this.failSaveTitle,
               msg: this.resourceNotValid,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            }); 
        }
        
    },
    /**
     * Delete the resource loaded (TODO test)
     * uses the id or the resource loaded, if id is null
     */
     /**
     * api: method[deleteResource]
     * Delete a resource.
     * Uses the id passed as parameter,or if the parameter is missing, the resource loaded
     * Parameters:
     * id - long -  The id of the resource to delete.
     */
    deleteResource: function(id){
        var resourceId = id;
        var me = this;
        if(!id){
            var resource = this.getResource();
            resourceId = resource.id;
        }
        if(resourceId){
            this.resourceManager.deleteByPk(resourceId, function(response){
                me.fireEvent("delete");
                Ext.Msg.show({
                   title: me.resourceDeletedTitle,
                   msg: me.deleteSuccessMessage,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.INFO
                }); 
            });
        }
    },
    /**
     * api: method[saveResource]
     * Save the resource in the form to GeoStore
     */
    saveResource: function(){
        var resource = this.getResource();
        //new resource
        var me = this;
        var finish = function(response){
            me.setLoading(false);
            me.saveSuccess();
            me.fireEvent("save",response);
            
        }
        var finishError = function(response){
            me.setLoading(false);
            me.fireEvent("save",null);
            Ext.Msg.show({
               title: me.failSaveTitle,
               msg: response.statusText + "(status " + response.status + "):  ",
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            }); 
        };
        var createFinish = function(response){
            console.log(response);  
            var win = me.showPermissionPrompt(response);
            finish(response);
        }
        //CREATE resource
        if(resource && !resource.id){
            //category must be indicated
            if(!resource.category || resource.category==""){
                //assign the catgory
                resource.category = this.category;
            }
            this.setLoading(true, this.savingMessage);
            this.resourceManager.create(resource,
                //SUCCESS
                createFinish,
                //FAIL
                finishError
                );
        //UPDATE resource
        }else if(resource && resource.id){
            this.resourceManager.update(resource.id,resource,
                //SUCCESS
                function(response){
                    if(me.forceUpdateStoredData){
                        me.forceUpdate(resource.id,resource.blob,finish,finishError);
                    }else{
                        finish(response);
                    }
            },finishError);
        }
        
    
    },
    /**
     * api: method[setLoading]
     * Load the resource in the form
     * Parameters:
     * record - {Ext.record} the record of GeoStore resource. must have id attribute at least
     * Return:
     */
    loadResource: function(record){
        //load record
        var resourceId
        if(record){
            resourceId = record.get('id');
            this.general.getForm().loadRecord(record);
        }
        
        if(resourceId){
            
            this.setLoading(true, this.loadingMessage);
            var me =this;
            this.resourceManager.findByPk(resourceId, 
                //Full Resource Load Success
                function(data){
                    //fill the form
                    if(!data){
                         Ext.Msg.show({
                           title: me.failSaveTitle,
                           msg: response.statusText + "(status " + response.status + "):  ",
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        }); 
                    }
                    var r2 = new record.store.recordType(data);
                    var form = me.general.getForm();
                    form.loadRecord(r2);
                    //fill attributes
                    var attributes = r2.get("attributes");
                    for(var attname in attributes){
                        var field = form.findField("attribute."+attname);
                        if(field){
                            field.setValue(attributes[attname].value);
                        }else{
                            //Add attribute field
                            me.general.attributeColumn.add({
                                xtype:'textfield',
                                id:'attribute.'+attname,
                                anchor:'95%',
                                fieldLabel: attname,
                                name:'attribute.'+attname,
                                value:attributes[attname].value
                            });
                            me.general.attributeColumn.doLayout();
                        }
                       
                    }
                    //load resource. If the editor has a load resource 
                    //method defined, call it to load the stored data 
                    // in the editor
                    me.resource.getResourceEditor().loadResourceData(r2.get('blob'));
                    //enable or disable save button
                    me.save.setDisabled(! (record.get('canEdit')===true) );
                    me.permission.setDisabled(! (record.get('canEdit')===true) );
                    me.setLoading(false);
                    //TODO load visibility
                },{full:true})
            
            
        }
        //get visibility
        
    },
    /**
     * private: method[setLoading]
     * Shows loading mask
     */
    setLoading: function(enable,message){
        if(enable && !this.myMask){
            this.myMask = new Ext.LoadMask(Ext.getBody(), {msg:message || this.loadingMessage});
            this.myMask.show();
        }
        if(!enable&& this.myMask){
            this.myMask.hide();
            this.myMask = null;
        }
        
    },

   /**
    * private: method[forceUpdate]
    *  Force Resource Data Update. (if GeoStore doesn't update data)
    */
     forceUpdate: function(id, blob,successCallback,failureCallback){    

        var method = 'PUT';
	  	var contentType = 'application/json';

        Ext.Ajax.request({
			url: this.geoStoreBase + "data/" + id,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.auth
           },
           params: blob,
           scope: this,
           success: function(responseText){
                successCallback(id);
           },
           failure: failureCallback
        }); 
    },
    saveSuccess: function(){
        Ext.MessageBox.show({
           title: this.saveSuccessTitle,
           msg: this.saveSuccessMessage,
           buttons: Ext.Msg.OK,
           icon: Ext.MessageBox.INFO
        }); 
    },
    /**
    * private: method[showPermissionPrompt]
    *  Show the permission prompt for the resource for witch 
    *  the id is a parameter
    * Parameters:
    * id - long - the id of the resource
    * Returns:
    * the window
    */
    showPermissionPrompt: function(id){
      var  winPermission = new mxp.widgets.ResourceGroupPermissionWindow({
            resourceId: id,
            title: this.permissionTitleText,
            auth: this.auth,
            geostoreURL: this.geoStoreBase,
            target: this.target
        });
        winPermission.show();  
        return winPermission;
    }
});
Ext.reg(mxp.widgets.GeoStoreResourceForm.prototype.xtype, mxp.widgets.GeoStoreResourceForm);