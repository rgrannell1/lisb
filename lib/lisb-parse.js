
const is    = require('is')

const match = require('./flotsam').match
const _     = undefined









const catchCall = function (EXPR) {
	return JSON.stringify(EXPR)
}










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
		'λ'    : function (EXPR) {
			console.assert(EXPR.length === 3, 'λ error:')
			EXPR.slice(1).map(lisbParse)
		},
		begin : function (EXPR) {
			console.log(catchCall(EXPR))
			EXPR.slice(1).map(lisbParse)
		}
	}

	return function (EXPR) {

		if (is.array(EXPR)) {

			const PROC = EXPR[0]

			if (validateEXPR[PROC]) {
				validateEXPR[PROC](EXPR)
			} else {
				EXPR.slice(1).map(lisbParse)
			}
		}
	}

} )()





const transform = function (EXPR) {

}










module.exports = {
	lisbParse: lisbParse
}
