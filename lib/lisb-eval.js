
const is    = require('is')

const sdtlib = require('./lisb-stdlib')

const paramsOf  = require('./flotsam').paramsOf
const mapRest   = require('./flotsam').mapRest
const lastOf    = require('./flotsam').lastOf
const procOf    = require('./flotsam').procOf
const firstOf   = require('./flotsam').firstOf
const indicesOf = require('./flotsam').indicesOf
const argsOf    = require('./flotsam').argsOf
const restOf    = require('./flotsam').restOf




const Scope = function (parent) {

	var scope = Object.create(sdtlib)

	for (prop in parent) {
		if (parent.hasOwnProperty(prop)) {
			scope[prop] = parent[prop]
		}
	}

	return scope
}






const isValname = function (str) {
	return is.string(str) && str.charAt(0) === ':'
}

const isVALNAME = ( function () {

	const stdlib = sdtlib

	return function (EXPR) {

		return isValname(EXPR) ||
			// check if a function is stdlib.
			(is.string(EXPR) && stdlib.hasOwnProperty(EXPR))
	}
} )()

const isPrimitive = function (EXPR) {
	return is.number(EXPR) ||
		(is.string(EXPR) && !isVALNAME(EXPR)) ||
		is.function(EXPR) ||
		EXPR === true || EXPR === false
}







const catchCall = function (EXPR) {
	return JSON.stringify(EXPR)
}

const fromCall = function (CALL) {
	return 'Thrown from ' + CALL[0] + '\n' +
		'In the call ' + JSON.stringify(CALL)
}

const checkFormLength = function (EXPR, len, call) {

	if (EXPR.length !== len && false) {

		const message =
			EXPR[0] + ' requires ' + len - 1 + ' arguments, ' +
			'but recieved ' + (EXPR.length - 1) + '.\n' +
			fromCall(call)

		throw RangeError(message)
	}

}

const checkDefined = function (VALNAME, scope, CALL) {
	if (scope[VALNAME]) {

		const message =
			'The value ' + VALNAME + ' is already defined.\n' +
			fromCall(CALL)

		throw message
	}
}

const checkValname = function (VALNAME, CALL) {
	if (!isValname(VALNAME)) {

		const message =
			'Invalid valname ' + VALNAME + '.\n' +
			fromCall(CALL)

		throw message
	}
}

const checkBoolean = function (bool, CALL) {
	if (bool !== true && bool !== false) {

		const message =
			'The value ' + catchCall(bool) + ' must be true or false.' +
			fromCall(CALL)

		throw message
	}
}

const checkNotUndefined = function (EXPR) {

	EXPR.map(function (elem) {

		const message =
			'An undefined value was found in the expression ' +
			catchCall(EXPR) + '.\n' +
			fromCall(EXPR)

		if (typeof elem === 'undefined') {
			throw message
		}

	})

}






const typeParam = {
	coll: function (val) {
		if (!is.array(val)) {
			return TypeError("The argument matching 'coll' was not an array.")
		}
	},
	coll0: function (val) {
		if (!is.array(val)) {
			return TypeError("The argument matching 'coll0' was not an array.")
		}
	},
	coll1: function (val) {
		if (!is.array(val)) {
			return TypeError("The argument matching 'coll1' was not an array.")
		}
	},

	fn: function (val) {
		if (!is.function(val)) {
			return TypeError("The argument matching 'fn' was not a function.")
		}
	},
	pred: function (val) {
		if (!is.function(val)) {
			return TypeError("The argument matching 'pred' was not a function.")
		}
	},

	val: function (val) {

	},
	val0: function (val) {

	},
	val1: function (val) {

	},

	num: function (val) {
		if (!is.number(val)) {
			return TypeError("The argument matching 'num' was not a number.")
		}
	},
	num0: function (val) {
		if (!is.number(val)) {
			return TypeError("The argument matching 'num0' was not a number.")
		}
	},
	num1: function (val) {
		if (!is.number(val)) {
			return TypeError("The argument matching 'num1' was not a number.")
		}
	},
	nums: function (val) {
		if (false) {
			return TypeError("The argument matching 'nums' was not an array of numbers.")
		}
	},

	bool: function (val) {
		if (val === true && val !== false) {
			return TypeError("The argument matching 'bool' was not an true or false value.")
		}
	},
	bools: function (val) {
		if (false) {
			return TypeError("The argument matching 'bools' was not an array of true or false values.")
		}
	},

	str: function (val) {
		if (!is.string(val)) {
			return TypeError("The argument matching 'str' was not a string.")
		}
	},
	strs: function (val) {
		if (false) {
			return TypeError("The argument matching 'strs' was not an array of strings.")
		}
	},

	rexp: function (val) {
		if (!is.string(val)) {
			return TypeError("The argument matching 'rexp' was not a string.")
		}
	},

	colls: function (val) {

	}
}














