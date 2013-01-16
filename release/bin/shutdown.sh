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

cd ..
exec "$_RUNJAVA" $JAVA_OPTS -DSTOP.PORT=8079 -DSTOP.KEY=mapstore -jar start.jar --stop
