var Response = require("ringo/webapp/response").Response;
var Request = require("ringo/webapp/request").Request;
var auth = require("../../auth");

exports.app = function(req) {
    var request = new Request(req);
    var details = auth.getDetails(request);
	
	if(request.isPost){
		var content = JSON.stringify(request.postParams);
		print("Post Content is : " + content);
		var response = Response.skin(module.resolve("templates/composer.html"), {status: details.status || 404, content: content});
	}else{
		var response = Response.skin(module.resolve("templates/composer.html"), {status: details.status || 404, content: "{}"});
	}
	
	return response;
};
