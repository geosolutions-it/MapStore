/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 */

Ext.ns('gxp.data', 'gxp.plugins');

gxp.data.WMTSCapabilitiesReader = Ext.extend(Ext.data.DataReader, {
    constructor: function(meta, recordType) {
        meta = meta || {};
        if (!meta.format) {
            meta.format = new OpenLayers.Format.WMTSCapabilities();
        }
        if(typeof recordType !== "function") {
            recordType = GeoExt.data.LayerRecord.create(
                recordType || meta.fields || [
                    {name: "name", type: "string"},
                    {name: "title", type: "string"},
                    {name: "tileMapUrl", type: "string"}
                ]);
        }
        gxp.data.WMTSCapabilitiesReader.superclass.constructor.call(
            this, meta, recordType);
    },
    read: function(request) {
        var data = request.responseXML;
        if(!data || !data.documentElement) {
            data = request.responseText;
        }
        return this.readRecords(data);
    },
    equivalentProj: function(proj1, proj2) {
        // Necessary because OpenLayers.Projection.equals does not handle
        // equivalent definitions, e.g. EPSG:900913 vs urn:ogc:def:crs:EPSG::900913
        if (proj1.length < proj2.length) {
            var projtmp = proj1;
            proj1 = proj2;
            proj2 = projtmp;
        }
        proj1 = proj1.replace(/::/g, ":");
        proj2 = proj2.replace(/::/g, ":");
        return (proj1.indexOf(proj2, proj1.length - proj2.length) !== -1);
    },
    getMaxExtent: function(wgs84bounds, projection) {
            var maxExtent = wgs84bounds.transform(new OpenLayers.Projection("EPSG:4326"), projection);
            // make sure maxExtent is valid (transform does not succeed for all llbbox)
            if (!(1 / maxExtent.getHeight() > 0) || !(1 / maxExtent.getWidth() > 0)) {
                // maxExtent has infinite or non-numeric width or height
                // in this case, the map maxExtent must be specified in the config
                maxExtent = undefined;
            }
            return maxExtent;
    },
    readRecords: function(data) {
        var records = [], i, ii, j, jj, url, proj, projStr;
        if (typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
            this.raw = data;
            if (data.contents) {
                if (data.contents.layers && data.contents.tileMatrixSets) {
                    for (i=0, ii=data.contents.layers.length; i<ii; i++) { // loop on layers
                        var layer=data.contents.layers[i];
                        for (j=0, jj=layer.tileMatrixSetLinks.length; j<jj; j++) { // loop  on layer matrixSets to find compatible ones
                            if (data.contents.tileMatrixSets[layer.tileMatrixSetLinks[j].tileMatrixSet] &&
                                data.contents.tileMatrixSets[layer.tileMatrixSetLinks[j].tileMatrixSet].matrixIds.length>0){
                                    var matrixIds = data.contents.tileMatrixSets[layer.tileMatrixSetLinks[j].tileMatrixSet].matrixIds;
                                    // assume all the matrices in the set have the same projection
                                    projStr = matrixIds[0].supportedCRS;
                                    proj = new OpenLayers.Projection(projStr);
                                    if (this.meta.mapProjection.equals(proj) ||
                                        // handle equivalent defintions, e.g. EPSG:900913 vs urn:ogc:def:crs:EPSG::900913
                                        this.equivalentProj(projStr, this.meta.mapProjection.projCode)) {
                                            var style=null;
                                            if (layer.styles.length==0) {
                                                // this shouldn't happen according the standard, but some Geoserver versions
                                                // were buggy: https://jira.codehaus.org/browse/GEOS-6190
                                                style="";
                                            }
                                            else {
                                                var k, kk;
                                                for (k=0, kk=layer.styles.length; k<kk; k++) {
                                                    if (layer.styles[k].isDefault) {
                                                        style=layer.styles[k].identifier;
                                                        break;
                                                    }
                                                }
                                                if (style === null) {
                                                    // no default style, just choose the first one
                                                    style = layer.styles[0].identifier;
                                                }
                                            }
                                            var config = {
                                                    name: layer.title,
                                                    layer: layer.identifier,
                                                    url: this.meta.baseUrl.split("?")[0],
                                                    style: style,
                                                    matrixSet: layer.tileMatrixSetLinks[j].tileMatrixSet,
                                                    matrixIds: matrixIds,
                                                    maxExtent: this.getMaxExtent(layer.bounds, this.meta.mapProjection)
                                                };
                                            // prefer png if available
                                            for (var curFormat=0, formatCount=layer.formats.length; curFormat<formatCount; curFormat++) {
                                                if ("image/png" === layer.formats[curFormat]) {
                                                    config["format"]=layer.formats[curFormat];
                                                }
                                            }
                                            records.push(new this.recordType({
                                                layer: new OpenLayers.Layer.WMTS(config),
                                                title: layer.title,
                                                name: layer.identifier,
                                                tileMapUrl: this.meta.baseUrl
                                            }));
                                        }
                                }
                        }
                    }
                }
            }
        }
        return {
            totalRecords: records.length,
            success: true,
            records: records
        };
    }
});

