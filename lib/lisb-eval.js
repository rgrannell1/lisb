
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


/*
	Scope :: Object -> Object

	Scope creates a hash-table that stores the variable name:value bindings within
	a lambda or global program.

	Scopes are linked in a prototype chain from the global scope, to any lambda functions
	in that scope, and any lambdas within those.

	In the following scope-chain

		GLOBAL {x: 1} <---- LOCAL0: {x: 2} <---- LOCAL1 {x: 3} ---> x?

	x resolves to 3. In this scope-chain

		GLOBAL {y: 1} <---- LOCAL0: {y: 2} <---- LOCAL1 {x: 3} ---> y?

	y resolves to 2.

*/

const Scope = function (parent) {

	var scope = Object.create(sdtlib)

	for (prop in parent) {
		if (parent.hasOwnProperty(prop)) {
			scope[prop] = parent[prop]
		}
	}

	return scope
}




/*
	isValname :: a -> boolean

	isValname checks if a value is a string of the form

		':myVal'

	names of this form are used instead of symbols due to
	parser limitations.
*/

const isValname = function (str) {
	return is.string(str) && str.charAt(0) === ':' && str.length > 1
}

/*
	isVALNAME :: a -> boolean

	isVALNAME checks if a value is a vaname, or it is an import of stdlib. Some operators
	like '*' do not begin with a colon.
*/

const isVALNAME = ( function () {

	const stdlib = sdtlib

	return function (EXPR) {

		return isValname(EXPR) ||
			(is.string(EXPR) && stdlib.hasOwnProperty(EXPR))
	}
} )()

/*
	isPrimitive :: a -> boolean

	isPrimitive tests if a value is a valid datum within lisb;
	these include numbers, non-value name strings, functions and boolean values.
	Valnames do not fall into this category.
*/

const isPrimitive = function (EXPR) {
	return is.number(EXPR) ||
		(is.string(EXPR) && !isVALNAME(EXPR)) ||
		is.function(EXPR) ||
		EXPR === true || EXPR === false
}





/*

	catchCall :: a -> string

	catchCall deparses an expression to a string. This is used for error reporting.
*/

const catchCall = function (EXPR) {
	return JSON.stringify(EXPR)
}

/*
	fromCall :: a -> string

	fromCall returns a message showing the source of an error.
*/

const fromCall = function (CALL) {
	return 'Thrown from ' + CALL[0] + '\n' +
		'In the call ' + JSON.stringify(CALL)
}

/*
	checkFormLength :: a -> number -> b -> undefined

	checkFormLength checks that a special form has the
	expected length.
*/

const checkFormLength = function (EXPR, len, call) {

	if (EXPR.length !== len) {

		const message =
			EXPR[0] + ' requires ' + len - 1 + ' arguments, ' +
			'but recieved ' + (EXPR.length - 1) + '.\n' +
			fromCall(call)

		throw RangeError(message)
	}

}

/*
	checkDefined -> string -> Object -> a

	checkDefined ensures that an existing object is not overwritten
	during assignment to a scope. If an object exists within a scope
	an error is thrown.
*/

const checkDefined = function (VALNAME, scope, CALL) {
	if (scope[VALNAME]) {

		const message =
			'The value ' + VALNAME + ' is already defined.\n' +
			fromCall(CALL)

		throw message
	}
}

/*
	checkValname :: string -> a -> undefined

	checkValname throws an error if a string is not a valid
	value-name.
*/

const checkValname = function (VALNAME, CALL) {
	if (!isValname(VALNAME)) {

		const message =
			'Invalid valname ' + VALNAME + '.\n' +
			fromCall(CALL)

		throw message
	}
}

/*
	checkBoolean :: boolean -> a -> undefined

	checkBoolean throws an error if a value isn't boolean.
*/

const checkBoolean = function (bool, CALL) {
	if (bool !== true && bool !== false) {

		const message =
			'The value ' + catchCall(bool) + ' must be true or false.' +
			fromCall(CALL)

		throw message
	}
}

/*
	checkNotUndefined :: a -> undefined

	checkNotUndefined throws an error if an undefined value
	is found within an expression, as JavaScript is wont to
	introduces undefined by Lisb doesn't use them.
*/

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




/*
	typeParam[param] :: a -> undefined

	These functions check that the argument matching certain typed parametre names
	has that type. This makes Lisb easier to debug, but it's not exactly a type system.
*/

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

		let :: a -> Object

		The let special form assigns .
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
