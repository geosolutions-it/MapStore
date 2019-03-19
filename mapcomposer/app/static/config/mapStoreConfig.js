{
   "header": {
	   "html": "<div class='topbanner'><div id='left-banner'><img src='theme/app/img/banner/banner_left.png'   height='86' border='0' /> </div><div id='right-banner'><img src='theme/app/img/banner/banner_right.png'  style='float:right'  border='0' /></div></div>",
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
		"html": "<div id=\"footer\"><img src=\"theme/app/img/banner/logo_footer.png\" > © Hart Energy 2014 &nbsp;</div>",
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
			"title": "GeoWebPortal Hart Energy", 
            "version":"1.1.1",
			"projection":"EPSG:900913",
			"url": "http://geoweb-portal.com/geoserver/ows",
			"layersCachedExtent":[-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7],
			"authParam":"authkey",
			"layerBaseParams": {
					"TILED": true,
                    "FORMAT":"image/png8",
					"TILESORIGIN": "-20037508.34, -20037508.34"
            }
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

	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
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
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background",
                "visibility": true
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
			}
		]
	},
    "removeTools":["googleearth_plugin", "googleearth_separator"],
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
			"actions": ["->"], 
			"actionTarget": "paneltbar"
		}, {
             "ptype": "gxp_wmsgetfeatureinfo_menu",
             "toggleGroup": "toolGroup",
             "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
             "useTabPanel": true,
             "actionTarget": {"target": "paneltbar", "index": 20},
              "vendorParams":{"buffer":10}
         }, {
          "ptype":"gxp_printsnapshot",
          "service": "http://84.33.2.29/servicebox/",
          "customParams":{
            "outputFilename":"mapstore-print"
          },
          "actionTarget":{
            "target":"paneltbar",
            "index":5
          }
      },{
			"ptype": "gxp_help",
			"actionTarget": "paneltbar",
			"text": "Help",
			"tooltip":"MapStore Guide",
			"index": 24,
			"showOnStartup": false,
			"fileDocURL": "MapStore-Help.pdf"
        }, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}
	]
}
