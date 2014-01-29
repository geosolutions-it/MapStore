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
 *  module = gxp
 *  class = MapFileUploadPanel
 *  base_link = `Ext.FormPanel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: MapFileUploadPanel(config)
 *   
 *      A panel for uploading a new map file.
 */
gxp.MapFileUploadPanel = Ext.extend(Ext.FormPanel, {
    
    /** i18n */
    fileLabel: "Map file",
    fieldEmptyText: "Browse for Map context files...",
    uploadText: "Upload",
    waitMsgText: "Uploading your data...",
    resetText: "Reset",
    failedUploadingTitle: "File Upload Error",
    /** end i18n */

    
    /** private: property[fileUpload]
     *  ``Boolean``
     */
    fileUpload: true,

    width: 500,
    frame: true,
    autoHeight: true,
    bodyStyle: 'padding: 10px 10px 0 10px;',
    labelWidth: 50,
    defaults: {
        anchor: '95%',
        allowBlank: false,
        msgTarget: 'side'
    },
 
    /** api: config[url]
     *  ``String``
     *  URL for upload service.
     */
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        // Allow for a custom method to handle upload responses.
        /*config.errorReader = {
            read: config.handleUploadResponse || this.handleUploadResponse.createDelegate(this)
        };*/
        this.service = config.service;
        gxp.MapFileUploadPanel.superclass.constructor.call(this, config);
    },
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var self = this;
        
        this.items = [{
            xtype: "fileuploadfield",
            id: "file",
            emptyText: this.fieldEmptyText,
            fieldLabel: this.fileLabel,
            name: "file",
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: {
                "fileselected": function(cmp, value) {
                    // remove the path from the filename - avoids C:/fakepath etc.
                    cmp.setValue(value.split(/[/\\]/).pop());
                    self.filename = cmp.getValue();
                    self.buttons[0].enable();
                }
            }
        }
        ];
        
        this.buttons = [{
            text: this.uploadText,
            disabled:true,
            handler: function() {
	
                // ////////////////////////////////////////////////////////////////////////
                // The Form 'submit' process not uses the override-ext-ajax definitions
                // so we have to define a proper proxy usage if needed
                // ////////////////////////////////////////////////////////////////////////
							  
                var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
                var mHost = pattern.exec(this.service);

                var mUrl = this.service + 'HTTPWebGISFileUpload';
               
				
                var form = this.getForm();
                if (form.isValid()) {
                    form.submit({
                        url: mHost[2] == location.host ? mUrl : self.composer.proxy + mUrl,
                        submitEmptyText: false,
                        waitMsg: this.waitMsgText,
                        waitMsgTarget: true,
                        scope: this,
                        failure: function(form, action){
                            Ext.Msg.show({
                                title: this.failedUploadingTitle,
                                msg: gxp.util.getResponseFailureServiceBoxMessage(action.response),
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success:this.handleUploadSuccess
                    });
                }
            },
            scope: this
        },{
            text: this.resetText,
            scope: this,
            handler: function(){
                this.getForm().reset();
            }
        }
        ];
        
        this.addEvents(
            "uploadcomplete"
        ); 
        
        gxp.MapFileUploadPanel.superclass.initComponent.call(this);

    },
    
 
     
    /** private: method[handleUploadSuccess]
     */
    handleUploadSuccess: function(fp, o) {
        var json_str = unescape(o.result.result);
        json_str = json_str.replace(/\+/g, ' ');
									  
        this.composer.loadUserConfig(json_str);  							  
        this.composer.modified = true;   
        this.fireEvent("uploadcomplete", this, null);
    }
    
  
});

/** api: xtype = gxp_mapfileuploadpanel */
Ext.reg("gxp_mapfileuploadpanel", gxp.MapFileUploadPanel);
