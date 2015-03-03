{
   "scaleOverlayMode": "basic",
   "gsSources": { 
        "geosolutions":
                {
                "ptype": "gxp_wmssource",
                "url": "http://geocollect.geo-solutions.it/geoserver/it.geosolutions/ows",
                "title": "GeoSolutions GeoServer",
                "SRS": "EPSG:900913",
                "version":"1.1.1",
                "authParam":"authkey",
                "layersCachedExtent": [
                -20037508.34,-20037508.34,
                20037508.34,20037508.34
                ],
                "layerBaseParams":{
                "FORMAT":"image/png8",
                "TILED":true
                }
            },
     "mapquest": {
            "ptype": "gxp_mapquestsource"
        }, 
        "osm": { 
            "ptype": "gxp_osmsource"
        },
        "google": {
            "ptype": "gxp_googlesource" 
        },
        "bing": {
            "ptype": "gxp_bingsource" 
        }, 
        "ol": { 
            "ptype": "gxp_olsource" 
        }
    },
    "loadingPanel": {
        "width": 100,
        "height": 100,
        "center": true
    },
    "map": {
        "projection": "EPSG:900913",
        "units": "m",
        "center": [1000000.000000, 5520000.000000],
        "zoom":11,
        "maxExtent": [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        "layers" : [
            {
                "source": "google",
                "title": "Google Roadmap",
                "name": "ROADMAP",
                "group": "background"
            },{
                "source": "google",
                "title": "Google Terrain",
                "name": "TERRAIN",
                "group": "background"
            },{
                "source": "google",
                "title": "Google Hybrid",
                "name": "HYBRID",
                "group": "background"
            },{
                "source": "mapquest",
                "title": "MapQuest OpenStreetMap",
                "name": "osm",
                "group": "background"
            },{
                "source": "osm",
                "title": "Open Street Map",
                "name": "mapnik",
                "group": "background"
            },{
                "source": "bing",
                "title": "Bing Aerial",
                "name": "Aerial",
                "group": "background",
                "visibility": false,
                "args": [
                    "None", {"visibility": false}
                ]
                
            },{
                "source": "bing",
                "title": "Bing Aerial With Labels",
                "name": "AerialWithLabels",
                "group": "background",
                "visibility": false,
                "args": [
                    "None", {"visibility": false}
                ]
            },{
                "source": "ol",
                "group": "background",
                "fixed": true,
                "type": "OpenLayers.Layer",
                "visibility": false,
                "args": [
                    "None", {"visibility": false}
                ]
            },
             {
        "source":"geosolutions",
        "name":"punti_abbandono",
        "infoFormat": "application/vnd.ogc.gml",
        "title":"Segnalazioni Rifiuti Abbandonati",
        "visibility":true,
        "opacity":1,
        "selected":false,
        "format":"image/png",
        "styles":"abbandono",
        "transparent":true
        },
        {
        "source":"geosolutions",
        "name":"rilevamenti_effettuati",
        "infoFormat": "application/vnd.ogc.gml",
        "title":"Sopralluoghi",
        "visibility":true,
        "opacity":1,
        "selected":false,
        "format":"image/png",
        "transparent":true
        }
        ]},
    "portalConfig": {
            "header":false
        },
    "customComposerWest" : {
        "region":"east",
        "collapsed":true,
        "collapseMode": null
    }, 
    "customPanels":[ 
               {
                
                "layout" : "vBox",
                "width": 400,
                 "minSize": 100,
                "maxSize": 250,
                 "collapsible": true,
                
                "region": "west",
                "align" : "stretch",
                  "border": false,
               
                "items":[
               {
                    "xtype": "panel",
                    "header":false,       
                    "flex":2,
                    "border": false,
                    "id": "listasegnalazioni",
                    "layout": "fit",
                    "width": 400,
                    "tbar":[]
                }, {
                    "xtype": "panel",
                    "title": "Ricerca Segnalazioni", 
                            
                    "border": false,
                    "flex":1,
                    "width": 400,
                    "id": "qrypnl",
                    "layout": "fit",
                    "header": true
                }
                ]
                 }
    ],  
    "scaleOverlayUnits":{
        "bottomOutUnits":"mi",    
        "bottomInUnits":"ft",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },
    "customTools":[
  
        {
            "ptype": "gxp_embedmapdialog",
            "actionTarget": {"target": "paneltbar", "index": 2},
            "embeddedTemplateName": "viewer",
            "showDirectURL": true
        }, {
            "ptype": "gxp_categoryinitializer",
                    "silentErrors": true,
            "neededCategories": ["MAPSTORECONFIG", "GEOCOLLECT", "MAP"]
        }, {
           "ptype": "gxp_mouseposition",
           "displayProjectionCode":"EPSG:4326",
           "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
        },
        
     
        {
          "ptype": "gxp_featuremanager",
          "id": "featuremanager",
          "autoLoadFeatures":true,
          "pagingType":1,
          "numberOfFeatures":100,
            "maxFeatures":30,
             "autoSetLayer":false,
             "format":"JSON",
            "layer": {
             "source":"geosolutions",
             "name":"punti_abbandono"
            }, "symbolizer":  {
                        "Point": {
                            "pointRadius": 4,
                            "graphicName": "circle",
                            "fillColor": "white",
                            "fillOpacity": 1,
                            "strokeWidth": 1,
                            "strokeOpacity": 1,
                            "strokeColor": "#333300"
                            }
                            }
        }
      
       ,{
          "ptype": "gxp_gcseggrid",
         "id":"gcseggrid",
          "featureManager": "featuremanager",
           "fKey":"GCID",
            "authParam":"authkey",
           "selectOnMap": false,
           "alwaysDisplayOnMap":false,
           "colConfig":{
                            "status":{
                            "header": "STATUS"}
                },
           "configHistory":{
                    "queriableAttribute" : "GCID" ,
                    "sortBy":"hist_date",
                    "direction":"DESC",
                    "wfsURL": "http://84.33.2.28:8081/geoserver/it.geosolutions/ows",
                    "typeName": "punti_abbandono_his",
                     "colConfig":{
                            "status":{
                            "header": "STATUS",
                            "editor": { 
                                "xtype": "combo",
                                "store": ["Si","No","Forse"],
                                "queryMode": "local",
                                "typeAhead": true,
                                "triggerAction": "all"
                                }
                            }
                    },
                    "picturesBrowserConfig": {
                "baseUrl": "http://geocollect.geo-solutions.it/opensdi2-manager/mvc/fileManager/extJSbrowser",
                "folder": "/media/punti_abbandono/",
                "featureProperty": "MY_ORIG_ID"
            }
           },"configSurvey":{
               
               "wfsURL": "http://84.33.2.28:8081/geoserver/it.geosolutions/ows",
                "typeName": "rilevamenti_effettuati",
                "queriableAttribute" : "MY_ORIG_ID",
                    "colConfig":{
                        "status":{
                        "header": "STATUS",
                        "editor": { 
                            "xtype": "combo",
                            "store": ["Annullato","Aperto","Eseguito","Rifiutato","Validato","Chiuso"],
                            "queryMode": "local",
                            "typeAhead": true,
                            "triggerAction": "all"
                            }
                        }
                    
                    }  ,
                "picturesBrowserConfig": {
                "baseUrl": "http://geocollect.geo-solutions.it/opensdi2-manager/mvc/fileManager/extJSbrowser",
                "folder": "/media/punti_abbandono/",
                "featureProperty": "MY_ORIG_ID",
                "urlSuffix":"/2"
            }
           },
          "ignoreFields":["DATA_RILEV","MACROAREA","MICROAREA","CIRCOSCRIZ","MORFOLOGIA","INCLINAZIO","MORFOLOGI1","COPERTURA_","COPERTURA1","USO_PARCHE","USO_COMMER","USO_STRADA","USO_ABBAND","PRESUNZION",
                            "AREA_PRIVA","AREA_PUBBL","ALTRE_CARA","DISTANZA_U","DIMENSIONI","RIFIUTI_NO","RIFIUTI_PE","QUANTITA_R","STATO_FISI","ODORE","MODALITA_S","PERCOLATO","VEGETAZION","STABILITA",
                            "INSEDIAMEN","INSEDIAME1","INSEDIAME2","DISTANZA_C","DISTANZA_P","INSEDIAME3","BOSCATE","BOSCATE_AB","AGRICOLO","AGRICOLO_A","TORRENTI_R","NOME_TORRE","RISCHIO_ES","RIFIUTI_IN",
                            "PROBABILE","IMPATTO_ES","POZZI_FALD","CRITICITA","IMPATTO_CO","NOTE","PULIZIA","DISSUASION","VALORE_GRA","PROBABILE_","FATTIBILE_","VALORE_FAT","LATITUDINE","LONGITUDIN",
                            "GCID","ID1","VALORE_RIS","SOCIO_PAES","VALORE_SOC","FATTIBILIT","GMROTATION","MY_ORIG_ID","USO_AGRICO"],
          "outputConfig": {
              "id": "grissegnalazioni",
              "header":false
          },
         "outputTarget": "listasegnalazioni",
          "exportFormats": ["CSV","shape-zip"]
        }, 
          {  
            "ptype": "gxp_gcfeatureeditor",
            "featureManager": "featuremanager",
            "id":"featureEdit",
            "gcseg":"gcseggrid", 
            "toggleGroup": "toolGroup",
            "showSelectedOnly":false,
            "actionTarget": {"target":"grissegnalazioni.tbar", "index": 0},
            "editorConfig":{"status":{
                            
                                "xtype": "combo",
                                "store": [
                                "Annullato","Aperto","Chiuso","Sopralluogo assegnato","Sopralluogo preso in carico","Sopralluogo eseguito"
                                         ],
                                "queryMode": "local",
                                "typeAhead": true,
                                "triggerAction": "all",
                                "allowBlank":false
                },"CODICE":{"allowBlank":false},"GRAVITA":{"allowBlank":false},"RISCHIO":{"allowBlank":false}
                },
                "propertyNames":{"status":"STATUS"},
                "requiredFields":["status","GRAVITA","RISCHIO","CODICE"]
        },
        {
          "ptype": "gxp_spatialqueryform",
          "featureManager": "featuremanager",
          "featureGridContainer": "seglist",
          "outputTarget": "qrypnl",
          "showSelectionSummary": true,
          "actions": null,
          "id": "bboxquery",
          
          "autoComplete": {
            "sources": ["geosolutions"],
            "url": "http://geocollect.geo-solutions.it/geoserver/ows",
            "pageSize": 10
          },
          "outputConfig":{
                  "outputSRS": "EPSG:900913",
                  "selectStyle":{
                          "strokeColor": "#ee9900",
                          "fillColor": "#ee9900",
                          "fillOpacity": 0.4,
                          "strokeWidth": 1
                  },
                  "spatialFilterOptions": {    
                          "lonMax": 20037508.34,  
                          "lonMin": -20037508.34,
                          "latMax": 20037508.34,  
                          "latMin": -20037508.34  
                  },
                  "bufferOptions": {
                        "minValue": 1,
                        "maxValue": 10000,
                        "decimalPrecision": 2,
                        "distanceUnits": "m"
                  }
          },
          "spatialSelectorsConfig":{
                "bbox":{
                    "xtype": "gxp_spatial_bbox_selector"
                },
                "buffer":{
                    "xtype": "gxp_spatial_buffer_selector"
                },
                "circle":{
                    "xtype": "gxp_spatial_circle_selector",
                    "zoomToCurrentExtent": true
                },
                "polygon":{
                    "xtype": "gxp_spatial_polygon_selector"
                }
              }
        }, {
            "ptype": "gxp_addlayer",
            "showCapabilitiesGrid": true,
            "useEvents": false,
            "showReport": "never",
            "directAddLayer": false,
            "id": "addlayer"
        }, {
            "actions": ["-"], 
            "actionTarget": "paneltbar"
        }, {
            "ptype": "gxp_geolocationmenu",
            "actionTarget": {"target": "paneltbar", "index": 23},
            "toggleGroup": "toolGroup"
        }, {
            "actions": ["->"], 
            "actionTarget": "paneltbar"
        }, {
            "ptype": "gxp_help",
            "actionTarget": "paneltbar",
            "text": "Help",
            "tooltip":"MapStore Guide",
            "index": 24,
            "showOnStartup": false,
            "fileDocURL": "MapStore-Help.pdf"
        }, {
            "ptype": "gxp_about",
            "poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
            "actionTarget": {"target": "panelbbar", "index": 1}
        }, {
            "ptype": "gxp_languageselector",
            "actionTarget": {"target": "panelbbar", "index": 3}
        },  {
            "ptype": "gxp_wmsgetfeatureinfo_menu", 
            "regex": "[\\s\\S]*[\\w]+[\\s\\S]*",
            "picturesBrowserConfig": {
                "baseUrl": "http://geocollect.geo-solutions.it/opensdi2-manager/mvc/fileManager/extJSbrowser",
                "folder": "/media/punti_abbandono/",
                "featureProperty": "MY_ORIG_ID",
                "urlSuffix":"/2"
            },
            "useTabPanel": false,
            "toggleGroup": "toolGroup",
            "actionTarget": {"target": "paneltbar", "index": 20}
        }
    ]  
}