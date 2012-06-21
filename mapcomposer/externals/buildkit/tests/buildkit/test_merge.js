var ASSERT = require("assert");
var MERGE = require("buildkit/merge");

var assets = {
    
    "pet/dog/chiwawa" : {include: {"trick/tailwag": true}, require: {"pet/dog": true}},
    
    "trick/tailwag": {include: {}, require: {"trick": true}},
    
    "pet/dog": {include: {"trick/tailwag": true}, require: {"pet": true}},

    "pet": {include: {}, require: {}},
    
    "trick": {include: {}, require: {}},

    "pet/cat/manx": {include: {}, require: {"pet/cat": true}},
    
    "pet/cat": {include: {}, require: {"pet": true}}
    
};


exports["test: _getOrderedAssets (all)"] = function() {


    var first = [];
    var include = [];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    var count = 0;
    for (var path in assets) {
        ++count;
        ASSERT.isTrue(ordered.indexOf(path) >= 0, path + " in ordered");
    }
    ASSERT.strictEqual(ordered.length, count, "correct ordered length");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/cat"), "pet before pet/cat");
    ASSERT.isTrue(ordered.indexOf("pet/cat") < ordered.indexOf("pet/cat/manx"), "pet/cat before pet/cat/manx");
    
    ASSERT.isTrue(ordered.indexOf("trick") < ordered.indexOf("trick/tailwag"), "trick before trick/tailwag");

};

exports["test: _getOrderedAssets (first)"] = function() {

    var first = ["trick"];
    var include = ["pet/dog/chiwawa"];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    ASSERT.strictEqual(ordered.indexOf("pet/cat"), -1, "no pat/cat here");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.isTrue(ordered.indexOf("trick/tailwag") >= 0, "trick/tailwag included by default");
    ASSERT.strictEqual(ordered.indexOf("trick"), 0, "trick first");
	
    var first = ["pet"];
    var include = ["pet/dog/chiwawa"];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    ASSERT.strictEqual(ordered.indexOf("pet/cat"), -1, "no pat/cat here");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.isTrue(ordered.indexOf("trick/tailwag") >= 0, "trick/tailwag included by default");
    ASSERT.isTrue(ordered.indexOf("trick") < ordered.indexOf("trick/tailwag"), "trick before trick/tailwag");

    ASSERT.strictEqual(ordered.indexOf("pet"), 0, "pet first");

};

exports["test: _getOrderedAssets (include)"] = function() {

    var first = [];
    var include = ["pet/dog/chiwawa"];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    ASSERT.strictEqual(ordered.indexOf("pet/cat"), -1, "no pat/cat here");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.isTrue(ordered.indexOf("trick/tailwag") >= 0, "trick/tailwag included by default");
    ASSERT.isTrue(ordered.indexOf("trick") < ordered.indexOf("trick/tailwag"), "trick before trick/tailwag");
	
};

exports["test: _getOrderedAssets (exclude)"] = function() {

    var first = [];
    var include = ["pet/dog/chiwawa"];
    var exclude = ["trick/tailwag"];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    ASSERT.strictEqual(ordered.indexOf("pet/cat"), -1, "no pat/cat here");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.strictEqual(ordered.indexOf("trick/tailwag"), -1, "trick/tailwag excluded");
    ASSERT.strictEqual(ordered.indexOf("trick"), -1, "no trick");
	
};

exports["test: _getOrderedAssets (last)"] = function() {

    var first = [];
    var include = [];
    var exclude = [];
    var last = ["pet/cat/manx"];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, assets);
    
    var count = 0;
    for (var path in assets) {
        ++count;
        ASSERT.isTrue(ordered.indexOf(path) >= 0, path + " in ordered");
    }
    ASSERT.strictEqual(ordered.length, count, "correct ordered length");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/dog"), "pet before pet/dog");
    ASSERT.isTrue(ordered.indexOf("pet/dog") < ordered.indexOf("pet/dog/chiwawa"), "pet/dog before pet/dog/chiwawa");
    
    ASSERT.isTrue(ordered.indexOf("pet") < ordered.indexOf("pet/cat"), "pet before pet/cat");
    ASSERT.isTrue(ordered.indexOf("pet/cat") < ordered.indexOf("pet/cat/manx"), "pet/cat before pet/cat/manx");
    
    ASSERT.isTrue(ordered.indexOf("trick") < ordered.indexOf("trick/tailwag"), "trick before trick/tailwag");
    
    ASSERT.strictEqual(ordered.indexOf("pet/cat/manx"), count-1, "pet/cat/manx last");

};

exports["test: _getOrderedAssets (circular)"] = function() {
    
    var circular = {
        "happiness": {require: {"money": true}},
        "money": {require: {"happiness": true}}
    };
    
    var first = [];
    var include = [];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, circular);
    
    ASSERT.strictEqual(ordered.length, 2, "correct ordered length");

    var first = ["happiness"];
    var include = [];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, circular);

    ASSERT.strictEqual(ordered.indexOf("happiness"), 0, "happiness first");


    var first = ["money"];
    var include = [];
    var exclude = [];
    var last = [];
    var ordered = MERGE._getOrderedAssets(first, include, exclude, last, circular);

    ASSERT.strictEqual(ordered.indexOf("money"), 0, "money first");

};


if (require.main == module || require.main == module.id) {
    require("test").run(exports);
}
