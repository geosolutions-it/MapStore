#!/bin/bash

echo "Adding User from Group ( USERNAME=$USERNAME GROUPNAME=$GROUPNAME LIB_PATH=$LIB_PATH ) in LDAP" >> /tmp/ldap.log

cd $LIB_PATH

. ./setenv.sh
. ./ldap_functions.sh
. ./user_functions.sh

# check input

check_group

# LDAP rule
#ldap_user_conf | ldapadd -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -c -v -d 512

ldap_user_group_add | modify_stdin $LOGFILE
if [ $? -gt 0 ]; then
	echo "Error updating user in LDAP: ref to $LOGFILE"
	exit 1;
fi

