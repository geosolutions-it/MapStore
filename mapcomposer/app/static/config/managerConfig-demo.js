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
        "neededCategories": ["GEOBATCH_RUN_CONFIGS" ],
    },{
        "ptype": "mxp_login",
        "pluginId": "loginTool",
        "forceLogin":true,
        "actionTarget":{
          "target": "north.tbar",
          "index": 3
        }
    }],
   "adminTools":[{
        "ptype": "mxp_usermanager",
       "setActiveOnOutput":true,
        "addManageGroupsButton": false,
        "loginManager": "loginTool",
        "showOnStartup":true,
        "closable":false,
        "actionTarget":null,
        "outputConfig": {
            "closable": false,
            "closeAction": 'close',
            "autoWidth": true,
            "viewConfig": {
                "forceFit": true
            }       
        },
       "actionTarget":{
           "target": "north.tbar",
           "index": 1
         }
    },{
         "ptype": "mxp_geobatch_flows",
         "geoBatchRestURL":"http://cip-pakistan.geo-solutions.it/geobatch/rest/",
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
           "index": 2
         }
    },{ 
        "ptype": "mxp_servicemanager",
        "buttonText": "File Manager",
        "notDuplicateOutputs":true,
        "actionTarget":{
             "target": "north.tbar",
             "index": 3
            }

    },{
        "ptype": "mxp_entity_manger",
        "notDuplicateOutputs":true,
        "actionTarget":{
             "target": "north.tbar",
             "index": 4
        },
	"entities": [
            {
              "api": {
                "destroy": {
                  "method": "DELETE", 
                  "url": "mvc/cip/crops/{id}"
                }, 
                "dump": {
                  "method": "GET", 
                  "url": "mvc/cip/crops/dump"
                }, 
                "restore": {
                  "method": "POST", 
                  "url": "mvc/cip/crops/restore"
                }
              }, 
              "autoExpandColumn": "label", 
              "autoload": true, 
              "basePath": "mvc/cip/crops/", 
              "canCreate": true, 
              "canDelete": true, 
              "canEdit": true, 
              "columns": [
                {
                  "header": "id", 
                  "mapping": "id", 
                  "name": "id"
                }, 
                {
                  "header": "Label", 
                  "mapping": "label", 
                  "name": "label"
                }, 
                {
                  "header": "Default Production Uom", 
                  "mapping": "prod_default_unit", 
                  "name": "prod_default_unit"
                }, 
                {
                  "header": "Default Area Uom", 
                  "mapping": "area_default_unit", 
                  "name": "area_default_unit"
                }, 
                {
                  "header": "Default Yield Uom", 
                  "mapping": "yield_default_unit", 
                  "name": "yield_default_unit"
                }, 
                {
                  "falseText": "", 
                  "fixed": true, 
                  "header": "Rabi", 
                  "mapping": "rabi", 
                  "maxWidth": 100, 
                  "name": "rabi", 
                  "trueText": "Yes", 
                  "width": 100, 
                  "xtype": "booleancolumn"
                }, 
                {
                  "falseText": "", 
                  "fixed": true, 
                  "header": "Kharif", 
                  "mapping": "kharif", 
                  "maxWidth": 100, 
                  "name": "kharif", 
                  "trueText": "Yes", 
                  "width": 100, 
                  "xtype": "booleancolumn"
                }
              ], 
              "createTitle": "Create a new Crop", 
              "displayField": "label", 
              "editHeight": 270, 
              "editTitle": "Edit Crop", 
              "fields": [
                {
                  "mapping": "id", 
                  "name": "id"
                }, 
                {
                  "mapping": "label", 
                  "name": "label"
                }, 
                {
                  "mapping": "prod_default_unit", 
                  "name": "prod_default_unit"
                }, 
                {
                  "mapping": "area_default_unit", 
                  "name": "area_default_unit"
                }, 
                {
                  "mapping": "yield_default_unit", 
                  "name": "yield_default_unit"
                }, 
                {
                  "header": "Rabi", 
                  "mapping": "rabi", 
                  "name": "rabi", 
                  "type": "boolean"
                }, 
                {
                  "header": "Kharif", 
                  "mapping": "kharif", 
                  "name": "kharif", 
                  "type": "boolean"
                }
              ], 
              "form": {
                "create": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Id", 
                    "name": "id", 
                    "reandonly": false, 
                    "xtype": "textfield"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Label", 
                    "name": "label", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Season", 
                    "items": [
                      {
                        "boxLabel": "Rabi", 
                        "inputValue": true, 
                        "name": "rabi"
                      }, 
                      {
                        "boxLabel": "Kharif", 
                        "inputValue": true, 
                        "name": "kharif"
                      }
                    ], 
                    "name": "seasons", 
                    "xtype": "checkboxgroup"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Production Uom", 
                    "forceSelected": true, 
                    "hiddenName": "prod_default_unit", 
                    "mode": "local", 
                    "name": "prod_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=production", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Area Uom", 
                    "hiddenName": "area_default_unit", 
                    "mode": "local", 
                    "name": "area_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=area", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Yield Uom", 
                    "hiddenName": "yield_default_unit", 
                    "mode": "local", 
                    "name": "yield_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=yield", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }
                ], 
                "edit": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Id", 
                    "name": "id", 
                    "readOnly": true, 
                    "xtype": "textfield"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Label", 
                    "name": "label", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Season", 
                    "items": [
                      {
                        "boxLabel": "Rabi", 
                        "inputValue": true, 
                        "name": "rabi"
                      }, 
                      {
                        "boxLabel": "Kharif", 
                        "inputValue": true, 
                        "name": "kharif"
                      }
                    ], 
                    "name": "seasons", 
                    "xtype": "checkboxgroup"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Production Uom", 
                    "hiddenName": "prod_default_unit", 
                    "mode": "local", 
                    "name": "prod_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=production", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "value": "000_tons", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Production Uom", 
                    "hiddenName": "area_default_unit", 
                    "mode": "local", 
                    "name": "area_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=area", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "value": "000_ha", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "name", 
                    "fieldLabel": "Production Uom", 
                    "hiddenName": "yield_default_unit", 
                    "mode": "local", 
                    "name": "yield_default_unit", 
                    "store": {
                      "autoLoad": true, 
                      "fields": [
                        "id", 
                        "name"
                      ], 
                      "idProperty": "id", 
                      "root": "data", 
                      "totalProperty": "total", 
                      "url": "/opensdi2-manager/mvc/cip/uom/filterby?attributename=cls&valueLike=yield", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "value": "kg_ha", 
                    "valueField": "id", 
                    "xtype": "combo"
                  }
                ]
              }, 
              "iconCls": "nrl_crop_ic", 
              "id": "Crops", 
              "idProperty": "id", 
              "name": "Crop", 
              "pluralName": "Crops", 
              "restful": true, 
              "root": "data"
            }, 
            {
              "api": {
                "destroy": {
                  "method": "DELETE", 
                  "url": "mvc/cip/agromet/{factor}"
                }, 
                "dump": {
                  "method": "GET", 
                  "url": "mvc/cip/agromet/dump"
                }, 
                "restore": {
                  "method": "POST", 
                  "url": "mvc/cip/agromet/restore"
                }
              }, 
              "autoExpandColumn": "label", 
              "basePath": "mvc/cip/agromet/", 
              "canCreate": true, 
              "canDelete": true, 
              "canEdit": true, 
              "columns": [
                {
                  "allowBlank": false, 
                  "header": "Factor", 
                  "mapping": "factor", 
                  "name": "factor"
                }, 
                {
                  "allowBlank": false, 
                  "header": "Label", 
                  "mapping": "label", 
                  "name": "label"
                }, 
                {
                  "fixed": true, 
                  "header": "Aggregation", 
                  "mapping": "aggregation", 
                  "maxWidth": 100, 
                  "name": "aggregation", 
                  "width": 100
                }, 
                {
                  "fixed": true, 
                  "header": "Unit", 
                  "mapping": "unit", 
                  "maxWidth": 100, 
                  "name": "unit", 
                  "width": 100
                }
              ], 
              "createTitle": "Create a new variable", 
              "displayField": "label", 
              "editHeight": 200, 
              "editTitle": "Edit Factor", 
              "fields": [
                {
                  "mapping": "factor", 
                  "name": "factor"
                }, 
                {
                  "mapping": "label", 
                  "name": "label"
                }, 
                {
                  "mapping": "aggregation", 
                  "name": "aggregation"
                }, 
                {
                  "mapping": "unit", 
                  "name": "unit"
                }
              ], 
              "form": {
                "create": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Factor", 
                    "name": "factor", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Label", 
                    "name": "label", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Unit", 
                    "name": "unit", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Aggregation", 
                    "items": [
                      {
                        "boxLabel": "avg", 
                        "checked": true, 
                        "inputValue": "avg", 
                        "name": "aggregation"
                      }, 
                      {
                        "boxLabel": "sum", 
                        "inputValue": "sum", 
                        "name": "aggregation"
                      }
                    ], 
                    "xtype": "radiogroup"
                  }
                ], 
                "edit": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Factor", 
                    "name": "factor", 
                    "readOnly": true, 
                    "xtype": "textfield"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Label", 
                    "name": "label", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Unit", 
                    "name": "unit", 
                    "xtype": "textfield"
                  }, 
                  {
                    "fieldLabel": "Aggregation", 
                    "items": [
                      {
                        "boxLabel": "avg", 
                        "inputValue": "avg", 
                        "name": "aggregation"
                      }, 
                      {
                        "boxLabel": "sum", 
                        "inputValue": "sum", 
                        "name": "aggregation"
                      }
                    ], 
                    "xtype": "radiogroup"
                  }
                ]
              }, 
              "iconCls": "nrl_factor_ic", 
              "id": "Agromet", 
              "idProperty": "factor", 
              "name": "Agromet", 
              "pluralName": "Agromet Variables", 
              "restful": true, 
              "root": "data"
            }, 
            {
              "api": {
                "destroy": {
                  "method": "DELETE", 
                  "url": "mvc/cip/uom/{id}"
                }, 
                "dump": {
                  "method": "GET", 
                  "url": "mvc/cip/uom/dump"
                }, 
                "restore": {
                  "method": "POST", 
                  "url": "mvc/cip/uom/restore"
                }
              }, 
              "basePath": "mvc/cip/uom/", 
              "canCreate": true, 
              "canDelete": true, 
              "canEdit": true, 
              "columns": [
                {
                  "fixed": true, 
                  "header": "ID", 
                  "mapping": "id", 
                  "maxWidth": 100, 
                  "name": "id", 
                  "width": 100
                }, 
                {
                  "header": "Label", 
                  "mapping": "name", 
                  "name": "name"
                }, 
                {
                  "fixed": true, 
                  "header": "Short Name", 
                  "mapping": "shortname", 
                  "maxWidth": 100, 
                  "name": "shortname", 
                  "width": 100
                }, 
                {
                  "header": "Description", 
                  "mapping": "description", 
                  "name": "description"
                }, 
                {
                  "fixed": true, 
                  "header": "Class", 
                  "mapping": "cls", 
                  "maxWidth": 100, 
                  "name": "cls", 
                  "width": 100
                }, 
                {
                  "fixed": true, 
                  "header": "factor", 
                  "mapping": "coefficient", 
                  "maxWidth": 100, 
                  "name": "coefficient", 
                  "width": 100
                }, 
                {
                  "fixed": true, 
                  "header": "filter", 
                  "mapping": "filter", 
                  "maxWidth": 100, 
                  "name": "filter", 
                  "width": 100
                }
              ], 
              "createTitle": "Create a new Unit of Measure", 
              "displayField": "name", 
              "editHeight": 310, 
              "editTitle": "Edit Unit of Measure", 
              "fields": [
                {
                  "mapping": "id", 
                  "name": "id"
                }, 
                {
                  "mapping": "name", 
                  "name": "name"
                }, 
                {
                  "mapping": "shortname", 
                  "name": "shortname"
                }, 
                {
                  "mapping": "description", 
                  "name": "description"
                }, 
                {
                  "mapping": "cls", 
                  "name": "cls"
                }, 
                {
                  "mapping": "coefficient", 
                  "name": "coefficient"
                }, 
                {
                  "mapping": "filter", 
                  "name": "filter"
                }
              ], 
              "form": {
                "create": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "ID", 
                    "mapping": "id", 
                    "name": "id"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Label", 
                    "mapping": "name", 
                    "name": "name"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Short Name", 
                    "mapping": "shortname", 
                    "name": "shortname"
                  }, 
                  {
                    "fieldLabel": "description", 
                    "header": "Description", 
                    "name": "description", 
                    "xtype": "textarea"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "label", 
                    "fieldLabel": "Class", 
                    "mode": "local", 
                    "name": "cls", 
                    "store": {
                      "fields": [
                        "name", 
                        "label"
                      ], 
                      "idProperty": "name", 
                      "inlineData": [
                        {
                          "label": "Production", 
                          "name": "production"
                        }, 
                        {
                          "label": "Area", 
                          "name": "area"
                        }, 
                        {
                          "label": "Yield", 
                          "name": "yield"
                        }
                      ], 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "valueField": "name", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "decimalPrecision": 10, 
                    "fieldLabel": "factor", 
                    "mapping": "coefficient", 
                    "name": "coefficient", 
                    "xtype": "numberfield"
                  }, 
                  {
                    "fieldLabel": "filter", 
                    "mapping": "filter", 
                    "name": "filter"
                  }
                ], 
                "edit": [
                  {
                    "allowBlank": false, 
                    "fieldLabel": "ID", 
                    "name": "id", 
                    "readOnly": true
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Label", 
                    "name": "name"
                  }, 
                  {
                    "allowBlank": false, 
                    "fieldLabel": "Short Name", 
                    "mapping": "shortname", 
                    "name": "shortname"
                  }, 
                  {
                    "fieldLabel": "description", 
                    "header": "Description", 
                    "name": "description", 
                    "xtype": "textarea"
                  }, 
                  {
                    "allowBlank": false, 
                    "displayField": "label", 
                    "fieldLabel": "Class", 
                    "hiddenName": "cls", 
                    "mode": "local", 
                    "name": "cls", 
                    "store": {
                      "fields": [
                        "name", 
                        "label"
                      ], 
                      "idProperty": "name", 
                      "inlineData": [
                        {
                          "label": "Production", 
                          "name": "production"
                        }, 
                        {
                          "label": "Area", 
                          "name": "area"
                        }, 
                        {
                          "label": "Yield", 
                          "name": "yield"
                        }
                      ], 
                      "mode": "local", 
                      "xtype": "jsonstore"
                    }, 
                    "triggerAction": "all", 
                    "valueField": "name", 
                    "xtype": "combo"
                  }, 
                  {
                    "allowBlank": false, 
                    "decimalPrecision": 10, 
                    "fieldLabel": "factor", 
                    "mapping": "coefficient", 
                    "name": "coefficient", 
                    "xtype": "numberfield"
                  }, 
                  {
                    "fieldLabel": "filter", 
                    "mapping": "filter", 
                    "name": "filter"
                  }
                ]
              }, 
              "iconCls": "nrl_uom_ic", 
              "id": "Units", 
              "idProperty": "id", 
              "name": "Unit of Measure", 
              "pluralName": "Units of Measure", 
              "restful": true, 
              "root": "data"
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
