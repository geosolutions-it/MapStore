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
                "source": "mibactSITAP",
                "group" : "MiBACT - SIT Ambientale e Paesaggistico",
				"title" : "Vincoli D.Lgs.42/2004 artt.136 e 157 -",
				"name"  : "v1497_wgs84",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "CNR-DGC-TCI Land Cover",
				"title" : "Touring Land Cover L3",
				"name"  : "it.crisp:touring",
				"tiled" : false,
				"visibility": true
            },{
                "source": "jrc",
                "group" : "CORINE Land Cover",
				"title" : "Corina Land Cover L1",
				"name"  : "it.crisp:corine_L1",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "CORINE Land Cover",
				"title" : "Corina Land Cover L2",
				"name"  : "it.crisp:corine_L2",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "CORINE Land Cover",
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
          "header": true,
          "plugins": ["Ext.ux.PanelCollapsedTitle"],
          "collapsedIconCls": "icon-south-panel"
     },{
        "xtype": "tabpanel",
        "border": false,
        "title": "Toolbox",
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
           "geostoreProxy": "/proxy?url="
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
            	"title": "Land Cover Change Runs",
            	"featureType": "changematrix",
        		"featureTypeDetails": "changeMatrix",
	            "columns" : [
	            	{
	                    "header": "Status",
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
	                    "header": "JobUID",
	                    "dataIndex": "jobUid",
	                    "sortable": true
	                },{
	                    "header": "CUDA",
	                    "dataIndex": "jcuda",
	                    "sortable": false
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
				[1, "Water bodies", "#68F0E1"],
				[2, "Agricultural areas", "#F1D148"],
				[3, "Forest and semi natural areas", "#8FD65D"],
				[4, "Artificial surfaces", "#DF5D9D"],
				[5, "Wetlands", "#A9A9FA"]
			  ]],
			  [2,[
				[1, "Inland waters", "#3FDFEC"],
				[2, "Marine waters", "#84FBD9"],
				[3, "Permanent crops", "#EA9919"],
				[4, "Pastures", "#E6E64C"],
				[5, "Arable land", "#F7F737"],
				[6, "Heterogeneous agricultural areas", "#F6D979"],
				[7, "Open spaces with little or no vegetation", "#A1B8A8"],
				[8, "Forests", "#43E100"],
				[9, "Scrub and/or herbaceous vegetation associations", "#B0F246"],
				[10, "Mine dump and construction sites", "#C43299"],
				[11, "Industrial commercial and transport units", "#D978A9"],
				[12, "Inland wetlands", "#7979FF"],
				[13, "Maritime wetlands", "#C8C8F7"],
				[14, "Urban fabric", "#F30026"],
				[15, "Artificial non-agricultural vegetated areas", "#FFC6FF"]
			  ]],
			  [3,[
				[1, "Airports", "#E6CCE6"],
				[2, "Natural grasslands", "#CCF24C"],
				[3, "Transitional woodland-shrub", "#A6F200"],
				[4, "Sclerophyllous vegetation", "#A6E64C"],
				[5, "Agro-forestry areas", "#F2CCA6"],
				[6, "Sparsely vegetated areas", "#CCFFCC"],
				[7, "Mineral extraction sites", "#A600CC"],
				[8, "Industrial or commercial units", "#CC4CF2"],
				[9, "Burnt areas", "#000000"],
				[10, "Port areas", "#E6CCCC"],
				[11, "Land principally occupied by agriculture, with significant areas of natural vegetation", "#E6CC4C"],
				[12, "Sport and leisure facilities", "#FFE6FF"],
				[13, "Green urban areas", "#FFA6FF"],
				[14, "Water bodies", "#80F2E6"],
				[15, "Coniferous forest", "#00A600"],
				[16, "Broad-leaved forest", "#80FF00"],
				[17, "Mixed forest", "#4CFF00"],
				[18, "Moors and heathland", "#A6FF80"],
				[19, "Construction sites", "#FF4CFF"],
				[20, "Annual crops associated with permanent crops", "#FFE6A6"],
				[21, "Water courses", "#00CCF2"],
				[22, "Dump sites", "#A64C00"],
				[23, "Estuaries", "#A6FFE6"],
				[24, "Fruit trees and berry plantations", "#F2A64C"],
				[25, "Glaciers and perpetual snow", "#A6E6CC"],
				[26, "Coastal lagoons", "#00FFA6"],
				[27, "Sea and ocean", "#E6F2FF"],
				[28, "Inland marshes", "#A6A6FF"],
				[29, "Salt marshes", "#CCCCFF"],
				[30, "Pastures", "#E6E64C"],
				[31, "Road and rail networks and associated land", "#CC0000"],
				[32, "Rice fields", "#E6E600"],
				[33, "Bare rocks", "#CCCCCC"],
				[34, "Salines", "#E6E6FF"],
				[35, "Permanently irrigated land", "#FFFF00"],
				[36, "Non-irrigated arable land", "#FFFFA8"],
				[37, "Complex cultivation patterns", "#FFE64C"],
				[38, "Beaches, dunes, sands", "#E6E6E6"],
				[39, "Continuous urban fabric", "#E6004C"],
				[40, "Discontinuous urban fabric", "#FF0000"],
				[41, "Peat bogs", "#4C4CFF"],
				[42, "Olive groves", "#E6A600"],
				[43, "Vineyards", "#E68000"]
			 ]],
			 [4,[
				[1, "Natural grasslands", "#CCF24C"],
				[2, "Sparsely vegetated areas", "#CCFFCC"],
				[3, "Artificial surfaces", "#DF5D9D"],
				[4, "Forests", "#F2CCA6"],
				[5, "Water bodies", "#80F2E6"],
				[6, "Fruit trees and berry plantations", "#F2A64C"],
				[7, "Olive groves", "#E6A600"],
				[8, "Pastures", "#E6E64C"],
				[9, "Rice fields", "#E6E600"],
				[10, "Non-irrigated arable land", "#FFFFA8"],
				[11, "Permanently irrigated land", "#FFFF00"],
				[12, "Complex cultivation patterns", "#FFE64C"],
				[13, "Vineyards", "#E68000"]
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
            			"8": "frag",
            			"9": "landtake",
            			"12": "frag"
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
