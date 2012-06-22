exports["test: merge"] = require("./buildkit/test_merge");

if (require.main == module || require.main == module.id) {
    require("test").run(exports);
}