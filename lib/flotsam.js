
const match = function (tcase, patterns) {

	for (var ith = 0; ith < patterns.length; ith++) {

		var allMatch = true
		var pattern  = patterns[ith][0]

		if (pattern.length !== tcase.length) {
			throw RangeError('pattern too short.')
		}

		var response = patterns[ith][1]

		for (var jth = 0; jth < tcase.length; jth++) {

			allMatch = allMatch && (pattern[jth] === undefined || tcase[jth] === pattern[jth])

		}

		if (allMatch) {
			return response
		}
	}

	throw "internal error: non-exhaustive pattern matching!"
}

module.exports = {
	match: match
}