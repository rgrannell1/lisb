
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

	[let,
		':code', [
		quasiquote,
			[
				begin,
				[let, ':x', 0],
				[let, ':y', 1],
				[unquote,
					['+', 1, 2]]
			]] ],

	[':code']

]) )

