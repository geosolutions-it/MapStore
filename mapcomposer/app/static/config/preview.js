{
	"disableLayerChooser": false,
	"portalConfig":{
		"header":false
	},
    "gsSources": {
		"bing": {
			"ptype": "gxp_bingsource" 
		}
    },
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
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
				"name": "AerialWithLabels",
				"group": "background"
			}
		],
        "center": [1250000.000000, 5370000.000000],
        "zoom": 5
    },
	
	"customTools":[
		{
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "always",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 18},
			"toggleGroup": "toolGroup"
		}
	],
	
	"viewerTools":[
		{
			"leaf":true,
			"text":"Add layers",
			"checked":true,
			"hideByDefault": true,
			"iconCls":"gxp-icon-addlayers",
			"ptype":"gxp_addlayers"
		}, {
			"leaf":true,
			"text":"Zoom To Max Extent",
			"checked":true,
			"iconCls":"gxp-icon-zoomtoextent",
			"ptype":"gxp_zoomtoextent"
		}, {
			"leaf":true,
			"text":"Pan Map",
			"checked":true,
			"iconCls":"gxp-icon-pan",
			"ptype":"gxp_navigation",
			"toggleGroup":"toolGroup"
		}, {
		    "actions":[
				"-"
			],
			"checked":true
		}, {
			"leaf":true,
			"text":"Zoom Box In / Zoom Box Out",
			"checked":true,
			"iconCls":"gxp-icon-zoombox-in",
			"numberOfButtons":2,
			"ptype":"gxp_zoombox",
			"toggleGroup":"toolGroup"
		}, {
			"leaf":true,
			"text":"Zoom In / Zoom Out",
			"checked":true,
			"iconCls":"gxp-icon-zoom-in",
			"numberOfButtons":2,
			"ptype":"gxp_zoom"
		}, {
			"actions":[
				"-"
			],
			"checked":true
		}, {
		    "leaf":true,
			"text":"Zoom To Previous Extent / Zoom To Next Extent",
			"checked":true,
			"iconCls":"gxp-icon-zoom-previous",
			"numberOfButtons":2,
			"ptype":"gxp_navigationhistory"
		}, {
			"actions":[
				"-"
			],
			"checked":true
		}, {
			"leaf":true,
			"text":"Get Feature Info",
			"checked":true,
			"iconCls":"gxp-icon-getfeatureinfo",
			"ptype":"gxp_wmsgetfeatureinfo",
			"toggleGroup":"toolGroup"
		}, {
			"actions":[
				"-"
			],
			"checked":true
		}, {
			"leaf":true,
			"text":"Measure",
			"checked":true,
			"iconCls":"gxp-icon-measure-length",
			"ptype":"gxp_measure",
			"controlOptions":{
				"immediate":true
		    },
			"toggleGroup":"toolGroup"
		}, {
			"actions":[
				"-"
			],
			"checked":true
		}
	]
}
