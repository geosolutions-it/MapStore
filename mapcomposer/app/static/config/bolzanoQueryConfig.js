{
   "advancedScaleOverlay": true,
   "proj4jsDefs": {"EPSG:25832": "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"},
   "gsSources":{ 
		"bolzano": {
			"ptype": "gxp_wmssource",
			"url": "http://sit.comune.bolzano.it/geoserver/ows",
			"title": "Bolzano GeoServer",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layersCachedExtent": [
				-20037508.34,-20037508.34,
				20037508.34,20037508.34
			],
			"layerBaseParams":{
				"FORMAT": "image/png8",
				"TILED": true
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
		"numZoomLevels": 22,
		"extent": [
				1259091.229051,5855016.830973,
				1268808.28627,5863434.458712
		],
		"layers": [                                                
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "ol",
				"title": "Vuoto",
				"group": "background",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"None", {"visibility": false}
				]
			},{
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
				"source": "bolzano",
				"title": "Ortofoto 2013 Bolzano/Bozen",
				"name": "Cartografia:ortofoto2013",
				"layersCachedExtent": [
					1252344.2712499984,5850795.892246094,1271912.1504882798,5870363.771484375
				],
				"group": "background",
				"transparent": false,
				"format": "image/jpeg"
			},{
				"source": "bolzano",
				"title": "Ortofoto 2010 Bolzano/Bozen",
				"name": "Cartografia:ortofoto_2010",
				"layersCachedExtent": [
					1252344.2712499984,5850795.892246094,1271912.1504882798,5870363.771484375
				],
				"group": "background",
				"transparent": false,
				"format": "image/jpeg"
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
			"collapsed": true,
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
			"split": true,
			"collapsible": true,
			"header": true
        }
    ],     
	
    "tools": [
		{
			"ptype": "gxp_layertree",
			"outputConfig": {
				"id": "layertree"
			},
			"outputTarget": "tree",
			"localIndexs":{
				"it": 0,
				"de": 1
			}
		}, {
			"ptype": "gxp_legend",
			"outputTarget": "legend",
			"outputConfig": {
				"autoScroll": true
			},
			"legendConfig" : {
				"legendPanelId" : "legendPanel",
				"defaults": {
					"style": "padding:5px",                  
					"baseParams": {
							"LEGEND_OPTIONS": "dpi:150;forceLabels:on;fontSize:10;minSymbolSize:28"                                                
					}
				}
			}
		}, {
			"ptype": "gxp_addlayers",
			"actionTarget": "tree.tbar",
			"id": "addlayers"
		}, {
			"ptype": "gxp_removelayer",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_removeoverlays",
			"actionTarget": "tree.tbar"
		}, {
			"ptype": "gxp_addgroup",
			"actionTarget": "tree.tbar"
		}, {
			"ptype": "gxp_removegroup",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_groupproperties",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_layerproperties",
			"actionTarget": ["tree.tbar", "layertree.contextMenu"]
		}, {
			"ptype": "gxp_zoomtolayerextent",
			"actionTarget": {"target": "layertree.contextMenu", "index": 0}
		}, {
			"ptype":"gxp_geonetworksearch",
			"actionTarget": ["layertree.contextMenu"]
		}, {
			"ptype": "gxp_zoomtoextent",
			"actionTarget": {"target": "paneltbar", "index": 15}
		}, {
			"ptype": "gxp_navigation", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 16}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_zoombox", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 17}
		}, {
			"ptype": "gxp_zoom",
			"actionTarget": {"target": "paneltbar", "index": 18}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_navigationhistory",
			"actionTarget": {"target": "paneltbar", "index": 19}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo_menu", 
			"regex": "[\\s\\S]*[\\w]+[\\s\\S]*",
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"vendorParams": {
				"buffer": 20
			},
			"actionTarget": {"target": "paneltbar", "index": 20}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_measure", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 21}
		}, {
			"ptype":"gxp_print",
			"customParams":{
				"outputFilename":"mapstore-print",
				"geodetic": true
			},
			"ignoreLayers": "Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
			"printService":"http://sit.comune.bolzano.it/geoserver/pdf/",
			"addGraticuleControl": false,
			"addLandscapeControl": true,
			"appendLegendOptions": true,
			"legendPanelId":"legendPanel",
			"actionTarget":{
				"target":"paneltbar",
				"index":4
			}
		}, {
			"ptype": "gxp_searchvia",
			"outputTarget": "searchpanel",
			"serviceUrl": "http://sit.comune.bolzano.it/GeoInfo/",
			"selectionProperties": {
				"wmsURL": "http://sit.comune.bolzano.it/geoserver/ows",
				"selectionLayerTitle": "Selection Layer",
				"selectionLayerCiviciName": "Cartografia:civici",
				"selectionLayerViaName": "Ambiente:grafo",
				"filterCiviciAttribute": "ID",
				"selectionCiviciStyle": "highlight_point",
				"filterViaAttribute": "ID_STRASSE",
				"selectionViaStyle": "highlight"
			}
		}, {
			"ptype": "gxp_searchcatasto",
			"outputTarget": "searchpanel",
			"serviceUrl": "http://sit.comune.bolzano.it/GeoInfo/",
			"selectionProperties": {
				"wmsURL": "http://sit.comune.bolzano.it/geoserver/ows",
				"selectionLayerTitle": "Selection Layer"
			}
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": false,
			"id": "addlayer"
		}, {
			"ptype": "gxp_featuremanager",
			"id": "featuremanager",
			"pagingType": 1
		}, {
			"ptype": "gxp_featuregrid",
			"featureManager": "featuremanager",
			"outputConfig": {
				"id": "featuregrid",
				"title": "Features"
			},
			"outputTarget": "south",
			"showExportCSV": true
		}, {
		    "ptype": "gxp_spatialqueryform",
		    "featureManager": "featuremanager",
		    "featureGridContainer": "south",
		    "outputTarget": "east",
		    "showSelectionSummary": true,
		    "actions": null,
		    "id": "bboxquery",
            "autoComplete": {
				"sources": ["bolzano"],
				"pageSize": 10
			},      
            "outputConfig":{
                  "selectStyle":{
                          "strokeColor": "#ee9900",
                          "fillColor": "#ee9900",
                          "fillOpacity": 0.4,
                          "strokeWidth": 1
                  }
            },	
			"spatialSelectorsConfig":{
		        "bbox":{
		            "xtype": "gxp_spatial_bbox_selector"
		        },
		        "buffer":{
		            "xtype": "gxp_spatial_buffer_selector",
					"bufferOptions": {
						"minValue": 1,
						"maxValue": 10000,
						"decimalPrecision": 2
					}
		        },
		        "circle":{
		            "xtype": "gxp_spatial_circle_selector",
		            "zoomToCurrentExtent": true
		        },
		        "polygon":{
		            "xtype": "gxp_spatial_polygon_selector"
		        },
		        "geocoder":{
		            "xtype": "gxp_spatial_geocoding_selector",
		            "multipleSelection": false,
		            "wfsBaseURL": "http://sit.comune.bolzano.it/geoserver/wfs?",
		            "geocoderTypeName": "Ambiente:grafo",
		            "geocoderTypeRecordModel":[
		                {
		                    "name":"id",
		                    "mapping":"id"
		                },
		                {
		                    "name":"name",
		                    "mapping":"properties.TEXT_I"
		                },
		                {
		                    "name":"custom",
		                    "mapping":"properties.ID_STRASSE"
		                },
		                {
		                    "name":"geometry",
		                    "mapping":"geometry"
		                }
		            ],
		            "geocoderTypeSortBy": null,
		            "geocoderTypeQueriableAttributes":[
		                "TEXT_I", "ID_STRASSE"
		            ],
		            "spatialOutputCRS": "EPSG:4326",
		            "geocoderTypePageSize": 10,
		            "zoomToCurrentExtent": false
		        }
			}
    	}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:25832",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_overviewmap",
			"maximized": true,
			"layers": [
				{
					"wmsserver": "http://sit.comune.bolzano.it/geoserver/Cartografia/wms",
					"title": "Confine_comunale",
					"parameters":{
						"layers": "Cartografia:Confine_comunale"
					},
					"options":{
						"isBaseLayer": true
					}
				}, {
					"wmsserver":"http://sit.comune.bolzano.it/geoserver/Ambiente/wms",
					"title":"Quartieri",
					"parameters":{
						"transparent": true,
						"layers": "Ambiente:quartieri"
					},
					"options":{
						"isBaseLayer": false
					}
				}, {
					"wmsserver":"http://sit.comune.bolzano.it/geoserver/Cartografia/wms",
					"title":"Ferrovia",
					"parameters":{
						"transparent": true,
						"layers": "Cartografia:ferrovia"
					},
					"options":{
						"isBaseLayer": false
					}
				}, {
					"wmsserver":"http://sit.comune.bolzano.it/geoserver/Cartografia/wms",
					"title":"Autostrada",
					"parameters":{
						"transparent": true,
						"layers": "Cartografia:autostrada"
					},
					"options":{
						"isBaseLayer": false
					}
				}
			]
		}, {
			"ptype": "gxp_help",
			"link": "http://sit.comune.bolzano.it/GeoInfo/help/",
			"actionTarget": {"target": "paneltbar", "index": 22}
		}, {
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "composer",
			"showDirectURL": true
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}
    ]
}