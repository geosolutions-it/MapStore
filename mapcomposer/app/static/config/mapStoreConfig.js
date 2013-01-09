{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "it",
   "embedding": false,
   "gsSources":{                
        "csi_aa": {
            "ptype": "gxp_wmssource",
			"title": "Limiti Amministrativi RP",
			"version":"1.3.0",
		    "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS01_AmbitiAmministrativi"
        },
        "csi_tu": {
            "ptype": "gxp_wmssource",
			"title": "Tessuto Urbanizzato RP",
			"version":"1.3.0",
		    "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS02_TessutoUrbanizzato"
        },
        "csi_trasp": {
            "ptype": "gxp_wmssource",
			"title": "Trasporti RP",
			"version":"1.3.0",
		    "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS03_Trasporti"
        },
        "csi_idro": {
            "ptype": "gxp_wmssource",
			"title": "Idrografia RP",
			"version":"1.3.0",
		    "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS04_Idrografia"
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
		},
		"destination": {
			"ptype": "gxp_wmssource",
			"title": "Destination GeoServer",
			"version":"1.1.1",
		    "url": "http://localhost:8080/geoserver/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90"
            }
		}
	},
	"map": {
		"projection": "EPSG:3857",
		"units": "m",
		"center": [903893.13597286, 5651406.520669],
		"zoom": 8,
		"maxExtent": [
			456125.02434063, 5403020.7962146,
			1323838.1693132, 5887325.807362
		],
		"layers": [                      
            
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			}, {
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},
            {
                "source": "csi_aa",
                "title": "Ambiti Amministrativi",
                "name": "AmbitiAmministrativi",
                "group": "background"
            },{
                "source": "csi_tu",
                "title": "Tessuto Urbanizzato",
                "name": "TessutoUrbanizzato",
                "group": "background"
            },{
                "source": "csi_trasp",
                "title": "Trasporti",
                "name": "Trasporti",
                "group": "background"
            },{
                "source": "csi_idro",
                "title": "Idrografia",
                "name": "Idrografia",
                "group": "background"
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
				"source": "destination",
				"title": "Rischio Totale",
				"name": "geosolutions:aggregated_data_selection",
				"displayInLayerSwitcher": true,
				"tiled": false
			}
		]
	},
	
	"proj4jsDefs": {
		"EPSG:32632": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
	},
	
	"tools":[
	   {
		  "ptype":"gxp_layertree",
		  "outputConfig":{
			 "id":"layertree"
		  },
		  "outputTarget":"tree"
	   },
	   {
		  "ptype":"gxp_legend",
		  "outputTarget":"legend",
		  "outputConfig":{
			 "autoScroll":true
		  },
		  "legendConfig":{
			 "legendPanelId":"legendPanel",
			 "defaults":{
				"style":"padding:5px",
				"baseParams":{
				   "LEGEND_OPTIONS":"forceLabels:on;forceTitles:off;fontSize:10",
				   "WIDTH":12,
				   "HEIGHT":12
				}
			 }
		  }
	   },
	   {
		  "ptype":"gxp_groupproperties",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_layerproperties",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_zoomtolayerextent",
		  "actionTarget":{
			 "target":"layertree.contextMenu",
			 "index":0
		  }
	   },
	   {
		  "ptype":"gxp_zoomtoextent",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":15
		  }
	   },
	   {
		  "ptype":"gxp_navigation",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":16
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_zoombox",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":17
		  }
	   },
	   {
		  "ptype":"gxp_zoom",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":18
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_navigationhistory",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":19
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_wmsgetfeatureinfo",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":20
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_measure",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":21
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_georeferences",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":23
		  }
	   },		
	   {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
	   }, 
	   {
			"ptype": "gxp_reversegeocoder",
			"outputTarget":"paneltbar",
			"outputConfig": {
				"width": "200"
			},
			"index": 26
	   }, 
	   {
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget":"paneltbar",
			"index": 27
	   },
	   {
			"ptype": "gxp_syntheticview",
			"outputTarget": "east",
			"id": "syntheticview",
			"selectionLayerName": "geosolutions:aggregated_data_selection",
			"selectionLayerTitle": "Rischio Totale", 	
			"targetLayerName": "geosolutions:bersagli",		
			"bufferLayerName": "geosolutions:siig_aggregation_1_buffer",
			"selectionLayerBaseURL": "http://localhost:8080/geoserver/wms",
			"selectionLayerProjection": "EPSG:32632",
			"geometryName": "geometria",
			"accidentTipologyName": "tipologia",
			"index": 28
	    },
	    {
			"ptype": "gxp_wfsgrid",
			"outputTarget": "featurelist",
			"wfsURL": "http://localhost:8080/geoserver/wfs",
			"featureType": "geosolutions:bersagli",
			"storeFields": [
				{"name": "id",              "mapping": "id"},
				{"name": "geometry",        "mapping": "geometry"},
				{"name": "id_tema",         "mapping": "properties.id_tema"},
				{"name": "superficie",      "mapping": "properties.superficie"},
				{"name": "descrizione_clc", "mapping": "properties.descrizione_clc"},
                {"name": "tipobersaglio", "mapping": "properties.tipobersaglio"},
				{"name": "type",		    "mapping": "type"}
			],
			"columnModel": [
				{"id":     "id_tema",         "dataIndex": "id_tema", "header": "id_tema"},
				{"header": "superficie",      "dataIndex": "superficie"},
                {"header": "Tipologia", "dataIndex": "tipobersaglio"},
				{"header": "descrizione_clc", "dataIndex": "descrizione_clc"}
			],
			"index": 29
	    }
	]
}
