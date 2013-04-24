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
gxp.plugins.KMLExporter = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_export_kml */
    ptype: "gxp_export_kml",
    
    /** api: config[importKMLMenuText]
     *  ``String``
     *  Text for import KML item (i18n).
     */
    exportKMLMenuText: "Export KML",
    
    
    /** api: config[layerEmptyText]
     *  ``String``
     *  Text (i18n).
     */
    layerEmptyText: "The selected Layer is empty",
    
    /** api: config[notVectorlayerText]
     *  ``String``
     *  Text (i18n).
     */
    notVectorlayerText: "Please select only Vector Layer",
    
    
    /** api: config[notLayerSelectedText]
     *  ``String``
     *  Text (i18n).
     */
    notLayerSelectedText: "Please select a Vector Layer",
    
    
    /** api: config[kmlExportTitleText]
     *  ``String``
     *  Text (i18n).
     */
    kmlExportTitleText: "KML/KMZ Export",
    
    
    /** api: config[kmlExportErrorText]
     *  ``String``
     *  Text (i18n).
     */
    kmlExportErrorText: "Error while reading the server response",
    


    /** api: config[importKMLTooltip]
     *  ``String``
     *  Text for import KML tooltip (i18n).
     */
    exportKMLTooltip: "Export KML",
  
    /** api: config[uploadWindowTitle]
     *  ``String``
     *  Title of the window (i18n).
     */
    downloadWindowTitle: 'Download KML file',

    alternativeStyle: false,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.KMLExporter.superclass.constructor.apply(this, arguments);
        // this.layer = config.layer;
        this.alternativeStyle = config.alternativeStyle || false;
        this.toggleGroup = config.toggleGroup;
        this.srs = config.srs || "EPSG:4326";
    },

    addOutput: function(config){
        var map = this.target.mapPanel.map;
        
        this.service = this.service ?  this.service : ('http://' + window.location.host + '/xmlJsonTranslate/');
	
        var self = this;
        var disabled= this.layerName ? true: false;
        this.exportButton = new Ext.Button({
            toggleGroup: self.toggleGroup,
            menuText: this.exportKMLMenuText,
            disabled: disabled,
            iconCls: "gxp-icon-export-kml",
            tooltip: this.exportKMLTooltip,
            scope: this,
            handler: function() {
                var layer;
                
                try{
                    layer= (self.layer) ? self.layer : self.target.selectedLayer.data.layer;
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
                                    feature.attributes.name = feature.attributes.name || 'No name available';
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
                                    url: self.service+"/Transform" ,
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
                                        
                                        self.exportKML(features);
                                
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
                                self.exportKML(features);  
                        }else
                            Ext.Msg.show({
                                title: self.kmlExportTitleText,
                                msg: self.layerEmptyText,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });  
                    } else
                        Ext.Msg.show({
                            title: self.kmlExportTitleText,
                            msg: self.notVectorlayerText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        });  
                }else
                    Ext.Msg.show({
                        title: self.kmlExportTitleText,
                        msg: self.notLayerSelectedText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    }); 
                
               self.exportButton.toggle( false );
            }
        });
		
		
        // open an upload file window
        var actions = [
        this.exportButton
        ];
        return gxp.plugins.KMLExporter.superclass.addActions.apply(this, [actions]);		
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.target.on('ready', function(){
            var self = this;
            if(this.layerName){
                this.layer = this.createLayer( this.target.mapPanel.map);                 
                
                this.layer.events.on({
                    'featureadded': function(feature){
                        self.exportButton.enable();
                    },
                    'featuresremoved': function( features ){
                        if ( self.layer.features.length <= 0 ){
                            self.exportButton.toggle( false );
                            self.exportButton.disable();
                        }
                    },
                    'featureremoved': function(deleted){
                        if ( self.layer.features.length <= 0 ){
                            self.exportButton.toggle( false );
                            self.exportButton.disable();
                        }
                    }
                });	   
            }
            			
				
            this.addOutput();

        }, this);
	

    },

    /**
     *  create a custom layer or it returns an existing one
     */
    createLayer: function( map ){
        var layers = map.getLayersByName( this.layerName );
        if ( layers.length > 0 ){
            return layers[0]; // return the first layer with the given name
        } else {
            var layer;
            if ( this.alternativeStyle ){
                layer = new OpenLayers.Layer.Vector( this.layerName, {
                    projection: new OpenLayers.Projection(map.getProjection()), 
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
                layer = new OpenLayers.Layer.Vector( this.layerName, {
                    projection: new OpenLayers.Projection(map.getProjection())
                });	
            }

            map.addLayer( layer );
            return layer;
        }
    },
    
    
    exportKML: function(features){
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
            title: this.downloadWindowTitle,
            iconCls: "gxp-icon-export-kml",
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
        
    }


});

Ext.preg(gxp.plugins.KMLExporter.prototype.ptype, gxp.plugins.KMLExporter);
