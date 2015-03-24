{
   "scaleOverlayMode": "advanced",
   "actionToolScale": "medium",     
   "tab": true,
   "gsSources":{
		"lamma_stazioni": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows",
			"title": "LaMMA Stazioni",
			"SRS": "EPSG:4326",
			"version": "1.1.1",
			"loadingProgress": true,
			"layerBaseParams": {
				"FORMAT": "image/png8",
				"TILED": false
			}
		},   
   		"geoscopio_osm_b": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsosm_b&map_resolution=91&",
			"title": "Geoscopio OSM stile Bing",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},      
   		"geoscopio_osm_g": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsosm_g&map_resolution=91&",
			"title": "Geoscopio OSM stile Google",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		}, 
   		"geoscopio_osm_m": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsosm_m&map_resolution=91&",
			"title": "Geoscopio OSM stile Michelin",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_osm_d": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsosm_d&map_resolution=91&",
			"title": "Geoscopio OSM stile OSM",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},        
   		"geoscopio": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmssfondo&map_resolution=91&",
			"title": "Geoscopio basi",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_ortofoto": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc&map_resolution=91&",
			"title": "Geoscopio ortofoto",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_ctr": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsctr&map_resolution=91&",
			"title": "Geoscopio CTR",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_idrografia": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsidrogr&map_resolution=91&",
			"title": "Geoscopio idrografia",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_amb_ammin": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&map_resolution=91&",
			"title": "Geoscopio ambiti amministrativi",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
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
		"projection": "EPSG:3003",
		"displayProjection": "EPSG:3003",
		"units": "m",
		"fractionalZoom": true,
		"center": [1671579.00, 4803992.00],
		"scales": [50, 1000, 2000, 5000, 8000, 10000, 15000, 25000, 50000, 100000, 250000, 500000, 1000000, 1500000, 2000000],
		"maxExtent": [1328298.3134386, 4554791.501599, 2014859.6865614, 5053192.498401],
		"restrictedExtent": [1550750, 4674330, 1775720, 4929790],        
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
				"source": "geoscopio_osm_b",
				"group": "Toscana OSM Dataset",
				"title": "Stile Bing",
				"name": "default",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_osm_g",
				"group": "Toscana OSM Dataset",
				"title": "Stile Google",
				"name": "default",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_osm_m",
				"group": "Toscana OSM Dataset",
				"title": "Stile Michelin",
				"name": "default",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_osm_d",
				"group": "Toscana OSM Dataset",
				"title": "Stile OSM",
				"name": "default",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_idrografia",
				"group": "Idrografia",
				"title": "Corsi d'acqua",
				"name": "rt_idrogr.corsi.rt.line",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_ctr",
				"group": "Basi cartografiche",
				"title": "CTR 1:10.000 Raster BW",
				"name": "rt_ctr.10k",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryable": false
			},{
				"source": "geoscopio_ctr",
				"group": "Basi cartografiche",
				"title": "CTR 1:10.000 Raster GL",
				"name": "rt_ctr.ctr10kgreylight",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryable": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Province",
				"name": "rt_ambamm.idprovince.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
                "queryable": false,
				"attribution": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Comuni",
				"name": "rt_ambamm.idcomuni.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "lamma_stazioni",
				"group": "WEB CAM",
				"title": "Consorzio LaMMA",
				"name": "lamma_webcam_3003",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false,
                "ratio": 1
			},{
                "toUpdate": false,        
                "format": "image/png8",
                "group": "<b>Stazioni Meteorologiche</b>",
                "name": "temp15_web",
                "opacity": 1.0,
                "selected": false,
                "tiled": false,
                "vendorParams":{
                    "cql_filter": "data_ora <= '2015-03-23T15:54:48.468Z'"
                },                
                "source": "lamma_stazioni",
                "styles": ["temperatura"],
                "style": ["temperatura"],
                "title": "Temperatura (°C)",
                "transparent": true,
                "visibility": true,
                "ratio": 1,
                "getGraph": true,
                "graphTable": "temp15_web",
                "graphAttribute": ["temp_c"],
                "cumulative": false,
                "tabCode": "id",
                "elevation": "0.0",
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
	"proj4jsDefs": {
		"EPSG:3003": "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs +towgs84 = -104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"
	},
    "customPanels":[
        {
            "xtype": "panel",
            "title": "WFSGrid TabPanel",
            "border": false,
            "layout": "fit",
            "id": "south",
            "region": "south",
            "height": 200,
            "split": true,
            "collapsible": true,
            "collapsed": false,
            "header": true,
            "items": [
                {
                  "xtype": "panel",
                  "layout": "fit",
                  "activeTab": 0,
                  "region": "center",
                  "id": "featurelist",
                  "autoScroll": true,
                  "border": false
                }
            ]
        }
    ],
	"customTools": [{
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
                "index":14
            }
        }, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:3003",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505"
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": false,
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
            "ptype": "gxp_tabpanelwfsgrids",
            "wfsURL": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/wfs",
            "outputTarget": "featurelist",
            "srsName": "EPSG:3003",
            "paging": true,
            "pageSize": 10,
            "panels": {
                "states_poi": {
                    "WEB-CAM": {
                        "featureType": "lamma_webcam_3003",
                        "fields": [
                            {
                                "name": "localita",
                                "mapping": "localita"
                            }
                        ],
                        "columns": [
                            {
                                "header": "LOCALITA'",
                                "dataIndex": "localita"
                            }
                        ],
                        "actionColumns": [{
                            "type": "checkDisplay",
                            "layerName": "Highlight Layer",
                            "sourceSRS": "EPSG:3003"
                        },
                        {
                            "type": "zoom",
                            "sourceSRS": "EPSG:3003"
                        }]    
                    },
                    "CENTRALINE": {
                        "featureType": "temp15_web",
                        "fields": [
                            {
                                "name": "fornitore",
                                "mapping": "fornitore"
                            },{
                                "name": "nome",
                                "mapping": "nome"
                            }
                        ],
                        "columns": [
                            {
                                "header": "fornitore",
                                "dataIndex": "fornitore"
                            },{
                                "header": "temp_c",
                                "dataIndex": "temp_c"
                            }
                        ],
                        "actionColumns": [{
                            "type": "checkDisplay",
                            "layerName": "Highlight Layer",
                            "sourceSRS": "EPSG:3003"
                        },
                        {
                            "type": "zoom",
                            "sourceSRS": "EPSG:3003"
                        }]    
                    }
                }
            }
        }
	]
}
