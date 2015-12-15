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
      ],
      [
         "it",
         "Italiano"
      ],
      [
         "fr",
         "Français"
      ],
      [
         "de",
         "Deutsch"
      ],
      [
         "es",
         "Español"
      ]
   ],
   "cookieConsent":true,
   "tools":[{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "/mapstore/",
        "actionTarget":null
    },{
        "ptype": "mxp_categoryinitializer"
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "statelessSession":false,
        "externalHeaders": true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 3
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 4
        }
    }],
   "adminTools":[{
        "ptype": "mxp_categoryinitializer",
        "neededCategories": ["GEOBATCH_RUN_CONFIGS","ARCHIVEDLOGS","ARCHIVEDRUNS" ],
    },{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "/mapstore/",
        "actionTarget":null
    },{
        "ptype": "mxp_usermanager",
        "loginManager": "loginTool",
        "statelessSession":false,
        "addManageGroupsButton": false,
        "actionTarget":{
          "target": "north.tbar",
          "index": 0
        }
    },{
        "ptype": "mxp_servicemanager",
        "actionTarget":{
          "target": "north.tbar",
          "index": 1
        }
    },{
        "ptype": "mxp_geobatch_flows",
        "showConsumersDetails":true,
        "geoBatchRestURL":"/geobatch/rest/",
        "archivedVisible":false,
         "runConfigs": {
            
         },
         "actionTarget":{
           "target": "north.tbar",
           "index": 3
         }
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "statelessSession":false,
        "externalHeaders": true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 10
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 15
        }
    }],
    "loggedTools":[{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "/mapstore/",
        "actionTarget":null
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "externalHeaders": true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 3
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 6
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