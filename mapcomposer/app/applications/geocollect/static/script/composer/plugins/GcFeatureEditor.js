/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * requires plugins/ClickableFeatures.js
 * requires widgets/FeatureEditPopup.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureEditor
 */

/** api: (extends)
 *  plugins/ClickableFeatures.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureEditor(config)
 *
 *    Plugin for feature editing. Requires a
 *    :class:`gxp.plugins.FeatureManager`.
 */   
gxp.plugins.GcFeatureEditor = Ext.extend(gxp.plugins.ClickableFeatures, {
    
    /** api: ptype = gxp_featureeditor */
    ptype: "gxp_gcfeatureeditor",

    /** api: config[iconClsAdd]
     *  ``String``
     *  iconCls to use for the add button.
     */
    iconClsAdd: "gxp-icon-addfeature",

    /** api: config[iconClsEdit]
     *  ``String``
     *  iconCls to use for the edit button.
     */
    iconClsEdit: "gxp-icon-selectfeature",

    /** api: config[createFeatureActionTip]
     *  ``String``
     *  Tooltip string for create new feature action (i18n).
     */
    createFeatureActionTip: "Crea nuova segnalazione",



     saveOrCancelEdit:'Save or cancel changes',

    /** api: config[createFeatureActionText]
     *  ``String``
     *  Create new feature text.
     */
    
    /** api: config[editFeatureActionTip]
     *  ``String``
     *  Tooltip string for edit existing feature action (i18n).
     */
    editFeatureActionTip: "Seleziona segnalazioni",

    /** api: config[editFeatureActionText]
     *  ``String``
     *  Modify feature text.
     */

    /** api: config[outputTarget]
     *  ``String`` By default, the FeatureEditPopup will be added to the map.
     */
    outputTarget: "map",
    
    /** api: config[snappingAgent]
     *  ``String`` Optional id of the :class:`gxp.plugins.SnappingAgent` to use
     *  with this tool.
     */
    snappingAgent: null,
    
    /** api: config[readOnly]
     *  ``Boolean`` Set to true to use the FeatureEditor merely as a feature
     *  info tool, without editing capabilities. Default is false.
     */
    readOnly: false,

    /** api: config[modifyOnly]
     *  ``Boolean`` Set to true to use the FeatureEditor merely as a feature
     *  modify tool, i.e. there is no option to add new features.
     */
    modifyOnly: false,
    
    /** api: config[autoLoadFeatures]
     *  ``Boolean`` Should this tool load features on click? If set to true,
     *  and if there is no loaded feature at the click position, this tool will
     *  call loadFeatures on the ``featureManager``, with a ``FeatureId``
     *  filter created from the id of a feature returned from a WMS
     *  GetFeatureInfo request at the click position. This feature will then be
     *  selected immediately. Default is false.
     */
    autoLoadFeatures: false,
    
    /** api: config[showSelectedOnly]
     *  ``Boolean`` If set to true, only selected features will be displayed
     *  on the layer. If set to false, all features (on the current page) will
     *  be. Default is true.
     */
    showSelectedOnly: true,
    
    /** api: config[fields]
     *  ``Array``
     *  List of field config names corresponding to feature attributes.  If
     *  not provided, fields will be derived from attributes. If provided,
     *  the field order from this list will be used, and fields missing in the
     *  list will be excluded.
     */

    /** api: config[excludeFields]
     *  ``Array`` Optional list of field names (case sensitive) that are to be
     *  excluded from the property grid of the FeatureEditPopup.
     */

    /** private: property[drawControl]
     *  ``OpenLayers.Control.DrawFeature``
     */
    drawControl: null,
    
    /** private: property[popup]
     *  :class:`gxp.FeatureEditPopup` FeatureEditPopup for this tool
     */
    popup: null,
    
    /** private: property[autoLoadedFeature]
     *  ``OpenLayers.Feature`` the auto-loaded feature when autoLoadFeatures is
     *  true.
     */
    autoLoadedFeature: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
    
    /** api: method[addActions]
     */
    addActions: function() {
        var popup,segForm;
        var featureManager = this.target.tools[this.featureManager];
        var featureLayer = featureManager.featureLayer;
        var  gcseg= this.target.tools[this.gcseg];
        
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

        var intercepting = false;
        // intercept calls to methods that change the feature store - allows us
        // to persist unsaved changes before calling the original function
        function intercept(mgr, fn) {
            var fnArgs = Array.prototype.slice.call(arguments);
            // remove mgr and fn, which will leave us with the original
            // arguments of the intercepted loadFeatures or setLayer function
            fnArgs.splice(0, 2);
            if (!intercepting && popup && !popup.isDestroyed) {
                if (popup.editing) {
                    function doIt() {
                        intercepting = true;
                        unregisterDoIt.call(this);
                        if (fn === "setLayer") {
                            this.target.selectLayer(fnArgs[0]);
                        } else if (fn === "clearFeatures") {
                            // nothing asynchronous involved here, so let's
                            // finish the caller first before we do anything.
                            window.setTimeout(function() {mgr[fn].call(mgr);});
                        } else {
                            mgr[fn].apply(mgr, fnArgs);
                        }
                    };
                    function unregisterDoIt() {
                        featureManager.featureStore.un("write", doIt, this);
                        popup.un("canceledit", doIt, this);
                        popup.un("cancelclose", unregisterDoIt, this);
                    }
                    featureManager.featureStore.on("write", doIt, this);
                    popup.on({
                        canceledit: doIt,
                        cancelclose: unregisterDoIt,
                        scope: this
                    });
                    popup.close();
                }
                return !popup.editing;
            }
            intercepting = false;
        };
        featureManager.on({
            "beforequery": intercept.createDelegate(this, "loadFeatures", 1),
            "beforelayerchange": intercept.createDelegate(this, "setLayer", 1),
            "beforesetpage": intercept.createDelegate(this, "setPage", 1),
            "beforeclearfeatures": intercept.createDelegate(this, "clearFeatures", 1),
            scope: this
        });
        featureManager.on({
            "beforequery": function(){  
                if(gcseg.segEditing){
                     this.stopQueryMsg();
                    return false;}
            },    
            "beforesetpage": function(){
                if(gcseg.segEditing){
                     this.stopQueryMsg();
                    return false;}
            },
            "beforeclearfeatures": function(){
                if(gcseg.segEditing){
                     this.stopQueryMsg();
                    return false;}
                
            },"clearfeatures": function(){
               //Ricarica inizio!!
                   featureManager.loadFeatures();            
            }
            ,scope:this});
           
            
            
        this.drawControl = new OpenLayers.Control.DrawFeature(
            featureLayer,
            OpenLayers.Handler.Point, 
            {
                eventListeners: {
                    featureadded: function(evt) {
                        if (this.autoLoadFeatures === true) {
                            this.autoLoadedFeature = evt.feature;
                        }
                    },
                    activate: function() {
                        featureManager.showLayer(
                            this.id, this.showSelectedOnly && "selected"
                        );
                    },
                    deactivate: function() {
                        featureManager.hideLayer(this.id);
                    },
                    scope: this
                }
            }
        );
        
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
                  if(featureLayer.selectedFeatures[0]) this.selectControl.highlight(featureLayer.selectedFeatures[0]);

                

                },
                "deactivate": function() {
                  //  gcseg.segGrid.toggleInfo.toggle(false);
                    gcseg.segGrid.getSelectionModel().clearSelections();
                    //gcseg.segGrid.getSelectionModel().lock();
                    if (this.autoLoadFeatures === true || featureManager.paging) {
                        this.target.mapPanel.map.events.unregister(
                            "click", this, this.noFeatureClick
                        );
                    }featureManager.hideLayer(this.id);
                    
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
             
               
                if( segForm && segForm.editing) {
                    
                     //evt.cancelBubble=false;
                     return false;
                }
            },
            "featureselected": function(evt) {
               var feature = evt.feature;
                var featureStore = featureManager.featureStore;
                //if(this.selectControl.active) 
                {
                    
                    //Genero sempre la scheda per editing anche se non la uso!!:-D
                       
                        var ftGrid=gcseg.segdet.seg.items.get(0);//recupero quella presente se c'è
                       
                        segForm= new gxp.plugins.GcSegForm(Ext.apply(  
                            {
                        feature:feature,
                        schema:featureManager.schema,
                        allowDelete: true, 
                        propertyNames:this.propertyNames, 
                        listeners: {
                            "startsegediting": function() {
                                gcseg.segEditing=true;
                               // if(!this.selectControl.active) this.selectControl.activate();
                                this.actions[0].items[0].disable();
                                this.actions[1].items[0].disable();
                                 gcseg.segGrid.getSelectionModel().lock();
                                this.target.mapPanelContainer.getTopToolbar().disable();
                                // featureManager.showLayer(
                              //  this.id, this.showSelectedOnly && "selected"
                           // );
                            },
                            "stopsegediting": function() {
                                gcseg.segEditing=false;
                                gcseg.segGrid.getSelectionModel().unlock();
                                this.target.mapPanelContainer.getTopToolbar().enable();
                               // var r = gcseg.segGrid.getSelectionModel().getSelected();//
                              //  if(r)this.selectControl.select(r.data.feature);
                                this.actions[0].items[0].enable();
                                this.actions[1].items[0].enable();
                                //TODO CONTROLLA SE HO TIGA SELEZIONATA E RISELEZIONA LA FEATURE!!
                               
                                
                            },
                            "featuremodified": function(popup, feature) {
                                featureStore.on({
                                    write: {
                                        fn: function(st,act) {
                                         
                                        if(act=='update')gcseg.segdet.seg_history.refreshHistory();
                                                                               },
                                        single: true
                                    },
                                    scope: this
                                });                                
                                if(feature.state === OpenLayers.State.DELETE) {                                    
                                    /**
                                     * If the feature state is delete, we need to
                                     * remove it from the store (so it is collected
                                     * in the store.removed list.  However, it should
                                     * not be removed from the layer.  Until
                                     * http://trac.geoext.org/ticket/141 is addressed
                                     * we need to stop the store from removing the
                                     * feature from the layer.
                                     */
                                    gcseg.segGrid.toggleInfo.toggle(false);
                                    gcseg.disableTools();
                                     featureStore._removing = true; // TODO: remove after http://trac.geoext.org/ticket/141
                                    featureStore.remove(featureStore.getRecordFromFeature(feature));
                                    delete featureStore._removing; // TODO: remove after http://trac.geoext.org/ticket/141
                                   
                                }
                                
                                featureStore.save();
                            },
                            "canceledit": function(popup, feature) {
                                if(feature===null)  {
                                    gcseg.segGrid.toggleInfo.toggle(false);
                                    gcseg.disableTools();}

                                featureStore.commitChanges();
                                
                            },
                            scope: this
                        }                    
                    }, {'editorConfig':this.initialConfig.editorConfig}));
                      gcseg.segdet.seg.insert(0,segForm);
                     
                    if(feature.state === OpenLayers.State.INSERT){
                       //ATTIVO EDITING E APRO IL PANNELLO
                        segForm.startEditing();
                        gcseg.segGrid.toggleInfo.toggle(true);
                    
                    }
                    
                    if(ftGrid){
                        
                         gcseg.segdet.seg.remove(ftGrid,true);
                         
                    }
                    gcseg.segdet.doLayout();
                     //Elimino i bottoni finti iniziali :-D
                     gcseg.segGrid.fBtGroup.hide();
                     gcseg.segGrid.getTopToolbar().add(segForm.b);
                     gcseg.segGrid.getTopToolbar().doLayout();
                    
                   }
            },
            "sketchcomplete": function(evt) {
                // Why not register for featuresadded directly? We only want
                // to handle features here that were just added by a
                // DrawFeature control, and we need to make sure that our
                // featuresadded handler is executed after any FeatureStore's,
                // because otherwise our selectControl.select statement inside
                // this handler would trigger a featureselected event before
                // the feature row is added to a FeatureGrid. This, again,
                // would result in the new feature not being shown as selected
                // in the grid.
                featureManager.featureLayer.events.register("featuresadded", this, function(evt) {
                    featureManager.featureLayer.events.unregister("featuresadded", this, arguments.callee);
                    this.drawControl.deactivate();
                   //this.selectControl.activate();
                    this.selectControl.select(evt.features[0]);
                });
            },
            scope: this
        });

        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = gxp.plugins.GcFeatureEditor.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: this.createFeatureActionTip,
            text: this.createFeatureActionText,
            iconCls: this.iconClsAdd,
            disabled: true,
            hidden: this.modifyOnly || this.readOnly,
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.drawControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: this.editFeatureActionTip,
            text: this.editFeatureActionText,
            iconCls: this.iconClsEdit,
            disabled: true,
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.selectControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        })]);

        featureManager.on("layerchange", this.onLayerChange, this);
        
        return actions;
    },
       stopQueryMsg:function(){
            
                    Ext.MessageBox.show({
                                        msg: this.saveOrCancelEdit,
                                         buttons: Ext.Msg.OK,
                                         animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
                                     });
            
            
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
        this.actions[1].setDisabled(disable);
        if (disable) {
            // not a wfs capable layer or not authorized
			if(snappingAgent){
				snappingAgent.actions[0].setDisabled(disable);
			}      
            return;
        }

        var control = this.drawControl;
        var button = this.actions[0];
        var handlers = {
            "Point": OpenLayers.Handler.Point,
            "Line": OpenLayers.Handler.Path,
            "Curve": OpenLayers.Handler.Path,
            "Polygon": OpenLayers.Handler.Polygon,
            "Surface": OpenLayers.Handler.Polygon
        };
        var simpleType = mgr.geometryType.replace("Multi", "");
        var Handler = handlers[simpleType];
        if (Handler) {
            var active = control.active;
            if(active) {
                control.deactivate();
            }
            control.handler = new Handler(
                control, control.callbacks,
                Ext.apply(control.handlerOptions, {multi: (simpleType != mgr.geometryType)})
            );
            if(active) {
                control.activate();
            }
            button.enable();
        } else {
            button.disable();
            
            //FIX about undefined geometryType on DB
            this.actions[1].disable();
			
			if(snappingAgent){
				snappingAgent.actions[0].disable();
			}
        }
    },
    
    /** private: method[select]
     *  :arg feature: ``OpenLayers.Feature.Vector``
     */
    select: function(feature) {
        var featureManager=this.target.tools[this.featureManager];
        this.selectControl.unselectAll(
            this.popup && this.popup.editing && {except: this.popup.feature});
        this.selectControl.select(feature);
    }
});

Ext.preg(gxp.plugins.GcFeatureEditor.prototype.ptype, gxp.plugins.GcFeatureEditor);
