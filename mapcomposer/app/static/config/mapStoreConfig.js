{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "it",
   "embedding": false,
   "gsSources":{ 
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
		"destination": {
			"ptype": "gxp_wmssource",
			"title": "Destination GeoServer",
		    "url": "http://localhost:8080/geoserver/ows"
		}
	},
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [903893.13597286, 5651406.520669],
		"zoom": 8,
		"maxExtent": [
			456125.02434063, 5403020.7962146,
			1323838.1693132, 5887325.807362
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
				"source": "destination",
				"title": "Siig Aggragation",
				"name": "geosolutions:aggregated_data",
				"group": "Destination"
			},{
				"source": "destination",
				"title": "ElaborazioneStd",
				"name": "geosolutions:aggregated_data_selection",
				"displayInLayerSwitcher": false,
				"tiled": false
			}
		]
	},
	
	"proj4jsDefs": {
		"EPSG:32632": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
	},
	
	"tools":[
	   {
		  "ptype":"gxp_layertree",
		  "outputConfig":{
			 "id":"layertree"
		  },
		  "outputTarget":"tree"
	   },
	   {
		  "ptype":"gxp_legend",
		  "outputTarget":"legend",
		  "outputConfig":{
			 "autoScroll":true
		  },
		  "legendConfig":{
			 "legendPanelId":"legendPanel",
			 "defaults":{
				"style":"padding:5px",
				"baseParams":{
				   "LEGEND_OPTIONS":"forceLabels:on;fontSize:10",
				   "WIDTH":12,
				   "HEIGHT":12
				}
			 }
		  }
	   },
	   {
		  "ptype":"gxp_addlayers",
		  "actionTarget":"tree.tbar",
		  "upload":true
	   },
	   {
		  "ptype":"gxp_removelayer",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_removeoverlays",
		  "actionTarget":"tree.tbar"
	   },
	   {
		  "ptype":"gxp_addgroup",
		  "actionTarget":"tree.tbar"
	   },
	   {
		  "ptype":"gxp_removegroup",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_groupproperties",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_layerproperties",
		  "actionTarget":[
			 "tree.tbar",
			 "layertree.contextMenu"
		  ]
	   },
	   {
		  "ptype":"gxp_zoomtolayerextent",
		  "actionTarget":{
			 "target":"layertree.contextMenu",
			 "index":0
		  }
	   },
	   {
		  "ptype":"gxp_zoomtoextent",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":15
		  }
	   },
	   {
		  "ptype":"gxp_navigation",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":16
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_zoombox",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":17
		  }
	   },
	   {
		  "ptype":"gxp_zoom",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":18
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_navigationhistory",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":19
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_wmsgetfeatureinfo",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":20
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_measure",
		  "toggleGroup":"toolGroup",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":21
		  }
	   },
	   {
		  "actions":[
			 "-"
		  ],
		  "actionTarget":"paneltbar"
	   },
	   {
		  "ptype":"gxp_georeferences",
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":23
		  }
	   },		
	   {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
	   }, 
	   {
			"ptype": "gxp_reversegeocoder",
			"outputTarget":"paneltbar",
			"outputConfig": {
				"width": "200"
			},
			"index": 26
	   }, 
	   {
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget":"paneltbar",
			"index": 27
	   },
	   {
			"ptype": "gxp_syntheticview",
			"outputTarget": "east",
			"id": "syntheticview",
			"index": 28
	   }
	]
}
