exports.config = function(urls, middleware) {
    urls[0] = [(/^\/(index(.html)?)?/), require("./loginpage").app];
    urls[1] = [(/^\/(loginpage)/), require("./loginpage").app];
    urls[2] = [(/^\/(composer)/), require("./composer").app];
    urls.push([(/^\/(gcd(.html)?)/), require("./gcd").app]);
    middleware.unshift(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};