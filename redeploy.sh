#!/bin/bash

# Make sure only root can run our script
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo "Rebuilding MapStore..."
ant war -Dapplication=mariss/mapstore

echo "Stopping GeoStore Service..."
service geostore stop

echo "Redeploying WAR..."
rm -Rf /var/lib/geostore/webapps/mapstore/
mv mapcomposer/build/mapstore/ /var/lib/geostore/webapps/
chown -Rf tomcat7: /var/lib/geostore/

echo "Restarting GeoStore Service..."
service geostore restart

sleep 15
echo "DONE!"
