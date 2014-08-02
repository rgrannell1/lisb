#!/usr/bin/env node

/*
	Console Module


*/

const asModule = require('./flotsam').asModule

module.exports =
	asModule({
		log: function (val) {
			console.log(val)
			return val
		},
		info: function (val) {
			console.info(val)
			return val
		},
		error: function (val) {
			console.error(val)
			return val
		},
		warn: function (val) {
			console.error(val)
			return val
		},
		trace: function (val) {
			console.trace(val)
			return val
		},
		assert: function (val) {

			const outfn = function (str) {
				console.assert(val, str)
				return val
			}

			outfn.isMacro = false
			return outfn

		}
	})
