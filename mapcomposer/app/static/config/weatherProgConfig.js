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
			}
		]
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
            	"title": "Weather Prog Runs",
            	"featureType": "weatherstats",
        		"featureTypeDetails": "stats",
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
	                    "header": "Process Start", 
	                    "dataIndex": "runBegin",
	                    "sortable": true
	                },{
	                    "header": "Process End", 
	                    "dataIndex": "runEnd",
	                    "sortable": true
	                },{
	                    "header": "Selection Begin", 
	                    "dataIndex": "startTime",
	                    "sortable": true
	                },{
	                    "header": "Selection End", 
	                    "dataIndex": "endTime",
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
            "splitPanels": true,
            "wfsChangeMatrisGridPanelID": "wfsChangeMatrisGridPanel_tabpanel",
            "panelsConfig": [{
            	"title": "Weather Prog",
            	"geocoderConfig": {
            		"selectReturnType": true,
            		"wpsProcessName": "gs:WeatherStatistics",
            		"storeName": "unina_ds",                  
            		"typeName": "weatherstats",
            		"geocoderLayer": "geocoder",
            		"geocoderPopulationLayer": "geocoder_population",                    
            		"defaultProcessStyle": "raster",
            		"targetResultGridId": "wfsChangeMatrisGridPanel_tab_0"
            	},
            	"xtype": "gxp_weatherprogpanel"
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
