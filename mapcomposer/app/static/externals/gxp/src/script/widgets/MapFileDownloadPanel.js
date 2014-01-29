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
 *  class = MapFileDownloadPanel
 *  base_link = `Ext.FormPanel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: MapFileDownloadPanel(config)
 *   
 *      A panel for downloading the map file.
 */
gxp.MapFileDownloadPanel = Ext.extend(Ext.FormPanel, {
    
    /** i18n */
    buttonText: "Export Map",
    filenameLabel: "Map file name",
    waitMsgText: "Generating Map Context File...",
    resetText: "Reset",
    failedUploadingTitle: "Cannot generate Map file",
    saveErrorText: "Trouble saving: ",
    /** end i18n */
    

    fieldEmptyText: "context.map",
    
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
        this.appMask = new Ext.LoadMask(Ext.getBody(), {
            msg: this.waitMsgText
            });
            
        this.addEvents(
            "downloadcomplete"
        ); 
            
        gxp.MapFileDownloadPanel.superclass.constructor.call(this, config);
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
        }];
        
        this.buttons = [{
            text: this.buttonText,
            handler: function() {
                var form = this.getForm();                
                this.filename = Ext.getCmp("filename").getValue();
                 if (form.isValid()) 
                   self.save(self.showUrl);
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
        
      
        gxp.MapFileDownloadPanel.superclass.initComponent.call(this);

    },
    
  
    /** private: method[save]
     *
     * Saves the map config and displays the URL in a window.
     */ 
    save: function(callback, scope) {
        var self=this;       
        var method = "POST";

        var mUrl = this.service + 'HTTPWebGISSave';
        var url = mUrl;
        OpenLayers.Request.issue({
            method: method,
            url: url,
            data: self.content,
            callback: function(request) {
                this.handleSave(request);
                if (callback) {
                    callback.call(scope || this);
                }
            },
            scope: this
        });
    },
        
    /** private: method[handleSave]
     *  :arg: ``XMLHttpRequest``
     */
    handleSave: function(request) {
        if (request.status == 200) {
            this.xmlContext = request.responseText;
        } else {
            throw this.saveErrorText + request.responseText;
        }
    },
	
    /** 
	 * private: method[showUrl]
     */
    showUrl: function() {
        this.appMask.show();
	var self=this;	
        var mUrl = this.service + 'HTTPWebGISFileDownload';
        OpenLayers.Request.POST({
            url: mUrl,
            data: this.xmlContext,
            callback: function(request) {

                if(request.status == 200){                            
                    
                    //        
                    //delete other iframes appended
                    //
                    if(document.getElementById("downloadIFrame")) {
                        document.body.removeChild( document.getElementById("downloadIFrame") ); 
                    }
                    
                    //
                    //Create an hidden iframe for forced download
                    //
                    var elemIF = document.createElement("iframe"); 
                    elemIF.setAttribute("id","downloadIFrame");

                    var mUrl = this.service + "HTTPWebGISFileDownload?fileName="+self.filename+"&file=" + request.responseText;
                    elemIF.src = mUrl; 
                    elemIF.style.display = "none"; 
                    document.body.appendChild(elemIF); 
                    this.appMask.hide();
                    this.fireEvent("downloadcomplete", this, null);
                }else{
                    this.appMask.hide();
                    Ext.Msg.show({
                        title: this.failedUploadingTitle,
                        msg: request.statusText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            },
            scope: this
        });
    }

});

/** api: xtype = gxp_kmlfiledownloadpanel */
Ext.reg("gxp_mapfiledownloadpanel", gxp.MapFileDownloadPanel);
