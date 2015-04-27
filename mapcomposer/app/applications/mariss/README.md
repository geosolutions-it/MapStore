# npa-cgg

This repository contains all the customizations for the NPA-CGG project  

## MapStore Application

The mapstore folder is actually a MapStore Application: to run it, clone this repository inside the mapcomposer/app/applications folder of your MapStore C070 branch repo and start it using  
    ant debug -Dapplication=npa-cgg/mapstore  

Note: as of today, to use the command  
* ant war -Dapplication=npa-cgg/mapstore  

In detail:
```
git clone git@github.com:geosolutions-it/MapStore.git
git checkout C070
cd MapStore/mapcomposer/app/applications
git clone git@github.com:geosolutions-it/npa-cgg.git
cd ../../../
ant debug -Dapplication=npa-cgg/mapstore
```


## GeoServer Custom ResourceAccessManager

The geoserver folder contains the code to build a custom GeoServer ResourceAccessManager

To build: 
* cd geoserver/src
* mvn clean install -Pnpa

For developers:
* mvn clean install eclipse:clean eclipse:eclipse -DdownloadSources=true -Pnpa

## Utility Scripts

The folder contains some utility scripts:

* warpthis.py : phython script to apply the command 'gdalwarp src.tif dest.tif -t_srs EPSG:4326' to multiple files at once  
** Usage: python warpthis.py folder/*.tif
