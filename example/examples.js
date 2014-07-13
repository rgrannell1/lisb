
lEval = require('../lib/lisb-eval').lEval

const let        = 'let'
const cond       = 'cond'
const fn         = 'fn'
const begin      = 'begin'
const list       = 'list'
const quote      = 'quote'
const unquote    = 'unquote'
const quasiquote = 'quasiquote'
const eval       = 'eval'


console.log( lEval([
	begin,

	[let, ':as-prefix',
		['mr', ':x',
			[begin,
				[let, [list, ':e0', ':op', ':e1'], ':x'],

				[quasiquote,
					[
						[unquote, ':op'],
						[unquote, ':e0'],
						[unquote, ':e1'] ]]
			]] ],


	[let,
		':result', [eval,
			[':as-prefix', [list, 10, '+', 10]] ]],

	[':result']

]) )

