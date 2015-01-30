exports.config = function(urls, middleware) {
	urls[0] = [(/^\/(index(.html)?)?/), require("./index").app];
	urls[0] = [(/^\/(manager(.html)?)?/), require("./manager").app];
	middleware.push(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};