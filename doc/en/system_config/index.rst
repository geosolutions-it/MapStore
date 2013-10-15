.. module:: mapstore.system_config
   :synopsis: Learn how to configure the system.

.. mapstore.system_config:


Configuring the System
++++++++++++++++++++++

`Here <http://geoserver.geo-solutions.it/downloads/training/>`__ you will find a set of zip compressed packages containing the complete environment for MapStore and the training. The current available version of the MapStore training is 32 bit; download and extract to your local hard drive.

   .. note::  The zip package ships an embedded pre installed JRE 6 version, using those packages you implicitly accept `this <http://www.oracle.com/technetwork/java/javase/terms/license/index.html>`__ license. For more details ref `here <http://java.com/en/download/faq/distribution.xml>`__
   
Download
========

#. `Windows 32 Bit <http://geoserver.geo-solutions.it/downloads/training/windows/32/mapstore/Training-2.4.0-1-32.zip>`__

   
Package structure and contents
==============================

#.  **README.txt**

    Contains legal notes

#.  **data**

    Contains all the data used for the demo, plugins and the GWC data.
    
#.  **geoserver_data**

    The GeoServer data dir.
	
#.  **geostore_data**

    The directory that contains all the GeoStore configuration files.

#.  **src**

    Contains all the MapStore sources for this training.

#.  **setenv.bat**

    Used by most of the script to setup the environment, To change the used java version, the geoserver data dir and most of the other environment settings, edit this file.
    
#.  **jdk**

    The embedded java.
    
#.  **postgres**

    The standalone PostgreSQL-9.2 + PostGIS-2.0 installation folder (contains the 'data' directory with the databases).
    
#.  **pgAdmin.bat**

    Starts the PostgreSQL PgAdmin III admin interface.
    
#.  **postgis_setup.bat**

    Optional script to recreate the postgres database. (uses setenv.bat).
    
#.  **postgis_start.bat**

    Starts the postgres server (uses setenv.bat).
    
#.  **postgis_stop.bat**

    Stops the postgres server (uses setenv.bat).

#.  **tomcat-6.0.36**

    Contains two differents instances of tomcat.
    
#.  **tomcat_start_1.bat**

    Starts the first tomcat instance (uses setenv.bat)
    
#.  **tomcat_start_2.bat**

    Starts the second tomcat instance (uses setenv.bat)
    
#.  **tomcat_stop_1.bat**

    Stops the first tomcat instance (uses setenv.bat)
    
#.  **tomcat_stop_2.bat**

    Stops the second tomcat instance (uses setenv.bat)
    
#.  **udig**

    Contains the udig standalone installation
    
#.  **udig.bat**

    Starts uDig

As you can see this package contains all that you need to have a fully functional environment to run MapStore, GeoServer, GIS tools and clients on your datasets.

.. warning:: **postgis_setup** should never be used. If *postgres database* fails to work, then the postgres directory inside the training must be manually removed and then **postgis_setup** must be launched.