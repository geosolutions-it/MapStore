{
   "scaleOverlayMode": "none",
   "gsSources":{  
   		"comunege": {
			"ptype": "gxp_wmssource",
			"title": "Comune Genova",
			"url": "http://vm-sitgeofe1.comune.genova.it/geoserver/ows",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layerBaseParams":{
				"FORMAT": "image/png8",
				"TILED": true,
			   "TILESORIGIN": "-20037508.34, -20037508.34"
			},
            "authParam":"authkey"
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
        "numZoomLevels": 21,
		"extent": [
			962337.0596294437, 5523110.328076044, 1014934.9764326633, 5547342.6306190565
		],
		"restrictedExtent": [
			962337.0596294437, 5523110.328076044, 1014934.9764326633, 5547342.6306190565
		],
		"layers": [
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
			},
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background",
				"visibility": true
			}, {
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background",
				"visibility": true
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background",
				"visibility": false
			}
		]
	},
    "customPanels":[
        {
            "xtype": "tabpanel",
            "title": "Data Viewer",
            "border": false,
            "id": "south",
            "collapsedonfull": true,
            "region": "south",
            "split":true,
            "height": 330,
            "collapsed": true,
            "collapsible": true,
            "activeItem": 0,
            "header": true,
            "hideMode": "offsets",
            "items": [
				{
					"xtype": "container",
					"title": "Griglia Risultati",
					"border": false,
					"layout": "fit",
					"id": "featuregrid"
				},{
					"xtype": "container",
					"title": "Metadati",
					"iconCls": "csw-viewer",             
					"border": false,
					"layout": "fit",
					"id": "metadata"
				}
            ]
        },
        {
              "xtype": "panel",
              "title": "Pannello Ricerche",        
              "border": false,
              "id": "east",
              "width": 400,
              "height": 500,
              "region": "east",
              "layout": "fit",
              "collapsed": true,
              "split": true,
              "collapsible": true,
              "header": true,
              "collapsedonfull": true
        }
        
    ],
    "removeTools": ["googleearth_plugin", "googleearth_separator", "zoombox_plugin", "navigationhistory_plugin", "navigationhistory_separator", "gxp_wmsgetfeatureinfo_menu"],
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[
		{
			"ptype": "gxp_wmsgetfeatureinfo_menu", 
			"regex": "[\\s\\S]*[\\w]+[\\s\\S]*",
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 20}
		},
        {
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, 
		{
            "ptype": "gxp_featuremanager",
            "id": "featuremanager",
            "paging": true,
			"pagingType": 1,
            "autoLoadFeatures": false
        }, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
            "ptype": "gxp_featureeditor",
            "featureManager": "featuremanager",
			"toggleGroup": "toolGroup",
            "autoLoadFeatures": false,
            "actionTarget":{
                "target":"paneltbar",
                "index":24
            },
			"snappingAgent": "snapping-agent"
        }, {
			"ptype": "gxp_advancedsnappingagent",
			"id": "snapping-agent",
			"actionTarget":{
                "target":"paneltbar",
                "index":16
            }
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
            "ptype": "gxp_synchlayerenable",
            "id": "synchlayerenable_plugin",
            "actionTarget": ["layertree.contextMenu"]
        }, {	 
            "ptype": "gxp_synchronizer",
            "id": "synchronizer_plugin",
            "refreshTimeInterval": 5,
            "minRefreshTimeInterval": 3,
            "actionTarget": {"target": "paneltbar", "index": 17},
            "range": ["2014-09-24T06:00:00.000Z","2014-09-26T08:00:00.000Z"]
        }, {
            "ptype": "gxp_featuregrid",
            "featureManager": "featuremanager",
        	"layout": "form",
            "outputConfig": {
            	"height": 240,
                "loadMask": true
            },
            "outputTarget": "featuregrid",
			"exportFormats": ["CSV","shape-zip","excel", "excel2007"],
			"exportAction": "window",
			"showNumberOfRecords": true
        },
		{
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		},{
			"ptype": "gxp_metadataexplorer",
			"id": "metadataexplorer",
            "outputTarget": "metadata",
			"saveState": true,
            "cswconfig": {
                "catalogs": [
                        {"name": "Comune di Genova", "url": "http://vm-sitgeofe1.comune.genova.it/geonetwork/srv/ita/csw", "description": "GeoPortale del Comune di Genova"}
                    ],
                "dcProperty": "title",
                "initialBBox": {
                    "minx": 11.145,
                    "miny": 43.718,
                    "maxx": 11.348,
                    "maxy": 43.84
                },
                "cswVersion": "2.0.2",
                "filterVersion": "1.1.0",
                "start": 1,
                "limit": 10,
                "timeout": 60000
            }            
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 25,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
        },{
			"ptype": "gxp_sirac_login",
			"actionTarget": "paneltbar",
			"index": 26
		},{
		  "ptype": "gxp_spatialqueryform",
		  "featureManager": "featuremanager",
		  "featureGridContainer": "south",
		  "outputTarget": "east",
		  "showSelectionSummary": true,
		  "actions": null,
		  "id": "bboxquery",
          "collapsedFirst" : true,
          "autoComplete": {
            "sources": ["comunege"],
            "url": "http://vm-sitgeofe1.comune.genova.it/geoserver/wps",
            "pageSize": 10
          },          
		  "outputConfig":{
			  "outputSRS": "EPSG:900913",
			  "selectStyle":{
				  "strokeColor": "#ee9900",
				  "fillColor": "#ee9900",
				  "fillOpacity": 0.4,
				  "strokeWidth": 1
			  },
			  "spatialFilterOptions": {	
				  "lonMax": 20037508.34,   
				  "lonMin": -20037508.34,
				  "latMax": 20037508.34,   
				  "latMin": -20037508.34  
			  },
			  "bufferOptions": {
				"minValue": 1,
				"maxValue": 1000,
				"decimalPrecision": 2,
				"distanceUnits": "m"
			  }
		  },
		  "spatialSelectorsConfig":{
		        "bbox":{
		            "xtype": "gxp_spatial_bbox_selector"
		        },
		        "buffer":{
		            "xtype": "gxp_spatial_buffer_selector"
		        },
		        "circle":{
		            "xtype": "gxp_spatial_circle_selector",
		            "zoomToCurrentExtent": true
		        },
		        "polygon":{
		            "xtype": "gxp_spatial_polygon_selector"
		        },
		        "municipi":{
		            "xtype": "gxp_spatial_geocoding_selector",
		            "multipleSelection": false,
		            "name": "Municipi",
		            "label": "Municipi",
					"searchComboOutputFormat": "json",
		            "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "SITGEO:V_MUNICIPI",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"ID"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.NOME_MUNICIPIO"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "NOME_MUNICIPIO"
		            ],
		            "spatialOutputCRS": "EPSG:4326",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": true
		        },
		        "unita":{
		            "xtype": "gxp_spatial_geocoding_selector",
		            "multipleSelection": false,
		            "name": "Unita Urbanistiche",
		            "label": "Unita Urbanistiche",
					"searchComboOutputFormat": "json",
		            "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "SITGEO:V_UNITA_URBANISTICHE",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"ID"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.NOME_UU"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "NOME_UU"
		            ],
		            "spatialOutputCRS": "EPSG:4326",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": true
		        }
	      }
    	},{
        "ptype":"gxp_print",
        "customParams":{
            "outputFilename":"mapstore-print"
        },
        "ignoreLayers": "Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
        "printService":"http://vm-sitgeofe1.comune.genova.it/geoserver/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":4
        },
        "addLandscapeControl": true,
        "appendLegendOptions": true,
        "addGraticuleControl": true
    },{
    	"ptype": "gxp_spatial_selector_locator",
        "outputTarget": "west",
    	"pluginsConfig":{
    		"geocoder":{
	            "ptype": "gxp_spatial_selector_geocoder",
	            "layoutConfig":{
	                "xtype": "form",
	                "buttonAlign": "right",
	                "autoScroll":true,
	                "frame":true
	            },
	            "crossParameters":{
	                "name": {
	                    "COD_STRADA":{
	                        "number": "COD_STRADA"
	                    }
	                }
	            },
                "zoomLevel": 18,
	            "spatialSelectorsConfig":{
	                "name":{
	                    "xtype": "gxp_spatial_geocoding_selector",
	                    "showSelectionSummary": false,
	                    "multipleSelection": false,
	                    "searchComboOutputFormat": "json",
	                    "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
	                    "geocoderTypeName": "SITGEO:V_ASTE_STRADALI_TOPONIMO_SUB",
	                    "geocoderTypeRecordModel":[
	                        {
	                            "name":"id",
	                            "mapping":"ID"
	                        },
	                        {
	                            "name":"name",
	                            "mapping":"properties.NOMEVIA"
	                        },
	                        {
	                            "name":"geometry",
	                            "mapping":"geometry"
	                        }
	                    ],
	                    "geocoderTypeSortBy":null,
	                    "geocoderTypeQueriableAttributes":[
	                        "NOMEVIA"
	                    ],
	                    "spatialOutputCRS": "EPSG:3003",
	                    "geocoderTypePageSize": 10,
	                    "zoomToCurrentExtent": false
	                },
	                "number":{
	                    "xtype": "gxp_spatial_geocoding_selector",
	                    "showSelectionSummary": false,
	                    "multipleSelection": false,
	                    "searchComboOutputFormat": "json",
	                    "wfsBaseURL": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
	                    "geocoderTypeName": "SITGEO:CIVICI_COD_TOPON",
	                    "geocoderTypeRecordModel":[
	                        {
	                            "name":"id",
	                            "mapping":"ID"
	                        },
	                        {
	                            "name":"name",
	                            "mapping":"properties.TESTO"
	                        },
	                        {
	                            "name":"geometry",
	                            "mapping":"geometry"
	                        }
	                    ],
	                    "geocoderTypeSortBy":null,
	                    "geocoderTypeQueriableAttributes":[
	                        "TESTO"
	                    ],
	                    "spatialOutputCRS": "EPSG:3003",
	                    "geocoderTypePageSize": 10,
	                    "zoomToCurrentExtent": false
	                }
	            }
	    	}, "reverse": {
	            "ptype": "gxp_spatial_selector_reverse_geocoder",
	            "url": "http://vm-sitgeofe1.comune.genova.it/geoserver/wfs",
			    "maxFeatures": 10,
			    "streetfeatureNS": "SITGEO",
			    "typeName": "CIVICI_CON_STRADE",
			    "featureNS": "SITGEO",
			    "geometryName": "GEOMETRY",
			    "streetPropertyName": "DESVIA",
			    "numberPropertyName": "TESTO",
	            "layoutConfig":{
	                "xtype": "form",
	                "buttonAlign": "right",
	                "autoScroll":true,
	                "frame":true
	            }
		    }
    	}
    },{
        "ptype": "gxp_zoombox",
        "id": "custom_zoombox_plugin", 
        "toggleGroup": "toolGroup",
        "appendZoomOut": false,
        "actionTarget": {
        	"target": "paneltbar", 
        	"index": 4  
        }
    }]
}
