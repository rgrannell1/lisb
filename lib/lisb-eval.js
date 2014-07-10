
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

	},
	coll0: function (val) {

	},
	coll1: function (val) {

	},

	fn: function (val) {

	},
	pred: function (val) {

	},

	val: function (val) {

	},
	val0: function (val) {

	},
	val1: function (val) {

	},

	num: function (val) {

	},
	num0: function (val) {

	},
	num1: function (val) {

	},
	nums: function (val) {

	},

	bool: function (val) {

	},
	bools: function (val) {

	},

	str: function (val) {

	},
	strs: function (val) {

	},

	rexp: function (val) {

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


	*/

	evalForm['λ'] = function () {

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
