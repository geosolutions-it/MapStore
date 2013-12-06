.. module:: mapstore.translations
   :synopsis: MapStore Translations.

.. role:: red

.. _mapstore.translations:

MapStore Translations
=====================

This section illustrates how to manage Translations in MapStore.

MapStore in this moment is translated into four languages:

* Italian
* English
* French
* German

You can manage translations thanks to the files (**de.js**, **en.js**, **fr.js** e **it.js**) contained in the directory translations.

For **MapManager**::

    ../mapstore/
        -externals
        -installer
        -lib
        -mapcomposer
        -mapmanager/
            -doc
            -lib
            -release
            -src
            -tests
            -translations
                -de.js
                -en.js
                -fr.js
                -it.js
        -release
        -.gitignore
        -build.xml
        -createGitIgnore
        -license.txt
        -license_top.txt
        -README.md
  
For **MapComposer**::

    ../mapstore/
        -externals
        -installer
        -lib
        -mapcomposer/
            -app
                -static
                    -translations
                        -de.js
                        -en.js
                        -fr.js
                        -it.js
            ...
        -mapmanager
        -release
        -.gitignore
        -build.xml
        -createGitIgnore
        -license.txt
        -license_top.txt
        -README.md
        
You can insert in each javascript class any **i18n** properties.

