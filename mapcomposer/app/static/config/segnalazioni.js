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
			"url": "http://10.80.4.45/geoserver/ows",
			"layerBaseParams": {
					"TILED": true,
					"TILESORIGIN": "1123136.7048154, 5191939.6145633",
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
		"numZoomLevels":27,
		
	    "center":[1230080.35, 5372357.1],
        "zoom":8,
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
                "name": "postgis_sw:sedi_tecniche",
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
          "buttonId":"getfeatureinfo_tool_button",
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
            "xtype":"tabpanel",
            "id":"east", 
            "region": "east",
            "width": 350,
            "minWidth":350,
			"activeTab": 0,
            "collapsed":true,
			"collapsible":true,
            "header":true,
			"border":false,
			"items":[
                {
                    "xtype":"panel",
                    "id":"avvisi",
                    "layout":"fit",
                    "title":"Avvisi",
                    "items":{
                        "xtype":"panel",
                        "id":"filter",
                        "layout":"fit",

                        "target":"avvisi"
                    }
                },{
                    "id":"tree", 
                    "title":"livelli",
                    "target":"east"
                }]
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
			"ptype": "gxp_mouseposition",
            "displayProjectionCode":"EPSG:4326",
            "customCss": "text-shadow: 1px 0px 0px #686868, 1px 1px 0px #686868, 0px 1px 0px #686868,-1px 1px 0px #686868, -1px 0px 0px #686868, -1px -1px 0px #686868, 0px -1px 0px #686868, 1px -1px 0px #686868, 1px 4px 5px #aeaeae;color:white "
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
		},{
            "ptype": "gxp_autoenabler_tool",
            "options":{
                "id":"getfeatureinfo_tool_button"
            }
        }
	]
}
