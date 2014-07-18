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
		quasiquote, [quote,
			[unquote, [':from-chars',
				[list, ':', ':str']]] ]] ]],

	[let, ':import', [fn, ':obj', [
		begin,

		[let, ':bind-one',
			[fn, ':entry', [quasiquote,
				// create a single let binding.

				[let,

					[unquote, [':as-valname',
						[':at', 0, ':entry'] ]],

					[unquote,
						[':at', 1, ':entry'] ]] ]] ],

		[':map', ':bind-one', ':obj'] ]] ],

	[':clog', 1],

	['eval',
		[':import', ':console']],

	[':clog', ':info']

]) )