For example, in the class **..mapstore/mapmanager/src/MSMGridPanel.js** , you can see some properties like *"textSearch"*, *"tooltipSearch"*, *"textReset"*, etc... that need to be translated into several languages::

    /**
     * Class: MSMGridPanel
     * This is the most important component.
     * Upload the store (RESTful request to GeoStore) in the grid.
     * The grid contains the plugin RowExpander that allows the display of buttons used to view, edit and delete resources saved within Geostore.
     * 
     * Inherits from:
     *  - <Ext.grid.GridPanel>
     *
     */
    MSMGridPanel = Ext.extend(Ext.grid.GridPanel, {    
        /**
         * Property: id
         * {string} id of gridPanel
         * 
         */
        id: 'id_geostore_grid', 
     ...
     ...
        /**
        * Property: textSearch
        * {string} string to add SearchTool search button
        * 
        */   
        textSearch: 'Search',
        /**
        * Property: tooltipSearch
        * {string} string to add in SearchTool search tooltip
        * 
        */   
        tooltipSearch: 'Search Map By Name',
        /**
        * Property: textReset
        * {string} string to add in SearchTool reset button
        * 
        */   
        textReset: 'Reset',
     ...
     ...
        this.tbar = [grid.inputSearch,{
            id: 'searchBtn',
            text: this.textSearch,
            tooltip: this.tooltipSearch,
            iconCls: 'find',
            disabled: true,
     ...
     ...
     
Now you have to copy, in each translations class, the i18n properties with the translated words.
For example, in **../mapstore/mapsmanager/translations/it.js** you can do the following::

    /**
     * Copyright (c) 2009-2010 The Open Planning Project
     */

    GeoExt.Lang.add("it", {    
        "MSMGridPanel.prototype": {
            msg: "Caricamento...",
            textSearch: "Ricerca",
            tooltipSearch: "Ricerca mappa per nome",
            textReset: "Reimposta",
    ...
    ...

This can be done for all classes of mapstore.

Converting 'HelloMapStore.js' into i18N
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

All the steps described below are intended to be executed against the MapStore source code.

The source code is located into the folder :file:`$TRAINING_ROOT/src` and can be accessed through 

.. code-block:: ruby
   :linenos:
  
   $TRAINING_ROOT\src\SKShell.bat

* Open the *HelloMapStore.js* file at :file:`mapstore/mapcomposer/app/static/externals/gxp/src/script/plugins/HelloMapStore.js` with any simple text-editor

* Modify the code as highlighted below

.. code-block:: ruby
   :emphasize-lines: 29,35,47,48
   :linenos:

     /**
      * @requires plugins/Tool.js
      */

     /** api: (define)
      *  module = gxp.plugins
      *  class = HelloMapStore
      */

     /** api: (extends)
      *  plugins/Tool.js
      */
     Ext.namespace("gxp.plugins");

     /** api: constructor
      *  .. class:: HelloMapStore(config)
      *
      *    Plugin for adding a new group on layer tree.
      */
     gxp.plugins.HelloMapStore = Ext.extend(gxp.plugins.Tool, {

         /** api: ptype = gxp_addgroup */
         ptype: "gxp_hellomapstore",
         /**
         * Property: textTitle
         * {string} string to add HelloMapStore search button
         *
         */
         textTitle: 'Hello',
         /**
         * Property: textMessage
         * {string} string to add in HelloMapStore message box
         *
         */
         textMessage: 'Hello Mapstore!!',
         /**
          * api: method[addActions]
          */
         addOutput: function() {
             var apptarget = this.target;

             var out = gxp.plugins.HelloMapStore.superclass.addOutput.apply(this, [{
                 text:'hello',
                 disabled: false,
                 handler: function() {
                     Ext.Msg.show({
                         title : this.textTitle,
                         msg : this.textMessage
                     });
                 },
                 scope: this
             }]);

             return out;
         }

     });
     Ext.preg(gxp.plugins.HelloMapStore.prototype.ptype, gxp.plugins.HelloMapStore);

* Open the *en.js* file at :file:`mapstore/mapcomposer/app/static/translations/en.js` with any simple text-editor

* Modify the code as highlighted below

.. code-block:: ruby
   :emphasize-lines: 11-16
   :linenos:

    ...
        "gxp.KMLFileUploadPanel" :{
            fileLabel: "KML file",
            fieldEmptyText: "Browse for KML or KMZ files...",
            uploadText: "Upload",
            waitMsgText: "Uploading your data...",
            invalidFileExtensionText: "File extension must be one of: ",
            resetText: "Reset",
            failedUploadingTitle: "Cannot upload file",
            layerNameLabel: "Layer Name"
        },

        "gxp.plugins.HelloMapStore.prototype":{
            textTitle: 'Hello',
            textMessage: 'Hello Mapstore!!'
        }
    });

* Open the *it.js* file at :file:`mapstore/mapcomposer/app/static/translations/it.js` with any simple text-editor

* Modify the code as highlighted below

.. code-block:: ruby
   :emphasize-lines: 11-16
   :linenos:

    ...
        "gxp.KMLFileUploadPanel" :{
            fileLabel: "KML file",
            fieldEmptyText: "Browse for KML or KMZ files...",
            uploadText: "Upload",
            waitMsgText: "Uploading your data...",
            invalidFileExtensionText: "File extension must be one of: ",
            resetText: "Reset",
            failedUploadingTitle: "Cannot upload file",
            layerNameLabel: "Layer Name"
        },

        "gxp.plugins.HelloMapStore.prototype":{
            textTitle: 'Ciao',
            textMessage: 'Ciao Mapstore!!'
        }
    });

* Be sure that:

  #. The Tomcat *instance1* is running
  #. The Tomcat *instance2* is **not** running (otherwise you will experience a TCP port clash)

* Go to the :file:`mapstore` folder and run the following command

 .. code-block:: ruby
   :linenos:
   
   ant debug

* Once you see the message below

  .. figure:: img/sdk_shell_2.png


  Access to `MapStore <http://localhost:8081/?config=viewerConfig>`__ (:file:`http://localhost:8081/?config=viewerConfig`)

  .. figure:: img/hello_mapstore.png

* Change the language between *english* and *italian* by using the *languages combo-box* on the lower-right corner of MapStore

  .. figure:: img/hello_mapstore_tx.png

* Click on the *hello* button of the Top ToolBar and notice how the *title* and *message* text change accordingly to the selected language

  * *english*
  
  .. figure:: img/hello_mapstore_1.png


  * *italiano*
  
  .. figure:: img/hello_mapstore_tx_1.png
