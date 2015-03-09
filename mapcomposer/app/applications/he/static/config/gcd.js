{
    "portalConfig":{
		"header":false
	},
    "gsSources":{ 
		"gs": {
			"ptype": "gxp_wmssource",
			"title": "GeoServer Hart Energy",
            "version":"1.1.1",
			"projection":"EPSG:900913",
			"url": "http://he.geo-solutions.it/geoserver/ows?&authkey=2ce78958-821e-4f4c-a677-67e3224862e9",
			"layersCachedExtent":[-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7],
			"authParam":"authkey",
			"layerBaseParams": {
					"TILED": true,
                    "FORMAT":"image/png8",
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
    "map":{
        "projection": "EPSG:900913",
		"units": "m",
		"center":[
         -10485835.573159,
         4435633.7663721
          ],
          "zoom":4,
          "maxExtent":[
             -20037508.34,
             -20037508.34,
             20037508.34,
             20037508.34
          ],
        "layers": [{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background",
                "visibility": true
			},{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background",
                "visibility": false
			},{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background",
                "visibility": false
			},{
				"source": "bing",
				"title": "Bing Aerial With Labels",
				"name": "AerialWithLabels",
				"group": "background",
                "visibility": false
			},{
				"source": "google",
				"title": "Google Terrain",
				"name": "TERRAIN",
				"group": "background",
                "visibility": false
			},{
				"source": "google",
				"title": "Google Hybrid",
				"name": "HYBRID",
				"group": "background",
                "visibility": false
			},{
				"source": "google",
				"title": "Google Roadmap",
				"name": "ROADMAP",
				"group": "background",
                "visibility": false
			}]
        
    },
    "disableLayerChooser":true,
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
    "loginConfig":{
        "authSource":"gs",
        "authParam":"authkey"
    },
    "customPanels":[
        {
          "xtype": "panel",
          "border": true,
          "id": "west",
          "width": 300,
          "height": 500,
          "region": "west",
          "layout": "fit",
          "collapsed": false,
          "collapsible": true,
          "header": true
      }
    ],
        "mapPanelContainerPanels":[{   
          "xtype": "panel",
          "title": "Results",
          "border": true,
          "id": "south",
          "region": "south",
          "layout": "fit",
          "height": 280,
          "collapsed": true,
          "collapsible": true,
          "collapseMode":"mini",
          "header": true
      }],
    "removeTools":["gxp_wmsgetfeatureinfo_menu"],
	"customTools":[
		{
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"ptype": "gxp_wmsgetfeatureinfo", 
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 24}
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		},{
          "id":"gcd",
		  "ptype":"he_gcd",
		  "outputConfig":{
			 "id":"gcd",
			 "region":"east",
			 "startTab":"CapacityDataForm"
		  },
		  "outputTarget":"west"
	   }, {
        "id": "capacity_data",
	    "ptype":"he_capacity_data",
        "layerStyle":{"strokeColor":"green","strokeWidth":1,"fillOpacity":0.2,"cursor":"pointer"}, 
		"titleText": "Capacity",
        "geoServerUrl":"http://he.geo-solutions.it/geoserver/ows?&authkey=2ce78958-821e-4f4c-a677-67e3224862e9",
        "source": "gs",
        "layerName":"gascapacity:gcd_v_scheduled_capacity_by_pipeline",
        "statesLayer":"gascapacity:gcd_lst_States",
        "countryLayer":"gascapacity:gcd_lst_USCounties",
        "pipelineNameLayer":"gascapacity:gcd_lst_Pipelines",
        "featureManager": "featuremanager",
        "featureGridContainer":"south",
		  "outputConfig":{
			 "id":"CapacityDataForm"
			 
		  },
		  "outputTarget":"gcd"
	  },{
	    "ptype":"he_shippers",
        "geoServerUrl":"http://he.geo-solutions.it/geoserver/ows?&authkey=2ce78958-821e-4f4c-a677-67e3224862e9",
        "source": "gs",
        "countryLayer":"gascapacity:gcd_lst_USCounties",
        "pipelineNameLayer":"gascapacity:gcd_lst_Pipelines",
        "shipperNamesLayer":"gascapacity:ioc_lst_ShipperNames",
        "layerStyle":{"strokeColor":"green","strokeWidth":1,"fillOpacity":0.2,"cursor":"pointer"}, 
		"titleText": "Shippers",
		  "outputConfig":{
			 "id":"ShippersForm"
			 
		  },
		  "outputTarget":"gcd"
	  },{
	    "ptype":"he_gcd_statistics",
        "layerStyle":{"strokeColor":"green","strokeWidth":1,"fillOpacity":0.2,"cursor":"pointer"},
        "geoServerUrl":"http://he.geo-solutions.it/geoserver/ows?&authkey=2ce78958-821e-4f4c-a677-67e3224862e9",
        "source": "gs",
        "countryLayer":"gascapacity:gcd_lst_USCounties",
        "pipelineNameLayer":"gascapacity:gcd_lst_Pipelines",
        "layerName":"gascapacity:test_capacity_point",
        "layerSource":"gs",
		"titleText": "Statistics",
		  "outputConfig":{
			 "id":"MapperaForm"
			 
		  },
		  "outputTarget":"gcd"
	  }, {
		  "ptype": "gxp_featuremanager",
          "remoteSort":true,
          "pagingType": 1,
          "format": "JSON",
		  "id": "featuremanager",
          "autoSetLayer":false
	    }, {
		  "ptype": "he_results_grid",
          
		  "featureManager": "featuremanager",
          "customActionsProvider":"gcd",
          "customColumnsProvider": "gcd",
		  "outputConfig": {
			  "id": "capacity_grid",
              "region":"south",
              "height":300,
              "collapsible":true,
              "collapsed":false,
              "header":false,
              "mask": {"msg":"Please wait..."}
			  
		  },
		  "outputTarget": "south",
		  "showExportCSV": true
	    }
	]
}
