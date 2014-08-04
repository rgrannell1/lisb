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

const nonLazy = function (func) {
	func.isMacro = false
	return func
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

stdlib[':is?'] = ( function () {

	var def = nonLazy(function (val0) {
		return nonLazy(function (val1) {
			return equal(val0, val1)
		})
	})

	def.docs = {
		title: "is?",
		description: "are two values equal?",
		type: "any -> any -> boolean"
	}

	return def

} )()

stdlib[':not?'] = ( function () {

	var def = nonLazy(function (val0) {
		return nonLazy(function (val1) {
			return !equal(val0, val1)
		})
	})

	def.docs = {
		title: "not?",
		description: "are two values unequal?",
		type: "any -> any -> boolean"
	}

	return def

} )()

stdlib[':in?'] = ( function () {

	var def = nonLazy(function (val) {
		return function (coll) {

			if (coll.length === 0) {
				return false
			} else {
				return coll.reduce(function (isMember, elem) {
					return isMember || equal(val, elem)
				}, false)
			}

		}
	})

	def.docs = {
		title: "in?",
		description: "is a value in a collection?",
		type: "any -> [any] -> logical"
	}

	return def

} )()

stdlib[':not-in?'] = function (val) {

	var def = nonLazy(function (coll) {
		return !stdlib[':in?'](val)(coll)
	})

	def.docs = {
		title: "not-in?",
		description: "is a value not in a collection?",
		type: "any -> [any] -> logical"
	}

	return def

}

stdlib[':unique-of'] = ( function () {

	var def = nonLazy(function (coll) {

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

	})

	def.docs = {
		title: "unique-of",
		description: "remove all duplicates from a collection",
		type: "[any] -> [any]"
	}

	return def

} )()

/*
	Subset Functions.
*/

stdlib[':subset?'] = ( function () {

	var def = nonLazy(function (coll0) {
		return nonLazy(function (coll1) {

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

		})
	})

	def.docs = {
		title: "subset?",
		description: "is a collection a subset of another?",
		type: "[any] -> [any] -> logical"
	}

	return def

} )()

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

stdlib[':clog'] = ( function () {

	var def = function (val) {
		console.log(val)
		return val
	}

	def.docs = {
		title: "clog",
		description: "",
		type: ""
	}

	return def

} )()



stdlib[':require'] = ( function () {

	var def = nonLazy(function (str) {
		return require(str)
	})

	def.docs = {
		title: 'require',
		description: "",
		type: ""
	}

	return def

} )()


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

stdlib['+'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 + num1
		})
	})

	def.docs = {
		title: '+',
		description: "",
		title: ""
	}

	return def

} )()

stdlib['-'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 - num1
		})
	})

	def.docs = {
		title: '-',
		description: "",
		title: ""
	}

	return def

} )()

stdlib['/'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 / num1
		})
	})

	def.docs = {
		title: '/',
		description: "",
		title: ""
	}

	return def

} )()

stdlib['%'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 % num1
		})
	})

	def.docs = {
		title: '%',
		description: "",
		type: ""
	}

	return def

} )()

stdlib['&'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 && num1
		})
	})

	def.docs = {
		title: '&',
		description: '',
		type: ''
	}

	return def

} )()

stdlib['|'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 || num1
		})
	})

	def.docs = {
		title: '|',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {

			var out = []
			for (var ith = num0; ith <= num1; ith++) {
				out.push(ith)
			}

			return out

		})
	})

	def.docs = {
		title: ':',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':add']      = stdlib['+']
stdlib[':subtract'] = stdlib['-']

stdlib[':multiply'] = stdlib['*']
stdlib[':divide']   = stdlib['/']
stdlib[':mod']      = stdlib['%']

stdlib[':and']      = stdlib['&']
stdlib[':or']       = stdlib['|']

stdlib[':at'] = ( function () {

	var def = nonLazy(function (num) {
		return nonLazy(function (coll) {
			return unlist(coll)[num]
		})
	})

	def.docs = {
		title: 'at',
		description: '',
		type: ''
	}

	return def

} )()

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

stdlib[':none-of'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {
			return unlist(coll).reduce(function (any, current) {
				return any && !pred(current)
			}, true)
		})
	})

	def.docs = {
		title: "none-of",
		description: "are none of the elements in a collection true for a predicate?",
		type: "(any -> logical) -> [any] -> logical"
	}

	return def

} )()

stdlib['~'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (val) {
			return !fn(val)
		})
	})

	def.docs = {
		title: "~",
		description: "negate a logical function.",
		type: "(any -> boolean) -> (any -> boolean)"
	}

	return def

} )()

