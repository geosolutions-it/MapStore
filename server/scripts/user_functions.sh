#!/bin/sh

source setenv.sh
source ldap_functions.sh


function ftp_allow_conf {
  cat <<- EOF
  <Directory $FTP_DIR>
      AllowOverwrite on
      GroupOwner nobody
      UserOwner nobody
    <Limit  ALL>
      AllowGroup sn-manager
      AllowUser $USERNAME
      DenyAll
    </Limit>
    <Limit  READ DIRS LIST>
      AllowGroup sn-manager
      AllowUser $USERNAME
      DenyAll
    </Limit>
  </Directory>
EOF
}

function modify_ldap_user_conf {
  cat <<- EOF
dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: cn
cn: $NAME $SURNAME

dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: givenName
givenName: $NAME

dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: mail
mail: $EMAIL

dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: sn
sn: $SURNAME

dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: uid
uid: $USERNAME

dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
changetype: modify
replace: userPassword
userPassword: $PASS
EOF
}

function ldap_user_conf {
  cat <<- EOF
dn: uid=$USERNAME,ou=people,dc=mariss,dc=egeos,dc=it
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top
cn: $NAME $SURNAME
givenName: $NAME
mail: $EMAIL
sn: $SURNAME
uid: $USERNAME
userPassword: $PASS
EOF
}

function ldap_user_group_add {
  cat <<- EOF
dn: cn=$GROUPNAME,ou=groups,dc=mariss,dc=egeos,dc=it
changetype: modify
add: memberUid
memberUid: $USERNAME
EOF
}

function ldap_user_group_remove {
  cat <<- EOF
dn: cn=$GROUPNAME,ou=groups,dc=mariss,dc=egeos,dc=it
changetype: modify
delete: memberUid
memberUid: $USERNAME
EOF
}

function usage {
  echo "USAGE:"
  echo "      USERNAME="THEUSERNAME" NAME="THENAME" SURNAME="THESURNAME" EMAIL="THEMAIL" PASS="THEPASS" $0"
  echo "Generate the pass with slappasswd -h {SSHA} -s %pwd%"
}

function check {
  if [ -z $USERNAME ]; then
    echo "check USERNAME"
    usage
  elif [ -z $NAME ]; then
    echo "check NAME"
    usage
  elif [ -z $SURNAME ]; then
    echo "check SURNAME"
    usage
  elif [ -z $EMAIL ]; then
    echo "check EMAIL"
    usage
  elif [ -z $PASS ]; then
    echo "check PASS"
    usage
  else
    return 0;
  fi
  exit 1;
}

function usage_group {
  echo "USAGE:"
  echo "      USERNAME="THEUSERNAME" GROUPNAME="THEGROUPNAME" $0"
  echo "The Group must exist on LDAP."
}

function check_group {
  if [ -z $USERNAME ]; then
    echo "check USERNAME"
    usage_group
  elif [ -z $GROUPNAME ]; then
    echo "check GROUPNAME"
    usage_group
  else
    return 0;
  fi
  exit 1;
}
