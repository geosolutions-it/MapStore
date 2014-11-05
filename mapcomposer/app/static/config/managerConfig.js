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
   "tools":[{
        "ptype": "mxp_categoryinitializer",
        "neededCategories": ["WPS_RUN_CONFIGS" ]
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
         "ptype": "mxp_cmre_ondemand_services",
         "osdi2ManagerRestURL":"http://localhost:8180/opensdi2-manager/mvc/process/wps/",
         "runConfigs": {
            "csvingestion":{
                "xtype":"geobatch_run_local_form",
                "baseDir": "/home/geosolutions/admin",
                "fileBrowserUrl": "/opensdi2-manger/mvc/fileManager/extJSbrowser",
                "fileRegex": "\\.csv$",
                "path":"/test_csv/"
            },
            
            "geotiff_publish":{
                "xtype": "geobatch_run_local_form",
                "baseDir": "/home/geosolutions/admin",
                "fileRegex": "\\.ti[f]{1,2}$",
                "path":" /ndvi/"
            },
	    "ndviingestion":{
                "xtype": "geobatch_run_local_form",
                "baseDir": "/home/geosolutions/admin",
                "fileRegex": "\\.ti[f]{1,2}$",
                "path":" /ndvi/"
            }

           
         },
         "actionTarget":{
           "target": "north.tbar",
           "index": 0
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