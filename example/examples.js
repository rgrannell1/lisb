
lEval = require('../lib/lisb-eval').lEval

const let     = 'let'
const cond    = 'cond'
const fn      = 'fn'
const begin   = 'begin'
const list    = 'list'
const quote   = 'quote'
const unquote = 'unquote'


console.log( lEval([
	begin,

	[let,
		':code', [
		quote,
			[
				begin,
				[let, ':x', 0],
				[let, ':y', 1]
				[unquote, ]

			]] ],

	[':code']

]) )

