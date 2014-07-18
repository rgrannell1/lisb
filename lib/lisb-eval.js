#!/usr/bin/env node

const is        = require('is')
const inspect   = require('util').inspect
const sdtlib    = require('./lisb-stdlib')

const paramsOf  = require('./flotsam').paramsOf
const mapRest   = require('./flotsam').mapRest
const lastOf    = require('./flotsam').lastOf
const procOf    = require('./flotsam').procOf
const firstOf   = require('./flotsam').firstOf
const indicesOf = require('./flotsam').indicesOf
const argsOf    = require('./flotsam').argsOf
const restOf    = require('./flotsam').restOf

const let       = 'let'
const cond      = 'cond'
const fn        = 'fn'
const begin     = 'begin'
const list      = 'list'
const quote     = 'quote'
const unquote   = 'quote'
const quasiquote   = 'quasiquote'

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
	return inspect(EXPR, {
		colors: true
	})
}

/*
	fromCall :: a -> string

	fromCall returns a message showing the source of an error.
*/

const fromCall = function (CALL) {
	return 'Thrown from ' + CALL[0] + '\n' +
		'In the call ' + catchCall(CALL) + '\n'
}

/*
	checkFormLength :: a -> number -> b -> undefined

	checkFormLength checks that a special form has the
	expected length.
*/

