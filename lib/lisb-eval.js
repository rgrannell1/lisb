
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
			'The value ' + VALNAME + ' is already defined.' +
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

const argsOf = restOf = function (coll) {
	return coll.slice(1)
}

const list = function (EXPR) {
	return ['list'].concat(EXPR)
}





const paramTypes = {
	coll: function (coll) {

	}
}














const lisbEval = ( function () {

	var scope    = Scope({})
	var evalForm = {}

	/*
		[let, valname, val]

	*/

	evalForm.let = function (EXPR) {

		checkFormLength(EXPR, 2, catchCall(EXPR))
		checkNotUndefined(EXPR)

		const VALNAME  = _leval(EXPR[1], isVALNAME)
		const VAL      = _leval(EXPR[2], isPrimitive)

		checkDefined(VALNAME, scope, EXPR)

		scope[VALNAME] = VAL
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


	*/

	evalForm.list = function (EXPR) {

		checkNotUndefined(EXPR)

		return list( mapRest(function (expr) {
			return _leval(expr, isPrimitive)
		}, EXPR) )
	}

	/*
		[proc, ...exprs]


	*/

	evalForm.callProc = function (EXPR) {

		checkNotUndefined(EXPR)

		const PROC = _leval(procOf(EXPR), isPrimitive)

		const PROCARGS = mapRest(function (expr) {
			return


			_leval(expr, isPrimitive)
		}, EXPR)

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
			return lookup(EXPR, scope)
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
