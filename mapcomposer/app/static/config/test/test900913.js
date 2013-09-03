{
   "geoStoreBase": "http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ 
		"local":{
			"ptype": "gxp_wmssource",
			"title": "Local GeoServer",
			"url": "http://localhost:8080/geoserver/ows",
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
		"extent": [
			1256194.1026318,5855470.2312771,1269465.481666,5862722.1943347
		],
		"layers": [
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
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
			}
		]
	},
    "customPanels":[
        {
            "xtype": "tabpanel",
			"activeTab": 0,            
            "border": false,
            "id": "south",
            "region": "south",
            "split":true,
            "height": 330,
            "collapsed": true,
            "collapsible": true,
            "header": true
        }, {
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
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[
		{
			"ptype": "gxp_metadataexplorer",
			"id": "metadataexplorer",
			"title": "Metadata Explorer",
            "outputTarget": "south",
            "saveState":true,
            "cswconfig": {
                "catalogs": [
                        {"name": "CSI Piemonte", "url": "http://www.ruparpiemonte.it/geocatalogorp/geonetworkrp/srv/it/csw", "description": "GeoPortale della Regione Piemonte"},
                        {"name": "Comune di Firenze", "url": "http://datigis.comune.fi.it/geonetwork/srv/it/csw", "description": "GeoPortale del Comune di Firenze"},
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
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
			"index": 23
		}, {
			"ptype":"gxp_print",
			"customParams":{
				"outputFilename":"mapstore-print"
			},
			"printService":"http://localhost:8080/geoserver/pdf/",
			"legendPanelId":"legendPanel",
			"actionTarget":{
				"target":"paneltbar",
				"index": 4
			}
		}, {
			"ptype":"gxp_wfssearchbox",
			"outputConfig":{
				 "url":"http://localhost:8080/geoserver/sf/ows?",
				 "typeName":"sf:archsites",
				 "recordModel":[
					{
					   "name":"cat",
					   "mapping":"properties.cat"
					},
					{
					   "name":"geometry",
					   "mapping":"geometry"
					},

					{
					   "name":"str1",
					   "mapping":"properties.str1"
					}
				 ],
				 "sortBy":"cat",
				 "queriableAttributes":[
					"str1",
					"cat"
				 ],
				 "displayField":"cat",
				 "pageSize": 10,
				 "width": 250,
				 "tpl":"<tpl for=\".\"><div class=\"search-item\"><h3>{cat}</span></h3>{str1}</div></tpl>"
			},
			"updateField":"geometry",
			"zoom": 18,
			"outputTarget":"paneltbar",
			"index": 30
		}, {
			"ptype": "gxp_importexport",
			"service": "http://localhost:8080/servicebox/",
			"types": ["map","kml/kmz"],
			"actionTarget": "paneltbar",
			"index": 28
		}, {
		    "ptype": "gxp_featuremanager",
		    "id": "featuremanager"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
		    "ptype": "gxp_featureeditor",
		    "featureManager": "featuremanager",
			"actionTarget": "paneltbar"
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
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_styler",
			"actionTarget": "paneltbar",
			"sameOriginStyling": false,
			"width": 500,
			"index": 29
		}
	]
}
