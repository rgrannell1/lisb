
const is    = require('is')

const match  = require('./flotsam').match
const sdtlib = require('./lisb-stdlib')
const _      = undefined






const lookup = function (scope, valname) {

	const val = scope[valname]

	if (typeof val === 'undefined') {
		throw 'undefined value returned upon lookup of ' + valname
	}

	return val
}



const paramsOf = function (fn) {

	const params =
		fn
		.toString()
		.replace('function (', '')
		.match('^[^)]+')[0]
		.split(', ')

	return params

}





const validate = {
	coll: function (coll) {
		if (!is.array(coll)) {
			return Error('coll must be an array.')
		}
	},
	coll0: function (coll0) {
		if (!is.array(coll0)) {
			return Error('coll0 must be an array.')
		}
	},
	coll1: function (coll1) {
		if (!is.array(coll1)) {
			return Error('coll1 must be an array.')
		}
	},

	val: function () {},
	val0: this.val,
	val1: this.val,

	fn: function (fn) {
		if (!is.function(fn)) {
			return Error('fn must be a function.')
		}
	},
	pred: function (pred) {
		if (!is.function(pred)) {
			return Error('pred must be a function.')
		}
	},
	str: function () {

	},
	strs: function () {

	},
	num: function () {

	},
	nums: function () {

	},
	rexp: function () {

	}

}










const lisbEval = function (EXPR) {

	var scope = Object.create(sdtlib)

	const isVARNAME = function (EXPR) {
		return is.string(EXPR) && EXPR.charAt(0) === ':' || is.string(EXPR) && scope.hasOwnProperty(EXPR)
	}

	const isPrimitive = function (EXPR) {
		return is.number(EXPR) ||
			(is.string(EXPR) && !isVARNAME(EXPR)) ||
			is.function(EXPR) ||
			EXPR === true || EXPR === false
	}

	const action = {
		'let': function (EXPR) {

			if (EXPR.length !== 3) {
				const call = JSON.stringify(EXPR)
				throw RangeError('let requires 2 arguments, but recieved ' +
					(EXPR.length - 1) + '.\n' +
					'Thrown from ' + call + '\n')
			}

			const VALNAME  = leval(EXPR[1], isVARNAME)
			const VAL      = leval(EXPR[2], isPrimitive)

			if (scope[VALNAME]) {
				throw VALNAME + ' is already defined.'
			}

			scope[VALNAME] = VAL
			return VAL
		},
		'cond': function (EXPR) {

			if (EXPR.length !== 3) {
				const call = JSON.stringify(EXPR)
				throw RangeError('cond requires 3 arguments, but recieved ' +
					(EXPR.length - 1) + '.\n' +
					'Thrown from ' + call + '\n')
			}

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

			EXPR.map(function (expr) {

				if (typeof expr === 'undefined') {
					const call = JSON.stringify(EXPR)

					throw RangeError('undefined value.\n' +
						'Thrown from ' + call + '\n')

				}

			})

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

			var PROC = leval(EXPR[0], isPrimitive)

			if (isVARNAME(PROC)) {
				PROC = lookup(scope, PROC)
			} else {

			}

			const PROCARGS = EXPR.slice(1).map(function (expr) {
				return leval(expr, isPrimitive)
			})

			const params = paramsOf(PROC)

			var result = PROC

			for (var ith = 0; ith < PROCARGS.length; ith++) {

				if (!is.function(result)) {
					throw 'too many arguments given in the expression' +
					JSON.stringify(EXPR)
				}

				var arg   = PROCARGS[ith]
				var param =  params[ith]

				var err = validate[param](arg)

				if (err) {
					throw err + '\n' +
					'Thrown from the call ' +JSON.stringify(EXPR)
				}

				result = result(arg)
			}

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
