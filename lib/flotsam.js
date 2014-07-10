
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
