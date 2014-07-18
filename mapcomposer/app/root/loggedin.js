var Response = require("ringo/webapp/response").Response;
var Request = require("ringo/webapp/request").Request;
var http = require('ringo/httpclient');
var auth = require("../auth");

exports.app = function(req) {
    var request = new Request(req);
	var session = request.session;
    var details = auth.getDetails(request);
	var url = 'http://' + request.host + ':' + request.port + '/' + request.pathDecoded + '/../mvc/session/username/' + session.data['mapstore_session_id'];
	var result = http.get(url);
	var sessionId = '', userName = '';
	if(result.status === 200) {
		sessionId = session.data['mapstore_session_id'];
		userName = result.content;
	}
    var response = Response.skin(module.resolve("../templates/loggedin.html"), {status: details.status || 404, sessionId: sessionId, userName: userName});
    return response;
};
