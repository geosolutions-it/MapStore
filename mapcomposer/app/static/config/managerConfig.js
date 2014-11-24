{
   "composerUrl":"",
   "socialUrl":"",
   "start":0,
   "limit":20,
   "msmTimeout":30000,
   "twitter":{
      "via":"geosolutions_it",
      "hashtags":""
   },
   "mediaContent":"./externals/mapmanager/theme/media",
   "ASSET":{
        "delete_icon": "./externals/mapmanager/theme/img/user_delete.png",
        "edit_icon": "./externals/mapmanager/theme/img/user_edit.png"
   },
   "locales":[
      [
         "en",
         "English"
      ]
   ],
   "tools":[{
        "ptype": "mxp_static_page",
        "loginManager": "loginTool",
        "src":"home.html",
        "actionTarget":null
    },{
        "ptype": "mxp_categoryinitializer",
        "neededCategories": ["WPS_RUN_CONFIGS", "MAP", "MAPSTORECONFIG" ]
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "forceLogin":true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 3
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 7
        }
    }],
   "adminTools":[{
         "ptype": "mxp_cmre_ondemand_services",
         "osdi2ManagerRestURL":"http://172.21.173.30:8282/opensdi2-manager/mvc/process/wps/",
         "baseMapUrl": "./?config=assetAllocatorResult",
         "autoRefreshTime": 60000,
         "autoOpen":true,
         "outputConfig":{"closable":false},
         "actionTarget":{
           "target": "north.tbar",
           "index": 0
         }
    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "MAP",
        "buttonText": "Maps",
        "actionTarget":{
             "target": "north.tbar",
             "index": 1
            }

    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "WPS_RUN_CONFIGS",
        "buttonText": "Runtimes",
        "actionTarget":{
             "target": "north.tbar",
             "index": 2
            }

    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 10
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 20
        }
    }],
    "loggedTools":[{
         "ptype": "mxp_cmre_ondemand_services",
         "osdi2ManagerRestURL":"http://172.21.173.30:8282/opensdi2-manager/mvc/process/wps/",
         "baseMapUrl": "./?config=assetAllocatorResult",
         "autoRefreshTime": 60000,
         "autoOpen":true,
         "outputConfig":{"closable":false},
         "actionTarget":{
           "target": "north.tbar",
           "index": 0
         }
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 4
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 8
        }
    }],
   "embedLink": {
		"embeddedTemplateName": "viewer",
		"showDirectURL": true,
        "showQRCode":true,
        "qrCodeSize":128,
        "appDownloadUrl":"http://demo.geo-solutions.it/share/mapstoremobile/MapStoreMobile.apk"

	}
}
