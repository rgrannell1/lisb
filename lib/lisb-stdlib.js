#!/usr/bin/env node

const is      = require('is')
const equal   = require('./flotsam').equal




const jCheck     = require('jCheck')

const over       = jCheck.over
const over_      = jCheck.over_

const describe   = jCheck.describe

const holdsWhen  = jCheck.holdsWhen
const holdsWhen_ = jCheck.holdsWhen_

const failsWhen  = jCheck.failsWhen
const failsWhen_ = jCheck.failsWhen_

const worksWhen  = jCheck.worksWhen
const worksWhen_ = jCheck.worksWhen_

const run        = jCheck.run






const E          = require('./lisb-eval').lEval

const message    = console.log

const let    = 'let'
const cond   = 'cond'
const fn      = 'fn'
const begin  = 'begin'





const isLisbPrimitive = function (val) {
	return is.array(val) ||
		is.number(val) || is.string(val) || is.boolean(val)
}

/*
	arrays are represented differently by Lisb
	than by JavaScript; this smoothly abstracts
	over the difference.
	.

*/

const L = function (val) {
	if (is.array(val)) {
		return ['list'].concat(val.map(L))
	} else {
		return val
	}
}




var stdlib = {}










const unlist = function (EXPR) {

	return !is.array(EXPR) || EXPR.length === 0 || EXPR[0] !== 'list'?
		EXPR:
		EXPR.slice(1)

}

const list = function (coll) {

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
		type: "any -> any -> boolean",

		examples: [
			[[':is', 10, 10], true]
		]
	}




	/*
	over_('val')

	.describe('is? is reflexive')
	.holdsWhen_(
		isLisbPrimitive,

		function (val) {
			return E( [':is?', L(val), L(val)] )
		}
	)

	.run()
	*/


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

