{
   "scaleOverlayMode": "advanced",
   "actionToolScale": "medium",   
   "tab": false,
   "gsSources":{
   		"db_segnalazioni": {
			"ptype": "gxp_wmssource",
			"url": "http://159.213.57.81/geoserver/ows?",
			"title": "Database Segnalazioni",
			"SRS": "EPSG:3003",
			"version":"1.1.1",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			            
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":true
			}
		},     
   		"geoserver_ret": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver_ret/ows?",
			"title": "Geoscopio Reticolo",
			"SRS": "EPSG:3003",
			"version":"1.1.1",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			            
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":true
			}
		},   
   		"geoscopio": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmssfondo&map_resolution=91&language=ita",
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
		"geoscopio_topogr": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmstopogr&version=1.3.0&map_resolution=91&map_mnt=cartoteca&",
			"title": "Geoscopio BASI TOPOGRAFICHE",
			"SRS": "EPSG:3003",
			"version": "1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [1547065,
			4677785,
			1803065,
			4933785],
			"layerBaseParams": {
				"FORMAT": "image/png",
				"TILED": false
			}
		},
		"geoscopio_ambcens": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambcens&version=1.3.0&map_resolution=91&map_mnt=cartoteca&",
			"title": "Geoscopio AMBITI_CENSUARI",
			"SRS": "EPSG:3003",
			"version": "1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [1547065,
			4677785,
			1803065,
			4933785],
			"layerBaseParams": {
				"FORMAT": "image/png",
				"TILED": false
			}
		},        
   		"geoscopio_ortofoto": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc",
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
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsctr",
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
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsidrogr&map_resolution=91&language=ita&",
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
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&",
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
		"center": [1665000,4807000],
		"maxResolution": 1000,
		"zoom": 1,
		"numZoomLevels": 14,
		"maxExtent": [
				708923.00, 4290035.00,
				2631134.00, 5369149.00
		],
		"restrictedExtent": [
				708923.00, 4290035.00,
				2631134.00, 5369149.00
		],        
		"layers": [{
                "source": "geoscopio",
                "group": "background",
                "title": "Basi di sfondo",
                "name": "rt_sfondo.batimetriche",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio",
                "group": "background",
                "title": "Basi di sfondo",
                "name": "rt_sfondo.intorno_toscana",
                "displayInLayerSwitcher": false,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2013 col - AGEA",
                "name": "rt_ofc.10k13",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2010 col - AGEA",
                "name": "rt_ofc.10k10",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2007 col - CGR",
                "name": "rt_ofc.10k07",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1996 bn - AIMA",
                "name": "rt_ofc.10k96",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1988 bn - RT",
                "name": "rt_ofc.10k88",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1978 bn - RT",
                "name": "rt_ofc.10k78",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1954 bn - RT-IGM",
                "name": "rt_ofc.10k54",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_topogr",
                "group": "Basi cartografiche",
                "title": "Carta Topografica 50k",
                "maxscale": 15000, 
                "name": "rt_topogr.topografica50k.grey.rt",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ctr",
                "group": "Basi cartografiche",
                "title": "CTR 1:10.000 Raster BW",
                "name": "rt_ctr.10k",
                "minscale": 15000,             
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ctr",
                "group": "Basi cartografiche",
                "title": "CTR 1:10.000 Raster GL",
                "minscale": 15000,            
                "name": "rt_ctr.ctr10kgreylight",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ambcens",
                "group": "Toponimi",
                "title": "Toponimi - Centri e nuclei 2011",
                "name": "rt_amb_cens.centri_nuclei_2011",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },{
				"source": "geoserver_ret",
				"group": "Reticolo Idrografico RT",
				"title": "Comprensori ai sensi della L.R.79/2012",
				"name": "RETICOLO_GESTIONE:proposta_comprensori_lr79_2012",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Reticolo Idrografico RT",
				"title": "Reticolo idrografico ai sensi del D.Lgs.152/2006 (DCR 57/2013)",
				"name": "lamma:reticolo_idrografico",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Reticolo Idrografico RT",
				"title": "Reticolo di gestione ai sensi della L.R.79/2012 (57/2013)",
				"name": "lamma:retgest_79_2012",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Province",
				"name": "rt_ambamm.idprovince.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Comuni",
				"name": "rt_ambamm.idcomuni.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoserver_ret",
				"group": "Ambiti amministrativi",
				"title": "Bacini idrografici ai sensi della 183/89",
				"name": "pericolosita:bacini",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Arezzo",
				"name": "db_segnalazioni:genio_civile_arezzo_view",
                "cql_filter": "istruttoria = TRUE",                
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Firenze",
				"name": "db_segnalazioni:genio_civile_firenze_view",
                "cql_filter": "istruttoria = TRUE",                  
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Grosseto",
				"name": "db_segnalazioni:genio_civile_grosseto_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Livorno",
				"name": "db_segnalazioni:genio_civile_livorno_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Lucca",
				"name": "db_segnalazioni:genio_civile_lucca_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Massa-Carrara",
				"name": "db_segnalazioni:genio_civile_massa_carrara_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Pisa",
				"name": "db_segnalazioni:genio_civile_pisa_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Pistoia",
				"name": "db_segnalazioni:genio_civile_pistoia_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Prato",
				"name": "db_segnalazioni:genio_civile_prato_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "Proposta per DADS 2015",
				"title": "Genio Civile Siena",
				"name": "db_segnalazioni:genio_civile_siena_view",
                "cql_filter": "istruttoria = TRUE",                   
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
			},{
				"source": "db_segnalazioni",
				"group": "DADS 2014 finanziati con DGRT 1194 2013",
				"title": "DADS 2014",
				"name": "db_segnalazioni:dads_2014_finanziati_dgrt_1194_2013",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false,
                "queryPanel": true
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
	          "title": "Risultati Ricerche",      
	          "border": false,
              "collapsedonfull": true,
	          "id": "south",
	          "region": "south",
	          "layout": "fit",
	          "height": 330,
	          "collapsed": true,
	          "collapsible": true,
	          "header": true
	      },{
	          "xtype": "panel",
	          "title": "Pannello Ricerche",         
	          "border": false,
	          "id": "east",
	          "width": 400,
	          "height": 500,
	          "region": "east",
	          "layout": "fit",
	          "collapsed": true,
	          "collapsible": true,
	          "header": true,
              "collapsedonfull": true
	      }
    ],	    
	"customTools": [
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		},{
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
		  "ptype": "gxp_featuremanager",
		  "id": "featuremanager",
          "paging": true,
          "pagingType": 1,
          "autoLoadFeatures": false,
          "maxFeatures": 10
	    }, {
		  "ptype": "gxp_featuregrid",
		  "featureManager": "featuremanager",
          "layout": "form",
		  "outputConfig": {
			  "id": "featuregrid",
			  "title": "Features",
              "height": 240,
              "loadMask": true
		  },
		  "outputTarget": "south",
		  "showNumberOfRecords": true
	    }, {
		  "ptype": "gxp_spatialqueryform",
		  "featureManager": "featuremanager",
		  "featureGridContainer": "south",
		  "outputTarget": "east",
		  "showSelectionSummary": true,
		  "actions": null,
		  "id": "bboxquery",
          "spatialSelectorFieldsetCollapsedFirst": true,    
          "spatialSelectorFieldsetHidden": true,    
          "spatialSelectorFieldsetCheckboxToggle": false,        
          "attributeFieldsetCollapsedFirst": false,        
          "attributeFieldsetHidden": false,      
          "attributeFieldsetCheckboxToggle": false,    
          "filterLayer": false,
          "autoComplete": {
            "sources": ["db_segnalazioni"],
            "url": "http://159.213.57.81/geoserver/wps",
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
		        }
	      }
    	}
	]
}
