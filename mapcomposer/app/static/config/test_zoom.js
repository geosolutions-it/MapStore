{
    "geoStoreBase":"",
    "proxy":"/http_proxy/proxy/?url=",
    "portalConfig":{
		"header":false
	},
	"defaultLanguage":"it",
    "gsSources": {
        "gsacque": {
			"ptype": "gxp_wmssource",
			"title": "Acque GeoServer",
			"url": "http://localhost:8080/geoserver/ows",
			"layerBaseParams": {
					"TILED": true,
					"TILESORIGIN": "-20037508.34, -20037508.34",
					"buffer":10
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
    "map":{
        	"projection": "EPSG:900913",
		"units": "m",
		"numZoomLevels":25,
		"extent": [
			 1046403.2 , 5200006.1,
		     1413757.5 ,   5544708.1
		   
		],
	    "restrictedExtent":[
			 1046403.2 , 5200006.1,
		     1413757.5 ,   5544708.1
		   
		],
        "layers": [
			{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Hybrid",
				"name": "HYBRID",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background"
			},{
					"source": "gsacque",
					"title": "Rete Acq",
					"name": "cite:fgn_con",
					"group": "Sedi Tecniche",
					"visibility": true
			},{
					"source": "gsacque",
					"title": "Avvisi",
					"name": "postgis_sw:avviso",
					"styles":"segnalazione", 
					"group": "Avvisi",
					"visibility": true,
                    "buffer":10,
                    "tiled":false
			}
		]
        
    },
	"viewerTools":[
	   {	
		  "leaf":true,
		  "checked": true,
		  "ptype":"gxp_zoomtoextent"
	   },{
		  "leaf":true,
		  "checked": true,
		  "iconCls":"gxp-icon-pan",
		  "ptype":"gxp_navigation"
	   },{
		  "actions":[
			 "-"
		  ]
	   },{
	      "leaf":true,
		  "checked": true,
		  "numberOfButtons":2,
		  "ptype":"gxp_zoombox"
	   },{
	      "leaf":true,
		  "checked": true,
		  "iconCls":"gxp-icon-zoom-in",
		  "numberOfButtons":2,
		  "ptype":"gxp_zoom"
	   },{
		  "leaf":true,
		  "checked": true,
		  "actions":[
			 "-"
		  ]
	   },{
		  "leaf":true,
		  "checked": true,
		  "numberOfButtons":2,
		  "ptype":"gxp_navigationhistory"
	   },{
		   "leaf":true,
		  "checked": true,
		  "actions":[
			 "-"
		  ]
	   },{
	      "leaf":true,
		  "checked": true,
		  "ptype":"gxp_wmsgetfeatureinfo",
		  "toggleGroup": "toolGroup",
          
		  "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
          "useTabPanel": true
	   },{
	       "leaf":true,
		  "checked": true,
		  "actions":[
			 "-"
		  ]
	   },{
	       "leaf":true,
		  "checked": true,
		  "ptype":"gxp_measure",
		  "controlOptions":{
			 "immediate":true
		  }
	   },{
		  "actions":[
			 "-"
		  ]
	   }
	],
	"customPanels":[
        {
            "xtype":"panel",
            "id":"tree", 
            "region": "west",
            "width": 250,
            "minWidth":250,
            "header":true,
            "split": true,
			"border":false,
            "collapsed":true,
			"collapsible":true,
            "layout":"fit"
        },{
            "xtype":"tabpanel",
            "id":"east", 
            "region": "east",
            "width": 350,
            "minWidth":350,
			"activeTab": 0,
            "collapsed":false,
			"collapsible":true,
            "header":true,
			"border":false,
			"items":{
				"xtype":"panel",
				"id":"filter",
				"title":"Avvisi",
				"layout":"fit",
				"target":"east"
                }
            }
    ],
	"disableLayerChooser":true,
	"customTools":[
		{
			"ptype": "gxp_layertree",
			"outputConfig": {
				"id": "layertree"
			},
			"outputTarget": "tree"
		},{
			"ptype": "gxp_mouseposition"
		},{
            "actions":[
			 "-"
		  ]
       },{
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
            "fadeOut":false,
			"index": 23
		},{
			"ptype": "gxp_wms_layer_filter",
            "outputTarget":"filter"
		}
	]
}
