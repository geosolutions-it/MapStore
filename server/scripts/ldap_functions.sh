#!/bin/sh

function add {
  ldapadd -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -f $TEMPLATE -c -v -d 512 >> $1 2>&1
  return $?
}

function add_stdin {
  ldapadd -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -c -v -d 512 >> $1 2>&1
  return $?
}

function modify {
  ldapmodify -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -f $TEMPLATE -c -v -d 512 >> $1 2>&1
  return $?
}

function modify_stdin {
  ldapmodify -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -c -v -d 512 >> $1 2>&1
  return $?
}

function delete {
  ldapdelete -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS $DN  >> $1 2>&1
  return $?
}

# returns 1 if user exists 0 otherwise
function exists_user {

    USERID=`ldapsearch -x -h $HOST -p $LDAP_PORT -D $BINDDN -w $LDAP_PASS -b "ou=people,dc=mariss,dc=egeos,dc=it" -s one "(&(objectClass=inetOrgPerson)(uid=$USER))" uid | grep "uid: $USER"`

    if [ "uid: $USER" = "$USERID" ]; then
	return 1;
    else
	return 0;
    fi
}
