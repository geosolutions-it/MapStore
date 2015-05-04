{
    "scaleOverlayMode": "basic",
    "externalHeaders": true,
    "header": {},
    "gsSources": {
        "MARISS-Layers": {
            "ptype": "gxp_wmssource",
            "title": "MARISS",
            "version": "1.1.1",
            "url": "/geoserver/mariss/ows",
            "layerBaseParams": {
                "TILED": true,
                "TILESORIGIN": "-20037508.34,-20037508.34"
            }
        },
        "MARISS-Layers2": {
            "ptype": "gxp_wmssource",
            "title": "SDE",
            "version": "1.1.1",
            "url": "/geoserver/ows",
            "layerBaseParams": {
                "TILED": true,
                "TILESORIGIN": "-20037508.34,-20037508.34"
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
        "center": [
            1250000.000000,
            5370000.000000
        ],
        "zoom": 5,
        "maxExtent": [
            -20037508.34,
            -20037508.34,
            20037508.34,
            20037508.34
        ],
        "layers": [
            {
                "source": "MARISS-Layers",
                "title": "Ship Detections",
                "name": "ship_detections",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "Wave Length",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "name": "sde:wl",
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "Wind Direction",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "name": "sde:wind_direction",
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "Wind Speed",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "name": "sde:wind_speed",
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "HS",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "name": "sde:hs",
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "Dirmet",
                "displayInLayerSwitcher": false,
                "visibility": false,
                "name": "sde:dirmet",
                "tiled": true
            },
            {
                "source": "MARISS-Layers2",
                "title": "SAR-imagery-footprints",
                "name": "TEM_QL__1P_mosaic_idx",
                "displayInLayerSwitcher": true,
                "tiled": true
            },
            {
                "source": "MARISS-Layers",
                "title": "SHIP-detection",
                "name": "tem_sd__1p",
                "displayInLayerSwitcher": true,
                "tiled": true
            },
            {
                "source": "google",
                "title": "Google Roadmap",
                "name": "ROADMAP",
                "group": "background"
            },
            {
                "source": "google",
                "title": "Google Terrain",
                "name": "TERRAIN",
                "group": "background"
            },
            {
                "source": "google",
                "title": "Google Hybrid",
                "name": "HYBRID",
                "group": "background"
            },
            {
                "source": "mapquest",
                "title": "MapQuest OpenStreetMap",
                "name": "osm",
                "group": "background"
            },
            {
                "source": "osm",
                "title": "Open Street Map",
                "name": "mapnik",
                "group": "background"
            },
            {
                "source": "bing",
                "title": "Bing Aerial",
                "name": "Aerial",
                "group": "background"
            },
            {
                "source": "bing",
                "title": "Bing Aerial With Labels",
                "name": "AerialWithLabels",
                "group": "background"
            },
            {
                "source": "ol",
                "group": "background",
                "fixed": true,
                "type": "OpenLayers.Layer",
                "visibility": false,
                "args": [
                    "None",
                    {
                        "visibility": false
                    }
                ]
            }
        ]
    },
    "customPanels": [
        {
            "xtype": "panel",
            "title": "Products Panel",
            "border": false,
            "id": "south",
            "region": "south",
            "layout": "fit",
            "height": 220,
            "collapsed": false,
            "collapsible": true,
            "header": true,
            "split": true
        },
        {
            "xtype": "tabpanel",
            "border": false,
            "id": "east",
            "region": "east",
            "width": 475,
            "split": true,
            "collapsible": true,
            "collapsed": false,
            "collapseMode": "mini",
            "activeTab": 0,
            "header": false,
            "items": [
                {
                    "region": "center",
                    "autoScroll": true,
                    "tbar": [],
                    "border": false,
                    "id": "downloadlist",
                    "title": "Cart",
                    "layout": "fit"
                }
            ]
        }
    ],
    "scaleOverlayUnits": {
        "bottomOutUnits": "nmi",
        "bottomInUnits": "nmi",
        "topInUnits": "m",
        "topOutUnits": "km"
    },
    "customTools": [
        {
            "ptype": "gxp_embedmapdialog",
            "actionTarget": {
                "target": "paneltbar",
                "index": 2
            },
            "embeddedTemplateName": "viewer",
            "showDirectURL": true
        },
        {
            "ptype": "gxp_categoryinitializer",
            "silentErrors": true
        },
        {
            "ptype": "gxp_mouseposition",
            "displayProjectionCode": "EPSG:4326",
            "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
        },
        {
            "ptype": "gxp_addlayer",
            "showCapabilitiesGrid": true,
            "useEvents": false,
            "showReport": "never",
            "directAddLayer": false,
            "id": "addlayer"
        },
        {
            "actions": [
                "-"
            ],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_geolocationmenu",
            "actionTarget": {
                "target": "paneltbar",
                "index": 23
            },
            "toggleGroup": "toolGroup"
        },
        {
            "actions": [
                "->"
            ],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_help",
            "actionTarget": "paneltbar",
            "text": "Help",
            "tooltip": "MapStore Guide",
            "index": 24,
            "showOnStartup": false,
            "fileDocURL": "MapStore-Help.pdf"
        },
        {
            "ptype": "gxp_about",
            "poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
            "actionTarget": {
                "target": "panelbbar",
                "index": 1
            }
        },
        {
            "actions": [
                "->"
            ],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_playback",
            "outputTarget": "paneltbar",
            "wfsGridId": "featuregrid",
            "id": "playback",
            "playbackMode": "range",
            "showIntervals": false,
            "labelButtons": true,
            "settingsButton": true,
            "rateAdjuster": false,
            "dynamicRange": false,
            "timeFormat": "l, F d, Y g:i:s A",
            "outputConfig": {
                "controlConfig": {
                    "step": 15,
                    "units": "Minutes",
                    "range": [
                        "2010-12-24T00:00:00.000Z",
                        "2010-12-24T23:59:00.000Z"
                    ],
                    "frameRate": 5
                }
            }
        },
        {
            "actions": [
                "->"
            ],
            "actionTarget": "paneltbar"
        },
        {
            "ptype": "gxp_featuremanager",
            "id": "productFeatureManager",
            "autoLoadFeatures": true,
            "remoteSort": true,
            "sortBy":["servicename", "identifier"],
            "forceMultiple": true,
            "autoSetLayer": false,
            "format": "JSON",
            "layer": {
                "source": "MARISS-Layers",
                "name": "product_checksum"
            },
            "symbolizer": {
                "Point": {
                    "pointRadius": 4,
                    "graphicName": "square",
                    "fillColor": "white",
                    "fillOpacity": 1,
                    "strokeWidth": 1,
                    "strokeOpacity": 1,
                    "strokeColor": "#333333"
                },
                "Line": {
                    "strokeWidth": 4,
                    "strokeOpacity": 1,
                    "strokeColor": "#ff9933"
                },
                "Polygon": {
                    "strokeWidth": 2,
                    "strokeOpacity": 1,
                    "strokeColor": "blue",
                    "fillColor": "white",
                    "fillOpacity": 0
                }
            },
            "selectedSymbolizer": {
                "Point": {
                    "pointRadius": 4,
                    "graphicName": "square",
                    "fillColor": "white",
                    "fillOpacity": 1,
                    "strokeWidth": 1,
                    "strokeOpacity": 1,
                    "strokeColor": "#187dc7"
                },
                "Line": {
                    "strokeWidth": 4,
                    "strokeOpacity": 1,
                    "strokeColor": "#AAAA39"
                },
                "Polygon": {
                    "strokeWidth": 4,
                    "strokeOpacity": 1,
                    "strokeColor": "white",
                    "fillColor": "white",
                    "fillOpacity": 0
                }
            },
            "pagingType": 1,
            "maxFeatures": 15
        },
        {
            "ptype": "gxp_featuremanager",
            "id": "cartProductFeatureManager",
            "autoLoadFeatures": true,
            "remoteSort": true,
            "forceMultiple": true,
            "autoSetLayer": false,
            "format": "JSON",
            "layer": {
                "source": "MARISS-Layers",
                "name": "ingestionproducts"
            },
            "pagingType": 1,
            "maxFeatures": 1000
        },
        {
            "ptype": "npa_results_grid",
            "selectOnMap": true,
            "toggleGroup": "toolGroup",
            "featureManager": "productFeatureManager",
            "outputConfig": {
                "emptyText": "Footprints not available for the selected filter",
                "showSlected": true,
                "id": "featuregrid",
                "pCartId": "cart",
                "addScenarioId": "scenario",
                "pCartType": "footprints",
                "loadMask": true,
                "expanderTemplateText": "<b>Layers:</b> {[values.layerlist.replace(/[a-z]*:/g,'').replace(/[_]/g,' ').split(',').join(', ')]}<b><br>Variables:</b>  {[values.variablelist.replace(/[a-z]*:/g,'').replace(/[_]/g,' ').split(',').join(', ')]}",
                "layersfilter": {},
                "viewConfig": {
                    "forceFit": true
                },
                "header": false,
                "mask": {
                    "msg": "Please wait..."
                },
                "propertyNames": {
                    "servicename": "ServiceID",
                    "time": "Time"
                },
                "timeFormat": "g:i:s A"
            },
            "ignoreFields": [
                "layerlist",
                "variablelist",
                "sartypelist",
                "identifier",
                "originalfilepath"
            ],
            "outputTarget": "south"
        },
        {
            "ptype": "npa_cart_grid",
            "id": "cart",
            "outputConfig": {
                "viewConfig": {
                    "forceFit": true
                },
                "propertyNames": {
                    "servicename": "ServiceID",
                    "identifier": "ProductID",
                    "time": "Time",
                    "sartype": "SAR",
                    "variable": "Variable",
                    "partition": "Partition"
                },
                "timeFormat": "l, F d, Y g:i:s A"
            },
            "ignoreFields": [
                "id",
                "bounds",
                "outfilelocation",
                "originalfilepath",
                "layername"
            ],
            "outputTarget": "downloadlist",
            "cartTypes": {
                "footprints": {
                    "description": "location_"
                }
            },
            "gIdTmp": "productId_{identifier}",
            "gTitleTmp": "Product {identifier}"
        },
        {
            "ptype": "npa_scenario",
            "id": "scenario",
            "layersgroup": {
                "sde:wl": {
                    "tpl": "service = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                },
                "sde:wind_direction": {
                    "tpl": "service = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                },
                "sde:wind_speed": {
                    "tpl": "service = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                },
                "sde:hs": {
                    "tpl": "service = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                },
                "sde:dirmet": {
                    "tpl": "service = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                },
                "ship_detections": {
                    "tpl": "servicename = '{servicename}' AND identifier = '{identifier}'",
                    "visible": false
                }
            },
            "gIdTmp": "prodId_{identifier}",
            "gTitleTmp": "Product {identifier}"
        },
        {
            "ptype": "gxp_wpsmanager",
            "id": "wpsSPM",
            "url": "/geoserver/wps",
            "geostoreUrl": "http://localhost/opensdi2-manager/facade/geostore/rest",
            "geostoreProxy": "/proxy?url=",
            "silentErrors": true,
            "checkLocation": true,
            "target": ""
        }
    ]
}