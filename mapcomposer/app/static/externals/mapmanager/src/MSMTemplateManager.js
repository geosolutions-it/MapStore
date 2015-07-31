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
 * Class: MSMTemplateManager
 * Template form panel that includes the templates grid and the template editor.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
MSMTemplateManager = Ext.extend(Ext.form.FormPanel, {

 	/** xtype = msm_templatemanager **/
    xtype: "msm_templatemanager",

	title: "Template Manager",
    
    /** api: config[adminUrl]
     *  ``String``
     *  URL of OpenSDI-Manager2
     */
    adminUrl: "/opensdi2-manager/",
            
    /**
	 * Property: pageSize
	 * {int} templates grid page size
	 * 
	 */			
	pageSize: 50,

	/** api: config[collapseModes]
	 *  ``Array``
	 *  With allowed collapse modes.
	 */
	collapseModes:[{
		name: "default",
		label: "default",
		value: "default"
	},{
		name: "mini",
		label: "mini",
		value: "mini"
	}],


	layout:'border',
	// layout:'column',
	defaults: {
	    split: true
	},

    categoryName: "TEMPLATE",
	currentFilter: "",
	auth: null,
	geoStoreBase: null,
	url: null,
	searchUrl: null,

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
    	var me = this;
    	this.items = [];
					
        // create a content provider with init options
		this.templates = new GeoStore.Templates({
			authorization: this.auth,
			url: this.url
			}).failure( function(response){ 
				Ext.Msg.show({
                   title: me.failSuccessTitle,
                   msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                });
		});

    	this.items.push({
    		xtype: "panel",
    		region:"west",
            width:580,
            layout:'fit',
            collapsible:true,
    		items:[{
                    target:this.target,
					xtype: 'msm_templategrid',
					searchUrl: this.searchUrl,
					ref: "../templateGrid",
					categoryName: this.categoryName,
					auth: this.auth,
					pageSize: this.pageSize,
	    			login: this.login,
	    			geoBaseMapsUrl: this.url,
                    scope: this,
		            listeners: {
		            	'rowclick': this.templateClick, 
						'delete_template': function(response){
							this.templatePanel.onReset();
						},
			            scope: this
		            }
				}]
    	});

		this.items.push({
    		xtype: "panel",
    		
    		region: 'center',
    		ref: "east",
    		// split: true,
	    	collapsible: false,
			autoScroll: true,
    		// collapseMode: "mini",
    		items:[{
            	// columnWidth: 0.50,
    			xtype: 'tabpanel',
	    		activeTab: 0,
				// 
	    		items:[{
                    autoScroll: true,
					target:this.target,
	    			xtype: "msm_templatepanel",
    				ref: "../../templatePanel",
	    			templates: this.templates,
	    			formContainer: this,
	    			login: this.login,
	    			geoStoreBase: this.geoStoreBase,
	    			actionURL: this.adminUrl + "mvc/fileManager/extJSbrowser",
            		mediaContent: this.mediaContent,
	    			listeners:{
	    				success: function(){
	    					// refresh the grid
			                this.templateGrid.refresh();
	    				},
	    				scope: this
	    			}
	    		}]
    		}]
    	});
		
        MSMTemplateManager.superclass.initComponent.call(this, arguments);
    },

    templateClick: function(grid, rowIndex, columnIndex, e){
    	var me = this;

    	var record = grid.store.getAt(rowIndex);
    	var templateId = record.get("id");
    	var templateName = record.get("name");
    	var templateDescription = record.json.description;

		Ext.Ajax.request({
			url: this.geoStoreBase + "data/" + templateId,
			method: 'GET',
			scope: this,
            headers:{
                'Authorization' : this.auth,
                'Accept' : 'application/json'
            },
			success: function(response, opts){      
			  
				var templateConfig;
				try{
				  templateConfig = Ext.util.JSON.decode(response.responseText);
				}catch(e){
				  Ext.Msg.show({
						title: "Startup",
						msg: "An error occurred while parsing the template configuration: " + response.status,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
				  });
				}

				// load data on template panel
				me.templatePanel.loadData({
					id: templateId,
					name: templateName,
					description: templateDescription,
					data: templateConfig && templateConfig.data ? templateConfig.data : templateConfig
				});
			},
			failure:  function(response, opts){
				Ext.Msg.show({
					title: "Startup",
					msg: "An error occurred while getting the template configuration: " + response.status,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		});
    }
});

/** api: xtype = msm_templatemanager */
Ext.reg(MSMTemplateManager.prototype.xtype, MSMTemplateManager);