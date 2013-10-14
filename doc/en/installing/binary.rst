.. module:: mapstore.binary
   :synopsis: Learn on how to use MapStore binary.

.. _mapstore.binary:

Work with MapStore binary
-------------------------

This page provides a quickly guide in order to run the MapStore with all his components described in the :ref:`mapstore.overview` using **Binary**.

You can start using MapStore following the steps below:

Install and Start-Up Demo
^^^^^^^^^^^^^^^^^^^^^^^^^

1. If you don't have Java installed, download and install a `Java Development Kit (1.6 or later) <http://www.oracle.com/technetwork/java/javase/downloads/index.html>`_, and set an environment variable JAVA_HOME to the pathname of the directory into which you installed the JDK.

2. Download the `MapStore binary <http://goo.gl/cmpWO>`_.

3. Unpack the binary into a convenient location so that the  distribution resides in its own directory (conventionally named  "mapstore").  For the purposes of the remainder of this document, the symbolic name MAPSTORE_HOME is used to refer to the directory where MapStore resides.

4. Start Up MapStore

Execute the following shell commands::

        Windows:
        cd %MAPSTORE_HOME%
        startup

        UNIX:
        cd $MAPSTORE_HOME
        ./startup.sh

5. Wait until the startup process has completed (you should see the message **Started SelectChannelConnector@0.0.0.0:8080** at the bottom of the startup windows) and access the MapStore HomePage `here <http://localhost:8080/>`_.

6. It is now time to play with the demo by other looking at the preconfigured maps or by creating new maps.

   .. figure:: img/homepage.png

Open Existing Maps
^^^^^^^^^^^^^^^^^^

MapStore comes with a few preconfigured maps: 

1. Clicking on the rows of :ref:`mapstore.mapmanager` you can get access to the existing maps. 

	.. figure:: img/openmap.png

2. You can also get a unique link to embed them into existing sites.

	.. figure:: img/embedmap.png

Create new maps or modify existing ones
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

First of all, login to MapStore, clicking on the Login button and entering the following credentials:

 * username: **admin**
 * password: **admin**

 	.. figure:: img/login.png
	
You can now create new maps, modify the existing ones or manage the users. These functionalities will be illustrated in next sections.

.. note:: To create a new map click on the "New Map" button, a new window should open up where you can compose your map, choosing a background layer and adding more layers from the preconfigured services, your personal map server, or one of the free map servers available on the net. You can then click the "Save" button to give a name to your map and share it with the world.

Shutdown the demo
^^^^^^^^^^^^^^^^^

To shutdown MapStore execute the following shell commands::

     Windows:
     cd %MAPSTORE_HOME%
     shutdown

     UNIX:
     cd $MAPSTORE_HOME
     ./shutdown.sh
