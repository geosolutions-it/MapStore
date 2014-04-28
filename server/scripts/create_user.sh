#!/bin/bash

echo "Creating user ( NAME=$NAME SURNAME=$SURNAME EMAIL=$EMAIL USERNAME=$USERNAME PASS=$PASS LIB_PATH=$LIB_PATH ) in LDAP" >> /tmp/ldap.log

#ROOT_DIR=$( cd "$( dirname "$0" )" && pwd )

cd $LIB_PATH

. ./setenv.sh
. ./ldap_functions.sh
. ./user_functions.sh

# check input

check

# LDAP rule
#ldap_user_conf | ldapadd -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -c -v -d 512

ldap_user_conf | add_stdin $LOGFILE
if [ $? -gt 0 ]; then
	echo "Error creating user in LDAP: ref to $LOGFILE"
	exit 1;
fi

# Directory

FTP_DIR=/share/ftp/$USERNAME/
mkdir -p $FTP_DIR
chown -R nobody:nobody $FTP_DIR
chmod -R 777 $FTP_DIR

# FTP rule

ftp_allow_conf > $FTP_ROOT_CONF/$USERNAME.conf
service proftpd reload

