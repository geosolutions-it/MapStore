/**
 *  Copyright (C) Consorzio LaMMA.
 *  http://www.lamma.rete.toscana.it
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
 * @author Riccardo Mari
 */
Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: AreeAllertaAverageRainfallButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.AreeAllertaAverageRainfallButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_areeallertaAverageRainfallButton */
    xtype: 'gxp_areeallertaAverageRainfallButton',

    form: null,

    url: null,

    filter: null,

    layer: "lamma_stazioni:prec360_web",

    addedLayer: null,

    chartID: null,

    pagePosition: null,

    mainLoadingMask: "Attendere prego, creazione grafico in corso...",

    markerTemplateDefault: {
        label: "${pioggiaCum}",
        fontWeight: "bold",
        fontSize: "10px",
        labelAlign: "middle",
        fontColor: "#000000",
        labelSelect: true,
        //fillColor: "#00AAFF",
        fillOpacity: 0.8,
        // Set the z-indexes of both graphics to make sure the background
        // graphics stay in the background
        graphicZIndex: 11,
        backgroundGraphicZIndex: 10
    },

    markerTemplateSelected: {
        label: "${label}",
        fontWeight: "bold",
        fontSize: "10px",
        labelAlign: "middle",
        fontColor: "#FFFFFF",
        fillColor: "#00AAFF",
        fillOpacity: 0.8,
        // Set the z-indexes of both graphics to make sure the background
        // graphics stay in the background
        graphicZIndex: 11,
        backgroundGraphicZIndex: 10
    },

    highlightsClusterMarker: {
        label: "${label}",
        fontWeight: "bold",
        fontSize: "10px",
        labelAlign: "middle",
        fontColor: "#FFFFFF",
        fillColor: "#FF0000",
        fillOpacity: 0.8,
        // Set the z-indexes of both graphics to make sure the background
        // graphics stay in the background
        graphicZIndex: 11,
        backgroundGraphicZIndex: 10
    },

    handler: function() {

        var me = this;
        var data = this.form.output.items.items[0].getForm().getValues();
        var data2 = this.form.output.items.items[0].getForm().getFieldValues();

        this.appMask = new Ext.LoadMask(Ext.getBody(), {
            msg: this.mainLoadingMask
        });

        this.appMask.show();

        this.buildFilter(true, function(dateFilter) {
            me.makeChart(dateFilter, data, data2);
        });

    },

    addMinutes: function(data, minutes) {
        return new Date(data.getTime() - minutes * 60000)
    },

    pad: function(n) {
        return n < 10 ? '0' + n : n
    },

    /**
     * api: method[makeChart]
     */
    makeChart: function(dateFilter, data, data2, viewparams2) {
    
        var timeManagers = this.target.target.mapPanel.map.getControlsByClass('OpenLayers.Control.TimeManager');
        
        this.animationStep = Ext.getCmp("animationStepID").getValue();
        

        var endDateISO = new Date(timeManagers[0].currentTime);   
        
        var endDateUTC = endDateISO.getUTCFullYear() + '-'
                    + this.pad(endDateISO.getUTCMonth() + 1) + '-'
                    + this.pad(endDateISO.getUTCDate()) + ' '
                    + this.pad(endDateISO.getUTCHours()) + ':'
                    + this.pad(endDateISO.getUTCMinutes()) + ':'
                    + this.pad(endDateISO.getUTCSeconds());        
                    
        var startDateISO = this.addMinutes(endDateISO, this.animationStep);
        
        var startDateUTC = startDateISO.getUTCFullYear() + '-'
                    + this.pad(startDateISO.getUTCMonth() + 1) + '-'
                    + this.pad(startDateISO.getUTCDate()) + ' '
                    + this.pad(startDateISO.getUTCHours()) + ':'
                    + this.pad(startDateISO.getUTCMinutes()) + ':'
                    + this.pad(startDateISO.getUTCSeconds());         
        
        this.startDate = startDateUTC;
        this.endDate = endDateUTC;
        
        Ext.Ajax.request({
            scope: this,
            url: "http://159.213.57.108/geoserver/ows",
            method: 'POST',
            params: {
                service: "WFS",
                version: "1.1.0",
                geometryName: "geom",
                request: "GetFeature",
                typeName: 'pioggia_pg_buona',
                outputFormat: "json",
                propertyName: "prec_mm,data_ora,areaallerta,geom",
                srsName: "EPSG:4326",
                sortBy: "areaallerta",
                viewparams: 'startDate:' + this.startDate + ';endDate:' + this.endDate + ';cumulativeStep:' + this.animationStep
            },
            success: function(result, request) {
                try {
                    var jsonData2 = Ext.util.JSON.decode(result.responseText);
                } catch (e) {
                    this.appMask.hide();
                    Ext.Msg.alert("Error", "Error parsing data from the server");
                    return;
                }
                if (jsonData2.features.length <= 0) {
                    this.appMask.hide();
                    Ext.Msg.alert("Nessun dato", "Dati non disponibili per questo criterio di ricerca");
                    return;
                }

                var areeGeometry = dateFilter;
                var resultsLog = [];
                var pioggiaSum = 0;

                for (var i = 0, j = areeGeometry.features.length; i < j; i++) {
                    var pioggiaSum = 0;
                    var count = 0;
                    for (var m = 0, p = jsonData2.features.length; m < p; m++) {
                        if (areeGeometry.features[i].attributes.SSIGLA === jsonData2.features[m].properties.areaallerta) {
                            pioggiaSum = pioggiaSum + parseFloat(jsonData2.features[m].properties.prec_mm);
                            count = count + 1;
                        }
                    }

                    areeGeometry.features[i].attributes.pioggiaCum = Math.round10(pioggiaSum / count, -2);
                    areeGeometry.features[i].data.pioggiaCum = Math.round10(pioggiaSum / count, -2);

                }

                var app = window.app;
                var map = app.mapPanel.map;

                var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
                renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

                var highlightsClusterMarker = this.highlightsClusterMarker;
                var markerTemplateDefault = this.markerTemplateDefault;

                var context = {

                    getFillColor: function(ft) {
                        if (ft.attributes.hasOwnProperty("pioggiaCum")) {
                            if (ft.attributes.pioggiaCum <= 0) {

                                return "#FFFFFF";

                            } else if (ft.attributes.pioggiaCum > 0.0 && ft.attributes.pioggiaCum <= 0.2) {

                                return "#FFFFFF";

                            } else if (ft.attributes.pioggiaCum > 0.2 && ft.attributes.pioggiaCum <= 0.6) {

                                return "#A0FFFF";

                            } else if (ft.attributes.pioggiaCum > 0.6 && ft.attributes.pioggiaCum <= 1.0) {

                                return "#64FFFF";

                            } else if (ft.attributes.pioggiaCum > 1.0 && ft.attributes.pioggiaCum <= 3.0) {

                                return "#43C3FF";

                            } else if (ft.attributes.pioggiaCum > 3.0 && ft.attributes.pioggiaCum <= 5.0) {

                                return "#419BFF";

                            } else if (ft.attributes.pioggiaCum > 5.0 && ft.attributes.pioggiaCum <= 7.0) {

                                return "#5A64FF";

                            } else if (ft.attributes.pioggiaCum > 7.0 && ft.attributes.pioggiaCum <= 10.0) {

                                return "#414BFF";

                            } else if (ft.attributes.pioggiaCum > 10.0 && ft.attributes.pioggiaCum <= 15.0) {

                                return "#3CBC3D";

                            } else if (ft.attributes.pioggiaCum > 15.0 && ft.attributes.pioggiaCum <= 20.0) {

                                return "#A5D71F";

                            } else if (ft.attributes.pioggiaCum > 20.0 && ft.attributes.pioggiaCum <= 25.0) {

                                return "#FFE600";

                            } else if (ft.attributes.pioggiaCum > 25.0 && ft.attributes.pioggiaCum <= 30.0) {

                                return "#FFC300";

                            } else if (ft.attributes.pioggiaCum > 30.0 && ft.attributes.pioggiaCum <= 40.0) {

                                return "#FF7D00";

                            } else if (ft.attributes.pioggiaCum > 40.0 && ft.attributes.pioggiaCum <= 50.0) {

                                return "#FF0000";

                            } else if (ft.attributes.pioggiaCum > 50.0 && ft.attributes.pioggiaCum <= 60.0) {

                                return "#C80000";

                            } else if (ft.attributes.pioggiaCum > 60.0 && ft.attributes.pioggiaCum <= 70.0) {

                                return "#D464C3";

                            } else if (ft.attributes.pioggiaCum > 70.0 && ft.attributes.pioggiaCum <= 80.0) {

                                return "#B5199D";

                            } else if (ft.attributes.pioggiaCum > 80.0 && ft.attributes.pioggiaCum <= 100.0) {

                                return "#840094";

                            } else if (ft.attributes.pioggiaCum > 100.0 && ft.attributes.pioggiaCum <= 125.0) {

                                return "#B4B4B4";

                            } else if (ft.attributes.pioggiaCum > 125.0 && ft.attributes.pioggiaCum <= 150.0) {

                                return "#8C8C8C";

                            } else if (ft.attributes.pioggiaCum > 150.0 && ft.attributes.pioggiaCum <= 175.0) {

                                return "#5A5A5A";

                            } else if (ft.attributes.pioggiaCum > 175.0 && ft.attributes.pioggiaCum <= 200.0) {

                                return "#323232";

                            } else if (ft.attributes.pioggiaCum > 200.0 && ft.attributes.pioggiaCum <= 250.0) {

                                return "#A57823";

                            } else if (ft.attributes.pioggiaCum > 250.0 && ft.attributes.pioggiaCum <= 300.0) {

                                return "#805200";

                            } else if (ft.attributes.pioggiaCum > 300.0 && ft.attributes.pioggiaCum <= 350.0) {

                                return "#643200";

                            } else if (ft.attributes.pioggiaCum > 350) {

                                return "#502300";

                            } else {
                                return markerTemplateDefault;
                            }
                        }
                    }
                };

                this.markerTemplateDefault.fillColor = "${getFillColor}";

                var styleMap = new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style(markerTemplateDefault, {
                        context: context
                    })
                });

                var rules = [
                    new OpenLayers.Rule({
                        symbolizer: {
                            graphicWidth: "${getMarkerWidth}",
                            graphicHeight: "${getMarkerHeight}",
                            backgroundWidth: "${getBackgroundMarkerWidth}",
                            backgroundHeight: "${getBackgroundMarkerHeight}"
                        }
                    }),
                    new OpenLayers.Rule({
                        elseFilter: true
                    })
                ];

                styleMap.styles['default'].addRules(rules);
                styleMap.styles['select'].addRules(rules);
                
                var rawAnimationStep = Ext.getCmp("animationStepID").getRawValue();

                var miolayer = new OpenLayers.Layer.Vector("Avg - " + rawAnimationStep + ", Start: " + this.startDate + ", End: " + this.endDate, {
                    styleMap: styleMap,
                    renderers: renderer,
                    displayInLayerSwitcher: true
                });
                
                /*var wms = new OpenLayers.Layer.WMS("WMS",
                   "http://159.213.57.108/geoserver/wms",
                   {
                    layers: "ALLERTA:AREE_ALLERTA",
                    styles: "aree_allerta",
                    transparent: "true"//,
                    //viewParams:viewParams,
                    //transparent: "true",
                    //cql_filter:cql_filter
                });*/

                for (var i = 0, v = areeGeometry.features.length; i < v; i++) {
                    areeGeometry.features[i].geometry.transform(
                        "EPSG:4326",
                        map.getProjectionObject())
                    miolayer.addFeatures([areeGeometry.features[i]]);
                }

                //map.addLayers([wms]);
                map.addLayers([miolayer]);

                this.appMask.hide();

            },
            failure: function(result, request) {
                this.appMask.hide();
                Ext.Msg.alert("Error", "Server response error");
            }
        });

    },

    /**
     * api: method[buildFilter]
     */
    buildFilter: function(baciniFilter, callback) {

        if (baciniFilter) {

            var layerBacini = new OpenLayers.Layer.Vector("WFS");

            var getFeatureFromWFS = function(response) {
                if (response.features.length > 0) {
                    for (var i = 0; i < response.features.length; i++) {
                        layerBacini.addFeatures([response.features[i]]);
                    }
                }
                callback(response);
            }

            var protocol = new OpenLayers.Protocol.WFS({
                url: "http://159.213.57.108/geoserver/wfs",
                version: "1.1.0",
                featureType: "aree_allerta_gen",
                featureNS: "http://ALLERTA",
                geometryName: "the_geom",
                srsName: "EPSG:4326"
            });

            var protRead = protocol.read({
                callback: getFeatureFromWFS
            });

        }
    }
});

// Closure
(function() {

    /**
     * Decimal adjustment of a number.
     *
     * @param	{String}	type	The type of adjustment.
     * @param	{Number}	value	The number.
     * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
     * @returns	{Number}			The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();

Ext.reg(gxp.widgets.button.AreeAllertaAverageRainfallButton.prototype.xtype, gxp.widgets.button.AreeAllertaAverageRainfallButton);