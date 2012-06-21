/*
var Request = require("ringo/webapp/request").Request;
var Response = require("ringo/webapp/response").Response;

exports.app = function(env) {
    var request = new Request(env);
    var parts = request.path.split("/");
    parts.pop();
    parts.push("composer");
    return {
        status: 302,
        headers: {"Location": request.scheme + "://" + request.host + ":" + request.port + parts.join("/")},
        body: []
    };
}
*/

var Response = require("ringo/webapp/response").Response;
var Request = require("ringo/webapp/request").Request;
var auth = require("../auth");

exports.app = function(req) {
    var request = new Request(req);
    var details = auth.getDetails(request);
    var response = Response.skin(module.resolve("../templates/composer.html"), {status: details.status || 404});
    return response;
};
