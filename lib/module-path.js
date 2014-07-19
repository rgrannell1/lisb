#!/usr/bin/env node

/*
	Path Module


*/

const path = require('path')

module.exports =
['list',

	['list', 'normalize', function (str) {
		return path.normalize(str)
	}],
	['list', 'normalise', function (str) {
		return path.normalize(str)
	}],
	['list', 'join', function (strs) {
		return path.join.apply(strs)
	}],
	['list', 'resolve', function (strs, str0) {
		return path.resolve(strs.concat(str0))
	}],

	['list', 'relative	', function (str0, str1) {
		return path.relative(str0, str1)
	}],
	['list', 'dirname', function (str) {
		return path.dirname(str)
	}],
	['list', 'basename', function (str0, str1) {
		return path.basename(str0, str1)
	}],


	['list', 'extname', function (str) {
		return path.extname(str)
	}],

	['list', 'sep', path.sep],
	['list', 'delimiter', path.delimiter]
]

.map(function (triple) {

	if (triple.length !== 3) {
		return triple
	} else {

		const outfn = triple[2]
		outfn.isMacro = false

		return ['list', triple[1], outfn]
	}

})
