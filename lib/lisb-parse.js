
const is    = require('is')

const match  = require('./flotsam').match
const sdtlib = require('./lisb-stdlib')
const _     = undefined






const lookup = function (scope, valname) {

	const val = scope[valname]

	if (typeof val === 'undefined') {
		throw 'undefined value returned upon lookup of ' + valname
	}

	return val
}

const isPrimitive = function (EXPR) {
	return is.number(EXPR)
}

const lisbEval = function (EXPR) {

	var scope = Object.create(sdtlib)

	const isVARNAME = function (EXPR) {
		return is.string(EXPR) && EXPR.charAt(0) === ':' || is.string(EXPR) && scope.hasOwnProperty(EXPR)
	}

	const action = {
		'let': function (EXPR) {

			const VALNAME  = leval(EXPR[1], isVARNAME)
			const VAL      = leval(EXPR[2], isPrimitive)

			if (scope[VALNAME]) {
				throw VALNAME + ' is already defined.'
			}

			scope[VALNAME] = VAL
			return VAL
		},
		'cond': function (EXPR) {

			const BOOL = leval(EXPR[1], isPrimitive)

			if (BOOL !== true && BOOL !== false) {
				throw BOOL + ' must be a variable name.'
			}

			if (BOOL === true) {
				return leval(EXPR[2], isPrimitive)
			} else {
				return leval(EXPR[3], isPrimitive)
			}
		},
		'λ': function (EXPR) {

			const PARAMNAME = leval(EXPR[1], isVARNAME)

			return function () {

			}
		},
		'begin': function (EXPR) {

			const results = EXPR.slice(1).map(function (expr) {
				return leval(expr, isPrimitive)
			})

			return results[results.length - 1]
		},
		'list': function (EXPR) {

			return ['list'].concat( EXPR.slice(1).map(function (expr) {
				return leval(expr, isPrimitive)
			}) )

		},
		'callproc' : function (EXPR) {

			const PROC     = lookup(scope, leval(EXPR[0], isVARNAME))
			const PROCARGS = EXPR.slice(1).map(function (expr) {
				return leval(expr, isPrimitive)
			})

			const result   = PROCARGS.reduce(function (curried, arg) {
				return curried(arg)
			}, PROC)

			return result
		}
	}

	const leval = function (EXPR, until) {

		if (until(EXPR)) {
			return EXPR
		} else if (is.array(EXPR)) {

			const PROC = leval(EXPR[0], isVARNAME)

			if (action[PROC]) {
				return action[PROC](EXPR)
			} else {
				return action.callproc(EXPR)
			}

		} else if (isVARNAME(EXPR)) {
			return lookup(scope, EXPR)
		} else {
			return EXPR
		}
	}

	const finalResult = leval(EXPR, isPrimitive)
	return finalResult
}






module.exports = {
	lisbEval: lisbEval
}
