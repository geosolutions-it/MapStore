.. module:: mapstore.gfimenu
   :synopsis: Learn on how to use The Get Feature Info Menu.

.. _mapstore.gfimenu:

Get Feature Info Menu
=====================

This section illustrates how you can use the Get Feature Info Menu. 

The Get Feature Info Menu (|gfimenu_button|) is a menu available in the Map Composer template by default (it interacts with the layer tree for some operations). It contains some controls to retrieve informations about 
the layers on the map. 

   .. |gfimenu_button| image:: img/gfi_menu_button.png
        :height: 20
        
As you can see clicking on the arrow on the right of the button, this menu contains two controls
        
* Get Feature Info
* Active info on selected layer

	.. figure:: img/gfi_menu.png
	
				MapComposer in Viewer template with Marker Editor Plugin.

Get Feature Info Control
^^^^^^^^^^^^^^^^^^^^^^^^
#. Open the `MapManager <http://localhost:8081/mapstore>`__ and login as **Admin** User as described in :ref:`mapstore.mapmanager` section.

#. Now open the recently created `training-map`.
                
#. Select the "Get Feature Info" tool from the menu.(|gfimenu_button|)

#. Click on an the "Area Rocky Mountain Nati Pk". You will see a popup with the informations about the clicked features. 
	.. figure:: img/gfi_menu_popup.png
	
				The popup for with the information about the clicked region.

Active info on selected layer
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

#. Select the "Active info on selected layer" tool from the menu(|gfi_menu_active_button|).
    .. |gfi_menu_active_button| image:: img/gfi_menu_active_button.png
        :height: 20
    
#. Select the layer "Boulder polygonal landmarks" from the layer tree clicking on it.
    
    
#. Place the mouse over the "Area Rocky Mountain Nati Pk" (without clicking). A popup will be shown. You can have active information about the selected layer simply moving the mouse over it
    
    

	.. figure:: img/gfi_menu_active_popup.png
	
				The popup with information about the selected layer (note the selected layer on in the "Layer Tree").
                

