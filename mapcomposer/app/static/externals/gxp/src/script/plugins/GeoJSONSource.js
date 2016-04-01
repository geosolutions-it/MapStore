/**
* Copyright (c) 2015-2016 GeoSolutions S.A.S
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


/**
 * @requires plugins/LayerSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoJSONSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

gxp.plugins.GeoJSONSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_geojsonsource */
    ptype: "gxp_geojsonsource",

    title: "GeoJSON Source",

    urlSource: null,

    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        this.store = new Ext.data.Store();
        this.fireEvent("ready", this);
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var olLayer = new OpenLayers.Layer.Vector(config.title || config.name, Ext.apply({
            visibility: ("visibility" in config) ? config.visibility : true,
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: this.urlSource,
                params: config.baseParams,
                format: new OpenLayers.Format.GeoJSON({
                    'internalProjection': this.target.mapPanel.map.getProjectionObject(),
                    'externalProjection': new OpenLayers.Projection("EPSG:4326")
                })
            })
        },this.createLayerStyle(config) || {}));
        var Record = GeoExt.data.LayerRecord.create();
        var retval = new Record(Ext.apply(config, {
            layer: olLayer,
            queryable: true,
            isGeoJSON: true
        }));

        return retval;
    },
    createLayerStyle: function(config) {
        var style = {};
        var styleMap = null;
        if (config.symbolizer) {
            style["default"] =new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    name : config.name,
                    symbolizer: config.symbolizer
                })]
            });
        }
        if (config.selectedSymbolizer) {
            style["selected"]=  new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    name : config.name,
                    symbolizer: config.selectedSymbolizer
                })]
          });
        }
        if(style.default || style.selected) {
          styleMap = { "styleMap": new OpenLayers.StyleMap(style)};
        }
        return styleMap;
    }
});

Ext.preg(gxp.plugins.GeoJSONSource.prototype.ptype, gxp.plugins.GeoJSONSource);