const lisbEval = ( function () {

	var STACK    = []
	var evalForm = {}

	/*
		[let, valname, val]

	*/

	evalForm.let = function (EXPR, SCOPE) {

		checkFormLength(EXPR, 2, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const VALNAME  = _leval(EXPR[1], isVALNAME, SCOPE)
		const VAL      = _leval(EXPR[2], isPrimitive, SCOPE)

		checkValname(VALNAME, EXPR)
		checkDefined(VALNAME, SCOPE, EXPR)

		SCOPE[VALNAME] = VAL
		return VAL
	}

	/*
		[cond, bool, expr0, expr1]


	*/

	evalForm.cond = function (EXPR, SCOPE) {

		checkFormLength(EXPR, 3, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const BOOL = _leval(EXPR[1], isPrimitive, SCOPE)

		if (BOOL) {
			return _leval(EXPR[2], isPrimitive, SCOPE)
		} else {
			return _leval(EXPR[3], isPrimitive, SCOPE)
		}
	}

	/*
		[λ, valname, expr]

		Construct a lambda function.

	*/

	evalForm['λ'] = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		const VALNAME  = _leval(EXPR[1], isVALNAME, SCOPE)
		const BODY     = EXPR[2]

		checkValname(VALNAME, EXPR)

		return function (val) {

			const closureEnv    = Scope({})
			closureEnv[VALNAME] = val

			return lisbEval(BODY, closureEnv)
		}
	}

	/*
		[begin, ...exprs]

		Execute a series of expressions.
	*/

	evalForm.begin = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		return lastOf(mapRest(function (expr) {
			return _leval(expr, isPrimitive, SCOPE)
		}, EXPR))
	}

	/*
		[list, ...exprs]

		Create a list.
	*/

	evalForm.list = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		return ['list'].concat( mapRest(function (expr) {
			return _leval(expr, isPrimitive, SCOPE)
		}, EXPR) )
	}

	/*
		[proc, ...exprs]

		Evaluate a standard function.
	*/

	evalForm.callProc = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		const PROC = _leval(procOf(EXPR), isPrimitive, SCOPE)

		const PROCARGS = mapRest(function (expr) {
			return _leval(expr, isPrimitive, SCOPE)
		}, EXPR)

		const params = paramsOf(PROC)

		return indicesOf(PROCARGS)
			.reduce(function (curried, ith) {

				if (!is.function(curried)) {
					const message =
						"Too many arguments were supplied to the " +
						"invoked function.\n" +
						fromCall(EXPR)

					throw message
				}

				const arg   = PROCARGS[ith]
				const param = paramsOf(curried)

				const err = typeParam[param](arg)

				if (err) {
					throw error
				}

				return curried(arg)

			}, PROC)

	}


	/*

	*/

	const lookup = function (VALNAME, scope) {

		checkNotUndefined([VALNAME])

		const val = scope[VALNAME]

		if (typeof val === 'undefined') {

			const message =
				'An undefined value was returned upon lookup of ' + VALNAME

			throw message
		}

		return val
	}



	const _leval = function (EXPR, until, SCOPE) {

		STACK.push(EXPR)
		console.log(EXPR)

		if (until(EXPR)) {
			return EXPR
		}
		if (is.array(EXPR)) {

			const PROC = _leval(procOf(EXPR), isVALNAME, SCOPE)

			return evalForm[PROC]?
				evalForm[PROC](EXPR, SCOPE):
				evalForm.callProc(EXPR, SCOPE)

		}
		if (isVALNAME(EXPR)) {
			return lookup(EXPR, SCOPE)
		}

		return EXPR
	}





	return function (EXPR, SCOPE) {
		return _leval( EXPR, isPrimitive, SCOPE? SCOPE: Scope({}) )
	}

} )()







module.exports = {
	lisbEval: lisbEval
}
