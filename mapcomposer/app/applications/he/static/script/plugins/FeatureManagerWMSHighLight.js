/**
 *  Copyright (C) 2007 - 2015 GeoSolutions S.A.S.
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
 * @author Andrea Cappugi (kappu72@gmail.com)
 */
 /** api: (define)
 *  module = gxp.plugins
 *  class = FeatureManagerWMSHighLight
 */

/** api: (extends)
 *  plugins/gxp.plugins.FeatureManager
 */
Ext.namespace('gxp.he');

/** api: constructor
 *  .. class:: FeatureManagerWMSHighLight(config)
 *  This class add wms highligth capability to FeatureManager plugin.
 *
 */
gxp.plugins.FeatureManagerWMSHighLight = Ext.extend(gxp.plugins.FeatureManager, {
 /** api: ptype = gxp_featuremanagerwmshighlight */
    ptype: "gxp_featuremanagerwmshighlight",

     /** private: property[highLightLayer]
     *  ``OpenLayers.Layer.WMS`` WMS Layer used to highlight all selected
     *    feature
     */
    highLightLayer: null,

    /** api: config[wmsHighLight]
     *  ``Boolean`` If true will show wms layer with highlighted features
     *    feature
     */
    wmsHighLight:true,

    /** api: config[strWithHighLight]
     *  ``String``
     *    default string to identify highlight styles.
     */
    strWithHighLight:"_highlight",

    /** api: config[disableGeometry]
     *  If true featuremanager dosn't downlad geometry.
     *  To succed in zoonToFeature geoserver wfs service nedded to be configured
     *  with return bounding box with every feature
     *
     */
     disableGeometry:true,

    /**
     * api: config[selectionSymbolizer]
     * {Object} Determines the styling of the selected objects.
     */
    selectionSymbolizer:{
        'Polygon': {fillColor: '#FF0000',fillOpacity:1, stroke: '#FFFF00',strokeWidth: 2},
        'Line': {strokeColor: '#FF0000', strokeWidth: 2},
        'Point': {graphicName: 'square', fillOpacity:1,fillColor: '#FF0000', strokeColor: '#FFFF00',pointRadius: 5}
    },

     /** private: method[init]
     */
    init: function(target) {
        gxp.plugins.FeatureManagerWMSHighLight.superclass.init.apply(this, arguments);


        this.on({
            //TODO add a beforedestroy event to the tool
            beforedestroy: function() {
                if(this.highLightLayer)this.target.mapPanel.map.removeLayer(this.highLightLayer);
            },
            query: function(tool,store,filter){
                //Higlight filter result in wms original layer
                if(filter && store && this.wmsHighLight){

                    var layer=this.layerRecord.get("layer");
                    if(!this.highLightLayer) this.createHighLightLayer(layer);
                    else if(this.highLightLayer.name!=layer.name){
                            this.destroyHighLightLayer();
                            this.createHighLightLayer(layer);
                        }
                    var protocol=store.proxy.protocol;
                    var format= new OpenLayers.Format.Filter({ ////new OpenLayers.Format.CQL();
                            version: protocol.version,
                            srsName: protocol.srsName
                    });
                    var qfilter=new OpenLayers.Format.XML().write(format.write(filter));
                    var highlightStyle=this.hasHighLightStyle(this.layerRecord);
                    if(!highlightStyle){
                    	var sld = {version: "1.0.0", namedLayers: {}};
                    	var name = this.layerRecord.data.name;
                    	sld.namedLayers[name] = {name: name, userStyles: []};
                    	var symbolizer = this.selectionSymbolizer;
                    	if (this.geometryType.indexOf('Polygon') >= 0) {
                           symbolizer = {Polygon: this.selectionSymbolizer['Polygon']};
                    	} else if (this.geometryType.indexOf('LineString') >= 0) {
                         symbolizer = {Line: this.selectionSymbolizer['Line']};
                    	} else if (this.geometryType.indexOf('Point') >= 0) {
                         symbolizer = {Point: this.selectionSymbolizer['Point']};
                    	}else if (this.geometryType.indexOf('MultiLine') >= 0) {
                         symbolizer = {Line: this.selectionSymbolizer['Line']};
                    	}else if (this.geometryType.indexOf('MultiSurface') >= 0) {
                         symbolizer = {Polygon: this.selectionSymbolizer['Polygon']};
                    	}
                   		sld.namedLayers[name].userStyles.push({name: 'default', rules: [
                        new OpenLayers.Rule({symbolizer: symbolizer
                       //, maxScaleDenominator: this.featureLayer.minScale
                        })
                    	]});
                    	var sldDescriptor = new OpenLayers.Format.SLD({srsName: protocol.srsName}).write(sld);
                    	if(this.highLightLayer.vendorParams)this.highLightLayer.vendorParams.cql_filter=null;
                        this.highLightLayer.mergeNewParams({SLD_BODY: sldDescriptor,FILTER:qfilter,STYLES:null,CQL_FILTER:null});
                	}else{
                        if(this.highLightLayer.vendorParams)this.highLightLayer.vendorParams.cql_filter=null;
                		this.highLightLayer.mergeNewParams({STYLES: highlightStyle,FILTER:qfilter,CQL_FILTER:null});
                	}


                    if(!this.highLightLayer.map) layer.map.addLayer(this.highLightLayer);

                        this.highLightLayer.setVisibility(this.visible());

            }
            },
            clearfeatures:function(){
                if( this.highLightLayer && this.wmsHighLight && this.wmsHighLight && this.highLightLayer.map){
                    this.highLightLayer.map.removeLayer(this.highLightLayer);
                }
            },
            layerchange:function(){
                if( this.highLightLayer && this.wmsHighLight && this.wmsHighLight && this.highLightLayer.map){
                    this.highLightLayer.map.removeLayer(this.highLightLayer);
                }
            },
            scope: this
        });

    },  /** private: method[setFeatureStore]
     *  :arg filter: ``OpenLayers.Filter``
     *  :arg autoLoad: ``Boolean``
     */
    setFeatureStore: function(filter, autoLoad) {
        var record = this.layerRecord;
        var source = this.target.getSource(record);
        if (source && source instanceof gxp.plugins.WMSSource) {
            source.getSchema(record, function(schema) {
                if (schema === false) {

                    //information about why selected layers are not queriable.
                    var layer = record.get("layer");
                    var wmsVersion = layer.params.VERSION;
                    Ext.MessageBox.show({
                        title: this.noValidWmsVersionMsgTitle,
                        msg: this.noValidWmsVersionMsgText + wmsVersion,
                        buttons: Ext.Msg.OK,
                        animEl: 'elId',
                        icon: Ext.MessageBox.INFO
                    });

                    this.clearFeatureStore();
                } else {
                    var fields = [], geometryName,propertyNames=[];
                    var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    var types = {
                        "xsd:boolean": "boolean",
                        "xsd:int": "int",
                        "xsd:integer": "int",
                        "xsd:short": "int",
                        "xsd:long": "int",
                        "xsd:date": "date",
                        "xsd:string": "string",
                        "xsd:float": "float",
                        "xsd:double": "float"
                    };

                    schema.each(function(r) {
                        var match = geomRegex.exec(r.get("type"));
                        if (match) {
                            geometryName = r.get("name");
                            this.geometryType = match[1];
                        } else {
                            // TODO: use (and improve if needed) GeoExt.form.recordToField
                            var type = types[r.get("type")];
                            var field = {
                                name: r.get("name"),
                                type: types[type]
                            };
                            //TODO consider date type handling in OpenLayers.Format
                            if (type == "date") {
                                field.dateFormat = "Y-m-d\\Z";
                            }
                            fields.push(field);
                            propertyNames.push(r.get("name"));
                        }
                    }, this);

                    var protocolOptions = {
                        srsName: this.target.mapPanel.map.getProjection(),
                        url: schema.url,
                        featureType: schema.reader.raw.featureTypes[0].typeName,
                        featureNS: schema.reader.raw.targetNamespace,
                        geometryName: geometryName

                    };
                    //
                    // Check for existing 'viewparams' inside the selected layer
                    //
                    var layer = record.getLayer();
                    if(layer){
                        protocolOptions = Ext.applyIf(protocolOptions, layer.vendorParams ? {viewparams: layer.vendorParams.viewparams} : {});
                    }

                    this.hitCountProtocol = new OpenLayers.Protocol.WFS(Ext.apply({
                        version: "1.1.0",
                        readOptions: {output: "object"},
                        resultType: "hits",
                        filter: filter
                    }, protocolOptions));

                    this.featureStore = new gxp.data.WFSFeatureStore(Ext.apply({
                        fields: fields,
                        proxy: {
                            protocol: {
                                outputFormat: this.format,
                                propertyNames: (this.disableGeometry)? propertyNames:[]
                            }
                        },

                        maxFeatures: this.maxFeatures,
                        layer: this.featureLayer,
                        ogcFilter: filter,
                        sortBy: this.sortBy,
                        remoteSort:this.remoteSort,
                        autoLoad: autoLoad,
                        autoSave: false,
                        listeners: {
                            "write": function() {
                                this.redrawMatchingLayers(record);
                            },
                            "load": function() {
                                this.fireEvent("query", this, this.featureStore, this.filter);
                            },
                            scope: this
                        }
                    }, protocolOptions));
                }
                this.fireEvent("layerchange", this, record, schema);
            }, this);
        } else {
            this.clearFeatureStore();
            this.fireEvent("layerchange", this, record, false);
        }
    },

     /** private: method[setLayerDisplay]
     *
     */
    setLayerDisplay: function() {
    	gxp.plugins.FeatureManagerWMSHighLight.superclass.setLayerDisplay.apply(this, arguments);
        var show = this.visible();
        var map = this.target.mapPanel.map;
        if (show && this.highLightLayer && this.wmsHighLight && this.highLightLayer.map)
            this.highLightLayer.setVisibility(true);
        else if(this.highLightLayer && this.highLightLayer.map)
                this.highLightLayer.setVisibility(false);
       //if(this.highLightLayer && this.highLightLayer.map )map.setLayerIndex(this.highLightLayer, map.layers.length);
    },

    /** private: method[raiseLayer]
     *  Called whenever a layer is added to the map to keep this layer on top.
     */
    raiseLayer: function() {
        var map = this.featureLayer && this.featureLayer.map;
        if (map) {
            if(this.highLightLayer && this.highLightLayer.map )map.setLayerIndex(this.highLightLayer, map.layers.length);
            map.setLayerIndex(this.featureLayer, map.layers.length);
        }
    },
    /** private: method[redrawMatchingLayers]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *
     *  Called after features have been edited.  This method redraws all map
     *  layers with the same name & source as the provided layer record.
     */
    redrawMatchingLayers: function(record) {
        gxp.plugins.FeatureManagerWMSHighLight.superclass.redrawMatchingLayers.apply(this, arguments);
        if(this.highLightLayer)this.highLightLayer.redraw();
    },

    /** private: method[createHighLightLayer]
     *  :arg sourceLayer: ``OpenLayers.Layers.WMS`` Layer to be highlighted
     *  :returns: ``OpenLayers.Layers.WMS`` The new WMS layer for highlighting features
     *
     *  Creates WMS layer where to highlight features.
     */
	createHighLightLayer:function(sourceLayer){
        this.highLightLayer=sourceLayer.clone();
        this.highLightLayer.setVisibility(false);
        this.highLightLayer.displayInLayerSwitcher=false;
        return this.highLightLayer;
    },
    /** private: method[destroyHighLightLayer]
     *
     *  Remov from map and destroy highLightLayer
     */
    destroyHighLightLayer:function(){
        if (this.highLightLayer.map) map.removeLayer(this.highLightLayer);
        this.highLightLayer.destroy();
        this.highLightLayer=null;
    },
    /** private: method[hasHighLightStyle]
     *  :arg sourceLayer: ``GeoExt.data.LayerRecord`` Layer to be highlighted
     *  :returns: ``String`` HighLight style name or undefined
     *
     *  Remov from map and destroy highLightLayer
     */
    hasHighLightStyle:function(sourceLayer){
    		var styles = sourceLayer.get('styles');
    	    if(styles){
                for (var key in styles){
                    if(styles.hasOwnProperty(key)){
                        var obj = styles[key];
                        var sld = obj.name.search(this.strWithHighLight);
                        if(sld != -1)
                            return obj.name;

                        }
                    }
                }
             return undefined;

    }
});


Ext.preg(gxp.plugins.FeatureManagerWMSHighLight.prototype.ptype, gxp.plugins.FeatureManagerWMSHighLight);