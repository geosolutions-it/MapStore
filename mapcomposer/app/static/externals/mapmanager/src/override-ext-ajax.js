/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: override = Ext.Ajax */
(function() {
    
    var oldRequest = Ext.lib.Ajax.request;
    
    Ext.apply(Ext.lib.Ajax, {
        /** private: method[request]
         */
        request: function(method, uri, cb, data, options) {                                    
            var sameOrigin = !(uri.indexOf("http") == 0);
            var urlParts = !sameOrigin && uri.match(/([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/);
            if (urlParts) {
                var location = window.location;
                sameOrigin =
                    urlParts[1] == location.protocol &&
                    urlParts[3] == location.hostname;
                var uPort = urlParts[4], lPort = location.port;
                if (uPort != 80 && uPort != "" || lPort != "80" && lPort != "") {
                    sameOrigin = sameOrigin && uPort == lPort;
                }
            }
            if (!sameOrigin) {
                var proxyUrl = config ? config.proxyUrl || proxy : proxy;
                if (proxyUrl) {        
					
					if(proxyUrl.match(/^http:\/\//i) === null) {
						proxyUrl = 'http://' + window.location.host + proxyUrl;
					}
                    uri = proxyUrl + encodeURIComponent(uri);
                } else {
                    console.warn('Proxy needed');
                }                
            }
            
            oldRequest.call(this, method, uri, cb, data, options);
                       
        }        
    });
})();
