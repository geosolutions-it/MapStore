{
	"portalConfig":{
		"header":false
	},
	
    "gsSources": {
        "google": {
            "ptype": "gxp_googlesource"
        }
    },
    
    "customPanels":[
        {
            "xtype":"panel",
            "id":"east", 
            "region": "east",
            "width": 570,
            "minWidth":550,
            "header":false,
            "split": true,
			"border":false,
            "collapseMode": "mini",
            "layout":"fit"
        }
    ],
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
	
	"customTools":[
        {
			"ptype":"gxp_help",
			"actionTarget": "paneltbar",
			"text":"Help",
			"tooltip":"About This Exemple",
			"title":"Marker Editor",
			"index": 26,
			"showOnStartup":true,
			"description": "<a href='http://www.geo-solutions.it/' target='_blank'><div class='geosolutions_logo'></div></a><ul style='list-style:disc;margin-left:10px;'><li>You can add and remove marker from it using the controls on the right.<li>Click on the marker to see the popup preview.<li>Export and import all the makers using the button \"Export Markers\" or \"Import Marker(Simply copy and paste code)</li></ul>",
			"windowOptions":{
				"constrain":true
			}	
        }, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_reversegeocoder",
			"outputTarget":"paneltbar",
			"outputConfig": {
				"width": "200"
			},
			"index": 27
		}, {
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget":"paneltbar",
			"index": 28
		}, {
			"ptype": "gxp_marker_editor",
			"outputTarget":"east",
            "toggleGroup":"toolGroup"
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
