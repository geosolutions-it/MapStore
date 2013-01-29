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

/** api: (define)
 *  module = gxp.plugins
 *  class = NoSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: NoSource(config)
 *
 *    Plugin  to create empty layers with :class:`gxp.Viewer` instances.
 */   
/** api: example
 *  Configuration in the  :class:`gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *    defaultSourceType: "gxp_nosource"
 *
 * 
 */
gxp.plugins.NoSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gxp_nosource */
    ptype: "gxp_nosource",
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var Record = GeoExt.data.LayerRecord.create(['layer','group','title']);
        return new Record({
			layer: new OpenLayers.Layer(config.title),
			group: config.group,
			title: config.title
		}, 0);
    }
    
});

Ext.preg(gxp.plugins.NoSource.prototype.ptype, gxp.plugins.NoSource);
