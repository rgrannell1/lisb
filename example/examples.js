
lisbEval = require('../lib/lisb-eval').lisbEval

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'
const list   = 'list'




lisbEval([
	[let,
		[':x', ':y', ':z'],
		[list, 1, 2, 3]]
])
