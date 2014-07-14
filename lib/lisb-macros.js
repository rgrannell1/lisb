#!/usr/bin/env node

const lEval = require('./lisb-eval').lEval

const let          = 'let'
const cond         = 'cond'
const fn           = 'fn'
const mr           = 'mr'
const begin        = 'begin'
const list         = 'list'
const eval         = 'eval'
const quote        = 'quote'
const unquote      = 'quote'
const quasiquote   = 'quasiquote'






console.log( lEval([
	begin,

	[let, ':my-module', [list,

		[list, [quote, ':x0'], 100],
		[list, [quote, ':y0'], 101],
		[list, [quote, ':z0'], 102]

	]],

	[let, ':import', [fn, ':obj', [
		begin,

		[let, ':bind-one',
			[fn, ':entry', [quasiquote,

				[let,
					[unquote, [':at', 0, ':entry'] ],
					[unquote, [':at', 1, ':entry'] ]]

			]] ],

		[':map', ':bind-one', ':obj']

	]] ],


	[eval,
		[':import', ':my-module']],

	[':clog', ':x0']

]) )

