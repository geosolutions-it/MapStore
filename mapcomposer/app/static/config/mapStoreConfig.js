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
	    "LaMMA_Stazioni": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows",               
			"title": "LaMMA Stazioni" 

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
			},{
			   "group":"SATELLITE"
			},{
			   "group":"MODELLI"
			},{
			   "group":"NDVI"
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"temperatura",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["temperatura"],
			   "style":["temperatura"],
			   "title":"Temperatura (°C) freq. oraria",
			   "transparent":true,
			   "visibility":true,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "temperatura",
			   "graphAttribute": ["temp_c"],
			   "cumulative": false,                        
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"umidita",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["umidita"],
			   "style":["umidita"],
			   "title":"Umidita relativa (%) freq. oraria",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "umidita",
			   "graphAttribute": ["umid_per"],                       
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"temp_rugiada",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["temperatura_rug"],
			   "style":["temperatura_rug"],
			   "title":"Temperatura di rugiada (°C) freq. oraria",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "temp_rugiada",
			   "graphAttribute": ["trug_c"],                       
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"vento",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["vento"],
			   "style":["vento"],
			   "title":"Vento - velocità (m/s) e direzione (°) freq. oraria",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "vento",
			   "graphAttribute": ["vven_ms","dven_gr"],
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"pressione",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["pressione"],
			   "style":["pressione"],
			   "title":"Pressione s.l.m. (hPa) - freq. oraria",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "pressione",
			   "graphAttribute": ["pres_hpa"],
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"pioggia360",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["heatmap_pioggia"],
			   "style":["heatmap_pioggia"],
			   "title":"Pioggia cum. 6 h (mm)",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "pioggia360",
			   "graphAttribute": ["prec_mm"],
			   "cumulative": true, 
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"pioggia60",
			   "opacity":0.9,
			   "buffer": 2,
			   "selected":false,
			   "tiled":false,
			   "source":"LaMMA_Stazioni", 
			   "styles":["heatmap_pioggia"],
			   "style":["heatmap_pioggia"],
			   "title":"Pioggia cum. 1 h (mm)",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "pioggia60",
			   "graphAttribute": ["prec_mm"],
			   "cumulative": true,                        
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
			},{
			   "format":"image/png8",
			   "group":"Stazioni",
			   "name":"pioggia15",
			   "opacity":0.9,
			   "selected":false,
			   "tiled":false,                       
			   "source":"LaMMA_Stazioni", 
			   "styles":["heatmap_pioggia"],
			   "style":["heatmap_pioggia"],
			   "title":"Pioggia cum. 15min (mm)",
			   "transparent":true,
			   "visibility":false,
			   "ratio":1,
			   "srs":"EPSG:900913",
			   "getGraph": true,
			   "graphTable": "pioggia15",
			   "graphAttribute": ["prec_mm"],
			   "cumulative": true, 
			   "elevation":"0.0",
			   "displayOutsideMaxExtent": true,
			   "restrictedExtent": [1075735.7826,5192220.48427,1381771.78301,5538868.79933]
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
	},
	{
		"ptype": "gxp_nominatimgeocoder",
		"outputConfig": {
			"emptyText": "Nominatim GeoCoder",
			"vendorOptions": {
				"bounded": 1,
				"countrycodes": "",
				"addressdetails": 0
			},
			"boundOption": "max"
		},
		"outputTarget": "paneltbar",
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
		"id": "areeallerta_playback",
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
				"frameRate": 1
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
	}]
}