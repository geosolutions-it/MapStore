{
   
   "scaleOverlayMode": "basic",
   "gsSources":{ 
        "MARISS-Layers": {
            "ptype": "gxp_wmssource",
            "title": "MARISS", 
            "version": "1.1.1",
            "url": "http://84.33.2.74/geoserver/mariss/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
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
		"bing": {
			"ptype": "gxp_bingsource" 
		}, 
		"ol": { 
			"ptype": "gxp_olsource" 
		}
	},
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
				"source": "MARISS-Layers",
				"title": "SAR-imagery",
				"name": "TEM_QL__1P_mosaic",
				"displayInLayerSwitcher": true,
				"tiled": true
			},
			{
				"source": "MARISS-Layers",
				"title": "SAR-imagery-footprints",
				"name": "TEM_QL__1P_mosaic_idx",
				"displayInLayerSwitcher": true,
				"tiled": true
			},
			{
				"source": "MARISS-Layers",
				"title": "SHIP-detection",
				"name": "tem_sd__1p",
				"displayInLayerSwitcher": true,
				"tiled": true
			},{
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
			}
		]
	},
    "customPanels":[
	      {
	          "xtype": "panel",
	          "title": "FeatureGrid",      
	          "border": false,
	          "id": "south",
	          "region": "south",
	          "layout": "fit",
	          "height": 330,
	          "collapsed": false,
	          "collapsible": true,
	          "header": true
	      },{
            "xtype": "panel",
	        "border": false,
	        "id":"east",
	        "region": "east",
	        "width": 475,
	        "split": true,
	        "collapsible": true,
			"collapsed": true,
	        "collapseMode": "mini",
			"activeTab":0,
	        "header": false,
	        "items": [{
				"region": "center", 
				"autoScroll": true, 
				"tbar": [], 
				"border": false, 
				"id": "downloadlist", 
				"title": "Download List",
				"layout": "fit"
			}]
        }
    ],	
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
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": false,
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
	      "actions": ["->"], 
	      "actionTarget": "paneltbar"
	    },{
            "ptype":"gxp_playback",
         	"outputTarget": "paneltbar",
			"id": "playback",
            "playbackMode": "range",
            "showIntervals": false,
            "labelButtons": true,
            "settingsButton": true,
            "rateAdjuster": false,
            "dynamicRange": false,
            "timeFormat": "l, F d, Y g:i:s A",
            "outputConfig": {
                "controlConfig":{
                    "step": 15,
                    "units": "Minutes",
                    "range": ["2010-12-24T00:00:00.000Z", "2010-12-24T23:59:00.000Z"],
                    "frameRate": 5
                }
            }
       },{
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		},{
			"ptype": "gxp_wfsgrid",
			"id": "featuregrid",
			"container": "panel",
			"outputTarget": "south",
			"wfsURL": "http://84.33.2.74/geoserver/mariss/wfs",
			"featureType": "TEM_QL__1P_mosaic_idx",
			"zoomToTooltip": "zoom to AOI",
			"srsName": "EPSG:4326",
			"fieldForSort": "time",
			"sortDirection": "DESC",
            "actionColumns" : [{
	                "type": "checkDisplay",
	                "layerName": "Highlight Layer",
	                "sourceSRS": "EPSG:4326"
	            },{
	                "type": "zoom",
	                "sourceSRS": "EPSG:4326"
	            },{
	                "type": "addToDownloadChart",
	                "sourceSRS": "EPSG:4326"
            }],
            "fields": [
                {
                    "name": "time",
                    "mapping": "time"
                },
                {
                    "name": "location",      
                    "mapping": "location"
                }
            ],
			"columns" : [
	            	{
						"header": "filename",      
						"dataIndex": "location",
	                    "sortable": true
	                },{
						"header": "time",
						"dataIndex": "time",
	                    "sortable": true
	                }
	            ]
		},{
		   "ptype": "gxp_wpsmanager",
		   "id": "wpsSPM",
		   "url": "http://84.33.2.74/geoserver/wps",
		   "geostoreUrl": "http://84.33.2.74/geostore/rest",
		   "geostoreUser": "admin",
		   "geostorePassword": "admin",
		   "geostoreProxy": "/proxy?url=",
		   "target": ""
		},{
	      "ptype": "gxp_downloadgrid",
	      "id": "downloadgrid",
	      "wfsGridId": "featuregrid",
	      "container": "panel",
	      "outputTarget": "downloadlist",
	      "autoExpandPanel": "east"
	    }
	]
}
