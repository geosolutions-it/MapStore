exports.config = function(urls, middleware) {
	urls[0] = [(/^\/(index(.html)?)?/), require("./index").app];
	urls[3] = [(/^\/(manager(.html)?)?/), require("./manager").app];
	middleware.unshift(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};