git pull origin c022_2016
ant clean
ant war
rm -Rf /opt/soil_sealing/tomcat_gui/webapps/MapStore*
mv mapcomposer/build/mapcomposer.war /opt/soil_sealing/tomcat_gui/webapps/MapStore.war

