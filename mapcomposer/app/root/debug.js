var Request = require("ringo/webapp/request").Request;

exports.app = function(req) {
    var request = new Request(req);
    var debug_proxy = java.lang.System.getProperty("app.debug.proxy");
    
    return {
        status: 200,
        headers: {
        },
        body: ["mapStoreDebug = " + debug_proxy]
    };
};
