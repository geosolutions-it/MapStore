exports.config = function(urls, middleware) {
	middleware.unshift(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};