#!/usr/bin/env node

const is      = require('is')
const equal   = require('./flotsam').equal




var stdlib = {}










unlist = function (EXPR) {

	return !is.array(EXPR) || EXPR.length === 0 || EXPR[0] !== 'list'?
		EXPR:
		EXPR.slice(1)

}

list = function (coll) {

	return coll.length === 0 || is.array(coll) && coll[0] !== 'list'?
		['list'].concat(coll):
		coll

}

objectify = function (obj) {

	if (is.number(obj) || is.string(obj) || is.function(obj) ||
		is.boolean(obj) || is.array(obj)) {

		return obj

	} else if (is.object(obj)) {

		var out = []

		for (key in obj) {
			if (!obj.hasOwnProperty(key)) {
				continue
			}

			out.push( objectify(obj[key]) )
		}

		return out

	} else {
		throw "Invalid type " + JSON.stringify(obj)
	}

}










/*
	Equality Operations.

*/

stdlib[':is?'] = function (val0) {

	const outfn = function (val1) {
		return equal(val0, val1)
	}

	outfn.isMacro = false
	return outfn
}


stdlib[':not?'] = function (val0) {

	const outfn = function (val1) {
		return !equal(val0, val1)
	}

	outfn.isMacro = false
	return outfn
}




/*
	Set Membership.
*/

