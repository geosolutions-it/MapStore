{
   
   "scaleOverlayMode": "basic",
   "gsSources":{ 
         
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
	"loadingPanel": {
		"width": 1,
		"height": 1,
		"center": true
	},
	"customPanels":[
        {
            "xtype":"panel",
            "id":"east", 
            "layout":"fit",
            "region": "east",
            "width": 350,
            "minWidth":350,
			"activeTab": 1,
            "activeItem":1,
            "collapsed":false,
			"collapsible":true,
            "header":true,
			"border":false,
			"items":[
                {
                    "xtype":"panel",
                    "iconCls":"gx-layer-visibility",
                    "id":"optimization_tool",
                    "layout":"fit",
                    "title":"Optimization Tool",
                    "items":{
                        "xtype":"panel",
                        "id":"filter",
                        "layout":"fit",
                        "target":"optimization_tool"
                    }
                }]
            }
    ],
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [1250000.000000, 5370000.000000],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
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
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "bing",
				"title": "Bing Aerial With Labels",
				"name": "AerialWithLabels",
				"group": "background"
			},{
				"source": "ol",
				"group": "background",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"None", {"visibility": false}
				]
			}
		]
	},
    
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
            "showDirectURL":true,
            "showQRCode":false,
			"links":[{
                "base":"",
                "label":"link",
                "params":{
                    "config":"assetAllocatorResult"
                }
            }]
			
		}, {
		  "ptype": "gxp_featuremanager",
		  "id": "featuremanager"
	    }, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
        "ptype":"gxp_playback",
        "playbackMode": "range",
        "labelButtons": false,
        "timeFormat": "l, F d, Y g:i:s A",
        "outputTarget": "map",
        "outputConfig": {
            "controlConfig":{
                    "step": 4,
                    "units": "Hours",
                    "frameRate": 1
                }
            }
        },{
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
        }, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		},{
			"ptype": "gxp_cmre_optimization_tool",
			"osdi2ManagerRestURL":"http://localhost:8180/opensdi2-manager/mvc/process/wps/",
			"CWIXPortalPIMTracksManagerURL":"http://localhost:3080/oth/pim/OAAroutesEmail",
            "outputTarget": "filter",
			"updateInfoTools":true,
                "filterFieldsets":[
                  
                   {
                      "ref":"other",
                      "label":"Altri Filtri",
                      "checked":true,
                      "xtype":"container",
                      "columns":1,
                      "emptyFilter":"1=1",
                      "items":[
                         {
                            "xtype":"numberfield",
                            "fieldLabel":"Codice SAP",
                            "anchor":"100%",
                            "cql_filter":"CodiceSAP ILIKE '%${inputValue}%'"
                         },
                         {
                            "xtype":"textfield",
                            "fieldLabel":"Codice Sede Tecnica",
                            "anchor":"100%",
                            "cql_filter":"CodSedeTecnica ILIKE '%${inputValue}%'"
                         }
                      ],
                      "customConfig":{
                         "separator":"AND",
                         "layout":"form",
                         "defaults":{
                            "hideLabel":false,
                            "enableKeyEvents":true,
                            "bubbleEvents":[
                               "keyup",
                               "change"
                            ]
                         }
                      }
                   }
                ]
		}
	]
}
