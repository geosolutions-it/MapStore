.. module:: mapstore.tipstricks
   :synopsis: Learn about Tips and Tricks in MapStore.

.. _mapstore.tipstricks:

MapStore Tips and Tricks
========================

In some cases certain steps can facilitate the development of certain components.

Map View in a Tab
^^^^^^^^^^^^^^^^^

MapStore automatically recognize if some parameters are present in the configuration to determine to render the viewer in a tab or not. For example if you use the MetadataExplorer tool you need this kind of visualization. If the `cswconfig` paramenter is present, the viewer will be automatically rendered in a tab.

To force the tab rendering add  `"tab":true` to the MapStore configuration. 

Remove View Header
^^^^^^^^^^^^^^^^^^

Many times the "View" header is not needed. To change the configuration of that panel, you can write that configuration inside the `portalConfig` parameter in configuration::

        "portalConfig":{
            "header":false,
        }

Add and customize welcome screen
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want you can add a welcome sceen during the viewer loading. This is very simple to do following these steps:

1. Go to the composer.html/viewer.html and uncomment the relative code to import the relavant script.

2. MapStore provides for you a default welcome sceen. If you want to customize this please edit the relevant CSS inside the mapstore.css file. The welcome sceen CSS names are::

         #loading-mask, #loading, #loading .loading-indicator

Enable the Graticule Plugin
^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order to enable the graticule plugin please add the followig property to the 'app' definitions inside the composer.html and/or viewer.html::

	`showGraticule: true,` 

Follow aconfiguration example::

	app = new GeoExplorer.Composer({
			...
			sources: sources,
			showGraticule: true,
			...
	}, mapIdentifier, authorization, fullScreen); 

Notice that this Plugin only work if the map projection is EPSG:4326. 

Add a new submodule
^^^^^^^^^^^^^^^^^^^

In MapStore you can add a new submodule in order to integrate external functionalities. Doing this is very simple and you can follow the 'csw' module intergration located at::

        you@prompt:~$ cd mapstore/
        you@prompt:~$ cd mapcomposer/app/static/externals/csw

In order to add a new external submodule (you have also the possibility to use a Git submodule) you have to follow these steps:

1. Copy your submodule at the following path::

        you@prompt:~$ cd mapcomposer/app/static/externals

2. Then link the module dependencies to the 'mapcomposer' editing the 'buildjs.cfg' dependencies file  located at::

        you@prompt:~$ cd mapstore/mapcomposer

   Following the 'metadataexplorer' example in this file::

           [metadataexplorer.js]
           root = app/static/externals/csw

           include =
               src/CSWCatalogChooser.js
               src/CSWGrid.js
               src/CSWHttpProxy.js
               src/CSWPagingToolbar.js
               src/CSWPanel.js
               src/CSWRecord.js
               src/CSWRecordsReader.js
               src/CSWSearchTool.js
               src/eventHandlers.js
               lib/ResourceBundle/Bundle.js
               lib/ResourceBundle/PropertyReader.js

3. Add the new module dependencies to the Ant build script (images, css etc.) located at::

         you@prompt:~$ cd mapstore/

   Following the 'metadataexplorer' example in this file::

        <!-- copy metadataexplorer css  -->
        <copy todir="${composerbuild}/${ant.project.name}/WEB-INF/app/static/externals/csw/css">
            <fileset dir="mapcomposer/app/static/externals/csw/css"/>
        </copy>
        <!-- copy metadataexplorer img -->
        <copy todir="${composerbuild}/${ant.project.name}/WEB-INF/app/static/externals/csw/img">
            <fileset dir="mapcomposer/app/static/externals/csw/img"/>
        </copy>
        <!-- copy metadataexplorer i18n -->
        <copy todir="${composerbuild}/${ant.project.name}/WEB-INF/app/static/externals/csw/i18n">
            <fileset dir="mapcomposer/app/static/externals/csw/i18n"/>
        </copy>


Configure an empty background layer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To add an empty background to the backgrounds list, add the following configuration to the map layers array::
      
       {
            "source": "ol",
            "group": "background",
            "fixed": true,
            "type": "OpenLayers.Layer",
            "visibility": false,
            "args": [
                "None", {"visibility": false}
            ]
       }

Add Custom panels directly from configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The `customPanels` attribute is an Array that can contain many Ext.Component configuration object that will be placed inside MapStore. They can be used to wrap plugins, contain custom html or also other custom panels. 

One example of custom panels is the :ref:`mapstore.mapmanager`.

`http://localhost:8081/mapcomposer/?config=markerEditor <http://localhost:8081/mapcomposer/?config=markerEditor>`__

The `customPanelSample` configuration is an ad hoc example to help you to use this useful configuration option. It shows nested panel definition, plugin placement, custom html, and also an IFrame.

`http://localhost:8081/mapcomposer/?config=customPanelSample <http://localhost:8081/mapcomposer/?config=customPanelSample>`__

.. note:: If you want to place some custom panels inside other custom panel (e.g. some panels inside a tab), you have to place the container before the other panels in the array.

Custom panels can have the `target` attribute (String) . If present, the panel will be placed inside the container with this string as id (for exemple, the tab panel that contains the layer tree and the legend has `west` as id). If `target` is not present the panel will be placed inside the portalPanel.

This is an extract from `customPanelSample.js` configuration file::

		...

		"customPanels":[
			{
				"xtype":"panel",
				"id":"additionalTab", 
				"target": "west",
				"title": "my New Tab",
					"layout":"accordion"
			},{
				"target":"additionalTab",
				"html":"This is a custom panel. Both this and 'my New Tab' are custom panels.",
				"title": "Panel 1"
			},{
				"target":"additionalTab",
				"html":"insert your plugin here",
				"title": "Panel 2"
			},{
				"xtype":"tabpanel",
				"id":"east", 
				"region": "east",
				"width": 570,
				"minWidth":550,
				"activeTab": 0,
				"border":false,
				"collapseMode": "mini" ,
				"items":{
				"xtype":"panel",
				"id":"editor",
				"title":"editor",
				"layout":"fit",
				"target":"east"
					
				}
			},{
				"xtype":"panel",
				"id":"south", 
				"region":"south",
				"html":"another custom panel....",
				"height":100
			},{
				"target":"east",
				"html":"<iframe style='width:100%;height:100%' src='http://mapstore.geo-solutions.it' ><iframe/>",
				"layout":"fit",
				"itemId":"startTab",
				"title": "MapStore WebSite"
			}
		],

		...

		"customTools":[

		...

		{
			"ptype": "gxp_marker_editor",
			"outputTarget":"editor",
				"toggleGroup":"toolGroup"
		}]

		...