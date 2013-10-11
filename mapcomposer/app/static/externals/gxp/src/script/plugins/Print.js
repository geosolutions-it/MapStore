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
 *  class = Print
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Print(config)
 *
 *    Provides an action to print the map.
 */
gxp.plugins.Print = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_print */
    ptype: "gxp_print",

    /** api: config[printService]
     *  ``String``
     *  URL of the print service.
     */
    printService: null,
	/** api: config[ignoreLayers]
	 * ``boolean`` ignore layers for print 
	 * for print alerts.
	 */
	ignoreLayers:[],
    /** api: config[customParams]
     *  ``Object`` Key-value pairs of custom data to be sent to the print
     *  service. Optional. This is e.g. useful for complex layout definitions
     *  on the server side that require additional parameters.
     */
    customParams: null,
    legendPanelId : null,
    /** api: config[menuText]
     *  ``String``
     *  Text for print menu item (i18n).
     */
    menuText: "Print Map",

    /** api: config[tooltip]
     *  ``String``
     *  Text for print action tooltip (i18n).
     */
    tooltip: "Print Map",

    /** api: config[notAllNotPrintableText]
     *  ``String``
     *  Text for message when not all layers can be printed (i18n).
     */
    notAllNotPrintableText: "Not All Layers Can Be Printed. Please remove these layers and all the markers before print.",

    /** api: config[nonePrintableText]
     *  ``String``
     *  Text for message no layers are suitable for printing (i18n).
     */
    nonePrintableText: "None of your current map layers can be printed",

    notPrintableLayersText: "Following layers are not supported for print:",
    
    notPrintableMarkersText: "Please disable these layers and remove all markers before print",
    
    /** api: config[previewText]
     *  ``String``
     *  Text for print preview text (i18n).
     */
    previewText: "Print Preview",
    /** api config[legendOnSeparatePage]
     *  option checked in the print preview
     */
    legendOnSeparatePage:false,
    /** api config[includeLegend]
     *  option checked in the print preview
     */
    includeLegend:true,
    /** api config[defaultResolutionIndex]
     *  resolution at that index will be selected as default in the print preview
     */
    defaultResolutionIndex:0,
    /** api config[defaultLayoutIndex]
     *  layout at that index will be selected as default in the print preview
     */
    defaultLayoutIndex:0,
    
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Print.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {

        // don't add any action if there is no print service configured
        if (this.printService !== null) {

            var printProvider = new GeoExt.data.PrintProvider({
                defaultLayoutIndex:this.defaultLayoutIndex,
                defaultResolutionIndex:this.defaultResolutionIndex,
                url: this.printService,
                customParams: this.customParams,
                autoLoad: false,
                listeners: {
                    beforeprint: function() {
                        // The print module does not like array params.
                        // TODO Remove when http://trac.geoext.org/ticket/216 is fixed.
                        printWindow.items.get(0).printMapPanel.layers.each(function(l) {
                            var params = l.get("layer").params;
                            for(var p in params) {
                                if (params[p] instanceof Array) {
                                    params[p] = params[p].join(",");
                                }
                            }
                        });
                    },
                    loadcapabilities: function() {
                        printButton.initialConfig.disabled = false;
                        printButton.enable();
                    },
                    print: function() {
                        try {
                            printWindow.close();
                        } catch (err) {
                            // TODO: improve destroy
                        }
                    }
                }
            });
			
			var getNotIgnorable = function(notSupported,ignorable){
				var length = notSupported.length;
				var notIgnorable = new Array();
				for (var i = 0; i< length;i++){
					var layerName = notSupported[i];
					if (layerName && ignorable.indexOf(layerName)<0) {
						notIgnorable.push (notSupported[i]);
					}
	
				}
				return notIgnorable;
			}
            var actions = gxp.plugins.Print.superclass.addActions.call(this, [{
                menuText: this.menuText,
                tooltip: this.tooltip,
                iconCls: "gxp-icon-print",
                disabled: false,
                handler: function() {
                    var layers = getSupportedLayers();
                    var supported = layers.supported;
                    var notSupported = layers.notSupported;
                    
                    if (supported.length > 0) {

						var notIgnorable = getNotIgnorable(notSupported, this.ignoreLayers);
                        if( notIgnorable.length > 0 ){

                            Ext.Msg.alert(
                                this.notAllNotPrintableText,
                                this.notPrintableLayersText + '<br />' + notIgnorable.join(',') +
                                ( notIgnorable.indexOf('Marker') != -1 ? '<br />'+ this.notPrintableMarkersText : '')
                            );
                            
                        } else {              
							createPrintWindow.call(this);
							showPrintWindow.call(this);
						}

                    } else {
                        // no layers supported
                        Ext.Msg.alert(
                            this.notAllNotPrintableText,
                            this.nonePrintableText
                        );
                    }
                },
                scope: this,
                listeners: {
                    render: function() {
                        // wait to load until render so we can enable on success
                        printProvider.loadCapabilities();
                    }
                }
            }]);

            var printButton = this.actions[0].items[0];

            var printWindow;

            function destroyPrintComponents() {
                if (printWindow) {
                    // TODO: fix this in GeoExt
                    try {
                        var panel = printWindow.items.first();
                        panel.printMapPanel.printPage.destroy();
                        //panel.printMapPanel.destroy();
                    } catch (err) {
                        // TODO: improve destroy
                    }
                    printWindow = null;
                }
            }

            var mapPanel = this.target.mapPanel;
            function getSupportedLayers() {
                var supported = [], notSupported = [];
                mapPanel.layers.each(function(record) {
                    var layer = record.getLayer();
                    if (isSupported(layer)) {
                    	if (!(layer.name === "Graticule"))
                        	supported.push(layer);
                    } else {
                        if(layer.getVisibility()) {
                        	if (layer.name === "AOI") {
                        		layer.setVisibility(true);
                        		supported.push(layer);
                        	} else {
                        		notSupported.push(layer.name);
                        	}
                        } else if(layer.name === "spm_source" /*|| layer.name === "AOI"*/) {
                            notSupported.push(layer.name);
                        }
                    }
                });
                return  { 'supported' : supported, 'notSupported' : notSupported };
            }

            function isSupported(layer) {
				/*var map = mapPanel.map;
				
				var drawcontrols = map.getControlsByClass("OpenLayers.Control.DrawFeature");
				var size = drawcontrols.length;
				for (var i=0; i<size; i++){
					drawcontrols[i].deactivate();
				}*/
                
				return (
                    layer instanceof OpenLayers.Layer.WMS ||
                    layer instanceof OpenLayers.Layer.OSM ||
                    layer instanceof OpenLayers.Layer.Vector
                    //|| layer instanceof OpenLayers.Layer.Google
                );
            }

            function createPrintWindow() {
                printWindow = new Ext.Window({
                    title: this.previewText,
                    modal: true,
                    border: false,
                    resizable: false,
                    items: [
                        new GeoExt.ux.PrintPreview({
                            legendOnSeparatePage:this.legendOnSeparatePage,
                            includeLegend:this.includeLegend,
                            autoHeight: true,
                            mapTitle: this.target.about && this.target.about["title"],
                            comment: this.target.about && this.target.about["abstract"],
                            listeners: {
                            	scope: this,
                            	"afterrender": function() {
                            		/**
                            		 * Add a custom Grid Control
                            		 */
                            		var printMapPanel = printWindow.items.get(0).printMapPanel;
                
					                var ctrl = printMapPanel.map.getControlsByClass("OpenLayers.Control.Graticule");
									if(ctrl > 0) 
										printMapPanel.map.removeControl(ctrl);
										
							        var graticule = new OpenLayers.Control.Graticule({ 
										  //targetSize: 600,
										  displayInLayerSwitcher: false,
										  labelled: true, 
										  visible: true                  
									});
									 
									graticule.labelSymbolizer.fontColor =  '#45F760';   
									graticule.lineSymbolizer.strokeColor = '#45F760'; 
							
							        printMapPanel.map.addControl(graticule);
							        
							        graticule.activate();
                            	}
                            },
                            printMapPanel: {
                                map: Ext.applyIf({
                                    controls: [
										//UNCOMMENT TO ADD CONTROLS TO PRINT PREVIEW
                                        //new OpenLayers.Control.Navigation(),
                                        //new OpenLayers.Control.PanPanel(),
                                        //new OpenLayers.Control.ZoomPanel(),
                                        new OpenLayers.Control.Attribution()
                                    ],
                                    eventListeners: {
                                        preaddlayer: function(evt) {
                                            return isSupported(evt.layer);
                                        }
                                    }
                                }, mapPanel.initialConfig.map)
								//UNCOMMENT TO ADD ZOOM SLIDER TO PRINT PREVIEW
                                /*items: [{
                                    xtype: "gx_zoomslider",
                                    vertical: true,
                                    height: 100,
                                    aggressive: true
                                }]*/
                            },
                            printProvider: printProvider,
                            legend : Ext.getCmp(this.legendPanelId),
                            includeLegend: true,
                            sourceMap: mapPanel
                        })
                    ],
                    listeners: {
                        beforedestroy: destroyPrintComponents
                    }
                });
            }

            function showPrintWindow() {
                printWindow.show();
                /*
                // measure the window content width by it's toolbar
                printWindow.setWidth(0);
                var tb = printWindow.items.get(0).items.get(0);
                var w = 0;
                tb.items.each(function(item) {
                    if(item.getEl()) {
                        w += item.getWidth();
                    }
                });
                printWindow.setWidth(
                    Math.max(printWindow.items.get(0).printMapPanel.getWidth(),
                    w + 20)
                );
                */
                printWindow.setWidth(
                    printWindow.items.get(0).printMapPanel.getWidth()+30
                );                
                
                printWindow.center();
            }

            return actions;
        }
    }

});

Ext.preg(gxp.plugins.Print.prototype.ptype, gxp.plugins.Print);
