{
   "scaleOverlayMode": "basic",
   "defaultLanguage": "it",
   "gsSources":{
		"eventi": {
	    "ptype": "gxp_geojsonsource",
  	  "urlSource": "http://demo.geo-solutions.it/share/mapstore/demo/eventiOnline.json",
  	  "title": "Eventi"
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
		"ol": {
			"ptype": "gxp_olsource"
		}
	},
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
	"cookieConsent":true,
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
    "center": [855361.824054, 5633117.32775],
    "zoom": 12,
    "numZoomLevels": 19,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
				"source": "eventi",
				"baseParams": {"p1": "asdfasd", "p2": "12346"},
				"title": ["Events","Eventi"],
				"name": "Eventi",
				"group": ["GeoJSON","GeoJSON"],
		  	"visibility": true,
            "symbolizer": {
                "Point": {
                    "pointRadius": 6,
                    "graphicName": "triangle",
                    "fillColor": "#ECD282",
                    "fillOpacity": 0.2,
                    "strokeWidth": 3,
                    "strokeOpacity": 1,
                    "strokeColor": "#967228"
                }
                }
			},
        {
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
				"title": "Open Cycle Map",
				"name": "opencyclemap",
				"group": "background"
			},{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
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
    "removeTools":[
        "wmsgetfeatureinfo_plugin"
    ],
	"customTools":[
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, {
			"ptype": "gxp_categoryinitializer",
            "silentErrors": true
		}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode": "EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		},  {
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
			"toggleGroup": "toolGroup",
			"markerFadeoutDelay": 30
		}, {
			"actions": ["->"],
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
    }, {
			"ptype": "gxp_languageselector",
			"data":[
				["en","English","","en","English language"],
				["it","Italiano","","it","Italian language"]
			],
			"actionTarget": {"target": "panelbbar", "index": 3}
		}, {
			"ptype": "gxp_layertree",
			"outputConfig": {
				"id": "layertree"
				},
				"outputTarget": "tree",
				"localIndexs": {
					"en": 0,
					"it": 1
				},
				"collapsedGroups": true
		}, {
			"ptype": "gxp_getfeatureinfo_menu",
			"regex": "[\\s\\S]*[\\w]+[\\s\\S]*",
			"useTabPanel": true,
			"infoAction": "hover;click",
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 14},
			"maxFeatures": 50,
			"outputGridConfig":{
               "Eventi":{
                   "ignoreFields":["Scope"],
          		   "propertyNames":{"City":"Town"}
           }
            }
		}, {
        "ptype":"gxp_print",
        "customParams":{
            "outputFilename":"opticities-web-print",
            "geodetic": true
        },
        "ignoreLayers": "ROADMAP,TERRAIN,HYBRID",
        "printService":"http://vm-osotp.csi.it/geoserver/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":21
        }
    },{
		    "ptype":"gxp_geolocate",
		    "enableTracking" : false,
		    "layerName": "Position",
		    "bind": true,
		    "zoom": true,
		    "displayInLayerSwitcher": false,
		    "geolocationStyles": {
		        "pointStyle":{
		                "graphicName": "circle",
		                "strokeColor": "#aaa",
		                "fillColor": "#11f",
		                "strokeWidth": 2,
		                "fillOpacity": 0.7,
		                "strokeOpacity": 0.6,
		                "pointRadius": 5
		        },"auraStyle":{
		                "fillOpacity": 0.3,
		                "fillColor": "#55b",
		                "strokeColor": "#00f",
		                "strokeOpacity": 0.6
		        },
		    "geolocationOptions": {
		            "enableHighAccuracy": true,
		            "maximumAge": 0,
		            "timeout": 7000
		        }
		    },
		    "actionTarget":{
		        "target":"paneltbar",
		        "index": 22
		    }
		}

	]
}
