{
    "geoStoreBase":"",
    "proxy":"/http_proxy/proxy/?url=",
    "portalConfig":{
		"header":false
	},
	"defaultLanguage":"it",
    "gsSources": {
        "gsacque": {
			"ptype": "gxp_wmssource",
			"title": "Acque GeoServer",
			"url": "http://10.80.4.45/geoserver/ows",
			"layerBaseParams": {
					"TILED": true,
					"TILESORIGIN": "-20037508.34, -20037508.34",
					"buffer":10
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
		"numZoomLevels":25,
		"extent": [
			 1046403.2 , 5200006.1,
		     1413757.5 ,   5544708.1
		   
		],
	    "restrictedExtent":[
			 1046403.2 , 5200006.1,
		     1413757.5 ,   5544708.1
		   
		],
        "layers": [
			{
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
				"title": "Google Hybrid",
				"name": "HYBRID",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background"
			},{
					"source": "gsacque",
					"title": "Rete Acq",
					"name": "SW:acq_con",
					"group": "Acquedotto",
					"visibility": true
			},{
					"source": "gsacque",
					"title": "Rete Acq",
					"name": "SW:AC",
					"styles":"segnalazione",
					"group": "Segnalazioni",
					"visibility": true
			}
		]
        
    },
	
	"customTools":[
		{
			"ptype": "gxp_mouseposition"
		},{
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
			"index": 23
		},{
            "ptype": "gxp_wmsgetfeatureinfo", 
            "toggleGroup": "toolGroup",
            "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
            "useTabPanel": true,
            "actionTarget": {"target": "paneltbar", "index": 15}
        }
	]
}
