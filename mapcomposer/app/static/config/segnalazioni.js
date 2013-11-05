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
                    "FORMAT":"image/png8",
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
		"numZoomLevels":20,
		
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
                "visibility": false
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
                "title": "Avvisi",
                "name": "postgis_sw:avviso",
                "styles":"avviso", 
                "group": "Avvisi",
                "visibility": true,
                "buffer":16,
                "tiled":false
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
            "customCss": "text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
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
            "outputTarget":"filter",
                "filterFieldsets":[
                   {
                      "ref":"state",
                      "label":"Stato",
                      "xtype":"checkboxgroup",
                      "checked":true,
                      "columns":2,
                      "checkboxes":[
                         {
                            "boxLabel":"Annullato",
                            "checked":false,
                            "cql_filter":"IDAvvisoStato = 0"
                         },
                         {
                            "boxLabel":"Aperto",
                            "checked":true,
                            "cql_filter":"IDAvvisoStato = 1"
                         },
                         {
                            "boxLabel":"Sopralluogo",
                            "checked":true,
                            "cql_filter":"IDAvvisoStato = 2"
                         },
                         {
                            "boxLabel":"Intervento",
                            "checked":true,
                            "cql_filter":"IDAvvisoStato = 3"
                         },
                         {
                            "boxLabel":"Ripristino Stradale",
                            "checked":false,
                            "cql_filter":"IDAvvisoStato = 4"
                         },
                         {
                            "boxLabel":"Chiuso",
                            "checked":false,
                            "cql_filter":"IDAvvisoStato = 5"
                         },
                         {
                            "boxLabel":"Interruzione Servizio",
                            "checked":false,
                            "cql_filter":"IDAvvisoStato = 200"
                         }
                      ],
                      "emptyFilter":"1=0",
                      "customConfig":{
                         "hideLabel":false
                      }
                   },
                   {
                      "ref":"apertura",
                      "label":"Data Apertura",
                      "xtype":"radiogroup",
                      "checked":true,
                      "columns":2,
                      "checkboxes":[
                         {
                            "boxLabel":"Ultima settimana",
                            "name":"creazione",
                            "cql_filter":"DataCreazione >  '${backtime}'",
                            "daysBack":7
                         },
                         {
                            "boxLabel":"Ultimo mese ",
                            "name":"creazione",
                            "cql_filter":"DataCreazione >  '${backtime}'",
                            "monthsBack":1
                         },
                         {
                            "boxLabel":"Ultimi 6 mesi",
                            "name":"creazione",
                            "cql_filter":"DataCreazione >  '${backtime} '",
                            "monthsBack":6
                         },
                         {
                            "boxLabel":"Ultimo anno",
                            "name":"creazione",
                            "checked":true,
                            "cql_filter":"DataCreazione >  '${backtime} '",
                            "monthsBack":12
                         }
                      ],
                      "emptyFilter":"1=0",
                      "customConfig":{
                         "hideLabel":false
                      }
                   },
                   {
                      "ref":"chiusura",
                      "label":"Data Chiusura",
                      "xtype":"radiogroup",
                      "checked":false,
                      "columns":2,
                      "checkboxes":[
                         {
                            "boxLabel":"Ultima settimana",
                            "name":"chiusura",
                            "cql_filter":"DataChiusura > '${backtime}'",
                            "daysBack":7
                         },
                         {
                            "boxLabel":"Ultimo mese ",
                            "name":"chiusura",
                            "cql_filter":"DataChiusura >  '${backtime}'",
                            "monthsBack":1
                         },
                         {
                            "boxLabel":"Ultimi 6 mesi",
                            "name":"chiusura",
                            "cql_filter":"DataChiusura >  '${backtime}'",
                            "monthsBack":6
                         },
                         {
                            "boxLabel":"Ultimo anno",
                            "name":"chiusura",
                            "checked":true,
                            "cql_filter":"DataChiusura >  '${backtime}'",
                            "monthsBack":12
                         }
                      ],
                      "emptyFilter":"1=0",
                      "customConfig":{
                         "hideLabel":true
                      }
                   },
                   {
                      "ref":"other",
                      "label":"Altri Filtri",
                      "checked":false,
                      "xtype":"container",
                      "columns":1,
                      "emptyFilter":"1=1",
                      "items":[
                         {
                            "xtype":"textfield",
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
		},{
            "ptype": "gxp_autoenabler_tool",
            "options":{
                "id":"getfeatureinfo_tool_button"
            }
        }
	]
}
