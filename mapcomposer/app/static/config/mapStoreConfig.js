    {
    "geoStoreBase":"http://localhost:8080/geostore/rest/",
    "proxy":"/http_proxy/proxy/?url=",
    "defaultLanguage": "it",
    "embedding": false,
    "gsSources":{                
        "csi_aa": {
            "ptype": "gxp_wmssource",
            "title": "Limiti Amministrativi RP",
            "version":"1.3.0",
            "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS01_AmbitiAmministrativi"
        },
        "csi_tu": {
            "ptype": "gxp_wmssource",
            "title": "Tessuto Urbanizzato RP",
            "version":"1.3.0",
            "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS02_TessutoUrbanizzato"
        },
        "csi_trasp": {
            "ptype": "gxp_wmssource",
            "title": "Trasporti RP",
            "version":"1.3.0",
            "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS03_Trasporti"
        },
        "csi_idro": {
            "ptype": "gxp_wmssource",
            "title": "Idrografia RP",
            "version":"1.3.0",
            "url": "http://geoeng-pta.regione.piemonte.it/ws/pta/PIE_WMS04_Idrografia"
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
        },		
        "destination": {
            "ptype": "gxp_wmssource",
            "title": "Destination GeoServer",
            "version":"1.1.1",
            "url": "http://destination.geo-solutions.it/geoserver/it.geosolutions/ows",
            "layerBaseParams": {
                "TILED": true,
                "TILESORIGIN": "-180,-90"
            }
        }
    },
    "map": {
        "projection": "EPSG:3857",
        "units": "m",
        "center": [903893.13597286, 5651406.520669],
        "zoom": 8,
        "maxExtent": [
        456125.02434063, 5403020.7962146,
        1323838.1693132, 5887325.807362
        ],
        "layers": [                      
            
        {
            "source": "bing",
            "title": "Bing Aerial",
            "name": "Aerial",
            "group": "background"
        }, 
        {
            "source": "ol",
            "group": "background",
            "fixed": true,
            "type": "OpenLayers.Layer",
            "visibility": false,
            "args": [
            "Nessuno sfondo", {
                "visibility": false
            }
            ]
        },
        {
            "source": "osm",
            "title": "Open Street Map",
            "name": "mapnik",
            "group": "background"
        },{
            "source": "mapquest",
            "title": "MapQuest OpenStreetMap",
            "name": "osm",
            "group": "background"
        },
        {
            "source": "csi_aa",
            "title": "Ambiti Amministrativi",
            "name": "AmbitiAmministrativi",
            "group": "Dati di base",
            "visibility": false
        },{
            "source": "csi_tu",
            "title": "Tessuto Urbanizzato",
            "name": "TessutoUrbanizzato",
            "group": "Dati di base",
            "visibility": false
        },{
            "source": "csi_trasp",
            "title": "Trasporti",
            "name": "Trasporti",
            "group": "Dati di base",
            "visibility": false
        },{
            "source": "csi_idro",
            "title": "Idrografia",
            "name": "Idrografia",
            "group": "Dati di base",
            "visibility": false
        },{
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
            "source": "destination",
            "title": "Rischio Totale",
            "name": "aggregated_data_selection",
            "displayInLayerSwitcher": true,
            "tiled": false
        }
        ]
    },
	
    "cswconfig": {
        "catalogs": [
        {
            "name": "Regione Piemonte", 
            "url": "http://www.ruparpiemonte.it/geocatalogorp/geonetworkrp/srv/it/csw", 
            "description": "Regione Piemonte"
        }				
        ],
        "dcProperty": "title",
        "initialBBox": {
            "minx":-13,
            "miny":10,
            "maxx":-10,
            "maxy":13
        }, 
        "cswVersion": "2.0.2",
        "filterVersion": "1.1.0",
        "start": 1,
        "limit": 10,
        "timeout": 60000
    },
	
    "proj4jsDefs": {
        "EPSG:32632": "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "EPSG:3857": "+title= Google Mercator EPSG:3857 +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"
    },
	
    "tools":[
    {
        "ptype":"gxp_layertree",
        "outputConfig":{
            "id":"layertree"
        },
        "outputTarget":"tree"
    },
    {
        "ptype":"gxp_legend",
        "outputTarget":"legend",
        "outputConfig":{
            "autoScroll":true
        },
        "legendConfig":{
            "legendPanelId":"legendPanel",
            "defaults":{
                "style":"padding:5px",
                "minScale":5000,
                "baseParams":{
                    "LEGEND_OPTIONS":"forceLabels:on;forceTitles:off;fontSize:10",
                    "WIDTH":25,
                    "HEIGHT":25
                }
            }
        }
    },{
        "ptype": "gxp_addlayers",
        "actionTarget": "tree.tbar",
        "upload": true
    }, {
        "ptype": "gxp_removelayer",
        "actionTarget": ["tree.tbar", "layertree.contextMenu"]
    }, {
        "ptype": "gxp_removeoverlays",
        "actionTarget": "tree.tbar"
    },
    {
        "ptype":"gxp_groupproperties",
        "actionTarget":[
        "tree.tbar",
        "layertree.contextMenu"
        ]
    },
    {
        "ptype":"gxp_layerproperties",
        "actionTarget":[
        "tree.tbar",
        "layertree.contextMenu"
        ]
    },
    {
        "ptype":"gxp_zoomtolayerextent",
        "actionTarget":{
            "target":"layertree.contextMenu",
            "index":0
        }
    },
    {
        "ptype":"gxp_zoomtoextent",
        "actionTarget":{
            "target":"paneltbar",
            "index":15
        }
    },
    {
        "ptype":"gxp_navigation",
        "toggleGroup":"toolGroup",
        "actionTarget":{
            "target":"paneltbar",
            "index":16
        }
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
    {
        "ptype":"gxp_zoombox",
        "toggleGroup":"toolGroup",
        "actionTarget":{
            "target":"paneltbar",
            "index":17
        }
    },
    {
        "ptype":"gxp_zoom",
        "actionTarget":{
            "target":"paneltbar",
            "index":18
        }
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
    {
        "ptype":"gxp_navigationhistory",
        "actionTarget":{
            "target":"paneltbar",
            "index":19
        }
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
    {
        "ptype":"gxp_wmsgetfeatureinfo",
        "toggleGroup":"toolGroup",
        "actionTarget":{
            "target":"paneltbar",
            "index":20
        }
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
    {
        "ptype":"gxp_measure",
        "toggleGroup":"toolGroup",
        "actionTarget":{
            "target":"paneltbar",
            "index":21
        }
    },		
    {
        "actions": ["->"], 
        "actionTarget": "paneltbar"
    }, 
    {
        "ptype": "gxp_dynamicgeocoder",
        "outputTarget":"paneltbar",
        "index": 222
    }, 
    {
        "ptype": "gxp_reversegeocoder",
        "outputTarget":"paneltbar",
        "outputConfig": {
            "width": "200"
        },
        "index": 23
    },
    {
        "actions":[
        "-"
        ],
        "actionTarget":"paneltbar"
    },
    {
        "ptype":"gxp_georeferences",
        "actionTarget":{
            "target":"paneltbar",
            "index":24
        }
    },
    {
        "ptype": "gxp_syntheticview",
        "outputTarget": "east",
        "id": "syntheticview",
        "selectionLayerName": "aggregated_data_selection",
        "selectionLayerTitle": "Rischio Totale", 	
        "targetLayerName": "bersagli",		
        "bufferLayerName": "siig_aggregation_1_buffer",
        "selectionLayerBaseURL": "http://destination.geo-solutions.it/geoserver/geosolutions/wms",
        "selectionLayerProjection": "EPSG:32632",
        "geometryName": "geometria",
        "accidentTipologyName": "tipologia",
        "index": 28
    },
    {
        "ptype": "gxp_wfsgrid",
        "outputTarget": "featurelist",
        "wfsURL": "http://destination.geo-solutions.it/geoserver/geosolutions/wfs",
        "featureType": "bersagli",
        "storeFieldsNotHuman": [
        {
            "name": "id",              
            "mapping": "id"
        },

        {
            "name": "geometry",        
            "mapping": "geometry"
        },

        {
            "name": "id_tema",         
            "mapping": "properties.id_tema"
        },

        {
            "name": "superficie",      
            "mapping": "properties.superficie"
        },

        {
            "name": "descrizione_clc", 
            "mapping": "properties.descrizione_clc"
        },

        {
            "name": "tipobersaglio", 
            "mapping": "properties.tipobersaglio"
        },

        {
            "name": "type",		    
            "mapping": "type"
        }
        ],
        "columnModelNotHuman": [
        {
            "header": "Superficie",      
            "dataIndex": "superficie"
        },

        {
            "header": "Tipologia", 
            "dataIndex": "tipobersaglio"
        },

        {
            "header": "Classe Corine Land Cover", 
            "dataIndex": "descrizione_clc"
        }
        ],
        "storeFieldsHuman": [
        {
            "name": "id",              
            "mapping": "id"
        },

        {
            "name": "geometry",        
            "mapping": "geometry"
        },

        {
            "name": "id_tema",         
            "mapping": "properties.id_tema"
        },

        {
            "name": "superficie",      
            "mapping": "properties.superficie"
        },

        {
            "name": "descrizione_clc", 
            "mapping": "properties.descrizione_clc"
        },

        {
            "name": "tipobersaglio", 
            "mapping": "properties.tipobersaglio"
        },

        {
            "name": "type",		    
            "mapping": "type"
        }
        ],
        "columnModelHuman": [
        {
            "header": "Residenti",      
            "dataIndex": "superficie"
        },

        {
            "header": "Tipologia", 
            "dataIndex": "tipobersaglio"
        }
        ],
        "index": 29
    }
    ]
}