stdlib[':map'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (coll) {
			return list(unlist(coll).map(fn))
		})
	})

	def.docs = {
		title: "map",
		description: "apply a function to each element of a collection.",
		type: "(any -> any) -> [any] -> [any]"
	}

	return def

} )()

stdlib[':select'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			return list( coll.filter(function (elem) {
				return pred(elem)
			}) )

		})
	})

	def.docs = {
		title: "select",
		description: "include all elements from a collection matching a predicate.",
		type: "(any -> logical) -> [any] -> [any]"
	}

	return def

} )()

stdlib[':reject'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			return list( coll.filter(function (elem) {
				return !pred(elem)
			}) )

		})
	})

	def.docs = {
		title: "reject",
		description: "exclude all elements from a collection matching a predicate.",
		type: "(any -> logical) -> [any] -> [any]"
	}

	return def

} )()

stdlib[':poll'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			return unlist(coll).reduce(function (count, current) {
				return pred(current)? count + 1: count
			}, 0)

		})
	})

	def.docs = {
		title: "poll",
		description: "count the number of times a function returns true when mapped over a collection",
		type: "(any -> boolean) -> [any] -> number"
	}

	return def

} )()

stdlib[':flat-map'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (coll) {

			return list( unlist(coll).reduce(function (acc, current) {
				return stdlib[':join'](acc)((current))
			}) )

		})
	})

	def.docs = {
		title: "flat-map",
		description: "concatenate the results of applying a function to each element of a collection.",
		type: "(any -> any) -> [any] -> [any]"
	}

	return def

} )()




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

	var def = nonLazy(function (coll) {

		coll = unlist(coll)

		var remaining = coll.length

		while (remaining) {

			var index = Math.floor(Math.random() * remaining)
			remaining--

			coll = swap(coll, remaining, index)
		}

		return list(coll)
	})

	def.docs = {
		title: "shuffle",
		description: "shuffle the elements of a collection.",
		type: "[any] -> [any]"
	}

	return def

} )()

stdlib[':pick-one'] = ( function () {

	var def = nonLazy(function (coll) {

		coll = unlist(coll)

		if (coll.length === 0) {
			throw 'pick-one error'
		} else {
			return coll[Math.floor(Math.random() * coll.length)]
		}

	})

	def.docs = {
		title: "pick-one",
		description: "",
		type: "[any] -> any"
	}

	return def

})()

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

stdlib[':parse-int'] = ( function () {

	var def = nonLazy(function (str) {
		return parseInt(str)
	})

	def.docs = {
		title: "parse-int",
		description: "",
		title: "string -> number"
	}

	return def

} )()

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

