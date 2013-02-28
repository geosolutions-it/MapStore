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
            "group": "Dati di base",
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Tessuto Urbanizzato",
            "name": "TessutoUrbanizzato",
            "group": "Dati di base",
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Trasporti",
            "name": "Trasporti",
            "group": "Dati di base",
            "visibility": false
        },
        {
            "source": "destination",
            "title": "Idrografia",
            "name": "Idrografia",
            "group": "Dati di base",
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
            "title": "Rischio Totale",
            "name": "aggregated_data_selection",
            "displayInLayerSwitcher": true,
            "tiled": false
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
        "selectionLayerName": "aggregated_data_selection",
        "selectionLayerTitle": "Rischio Totale", 	        
        "bufferLayerName": "buffer",
        "selectionLayerBaseURL": "http://localhost:8080/geoserver/destination/wms",
        "selectionLayerProjection": "EPSG:32632",
        "geometryName": "geometria",
        "accidentTipologyName": "tipologia",
        "index": 28
    },
    {
        "ptype": "gxp_wfsgrid",
        "outputTarget": "featurelist",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "residenti",      
						"mapping": "properties.residente"
					}
				],
				"columnModel": [
					{
						"header": "Residenti",      
						"dataIndex": "superficie"
					}
				],
				"title": "Popolazione residente",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "popolazione",      
						"mapping": "properties.superficie"
					}
				],
				"columnModel": [
					{
						"header": "Popolazione",      
						"dataIndex": "popolazione"
					}
				],
				"title": "Popolazione fluttuante turistica",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "properties.n_addetti"
					},
					{
						"name": "denom",      
						"mapping": "properties.denom"
					}
				],
				"columnModel": [
					{
						"header": "Denominazione",      
						"dataIndex": "denom"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti industria e servizi",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "properties.n_addetti"
					},
					{
						"name": "denom",      
						"mapping": "properties.denom"
					}
				],
				"columnModel": [
					{
						"header": "Denominazione",      
						"dataIndex": "denom"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti strutture sanitarie",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "properties.n_addetti"
					},
					{
						"name": "denom",      
						"mapping": "properties.denom"
					}
				],
				"columnModel": [
					{
						"header": "Denominazione",      
						"dataIndex": "denom"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti strutture scolastiche",
				"type": "umano"
			},
			"Addetti/utenti centri commerciali": {
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "properties.n_addetti"
					},
					{
						"name": "denom",      
						"mapping": "properties.denom"
					}
				],
				"columnModel": [
					{
						"header": "Denominazione",      
						"dataIndex": "denom"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti centri commerciali",
				"type": "umano"
			},
			"Addetti/utenti centri commerciali": {
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "addetti",      
						"mapping": "properties.n_addetti"
					},
					{
						"name": "denom",      
						"mapping": "properties.denom"
					}
				],
				"columnModel": [
					{
						"header": "Denominazione",      
						"dataIndex": "denom"
					},
					{
						"header": "N. Addetti",      
						"dataIndex": "addetti"
					}
				],
				"title": "Addetti/utenti centri commerciali",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Zone urbanizzate",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree boscate",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree protette",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Aree agricole",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Acque superficiali",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "CLC",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Acque sotterranee",
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
						"mapping": "properties.id_tema"
					},
					{
						"name": "superficie",      
						"mapping": "properties.superficie"
					},
					{
						"name": "clc",      
						"mapping": "properties.descrizione_clc"
					}
				],
				"columnModel": [
					{
						"header": "Tipologia",      
						"dataIndex": "clc"
					},
					{
						"header": "Superficie",      
						"dataIndex": "superficie"
					}
				],
				"title": "Beni culturali",
				"type": "ambientale"
			}
		},
        "index": 29
    }
    ]
}
