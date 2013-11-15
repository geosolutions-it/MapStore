.. module:: mapstore.configuration
   :synopsis: Learn about MapStore configuration.

.. _mapstore.configuration:

MapStore Configuration
----------------------

The MapComposer configuration is basically a JSON with, in most cases, several properties that define how to the GIS Viewer must be instantited. This means:

	- **Map**: Accomodates the properties to buil the OpenLayers.Map.
	- **Language**: The default language to use for teh Viewer.
	- **Layers**: JSON Array that defines the default layers to show in the Map (both `overlays` and `background` layers).	
	- **WMS Sources**: Accomodate relavant WMS properties to register a WMS service and perform a `GetCapabilities` at startup.
	- **Tools**: JSON Array that defines which must be the MapComposer plugins.
	- **CustomPanel**: An easy way to interact with the Viewer layout from the external configuration.
	- more other.
	
In next paragraph the relevant and most frequently used configuration properties will be illustrated.

Configuration Options
^^^^^^^^^^^^^^^^^^^^^

*   `geoStoreBase`: Geostore URL (**if empty http://<server>:<port>/geostore/rest/ is used**)

*   `proxy`: proxy URL

*   `defaultLanguage`: default language code

*   `gsSources`: Sources for getCapabilities: example::

	{
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


*   `proj4jsDefs`: additional proj4js Definitions example:: 

          {"EPSG:3003":"+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs"}

*   `map`: Map configuration. Below an example::

		{
			"projection": "EPSG:900913",
			"units": "m",
			"center": [1250000.000000, 5370000.000000],
			"zoom":5,
			"maxExtent": [
				-20037508.34, -20037508.34,
				20037508.34, 20037508.34
			],
			"layers": [{
				"source": "mapquest",
				"title": "MapQuest OpenStreetMap",
				"name": "osm",
				"group": "background"
			}]
		}

* `tools`: Optional Array of tools configurations. If present, overrides all the default MapStore configuration.

* `customTools`: Optional Array of tools configurations. MapStore provides a default list of plugin used for the viewer. Using `customTools` you can provide an additional plugin configuration list to the default one::

		"customTools":[
			{
				"ptype": "gxp_zoomtoextent",
				"forceMultiple":true,
				"actionTarget": {"target": "paneltbar", "index": 13}
			}
		]

.. note:: By default you cannot have two configuration of the same plugin. So that defined in `customTools` override the default one. In order to override this behavior MapStore allows you to specify a `forceMultiple` (setted to true) for the additional plugin configuration. In this way you can have multiple plugin's instances. Below an example, to set a custom extent for the *Zoom To Max Extent* plugin:
		  
		  .. code-block:: json
		
				"customTools":[{
						"ptype": "gxp_zoomtoextent",
						"actionTarget": {"target": "paneltbar", "index": 1},
						"extent":[ 1046403.2, 5200006.1, 1413757.5,  5544708.1]
					},
					{
						"ptype": "gxp_zoomtoextent",
						"forceMultiple":true,
						"actionTarget": {"target": "paneltbar", "index": 13}
				}]

		  This configuration will change the extent of the default plugin (first config) and will add another one, using the `forceMultiple` attribute, with the default values instead.

* `portalConfig`: Optional configuration to override gxp Viewer configuration. This represent a configuration object for the wrapping container of the viewer. This will be an ``Ext.Panel`` if it has a ``renderTo`` property, or an ``Ext.Viewport`` otherwise. Below a simple example in order to simply remove the main Ext.Panel header::

		"portalConfig":{
			"header": false
		}

* `customPanels`: Optional Array of `Ext.Panel` configurations. If present allows to introduce additional panels to the viewport.

* `georeferences`: Array of regions. If present, overrides the default `georeferences_data` variable defined in `data/georeferences.js`.

* `tab` : Force to use Tabs visualization for the viewport. 

A Configuration Example below::

		{
			"geoStoreBase":"",
			"proxy":"/http_proxy/proxy/?url=",
			"defaultLanguage": "en",
			"gsSources":{ 
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
			"map": {
				"projection": "EPSG:900913",
				"units": "m",
				"center": [1250000.000000, 5370000.000000],
				"zoom": 5,
				"maxExtent": [
					-20037508.34, -20037508.34,
					20037508.34, 20037508.34
				],
				"layers": [
					{
						"source": "bing",
						"title": "Bing Aerial",
						"name": "Aerial",
						"group": "background"
					}, {
						"source": "osm",
						"title": "Open Street Map",
						"name": "mapnik",
						"group": "background"
					},{
						"source": "mapquest",
						"title": "MapQuest OpenStreetMap",
						"name": "osm",
						"group": "background"
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
					}
				]			
			},
			"customTools": [
				{
					ptype: "gxp_googleearth",
					actionTarget: {target: "paneltbar", index: 24}
				}
			]
		}   
