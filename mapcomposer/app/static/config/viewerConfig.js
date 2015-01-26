{
    "portalConfig":{
		"header":false
	},
    "gsSources": {
		"google": {
			"ptype": "gxp_googlesource" 
		}
    },
    "map":{
        "projection": "EPSG:900913",
        "units": "m",
        "maxExtent": [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        "layers": [{
            "source": "google",
            "title": "Google Hybrid",
            "name": "HYBRID",
            "group": "background"
        }],
        "center": [1250000.000000, 5370000.000000],
        "zoom": 5
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
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
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
        }, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}
	]
}
