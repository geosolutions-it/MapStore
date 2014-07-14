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
            "layersCachedExtent":[-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7],

			"layerBaseParams": {
					"TILED": true,
                    "FORMAT":"image/png8"
                    
			}
		},
		"mapquest": {
			"ptype": "gxp_mapquestsource"
		}, 
		"osm": { 
			"ptype": "gxp_osmsource"
		},
		"google": {
			"ptype": "gxp_googlesource",
            "enableTilt":false
		},
		"bing": {
            "ptype": "gxp_bingsource"
        },
		"ol": { 
			"ptype": "gxp_olsource" 
		},"ol": { 
			"ptype": "gxp_olsource" 
		}
		
    },
    "map":{
        	"projection": "EPSG:900913",
		"units": "m",
		"numZoomLevels":30,
		
	    "center":[1230080.35, 5372357.1],
        "zoom":8,
        "layers": [
			{
					"source": "ol",
					"group": "background",
					"fixed": true,
					"type": "OpenLayers.Layer",
					"visibility": false,
					"args": [
						"None", {"visibility": false}
					]
			},{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background",
                "visibility": false
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background",
                "visibility": false
			},{
				"source": "google",
				"title": "Google Hybrid",
				"name": "HYBRID",
				"group": "background",
                "visibility": true
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Fognatura",
                "name": "webgis:fgn_con",
                "group": "Sedi Tecniche",
                "visibility": true
			},{
                "source": "gsacque",
                "title": "Acquedotto",
                "name": "webgis:acq_con",
                "group": "Sedi Tecniche",
                "visibility": true
			},{
                "source": "gsacque",
                "title": "Prese Fiumi",
                "name": "webgis:fi",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Prese Laghi",
                "name": "webgis:la",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Pozzi",
                "name": "webgis:po",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Sorgenti",
                "name": "webgis:so",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Sollevamenti",
                "name": "webgis:sl",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Edificio",
                "name": "webgis:edificio",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Carpenterie Idrauliche",
                "name": "webgis:eduf",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Campionatore",
                "name": "webgis:campionatore",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Linee Elettriche",
                "name": "webgis:linee_elettriche",
                "group": "Sedi Tecniche",
                "visibility": false
			},{
                "source": "gsacque",
                "title": "Vasca",
                "name": "webgis:vasca",
                "group": "Sedi Tecniche",
                "visibility": false
			}
		]
        
    },
	"viewerTools":[
	   {	
		  "leaf":true,
		  "checked": true,
		  "ptype":"gxp_zoomtoextent",
          "extent":[
			 1046403.2 , 5200006.1,
		     1413757.5 ,   5544708.1
		   
		]
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
            "xtype":"panel",
            "id":"east", 
            "layout":"accordion",
            "region": "east",
            "width": 350,
            "minWidth":350,
			"activeTab": 1,
            "activeItem":1,
            "collapsed":true,
			"collapsible":true,
            "header":true,
			"border":false,
			"items":[
                {
                    "id":"tree", 
                    "iconCls":"icon-layer-switcher",
                    "title":"livelli",
                    "target":"east"
                },{
                    "xtype":"panel",
                    "iconCls":"gx-layer-visibility",
                    "id":"avvisi",
                    "layout":"fit",
                    "title":"Avvisi",
                    "items":{
                        "xtype":"panel",
                        "id":"filter",
                        "layout":"fit",

                        "target":"avvisi"
                    }
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
            "ptype": "gxp_autoenabler_tool",
            "options":{
                "id":"getfeatureinfo_tool_button"
            }
        }
	]
}
