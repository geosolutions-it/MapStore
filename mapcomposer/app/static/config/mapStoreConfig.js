{
   "geoStoreBase":"http://localhost:8080/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
   "gsSources":{ 
		"nrl":{
			"ptype": "gxp_wmssource",
			"title": "NRL GeoServer",
			"projection":"EPSG:900913",
			"url": "http://84.33.2.24/geoserver/ows"
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
				"name": "nrl:National_Boundary",
				"group": "Boundaries",
				"visibility": false
			},{
				"source": "nrl",
				"title": "GLOBC 2006",
				"name": "nrl:GLOBC2006_v2.2",
				"group": "Global Coverages",
				"visibility": false
			},{
				"source": "nrl",
				"title": "GLOBC 2009",
				"name": "nrl:GLOBC2009_v2.3",
				"group": "Global Coverages",
				"visibility": false
			},
			{
				"source": "nrl",
				"title": "Province Boundary",
				"name": "nrl:Province_Boundary",
				"group": "Boundaries",
				"visibility": true
			},
			{
				"source": "nrl",
				"title": "District Boundary",
				"name": "nrl:District_Boundary",
				"group": "Boundaries",
				"visibility": true
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