{
    "geoStoreBase": "/geostore/rest/",
   "proxy":"/http_proxy/proxy/?url=",
   "defaultLanguage": "en",
    "tab": true,
    "header": {
        "container": {
            "border": false,
            "header": false,
            "collapsible": true,
            "collapsed": false,
            "collapseMode": "mini",
            "hideCollapseTool": true,
            "split": true,
            "animCollapse": false,
            "minHeight": 90,
            "maxHeight": 90,
            "height": 109,
            "id": "header"
        },
        "html": [ "<div align=\"center\" style=\"background-image:url(theme/app/img/banner/bgimg-punjab.jpg);background-repeat: repeat;width:100%;height:100%\">",
                            "<img  src=\"theme/app/img/banner/left-banner_en-punjab.jpg\" style=\"float:left\" usemap=\"#IM_left-banner\"/>",
                            "<img  src=\"theme/app/img/banner/right-banner_en-punjab.jpg\" style=\"float:right;position:absolute;top:0px;right:0px;\" usemap=\"#IM_right-banner\"/>",
                        "</div>",
                        "<map name=\"IM_left-banner\">",
                            "<area shape=\"rect\" coords=\"19,19,393,44\" href=\"http://dwms.fao.org/~test/home_en.asp\"  target=\"_blank\" alt=\"Pakistan Agriculture Information System\" title=\"Pakistan Agriculture Information System\"    />",
                        "</map>",
                        "<map name=\"IM_right-banner\">",
                            "<area shape=\"rect\" coords=\"330,23,382,83\" href=\"http://www.fao.org\"  target=\"_blank\" alt=\"Food and Agriculture Organization of the United Nations\" title=\"Food and Agriculture Organization of the United Nations\"    />",
                            "<area shape=\"rect\" coords=\"274,23,325,83\" href=\"http://www.usda.gov/wps/portal/usda/usdahome\"  target=\"_blank\" alt=\"U.S. Department of Agriculture\" title=\"U.S. Department of Agriculture\"    />",
                            "<area shape=\"rect\" coords=\"205,23,268,83\" href=\"http://www.umd.edu/\"  target=\"_blank\" alt=\"University of Maryland\" title=\"University of Maryland\"    />",
                            "<area shape=\"rect\" coords=\"142,23,204,83\" href=\"http://www.suparco.gov.pk/\"  target=\"_blank\" alt=\"SUPARCO - Pakistan Space and Upper Atmosphere Research Commission\" title=\"SUPARCO - Pakistan Space and Upper Atmosphere Research Commission\"    />",
                            "<area shape=\"rect\" coords=\"85,23,141,83\" href=\"http://www.agripunjab.gov.pk/index.php\"  target=\"_blank\" alt=\"PUNJAB Province\" title=\"PUNJAB Province\"    />",
                        "</map>"]
    },
   "gsSources":{ 
		"nrl":{
			"ptype": "gxp_wmssource",
			"title": "NRL GeoServer",
			"projection":"EPSG:900913",
            "url": "/geoserver/ows",
            "layersCachedExtent": [
                5009377.085000001,
                0.0,
                10018754.169999998,
                5009377.085000001
			],
			"layerBaseParams": {
			   "format":"image/png8",
			   "TILED": true
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
		"center": [
			8054124.2328421,
			3621546.0222466
		],
		"zoom":6,
		"maxExtent": [
            -20037508.34,
            -20037508.34,
            20037508.34,
            20037508.34
		],
		"layers": [
			{
				"id" :"Crop_Province",
				"source": "nrl",
				"title": "nrl:province_crop",
				"name": "nrl:province_crop",
				"displayInLayerSwitcher":false,
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "nrl:district_crop",
				"name": "nrl:district_crop",
				"displayInLayerSwitcher":false,
				"visibility": false
            },
            {
				"source": "nrl",
                "title": "nrl:province_view",
                "name": "nrl:province_view",
				"displayInLayerSwitcher":false,
				"visibility": false
            },
            {
				"source": "nrl",
                "title": "nrl:district_view",
                "name": "nrl:district_view",
				"displayInLayerSwitcher":false,
				"visibility": false
            },
            {
                "source": "nrl",
                "title": "nrl:district_select",
                "name": "nrl:district_select",
                "displayInLayerSwitcher": false,
                "visibility": false
            },
            {
                "source": "nrl",
                "title": "nrl:province_select",
                "name": "nrl:province_select",
                "displayInLayerSwitcher": false,
                "visibility": false
            },
            {
                "source": "mapquest",
                "title": "MapQuest OpenStreetMap",
                "name": "osm",
                "group": "background",
                "visibility": true
            },
            {
                "source": "osm",
                "title": "Open Street Map",
                "name": "mapnik",
                "group": "background",
                "visibility": false
            },
            {
                "source": "google",
                "title": "Google Terrain",
                "name": "TERRAIN",
                "group": "background",
                "visibility": false
            },
            {
                "source": "google",
                "title": "Google Hybrid",
                "name": "HYBRID",
                "group": "background",
                "visibility": false
            },
            {
                "source": "google",
                "title": "Google Roadmap",
                "name": "ROADMAP",
                "group": "background",
                "visibility": false
            },
            {
				"source": "nrl",
				"title": "Administrative",
				"name": "nrl:g0gen_pak",
				"format":"image/jpeg",
				"group": "background",
				"visibility": true,
                "layersCachedExtent": [
                    -20037508.34,
                    -20037508.34,
                    20037508.34,
                    20037508.34
                ]
            },
            {
					"source": "ol",
					"group": "background",
					"fixed": true,
					"type": "OpenLayers.Layer",
					"visibility": false,
					"args": [
                    "None",
                    {
                        "visibility": false
                    }
					]
            },
            {
				"source": "nrl",
				"title": "Province Boundary",
                "name": "nrl:province_view",
				"styles":"Province_Boundary_PUNJAB_style",
				"group": "Admin",
				"visibility": true
            },
            {
				"source": "nrl",
				"title": "Flooded Areas 2012",
				"name": "nrl:flood_pak_2012",
				"group": "Flooding",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Flooded Areas 2011",
				"name": "nrl:flood_pak_2011",
				"group": "Flooding",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Flooded Areas 2010",
				"name": "nrl:flood_pak_2010",
				"group": "Flooding",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Contours 1000ft",
				"name": "nrl:ETOPO2v2c_1000ft_conts_ln_pak",
				"group": "Topography",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Crop Mask",
				"name": "nrl:crop_mask_pak_2012",
				"group": "Land Cover",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Land cover 2010",
				"name": "nrl:LULC2010_Pak",
				"group": "Land Cover",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Land cover 2000",
				"name": "nrl:LULC2000_Pak_wgs84",
				"group": "Land Cover",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "GlobCover 2005-06",
				"name": "nrl:GLOBC2006_v2.2",
				"group": "Land Cover",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "GlobCover 2009",
				"name": "nrl:GLOBC2009_v2.3",
				"group": "Land Cover",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Rivers",
				"name": "nrl:rivers_pak",
				"group": "Hydrology",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Indus River",
				"name": "nrl:indus_river_course",
				"group": "Hydrology",
				"visibility": true
            },
            {
				"source": "nrl",
				"title": "Roads",
				"name": "nrl:roads_pak",
				"group": "Transportation",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "District Boundary",
                "name": "nrl:district_view",
				"group": "Admin",
				"visibility": true
            },
            {
				"source": "nrl",
				"title": "MeteoData",
				"name": "nrl:met_stations",
				"group": "Meteo Stations",
				"visibility": false
            },
            {
				"source": "nrl",
				"title": "Populated Places",
				"buffer": "5",
				"name": "nrl:POP_settlements_pak_main",
				"group": "Admin",
				"visibility": true
            },
            {
				"source": "nrl",
				"title": "Label",
				"name": "nrl:adminisrative_labels",
				"group": "Admin",
				"visibility": true,
                "layersCachedExtent": [
                    -20037508.34,
                    -20037508.34,
                    20037508.34,
                    20037508.34
                ]
			}
		]
	},
	"customTools":[
		{
            "id": "gxp_portal_staticpage",
            "ptype": "gxp_staticpage",
            "url": "http://dwms.fao.org/~test/croportal/home_en.asp",
            "tabPosition": 0,
            "tabTitle": "Portal",
            "forceMultiple": true
        },
        {
            "ptype": "gxp_staticpage",
            "url": "/geonetwork",
            "tabPosition": 10,
            "tabTitle": "Geonetwork",
            "forceMultiple": true
        },
        {
			"ptype": "gxp_zoomtoextent",
			"extent": [
				7716818.2432735665,
				3211840.3161634086,
				8391430.222410692,
				4031251.7283298243 
],
            "actionTarget": {
                "target": "paneltbar",
                "index": 2
            }
        },
        {
            "ptype": "gxp_printsnapshot",
            "service": "/servicebox/",
            "customParams": {
                "outputFilename": "mapstore-print"
            },
            "actionTarget": {
                "target": "paneltbar",
                "index": 3
            },
            "disabledIn": ["internetExplorer", "Firefox"]
        },
        {
		  "ptype":"gxp_print",
		  "customParams":{
			 "outputFilename":"mapstore-print"
		  },
            "printService": "/geoserver/pdf/",
		  "legendPanelId":"legendPanel",
            "ignoreLayers": [
                "WFSSearch",
                "Marker"
            ],
		  "appendLegendOptions":true,
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":4
		  }
        },
        {
            "ptype": "gxp_geolocationmenu",
            "actionTarget": {
                "target": "paneltbar",
                "index": 16
            }
        },
        {
           "ptype":"gxp_ndvi",
            "dataUrl": "/geoserver/ows",
            "layer":"ndvi:ndvi",
            "outputConfig":{
                  "title":"NDVI",
                  "id":"ndvi",
                  "region":"east",
                  "replace":"false"
           },
           "outputTarget":"east"
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
            "id": "CropData",
            "mapToolPosition": 18,
            "layerStyle": {
                "strokeColor": "red",
                "strokeWidth": 1,
                "fillOpacity": 0.2,
                "cursor": "pointer"
            },
            "dataUrl": "/geoserver/ows",
            "rangesUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
            "unitsUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:measure_units_for_crop&outputFormat=json",
            "highChartExportUrl": "/highcharts-export/",
            "sourcesUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_sources&outputFormat=json",
		  "layers":{
			"district":"nrl:district_crop",
                "province": "nrl:province_view"
			},
		  "outputConfig":{
			 "itemId":"nrlCropData"
		  },
            "outputTarget": "nrl",
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_cropdata_en.asp"
        },
        {
	    "ptype":"nrl_agromet",
            "layerStyle": {
                "strokeColor": "green",
                "strokeWidth": 1,
                "fillOpacity": 0.2,
                "cursor": "pointer"
            },
            "dataUrl": "/geoserver/ows",
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&max&outputFormat=json",
            "highChartExportUrl": "/highcharts-export/",
		"areaFilter": "province NOT IN ('DISPUTED TERRITORY','DISPUTED AREA')",
		"titleText": "Agromet Variables",
		  "outputConfig":{
			 "id":"Agromet"
		  },
            "outputTarget": "nrl",
            "layers": {
                "district": "nrl:district_select",
                "province": "nrl:province_view"
            },
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_agromet_en.asp"
        },
        {
            "ptype": "nrl_fertilizers",
            "layerStyle": {
                "strokeColor": "purple",
                "strokeWidth": 1,
                "fillOpacity": 0.2,
                "cursor": "pointer"
            },
            "typeNameData": "nrl:fertilizer_data",
            "dataUrl": "/geoserver/ows",
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&max&outputFormat=json",
            "metadataUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:fertilizers_metadata&outputFormat=json",
            "highChartExportUrl": "/highcharts-export/",
            "titleText": "Fertilizers",
            "outputConfig": {
                "id": "Fertilizers"
            },
            "outputTarget": "nrl",
            "layers": {
                "district": "nrl:district_crop",
                "province": "nrl:province_view"
            },
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_fertilizer_en.asp"
	  },{
            "ptype": "nrl_irrigation",
            "layerStyle": {
                "strokeColor": "aqua",
                "strokeWidth": 1,
                "fillOpacity": 0.3,
                "cursor": "pointer"
            },
            "dataUrl": "/geoserver/ows",
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:measure_units_for_crop&outputFormat=json",
            "defaultUOMFlow":"1",
            "defaultUOMSupply":"1",
            "metadataFlowUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:irrigation_metadata_flow&outputFormat=json",
            "metadataSupplyUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:irrigation_metadata_supply&outputFormat=json",
            "highChartExportUrl": "/highcharts-export/",
            "titleText": "Water Resources",
            "outputConfig": {
                "id": "Irrigation"
            },
            "outputTarget": "nrl",
            "layers": {
                "province": "nrl:province_view",
                "district": "nrl:district_crop"
            },
            "areaFilter": "province NOT IN ('DISPUTED TERRITORY','DISPUTED AREA')",
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_water_en.asp"
        },
        {
            "ptype": "nrl_market_prices",
            "layerStyle": {
                "strokeColor": "orange",
                "strokeWidth": 1,
                "fillOpacity": 0.3,
                "cursor": "pointer"
            },
            "currencies": [
                [
                    "usd",
                    "US Dollars"
                ],
                [
                    "pkr",
                    "PK Rupees"
                ]
            ],
            "defaultCurrency": "pkr",
            "defaultDenominator": "0.4",
            "dataUrl": "/geoserver/ows",
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:measure_units_for_crop&outputFormat=json",
            "metadataUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:marketprices_metadata&outputFormat=json",
            "highChartExportUrl": "/highcharts-export/",
            "titleText": "Market Prices",
            "outputConfig": {
                "id": "Market Prices"
            },
            "outputTarget": "nrl",
            "layers": {
                "province": "nrl:province_view",
                "district": "nrl:district_crop"
            },
            "areaFilter": "province NOT IN ('DISPUTED TERRITORY','DISPUTED AREA')",
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_market_en.asp"
        },
        {
		"ptype":"nrl_crop_status",
            "layerStyle": {
                "strokeColor": "blue",
                "strokeWidth": 1,
                "fillOpacity": 0.2,
                "cursor": "pointer"
            },
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&max&outputFormat=json",
            "rangesUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
            "dataUrl": "/geoserver/ows",
            "highChartExportUrl": "/highcharts-export/",
		  "outputConfig":{
			 "id":"nrlCropStatus" 
		  },
            "outputTarget": "nrl",
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_status_en.asp"
        },
        {
		  "ptype":"nrl_report_crop_data",
            "cropPluginRef": "CropData",
            "factorsurl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&max&outputFormat=json",
            "rangesUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
            "unitsUrl": "/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:measure_units_for_crop&outputFormat=json",
            "dataUrl": "/geoserver/ows",
            "highChartExportUrl": "/highcharts-export/",
		  "outputConfig":{
			 "id":"nrlReportCropData"
		  },
		  "layers":{
			"district":"nrl:district_crop",
                "province": "nrl:province_view"
			},
		    "targetLayerStyle":{
		        "strokeColor": "green",
		        "strokeWidth": 2,
		        "fillOpacity":0
		    },
		  "defaultAreaTypeMap": "district",
		  "disclaimerText": "Disclaimer: Data, information and products in this report are provided \"as is\", without warranty of any kind, either express or implied. All rights are reserved by the Government of Pakistan",
            "areaFilter": "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
            "outputTarget": "nrl",
            "portalRef": "gxp_portal_staticpage",
            "helpPath": "/~test/croportal/hlp_report_en.asp"
        },
        {
		  "ptype":"gxp_printreporthelper",
            "printService": "/geoserver/pdf/",
            "dataUrl": "/geoserver/ows",
            "defaultExtent": [
                6770799.251963,
                2705604.806669,
                8826743.330978,
                4442826.247111
            ],
		  "id":"printreporthelper",
		  "hideAll":true,
		  "mapTitleValueText": "Crop Report",
		  "cropPagesTitleValueText": "Crop Maps and Charts",
		  "meteorologicalPagesTitleValueText": "AgroMet Variables"
        },
        {
            "actions": [
                "->"
            ],
			"actionTarget": "paneltbar"
        },
        {
			"ptype":"gxp_geostore_login",
            "loginService": "/geostore/rest/users/user/details/",
			"enableAdminGUILogin": true,
            "renderAdminToTab": true,
            "autoLogin": true,
            "adminGUIUrl": "/manager",
            "adminGUIHome": "",
    		"adminLoginInvalidResponseValidator": "No AuthenticationProvider found",
			"isDummy":false,
			"actionTarget": "paneltbar"
        },
        {
            "ptype":"gxp_disclaimer",
            "id": "disclaimer",
            "actionTarget": "appTabs.bbar",
            "text":"Disclaimer",
            "tooltip":"Open the Disclaimer",
            "index": 26,
            "showOnStartup":false,
            "iconCls":"icon-about",
            "portalRef": "gxp_portal_staticpage",
            "disclaimerPath": "/~test/croportal/doc_cip_disclaimer_en.asp"
	  }
	]
}
