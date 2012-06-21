/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoReferences
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoReferences(config)
 *
 *    Provides an action for zooming to an extent.  If not configured with a 
 *    specific extent, the action will zoom to the map's visible extent.
 */
gxp.plugins.GeoReferences = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_georeferences */
    ptype: "gxp_georeferences",

    /** api: config[initialText]
     *  ``String``
     *  Initial text for combo box (i18n).
     */
    initialText: "Select an area",
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Georeferences",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Georeferences",
    
    georeferences:[],
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.GeoReferences.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var georeferencesStore = new Ext.data.ArrayStore({
            fields: ['name', 'geometry'],
            data :  this.target.georeferences
        });

        var map = this.target.mapPanel.map;
        var georeferencesSelector = new Ext.form.ComboBox({
            store: georeferencesStore,
            displayField: 'name',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: this.initialText,
            selectOnFocus:true,
            editable: true,
            resizable: true,
            listeners: {
                select: function(cb, record, index) {
                    var bbox = new OpenLayers.Bounds.fromString(record.get('geometry'));
                    bbox = bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection(map.projection));
                    map.zoomToExtent(bbox);
                }
            }
        });
        
        var actions = [georeferencesSelector];
        return gxp.plugins.GeoReferences.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.GeoReferences.prototype.ptype, gxp.plugins.GeoReferences);
