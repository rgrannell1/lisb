
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










module.exports = {
	paramsOf : paramsOf,
	mapRest  : mapRest,
	lastOf   : lastOf,
	procOf   : procOf,
	firstOf  : firstOf,
	indicesOf: indicesOf,
	argsOf   : argsOf,
	restOf   : restOf
}
