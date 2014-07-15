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

	[let, ':as-valname', [fn, ':str', [
		/*
			as-valname takes a string and returns a quoted valname.
		*/
		quasiquote, [quote,
			[unquote, [':from-chars',
				[list, ':', ':str']]] ]] ]],


	[':clog',
		[':as-valname', 'moke']],


	[let, ':import', [fn, ':obj', [
		/*
		takes a list of lists of the form

		[list, ':valname', value]

		and creates an expression that, when evaled, binds

		several values.
		*/

		begin,

		[let, ':bind-one',
			[fn, ':entry', [quasiquote,
				// create a single let binding.

				[let,
					[unquote, [':as-valname',
						[':at', 0, ':entry'] ]],
					[unquote, [':at', 1, ':entry'] ]] ]] ],

		[':map', ':bind-one', ':obj'] ]] ],

	[':import', ':console'],

	[':log']

]) )

