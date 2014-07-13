#!/usr/bin/env node

const is         = require('is')
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






const stdlib     = require('../lib/lisb-stdlib')
const E          = require('../lib/lisb-eval').lisbEval

const message    = console.log

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'
const list   = 'list'




const isLisbPrimitive = function (val) {
	return is.array(val) ||
		is.number(val) || is.string(val) ||
		is.boolean(val)
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






// :is?

over_('val')

.describe("test that :is? checks equality.")
.holdsWhen_(
	isLisbPrimitive,
	function (val) {
		return E([':is?', L(val), L(val)])
	},
	function (val) {
		return !E([':not?', L(val), L(val)])
	}
)

.run()














// c

over_('val', 'coll')

.describe("test that :in? works for empty lists")
.holdsWhen_(
	function (val, coll) {
		return isLisbPrimitive(val) && isLisbPrimitive(coll) &&
			is.array(coll) && coll.length === 0
	},
	function (val, coll) {
		return !E([':in?', L(val), L(coll)])
	},
	function (val, coll) {
		return E([':not-in?', L(val), L(coll)])
	}
)

.describe("test that :in? works for non-empty lists")
.holdsWhen_(
	function (val, coll) {
		return isLisbPrimitive(val) && isLisbPrimitive(coll) &&
			is.array(coll)
	},
	function (val, coll) {
		var coll = L( coll.concat([val]) )
		return E([':in?', L(val), coll])
	},
	function (val, coll) {
		var coll = L( coll.concat([val]) )
		return !E([':not-in?', L(val), coll])
	}
)

.run()

// :unique-of

over_('coll')

.describe("unique-of works for empty lists")
.holdsWhen_(
	function (coll) {
		return isLisbPrimitive(coll) && is.array(coll) &&
			coll.length === 0
	},
	function (coll) {
		return E(
			[':is?',
				[ ':unique-of', L(coll) ],
				[list]] )
	}
)

.run()

// :subset?

over_('coll')

.describe("a set is a subset of itself")
.holdsWhen_(
	function (coll) {
		return isLisbPrimitive(coll) && is.array(coll)
	},
	function (coll) {
		return E([':subset?', L(coll), L(coll)])
	}
)

.run()


// :truth

over_('val')

.describe("truth always returns true")
.holdsWhen_(
	isLisbPrimitive,
	function (val) {
		return E([':truth', L(val)])
	},
	function (val) {
		return !E([':falsity', L(val)])
	}
)

.run()

// :identity

over_('val')

.describe("identity returns its functions")
.holdsWhen_(
	isLisbPrimitive,
	function (val) {
		return E([':truth', L(val)])
	},
	function (val) {
		return E([':is?',
			[':identity', L(val)], L(val)
		])
	}
)

// :capture

over_('val0', 'val1')

.describe("capture catches the correct value")
.holdsWhen_(

	function (val0, val1) {
		return E([
			':is?',
			[':capture', L(val0), L(val1)],
			L(val0)
		])
	}
)

.run()

// :at

over_('coll')

.describe('positional selectors work')
.holdsWhen_(
	function (coll) {
		return isLisbPrimitive(coll) && is.array(coll) && coll.length > 0
	},
	function (coll) {
		return E([
			':is?', [':at', 0, L(coll)], [':first-of', L(coll)]
		])
	}
)

.run()

// :nan?

over_('val')

.describe('is nan tests nan')
.holdsWhen_(
	function (val) {
		return val !== val
	},
	function (val) {
		return E([':nan?', L(val)])
	},
	function (val) {
		return !E([':not-nan?', L(val)])
	}
)

.run()

// :true?

over_('val')

.describe('is true tests true')
.holdsWhen_(
	function (val) {
		return val === true
	},
	function (val) {
		return E([':true?', L(val)])
	},
	function (val) {
		return !E([':not-true?', L(val)])
	}
)

.run()

// :false?

over_('val')

.describe('is false tests false')
.holdsWhen_(
	function (val) {
		return val === false
	},
	function (val) {
		return E([':false?', L(val)])
	},
	function (val) {
		return !E([':not-false?', L(val)])
	}
)

.run()

// :empty?

over_('val')

.describe('is empty tests empty')
.holdsWhen_(
	function (val) {
		return is.array(val) && val.length == 0
	},
	function (val) {
		return E([':empty?', L(val)])
	},
	function (val) {
		return !E([':not-empty?', L(val)])
	}
)

.run()

// :all-of

over_('coll')

.describe("all-of works for empty and nonempty lists")
.holdsWhen_(
	function (coll) {
		return is.array(coll) && coll.length > 0
	},
	function (coll) {
		return E( [':all-of', ':truth', L(coll)] )
	},
	function (coll) {
		return !E( [':all-of', ':falsity', L(coll)] )
	}
)

.run()


// :any-of

over_('coll')

.describe("any-of works for empty and nonempty lists")
.holdsWhen_(
	function (coll) {
		return is.array(coll) && coll.length > 0
	},
	function (coll) {
		return E( [':any-of', ':truth', L(coll)] )
	},
	function (coll) {
		return !E( [':any-of', ':falsity', L(coll)] )
	}
)

.run()


// :none-of

over_('coll')

.describe("none-of works for empty and nonempty lists")
.holdsWhen_(
	function (coll) {
		return is.array(coll) && coll.length > 0
	},
	function (coll) {
		return !E( [':none-of', ':truth', L(coll)] )
	},
	function (coll) {
		return E( [':none-of', ':falsity', L(coll)] )
	}
)

.run()

// :map

over_('coll')

.describe('map identity works')
.holdsWhen_(
	function  (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E([
			':is?',
			[':map', ':identity', L(coll)],
			L(coll)
		])
	}
)

.run()

// :shuffle

over_('coll')

.describe('shuffle preserves length')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E( [':shuffle', L(coll)] ).length === L(coll).length
	}
)

