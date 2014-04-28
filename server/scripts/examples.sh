# Creating a new user - the script will create also the FTP folder and will restart the ProFTP Service
USERNAME=THEUSERNAME NAME=THENAME SURNAME=THESURNAME EMAIL=THEMAIL PASS={SSHA}P7BcwmTJLUJQzXAjVJ4N3nTnY68CkY0m ./create_user.sh 

# The function removes the user from LDAP people and deletes ALL the user folder contents - WARNING: this function does not cleanup the LDAP groups
USERNAME=THEUSERNAME remove_user.sh

# The function updates the user entries. The USERNAME must exist on LDAP, the other properties can be customized but all specified
# - the following examples updates the User password - WARNING: this function does not affect the LDAP groups at all
USERNAME=THEUSERNAME NAME=THENAME SURNAME=THESURNAME EMAIL=THEMAIL PASS={SSHA}L6lReG1EUTC0g8Ps9HgJGDc4bMttlA/9 modify_user.sh

# Printing all the groups
ldapsearch -x -h localhost -p 389 -D "uid=admin,ou=people,dc=mariss,dc=egeos,dc=it" -w theslap -b "ou=groups,dc=mariss,dc=egeos,dc=it"

# Printing all the users
ldapsearch -x -h localhost -p 389 -D "uid=admin,ou=people,dc=mariss,dc=egeos,dc=it" -w theslap -b "ou=people,dc=mariss,dc=egeos,dc=it"

# Adding the user "test" to the group "va-sp" - both the user and the group must exist
USERNAME=test GROUPNAME=va-sp ./user_group_add.sh

# Removing the user "test" to the group "va-sp" - both the user and the group must exist
USERNAME=test GROUPNAME=va-sp ./user_group_remove.sh

