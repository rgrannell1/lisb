#!/usr/bin/env node

/*
	paramsOf :: function -> [string]

	Extract an array of function parametres from
	a function.
*/

const paramsOf = function (fn) {

	const params =
		fn
		.toString()
		.replace('function (', '')
		.match('^[^)]+')[0]
		.split(', ')

	return params
}

/*
	mapRest :: (a -> b) -> [a] -> [b]

	mapRest removes the first element from a collection,
	and maps a function over the resultant collection.
*/

const mapRest = function (fn, coll) {
	return coll.slice(1).map(fn)
}

/*
	lastOf: [a] -> a

	lastOf returns the last value of a collection.
*/

const lastOf = function (coll) {
	return coll[coll.length - 1]
}

/*
	firstOf :: [a] -> a

	firstOf returns the first value of a collection.
*/

const procOf = firstOf = function (coll) {
	return coll[0]
}

/*
	indicesOf :: [a] -> [number]

	indicesOf generates the indices of a collection.
*/

const indicesOf = function (coll) {
	return coll.reduce(function (acc, _) {
		return acc.concat([acc.length])
	}, [])
}

/*
	restOf :: [a] -> [a]

	restOf removes the first value from a collection.
*/

const argsOf = restOf = function (coll) {
	return coll.slice(1)
}

/*
	equal :: a x b -> boolean

	equal checks if two JS values are actually equal.
*/

const equal = function (val0, val1) {

	val0Type = Object.prototype.toString.call(val0).slice(8, -1)
	val1Type = Object.prototype.toString.call(val1).slice(8, -1)

	if (val0Type !== val1Type) {
		return false
	} else if (val0Type === 'Number') {
		return val0 === val1 || (val0 !== val0 && val1 !== val1)
	} else if (val0Type === 'String') {
		return val0 === val1
	} else if (val0Type === 'Function') {
		throw 'functions are incomparable right now'
	} else if (val0Type === 'Null') {
		return val0 === val1
	} else if (val0Type === 'Array') {

		const val0Len = val0.length
		const val1Len = val1.length

		if (val0Len !== val1Len) {
			return false
		}

		var allEqual = true

		for (var ith = 0; ith < val0Len; ith++) {
			allEqual = allEqual && equal(val0[ith], val1[ith])
		}

		return allEqual

	} else {
		throw 'incomparables'
	}
}






module.exports = {
	paramsOf : paramsOf,
	mapRest  : mapRest,
	lastOf   : lastOf,
	procOf   : procOf,
	firstOf  : firstOf,
	indicesOf: indicesOf,
	argsOf   : argsOf,
	restOf   : restOf,
	equal    : equal
}
