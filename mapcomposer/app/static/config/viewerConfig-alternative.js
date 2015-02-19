{
    "portalConfig":{
		"header":false
	},
    "gsSources": {
        "google": {
            "ptype": "gxp_googlesource"
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
        "layers": [{
            "source": "google",
            "title": "Google Hybrid",
            "name": "HYBRID",
            "group": "background"
        }],
        "center": [1250000.000000, 5370000.000000],
        "zoom": 5
    },
	
	"disableLayerChooser":true,
	
	"customPanels":[{
		"xtype": "panel",
		"id": "east",
		"layout": "accordion",
		"region": "east",
		"width": 350,
		"minWidth": 350,
		"activeTab": 1,
		"activeItem": 1,
		"collapsed": true,
		"collapsible": true,
		"header": true,
		"border": false,
		"items": [{
			"id":"tree",
			"iconCls":"icon-layer-switcher",
			"title":"livelli",
			"target":"east"
		}]
	}],

	"customTools":[
		{
			"ptype": "gxp_layertree",
			"outputConfig": {
				"id": "layertree"
			},
			"outputTarget": "tree"
		}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo_menu", 
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 24}
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
