
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

unlist = function (EXPR) {

	return EXPR.length === 0 || EXPR[0] !== 'list'?
		EXPR.slice(1):
		EXPR

}

list = function (coll) {

	return coll.length === 0 || coll[0] !== 'list'?
		'list'.concat(coll):
		coll

}





always_collection = function (coll) {
	if (!is.array(coll)) {

		const message = "Argument must be a collection."

		throw message
	}
}










stdlib[':all-of'] = function (pred) {
	return function (coll) {
		return coll.reduce(function (any, current) {
			return any && current
		}, true)
	}
}

stdlib[':any-of'] = function (pred) {
	return function (coll) {
		return coll.reduce(function (any, current) {
			return any || current
		}, false)
	}
}

stdlib[':append'] = function (val) {
	return function (coll) {
		return coll.concat([val])
	}
}

stdlib[':arityof'] = function (fn) {
	return fn.length
}

stdlib[':at'] = function (num) {
	return function (coll) {
		return coll[num]
	}
}

stdlib[':capture'] = function (val) {
	return function () {
		return val
	}
}

stdlib[':chop'] = function () {

}

stdlib[':chunk'] = function () {

}

stdlib[':compose'] = function () {

}

stdlib[':cycle'] = function (num) {
	return function (coll) {

	}
}

stdlib[':drop'] = function (num) {
	return function (coll) {
		return coll.slice(num)
	}
}

stdlib[':drop-while'] = function (pred) {
	return function (coll) {

		for (var ith = 0; ith < unlist(coll).length; ith++) {
			if ( !pred(unlist(coll)[ith]) ) {
				return stdlib[':drop'](ith)(coll)
			}
		}

		return stdlib[':take'](Infinity)(coll)
	}
}

stdlib[':explode'] = function (rexp) {
	return function (str) {
		return list(str.split(rexp))
	}
}

stdlib[':falsity'] = function () {
	return false
}

stdlib[':first-as'] = function () {
	return function (coll) {
		var out = unlist(coll)
		out[0] = val
		return list(out)
	}
}

stdlib[':first-of'] = stdlib[':at'](0)

stdlib[':flat-map'] = function (fn) {
	return function (coll) {
		return list( unlist(coll).reduce(function (acc, current) {
			return acc.concat(fn(current))
		}) )
	}
}
stdlib[':flatten'] = function (num) {

}

stdlib[':fourth-as'] = function () {
	return function (coll) {
		var out = unlist(coll)
		out[3] = val
		return list(out)
	}
}

stdlib[':fourth-of'] = stdlib[':at'](3)

stdlib[':from-chars'] = function (strs) {
	return unlist(strs).join('')
}

stdlib[':from-lines'] = function (strs) {
	return unlist(strs).join('\n')
}

stdlib[':from-words'] = function (strs) {
	return unlist(strs).join(' ')
}

stdlib[':group-by'] = function () {

}

stdlib[':identity'] = function (val) {
	return val
}

stdlib[':implode'] = function (str) {
	return function (strs) {
		return list(unlist(strs).join(str))
	}
}

stdlib[':indices-of'] = function (coll) {
	return list(unlist(coll).reduce(function (acc, current) {
		return acc.concat([acc.length + 1])
	}, []))
}

stdlib[':init-of'] = function (coll) {
	return unlist(coll).slice(0, unlist(coll).length - 2)
}

stdlib[':is'] = function (val0) {
	return function (val1) {

	}
}

stdlib[':empty?'] = function (coll) {
	return coll.length === 0
}

stdlib[':fold'] = function (fn) {
	return function (val) {
		return function (coll) {
			return coll.slice(1).reduce(fn, val)
		}
	}
}

stdlib[':false?'] = function (val) {
	return val === false
}

stdlib[':keys-of'] = function (colls) {
	return unlist(colls).map(function (coll) {
		stdlib[':at'](0)
	})
}

stdlib[':match?'] = function () {

}

stdlib[':member?'] = function () {

}

stdlib[':nan?'] = function (val) {
	return Object.prototype.toString.call(val) === '[object Number]' && val !== val
}

stdlib[':true?'] = function (val) {
	return val === true
}

stdlib[':join'] = function (coll0) {
	return function (coll1) {
		return list( unlist(coll0).concat(unlist(coll1)) )
	}
}

stdlib[':last-as'] = function (val) {
	return function (coll) {
		var out = unlist(coll)
		out[out.length - 1] = val
		return list(out)
	}
}

stdlib[':last-of'] = function (coll) {
	return unlist(coll)[unlist(coll).length - 1]
}

stdlib[':len-of'] = function (coll) {
	return unlist(coll).length
}

stdlib[':locate'] = function (pred) {
	return function (coll) {
		return stdlib[':which'](unlist(coll).map(pred))
	}
}

