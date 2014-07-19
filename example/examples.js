
lEval = require('../lib/lisb-eval').lEval

const let        = 'let'
const cond       = 'cond'
const fn         = 'fn'
const mr         = 'mr'
const begin      = 'begin'
const list       = 'list'
const quote      = 'quote'
const unquote    = 'unquote'
const quasiquote = 'quasiquote'






const value = lEval([
	begin,

	[let, ':console',
		[':require', '../lib/lisb-console']],

	['eval',
		[':import', [list, 'info'], ':console']],

	['->',
		[list, 1, 2, 3, 4, 5],

		[':map',
			[fn, ':x', ['*', ':x', ':x']] ],
		[':map',
			[fn, ':x', ['+', ':x', ':x']] ]]





], {

	debug: false

})

console.log(value)