stdlib[':in?'] = function (val) {

	const outfn = function (coll) {
		if (coll.length === 0) {
			return false
		} else {
			return coll.reduce(function (isMember, elem) {
				return isMember || equal(val, elem)
			}, false)

		}
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':not-in?'] = function (val) {

	const outfn = function (coll) {
		return !stdlib[':in?'](val)(coll)
	}

	outfn.isMacro = false
	return outfn
}

/*
	Unique / Duplicate Functions.
*/

stdlib[':unique-of'] = function (coll) {

	var set = []
	coll    = unlist(coll)

	// check each element.
	for (var ith = 0; ith < coll.length; ith++) {

		var matchFound = false

		for (var jth = 0; jth < set.length; jth++) {

			// if the element is in the set do nothing.
			if ( equal(coll[ith], set[jth]) ) {
				matchFound = true
			}

		}

		// otherwise push the element into the set.
		if (!matchFound) {
			set.push(coll[ith])
		}
	}

	return list(set)
}

/*
	Subset Functions.
*/

stdlib[':subset?'] = function (coll0) {

	const outfn = function (coll1) {

		if (coll0.length === 1) {
			return true
		} else if (coll1.length === 1) {
			return false
		} else {

			var allIn = true

			for (var ith = 0; ith < coll0.length; ith++) {
				allIn = allIn && stdlib[':in?'](coll0[ith])(coll1)
			}

			return allIn
		}
	}

	outfn.isMacro = false
	return outfn
}

/*
	Logical Constant Functions.

*/

stdlib[':truth'] = function (val) {
	return true
}

stdlib[':falsity'] = function (val) {
	return false
}

/*
	SKI functions
*/

stdlib[':identity'] = function (val) {
	return val
}

stdlib[':capture'] = function (val0) {

	const outfn = function (val1) {
		return val0
	}

	outfn.isMacro = false
	return outfn
}


/*
	Side-Effects
*/

stdlib[':clog'] = function (val) {
	console.log(val)
	return val
}

stdlib[':require'] = function (str) {
	return require(str)
}

/*
	Mathematical Operations.
*/

stdlib['*'] = function (num0) {
	const outfn = function (num1) {

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

	outfn.isMacro = false
	return outfn
}

stdlib['+'] = function (num0) {
	const outfn = function (num1) {
		return num0 + num1
	}

	outfn.isMacro = false
	return outfn
}

stdlib['-'] = function (num0) {
	const outfn = function (num1) {
		return num0 - num1
	}

	outfn.isMacro = false
	return outfn
}

stdlib['/'] = function (num0) {
	const outfn = function (num1) {
		return num0 / num1
	}

	outfn.isMacro = false
	return outfn
}

stdlib['%'] = function (num0) {
	const outfn = function (num1) {
		return num0 % num1
	}

	outfn.isMacro = false
	return outfn
}

/*
	Logical Operators
*/

stdlib['&'] = function (num0) {
	const outfn = function (num1) {
		return num0 && num1
	}

	outfn.isMacro = false
	return outfn
}

stdlib['|'] = function (num0) {
	const outfn = function (num1) {
		return num0 || num1
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':'] = function (num0) {
	const outfn = function (num1) {

		var out = []
		for (var ith = num0; ith <= num1; ith++) {
			out.push(ith)
		}

		return out
	}

	outfn.isMacro = false
	return outfn
}

/*
	Operator aliases
*/

stdlib[':add']      = stdlib['+']
stdlib[':subtract'] = stdlib['-']

stdlib[':multiply'] = stdlib['*']
stdlib[':divide']   = stdlib['/']
stdlib[':mod']      = stdlib['%']

stdlib[':and']      = stdlib['&']
stdlib[':or']       = stdlib['|']

/*
	Positional Indexing.
*/

stdlib[':at'] = function (num) {
	const outfn = function (coll) {
		return unlist(coll)[num]
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':first-of']  = stdlib[':at'](0)
stdlib[':second-of'] = stdlib[':at'](1)
stdlib[':third-of']  = stdlib[':at'](2)
stdlib[':fourth-of'] = stdlib[':at'](3)
stdlib[':last-of'] = function (coll) {
	coll = unlist(coll)
	return coll[coll.length - 1]
}
stdlib[':init-of'] = function (coll) {
	return unlist(coll).slice(0, unlist(coll).length - 2)
}



/*
	Value Testing.
*/

stdlib[':nan?'] = function (val) {
	return stdlib[':is?'](NaN)(val)
}

stdlib[':not-nan?'] = function (val) {
	return stdlib[':not?'](NaN)(val)
}




stdlib[':true?'] = function (val) {
	return stdlib[':is?'](val)(true)
}

stdlib[':not-true?'] = function (val) {
	return stdlib[':nots?'](val)(true)
}





stdlib[':false?'] = function (val) {
	return stdlib[':is?'](val)(false)
}

stdlib[':not-false?'] = function (val) {
	return stdlib[':not?'](val)(false)
}






stdlib[':empty?'] = function (coll) {
	return unlist(coll).length === 0
}

stdlib[':not-empty?'] = function (coll) {
	return unlist(coll).length !== 0
}





stdlib[':match?'] = function (rexp) {
	const outfn = function (str) {
		return str.match(rexp)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':not-match?'] = function (rexp) {
	const outfn = function (str) {
		return !str.match(rexp)
	}

	outfn.isMacro = false
	return outfn
}

/*
	String Manipulation.
*/

stdlib[':explode'] = function (rexp) {
	const outfn = function (str) {
		return list(str.split(rexp))
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':from-chars'] = function (strs) {
	return unlist(strs).join('')
}

stdlib[':from-lines'] = function (strs) {
	return unlist(strs).join('\n')
}

stdlib[':from-words'] = function (strs) {
	return unlist(strs).join(' ')
}

stdlib[':to-chars'] = stdlib[':explode']('')

stdlib[':to-lines'] = stdlib[':explode']('\n+')

stdlib[':to-words'] = stdlib[':explode']('[ 	]+')

/*
	Higher-Order-Functions
*/

stdlib[':all-of'] = function (pred) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return coll.reduce(function (any, current) {
			return any && pred(current)
		}, true)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':any-of'] = function (pred) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return coll.reduce(function (any, current) {
			return any || pred(current)
		}, false)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':none-of'] = function (pred) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return coll.reduce(function (any, current) {
			return any && !pred(current)
		}, true)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':map'] = function (fn) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list(coll.map(fn))
	}
	outfn.isMacro = false
	return outfn
}

stdlib[':select'] = function (pred) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list( coll.filter(function (elem) {
			return pred(elem)
		}) )
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':reject'] = function (pred) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list( coll.filter(function (elem) {
			return !pred(elem)
		}) )
	}

	outfn.isMacro = false
	return outfn
}


