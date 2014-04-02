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
        "ptype": "sn_mapmanager",
        "loginManager": "loginTool",
        "actionTarget":null
    },{
        "ptype": "sn_login",
        "pluginId": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 2
        }
    },{
        "ptype": "sn_languageselector",
        "actionTarget":{
          "target": "north.tbar",
          "index": 6
        }
    }],
   "loggedTools":[{
        "ptype": "sn_mapmanager",
        "loginManager": "loginTool",
        "actionTarget": null
    },{
        "ptype": "sn_templatemanager",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 0 
        }
    },{
        "ptype": "sn_usermanager",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 1 
        }
    },{
        "ptype": "sn_login",
        "pluginId": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 4
        }
    },{
        "ptype": "sn_languageselector",
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