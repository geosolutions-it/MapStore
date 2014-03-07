{
   "advancedScaleOverlay": false,
   "gsSources":{ 
   		"default": {
			"ptype": "gxp_wmssource",
			"title": "Default GeoServer",
			"url": "http://localhost:8080/geoserver/ows",
			"SRS": "EPSG:900913",
			"version":"1.1.1"
		},
   		"comunege": {
			"ptype": "gxp_wmssource",
			"title": "Comune Genova",
			"url": "http://geoserver.comune.genova.it/geoserver/ows",
			"SRS": "EPSG:900913",
			"version":"1.1.1"
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
		"extent": [
			931098.140119,5507555.468098,1043537.008711,5558080.343788
		],
		"layers": [
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			}, {
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
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
                "source": "default",
                "group" : "Overlays",
				"title" : "States",
				"name"  : "topp:states",
				"tiled" : false,
				"visibility": true
            },{
                "source": "default",
                "group" : "Comune di Genova",
				"title" : "Municipi",
				"name"  : "TOPONOMASTICA:MUNICIPI",
				"tiled" : false,
				"visibility": true
            },{
                "source": "default",
                "group" : "Comune di Genova",
				"title" : "Unita Urb",
				"name"  : "TOPONOMASTICA:UNITA_URBANISTICHE",
				"tiled" : false,
				"visibility": true
            },{
                "source": "default",
                "group" : "Comune di Genova",
				"title" : "Civici Cod",
				"name"  : "SITGEO:CIVICI_COD_TOPON_SUB",
				"tiled" : false,
				"visibility": true
            },{
                "source": "default",
                "group" : "Comune di Genova",
				"title" : "Toponimo",
				"name"  : "CTC:V_ASTE_STRADALI_TOPONIMO_SUB",
				"tiled" : false,
				"visibility": true
            }
		]
	},
    "customPanels":[
	      {
	          "xtype": "panel",
	          "title": "FeatureGrid",      
	          "border": false,
	          "id": "south",
	          "region": "south",
	          "layout": "fit",
	          "height": 330,
	          "collapsed": false,
	          "collapsible": true,
	          "header": true
	      },{
	          "xtype": "panel",
	          "title": "Query Panel",         
	          "border": false,
	          "id": "east",
	          "width": 400,
	          "height": 500,
	          "region": "east",
	          "layout": "fit",
	          "collapsed": false,
	          "collapsible": true,
	          "header": true
	      }
    ],	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[{
           "ptype": "gxp_wpsmanager",
           "id": "wpsManager",
           "url": "http://localhost:8080/geoserver/wps",
           "geostoreUrl": "http://localhost:8080/geostore/rest",
           "geostoreUser": "admin",
           "geostorePassword": "admin",
           "geostoreProxy": "/http_proxy/proxy?url="
        },{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"id": "addlayer"
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
		}, {
		  "ptype": "gxp_featuremanager",
		  "id": "featuremanager",
		  "maxFeatures": 10
	    }, {
		  "ptype": "gxp_featuregrid",
		  "featureManager": "featuremanager",
		  "outputConfig": {
			  "id": "featuregrid",
			  "title": "Features"
		  },
		  "outputTarget": "south",
		  "exportFormats": ["CSV","shape-zip","excel", "excel2007"],
		  "exportAction": "window"
	    }, {
		  "ptype": "gxp_spatialqueryform",
		  "featureManager": "featuremanager",
		  "featureGridContainer": "south",
		  "outputTarget": "east",
		  "showSelectionSummary": true,
		  "actions": null,
		  "id": "bboxquery",
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
		            "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "TOPONOMASTICA:MUNICIPI",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"id"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.NOME_MUNIC"
		                },
		                {
		                    "name":"custom",
		                    "mapping":"properties.COD_MUNIC"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "NOME_MUNIC", "COD_MUNIC", "ID1"
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
		            "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "TOPONOMASTICA:UNITA_URBANISTICHE",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"id"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.NOME_UU"
		                },
		                {
		                    "name":"custom",
		                    "mapping":"properties.COD_UU"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "NOME_UU", "COD_UU", "ID1"
		            ],
		            "spatialOutputCRS": "EPSG:3003",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": true
		        },
		        "civici_cod":{
		            "xtype": "gxp_spatial_geocoding_selector",
		            "multipleSelection": false,
					"name" : "Civici Cod",
					"label" : "Civici Cod",
					"searchComboOutputFormat": "json",
		            "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "SITGEO:CIVICI_COD_TOPON_SUB",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"id"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.COD_STRADA"
		                },
		                {
		                    "name":"custom",
		                    "mapping":"properties.COD_TOPON"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "COD_STRADA", "COD_TOPON"
		            ],
		            "spatialOutputCRS": "EPSG:3003",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": true
		        },
		        "strada":{
		            "xtype": "gxp_spatial_geocoding_selector",
		            "multipleSelection": false,
					"name" : "Strada",
					"label" : "Strada",
					"searchComboOutputFormat": "json",
		            "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
		            "geocoderTypeName": "CTC:V_ASTE_STRADALI_TOPONIMO_SUB",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"id"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.NOMEVIA"
		                },
		                {
		                    "name":"custom",
		                    "mapping":"properties.COD_STRADA"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy":null,
		            "geocoderTypeQueriableAttributes":[
		                "COD_STRADA", "NOMEVIA"
		            ],
		            "spatialOutputCRS": "EPSG:3003",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": true
		        }
	      }
    	}, {
            "ptype": "gxp_spatial_selector_geocoder",
            "outputTarget": "west",
            "text": "Geocoder",
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
            "spatialSelectorsConfig":{
                "name":{
                    "xtype": "gxp_spatial_geocoding_selector",
                    "showSelectionSummary": false,
                    "multipleSelection": false,
                    "searchComboOutputFormat": "json",
                    "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
                    "geocoderTypeName": "CTC:V_ASTE_STRADALI_TOPONIMO_SUB",
                    "geocoderTypeRecordModel":[
                        {
                            "name":"id",
                            "mapping":"id"
                        },
                        {
                            "name":"name",
                            "mapping":"properties.NOMEVIA"
                        },
                        {
                            "name":"custom",
                            "mapping":"properties.COD_STRADA"
                        },
                        {
                            "name":"geometry",
                            "mapping":"geometry"
                        }
                    ],
                    "geocoderTypeSortBy":null,
                    "geocoderTypeQueriableAttributes":[
                        "COD_STRADA", "NOMEVIA"
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
                    "wfsBaseURL": "http://geoserver.comune.genova.it/geoserver/wfs",
                    "geocoderTypeName": "SITGEO:CIVICI_COD_TOPON_SUB",
                    "geocoderTypeRecordModel":[
                        {
                            "name":"id",
                            "mapping":"id"
                        },
                        {
                            "name":"name",
                            "mapping":"properties.COD_STRADA"
                        },
                        {
                            "name":"custom",
                            "mapping":"properties.COD_TOPON"
                        },
                        {
                            "name":"geometry",
                            "mapping":"geometry"
                        }
                    ],
                    "geocoderTypeSortBy":null,
                    "geocoderTypeQueriableAttributes":[
                        "COD_STRADA", "COD_TOPON"
                    ],
                    "spatialOutputCRS": "EPSG:3003",
                    "geocoderTypePageSize": 10,
                    "zoomToCurrentExtent": false
                }
            }
    },{
        "ptype":"gxp_print",
        "customParams":{
            "outputFilename":"mapstore-print"
        },
        "ignoreLayers": "Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
        "printService":"http://localhost:8080/geoserver/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":4
        },
        "addLandscapeControl": true,
        "appendLegendOptions": true,
        "addGraticuleControl": true
    },{
            "ptype": "gxp_spatial_selector_reverse_geocoder",
            "outputTarget": "west",
            "url": "http://geoserver.comune.genova.it/geoserver/wfs",
		    "maxFeatures": 10,
		    "streetfeatureNS": "CTC",
		    "typeName": "CIVICI_COD_TOPON_SUB",
		    "featureNS": "SITGEO",
		    "geometryName": "GEOMETRY",
		    "streetPropertyName": "COD_STRADA",
		    "numberPropertyName": "COD_TOPON",
            "layoutConfig":{
                "xtype": "form",
                "buttonAlign": "right",
                "autoScroll":true,
                "frame":true
            }
    }
	],
	"removeTools":["zoombox_plugin", "googleearth_separator", "googleearth_plugin"]
}