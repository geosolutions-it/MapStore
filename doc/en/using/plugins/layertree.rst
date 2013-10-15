.. _mapstore.layertree:

Using the LayerTree plugin
==========================

| Using the Layertree is pretty straightforward.
| This plugin displays a tree view of the layers loaded into the map and provide some basic functionalities for layers such as:

* Enabling and Disabling visibility
* Grouping
* Ordering

The plugin also provides placeholders for other plugins, in our setup they are:

* AddLayers
* RemoveLayer 
* RemoveOverlays
* AddGroup
* RemoveGroup
* GroupProperties
* LayerProperties
* ZoomToLayerExtent
* GeoNetworkSearch


Enabling and Disabling Layers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

#. Open the previously created map **training-map**

#. Zoom in |magnifier| until you can see at least the `Boulder streets`

   As you can see the streets are over the `polygonal landmarks` 

	.. figure:: img/layertree1.png
				
				You can see both the landmarks and the streets.

#. Disable the `Boulder streets` checkbox clicking on it

	.. figure:: img/layertree2.png
				
				Streets are no longer visible.

Ordering Layers
^^^^^^^^^^^^^^^

#. Zoom in |magnifier| again until you can see at the `Boulder buildings`

	.. figure:: img/layertree3.png
	
				The green Landmarks are over the grey Buildings.

#. | Change the order of the layers in order to show the buildings over the landmarks
   | Click and drag the `Boulder buildings` layer name over the `Boulder polygonal landmarks`
   
	.. figure:: img/layertree4.png
	
				A little icon informs you where are you going to drop the layer.

#. Releasing the layer changes the visibility order, so now you can see the Buildings other the Landmarks
   
	.. figure:: img/layertree5.png
	
				Buildings are now visible other the Landmarks.

Grouping Layers
^^^^^^^^^^^^^^^

#. To create a new layer group:
   
   * Click on the |newgroup| `Add a new group in the layer tree`  button
   * Write the group name (in our case is `Boulder Group`)
   * Click on the |Add| `Add group` button   

	.. figure:: img/layertree6.png  

	.. figure:: img/layertree7.png
	
				An empty group is now visible in the layer tree.

#. Drag the layers `Boulder polygonal landmarks` and `Boulder buildings` over the new group to add them to it
   
	.. figure:: img/layertree8.png
	
				The layers are now grouped.

   When layers are grouped they can be enabled or disabled together
   
   The group can also be collapsed

Showing Layer Properties
^^^^^^^^^^^^^^^^^^^^^^^^

Right-clicking on a layer shows up the contextual menu with available actions.

	.. figure:: img/layerprop1.png

| The most relevant ones are `Layer Properties` and `View Metadata`
| The `Layer Properties` are described below, for the `View Metadata` option please refer to the :ref:`Metadata Explorer section<mapstore.plugins.metadataexplorer>`

#. The `About` tab shows the layer name, the title displayed in the layertree and the description
   
	.. figure:: img/layerprop2.png  

#. | The `Display` tab allows you to modify some layer display options, such as opacity and transparency
   | The `format` combobox let you choose the tiles image format the server should provide
   
	.. figure:: img/layerprop3.png  
	
#. | The `Cache` tab specifies if the map should cache the layer tiles or not
   
	.. figure:: img/layerprop4.png  
	
#. | The `Styles` tab allows you to change the layer style, choosing from a list of available styles
   | It also shows a little summary of the selected style
   
	.. figure:: img/layerprop5.png  
	

.. |magnifier| image:: img/magnifier_zoom_in.png
.. |newgroup| image:: img/folder_add.png
.. |Add| image:: img/add.png
