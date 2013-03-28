{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ 
		"nrl":{
			"ptype": "gxp_wmssource",
			"title": "NRL GeoServer",
			"projection":"EPSG:900913",
			"url": "http://84.33.2.24/geoserver/ows", 
			"layerBaseParams": {
			   "format":"image/png8",
			   
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
	"proj4jsDefs":{
		"EPSG:32642":"+proj=utm +zone=42 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"

	},
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [7798771.2914706,3574215.5268897],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34, 20037508.34, 20037508.34
		],
		
		"layers": [
			{
				"id" :"Crop_Province",
				"source": "nrl",
				"title": "nrl:province_crop",
				"name": "nrl:province_crop",
				"displayInLayerSwitcher":false,
				"visibility": false
			},	{
				"source": "nrl",
				"title": "nrl:district_crop",
				"name": "nrl:district_crop",
				"displayInLayerSwitcher":false,
				"visibility": false
			},{
				"source": "nrl",
				"title": "nrl:province_boundary",
				"name": "nrl:province_boundary",
				"displayInLayerSwitcher":false,
				"visibility": false
			},	{
				"source": "nrl",
				"title": "nrl:district_boundary",
				"name": "nrl:district_boundary",
				"displayInLayerSwitcher":false,
				"visibility": false
			},{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "nrl",
				"title": "Administrative",
				"name": "nrl:g0gen_pak",
				"format":"image/jpeg",
				"group": "background",
				"visibility": true
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
				"source": "nrl",
				"title": "Province Boundary",
				"name": "nrl:province_boundary",
				"group": "Admin",
				"visibility": true
			},{
				"source": "nrl",
				"title": "Flooded Areas 2012",
				"name": "nrl:flood_pak_2012",
				"group": "Flooding",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Flooded Areas 2011",
				"name": "nrl:flood_pak_2011",
				"group": "Flooding",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Flooded Areas 2010",
				"name": "nrl:flood_pak_2010",
				"group": "Flooding",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Contours 1000ft",
				"name": "nrl:ETOPO2v2c_1000ft_conts_ln_pak",
				"group": "Topography",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Crop Mask",
				"name": "nrl:crop_mask",
				"group": "Land Cover",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Land cover 2010",
				"name": "nrl:LULC2010_Pak",
				"group": "Land Cover",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Land cover 2000",
				"name": "nrl:LULC2000_Pak_wgs84",
				"group": "Land Cover",
				"visibility": false
			},{
				"source": "nrl",
				"title": "GlobCover 2005-06",
				"name": "nrl:GLOBC2006_v2.2",
				"group": "Land Cover",
				"visibility": false
			},{
				"source": "nrl",
				"title": "GlobCover 2009",
				"name": "nrl:GLOBC2009_v2.3",
				"group": "Land Cover",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Rivers",
				"name": "nrl:rivers_pak",
				"group": "Hydrology",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Indus River",
				"name": "nrl:indus_river_course",
				"group": "Hydrology",
				"visibility": true
			},{
				"source": "nrl",
				"title": "Roads",
				"name": "nrl:roads_pak",
				"group": "Transportation",
				"visibility": false
			},{
				"source": "nrl",
				"title": "District Boundary",
				"name": "nrl:district_boundary",
				"group": "Admin",
				"visibility": true
			},{
				"source": "nrl",
				"title": "MeteoData",
				"name": "nrl:met_stations",
				"group": "Meteo Stations",
				"visibility": false
			},{
				"source": "nrl",
				"title": "Populated Places",
				"buffer": "5",
				"name": "nrl:POP_settlements_pak_main",
				"group": "Admin",
				"visibility": true
			}
		]
	},
	
	
	"customTools":[
		{
			"ptype": "gxp_zoomtoextent",
			"extent": [	6770799.251963,2705604.806669,8826743.330978,4442826.247111 ],
			"tooltip":"zoom to Pakistan Extent",
			"actionTarget": {"target": "paneltbar", "index": 2}
		 },
		
		{
		  "ptype":"gxp_nrl",
		  "outputConfig":{
			 "id":"nrl",
			 "region":"east",
			 "startTab":"nrlCropData"
		  },
		  "outputTarget":"west"
	   },
	   {
		  "ptype":"nrl_crop_data",
		  "layers":{
			"district":"nrl:district_crop",
			"province":"nrl:province_crop"
			},
		  "outputConfig":{
			 "itemId":"nrlCropData"
			 
		  },
		  "outputTarget":"nrl"
	   },{
		 "ptype":"nrl_crop_status",
		  "outputConfig":{
			 "id":"nrlCropStatus"
			 
		  },
		  "outputTarget":"nrl"
	   },{
	    "ptype":"nrl_agromet",
		  "outputConfig":{
			 "id":"Agromet"
			 
		  },
		  "outputTarget":"nrl"
	  },{
			"actions": ["->"], 
			"actionTarget": "paneltbar"
	  },{
			"ptype":"gxp_login",
			"loginService":"http://localhost:8081/ciao",
			"isDummy":true,
			"actionTarget": "paneltbar"
	  }
	]
}