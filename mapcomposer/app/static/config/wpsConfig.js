{
    "geoStoreBase":"",
    "proxy":"/http_proxy/proxy/?url=",
    "portalConfig":{
		"header":false
	},
    "xmlJsonTranslate": "",
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
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_reversegeocoder",
			"outputTarget":"paneltbar",
			"outputConfig": {
				"width": "200"
			},
			"index": 26
		}, {
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget":"paneltbar",
			"index": 27
		}, {
                    "ptype": "gxp_wpsmanager",
                    "id": "wpsTEST",
                    "url": "http://hrt-11.pisa.intecs.it/geoserver/wps",
                    "geostoreUser": "admin",
                    "geostorePassword": "admin"
                }
	]
}
