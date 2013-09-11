{
   "geoStoreBase":"",
   "gnBaseUrl": "http://localhost:8080/geonetworkbz/",
   "proxy":"/proxy/?url=",
   "defaultLanguage": "it",
   "tab": true,
   "gsSources":{ 
   		"geosol":{
			"ptype": "gxp_wmssource",
			"url": "http://localhost:8080/geoserver/wms",
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
             "service": "http://localhost:8080/servicebox/",
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
			"readOnlyLayerSelection": true,
			"removePreviousLayerOnSelection": false,
			"id": "download",
			"outputTarget": "west",
            "wpsUrl": "http://localhost:8080/geoserver/ows?service=WPS",
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
				["Native"],
				["EPSG:26713"],
				["EPSG:25832"],
				["EPSG:32632"],
                ["EPSG:3034"],
				["EPSG:3035"],
				["EPSG:3416"],
				["EPSG:4258"],
				["EPSG:4326"],
				["EPSG:900913"]
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
		}
	],
    "proj4jsDefs":{
        "EPSG:26713":"+proj=utm +zone=13 +ellps=clrk66 +datum=NAD27 +units=m +no_defs",
        "EPSG:25832":"+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs",
        "EPSG:32632":"+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:2056":"+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
        "EPSG:21781":"+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
        "EPSG:23031":"+proj=utm +zone=31 +ellps=intl +units=m +no_defs",
        "EPSG:23032":"+proj=utm +zone=32 +ellps=intl +units=m +no_defs",
        "EPSG:2397":"+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs",
        "EPSG:2398":"+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs",
        "EPSG:2399":"+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs",
        "EPSG:25833":"+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3034":"+proj=lcc +lat_1=35 +lat_2=65 +lat_0=52 +lon_0=10 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3035":"+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3043":"+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3044":"+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3045":"+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs",
        "EPSG:3068":"+proj=cass +lat_0=52.41864827777778 +lon_0=13.62720366666667 +x_0=40000 +y_0=10000 +ellps=bessel +datum=potsdam +units=m +no_defs",
        "EPSG:31251":"+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31252":"+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31253":"+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31254":"+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31255":"+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31256":"+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31257":"+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31258":"+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31259":"+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31281":"+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=0 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31282":"+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31283":"+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=0 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31284":"+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31285":"+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31286":"+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31287":"+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
        "EPSG:31288":"+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=150000 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31289":"+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=450000 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31290":"+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=750000 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
        "EPSG:31466":"+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs",
        "EPSG:31467":"+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs",
        "EPSG:31468":"+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs",
        "EPSG:31469":"+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs",
        "EPSG:32631":"+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:32633":"+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:32634":"+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:3326":"+proj=tmerc +lat_0=0 +lon_0=28 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
        "EPSG:3333":"+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
        "EPSG:3396":"+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +no_defs",
        "EPSG:3397":"+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
        "EPSG:3399":"+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +no_defs",
        "EPSG:3416":"+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=GRS80 +units=m +no_defs",
        "EPSG:4258":"+proj=longlat +ellps=GRS80 +no_defs"
   }
}
