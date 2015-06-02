#!/bin/bash

echo "Deleting user ( USERNAME=$USERNAME LIB_PATH=$LIB_PATH ) in LDAP" >> /tmp/ldap.log

cd $LIB_PATH

. setenv.sh
. ldap_functions.sh
. user_functions.sh

function usage {
  echo "USAGE:"
  echo "      USERNAME="THEUSERNAME" $0"
}

function check {
  if [ -z $USERNAME ]; then
    echo "check USERNAME"
    usage
  else
    return 0;
  fi
  exit 1;
}

# check input

check

# LDAP rule

DN="uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it"
delete $LOGFILE
if [ $? -gt 0 ]; then
        echo "Error removing user in LDAP: ref to $LOGFILE"
        exit 1;
fi
# Directory

FTP_DIR=/share/ftp/$USERNAME/
rm -rf $FTP_DIR

# FTP rule

rm -f $FTP_ROOT_CONF/$USERNAME.conf
service proftpd reload

