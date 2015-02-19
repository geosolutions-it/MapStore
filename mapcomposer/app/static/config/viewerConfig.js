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
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo", 
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 24}
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
