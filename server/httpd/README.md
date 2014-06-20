# HTTPD configuration

This project depends on Apache HTTPD 2.4.9. Also need the mod_proxy, mod_auth_form, mod_ldap and other modules.

Take a look at http.conf to see complete modules needed. 

## Virtual Host

Current configuration is present on vhost.conf. It contains the proxy pass locations, the error documents and the login/logout flow

## HTML Pages

You must place this folder in '/var/www/' or in DocumentRoot you'll put on vhost.conf.

There are two simply html pages:

* redirectToHome.html --> Simply redirect to home page of the project for errors 404 and 403
* login/index.html --> Login page based on bootstrap min for error 401

These pages are using absolute URLs to allow the load from all locations. It means that if you're trying to open:

* http://server/geoserver/web
* http://server/mapstore
* http://server/mapstore/manager
* http://server/geoserver/mariss/wms

without credentials, it's loaded the login page. Then there is no way to load the js and css resources in relative path.

Remember change the absolute URLs if you change the server name.