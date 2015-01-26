{
   "composerUrl":"",
   "socialUrl":"",
   "start":0,
   "limit":20,
   "msmTimeout":30000,
   "header":{},
   
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
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "forceLogin":true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 3
        }
    }],
   "adminTools":[{
        "ptype": "mxp_entity_manger",
        "buttonText": "OpenSDI Info",
        "iconCls":"information_ic",
        "notDuplicateOutputs":true,
        "actionTarget":{
             "target": "north.tbar",
             "index": 0
        },
        "entities": [
            {   "api":{},
              
              "autoExpandColumn": "patterns", 
              "autoload": true, 
              "basePath": "mvc/OpenSDIInfo/endpointdoc/", 
              "canCreate": false, 
              "canDelete": false, 
              "canEdit": false, 
              "iconCls": "information_ic", 
              "id": "Mappings", 
              "idProperty": "id", 
              "name": "Mappings", 
              "pluralName": "Mappings", 
              "restful": false, 
              "root": "data",
              "columns": [
                {
                  "header": "Bean", 
                  "mapping": "method.bean", 
                  "name": "bean"
                }, 
                {
                   "header": "Type", 
                  "mapping": "method.type", 
                  "name": "type" 
                },{
                  "header": "Class Method",
                  "xtype":"templatecolumn",
                  "tpl":"<tpl for=\"method\">{name}</tpl>"
                },{
                  "header": "Patterns", 
                  "xtype":"templatecolumn",
                  "tpl":"<tpl for=\"patterns\">{.} </tpl>",
                  "name": "patterns"
                }
              ], 
              "displayField": "label", 
              "editHeight": 270,
              "fields": [
                {
                  "mapping": "method.bean", 
                  "name": "bean"
                },{
                  "mapping": "method.beanType", 
                  "name": "type"
                },{
                    "mapping":"method.method",
                    "name":"method",
                },
                {
                  "mapping": "info.patternsCondition.patterns", 
                  "name": "patterns"
                }
              ],
              
             
            }, {   "api":{},
              
              "autoExpandColumn": "path", 
              "autoload": true, 
              "basePath": "mvc/OpenSDIInfo/facade/", 
              "canCreate": false, 
              "canDelete": false, 
              "canEdit": false, 
              "iconCls": "icon-export", 
              "id": "Facade", 
              "idProperty": "path", 
              "name": "Facade", 
              "pluralName": "Facades", 
              "restful": false, 
              "root": "data",
              "columns": [
                {
                  "header": "Path", 
                  "mapping": "path", 
                  "name": "path"
                },{
                  "header": "Url",
                  "name": "urlWrapped",
                  "mapping":"urlWrapped"

                }
              ], 
              "displayField": "label", 
              "editHeight": 270,
              "fields": [
                {
                  "mapping": "path", 
                  "name": "path"
                },{
                  "mapping":"urlWrapped",
                  "name":"urlWrapped",
                  "type":"string"
                },{
                  "mapping": "proxy", 
                  "name": "proxy"
                }
              ]
            }
           
          ]
    }, {
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "actionTarget":{
          "target": "north.tbar",
          "index": 10
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
