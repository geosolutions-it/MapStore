{
   
   "scaleOverlayMode": "basic",
   "adminUrl":"http://localhost/opensdi2-manager/",
   "geoStoreBase":"http://localhost/opensdi2-manager/facade/geostore/rest/",
   "externalHeaders": true,
   "header":{
        "container": {
			"border": false,
			"header": false,
			"collapsible": true,
			"collapseMode":  "mini",
			"hideCollapseTool": true,
			"split": true,
			"animCollapse": false,
			"minHeight": 80,
			"maxHeight": 80,
			"height": 80
	   	},
		"html":"<img style=\"position:absolute; top:0px; left:20px; z-index:1000\" src=\"theme/app/img/mariss_logo.jpg\" height=\"100%\"/><h1 style=\"color:grey; font-size:30px; position:absolute; top:20px; left:260px; z-index:1000\">MARISS Project</h1></div>",
        "css": "<style>#msheader .x-panel-body .x-panel-body-noheader{padding:30px;background-color: #FFFFFF;}</style>"
    },
   "gsSources":{ 
        "MARISS-Layers": {
            "ptype": "gxp_wmssource",
            "title": "MARISS", 
            "version": "1.1.1",
            "url": "http://localhost/geoserver/mariss/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
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
				"source": "MARISS-Layers",
				"title": "SAR-imagery",
				"name": "TEM_QL__1P_mosaic",
				"displayInLayerSwitcher": true,
				"tiled": true
			},
			{
				"source": "MARISS-Layers",
				"title": "SAR-imagery-footprints",
				"name": "TEM_QL__1P_mosaic_idx",
				"displayInLayerSwitcher": true,
				"tiled": true
			},
			{
				"source": "MARISS-Layers",
				"title": "SHIP-detection",
				"name": "tem_sd__1p",
				"displayInLayerSwitcher": true,
				"tiled": true
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
	          "collapsed": false,
	          "collapsible": true,
	          "header": true
	      },{
            "xtype": "panel",
	        "border": false,
	        "id":"east",
	        "region": "east",
	        "width": 475,
	        "split": true,
	        "collapsible": true,
			"collapsed": true,
	        "collapseMode": "mini",
			"activeTab":0,
	        "header": false,
	        "items": [{
				"region": "center", 
				"autoScroll": true, 
				"tbar": [], 
				"border": false, 
				"id": "downloadlist", 
				"title": "Download List",
				"layout": "fit"
			}]
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
		}, {
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
        }, {
			"ptype": "gxp_about",
			"poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
			"actionTarget": {"target": "panelbbar", "index": 1}
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
	    },{
	      "actions": ["->"], 
	      "actionTarget": "paneltbar"
	    },{
            "ptype":"gxp_playback",
         	"outputTarget": "paneltbar",
	      	"wfsGridId": "featuregrid",
			"id": "playback",
            "playbackMode": "range",
            "showIntervals": false,
            "labelButtons": true,
            "settingsButton": true,
            "rateAdjuster": false,
            "dynamicRange": false,
            "timeFormat": "l, F d, Y g:i:s A",
            "outputConfig": {
                "controlConfig":{
                    "step": 15,
                    "units": "Minutes",
                    "range": ["2010-12-24T00:00:00.000Z", "2010-12-24T23:59:00.000Z"],
                    "frameRate": 5
                }
            }
       },{
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		},{             
			"ptype": "gxp_wpsmanager",
			"id": "wpsSPM",
			"url": "http://mariss.geo-solutions.it/geoserver/wps",
			"geostoreUrl": "http://mariss.geo-solutions.it/opensdi2-manager/facade/geostore/rest",
			"geostoreProxy": "/proxy?url=",
			"silentErrors": true,
			"checkLocation": true,
			"target": ""

		},{
            "ptype": "gxp_planeditor",
            "outputTarget": "west",
            "source": "MARISS-Layers",
            "downloadUploadedSHP": false,
            "auxiliaryLayerName": "Draft Layer",
            "displayAuxiliaryLayerInLayerSwitcher": false,
            "addFeatureTable": true,
            "layoutConfig":{
                "xtype": "form",
                "buttonAlign": "right",
                "autoScroll":true,
                "frame":true
            }
       }, {
	     "ptype": "gxp_importexport",
	     "id": "gxp_importexport",
	     "service": "http://mariss.geo-solutions.it/opensdi2-manager/",
	     "types": ["kml/kmz"],
	     "exportConf":{
	        "kml/kmz": {
	            "layerName": "Draft Layer",
	            "alternativeStyle": false,
	            "dontAskForLayerName": true
	        }, 
            "shp": {
                "panelConfig":{
                    "fieldEmptyText": "Browse for SHP files...",
                    "validFileExtensions": [".shp"],
                    "deafultLayerName": "Draft Layer",
                    "dontAskForLayerName": true
                }
            }       
	     }
	 },{
		  "ptype": "gxp_featuregrid",
		  "featureManager": "featuremanager",
		  "outputConfig": {
			  "id": "featuregrid",
			  "title": "Features"
		  },
		  "outputTarget": "south",
		  "showExportCSV": true,
		  "exportFormats": ["GML2","shape-zip", "CSV"],
		  "exportFormatsConfig":{
		        "shape-zip": {
		            "addGeometry": true
		        },
		        "GML2": {
		            "addGeometry": true
		        }
		   }
    }, {
		  "ptype": "gxp_featuremanager",
		  "id": "featuremanager"
     },{
		  "ptype": "gxp_spatialqueryform",
		  "featureManager": "featuremanager",
		  "featureGridContainer": "south",
		  "outputTarget": "east",
		  "showSelectionSummary": true,
		  "actions": null,
		  "id": "bboxquery",
		  "spatialSelectorsConfig":{
		        "bbox":{
		            "xtype": "gxp_spatial_bbox_selector"
		        },
		        "buffer":{
		            "xtype": "gxp_spatial_buffer_selector",
					"bufferOptions": {
						"minValue": 1,
						"maxValue": 10000,
						"decimalPrecision": 2
					}
		        },
		        "circle":{
		            "xtype": "gxp_spatial_circle_selector",
		            "zoomToCurrentExtent": true
		        },
		        "polygon":{
		            "xtype": "gxp_spatial_polygon_selector"
		        }
	      }
    	}
	]
}
