{
    "geoStoreBase":"",
    "proxy":"/http_proxy/proxy/?url=",
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
		"center": [1251650, 5430300],
		"zoom": 12,
		"maxExtent": [
				1233700, 5418400,
				1269600, 5442200
		],
        "layers": [{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background"
		}]
    },
	
	"customTools":[
	    {
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"index": 23
		}, {
			"ptype": "gxp_addlayer",
			"id": "addlayer"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo", 
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 20}
		}
	]
}
