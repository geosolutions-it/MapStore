{
    "restrictToGroups" : ["GeoWeb_Users"],
    "redirectDeniedTo" : "/gcd",
    "groupRedirect":{
        "GCD_Users": "/gcd"
    },
    "portalConfig":{
        "iconCls": "map-icon"
    },
   "header": {
	   "html": "<div class='topbanner'><div id='left-banner'><img src='images/banner/banner_left.png'   height='86' border='0' /> </div><div id='right-banner'><img src='images/banner/banner_right.png'  style='float:right'  border='0' /></div></div>",
	   "css": "<style type='text/css'>div.topbanner{background-image: none;background-color:black;background-position:center top;height:100%;}</style>",
	   "container": {
			"border": false,
			"header": false,
			"collapsible": true,
			"collapseMode":  "mini",
			"hideCollapseTool": true,
			"split": true,
			"animCollapse": false,
			"minHeight": 86,
			"maxHeight": 86,
			"height": 86
	   }
   },
   
   "footer": {
		"html": "<div id=\"footer\"><img src=\"images/banner/logo_footer.png\" > © Hart Energy </div>",
		"css": "<style type='text/css'>#footer{background-color:black;height:100%;text-align:right;color:white;line-height:30px} #footer img{text-align:left; float:left; margin:5px;}</style>",
		"container": {
			"border": false,
			"header": false,
			"split": false,
            "resizable":false,
			"minHeight": 30,
			"maxHeight": 30,
			"height": 30
		}
   },
   
   "scaleOverlayMode": "basic",
   "gsSources":{ 
		"gs": {
			"ptype": "gxp_wmssource",
			"title": "GeoServer Hart Energy",
            "version":"1.1.1",
			"projection":"EPSG:900913",
			"url": "http://he.geo-solutions.it/geoserver/ows",
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
    "tab":true,
    
	"map": {
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
		"layers": [
			{
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
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title": "LNG Terminals",
				"name": "Natural_Gas:NG_LNG",
                "visibility": false
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title": "Natural Gas Compressors",
				"name": "Natural_Gas:NG_COMPR",
                "visibility": false
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title": "Natural Gas Meter Points",
				"name": "Natural_Gas:NG_METER_POINTS",
                "visibility": false
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title": "Natural Gas Pipelines",
				"name": "Natural_Gas:NG_PIPE",
                "visibility": false
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title":"Natural Gas Processing Plant",
				"name": "Natural_Gas:NG_PRPLANT",
                "visibility": false
			},{
				"source": "gs",
                "group": "Natural Gas",
				"title":"Natural Gas Storage",
				"name": "Natural_Gas:NG_STORAGE",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title":"Offshore Blocks",
				"name": "Common_Interest:OFFSH_BLOCKS",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title":"Offshore Groups",
				"name": "Common_Interest:OFFSH_GROUPS",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title": "Offshore Platforms",
				"name": "Common_Interest:OFFSH_PLATF",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title":" Oil & Gas Basins",
				"name": "Common_Interest:BASINS",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title": "Oil Gas Fields",
				"name": "Common_Interest:OIL_GAS_FIELDS",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title": "PLSS Section",
				"name": "Z0_PLSS_1004:PLSS_SEC",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title": "PLSS Township",
				"name": "Z0_PLSS_1004:PLSS_TWN",
                "visibility": false
			},{
				"source": "gs",
                "group": "Common Interest",
				"title": "Top Fields",
				"name": "Common_Interest:TOP_FIELDS",
                "visibility": false
			}
		]
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
          "collapsed": true,
          "collapsible": true,
          "collapseMode":"mini",
          "header": true
      },{
          "xtype": "panel",
          "title": "Query Panel",         
          "border": true,
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
	
    "loginConfig":{
        "authSource":"gs",
        "authParam":"authkey"
    },
    "removeTools":["googleearth_plugin", "googleearth_separator"],
	"customTools":[
		{
		   "ptype": "gxp_addlayersgeostore",
		    "actionTarget": "tree.tbar",
			"id": "addlayers"
		},
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		}, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": false,
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
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		},{
		  "ptype":"gxp_print",
		  "customParams":{
			 "outputFilename":"GeoWeb_Map",
             "forwardHeaders":[],
             "outputFormat":"pdf",
             "geodetic": true,
             "restrictLayout": {
                 "restrictToGroups" : ["Advanced_Users"],
                 "layoutName" : "11x17"                 
             }
		  },
          "includeLegend": false,
          "legendOnSeparatePage":false,
		  "appendLegendOptions": true,
		  "printService":"http://he.geo-solutions.it/geoserver/pdf/",
		  "legendPanelId":"legendPanel",
          "defaultResolutionIndex":1,
          "defaultLayoutIndex":1,
		  "ignoreLayers":["WFSSearch","Marker","WFSsearchMarker","GeoRefMarker","GeoLocation"],
		  "actionTarget":{
			 "target":"paneltbar",
			 "index":4
		  }
        },{
             "ptype": "gxp_wmsgetfeatureinfo_menu",
             "toggleGroup": "toolGroup",
             "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
             "useTabPanel": true,
             "actionTarget": {"target": "paneltbar", "index": 20},
              "vendorParams":{"buffer":10}
         }, {
          "ptype":"gxp_printsnapshothe",
          "service": "http://he.geo-solutions.it/servicebox/",
          "fileName": "GeoWeb_Snapshot.png",
          "actionTarget":{
            "target":"paneltbar",
            "index":5
          }
      }, {
			"ptype": "gxp_enablelabel",
            "strWithLabels": "_with_labels",
			"actionTarget": {"target": "paneltbar", "index": 21}
		}, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "https://github.com/geosolutions-it/MapStore/wiki"
        }, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}, {
            "ptype": "gxp_featuremanagerwmshighlight",
            "pagingType": 1,
            "format": "GML2",
            "id": "featuremanager",
            "disableGeometry": false
	    },{
		  "ptype": "he_feature_grid",
		  "featureManager": "featuremanager",
		  "displayMode":"selected",
		  "outputConfig": {
		  	  "xtype":"gxp_hefeaturegrid",
			  "id": "featuregrid",
			  "title": "Features"
		  },
		  "outputTarget": "south",
		  "showExportCSV":true
	    }, {
          "ptype": "gxp_spatialqueryform",
          "featureManager": "featuremanager",
          "featureGridContainer": "south",
          "outputTarget": "east",
          "showSelectionSummary": true,
          "actions": null,
          "id": "bboxquery",
          "filterLayer":true,
          "outputConfig":{
          		  "spatialSelectorFieldset":{
          		  	"collapsed":true
          		  },
                  "outputSRS": "EPSG:900913",
                  "selectStyle":{
                          "strokeColor": "#ee9900",
                          "fillColor": "#ee9900",
                          "fillOpacity": 0.4,
                          "strokeWidth": 1
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
          },
          "spatialSelectorsConfig":{
                "bbox":{
                    
                    "displayProjection": "EPSG:4326",
                    "metricUnit":"mi",
                    "xtype": "gxp_spatial_bbox_selector",
                    "addGeometryOperation":false,
                    "infoSRS":false
                },
                
                "circle":{
                    "displayProjection": "EPSG:4326",
                    "metricUnit":"mi",
                    "xtype": "gxp_spatial_circle_selector",
                    "addGeometryOperation":false,
                    "zoomToCurrentExtent": false
                }
              }
        },
        {
          "ptype":"gxp_onpageunloadalert"
        }

	]
}
