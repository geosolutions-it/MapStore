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
	
	"customTools":[
		{
			"ptype": "gxp_mouseposition"
		},{
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
			"index": 23
		}
	]
}