stdlib[':truth'] = ( function () {

	var def = nonLazy(function (val) {
		return true
	})

	def.docs = {
		title: 'truth',
		description: 'a function that returns true.',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':falsity'] = ( function () {

	var def = nonLazy(function (val) {
		return false
	})

	def.docs = {
		title: 'falsity',
		description: 'a function that returns false.',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':identity'] = ( function () {

	var def = nonLazy(function (val) {
		return val
	})

	def.docs = {
		title: 'identity',
		description: 'return a value unchanged.',
		type: 'a -> a'
	}

	return def

} )()

stdlib[':capture'] = ( function () {

	var def = nonLazy(function (val0) {
		return nonLazy(function (val1) {
			return val0
		})
	})

	def.docs = {
		title: 'capture',
		description: 'create a function that returns a particular value.',
		title: 'a -> (b -> a)'
	}

	return def

} )()

stdlib[':clog'] = ( function () {

	var def = nonLazy(function (val) {
		console.log(val)
		return val
	})

	def.docs = {
		title: "clog",
		description: "print a string to the console.",
		type: "a -> a"
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

stdlib['*'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 * num1
		})
	})

	def.docs = {
		title: '*',
		description: "multiply two numbers.",
		title: "num -> num -> num"
	}

	return def

} )()

stdlib['+'] = ( function () {

	var def = nonLazy(function (num0) {
		return nonLazy(function (num1) {
			return num0 + num1
		})
	})

	def.docs = {
		title: '+',
		description: "add two numbers.",
		title: "num -> num -> num"
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
		description: "subtract two numbers.",
		title: "num -> num -> num"
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
		description: "divide two numbers.",
		title: "num -> num -> num"
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
		description: "get a number modulo a second.",
		type: "num -> num -> num"
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
		description: 'are two logical values true?',
		type: 'logical -> logical -> logical'
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
		description: 'is at least one of two logical values true?',
		type: 'logical -> logical -> logical'
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
		description: 'create a sequence of natural numbers.',
		type: 'number -> number -> number'
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
		description: 'select an element of a list by index.',
		type: 'number -> [any] -> any'
	}

	return def

} )()

stdlib[':first-of']  = stdlib[':at'](0)
stdlib[':second-of'] = stdlib[':at'](1)
stdlib[':third-of']  = stdlib[':at'](2)
stdlib[':fourth-of'] = stdlib[':at'](3)

stdlib[':last-of'] = ( function () {

	var def = nonLazy(function (coll) {
		coll = unlist(coll)
		return coll[coll.length - 1]
	})

	def.docs = {
		title: 'last-of',
		description: 'get the last value of a list',
		type: '[any] -> any'
	}

	return def

} )()

stdlib[':init-of'] = ( function () {

	var def = nonLazy(function (coll) {
		return unlist(coll).slice(0, unlist(coll).length - 2)
	})

	def.docs = {
		title: 'init-of',
		description: 'remove the last value of a list.',
		type: '[any] -> [any]'
	}

	return def

} )()

stdlib[':nan?'] = ( function () {

	var def = nonLazy(function (val) {
		return stdlib[':is?'](NaN)(val)
	})

	def.docs = {
		title: 'nan?',
		description: 'is a value nan?',
		type: 'any -> logical'
	}

	return def

})()

stdlib[':not-nan?'] = ( function () {

	var def = nonLazy(function (val) {
		return stdlib[':not?'](NaN)(val)
	})

	def.docs = {
		title: 'not-nan?',
		description: 'is a value non-nan?',
		type: 'any -> logical'
	}

	return def

})()

stdlib[':true?'] = ( function () {

	var def = function (val) {
		return stdlib[':is?'](val)(true)
	}

	def.docs = {
		title: 'true?',
		description: 'is a value true?',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':not-true?'] = ( function () {

	var def = nonLazy(function (val) {
		return stdlib[':nots?'](val)(true)
	})

	def.docs = {
		title: 'not-true?',
		description: 'is a value not true?',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':false?'] = ( function () {

	var def = nonLazy(function (val) {
		return stdlib[':is?'](val)(false)
	})

	def.docs = {
		title: 'false',
		description: 'is a value false?',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':not-false?'] = ( function () {

	var def = nonLazy(function (val) {
		return stdlib[':not?'](val)(false)
	})

	def.docs = {
		title: 'not-false?',
		description: 'is a value not false?',
		type: 'any -> logical'
	}

	return def

} )()

stdlib[':empty?'] = ( function () {

	var def = nonLazy(function (coll) {
		return unlist(coll).length === 0
	})

	def.docs = {
		title: 'empty?',
		description: 'is a list empty?',
		type: '[any] -> logical'
	}

	return def

} )()

stdlib[':not-empty?'] = ( function () {

	var def = nonLazy(function (coll) {
		return unlist(coll).length !== 0
	})

	def.docs = {
		title: 'not-empty?',
		description: 'is a collection non-empty?',
		type: '[any] -> logical'
	}

	return def

} )()

stdlib[':match?'] = ( function () {

	var def = nonLazy(function (rexp) {
		return nonLazy(function (str) {
			return str.match(rexp)
		})
	})

	def.docs = {
		title: 'match?',
		description: 'does a string match a regular expression?',
		type: 'string -> string -> logical'
	}

	return def

} )()

stdlib[':not-match?'] = ( function () {

	var def = nonLazy(function (rexp) {
		return nonLazy(function (str) {
			return !str.match(rexp)
		})
	})

	def.docs = {
		title: 'non-match?',
		description: 'does a string not match a regular expression?',
		type: 'string -> string -> logical'
	}

	return def

} )()

stdlib[':explode'] = ( function () {

	var def = nonLazy(function (rexp) {
		return nonLazy(function (str) {
			return list(str.split(rexp))
		})
	})

	def.docs = {
		title: 'explode',
		description: 'split a string at a regular expression match.',
		type: 'string -> string -> [string]'
	}

	return def

} )()

stdlib[':from-chars'] = ( function () {

	var def = nonLazy(function (strs) {
		return unlist(strs).join('')
	})

	def.docs = {
		title: 'from-chars',
		description: 'concatenate a list of strings.',
		type: '[string] -> string'
	}

	return def

} )()

stdlib[':from-lines'] = ( function () {

	var def = nonLazy(function (strs) {
		return unlist(strs).join('\n')
	})

	def.docs = {
		title: 'from-lines',
		description: 'concatenate a list of strings with newline characters.',
		type: '[string] -> string'
	}

	return def

} )()

stdlib[':from-words'] = ( function () {

	var def = nonLazy(function (strs) {
		return unlist(strs).join(' ')
	})

	def.docs = {
		title: 'from-words',
		description: 'concatenate a list of strings with a space delimiter.',
		type: '[string] -> string'
	}

	return def

} )()

stdlib[':to-chars'] = stdlib[':explode']('')
stdlib[':to-lines'] = stdlib[':explode']('\n+')
stdlib[':to-words'] = stdlib[':explode']('[ 	]+')

stdlib[':all-of'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			coll = unlist(coll)

			return coll.reduce(function (any, current) {
				return any && pred(current)
			}, true)
		})
	})

	def.docs = {
		title: 'all-of',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':any-of'] = ( function () {

	var def = nonLazy(function (pred) {
		return nonLazy(function (coll) {

			coll = unlist(coll)

			return coll.reduce(function (any, current) {
				return any || pred(current)
			}, false)
		})
	})

	def.docs = {
		title: 'any-of',
		description: '',
		type: ''
	}

	return def

} )()

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

stdlib[':fold'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (val) {
			return nonLazy(function (coll) {
				return unlist(coll).reduce(fn, val)
			})
		})
	})

	def.docs = {
		title: 'fold',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':reduce'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (coll) {
			return unlist(coll).reduce(fn)
		})
	})

	def.docs = {
		title: 'reduce',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':max-by'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (coll) {

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
		})
	})

	def.docs = {
		title: 'min-by',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':min-by'] = ( function () {

	var def = nonLazy(function (fn) {
		return nonLazy(function (coll) {

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
		})
	})

	def.docs = {
		title: 'min-by',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':locate'] = ( function () {

	var def = nonLazy(function (pred) {
		const outfn = function (coll) {
			return stdlib[':where'](unlist(coll).map(pred))
		}

		outfn.isMacro = false
		return outfn
	})

	def.docs = {
		title: 'locate',
		description: '',
		type: ''
	}

	return def

} )()

stdlib[':arity-of'] = ( function () {

	var def = nonLazy(function (fn) {
		return fn.length
	})

	def.docs = {
		title: 'arity-of',
		description: '',
		type: ''
	}

	return def

} )()

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
		description: "pick a random value from a collection.",
		type: "[any] -> any"
	}

	return def

})()

