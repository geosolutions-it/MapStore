{
	"portalConfig":{
		"header":false
	},
    "gsSources": {
        "google": {
            "ptype": "gxp_googlesource"
        }
    },
	"loadingPanel": {
		"width": 100,
		"height": 100,
		"center": true
	},
    "map":{
        "projection": "EPSG:900913",
        "units": "m",
        "maxExtent": [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        "layers": [{
            "source": "google",
            "title": "Google Hybrid",
            "name": "HYBRID",
            "group": "background"
        }],
        "center": [1250000.000000, 5370000.000000],
        "zoom": 5
    },	
	"disableLayerChooser":true,

	"viewerTools":[
	   {	
		  "leaf":true,
		  "checked": true,
		  "ptype":"gxp_zoomtoextent"
          
	   },{
		  "leaf":true,
		  "checked": true,
		  "iconCls":"gxp-icon-pan",
		  "ptype":"gxp_navigation"
	   },{
		  "actions":[
			 "-"
		  ]
	   },{
	      "leaf":true,
		  "checked": true,
		  "numberOfButtons":2,
		  "ptype":"gxp_zoombox"
	   },{
	      "leaf":true,
		  "checked": true,
		  "iconCls":"gxp-icon-zoom-in",
		  "numberOfButtons":2,
		  "ptype":"gxp_zoom"
	   },{
		  "leaf":true,
		  "checked": true,
		  "actions":[
			 "-"
		  ]
	   },{
		  "leaf":true,
		  "checked": true,
		  "numberOfButtons":2,
		  "ptype":"gxp_navigationhistory"
	   },{
		   "leaf":true,
		  "checked": true,
		  "actions":[
			 "-"
		  ]
	   }
   ],
   "customTools":[
		{
		    "ptype":"gxp_print",
		    "customParams":{
				"outputFilename":"mapstore-print"
		    },
		    "printService":"http://cip-pakistan.geo-solutions.it/geoserver/pdf/",
		    "legendPanelId":"legendPanel",
		    "ignoreLayers":["WFSSearch","Marker"],
		    "appendLegendOptions":true,
		    "actionTarget":{
				"target":"paneltbar",
				"index":4
		    }
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
