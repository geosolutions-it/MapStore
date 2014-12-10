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
        "neededCategories": ["WPS_RUN_CONFIGS", "MAPSTORECONFIG", "MAP", "ASSETPRESETS"]
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "forceLogin":true,
        "statelessSession":true,
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
         "baseMapUrl": "./?config=assetAllocatorResult",
         "autoRefreshTime": 30000,
         "autoOpen":true,
         "outputConfig":{"closable":false},
         "actionTarget":{
           "target": "north.tbar",
           "index": 0
         }
    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "MAPSTORECONFIG",
        "outputItemId":"MAPSTORECONFIG_Editor",
        "buttonText": "Maps",
        "actionTarget":{
             "target": "north.tbar",
             "index": 1
            }

    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "WPS_RUN_CONFIGS",
        "outputItemId":"WPS_RUN_CONFIGS_Editor",
        "buttonText": "Runtimes",
        "actionTarget":{
             "target": "north.tbar",
             "index": 2
            }

    },{ 
        "ptype": "mxp_geostore_resource_editor",
        "category": "ASSETPRESETS",
        "buttonText": "Asset Presets",
        "outputItemId":"ASSETPRESETS_Editor",
        "generalPanelHeight":420,
        "attributeFields":[{
                "xtype":"textfield",
                "id":"attribute.name",
                "anchor":'95%',
                "fieldLabel": "Name",
                "name":"attribute.name"
            },{
                "xtype":"textfield",
                "id":"attribute.type",
                "anchor":'95%',
                "fieldLabel": "Type",
                "name":"attribute.type"
            },{
                "xtype":"numberfield",
                "id":"attribute.minSpeed",
                "anchor":'95%',
                "fieldLabel": "minSpeed",
                "name":"attribute.minSpeed"
            },{
                "xtype":"textfield",
                "id":"attribute.maxSpeed",
                "anchor":'95%',
                "fieldLabel": "maxSpeed",
                "name":"attribute.maxSpeed"
            },{
                "xtype":"textfield",
                "id":"attribute.maxHeading",
                "anchor":'95%',
                "fieldLabel": "maxHeading",
                "name":"attribute.maxHeading"
            },{
                "xtype":"textfield",
                "id":"attribute.minHeading",
                "anchor":'95%',
                "fieldLabel": "minHeading",
                "name":"attribute.minHeading"
            },{
                "xtype":"textfield",
                "id":"attribute.lat0",
                "anchor":'95%',
                "fieldLabel": "lat0",
                "name":"attribute.lat0"
            },{
                "xtype":"textfield",
                "id":"attribute.lon0",
                "anchor":'95%',
                "fieldLabel": "lon0",
                "name":"attribute.lon0"
            },{
                "xtype":"textfield",
                "id":"attribute.heading0",
                "anchor":'95%',
                "fieldLabel": "heading0",
                "name":"attribute.heading0"
            },{
                "xtype":"textfield",
                "id":"attribute.cost",
                "anchor":'95%',
                "fieldLabel": "cost",
                "name":"attribute.cost"
            },{
                "xtype":"textfield",
                "id":"attribute.obsRange",
                "anchor":'95%',
                "fieldLabel": "obsRange",
                "name":"attribute.obsRange"
            },{
                "xtype":"textfield",
                "id":"attribute.Pd",
                "anchor":'95%',
                "fieldLabel": "Pd",
                "name":"attribute.Pd"
            },{
                "xtype":"textfield",
                "id":"attribute.Pfa",
                "anchor":'95%',
                "fieldLabel": "Pfa",
                "name":"attribute.Pfa"
            }],
        "actionTarget":{
             "target": "north.tbar",
             "index": 2
            }

    },{ 
        "ptype": "mxp_help",
        "showOnStartup":"true",
        "buttonText": "Runtimes",
        "iconCls":"information_ic",
        "showOnStartup":true,
        "windowHeight":700,
        "windowWidth": 610,
        "fileDocURL":"manual.html",
        "actionTarget":{
             "target": "north.tbar",
             "index": 6
            }

    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "statelessSession":true,
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
         "osdi2ManagerRestURL":"http://localhost:8180/opensdi2-manager/mvc/process/wps/",
         "baseMapUrl": "./?config=assetAllocatorResult",
         "autoRefreshTime": 30000,
         "autoOpen":true,
         "statelessSession":true,
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
