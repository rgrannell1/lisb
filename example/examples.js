
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

const li = [
	begin,
	[let, ':a',
		[':rest-of', ['list', 1, 2, 3]] ],
	[':a']
]

const result = lisbEval(prog)
console.log(lisbEval(li))
console.log(result)
