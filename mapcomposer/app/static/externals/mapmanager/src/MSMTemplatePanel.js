/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 * Class: MSMTemplatePanel
 * Template editor panel.
 * 
 * Inherits from:
 *  - <Ext.form.FormPanel>
 *
 */
MSMTemplatePanel = Ext.extend(Ext.Panel, {

 	/** xtype = msm_templatepanel **/
	xtype: "msm_templatepanel",

	/** i18n **/
	title: "Template Editor",
    headerTitleText: "Header",
	headerCheckboxText: "Header",
    footerTitleText: "Footer",
    sectionContentTitleText: "{0} Content",
    sectionCSSTitleText: "CSS Style",
    sectionLayoutConfigTitleText: "Layout config",
    borderText: "Border",
    animeCollapseText: "Anim. Collapse",
    hideCollapseText: "Hide Collapse",
    splitText: "Split",
    collapsibleText: "Collapsible",
    collapseModeText: "Collapse Mode",
	widthText: "Width",
	heightText: "Height",
	minWidthText: "Min Width",
	maxHeightText: "Max Height",
    failSuccessTitle: "Error",
    mapMetadataTitle: "Save a template",
    mapMedatataSetTitle: "",
    mapNameLabel: "Name",
    mapDescriptionLabel: "Description", 
    addResourceButtonText: "Save",
    templateSuccessMsgText: "Saved succesfully",
    templateSuccessTitleText: "OK",
    newTemplateText: "New",
    saveTemplateText: "Save",
    /** EoF i18n **/

	/** api: config[collapseModes]
	 *  ``Array``
	 *  With allowed collapse modes.
	 */
	collapseModes:[{
		name: "default",
		label: "none",
		value: "default"
	},{
		name: "mini",
		label: "mini",
		value: "mini"
	}],

	// container to get form values
	formContainer: null,

	// login information
	login: null,

	// base url for update
	geoStoreBase: null,
    
    /** api: config[actionURL]
     *  ``String``
     *  URL to the extJSbrowser of OpenSDI-Manager2
     */
    actionURL: "/opensdi2-manager/mvc/fileManager/extJSbrowser",

    /** api: config[mediaContent]
     *  ``String`` relative for the media content in the upload panel
     */
    mediaContent: null,

    /**
    * Constructor: initComponent 
    * Initializes the component
    * 
    */
    initComponent : function() {

    	this.items = [{
			xtype: 'compositefield',
			fieldLabel: "Template Name",
			items:[{
				xtype: "textfield",
				name: "templateName"
			},{
				xtype: "button",
				text: this.newTemplateText,
				handler: this.onReset, 
				scope: this
			},{
				xtype: "button",
				text: this.saveTemplateText,
				handler: this.onSave, 
				scope: this
			}]
		},{
			xtype: "textfield",
			name: "id",
			hidden: true
		},{
			xtype: "textfield",
			name: "description",
			hidden: true
		},{
    		xtype: 'tabpanel',
    		activeTab: 0,
			items:[this.getTemplateSectionEditor('header'), this.getTemplateSectionEditor('footer')]
		}];
		
        MSMTemplatePanel.superclass.initComponent.call(this, arguments);
    },

    loadData: function(templateData){
		var form = this.formContainer.getForm();
    	// reset old content
    	form.reset();
		// Restore basic data
		form.setValues({
			// name/id/description
			templateName: templateData.name,
			id: templateData.id,
			description: templateData.description
		});
		// Restore more data
		try{
			var values = templateData.data && !templateData.data.footer ? JSON.parse(templateData.data): templateData.data;
			// form.loadRecord({
			form.setValues({
				// header
				header: values.header.html,
				headerCSS: this.cleanupStyle(values.header.css),
				headerBorder: values.header.container.border ? "on" : "off",
				headerChk: values.header.container.header ? "on" : "off",
				headerCollapsible: values.header.container.collapsible ? "on" : "off",
				headerCollapseMode: values.header.container.collapseMode,
				headerHideCollapse: values.header.container.hideCollapseTool ? "on" : "off",
				headerSplit: values.header.container.split ? "on" : "off",
				headerAnimeCollapse: values.header.container.animCollapse ? "on" : "off",
				headerMinWidth: values.header.container.minWidth,
				headerMaxHeight: values.header.container.maxHeight,
				headerHeight: values.header.container.height,
				headerWidth: values.header.container.width,
				// footer
				footer: values.footer.html,
				footerCSS: this.cleanupStyle(values.footer.css),
				footerBorder: values.footer.container.border ? "on" : "off",
				footerChk: values.footer.container.header ? "on" : "off",
				footerCollapsible: values.footer.container.collapsible ? "on" : "off",
				footerCollapseMode: values.footer.container.collapseMode,
				footerHideCollapse: values.footer.container.hideCollapseTool ? "on" : "off",
				footerSplit: values.footer.container.split ? "on" : "off",
				footerAnimeCollapse: values.footer.container.animCollapse ? "on" : "off",
				footerMinWidth: values.footer.container.minWidth,
				footerMaxHeight: values.footer.container.maxHeight,
				footerHeight: values.footer.container.height,
				footerWidth: values.footer.container.width,
			});
		}catch (e){
			console.error("Error parsing template data");
		}
    },

	// remove <style> and </style> tags
    cleanupStyle: function(cssText){
    	if(cssText){
    		if(cssText.indexOf("<style>") > -1){
    			cssText = cssText.replace("<style>", "");
    		}
    		if(cssText.indexOf("</style>") > -1){
    			cssText = cssText.replace("</style>", "");
    		}
    	}
    	return cssText;
    },

    onReset: function(){
    	// reset form content
    	this.formContainer.getForm().reset();
    },

    onSave: function(){
    	var values = this.formContainer.getForm().getValues();
    	var templateConfig = {
    		"header": {
			   "html": values.header,
			   "css": this.getStyle(values.headerCSS),
			   "container": {
					"border": values.headerBorder && values.headerBorder == "on",
					"header": values.headerChk && values.headerChk == "on",
					"collapsible": values.headerCollapsible && values.headerCollapsible == "on",
					"collapseMode":  values.headerCollapseMode,
					"hideCollapseTool": values.headerHideCollapse && values.headerHideCollapse == "on",
					"split": values.headerSplit && values.headerSplit == "on",
					"animCollapse": values.headerAnimeCollapse && values.headerAnimeCollapse == "on",
					"minWidth": values.headerMinWidth,
					"maxHeight": values.headerMaxHeight,
					"height": values.headerHeight,
					"width": values.headerWidth
			   }
			},   
    		"footer": {
			   "html": values.footer,
			   "css": this.getStyle(values.footerCSS),
			   "container": {
					"border": values.footerBorder && values.footerBorder == "on",
					"header": values.footerChk && values.footerChk == "on",
					"collapsible": values.footerCollapsible && values.footerCollapsible == "on",
					"collapseMode":  values.footerCollapseMode,
					"hideCollapseTool": values.footerHideCollapse && values.footerHideCollapse == "on",
					"split": values.footerSplit && values.footerSplit == "on",
					"animCollapse": values.footerAnimeCollapse && values.footerAnimeCollapse == "on",
					"minWidth": values.footerMinWidth,
					"maxHeight": values.footerMaxHeight,
					"height": values.footerHeight,
					"width": values.footerWidth
			   }
			}
    	};

		var blob = JSON.stringify(templateConfig);
        if(!values.id){
        	this.doCreate(values, templateConfig, blob);
        }else{
			this.doUpdate(values.id, blob);
        }
    },

	// include <style> and </style> tags
    getStyle: function(cssText){
    	if(cssText){
    		if(cssText.indexOf("<style>") < 0){
    			cssText = "<style>" + cssText;
    		}
    		if(cssText.indexOf("</style>") < 0){
    			cssText += "</style>";
    		}
    	}
    	return cssText;
    },

    // operation to save new templates
    doCreate: function(values, templateConfig, blob){

    	var me = this;
		
        var win = new Ext.Window({
		    title: this.mapMetadataTitle,
            width: 400,
            height: 200,
			layout: 'fit',
            resizable: false,
            items: [
                new Ext.form.FormPanel({
					border:false,
                    ref: "formPanel",
                    items: [
                        {
						  border:false,
                          xtype: 'fieldset',
                          title: this.mapMedatataSetTitle,
                          items: [
                              {
                                    xtype: 'textfield',
                                    width: 120,
                                    name: "name",
                                    fieldLabel: this.mapNameLabel,
                          			value: values.templateName
                              }, {
                                    xtype: 'textarea',
                                    width: 200,
									
                                    name: "description",
                                    fieldLabel: this.mapDescriptionLabel,
                                    readOnly: false,
                                    hideLabel : false,
                          			value: values.description
                              },{
									xtype: "textfield",
									name: "id",
									hidden: true,
                          			value: values.id
							  },{
									//use hiddend usergroupconmbobox
									//to get the usergroups before
									hidden:true,
									xtype:'msm_usergroupcombobox',
									anchor:'90%',
									autoload:true,
									url: this.geoStoreBase + "usergroups/",
									auth: me.target.auth,
									defaultSelection:'everyone',
									hiddenName:'groupId',
									maxLength:200,
									allowBlank:false,
									target: me.target
									
								}
                          ]
                        }
                    ]
                })
            ],
            bbar: new Ext.Toolbar({
                items:[
                    '->',
                    {
                        text: this.addResourceButtonText,
                        iconCls: "accept",
                        scope: this,
                        handler: function(){
                            win.hide(); 

                            var saveValues = win.formPanel.getForm().getValues();

                        	this.templates.create({ 
									name: saveValues.name, 
									owner: me.login.username,
									description: saveValues.description,
									blob: blob
								}, 
								function success(response){
									//update security rule to make it public 
									//response contains the id of the new resource
									if(saveValues.groupId && response){
										var reqBody='<ResourceList><Resource><id>'+response+'</id></Resource></ResourceList>';
										// request to /usergroups/update_security_rules/<GROUPID>/<canRead>/<canWrite>
										// to assign by default canread to everyone
										Ext.Ajax.request({
										   url: me.geoStoreBase + "usergroups/update_security_rules/"+saveValues.groupId+"/true/false",
										   method: 'PUT',
										   headers:{
											  'Content-Type' : 'text/xml',
											  'Authorization' : me.target.auth
										   },
										   params: reqBody,
										   scope: this,
										   success: function(response, opts){
												Ext.Msg.show({
												   title: me.templateSuccessTitleText,
												   msg: me.templateSuccessMsgText,
												   buttons: Ext.Msg.OK,
												   icon: Ext.MessageBox.INFO
												});
												me.fireEvent("success");	
										   },
										   failure:  function(response, opts) {
												Ext.Msg.show({
												   title: me.failSuccessTitle,
												   msg: me.userAlreadyTaken,
												   buttons: Ext.Msg.OK,
												   icon: Ext.MessageBox.ERROR
												});
												me.fireEvent("failure");
										   }
										});
										
									} else{
										Ext.Msg.show({
										   title: me.templateSuccessTitleText,
										   msg: me.templateSuccessMsgText,
										   buttons: Ext.Msg.OK,
										   icon: Ext.MessageBox.INFO
										});
										me.fireEvent("success");	
									}

								},
								function failure(response) {
									Ext.Msg.show({
									   title: me.failSuccessTitle,
									   msg: me.userAlreadyTaken,
									   buttons: Ext.Msg.OK,
									   icon: Ext.MessageBox.ERROR
									});
									me.fireEvent("failure");
					    	});
                            
                            win.destroy(); 
                        }
                    }
                ]
            })
        });
        
        win.show();
    },
    
    // operation to update template content
    doUpdate: function(templateId, blob){    

        var method = 'PUT';
	  	var contentType = 'application/json';

        Ext.Ajax.request({
			url: this.geoStoreBase + "data/" + templateId,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.target.auth
           },
           params: blob,
           scope: this,
           success: function(response, opts){                                                                       
				Ext.Msg.show({
				   title: this.templateSuccessTitleText,
				   msg: this.templateSuccessMsgText,
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.INFO
				});
				this.fireEvent("success");
           },
           failure:  function(response, opts){
				Ext.Msg.show({
				   title: this.failSuccessTitle,
				   msg: this.userAlreadyTaken,
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.ERROR
				});
				this.fireEvent("failure");
           }
        }); 
    },

    getTemplateSectionEditor: function(section){
    	var title = section == "header" ? this.headerTitleText : section == "footer" ? this.footerTitleText : section;
    	var sectionContentTitleText = String.format(this.sectionContentTitleText, title);
    	return {
			title: title,
			layout: "form",
			items:[{
				xtype: "fieldset",
				title: sectionContentTitleText,
				height: 240,
				items:[{
					xtype: "extendedhtmleditor",
					name: section,
					actionURL: this.actionURL,
					height: 190,
					anchor:'100%',
            		mediaContent: this.mediaContent
				}]
			},{
				xtype: "fieldset",
				title: this.sectionCSSTitleText,
				height: 240,
				items:[{
					xtype: "textarea",
					name: section + "CSS",
					height: 190,
					anchor:'100%'
				}]
			},{
				xtype: "fieldset",
				text: this.sectionLayoutConfigTitleText,
				layout: "table",
				 
                defaults: {
					layout: "form"
                },
				items:[{
                    
					xtype: "container",
					items:[{
						xtype: "checkbox",
						fieldLabel: this.borderText,
						name: section + "Border"
					},{
						xtype: "checkbox",
						fieldLabel: this.headerCheckboxText,
						name: section + "Chk"
					},{
						xtype: "checkbox",
						fieldLabel: this.collapsibleText,
						name: section + "Collapsible"
					},{
						xtype: "checkbox",
						fieldLabel: this.animeCollapseText,
						name: section + "AnimeCollapse"
					},{
						xtype: "checkbox",
						fieldLabel: this.hideCollapseText,
						name: section + "HideCollapse"
					},{
						xtype: "checkbox",
						fieldLabel: this.splitText,
						name: section + "Split"
					}]
				},{
					xtype: "container",
					items:[{
						xtype: "combo",
						fieldLabel: this.collapseModeText,
						width: 150,
						name: section + "CollapseMode",
						mode : 'local',
						lazyRender : false,
						allowBlank : false,
						typeAhead : true,
						triggerAction : 'all',
						forceSelected : true,
						autoLoad : true,
						displayField : 'label',
						valueField : 'value',
						value: 'default',
						editable : false,
						readOnly : false,
						store : new Ext.data.JsonStore({
							fields : [{
								name : 'name',
								dataIndex : 'name'
							}, {
								name : 'label',
								dataIndex : 'label'
							}, {
								name : 'value',
								dataIndex : 'value'
							}],
							data : this.collapseModes
						})
					},{
						xtype: "numberfield",
						fieldLabel: this.widthText,
						width: 150,
						name: section + "Width"
					},{
						xtype: "numberfield",
						fieldLabel: this.heightText,
						width: 150,
						name: section + "Height"
					},{
						xtype: "numberfield",
						fieldLabel: this.minWidthText,
						width: 150,
						name: section + "MinWidth"
					},{
						xtype: "numberfield",
						fieldLabel: this.maxHeightText,
						width: 150,
						name: section + "MaxHeight"
					}]
				}]
			}]
		};
    }
});

/** api: xtype = msm_templatepanel */
Ext.reg(MSMTemplatePanel.prototype.xtype, MSMTemplatePanel);