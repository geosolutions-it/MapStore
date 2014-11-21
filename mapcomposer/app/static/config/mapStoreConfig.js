{
   "scaleOverlayMode": "advanced",
   "tab": true,
   "gsSources":{
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
   		"geoscopio": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmssfondo&map_resolution=91&language=ita",
			"title": "Geoscopio basi",
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
   		"geoscopio_ctr": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsctr",
			"title": "Geoscopio CTR",
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
   		"geoscopio_idrografia": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsidrogr&map_resolution=91&language=ita&",
			"title": "Geoscopio idrografia",
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
				"source": "geoscopio",
				"group": "background",
				"title": "Basi di sfondo",
				"name": "rt_sfondo.batimetriche",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false,
				"attribution": false,
                "queryable": false
			},{
				"source": "geoscopio",
				"group": "background",
				"title": "Basi di sfondo",
				"name": "rt_sfondo.hills",
				"displayInLayerSwitcher": false,
				"visibility": true,
				"tiled": false,
				"attribution": false,
                "queryable": false
			},{
				"source": "geoscopio",
				"group": "background",
				"title": "Basi di sfondo",
				"name": "rt_sfondo.intorno_toscana",
				"displayInLayerSwitcher": false,
				"visibility": true,
				"tiled": false,
				"attribution": false,
                "queryable": false
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
               "opacity":0.5,
               "selected":false,
               "tiled":false,                       
               "source":"aree_allerta", 
               "styles":[],
               "style":[],
               "title":"Aree di allerta",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "queryable": true
            },{
				"source": "geoscopio_idrografia",
				"group": "Idrografia",
				"title": "Corsi d'acqua",
				"name": "rt_idrogr.corsi.rt.line",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoscopio_ctr",
				"group": "Basi cartografiche",
				"title": "CTR 1:10.000 Raster BW",
				"name": "rt_ctr.10k",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_ctr",
				"group": "Basi cartografiche",
				"title": "CTR 1:10.000 Raster GL",
				"name": "rt_ctr.ctr10kgreylight",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Province",
				"name": "rt_ambamm.idprovince.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Comuni",
				"name": "rt_ambamm.idcomuni.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
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
               "group": "BOUNDARIES",
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
			"actions": ["-"], 
			"actionTarget": "paneltbar"
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
                    "countrycodes":"it",
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