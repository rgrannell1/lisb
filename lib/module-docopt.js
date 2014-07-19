#!/usr/bin/env node

/*
	Docopt Module

*/

module.exports = function (str) {

	var args = require('docopt')(str)

	console.log(args)




}

module.exports.isMacro = false
