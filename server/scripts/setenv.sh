#!/bin/sh

LDAP_PASS="theslap"

LDAP_PORT=389

HOST="localhost"

DN="ou=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=int"

BINDDN="uid=admin,ou=people,dc=mariss,dc=egeos,dc=it"

LOGFILE="ldap_out.log"

## FTP

FTP_ROOT_CONF="/etc/proftpd.d/"
