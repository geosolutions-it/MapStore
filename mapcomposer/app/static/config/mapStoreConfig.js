{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ 
		"nrl":{
			"ptype": "gxp_wmssource",
			"title": "NRL GeoServer",
			"projection":"EPSG:900913",
			"url": "http://84.33.2.24/geoserver/ows", "layerBaseParams": {
			   "TILED": true,
			   "TILESORIGIN": "1394190.6211433, 4663756.8332024"
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
			6770799.251963,2705604.806669,8826743.330978,4442826.247111
		],
		
		"layers": [
			
			{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "nrl",
				"title": "National Boundary",
				"name": "nrl:national_boundary",
				"group": "Admin",
				"visibility": true
			},
			{
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
				"name": "nrl:GLOBC2006_v2.2",
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
				"visibility": false
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
				"name": "nrl:POP_settlements_pak_main",
				"group": "Admin",
				"visibility": false
			}
		]
	},
	
	
	"customTools":[
		{
			"actions": ["->"], 
			"actionTarget": "paneltbar"
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
	  }
	]
}