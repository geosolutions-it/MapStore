{
	"scaleOverlayMode": "advanced",
	"actionToolScale": "medium",
	"tab": true,
	"gsSources": {
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
		},
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
		"LaMMA_confini": {
				"ptype": "gxp_wmssource",
				"url": "http://geoportale.lamma.rete.toscana.it/geowebcache/service/wms",               
				"title": "LaMMA Confini"
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
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
			   "fixed":true,
			   "group":"background",
			   "name":"Aerial",
			   "selected":false,
			   "source":"bing",
			   "title":"Bing Aerial",
			   "visibility":false
			},
			{
			   "fixed":true,
			   "group":"background",
			   "name":"mapnik",
			   "selected":false,
			   "source":"osm",
			   "title":"Open Street Map",
			   "visibility":false
			},
			{
			   "fixed":true,
			   "group":"background",
			   "name":"osm",
			   "selected":false,
			   "source":"mapquest",
			   "title":"MapQuest OpenStreetMap",
			   "visibility":false
			},
			{
			   "fixed":true,
			   "group":"background",
			   "name":"ROADMAP",
			   "selected":false,
			   "source":"google",
			   "title":"Google Roadmap",
			   "visibility":false
			},
			{
			   "fixed":true,
			   "group":"background",
			   "name":"TERRAIN",
			   "opacity":1,
			   "selected":false,
			   "source":"google",
			   "title":"Google Terrain",
			   "visibility":false
			},
			{
			   "fixed":true,
			   "group":"background",
			   "name":"HYBRID",
			   "selected":false,
			   "source":"google",
			   "title":"Google Hybrid",
			   "visibility":true
			},{
				"source": "ol",
				"group": "background",
				"fixed": true,
				"type": "OpenLayers.Layer",
				"visibility": false,
				"args": [
					"None", {"visibility": false}
				]
			},{
			   "group":"SATELLITE"
			},{
			   "group":"MODELLI"
			},{
			   "group":"NDVI"
			},{
			   "format":"image/png",
			   "group": "Limiti Mondiali",
			   "name":"confini_mondiali_stati",
			   "selected":false,                   
			   "source":"LaMMA_confini", 
			   "styles":["confini"],
			   "style":["confini"],
			   "title":"Stati",
			   "transparent":true,
			   "visibility":true,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "queryable": false,
			   "displayInLayerSwitcher": true
			},{
			   "format":"image/png",
			   "group": "Limiti Mondiali",
			   "name":"confini_mondiali_regioni",
			   "selected":false,                   
			   "source":"LaMMA_confini", 
			   "styles":["confini"],
			   "style":["confini"],
			   "title":"Regioni",
			   "transparent":true,
			   "visibility":true,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "queryable": false,
			   "displayInLayerSwitcher": true
			},{
			   "format":"image/png",
			   "group": "Limiti Mondiali",
			   "name":"confini_mondiali_provincie",
			   "selected":false,                   
			   "source":"LaMMA_confini", 
			   "styles":["confini"],
			   "style":["confini"],
			   "title":"Province",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "queryable": false,
			   "displayInLayerSwitcher": true
			},{
			   "format":"image/png",
			   "group": "Limiti Mondiali",
			   "name":"comuni",
			   "selected":false,                   
			   "source":"LaMMA_confini", 
			   "styles":["confini"],
			   "style":["confini"],
			   "title":"Comuni Italia",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "queryable": false,
			   "displayInLayerSwitcher": true
			},
		{
			"toUpdate": false,
            "isAreaAllerta": true,
            "stationPrefix": "prec",            
			"format": "image/png8",
			"group": "Elaborazioni Aree di Allerta",
			"name": "prec60_web_allerta",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["pavg_mm_allerta"],
			"style": ["pavg_mm_allerta"],            
			"title": "Pioggia AVG (mm)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
			"toUpdate": false,
            "isAreaAllerta": true,
            "stationPrefix": "prec",               
			"format": "image/png8",
			"group": "Elaborazioni Aree di Allerta",
			"name": "prec60_web_allerta",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["pmax_mm_allerta"],
			"style": ["pmax_mm_allerta"],             
			"title": "Pioggia MAX (mm)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
        {
			"toUpdate": false,        
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "temp15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["temperatura"],
			"style": ["temperatura"],
			"title": "Temperatura (°C)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "temp15_web",
			"graphAttribute": ["temp_c"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
            "toUpdate": false, 
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "pres15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["pressione"],
			"style": ["pressione"],
			"title": "Pressione s.l.m. (hPa)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "pres15_web",
			"graphAttribute": ["pres_hpa"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
            "toUpdate": false, 
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "ven15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["vento"],
			"style": ["vento"],
			"title": "Vento - velocità (m/s) e direzione (°)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "ven15_web",
			"graphAttribute": ["vven_ms",
			"dven_gr"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
            "toUpdate": false, 
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "trug15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["temperatura_rug"],
			"style": ["temperatura_rug"],
			"title": "Temperatura di rugiada (°C)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "trug15_web",
			"graphAttribute": ["trug_c"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
            "toUpdate": false, 
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "umid15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["umidita"],
			"style": ["umidita"],
			"title": "Umidita relativa (%)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "umid15_web",
			"graphAttribute": ["umid_per"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
			"toUpdate": true,
            "stationPrefix": "raf",
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "raf15_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["raffica"],
			"style": ["raffica"],
			"title": "Raffica - velocità (m/s) e direzione (°)",
			"transparent": true,
			"visibility": false,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "raf15_web",
			"graphAttribute": ["vraf_ms",
			"draf_gr"],
			"cumulative": false,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
			"toUpdate": true,
            "stationPrefix": "prec",
			"format": "image/png8",
			"group": "Stazioni Meteorologiche",
			"name": "prec60_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": ["pioggia"],
			"style": ["pioggia"],
			"title": "Pioggia cum.(mm)",
			"transparent": true,
			"visibility": true,
			"ratio": 1,
			"getGraph": true,
			"graphTable": "prec60_web",
			"graphAttribute": ["prec_mm"],
			"cumulative": true,
			"tabCode": "id",
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
			"toUpdate": false,
            "allowRange": true,
			"format": "image/png8",
			"group": "Fulmini",
			"name": "fulmini_lampinet_nn_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": [],
			"style": [],
			"title": "Fulmini Lampinet Nube Nube",
			"transparent": true,
			"visibility": true,
			"ratio": 1,
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		},
		{
			"toUpdate": false,
            "allowRange": true,
			"format": "image/png8",
			"group": "Fulmini",
			"name": "fulmini_lampinet_tn_web",
			"opacity": 1.0,
			"selected": false,
			"tiled": false,
			"source": "lamma_stazioni",
			"styles": [],
			"style": [],
			"title": "Fulmini Lampinet Terra Nube",
			"transparent": true,
			"visibility": true,
			"ratio": 1,
			"elevation": "0.0",
			"displayOutsideMaxExtent": true
		}
		],
		"center": [1250000.000000, 5375000.000000],
		"zoom": 5				
	},
	"scaleOverlayUnits": {
		"bottomOutUnits": "nmi",
		"bottomInUnits": "nmi",
		"topInUnits": "m",
		"topOutUnits": "km"
	},
	"removeTools": ["wmsgetfeatureinfo_menu_plugin"],
	"customPanels": [{
		"xtype": "tabpanel",
		"border": false,
		"activeTab": 0,
		"id": "east",
		"region": "east",
		"width": 340,
		"split": true,
		"collapsible": true,
		"header": false,
		"items": [{
			"id": "aree_allerta_id",
			"xtype": "panel",
			"border": false,
			"layout": "form",
			"title": "Gestione dati real-time",
			"autoScroll": true,
			"closable": false,
			"labelWidth": "10px"
		}]
	}],
	"customTools": [{
		"ptype": "gxp_wmsgetfeatureinfo",
		"id": "wmsgetfeatureinfo_plugin",
		"toggleGroup": "toolGroup",
		"closePrevious": true,
		"useTabPanel": true,
		"infoPanelId": "",
		"disableAfterClick": false,
		"loadingMask": true,
		"maxFeatures": 100,
		"actionTarget": {
			"target": "paneltbar",
			"index": 13
		}
	},
	{
		"actions": ["-"],
		"actionTarget": "paneltbar"
	},
	{
		"ptype": "gxp_wfsgetgraphs",
		"toggleGroup": "toolGroup",
		"url": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/wfs?",
		"actionTarget": {
			"target": "paneltbar",
			"index": 22
		}
	},
	{
		"ptype": "gxp_graticule",
        "pressedOnStart": true,
		"actionTarget": {
			"target": "paneltbar",
			"index": 24
		}
	},
	{
		"ptype": "gxp_mouseposition",
		"displayProjectionCode": "EPSG:4326",
		"customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505"
	}, 
	{
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": true,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
	}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
    },
	{
        "ptype": "gxp_geolocationmenu",
        "actionTarget": "paneltbar",
        "geolocate": {
            "geolocateMenuText": "Geolocate",
            "trackMenuText": "Track Position",
            "geolocateTooltip": "Locate my position",
            "enableTracking" : false,
            "layerName": "Position",
            "bind": true,
            "zoom": true,
            "displayInLayerSwitcher": false,
            "geolocationStyles": {
                "pointStyle": {
                        "graphicName": "circle",
                        "strokeColor": "#aaa",
                        "fillColor": "#11f",
                        "strokeWidth": 2,
                        "fillOpacity": 0.7,
                        "strokeOpacity": 0.6,
                        "pointRadius": 5                          
                },
                "auraStyle": { 
                        "fillOpacity": 0.3,
                        "fillColor": "#55b",
                        "strokeColor": "#00f",
                        "strokeOpacity": 0.6
                },
                "geolocationOptions": {
                    "enableHighAccuracy": true,
                    "maximumAge": 0,
                    "timeout": 7000
                }
            }
        },
        "index": 26
	},
	{
		"ptype": "gxp_about",
		"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
		"actionTarget": {
			"target": "panelbbar",
			"index": 1
		}
	},
	{
		"ptype": "gxp_areeallertadata",
		"id": "areeallertadataToolId",
		"dataUrl": "http://159.213.57.108/geoserver/ows",
		"highChartExportUrl": "http://84.33.2.75/highcharts-export/",
		"outputConfig": {
			"itemId": "areeallertadata",
			"outputSRS": "EPSG:4326",
			"geodesic": false,
			"bufferOptions": {
				"minValue": 0,
				"maxValue": 100000,
				"decimalPrecision": 2
			}
		},
		"outputTarget": "aree_allerta_id"
	},
	{
		"ptype": "gxp_playback",
		"id": "playback",
		"outputTarget": "map",
		"playbackMode": "range",
		"showIntervals": false,
		"labelButtons": false,
		"settingsButton": false,
		"rateAdjuster": false,
		"dynamicRange": false,
		"timeFormat": "l, F d, Y g:i:s A",
		"outputConfig": {
			"controlConfig": {
				"step": 60,
				"startEnd": true,
				"units": "Minutes",
				"frameRate": 5
			}
		}
	}, 
	{
		"ptype": "gxp_resourcestatus",
		"id": "resourcetree_plugin",
		"outputConfig": {
				"id": "resourcetree"
		},
		"outputTarget": "west"
	}, {
        "ptype": "gxp_zoomtotimeextent",
        "actionTarget": ["tree.tbar", "layertree.contextMenu"]
    }]
}