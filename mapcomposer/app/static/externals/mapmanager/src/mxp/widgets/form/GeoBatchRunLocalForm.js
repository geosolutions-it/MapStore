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
mxp.widgets.GeoBatchRunLocalForm = Ext.extend(Ext.Panel, {
    iconCls:'update_manager_ic',
    /** api: xtype[geobatch_run_local_form]
     */
    xtype:'geobatch_run_local_form',
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
    baseDir:'',
    
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
        'fail'],
    layout:'fit',
    autoScroll:false,
    // i18n
    runButtonText: "Run",
    uploadButtonText: "Upload",
    successText: "Success",
    errorText:"Error",
    runSuccessText: "The workflow has been started successfully<br/>",
    //end of i18n
    
    initComponent: function() {
        var me = this;
        //TODO AUTHORIZATION
        this.items = [{
            xtype: "FileBrowser",
            border:false,
            layout: 'border',
            ref:'fileBrowser',
            border:false,
            closable: true,
            closeAction: 'close',
            autoWidth: true, 
            // iconCls: "template_manger_ic",  // TODO: icon
            header: false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText,
            rootText:"root",
            // layout: "fit",
            // path:"root",
            readOnly:true,
            enableBrowser:false,
			path:this.path,
            enableUpload:false,
            //uploadUrl: uploadUrl,
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
                    var runBtn = fb.refOwner.run; 
                    //enable or disable button
                    
                    sm.on('selectionchange',function(smod,node){
                        
                    var patt = new RegExp(me.fileRegex);
                    var res = patt.test(node.id);
                    if(res){
                        runBtn.setDisabled(false);
                    }else{
                        runBtn.setDisabled(true);
                    }
                    
                });
                }
            }
        }];
        this.buttons = [{
            text:this.uploadButtonText,
            ref:'../upload',
            iconCls:'update_manager_ic',
            handler: function(btn){
				var filebrowser = btn.refOwner.fileBrowser;
                var pluploadPanel = new Ext.ux.PluploadPanel({
					autoScroll:true,
					layout:'fit',
					url: filebrowser.url.substring(0,filebrowser.url.lastIndexOf('/'))+'/upload',
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
					layout:'fit',
					resizable: true,
					items: [pluploadPanel]
				});
				win.show();
            },
			scope: this
        },{
            ref:'../run',
            text:this.runButtonText,
            disabled:true,
            iconCls:'update_manager_ic',
            handler: function(btn){
                var filebrowser = btn.refOwner.fileBrowser;
                var node = filebrowser.fileTreePanel.selModel.getSelectedNode();
                btn.refOwner.runLocal(btn.refOwner.flowId,node);
            } 
        }];
        mxp.widgets.GeoBatchRunLocalForm.superclass.initComponent.call(this, arguments);
       
    },
    
	isForm: function() {
		return true;
	},
	
    runLocal: function(flowId,node){
        Ext.Ajax.request({
	       url: this.geoBatchRestURL + 'flows/' + flowId +'/runlocal', 
	       method: 'POST',
	       headers:{
	          'Content-Type' : 'application/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_ //TODO
	       },
            xmlData:'<runInfo><file>'+ this.baseDir +node.id +'</file></runInfo>',
	       scope: this,
	       success: function(response, opts){
				//var data = self.afterFind( Ext.util.JSON.decode(response.responseText) ); 
                this.fireEvent('success',response);
				this.onSuccess(response, opts);
	       },
	       failure: function(response, opts){
                this.fireEvent('fail',response);
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
            //msg: this.runSuccessPreText + response.responseText,
            msg: this.runSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO  
        });	
    }
    
});
Ext.reg(mxp.widgets.GeoBatchRunLocalForm.prototype.xtype, mxp.widgets.GeoBatchRunLocalForm);