#!/usr/bin/env node

const lEval = require('./lisb-eval').lEval

const let      = 'let'
const cond     = 'cond'
const fn       = 'fn'
const mr       = 'mr'
const begin    = 'begin'
const list     = 'list'
const quote    = 'quote'
const unquote  = 'quote'
const bquote   = 'bquote'

console.log( lEval([
	begin,

	[let, ':my-module', [list,

		[list, [quote, ':x0'], 100],
		[list, [quote, ':y0'], 101],
		[list, [quote, ':z0'], 102]

	]],

	[let, ':import', [fn, ':obj', [

		[':clog', ':obj']

	]] ],


	[':clog', [':import', ':my-module']]

]) )

