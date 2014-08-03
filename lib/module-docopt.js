#!/usr/bin/env node

/*
	Docopt Module

*/

const is     = require("is")
const docopt = require("docopt").docopt

const doc = function (str) {

	var args = docopt(str)

	const objectify = function (obj) {

		if (!is.object(obj)) {
			return obj
		}

		var out = []
		for (prop in args) {
			if (!args.hasOwnProperty(prop)) {
				continue
			}

			out.push([ 'list', prop, objectify(args[prop]) ])
		}

		return out
	}

	return objectify(args)
}

doc.isMacro = false

module.exports = doc
