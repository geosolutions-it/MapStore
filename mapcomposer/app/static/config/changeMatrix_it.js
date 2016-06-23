{
   "geoStoreBase":"http://143.225.214.136/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "it",
   "tab": true,
   "portalConfig":{
		"header":true
   },
   "gsSources":{
   		"jrc": {
			"ptype": "gxp_wmssource",
			"title": "CRISP GeoServer",
			"url": "http://143.225.214.136/geoserver/ows"
		},
		"mapquest": {
			"ptype": "gxp_mapquestsource"
		},
		"osm": {
			"ptype": "gxp_osmsource"
		},
		"google": {
			"ptype": "gxp_googlesource",
			"useTiltImages": true
		},
		"ol": {
			"ptype": "gxp_olsource"
		},
		"mibactSITAP": {
			"ptype": "gxp_wmssource",
			"title": "MiBACT-SITAP (WMS)",
			"url": "http://sitap.beniculturali.it:8080/geoserver/apar.public/wms"
		},
		"isric250m": {
			"ptype": "gxp_wmssource",
			"title": "ISRIC-SoilGrids250m (WMS)",
			"url": "http://164.132.26.91:8080/geoserver/geonode/wms"
		},
		"cncpABP": {
			"ptype": "gxp_wmssource",
			"title": "CNCP-ABP (WMS)",
			"url": "http://93.63.35.107:8080/geoserver/pedclim/wms"
		},
		"ispraSIC": {
			"ptype": "gxp_wmssource",
			"title": "ISPRA-SIC (WMS)",
			"url": "http://www.geoservices.isprambiente.it/arcgis/services/TerritorioAmbiente/SitiProtettiSIC/MapServer/WMSServer"
		},
		"ispraRNMCS": {
			"ptype": "gxp_wmssource",
			"title": "ISPRA-RNMCS (WMS)",
			"url": "http://www.geoservices.isprambiente.it/arcgis/services/Suolo/consumo_di_suolo/MapServer/WMSServer"
		},
		"ispraPopRI50": {
			"ptype": "gxp_wmssource",
			"title": "ISPRA-PopRI50 (WMS)",
			"url": "http://www.geoservices.isprambiente.it/arcgis/services/RischioIdraulico/Popolazione_rischio_idraulico/MapServer/WmsServer"
		},
		"copHRL_I06": {
			"ptype": "gxp_wmssource",
			"title": "Copernicus-HRL,Imp2006 (WMS)",
			"url": "http://land.discomap.eea.europa.eu/arcgis/services/Land/Imperviousness_2006/MapServer/WMSServer"
		},
		"copHRL_I09": {
			"ptype": "gxp_wmssource",
			"title": "Copernicus-HRL,Imp2009 (WMS)",
			"url": "http://land.discomap.eea.europa.eu/arcgis/services/Land/IMD_09/MapServer/WMSServer"
		},
		"copHRL_I12": {
			"ptype": "gxp_wmssource",
			"title": "Copernicus-HRL,Imp2012 (WMS)",
			"url": "http://copernicus.discomap.eea.europa.eu/arcgis/services/GioLandPublic/HRL_Imperviousness_Density_2012/MapServer/WMSServer"
		}
	},
	"map": {
		"projection": "EPSG:3857",
		"units": "m",
		"center": [1250000.000000, 5370000.000000],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
				"source": "osm",
				"title" : "Open Street Map",
				"name"  : "mapnik",
				"group" : "background"
			},{
				"source": "google",
				"title" : "Google Roadmap",
				"name"  : "ROADMAP",
				"group" : "background"
			},{
				"source": "google",
				"title" : "Google Terrain",
				"name"  : "TERRAIN",
				"group" : "background"
			},{
				"source": "google",
				"title" : "Google Hybrid",
				"name"  : "HYBRID",
				"group" : "background"
			},{
				"source": "mapquest",
				"title" : "MapQuest OpenStreetMap",
				"name"  : "osm",
				"group" : "background"
			},{
			    "source": "ol",
			    "title": "No Background",
			    "group": "background",
			    "fixed": true,
			    "type": "OpenLayers.Layer",
			    "visibility": false,
			    "args": [
			     "None", {"visibility": false}
			    ]
			},{
                "source": "isric250m",
                "group" : "ISRIC - SoilGrids (250m)",
				"title" : "Classificazione dei suoli (WRB)",
				"name"  : "geonode:_TAXNWRB_250m",
				"tiled" : false,
				"visibility": false
            },{
                "source": "cncpABP",
                "group" : "CNCP - Centro Nazionale di Cartografia Pedologica",
				"title" : "ABP SIS - Regioni Pedologiche",
				"name"  : "SOIL_REGIONS",
				"tiled" : false,
				"visibility": false
            },{
                "source": "mibactSITAP",
                "group" : "MiBACT - SIT Ambientale e Paesaggistico",
				"title" : "Vincoli D.Lgs.42/2004 artt.136 e 157 -",
				"name"  : "v1497_wgs84",
				"tiled" : false,
				"visibility": false
            },{
                "source": "ispraSIC",
                "group" : "ISPRA",
				"title" : "Siti di Interesse Comunitario (SIC)",
				"name"  : "0",
				"tiled" : false,
				"visibility": false
            },{
                "source": "ispraPopRI50",
                "group" : "ISPRA",
				"title" : "Popolazione a rischio idraulico - Tr fino a 50 anni",
				"name"  : "2",
				"tiled" : false,
				"visibility": false
            },{
                "source": "ispraRNMCS",
                "group" : "ISPRA",
				"title" : "Rete Naz. Monitoraggio Consumo Suolo (punti di camp. 2012)",
				"name"  : "0",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Copertura del Suolo: CNR-DGC-TCI",
				"title" : "Touring Land Cover L3",
				"name"  : "it.crisp:touring",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Copertura del Suolo: CORINE",
				"title" : "Livello 1",
				"name"  : "it.crisp:corine_L1",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Copertura del Suolo: CORINE",
				"title" : "Livello 2",
				"name"  : "it.crisp:corine_L2",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Copertura del Suolo: CORINE",
				"title" : "Livello 3",
				"name"  : "it.crisp:corine_L3",
				"tiled" : false,
				"visibility": true
            },{
                "source": "jrc",
                "group" : "Impermeabilizzazione (EC-ESA Copernicus HRL)",
				"title" : "Suolo impermeabilizzato (imperm.>=30%)(20m)",
				"name"  : "it.crisp:urban_grids",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Impermeabilizzazione (EC-ESA Copernicus HRL)",
				"title" : "Suolo impermeabilizzato (imperm.>=30%)(vettoriale, 40m)",
				"name"  : "it.crisp:imperviousness",
				"tiled" : false,
				"visibility": false
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

	"customPanels":[{
          "xtype": "panel",
          "border": false,
          "title": "Risultato dei Processi",
          "id": "outcomelaylistpanel",
          "region": "south",
          "height": 250,
          "maxHeight": 330,
          "layout": "fit",
          "resizable": true,
          "collapsed": false,
          "collapsible": true,
          "header": true,
          "plugins": ["Ext.ux.PanelCollapsedTitle"],
          "collapsedIconCls": "icon-south-panel"
     },{
        "xtype": "tabpanel",
        "border": false,
        "title": "Strumenti",
        "id": "east",
        "region": "east",
        "width": 355,
        "split": true,
        "collapsible": true,
        "collapsed": false,
        "header": true,
        "activeItem": 0,
        "hideMode": "offsets",
        "items": [
            {"xtype": "panel", "id": "legendcontrolpanel", "title": "Legenda", "layout": "fit", "region": "center", "autoScroll": true},
            {"xtype": "panel", "id": "eastcontrolpanel",   "title": "Stumenti", "layout": "fit", "region": "center", "autoScroll": true}
        ],
        "plugins": ["Ext.ux.PanelCollapsedTitle"]
    }],

	"customTools":[{
           "ptype": "gxp_wpsmanager",
           "id": "wpsManager",
           "url": "http://143.225.214.136/geoserver/wps",
           "geostoreUrl": "http://143.225.214.136/geostore/rest",
           "geostoreUser": "admin",
           "geostorePassword": "admin",
           "geostoreProxy": "/http_proxy/proxy?url="
        },{
	        "ptype":"gxp_print",
	        "customParams":{
	            "outputFilename":"mapstore-print",
	            "geodetic": true
	        },
	        "ignoreLayers": "Open Street Map,MapQuest OpenStreetMap,Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
	        "printService":"http://143.225.214.136/geoserver/pdf/",
	        "legendPanelId":"legendPanel",
	        "actionTarget":{
	            "target":"paneltbar",
	            "index":4
	        }
	    },{
            "ptype": "gxp_wfsgrid",
            "addLayerTool": "addlayer",
	        "id": "wfsChangeMatrisGridPanel",
            "wfsURL": "http://143.225.214.136/geoserver/wfs",
            "featureType": "changematrix",
            "featureNS": "http://www.crisp.it",
            "pageSize": 10,
            "autoRefreshInterval": 3000,
            "srsName": "EPSG:32632",
            "version": "1.1.0",
            "outputTarget": "outcomelaylistpanel",
            "actionColumns" : [
                {
                 "type": "details",
                 "layerTitleAttribute" : "ftUUID"
                },
                {
                 "type": "delete",
                 "layerNameAttribute" : "ftUUID",
                 "idAttribute" : "fid"
                }
            ],
            "splitPanels": true,
            "panelsConfig": [{
            	"title": "Cambi Uso del Suolo",
            	"featureType": "changematrix",
        		"featureTypeDetails": "changeMatrix",
	            "columns" : [
	            	{
	                    "header": "Stato",
	                    "dataIndex": "itemStatus",
	                    "sortable": true
	                },{
	                    "header": "JobUID",
	                    "dataIndex": "jobUid",
	                    "sortable": true
	                },{
	                    "header": "CUDA",
	                    "dataIndex": "jcuda",
	                    "sortable": false
	                },{
	                    "header": "Layer di Riferimento",
	                    "dataIndex": "referenceName",
	                    "sortable": true
	                },{
	                    "header": "Data Inizio",
	                    "dataIndex": "runBegin",
	                    "sortable": true
	                },{
	                    "header": "Data Fine",
	                    "dataIndex": "runEnd",
	                    "sortable": true
	                },{
	                    "header": "Filtro (riferimento)",
	                    "dataIndex": "referenceFilter",
	                    "sortable": true
	                },{
	                    "header": "Filtro (corrente)",
	                    "dataIndex": "nowFilter",
	                    "sortable": true
	                }
	            ]
        	},{
            	"title": "Impermeabilizzazione del Suolo: Esecuzioni",
            	"featureType": "soilsealing",
        		"featureTypeDetails": "soilIndex",
	            "columns" : [
	            	{
	                    "header": "Stato",
	                    "dataIndex": "itemStatus",
	                    "sortable": true
	                },{
	                    "header": "JobUID",
	                    "dataIndex": "jobUid",
	                    "sortable": true
	                },{
	                    "header": "CUDA",
	                    "dataIndex": "jcuda",
	                    "sortable": false
	                },{
	                    "header": "Layer di Riferimento",
	                    "dataIndex": "referenceName",
	                    "sortable": true
	                },{
	                    "header": "Indice",
	                    "dataIndex": "index",
	                    "sortable": true
	                },{
	                    "header": "Sotto-Indice",
	                    "dataIndex": "subindex",
	                    "sortable": true
	                },{
	                    "header": "Classi",
	                    "dataIndex": "classes",
	                    "sortable": true
	                },{
	                    "header": "Data Inizio",
	                    "dataIndex": "runBegin",
	                    "sortable": true
	                },{
	                    "header": "Data Fine",
	                    "dataIndex": "runEnd",
	                    "sortable": true
	                },{
	                    "header": "Filtro (riferimento)",
	                    "dataIndex": "referenceFilter",
	                    "sortable": true
	                },{
	                    "header": "Filtro (corrente)",
	                    "dataIndex": "nowFilter",
	                    "sortable": true
	                }
	            ]
            }]
        },{
			"ptype": "gxp_addlayers",
			"actionTarget": "tree.tbar",
			"id": "addlayers",
			"wmsDefaults": {
				"SRS": "EPSG:3857",
				"version": "1.1.1",
			    "layersCachedExtent": [
					-20037508.34,-20037508.34,
					20037508.34,20037508.34
				],
				"layerBaseParams":{
					"FORMAT": "image/png",
					"TILED": true
				}
			}
		},{
            "ptype": "gxp_addlayer",
			"useEvents": true,
			"id": "addlayer"
		},{
            "actions": ["-"],
            "actionTarget": "paneltbar"
        },{
            "ptype": "gxp_legend",
            "outputTarget": "legendcontrolpanel",
            "outputConfig": {
                "autoScroll": true
            },
            "legendConfig" : {
                "legendPanelId" : "legendPanel",
                "defaults": {
                    "style": "padding:5px"
                }
            }
        },{
            "ptype": "gxp_changematrix",
            "id" : "changeMatrixTool",
            "outputTarget": "eastcontrolpanel",
            "wfsChangeMatrisGridPanel": "wfsChangeMatrisGridPanel",
            "requestTimeout": 5000,
       		"wpsManagerID": "wpsManager",
       		"clcLevelsConfig": [{
				"filter": "urban_grids",
				"decorator": "Suolo impermeabilizzato"
			},{
				"filter": "corine_L",
				"decorator": "Copertura del Suolo CORINE Livello {0}"
			},{
				"filter": "touring",
				"decorator": "Copertura del Suolo CNR-DGC-TCI"
			}],
            "geocoderConfig": {
	            "wpsBufferProcessID" : "JTS:buffer",
	            "wfsBaseURL" : "http://143.225.214.136/geoserver/wfs?",
	            "spatialOutputCRS" : "EPSG:4326",
	            "showSelectionSummary" : true,
	            "zoomToCurrentExtent" : false,
	            "defaultStyle" : {
			        "fillColor"   : "#FFFFFF",
			        "strokeColor" : "#FF0000",
			        "fillOpacity" : 0.5,
			        "strokeWidth" : 1
			    },
	            "selectStyle" : {
			        "fillColor"   : "#FFFFFF",
			        "strokeColor" : "#FF0000",
			        "fillOpacity" : 0.5,
			        "strokeWidth" : 1
			    },
				"temporaryStyle" : {
					  "strokeColor": "#ee9900",
					  "fillColor": "#ee9900",
					  "fillOpacity": 0.4,
					  "strokeWidth": 1
				},
				"labelStyle" : {
					"fontColor": "#a52505",
					"fontSize": "18px",
					"fontFamily": "Courier New, monospace",
					"fontWeight": "bold",
					"label": "${label}",
					"labelOutlineColor": "white",
					"labelOutlineWidth": 5
				},
			    "bufferOptions": {
					"minValue": 1,
					"maxValue": 1000000,
					"decimalPrecision": 2,
					"distanceUnits": "m"
				 },
	            "geocoderTypeName" : "it.crisp:geocoder",
	            "geocoderTypeTpl" : "<tpl for=\".\"><hr><div class=\"search-item\"><h3>{name}</span></h3>Parent: {custom}</div></tpl>",
	            "geocoderTypeRecordModel":[
	                    {
	                            "name":"id",
	                            "mapping":"id"
	                    },
	                    {
	                            "name":"name",
	                            "mapping":"properties.name"
	                    },
	                    {
	                            "name":"custom",
	                            "mapping":"properties.parent"
	                    },
	                    {
	                            "name":"geometry",
	                            "mapping":"geometry"
	                    }
	            ],
			 	"geocoderTypeSortBy":"name",
			 	"geocoderTypeQueriableAttributes":[
					"name"
				],
				"geocoderTypeDisplayField":"name",
				"geocoderTypePageSize" : 10,
	            "wpsChgMatrixProcessName" : "gs:ChangeMatrix",
	            "wpsUnionProcessID" : "JTS:union",
				"source": "jrc",
				"nsPrefix": "it.crisp",
	            "storeName" : "unina_ds",
	            "typeName" : "changematrix",
	            "jiffleStyle" : "jiffle_style"
            },
			"classesIndexes" : [
			  [1,[
                                [1, "Corpi idrici", "#68F0E1"],
				[2, "Territori agricoli", "#F1D148"],
				[3, "Territori boscati e ambienti semi naturali", "#8FD65D"],
				[4, "Territori modellati artificialmente", "#DF5D9D"],
				[5, "Zone umide", "#A9A9FA"]
			  ]],
			  [2,[
                                [1, "Acque continentali", "#3FDFEC"],
				[2, "Acque marittime", "#84FBD9"],
				[3, "Colture permanenti", "#EA9919"],
				[4, "Prati stabili", "#E6E64C"],
				[5, "Seminativi", "#F7F737"],
				[6, "Zone agricole eterogenee", "#F6D979"],
				[7, "Zone aperte con vegetazione rada o assente", "#A1B8A8"],
				[8, "Zone boscate", "#43E100"],
				[9, "Zone caratterizzate da vegetazione arbustiva e/o erbacea", "#B0F246"],
				[10, "Zone estrattive, discariche e cantieri", "#C43299"],
				[11, "Zone industriali, commerciali e reti di comunicazione", "#D978A9"],
				[12, "Zone umide interne", "#7979FF"],
				[13, "Zone umide marittime", "#C8C8F7"],
				[14, "Zone urbanizzate", "#F30026"],
				[15, "Zone verdi artificiali non agricol", "#FFC6FF"]
			  ]],
			  [3,[
                                [1, "Aeroporti", "#E6CCE6"],
				[2, "Aree a pascolo naturale e praterie d'alta quota", "#CCF24C"],
				[3, "Aree a vegetazione boschiva e arbustiva in evoluzione", "#A6F200"],
				[4, "Aree a vegetazione sclerofilia", "#A6E64C"],
				[5, "Aree agroforestali", "#F2CCA6"],
				[6, "Aree con vegetazione rada", "#CCFFCC"],
				[7, "Aree estrattive", "#A600CC"],
				[8, "Aree industriali o commerciali", "#CC4CF2"],
				[9, "Aree percorse da incendi", "#000000"],
				[10, "Aree portuali", "#E6CCCC"],
				[11, "Aree prev. occup.da colture agrarie, con spazi nat.", "#E6CC4C"],
				[12, "Aree sportive e ricreative", "#FFE6FF"],
				[13, "Aree verdi urbane", "#FFA6FF"],
				[14, "Bacini d'acqua", "#80F2E6"],
				[15, "Boschi di conifere", "#00A600"],
				[16, "Boschi di latifoglie", "#80FF00"],
				[17, "Boschi misti", "#4CFF00"],
				[18, "Brughiere e cespuglieti", "#A6FF80"],
				[19, "Cantieri", "#FF4CFF"],
				[20, "Colture annuali associate e colture permanenti", "#FFE6A6"],
				[21, "Corsi d'acqua, canali e idrovie", "#00CCF2"],
				[22, "Discariche", "#A64C00"],
				[23, "Estuari", "#A6FFE6"],
				[24, "Frutteti e frutti minori", "#F2A64C"],
				[25, "Ghiacciai e nevi perenni", "#A6E6CC"],
				[26, "Lagune", "#00FFA6"],
				[27, "Mari ed oceani", "#E6F2FF"],
				[28, "Paludi interne", "#A6A6FF"],
				[29, "Paludi salmastre", "#CCCCFF"],
				[30, "Prati stabili", "#E6E64C"],
				[31, "Reti stradali e ferroviarie e spazi accessori", "#CC0000"],
				[32, "Risaie", "#E6E600"],
				[33, "Rocce nude, falesie, rupi, affioramenti", "#CCCCCC"],
				[34, "Saline", "#E6E6FF"],
				[35, "Seminativi in aree irigue", "#FFFF00"],
				[36, "Seminitavi in aree non irrigue", "#FFFFA8"],
				[37, "Sistemi colturali e particellari permanenti", "#FFE64C"],
				[38, "Spiagge, dune, sabbie", "#E6E6E6"],
				[39, "Tessuto urbano continuo", "#E6004C"],
				[40, "Tessuto urbano discontinuo", "#FF0000"],
				[41, "Torbiere", "#4C4CFF"],
				[42, "Uliveti", "#E6A600"],
				[43, "Vigneti", "#E68000"]
			 ]],
			 [4,[
                                [1, "Aree a pascolo naturale e praterie d'alta quota", "#CCF24C"],
				[2, "Aree con vegetazione rada", "#CCFFCC"],
				[3, "Territori modellati artificialmente", "#DF5D9D"],
				[4, "Territori boscati", "#F2CCA6"],
				[5, "Corpi idrici", "#80F2E6"],
				[6, "Frutteti e frutti minori", "#F2A64C"],
				[7, "Oliveti", "#E6A600"],
				[8, "Prati stabili", "#E6E64C"],
				[9, "Risaie", "#E6E600"],
				[10, "Seminitavi in aree non irrigue", "#FFFFA8"],
				[11, "Seminativi in aree irigue", "#FFFF00"],
				[12, "Sistemi colturali e particellari permanenti", "#FFE64C"],
				[13, "Vigneti", "#E68000"]
			  ]]
			],
            "classes": [
            	{"layer": "it.crisp:corine_L1", "level": 1, "values": [1,2,3,4,5]},
            	{"layer": "it.crisp:corine_L2", "level": 2, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},
            	{"layer": "it.crisp:corine_L3", "level": 3, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]},
            	{"layer": "it.crisp:touring", "level": 4, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13]}
            ],
            "layersPixelSizes": [
            	{"layer": "it.crisp:touring",     "pixelSize": 100},
            	{"layer": "it.crisp:corine_L1",   "pixelSize": 100},
            	{"layer": "it.crisp:corine_L2",   "pixelSize": 100},
            	{"layer": "it.crisp:corine_L3",   "pixelSize": 100},
            	{"layer": "it.crisp:urban_grids", "pixelSize": 20}
            ],
            "splitPanels": true,
            "wfsChangeMatrisGridPanelID": "wfsChangeMatrisGridPanel_tabpanel",
            "panelsConfig": [
               {
            	"title": "Cambi di Uso del Suolo",
            	 "clcLevelMode": "combobox",
            	 "geocoderConfig": {
            		"selectReturnType": false,
            		"targetResultGridId": "wfsChangeMatrisGridPanel_tab_0"
            	 },
            	 "xtype": "gxp_changematrixpanel"
        	   },{
            	"title": "Consumo di Suolo",
            	 "geocoderConfig": {
            		"selectReturnType": true,
            		"wpsProcessName": "gs:SoilSealingCLC",
            		"storeName": "unina_ds",
            		"typeName": "soilsealing",
            		"geocoderLayer": "geocoder",
            		"geocoderPopulationLayer": "geocoder_population",
            		"waterBodiesMaskLayer": "ispra_clc12_5_wbodies_mask",
            		"defaultProcessStyle": "raster",
            		"styleSelection": {
            			"3": "sprawl",
            			"4": "sprawl",
            			"8": "frag",
            			"9": "landtake",
            			"12": "frag",
            			"13": "frag"
            		},
            		"imperviousnessProccessName": "gs:SoilSealingImperviousness",
            		"imperviousnessLayer": "imperviousness",
            		"targetResultGridId": "wfsChangeMatrisGridPanel_tab_1"
            	 },
            	 "xtype": "gxp_soilpanel"
               }]
          },{
        	"ptype": "gxp_georeferences",
        	"actionTarget": "paneltbar"
        },{
        	"ptype": "gxp_wfsresume",
        	"id": "gxp_wfsresume",
        	"url": "http://143.225.214.136/geoserver/wms?"
        },{
            "actions": ["->"],
            "actionTarget": "paneltbar"
        }
	]
}
