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
const unquote      = 'unquote'
const quasiquote   = 'quasiquote'






console.log( lEval([
	begin,

	[let, ':console',
		require('./lisb-console')],

	[let, ':import', [fn, ':obj', [
		// takes a list of lists of the form
		//
		// [list, ':valname', value]
		//
		// and creates an expression that, when evaled, binds
		// several values.

		begin,

		[let, ':bind-one',
			[fn, ':entry', [quasiquote,
				// create a single let binding.

				[let,
					[unquote, [':at', 0, ':entry'] ],
					[unquote, [':at', 1, ':entry'] ]] ]] ],

		[':map', ':bind-one', ':obj'] ]] ],




]) )

