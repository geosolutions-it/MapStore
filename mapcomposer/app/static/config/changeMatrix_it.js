{
   "geoStoreBase":"http://143.225.214.136/geostore/rest/",
   "proxy":"/proxy/?url=",
   "defaultLanguage": "en",
   "tab": true,
   "portalConfig":{
		"header":true
   },
   "gsSources":{ 
   		"jrc": {
			"ptype": "gxp_wmssource",
			"title": "JRC GeoServer",
			"url": "http://143.225.214.136/geoserver/ows"
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
		"ol": { 
			"ptype": "gxp_olsource" 
		}
	},
	"map": {
		"projection": "EPSG:900913",
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
                "source": "jrc",
                "group" : "Touring Land Cover",
				"title" : "Touring Land Cover L3",
				"name"  : "it.crisp:touring",
				"tiled" : false,
				"visibility": true
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L1",
				"name"  : "it.crisp:corine_L1",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L2",
				"name"  : "it.crisp:corine_L2",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L3",
				"name"  : "it.crisp:corine_L3",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Urban Grids",
				"title" : "Urban Grids",
				"name"  : "it.crisp:urban_grids",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Urban Grids",
				"title" : "Imperviousness",
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
          "title": "Processes Workspace",
          "id": "outcomelaylistpanel",
          "region": "south",
          "height": 250,
          "maxHeight": 330,
          "layout": "fit",
          "resizable": true,
          "collapsed": false,
          "collapsible": true,
          "header": true
     },{
        "xtype": "tabpanel",
        "border": false,
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
            {"xtype": "panel", "id": "legendcontrolpanel", "title": "Legend", "layout": "fit", "region": "center", "autoScroll": true},
            {"xtype": "panel", "id": "eastcontrolpanel",   "title": "Toolbox", "layout": "fit", "region": "center", "autoScroll": true}
        ]
    }],
    
	"customTools":[{
           "ptype": "gxp_wpsmanager",
           "id": "wpsManager",
           "url": "http://143.225.214.136/geoserver/wps",
           "geostoreUrl": "http://143.225.214.136/geostore/rest",
           "geostoreUser": "admin",
           "geostorePassword": "admin",
           "geostoreProxy": "/proxy?url="
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
            	"title": "Land Cover Change Runs",
            	"featureType": "changematrix",
        		"featureTypeDetails": "changeMatrix",
	            "columns" : [
	            	{
	                    "header": "Status", 
	                    "dataIndex": "itemStatus",
	                    "sortable": true
	                },{
	                    "header": "Reference Name", 
	                    "dataIndex": "referenceName",
	                    "sortable": true
	                },{
	                    "header": "Start Date", 
	                    "dataIndex": "runBegin",
	                    "sortable": true
	                },{
	                    "header": "End Date", 
	                    "dataIndex": "runEnd",
	                    "sortable": true
	                },{
	                    "header": "Filter (reference)", 
	                    "dataIndex": "referenceFilter",
	                    "sortable": true
	                },{
	                    "header": "Filter (current)", 
	                    "dataIndex": "nowFilter",
	                    "sortable": true
	                }
	            ]
        	},{
            	"title": "Soil Sealing Runs",
            	"featureType": "soilsealing",
        		"featureTypeDetails": "soilIndex",
	            "columns" : [
	            	{
	                    "header": "Status", 
	                    "dataIndex": "itemStatus",
	                    "sortable": true
	                },{
	                    "header": "Reference Name", 
	                    "dataIndex": "referenceName",
	                    "sortable": true
	                },{
	                    "header": "Index", 
	                    "dataIndex": "index",
	                    "sortable": true
	                },{
	                    "header": "SubIndex", 
	                    "dataIndex": "subindex",
	                    "sortable": true
	                },{
	                    "header": "Classes", 
	                    "dataIndex": "classes",
	                    "sortable": true
	                },{
	                    "header": "Start Date", 
	                    "dataIndex": "runBegin",
	                    "sortable": true
	                },{
	                    "header": "End Date", 
	                    "dataIndex": "runEnd",
	                    "sortable": true
	                },{
	                    "header": "Filter (reference)", 
	                    "dataIndex": "referenceFilter",
	                    "sortable": true
	                },{
	                    "header": "Filter (current)", 
	                    "dataIndex": "nowFilter",
	                    "sortable": true
	                }
	            ]
            }]
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
                    "style": "padding:5px",                  
                    "baseParams": {
                        "LEGEND_OPTIONS": "forceLabels:on;fontSize:10",
                        "WIDTH": 20, 
                        "HEIGHT": 20
                    }
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
				"decorator": "Urban Grids"
			},{
				"filter": "corine_L",
				"decorator": "Corine Land Cover Level {0}"
			},{
				"filter": "touring",
				"decorator": "Touring Land Cover"
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
				[1, "Corpi idrici"],
				[2, "Territori agricoli"],
				[3, "Territori boscati e ambienti semi naturali"],
				[4, "Territori modellati artificialmente"],
				[5, "Zone umide"]
			  ]],
			  [2,[
				[1, "Acque continentali"],
				[2, "Acque marittime"],
				[3, "Colture permanenti"],
				[4, "Prati stabili"],
				[5, "Seminativi"],
				[6, "Zone agricole eterogenee"],
				[7, "Zone aperte con vegetazione rada o assente"],
				[8, "Zone boscate"],
				[9, "Zone caratterizzate da vegetazione arbustiva e/o erbacea"],
				[10, "Zone estrattive, discariche e cantieri"],
				[11, "Zone industriali, commerciali e reti di comunicazione"],
				[12, "Zone umide interne"],
				[13, "Zone umide marittime"],
				[14, "Zone urbanizzate"],
				[15, "Zone verdi artificiali non agricol"]
			  ]],
			  [3,[
				[1, "Aeroporti"],
				[2, "Aree a pascolo naturale e praterie d'alta quota"],
				[3, "Aree a vegetazione boschiva e arbustiva in evoluzione"],
				[4, "Aree a vegetazione sclerofilia"],
				[5, "Aree agroforestali"],
				[6, "Aree con vegetazione rada"],
				[7, "Aree estrattive"],
				[8, "Aree industriali o commerciali"],
				[9, "Aree percorse da incendi"],
				[10, "Aree portuali"],
				[11, "Aree prev. occup.da colture agrarie, con spazi nat."],
				[12, "Aree sportive e ricreative"],
				[13, "Aree verdi urbane"],
				[14, "Bacini d'acqua"],
				[15, "Boschi di conifere"],
				[16, "Boschi di latifoglie"],
				[17, "Boschi misti"],
				[18, "Brughiere e cespuglieti"],
				[19, "Cantieri"],
				[20, "Colture annuali associate e colture permanenti"],
				[21, "Corsi d'acqua, canali e idrovie"],
				[22, "Discariche"],
				[23, "Estuari"],
				[24, "Frutteti e frutti minori"],
				[25, "Ghiacciai e nevi perenni"],
				[26, "Lagune"],
				[27, "Mari ed oceani"],
				[28, "Paludi interne"],
				[29, "Paludi salmastre"],
				[30, "Prati stabili"],
				[31, "Reti stradali e ferroviarie e spazi accessori"],
				[32, "Risaie"],
				[33, "Rocce nude, falesie, rupi, affioramenti"],
				[34, "Saline"],
				[35, "Seminativi in aree irigue"],
				[36, "Seminitavi in aree non irrigue"],
				[37, "Sistemi colturali e particellari permanenti"],
				[38, "Spiagge, dune, sabbie"],
				[39, "Tessuto urbano continuo"],
				[40, "Tessuto urbano discontinuo"],
				[41, "Torbiere"],
				[42, "Uliveti"],
				[43, "Vigneti"]
			 ]],
			 [4,[
				[1, "Aree a pascolo naturale e praterie d'alta quota"],
				[2, "Aree con vegetazione rada"],
				[3, "Territori modellati artificialmente"],
				[4, "Territori boscati"],
				[5, "Corpi idrici"],
				[6, "Frutteti e frutti minori"],
				[7, "Oliveti"],
				[8, "Prati stabili"],
				[9, "Risaie"],
				[10, "Seminitavi in aree non irrigue"],
				[11, "Seminativi in aree irigue"],
				[12, "Sistemi colturali e particellari permanenti"],
				[13, "Vigneti"]
			  ]]
			],
            "classes": [
            	{"layer": "it.crisp:corine_L1", "level": 1, "values": [1,2,3,4,5]},
            	{"layer": "it.crisp:corine_L2", "level": 2, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},
            	{"layer": "it.crisp:corine_L3", "level": 3, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]},
            	{"layer": "it.crisp:touring", "level": 4, "values": [0,1,2,3,4,5,6,7,8,9,10,11,12,13]}
            ],
            "layersPixelSizes": [
            	{"layer": "it.crisp:touring",     "pixelSize": 400},
            	{"layer": "it.crisp:corine_L1",   "pixelSize": 400},
            	{"layer": "it.crisp:corine_L2",   "pixelSize": 400},
            	{"layer": "it.crisp:corine_L3",   "pixelSize": 400},
            	{"layer": "it.crisp:urban_grids", "pixelSize": 400}
            ],
            "splitPanels": true,
            "wfsChangeMatrisGridPanelID": "wfsChangeMatrisGridPanel_tabpanel",
            "panelsConfig": [{
            	"title": "Land Cover",
            	"clcLevelMode": "combobox",
            	"geocoderConfig": {
            		"selectReturnType": false,
            		"targetResultGridId": "wfsChangeMatrisGridPanel_tab_0"
            	},
            	"xtype": "gxp_changematrixpanel"
        	},{
            	"title": "Soil Sealing",
            	"geocoderConfig": {
            		"selectReturnType": true,
            		"wpsProcessName": "gs:SoilSealingCLC",
            		"storeName": "unina_ds",
            		"typeName": "soilsealing",
            		"geocoderLayer": "geocoder",
            		"geocoderPopulationLayer": "geocoder_population",
            		"defaultProcessStyle": "raster",
            		"styleSelection": {
            			"3": "sprawl",
            			"4": "sprawl",
						"8": "frag"
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
