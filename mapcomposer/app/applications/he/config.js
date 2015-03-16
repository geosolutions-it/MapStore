exports.config = function(urls, middleware) {
    urls[0] = [(/^\/(index(.html)?)?/), require("../../root/loginpage").app];
    urls.push([(/^\/(gcd(.html)?)/), require("./gcd").app]);
    middleware.unshift(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};