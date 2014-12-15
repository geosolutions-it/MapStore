var Response = require("ringo/webapp/response").Response;
var Request = require("ringo/webapp/request").Request;

var urls = [
    [(/^\/(index(.html)?)?/), require("./root/index").app],
    //[(/^\/(login)/), require("./root/login").app],
    [(/^\/(loginpage)/), require("./root/loginpage").app],
    //[(/^\/(maps(\/\d+)?)/), require("./root/maps").app],
	//[(/^\/(geonetwork)/), require("./root/geonetwork").app],  // Enable this only for the GeoNetwork integration
    [(/^\/(composer)/), require("./root/composer").app],
    [(/^\/(manager)/), require("./root/manager").app],
	[(/^\/(wps)/), require("./root/wps").app],                // to test WPS plugin
	[(/^\/(test)/), require("./root/test").app],              // to test the MapStore Viewport
    [(/^\/(viewer(.html)?)/), require("./root/viewer").app],
	[(/^\/(embedded(.html)?)/), require("./root/embedded").app],
    [(/^\/(debug(.js)?)/), require("./root/debug").app]
];

var debug_proxy = java.lang.System.getProperty("app.debug.proxy");
if (debug_proxy) {
	urls.push([(/^\/(proxy)/), require("./root/proxy").app]);
}

var FS = require("fs");
// debug mode loads unminified scripts
if (java.lang.System.getProperty("app.debug")) {
    
    var config = FS.normal(FS.join(module.directory, "..", "buildjs.cfg"));
	var configs = [config];
	if(environment.applicationPath) {
		configs.push(FS.normal(FS.join(module.directory, environment.applicationPath.toString(), "buildjs.cfg")));
	}
    urls.push(
        [(/^\/script(\/.*)/), require("./autoloader").App(configs)]
    );
	

    // proxy a remote geoserver on /geoserver by setting proxy.geoserver to remote URL
    // only recommended for debug mode
    var geoserver = java.lang.System.getProperty("app.proxy.geoserver");
    if (geoserver) {
        if (geoserver.charAt(geoserver.length-1) !== "/") {
            geoserver = geoserver + "/";
        }
        // debug specific proxy
        urls.push(
            [(/^\/geoserver\/(.*)/), require("./root/proxy").pass({
                url: geoserver, 
                allowAuth: true, 
                /**
                 * Setting preserveHost to true makes it so GeoServer advertises
                 * URLs on the same origin as this app.  That makes it so the
                 * proxy is not involved in any requests issued to this same
                 * GeoServer.  The reason this is required is because we want
                 * to preserve auth related headers in requests to GeoServer and
                 * we don't want to send those same auth related headers to
                 * every service that is proxied.  The negative side effect is
                 * that the proxy will occasionally fail due to 
                 * java.lang.OutOfMemoryError issues.
                 * TODO: figure out why so much memory is being consumed in proxy
                 */
                preserveHost: true
            })]
        );
    }
    
    // TODO: remove this - for temporary debugging of the proxy only
    urls.push([
        (/^\/wms/), require("./proxywms").app
    ]);
    
}


exports.urls = urls;

// TODO: remove if http://github.com/ringo/ringojs/issues/issue/98 is addressed
function slash(config) {
    return function(app) {
        return function(request) {
            var response;
            var servletRequest = request.env.servletRequest;
            var pathInfo = servletRequest.getPathInfo();
            if (pathInfo === "/") {
                var uri = servletRequest.getRequestURI();
                if (uri.charAt(uri.length-1) !== "/") {
                    var location = servletRequest.getScheme() + "://" + 
                        servletRequest.getServerName() + ":" + servletRequest.getServerPort() + 
                        uri + "/";
                    return {
                        status: 301,
                        headers: {"Location": location},
                        body: []
                    };
                }
            }
            return app(request);
        };
    };
}

exports.middleware = [
    slash(),
    require("ringo/middleware/gzip").middleware,
    require("ringo/middleware/static").middleware({base: module.resolve("static")}),
    require("ringo/middleware/error").middleware,
    require("ringo/middleware/notfound").middleware
];

exports.app = require("ringo/webapp").handleRequest;

exports.charset = "UTF-8";
exports.contentType = "text/html";

// handle application configuration
if(environment.applicationPath) {
	// for debug
	var applicationConfig = require(environment.applicationPath.toString() + '/config');
	applicationConfig.config(urls, exports.middleware);
} else if(!java.lang.System.getProperty("app.debug")) {
	// for deploy
	var applicationsFolder = getRepository(module.resolve('./applications'));
	
	if(applicationsFolder && applicationsFolder.exists()) {
		var application = null;
		var files = applicationsFolder.getResources(true);
		
		for(var i = 0, l = files.length; i < l && i < 1; i++) {
			var file = files[i].path;
			file = file.substring(applicationsFolder.path.length);
			application = file.split('/')[0];
		}
		
		if(application) {
			var applicationConfig = require('applications/' + application + '/config');
			applicationConfig.config(urls, exports.middleware);
		}
	}
}

