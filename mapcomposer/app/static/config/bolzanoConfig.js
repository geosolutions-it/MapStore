{
   "geoStoreBase": "",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "it",
   "proj4jsDefs": {"EPSG:25832": "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"},
   "gsSources":{ 
		"bolzano": {
			"ptype": "gxp_wmssource",
			"url": "http://sit.comune.bolzano.it/geoserver/ows",
			"title": "Bolzano GeoServer",
			"SRS": "EPSG:900913",
			"version": "1.3.0"
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
		"zoom": 5,
		"extent": [
			1259091.229051,5855016.830973,
			1268808.28627,5863434.458712
		],
		"maxExtent": [
			1259091.229051,5855016.830973,
			1268808.28627,5863434.458712
		],
		"layers": [						
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "ol",
				"title": "Vuoto",
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
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
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
				"source": "bolzano",
				"title": "Ortofoto Bolzano/Bozen",
				"name": "Cartografia:ortofoto_2010",
				"group": "background"
			}
		]
	},
	"cswconfig": {
		"catalogs": [
		        {"name": "PTA", "url": "http://pta.partout.it/geoportalPTA/csw", "description": "Piattaforma Tecnologica alpina", "metaDataOptions":{"base":"http://pta.partout.it/geoportalPTA/catalog/search/resource/details.page","idParam":"uuid","idIndex":0}},
				{"name": "Treviso", "url": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw", "description": "Treviso Geonetwork"},
				{"name": "kscNet", "url": "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw", "description": "kscNet"},
				{"name": "CSI-CGIAR", "url": "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw", "description" : "CSI-CGIAR"},
				{"name": "EauFrance", "url": "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw", "description" : "EauFrance"},
				{"name": "SOPAC", "url": "http://geonetwork.sopac.org/geonetwork/srv/en/csw", "description" : "SOPAC"},
				{"name": "SADC", "url": "http://www.sadc.int/geonetwork/srv/en/csw", "description" : "SADC"},
				{"name": "MAPAS", "url": "http://mapas.mma.gov.br/geonetwork/srv/en/csw", "description" : "MAPAS"}
			],
		"dcProperty": "title",
		"initialBBox": {
		   "minx":-13,
		   "miny":10,
			"maxx":-10,
			"maxy":13
		}, 
		"cswVersion": "2.0.2",
		"filterVersion": "1.1.0",
		"start": 1,
		"limit": 10,
		"timeout": 60000
	},
	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	
	"tools": [
		{
			"ptype": "gxp_layertree",
			"outputConfig": {
				"id": "layertree"
			},
			"outputTarget": "tree",
			"localIndexs":{
					"it": 0,
					"de": 1
			}
		}, {
			"ptype": "gxp_legend",
			"outputTarget": "legend",
			"outputConfig": {
				"autoScroll": true
			},
			"legendConfig" : {
				"legendPanelId" : "legendPanel",
				"defaults": {
					"style": "padding:5px",                  
					"baseParams": {
						"LEGEND_OPTIONS": "forceLabels:on;fontSize:10",
						"WIDTH": 20, "HEIGHT": 20
					}
				}
			}
		}, {
			"ptype": "gxp_addlayers",
			"actionTarget": "tree.tbar",
			"id": "addlayers",
			"upload": true
		}, {
			"ptype": "gxp_removelayer",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_removeoverlays",
			"actionTarget": "tree.tbar"
		}, {
			"ptype": "gxp_addgroup",
			"actionTarget": "tree.tbar"
		}, {
			"ptype": "gxp_removegroup",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_groupproperties",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_layerproperties",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_zoomtolayerextent",
			"actionTarget": {"target": "layertree.contextMenu", "index": 0}
		},{
			"ptype":"gxp_geonetworksearch",
			"actionTarget": ["layertree.contextMenu"]
		}, {
			"ptype": "gxp_zoomtoextent",
			"actionTarget": {"target": "paneltbar", "index": 15}
		}, {
			"ptype": "gxp_navigation", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 16}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_zoombox", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 17}
		}, {
			"ptype": "gxp_zoom",
			"actionTarget": {"target": "paneltbar", "index": 18}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_navigationhistory",
			"actionTarget": {"target": "paneltbar", "index": 19}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo_menu", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 20}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_measure", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 21}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_saveDefaultContext",
			"actionTarget": {"target": "paneltbar", "index": 24},
			"needsAuthorization": true
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
		  "ptype":"gxp_print",
		  "customParams":{
			 "outputFilename":"mapstore-print"
		  },
		  "printService":"http://sit.comune.bolzano.it/geoserver/pdf/",
		  "legendPanelId":"legendPanel",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":4
		  }
        }, 	
		{
			"ptype": "gxp_searchvia",
			"outputTarget": "searchpanel",
			"serviceUrl": "http://sit.comune.bolzano.it/GeoInfo/",			
			"selectionProperties": {
			    "wmsURL": "http://sit.comune.bolzano.it/geoserver/",
				"selectionLayerTitle": "Selection Layer",
				"selectionLayerCiviciName": "Cartografia:civici",
				"selectionLayerViaName": "Ambiente:grafo",
				"filterCiviciAttribute": "ID",
				"selectionCiviciStyle": "highlight_point",
				"filterViaAttribute": "ID_STRASSE",
				"selectionViaStyle": "highlight"
			}
		}, {
			"ptype": "gxp_searchcatasto",
			"outputTarget": "searchpanel",
			"serviceUrl": "http://sit.comune.bolzano.it/GeoInfo/",			
			"selectionProperties": {
			    "wmsURL": "http://sit.comune.bolzano.it/geoserver/",
				"selectionLayerTitle": "Selection Layer"
			}
		},		
		{
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": false,
			"id": "addlayer"
		}
	]
}
