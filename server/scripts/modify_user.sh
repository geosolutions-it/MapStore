#!/bin/bash

echo "Modifing user $USERNAME in LDAP" >> /tmp/ldap.log

. setenv.sh
. ldap_functions.sh
. user_functions.sh

# check input

check

# LDAP rule

modify_ldap_user_conf | modify_stdin $LOGFILE


if [ $? -gt 0 ]; then
        echo "Error updating user in LDAP: ref to $LOGFILE"
        exit 1;
else
        echo "'$USERNAME' user updated" >> $LOGFILE
        exit 0;
fi
