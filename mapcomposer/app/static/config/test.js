{
   "geoStoreBase": "",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "it",
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
				"FORMAT":"image/png8",
				"TILED":true
			}
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
			},{
				"source":"bolzano",
				"name":"Cartografia:particelle",
				"title":"Particelle",
				"visibility":false,
				"opacity":1,
				"group":"Catasto_Kataster",
				"selected":false,
				"format":"image/png8",
				"styles":"particelle2_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:C_VESTIZIONI",
				"title":"Vestizioni",
				"visibility":false,
				"opacity":1,
				"group":"Catasto_Kataster",
				"selected":false,
				"format":"image/png8",
				"styles":"cl000arc_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:C_SIMBOLI",
				"title":"Simboli",
				"visibility":false,
				"opacity":1,
				"group":"Catasto_Kataster",
				"selected":false,
				"format":"image/png8",
				"styles":"cs000_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_GROUND_VIABILITA",
				"title":"U_GROUND_VIABILITA",
				"visibility":true,
				"opacity":0.88,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_ground_viabilita_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_GROUND_ZONE_TUTELA",
				"title":"U_GROUND_ZONE_TUTELA",
				"visibility":true,
				"opacity":0.84,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_ground_zone_tutela_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_GROUND_ZONE_VERDI",
				"title":"U_GROUND_ZONE_VERDI",
				"visibility":true,
				"opacity":0.86,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_ground_zone_verdi_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_GROUND_INSEDIAMENTI",
				"title":"U_GROUND_INSEDIAMENTI",
				"visibility":true,
				"opacity":0.89,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_ground_insediamenti_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_COMMON",
				"title":"U_COMMON",
				"visibility":true,
				"opacity":0.83,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_common_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_OVER",
				"title":"U_OVER",
				"visibility":true,
				"opacity":0.79,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_over_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_LINE",
				"title":"U_LINE",
				"visibility":true,
				"opacity":1,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_line_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"puc:U_SYMBOL",
				"title":"U_SYMBOL",
				"visibility":true,
				"opacity":1,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"u_symbol_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Ambiente:num_var1",
				"title":"num_var1",
				"visibility":true,
				"opacity":1,
				"group":"Puc",
				"selected":false,
				"format":"image/png8",
				"styles":"variante_puc",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:PUC_FERROVIA",
				"title":"Ferrovia",
				"visibility":false,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"ferrovia_puc_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Ambiente:Edifici_PUC",
				"title":"Edifici",
				"visibility":false,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"edifici_puc",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:civici",
				"title":"Numeri Civici",
				"visibility":false,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"civici2_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:GRAFO_STRADALE_PUC",
				"title":"Grafo Stradale",
				"visibility":false,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"grafo_puc_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:autostrada",
				"title":"Autostrada",
				"visibility":false,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"autostrada_it",
				"transparent":true
			 },
			 {
				"source":"bolzano",
				"name":"Cartografia:CONFINE_COMUNALE_PUC",
				"title":"Confine Comunale",
				"visibility":true,
				"opacity":1,
				"selected":false,
				"format":"image/png8",
				"styles":"confine_comunale_puc_it",
				"transparent":true
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
			"actionTarget": {"target": "paneltbar", "index": 20}
		}, {
			"actions": ["-"], "actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_measure", "toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 21}
		}, {
			"ptype":"gxp_print",
			"customParams":{
				"outputFilename":"mapstore-print"
			},
			"ignoreLayers": "Google Hybrid,Bing Aerial,Google Terrain,Google Roadmap,Marker,GeoRefMarker",
			"printService":"http://localhost:8080/geoserver/pdf/",
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
				"wmsURL": "http://sit.comune.bolzano.it/geoserver/",
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
				"wmsURL": "http://sit.comune.bolzano.it/geoserver/",
					"selectionLayerTitle": "Selection Layer"
			}
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": false,
			"id": "addlayer"
		}, {
		    "ptype": "gxp_featuremanager",
		    "id": "featuremanager"
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
		  "ptype": "gxp_bboxqueryform",
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
		  }
	    }, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}
	]
}
