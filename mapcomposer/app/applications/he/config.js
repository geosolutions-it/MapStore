exports.config = function(urls, middleware) {
	urls[0] = [(/^\/(gcd(.html)?)/), require("./gcd").app];
	middleware.push(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};