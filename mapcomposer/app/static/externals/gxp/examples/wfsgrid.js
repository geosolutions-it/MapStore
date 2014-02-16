/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

var store, map, grid;
Ext.onReady(function() {
    OpenLayers.ProxyHost = "/proxy/?url=";

    var container = new Ext.Container({
        "id": "gridcontainer",
        "renderTo": "grid"
    });
    var wfsGrid = new gxp.plugins.WFSGrid({
        "wfsURL": "http://localhost:8080/geoserver/wfs",
        "featureType": "states",
        "outputTarget": "gridcontainer",
        "name": "States",
        "fields": [
            {
                "name": "state_name",         
                "mapping": "STATE_NAME"
            },
            {
                "name": "state_fips",      
                "mapping": "STATE_FIPS"
            },
            {
                "name": "sub_region",      
                "mapping": "SUB_REGION"
            }
        ],
        "columns": [
            {
                "header": "State name",
                "dataIndex": "state_name"
            },
            {
                "header": "State fips",
                "dataIndex": "state_fips"
            },
            {
                "header": "Sub region",
                "dataIndex": "sub_region"
            }
        ]
    });

    var widget = wfsGrid.addOutput({  
        width: 500,
        height:300
    });
    
    // creates the map that will contain the vector layer with features
    map = new OpenLayers.Map("map");
    map.addLayer(new OpenLayers.Layer.WMS(
        "Stream",
        "http://localhost:8080/geoserver/wms",
        {layers: 'sf:land_shallow_topo_21600_tiled'}
    ));
    map.setCenter(new OpenLayers.LonLat(-100, 35), 3);
   

});
