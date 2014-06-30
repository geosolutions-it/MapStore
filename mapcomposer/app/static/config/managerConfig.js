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
   "loginDataStorage" : "sessionStorage",
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
   "tools":[{
        "ptype": "mxp_mapmanager",
        "loginManager": "loginTool",
        "actionTarget":null
    },{
        "ptype": "mxp_categoryinitializer",
         "neededCategories": ["TEMPLATE", "MAP"],
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
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
        "ptype": "mxp_mapmanager",
        "loginManager": "loginTool",
        "actionTarget": null
    },{
        "ptype": "mxp_myaccount",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 1
        }
    },{
        "ptype": "mxp_usermanager",
        "showEnabled":true,
        "pageSize":20,
        "customFields":[{
                "xtype": "textfield",
                "anchor":"90%",
                "id": "email",
                "maxLength":255,
                "blankText": "email",
                "name": "attribute.email",
                "fieldLabel": "email",
                "inputType": "text",
                "vtype": "email",
                "value": ""
            },{
                "xtype": "textfield",
                "anchor":"90%",
                "maxLength":255,
                "id": "attribute.company",
                "blankText": "Company",
                "fieldLabel": "Company",
                "inputType": "text",
                "value": ""
                
            },{
                "xtype": "datefield",
                "anchor":"90%",
                "id": "expires",
                "name": "attribute.expires",
                "fieldLabel": "Expiring Date",
                "inputType": "text",
                "value": ""
                
            },{
                "xtype": "textarea",
                "anchor":"90%",
                "id": "notes",
                "maxLength":255,
                "name": "attribute.notes",
                "blankText": "Notes",
                "fieldLabel": "Notes",
                "inputType": "text",
                "value": ""
                
            }],
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 2
        }
    },{
         "ptype": "mxp_he_expiring_task_status",
         "actionTarget":{
           "target": "north.tbar",
           "index": 6
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
        "ptype": "mxp_mapmanager",
        "loginManager": "loginTool",
        "actionTarget": null
    },{
        "ptype": "mxp_myaccount",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 1 
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
	"mediaContent":"./externals/mapmanager/theme/media/",
   "embedLink": {
		"embeddedTemplateName": "viewer",
		"showDirectURL": true,
        "showQRCode":true,
        "qrCodeSize":128,
        "appDownloadUrl":"http://demo.geo-solutions.it/share/mapstoremobile/MapStoreMobile.apk"

	}
}
