#!/usr/bin/env node

/*
	Console Module


*/

module.exports =
['list',

	['list', 'log', function (val) {
		console.log(val)
		return val
	}],

	['list', 'info', function (val) {
		console.info(val)
		return val
	}],

	['list', 'error', function (val) {
		console.error(val)
		return val
	}],

	['list', 'warn', function (val) {
		console.warn(val)
		return val
	}],

	['list', 'trace', function (val) {
		console.trace(val)
		return val
	}],

	['list', 'assert', function (val) {
		const outfn = function (str) {
			console.assert(val, str)
			return val
		}

		outfn.isMacro = false
		return outfn

	}]
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

console.log(module.exports)
