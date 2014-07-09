
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
	Side-Effects
*/

stdlib[':clog'] = function (val) {
	console.log(val)
	return val
}


/*
	List operations
*/

stdlib[':first-of'] = function (coll) {
	return coll[1]
}

stdlib[':rest-of'] = function (coll) {
	return ['list'].concat(coll.splice(2))
}

stdlib[':fold'] = function (fn) {
	return function (val) {
		return function (coll) {
			return coll.reduce(fn, val)
		}
	}
}

stdlib[':map'] = function (fn) {
	return function (coll) {
		return coll.map(fn)
	}
}






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
