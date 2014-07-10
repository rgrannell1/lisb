
const is    = require('is')

const sdtlib = require('./lisb-stdlib')






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
			'The value ' + JSON.stringify(bool) + ' must be true or false.' +
			fromCall(CALL)

		throw message
	}
}

const checkNotUndefined = function (EXPR) {

	EXPR.map(function (elem) {

		const message =
			'An undefined value was found in the expression ' +
			JSON.stringify(EXPR) + '.\n' +
			fromCall(EXPR)

		if (typeof elem === 'undefined') {
			throw message
		}

	})

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

const mapRest = function (fn, coll) {
	return coll.slice(1).map(fn)
}

const lastOf = function (coll) {
	return coll[coll.length - 1]
}

const procOf = firstOf = function (coll) {
	return coll[0]
}

const indicesOf = function (coll) {
	return coll.reduce(function (acc, _) {
		return acc.concat([acc.length])
	}, [])
}

const argsOf = restOf = function (coll) {
	return coll.slice(1)
}

const list = function (EXPR) {
	return ['list'].concat(EXPR)
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

	var SCOPE    = Scope({})
	var STACK    = []
	var evalForm = {}

	/*
		[let, valname, val]

	*/

	evalForm.let = function (EXPR) {

		checkFormLength(EXPR, 2, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const VALNAME  = _leval(EXPR[1], isVALNAME)
		const VAL      = _leval(EXPR[2], isPrimitive)

		checkValname(VALNAME, EXPR)
		checkDefined(VALNAME, SCOPE, EXPR)

		SCOPE[VALNAME] = VAL
		return VAL
	}

	/*
		[cond, bool, expr0, expr1]


	*/

	evalForm.cond = function (EXPR) {

		checkFormLength(EXPR, 3, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const BOOL = _leval(EXPR[1], isPrimitive)

		if (BOOL) {
			return _leval(EXPR[2], isPrimitive)
		} else {
			return _leval(EXPR[3], isPrimitive)
		}
	}

	/*
		[λ, valname, expr]

		Construct a lambda function.

	*/

	evalForm['λ'] = function (EXPR) {

		checkNotUndefined(EXPR)

		const VALNAME  = _leval(EXPR[1], isVALNAME)
		const BODY     = EXPR[2]

		checkValname(VALNAME, EXPR)

		return function (ARG) {

			const closureEnv    = {}
			closureEnv[VALNAME] = ARG

			return lisbEval(BODY, closureEnv)
		}
	}

	/*
		[begin, ...exprs]

		Execute a series of expressions.
	*/

	evalForm.begin = function (EXPR) {

		checkNotUndefined(EXPR)

		return lastOf(mapRest(function (expr) {
			return _leval(expr, isPrimitive)
		}, EXPR))
	}

	/*
		[list, ...exprs]

		Create a list.
	*/

	evalForm.list = function (EXPR) {

		checkNotUndefined(EXPR)

		return list( mapRest(function (expr) {
			return _leval(expr, isPrimitive)
		}, EXPR) )
	}

	/*
		[proc, ...exprs]

		Evaluate a standard function.
	*/

	evalForm.callProc = function (EXPR) {

		checkNotUndefined(EXPR)

		const PROC = _leval(procOf(EXPR), isPrimitive)

		const PROCARGS = mapRest(function (expr) {
			return _leval(expr, isPrimitive)
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



	const _leval = function (EXPR, until) {

		STACK.push(EXPR)
		console.log(EXPR)

		if (until(EXPR)) {
			return EXPR
		}
		if (is.array(EXPR)) {

			const PROC = _leval(procOf(EXPR), isVALNAME)

			return evalForm[PROC]?
				evalForm[PROC](EXPR):
				evalForm.callProc(EXPR)
		}
		if (isVALNAME(EXPR)) {
			return lookup(EXPR, SCOPE)
		}

		return EXPR
	}





	return function (EXPR) {
		return _leval(EXPR, isPrimitive)
	}

} )()







module.exports = {
	lisbEval: lisbEval
}