const checkFormLength = function (EXPR, len, call) {

	console.log(len - 1)

	if (EXPR.length !== len && false) {

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
	checkValArray :: a -> b -> undefined

	checkValArray throws an error if .
*/

const checkValArray = function (VAL, CALL) {

	if (!is.array(VAL)) {

		const message =
			"No array was found to supply values to destructuring assignment." + '\n' +
			fromCall(CALL)

		throw message
	}
}







/*
	typeParam[param] :: a -> undefined

	These functions check that the argument matching certain typed parametre names
	has that type. This makes Lisb easier to debug, but it's not exactly a type system.
*/

const summate = function (val) {
	return 'Actual type was ' + Object.prototype.toString.call(val)
}

const paramTypeError = function (val, param, descr) {
	return TypeError("The argument matching '" + param + "' was not  " + descr + ".\n" +
		summate(val) + '\n'
	)
}

const typeParam = {
	coll: function (val) {
		if (!is.array(val)) {
			return paramTypeError(val, "coll",  "an array")
		}
	},
	coll0: function (val) {
		if (!is.array(val)) {
			return paramTypeError(val, "coll0",  "an array")
		}
	},
	coll1: function (val) {
		if (!is.array(val)) {
			return paramTypeError(val, "coll1",  "an array")
		}
	},

	fn: function (val) {
		if (!is.function(val)) {
			return paramTypeError(val, "function",  "a function")
		}
	},
	pred: function (val) {
		if (!is.function(val)) {
			return paramTypeError(val, "pred",  "a function")
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
			return paramTypeError(val, "num0",  "a number")
		}
	},
	num1: function (val) {
		if (!is.number(val)) {
			return paramTypeError(val, "num1",  "a number")
		}
	},
	nums: function (val) {
		if (false) {
			return paramTypeError(val, "nums",  "an array of numbers")
		}
	},

	bool: function (val) {
		if (val === true && val !== false) {
			return paramTypeError(val, "bool",  "a true of false value")
		}
	},
	bools: function (val) {
		if (false) {
			return paramTypeError(val, "bools",  "an array of true or false values")
		}
	},

	str: function (val) {
		if (!is.string(val)) {
			return paramTypeError(val, "str",  "a string")
		}
	},
	strs: function (val) {
		if (false) {
			return paramTypeError(val, "strs",  "an array of strings")
		}
	},

	rexp: function (val) {
		if (!is.string(val)) {
			return paramTypeError(val, "rexp",  "a string")
		}
	},

	colls: function (val) {
		if (!is.array(val)) {
			return paramTypeError(val, "coll1",  "an array")
		} else {
			val.map(function (elem) {
				return paramTypeError(elem, "coll1",  "an array of arrays.")
			})
		}
	}
}














const lEval = ( function () {

	var STACK    = []
	var evalForm = {}

	/*
		[let, valname, val]

		let :: a -> Object

		The let special form assigns a constant value to the current scope. The
		second argument is evaluated until a valname is reached, and the last
		argument is fully evaluated.
	*/

	evalForm.let = function (EXPR, SCOPE) {

		checkFormLength(EXPR, 2, catchCall(EXPR))
		checkNotUndefined(EXPR)

		// either use a single valname, or take an array
		// of names to recur into.

		const VALNAME = _levalToValname(EXPR[1], SCOPE)
		const VAL     = _levalToPrimitive(EXPR[2], SCOPE)

		// assign a single value to a single name.

		checkValname(VALNAME, EXPR)
		checkDefined(VALNAME, SCOPE, EXPR)

		SCOPE[VALNAME] = VAL
		return VAL

	}

	/*
		[rlet, 	]
	*/

	evalForm.rlet = function (EXPR, SCOPE) {

		checkFormLength(EXPR, 2, catchCall(EXPR))
		checkNotUndefined(EXPR)

		// either use a single valname, or take an array
		// of names to recur into.

		const VALNAME = _leval(EXPR[1], function (expr) {
			return is.array(expr) && expr[0] === 'list'
		}, SCOPE)
		const VAL     = _levalToPrimitive(EXPR[2], SCOPE)

		//  generate some sub-let bindings
		checkValArray(VAL, EXPR)

		if (VAL[0] !== 'list' || VALNAME[0] !== 'list') {
			throw 'list error'
		}

		for (var ith = 1; ith < VAL.length; ith++) {

			var SUBVALNAME = _levalToValname(VALNAME[ith])
			var SUBVAL     = _levalToPrimitive(VAL[ith], SCOPE)

			var innerLet = ['let', SUBVALNAME, SUBVAL]

			evalForm.let(innerLet, SCOPE)
		}

		return VAL
	}

	/*
		[cond, bool, expr0, expr1]

		cond :: a -> Object

		Cond is Lisb's mechanism of conditional execution, which is more or less
		and if statement. Both branches must be included to avoid undefined return
		values. The first boolean argument is fully evaluated, the other arguments
		are evaluated depending on that value.
	*/

	evalForm.cond = function (EXPR, SCOPE) {

		checkFormLength(EXPR, 3, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const BOOL = _levalToPrimitive(EXPR[1], SCOPE)

		if (BOOL) {
			return _levalToPrimitive(EXPR[2], SCOPE)
		} else {
			return _levalToPrimitive(EXPR[3], SCOPE)
		}
	}

	/*
		[fn, valname, expr]

		fn :: a -> function

		Construct a lambda function. Lambda functions are always unary;
		the first argument is evalauted until a valname is reached. The second
		argument is not evaluated until the lambda-function is actually called.

		Lambda-functions are lexically scoped, and let blocks assign to the closest
		enclosing scope.

	*/

	evalForm.fn = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		const VALNAME  = _levalToValname(EXPR[1], SCOPE)
		const BODY     = EXPR[2]

		checkValname(VALNAME, EXPR)

		const fn = function (val) {

			const closureEnv    = Scope(SCOPE)
			closureEnv[VALNAME] = val

			return lEval(BODY, closureEnv)
		}

		fn.isMacro = false

		return fn
	}

	evalForm.mr = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		const VALNAME  = _levalToValname(EXPR[1], SCOPE)
		const BODY     = EXPR[2]

		checkValname(VALNAME, EXPR)

		const fn = function (val) {

			const closureEnv    = Scope(SCOPE)
			closureEnv[VALNAME] = val

			return lEval(BODY, closureEnv)
		}

		fn.isMacro = true

		return fn
	}

	/*
		[quote, expr]

		quote :: a -> Object -> a

		Capture an expression as an unevaluated data structure,
		but evaluate the 'unquote' expressions within. Quote transforms
		code into data.
	*/

	evalForm.quote = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)
		checkFormLength(EXPR, 1, catchCall(EXPR))

		return EXPR[1]
	}

	evalForm.eval = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)
		checkFormLength(EXPR, 2, catchCall(EXPR))

		return lEval(lEval(EXPR[1], SCOPE), SCOPE)
	}

	/*
		[quasiquote, expr]

		quasiquote :: a -> Object -> a

		Quotation with interpolation. Quote an expression as a
		data structure, but evaluate unquoted inner expressions.
	*/
	evalForm.quasiquote = function (EXPR, SCOPE) {

		const VAL = EXPR[1]

		const out = VAL.map(function (elem) {

			const isEvaluatable =
				is.array(elem) && is.string(elem[0]) &&
				elem[0] === 'unquote'

			if (isEvaluatable) {
				return lEval(elem, SCOPE)
			} else {
				return elem
			}

		})

		return out
	}

	/*
		[unquote, expr]

		unquote :: a -> Object -> are

	*/
	evalForm.unquote = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		const VAL = EXPR[1]
		return lEval(VAL, SCOPE)
	}

	/*
		[begin, ...exprs]

		begin :: a -> Object

		Execute a series of expressions. The final result
		of the begin chain is the final expression value. All expressions
		are fully evaluated, in applicative order.
	*/

	evalForm.begin = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		return lastOf(mapRest(function (expr) {
			return _levalToPrimitive(expr, SCOPE)
		}, EXPR))
	}

	/*
		[list, ...exprs]

		list :: a -> Object

		Create a list, a wrappers for JavaScript arrays. This form is
		not a redexp; it is not reduced upon evaluation.
	*/

	evalForm.list = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		return ['list'].concat( mapRest(function (expr) {
			return _levalToPrimitive(expr, SCOPE)
		}, EXPR) )
	}

	/*
		[proc, ...exprs]

		callProc :: a -> Object

		Evaluate a non-special form. The argument in the calling position,
		proc, is evaluated until a function is returned. The tail of the form,
		each argument to call proc with, are evaluated in applicative order.

		proc is called with the first argument, and the return value of proc
		is called with the second argument and so on until arguments are exhausted.
		All polyadic Lisb functions are made by currying, and this is how they are called.

		If only some of the arguments are given to a polyadic curried function a
		partially applied function is returned, which is fine and useful.

		Some function parametres are typed, so arguments to these parametres must
		have their expected types. If too many arguments are given, and proc does not
		return a function to match each argument an error is thrown.
	*/

	evalForm.callProc = function (EXPR, SCOPE) {

		checkNotUndefined(EXPR)

		if (EXPR.length === 0) {

			var message =
				"An empty array arose during evaluation; ." +
				"this is not allowed.\n" +
				fromCall(EXPR)

			throw message

		}

		const PROC = _levalToPrimitive(procOf(EXPR), SCOPE)

		if (!is.function(PROC)) {
			var message =
				"A non-function value was used in the calling position of an expression.\n" +
				fromCall(EXPR)

			throw message
		}

		if (PROC.isMacro === false) {

			var PROCARGS = mapRest(function (expr) {
				return _levalToPrimitive(expr, SCOPE)
			}, EXPR)

		} else if (PROC.isMacro === true) {

			var PROCARGS = mapRest(function (expr) {
				return expr
			}, EXPR)

		} else {

			var message =
				"The property .isMacro was not defined on an evaluated function: " +
				fromCall(EXPR)

			throw message
		}


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
					throw err + fromCall(EXPR)
				}

				return curried(arg)

			}, PROC)

	}


	/*
		lookup :: string -> Object -> a

		lookup searches for a value within the current scope. If no
		value is found an error is thrown. Lisb uses lexical scoping,
		so the closest binding for a variable is used, and when a binding
		is not found in the enclosing parent scope the grandparent scope
		and its antecedants are searched for a matching binding.
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

	/*
		_leval :: a -> (a -> boolean) -> Object -> b

		_leval is the workhorse evaluator functions. It takes an expression,
		and if it is reducible it recursively evaluates the redexp.

		Primitives are already in normal form, so they are returned untouched. Valuenames
		are replaces with their binding upon evaluation. Array-expressions that encode
		a special form are evaluated according to its rules; other forms are evaluated
		as a total function call to a curried function.

	*/

	const _leval = function (EXPR, until, SCOPE, opts) {

		if (until(EXPR)) {
			return EXPR
		}

		if (is.array(EXPR)) {

			opts && opts.debug?
				console.log(catchCall(EXPR) + '\n'):
				null

			const PROC = _levalToValname(procOf(EXPR), SCOPE)

			return evalForm[PROC]?
				evalForm[PROC](EXPR, SCOPE):
				evalForm.callProc(EXPR, SCOPE)

		}

		if (isVALNAME(EXPR)) {
			return lookup(EXPR, SCOPE)
		}

		return EXPR
	}

	_levalToPrimitive = function (EXPR, SCOPE, opts) {
		return _leval(EXPR, isPrimitive, SCOPE, opts)
	}

	_levalToValname = function (EXPR, SCOPE, opts) {
		return _leval(EXPR, isVALNAME, SCOPE, opts)
	}




	return function (EXPR, SCOPE, opts) {
		return _levalToPrimitive( EXPR, SCOPE? SCOPE: Scope({}), opts )
	}

} )()

module.exports = {
	lEval: lEval
}