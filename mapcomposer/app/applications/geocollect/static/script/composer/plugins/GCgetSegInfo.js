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
 *  class = WMSGetFeatureInfo
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfo(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    GetFeatureInfo request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */   
gxp.plugins.GCgetSegInfo = Ext.extend(gxp.plugins.ClickableFeatures, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo */
    ptype: "gxp_gcgetinfo",
    
    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Get Feature Info",
    
    /** api: config[showSelectedOnly]
     *  ``Boolean`` If set to true, only selected features will be displayed
     *  on the layer. If set to false, all features (on the current page) will
     *  be. Default is true.
     */
    showSelectedOnly: true,
    
    
     
    /** private: property[autoLoadedFeature]
     *  ``OpenLayers.Feature`` the auto-loaded feature when autoLoadFeatures is
     *  true.
     */
    autoLoadedFeature: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */
     
 
     
    /** api: method[addActions]
     */
    addActions: function() {
        var featureManager = this.target.tools[this.featureManager];
        var featureLayer = featureManager.featureLayer;

        // optionally set up snapping
        var snapId = this.snappingAgent;
        if (snapId) {
            var snappingAgent = this.target.tools[snapId];
            if (snappingAgent) {
                snappingAgent.addSnappingControl(featureLayer);
            } else {
                throw new Error("Unable to locate snapping agent: " + snapId);
            }
        }

                
        // create a SelectFeature control
        // "fakeKey" will be ignord by the SelectFeature control, so only one
        // feature can be selected by clicking on the map, but allow for
        // multiple selection in the featureGrid
        this.selectControl = new OpenLayers.Control.SelectFeature(featureLayer, {
            clickout: false,
            multipleKey: "fakeKey",
            unselect: function() {
                // TODO consider a beforefeatureunselected event for
                // OpenLayers.Layer.Vector
                if (!featureManager.featureStore.getModifiedRecords().length) {
                    OpenLayers.Control.SelectFeature.prototype.unselect.apply(this, arguments);
                }
            },
            eventListeners: {
                "activate": function() {
                    if (this.autoLoadFeatures === true || featureManager.paging) {
                        this.target.mapPanel.map.events.register(
                            "click", this, this.noFeatureClick
                        );
                    }
                    featureManager.showLayer(
                        this.id, this.showSelectedOnly && "selected"
                    );
                    this.selectControl.unselectAll();
                },
                "deactivate": function() {
                    if (this.autoLoadFeatures === true || featureManager.paging) {
                        this.target.mapPanel.map.events.unregister(
                            "click", this, this.noFeatureClick
                        );
                    }
                    
                        featureManager.hideLayer(this.id);
                   
                },
                scope: this
            }
        });
        
        featureLayer.events.on({
            "beforefeatureremoved": function(evt) {
                this.selectControl.unselect(evt.feature);
            },
            "featureunselected": function(evt) {
                
            },
            "beforefeatureselected": function(evt) {
                //TODO decide if we want to allow feature selection while a
                // feature is being edited. If so, we have to revisit the
                // SelectFeature/ModifyFeature setup, because that would
                // require to have the SelectFeature control *always*
                // activated *after* the ModifyFeature control. Otherwise. we
                // must not configure the ModifyFeature control in standalone
                // mode, and use the SelectFeature control that comes with the
                // ModifyFeature control instead.
                
            },
            "featureselected": function(evt) {
                var feature = evt.feature;
                var featureStore = featureManager.featureStore;
                if(this.selectControl.active) { 
                  
                }
            },
            scope: this
        });

        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = gxp.plugins.FeatureEditor.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: this.infoActionTip,
            iconCls: "gxp-icon-selectfeature",
            enableToggle: true,
            allowDepress: true,
            disabled:true,
            toggleGroup: toggleGroup,
            control: this.selectControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
            })]);

        featureManager.on("layerchange", this.onLayerChange, this);
        
        return actions;
    },

    /** private: method[onLayerChange]
     *  :arg mgr: :class:`gxp.plugins.FeatureManager`
     *  :arg layer: ``GeoExt.data.LayerRecord``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     */
    onLayerChange: function(mgr, layer, schema) {
        var snapId = this.snappingAgent;
        
        if (snapId){
            var snappingAgent = this.target.tools[snapId]; 
        }

        this.schema = schema;
        var disable = !schema || !this.target.isAuthorized();
        this.actions[0].setDisabled(disable);
        if (disable) {
            // not a wfs capable layer or not authorized
            if(snappingAgent){
                snappingAgent.actions[0].setDisabled(disable);
            }      
            return;
        }

    },
    
    /** private: method[select]
     *  :arg feature: ``OpenLayers.Feature.Vector``
     */
    select: function(feature) {
        this.selectControl.unselectAll();
        this.selectControl.select(feature);
    }




    
});

Ext.preg(gxp.plugins.GCgetSegInfo.prototype.ptype, gxp.plugins.GCgetSegInfo);
