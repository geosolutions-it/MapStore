{
    "geoStoreBase":"",
	"xmlJsonTranslateService": "http://localhost:8080/servicebox/",
    "proxy":"/http_proxy/proxy/?url=",
    "portalConfig":{
		"header":false
	},
    "gsSources": {
		"geosolutions": {
			"ptype": "gxp_wmssource",
			"url": "http://localhost:8080/geoserver/ows",
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
        "maxExtent": [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        "layers": [
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "ol",
				"title": "Vuoto",
				"group": "background",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"None", {"visibility": false}
				]
		    },{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Terrain",
				"name": "TERRAIN",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Hybrid",
				"name": "HYBRID",
				"group": "background"
			},{
				"source": "geosolutions",
				"title": "World Countries",
				"name": "geosolutions:WorldCountries"
			}
		],
        "center": [1250000.000000, 5370000.000000],
        "zoom": 5
    },	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	
	"customTools":[
		{
			"ptype": "gxp_mouseposition"
		},{
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
			"index": 23
		}, {
			"ptype": "gxp_print",
			"customParams":{
				"outputFilename":"mapstore-print"
			},
			"printService": "http://localhost:8080/geoserver/pdf/",
			"legendPanelId": "legendPanel",
			"actionTarget":{
			    "target": "paneltbar",
				"index":4
			}
        },{
			"ptype":"gxp_printsnapshot",
			"customParams":{
				"outputFilename":"mapstore-print"
			},
			"actionTarget":{
				"target":"paneltbar",
				"index":5
			}
	    },{
			"ptype": "gxp_wpsmanager",
			"id": "wpsManager",
			"url": "http://localhost:8080/geoserver/wps",
			"geostoreUrl": "http://localhost:8080/geostore/rest",
			"geostoreUser": "admin",
			"geostorePassword": "admin",
		    "geostoreProxy": "/http_proxy/proxy?url="
		}
	]
}
