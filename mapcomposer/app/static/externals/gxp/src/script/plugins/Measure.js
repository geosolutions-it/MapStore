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
 *  class = Measure
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Measure(config)
 *
 *    Provides two actions for measuring length and area.
 */
gxp.plugins.Measure = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_measure */
    ptype: "gxp_measure",

    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** api: config[lengthMenuText]
     *  ``String``
     *  Text for measure length menu item (i18n).
     */
    lengthMenuText: "Length",

    /** api: config[areaMenuText]
     *  ``String``
     *  Text for measure area menu item (i18n).
     */
    areaMenuText: "Area",
	
	/** api: config[bearingMenuText]
     *  ``String``
     *  Text for measure bearing menu item (i18n).
     */
	bearingMenuText: "Bearing",
	
    /** api: config[lengthTooltip]
     *  ``String``
     *  Text for measure length action tooltip (i18n).
     */
    lengthTooltip: "Measure length",

    /** api: config[areaTooltip]
     *  ``String``
     *  Text for measure area action tooltip (i18n).
     */
    areaTooltip: "Measure area",
	/** api: config[bearingTooltip]
     *  ``String``
     *  Text for measure bearing action tooltip (i18n).
     */
    bearingTooltip: "Measure bearing",

    /** api: config[measureTooltip]
     *  ``String``
     *  Text for measure action tooltip (i18n).
     */
    measureTooltip: "Measure",
    
    /**
     * api: config[enableBearingTool]
     * set true to add the bearing tool
     */
    enableBearingTool:false,
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Measure.superclass.constructor.apply(this, arguments);
    },

    /** private: method[destroy]
     */
    destroy: function() {
        this.button = null;
        gxp.plugins.Measure.superclass.destroy.apply(this, arguments);
    },

    /** private: method[createMeasureControl]
     * :param: handlerType: the :class:`OpenLayers.Handler` for the measurement
     *     operation
     * :param: title: the string label to display alongside results
     *
     * Convenience method for creating a :class:`OpenLayers.Control.Measure`
     * control
     */
    createMeasureControl: function(handlerType, title) {

        var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        "Point": {
                            pointRadius: 4,
                            graphicName: "square",
                            fillColor: "white",
                            fillOpacity: 1,
                            strokeWidth: 1,
                            strokeOpacity: 1,
                            strokeColor: "#333333"
                        },
                        "Line": {
                            strokeWidth: 3,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            strokeDashstyle: "dash"
                        },
                        "Polygon": {
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            fillColor: "white",
                            fillOpacity: 0.3
                        }
                    }
                })]
            })
        });
        var cleanup = function() {
            if (measureToolTip) {
                measureToolTip.destroy();
            }  
        };

        var makeString = function(metricData) {
            var metric = metricData.measure;
            var metricUnit = metricData.units;

            measureControl.displaySystem = "english";

            var englishData = metricData.geometry.CLASS_NAME.indexOf("LineString") > -1 ?
            measureControl.getBestLength(metricData.geometry) :
            measureControl.getBestArea(metricData.geometry);

            var english = englishData[0];
            var englishUnit = englishData[1];

            measureControl.displaySystem = "metric";
            var dim = metricData.order == 2 ?
            '<sup>2</sup>' :
            '';
			switch(metricUnit){
				case "m"  : 
					nmi = metric.toFixed(2) * 0.000539956803;
					break;
				case "km"  :
					nmi = metric.toFixed(2) * 1000 * 0.000539956803;	
					break;
				default :
					nmi = "unknown";
			}
			if(nmi){
			
				nmi = Math.round(nmi*100)/100;
			}
			var lenghtmeasure = metricData.geometry.CLASS_NAME.indexOf("LineString") > -1;
            return metric.toFixed(2) + " " + metricUnit + dim + "<br>" +
                english.toFixed(2) + " " + englishUnit + dim + "<br>" +
				(lenghtmeasure?nmi + " " + "nmi":"") ;
        };

        var measureToolTip;
        var measureControl = new OpenLayers.Control.Measure(handlerType, {
            geodesic: true,
            persist: true,
            handlerOptions: {layerOptions: {styleMap: styleMap} },
            eventListeners: {
                measurepartial: function(event) {
                    cleanup();
                    measureToolTip = this.addOutput({
                        xtype: 'tooltip',
                        html: makeString(event),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {hide: cleanup}
                    });
                    if(event.measure > 0) {
                        var px = measureControl.handler.lastUp;
                        var p0 = this.target.mapPanel.getPosition();
                        measureToolTip.targetXY = [p0[0] + px.x, p0[1] + px.y];
                        measureToolTip.show();
                    }
                },
                measure: function(event) {
                    cleanup();
                    measureToolTip = this.addOutput({
                        xtype: 'tooltip',
                        target: Ext.getBody(),
                        html: makeString(event),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {
                            hide: function() {
                                measureControl.cancel();
                                cleanup();
                            }
                        }
                    });
                },
                deactivate: cleanup,
                scope: this
            }
        });

        return measureControl;
    },
	
	/** private: method[createBearingControl]
     * :param: handlerType: the :class:`OpenLayers.Handler` for the active measurement of bearing
     *     operation
     * :param: title: the string label to display alongside results
     *
     * Convenience method for creating a :class:`OpenLayers.Control.Measure`
     * control
     */
    createBearingControl: function(handlerType, title) {
		var map =this.target.mapPanel.map;
		
        var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        "Point": {
                            pointRadius: 4,
                            //graphicName: "triangle",
							graphicName: "square",
							//rotation: 45, //todo
                            fillColor: "white",
                            fillOpacity: 1,
                            strokeWidth: 1,
                            strokeOpacity: 1,
                            strokeColor: "#333333"
                        },
                        "Line": {
                            strokeWidth: 3,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            strokeDashstyle: "dash"
                        },
                        "Polygon": {
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            fillColor: "white",
                            fillOpacity: 0.3
                        }
                    }
                })]
            })
        });
        var cleanup = function() {
            if (measureToolTip) {
                measureToolTip.destroy();
            }  
        };
		
		//convert decimal deg to minutes and seconds
		var deg_to_dms =function (deg) {
		   var d = Math.floor (deg);
		   var minfloat = (deg-d)*60;
		   var m = Math.floor(minfloat);
		   var secfloat = (minfloat-m)*60;
		   var s = Math.round(secfloat);
		   // After rounding, the seconds might become 60. These two
		   // if-tests are not necessary if no rounding is done.
		   if (s==60) {
			 m++;
			 s=0;
		   }
		   if (m==60) {
			 d++;
			 m=0;
		   }
		   return ("" + d + "&deg; " + m + "&#39; " + s + "&quot; ");
		}
		
		
		calculateAzimuth = function(p1,p2,pj) {

				var epsg4326 = new OpenLayers.Projection("EPSG:4326");
				
				var pp1 = p1.clone().transform(pj,epsg4326);
				var pp2 = p2.clone().transform(pj,epsg4326);
				var lon1 = pp1.x * Math.PI /180.0; 
				var lat1 = pp1.y * Math.PI /180.0; 
				var lon2 = pp2.x * Math.PI /180.0; 
				var lat2 = pp2.y * Math.PI /180.0; 
				var dLon = lon2 - lon1;
				
				var y = Math.sin(dLon) * Math.cos(lat2);
				var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
				
				var azimuth = (((Math.atan2(y, x)*180.0/Math.PI) +360 )% 360 )

				
				return azimuth;
		};
		
		var bearing = function (azimuth){
			
			var bearing ="";
			if (0<=azimuth && azimuth<90){
				bearing = "N "+deg_to_dms( azimuth ) +" E";
			
			}else if(90<azimuth && azimuth<=180){
				bearing = "S "+ deg_to_dms(180.0 -azimuth) +" E";
			}else if(180<azimuth && azimuth<270){
				bearing = "S "+ deg_to_dms(azimuth - 180.0 ) +" W";
			}else if(270<=azimuth && azimuth<=360){
				bearing = "N "+ deg_to_dms(360 - azimuth ) +" W";
			}
			return bearing;
		
		}
        var makeString = function(metricData,map) {
            var metric = metricData.measure;
            var metricUnit = metricData.units;
			var points = metricData.geometry.components;
            measureControl.displaySystem = "english";
			var p0= points[points.length -2];
			var p1 = points[points.length -1];
            var englishData = metricData.geometry.CLASS_NAME.indexOf("LineString") > -1 ?
            measureControl.getBestLength(metricData.geometry) :
            measureControl.getBestArea(metricData.geometry);
			
            var english = englishData[0];
            var englishUnit = englishData[1];
			
            measureControl.displaySystem = "metric";
            var dim = metricData.order == 2 ?
            '<sup>2</sup>' :
            '';
			var px = measureControl.handler.lastUp;
			var pj =map.getProjectionObject();
			
			var azimuth =calculateAzimuth(p0,p1,pj);
			var nmi;

			switch(metricUnit){
				case "m"  : 
					nmi = metric.toFixed(2) * 0.000539956803;
					break;
				case "km"  :
					nmi = metric.toFixed(2) * 1000 * 0.000539956803;	
					break;
				default :
					nmi = "unknown";
			}
			if(nmi){
			
				nmi = Math.round(nmi*100)/100;
			}
            return "<table> <tr>"+
				"<th rowspan='3'>Distance:</td><td> " + metric.toFixed(2) + " " + metricUnit + dim + "</td></tr>" +
                "<tr><td>" +english.toFixed(2) + " " + englishUnit + dim  + "</td></tr>" +
				"<tr><td>" + nmi + " " + "nmi"  + "</td></tr>" +
				"<tr><td>Azimuth:</td><td> " + deg_to_dms(azimuth) + "</td></tr>" +
				"<tr><td>Bearing:</td><td> " + bearing(azimuth) + "</td></tr></table>";
        };
		
		
        var measureToolTip;
        var measureControl = new OpenLayers.Control.Measure(handlerType, {
            geodesic: true,
            persist: true,
			immediate:true,
            handlerOptions: {layerOptions: {styleMap: styleMap}, maxVertices:2},
            eventListeners: {
                measurepartial: function(event) {
                    cleanup();
					var px = measureControl.handler.lastUp;
					var p0 = this.target.mapPanel.getPosition();
					
					
                    measureToolTip = this.addOutput({
                        xtype: 'tooltip',
						width: 200,
                        html: makeString(event,map),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {
                            hide: function() {
                                measureControl.cancel();
                                cleanup();
                            }
                        }
                    });
					if (event.measure > 0){
						var mouseEvt = measureControl.handler.evt;
						if(mouseEvt.clientY > p0[1] + px.y && mouseEvt.clientX >p0[0] + px.x ){
							measureToolTip.targetXY = [p0[0] + px.x, p0[1] + px.y-120];
						}else{
							measureToolTip.targetXY = [p0[0] + px.x, p0[1] + px.y];
						}
						measureToolTip.show();
						
					}
                    
                },
                measure: function(event) {
                    cleanup();
                    measureToolTip = this.addOutput({
                        xtype: 'tooltip',
                        target: Ext.getBody(),
                        html: makeString(event,map),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {
                            hide: function() {
                                measureControl.cancel();
                                cleanup();
                            }
                        }
                    });
	
                },
                deactivate: cleanup,
                scope: this
            }
        });

        return measureControl;
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.activeIndex = 0;
        var items = [
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.lengthMenuText,
                            iconCls: "gxp-icon-measure-length",
                            toggleGroup: this.toggleGroup,
                            group: this.toggleGroup,
                            listeners: {
                                checkchange: function(item, checked) {
                                    this.activeIndex = 0;
                                    this.button.toggle(checked);
                                    if (checked) {
                                        this.button.setIconClass(item.iconCls);
                                    }
                                },
                                scope: this
                            },
                            map: this.target.mapPanel.map,
                            control: this.createMeasureControl(
                                OpenLayers.Handler.Path, this.lengthTooltip
                            )
                        })
                    ),
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.areaMenuText,
                            iconCls: "gxp-icon-measure-area",
                            toggleGroup: this.toggleGroup,
                            group: this.toggleGroup,
                            allowDepress: false,
                            listeners: {
                                checkchange: function(item, checked) {
                                    this.activeIndex = 1;
                                    this.button.toggle(checked);
                                    if (checked) {
                                        this.button.setIconClass(item.iconCls);
                                    }
                                },
                                scope: this
                            },
                            map: this.target.mapPanel.map,
                            control: this.createMeasureControl(
                                OpenLayers.Handler.Polygon, this.areaTooltip
                            )
                        })
                    )
                ];
        if(this.enableBearingTool){
            items.push(
					new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.bearingMenuText,
                            iconCls: "gxp-icon-measure-bearing",
                            toggleGroup: this.toggleGroup,
                            group: this.toggleGroup,
                            allowDepress: false,
                            listeners: {
                                checkchange: function(item, checked) {
                                    this.activeIndex = 2;
                                    this.button.toggle(checked);
                                    if (checked) {
                                        this.button.setIconClass(item.iconCls);
                                    }
                                },
                                scope: this
                            },
                            map: this.target.mapPanel.map,
                            control: this.createBearingControl(
                                OpenLayers.Handler.Path, this.bearingTooltip
                            )
                        })
                    ));
        }
        this.button = new Ext.SplitButton({
            iconCls: "gxp-icon-measure-length",
            tooltip: this.measureTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            allowDepress: true,
            handler: function(button, event) {
                if(button.pressed) {
                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
                }
            },
            scope: this,
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    if(!pressed) {
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: items
            })
        });

        return gxp.plugins.Measure.superclass.addActions.apply(this, [this.button]);
    }
        
});

Ext.preg(gxp.plugins.Measure.prototype.ptype, gxp.plugins.Measure);
