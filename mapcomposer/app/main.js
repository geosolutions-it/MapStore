#!/usr/bin/env ringo

// main script to start application

if (require.main == module) {
	var {Parser} = require('ringo/args');
	var parser = new Parser();
	parser.addOption("p", "port", '8080', "Optional port (defaults to 8081)")
		.addOption("a", "application", '[APPLICATION]', "Optional application");
	var args = [];
	for(var i = 1; i< system.args.length; i++) {
		args.push(system.args[i]);
	}
	system.args = ['mapcomposer/app/main.js'];
	var options = parser.parse(args);
	if(options.port) {
		system.args = ['mapcomposer/app/main.js','-p',options.port];
	}
    java.lang.System.setProperty("app.debug", 1);
	var {writeln} = require('ringo/term');
	if(options.application) {
		environment.applicationPath = 'applications/' + options.application;
		writeln('Loading application from '+environment.applicationPath);
		require("ringo/webapp").main(module.directory);
	} else {
		require("ringo/webapp").main(module.directory);
	}
}
