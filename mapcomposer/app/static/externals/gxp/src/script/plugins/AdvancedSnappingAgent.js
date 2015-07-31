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
 *  class = AdvancedSnappingAgent
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AdvancedSnappingAgent(config)
 *
 *    Plugin for managing snapping while editing.
 *
 *	Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */   
gxp.plugins.AdvancedSnappingAgent = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_advancedsnappingagent */
    ptype: "gxp_advancedsnappingagent",    
	
	iconCls: "snapping-button",
	
	tooltipText: "Enable/Disable Snapping",
    
	/** api: config[controlOptions]
     *  ``Object`` Options for the ``OpenLayers.Control.Snapping`` used with
     *  this tool.
     */
	 
	/** private: method[init]
     */
    init: function(target) {
        gxp.plugins.AdvancedSnappingAgent.superclass.init.apply(this, arguments);
        this.snappingTargets = [];
        this.controls = [];
        this.setSnappingTargets(this.targets);
    },
	
    /** private: method[setSnappingTargets]
     */
    setSnappingTargets: function(targets) {
        // clear any previous targets
        this.snappingTargets.length = 0;
        // configure any given targets
        if (targets) {
            for (var i=0, ii=targets.length; i<ii; ++i) {
                this.addSnappingTarget(targets[i]);
            }
        }else{
			this.addSnappingTarget();
		}
    },
    
    /** private: method[addSnappingTarget]
     */
    addSnappingTarget: function(snapTarget) {
        snapTarget = Ext.apply({}, snapTarget);
		var featureManager;
		
		var strategyBBOX = new OpenLayers.Strategy.BBOX({ratio: 1.5});
		
		var featureManagerConfig = {
            maxFeatures: null,
            paging: false,
            listeners: {
                layerchange: function() {
					// FIX about undefined geometryType on DB
                    if(featureManager.featureStore && featureManager.geometryType != "Geometry"){                    
                        var map = this.target.mapPanel.map;
                        
                        var featureLayer = map.getLayersByName(snapTarget.name || "snapping_target")[0];
                        if(featureLayer){
                            map.removeLayer(featureLayer);
                        }
                        
                        var style = {
                            "all": new OpenLayers.Style(null, {
                                rules: [new OpenLayers.Rule({
                                    symbolizer: {
                                        "Point": {
                                            pointRadius: 4,
                                            graphicName: "square",
                                            fillOpacity: 0,
                                            strokeWidth: 1,
                                            strokeOpacity: 0
                                        },
                                        "Line": {
                                            strokeWidth: 4,
                                            strokeOpacity: 0
                                        },
                                        "Polygon": {
                                            strokeWidth: 2,
                                            strokeOpacity: 0,
                                            fillOpacity: 0
                                        }
                                    }
                                })]
                            })
                        };
            
                        var layer = new OpenLayers.Layer.Vector(snapTarget.name || "snapping_target", {
                            protocol: featureManager.featureStore.proxy.protocol,
                            strategies: [strategyBBOX],
                            displayInLayerSwitcher: false,
                            visibility: true,
                            styleMap: new OpenLayers.StyleMap(style["all"], {extendDefault: true}),    
                            minResolution: snapTarget.minResolution,
                            maxResolution: snapTarget.maxResolution
                        });
                        
                        map.addLayer(layer);
                        map.events.on({
                            moveend: function() {
                                var min = snapTarget.minResolution || Number.NEGATIVE_INFINITY;
                                var max = snapTarget.maxResolution || Number.POSITIVE_INFINITY;
                                var resolution = map.getResolution();
                                if (min <= resolution && resolution < max) {
                                    layer.strategies[0].update();
                                }
                            },
                            scope: this
                        });
                        
                        snapTarget.layer = layer;
                        this.snappingTargets.push(snapTarget);
                        
                        for (var i=0, ii=this.controls.length; i<ii; ++i) {
                            this.controls[i].addTarget(snapTarget);
                        }

                        this.actions[0].enable();
						
                    }else{
                        this.actions[0].disable();
                    }
                },
                scope: this
            }
        };
		
		if(snapTarget.source && snapTarget.name){
			featureManagerConfig = Ext.apply(
				{
					layer: {
						source: snapTarget.source,
						name: snapTarget.name
					}
				}, 
				featureManagerConfig
			);
		}
        
		// TODO: Discuss simplifying this.  What we want here is a WFS protocol
        // given a WMS layer config.  We're only using the FeatureManager for 
        // generating the protocol options.
        featureManager = new gxp.plugins.FeatureManager(featureManagerConfig);
		
        //delete snapTarget.source;
        //delete snapTarget.name;

        featureManager.init(this.target);
    },
    
    /** api: method[addSnappingControl]
     *  :arg layer: ``OpenLayers.Layer.Vector`` An editable vector layer.
     *
     *  Prepares a snapping control for the provided layer.  All target
     *  configuration is derived from the configuration of this snapping agent.
     */
    addSnappingControl: function(layer) {
        var options = this.initialConfig.controlOptions || this.initialConfig.options;
        var control = new OpenLayers.Control.Snapping(
            Ext.applyIf({layer: layer}, options || {})
        );
        control.setTargets(this.snappingTargets);
        control.activate();
        this.controls.push(control);
    },
	
	addActions: function() {
	    var actions = [{
            enableToggle: true,
			pressed: true,
			disabled: true,
            iconCls: this.iconCls,
            tooltip: this.tooltipText,
            handler: function(button, state) {
                for(var i=0; i< this.controls.length; i++){
					var control = this.controls[i];
					if(button.pressed){
						control.activate();
					}else{
						control.deactivate();
					}
				}
            },
            scope: this
        }];
		
        return gxp.plugins.AdvancedSnappingAgent.superclass.addActions.apply(this, [actions]);
	}

});

Ext.preg(gxp.plugins.AdvancedSnappingAgent.prototype.ptype, gxp.plugins.AdvancedSnappingAgent);
