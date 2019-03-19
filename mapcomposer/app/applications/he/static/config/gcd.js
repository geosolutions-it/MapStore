{
    "restrictToGroups" : ["GCD_Users"],
    "redirectDeniedTo" : "/mapstore/loginpage",
    "deniedPrintingGroup" : "nosnapshot",
    "portalConfig":{
        "header":false,
        "iconCls": "flame-icon",
        "title": "Natural Gas Reports"
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
    "map":{
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
			}]
        
    },
    "disableLayerChooser":false,
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
    "mapPanelContainerPanels":[
        {
            "xtype": "panel",
            "title": "Results",
            "border": true,
            "id": "results_panel",
            "region": "south",
            "layout": "card",
            "activeItem":0,
            "items": [{
                "xtype": "panel",
                "id": "capacity_results_panel",
                "layout": "fit"
            },{
                "xtype": "panel",
                "id": "shippers_results_panel",
                "layout": "fit"
            }],
            "height": 280,
            "collapsed": true,
            "collapsible": true,
            "collapseMode":"mini",
            "header": true
        }
    ],
    "removeTools":["gxp_wmsgetfeatureinfo_menu"],
	"customTools":[
		{
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:4326",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}, {
			"ptype": "gxp_wmsgetfeatureinfo_menu", 
			"paginate": true,
			"toggleGroup": "toolGroup",
			"actionTarget": {"target": "paneltbar", "index": 24},
            "infoAction": "click",
            "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
            "useTabPanel": true,
            "format" : "grid",
            "outputGridConfig":{
                "GCD_Users_Z0:GCD_INTER_PL":{
                    "nameColumnWidth": 100
                },
                "gascapacity:gcd_v_capacity_by_pipeline_agg":{
                    "nameColumnWidth": 100,
                    "propertyNames":{
                        "Point_Type":"Point Type",
                        "Prop_Name":"Location Name",
                        "Descriptive_Name":"Descriptive Name",
                        "Design_Capacity":"Design Capacity",
                        "Operational_Capacity":"Operational Capacity",
                        "Avg_Cap_Sched_2008":"Avg Cap Sched 2008",
                        "Avg_Cap_Sched_2009":"Avg Cap Sched 2009",
                        "Avg_Cap_Sched_2010":"Avg Cap Sched 2010",
                        "Avg_Cap_Sched_2011":"Avg Cap Sched 2011",
                        "Avg_Cap_Sched_2012":"Avg Cap Sched 2012",
                        "Avg_Cap_Sched_2013":"Avg Cap Sched 2013",
                        "Avg_Cap_Sched_2014":"Avg Cap Sched 2014",
                        "Proprietary_Loc_Num":"Proprietary Loc Num"
                        },
                    "ignoreFields":["FERC", "cpcty_RID", "cpcty_RID_t", "Available_Capacity", "Scheduled_Capacity"]
                },
                "gascapacity:gcd_v_capacity_by_point_agg":{
                    "nameColumnWidth": 100,
                    "propertyNames":{
                        "Point_Type":"Point Type",
                        "Prop_Name":"Location Name",
                        "Descriptive_Name":"Descriptive Name",
                        "Design_Capacity":"Design Capacity",
                        "Operational_Capacity":"Operational Capacity",
                        "Avg_Cap_Sched_2008":"Avg Cap Sched 2008",
                        "Avg_Cap_Sched_2009":"Avg Cap Sched 2009",
                        "Avg_Cap_Sched_2010":"Avg Cap Sched 2010",
                        "Avg_Cap_Sched_2011":"Avg Cap Sched 2011",
                        "Avg_Cap_Sched_2012":"Avg Cap Sched 2012",
                        "Avg_Cap_Sched_2013":"Avg Cap Sched 2013",
                        "Avg_Cap_Sched_2014":"Avg Cap Sched 2014",
                        "Proprietary_Loc_Num":"Proprietary Loc Num"
                        },
                    "ignoreFields":["FERC", "cpcty_RID", "cpcty_RID_t", "Available_Capacity", "Scheduled_Capacity"]
                }
            }
        }, {
            "ptype": "gxp_enablelabel",
            "strWithLabels": "_with_labels",
            "actionTarget": {"target": "paneltbar", "index": 25}
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
          "resultsCardPanel":"results_panel",
		  "outputTarget":"west"
        }, {
            "id": "capacity_data",
            "ptype":"he_capacity_data",
            "layerStyle":{"strokeColor":"green","strokeWidth":1,"fillOpacity":0.2,"cursor":"pointer"}, 
            "titleText": "Flows & Statistics",
            "geoServerUrl":"https://geoweb-portal.com/geoserver/ows",
            "source": "gs",
            "bypipelineLayerName":"gascapacity:gcd_v_capacity_by_pipeline_agg",
            "bypointLayerName":"gascapacity:gcd_v_capacity_by_point_agg",
            "statesLayer":"gascapacity:gcd_lst_States",
            "countryLayer":"gascapacity:gcd_lst_USCounties",
            "pipelineNameLayer":"gascapacity:gcd_lst_Pipelines",
            "pipelineLayerConfig": {
                "title": "Pipeline",
                "name": "GCD_Users_Z0:GCD_INTER_PL",
                "layers": "GCD_Users_Z0:GCD_INTER_PL",
                "styles": "NG_PIPE" ,
                "transparent": true,
                "displayInLayerSwitcher": false
            },
            "featureManager": "featuremanager",
            "featureGridContainer":"results_panel",
            "resultsGridID":"results_grid",
            "outputConfig":{
                 "id":"CapacityDataForm",
                 "cardId": 0
            },
            "outputTarget":"gcd"
        },{
            "ptype":"he_shippers",
            "geoServerUrl":"https://geoweb-portal.com/geoserver/ows",
            "source": "gs",
            "countryLayer":"gascapacity:gcd_lst_USCounties",
            "pipelineNameLayer":"gascapacity:gcd_lst_Pipelines",
            "shipperNamesLayer":"gascapacity:ioc_v_shippernames",
            "qryByPipelineLayerName":"gascapacity:gcd_v_shippers_by_pipeline",
            "qryByShipperLayerName":"gascapacity:gcd_v_shippers_by_shipper",
            "qryByPipelineListShippers":"gascapacity:gcd_v_list_shippers_by_pipeline",
            "qryByShipperListPipelines":"gascapacity:gcd_v_lst_pipelines_by_shipper",
            "layerStyle":{"strokeColor":"green","strokeWidth":1,"fillOpacity":0.2,"cursor":"pointer"}, 
            "titleText": "Contracts",
            "pipelineLayerConfig": {
                    "title": "Pipeline",
                    "name": "GCD_Users_Z0:GCD_INTER_PL",
                    "layers": "GCD_Users_Z0:GCD_INTER_PL",
                    "styles": "NG_PIPE" ,
                    "transparent": true,
                    "displayInLayerSwitcher": false
            },
            "outputConfig":{
                "id":"ShippersForm",
                "cardId": 1
            },
            "featureManager": "featuremanager",
            "featureGridContainer":"results_panel",
            "resultsGridCardPanel":"shippers_results_panel",
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
            "id": "results_grid",
            "source": "gs",
            "featureManager": "featuremanager",
            "customActionsProvider":"gcd",
            "customColumnsProvider": "gcd",
            "ignoreFields": ["count","FERC", "cpcty_RID", "cpcty_RID_t", "Pipeline", "Facility", "Operational_Capacity", "Avg_Cap_Sched_2008", "Avg_Cap_Sched_2009", "Avg_Cap_Sched_2010", "Avg_Cap_Sched_2011", "Avg_Cap_Sched_2012", "Avg_Cap_Sched_2013", "Avg_Cap_Sched_2014", "Proprietary_Loc_Num" ],
            "customColumnsWidth" : {
                "Point_Type" : 70,
                "DRN" : 80,
                "Prop_Name" : 200,
                "Descriptive_Name" : 180,
                "Operator" : 200,
                "Facility" : 200,
                "Proprietary_Loc_Num" : 100,
                "County" : 100,
                "State" : 50,
                "Scheduled_Capacity" : 120
            },
            "outputConfig": {
              "id": "capacity_grid",
              "region":"south",
              "height":300,
              "collapsible":true,
              "collapsed":false,
              "header":false,
              "mask": {"msg":"Please wait..."}
            },
            "outputTarget": "capacity_results_panel",
            "showExportCSV": true,
            "exportDoubleCheck": false,
            "exportCSVMultipleText": "Export Results",
            "exportCSVRangeText": "Export Range",
            "resultsToRangeSuffix" : {"_agg" : "_detail"},
            "additionalPropertiesArrays": {
                "gcd_v_capacity_by_pipeline_agg" : ["cpcty_RID_t"],
                "gcd_v_capacity_by_pipeline_detail" : ["cpcty_RID_t", "EffectiveDate", "EffectiveDateYear"],
                "gcd_v_capacity_by_point_agg" : ["cpcty_RID_t"],
                "gcd_v_capacity_by_point_detail" : ["cpcty_RID_t", "EffectiveDate", "EffectiveDateYear"]
            }
        },{
			"actions": ["->"],
			"actionTarget": "paneltbar"
		}
    ]
}
