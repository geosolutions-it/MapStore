.. module:: mapstore.viewerconfig
   :synopsis: Manage Viewer Configuration

.. role:: red

.. _mapstore.viewerconfig:

Manage Viewer Configuration
=============================

This section illustrates how to manage the Viewer configurations in MapStore.

Configurations folder
^^^^^^^^^^^^^^^^^^^^^

MapStore load its Viewer Configuration from the filesystem and the Map Configuration from GeoStore

GeoStore is not mandatory, the Map Configuration can be embedded in the Viewer Configuration

The **Map Viewer** configurations folder is in \WEB-INF\app\static\config

The webapp folder structure is::

    /mapcomposer/
    	-WEB-INF
            -app
                -static
                    -config
                        -customPanelSample.js
                        -geonetwork.js
                        -mapStoreConfig.js
                        -markerEditor.js
                        -minimal.js
                        -queryConfig.js
                        -trainingConfig.js
                        -viewerConfig.js

Choosing a configuration
^^^^^^^^^^^^^^^^^^^^^^^^

Different configurations can be selected passing the `config` parameter set with the filename (without trailing '.js') to the mapcomposer URL

For example:
    http://localhost:8081/mapcomposer/?config=trainingConfig

When loading the Map Configuration from GeoStore it will override the one embedded in the Viewer Configuration

To get the Map Configuration from GeoStore the corresponding resource id must be bassed with the `mapId` parameter in the URL

For example:
    http://localhost:8081/mapcomposer/?mapId=4

An override example is:
    http://localhost:8081/mapcomposer/?config=trainingConfig&mapId=4


Edit a configuration
^^^^^^^^^^^^^^^^^^^^

A tipical configuration is a JSON formatted file with these properties:

*  "geoStoreBase": GeoStore URL , if empty assumes `localhost`. (Please refer to the `GeoStore manual <https://github.com/geosolutions-it/geostore/wiki>`__ for more informations)
*  "proxy": Proxy location path
*  "defaultLanguage": the default language ("en", "it", ..)
*  "gsSources": the list of gxp sources 
*  "map": the map configuration
*  "scaleOverlayUnits": list of available scale Units
*  "customPanels": list of additional panels
*  "customTools": list of additional tools

The following steps will introduce to the configuration setup

#. Open the `trainingConfig.js` file and add the following snippet to the **gsSources** JSON object:

    ::

        "google": {
        	"ptype": "gxp_googlesource" 
        },

    The resulting object should be:
    ::

		"gsSources":{ 
			"geosolutions": {
				"ptype": "gxp_wmssource",
				"url": "http://localhost:8080/geoserver/wms",
				"title": "GeoSolutions GeoServer",
				"SRS": "EPSG:900913",
				"version":"1.1.1",
				"layersCachedExtent": [
					-20037508.34,-20037508.34,
					20037508.34,20037508.34
				],
				"layerBaseParams":{
					"FORMAT":"image/png8",
					"TILED":true
				}
			},
			"osm": { 
				"ptype": "gxp_osmsource"
			},
			"ol": { 
				"ptype": "gxp_olsource" 
			},
			"google": {
				"ptype": "gxp_googlesource" 
			}
		}
	
#. Add a Google background to the map adding a layer to the map

    ::

		{
			"source": "google",
			"title": "Google Terrain",
			"name": "TERRAIN",
			"group": "background"
		}

    The resulting map object should be:
    ::

	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"center": [1250000.000000, 5370000.000000],
		"zoom":5,
		"maxExtent": [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		],
		"layers": [
			{
				"source": "osm",
				"title": "Open Street Map",
				"name": "mapnik",
				"group": "background"
			},{
				"source": "google",
				"title": "Google Terrain",
				"name": "TERRAIN",
				"group": "background"
			}
		]
	}

    The Viewer will now show the Google layer in the map
    
    .. figure:: img/config3.png

#. To have an empty background insert the following code as a map layer

    ::

		{
			"source": "ol",
			"title": "Empty Background",
			"group": "background",
			"fixed": true,
			"type": "OpenLayers.Layer",
			"visibility": false,
			"args": [
				"None", {"visibility": false}
			]
		}

#. In the `customTools` list add the following objects

    ::

		{
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"outputTarget": "paneltbar",
			"toggleGroup": "toolGroup",
			"index": 23
		}

    | The first part tells MapStore to add a separator to the top toolbar
    | The second one adds the `GeoLocation` plugin to the same toolbar, specifing that should toggle with other `toolGroup` buttons and be placed in position "23"

| A tool is usually instantiated only once, all other definitions in the configuration file will override the previous one.
| To have more than one instance per tool, maybe because they have different settings, the tool must have the property `forceMultiple` set to `true`
