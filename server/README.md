## Custom configurations for OpenSDI-Manager2

In this folder we have the customizations for this application:

* **applicationContext.xml**: You must ovewrite the default one in `webapps/opensdi2-manager/WEB-INF/classes`
* **opensdi-config-ovr.properties**: You can put this property overrider file in a custom folder setting the environment parameter `OPENSDI_CONFIG_FILE` or in `webapps/opensdi2-manager/WEB-INF/classes`.

Also, you have the custom scripts for the LDAP and PROFTP integrations in `scripts` subfolder.