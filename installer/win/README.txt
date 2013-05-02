MapStore README
===============================================================================
MapStore has been developed to create, save and share in a simple and intuitive
way maps and mashup created selecting contents by server like Google Maps, 
OpenStreetMap, MapQuest or specific servers provided by your organization or 
third party. MapStore consists of two main components as MapManager and 
GeoStore, respectively front-end and back-end.

MapStore is based on the GeoExplorer Open Source framework and is licensed 
under the GPL license.
  
MapStore is on GitHub:

  https://github.com/geosolutions-it/mapstore  

In order to install and run this application, follow these steps:

(0) Download and install a Java Development Kit

* Download a Java Development Kit (JDK) (version 1.6 or later) from:

    http://www.oracle.com/technetwork/java/javase/downloads/index.html

* Install the JDK according to the instructions included with the release.

* Set an environment variable JAVA_HOME to the pathname of the directory
  into which you installed the JDK.

(1) Download and install the MapStore binary

* Download a binary distribution of MapStore from the Download link you
  find on:

    http://mapstore.geo-solutions.it/mapstore/     

* Unpack the binary distribution into a convenient location so that the
  distribution resides in its own directory (conventionally named
  "mapstore").  For the purposes of the remainder of this document,
  the symbolic name MAPSTORE_HOME is used to refer to the directory
  where MapStore resides.
  
(2) Start Up MapStore

Execute the following shell commands:

      Windows:
      cd %MAPSTORE_HOME%
      startup

      UNIX:
      cd $MAPSTORE_HOME
      ./startup.sh
      
(3) Access MapStore HomePage    

After startup, the default home page will be available by browsing:

    http://localhost:8080/
    
Here you can find the MapManager tool (on the bottom of the page).
To start testing MapStore, just login to the tool using the following
credentials:
 * username: admin
 * password: admin

Then click the "New Map" button to start MapComposer. 

(4) Shut Down MapStore

Execute the following shell commands:

      Windows:
      cd %MAPSTORE_HOME%
      shutdown

      UNIX:
      cd $MAPSTORE_HOME
      ./shutdown.sh


(5) Troubleshooting

There are two common problems encountered when attempting to use the binary
distribution of MapStore:

 1) Another web server (or other process) is already using port 8080.  This
    is the default HTTP port that MapStore attempts to bind to at startup.
    To change this port, open the file:

       $MAPSTORE_HOME/etc/jetty.xml
    
    and search for '8080'.  Change it to a port that isn't in use, but is
    greater than 1024 (such as 8090).  Save this file and restart MapStore.
    Make sure, of course, that you try to access MapStore on the new port:

       http://localhost:####

    where #### is the new port.

 2) The "localhost" address can't be found.  This could happen if you're
    behind a proxy.  If so, make sure the proxy configuration for your
    browser knows to not travel through the proxy to access the "localhost"
    address.  Please see your browser's documentation for how to check this.


(6) Further information

For more information about configuring and running MapStore, please see the 
MapStore web site:

    http://mapstore.geo-solutions.it/mapstore/    

and:
    https://github.com/geosolutions-it/mapstore
