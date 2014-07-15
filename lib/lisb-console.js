#!/usr/bin/env node

/*
	Console Module


*/

module.exports =
['list',

	['list', ['quote', ':log'], function (val) {
		console.log(val)
		return val
	}],

	['list', ['quote', ':info'], function (val) {
		console.info(val)
		return val
	}],

	['list', ['quote', ':error'], function (val) {
		console.error(val)
		return val
	}],

	['list', ['quote', ':warn'], function (val) {
		console.warn(val)
		return val
	}],

	['list', ['quote', ':trace'], function (val) {
		console.trace(val)
		return val
	}],

	['list', ['quote', ':assert'], function (val) {
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
