
lEval = require('../lib/lisb-eval').lEval

const let        = 'let'
const cond       = 'cond'
const fn         = 'fn'
const begin      = 'begin'
const list       = 'list'
const quote      = 'quote'
const unquote    = 'unquote'
const quasiquote = 'quasiquote'

console.log( lEval([
	begin,

	[let, ':as-prefix',
		['mr', ':x',
			[begin,
				[let, [':e0', ':op', ':e1'], ':x'],

				[quasiquote,
					[
						[unquote, ':op'],
						[unquote, ':e0'],
						[unquote, ':e1'] ]]
			]] ],


	[':as-prefix', [10, '+', 10]]


]) )

