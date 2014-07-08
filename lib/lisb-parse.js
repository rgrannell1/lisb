
const is    = require('is')

const match = require('./flotsam').match
const _     = undefined










const lisbParse = ( function () {

	const validatePrimitive = {
		number: is.number,
		bool  : is.boolean
	}

	const validateEXPR = {
		quote : function (EXPR) {
			console.assert(EXPR.length === 2, 'quote error:')
			EXPR.slice(1).map(lisbParse)
		},
		cond  : function (EXPR) {
			console.assert(EXPR.length === 3, 'cond error:')
			EXPR.slice(1).map(lisbParse)
		},
		let   : function (EXPR) {
			console.assert(EXPR.length === 3, 'let error:')
			EXPR.slice(1).map(lisbParse)
		},
		λ     : function (EXPR) {
			console.assert(EXPR.length === 3, 'λ error:')
			EXPR.slice(1).map(lisbParse)
		},
		begin : function (EXPR) {
			EXPR.slice(1).map(lisbParse)
		}
	}

	return function (EXPR) {

		const PROC     = EXPR[0]

		if (validateEXPR[PROC]) {
			validateEXPR[PROC](EXPR)
		} else {
			EXPR.slice(1).map(lisbParse)
		}


	}

} )()

module.exports = {
	lisbParse: lisbParse
}
