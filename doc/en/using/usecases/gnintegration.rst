.. module:: mapstore.mapmanager
   :synopsis: Learn on how MapStore can be integrated with GeoNetwork.

.. _mapstore.using.usecases.gnintegration:

Using MapStore with GeoNetwork
==============================

MapStore can be used as an alternative GeoNetwork Map Viewer, this section provides a simple use case. In this case you can have all the advanced **MapComposer** features on GeoNetwork ! Obviously, in order to use MapStore in this way, a dedicated GeoNetwork version must be used containing all the necessary customizations that allow the integration.

.. note:: Currently, the required GeoNetwork customizations, are provided by GeoSolutions on a `GeoNetwork fork on Github <https://github.com/geosolutions-it/core-geonetwork>`__, inside the most recent RNDT branch. **In this training you already find a template that provides the integration**.

1. Open the MapStore `GeoNetwork template  <http://localhost:8081/mapcomposer/geonetwork?locale=en>`__.

   	.. figure:: img/geonetwork0.png
	
				Mapstore Geonetwork Integration GUI.
				
	.. note:: The GeoNetwork integration is implemented using a dedicated template with an optimized MapStore instance for it.

2. In ths MapStore we have two Tabs:

	- **Portal**: Panel that accommodates the GeoNetwork home page. You can navigate metadata accordingly to the GeoNetwork behaviors.
	- **View**: Panel that implements the MapStore Graphic User Interface as GoeNetwork viewer. Functionalities are the same of a standard MapStore implementation, but in this case you can use the View Tab in order to visualize WMS resources of GeoNetwork metadata.

3. Click on `Search` button inside the GeoNetwork Simple Search Form. We have an prconfigured metadata for this training:

   	.. figure:: img/geonetwork1.png
	
				Simple Search in GeoNetwork.

4. Inside the GeoNetwork right panel a result list appears with GeoNetworks metadata. We have a pre-configured metadata that links a WMS resource about **Boluder Plygonal Landmarks** in GeoServer.

   	.. figure:: img/geonetwork2.png
	
				GeoNetwork result list.

5. Click now on the `Interactive Map` button located inside the metadata record (result list). The related WMS resource exposed by this metadata are loaded in MapStore Viewer.

   	.. figure:: img/geonetwork3.png
	
				Metadata WMS resource in MapStore Map.
				
6. Metadata's WMS resources loaded in MapStore's Map are also linked to the GeoNetwork's `Metadata Show Embedded` section that allows to examine Metadata details. Right click on new added layer in TOC and then click on **View Metadata** action.

   	.. figure:: img/geonetwork4.png
	
				View Metadata in MapStore Context Menu.
				
7. The `Search` Tab will be opened and Metadata details loaded inside the GeoNetwork main panel.

   	.. figure:: img/geonetwork5.png
	
				Metadata details in GeoNetwork.
	
.. note:: Current MapStore Template for GeoNetwork provide also API in order to load Metadata details at startup::

			http://localhost:8081/mapcomposer/geonetwork?locale=en&uuid=8c2f6246-1131-4e18-a510-9bf0a6d73682
			
		  This is the same request performed by the View Metadata tool. You can try to copy and paste the URL above inside the browser in order to obtain the same result GeoNetwork side.