/** api: (define)
 *  module = gxp.plugins
 *  class = TMSSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */

/** api: constructor
 *  .. class:: WMTSSource(config)
 *
 *    Plugin for using WMTS layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a Capabilities request to create a store of the WMTS's
 *    tile maps. It is currently not supported to use this source type directly
 *    in the viewer config, it is only used to add a TMS service dynamically
 *    through the AddLayers plugin.
 */
gxp.plugins.WMTSSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_wmtssource */
    ptype: "gxp_wmtssource",

    /** api: config[url]
     *  ``String`` WMTS service URL for this source
     */

    /** api: config[version]
     *  ``String`` WMTS version to use, defaults to 1.0.0
     */
    version: "1.0.0",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WMTSSource.superclass.constructor.apply(this, arguments);
        this.format = new OpenLayers.Format.WMTSCapabilities();
        /*
        if (this.url.slice(-1) !== '/') {
            this.url = this.url + '/';
        }*/
    },
    /** private: method
     */
    getCapabilitiesUrl: function(url, version) {
        var request = url;
        if (request.indexOf("?") === -1) { // has no '?'
            request = request + "?service=WMTS&request=GetCapabilities&version="+version;
        }
        else if ((request.indexOf("?")+1) === request.length) { // ends with '?"
            request = request + "service=WMTS&request=GetCapabilities&version="+version;
        }
        else { // check each required parameter
            request = request.toLowerCase().indexOf("service=wmts") === -1 ? request + "&service=WMTS" : request;
            request = request.toLowerCase().indexOf("request=getcapabilities") === -1 ? request + "&request=GetCapabilities" : request;
            request = request.toLowerCase().indexOf("version=") === -1 ? request + "&version=" + version : request;
        }
        return request;
    },
    /** private: method
     */
    getTitle: function(rawResponse) {
        if (rawResponse.serviceIdentification) {
            if (rawResponse.serviceIdentification.title) {
                return rawResponse.serviceIdentification.title;
            }
            else if (rawResponse.serviceIdentification.abstract) {
                return rawResponse.serviceIdentification.abstract;
            }
        }
        return null;
    },
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        var format = this.format;
        this.store = new Ext.data.Store({
            autoLoad: true,
            listeners: {
                load: function() {
                    this.title = this.getTitle(this.store.reader.raw);
                    this.fireEvent("ready", this);
                },
                exception: function() {
                    var msg = "Trouble creating WMTS layer store from response.";
                    var details = "Unable to handle response.";
                    this.fireEvent("failure", this, msg, details);
                },
                scope: this
            },
            proxy: new Ext.data.HttpProxy({
                url: this.getCapabilitiesUrl(this.url, this.version),
                disableCaching: false,
                method: "GET"
            }),
            reader: new gxp.data.WMTSCapabilitiesReader({
                baseUrl: this.url, 
                version: this.version, 
                mapProjection: this.getMapProjection()
            })
        });
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord`` or null when the source is lazy.
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config, callback, scope) {
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            var record = this.store.getAt(index);
            var layer = record.getLayer();
            if (layer.matrixSet !== null) {
                return record;
            }
        }
    }

});

Ext.preg(gxp.plugins.WMTSSource.prototype.ptype, gxp.plugins.WMTSSource);
