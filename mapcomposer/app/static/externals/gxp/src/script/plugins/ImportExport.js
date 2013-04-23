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

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ImportExport
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ImportExport(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.ImportExport = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_importexport */
    ptype: "gxp_importexport",

	service: null,
	
	saveMapText: "Export Map",
    loadMapText: "Import Map",
	
	uploadButtonText: 'Upload',
	uploadWaitMsg: 'Uploading your context file...',
    uploadErrorTitle: 'File Upload Error',
    uploadEmptyText: 'Select a Map context file',
    uploadWinTitle: 'File Upload Form',
	
	saveErrorText: "Trouble saving: ",
	mainLoadingMask: "Please wait, loading...",
	
    /**
	 * private: method[constructor]
     */
    constructor: function(config) {
	    this.appMask = new Ext.LoadMask(Ext.getBody(), {msg: this.mainLoadingMask});
		gxp.plugins.ImportExport.superclass.constructor.apply(this, arguments); 
    },
	
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
		gxp.plugins.ImportExport.superclass.init.apply(this, arguments);
		
        this.target.on({
			ready: function() {
				this.service = this.service || ('http://' + window.location.host + '/servicebox/');
			},
			scope: this
		});		
	},
	
    /** 
     * api: method[addActions]
     */
    addActions: function() {
        var apptarget = this.target;
		
        var confExport = new Ext.Button({
			tooltip: this.saveMapText,
			handler: function() {
				this.save(this.showUrl);
			},
			scope: this,
			iconCls: "icon-save"
		});
		
		var confImport = new Ext.Button({
			tooltip: this.loadMapText,
			handler: function() {    
				var composer = apptarget; 
				var win;  
				  
				var fp = new Ext.FormPanel({
					fileUpload: true,
					autoWidth: true,
					autoHeight: true,
					frame: true,
					bodyStyle: 'padding: 10px 10px 0 10px;',
					labelWidth: 50,
					defaults: {
						anchor: '95%',
						allowBlank: false,
						msgTarget: 'side'
					},
					items: [{
						xtype: 'fileuploadfield',
						id: 'form-file',
						emptyText: this.uploadEmptyText,
						fieldLabel: 'File',
						name: 'file-path',
						buttonText: '',
						buttonCfg: {
							iconCls: 'upload-icon'
						}
					}],
					buttons: [{
						text: this.uploadButtonText,
						scope: this,
						handler: function(){
							if(fp.getForm().isValid()){
							
							  // ////////////////////////////////////////////////////////////////////////
							  // The Form 'submit' process not uses the override-ext-ajax definitions
							  // so we have to define a proper proxy usage if needed
							  // ////////////////////////////////////////////////////////////////////////
							  
							  var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
							  var mHost = pattern.exec(this.service);

							  var mUrl = this.service + 'HTTPWebGISFileUpload';
							  
							  fp.getForm().submit({
								  url: mHost[2] == location.host ? mUrl : apptarget.proxy + mUrl,
								  waitMsg: this.uploadWaitMsg,
								  success: function(fp, o){
									  win.hide();
									  var json_str = unescape(o.result.result);
									  json_str = json_str.replace(/\+/g, ' ');
									  
									  composer.loadUserConfig(json_str);  
									  
									  apptarget.modified = true;                             
								  },                                    
								  failure: function(fp, o){
									  win.hide();
									  win.destroy();
									  
									  Ext.Msg.show({
										 title: this.uploadErrorTitle,
										 msg: o.result.errorMessage,
										 buttons: Ext.Msg.OK,
										 icon: Ext.MessageBox.ERROR
									  });
								  }
							  });
							}
						}
					}]
				});
				
				win = new Ext.Window({
					title: this.uploadWinTitle,
					id: 'upload-win',
					layout: 'form',
					labelAlign: 'top',
					modal: true,
					bodyStyle: "padding: 5px",
					width: 380,
					items: [fp]
				});
				
				win.show();
			},
			scope: this,
			iconCls: "icon-load"
		});
        
        var actions = [confExport, confImport];
        return gxp.plugins.ImportExport.superclass.addActions.apply(this, [actions]);
    },
	
	/** private: method[save]
     *
     * Saves the map config and displays the URL in a window.
     */ 
    save: function(callback, scope) {
        var configStr = Ext.util.JSON.encode(this.target.getState());        
        var method = "POST";

        var mUrl = this.service + 'HTTPWebGISSave';
        var url = mUrl;
        OpenLayers.Request.issue({
            method: method,
            url: url,
            data: configStr,
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

                    var mUrl = this.service + "HTTPWebGISFileDownload?file=" + request.responseText;
                    elemIF.src = mUrl; 
                    elemIF.style.display = "none"; 
                    document.body.appendChild(elemIF); 
					this.appMask.hide();
                }else{
                    Ext.Msg.show({
                       title:'File Download Error',
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

Ext.preg(gxp.plugins.ImportExport.prototype.ptype, gxp.plugins.ImportExport);
