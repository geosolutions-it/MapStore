{
   "header": {
	   "html": ["<div align='center' style='background-color:#02004B;background-position:right center;background-image:url(../theme/app/img/banner/Header_geoportale_solo_img.jpg);background-repeat: no-repeat;width:100%;height:100%'><a href='http://www.lamma.rete.toscana.it' target='_blank'><img src='../theme/app/img/banner/logolamma_trasp.png' style='float:left;'/></a><img src='../theme/app/img/banner/Geoportale_titolo.png' style='float:right;position:absolute;top:20px;right:10px;'/></div>"],
	   "container": {
			"border": false,
			"header": false,
			"collapsible": true,
			"collapseMode":  "mini",
			"hideCollapseTool": true,
			"split": true,
			"animCollapse": false,
			"minHeight": 90,
			"maxHeight": 90,
			"height": 90
	   }
   },   
   "scaleOverlayMode": "basic",
   "gsSources":{
   		"LaMMA_confini": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geowebcache/service/wms",
			"title": "LaMMA",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layersCachedExtent": [
                -20037508.34, -20037508.34,
                20037508.34, 20037508.34
			]
		},      
   		"LaMMA": {
			"ptype": "gxp_wmssource",
			"url": "http://172.16.1.139:8181/geoserver/wms",
			"title": "LaMMA",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layersCachedExtent": [
                -20037508.34, -20037508.34,
                20037508.34, 20037508.34
			],			
			"layerBaseParams":{
				"FORMAT":"image/png8",
				"TILED":false
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
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [1250000.000000, 5370000.000000],
		"zoom":7,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
        "animatedZooming": {
            "transitionEffect": "resize"
        },
		"layers": [
			{
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
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			},{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "bing",
				"title": "Bing Aerial",
				"name": "Aerial",
				"group": "background"
			},{
				"source": "bing",
				"title": "Bing Aerial With Labels",
				"name": "AerialWithLabels",
				"group": "background"
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
               "format":"image/png8",
               "group":"BATHYMETRY",
               "name":"LAMMA:bathymetry",
               "selected":false,
               "tiled":true,                       
               "source":"LaMMA", 
               "title":"bathymetry",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Surface_wind_gust_surface_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind Gust [kt] 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Surface_wind_gust_surface_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind Gust [kt] 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Surface_wind_gust_surface_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind Gust [kt] 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Surface_wind_gust_surface_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind Gust [kt] 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Surface_wind_gust_surface_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind Gust [kt] 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Temperature_height_above_ground_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"2m Temperature [C] 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Temperature_height_above_ground_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"2m Temperature [C] 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Temperature_height_above_ground_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"2m Temperature [C] 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Temperature_height_above_ground_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"2m Temperature [C] 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Temperature_height_above_ground_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"2m Temperature [C] 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Total_precipitation_surface_Mixed_intervals_Accumulation_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Precipitation Acc. [mm] 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Total_precipitation_surface_Mixed_intervals_Accumulation_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Precipitation Acc. [mm] 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Total_precipitation_surface_Mixed_intervals_Accumulation_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Precipitation Acc. [mm] 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Total_precipitation_surface_Mixed_intervals_Accumulation_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Precipitation Acc. [mm] 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Total_precipitation_surface_Mixed_intervals_Accumulation_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Precipitation Acc. [mm] 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Wind_height_above_ground_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind 10m 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Wind_height_above_ground_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind 10m 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Wind_height_above_ground_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind 10m 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Wind_height_above_ground_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind 10m 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"ARW ECM MODEL DATA",
               "name":"ARW_3KM_RUN00:arw_3km_Wind_height_above_ground_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind 10m 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Mean_period_of_wind_waves_surface_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Period [s] 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Mean_period_of_wind_waves_surface_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Period [s] 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Mean_period_of_wind_waves_surface_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Period [s] 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Mean_period_of_wind_waves_surface_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Period [s] 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Mean_period_of_wind_waves_surface_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Period [s] 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Sig_height_of_wind_waves_and_swell_surface_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Significant Wave Height [m] 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Sig_height_of_wind_waves_and_swell_surface_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Significant Wave Height [m] 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Sig_height_of_wind_waves_and_swell_surface_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Significant Wave Height [m] 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Sig_height_of_wind_waves_and_swell_surface_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Significant Wave Height [m] 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Sig_height_of_wind_waves_and_swell_surface_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Significant Wave Height [m] 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Direction_of_wind_waves_surface_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Direction 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Direction_of_wind_waves_surface_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Direction 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Direction_of_wind_waves_surface_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Direction 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Direction_of_wind_waves_surface_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Direction 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Direction_of_wind_waves_surface_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Mean Wave Direction 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Wind_surface_20121107T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind surface 2012-11-07",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Wind_surface_20121110T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind surface 2012-11-10",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Wind_surface_20121113T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind surface 2012-11-13",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Wind_surface_20121116T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind surface 2012-11-16",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"WW3 MODEL DATA",
               "name":"WW3_3KM_RUN00:ww3_hiwhi_Wind_surface_20121119T000000000Z",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Wind surface 2012-11-19",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"TUSCANY ROMS MODEL DATA",
               "name":"",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"",
               "transparent":true,
               "visibility":true,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"SATELLITE DATA",
               "name":"LAMMA:clorofilla",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Chlorophyll",
               "transparent":true,
               "visibility":true,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"SATELLITE DATA",
               "name":"LAMMA:sst",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Sea Surface Temperature",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group":"SATELLITE DATA",
               "name":"LAMMA:tsm",
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA", 
               "title":"Total Suspended Matter",
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913"
            },{
               "format":"image/png8",
               "group": "RAIN",
               "name":"LAMMA:pioggia",
               "selected":false,                   
               "source":"LaMMA", 
               "title":"Rain",
               "selected":false,
               "tiled":false,                 
               "transparent":true,
               "visibility":false,
               "srs":"EPSG:900913",
               "displayInLayerSwitcher": true
            },{
               "format":"image/png",
               "group": "BOUNDARIES",
               "name":"confini_mondiali_stati",
               "selected":false,                   
               "source":"LaMMA_confini", 
               "styles":["confini"],
               "style":["confini"],
               "title":"Stati",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:900913",
               "queryable": false,
               "displayInLayerSwitcher": true
            },{
               "format":"image/png",
               "group": "BOUNDARIES",
               "name":"confini_mondiali_regioni",
               "selected":false,                   
               "source":"LaMMA_confini", 
               "styles":["confini"],
               "style":["confini"],
               "title":"Regioni",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:900913",
               "queryable": false,
               "displayInLayerSwitcher": true
            },{
               "format":"image/png",
               "group": "BOUNDARIES",
               "name":"confini_mondiali_provincie",
               "selected":false,                   
               "source":"LaMMA_confini", 
               "styles":["confini"],
               "style":["confini"],
               "title":"Province",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:900913",
               "queryable": false,
               "displayInLayerSwitcher": true
            },{
               "format":"image/png",
               "group": "BOUNDARIES",
               "name":"comuni",
               "selected":false,                   
               "source":"LaMMA_confini", 
               "styles":["confini"],
               "style":["confini"],
               "title":"Comuni Italia",
               "transparent":true,
               "visibility":false,
               "ratio":1,
               "srs":"EPSG:900913",
               "queryable": false,
               "displayInLayerSwitcher": true
            },{
               "format":"image/png8",
               "group":"IN SITU DATA",
               "name":"LAMMA:giglio_porto",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA",
               "title":"Giglio tide gauge",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "giglio_porto",
               "tabCode": "codice",
               "graphAttribute": ["temp_med_acq","vel_ven_med","dir_ven_prev","liv_mar_ist"],
               "elevation":"0.0"
            },{
               "format":"image/png8",
               "group":"IN SITU DATA",
               "name":"LAMMA:portate",
               "opacity":0.9,
               "selected":false,
               "tiled":false,                       
               "source":"LaMMA",
               "title":"River flow rate",
               "transparent":true,
               "visibility":true,
               "ratio":1,
               "srs":"EPSG:900913",
               "getGraph": true,
               "graphTable": "portate",
               "tabCode": "codice",
               "graphAttribute": ["portata"],
               "elevation":"0.0"
            }
		]
	},
    "removeTools":["wmsgetfeatureinfo_menu_separator","wmsgetfeatureinfo_menu_plugin"],
    "customPanels":[],	
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
	"customTools":[
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		},{
            "ptype":"gxp_wmsgetfeatureinfo",
            "id": "wmsgetfeatureinfo_plugin",
            "toggleGroup":"toolGroup",
            "closePrevious": true,
            "useTabPanel": true,
            "infoPanelId": "",
            "disableAfterClick": false,
            "loadingMask": true,
			"maxFeatures": 100,
            "actionTarget":{
                "target":"paneltbar",
                "index":20
            }
        }, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
            "ptype": "gxp_wfsgetgraphs",
            "toggleGroup": "toolGroup",
            "url": "http://172.16.1.139:8181/geoserver/ows?",
            "actionTarget": {
                "target": "paneltbar",
                "index": 22
            }
        }, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
            "ptype":"gxp_playback",
            "playbackMode": "track",
            "labelButtons": false,
            "timeFormat": "l, F d, Y g:i:s A",
            "outputTarget": "map",
            "outputConfig": {
                "controlConfig":{
                    "step": 1,
                    "units": "Days",
                    "range": ["2012-11-01T00:00:00.000Z", "2012-11-30T00:00:00.000Z"],
                    "frameRate": 1
                }
            }
        }, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": "never",
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}
	]
}
