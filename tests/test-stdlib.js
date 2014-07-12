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

// :at

over_('coll')

.describe('positional selectors work')
.holdsWhen_(
	function (coll) {
		return isLisbPrimitive(coll) && is.array(coll) && coll.length > 0
	},
	function (coll) {
		return E([
			':is?',
			[':at', 0, L(coll)],
			[':first-of', L(coll)]
		])
	}
)

.run()
