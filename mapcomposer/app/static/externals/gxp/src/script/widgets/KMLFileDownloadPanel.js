/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = KMLFileDownloadPanel
 *  base_link = `Ext.FormPanel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: KMLFileDownloadPanel(config)
 *   
 *      A panel for uploading a new KML file.
 */
gxp.KMLFileDownloadPanel = Ext.extend(Ext.FormPanel, {
    
    /** i18n */
    buttonText: "Export",
    filenameLabel: "KML file name",
    fieldEmptyText: "export.kml",
    uploadText: "Export",
    waitMsgText: "Generating KML...",
    invalidFileExtensionText: "File extension must be one of: ",
    resetText: "Reset",
    failedUploadingTitle: "Cannot generate KML file",
    /** end i18n */

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

    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.service = config.service;
        this.content = config.content;
        gxp.KMLFileDownloadPanel.superclass.constructor.call(this, config);
    },
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var self = this;
        this.items = [{
            xtype: "textfield",
            id: "filename",
            value: this.fieldEmptyText,
            fieldLabel: this.filenameLabel,
            name: "file"
        },{  
            xtype:'hidden',
            name:'content', 
            value:this.content,
            id:"content"
        }
        ];
        
        this.buttons = [{
            text: this.buttonText,
            handler: function() {
                this.filename = Ext.getCmp("filename").getValue();
                //var content = Ext.getCmp("content").getValue();
                //var map = this.map;
                var form = this.getForm();
                if (form.isValid()) {
                    // application/x-www-form-urlencoded
                    form.submit({
                        url: this.service + 'FileDownloader', 
                        submitEmptyText: false,
                        waitMsg: this.waitMsgText,
                        waitMsgTarget: true,
                        reset: true,
                        scope: this,
                        failure: function(form, action){
                            console.error(action);
                            Ext.Msg.show({
                                title: this.failedUploadingTitle,
                                msg: action.responseText,
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

            /*
             * Event: uploadcomplete
             * Fires upon successful upload.
             *
             * Listener arguments:
             * panel - {<gxp.LayerUploadPanel} This form panel.
             * details - {Object} An object with "name" and "href" properties
             *     corresponding to the uploaded layer name and resource href.
             */
            "uploadcomplete"
            ); 

        gxp.KMLFileDownloadPanel.superclass.initComponent.call(this);

    },
    

    /** private: method[handleUploadSuccess]
     */
    handleUploadSuccess: function(form, action) {
        // var obj = Ext.decode( result.responseText );
        var obj = Ext.decode( action.response.responseText );
        var filename = this.filename;
        var response = new Object;
        response.filename = filename;
        response.code = obj.result.code;
        this.fireEvent("uploadcomplete", this, response);
    }

});

/** api: xtype = gxp_kmlfiledownloadpanel */
Ext.reg("gxp_kmlfiledownloadpanel", gxp.KMLFileDownloadPanel);