.describe('shuffle returns a subset')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E( [
			':subset?',
			[':shuffle', L(coll)],
			L(coll)
		] )
	}
)

.run()

// :pick-of

over_('coll')

.describe('pick one returns an element of a collection')
.holdsWhen_(
	function (coll) {
		return is.array(coll) && coll.length > 0
	},
	function (coll) {

		return E([
			':in?',
			[':pick-one', L(coll)],
			L(coll) ])
	}
)

.describe('pick-one of empty list is error')
.failsWhen_(
	function (coll) {
		return is.array(coll) && coll.length === 0
	},
	function (coll) {
		return E( [':pick-one', L(coll)] )
	}
)

.run()

// :runif

over_('val')

.describe('math random returns 0...1')
.holdsWhen_(
	function (val) {
		return true
	},
	function (val) {
		const num = E([':runif', L(val)])
		return num >= 0 && num <= 1
	}
)

.run()

/// :poll

over_('coll')

.describe('poll with truth count length')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E([':poll', ':truth', L(coll)]) === coll.length
	}
)

.run()

// :join

over_('coll', 'val')

.describe('concatenating with empty list is identity')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E([
			':is?',
			[ ':join', L(coll), L([]) ],
			L(coll)
		])
	}
)

.run()



// :len-of

over_('coll')

.describe('len-of is length')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {
		return E( [':len-of', L(coll)] ) === coll.length
	}
)

.run()



// :which

over_('coll')

.describe('which of trues is equal length')
.holdsWhen_(
	function (coll) {
		return is.array(coll)
	},
	function (coll) {

		const indices = unlist( E([
			':where',
			[':map', ':truth', L(coll)]
		]) )

		return indices.length === coll.length
	},
	function (coll) {

		const indices = unlist( E([
			':where',
			[':map', ':falsity', L(coll)]
		]) )

		return indices.length === 0
	}
)

.run()
