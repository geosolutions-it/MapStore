{
   "geoStoreBase":"http://localhost:8282/geostore/rest/",
   "gnBaseUrl": "http://localhost:8282/geonetwork/",
   "proxy":"/proxy/?url=",
   "defaultLanguage": "it",
   "tab": true,
   "gsSources":{ 
   		"geosol":{
			"ptype": "gxp_wmssource",
			"url": "http://84.33.2.30/geoserver/wms",
			"version":"1.1.1",
            "layerBaseParams": { 
			    "FORMAT":"image/png8",
				"TILED": true,
				"TILESORIGIN": "-20037508.34, -20037508.34"
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
			}
		]
	},

	"customTools":[
		{
            "ptype": "gxp_featuremanager",
            "id": "featuremanager"
        }, {
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"index": 23
		}, {
             "ptype": "gxp_importexport",
             "service": "http://84.33.2.30/servicebox/",
             "types": ["map"],
             "actionTarget": "paneltbar",
             "index": 28
         }, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"id": "addlayer",
			"useEvents": true
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"id": "addlayerbis",
			"forceMultiple": true,
			"useEvents": true
		}, {
			"ptype": "gxp_download",
            "featureManager": "featuremanager",
			"readOnlyLayerSelection": false,
			"removePreviousLayerOnSelection": false,
			"id": "download",
			"layersFromAllCapabilities": false,
			"outputTarget": "west",
            "wpsUrl": "http://84.33.2.30/geoserver/ows?service=WPS",
			"sridLinkTpl": "http://spatialreference.org/ref/#AUTH#/#SRID#/",
			"formats": {
				"wfs":[
					["application/zip", "ESRI Shapefile", "wfs", "zip"],
					["application/dxf", "DXF", "wfs", "dxf"],
					["text/xml; subtype=wfs-collection/1.0", "GML2", "wfs", "gml"],
					["text/xml; subtype=wfs-collection/1.1", "GML3", "wfs", "gml"],
					["application/vnd.google-earth.kml+xml", "KML", "wfs", "kml"],
					["application/gpx+xml", "GPX", "wfs", "gpx"]
				],
				"wcs":[
					["image/tiff", "GeoTIFF", "wcs", "tif"]
				]
			},
			"targetCSR": [
				["Native", "", "", ""],
				["EPSG:26713", "EPSG:26713", "epsg", "26713"],
				["EPSG:25832", "EPSG:25832", "epsg", "25832"],
				["EPSG:32632", "EPSG:32632", "epsg", "32632"],
                ["EPSG:3034",  "EPSG:3034", "epsg", "3034"],
				["EPSG:3035",  "EPSG:3035", "epsg", "3035"],
				["EPSG:3416",  "EPSG:3416", "epsg", "3416"],
				["EPSG:4258",  "EPSG:4258", "epsg", "4258"],
				["EPSG:4326",  "EPSG:4326", "epsg", "4326"],
				["EPSG:3857",  "EPSG:900913", "sr-org", "7483"]
			],
            "gazetteerConfig": {
                "addressUrl": "http://sdi.provinz.bz.it/routingservice/rest/gazetteer/GeocodeServer/findAddressCandidates",
                "gazetteerUrl": "http://sdi.provinz.bz.it:8080/deegree-webservices-3.1.1/services?service=WFS",
                "srsName": "EPSG:900913",
                "featureNS": "urn:x-inspire:specification:gmlas:GeographicalNames:3.0",
                "featurePrefix": "gn",
                "featureType": "NamedPlace",
                "geometryName": "geometry",
                "filterProperty": "gn:name/gn:GeographicalName/gn:spelling/gn:SpellingOfName/gn:text"
            }
		}, {
			"ptype":"gxp_downloadtoolaction",
			"downloadTool": "download",
			"actionTarget": ["layertree.contextMenu"]
		}, {
			"ptype":"gxp_languagechoice",
			"languages": [
				["it", "Italiano", "", "it", "Italian language"], 
				["de", "Deutsch", "", "de", "Deutsch language"] 
			],
			"initialLanguage": "it",
			"outputTarget": "paneltbar"
		}
	]
}
