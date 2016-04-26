{
   "scaleOverlayMode": "none",
   "gsSources":{  
   		"comunege": {
			"ptype": "gxp_wmssource",
			"title": "Comune Genova",
			"url": "http://mappe.comune.genova.it/geoserver/wms",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layersCachedExtent": [
				-20037508.34, -20037508.34, 
				20037508.34, 20037508.34
			],
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
		"bing": {
			"ptype": "gxp_bingsource" 
		}, 
		"ol": { 
			"ptype": "gxp_olsource" 
		}
	},
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"zoom": 5,
        "numZoomLevels": 21,
		"extent": [
				939258.2034374997, 5479006.186718751,
				1017529.7203906253, 5557277.703671876
		],
		"restrictedExtent": [
				939258.2034374997, 5479006.186718751,
				1017529.7203906253, 5557277.703671876
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
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background",
				"visibility": true
			}
		]
	},
    "customPanels":[
        {
            "xtype": "tabpanel",
            "title": "Visualizzatore Dati",
            "border": false,
            "id": "south",
            "collapsedonfull": true,
            "region": "south",
            "collapsedIconCls": "icon-south-panel",
            "split":true,
            "height": 330,
            "collapsed": true,
            "collapsible": true,
            "activeItem": 0,
            "header": true,
            "hideMode": "offsets",
			"floatable": false,
            "plugins": ["Ext.ux.PanelCollapsedTitle"], 
            "items": [
				{
					"xtype": "container",
					"title": "Reportistica",
					"border": false,
					"iconCls": "grid-columns",
					"layout": "fit",
					"id": "reporting"
				},{
					"xtype": "container",
					"title": "Griglia Risultati",
					"border": false,
					"iconCls": "grid-columns",
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
              "plugins": ["Ext.ux.PanelCollapsedTitle"],
              "collapsedIconCls": "icon-east-panel",
			  "floatable": false,			  
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
            "ptype": "gxp_addlayers",
            "actionTarget": "tree.tbar",
            "id": "addlayers",
            "zoomToExtent": false
        },
		{
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		},
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
            "autoCompleteUrl": "http://mappe.comune.genova.it/geoserver/wps",
            "actionTarget":{
                "target":"paneltbar",
                "index":24
            },
            "snappingAgent": "snapping-agent"
        }, 
        {
           "ptype": "gxp_advancedsnappingagent",
           "id": "snapping-agent",
           "actionTarget":{
                "target":"paneltbar",
                "index":16
            }
        },
        {
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
			"showNumberOfRecords": true,
			"dateFormat": "d-m-Y",
			"featureMaxZoomLevel": 18
        },{
            "ptype": "gxp_chartReporting",
            "outputTarget": "reporting",
            "id": "reportingPanel",
            "iconCls": "icon-chart-report",
            "spatialSelectorFormId": "bboxquery"
        }, {
			"ptype": "gxp_categoryinitializer",
            "silentErrors": true,
            "neededCategories": ["TEMPLATE", "MAP", "MAPSTORECONFIG", "ADMINCONFIG", "CHARTS"]
		}, {
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
                        {"name": "Comune di Genova", "url": "http://mappe.comune.genova.it/geonetwork/srv/ita/csw", "description": "GeoPortale del Comune di Genova"}
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
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		},
        {
            "ptype": "gxp_help",
            "title": "Per iniziare...",
            "actionTarget": "paneltbar",
            "text": "Help",
            "tooltip":"MapStore Guide",
            "index": 25,
            "showOnStartup":true,
            "mode": "window",
            "showAgainTool": true,
            "description": "<p class=MsoNormal><img width=24 height=24 src='http://mappe.comune.genova.it/mapstore/externals/gxp/src/theme/img/silk/add.png' align=left hspace=12></p><p class=MsoNormal ><b>Aggiungi livello</b>: cliccando su questo pulsante, appare il catalogo con l'elenco di tutti i livelli disponibili.<br>Per filtrare i livelli utilizza la casella filtro in basso a sinistra. Seleziona il livello di tuo interesse e clicca sul pulsante <i>aggiungi livelli</i> in basso a destra.<br><i>Nota</i>: Per motivi di leggibilità alcuni livelli appaiono ingrandendo la mappa!</p><br><p class=MsoNormal><img width=24 height=24 src='http://mappe.comune.genova.it/mapstore/externals/gxp/src/theme/img/silk/information.png' align=left hspace=12><b>Informazioni sui livelli:</b> seleziona il pulsante per avere la possibilità di conoscere le informazioni associate ai livelli e poi clicca su un elemento della mappa per avere tutte le informazioni disponibili</p><p class=MsoNormal>&nbsp;</p><p class=MsoNormal><b><span style='font-size:12.0pt;line-height:107%;font-family:Aharoni'>Consulta la guida: </span></b><a href='http://geoportale.comune.genova.it/node/45' target='_blank'>http://geoportale.comune.genova.it/node/45</a></p></div>"
        },
        {
			"ptype": "gxp_login_menu",
			"loginConfig":{
				"default_login": {
					"ptype" : "gxp_geostore_login",
					"actionTarget": "login_menu.menu",
					"loginText": "MapStore Login",
					"reloadOnLogin": true
				},
				"sirac_login": {
					"ptype" : "gxp_sirac_login",
					"actionTarget": "login_menu.menu"
				}
			},
			"actionTarget": "paneltbar",
			"index": 26
		},{
		  "ptype": "gxp_spatialqueryform",
          "enableChartOptionsFieldset": true,
          "chartReportingTool": "reportingPanel",
		  "featureManager": "featuremanager",
		  "featureGridContainer": "south",
          "featureGridTabIndex": "featuregrid",
          "chartReportTabIndex": "reporting",
		  "outputTarget": "east",
		  "showSelectionSummary": true,
		  "actions": null,
		  "id": "bboxquery",
          "collapsedFirst" : true,
          "autoComplete": {
            "sources": ["comunege"],
            "url": "http://mappe.comune.genova.it/geoserver/wps",
            "pageSize": 10
          },
          "wpsUrl": "http://mappe.comune.genova.it/geoserver/wps",
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
		            "wfsBaseURL": "http://mappe.comune.genova.it/geoserver/wfs",
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
		            "wfsBaseURL": "http://mappe.comune.genova.it/geoserver/wfs",
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
            "outputFilename":"mapstore-print",
			"geodetic": true
        },
        "ignoreLayers": "Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
        "printService":"http://mappe.comune.genova.it/geoserver/pdf/",
        "legendPanelId":"legendPanel",
        "actionTarget":{
            "target":"paneltbar",
            "index":4
        },
        "addLandscapeControl": true,
        "appendLegendOptions": true,
        "addGraticuleControl": false
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
	                    "wfsBaseURL": "http://mappe.comune.genova.it/geoserver/wfs",
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
	                    "wfsBaseURL": "http://mappe.comune.genova.it/geoserver/wfs",
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
	            "url": "http://mappe.comune.genova.it/geoserver/wfs",
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
    }, {
		"ptype": "gxp_about",
		"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
		"actionTarget": {"target": "panelbbar", "index": 1}
	}, {
		"ptype": "gxp_privacy",
		"privacyURL": "http://www.comune.genova.it/content/note-legali-e-privacy",
		"actionTarget": {"target": "panelbbar", "index": 5}
	}, {
        "ptype":"gxp_playback",
        "playbackMode": "range",
        "labelButtons": false,
        "timeFormat": "l, F d, Y g:i:s A",
        "outputTarget": "map",
        "outputConfig": {
            "controlConfig":{
                "step": 1,
                "units": "Hours",
                "range": ["2015-01-01T00:00:00.000Z", "2015-12-31T00:00:00.000Z"],
                "frameRate": 5
            }
        }
    }]
}