stdlib[':map'] = function (fn) {
	return function (coll) {
		return list(unlist(coll).map(fn))
	}
}

stdlib[':max-by'] = function () {

}

stdlib[':min-by'] = function () {

}

stdlib[':none-of'] = function (pred) {
	return function (coll) {
		return unlist(coll).reduce(function (any, current) {
			return any && !pred(current)
		}, true)
	}
}

stdlib[':not'] = function (val0) {
	return function (val1) {

	}
}

stdlib[':not-empty?'] = function (coll) {
	return unlist(coll).length !== 0
}

stdlib[':not-false?'] = function (val) {
	return val !== false
}

stdlib[':not-match?'] = function () {

}

stdlib[':not-member?'] = function () {

}

stdlib[':not-nan?'] = function (val) {
	return val === val
}

stdlib[':not-true?'] = function (val) {
	return val !== true
}

stdlib[':one-of'] = function (coll) {
	const which = Math.floor(Math.random() * unlist(coll).length)
	return coll[which]
}

stdlib[':poll'] = function (pred) {
	return function (coll) {
		return unlist(coll).reduce(function (count, current) {
			return pred(current)? count + 1: count
		})
	}
}

stdlib[':prepend'] = function (val) {
	return function (coll) {
		return list( [val].concat(unlist(coll)) )
	}
}
stdlib[':reduce'] = function () {
	return function (coll) {
		return coll.slice(1).reduce(fn)
	}
}

stdlib[':reject'] = function (pred) {
	return function (coll) {
		return list(fold(
			function (acc, current) {
				return pred(current)? acc: acc.concat([current])
			},
			[],
			unlist(coll)
		))
	}
}

stdlib[':repeat'] = function (num) {
	return function (val) {
		var out = []
		for (var ith = 0; ith < num; ith++) {
			out[ith] = val
		}
		return list(out)
	}
}

stdlib[':rest-of'] = function (coll) {
	return list(unlist(coll).slice(1))
}

stdlib[':reverse'] = function (coll) {
	return list(unlist(coll).reduce(
		function (acc, current) {
			return [current].concat(acc)
		}, []
	))
}

stdlib[':scan'] = function () {

}

stdlib[':second-as'] = function () {

}

stdlib[':second-of'] = stdlib[':at'](1)

stdlib[':select'] = function (pred) {
	return function (coll) {
		return list( stdlib[':fold'](function (acc, current) {
			return pred(current)? acc: acc.concat([current])
		}, [], unlist(coll)) )
	}
}

stdlib[':shuffle'] = function () {

}

stdlib[':slice'] = function (nums) {
	return function (coll) {
		return list( unlist(nums).map(function (num) {
			return unlist(coll)[num]
		}) )
	}
}

stdlib[':sort-by'] = function () {

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

stdlib[':take'] = function (num) {
	return function (coll) {
		return list(unlist(coll).splice(0, num))
	}
}

stdlib[':third-as'] = function (val) {
	return function (coll) {
		var out = unlist(coll)
		out[2] = val
		return list(out)
	}
}

stdlib[':third-of'] = stdlib[':at'](2)

stdlib[':to-chars'] = stdlib[':explode']('')

stdlib[':to-lines'] = stdlib[':explode']('\n+')

stdlib[':to-words'] = stdlib[':explode']('[ 	]+')

stdlib[':truth'] = function () {
	return true
}

stdlib[':unit'] = function (coll) {
	return list([])
}

stdlib[':unzip-indices'] = function (coll) {
	return list(unlist(coll).reduce(function (acc, current) {
		return acc.concat([ list([acc.length + 1, current]) ])
	}, []))
}

stdlib[':values-of'] = function (colls) {
	return list(unlist(colls).map(function (coll) {
		return stdlib[':at'](1)
	}))
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
stdlib[':zip'] = function (coll0) {
	return function (coll1) {
		var out = []

		for (var ith = 0; ith < unlist(coll0); ith++) {
			out[ith] = list(unlist(coll0)[ith], unlist(coll1)[ith])
		}

		return list(out)
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
		return num0 + num1
	}
}

stdlib['-'] = function (num0) {
	return function (num1) {
		return num0 - num1
	}
}

stdlib['/'] = function (num0) {
	return function (num1) {
		return num0 / num1
	}
}

stdlib['%'] = function (num0) {
	return function (num1) {
		return num0 % num1
	}
}

/*
	Logical Operators
*/

stdlib['&'] = function (num0) {
	return function (num1) {
		return num0 && num1
	}
}

stdlib['|'] = function (num0) {
	return function (num1) {
		return num0 || num1
	}
}

/*
	Logical Operators
*/

stdlib['='] = function (val0) {
	return function (val1) {
		return val0 === val1
	}
}

module.exports = stdlib
