{
   "composerUrl":"",
   "socialUrl":"",
   "start":0,
   "limit":20,
   "msmTimeout":30000,
   "adminUrl": "http://geocollect.geo-solutions.it/opensdi2-manager/",
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
        "neededCategories": ["GEOCOLLECT", "MAP"]
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
        "ptype": "mxp_templatemanager",
        "loginManager": "loginTool",
		"actionTarget":{
          "target": "north.tbar",
          "index": 0
        }
    },{
        "ptype": "mxp_myaccount",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 1
        }
    },{
        "ptype": "mxp_usermanager",
        "loginManager": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 2
        }
    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "GEOCOLLECT",
        "buttonText": "Mission Templates",
        "actionTarget":{
             "target": "north.tbar",
             "index": 3
            }

    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "MAP",
        "buttonText": "Maps",
        "actionTarget":{
             "target": "north.tbar",
             "index": 5
            },
		"attributeFields":[{
			"xtype":"textfield",
			"id":"attribute.owner",
			"anchor":'95%',
			"fieldLabel": "Owner",
			"name":"attribute.owner"
		}]

    },{ 
        "ptype": "mxp_geostore_mission_resource_editor",
        "category": "GEOCOLLECT",
         "loginManager": "loginTool",
        "buttonText": "Mission Configuration",
        "actionTarget":{
         "target": "north.tbar",
         "index": 6
        },
         "resourceEditor":{
		"xtype":"mxp_gc_resource_editor",
		"ref":"/missionResEdit",
		"authParam":"authkey"
		}
    },{ 
        "ptype": "mxp_servicemanager",
        "notDuplicateOutputs":true,
        "actionTarget":{
             "target": "north.tbar",
             "index": 4
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
   "embedLink": {
		"embeddedTemplateName": "viewer",
		"showDirectURL": true,
        "showQRCode":true,
        "qrCodeSize":128,
        "appDownloadUrl":"http://demo.geo-solutions.it/share/mapstoremobile/MapStoreMobile.apk"

	}
}