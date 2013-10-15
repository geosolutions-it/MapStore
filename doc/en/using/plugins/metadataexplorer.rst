.. module:: mapstore.metadataexplorer
   :synopsis: Learn on how to use the Metadata Explorer Plugin.

.. _mapstore.plugins.metadataexplorer:

Metadata Explorer Plugin
========================

In this section we learn on how to use the Metadata Explorer Plugin.

This plugin allows you to interact with catalogs, that comply with the standard `CSW - Catalog Service for the Web <http://www.opengeospatial.org/standards/cat>`__, using the **Metadata Explorer** module, an indipendent JavaScript component of MapStore.
Designed to be easy to use, smart and configurable, this tool shows data returned from the CSW services presenting a data preview and allowing to interact with a Maps on the same page.

.. note:: The Metadata Explorer tool wraps the OpenLayers CSW API in order to manage CSW requests (GetCapabilities and GetRecords) and ensures compatibility with CSW 2.0.2.

Metadata Explorer Tools
^^^^^^^^^^^^^^^^^^^^^^^

The Metadata Explorer functionalities can be summarized as follow:

	- **Source Selection**: Tool for a remote compatibility check. A button allows the User to add new CSW Catalogs to the default list.
	- **Simple Search**: Functionality that allows to perform an "Any Text Search" inside the selected catalog.
	- **Advanced Search**: Form panel, hidden at startup, that allow to perform more complex searches on selected CSW.
	
.. note:: The results of a performed search are shown in a **paginated** grid, and each row inside the grid can be expanded to see a more exhaustive presentation of data about the related record. Inside this view there are also some buttons, for interaction with Metadata WMS resources (Maps).

1. Open the `MapManager <http://localhost:8081/mapstore>`__ and login as **Admin** User as described in :ref:`mapstore.mapmanager` section.

2. Now open the recently created `training-map`.

	.. figure:: img/importexport1.png
	
				The Training Map.

3. The Metadata Explorer tool is located at the bottom side of the Viewport. Open the Metadata Explorer panel clicking on the |openbutton| button located on the bottom-right side. The Metadata Explorer tool wiil be opened.
		.. |openbutton| image:: img/openbutton.png
			:height: 20
			:width: 20

		
	.. figure:: img/metadata1.png
	
				The Metadata Explorer panel.
				
Simple Search
-------------

1. Select the **Comune di Firenze** CSW from the `Sources` dropdown:

	.. figure:: img/metadata2.png
	
				The CSW selection.
		
	- The Metadata Explorer checks before the CSW Version Compatibiilty (2.0.2).
	
		.. figure:: img/metadata3.png
	
				The CSW Compatibility check.
				
	- After the request to the remote Catalogue, the Tool report the result.

		.. figure:: img/metadata4.png
	
				The CSW Compatibility check result.

2. Perform a simple search entering **strade** as `Text to Search`. Then scroll down the SearchPanel and click on `Search`:

		.. figure:: img/metadata5.png
	
				The Simple Search.
				
3. Expand the a Record in order to see the Metadata summary:

		.. figure:: img/metadata6.png
				:height: 230
				:width: 506
	
	
				The Metadata Summary.
				
		.. figure:: img/metadata7.png
	
				The Available Actions on selected Metadata.

4. Click first on `View Map` button (|viewmap|). The layer related to the Metadata WMS resource will be added as overlay:
		.. |viewmap| image:: img/metadata8.png
			:height: 25
			:width: 130
			
		.. figure:: img/metadata9.png

			The Metadata WMS resource.
			
5. Then click on `View Metadata` button (|viewmetadata|). The metadata details will be opened in a new Tab.
		.. |viewmetadata| image:: img/metadata10.png
			:height: 25
			:width: 130
			
		.. figure:: img/metadata11.png

			The Metadata details.
			

		.. note:: The User have the possibility to open the Metadata details from the LayerTree context menu:

				.. figure:: img/metadata11a.png

					The Metadata details.
			
Advanced Search
---------------

1. Cancel the `Text to Search` text field content (`strade`).

2. Expand the **Advanced** form below and enter the following informations using the provided form tools. Then click on `Search`:

	- **Valid from**: 2013-06-01
	
			.. figure:: img/metadata12.png

				Valid from.
				
	- **to**: 2013-10-08
				
	- **User Current Extent**: true (check the checkbox)
	
			.. figure:: img/metadata13.png

				Valid to and use current Map extent.

3. The list of Metadata will be updated with the new search result:

			.. figure:: img/metadata14.png

				Advanced metadata result.
				
4. The User can navigate on the result list using the paging toolbar:

			.. figure:: img/metadata15.png

				Metadata Explorer paging toolbar.
				
Add a new Catalogue
-------------------

The Metadata Explorer allows the User to add more new catalogues to the default configuration.

1. Click on |resetbutton| inside the Search form.
		.. |resetbutton| image:: img/metadata18.png
			:height: 20
			:width: 20
			
2. Inside the `Search Tool`, click on the |addbutton|:
		.. |addbutton| image:: img/metadata16.png
			:height: 20
			:width: 20
			
3. Enter the local CSW URL (the GeoNetwork instance of the training) inside the dialog:  **http://localhost:8081/geonetwork/srv/it/csw**. The click on the **Add CSW Catalogue** button. 

			.. figure:: img/metadata17.png

				Add a new Cataloge to the default configuration from GUI.
				
4. The new CSW will be loaded so the User can perform new requests in the same way describen in the section above.

