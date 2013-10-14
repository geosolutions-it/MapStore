.. module:: mapstore.addlayers
   :synopsis: Learn on how to use The Add Layers Plugin.

.. _mapstore.plugins.addlayers:


Using the AddLayers plugin
==========================

| This section illustrates how to add layers to the map using the AddLayers plugin.
| The layers can be fetched from different servers.

Logging into MapManager 
^^^^^^^^^^^^^^^^^^^^^^^

| In order to modify the map you must be loged in as 'Admin'
| Follow the :ref:`MapManager<mapstore.mapmanager>` section to login.

Adding one or more new layers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

#. | Open the training map **training-map** clicking on the **Edit Map** |editmap| button.
   | If you cannot see the **Edit Map** button, you must first log in as described in the MapManager section.
   
.. |editmap| image:: img/map_edit.png

#. Click on the **Add Layers** (**+**) button on the left panel

	.. figure:: img/addlayers-left.png

			The left panel displays the layers tree and various layer tools

#. In the list of the available layers, select the three Boulder layers: **buildings**, **streets** and **polygonal landmarks**, and click **Add Layers**

	.. figure:: img/addlayers-panel.png

			The tool displays all available layers on the selected Server

	| You can open the single row to view more informations about the layer.  
	| Select more than one row at time holding `Shift` or `Ctrl` while clicking on rows

	.. figure:: img/addlayers-panel-selected.png

			Some layers are selected

	Notice that when layers are added to the map, the AddLayers panel does not close automatically, so you can choose other layers to add

#. | You can select a different server from the server list in the upper part of the tool.  
   | The server list is defined in the configuration of the tool

	.. figure:: img/addlayers-panel-selserver.png
				
				Server list.

#. | You can also filter the layers using the lower left textbox.  
   | The list will show only the layers containing the text in the textbox

	.. figure:: img/addlayers-panel-filter.png
	
				Filtered layers list

#. When all the desired layer are added, click **Close** to close the tool

#. Click on the **Save Map Context** |disk| button to save the map

.. |disk| image:: img/disk.png
