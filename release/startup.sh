#!/bin/sh
# -----------------------------------------------------------------------------
# Start Script for MapStore
#
# $Id$
# -----------------------------------------------------------------------------

# Make sure prerequisite environment variables are set
if [ -z "$JAVA_HOME" ]; then
  echo "The JAVA_HOME environment variable is not defined"
  echo "This environment variable is needed to run this program"
  exit 1
fi
if [ ! -r "$JAVA_HOME"/bin/java ]; then
  echo "The JAVA_HOME environment variable is not defined correctly"
  echo "This environment variable is needed to run this program"
  exit 1
fi
# Set standard commands for invoking Java.
_RUNJAVA="$JAVA_HOME"/bin/java

# if not told otherwise pump up the permgen
if [ -z "$JAVA_OPTS" ]; then
  export JAVA_OPTS="-XX:MaxPermSize=128m -Dgeostore-ovr=file:config/geostore-datasource-ovr.properties -Dservicebox-ovr=file:config/servicebox-ovr.properties"
fi 


#added headless to true by default, if this messes anyone up let the list
#know and we can change it back, but it seems like it won't hurt -ch
exec "$_RUNJAVA" $JAVA_OPTS -Djava.awt.headless=true -DSTOP.PORT=8079 -DSTOP.KEY=mapstore -jar start.jar 
