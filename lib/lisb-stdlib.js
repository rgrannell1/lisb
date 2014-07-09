
const is    = require('is')





var stdlib = {}

stdlib[':I'] = function (x) {
	return y
}
stdlib[':K'] = function (x) {
	return function (y) {
		return x
	}
}

/*
	Abstract Data Structure
*/

stdlib['conj'] = function (e0) {
	return function (e1) {
		return function (m) {
			return [m, e0, e1]
		}
	}
}

stdlib[':first-of'] = function (cell) {
	return [cell, function (e0) {
		return function (e1) {
			return e0
		}
	}]
}

stdlib[':rest-of'] = function (cell) {
	return [cell, function (e0) {
		return function (e1) {
			return e1
		}
	}]
}

conj = stdlib['conj']
firstof = stdlib['first-of']
restof = stdlib['rest-of']

A = conj(1)(conj(2)(3))

console.log(firstof(A))






/*
	Mathematical Operations.
*/

stdlib['*'] = function (num0) {
	return function (num1) {

		if (!is.number(num0)) {
			throw 'the first argument to * must be numeric: actual argument was ' +
			JSON.stringify(num0)
		}
		if (!is.number(num1)) {
			throw 'the second argument to * must be numeric: actual argument was ' +
			JSON.stringify(num1)
		}

		return num0 * num1
	}
}

stdlib['+'] = function (num0) {
	return function (num1) {

		if (!is.number(num0)) {
			throw 'the first argument to * must be numeric: actual argument was ' +
			JSON.stringify(num0)
		}
		if (!is.number(num1)) {
			throw 'the second argument to * must be numeric: actual argument was ' +
			JSON.stringify(num1)
		}

		return num0 + num1
	}
}

stdlib['-'] = function (num0) {
	return function (num1) {

		if (!is.number(num0)) {
			throw 'the first argument to * must be numeric: actual argument was ' +
			JSON.stringify(num0)
		}
		if (!is.number(num1)) {
			throw 'the second argument to * must be numeric: actual argument was ' +
			JSON.stringify(num1)
		}

		return num0 - num1
	}
}

stdlib['/'] = function (num0) {
	return function (num1) {

		if (!is.number(num0)) {
			throw 'the first argument to * must be numeric: actual argument was ' +
			JSON.stringify(num0)
		}
		if (!is.number(num1)) {
			throw 'the second argument to * must be numeric: actual argument was ' +
			JSON.stringify(num1)
		}

		return num0 / num1
	}
}




module.exports = stdlib