stdlib[':runif'] = ( function () {

	var def = nonLazy(function (val) {
		return Math.random()
	})

	def.docs = {
		title: 'runif',
		description: 'return a random uniform number in the range 0,..,1',
		type: 'any -> number'
	}

	return def

} )()

stdlib[':rnormal'] = ( function () {

	var def = nonLazy(function (val) {

		do {
			var x0 = Math.random() - 1
			var x1 = Math.random() - 1

			var radius = x0 * x0 + x1 * x1

		} while (radius >= 1 || radius === 0)

		return x0 * Math.sqrt(-2 * Math.log(radius) / radius)
	})

	def.docs = {
		title: 'rnormal',
		description: 'return a normally distributed number (mean 0, sd1 1)',
		type: 'any -> number'
	}

	return def

} )()





stdlib[':sqrt'] = ( function () {

	var def = nonLazy(function (num) {
		return Math.sqrt(num)
	})

	def.docs = {
		title: 'sqrt',
		description: 'get the square root of a number.',
		title: 'number -> number'
	}

	return def

} )()

stdlib[':parse-int'] = ( function () {

	var def = nonLazy(function (str) {
		return parseInt(str)
	})

	def.docs = {
		title: "parse-int",
		description: "parse a string as an integer.",
		title: "string -> number"
	}

	return def

} )()

stdlib[':parse-float'] = ( function () {

	var def = nonLazy(function (str) {
		return parseFloat(str)
	})

	def.docs = {
		title: 'parse-float',
		description: 'parse a string as a floating point number.',
		type: 'string -> number'
	}

	return def

} )()

stdlib[':join'] = ( function () {

	var def = nonLazy(function (coll0) {
		return nonLazy(function (coll1) {

			coll0 = unlist(coll0)
			coll1 = unlist(coll1)

			return list(coll0.concat(coll1))

		})
	})

	def.docs = {
		title: 'join',
		description: 'concatenate two collections.',
		type: '[any] -> [any] -> [any]'
	}

	return def

} )()

stdlib[':append'] = ( function () {

	var def = nonLazy(function (val) {
		return nonLazy(function (coll) {
			return stdlib[':join'](coll)([val])
		})
	})

	def.docs = {
		title: 'append',
		description: 'append a value to a collection.',
		type: 'any -> [any] -> [any]'
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
		description: 'prepend a value to a collection.',
		type: 'any -> [any] -> [any]'
	}

	return def

} )()

stdlib[':len-of'] = ( function () {

	var def = nonLazy(function (coll) {
		return unlist(coll).length
	})

	def.docs = {
		title: 'len-of',
		description: 'get the length of a collection.',
		type: '[any] -> number'
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
		description: 'get the indices for which a collection of logical values is true.',
		type: '[any] -> [number]'
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
		title: 'keys-of',
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
		title: 'values-of',
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
		description: "Concatenate a collection of strings into a single string using a delimiter.",
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
		description: "Take every element in a collection from the first time a predicate" +
		" is false or na until the end of the collection.",
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
		description: "Take every element in a collection from the start " +
		"until a predicate returns false.",
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
		description: "given two columns, return a list of two element rows.",
		type: "[any] -> [any] -> [[any]]"
	}

	return def

} )()





module.exports = stdlib
