exports.config = function(urls, middleware) {
	urls[0] = [(/^\/(index(.html)?)?/), require("./index").app];
	middleware.push(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};