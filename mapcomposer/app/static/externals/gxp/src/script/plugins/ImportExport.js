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
    
    /** api: config[types]
     *  ``Array``
     *  Array of import/export actions type. Supported ['map', 'kml/kmz'].
     */
    types: null,
    
    /** i18n */
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
        } 
    },
    /** end i18n */
    
    /**
     * private: config[iconClsDefault]
     * 
     * IconCls for inport/export actions
     */
    iconClsDefault: {
        "map": {
            iconClsImport:  "icon-load",
            iconClsExport:  "icon-save"
        },
        "kml/kmz": {
            iconClsImport:  "gxp-icon-import-kml",
            iconClsExport:  "gxp-icon-export-kml" 
        }
    },
    
    /**
     * private: method[constructor]
     */
    constructor: function(config) {
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
        var actions= new Array();
        var type;
        var self= this;
        for(var i=0; i< this.types.length; i++){
            type=this.types[i];
            actions.push(new Ext.Button({
                tooltip: this.labels[type].saveText,
                fileType: type,
                handler: function() {
                    self.exportFile(this.fileType)
                },
                iconCls: this.iconClsDefault[type].iconClsExport//"icon-save"
            }));
        
            actions.push(new Ext.Button({
                tooltip: this.labels[type].loadText,
                fileType: type,
                handler: function() {    
                    self.importFile(this.fileType);
                },
                iconCls: this.iconClsDefault[type].iconClsImport//"icon-load"
            }));
        }

        return gxp.plugins.ImportExport.superclass.addActions.apply(this, [actions]);
    },
	

    exportFile: function(type){
        switch (type){
            case "map":
                this.exportMap();
                break;  
            case "kml/kmz":
                this.exportKML();
                break;
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
        }
    },
    
    
    exportMap: function(){
        var configStr = Ext.util.JSON.encode(this.target.getState());  
        
        // create an upload file form
        var form = new gxp.MapFileDownloadPanel( {
            service: this.service,
            content: configStr
        } );
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["map"].downloadWindowTitle,
            iconCls: "gxp-icon-export-kml",
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
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
            iconCls: "gxp-icon-import-kml",
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
        var self= this;
        var map = this.target.mapPanel.map;       
        try{
            layer= (this.layer) ? this.layer : this.target.selectedLayer.data.layer;
        } catch (ex){
            layer= null;
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
                        var formatWKT= new OpenLayers.Format.WKT();
                        var transformRequest={
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
                        });
                    
                    }else
                        self.exportKMLFeatures(features);  
                }else
                    Ext.Msg.show({
                        title: this.labels["kml/kmz"].kmlExportTitleText,
                        msg: this.labels["kml/kmz"].layerEmptyText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });  
            } else
                Ext.Msg.show({
                    title: this.labels["kml/kmz"].kmlExportTitleText,
                    msg: this.labels["kml/kmz"].notVectorlayerText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });  
        }else
            Ext.Msg.show({
                title: this.labels["kml/kmz"].kmlExportTitleText,
                msg: this.labels["kml/kmz"].notLayerSelectedText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            }); 
                
        //self.exportButton.toggle( false );
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
            content: kmlContent
        } );
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["kml/kmz"].downloadWindowTitle,
            iconCls: "gxp-icon-import-kml",
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
                
        var form = new gxp.KMLFileUploadPanel( {
            service: this.service,
            deafultLayerName: this.layerName
        } );
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: this.labels["kml/kmz"].uploadWindowTitle,
            iconCls: "gxp-icon-import-kml",
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });		
        form.on("uploadcomplete", function addKMLToLayer(caller, response){
            // the code to access the uploaded file
            var code = response.code;
            var nfname = response.nfname;
            var url = response.url;
                    
            self.layer = self.createLayer( self.target.mapPanel.map, caller.getLayerName());
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
                        // for imported features create a string represention of their value
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
                            var formatWKT= new OpenLayers.Format.WKT();
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
                                        targetFeatures=formatWKT.read(response.responseText);  
                                        for (var i=0; i<targetFeatures.length; i++){
                                            displayFeatures[i].geometry=targetFeatures[i].geometry;
                                        }
                                    } catch (ex){
                                        Ext.Msg.show({
                                            title: self.kmlImportTitleText,
                                            msg: self.kmlImportErrorText+" . " +response.responseText,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR
                                        }); 
                                           
                                        return;
                                    }
                                        
                                    self.layer.addFeatures(displayFeatures);
                                
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
                        }else
                            self.layer.addFeatures( displayFeatures );
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
    
    
    /**
     *  create a custom layer or it returns an existing one
     */
    createLayer: function( map , layerName){
        var layers = map.getLayersByName( layerName );
        if ( layers.length > 0 ){
            return layers[0]; // return the first layer with the given name
        } else {
            var layer;
            if ( this.alternativeStyle ){
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

