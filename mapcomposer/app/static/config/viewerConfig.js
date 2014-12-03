{
    "portalConfig":{
		"header":false
	},
    "gsSources": {
   		"comunege": {
			"ptype": "gxp_wmssource",
			"title": "Comune Genova",
			"url": "http://vm-sitgeofe1.comune.genova.it/geoserver/ows",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layerBaseParams":{
				"FORMAT": "image/png8",
				"TILED": true,
			   "TILESORIGIN": "-20037508.34, -20037508.34"
			},
            "authParam":"authkey"
		},
		"mapquest": {
			"ptype": "gxp_mapquestsource"
		}, 
		"osm": { 
			"ptype": "gxp_osmsource"
		},
		"google": {
			"ptype": "gxp_googlesource" 
		},
		"bing": {
			"ptype": "gxp_bingsource" 
		}, 
		"ol": { 
			"ptype": "gxp_olsource" 
		}
    },
    "map":{
		"projection": "EPSG:900913",
		"units": "m",
		"zoom": 5,
        "numZoomLevels": 21,
		"extent": [
			962337.0596294437, 5523110.328076044, 1014934.9764326633, 5547342.6306190565
		],
		"restrictedExtent": [
			962337.0596294437, 5523110.328076044, 1014934.9764326633, 5547342.6306190565
		],
		"layers": [
			{
				"source": "ol",
				"group": "background",
				"title": "Nessuno sfondo",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"Nessuno sfondo", {
					"visibility": false
				}
				]
			},
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background",
				"visibility": false
			}, {
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background",
				"visibility": true
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background",
				"visibility": false
			}
		]
    },
    "customPanels":[
        {
            "xtype": "panel",
            "border": false,
            "id": "east",
            "width": 250,
            "region": "east",
            "layout": "fit",
            "collapsed": true,
            "split": false,
            "hidden": true,
            "collapsible": true,
            "header": false,
            "collapseMode": "mini"
        }
    ],	
	"customTools":[
		{
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_wmsgetfeatureinfo", 
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 23}
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
            "ptype": "gxp_spatial_selector_locator",
			"actionTarget": {
                "target": "paneltbar",
                "index": 24,
                "panelTarget": "east"
            },
            "pluginsConfig":{
                "geocoder":{
                    "ptype": "gxp_spatial_selector_geocoder",
                    "layoutConfig":{
                        "xtype": "form",
                        "buttonAlign": "right",
                        "autoScroll":true,
                        "frame":true
                    },
                    "crossParameters":{
                        "name": {
                            "COD_STRADA":{
                                "number": "COD_STRADA"
                            }
                        }
                    },
                    "zoomLevel": 18,
                    "spatialSelectorsConfig":{
                        "name":{
                            "xtype": "gxp_spatial_geocoding_selector",
                            "showSelectionSummary": false,
                            "multipleSelection": false,
                            "searchComboOutputFormat": "json",
                            "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
                            "geocoderTypeName": "SITGEO:V_ASTE_STRADALI_TOPONIMO_SUB",
                            "geocoderTypeRecordModel":[
                                {
                                    "name":"id",
                                    "mapping":"ID"
                                },
                                {
                                    "name":"name",
                                    "mapping":"properties.NOMEVIA"
                                },
                                {
                                    "name":"geometry",
                                    "mapping":"geometry"
                                }
                            ],
                            "geocoderTypeSortBy":null,
                            "geocoderTypeQueriableAttributes":[
                                "NOMEVIA"
                            ],
                            "spatialOutputCRS": "EPSG:3003",
                            "geocoderTypePageSize": 10,
                            "zoomToCurrentExtent": false
                        },
                        "number":{
                            "xtype": "gxp_spatial_geocoding_selector",
                            "showSelectionSummary": false,
                            "multipleSelection": false,
                            "searchComboOutputFormat": "json",
                            "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
                            "geocoderTypeName": "SITGEO:CIVICI_COD_TOPON",
                            "geocoderTypeRecordModel":[
                                {
                                    "name":"id",
                                    "mapping":"ID"
                                },
                                {
                                    "name":"name",
                                    "mapping":"properties.TESTO"
                                },
                                {
                                    "name":"geometry",
                                    "mapping":"geometry"
                                }
                            ],
                            "geocoderTypeSortBy":null,
                            "geocoderTypeQueriableAttributes":[
                                "TESTO"
                            ],
                            "spatialOutputCRS": "EPSG:3003",
                            "geocoderTypePageSize": 10,
                            "zoomToCurrentExtent": false
                        }
                    }
                }, "reverse": {
                    "ptype": "gxp_spatial_selector_reverse_geocoder",
                    "url": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
                    "maxFeatures": 10,
                    "streetfeatureNS": "SITGEO",
                    "typeName": "CIVICI_CON_STRADE",
                    "featureNS": "SITGEO",
                    "geometryName": "GEOMETRY",
                    "streetPropertyName": "DESVIA",
                    "numberPropertyName": "TESTO",
                    "layoutConfig":{
                        "xtype": "form",
                        "buttonAlign": "right",
                        "autoScroll":true,
                        "frame":true
                    }
                }
            }
        }
	]
}
