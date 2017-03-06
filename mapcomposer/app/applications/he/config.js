exports.config = function(urls, middleware) {
    urls[0] = [(/^\/(index(.html)?)?/), require("./loginpage").app];
    urls[1] = [(/^\/(loginpage(.html)?)/), require("./loginpage").app];
    urls[2] = [(/^\/(composer)/), require("./composer").app];
    urls[3] = [(/^\/(manager(.html)?)?/), require("./manager").app];
    urls.push([(/^\/(gcd(.html)?)/), require("./gcd").app]);
    urls.push([(/^\/(lite(.html)?)/), require("./lite").app]);
    middleware.unshift(require("ringo/middleware/static").middleware({base: module.resolve("static")}));
};