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
            "id":"additionalTab", 
			"target": "west",
			"title": "my New Tab",
            "layout":"accordion"
        }, {
			"target":"additionalTab",
			"html":"This is a custom panel. Both this and 'my New Tab' are custom panels.",
			"title": "Panel 1"
		}, {
			"target":"additionalTab",
			"html":"insert your plugin here",
			"title": "Panel 2"
		}, {
            "xtype":"tabpanel",
            "id":"east", 
            "region": "east",
            "width": 570,
            "minWidth":550,
			"activeTab": 0,
			"border":false,
            "collapseMode": "mini" ,
			"items":{
				"xtype":"panel",
				"id":"editor",
				"title":"editor",
				"layout":"fit",
				"target":"east"
			
			}
        }, {
			"xtype":"panel",
            "id":"south", 
			"region":"south",
			"html":"another custom panel....",
			"height":100
		}, {
			"target":"east",
			"html":"<iframe style='width:100%;height:100%' src='http://mapstore.geo-solutions.it' ><iframe/>",
			"layout":"fit",
			"itemId":"startTab",
			"title": "MapStore WebSite"
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
			"description": "<a href='http://www.geo-solutions.it/' target='_blank'><div class='geosolutions_logo'></div></a>This sample contains many panels added in configuration. You can add custom panels wherever you want (also nesting) cointaining:<ul style='list-style:disc;margin-left:10px;'><li>put plugins</li><li> custom html</li><li>iframes for documentation</li><li>and many other things</li></ul>",
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
			"outputTarget":"editor",
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
