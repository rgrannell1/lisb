
lisbEval = require('../lib/lisb-parse').lisbEval

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'

const prog = [
	begin,
	[ cond, true,
		[ begin,
			[let, ':x', 10],
			[let, ':y', 12],
			['*', ':x', [
				'+', ':y', ':y']] ],
		[':I', 10]
	]
]

const result = lisbEval(prog)

console.log(result)
