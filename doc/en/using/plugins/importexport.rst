.. module:: mapstore.importexport
   :synopsis: Learn on how to use The ImportExport Plugin.

.. _mapstore.plugins.importexport:

ImportExport Plugin
===================

The **MapComposer** component provide a GUI tool that allows the User to **import/export** data (currently supported import / export of Map context and kml / kmz files). 

.. warning:: The ImportExport tools requires the `ServiceBox <https://github.com/geosolutions-it/geostore>`__ application deployed in your servlet container. **ServiceBox** is basically a backend support that provide *import/export* functionalities through 'ad hoc' Java Servlets. When you have deployed the **ServiceBox** backend component, you can enable the ImportExport plugin in MapStore simply adding the related plugin configurationig (further information will be provided in later sections of this training).

Exporting and Importing Map Context
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Open the `MapManager <http://localhost:8081/mapstore>`__ and login as **Admin** User as described in :ref:`mapstore.mapmanager` section.

2. Now open the recently created `training-map`.

	.. figure:: img/importexport1.png
	
				The Training Map.
				
3. Click on the **ImportExport** Action Tool inside the main toolbar located in the top side of the Map panel. Then select on **Export Map**.

	.. figure:: img/importexport2.png
	
				Export a Map context.

4. In the export dialog, click on **Export Map** and then click **OK** in order to save locally the **context.map** file.

	.. note:: The **context.map** file contains the Map context. This means:

		* Added WMS Sources
		* Added Layers 
		* Zoom Extent 
		* etc ...
	
		at the time when the context has been saved.

	.. figure:: img/importexport3.png
	
				Export a Map context.
		
5. After saving the **context.map** file locally, open an empty `MapComposer <http://localhost:8081/mapcomposer/?locale=en>`__.

6. This time click on the **ImportExport** Action Tool and select **Import Map**. In the import dialog enter the path of the saved **context.map** and click import.
	
	.. figure:: img/importexport4.png
	
				Import a Map context.
				
7. The saved Map context is loaded and then you can continue working on your Map.

 	.. figure:: img/importexport1.png
	
				Imported Map context.

Exporting and Importing KML and KMZ
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The import/export tool can manages KML/KMZ files to. The KML/KMZ files are imported from the related file into an OpenLayers Vector layer. Vice versa the OpenLayers vector layer from the TOC will be exporten into a KML file.

.. warning:: The export functionality only produces KML files.

1. Click on the **ImportExport** Action Tool inside the main toolbar located in the top side of the Map panel. Then select **Import KML/KMZ**.

	.. figure:: img/importexport5.png
	
				KML/KMZ Import/Export tool.
				
2. Inside the import dialog enter the path of the file (KML or KMZ) and the name of the Vector layer. Then click on **Upload**:

   **KML/KMZ file**: %TRAINING_HOME%/data/mapstore/bbuildings.kmz
   
   **Layer Name**: bbuildings
   
   	.. figure:: img/importexport6.png
	
				Import a KMZ.
				
3. Use the MapStore **GeoCoder**, located in the top side of the Map panel, in order to zoom to the KMZ data extent. Enter **Boulder nebo rd**:

   	.. figure:: img/importexport7.png
	
				Zoom to the KMZ with MapStore GeoCoder.
				
	.. figure:: img/importexport8.png
	
				Boulder Buildings KMZ Vector layer.

4. Please select the previously imported **bbuildings** vector layer inside the TOC:
				
5. This time click on the **ImportExport** Action Tool and select **Export KML**. In the import dialog enter the name of the KML file to export (by default ``export.kml``).

	.. figure:: img/importexport9.png
	
				KML Export.
				
6. Open the newly KML file on Google Earth:

	.. figure:: img/importexport10.png
	
				The bbuilding KML file.
				
	.. figure:: img/importexport11.png
	
				The bbuilding KML file on GEarth.