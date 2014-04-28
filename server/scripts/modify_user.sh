#!/bin/bash

echo "Updating user ( NAME=$NAME SURNAME=$SURNAME EMAIL=$EMAIL USERNAME=$USERNAME PASS=$PASS LIB_PATH=$LIB_PATH ) in LDAP" >> /tmp/ldap.log

cd $LIB_PATH

. setenv.sh
. ldap_functions.sh
. user_functions.sh

# check input

check

# LDAP rule

modify_stdin ldap_user_conf $LOGFILE

