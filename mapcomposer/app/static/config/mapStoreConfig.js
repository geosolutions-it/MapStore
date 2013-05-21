    {
    "geoStoreBase":"http://localhost:8080/geostore/rest/",
    "proxy":"/http_proxy/proxy/?url=",
    "defaultLanguage": "it",
    "embedding": false,
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
        },
        "destination": {
            "ptype": "gxp_wmssource",
            "title": "Destination GeoServer",
            "version":"1.1.1",
            "url": "http://localhost:8080/geoserver/destination/ows",
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
            "group": "background",
            "visibility": false
        }, 
        {
            "source": "ol",
            "group": "background",
            "title": "Nessuno sfondo",
            "fixed": true,
            "type": "OpenLayers.Layer",
            "visibility": false,
            "args": [
            "Nessuno sfondo", {
                "visibility": false
            }
            ]
        }, {
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
        },
        {
            "source": "destination",
            "title": "Ambiti Amministrativi",
            "name": "LimitiAmministrativi",
            "group": ["Basic Data","Dati di base"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Tessuto Urbanizzato",
            "name": "TessutoUrbanizzato",
            "group": ["Basic Data","Dati di base"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Trasporti",
            "name": "Trasporti",
            "group": ["Basic Data","Dati di base"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Idrografia",
            "name": "Idrografia",
            "group": ["Basic Data","Dati di base"],
            "visibility": false
        },{
            "source": "google",
            "title": "Google Roadmap",
            "name": "ROADMAP",
            "group": "background",
            "visibility": false
        },{
            "source": "google",
            "title": "Google Terrain",
            "name": "TERRAIN",
            "group": "background",
            "visibility": false
        },{
            "source": "google",
            "title": "Google Hybrid",
            "name": "HYBRID",
            "group": "background"
        },{
            "source": "destination",
            "title": "Rischio",
            "name": "rischio",
            "displayInLayerSwitcher": true,
            "tiled": true,
            "env": "formula:16;target:1"
        },
		{
            "source": "destination",
            "title": "Zone urbanizzate",
            "name": "zone_urbanizzate_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Acque sotterranee",
            "name": "acque_sotterranee_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Acque superficiali",
            "name": "acque_superficiali_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Aree protette",
            "name": "aree_protette_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Aree boscate",
            "name": "aree_boscate_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Aree agricole",
            "name": "aree_agricole_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Addetti/utenti centri commerciali",
            "name": "centri_commerciali_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Addetti/utenti strutture scolastiche",
            "name": "strutture_scolastiche_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Addetti/utenti strutture sanitarie",
            "name": "strutture_sanitarie_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
		{
            "source": "destination",
            "title": "Addetti industria e servizi",
            "name": "industria_servizi_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Popolazione turistica",
            "name": "popolazione_turistica_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Popolazione residente",
            "name": "popolazione_residente_all",
            "group": ["Targets","Bersagli"],
            "visibility": false
        }
        ]
    },
	
    "cswconfig": {
        "catalogs": [
        {
            "name": "Regione Piemonte", 
            "url": "http://www.ruparpiemonte.it/geocatalogorp/geonetworkrp/srv/it/csw", 
            "description": "Regione Piemonte"
        }				
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
	
    "proj4jsDefs": {
        "EPSG:32632": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:3857": "+title= Google Mercator EPSG:3857 +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"
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
                "minScale":5000,
                "baseParams":{
                    "LEGEND_OPTIONS":"forceLabels:on;forceTitles:off;fontSize:10",
                    "WIDTH":25,
                    "HEIGHT":25
                }
            }
        }
    },{
        "ptype": "gxp_addlayers",
        "actionTarget": "tree.tbar",
        "upload": true
    }, {
        "ptype": "gxp_removelayer",
        "actionTarget": ["tree.tbar", "layertree.contextMenu"]
    }, {
		"ptype": "gxp_groupproperties",
		"actionTarget": ["tree.tbar", "layertree.contextMenu"]
	}, {
		"ptype": "gxp_layerproperties",
		"actionTarget": ["tree.tbar", "layertree.contextMenu"]
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
		"ptype": "gxp_aoi",
		"id": "aoi",
		"outputConfig":{
			 "outputSRS": "EPSG:4326"
		 },
		 "container": "fieldset"

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
		"useTabPanel": true,
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
        "actions": ["->"], 
        "actionTarget": "paneltbar"
    }, 
    {
        "ptype": "gxp_dynamicgeocoder",
        "outputTarget":"paneltbar",
        "index": 22
    }, 
    {
        "ptype": "gxp_reversegeocoder",
        "outputTarget":"paneltbar",
        "outputConfig": {
            "width": "200"
        },
        "index": 23
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
	{
        "ptype":"gxp_print",
        "customParams":{
            "outputFilename":"mapstore-print"
        },
		"ignoreLayers": "Google Hybrid,Bing Aerial,Nessuno sfondo,Google Terrain,Google Roadmap",
        "printService":"http://localhost:8080/geoserver/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":4
        }
    },
    {
        "ptype":"gxp_georeferences",
        "actionTarget":{
            "target":"paneltbar",
            "index":25
        }
    },
    {
        "ptype": "gxp_syntheticview",
        "outputTarget": "east",
        "id": "syntheticview",
                        "aoi": "aoi",
        "selectionLayerName": "aggregated_data_selection",
        "selectionLayerTitle": "Rischio Totale", 	        
        "bufferLayerNameHuman": "buffer_human",
        "bufferLayerNameNotHuman": "buffer_not_human",
        "selectionLayerBaseURL": "http://localhost:8080/geoserver/destination/wms",
        "selectionLayerProjection": "EPSG:32632",
        "geometryName": "geometria",
        "accidentTipologyName": "tipologia",
        "wfsURL": "http://localhost:8080/geoserver/destination/wfs",
        "wfsVersion" : "1.1.0",
        "destinationNS": "destination",
        "index": 28
    },
    {
		"ptype": "gxp_tabpanelwfsgrids",
        "outputTarget": "featurelist",
		"srsName" : "EPSG:32632",
        "wfsURL": "http://localhost:8080/geoserver/destination/wfs",
		"targets": {
			"Popolazione residente": {
				"featureType": "popolazione_residente",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "residenti",      
						"mapping": "residenti"
					}
				],
				"columns": [
					{
						"header": "Residenti",      
						"dataIndex": "residenti"
					}
				],
				"title": "Popolazione residente",
				"name": "POPOLAZIONE RESIDENTE",
				"type": "umano"
			},
			"Popolazione fluttuante turistica": {
				"featureType": "popolazione_turistica",
							
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "comune",      
						"mapping": "denominazione_comune"
					},
					{
						"name": "natcode",      
						"mapping": "nat_code"
					},
					{
						"name": "presmax",      
						"mapping": "pres_max"
					},
					{
						"name": "presmed",      
						"mapping": "pres_med"
					}
				],
				"columns": [
					{
						"header": "Comune",      
						"dataIndex": "comune"
					},
					{
						"header": "NAT Code",      
						"dataIndex": "natcode"
					},
					{
						"header": "Presenza massima",      
						"dataIndex": "presmax"
					},
					{
						"header": "Presenza media",      
						"dataIndex": "presmed"
					}
				],
				"title": "Popolazione fluttuante turistica",
				"name": "POPOLAZIONE FLUTTUANTE TURISTICA (MAX)",
				"type": "umano"
			},
			"Addetti industria e servizi": {
								
				"featureType": "industria_servizi",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "addetti"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "codfisc",      
						"mapping": "cod_fisc"
					},
					{
						"name": "codiceateco",      
						"mapping": "codice_ateco"
					},
					{
						"name": "descrizioneateco",      
						"mapping": "descrizione_ateco"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Cod. Fiscale",      
						"dataIndex": "codfisc"
					},
					{
						"header": "Cod. ATECO",      
						"dataIndex": "codateco"
					},
					{
						"header": "Desc. ATECO",      
						"dataIndex": "descrizioneateco"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti industria e servizi",
				"name": "ADDETTI INDUSTRIA E SERVIZI",
				"type": "umano"
			},
			"Addetti/utenti strutture sanitarie": {
				"featureType": "strutture_sanitarie",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "addetti"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "codice_uso",      
						"mapping": "codice_uso"
					},
					{
						"name": "descrizione_uso",      
						"mapping": "descrizione_uso"
					},
					{
						"name": "fonte_addetti",      
						"mapping": "fonte_addetti"
					},
					{
						"name": "fonte_numero_letti_day_h",      
						"mapping": "fonte_numero_letti_day_h"
					},
					{
						"name": "nr_letti_dh",      
						"mapping": "nr_letti_dh"
					},
					{
						"name": "fonte_numero_letti_ordinri",      
						"mapping": "fonte_numero_letti_ordinri"
					},
					{
						"name": "letti_ordinari",      
						"mapping": "letti_ordinari"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Cod. Uso",      
						"dataIndex": "codice_uso"
					},
					{
						"header": "Desc. Uso",      
						"dataIndex": "descrizione_uso"
					},
					{
						"header": "Fonte Addetti",      
						"dataIndex": "fonte_addetti"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					},
					{
						"header": "Fonte N. Letti day hosp.",      
						"dataIndex": "fonte_numero_letti_day_h"
					},
					{
						"header": "N. Letti day hosp.",      
						"dataIndex": "nr_letti_dh"
					},
					{
						"header": "Fonte N. Letti day ordin.",      
						"dataIndex": "fonte_numero_letti_ordinri"
					},
					{
						"header": "N. Letti day ordin.",      
						"dataIndex": "letti_ordinari"
					}
				],
				"title": "Addetti/utenti strutture sanitarie",
				"name": "ADDETTI/UTENTI STRUTTURE SANITARIE",
				"type": "umano"
			},
			"Addetti/utenti strutture scolastiche": {
				"featureType": "strutture_scolastiche",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "addetti"
					},
					{
						"name": "codice_uso",      
						"mapping": "codice_uso"
					},
					{
						"name": "descrizione_uso",      
						"mapping": "descrizione_uso"
					},
					{
						"name": "fonte_iscritti",      
						"mapping": "fonte_iscritti"
					},
					{
						"name": "iscritti",      
						"mapping": "iscritti"
					},
					{
						"name": "fonte_addetti_scuole",      
						"mapping": "fonte_addetti_scuole"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Cod. Uso",      
						"dataIndex": "codice_uso"
					},
					{
						"header": "Desc. Uso",      
						"dataIndex": "descrizione_uso"
					},
					{
						"header": "Fonte Iscritti",      
						"dataIndex": "fonte_iscritti"
					},
					{
						"header": "N. Iscritti",      
						"dataIndex": "iscritti"
					},
					{
						"header": "Fonte Addetti",      
						"dataIndex": "fonte_addetti_scuole"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti strutture scolastiche",
				"name": "ADDETTI/UTENTI STRUTTURE SCOLASTICHE",
				"type": "umano"
			},
			"Addetti/utenti centri commerciali": {
				"featureType": "centri_commerciali",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "addetti"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "insegna",      
						"mapping": "insegna"
					},
					{
						"name": "sup_vendita",      
						"mapping": "sup_vendita"
					},
					{
						"name": "fonte_utenti",      
						"mapping": "fonte_utenti"
					},
					{
						"name": "utenti",      
						"mapping": "utenti"
					},
					{
						"name": "fonte_addetti_commercio",      
						"mapping": "fonte_addetti_commercio"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Insegna",      
						"dataIndex": "insegna"
					},
					{
						"header": "Sup. Vendita",      
						"dataIndex": "sup_vendita"
					},
					{
						"header": "Fonte Utenti",      
						"dataIndex": "fonte_utenti"
					},
					{
						"header": "N. Utenti",      
						"dataIndex": "utenti"
					},
					{
						"header": "Fonte Addetti",      
						"dataIndex": "fonte_addetti_commercio"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti centri commerciali",
				"name": "ADDETTI/UTENTI CENTRI COMMERCIALI",
				"type": "umano"
			},
			"Zone urbanizzate": {
				"featureType": "zone_urbanizzate",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					}
				],
				"columns": [
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Zone urbanizzate",
				"name": "ZONE URBANIZZATE",
				"type": "ambientale"
			},
			"Aree boscate": {
				"featureType": "aree_boscate",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					}
				],
				"columns": [					
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree boscate",
				"name": "AREE BOSCATE",
				"type": "ambientale"
			},
			"Aree protette": {
				"featureType": "aree_protette",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "denominazione_ente",      
						"mapping": "denominazione_ente"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "codice_iucn",      
						"mapping": "codice_iucn"
					},
					{
						"name": "descrizione_iucn",      
						"mapping": "descrizione_iucn"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Ente",      
						"dataIndex": "denominazione_ente"
					},
					{
						"header": "Codice IUCN",      
						"dataIndex": "codice_iucn"
					},
					{
						"header": "Descrizione IUCN",      
						"dataIndex": "descrizione_iucn"
					},
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree protette",
				"name": "AREE PROTETTE",
				"type": "ambientale"
			},
			"Aree agricole": {
				"featureType": "aree_agricole",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},					
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					}
				],
				"columns": [
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree agricole",
				"name": "AREE AGRICOLE",
				"type": "ambientale"
			},
			"Acque superficiali": {
				"featureType": "acque_superficiali",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "profondita_max",      
						"mapping": "profondita_max"
					},
					{
						"name": "quota_pdc",      
						"mapping": "quota_pdc"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					},
					{
						"name": "toponimo_completo",      
						"mapping": "toponimo_completo"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Toponimo completo",      
						"dataIndex": "toponimo_completo"
					},
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					},
					{
						"header": "Profondità max",      
						"dataIndex": "profondita_max"
					},
					{
						"header": "Quota",      
						"dataIndex": "quota_pdc"
					}
				],
				"title": "Acque superficiali",
				"name": "ACQUE SUPERFICIALI",
				"type": "ambientale"
			},
			"Acque sotterranee": {
				"featureType": "acque_sotterranee",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "denominazione",      
						"mapping": "denominazione"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "profondita_max",      
						"mapping": "profondita_max"
					},
					{
						"name": "quota_pdc",      
						"mapping": "quota_pdc"
					},
					{
						"name": "tipo_captazione",      
						"mapping": "tipo_captazione"
					},
					{
						"name": "codice_clc",      
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",      
						"mapping": "descrizione_clc"
					}
				],
				"columns": [
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione"
					},
					{
						"header": "Codice CLC",      
						"dataIndex": "codice_clc"
					},
					{
						"header": "Descrizione CLC",      
						"dataIndex": "descrizione_clc"
					},
					{
						"header": "Tipo captazione",      
						"dataIndex": "tipo_captazione"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Acque sotterranee",
				"name": "ACQUE SOTTERRANEE",
				"type": "ambientale"
			},
			"Beni culturali": {
				"featureType": "beni_culturali",
				"fields": [
					{
						"name": "id",              
						"mapping": "id"
					},
					{
						"name": "geometry",        
						"mapping": "geometry"
					},
					{
						"name": "id_tema",         
						"mapping": "id_tema"
					},
					{
						"name": "denominazione_bene",      
						"mapping": "denominazione_bene"
					},
					{
						"name": "superficie",      
						"mapping": "superficie"
					},
					{
						"name": "cod_bene",      
						"mapping": "cod_bene"
					},
					{
						"name": "tipologia",      
						"mapping": "tipologia"
					}
				],
				"columns": [
					{
						"header": "Cod. Bene",      
						"dataIndex": "cod_bene"
					},
					{
						"header": "Tipologia",      
						"dataIndex": "tipologia"
					},
					{
						"header": "Denominazione",      
						"dataIndex": "denominazione_bene"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Beni culturali",
				"name": "BENI CULTURALI",
				"type": "ambientale"
			}
                        
		},
                "actionColumns" : [ 
                    {
                      "type": "checkDisplay",
                      "layerName": "Bersaglio Selezionato",
                      "sourceSRS": "EPSG:32632"
		},
                    {
                     "type": "zoom",
                     "sourceSRS": "EPSG:32632"
                    }],
        "index": 29
    }
    ]
}
