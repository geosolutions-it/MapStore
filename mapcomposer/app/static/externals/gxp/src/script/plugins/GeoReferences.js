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
