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
 *  class = ZoomToExtent
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ZoomToTimeExtent(config)
 *
 *    Provides an action for zooming to an extent.  If not configured with a 
 *    specific extent, the action will zoom to the map's visible extent.
 */
gxp.plugins.ZoomToTimeExtent = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_zoomtoextent */
    ptype: "gxp_zoomtotimeextent",
    
    /** api: config[buttonText]
     *  ``String`` Text to show next to the zoom button
     */
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Zoom To Time Extent",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Zoom To Time Extent",
    
    layerTimeAlert: "The selected Layer has no temporal dimension",
    
    /** private: property[iconCls]
     */
    iconCls: "gxp-icon-zoomtotimeextent",
    
    /** private: method[destroy]
     */
    destroy: function() {
        this.selectedRecord = null;
        gxp.plugins.ZoomToTimeExtent.superclass.destroy.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {

        var selectedLayer;
        
        var actions = gxp.plugins.ZoomToTimeExtent.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function() {
                var map = this.target.mapPanel.map;
                var timeManagers = map.getControlsByClass('OpenLayers.Control.TimeManager');
                var layer = selectedLayer.getLayer();
                if (layer instanceof OpenLayers.Layer.WMS && layer.dimensions && layer.dimensions.time && timeManagers[0]){
                    
                    var records = [];

                    records.push({
                        record: layer
                    });
                    
                    //Sets time parameter for added layers 
                    app.addTemporalLayers(records);
                    
                }else{
                    Ext.Msg.alert(this.menuText,this.layerTimeAlert);
                    return;
                };                

            },
            scope: this
        }]);
        
        var zoomToTimeExtentAction = actions[0];

        this.target.on("layerselectionchange", function(record) {
            selectedLayer = record.get('group') === 'background' ? null : record;             
            
            if(selectedLayer){
                zoomToTimeExtentAction.enable();
            }
            
            zoomToTimeExtentAction.setDisabled(
                !selectedLayer || this.target.mapPanel.layers.getCount() <= 1 || !record
            );

            if(record.get('group') === 'background')
                zoomToTimeExtentAction.disable();
                
        }, this); 

        this.target.on("groupselectionChange", function(record) {
            zoomToTimeExtentAction.disable();
        });
        
        var enforceOne = function(store) {
            zoomToTimeExtentAction.setDisabled(
                !selectedLayer || store.getCount() <= 1
            );
        }
        
        this.target.mapPanel.layers.on({
            "add": enforceOne,
            "remove": function(store){
                zoomToTimeExtentAction.setDisabled(true);
            }
        });        
        
        return actions;        
       
    }
        
});

Ext.preg(gxp.plugins.ZoomToTimeExtent.prototype.ptype, gxp.plugins.ZoomToTimeExtent);
