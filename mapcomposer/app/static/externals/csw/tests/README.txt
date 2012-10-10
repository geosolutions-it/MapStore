To run the CS Vewer test
------------------------

1) Setup a CSW server somewhere

2) Setup an HTTP proxy (example is given for Apache mod_proxy)

  ProxyRequests On
  ProxyVia Full
  <Proxy *>
        AddDefaultCharset off
        Order deny,allow
        Deny from all
        Allow from All
  </Proxy>
  
  # NOTE: this should point to the CSW server
  ProxyPass /geonetwork http://demo1.geo-solutions.it/geonetwork
  ProxyPassReverse /geonetwork http://demo1.geo-solutions.it/geonetwork

  <Directory /usr/var/projects/CSWViewer/>
    Options -Indexes
    Order allow,deny 
    Allow from all 
  </Directory>

  # NOTE: this should point to your CSWViewer directory
  Alias /CSWViewer "/usr/var/projects/CSWViewer/"

3) Load test by pointing your browser at:
http://localhost/CSWViewer/tests/run-tests.html

4) Run tests


To add new tests
----------------

This directory contains unit tests for the OpenLayers library.

Tests use the Test.AnotherWay library from <http://openjsan.org>. The test
runner is 'run-tests.html' and new test files need to be added to
'list-tests.html'.

The following file naming conventions are used:

  * A filename that starts with `test_` and has an `.html` extension
    contains tests. These should contain tests for a specific class.

  * A filename starting with `page_` and has an `.html` extension is a
    supporting HTML file used in one or more tests.

  * A filename starting with 'data_` is a supporting data file used in one
    or more tests.


    