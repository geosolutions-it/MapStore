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
 *    Plugin for import/export data in MapStore.
 */
gxp.plugins.ImportExport = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_importexport */
    ptype: "gxp_importexport",

    service: null,
    
    /** api: config[types]
     *  ``Array``
     *  Array of import/export actions type. Supported ['map', 'kml/kmz'].
     */
    types: null,
    
    /** i18n */
    importexportLabel: "Import / Export",
	
    labels:{
        "map": {
            "saveText" : "Export Map",
            "loadText" : "Import Map",
            "uploadWindowTitle" : "Import Map Context file",
            "downloadWindowTitle" : "Export Map Context file"
        },
    
        "kml/kmz": {
            "saveText" : "Export KML",
            "loadText" : "Import KML/KMZ",
            "uploadWindowTitle" : "Import KML/KMZ file",
            "downloadWindowTitle" : "Export KML file",
            "kmlExportTitleText": "KML/KMZ Export",
            "layerEmptyText": "The selected Layer is empty",
            "notVectorlayerText": "Please select only Vector Layer",
            "notLayerSelectedText": "Please select a Vector Layer"
        },
    
        "geojson": {
            "saveText" : "Export GeoJSON",
            "loadText" : "Import GeoJSON",
            "uploadWindowTitle" : "Import GeoJSON file",
            "downloadWindowTitle" : "Export GeoJSON file"
        },
    
        "shp": {
            "saveText" : "Export SHP",
            "loadText" : "Import SHP",
            "uploadWindowTitle" : "Import SHP file",
            "downloadWindowTitle" : "Export SHP file"
        }  
    },
    defaultSaveText: "Export {0}",
    defaultLoadText: "Import {0}",
    defaultUploadWindowTitle: "Import {0} file",
    defaultDownloadWindowTitle: "Export {0} file",
    defaultTitleText: "{0} Export",
    defaultEmptyLayerMessageText: "The selected Layer is empty",
    /** end i18n */
    
    /** api: config[exportConf]
     *  ``Object``
     *  Object with type actions configurations. Supported ['map', 'kml/kmz'].
     */
    exportConf:{
        "map": {
            
        },    
        "kml/kmz": {
            layerName: null,
            alternativeStyle: false,
            layer: null,
            dontAskForLayerName: false
        },    
        "geojson": {
            panelConfig:{
                fieldEmptyText: "Browse for GeoJSON files...",
                validFileExtensions: [".json", ".geojson"],
                fileLabel: "JSON file",
                deafultLayerName: null,
                dontAskForLayerName: false
            }
        },    
        "shp": {
            panelConfig:{
                fieldEmptyText: "Browse for SHP files...",
                validFileExtensions: [".shp"],
                fileLabel: "SHP file",
                deafultLayerName: null,
                dontAskForLayerName: false
            }
        }
    },    
    
    /** api: config[zoomToLayerExtent]
     *  ``Boolean``
     *  Flag to zoom to the imported layer extent
     */
    zoomToLayerExtent:true,

    
    /** api: config[hiddenComponent]
     *  ``Boolean``
     *  Flag to don't add actions
     */
    hiddenComponent: true,
    
    /**
     * private: config[iconClsDefault]
     * 
     * IconCls for inport/export actions
     */
    iconClsDefault: {
        "map": {
            iconClsImport:  "gxp-icon-import-map",
            iconClsExport:  "gxp-icon-export-map"
        },
        "kml/kmz": {
            iconClsImport:  "gxp-icon-import-kml",
            iconClsExport:  "gxp-icon-export-kml" 
        },
        "geojson": {
            iconClsImport:  "gxp-icon-import-json",
            iconClsExport:  "gxp-icon-export-json" 
        },
        "shp": {
            iconClsImport:  "gxp-icon-import-shp",
            iconClsExport:  "gxp-icon-export-shp" 
        }
    },
    
    /**
     * private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.ImportExport.superclass.constructor.apply(this, arguments); 
    },
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        
        this.addEvents(

            /**
             * Event: layerloaded
             * Fires upon successful layer data import.
             *
             * Listener arguments:
             * layer - {OpenLayer.Layer} Layer with the data loaded.
             */
            "layerloaded"
        ); 

        gxp.ImportExport.superclass.initComponent.call(this);

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
        var actions= new Array();
        var items= new Array();
        var type;
        var self= this;
        
        for(var i=0; i< this.types.length; i++){
            type=this.types[i];

            // get labels
            var saveText = String.format(this.defaultSaveText, type.toUpperCase());
            var loadText = String.format(this.defaultLoadText, type.toUpperCase());
            if(this.labels[type]){
                saveText = this.labels[type].saveText ? this.labels[type].saveText : saveText;
                loadText = this.labels[type].loadText ? this.labels[type].loadText : loadText;
            }

            actions.push({
                tooltip: saveText,
                text: saveText,
                fileType: type,
                handler: function() {
                    self.exportFile(this.fileType)
                },
                iconCls: this.iconClsDefault[type].iconClsExport
            });
          
            actions.push({
                tooltip: loadText,
                text: loadText,
                fileType: type,
                handler: function() {    
                    self.importFile(this.fileType);
                },
                iconCls: this.iconClsDefault[type].iconClsImport
            });          
        }
        
        var menu = new Ext.SplitButton({
            iconCls: "gxp-icon-importexport",
            tooltip: this.importexportLabel,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            allowDepress: true,
            handler: function(button, event) {
               /* if(button.pressed) {
                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
                }*/
            },
            scope: this,
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    /*if(!pressed) {
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }*/
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({                
                tooltip: "test",
                items: actions
            })
        });        

        if(this.hiddenComponent){
            return gxp.plugins.ImportExport.superclass.addActions.apply(this, []);
        }else{
            return gxp.plugins.ImportExport.superclass.addActions.apply(this, [menu]);
        }
    },
	
    exportFile: function(type){
        switch (type){
            case "map":
                this.exportMap();
                break;  
            case "kml/kmz":
                this.exportKML();
                break;
            default:
                this.exportLayerFile(type);
        } 
    },
    
    importFile: function(type){        
        switch (type){
            case "map":
                this.importMap();
                break;  
            case "kml/kmz":
                this.importKML();
                break;
            default:
                this.importLayerFile(type);
        }
    },
        
    exportMap: function(){
        var configStr = Ext.util.JSON.encode(this.target.getState());  
        
        // create an upload file form
        var form = new gxp.MapFileDownloadPanel( {
            service: this.service,
			composer: this.target,
            content: configStr
        } );
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["map"].downloadWindowTitle,
            iconCls: this.iconClsDefault["map"].iconClsExport,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });
        
        form.on("downloadcomplete", function (caller, response){
            win.destroy();
        });

        win.show();        
    },    
    
    importMap: function(){
        // create an upload file form
        var form = new gxp.MapFileUploadPanel( {
            service: this.service,
            composer: this.target
        } );
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["map"].uploadWindowTitle,
            iconCls: this.iconClsDefault["map"].iconClsImport,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });
        
        form.on("uploadcomplete", function (caller, response){
            win.destroy();
        });

        win.show();        
    },    
    
    exportKML: function(){
        var layer;
        var self = this;
        var map = this.target.mapPanel.map;       
        try {
            layer = (this.exportConf["kml/kmz"].layer) ? this.exportConf["kml/kmz"].layer : this.target.selectedLayer.data.layer;
        }catch (ex){
            layer = null;
        }        
     
        if(layer){
            var features = new Array;
            if(layer instanceof OpenLayers.Layer.Vector){
                        
                if(layer.features.length>0){
                            
                    for (var i=0; i<layer.features.length; i++){
                        var feature = layer.features[i].clone();
                        if(feature.geometry){
                            feature.attributes.name = feature.attributes.name || '';
                            features.push( feature ); 
                        }
                    }
                        
                    if(map.getProjection() != "EPSG:4326"){
                        /*var formatWKT = new OpenLayers.Format.WKT();
                        var transformRequest = {
                            sourceCRS: map.getProjection(),
                            targetCRS: "EPSG:4326",
                            sourceType: "WKT",
                            targetType: "WKT",
                            data:  formatWKT.write(features)
                        }
                  
                        Ext.Ajax.request({
                            url: this.service+"/Transform" ,
                            method: 'POST',                       
                            jsonData: transformRequest,
                            scope: this,
                            success: function(response, opts){
                                var targetFeatures;
                                try{
                                    targetFeatures=formatWKT.read(response.responseText);  
                                    for (var i=0; i<targetFeatures.length; i++){
                                        features[i].geometry=targetFeatures[i].geometry;
                                    }
                                } catch (ex){
                                    Ext.Msg.show({
                                        title: self.kmlExportTitleText,
                                        msg: self.kmlExportErrorText+" . " +response.responseText,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR
                                    }); 
                                           
                                    return;
                                }
                                        
                                self.exportKMLFeatures(features);
                                
                            },
                            failure:  function(response, opts){
                                Ext.Msg.show({
                                    title: self.kmlExportTitleText,
                                    msg: self.kmlExportErrorText+" . " + response.responseText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        });*/
						
						for(var i=0; i<features.length; i++){
							if(features[i] && features[i].geometry){
								features[i].geometry = features[i].geometry.transform(map.getProjection(), new OpenLayers.Projection("EPSG:4326"));
							}
						} 

						self.exportKMLFeatures(features); 						
                    }else{
						self.exportKMLFeatures(features);  
					}
                }else{
                    Ext.Msg.show({
                        title: this.labels["kml/kmz"].kmlExportTitleText,
                        msg: this.labels["kml/kmz"].layerEmptyText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });
				}
            }else{
                Ext.Msg.show({
                    title: this.labels["kml/kmz"].kmlExportTitleText,
                    msg: this.labels["kml/kmz"].notVectorlayerText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
			}
        }else{
            Ext.Msg.show({
                title: this.labels["kml/kmz"].kmlExportTitleText,
                msg: this.labels["kml/kmz"].notLayerSelectedText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
		}
                
		//self.exportButton.toggle( false );
    },
    
    exportLayerFile: function(type){
        var layer;
        var self = this;
        var map = this.target.mapPanel.map;       
        try {
            layer = (this.exportConf[type].layer) ? this.exportConf[type].layer : this.target.selectedLayer.data.layer;
        }catch (ex){
            layer = null;
        }

        // title and message
        var titleText = String.format(this.defaultTitleText, type);
        var messageText = this.defaultEmptyLayerMessageText;
        if(this.labels[type]){
            titleText = this.labels[type].exportTitleText ? this.labels[type].exportTitleText : titleText;
            messageText = this.labels[type].messageText ? this.labels[type].messageText : messageText;
        }
     
        if(layer){
            var features = new Array;
            if(layer instanceof OpenLayers.Layer.Vector){
                        
                if(layer.features.length>0){
                            
                    for (var i=0; i<layer.features.length; i++){
                        var feature = layer.features[i].clone();
                        if(feature.geometry){
                            feature.attributes.name = feature.attributes.name || '';
                            features.push( feature ); 
                        }
                    }
                        
                    if(map.getProjection() != "EPSG:4326"){
                        
                        for(var i=0; i<features.length; i++){
                            if(features[i] && features[i].geometry){
                                features[i].geometry = features[i].geometry.transform(map.getProjection(), new OpenLayers.Projection("EPSG:4326"));
                            }
                        } 

                        self.exportLayerFeatures(features, type);
                    }else{
                        self.exportLayerFeatures(features, type);  
                    }
                }else{
                    Ext.Msg.show({
                        title: titleText,
                        msg: messageText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }else{
                Ext.Msg.show({
                    title: titleText,
                    msg: messageText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }else{
            Ext.Msg.show({
                title: titleText,
                msg: messageText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            });
        }
                
        //self.exportButton.toggle( false );
    },

    getExportFormat: function(type){
        switch(type){
            case "kml/kmz":{
                return new OpenLayers.Format.KML({
                    'extractStyles':true
                });
                break;
            }
            case "geojson":{
                return new OpenLayers.Format.GeoJSON();
                break;
            }
        }

    },
    
    exportLayerFeatures: function(features, type){
        
        // get format
        var format = this.getExportFormat(type);

        // create string from layer features
        var layerContent = format.write( features );
        
        // create an upload file form
        var exportPanelConfig =  {
            service: this.service,
            composer: this.target,
            content: kmlContent
        };
        var form = new gxp.KMLFileDownloadPanel(exportPanelConfig);
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels[type].downloadWindowTitle,
            iconCls: this.iconClsDefault[type].iconClsExport,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });
                                    
        // application/x-www-form-urlencoded
                    
        form.on("uploadcomplete", function addKMLToLayer(caller, response){
            var code = response.code;
            var filename = response.filename;
            // force browser download
            location.href = this.service+'FileDownloader?code=' + code +'&filename='+filename;
            win.destroy();
        });
        
        win.show();        
    },
    
    exportKMLFeatures: function(features){
        // create kml string from layer features
        var format = new OpenLayers.Format.KML({
            'extractStyles':true
        });
        
        var kmlContent = format.write( features );
        
        // create an upload file form
        var form = new gxp.KMLFileDownloadPanel( {
            service: this.service,
			composer: this.target,
            content: kmlContent
        } );
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["kml/kmz"].downloadWindowTitle,
            iconCls: this.iconClsDefault["kml/kmz"].iconClsExport,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });
	                   				
        // application/x-www-form-urlencoded
					
        form.on("uploadcomplete", function addKMLToLayer(caller, response){
            var code = response.code;
            var filename = response.filename;
            // force browser download
            location.href = this.service+'FileDownloader?code=' + code +'&filename='+filename;
            win.destroy();
        });
		
        win.show();        
    },
    
    importKML: function(){
        var self = this;
        var map = this.target.mapPanel.map;
		
        // create an upload file form                
        var form = new gxp.KMLFileUploadPanel({
            service: this.service,
			composer: this.target,
            deafultLayerName: this.exportConf["kml/kmz"].layerName,
            dontAskForLayerName: this.exportConf["kml/kmz"].dontAskForLayerName
        });
		
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["kml/kmz"].uploadWindowTitle,
            iconCls: this.iconClsDefault["kml/kmz"].iconClsImport,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });		
		
        form.on("uploadcomplete", function addKMLToLayer(caller, response){
            // ////////////////////////////////////////////
			// The code to access the uploaded file
            // ////////////////////////////////////////////
			var code = response.code;
            var nfname = response.nfname;
            var url = response.url;
                    
            var layer = self.createLayer( self.target.mapPanel.map, caller.getLayerName());
            url += '?' + 'code=' + code + '&filename=' + nfname;
			   
            var appMask = new Ext.LoadMask(Ext.getBody(), {
                msg:"Please wait, loading..."
            });
			
            appMask.show();
							
            Ext.Ajax.request({
                url: url ,
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/xml'
                },
                scope: this,
                success: function(response, opts){
                    appMask.hide();
									
                    var format = new OpenLayers.Format.KML({
                        extractStyles: true, 
                        extractAttributes: true/*,
						maxDepth: 2,
						internalProjection: new OpenLayers.Projection(map.getProjection()),
						externalProjection: new OpenLayers.Projection("EPSG:4326")*/
                    });
									
                    var features = format.read(response.responseText);
                    var displayFeatures= new Array;
                    if(features){
					    // /////////////////////////////////////////////////////////////////////
                        // For imported features create a string represention of their value
						// /////////////////////////////////////////////////////////////////////
                        for (var i=0; i<features.length; i++){
                            if(features[i].geometry){
                                var attributes = features[i].attributes;
                                for (var attributeName in attributes ){
                                    if (typeof attributes[attributeName] == "object") {
                                        if (attributes[attributeName].value) {
                                            attributes[attributeName] = attributes[attributeName].value;
                                        }
                                    }  
                                }
                                displayFeatures.push( features[i] ); 
                            }  
                        }
                                
                        if(map.getProjection() != "EPSG:4326"){
                            /*// //////////////////////////////////////////////////////////////////////////
							// This code interact directly with ServiceBox in order to manage 
							// coordinate translations between kml 4326 and current map CRS, server side
							// ////////////////////////////////////////////////////////////////////////////
							var formatWKT = new OpenLayers.Format.WKT();
                            var transformRequest={
                                sourceCRS: "EPSG:4326",
                                targetCRS: map.getProjection(),
                                sourceType: "WKT",
                                targetType: "WKT",
                                data:  formatWKT.write(displayFeatures)
                            }
                  
                            Ext.Ajax.request({
                                url: self.service+"/Transform" ,
                                method: 'POST',                       
                                jsonData: transformRequest,
                                scope: this,
                                success: function(response, opts){
                                    var targetFeatures;
                                    try{
                                        targetFeatures = formatWKT.read(response.responseText); 
										
										// TODO: fix this.
                                        //for (var i=0; i<targetFeatures.length; i++){
                                        //    displayFeatures[i].geometry = targetFeatures[i].geometry; 
                                        //}
                                    } catch (ex){
                                        Ext.Msg.show({
                                            title: self.kmlImportTitleText,
                                            msg: self.kmlImportErrorText+" . " +response.responseText,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR
                                        }); 
                                           
                                        return;
                                    }
                                        
                                    //layer.addFeatures(displayFeatures);
                                    layer.addFeatures(targetFeatures);									
                                },
                                failure:  function(response, opts){
                                    Ext.Msg.show({
                                        title: self.kmlImportTitleText,
                                        msg: self.kmlImportErrorText+" . " + response.responseText,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            });*/  
							
							for(var i=0; i<displayFeatures.length; i++){
								if(displayFeatures[i] && displayFeatures[i].geometry){
									displayFeatures[i].geometry = displayFeatures[i].geometry.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjection());
								}
							}
							
							layer.addFeatures( displayFeatures );
                        }else{
                            layer.addFeatures( displayFeatures );
						}
						
						if(layer && self.zoomToLayerExtent){
							var extent = layer.getDataExtent();
							map.zoomToExtent(extent);
						}
                        self.fireEvent("layerloaded", layer);
                    }else{
                        Ext.Msg.show({
                            title: self.kmlImportTitleText,
                            msg: self.kmlImportErrorText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                failure:  function(response, opts){
                    Ext.Msg.show({
                        title: self.kmlImportTitleText,
                        msg: self.kmlImportErrorText+" . " + response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            });

            // destroy the window
            win.destroy();
        });
        // show window
        win.show();
    },
    
    importLayerFile: function(type){
        var self = this;
        var map = this.target.mapPanel.map;

        // create an upload file form
        var panelConfig = {
            xtype: "gxp_kmlfileuploadpanel",
            service: this.service,
            composer: this.target,
            fileLabel: type.toUpperCase() + " file"
        };
        Ext.apply(panelConfig,this.exportConf[type].panelConfig);                
        var form = Ext.create(panelConfig);

        var uploadWindowTitle = String.format(this.defaultUploadWindowTitle, type.toUpperCase());
        var iconCls = this.iconClsDefault[type] ? this.iconClsDefault[type].iconClsImport : "";
        if(this.exportConf[type]){
            uploadWindowTitle = this.exportConf[type].uploadWindowTitle ? this.exportConf[type].uploadWindowTitle : uploadWindowTitle;
        }
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: uploadWindowTitle,
            iconCls: iconCls,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });     
        
        form.on("uploadcomplete", function addKMLToLayer(caller, response){
            // ////////////////////////////////////////////
            // The code to access the uploaded file
            // ////////////////////////////////////////////
            var code = response.code;
            var nfname = response.nfname;
            var url = response.url;
                    
            var layer = self.createLayer( self.target.mapPanel.map, caller.getLayerName());
            url += '?' + 'code=' + code + '&filename=' + nfname;
               
            var appMask = new Ext.LoadMask(Ext.getBody(), {
                msg:"Please wait, loading..."
            });
            
            appMask.show();
                            
            Ext.Ajax.request({
                url: url ,
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/xml'
                },
                scope: this,
                success: function(response, opts){
                    appMask.hide();

                    var format = self.getImportFormat(type);
                                    
                    var features = format.read(response.responseText);
                    var displayFeatures= new Array;
                    if(features){
                        // /////////////////////////////////////////////////////////////////////
                        // For imported features create a string represention of their value
                        // /////////////////////////////////////////////////////////////////////
                        for (var i=0; i<features.length; i++){
                            if(features[i].geometry){
                                var attributes = features[i].attributes;
                                for (var attributeName in attributes ){
                                    if (typeof attributes[attributeName] == "object") {
                                        if (attributes[attributeName].value) {
                                            attributes[attributeName] = attributes[attributeName].value;
                                        }
                                    }  
                                }
                                displayFeatures.push( features[i] ); 
                            }  
                        }
                                
                        if(map.getProjection() != "EPSG:4326"){
                            
                            for(var i=0; i<displayFeatures.length; i++){
                                if(displayFeatures[i] && displayFeatures[i].geometry){
                                    displayFeatures[i].geometry = displayFeatures[i].geometry.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjection());
                                }
                            }
                            
                            layer.addFeatures( displayFeatures );
                        }else{
                            layer.addFeatures( displayFeatures );
                        }
                        
                        if(layer && self.zoomToLayerExtent){
                            var extent = layer.getDataExtent();
                            map.zoomToExtent(extent);
                        }
                        self.fireEvent("layerloaded", layer);
                    }else{
                        Ext.Msg.show({
                            title: self.kmlImportTitleText,
                            msg: self.kmlImportErrorText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                failure:  function(response, opts){
                    Ext.Msg.show({
                        title: self.kmlImportTitleText,
                        msg: self.kmlImportErrorText+" . " + response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            });

            // destroy the window
            win.destroy();
        });
        // show window
        win.show();
    },

    getImportFormat: function(type){
        switch(type){
            case "kml/kmz":{
                return new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true
                });
                break;
            }
            case "geojson":{
                return new OpenLayers.Format.GeoJSON();
                break;
            }
            case "shp":{
                return new OpenLayers.Format.GeoJSON();
                break;
            }
        }
    },
        
    /**
     *  create a custom layer or it returns an existing one
     */
    createLayer: function( map , layerName){
        var layers = map.getLayersByName( layerName );
        if ( layers.length > 0 ){
            return layers[0]; // return the first layer with the given name
        } else {
            var layer;
            if ( this.exportConf["kml/kmz"].alternativeStyle ){
                layer = new OpenLayers.Layer.Vector( layerName, {
                    projection: new OpenLayers.Projection( map.getProjection() ), 
                    styleMap: new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style({
                            strokeColor: "red",
                            strokeOpacity: .7,
                            strokeWidth: 2,
                            fillColor: "red",
                            fillOpacity: 0,
                            cursor: "pointer"
                        }),
                        "temporary": new OpenLayers.Style({
                            strokeColor: "#ffff33",
                            strokeOpacity: .9,
                            strokeWidth: 2,
                            fillColor: "#ffff33",
                            fillOpacity: .3,
                            cursor: "pointer"
                        }),
                        "select": new OpenLayers.Style({
                            strokeColor: "#0033ff",
                            strokeOpacity: .7,
                            strokeWidth: 3,
                            fillColor: "#0033ff",
                            fillOpacity: 0,
                            graphicZIndex: 2,
                            cursor: "pointer"
                        })
                    })
                });				
            } else {
                layer = new OpenLayers.Layer.Vector( layerName, {
                    projection: new OpenLayers.Projection( map.getProjection() )
                });	
            }

            map.addLayer( layer );
            return layer;
        }
    }        
});

Ext.preg(gxp.plugins.ImportExport.prototype.ptype, gxp.plugins.ImportExport);

