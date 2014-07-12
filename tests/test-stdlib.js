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






// :is

over_('val')

.describe("test that :is checks equality.")
.holdsWhen_(
	isLisbPrimitive,
	function (val) {
		return E([':is', L(val), L(val)])
	}
)

.run()

// :is-in

over_('val', 'coll')

.describe("")
.holdsWhen_(

)

.run()