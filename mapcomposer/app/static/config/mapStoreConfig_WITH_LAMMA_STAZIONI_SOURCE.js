{
   "scaleOverlayMode": "advanced",
   "tab": true,
   "gsSources":{
   		"GEBCO_WMS": {
			"ptype": "gxp_wmssource",
			"url": "http://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?",
			"title": "GEBCO WMS",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,
			"layersCachedExtent": [
				-180, -90,
				180, 90
			],			
			"layerBaseParams":{
				"FORMAT":"image/jpeg",
				"TILED":true
			}
		},   
   		"LaMMA_confini": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/confini/ows",
			"title": "LaMMA",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,
			"layersCachedExtent": [
				-180, -90,
				180, 90
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":true
			}
		},       
        "lamma_msg3": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/MSG3/ows",
			"title": "LaMMA MSG2",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,        
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"lamma_msg2": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/MSG2/ows",
			"title": "LaMMA MSG2",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,        
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},    
   		"lamma_radar": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/RADAR/ows",
			"title": "LaMMA Radar",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,        
			"layerBaseParams":{
				"FORMAT":"image/png8",
				"TILED":false
			}
		},    
   		"lamma_stazioni": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows",
			"title": "LaMMA Stazioni",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,        
			"layerBaseParams":{
				"FORMAT":"image/png8",
				"TILED":false
			}
		},        
   		"aree_allerta": {
			"ptype": "gxp_wmssource",
			"url": "http://159.213.57.108/geoserver/ALLERTA/ows",
			"title": "Aree Allerta",
			"SRS": "EPSG:4326",
			"version":"1.1.1",
            "loadingProgress": true,
			"layerBaseParams":{
				"FORMAT":"image/png8",
				"TILED":false
			}
		},
   		"geoscopio_ortofoto": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc",
			"title": "Geoscopio ortofoto",
			"SRS": "EPSG:4326",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				-180, -90,
				180, 90
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_amb_ammin": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&",
			"title": "Geoscopio ambiti amministrativi",
			"SRS": "EPSG:4326",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				-180, -90,
				180, 90
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
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
		"projection": "EPSG:4326",
		"displayProjection": "EPSG:4326",
		"units": "m",
		"center": [11,43.5],
        "numZoomLevels": 17,
        "animatedZooming": {
            "transitionEffect": "resize"
        },
		"maxResolution": 2,
		"zoom": 8,
		"maxExtent": [
				-180, -90,
				180, 90
		],
		"restrictedExtent": [
				-180, -90,
				180, 90
		],         
		"layers": [
            {
				"source": "ol",
				"group": "background",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"None", {"visibility": false}
				]
			},{
				"source": "GEBCO_WMS",
				"group": "background",
				"title": "Basi di sfondo",
				"name": "GEBCO_08_Grid",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": true,
				"attribution": false,
                "queryable": false,                       
                "displayOutsideMaxExtent": true
			},{
				"source": "geoscopio_ortofoto",
				"group": "Ortofotocarte 1:10.000",
				"title": "Anno 2013 col - AGEA",
				"name": "rt_ofc.10k13",
                "styles": "default",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryable": false
			},{
               "format":"image/png8",
               "group":"Aree di allerta",
               "name":"AREE_ALLERTA",
               "opacity":0.8,
               "selected":false,
               "tiled":false,                       
               "source":"aree_allerta", 
               "styles":[],
               "style":[],
               "title":"Aree di allerta",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "queryable": true
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG3 - every 15 Minutes",
               "name":"MSG3_NatColours",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg3",
               "styles":["raster"],
               "title":"NatColors",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG3 - every 15 Minutes",
               "name":"MSG3_Dust",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg3",
               "styles":["raster"],
               "title":"Dust",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG3 - every 15 Minutes",
               "name":"MSG3_Airmass",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg3",
               "styles":["raster"],
               "title":"Airmass",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG2 - every 5 Minutes",
               "name":"MSG2_NatColours",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg2",
               "styles":["raster"],
               "title":"NatColors",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG2 - every 5 Minutes",
               "name":"MSG2_Dust",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg2",
               "styles":["raster"],
               "title":"Dust",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png",
               "expanded":false,
               "checked": false,
               "group":"MSG2 - every 5 Minutes",
               "name":"MSG2_Airmass",
               "selected":false,
               "tiled":false,                
               "source":"lamma_msg2",
               "styles":["raster"],
               "title":"Airmass",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0",
               "queryable": false
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRI",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRI"],
               "title":"SRI - every 30 Minutes",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"CAPPI",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["CAPPI_2000.0"],
               "title":"CAPPI - 2000 - every 30 Minutes",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"2000.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"CAPPI",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["CAPPI_3000.0"],
               "title":"CAPPI - 3000 - every 30 Minutes",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"3000.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"CAPPI",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["CAPPI_5000.0"],
               "title":"CAPPI - 5000 - every 30 Minutes",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"5000.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRT1",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRT"],
               "title":"SRT1 - every Hour",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "elevation":"0.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRT3",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRT"],
               "title":"SRT3 - every Hour",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRT6",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRT"],
               "title":"SRT6 - every Hour",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRT12",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRT"],
               "title":"SRT12 - every Hour",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0"
            }, {
               "format":"image/png8",
               "expanded":true,
               "checked": false,
               "group":"RADAR",
               "name":"SRT24",
               "selected":false,
               "tiled":false,                
               "source":"lamma_radar",
               "styles":["SRT"],
               "title":"SRT24 - every Hour",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "elevation":"0.0"
            },{
               "format":"image/png",
               "group": "Limiti amministrativi",
               "name":"confini_mondiali_regioni",
               "selected":false,                   
               "source":"LaMMA_confini", 
               "styles":["confini"],
               "style":["confini"],
               "title":"Regioni",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:4326",
               "queryable": false,
               "displayInLayerSwitcher": true
            },{
				"source": "geoscopio_amb_ammin",
				"group": "Limiti amministrativi",
				"title": "Province",
				"name": "rt_ambamm.idprovince.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Limiti amministrativi",
				"title": "Comuni",
				"name": "rt_ambamm.idcomuni.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			}, {
               "format":"image/png8",
               "group":"Stazioni",
               "name":"temparia_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["temperatura"],
               "style":["temperatura"],
               "title":"Temperatura (°C) freq. oraria",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "temparia_web",
               "graphAttribute": ["temp_c"],
               "cumulative": false,         
               "tabCode": "id",                     
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"umid_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["umidita"],
               "style":["umidita"],
               "title":"Umidita relativa (%) freq. oraria",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "umid_web",
               "graphAttribute": ["umid_per"],
               "tabCode": "id",        
               "cumulative": false,                   
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"umid_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["temperatura_rug"],
               "style":["temperatura_rug"],
               "title":"Temperatura di rugiada (°C) freq. oraria",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "umid_web",
               "graphAttribute": ["trug_c"],
               "tabCode": "id",              
               "cumulative": false,                   
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"vent_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["vento"],
               "style":["vento"],
               "title":"Vento - velocità (m/s) e direzione (°) freq. oraria",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "umid_web",
               "graphAttribute": ["vven_ms","dven_gr"],
               "tabCode": "id",      
               "cumulative": false,                   
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"pres_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["pressione"],
               "style":["pressione"],
               "title":"Pressione s.l.m. (hPa) - freq. oraria",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "pres_web",
               "graphAttribute": ["pres_hpa"],
               "tabCode": "id",              
               "cumulative": false,                   
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"prec360_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["heatmap_pioggia"],
               "style":["heatmap_pioggia"],
               "title":"Pioggia cum. 6 h (mm)",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "getGraph": true,
               "graphTable": "prec360_web",
               "graphAttribute": ["prec_mm"],
               "cumulative": true,
               "tabCode": "id",               
               "elevation":"0.0",                       
               "displayOutsideMaxExtent": true
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"prec60_web",
               "opacity":0.9,
               "buffer": 2,
               "selected":false,
               "tiled":false,
               "source":"lamma_stazioni", 
               "styles":["heatmap_pioggia"],
               "style":["heatmap_pioggia"],
               "title":"Pioggia cum. 1 h (mm)",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "getGraph": true,
               "graphTable": "prec60_web",
               "graphAttribute": ["prec_mm"],
               "cumulative": true,         
               "tabCode": "id",
               "elevation":"0.0",                       
               "displayOutsideMaxExtent": true
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"prec15_web",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"lamma_stazioni", 
               "styles":["heatmap_pioggia"],
               "style":["heatmap_pioggia"],
               "title":"Pioggia cum. 15min (mm)",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "getGraph": true,
               "graphTable": "prec15_web",
               "graphAttribute": ["prec_mm"],
               "cumulative": true,
               "tabCode": "id",               
               "elevation":"0.0",                       
               "displayOutsideMaxExtent": true
            },{
               "format":"image/png8",
               "group":"Stazioni",
               "name":"prec_60",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"aree_allerta",
               "styles":["heatmap_pioggia"],
               "style":["heatmap_pioggia"],               
               "title":"Pioggia cum. 60min (mm)",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "getGraph": true,
               "graphTable": "prec_60",
               "graphAttribute": ["prec_mm"],
               "cumulative": true,
               "tabCode": "id",               
               "elevation":"0.0",                       
               "displayOutsideMaxExtent": false
            }
		]
	},
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },	
    "removeTools": [
        "wmsgetfeatureinfo_menu_plugin"
    ],
	"customPanels":[
        {
            "xtype": "tabpanel",
            "border": false,
            "activeTab": 0,
            "id": "east",
            "region": "east",
            "width": 350,
            "split": true,
            "collapsible": true,
            "header": false,
            "items":[{
                    "id": "aree_allerta_id",
                    "xtype": "panel",
                    "border": false,
                    "layout": "form",
                    "title": "Aree Allerta",
                    "autoScroll": true,
                    "closable": false,
                    "labelWidth": "10px"
                }            
            ]
        }
    ], 	
	"customTools": [
		{
            "ptype":"gxp_wmsgetfeatureinfo",
            "id": "wmsgetfeatureinfo_plugin",
            "toggleGroup":"toolGroup",
            "closePrevious": true,
            "useTabPanel": true,
            "infoPanelId": "",
            "disableAfterClick": false,
            "loadingMask": true,
			"maxFeatures": 100,
            "actionTarget":{
                "target":"paneltbar",
                "index": 13
            }
        }, {
            "actions": ["-"], 
            "actionTarget": "paneltbar"
        }, {
            "ptype": "gxp_wfsgetgraphs",
            "toggleGroup": "toolGroup",
            "url": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows?",
            "actionTarget": {
                "target": "paneltbar",
                "index": 22
            }
        }, {
            "ptype": "gxp_graticule",
            "actionTarget": {"target": "paneltbar", "index": 24}
        }, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505"
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": false,
			"directAddLayer": false,
			"id": "addlayer"
		},{
            "ptype":"gxp_nominatimgeocoder",
            "outputConfig":{
                "emptyText":"Nominatim GeoCoder",
                 "vendorOptions":{
                    "bounded":1,
                    "countrycodes":"",
                    "addressdetails":0
                },
                "boundOption":"max"
            },
            "outputTarget":"paneltbar",
            "index":26
        }, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
            "ptype":"gxp_areeallertadata",
            "id":"areeallertadataToolId",
            "dataUrl":"http://159.213.57.108/geoserver/ows",
            "highChartExportUrl" :"http://84.33.2.75/highcharts-export/",
            "outputConfig":{
                "itemId":"areeallertadata",
                "outputSRS": "EPSG:4326",
                "geodesic": false,
                "bufferOptions":{
                    "minValue": 0,
                    "maxValue":100000,
                    "decimalPrecision" :2
                }
            },
            "outputTarget" :"aree_allerta_id"
        }, {
            "ptype":"gxp_playback",
            "playbackMode": "track",
            "labelButtons": false,
            "timeFormat": "l, F d, Y g:i:s A",
            "outputTarget": "map",
            "outputConfig": {
                "controlConfig":{
                    "step": 1,
                    "startEnd": true,
                    "units": "Hours",
                    "frameRate": 1
                }
            }
        }
	]
}