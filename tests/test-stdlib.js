#!/usr/bin/env node

const is         = require('is')
const jCheck     = require('jCheck')






const stdlib   = require('../lib/lisb-stdlib')
const E        = require('../lib/lisb-eval').E

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










over_('val')

.describe("test equality checking.")
.holdsWhen_(
	isLisbPrimitive,
	function (val) {
		return E([':is', val, val])
	}
)

.run()
