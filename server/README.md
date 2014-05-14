# Reference to server code deployed:

## Geoserver

The version deployed is 2.4.x branch with the download process jar:

* https://github.com/geoserver/geoserver/tree/2.4.x
* https://github.com/alediator/DownloadProcess/tree/2.4.x

## Geostore

The version deployed is the lastest present on master (with costumizatons with ant release)

## Http-proxy

The proxy deployed is the lastest version present on master (with costumizatons with ant release)

## OpenSDI-Manager2

The version deployed is a customized one: 

* https://github.com/alediator/OpenSDI-Manager2/tree/c015

with the profiles `userInterceptor` and `serviceManager`. You can compile it with the command:

```
$ mvn clean install -PuserInterceptor,serviceManager -Dmaven.test.skip
```

In this folder we have the customizations for this application:

* **opensdi-config-ovr.properties**: You can put this property overrider file in a custom folder setting the environment parameter `OPENSDI_CONFIG_FILE` or in `webapps/opensdi2-manager/WEB-INF/classes`.

Also, you have the custom scripts for the LDAP and PROFTP integrations in `scripts` subfolder.