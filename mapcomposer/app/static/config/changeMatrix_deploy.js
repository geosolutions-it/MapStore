{
   "geoStoreBase":"http://143.225.214.136/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
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
				"source": "bing",
				"title" : "Bing Aerial",
				"name"  : "Aerial",
				"group" : "background"
			},{
				"source": "mapquest",
				"title" : "MapQuest OpenStreetMap",
				"name"  : "osm",
				"group" : "background"
			},{
                "source": "jrc",
                "group" : "Touring Land Cover",
				"title" : "Touring Land Cover (unina2)",
				"name"  : "it.geosolutions:touring",
				"tiled" : false,
				"visibility": true
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L1",
				"name"  : "it.geosolutions:corine_L1",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L2",
				"name"  : "it.geosolutions:corine_L2",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Corine Land Cover",
				"title" : "Corina Land Cover L3",
				"name"  : "it.geosolutions:corine_L3",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Urban Grids",
				"title" : "Urban Grids",
				"name"  : "it.geosolutions:urban_grids",
				"tiled" : false,
				"visibility": false
            },{
                "source": "jrc",
                "group" : "Urban Grids",
				"title" : "Imperviousness",
				"name"  : "it.geosolutions:imperviousness",
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
            "ptype": "gxp_wfsgrid",
            "addLayerTool": "addlayer",
	        "id": "wfsChangeMatrisGridPanel",
            "wfsURL": "http://143.225.214.136/geoserver/wfs",
            "featureType": "changematrix",
            "featureNS": "http://www.geo-solutions.it", 
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
            	"title": "Land Cover Runs",
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
            "ptype": "gxp_changematrix",
            "id" : "changeMatrixTool",
            "outputTarget": "eastcontrolpanel",
            "wfsChangeMatrisGridPanel": "wfsChangeMatrisGridPanel",
            "requestTimeout": 5000,
       		"wpsManagerID": "wpsManager",
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
	            "geocoderTypeName" : "it.geosolutions:geocoder",
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
				"nsPrefix": "it.geosolutions",
	            "storeName" : "unina_ds",
	            "typeName" : "changematrix",
	            "jiffleStyle" : "jiffle_style"
            },
			"classesIndexes" : [
			  [1,[
				[1, "Water bodies"],
				[2, "Agricultural areas"],
				[3, "Forest and semi natural areas"],
				[4, "Artificial surfaces"],
				[5, "Wetlands"]
			  ]],
			  [2,[
				[1, "Inland waters"],
				[2, "Marine waters"],
				[3, "Permanent crops"],
				[4, "Pastures"],
				[5, "Arable land"],
				[6, "Heterogeneous agricultural areas"],
				[7, "Open spaces with little or no vegetation"],
				[8, "Forests"],
				[9, "Scrub and/or herbaceous vegetation associations"],
				[10, "Mine dump and construction sites"],
				[11, "Industrial commercial and transport units"],
				[12, "Inland wetlands"],
				[13, "Maritime wetlands"],
				[14, "Urban fabric"],
				[15, "Artificial non-agricultural vegetated areas"]
			  ]],
			  [3,[
				[1, "Airports"],
				[2, "Natural grasslands"],
				[3, "Transitional woodland-shrub"],
				[4, "Sclerophyllous vegetation"],
				[5, "Agro-forestry areas"],
				[6, "Sparsely vegetated areas"],
				[7, "Mineral extraction sites"],
				[8, "Industrial or commercial units"],
				[9, "Burnt areas"],
				[10, "Port areas"],
				[11, "Land principally occupied by agriculture, with significant areas of natural vegetation"],
				[12, "Sport and leisure facilities"],
				[13, "Green urban areas"],
				[14, "Water bodies"],
				[15, "Coniferous forest"],
				[16, "Broad-leaved forest"],
				[17, "Mixed forest"],
				[18, "Moors and heathland"],
				[19, "Construction sites"],
				[20, "Annual crops associated with permanent crops"],
				[21, "Water courses"],
				[22, "Dump sites"],
				[23, "Estuaries"],
				[24, "Fruit trees and berry plantations"],
				[25, "Glaciers and perpetual snow"],
				[26, "Coastal lagoons"],
				[27, "Sea and ocean"],
				[28, "Inland marshes"],
				[29, "Salt marshes"],
				[30, "Pastures"],
				[31, "Road and rail networks and associated land"],
				[32, "Rice fields"],
				[33, "Bare rocks"],
				[34, "Salines"],
				[35, "Permanently irrigated land"],
				[36, "Non-irrigated arable land"],
				[37, "Complex cultivation patterns"],
				[38, "Beaches, dunes, sands"],
				[39, "Continuous urban fabric"],
				[40, "Discontinuous urban fabric"],
				[41, "Peat bogs"],
				[42, "Olive groves"],
				[43, "Vineyards"]
			 ]]
			],
            "classes": [
            	{"layer": "it.geosolutions:corine_L1",  "level": 1, "values": [1,2,3,4,5]},
            	{"layer": "it.geosolutions:corine_L2", "level": 2, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},
            	{"layer": "it.geosolutions:corine_L3", "level": 3, "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]}
            ],
            "splitPanels": true,
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
            			"4": "sprawl"
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
