/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ImportKML
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ImportKML(config)
 *
 *    Allows to upload KML files.
 */
gxp.plugins.KMLImporter = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_import_kml */
    ptype: "gxp_import_kml",
    
    /** api: config[importKMLMenuText]
     *  ``String``
     *  Text for import KML item (i18n).
     */
    importKMLMenuText: "Import KML",


    /** api: config[importKMLTooltip]
     *  ``String``
     *  Text for import KML tooltip (i18n).
     */
    importKMLTooltip: "Import KML",
  
    /** api: config[uploadWindowTitle]
     *  ``String``
     *  Title of the window (i18n).
     */
    uploadWindowTitle: 'Upload KML file',
    
    /** api: config[kmlImportTitleText]
     *  ``String``
     * Text (i18n).
     */
    kmlImportTitleText: "KML/KMZ Import",
    
    /** api: config[kmlImportErrorText]
     *  ``String``
     *  Text (i18n).
     */
    kmlImportErrorText: "Error while reading the server response",

    alternativeStyle: false,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.KMLImporter.superclass.constructor.apply(this, arguments);
        // this.layer = config.layer;
        this.alternativeStyle = config.alternativeStyle || false;
        this.toggleGroup = config.toggleGroup;
    },

    addOutput: function(config){
        var self = this;
        var map = this.target.mapPanel.map;	
        var service = this.service || ('http://' + window.location.host + '/xmlJsonTranslate/');
			
        
			
        // open an upload file window
        var actions = [{
            toggleGroup: self.toggleGroup,
            menuText: this.importKMLMenuText,
            iconCls: "gxp-icon-import-kml",
            tooltip: this.importKMLTooltip,
            handler: function() {
                var self = this;
                // create an upload file form
                
                var form = new gxp.KMLFileUploadPanel( {
                    service: service,
                    deafultLayerName: self.layerName
                } );
                // open a modal window
                var win = new Ext.Window({
                    closable:true,
                    title: this.uploadWindowTitle,
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
            scope: this
        }];
        return gxp.plugins.KMLImporter.superclass.addActions.apply(this, [actions]);		
		
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.target.on('ready', function(){
            
            this.addOutput();
        }, this);	
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

Ext.preg(gxp.plugins.KMLImporter.prototype.ptype, gxp.plugins.KMLImporter);
