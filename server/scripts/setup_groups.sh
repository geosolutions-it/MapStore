#!/bin/bash

echo "Setup Groups ( LIB_PATH=$LIB_PATH ) in LDAP" >> /tmp/ldap.log

cd $LIB_PATH

. setenv.sh
. ldap_functions.sh

# sn-manager
add "./groups/template_group_sn-manager.ldif" $LOGFILE
if [ $? -gt 0 ]; then
        echo "Error creating group in LDAP: ref to $LOGFILE"
        exit 1;
else
	echo "Succesfully created group sn-manager"
fi
# va-sp
add "./groups/template_group_va-sp.ldif" $LOGFILE
if [ $? -gt 0 ]; then
        echo "Error creating group in LDAP: ref to $LOGFILE"
        exit 1;
else
	echo "Succesfully created group va-sp"
fi
# csp
add "./groups/template_group_csp.ldif" $LOGFILE
if [ $? -gt 0 ]; then
        echo "Error creating group in LDAP: ref to $LOGFILE"
        exit 1;
else
	echo "Succesfully created group csp"
fi
# endgroups
add "./groups/template_group_endusers.ldif" $LOGFILE
if [ $? -gt 0 ]; then
        echo "Error creating group in LDAP: ref to $LOGFILE"
        exit 1;
else
	echo "Succesfully created group endgroups"
fi

