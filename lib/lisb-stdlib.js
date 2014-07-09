
const is    = require('is')





var stdlib = {}












/*
	Side-Effects
*/

stdlib[':clog'] = function (val) {
	console.log(val)
	return val
}


/*
Kiwi Functions
*/

stdlib[':all-of'] = function () {

}
stdlib[':any-of'] = function () {

}
stdlib[':append'] = function () {

}
stdlib[':apply'] = function () {

}
stdlib[':arityof'] = function () {

}
stdlib[':at'] = function () {

}
stdlib[':at-col'] = function () {

}
stdlib[':capture'] = function () {

}
stdlib[':chop'] = function () {

}
stdlib[':chunk'] = function () {

}
stdlib[':compose'] = function () {

}
stdlib[':cycle'] = function () {

}
stdlib[':deepmap'] = function () {

}
stdlib[':drop'] = function () {

}
stdlib[':drop-while'] = function () {

}
stdlib[':explode'] = function () {

}
stdlib[':falsity'] = function () {

}
stdlib[':first-as'] = function () {

}
stdlib[':first-of'] = function () {

}
stdlib[':flat-map'] = function () {

}
stdlib[':flatten'] = function () {

}
stdlib[':fold'] = function () {

}
stdlib[':fourth-as'] = function () {

}
stdlib[':fourth-of'] = function () {

}
stdlib[':from-chars'] = function () {

}
stdlib[':from-lines'] = function () {

}
stdlib[':from-words'] = function () {

}
stdlib[':group-by'] = function () {

}
stdlib[':identity'] = function () {

}
stdlib[':implode'] = function () {

}
stdlib[':indices-of'] = function () {

}
stdlib[':init-of'] = function () {

}
stdlib[':irrelevance'] = function () {

}
stdlib[':is'] = function () {

}
stdlib[':empty?'] = function () {

}
stdlib[':false?'] = function () {

}
stdlib[':keys-of'] = function () {

}
stdlib[':match?'] = function () {

}
stdlib[':member?'] = function () {

}
stdlib[':nan?'] = function () {

}
stdlib[':true?'] = function () {

}
stdlib[':join'] = function () {

}
stdlib[':juxtapose'] = function () {

}
stdlib[':last-as'] = function () {

}
stdlib[':last-of'] = function () {

}
stdlib[':len-of'] = function () {

}
stdlib[':locate'] = function () {

}
stdlib[':map'] = function () {

}
stdlib[':max-by'] = function () {

}
stdlib[':mean-of'] = function () {

}
stdlib[':min-by'] = function () {

}
stdlib[':negate'] = function () {

}
stdlib[':none-of'] = function () {

}
stdlib[':not'] = function () {

}
stdlib[':not-empty?'] = function () {

}
stdlib[':not-false?'] = function () {

}
stdlib[':not-match?'] = function () {

}
stdlib[':not-member?'] = function () {

}
stdlib[':not-nan?'] = function () {

}
stdlib[':not-true?'] = function () {

}
stdlib[':one-of'] = function () {

}
stdlib[':poll'] = function () {

}
stdlib[':powerset-of'] = function () {

}
stdlib[':prepend'] = function () {

}
stdlib[':reduce'] = function () {

}
stdlib[':reject'] = function () {

}
stdlib[':repeat'] = function () {

}
stdlib[':rest-of'] = function () {

}
stdlib[':reverse'] = function () {

}
stdlib[':scan'] = function () {

}
stdlib[':second-as'] = function () {

}
stdlib[':second-of'] = function () {

}
stdlib[':select'] = function () {

}
stdlib[':spread'] = function () {

}
stdlib[':shuffle'] = function () {

}
stdlib[':slice'] = function () {

}
stdlib[':sort-by'] = function () {

}
stdlib[':take-while'] = function () {

}
stdlib[':take'] = function () {

}
stdlib[':third-as'] = function () {

}
stdlib[':third-of'] = function () {

}
stdlib[':to-chars'] = function () {

}
stdlib[':to-lines'] = function () {

}
stdlib[':to-words'] = function () {

}
stdlib[':truth'] = function () {

}
stdlib[':unit'] = function () {

}
stdlib[':unspread'] = function () {

}
stdlib[':unzip-indices'] = function () {

}
stdlib[':values-of'] = function () {

}
stdlib[':where'] = function () {

}
stdlib[':zip'] = function () {

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
