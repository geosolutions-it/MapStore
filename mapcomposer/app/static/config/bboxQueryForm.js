{
   "geoStoreBase": "",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ "geosol":{
			"ptype": "gxp_wmssource",
			"url": "http://demo1.geo-solutions.it/geoserver-enterprise/ows",
			"version":"1.1.1",
            "layerBaseParams": { 
				"TILED": true,
				"TILESORIGIN": "-180,-90"
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
		"center": [1250000.000000, 5370000.000000],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
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
				"source": "geosol",
				"title": "Cities",
				"name": "geosolutions:cities"
			}
		]
	},
	"cswconfig": {
		"catalogs": [
		        {"name": "PTA", "url": "http://pta.partout.it/geoportalPTA/csw", "description": "Piattaforma Tecnologica alpina", "metaDataOptions":{"base":"http://pta.partout.it/geoportalPTA/catalog/search/resource/details.page","idParam":"uuid","idIndex":0}},
				{"name": "Treviso", "url": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw", "description": "Treviso Geonetwork"},
				{"name": "kscNet", "url": "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw", "description": "kscNet"},
				{"name": "CSI-CGIAR", "url": "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw", "description" : "CSI-CGIAR"},
				{"name": "EauFrance", "url": "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw", "description" : "EauFrance"},
				{"name": "SOPAC", "url": "http://geonetwork.sopac.org/geonetwork/srv/en/csw", "description" : "SOPAC"},
				{"name": "SADC", "url": "http://www.sadc.int/geonetwork/srv/en/csw", "description" : "SADC"},
				{"name": "MAPAS", "url": "http://mapas.mma.gov.br/geonetwork/srv/en/csw", "description" : "MAPAS"}
			],
		"dcProperty": "title",
		"initialBBox": {
		   "minx":-13,
		   "miny":10,
			"maxx":-10,
			"maxy":13
		}, 
		"cswVersion": "2.0.2",
		"filterVersion": "1.1.0",
		"start": 1,
		"limit": 10,
		"timeout": 60000
	},
	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
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
        },
		{
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
        }],
	"customTools":[
		{
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_reversegeocoder",
			"outputTarget":"paneltbar",
			"outputConfig": {
				"width": "200"
			},
			"index": 26
		}, {
			"ptype": "gxp_dynamicgeocoder",
			"outputTarget":"paneltbar",
			"index": 27
		},{
			"ptype": "gxp_featuregrid",
			"featureManager": "featuremanager",
			"outputConfig": {
				"id": "featuregrid",
				"title": "Features"
			},
			"outputTarget": "south"
		},{
			"ptype": "gxp_featuremanager",
			"id": "featuremanager"
		},{
			"ptype": "gxp_bboxqueryform",
			"featureManager": "featuremanager",
			"outputTarget": "east",
			"actions": null,
                        "id": "bboxquery",
                        "outputConfig":{
			 "outputSRS": "EPSG:900913",
                         "selectStyle":{
                            "strokeColor": "#FF0000",
                            "handlerFillColor": "#FFFFFF",
                            "fillColor": "#FFFFFF",
                            "fillOpacity":0,
                            "strokeWidth":2
                        },
                        "spatialFilterOptions": {
                            "lonMax": null,   
                            "lonMin": null,
                            "latMax": null,   
                            "latMin": null  
    }
                        }
		}
            
	]
}
