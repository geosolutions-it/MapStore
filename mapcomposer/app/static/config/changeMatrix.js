{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/proxy/?url=",
   "defaultLanguage": "en",
   "tab": true,
   "gsSources":{ 
   		"jrc": {
			"ptype": "gxp_wmssource",
			"title": "JRC GeoServer",
			"url": "http://localhost:8180/geoserver/ows"
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
				"title": "Open Street Map",
				"name": "mapnik",
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
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},{
                "source": "jrc",
				"title": "Corine Land Cover (unina)",
				"name": "it.geosolutions:unina_",
				"tiled" : false
            },{
                "source": "jrc",
				"title": "Touring Land Cover (unina2)",
				"name": "it.geosolutions:unina",
				"tiled" : false
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
          "title": "Change Matrix Runs",
          "id": "outcomelaylistpanel",
          "region": "south",
          "height": 250,
          "maxHeight": 330,
          "layout": "fit",
          "resizable": true,
          "collapsed": false,
          "collapsible": true,
          "collapseMode": "mini",
          "header": true
     }],
    
	"customTools":[{
           "ptype": "gxp_wpsmanager",
           "id": "wpsManager",
           "url": "http://localhost:8180/geoserver/wps",
           "geostoreUrl": "http://localhost:8080/geostore/rest",
           "geostoreUser": "admin",
           "geostorePassword": "admin",
           "geostoreProxy": "/proxy?url="
        },{
            "ptype": "gxp_wfsgrid",
            "addLayerTool": "addlayer",
	        "id": "wfsChangeMatrisGridPanel",
            "wfsURL": "http://localhost:8180/geoserver/wfs",
            "featureType": "changematrix",
            "featureNS": "http://www.geo-solutions.it", 
            "pageSize": 50,
            "autoRefreshInterval": 3000,
            "srsName": "EPSG:32632", 
            "version": "1.1.0",
            "outputTarget": "outcomelaylistpanel",
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
            ],
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
            ]
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
            "wpsManagerID": "wpsManager",
            "storeName" : "unina_ds",
            "typeName" : "changematrix",
            "jiffleStyle" : "jiffle_style",
            "showSelectionSummary" : "true",
            "defaultStyle" : {
			  "strokeColor": "#ee9900",
			  "fillColor"  : "#ee9900",
			  "fillOpacity": 0.4,
			  "strokeWidth": 1
			},
            "selectStyle" : {
		        "fillColor"   : "#FFFFFF",
		        "strokeColor" : "#FF0000",
		        "fillOpacity" : 0.5,
		        "strokeWidth" : 1
		    },
			"temporaryStyle" : {
		        "fillColor"   : "#FFFFFF",
		        "strokeColor" : "#FF0000",
		        "fillOpacity" : 0.5,
		        "strokeWidth" : 1
		    },
			"classesIndexes" : [
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
			],
            "classes": [
            	{"layer": "it.geosolutions:unina",  "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]},
            	{"layer": "it.geosolutions:unina_", "values": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]}
            ]
        },{
        	"ptype": "gxp_georeferences",
        	"actionTarget": "paneltbar"
        },{
            "actions": ["->"],
            "actionTarget": "paneltbar"
        }
	]
}
