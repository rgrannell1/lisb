
lisbEval = require('../lib/lisb-parse').lisbEval

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'


/*
trasform([
	begin,
	[ let, ':double',
		[λ, ':num' ['*', 2, ':num']] ],
	[':double', 10]
])
*/

const prog = [
	begin,
	[ cond, true, [
		begin,
		[let, ':x', 10],
		[let, ':y', 12],
		['*', ':x', [
			'+', ':y', ':y']] ]]
]

const result = lisbEval(prog)

console.log(result)
