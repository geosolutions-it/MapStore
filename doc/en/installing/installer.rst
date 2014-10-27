.. module:: mapstore.installer
   :synopsis: Learn on how to use MapStore installer.

.. _mapstore.installer:

Work with MapStore installer
----------------------------

This page provides a quickly guide in order to run the MapStore with all his components described in the :ref:`mapstore.overview` using the **Windows Installer**.

You can start using MapStore following the steps below:

Install and Start-Up Demo
^^^^^^^^^^^^^^^^^^^^^^^^^

#. If you don't have Java installed, download and install a `Java Development Kit (1.6 or later) <http://www.oracle.com/technetwork/java/javase/downloads/index.html>`_, and set an environment variable JAVA_HOME to the pathname of the directory into which you installed the JDK.

#. Download the `MapStore standard (Windows installer) <http://goo.gl/BE02J>`_.

#. Double-click the executable file "mapstore-latest.exe" to start the installation procedure.

#. **Welcome message.** Click "*Next*" to continue.

    .. figure:: img/win_installer_welcome.png

#. **License Agreement.** Click "*I Agree*" to continue.

    .. figure:: img/win_installer_agree.png   

#. **Choose Install Location.** To install in a different folder, click Browse and select another folder. Click "*Next*" to continue.

    .. figure:: img/win_installer_dest_folder.png

#. **Choose Start Menu Folder.** Choose a Start Menu folder for the MapStore 1.3 shortcuts.

    .. figure:: img/win_installer_start_menu_folder.png

#. **Java Runtime Environment.** Select the path to your Java Runtime Environment. If you've done step one the installation process recognise your settings. Click "*Next*" to continue.

    .. figure:: img/win_installer_java_run_env.png

#. **MapStore Web Server Port.** Set the port that MapStore will respond on. By default will set to port 8080. Click "*Next*" to continue.

    .. figure:: img/win_installer_web_server_port.png

#. **Type of Installation.** Select the type of installation for MapStore. Now we choose "*Run manually*". Click "*Next*" to continue.

    .. figure:: img/win_installer_type_of_install.png

#. **Ready to Install.** Now MapStore is ready to be installed. All settings are listed. Click "*Install*" to continue.

    .. figure:: img/win_installer_ready_install.png

#. **Install complete.** The window appears indicating that the installation is successful. Click "*Finish*" to close the wizard.

    .. figure:: img/win_installer_install_complete.png

#. **Start MapStore.** Once the installation is complete, click on the Start button, and search **MapStore 1.3** through the list of installed programs. Since we have chosen to start MapStore manually, we have to click **Start MapStore**. It opens a prompt to start the service. Wait until the startup process has completed (you should see the message Started **SelectChannelConnector@0.0.0.0:8080** at the bottom of the startup windows).

    .. figure:: img/win_installer_start_mapstore.png

#. **MapStore Admin Page.** Now, clicking on **MapStore Admin Page**  you can play with the demo by other looking at the preconfigured maps or by creating new maps.

    .. figure:: img/win_installer_admin_page_mapstore.png
	
	MapStore Admin Page

    .. figure:: img/homepage.png

Open Existing Maps
^^^^^^^^^^^^^^^^^^

MapStore comes with a few preconfigured maps: 

#. Clicking on the rows of :ref:`mapstore.mapmanager` you can get access to the existing maps. 

    .. figure:: img/openmap.png

#. You can also get a unique link to embed them into existing sites.

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

#. **Stop MapStore**

    .. figure:: img/win_installer_stop_mapstore.png
