{
   "geoStoreBase": "",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ 
   		"geosolutions": {
			"ptype": "gxp_wmssource",
			"url": "http://localhost:8080/geoserver/wms",
			"title": "GeoSolutions GeoServer",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
		    "layersCachedExtent": [
				-20037508.34,-20037508.34,
				20037508.34,20037508.34
			],
			"layerBaseParams":{
				"FORMAT":"image/png8",
				"TILED":true
			}
		},
		"osm": { 
			"ptype": "gxp_osmsource"
		},
		"ol": { 
			"ptype": "gxp_olsource" 
		}
	},
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [1250000.000000, 5370000.000000],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			}
		]
	},
    "customPanels":[
        
    ],	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[

	]
}