stdlib[':append'] = ( function () {

	var def = nonLazy(function (val) {
		return nonLazy(function (coll) {
			return stdlib[':join'](coll)([val])
		})
	})

	def.docs = {
		title: 'append',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':prepend'] = ( function () {

	var def = nonLazy(function (val) {
		return nonLazy(function (coll) {
			return stdlib[':join']([val])(coll)
		})
	})

	def.docs = {
		title: 'prepend',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':len-of'] = ( function () {

	var def = nonLazy(function (coll) {
		return unlist(coll).length
	})

	def.docs = {
		title: 'len-of',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':where'] = ( function () {

	var def = nonLazy(function (bools) {

		var out = []

		for (var ith = 0; ith < bools.length; ith++) {
			if (unlist(bools)[ith] === true) {
				out.push(ith)
			}
		}

		return list(out)
	})

	def.docs = {
		title: 'where',
		description: '',
		type: ''
	}

	return def

} )()



stdlib[':reverse'] = ( function () {

	var def = nonLazy(function (coll) {
		return list(unlist(coll).reverse())
	})

	def.docs = {
		title: "reverse",
		description: "reverse a collection",
		type: "[any] -> [any]"
	}

	return def

} )()

stdlib[':repeat'] = ( function () {

	var def = nonLazy(function (num) {
		return nonLazy(function (coll) {

			var out = []

			for (var ith = 0; ith < num; ith++) {
				out = out.concat(unlist(coll))
			}

			return list(out)

		})
	})

	def.docs = {
		title: "repeat",
		description: "repeatedly join a collection end to end.",
		type: "number -> [any] -> [any]"
	}

	return def

} )()

stdlib[':indices-of'] = ( function () {

	var def = nonLazy(function (coll) {
		return list(unlist(coll).reduce(function (acc, current) {
			return stdlib[':join'](acc)([acc.length])
		}, []))
	})

	def.docs = {
		title: "indices-of",
		description: "get the indices of a collection.",
		type: "[any] -> [number]"
	}

	return def

} )()

stdlib[':rest-of'] = ( function () {

	var def = nonLazy(function (coll) {
		return list(unlist(coll).slice(1))
	})

	def.docs = {
		title: 'rest-of',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':unzip-indices'] = ( function () {

	var def = nonLazy(function (coll) {

		var out = []
		coll    = unlist(coll)

		for (var ith = 0; ith < coll.length; ith++) {
			out[ith] = list( [ith, coll[ith]] )
		}

		return list(out)

	})

	def.docs = {
		title: 'unzip-indices',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':drop'] = ( function () {

	var def = nonLazy(function (num) {
		return nonLazy(function (coll) {

			coll = unlist(coll)
			return list(coll.splice(num))

		})
	})

	def.docs = {
		title: 'drop',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':take'] = ( function () {

	var def = nonLazy(function (num) {
		return nonLazy(function (coll) {

			coll = unlist(coll)
			return list(coll.splice(0, num))

		})
	})

	def.docs = {
		title: 'take',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':slice'] = ( function () {

	var def = nonLazy(function (nums) {
		return nonLazy(function (coll) {
			return list( unlist(nums).map(function (num) {
				return unlist(coll)[num]
			}) )
		})
	})

	def.docs = {
		title: "slice",
		description: "",
		type: "[number] -> [any] -> [any]"
	}

	return def

} )()

stdlib[':keys-of'] = ( function () {

	var def = nonLazy(function (colls) {
		return stdlib[':map'](function (row) {
			return row[1]
		})(colls)
	})

	def.docs = {
		title: '-of',
		description: "",
		type: ""
	}

	return def

} )()

stdlib[':values-of'] = ( function () {

	var def = nonLazy(function (colls) {
		return stdlib[':map'](function (row) {
			return row[2]
		})(colls)
	})

	def.docs = {
		title: '-of',
		description: "",
		type: ""
	}

	return def

} )()

stdlib['@'] = ( function () {

	var def = nonLazy(function (val) {

		return nonLazy(function (colls) {

			const matches = stdlib[':select'](
				function (row) {
					return stdlib[':is?'](val)(row[1])
				}
			)(colls)

			return matches[1][2]

		})

	})

	def.docs = {
		title: '@',
		description: 'select ',
		type: 'any -> [[any]] -> any'
	}

	return def

} )()

stdlib[':implode'] = ( function () {

	var def = nonLazy(function (str) {
		return nonLazy(function (strs) {
			return list(unlist(strs).join(str))
		})
	})

	def.docs = {
		title: "implode",
		description: "",
		title: ""
	}

	return def

} )()

// stdlib[':chop']
// stdlib[':chunk']
// stdlib[':compose']

stdlib[':drop-while'] = ( function () {

	var def = nonLazy(function (pred) {
		nonLazy(function (coll) {

			for (var ith = 0; ith < unlist(coll).length; ith++) {
				if ( !pred(unlist(coll)[ith]) ) {
					return stdlib[':drop'](ith)(coll)
				}
			}

			return stdlib[':take'](Infinity)(coll)

		})
	})

	def.docs = {
		title: "drop-while",
		description: "",
		type: ""
	}

	return def

} )()

// stdlib[':group-by']
// stdlib[':sort-by']

stdlib[':take-while'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			for (var ith = 0; ith < unlist(coll).length; ith++) {
				if ( !pred(unlist(coll)[ith]) ) {
					return stdlib[':take'](ith)(coll)
				}
			}

			return stdlib[':take'](Infinity)(coll)

		})
	})

	def.docs = {
		title: "take-while",
		description: "",
		type: "(any -> logical) -> [any] -> [any]"
	}

	return def

} )()

stdlib[':zip'] = ( function () {

	var def = nonLazy(function (coll0) {
		return nonLazy(function (coll1) {

			var out = []

			for (var ith = 0; ith < unlist(coll0); ith++) {
				out[ith] = list(unlist(coll0)[ith], unlist(coll1)[ith])
			}

			return list(out)

		})
	})

	def.docs = {
		title: "zip",
		description: "",
		type: "[any] -> [any] -> [[any]]"
	}

	return def

} )()

for (key in stdlib) {
	if (!stdlib.hasOwnProperty(key)) {
		continue
	}
	stdlib[key].isMacro = false
}









module.exports = stdlib
