.. module:: mapstore.bboxqueryform
   :synopsis: Learn on how to use The BBOQueryForm Plugin.

.. _mapstore.plugins.bboxqueryform:

Using the BBOXQueryForm Plugin
==============================

This section illustrates how you can use the BBOQueryForm Plugin. 
The BBOX Query Form plugin allows performing queries on feature layers. Using this plugin you can create alphanumeric queries on feature attributes and/or spatial query on a specific region of ??interest. You can also perform spatial queries by drawing Polygon, Circle or Buffer.

.. note:: This plugin requires another plugin named **FeatureGrid** in order to show the query results (``features``). The FeatureGrid allows the User to display vector features in the Map with paging. The User have also the possibility to zoom to a single feature or to a page and to export data in CSV format.


1. Open the `MapComposer <http://localhost:8081/mapcomposer/?locale=en&config=queryConfig>`__. 

	.. figure:: img/bboxquery1.png
	
				MapComposer with BBOXQueryForm and FeatureGrid plugins.

	.. note:: This Viewer configuration provides the ``World Countries`` layer that will be used in this section to perform queries. When the user click on the layer node in TOC the BBOXQueryForm will be enabled and automatically configured to perform queries on the selected layer, only if this layer is not a Raster.
	

2. At startup the BBOXQueryForm tool is disabled. Click on the **World Countries** layer in TOC:

		.. figure:: img/layerselection.png
		
					Layer selection in order to enable the plugin.
					
   After that the plugin will be enabled. So the User can perform a query through:

   #. **The Region Of Interest** (ROI): The User have to select first the spatial tool using the dropdown on top of the panel. Then the User can draw the ROI accordingly the Selection method (by default ``Bounding Box``). 
   		
		.. figure:: img/spatial.png
		
					Selection of the Region Of Interest.
	    
		.. note:: By default the User can select the ROI drawing the BBOX. Other possible selection are:
		
				  * Cricle
				  * Polygon
				  * Buffer
	
   #. **Query by attributes**: With this tool the User can search features specifying an OGC filter directly from the GUI. 
   
   		.. figure:: img/attributes.png
		
					Selection of the Region Of Interest.
   
		.. note:: The OGC Filter is built through OpenLayers using the FeatureType's attributes returned by a DescribeFeatureType request made to GeoServer.

3. Select **Bounding Box** as ``Selection Method`` and then click on the **SetROI** button. Draw a BBOX on the Map with the mouse (left click in a point of the Map and drag, then release the mouse).

   		.. figure:: img/query1.png
		
					Draw a BBOX.

   When the BBOX it was drawn a tooltip show a ``Summary Selection`` (for example selected ``Area`` and ``Perimeter`` for Polygons).

5. Now expand the **Query by attribute** fill fields in order to make the OGC filter. Use:

	* **Match**: any
	* **Attribute**: GEOUNIT (selected from the dropdown)
	* **Logical Operator**: like
	* **Value**: S*
	
		.. figure:: img/query2.png
	
				Build the OGC Filter.

6. Click on **Query** button.

7. The result is shown in the FeatureGrid panel. Click on **Display on map** button in order to highlight features on Map.

	.. figure:: img/query3.png

			Results in FeatureGrid.
			
	.. figure:: img/query4.png	

			Display features in the Map.
	
	.. note:: The User can select a Row of the Features list in order to highlight the related feature in the Map. 

8. Click on the magnifying glass icon (first column of the feature in the Grid) in order to perform the zoom the the selected feature.

		.. figure:: img/query5.png	
	
				Single feature selection.

9. Export selected data as CSV format. Click on **Export to CSV** and select for example on **Single Page**.

		.. figure:: img/query6.png	
	
				Export data in CSV format.
				
		.. figure:: img/query7.png	