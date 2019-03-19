{
    "portalConfig":{
        "iconCls": "map-icon"
    },
   "header": {
       "html": "<div class='topbanner'><div id='left-banner'><img src='images/banner/banner_lite.jpg' style='float:left'  height='86' border='0' /></div><div id='right-banner'><img src='images/banner/banner_right.png' style='float:right' border='0' /></div></div>",
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
            "projection":"EPSG:3857",
            "url": "https://geoweb-portal.com/geoserver/ows",
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

    "map": {
        "projection": "EPSG:3857",
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
            }
        ]
    },
    "loginConfig":{
        "authSource":"gs",
        "authParam":"authkey"
    },
    "removeTools":["googleearth_plugin", "googleearth_separator", "addlayers_plugin", "addlayer", "removelayer_plugin", "layerproperties_plugin", "wmsgetfeatureinfo_plugin", "addgroup_plugin", "removegroup_plugin", "removeoverlays_plugin"],
    "viewerTools" : [],
	"customTools":[
        {
           "ptype": "gxp_mouseposition",
           "displayProjectionCode":"EPSG:4326",
           "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
        }, {
            "actions": ["-"],
            "actionTarget": "paneltbar"
        }, {
            "ptype": "gxp_geolocationmenu",
            "actionTarget": {"target": "paneltbar", "index": 23},
            "toggleGroup": "toolGroup"
        }, {
            "actions": ["-"],
            "actionTarget": "paneltbar"
        }, {
            "ptype": "gxp_enablelabel",
            "strWithLabels": "_with_labels",
            "actionTarget": {"target": "paneltbar", "index": 22}
        }, {
            "actions": ["-"],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_help",
            "forceMultiple": true,
            "text": false,
            "iconCls" : "gxp-icon-palette",
            "tooltip" : "Layer Styles",
            "title" : "GeoWeb Portal Lite Version",
            "description" : "<p style=\"font-size:15px\">Oops! It seems you are trying to use one of the GeoWeb Portal’s advanced features.<br/>Advanced features are available only to paid subscribers.<br/><br/>To subscribe to Rextag’s GeoWeb Portal service, please contact our office at<br/><a href=\"tel:(619)%20564-7313\" value=\"+16195647313\" target=\"_blank\">(619) 564-7313</a> or email us at <a href=\"mailto:mad_info@hartenergy.com\" target=\"_blank\">mad_info@hartenergy.com</a>.<br/><br/>Thank you!</p>",
            "windowOptions": {"width": 610, "height": 200},
            "id" : "____stylerhe____",
            "actionTarget":{"target":"paneltbar", "index":24}
        },
        {
            "actions": ["->"],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_help",
            "forceMultiple": true,
            "text": false,
            "iconCls" : "gxp-icon-print",
            "tooltip" : "Print Map",
            "title" : "GeoWeb Portal Lite Version",
            "description" : "<p style=\"font-size:15px\">Oops! It seems you are trying to use one of the GeoWeb Portal’s advanced features.<br/>Advanced features are available only to paid subscribers.<br/><br/>To subscribe to Rextag’s GeoWeb Portal service, please contact our office at<br/><a href=\"tel:(619)%20564-7313\" value=\"+16195647313\" target=\"_blank\">(619) 564-7313</a> or email us at <a href=\"mailto:mad_info@hartenergy.com\" target=\"_blank\">mad_info@hartenergy.com</a>.<br/><br/>Thank you!</p>",
            "windowOptions": {"width": 610, "height": 200},
            "id" : "____gxp_print____",
            "actionTarget":{"target":"paneltbar", "index":4}
        },
        {
            "ptype": "gxp_help",
            "forceMultiple": true,
            "text": false,
            "iconCls" : "gxp-icon-getfeatureinfo",
            "tooltip" : "Get Feature Info",
            "title" : "GeoWeb Portal Lite Version",
            "description" : "<p style=\"font-size:15px\">Oops! It seems you are trying to use one of the GeoWeb Portal’s advanced features.<br/>Advanced features are available only to paid subscribers.<br/><br/>To subscribe to Rextag’s GeoWeb Portal service, please contact our office at<br/><a href=\"tel:(619)%20564-7313\" value=\"+16195647313\" target=\"_blank\">(619) 564-7313</a> or email us at <a href=\"mailto:mad_info@hartenergy.com\" target=\"_blank\">mad_info@hartenergy.com</a>.<br/><br/>Thank you!</p>",
            "windowOptions": {"width": 610, "height": 200},
            "id" : "____gxp_wmsgetfeatureinfo_menu",
            "actionTarget": {"target": "paneltbar", "index": 14}
        },
        {
            "ptype": "gxp_help",
            "forceMultiple": true,
            "text": false,
            "iconCls" : "gxp-icon-printsnapshot",
            "tooltip" : "Snapshoto",
            "title" : "GeoWeb Portal Lite Version",
            "description" : "<p style=\"font-size:15px\">Oops! It seems you are trying to use one of the GeoWeb Portal’s advanced features.<br/>Advanced features are available only to paid subscribers.<br/><br/>To subscribe to Rextag’s GeoWeb Portal service, please contact our office at<br/><a href=\"tel:(619)%20564-7313\" value=\"+16195647313\" target=\"_blank\">(619) 564-7313</a> or email us at <a href=\"mailto:mad_info@hartenergy.com\" target=\"_blank\">mad_info@hartenergy.com</a>.<br/><br/>Thank you!</p>",
            "windowOptions": {"width": 610, "height": 200},
            "id" : "____gxp_printsnapshothe",
            "actionTarget":{"target":"paneltbar", "index":5}
        },
        {
            "ptype": "gxp_languageselector",
            "actionTarget": {"target": "panelbbar", "index": 3}
        }
    ]
}