stdlib[':poll'] = function (pred) {
	const outfn = function (coll) {
		return unlist(coll).reduce(function (count, current) {
			return pred(current)? count + 1: count
		}, 0)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':flat-map'] = function (fn) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list( coll.reduce(function (acc, current) {
			return stdlib[':join'](acc)((current))
		}) )
	}

	outfn.isMacro = false
	return outfn
}

/*
	Fold Functions
*/

stdlib[':fold'] = function (fn) {
	const outfn0 = function (val) {
		const outfn1 = function (coll) {
			return unlist(coll).reduce(fn, val)
		}

		outfn1.isMacro = false
		return outfn1
	}

	outfn0.isMacro = false
	return outfn0
}

stdlib[':reduce'] = function (fn) {
	const outfn = function (coll) {
		return unlist(coll).reduce(fn)
	}

	outfn.isMacro = false
	return outfn
}

/*
	Min & MaxBy
*/

stdlib[':max-by'] = function (fn) {
	const outfn = function (coll) {

		coll = unlist(coll)

		if (coll.length === 0) {
			throw ':max-by: length'
		}

		var best = {
			val   : coll[0],
			index : 0
		}

		for (var ith = 1; ith < coll.length; ith++) {

			if (fn(coll[ith]) > fn(best.val)) {

				best.val   = coll[ith]
				best.index = ith
			}
		}

		return best.val
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':min-by'] = function (fn) {
	const outfn = function (coll) {

		coll = unlist(coll)

		if (coll.length === 0) {
			throw ':max-by: length'
		}

		var best = {
			val   : coll[0],
			index : 0
		}

		for (var ith = 1; ith < coll.length; ith++) {

			if (fn(coll[ith]) < fn(best.val)) {

				best.val   = coll[ith]
				best.index = ith
			}
		}

		return best.val
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':locate'] = function (pred) {
	const outfn = function (coll) {
		return stdlib[':where'](unlist(coll).map(pred))
	}

	outfn.isMacro = false
	return outfn
}

/*
	Higher-Order-Functions for Functions.
*/

stdlib[':arityof'] = function (fn) {
	return fn.length
}














/*
	Randomised Functions
*/

stdlib[':shuffle'] = ( function () {

	const swap = function (coll, ith, jth) {

		const tmp = coll[ith]

		coll[ith] = coll[jth]
		coll[jth] = tmp

		return coll
	}

	return function (coll) {

		coll = unlist(coll)

		var remaining = coll.length

		while (remaining) {

			var index = Math.floor(Math.random() * remaining)
			remaining--

			coll = swap(coll, remaining, index)
		}

		return list(coll)
	}

} )()

stdlib[':pick-one'] = function (coll) {

	coll = unlist(coll)

	if (coll.length === 0) {
		throw 'pick-one error'
	} else {
		return coll[Math.floor(Math.random() * coll.length)]
	}
}

stdlib[':runif'] = function (val) {
	return Math.random()
}

stdlib[':rnormal'] = function (val) {

	do {
		var x0 = Math.random() - 1
		var x1 = Math.random() - 1

		var radius = x0 * x0 + x1 * x1

	} while (radius >= 1 || radius === 0)

	return x0 * Math.sqrt(-2 * Math.log(radius) / radius)
}

/*
	Math Functions.

*/

stdlib[':sqrt'] = function (num) {
	return Math.sqrt(num)
}

stdlib[':parse-int'] = function (str) {
	return parseInt(str)
}

stdlib[':parse-float'] = function (str) {
	return parseFloat(str)
}

/*
	List Operations.

	Lisb does not represent list keys as seperate to the list values;
	a named list is just a list of tuples, with the first element of
	these tuples being a key.

	Any value can be a key, not just strings.
*/

stdlib[':join'] = function (coll0) {
	const outfn = function (coll1) {

		coll0 = unlist(coll0)
		coll1 = unlist(coll1)

		return list(coll0.concat(coll1))
	}

	outfn.isMacro = false
	return outfn
}
stdlib[':append'] = function (val) {
	const outfn = function (coll) {
		return stdlib[':join'](coll)([val])
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':prepend'] = function (val) {
	const outfn = function (coll) {
		return stdlib[':join']([val])(coll)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':len-of'] = function (coll) {
	return unlist(coll).length
}

stdlib[':where'] = function (bools) {

	var out = []

	for (var ith = 0; ith < bools.length; ith++) {
		if (unlist(bools)[ith] === true) {
			out.push(ith)
		}
	}

	return list(out)
}

stdlib[':reverse'] = function (coll) {
	coll = unlist(coll)
	return list(coll.reverse())
}

stdlib[':repeat'] = function (num) {
	const outfn = function (val) {

		var out = []

		for (var ith = 0; ith < num; ith++) {
			out[ith] = val
		}

		return list(out)
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':indices-of'] = function (coll) {
	const outfn = list(unlist(coll).reduce(function (acc, current) {
		return stdlib[':join'](acc)([acc.length])
	}, []))

	outfn.isMacro = false
	return outfn
}

stdlib[':rest-of'] = function (coll) {
	return list(unlist(coll).slice(1))
}

stdlib[':unzip-indices'] = function (coll) {

	var out = []
	coll    = unlist(coll)

	for (var ith = 0; ith < coll.length; ith++) {
		out[ith] = list( [ith, coll[ith]] )
	}

	return list(out)
}

stdlib[':drop'] = function (num) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list(coll.slice(num))
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':take'] = function (num) {
	const outfn = function (coll) {

		coll = unlist(coll)

		return list(coll.splice(0, num))
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':slice'] = function (nums) {
	const outfn = function (coll) {
		return list( unlist(nums).map(function (num) {
			return unlist(coll)[num]
		}) )
	}

	outfn.isMacro = false
	return outfn
}

stdlib[':keys-of'] = function (colls) {
	return stdlib[':map'](function (row) {
		return row[1]
	})(colls)
}

stdlib[':values-of'] = function (colls) {
	return stdlib[':map'](function (row) {
		return row[2]
	})(colls)
}

/*
	String Functions
*/

stdlib['@'] = function (val) {
	const outfn = function (colls) {

		const matches = stdlib[':select'](
			function (row) {
				return stdlib[':is?'](val)(row[1])
			}
		)(colls)

		return matches[1][2]
	}
	outfn.isMacro = false
	return outfn
}












stdlib[':implode'] = function (str) {
	const outfn = function (strs) {

		strs = unlist(strs)
		return list(strs.join(str))
	}

	outfn.isMacro = false
	return
}

stdlib[':chop'] = function (nums) {

}

stdlib[':chunk'] = function (nums) {

}

stdlib[':compose'] = function (fns) {

}

stdlib[':drop-while'] = function (pred) {
	const outfn = function (coll) {

		for (var ith = 0; ith < unlist(coll).length; ith++) {
			if ( !pred(unlist(coll)[ith]) ) {
				return stdlib[':drop'](ith)(coll)
			}
		}

		return stdlib[':take'](Infinity)(coll)
	}
	outfn.isMacro = false
	return outfn
}

stdlib[':group-by'] = function (fn) {
	const outfn = function (coll) {

	}
	outfn.isMacro = false
	return outfn
}




stdlib[':sort-by'] = function (fn) {
	const outfn = function (coll) {

	}
	outfn.isMacro = false
	return outfn
}

stdlib[':take-while'] = function (pred) {
	return function (coll) {

		for (var ith = 0; ith < unlist(coll).length; ith++) {
			if ( !pred(unlist(coll)[ith]) ) {
				return stdlib[':take'](ith)(coll)
			}
		}

		return stdlib[':take'](Infinity)(coll)
	}
}



stdlib[':zip'] = function (coll0) {
	return function (coll1) {

		var out = []

		for (var ith = 0; ith < unlist(coll0); ith++) {
			out[ith] = list(unlist(coll0)[ith], unlist(coll1)[ith])
		}

		return list(out)
	}
}





for (key in stdlib) {
	if (!stdlib.hasOwnProperty(key)) {
		continue
	}
	stdlib[key].isMacro = false
}









module.exports = stdlib
