{
	"geoStoreBase": "http://localhost:8080/geostore/rest/",
    "proxy":"/http_proxy/proxy/?url=",
	"defaultLanguage": "it",
	"embedding": false,
	"gsSources": {
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
            "url": "http://destination.geo-solutions.it/geoserver_destination/destination/ows",
            "layerBaseParams": {
                "TILED": true,                
                "format": "image/png8"
            },
			"loadingProgress": true
        },
        "destinationtiled": {
            "ptype": "gxp_wmscsource",
            "title": "Destination GeoServer Tiled",
            "version":"1.1.1",
            "url": "http://destination.geo-solutions.it/geoserver_destination/destination/wms",
            "layerBaseParams": {
                "TILED": true,                
                "format": "image/png8"
            },
			"loadingProgress": true
        },
        "externalstiled": {
            "ptype": "gxp_wmscsource",
            "title": "External WMS Tiled",
            "version":"1.1.1",
            "url": "http://destination.geo-solutions.it/geoserver_destination/externals/wms",
            "layerBaseParams": {
                "TILED": true,                
                "format": "image/png8"
            },
			"loadingProgress": true
        }
	},
	"map": {
		"projection": "EPSG:3857",
		"units": "m",
        "center": [1103893.13597286, 5651406.520669],
        "zoom": 7,
        "maxExtent": [
				-20037508.34,-20037508.34,
				20037508.34,20037508.34
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
            "title": ["Nessuno sfondo", "Nessuno sfondo", "Nessuno sfondo", "Kein Hintergrund"],
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
            "source": "externalstiled",
			"title": "Ambiti Amministrativi",
			"name": "LimitiAmministrativi",
            "group": ["Basic Data","Dati di base","données de base","Basisdaten PTA"],
			"visibility": false
		},
		{
            "source": "externalstiled",
			"title": "Tessuto Urbanizzato",
			"name": "TessutoUrbanizzato",
            "group": ["Basic Data","Dati di base","données de base","Basisdaten PTA"],
			"visibility": false
		},
		{
            "source": "externalstiled",
			"title": "Trasporti",
			"name": "Trasporti",
            "group": ["Basic Data","Dati di base","données de base","Basisdaten PTA"],
			"visibility": false
		},
		{
            "source": "externalstiled",
			"title": "Idrografia",
			"name": "Idrografia",
            "group": ["Basic Data","Dati di base","données de base","Basisdaten PTA"],
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
			"title": "Rischio Totale Ambientale",
			"name": "rischio_totale_ambientale",
			"displayInLayerSwitcher": true,
			"tiled": false,
            "env":"low:100;medium:500;max:1000",
            "riskPanel":true,
            "exclusive":"SIIG",			
			"forceOneVisible": false
        },{
			"source": "destination",
			"title": "Rischio Totale Sociale",
			"name": "rischio_totale_sociale",
			"displayInLayerSwitcher": true,
			"tiled": false,
            "env":"low:100;medium:500;max:1000",
            "riskPanel":true,
            "exclusive":"SIIG",
			
			"forceOneVisible": false
        },{
			"source": "destination",
			"title": "Rischio Totale Sociale - Ambientale",
			"name": "rischio_totale",
			"displayInLayerSwitcher": true,
			"tiled": false,
            "env":"lowsociale:100;mediumsociale:500;maxsociale:1000;lowambientale:100;mediumambientale:500;maxambientale:1000",
            "riskPanel":true,
            "exclusive":"SIIG",
			
			"forceOneVisible": false
		},
		{
            "source": "destinationtiled",
            "title": "Beni culturali",
            "name": "beni_culturali_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
            "visibility": false
        },
        {
            "source": "destinationtiled",
			"title": "Zone urbanizzate",
			"name": "zone_urbanizzate_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Acque sotterranee",
			"name": "acque_sotterranee_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Acque superficiali",
			"name": "acque_superficiali_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Aree protette",
			"name": "aree_protette_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Aree boscate",
			"name": "aree_boscate_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Aree agricole",
			"name": "aree_agricole_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Addetti/utenti centri commerciali",
			"name": "centri_commerciali_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Addetti/utenti strutture scolastiche",
			"name": "strutture_scolastiche_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Addetti/utenti strutture sanitarie",
			"name": "strutture_sanitarie_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Addetti industria e servizi",
			"name": "industria_servizi_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Popolazione turistica",
			"name": "popolazione_turistica_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
		},
		{
            "source": "destinationtiled",
			"title": "Popolazione residente",
			"name": "popolazione_residente_all",
            "group": ["Targets","Bersagli","Cibles","Vulnerable Elemente"],
			"visibility": false
        },{
            "source": "destinationtiled",
			"title": "Grafo stradale",
			"name": "grafo_stradale",
			"displayInLayerSwitcher": true,
			"tiled": true,
            "group": ["Roads","Strade","Routes"," Straßen"],
			"visibility": false
        },{
			"source": "destinationtiled",
			"title": "Gate",
			"name": "gate_geo",
			"displayInLayerSwitcher": true,
			"tiled": true,
            "group": ["Real time data","Dati in tempo reale","Données en temps réel","Echtzeitdaten"],
			"visibility": false
        },{
			"source": "destination",
			"title": "Obu",
			"name": "siig_geo_obu",
			"styles": "obu-point",
			"displayInLayerSwitcher": true,
			"tiled": false,
            "time" : "2014-01-31T14:50:10.229Z",
            "group": ["Real time data","Dati in tempo reale","Données en temps réel","Echtzeitdaten"],
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
        },
        {
            "name": "Provincia di Bolzano", 
            "url": "http://sdi.provincia.bz.it/geonetwork/srv/it/csw", 
            "description": "Autonome Provinz Bozen"
        },{
            "name": "PTA", 
            "url": "http://www.gruppoiit.lispa.it/geoportal/csw",
            "description": "PTA",
            "metaDataOptions":{
 				"base":"http://www.gruppoiit.lispa.it/geoportal/catalog/search/resource/details.page",
 				"idParam":"uuid",
 				"idIndex":0
 			}

        }, {
            "name": "GeoPortale Cooperazione Regione Piemonte", 
            "url": "http://www.geoportale.piemonte.it/cooperazione/geocatalogocop/srv/it/csw.rndt", 
            "description": "GeoPortale Cooperazione Regione Piemonte",
            "metaDataOptions":{
 				"base":"http://www.geoportale.piemonte.it/cooperazione/geocatalogocop/srv/it/metadata.show",
 				"idParam":"uuid"
 			}
        
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
        "id": "addlayers",
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
		"ptype": "gxp_zoomtolayerextent",
		"actionTarget": {
			"target": "layertree.contextMenu",
			"index": 0
		}
	},
	{
		"ptype": "gxp_zoomtoextent",
		"actionTarget": {
			"target": "paneltbar",
			"index": 15
		}
	},
	{
		"ptype": "gxp_aoi",
		"id": "aoi",
		"outputConfig": {
			"outputSRS": "EPSG:4326"
		},
		"container": "fieldset"
	},
	{
		"ptype": "gxp_seldamage",
		"id": "seldamage",
		"outputConfig": {
			"outputSRS": "EPSG:4326",
            "bufferOptions":{
                "minValue": 0,
                "maValue":100000,
                "decimalPrecision":2
            }            
		},
		"container": "fieldset"
	},
    {
        "ptype": "gxp_selectvulnelem",
		"actionTarget": {
			"target": "paneltbar",
			"index": 2
		}
    },
	{
		"ptype": "gxp_navigation",
		"toggleGroup": "toolGroup",
		"actionTarget": {
			"target": "paneltbar",
			"index": 16
		}
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_zoombox",
		"toggleGroup": "toolGroup",
		"actionTarget": {
			"target": "paneltbar",
			"index": 17
		}
	},
	{
		"ptype": "gxp_zoom",
		"actionTarget": {
			"target": "paneltbar",
			"index": 18
		}
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_navigationhistory",
		"actionTarget": {
			"target": "paneltbar",
			"index": 19
		}
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_wmsgetfeatureinfo",
		"useTabPanel": true,
		"toggleGroup": "toolGroup",
		"actionTarget": {
			"target": "paneltbar",
			"index": 20
		}
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_measure",
		"toggleGroup": "toolGroup",
		"actionTarget": {
			"target": "paneltbar",
			"index": 21
		}
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	}, {
        "ptype":"gxp_playback",
		"id": "destination_playback",
		"toolbarHidden": true,
        "outputTarget": "map",
        "playbackMode": "range",
        "showIntervals": false,
        "labelButtons": false,
        "settingsButton": false,
        "rateAdjuster": false,
        "dynamicRange": false,
        "timeFormat": "l, F d, Y g:i:s A",
        "outputConfig": {
            "controlConfig":{
                "step": 2,
                "units": "Minutes",
                "range": ["2012-11-20T07:40:00.000Z", "2012-11-22T00:00:00.000Z"],
                "frameRate": 3
            }
        }
    },
	{
		"actions": ["->"],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_dynamicgeocoder",
		"outputTarget": "paneltbar",
		"index": 22
	},
	{
		"ptype": "gxp_reversegeocoder",
		"outputTarget": "paneltbar",
		"outputConfig": {
			"width": "200"
		},
		"index": 23
    }, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
 			"text": "Help",
			"index": 25,
			"showOnStartup": false,
			"fileDocURL": "Manuale Utente SIIG_${locale}.pdf"
	},
	{
        "actions":[
        "-"
        ],
		"actionTarget": "paneltbar"
	},
	{
        "ptype":"gxp_print",
        "customParams":{
            "outputFilename":"mapstore-print",
            "forwardHeaders":["Authorization"]
        },
        "ignoreLayers": "Google Hybrid,Bing Aerial,Nessuno sfondo,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
        "printService":"http://destination.geo-solutions.it/geoserver_destination/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":4
        }
    },
    {
		"ptype": "gxp_georeferences",
		"actionTarget": {
			"target": "paneltbar",
			"index": 25
		}
	},{
		"ptype": "gxp_syntheticview",
		"outputTarget": "east",
		"id": "syntheticview",
		"aoi": "aoi",
        "seldamage": "seldamage",
		"selectionLayerName": "aggregated_data_selection",
		"selectionLayerTitle": "Rischio Totale",
		"bufferLayerNameHuman": "buffer_human",
		"bufferLayerNameNotHuman": "buffer_not_human",
		"selectionLayerBaseURL": "http://destination.geo-solutions.it/geoserver_destination/destination/wms",
		"selectionLayerProjection": "EPSG:32632",
		"geometryName": "geometria",
		"accidentTipologyName": "tipologia",
		"wfsURL": "http://destination.geo-solutions.it/geoserver_destination/destination/wfs",
		"wpsURL": "http://destination.geo-solutions.it/geoserver_destination/wps",
		"downloadBaseUrl": "http://destination.geo-solutions.it/geoserver_destination/www/downloads/",
		"wpsStore": "destination",
		"wfsVersion": "1.1.0",
		"destinationNS": "destination",
		"index": 28,
        "geoStoreBase":"http://destination.geo-solutions.it/geostore/rest/",
        "proxy":"/http_proxy/proxy/?url=",
		"showDisclaimerBeforeExport": true
	},
	{
		"ptype": "gxp_gatetimeslidertab",
        "id": "gatetimeslidertab",
        "wfsUrl":"http://destination.geo-solutions.it/geoserver_destination/ows",
        "wfsVersion": "1.1.0",
        "destinationNS": "destination",
        "statisticFeature": "gate_stats",
        "intervalsFeature": "siig_gate_d_intervalli",
        "timeFeature": "gate_data",        
        "layerGates":"gate_geo",
        "layerGatesTitle":"Gate",
        "nativeSrs": "EPSG:32632",
        "outputTarget": "east"
	}, {
        "ptype": "gxp_featuremanager",
        "id": "featuremanager",
        "wfsUrl":"http://destination.geo-solutions.it/geoserver_destination/ows",
        "paging": false,
        "layer": {
            "source": "destination",
            "name": "siig_gate_geo_gate"
        }
    },
    {
		"ptype": "gxp_obu",
        "id": "destinationobu",
        "outputTarget": "east",
		"layerToFilter": "OBU",
		"layerTrackTitle": "obu_track",
		"layerTrackName": "siig_geo_obu_line",
		"layerTrackUrl": "http://destination.geo-solutions.it/geoserver_destination/destination/ows",
		"wfsUrl": "http://destination.geo-solutions.it/geoserver_destination/ows?",
        "styleRenamedStore": [
            ["Obu points","Obu punti","Obu points","Obu punkte"],
            ["Obu points speed","Obu punti velocità","Obu points vitesse","Obu punkte Geschwindigkeit"],
            ["Obu points direction","Obu punti direzione","Obu point direction","Obu punkte Richtung"]
        ]
	},
	{
		"ptype": "gxp_addlayer",
		"showCapabilitiesGrid": true,
		"id": "addlayer"
	},
    {
        "ptype": "gxp_featureeditor",
        "featureManager": "featuremanager",
        "autoLoadFeatures": true,
        "actionTarget":"editorfieldset.bbar",
        "toggleGroup": "toolGroup",
        "excludeFields": ["data_cancellazione", "concessionaria_sito", "descrizione"],
        "renamedFields": {
            "id_gate": ["Id","Id","Id","Id"],
            "fk_partner": ["Partner","Partner","Partner","Partner"],
            "fk_server": ["Server","Server","Server","Server"],
            "concessionaria_sito_it": ["Concessionaria (IT)","Concessionaria (IT)","Concessionaria (IT)","Konzessionär (IT)"],
            "concessionaria_sito_en": ["Concessionaria (EN)","Concessionaria (EN)","Concessionaria (EN)","Konzessionär (EN)"],
            "concessionaria_sito_fr": ["Concessionaria (FR)","Concessionaria (FR)","Concessionaria (FR)","Konzessionär (FR)"],
            "concessionaria_sito_de": ["Concessionaria (DE)","Concessionaria (DE)","Concessionaria (DE)","Konzessionär (DE)"],
            "nr_corsie_carreggiata": ["Corsie","Corsie","Corsie","Spuren"],
            "descrizione_it": ["Description (IT)","Descrizione (IT)","Description (IT)","Beschreibung (IT)"],
            "descrizione_en": ["Description (EN)","Descrizione (EN)","Description (EN)","Beschreibung (EN)"],
            "descrizione_fr": ["Description (FR)","Descrizione (FR)","Description (FR)","Beschreibung (FR)"],
            "descrizione_de": ["Description (DE)","Descrizione (DE)","Description (DE)","Beschreibung (DE)"],
            "collocazione": ["Collocation","Collocazione","Collocation","Lokalisierung"],
            "data_inizio_validita": ["Start Validity","Inizio Validita","Lancer Validité","Start der Gültigkeit"],
            "data_fine_validita": ["End Validity","Fine Validita","Validité de Fin","Ende der Gültigkeit"]
        },
        "fidFields": {
            "siig_gate_geo_gate": "id_gate"
        }
    },
	{
		"ptype": "gxp_tabpanelwfsgrids",
		"outputTarget": "featurelist",
		"srsName": "EPSG:32632",
		"wfsURL": "http://destination.geo-solutions.it/geoserver_destination/wfs",
		"panels": {
			"targets": {
				"Popolazione residente": {
                    "featureType": "popolazione_residente_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "residenti"
					},
					{
                            "name": "value",      
						"mapping": "residenti"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        },
                        {
                            "name": "fonte_residenti",      
                            "mapping": "fonte_residenti_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Residents number", "Residenti", "Nombre de résidents", "Anzahl der Anwohner"],
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        },
                        {
                            "header": ["Residents number source (Estimated / calculated)", "Fonte residenti", "Source du nombre de résidents (Estimé/calculé)", "Quelle der Anzahl der Anwohner (geschätzt/berechnet)"],      
                            "dataIndex": "fonte_residenti"
                        }
                    ],
                    "title": ["Resident Population", "Popolazione residente", "Population résidente", "Anwohnerzahlen"],
					"name": "POPOLAZIONE RESIDENTE",
					"id": 1,
					"type": "umano",
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    }]
				},
				"Popolazione fluttuante turistica": {
					"featureType": "popolazione_turistica",
                                
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
						"mapping": "denominazione_comune_${locale}"
					},
					{
						"name": "natcode",
						"mapping": "nat_code"
					},
					{
                            "name": "value",      
						"mapping": "pres_max"
					},
					{
						"name": "presmed",
						"mapping": "pres_med"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Municipality name", "Comune", "Nom de la commune", "Gemeindename"],      
						"dataIndex": "comune"
					},
					{
                            "header": ["Municipality National Code", "NAT Code", "Code national de la commune", "Gemeindekodex"],      
						"dataIndex": "natcode"
					},
					{
                            "header": ["Maximum presence", "Presenza massima", "Présence maximale", "maximale Kapazität/ maximale Nächtigungen"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Average presence", "Presenza media", "Présence moyenne", "mittlere Kapazität/ mittlere Nächtigungen"],      
						"dataIndex": "presmed"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Tourist population", "Popolazione fluttuante turistica", "Population touristique", "Tourismuszahlen"],
					"name": "POPOLAZIONE FLUTTUANTE TURISTICA (MAX)",
					"id": 2,
					"type": "umano"
				},
				"Addetti industria e servizi": {
                                    
                    "featureType": "industria_servizi_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "addetti"
					},
					{
						"name": "fonte_addetti",
						"mapping": "fonte_addetti_${locale}"
					},
					{
						"name": "denominazione",
						"mapping": "denominazione_${locale}"
					},
					{
						"name": "codfisc",
						"mapping": "cod_fisc"
					},
					{
						"name": "descrizioneateco",
						"mapping": "descrizione_ateco_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Description", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Tax Code", "Cod. Fiscale", "Numéro d'identification fiscale", "Mehrwertssteuer-Nummer"],      
						"dataIndex": "codfisc"
					},
					{
                            "header": ["NACE code", "Cod. ATECO", "Code NACE", "ATECO Kodex"],      
						"dataIndex": "codateco"
					},
					{
                            "header": ["NACE code eescription ", "Desc. ATECO", "Description code NACE", "Beschreibung des ATECO Kodex"],      
						"dataIndex": "descrizioneateco"
					},
					{
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Employees number source (Estimated / calculated)", "Fonte addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Anzahl der Beschäftigten (geschätzt/berechnet)"],      
						"dataIndex": "fonte_addetti"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Industry and services", "Addetti industria e servizi", "Industrie et services", "Industrie und Dienstleistungen"],
					"name": "ADDETTI INDUSTRIA E SERVIZI",
					"id": 4,
					"type": "umano"
				},
				"Addetti/utenti strutture sanitarie": {
                    "featureType": "strutture_sanitarie_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "addetti"
					},
					{
						"name": "denominazione",
						"mapping": "denominazione_${locale}"
					},
					{
						"name": "descrizione_uso",
						"mapping": "descrizione_uso_${locale}"
					},
					{
						"name": "fonte_addetti",
						"mapping": "fonte_addetti_${locale}"
					},
					{
						"name": "fonte_numero_letti_day_h",
						"mapping": "fonte_numero_letti_day_h_${locale}"
					},
					{
						"name": "nr_letti_dh",
						"mapping": "nr_letti_dh"
					},
					{
						"name": "fonte_numero_letti_ordinari",
						"mapping": "fonte_numero_letti_ordinari_${locale}"
					},
					{
						"name": "letti_ordinari",
						"mapping": "letti_ordinari"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Use description", "Desc. Uso", "Description d'utilisation", "Nutzungsbeschreibung"],      
						"dataIndex": "descrizione_uso"
					},
					{
                            "header": ["Employees number source (Estimated / calculated)", "Fonte addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Bedienstetenzahlen"],      
						"dataIndex": "fonte_addetti"
					},
					{
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Bediensteten"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Day-Hospital beds number source (Estimated / calculated)", "Fonte N. Letti day hosp.", "Source du nombre de lits d'hôpital de jour (Estimé/calculé)s", "Quelle der Bettenzahlen des Day-Hospital (geschätzt/erhoben))"],      
						"dataIndex": "fonte_numero_letti_day_h"
					},
					{
                            "header": ["Day-Hospital beds number", "N. Letti day hosp.", "Nombre de lits d'hôpital de jour", "Anzahl der Betten im Tageskrankenhaus/Day-Hospital"],      
						"dataIndex": "nr_letti_dh"
					},
					{
                            "header": ["Ordinary beds number source (Estimated / calculated)", "Fonte N. Letti day ordin.", "Source du nombre de lits ordinaires (Estimé/calculé)", "Quelle der ordentlichen Bettenzahlen (geschätzt/erhoben)"],      
						"dataIndex": "fonte_numero_letti_ordinari"
					},
					{
                            "header": ["Ordinary beds number", "N. Letti day ordin.", "Nombre de lits ordinaires", "Anzahl ordentliche Betten"],      
						"dataIndex": "letti_ordinari"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Health facilities", "Addetti/utenti strutture sanitarie", "Structures sanitaires", "Sanitäre Strukturen"],
					"name": "ADDETTI/UTENTI STRUTTURE SANITARIE",
					"id": 5,
					"type": "umano"
				},
				"Addetti/utenti strutture scolastiche": {
                    "featureType": "strutture_scolastiche_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "addetti"
					},
					{
						"name": "descrizione_uso",
						"mapping": "descrizione_uso_${locale}"
					},
					{
						"name": "fonte_iscritti",
						"mapping": "fonte_iscritti_${locale}"
					},
					{
						"name": "iscritti",
						"mapping": "iscritti"
					},
					{
						"name": "fonte_addetti_scuole",
						"mapping": "fonte_addetti_scuole_${locale}"
					},
					{
						"name": "denominazione",
						"mapping": "denominazione_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Use description", "Desc. Uso", "Description du code d'utilisation", "Nutzungsbeschreibung"],      
						"dataIndex": "descrizione_uso"
					},
					{
                            "header": ["Students number source (Estimated / calculated)", "Fonte Iscritti", "Source du nombre d'élèves inscrits (Estimé/calculé)", " Quelle der Inskribiertenzahlen (geschätzt/erhoben)"],      
						"dataIndex": "fonte_iscritti"
					},
					{
                            "header": ["Students number", "N. Iscritti", "Nombre d'élèves inscrits", "Anzahl der Inskribierten "],      
						"dataIndex": "iscritti"
					},
					{
                            "header": ["Employees number source (Estimated / calculated)", "Fonte Addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Beschäftigtenzahlen (geschätzt/erhoben)"],      
						"dataIndex": "fonte_addetti_scuole"
					},
					{
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["School Facilities", "Addetti/utenti strutture scolastiche", "Établissements scolaires", "Bildungseinrichtungen"],
					"name": "ADDETTI/UTENTI STRUTTURE SCOLASTICHE",
					"id": 6,
					"type": "umano"
				},
				"Addetti/utenti centri commerciali": {
                    "featureType": "centri_commerciali_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "addetti"
					},
					{
						"name": "denominazione",
						"mapping": "denominazione_${locale}"
					},
					{
						"name": "insegna",
						"mapping": "insegna_${locale}"
					},
					{
						"name": "sup_vendita",
						"mapping": "sup_vendita"
					},
					{
						"name": "fonte_utenti",
						"mapping": "fonte_utenti_${locale}"
					},
					{
						"name": "utenti",
						"mapping": "utenti"
					},
					{
						"name": "fonte_addetti_commercio",
						"mapping": "fonte_addetti_commercio_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Description", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Signboard", "Insegna", "Enseigne", "Firmenbezeichnung"],      
						"dataIndex": "insegna"
					},
					{
                            "header": ["Retail area", "Sup. Vendita", "Surface de vente", "Verkaufsfläche"],      
						"dataIndex": "sup_vendita"
					},
					{
                            "header": ["Customers number source (Estimated / calculated)", "Fonte utenti", "Source du nombre de clients (Estimé/calculé)", "Quelle der Anzahl der Kunden (geschätzt/berechnet)"],      
						"dataIndex": "fonte_utenti"
					},
					{
                            "header": ["Customers number", "N. Utenti", "Nombre de clients", "Anzahl der Kunden"],      
						"dataIndex": "utenti"
					},
					{
                            "header": ["Employees number source (Estimated / calculated)", "Fonte Addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Anzahl der Beschäftigten (geschätzt/berechnet)"],      
						"dataIndex": "fonte_addetti_commercio"
					},
					{
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["medium and large retailers", "Addetti/utenti centri commerciali", "Moyennes et grandes surfaces", "Strukturen mittlerer und großer Verteilung"],
					"name": "ADDETTI/UTENTI CENTRI COMMERCIALI",
					"id": 7,
					"type": "umano"
				},
				"Zone urbanizzate": {
					"featureType": "zone_urbanizzate",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",
						"mapping": "descrizione_clc_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": [" Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
						"dataIndex": "codice_clc"
					},
					{
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
						"dataIndex": "descrizione_clc"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Urban Areas", "Zone urbanizzate", "Zones urbanisées", "Urbane Zonen/Flächen"],
					"name": "ZONE URBANIZZATE",
					"id": 10,
					"type": "ambientale"
				},
				"Aree boscate": {
					"featureType": "aree_boscate",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",
						"mapping": "descrizione_clc_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [                    
                        {
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
						"dataIndex": "codice_clc"
					},
					{
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
						"dataIndex": "descrizione_clc"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Wooded Areas", "Aree boscate", "Zones forestières", "Bewaldete Flächen"],
					"name": "AREE BOSCATE",
					"id": 11,
					"type": "ambientale"
				},
				"Aree protette": {
					"featureType": "aree_protette",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
						"mapping": "denominazione_${locale}"
					},
					{
						"name": "denominazione_ente",
						"mapping": "denominazione_ente_${locale}"
					},
					{
                            "name": "value",      
						"mapping": "superficie"
					},
					{
						"name": "descrizione_iucn",
						"mapping": "descrizione_iucn_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Area name", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Management authority", "Ente", "Dénomination de l'organisme", "Benennung der verwaltenden Institution"],      
						"dataIndex": "denominazione_ente"
					},
					{
                            "header": ["IUCN Description", "Descrizione IUCN", "Description UICN", "Beschreibung IUCN"],      
						"dataIndex": "descrizione_iucn"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Protected Areas", "Aree protette", "Zones protégées", "Naturschutzflächen"],
					"name": "AREE PROTETTE",
					"id": 12,
					"type": "ambientale"
				},
				"Aree agricole": {
					"featureType": "aree_agricole",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "name": "value",      
						"mapping": "superficie"
					},
					{
						"name": "codice_clc",
						"mapping": "codice_clc"
					},
					{
						"name": "descrizione_clc",
						"mapping": "descrizione_clc_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
						"dataIndex": "codice_clc"
					},
					{
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
						"dataIndex": "descrizione_clc"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Agricultural Areas", "Aree agricole", "Zones agricoles", "Landwirtschaftliche Flächen"],
					"name": "AREE AGRICOLE",
					"id": 13,
					"type": "ambientale"
				},
				"Acque superficiali": {
					"featureType": "acque_superficiali",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
						"mapping": "denominazione_${locale}"
					},
					{
                            "name": "value",      
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
						"mapping": "descrizione_clc_${locale}"
					},
					{
						"name": "toponimo_completo",
						"mapping": "toponimo_completo_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Complete name", "Toponimo completo", "Toponyme complet", "offizielle Benennung"],      
						"dataIndex": "toponimo_completo"
					},
					{
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
						"dataIndex": "codice_clc"
					},
					{
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
						"dataIndex": "descrizione_clc"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Maximum depth", "Profondità max", "Profondeur maximale", "Maximale Tiefe"],      
						"dataIndex": "profondita_max"
					},
					{
                            "header": ["Ground level altitude", "Quota", "Altitude du niveau du sol", "Höhe der Geländeoberfläche"],      
						"dataIndex": "quota_pdc"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Surface waters", "Acque superficiali", "Eaux superficielles", "Oberflächengewässer"],
					"id": 15,
					"name": "ACQUE SUPERFICIALI",
					"type": "ambientale"
				},
				"Acque sotterranee": {
                    "featureType": "acque_sotterranee_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
						"mapping": "denominazione_${locale}"
					},
					{
                            "name": "value",      
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
						"mapping": "tipo_captazione_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
						"dataIndex": "denominazione"
					},
					{
                            "header": ["Uptake typology", "Tipo captazione", "Type de captage", "Fassungstyp"],      
						"dataIndex": "tipo_captazione"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Groundwater", "Acque sotterranee", "Eaux souterraines", "unterirdische Gewässer (Tiefbrunnen)"],
					"id": 14,
					"name": "ACQUE SOTTERRANEE",
					"type": "ambientale"
				},
				"Beni culturali": {
                    "featureType": "beni_culturali_pl",
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
						"mapping": "denominazione_bene_${locale}"
					},
					{
                            "name": "value",      
						"mapping": "superficie"
					},
					{
						"name": "tipologia",
						"mapping": "tipologia_${locale}"
					},
					{
						"name": "partner",
						"mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Area typology", "Tipologia", "Type de bien", "Art des Gutes"],      
						"dataIndex": "tipologia"
					},
					{
                            "header": ["Description", "Denominazione", "Dénomination du bien", "Benennung des Gutes"],      
						"dataIndex": "denominazione_bene"
					},
					{
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
						"dataIndex": "partner"
                        }
                    ],
                    "title": ["Cultural Areas", "Beni culturali", "Patrimoine culturel", "Kulturelle Güter "],
					"id": 16,
					"name": "BENI CULTURALI",
					"type": "ambientale"
				}
                            
			},
			"roads": {
				"Grafo Stradale": {
                    "featureType": "v_grafo_stradale",
                    "sortBy": "id_geo_arco",
                    "fields": [
                        {
						"name": "id",
						"mapping": "id_geo_arco"
					},
					{
						"name": "geometry",
						"mapping": "geometria"
					},
					{
                            "name": "partner",         
                            "mapping": "partner_it"
                        },
                        {
                            "name": "tipo_densita",         
                            "mapping": "tipo_densita_veicolare_leggeri_pesanti_${locale}"
                        },
                        {
                            "name": "densita_veicolare",         
                            "mapping": "densita_veicolare"
                        },
                        {
                            "name": "tipo_velocita",         
                            "mapping": "tipo_velocita_media_leggeri_pesanti_${locale}"
                        },
                        {
                            "name": "velocita_media",         
                            "mapping": "velocita_media"
                        },
                        {
                            "name": "fl_nr_corsie",         
                            "mapping": "fl_nr_corsie_${locale}"
                        },
                        {
                            "name": "nr_corsie",         
                            "mapping": "nr_corsie"
                        },
                        {
                            "name": "flg_nr_incidenti",         
                            "mapping": "flg_nr_incidenti_${locale}"
                        },
                        {
                            "name": "nr_incidenti",         
                            "mapping": "nr_incidenti"
                        },
                        {
                            "name": "nr_corsie",         
                            "mapping": "nr_corsie"
                        },
                        {
                            "name": "lunghezza",         
                            "mapping": "lunghezza"
                        },
                        {
                            "name": "nr_incidenti_elab",         
                            "mapping": "nr_incidenti_elab"
					},
					{
                            "name": "elenco_dissesti",         
                            "mapping": "elenco_dissesti_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Id", "Id", "Id", "Id"],      
						"dataIndex": "id"
					},
					{
                            "header": ["Partner","Partner","Partenaire","Projektpartner"],
                            "dataIndex": "partner"
                        },
                        {
                            "header": ["Vehicular density type","Tipo Densità Veicolare","Type de densité des véhicules","Quelle DTV"],
                            "dataIndex": "tipo_densita"
                        },
                        {
                            "header": ["Vehicular density","Densità Veicolare","Densité de véhicules","Durchschnittlicher Tagesverkehr (DTV)"],
                            "dataIndex": "densita_veicolare"
                        },
                        {
                            "header": ["Average speed type","Tipo Velocità Media","Type de support Vitesse","Quelle Mittlere Geschwindigkeit"],
                            "dataIndex": "tipo_velocita"
					},
					{
                            "header": ["Average speed","Velocità Media","Vitesse moyenne","Mittlere Geschwindigkeit"],
                            "dataIndex": "velocita_media"
                        },
                        {
                            "header": ["Lanes Flag","Flag Corsie","Lanes de drapeau","Quelle Fahrbahnen"],
                            "dataIndex": "flg_nr_corsie"
                        },
                        {
                            "header": ["Lanes #","N. Corsie","Nombre de voies","Anzahl der Fahrbahnen"],
                            "dataIndex": "nr_corsie"
                        },
                        {
                            "header": ["Accidents Flag","Flag Incidenti","Accidents de drapeau","Quelle der Unfälle"],
                            "dataIndex": "flg_nr_incidenti"
                        },
                        {
                            "header": ["Accidents #","N. Incidenti","Nombre d'incidents","Anzahl der Unfälle"],
                            "dataIndex": "nr_incidenti"
                        },
                        {
                            "header": ["Processed Accidents","N. Incidenti Elab.","Nombre transformés accidents","Anzahl der Unfälle nachbearbeitet"],
                            "dataIndex": "nr_incidenti_elab"
                        },
                        {
                            "header": ["Length","Lunghezza","Longueur","Länge"],
                            "dataIndex": "lunghezza"
                        },
                        {
                            "header": ["Instabilities list","Elenco Dissesti","Liste des échecs","Quelle Gefahrenzonenkategorisierung"],
                            "dataIndex": "elenco_dissesti"
                        }
                    ],
                    "title": ["Roads", "Archi", "Archi", "Segmente"],
					"id": 1,
					"name": "ARCHI",
                    "type": "all"
				}
			},
            "simulation": {
                "Grafo Stradale": {
					"featureType": "grafo_simulazione",
					"fields": [{
						"name": "id",
						"mapping": "id_geo_arco"
					},
					{
						"name": "geometry",
						"mapping": "geometria"
					},
					{
						"name": "pis",
						"mapping": "pis"
					},
					{
						"name": "bersagli",
						"mapping": "bersagli"
					},
					{
						"name": "bersagli_desc",
						"mapping": "bersagli_desc"
					},
					{
						"name": "cff",
						"mapping": "cff"
					},
					{
						"name": "sostanze",
						"mapping": "sostanze"
					},
					{
						"name": "sostanze_desc",
						"mapping": "sostanze_desc"
					},
					{
						"name": "padr",
						"mapping": "padr"
					}],
					"columns": [{
						"header": ["Id",
						"Id",
						"Id",
						"Id"],
						"dataIndex": "id"
					},
					{
						"header": ["PIS",
						"PIS",
						"PIS",
						"PIS"],
						"dataIndex": "pis"
					},
					{
						"header": ["CFF",
						"CFF",
						"CFF",
						"CFF"],
						"dataIndex": "cff"
					},
					{
						"header": ["PADR",
						"PADR",
						"PADR",
						"PADR"],
						"dataIndex": "padr"
					}],
					"title": ["Archi",
					"Archi",
					"Archi",
                    "Segmente"],
                    "id": 100,
					"name": "ARCHI",
					"type": "all",
					"noPaging": true,
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "startedit",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]                    
                },
                "Popolazione residente": {
                    "featureType": "popolazione_residente_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "residenti"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        },
                        {
                            "name": "fonte_residenti",      
                            "mapping": "fonte_residenti_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Residents number", "Residenti", "Nombre de résidents", "Anzahl der Anwohner"],
                            "dataIndex": "value",
                            "editable": true
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        },
                        {
                            "header": ["Residents number source (Estimated / calculated)", "Fonte residenti", "Source du nombre de résidents (Estimé/calculé)", "Quelle der Anzahl der Anwohner (geschätzt/berechnet)"],      
                            "dataIndex": "fonte_residenti"
				}
                    ],
                    "title": ["Resident Population", "Popolazione residente", "Population résidente", "Anwohnerzahlen"],
                    "name": "POPOLAZIONE RESIDENTE",
                    "id": 1,
                    "type": "umano",
                    "noPaging": true,
                    "allowEdit": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
			},
                "Popolazione fluttuante turistica": {
                    "featureType": "popolazione_turistica_box",
                                
                    "fields": [
                        {
						"name": "id",
                            "mapping": "id_tematico"
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
                            "mapping": "denominazione_comune_${locale}"
                        },
                        {
                            "name": "natcode",      
                            "mapping": "nat_code"
                        },
                        {
                            "name": "value",      
                            "mapping": "pres_max"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Municipality name", "Comune", "Nom de la commune", "Gemeindename"],      
                            "dataIndex": "comune"
					},
					{
                            "header": ["Municipality National Code", "NAT Code", "Code national de la commune", "Gemeindekodex"],      
                            "dataIndex": "natcode"
					},
					{
                            "header": ["Maximum presence", "Presenza massima", "Présence maximale", "maximale Kapazität/ maximale Nächtigungen"],      
                            "dataIndex": "value",
                            "editable": true
					},
					{
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Tourist population", "Popolazione fluttuante turistica", "Population touristique", "Tourismuszahlen"],
                    "name": "POPOLAZIONE FLUTTUANTE TURISTICA (MAX)",
                    "id": 2,
                    "type": "umano",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Addetti industria e servizi": {
                                    
                    "featureType": "industria_servizi_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "addetti"
                        },
                        {
                            "name": "fonte_addetti",      
                            "mapping": "fonte_addetti_${locale}"
                        },
                        {
                            "name": "denominazione",      
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "codfisc",      
                            "mapping": "cod_fisc"
                        },
                        {
                            "name": "descrizioneateco",      
                            "mapping": "descrizione_ateco_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Description", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Tax Code", "Cod. Fiscale", "Numéro d'identification fiscale", "Mehrwertssteuer-Nummer"],      
                            "dataIndex": "codfisc"
                        },
                        {
                            "header": ["NACE code", "Cod. ATECO", "Code NACE", "ATECO Kodex"],      
                            "dataIndex": "codateco"
                        },
                        {
                            "header": ["NACE code eescription ", "Desc. ATECO", "Description code NACE", "Beschreibung des ATECO Kodex"],      
                            "dataIndex": "descrizioneateco"
                        },
                        {
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value",
                            "editable": true
                        },
                        {
                            "header": ["Employees number source (Estimated / calculated)", "Fonte addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Anzahl der Beschäftigten (geschätzt/berechnet)"],      
                            "dataIndex": "fonte_addetti"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
				}
                    ],
                    "title": ["Industry and services", "Addetti industria e servizi", "Industrie et services", "Industrie und Dienstleistungen"],
                    "name": "ADDETTI INDUSTRIA E SERVIZI",
                    "id": 4,
                    "type": "umano",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Addetti/utenti strutture sanitarie": {
                    "featureType": "strutture_sanitarie_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "addetti"
                        },
                        {
                            "name": "denominazione",      
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "descrizione_uso",      
                            "mapping": "descrizione_uso_${locale}"
                        },
                        {
                            "name": "fonte_addetti",      
                            "mapping": "fonte_addetti_${locale}"
                        },
                        {
                            "name": "fonte_numero_letti_day_h",      
                            "mapping": "fonte_numero_letti_day_h_${locale}"
                        },
                        {
                            "name": "nr_letti_dh",      
                            "mapping": "nr_letti_dh"
                        },
                        {
                            "name": "fonte_numero_letti_ordinari",      
                            "mapping": "fonte_numero_letti_ordinari_${locale}"
                        },
                        {
                            "name": "letti_ordinari",      
                            "mapping": "letti_ordinari"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Use description", "Desc. Uso", "Description d'utilisation", "Nutzungsbeschreibung"],      
                            "dataIndex": "descrizione_uso"
                        },
                        {
                            "header": ["Employees number source (Estimated / calculated)", "Fonte addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Bedienstetenzahlen"],      
                            "dataIndex": "fonte_addetti"
                        },
                        {
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Bediensteten"],      
                            "dataIndex": "value",
                            "editable": true
                        },
                        {
                            "header": ["Day-Hospital beds number source (Estimated / calculated)", "Fonte N. Letti day hosp.", "Source du nombre de lits d'hôpital de jour (Estimé/calculé)s", "Quelle der Bettenzahlen des Day-Hospital (geschätzt/erhoben))"],      
                            "dataIndex": "fonte_numero_letti_day_h"
                        },
                        {
                            "header": ["Day-Hospital beds number", "N. Letti day hosp.", "Nombre de lits d'hôpital de jour", "Anzahl der Betten im Tageskrankenhaus/Day-Hospital"],      
                            "dataIndex": "nr_letti_dh"
                        },
                        {
                            "header": ["Ordinary beds number source (Estimated / calculated)", "Fonte N. Letti day ordin.", "Source du nombre de lits ordinaires (Estimé/calculé)", "Quelle der ordentlichen Bettenzahlen (geschätzt/erhoben)"],      
                            "dataIndex": "fonte_numero_letti_ordinari"
                        },
                        {
                            "header": ["Ordinary beds number", "N. Letti day ordin.", "Nombre de lits ordinaires", "Anzahl ordentliche Betten"],      
                            "dataIndex": "letti_ordinari"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Health facilities", "Addetti/utenti strutture sanitarie", "Structures sanitaires", "Sanitäre Strukturen"],
                    "name": "ADDETTI/UTENTI STRUTTURE SANITARIE",
                    "id": 5,
                    "type": "umano",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",  
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Addetti/utenti strutture scolastiche": {
                    "featureType": "strutture_scolastiche_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "addetti"
                        },
                        {
                            "name": "descrizione_uso",      
                            "mapping": "descrizione_uso_${locale}"
                        },
                        {
                            "name": "fonte_iscritti",      
                            "mapping": "fonte_iscritti_${locale}"
                        },
                        {
                            "name": "iscritti",      
                            "mapping": "iscritti"
                        },
                        {
                            "name": "fonte_addetti_scuole",      
                            "mapping": "fonte_addetti_scuole_${locale}"
                        },
                        {
                            "name": "denominazione",      
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
			}
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Use description", "Desc. Uso", "Description du code d'utilisation", "Nutzungsbeschreibung"],      
                            "dataIndex": "descrizione_uso"
                        },
                        {
                            "header": ["Students number source (Estimated / calculated)", "Fonte Iscritti", "Source du nombre d'élèves inscrits (Estimé/calculé)", " Quelle der Inskribiertenzahlen (geschätzt/erhoben)"],      
                            "dataIndex": "fonte_iscritti"
                        },
                        {
                            "header": ["Students number", "N. Iscritti", "Nombre d'élèves inscrits", "Anzahl der Inskribierten "],      
                            "dataIndex": "iscritti"
                        },
                        {
                            "header": ["Employees number source (Estimated / calculated)", "Fonte Addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Beschäftigtenzahlen (geschätzt/erhoben)"],      
                            "dataIndex": "fonte_addetti_scuole"
                        },
                        {
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value",
                            "editable": true
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["School Facilities", "Addetti/utenti strutture scolastiche", "Établissements scolaires", "Bildungseinrichtungen"],
                    "name": "ADDETTI/UTENTI STRUTTURE SCOLASTICHE",
                    "id": 6,
                    "type": "umano",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",  
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Addetti/utenti centri commerciali": {
                    "featureType": "centri_commerciali_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "addetti"
                        },
                        {
                            "name": "denominazione",      
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "insegna",      
                            "mapping": "insegna_${locale}"
                        },
                        {
                            "name": "sup_vendita",      
                            "mapping": "sup_vendita"
                        },
                        {
                            "name": "fonte_utenti",      
                            "mapping": "fonte_utenti_${locale}"
                        },
                        {
                            "name": "utenti",      
                            "mapping": "utenti"
                        },
                        {
                            "name": "fonte_addetti_commercio",      
                            "mapping": "fonte_addetti_commercio_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Description", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Signboard", "Insegna", "Enseigne", "Firmenbezeichnung"],      
                            "dataIndex": "insegna"
                        },
                        {
                            "header": ["Retail area", "Sup. Vendita", "Surface de vente", "Verkaufsfläche"],      
                            "dataIndex": "sup_vendita"
                        },
                        {
                            "header": ["Customers number source (Estimated / calculated)", "Fonte utenti", "Source du nombre de clients (Estimé/calculé)", "Quelle der Anzahl der Kunden (geschätzt/berechnet)"],      
                            "dataIndex": "fonte_utenti"
                        },
                        {
                            "header": ["Customers number", "N. Utenti", "Nombre de clients", "Anzahl der Kunden"],      
                            "dataIndex": "utenti"
                        },
                        {
                            "header": ["Employees number source (Estimated / calculated)", "Fonte Addetti", "Source du nombre d'employés (Estimé/calculé)", "Quelle der Anzahl der Beschäftigten (geschätzt/berechnet)"],      
                            "dataIndex": "fonte_addetti_commercio"
                        },
                        {
                            "header": ["Employees number", "N. Addetti", "Nombre d'employés", "Anzahl der Beschäftigten"],      
                            "dataIndex": "value",
                            "editable": true
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["medium and large retailers", "Addetti/utenti centri commerciali", "Moyennes et grandes surfaces", "Strukturen mittlerer und großer Verteilung"],
                    "name": "ADDETTI/UTENTI CENTRI COMMERCIALI",
                    "id": 7,
                    "type": "umano",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Zone urbanizzate": {
                    "featureType": "zone_urbanizzate_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "superficie"
                        },
                        {
                            "name": "codice_clc",      
                            "mapping": "codice_clc"
                        },
                        {
                            "name": "descrizione_clc",      
                            "mapping": "descrizione_clc_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": [" Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
                            "dataIndex": "codice_clc"
                        },
                        {
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
                            "dataIndex": "descrizione_clc"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
		},
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Urban Areas", "Zone urbanizzate", "Zones urbanisées", "Urbane Zonen/Flächen"],
                    "name": "ZONE URBANIZZATE",
                    "id": 10,
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Aree boscate": {
                    "featureType": "aree_boscate_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "superficie"
                        },
                        {
                            "name": "codice_clc",      
                            "mapping": "codice_clc"
                        },
                        {
                            "name": "descrizione_clc",      
                            "mapping": "descrizione_clc_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [                    
                        {
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
                            "dataIndex": "codice_clc"
                        },
                        {
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
                            "dataIndex": "descrizione_clc"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Wooded Areas", "Aree boscate", "Zones forestières", "Bewaldete Flächen"],
                    "name": "AREE BOSCATE",
                    "id": 11,
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Aree protette": {
                    "featureType": "aree_protette_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "denominazione_ente",      
                            "mapping": "denominazione_ente_${locale}"
                        },
                        {
                            "name": "value",      
                            "mapping": "superficie"
                        },
                        {
                            "name": "descrizione_iucn",      
                            "mapping": "descrizione_iucn_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Area name", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Management authority", "Ente", "Dénomination de l'organisme", "Benennung der verwaltenden Institution"],      
                            "dataIndex": "denominazione_ente"
                        },
                        {
                            "header": ["IUCN Description", "Descrizione IUCN", "Description UICN", "Beschreibung IUCN"],      
                            "dataIndex": "descrizione_iucn"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Protected Areas", "Aree protette", "Zones protégées", "Naturschutzflächen"],
                    "name": "AREE PROTETTE",
                    "id": 12,
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",   
                    "allowEdit": true,                    
		"actionColumns": [{
			"type": "checkDisplay",
			"layerName": "Bersaglio Selezionato",
			"sourceSRS": "EPSG:32632"
		},
		{
			"type": "zoom",
			"sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Aree agricole": {
                    "featureType": "aree_agricole_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "name": "value",      
                            "mapping": "superficie"
                        },
                        {
                            "name": "codice_clc",      
                            "mapping": "codice_clc"
                        },
                        {
                            "name": "descrizione_clc",      
                            "mapping": "descrizione_clc_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
                            "dataIndex": "codice_clc"
                        },
                        {
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
                            "dataIndex": "descrizione_clc"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Agricultural Areas", "Aree agricole", "Zones agricoles", "Landwirtschaftliche Flächen"],
                    "name": "AREE AGRICOLE",
                    "id": 13,
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Acque superficiali": {
                    "featureType": "acque_superficiali_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "value",      
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
                            "mapping": "descrizione_clc_${locale}"
                        },
                        {
                            "name": "toponimo_completo",      
                            "mapping": "toponimo_completo_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Complete name", "Toponimo completo", "Toponyme complet", "offizielle Benennung"],      
                            "dataIndex": "toponimo_completo"
                        },
                        {
                            "header": ["Corine Land Cover code", "Codice CLC", "Code Corine Land Cover", "Kodex aus Corine Land Cover"],      
                            "dataIndex": "codice_clc"
                        },
                        {
                            "header": ["Corine Land Cover description", "Descrizione CLC", "Description  Corine Land Cover", "Beschreibung gemäß Corine Land Cover"],      
                            "dataIndex": "descrizione_clc"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Maximum depth", "Profondità max", "Profondeur maximale", "Maximale Tiefe"],      
                            "dataIndex": "profondita_max"
                        },
                        {
                            "header": ["Ground level altitude", "Quota", "Altitude du niveau du sol", "Höhe der Geländeoberfläche"],      
                            "dataIndex": "quota_pdc"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Surface waters", "Acque superficiali", "Eaux superficielles", "Oberflächengewässer"],
                    "id": 15,
                    "name": "ACQUE SUPERFICIALI",
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",  
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Acque sotterranee": {
                    "featureType": "acque_sotterranee_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "mapping": "denominazione_${locale}"
                        },
                        {
                            "name": "value",      
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
                            "mapping": "tipo_captazione_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Name", "Denominazione", "Dénomination", "Benennung"],      
                            "dataIndex": "denominazione"
                        },
                        {
                            "header": ["Uptake typology", "Tipo captazione", "Type de captage", "Fassungstyp"],      
                            "dataIndex": "tipo_captazione"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Groundwater", "Acque sotterranee", "Eaux souterraines", "unterirdische Gewässer (Tiefbrunnen)"],
                    "id": 14,
                    "name": "ACQUE SOTTERRANEE",
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632",  
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                },
                "Beni culturali": {
                    "featureType": "beni_culturali_box",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_tematico"
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
                            "mapping": "denominazione_bene_${locale}"
                        },
                        {
                            "name": "value",      
                            "mapping": "superficie"
                        },
                        {
                            "name": "tipologia",      
                            "mapping": "tipologia_${locale}"
                        },
                        {
                            "name": "partner",      
                            "mapping": "partner_${locale}"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Area typology", "Tipologia", "Type de bien", "Art des Gutes"],      
                            "dataIndex": "tipologia"
                        },
                        {
                            "header": ["Description", "Denominazione", "Dénomination du bien", "Benennung des Gutes"],      
                            "dataIndex": "denominazione_bene"
                        },
                        {
                            "header": ["Area", "Superficie", "Superficie", "Fläche"],      
                            "dataIndex": "value"
                        },
                        {
                            "header": ["Partner", "Partner", "Partner", "Partner"],      
                            "dataIndex": "partner"
                        }
                    ],
                    "title": ["Cultural Areas", "Beni culturali", "Patrimoine culturel", "Kulturelle Güter "],
                    "id": 16,
                    "name": "BENI CULTURALI",
                    "type": "ambientale",
                    "noPaging": true,
                    "layerEditName": "Bersaglio Selezionato Editing",
                    "sourceEditSRS": "EPSG:32632", 
                    "allowEdit": true,                    
                    "actionColumns": [{
                        "type": "checkDisplay",
                        "layerName": "Bersaglio Selezionato",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "zoom",
                        "sourceSRS": "EPSG:32632"
                    },
                    {
                        "type": "remove_target",
                        "sourceSRS": "EPSG:32632",
                        "width": 20
                    }]
                }
            },
            "damage": {
                "Aree di danno": {
                    "featureType": "buffer_1",
                    "fields": [
                        {
                            "name": "id",              
                            "mapping": "id_geo_arco"
                        },
                        {
                            "name": "geometry",        
                            "mapping": "geometria"
                        },
                        {
                            "name": "name",         
                            "mapping": "name"
                        },
                        {
                            "name": "distanza",         
                            "mapping": "distance"
                        }
                    ],
                    "columns": [
                        {
                            "header": ["Area", "Fascia",  "Bande", "Bereich"],
                            "dataIndex": "name"
                        },
                        {
                            "header": ["Distance", "Distanza", "Distance", "Distanz"],
                            "dataIndex": "distanza"
                        }
                    ],
                    "title": ["Damage areas", "Aree di danno",  "Des zones de dommages", "Schadensbereiche"],
                    "id": 1,
                    "name": "DAMAGEAREA",
                    "type": "all",
                    "noPaging": true
                }
            }
        },
        "currentPanel": "targets",
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