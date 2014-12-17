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
 * Generic GeoBatch Form to manage GeoBatch process lauches.
 * 
 * Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
mxp.widgets.GeoBatchRunForm = Ext.extend(Ext.Panel, {

    iconCls: 'update_manager_ic',
	
    /** api: xtype[geobatch_run_form]
     */
    xtype: 'geobatch_run_form',
	
    /** api: config[fileBrowserUrl]
     * ``string`` the url for the file browser
     */
    fileBrowserUrl: "mvc/fileManager/extJSbrowser",
	
     /** api: config[flowId]
     * ``string`` the id of the flow to run
     */
    flowId: null,
	
    /**
     * Regex to enable the Run Button
     * the regex work on the relative path of the file
     * as fileId is.
     */
    fileRegex: ".*",
	
    /** api: config[fileId]
     * ``string`` the id of the file to run.
     * 
     * e.g. /csv/myFile.csv
     */
    fileId: null,
	
    /** api: config[baseDir]
     * ``string`` baseDir to concatenate to the dir from the file browser
     * 
     * e.g. 
     * baseDir: "/var/data" 
     * fileId from Server "/csv/myFile.csv"
     * forwarded file path: "/var/data/csv/myFile.csv"
     */
    baseDir: '',
    
    events: [
        /** public event[success]
         * Fired when the flow starts successful
         *
         * arguments: 
         * ``string`` the id of the consumer
         */
        'success',
        /** event[fail]
         * Fired when the flow failed to run
         *
         * arguments:
         * ``string`` the server response
         */
        'fail'
	],
	
    layout: 'card',
	
	activeItem: 0,
	
	bodyStyle: "padding: 5px;",
	
    autoScroll: false,
	
    // i18n
    runButtonText: "Run",
	
    uploadButtonText: "Upload",
	
	selectButtonText: "Select",
	
	cancelButtonText: "Cancel",
	
    successText: "Success",
	
    errorText:"Error",
	
    runSuccessText: "The workflow has been started successfully<br/>",
    //end of i18n
    
    initComponent: function() {
		var decadConfig = {};		
		if(this.decadConfig){
			if(this.decadConfig.dataUrl){
				decadConfig.dataUrl = this.decadConfig.dataUrl;				
			}
			
		    if(this.decadConfig.dataUrl){
				decadConfig.layer = this.decadConfig.layer;				
			}
		}
	
		this.items = [{
			xtype: "panel",
			layout: "form",
			ref: "form",
			border: false,
			items: [{
				xtype: 'fieldset',
				title: "Region",
				collapsible: false,
				layout: 'fit',
				defaultType: 'radiogroup',
				items: [{
						name: 'region',
						columns: 1,
						hideLabel: true,
						ref: "../../region",
						items:[{
							boxLabel: "Distric Boundary", 
							name: 'region', 
							inputValue: "DISTRICT",
							checked: true
						},{
							boxLabel: "Province Boundary", 
							name: 'region', 
							inputValue: "PROVINCE"
						}],
						listeners:{
							scope: this
						}
					}]
				}, {
					xtype: 'fieldset',
					title: "Mask",
					collapsible: false,
					layout: 'form',
					defaultType: 'radiogroup',
					items: [{
						name: 'mask',
						columns: 1,
						hideLabel: true,
						ref: "../../mask",
						items:[{
							boxLabel: "Crop Mask", 
							name: 'mask', 
							inputValue: "STANDARD",							
							checked: true
						}, {
							boxLabel: "Disabled", 
							name: 'mask', 
							inputValue: "DISABLED"
						}, {
							boxLabel: "Custom", 
							name: 'mask', 
							inputValue: "CUSTOM"
						}],
						listeners:{
							scope: this,
							change: function(cmp, checked){
								if(checked.inputValue == "CUSTOM"){
									this.enableFileBrowser(true);
								}else{
									this.selectedFile.disable();
								}
							}
						}
					}, {
						xtype: "textfield",
						ref: "../../selectedFile",
						fieldLabel: "Selected SHP",
                        anchor:'100%',
						readOnly: true,
						disabled: true,
						listeners: {
							scope: this,
							focus: function(){
								this.enableFileBrowser(true);
							}
						}
					}]
				}, Ext.applyIf({
					xtype: "mapstore_decadfieldset",
					ref: "../decadFieldSet"
				}, decadConfig)
			]
		}, {
            xtype: "FileBrowser",
            border: false,
            layout: 'border',
            ref: 'fileBrowser',
            closable: true,
            closeAction: 'close',
            autoWidth: true, 
            header: false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            rootText: "root",
            readOnly: true,
            enableBrowser: false,
			path: this.path,
            enableUpload: false,
            mediaContent: this.mediaContent,
            url: this.adminUrl + this.fileBrowserUrl,
            listeners: {
                scope:this,
                afterrender: function(fb){
                    //auto select if fileId 
                    var sm = fb.fileTreePanel.getSelectionModel();
                    if(fb.refOwner.fileId){
                        var node = fb.fileTreePanel.getNodeById(fb.refOwner.fileId);
                        if(node && sm){
                            sm.select(node);
                        }
                    }
					
                    var selectBtn = fb.refOwner.select; 
					
                    //enable or disable button                    
                    sm.on('selectionchange', function(smod, node){                        
						var patt = new RegExp(this.fileRegex);
						var res = patt.test(node.id);
						if(res){
							selectBtn.setDisabled(false);
						}else{
							selectBtn.setDisabled(true);
						}                    
					}, this);
                }
            }
        }];
	
        this.buttons = [{
            text: this.uploadButtonText,
            ref: '../upload',
            iconCls: 'update_manager_ic',
			hidden: true,
            handler: function(btn){
				var filebrowser = btn.refOwner.fileBrowser;
                var pluploadPanel = new Ext.ux.PluploadPanel({
					autoScroll:true,
					layout: 'fit',
					url: filebrowser.url.substring(0, filebrowser.url.lastIndexOf('/')) + '/upload',
					multipart: true,
					listeners:{
						beforestart:function() {  
							var multipart_params =  pluploadPanel.multipart_params || {};
							Ext.apply(multipart_params, {
								folder: this.path
							})
							pluploadPanel.multipart_params = multipart_params;
						},
						fileUploaded:function(file) {
							this.fileBrowser.fileTreePanel.root.reload()
						},
						uploadcomplete:function() {
							
						},
						scope: this
					}
				});
				var win = new Ext.Window({
					title: this.uploadButtonText,
					width: 400,
					height: 300,
					layout: 'fit',
					resizable: true,
					items: [pluploadPanel]
				});
				
				win.show();
            },
			scope: this
        }, {
            ref: '../run',
            text: this.runButtonText,
            disabled: false,
            iconCls: 'update_manager_ic',
			scope: this,
            handler: function(btn){
				if(this.validateForm()){
					var filebrowser = btn.refOwner.fileBrowser;
					var node = filebrowser.fileTreePanel.selModel.getSelectedNode();
					btn.refOwner.runLocal(btn.refOwner.flowId, node);
				}else{
					Ext.Msg.show({
						title: "Form Validation",
						msg: "Some form fields are invalid!",
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});	
				}
            } 
        }, {
            ref: '../select',
            tooltip: this.selectButtonText,
            disabled: true,
			hidden: true,
            iconCls: 'accept',
			scope: this,
            handler: function(btn){
                var filebrowser = btn.refOwner.fileBrowser;
                var node = filebrowser.fileTreePanel.selModel.getSelectedNode();
				
				if(node && node.id){
					this.enableFileBrowser(false);
					this.selectedFile.setValue(node.id);
					this.selectedFile.enable();
				}				
            } 
        }, {
            ref: '../cancel',
            tooltip: this.cancelButtonText,
            disabled: false,
			hidden: true,
            iconCls: 'close',
			scope: this,
            handler: function(btn){
                this.enableFileBrowser(false);			
            } 
        }];
		
        mxp.widgets.GeoBatchRunForm.superclass.initComponent.call(this, arguments);       
    },
	
    /**
     * private method[validateForm]
     */
	validateForm: function(){
		return this.decadFieldSet.isValid();
	},
	
	/**
     * private method[enableFileBrowser]
     */
	enableFileBrowser: function(enable){	
		if(enable === true){
			this.layout.setActiveItem(1);
			
			this.buttons[0].show();
			this.buttons[1].hide();
			this.buttons[2].show();
			this.buttons[3].show();
		}else{
			this.layout.setActiveItem(0);
			
			this.buttons[0].hide();
			this.buttons[1].show();
			this.buttons[2].hide();
			this.buttons[3].hide();
		}

	},
    
    /**
     * public method[isForm]
     */
	isForm: function() {
		return true;
	},
	
	/**
     * private method[runLocal]
     */
    runLocal: function(flowId, node){
	
		var fileName = this.decadFieldSet.getFileName();
		
		var xmlData = 
			"<StatsBean>" +
				"<classifier>" + this.region.getValue().inputValue + "</classifier>" +
				"<forestMask>" + this.mask.getValue().inputValue + "</forestMask>" +
				"<ndviFileName>" + fileName + "</ndviFileName>" +
				"<forestMaskFullPath>"  + "file://" + this.baseDir + this.selectedFile.getValue() + "</forestMaskFullPath>" +
			"</StatsBean>";
		
        Ext.Ajax.request({
	       url: this.geoBatchRestURL + 'flows/' + flowId +'/run', 
	       method: 'POST',
	       headers:{
	          'Content-Type': 'application/xml',
	          'Accept': this.acceptTypes_,
			  // TODO:
	          'Authorization': this.authorization_ 
	       },
           xmlData: xmlData,
	       scope: this,
	       success: function(response, opts){
                this.fireEvent('success', response);
				this.onSuccess(response, opts);
	       },
	       failure: function(response, opts){
                this.fireEvent('fail', response);
				this.onFailure(response);
	       }
	    });
    },
	
    /**
     * private method[onFailure]
     * manage the negative response of Run call
     */
    onFailure : function(response){
        Ext.Msg.show({
            title: this.errorText,
            msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });	
    },
	
    /**
     * private method[onSuccess]
     * manage positive response of Run call (ID of the consumer)
     */
    onSuccess : function(response){
        Ext.Msg.show({
            title: this.successText,
            msg: this.runSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO  
        });	
    }    
});

Ext.reg(mxp.widgets.GeoBatchRunForm.prototype.xtype, mxp.widgets.GeoBatchRunForm);