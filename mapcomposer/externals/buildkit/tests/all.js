exports["test: buildkit"] = require("./test_buildkit");

if (require.main == module || require.main == module.id) {
    require("test").run(exports);
}

