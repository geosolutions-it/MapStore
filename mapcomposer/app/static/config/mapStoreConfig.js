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
            "xtype": "tabpanel",
            "title": "Data Viewer",
            "border": false,
            "id": "south",
            "region": "south",
            "split":true,
            "height": 330,
            "collapsed": true,
            "collapsible": true,
            "activeItem": 0,
            "header": true,
            "items": [
            {
                "xtype": "container",
                "title": "Feature Grid",
                "border": false,
                "layout": "fit",
                "id": "featuregrid"
            },{
                "xtype": "container",
                "title": "Metadata Explorer",
                "iconCls": "csw-viewer",             
                "border": false,
                "layout": "fit",
                "id": "metadata"
            }
            ]
        },
        {
              "xtype": "panel",
              "title": "Query Panel",        
              "border": false,
              "id": "east",
              "width": 400,
              "height": 500,
              "region": "east",
              "layout": "fit",
              "collapsed": false,
              "split": true,
              "collapsible": true,
              "header": true
        }
        
    ],
    "removeTools": ["googleearth_plugin", "googleearth_separator", "zoombox_plugin"],
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[
		{
            "ptype":"gxp_print",
            "customParams":{
                "outputFilename":"mapstore-print",
                "geodetic": true
            },
            "ignoreLayers": "Google Hybrid,Bing Aerial,Nessuno sfondo,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
            "printService":"http://vm-gistest1/geoserver/pdf/",
            "legendPanelId":"legendPanel",
            "actionTarget":{
                "target":"paneltbar",
                "index":4
            }
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
            "paging": false,
            "autoLoadFeatures": true
        },
        {
            "ptype": "gxp_featureeditor",
            "featureManager": "featuremanager",
            "autoLoadFeatures": true
        },
        {
            "ptype": "gxp_featuregrid",
            "featureManager": "featuremanager",
        	"layout": "form",
            "outputConfig": {
                "loadMask": true
            },
            "outputTarget": "featuregrid",
			"exportFormats": ["CSV","shape-zip","excel", "excel2007"],
			"exportAction": "window",
			"outputTarget": "featuregrid"
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
                        {"name": "CSI Piemonte", "url": "http://www.ruparpiemonte.it/geocatalogorp/geonetworkrp/srv/it/csw", "description": "GeoPortale della Regione Piemonte"},
                        {"name": "Comune di Firenze", "url": "http://datigis.comune.fi.it/geonetwork/srv/it/csw", "description": "GeoPortale del Comune di Firenze"},
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
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
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
	    	}, "reverse": {
	            "ptype": "gxp_spatial_selector_reverse_geocoder",
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
    }
	]
}
