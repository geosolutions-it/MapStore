{
   "composerUrl":"",
   "socialUrl":"",
   "adminUrl":"http://localhost/opensdi2-manager/",
   "geoStoreBase":"http://localhost/opensdi2-manager/facade/geostore/rest/",
   "externalLogoutUrl":"http://localhost/logout",
   "start":0,
   "limit":20,
   "msmTimeout":30000,
   "twitter":{
      "via":"geosolutions_it",
      "hashtags":""
   },
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
   "tools":[{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "http://localhost/mapstore",
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
          "index": 4
        }
    }],
   "adminTools":[{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "http://localhost/mapstore",
        "actionTarget":null
    },{
        "ptype": "mxp_usermanager",
        "loginManager": "loginTool",
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
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "externalHeaders": true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 5
        }
    },{
        "ptype": "mxp_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 8
        }
    }],
    "loggedTools":[{
        "ptype": "mxp_mapviewer",
        "loginManager": "loginTool",
        "mapStoreUrl": "http://localhost/mapstore",
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