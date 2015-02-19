.. module:: mapstore.overview
   :synopsis: Learn about MapStore overview.

.. _mapstore.overview:

MapStore Overview
-----------------

The following figure shows the components of the architecture of MapStore. 

   .. figure:: img/overview.png
   
* **MapManager** allows the user to create, delete and search maps.
* **MapComposer** to a powerfull and intuitive frontend that allow the user to create maps.
* **MapViewer** is a more basic Viewer of which you can do make: embed-link, marker's injection, routes injection, etc ...
* **Metadata Explorer** is an indipendent JavaScript component that can comunicate with one or more Catalog Service for the Web(CSW). 
* **GeoStore** is an open source Java enterprise application for storing, searching and retrieving data on the fly. GeoStore implements a flexible and modular infrastructure developed on top of Java Enterprise technology in order to create, manage, navigate and search map definitions. GeoStore integrates the authentication and authorization management as per Role Based Access Control (RBAC) paradigm. This protects maps from unauthorized access. The standard storage mechanism of GeoStore consists of a DBMS: Oracle and PostgreSQL are supported. 
* **Http-Proxy** is a forward HTTP proxy to allow the viewer and the composer to make cross origin calls to external servers.